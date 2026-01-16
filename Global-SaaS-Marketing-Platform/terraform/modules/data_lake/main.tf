################################################################################
# Data Lake Module - Main Configuration
# Global SaaS Marketing Platform
################################################################################

locals {
  common_tags = merge(var.tags, {
    Module = "data_lake"
  })
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

################################################################################
# S3 Data Lake Bucket
################################################################################

resource "aws_s3_bucket" "data_lake" {
  bucket = "${var.project_name}-${var.environment}-data-lake-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-data-lake"
  })
}

resource "aws_s3_bucket_versioning" "data_lake" {
  bucket = aws_s3_bucket.data_lake.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "data_lake" {
  bucket = aws_s3_bucket.data_lake.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = var.kms_key_arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "data_lake" {
  bucket                  = aws_s3_bucket.data_lake.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "data_lake" {
  bucket = aws_s3_bucket.data_lake.id

  rule {
    id     = "raw-data-lifecycle"
    status = "Enabled"

    filter {
      prefix = "raw/"
    }

    transition {
      days          = 30
      storage_class = "INTELLIGENT_TIERING"
    }

    transition {
      days          = 90
      storage_class = "GLACIER_IR"
    }
  }

  rule {
    id     = "processed-data-lifecycle"
    status = "Enabled"

    filter {
      prefix = "processed/"
    }

    transition {
      days          = 90
      storage_class = "INTELLIGENT_TIERING"
    }
  }

  rule {
    id     = "curated-data-lifecycle"
    status = "Enabled"

    filter {
      prefix = "curated/"
    }

    transition {
      days          = 180
      storage_class = "INTELLIGENT_TIERING"
    }
  }

  rule {
    id     = "athena-results-cleanup"
    status = "Enabled"

    filter {
      prefix = "athena-results/"
    }

    expiration {
      days = 30
    }
  }
}

resource "aws_s3_bucket_policy" "data_lake" {
  bucket = aws_s3_bucket.data_lake.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "DenyInsecureConnections"
        Effect = "Deny"
        Principal = "*"
        Action   = "s3:*"
        Resource = [
          aws_s3_bucket.data_lake.arn,
          "${aws_s3_bucket.data_lake.arn}/*"
        ]
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      }
    ]
  })
}

################################################################################
# Kinesis Data Streams
################################################################################

resource "aws_kinesis_stream" "main" {
  for_each = var.kinesis_streams

  name             = "${var.project_name}-${var.environment}-${each.key}"
  retention_period = each.value.retention_period

  stream_mode_details {
    stream_mode = each.value.stream_mode
  }

  shard_count = each.value.stream_mode == "PROVISIONED" ? each.value.shard_count : null

  encryption_type = "KMS"
  kms_key_id      = var.kms_key_arn

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-${each.key}"
  })
}

################################################################################
# Kinesis Firehose Delivery Streams
################################################################################

resource "aws_kinesis_firehose_delivery_stream" "main" {
  for_each = var.firehose_streams

  name        = "${var.project_name}-${var.environment}-${each.key}"
  destination = "extended_s3"

  kinesis_source_configuration {
    kinesis_stream_arn = aws_kinesis_stream.main[each.value.source_stream].arn
    role_arn           = aws_iam_role.firehose[each.key].arn
  }

  extended_s3_configuration {
    role_arn            = aws_iam_role.firehose[each.key].arn
    bucket_arn          = aws_s3_bucket.data_lake.arn
    prefix              = each.value.s3_prefix
    error_output_prefix = each.value.error_prefix
    buffering_size      = each.value.buffer_size
    buffering_interval  = each.value.buffer_interval
    compression_format  = each.value.compression_format

    kms_key_arn = var.kms_key_arn

    cloudwatch_logging_options {
      enabled         = true
      log_group_name  = aws_cloudwatch_log_group.firehose[each.key].name
      log_stream_name = "delivery"
    }

    dynamic "data_format_conversion_configuration" {
      for_each = each.value.enable_data_format_conversion ? [1] : []
      content {
        enabled = true

        input_format_configuration {
          deserializer {
            open_x_json_ser_de {}
          }
        }

        output_format_configuration {
          serializer {
            parquet_ser_de {
              compression = "SNAPPY"
            }
          }
        }

        schema_configuration {
          database_name = aws_glue_catalog_database.main.name
          table_name    = each.value.glue_table_name
          role_arn      = aws_iam_role.firehose[each.key].arn
        }
      }
    }

    dynamic "processing_configuration" {
      for_each = each.value.enable_processing ? [1] : []
      content {
        enabled = true

        processors {
          type = "Lambda"

          parameters {
            parameter_name  = "LambdaArn"
            parameter_value = each.value.lambda_processor_arn
          }

          parameters {
            parameter_name  = "BufferSizeInMBs"
            parameter_value = "1"
          }

          parameters {
            parameter_name  = "BufferIntervalInSeconds"
            parameter_value = "60"
          }
        }
      }
    }
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-${each.key}"
  })
}

resource "aws_cloudwatch_log_group" "firehose" {
  for_each = var.firehose_streams

  name              = "/aws/kinesisfirehose/${var.project_name}-${var.environment}-${each.key}"
  retention_in_days = var.log_retention_days
  kms_key_id        = var.kms_key_arn

  tags = local.common_tags
}

resource "aws_iam_role" "firehose" {
  for_each = var.firehose_streams

  name = "${var.project_name}-${var.environment}-firehose-${each.key}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "firehose.amazonaws.com"
      }
    }]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy" "firehose" {
  for_each = var.firehose_streams

  name = "${var.project_name}-${var.environment}-firehose-${each.key}-policy"
  role = aws_iam_role.firehose[each.key].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:AbortMultipartUpload",
          "s3:GetBucketLocation",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:ListBucketMultipartUploads",
          "s3:PutObject"
        ]
        Resource = [
          aws_s3_bucket.data_lake.arn,
          "${aws_s3_bucket.data_lake.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "kinesis:DescribeStream",
          "kinesis:GetShardIterator",
          "kinesis:GetRecords",
          "kinesis:ListShards"
        ]
        Resource = aws_kinesis_stream.main[each.value.source_stream].arn
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt",
          "kms:GenerateDataKey"
        ]
        Resource = var.kms_key_arn
      },
      {
        Effect = "Allow"
        Action = [
          "logs:PutLogEvents"
        ]
        Resource = "${aws_cloudwatch_log_group.firehose[each.key].arn}:*"
      },
      {
        Effect = "Allow"
        Action = [
          "glue:GetTable",
          "glue:GetTableVersion",
          "glue:GetTableVersions"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction",
          "lambda:GetFunctionConfiguration"
        ]
        Resource = "*"
      }
    ]
  })
}

################################################################################
# Glue Catalog Database
################################################################################

resource "aws_glue_catalog_database" "main" {
  name        = "${replace(var.project_name, "-", "_")}_${var.environment}"
  description = "Glue catalog database for ${var.project_name} ${var.environment}"

  tags = local.common_tags
}

resource "aws_glue_catalog_table" "main" {
  for_each = var.glue_tables

  database_name = aws_glue_catalog_database.main.name
  name          = each.key
  description   = each.value.description

  table_type = "EXTERNAL_TABLE"

  parameters = {
    "classification"         = each.value.classification
    "compressionType"        = each.value.compression_type
    "typeOfData"             = "file"
    "EXTERNAL"               = "TRUE"
    "parquet.compression"    = "SNAPPY"
    "projection.enabled"     = each.value.enable_partition_projection ? "true" : "false"
  }

  storage_descriptor {
    location      = "s3://${aws_s3_bucket.data_lake.id}/${each.value.s3_prefix}"
    input_format  = each.value.input_format
    output_format = each.value.output_format

    ser_de_info {
      serialization_library = each.value.serialization_library
      parameters            = each.value.ser_de_parameters
    }

    dynamic "columns" {
      for_each = each.value.columns
      content {
        name    = columns.value.name
        type    = columns.value.type
        comment = columns.value.comment
      }
    }
  }

  dynamic "partition_keys" {
    for_each = each.value.partition_keys
    content {
      name = partition_keys.value.name
      type = partition_keys.value.type
    }
  }
}

################################################################################
# Glue Crawlers
################################################################################

resource "aws_glue_crawler" "main" {
  for_each = var.glue_crawlers

  database_name = aws_glue_catalog_database.main.name
  name          = "${var.project_name}-${var.environment}-${each.key}"
  role          = aws_iam_role.glue_crawler.arn
  schedule      = each.value.schedule

  s3_target {
    path = "s3://${aws_s3_bucket.data_lake.id}/${each.value.s3_path}"
  }

  schema_change_policy {
    delete_behavior = "LOG"
    update_behavior = "UPDATE_IN_DATABASE"
  }

  configuration = jsonencode({
    Version = 1.0
    CrawlerOutput = {
      Partitions = {
        AddOrUpdateBehavior = "InheritFromTable"
      }
    }
  })

  tags = local.common_tags
}

resource "aws_iam_role" "glue_crawler" {
  name = "${var.project_name}-${var.environment}-glue-crawler"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "glue.amazonaws.com"
      }
    }]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "glue_crawler" {
  role       = aws_iam_role.glue_crawler.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole"
}

resource "aws_iam_role_policy" "glue_crawler_s3" {
  name = "${var.project_name}-${var.environment}-glue-crawler-s3"
  role = aws_iam_role.glue_crawler.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.data_lake.arn,
          "${aws_s3_bucket.data_lake.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt"
        ]
        Resource = var.kms_key_arn
      }
    ]
  })
}

################################################################################
# Athena Configuration
################################################################################

resource "aws_athena_workgroup" "main" {
  name        = "${var.project_name}-${var.environment}"
  description = "Athena workgroup for ${var.project_name} ${var.environment}"
  state       = "ENABLED"

  configuration {
    enforce_workgroup_configuration    = true
    publish_cloudwatch_metrics_enabled = true
    bytes_scanned_cutoff_per_query     = var.athena_bytes_scanned_cutoff

    result_configuration {
      output_location = "s3://${aws_s3_bucket.data_lake.id}/athena-results/"

      encryption_configuration {
        encryption_option = "SSE_KMS"
        kms_key_arn       = var.kms_key_arn
      }
    }

    engine_version {
      selected_engine_version = "Athena engine version 3"
    }
  }

  tags = local.common_tags
}

resource "aws_athena_named_query" "samples" {
  for_each = var.athena_named_queries

  name        = each.key
  workgroup   = aws_athena_workgroup.main.id
  database    = aws_glue_catalog_database.main.name
  description = each.value.description
  query       = each.value.query
}

################################################################################
# Lake Formation (Optional)
################################################################################

resource "aws_lakeformation_resource" "data_lake" {
  count = var.enable_lake_formation ? 1 : 0
  arn   = aws_s3_bucket.data_lake.arn
}

resource "aws_lakeformation_permissions" "database" {
  count     = var.enable_lake_formation ? 1 : 0
  principal = var.lake_formation_admin_arn

  permissions = ["ALL"]

  database {
    name = aws_glue_catalog_database.main.name
  }
}

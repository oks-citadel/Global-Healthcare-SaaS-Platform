################################################################################
# Email Module - Main Configuration
# Global SaaS Marketing Platform
################################################################################

locals {
  common_tags = merge(var.tags, {
    Module = "email"
  })
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

################################################################################
# SES Domain Identity
################################################################################

resource "aws_ses_domain_identity" "main" {
  domain = var.domain_name
}

resource "aws_ses_domain_dkim" "main" {
  domain = aws_ses_domain_identity.main.domain
}

resource "aws_ses_domain_mail_from" "main" {
  domain           = aws_ses_domain_identity.main.domain
  mail_from_domain = "mail.${var.domain_name}"
}

################################################################################
# Route53 Records for SES (if zone provided)
################################################################################

resource "aws_route53_record" "ses_verification" {
  count   = var.route53_zone_id != null ? 1 : 0
  zone_id = var.route53_zone_id
  name    = "_amazonses.${var.domain_name}"
  type    = "TXT"
  ttl     = "600"
  records = [aws_ses_domain_identity.main.verification_token]
}

resource "aws_route53_record" "ses_dkim" {
  count   = var.route53_zone_id != null ? 3 : 0
  zone_id = var.route53_zone_id
  name    = "${aws_ses_domain_dkim.main.dkim_tokens[count.index]}._domainkey"
  type    = "CNAME"
  ttl     = "600"
  records = ["${aws_ses_domain_dkim.main.dkim_tokens[count.index]}.dkim.amazonses.com"]
}

resource "aws_route53_record" "ses_mail_from_mx" {
  count   = var.route53_zone_id != null ? 1 : 0
  zone_id = var.route53_zone_id
  name    = aws_ses_domain_mail_from.main.mail_from_domain
  type    = "MX"
  ttl     = "600"
  records = ["10 feedback-smtp.${data.aws_region.current.name}.amazonses.com"]
}

resource "aws_route53_record" "ses_mail_from_txt" {
  count   = var.route53_zone_id != null ? 1 : 0
  zone_id = var.route53_zone_id
  name    = aws_ses_domain_mail_from.main.mail_from_domain
  type    = "TXT"
  ttl     = "600"
  records = ["v=spf1 include:amazonses.com ~all"]
}

resource "aws_route53_record" "dmarc" {
  count   = var.route53_zone_id != null && var.enable_dmarc ? 1 : 0
  zone_id = var.route53_zone_id
  name    = "_dmarc.${var.domain_name}"
  type    = "TXT"
  ttl     = "600"
  records = ["v=DMARC1; p=${var.dmarc_policy}; rua=mailto:${var.dmarc_rua_email}; ruf=mailto:${var.dmarc_ruf_email}; sp=${var.dmarc_subdomain_policy}; adkim=s; aspf=s"]
}

################################################################################
# SES Configuration Set
################################################################################

resource "aws_ses_configuration_set" "main" {
  name = "${var.project_name}-${var.environment}-config-set"

  reputation_metrics_enabled = true
  sending_enabled            = true

  delivery_options {
    tls_policy = "REQUIRE"
  }

  tracking_options {
    custom_redirect_domain = var.tracking_domain != null ? var.tracking_domain : null
  }
}

################################################################################
# SES Event Destinations
################################################################################

# SNS Topic for SES events
resource "aws_sns_topic" "ses_events" {
  name              = "${var.project_name}-${var.environment}-ses-events"
  kms_master_key_id = var.kms_key_arn

  tags = local.common_tags
}

resource "aws_sns_topic_policy" "ses_events" {
  arn = aws_sns_topic.ses_events.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowSES"
        Effect = "Allow"
        Principal = {
          Service = "ses.amazonaws.com"
        }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.ses_events.arn
        Condition = {
          StringEquals = {
            "aws:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      }
    ]
  })
}

resource "aws_ses_event_destination" "sns" {
  name                   = "sns-events"
  configuration_set_name = aws_ses_configuration_set.main.name
  enabled                = true
  matching_types         = ["send", "reject", "bounce", "complaint", "delivery", "open", "click", "renderingFailure"]

  sns_destination {
    topic_arn = aws_sns_topic.ses_events.arn
  }
}

# Kinesis Firehose for SES events
resource "aws_ses_event_destination" "firehose" {
  count                  = var.enable_firehose_destination ? 1 : 0
  name                   = "firehose-events"
  configuration_set_name = aws_ses_configuration_set.main.name
  enabled                = true
  matching_types         = ["send", "reject", "bounce", "complaint", "delivery", "open", "click", "renderingFailure"]

  kinesis_destination {
    stream_arn = aws_kinesis_firehose_delivery_stream.ses_events[0].arn
    role_arn   = aws_iam_role.ses_firehose[0].arn
  }
}

resource "aws_kinesis_firehose_delivery_stream" "ses_events" {
  count       = var.enable_firehose_destination ? 1 : 0
  name        = "${var.project_name}-${var.environment}-ses-events"
  destination = "extended_s3"

  extended_s3_configuration {
    role_arn            = aws_iam_role.ses_firehose[0].arn
    bucket_arn          = var.data_lake_bucket_arn
    prefix              = "ses-events/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/"
    error_output_prefix = "ses-events-errors/!{firehose:error-output-type}/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/"
    buffering_size      = 64
    buffering_interval  = 300
    compression_format  = "GZIP"

    kms_key_arn = var.kms_key_arn

    cloudwatch_logging_options {
      enabled         = true
      log_group_name  = aws_cloudwatch_log_group.ses_firehose[0].name
      log_stream_name = "delivery"
    }
  }

  tags = local.common_tags
}

resource "aws_cloudwatch_log_group" "ses_firehose" {
  count             = var.enable_firehose_destination ? 1 : 0
  name              = "/aws/kinesisfirehose/${var.project_name}-${var.environment}-ses-events"
  retention_in_days = var.log_retention_days
  kms_key_id        = var.kms_key_arn

  tags = local.common_tags
}

resource "aws_iam_role" "ses_firehose" {
  count = var.enable_firehose_destination ? 1 : 0
  name  = "${var.project_name}-${var.environment}-ses-firehose"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ses.amazonaws.com"
        }
        Condition = {
          StringEquals = {
            "aws:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      },
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "firehose.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy" "ses_firehose" {
  count = var.enable_firehose_destination ? 1 : 0
  name  = "${var.project_name}-${var.environment}-ses-firehose-policy"
  role  = aws_iam_role.ses_firehose[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "firehose:PutRecord",
          "firehose:PutRecordBatch"
        ]
        Resource = aws_kinesis_firehose_delivery_stream.ses_events[0].arn
      },
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
          var.data_lake_bucket_arn,
          "${var.data_lake_bucket_arn}/*"
        ]
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
        Resource = "${aws_cloudwatch_log_group.ses_firehose[0].arn}:*"
      }
    ]
  })
}

# CloudWatch Event Destination for metrics
resource "aws_ses_event_destination" "cloudwatch" {
  name                   = "cloudwatch-metrics"
  configuration_set_name = aws_ses_configuration_set.main.name
  enabled                = true
  matching_types         = ["send", "reject", "bounce", "complaint", "delivery", "open", "click", "renderingFailure"]

  cloudwatch_destination {
    default_value  = "default"
    dimension_name = "ses:source-ip"
    value_source   = "messageTag"
  }

  cloudwatch_destination {
    default_value  = "default"
    dimension_name = "ses:from-domain"
    value_source   = "messageTag"
  }
}

################################################################################
# SES Email Templates
################################################################################

resource "aws_ses_template" "main" {
  for_each = var.email_templates

  name    = "${var.project_name}-${var.environment}-${each.key}"
  subject = each.value.subject
  html    = each.value.html
  text    = each.value.text
}

################################################################################
# SES Suppression List
################################################################################

resource "aws_sesv2_account_suppression_attributes" "main" {
  suppressed_reasons = var.suppression_list_reasons
}

################################################################################
# SES IAM Role for Application Use
################################################################################

resource "aws_iam_role" "ses_sender" {
  name = "${var.project_name}-${var.environment}-ses-sender"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "eks.amazonaws.com"
      }
    }]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy" "ses_sender" {
  name = "${var.project_name}-${var.environment}-ses-sender-policy"
  role = aws_iam_role.ses_sender.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail",
          "ses:SendTemplatedEmail",
          "ses:SendBulkTemplatedEmail"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "ses:FromAddress" = var.allowed_from_addresses
          }
        }
      },
      {
        Effect = "Allow"
        Action = [
          "ses:GetSendQuota",
          "ses:GetSendStatistics"
        ]
        Resource = "*"
      }
    ]
  })
}

################################################################################
# Bounce/Complaint Handling SQS Queue
################################################################################

resource "aws_sqs_queue" "bounces" {
  name = "${var.project_name}-${var.environment}-ses-bounces"

  message_retention_seconds = 1209600 # 14 days
  kms_master_key_id         = var.kms_key_arn

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-ses-bounces"
  })
}

resource "aws_sqs_queue" "complaints" {
  name = "${var.project_name}-${var.environment}-ses-complaints"

  message_retention_seconds = 1209600 # 14 days
  kms_master_key_id         = var.kms_key_arn

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-ses-complaints"
  })
}

resource "aws_sqs_queue_policy" "bounces" {
  queue_url = aws_sqs_queue.bounces.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowSNS"
        Effect = "Allow"
        Principal = {
          Service = "sns.amazonaws.com"
        }
        Action   = "sqs:SendMessage"
        Resource = aws_sqs_queue.bounces.arn
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = aws_sns_topic.ses_events.arn
          }
        }
      }
    ]
  })
}

resource "aws_sqs_queue_policy" "complaints" {
  queue_url = aws_sqs_queue.complaints.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowSNS"
        Effect = "Allow"
        Principal = {
          Service = "sns.amazonaws.com"
        }
        Action   = "sqs:SendMessage"
        Resource = aws_sqs_queue.complaints.arn
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = aws_sns_topic.ses_events.arn
          }
        }
      }
    ]
  })
}

# SNS subscription with filter for bounces
resource "aws_sns_topic_subscription" "bounces" {
  topic_arn = aws_sns_topic.ses_events.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.bounces.arn

  filter_policy = jsonencode({
    eventType = ["bounce"]
  })
}

# SNS subscription with filter for complaints
resource "aws_sns_topic_subscription" "complaints" {
  topic_arn = aws_sns_topic.ses_events.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.complaints.arn

  filter_policy = jsonencode({
    eventType = ["complaint"]
  })
}

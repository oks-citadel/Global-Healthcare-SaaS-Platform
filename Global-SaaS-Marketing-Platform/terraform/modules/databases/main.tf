################################################################################
# Databases Module - Main Configuration
# Global SaaS Marketing Platform
################################################################################

locals {
  common_tags = merge(var.tags, {
    Module = "databases"
  })
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

################################################################################
# Aurora PostgreSQL Cluster
################################################################################

resource "aws_rds_cluster" "postgresql" {
  cluster_identifier     = "${var.project_name}-${var.environment}-aurora-pg"
  engine                 = "aurora-postgresql"
  engine_version         = var.aurora_postgresql_version
  engine_mode            = "provisioned"
  database_name          = var.aurora_database_name
  master_username        = var.aurora_master_username
  manage_master_user_password = true
  master_user_secret_kms_key_id = var.kms_key_arn

  db_subnet_group_name    = var.db_subnet_group_name
  vpc_security_group_ids  = [var.rds_security_group_id]

  storage_encrypted = true
  kms_key_id        = var.kms_key_arn

  backup_retention_period      = var.aurora_backup_retention_days
  preferred_backup_window      = var.aurora_backup_window
  preferred_maintenance_window = var.aurora_maintenance_window
  skip_final_snapshot          = var.environment != "prod"
  final_snapshot_identifier    = var.environment == "prod" ? "${var.project_name}-${var.environment}-aurora-final-snapshot" : null
  deletion_protection          = var.environment == "prod"
  copy_tags_to_snapshot        = true

  enabled_cloudwatch_logs_exports = ["postgresql"]

  serverlessv2_scaling_configuration {
    min_capacity = var.aurora_min_capacity
    max_capacity = var.aurora_max_capacity
  }

  iam_database_authentication_enabled = true

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-aurora-pg"
  })
}

resource "aws_rds_cluster_instance" "postgresql" {
  count = var.aurora_instance_count

  identifier         = "${var.project_name}-${var.environment}-aurora-pg-${count.index + 1}"
  cluster_identifier = aws_rds_cluster.postgresql.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.postgresql.engine
  engine_version     = aws_rds_cluster.postgresql.engine_version

  auto_minor_version_upgrade   = true
  publicly_accessible          = false
  performance_insights_enabled = true
  performance_insights_kms_key_id = var.kms_key_arn
  performance_insights_retention_period = var.environment == "prod" ? 731 : 7

  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_monitoring.arn

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-aurora-pg-${count.index + 1}"
  })
}

resource "aws_rds_cluster_parameter_group" "postgresql" {
  family = "aurora-postgresql15"
  name   = "${var.project_name}-${var.environment}-aurora-pg-params"

  parameter {
    name  = "log_statement"
    value = "all"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "1000"
  }

  parameter {
    name  = "shared_preload_libraries"
    value = "pg_stat_statements,pgaudit"
  }

  parameter {
    name         = "pgaudit.log"
    value        = "ddl,role"
    apply_method = "pending-reboot"
  }

  tags = local.common_tags
}

resource "aws_iam_role" "rds_monitoring" {
  name = "${var.project_name}-${var.environment}-rds-monitoring"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "monitoring.rds.amazonaws.com"
      }
    }]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  role       = aws_iam_role.rds_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

################################################################################
# DynamoDB Tables
################################################################################

resource "aws_dynamodb_table" "main" {
  for_each = var.dynamodb_tables

  name         = "${var.project_name}-${var.environment}-${each.key}"
  billing_mode = each.value.billing_mode
  hash_key     = each.value.hash_key
  range_key    = each.value.range_key

  read_capacity  = each.value.billing_mode == "PROVISIONED" ? each.value.read_capacity : null
  write_capacity = each.value.billing_mode == "PROVISIONED" ? each.value.write_capacity : null

  dynamic "attribute" {
    for_each = each.value.attributes
    content {
      name = attribute.value.name
      type = attribute.value.type
    }
  }

  dynamic "global_secondary_index" {
    for_each = each.value.global_secondary_indexes
    content {
      name               = global_secondary_index.value.name
      hash_key           = global_secondary_index.value.hash_key
      range_key          = global_secondary_index.value.range_key
      projection_type    = global_secondary_index.value.projection_type
      non_key_attributes = global_secondary_index.value.non_key_attributes
      read_capacity      = each.value.billing_mode == "PROVISIONED" ? global_secondary_index.value.read_capacity : null
      write_capacity     = each.value.billing_mode == "PROVISIONED" ? global_secondary_index.value.write_capacity : null
    }
  }

  dynamic "local_secondary_index" {
    for_each = each.value.local_secondary_indexes
    content {
      name               = local_secondary_index.value.name
      range_key          = local_secondary_index.value.range_key
      projection_type    = local_secondary_index.value.projection_type
      non_key_attributes = local_secondary_index.value.non_key_attributes
    }
  }

  ttl {
    attribute_name = each.value.ttl_attribute
    enabled        = each.value.ttl_attribute != null
  }

  point_in_time_recovery {
    enabled = each.value.enable_point_in_time_recovery
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = var.kms_key_arn
  }

  stream_enabled   = each.value.stream_enabled
  stream_view_type = each.value.stream_enabled ? each.value.stream_view_type : null

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-${each.key}"
  })
}

# DynamoDB Auto Scaling
resource "aws_appautoscaling_target" "dynamodb_read" {
  for_each = {
    for k, v in var.dynamodb_tables : k => v
    if v.billing_mode == "PROVISIONED" && v.enable_autoscaling
  }

  max_capacity       = each.value.autoscaling_max_read_capacity
  min_capacity       = each.value.autoscaling_min_read_capacity
  resource_id        = "table/${aws_dynamodb_table.main[each.key].name}"
  scalable_dimension = "dynamodb:table:ReadCapacityUnits"
  service_namespace  = "dynamodb"
}

resource "aws_appautoscaling_policy" "dynamodb_read" {
  for_each = {
    for k, v in var.dynamodb_tables : k => v
    if v.billing_mode == "PROVISIONED" && v.enable_autoscaling
  }

  name               = "${each.key}-read-capacity"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.dynamodb_read[each.key].resource_id
  scalable_dimension = aws_appautoscaling_target.dynamodb_read[each.key].scalable_dimension
  service_namespace  = aws_appautoscaling_target.dynamodb_read[each.key].service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBReadCapacityUtilization"
    }
    target_value       = each.value.autoscaling_target_value
    scale_in_cooldown  = 60
    scale_out_cooldown = 60
  }
}

resource "aws_appautoscaling_target" "dynamodb_write" {
  for_each = {
    for k, v in var.dynamodb_tables : k => v
    if v.billing_mode == "PROVISIONED" && v.enable_autoscaling
  }

  max_capacity       = each.value.autoscaling_max_write_capacity
  min_capacity       = each.value.autoscaling_min_write_capacity
  resource_id        = "table/${aws_dynamodb_table.main[each.key].name}"
  scalable_dimension = "dynamodb:table:WriteCapacityUnits"
  service_namespace  = "dynamodb"
}

resource "aws_appautoscaling_policy" "dynamodb_write" {
  for_each = {
    for k, v in var.dynamodb_tables : k => v
    if v.billing_mode == "PROVISIONED" && v.enable_autoscaling
  }

  name               = "${each.key}-write-capacity"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.dynamodb_write[each.key].resource_id
  scalable_dimension = aws_appautoscaling_target.dynamodb_write[each.key].scalable_dimension
  service_namespace  = aws_appautoscaling_target.dynamodb_write[each.key].service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBWriteCapacityUtilization"
    }
    target_value       = each.value.autoscaling_target_value
    scale_in_cooldown  = 60
    scale_out_cooldown = 60
  }
}

################################################################################
# ElastiCache Redis
################################################################################

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id = "${var.project_name}-${var.environment}-redis"
  description          = "Redis cluster for ${var.project_name} ${var.environment}"

  engine               = "redis"
  engine_version       = var.redis_version
  node_type            = var.redis_node_type
  port                 = 6379
  parameter_group_name = aws_elasticache_parameter_group.redis.name

  num_cache_clusters   = var.redis_num_cache_clusters
  automatic_failover_enabled = var.redis_num_cache_clusters > 1
  multi_az_enabled     = var.redis_num_cache_clusters > 1

  subnet_group_name    = var.elasticache_subnet_group_name
  security_group_ids   = [var.elasticache_security_group_id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  kms_key_id                 = var.kms_key_arn
  auth_token                 = var.redis_auth_token
  auth_token_update_strategy = "ROTATE"

  snapshot_retention_limit = var.redis_snapshot_retention_limit
  snapshot_window          = var.redis_snapshot_window
  maintenance_window       = var.redis_maintenance_window

  auto_minor_version_upgrade = true
  apply_immediately          = var.environment != "prod"

  notification_topic_arn = var.sns_topic_arn

  log_delivery_configuration {
    destination      = aws_cloudwatch_log_group.redis_slow_log.name
    destination_type = "cloudwatch-logs"
    log_format       = "json"
    log_type         = "slow-log"
  }

  log_delivery_configuration {
    destination      = aws_cloudwatch_log_group.redis_engine_log.name
    destination_type = "cloudwatch-logs"
    log_format       = "json"
    log_type         = "engine-log"
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-redis"
  })
}

resource "aws_elasticache_parameter_group" "redis" {
  family = "redis7"
  name   = "${var.project_name}-${var.environment}-redis-params"

  parameter {
    name  = "maxmemory-policy"
    value = "volatile-lru"
  }

  parameter {
    name  = "slowlog-log-slower-than"
    value = "10000"
  }

  parameter {
    name  = "slowlog-max-len"
    value = "128"
  }

  tags = local.common_tags
}

resource "aws_cloudwatch_log_group" "redis_slow_log" {
  name              = "/aws/elasticache/${var.project_name}-${var.environment}/redis/slow-log"
  retention_in_days = var.log_retention_days
  kms_key_id        = var.kms_key_arn

  tags = local.common_tags
}

resource "aws_cloudwatch_log_group" "redis_engine_log" {
  name              = "/aws/elasticache/${var.project_name}-${var.environment}/redis/engine-log"
  retention_in_days = var.log_retention_days
  kms_key_id        = var.kms_key_arn

  tags = local.common_tags
}

################################################################################
# OpenSearch Domain
################################################################################

resource "aws_opensearch_domain" "main" {
  count = var.enable_opensearch ? 1 : 0

  domain_name    = "${var.project_name}-${var.environment}"
  engine_version = var.opensearch_version

  cluster_config {
    instance_type            = var.opensearch_instance_type
    instance_count           = var.opensearch_instance_count
    dedicated_master_enabled = var.opensearch_dedicated_master_enabled
    dedicated_master_type    = var.opensearch_dedicated_master_type
    dedicated_master_count   = var.opensearch_dedicated_master_count
    zone_awareness_enabled   = var.opensearch_instance_count > 1

    dynamic "zone_awareness_config" {
      for_each = var.opensearch_instance_count > 1 ? [1] : []
      content {
        availability_zone_count = min(var.opensearch_instance_count, 3)
      }
    }
  }

  ebs_options {
    ebs_enabled = true
    volume_type = "gp3"
    volume_size = var.opensearch_volume_size
    iops        = var.opensearch_iops
    throughput  = var.opensearch_throughput
  }

  vpc_options {
    subnet_ids         = var.opensearch_subnet_ids
    security_group_ids = [var.opensearch_security_group_id]
  }

  encrypt_at_rest {
    enabled    = true
    kms_key_id = var.kms_key_arn
  }

  node_to_node_encryption {
    enabled = true
  }

  domain_endpoint_options {
    enforce_https       = true
    tls_security_policy = "Policy-Min-TLS-1-2-2019-07"
  }

  advanced_security_options {
    enabled                        = true
    internal_user_database_enabled = false
    master_user_options {
      master_user_arn = var.opensearch_master_user_arn
    }
  }

  log_publishing_options {
    cloudwatch_log_group_arn = aws_cloudwatch_log_group.opensearch_index_slow[0].arn
    log_type                 = "INDEX_SLOW_LOGS"
    enabled                  = true
  }

  log_publishing_options {
    cloudwatch_log_group_arn = aws_cloudwatch_log_group.opensearch_search_slow[0].arn
    log_type                 = "SEARCH_SLOW_LOGS"
    enabled                  = true
  }

  log_publishing_options {
    cloudwatch_log_group_arn = aws_cloudwatch_log_group.opensearch_es_app[0].arn
    log_type                 = "ES_APPLICATION_LOGS"
    enabled                  = true
  }

  auto_tune_options {
    desired_state       = "ENABLED"
    rollback_on_disable = "NO_ROLLBACK"

    maintenance_schedule {
      start_at = timeadd(timestamp(), "24h")
      duration {
        value = 2
        unit  = "HOURS"
      }
      cron_expression_for_recurrence = "cron(0 0 ? * SUN *)"
    }
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-opensearch"
  })

  depends_on = [aws_iam_service_linked_role.opensearch]
}

resource "aws_iam_service_linked_role" "opensearch" {
  count            = var.enable_opensearch && var.create_opensearch_service_linked_role ? 1 : 0
  aws_service_name = "opensearchservice.amazonaws.com"
}

resource "aws_cloudwatch_log_group" "opensearch_index_slow" {
  count             = var.enable_opensearch ? 1 : 0
  name              = "/aws/opensearch/${var.project_name}-${var.environment}/index-slow-logs"
  retention_in_days = var.log_retention_days
  kms_key_id        = var.kms_key_arn

  tags = local.common_tags
}

resource "aws_cloudwatch_log_group" "opensearch_search_slow" {
  count             = var.enable_opensearch ? 1 : 0
  name              = "/aws/opensearch/${var.project_name}-${var.environment}/search-slow-logs"
  retention_in_days = var.log_retention_days
  kms_key_id        = var.kms_key_arn

  tags = local.common_tags
}

resource "aws_cloudwatch_log_group" "opensearch_es_app" {
  count             = var.enable_opensearch ? 1 : 0
  name              = "/aws/opensearch/${var.project_name}-${var.environment}/es-application-logs"
  retention_in_days = var.log_retention_days
  kms_key_id        = var.kms_key_arn

  tags = local.common_tags
}

resource "aws_cloudwatch_log_resource_policy" "opensearch" {
  count       = var.enable_opensearch ? 1 : 0
  policy_name = "${var.project_name}-${var.environment}-opensearch-log-policy"

  policy_document = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "es.amazonaws.com"
      }
      Action = [
        "logs:PutLogEvents",
        "logs:PutLogEventsBatch",
        "logs:CreateLogStream"
      ]
      Resource = "arn:aws:logs:*"
    }]
  })
}

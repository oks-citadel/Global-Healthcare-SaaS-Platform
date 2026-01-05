# ============================================
# AWS ElastiCache Module
# ============================================
# Replaces: Azure Redis Cache
# Translation: Azure Redis → ElastiCache Redis
# ============================================

locals {
  name = "${var.project_name}-${var.environment}-${var.region_name}"

  tags = merge(var.tags, {
    Module = "elasticache"
  })
}

# ============================================
# ElastiCache Redis Replication Group
# ============================================

resource "aws_elasticache_replication_group" "main" {
  replication_group_id = "${local.name}-redis"
  description          = "Redis cluster for ${local.name}"

  engine               = "redis"
  engine_version       = var.engine_version
  node_type            = var.node_type
  num_cache_clusters   = var.num_cache_clusters
  parameter_group_name = aws_elasticache_parameter_group.main.name
  port                 = 6379

  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.redis.id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token                 = random_password.auth_token.result
  kms_key_id                 = var.kms_key_arn != "" ? var.kms_key_arn : aws_kms_key.redis[0].arn

  automatic_failover_enabled = var.num_cache_clusters > 1
  multi_az_enabled           = var.num_cache_clusters > 1

  snapshot_retention_limit = var.snapshot_retention_days
  snapshot_window          = var.snapshot_window
  maintenance_window       = var.maintenance_window

  notification_topic_arn = var.sns_topic_arn

  auto_minor_version_upgrade = true

  tags = merge(local.tags, {
    Name = "${local.name}-redis"
  })

  lifecycle {
    ignore_changes = [auth_token]
  }
}

# ============================================
# Auth Token (Password)
# ============================================

resource "random_password" "auth_token" {
  length           = 32
  special          = true
  override_special = "!&#$^<>-"
}

# Store auth token in Secrets Manager
resource "aws_secretsmanager_secret" "auth_token" {
  name        = "${local.name}-redis-auth-token"
  description = "Auth token for Redis cluster ${local.name}"
  kms_key_id  = var.kms_key_arn != "" ? var.kms_key_arn : aws_kms_key.redis[0].arn

  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "auth_token" {
  secret_id = aws_secretsmanager_secret.auth_token.id
  secret_string = jsonencode({
    auth_token       = random_password.auth_token.result
    primary_endpoint = aws_elasticache_replication_group.main.primary_endpoint_address
    reader_endpoint  = aws_elasticache_replication_group.main.reader_endpoint_address
    port             = 6379
  })
}

# ============================================
# KMS Key
# ============================================

resource "aws_kms_key" "redis" {
  count                   = var.kms_key_arn == "" ? 1 : 0
  description             = "KMS key for ElastiCache ${local.name}"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = merge(local.tags, {
    Name = "${local.name}-redis-kms"
  })
}

resource "aws_kms_alias" "redis" {
  count         = var.kms_key_arn == "" ? 1 : 0
  name          = "alias/${local.name}-redis"
  target_key_id = aws_kms_key.redis[0].key_id
}

# ============================================
# Subnet Group
# ============================================

resource "aws_elasticache_subnet_group" "main" {
  name        = "${local.name}-redis-subnet-group"
  description = "Subnet group for Redis ${local.name}"
  subnet_ids  = var.subnet_ids

  tags = local.tags
}

# ============================================
# Parameter Group
# ============================================

resource "aws_elasticache_parameter_group" "main" {
  name        = "${local.name}-redis-params"
  family      = "redis7"
  description = "Parameter group for Redis ${local.name}"

  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lru"
  }

  parameter {
    name  = "notify-keyspace-events"
    value = "Ex"
  }

  tags = local.tags
}

# ============================================
# Security Group
# ============================================

resource "aws_security_group" "redis" {
  name        = "${local.name}-redis-sg"
  description = "Security group for ElastiCache Redis"
  vpc_id      = var.vpc_id

  tags = merge(local.tags, {
    Name = "${local.name}-redis-sg"
  })
}

resource "aws_security_group_rule" "redis_ingress" {
  type                     = "ingress"
  from_port                = 6379
  to_port                  = 6379
  protocol                 = "tcp"
  source_security_group_id = var.allowed_security_group_id
  security_group_id        = aws_security_group.redis.id
  description              = "Redis from EKS"
}

# SECURITY: ElastiCache does not require internet egress
# Redis only responds to application connections - no outbound calls needed
# This prevents data exfiltration via compromised cache connections
resource "aws_security_group_rule" "redis_egress" {
  type                     = "egress"
  from_port                = 6379
  to_port                  = 6379
  protocol                 = "tcp"
  source_security_group_id = var.allowed_security_group_id
  security_group_id        = aws_security_group.redis.id
  description              = "Redis responses to EKS only"
}

# ============================================
# CloudWatch Alarms
# ============================================

resource "aws_cloudwatch_metric_alarm" "cpu" {
  alarm_name          = "${local.name}-redis-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ElastiCache"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Redis CPU utilization is high"
  alarm_actions       = var.alarm_sns_topic_arns

  dimensions = {
    CacheClusterId = aws_elasticache_replication_group.main.id
  }

  tags = local.tags
}

resource "aws_cloudwatch_metric_alarm" "memory" {
  alarm_name          = "${local.name}-redis-memory-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "DatabaseMemoryUsagePercentage"
  namespace           = "AWS/ElastiCache"
  period              = 300
  statistic           = "Average"
  threshold           = 85
  alarm_description   = "Redis memory usage is high"
  alarm_actions       = var.alarm_sns_topic_arns

  dimensions = {
    CacheClusterId = aws_elasticache_replication_group.main.id
  }

  tags = local.tags
}

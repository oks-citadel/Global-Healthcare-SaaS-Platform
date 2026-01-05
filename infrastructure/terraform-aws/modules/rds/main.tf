# ============================================
# AWS RDS Aurora Module
# ============================================
# Replaces: Azure PostgreSQL Flexible Server
# Translation: PostgreSQL Flexible Server → Aurora PostgreSQL
# ============================================

locals {
  name = "${var.project_name}-${var.environment}-${var.region_name}"

  tags = merge(var.tags, {
    Module = "rds"
  })
}

# ============================================
# RDS Aurora Cluster
# ============================================

resource "aws_rds_cluster" "main" {
  cluster_identifier = "${local.name}-aurora"
  engine             = "aurora-postgresql"
  engine_mode        = "provisioned"
  engine_version     = var.engine_version
  database_name      = var.database_name
  master_username    = var.master_username
  master_password    = random_password.master.result

  db_subnet_group_name            = var.db_subnet_group_name
  vpc_security_group_ids          = [aws_security_group.rds.id]
  db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.main.name

  storage_encrypted = true
  kms_key_id        = var.kms_key_arn != "" ? var.kms_key_arn : aws_kms_key.rds[0].arn

  backup_retention_period      = var.backup_retention_days
  preferred_backup_window      = var.backup_window
  preferred_maintenance_window = var.maintenance_window
  copy_tags_to_snapshot        = true

  deletion_protection = var.deletion_protection
  skip_final_snapshot = var.skip_final_snapshot
  final_snapshot_identifier = var.skip_final_snapshot ? null : "${local.name}-final-snapshot"

  enabled_cloudwatch_logs_exports = ["postgresql"]

  serverlessv2_scaling_configuration {
    min_capacity = var.serverless_min_capacity
    max_capacity = var.serverless_max_capacity
  }

  tags = merge(local.tags, {
    Name = "${local.name}-aurora"
  })

  lifecycle {
    ignore_changes = [master_password]
  }
}

# ============================================
# Aurora Instances
# ============================================

resource "aws_rds_cluster_instance" "main" {
  count = var.instance_count

  identifier         = "${local.name}-aurora-${count.index + 1}"
  cluster_identifier = aws_rds_cluster.main.id
  instance_class     = var.instance_class
  engine             = aws_rds_cluster.main.engine
  engine_version     = aws_rds_cluster.main.engine_version

  db_parameter_group_name = aws_db_parameter_group.main.name

  publicly_accessible          = false
  auto_minor_version_upgrade   = true
  performance_insights_enabled = var.performance_insights_enabled
  performance_insights_kms_key_id = var.performance_insights_enabled ? (var.kms_key_arn != "" ? var.kms_key_arn : aws_kms_key.rds[0].arn) : null
  performance_insights_retention_period = var.performance_insights_enabled ? var.performance_insights_retention : null

  monitoring_interval = var.enhanced_monitoring_interval
  monitoring_role_arn = var.enhanced_monitoring_interval > 0 ? aws_iam_role.rds_monitoring[0].arn : null

  tags = merge(local.tags, {
    Name = "${local.name}-aurora-${count.index + 1}"
  })
}

# ============================================
# Random Password for Master User
# ============================================

resource "random_password" "master" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

# Store password in Secrets Manager
resource "aws_secretsmanager_secret" "master_password" {
  name        = "${local.name}-aurora-master-password"
  description = "Master password for Aurora cluster ${local.name}"
  kms_key_id  = var.kms_key_arn != "" ? var.kms_key_arn : aws_kms_key.rds[0].arn

  tags = local.tags
}

resource "aws_secretsmanager_secret_version" "master_password" {
  secret_id = aws_secretsmanager_secret.master_password.id
  secret_string = jsonencode({
    username = var.master_username
    password = random_password.master.result
    host     = aws_rds_cluster.main.endpoint
    port     = aws_rds_cluster.main.port
    database = var.database_name
  })
}

# ============================================
# KMS Key for RDS Encryption
# ============================================

resource "aws_kms_key" "rds" {
  count                   = var.kms_key_arn == "" ? 1 : 0
  description             = "KMS key for RDS encryption ${local.name}"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = merge(local.tags, {
    Name = "${local.name}-rds-kms"
  })
}

resource "aws_kms_alias" "rds" {
  count         = var.kms_key_arn == "" ? 1 : 0
  name          = "alias/${local.name}-rds"
  target_key_id = aws_kms_key.rds[0].key_id
}

# ============================================
# Parameter Groups
# ============================================

resource "aws_rds_cluster_parameter_group" "main" {
  name        = "${local.name}-aurora-cluster-pg"
  family      = "aurora-postgresql15"
  description = "Aurora PostgreSQL cluster parameter group"

  parameter {
    name  = "log_statement"
    value = "all"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "1000"
  }

  parameter {
    name         = "shared_preload_libraries"
    value        = "pg_stat_statements,pgaudit"
    apply_method = "pending-reboot"
  }

  parameter {
    name  = "pgaudit.log"
    value = "ddl,role"
  }

  tags = local.tags
}

resource "aws_db_parameter_group" "main" {
  name        = "${local.name}-aurora-instance-pg"
  family      = "aurora-postgresql15"
  description = "Aurora PostgreSQL instance parameter group"

  parameter {
    name  = "log_connections"
    value = "1"
  }

  parameter {
    name  = "log_disconnections"
    value = "1"
  }

  tags = local.tags
}

# ============================================
# Security Group
# ============================================

resource "aws_security_group" "rds" {
  name        = "${local.name}-rds-sg"
  description = "Security group for Aurora PostgreSQL"
  vpc_id      = var.vpc_id

  tags = merge(local.tags, {
    Name = "${local.name}-rds-sg"
  })
}

resource "aws_security_group_rule" "rds_ingress" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = var.allowed_security_group_id
  security_group_id        = aws_security_group.rds.id
  description              = "PostgreSQL from EKS"
}

# SECURITY: RDS does not require internet egress
# Database only responds to application connections - no outbound calls needed
# This prevents data exfiltration via compromised database connections
resource "aws_security_group_rule" "rds_egress" {
  type                     = "egress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = var.allowed_security_group_id
  security_group_id        = aws_security_group.rds.id
  description              = "PostgreSQL responses to EKS only"
}

# ============================================
# Enhanced Monitoring IAM Role
# ============================================

resource "aws_iam_role" "rds_monitoring" {
  count = var.enhanced_monitoring_interval > 0 ? 1 : 0
  name  = "${local.name}-rds-monitoring-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })

  tags = local.tags
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  count      = var.enhanced_monitoring_interval > 0 ? 1 : 0
  role       = aws_iam_role.rds_monitoring[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# ============================================
# CloudWatch Alarms
# ============================================

resource "aws_cloudwatch_metric_alarm" "cpu" {
  alarm_name          = "${local.name}-aurora-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Aurora CPU utilization is high"
  alarm_actions       = var.alarm_sns_topic_arns

  dimensions = {
    DBClusterIdentifier = aws_rds_cluster.main.cluster_identifier
  }

  tags = local.tags
}

resource "aws_cloudwatch_metric_alarm" "storage" {
  alarm_name          = "${local.name}-aurora-storage-low"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 3
  metric_name         = "FreeLocalStorage"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 10737418240 # 10 GB
  alarm_description   = "Aurora free storage is low"
  alarm_actions       = var.alarm_sns_topic_arns

  dimensions = {
    DBClusterIdentifier = aws_rds_cluster.main.cluster_identifier
  }

  tags = local.tags
}

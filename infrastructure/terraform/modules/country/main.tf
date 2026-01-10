# ============================================
# Country Module - AWS Infrastructure
# ============================================
# MIGRATED FROM AZURE TO AWS
# Deploys country-specific resources within a regional VPC
# Supports data isolation for countries with strict compliance requirements
#
# Architecture: Global -> Region -> Country
# - Country-specific subnet within regional VPC
# - Country-specific Security Group
# - Country-specific KMS Key (for data isolation)
# - Country-specific EKS node group (optional)
# - Country-specific S3 bucket (for data residency)
# ============================================

# ============================================
# Local Variables
# ============================================

locals {
  name_prefix = "${var.project_name}-${var.country_code}-${var.environment}"

  # Determine resource naming based on isolation level
  resource_prefix = var.isolation_enabled ? "${var.project_name}-${var.country_code}" : "${var.project_name}-${var.region_id}"

  common_tags = merge(
    {
      Project         = "UnifiedHealth"
      Environment     = var.environment
      Region          = var.region_id
      Country         = var.country_name
      CountryCode     = var.country_code
      ManagedBy       = "Terraform"
      CostCenter      = "Healthcare-Platform"
      DataResidency   = var.data_residency_required ? "Required" : "Optional"
      IsolationLevel  = var.isolation_enabled ? "High" : "Standard"
      Compliance      = join(",", var.compliance_tags)
    },
    var.additional_tags
  )
}

# ============================================
# Data Sources
# ============================================

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

data "aws_availability_zones" "available" {
  state = "available"
}

# Reference to regional VPC
data "aws_vpc" "region" {
  id = var.regional_vpc_id
}

# Reference to regional EKS cluster
data "aws_eks_cluster" "region" {
  name = var.regional_eks_cluster_name
}

# ============================================
# Country-Specific Subnet
# ============================================

resource "aws_subnet" "country" {
  count             = length(var.availability_zones)
  vpc_id            = var.regional_vpc_id
  cidr_block        = cidrsubnet(var.subnet_cidr, 2, count.index)
  availability_zone = var.availability_zones[count.index]

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-subnet-${count.index + 1}"
    Type = "country-workloads"
    "kubernetes.io/cluster/${var.regional_eks_cluster_name}" = "shared"
  })
}

# ============================================
# Country-Specific Security Group
# ============================================

resource "aws_security_group" "country" {
  name        = "${local.name_prefix}-sg"
  description = "Security group for country ${var.country_code} workloads"
  vpc_id      = var.regional_vpc_id

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-sg"
    Purpose = "CountryWorkloads"
  })
}

# Allow inbound from regional EKS nodes
resource "aws_security_group_rule" "country_ingress_eks" {
  type                     = "ingress"
  from_port                = 0
  to_port                  = 65535
  protocol                 = "tcp"
  source_security_group_id = var.regional_eks_node_sg_id
  security_group_id        = aws_security_group.country.id
  description              = "Allow traffic from regional EKS nodes"
}

# Allow internal communication within country subnet
resource "aws_security_group_rule" "country_ingress_self" {
  type              = "ingress"
  from_port         = 0
  to_port           = 65535
  protocol          = "-1"
  self              = true
  security_group_id = aws_security_group.country.id
  description       = "Allow internal country traffic"
}

# Allow all egress
resource "aws_security_group_rule" "country_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.country.id
  description       = "Allow all egress"
}

# ============================================
# Country-Specific KMS Key (for data isolation)
# ============================================
# Only created when isolation is enabled (e.g., Germany, Switzerland)

resource "aws_kms_key" "country" {
  count = var.isolation_enabled ? 1 : 0

  description             = "Country-specific KMS key for ${var.country_name} (${var.country_code})"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "Allow Regional EKS Nodes"
        Effect = "Allow"
        Principal = {
          AWS = var.regional_eks_node_role_arn
        }
        Action = [
          "kms:Decrypt",
          "kms:DescribeKey",
          "kms:GenerateDataKey*"
        ]
        Resource = "*"
      },
      {
        Sid    = "Allow Secrets Manager"
        Effect = "Allow"
        Principal = {
          Service = "secretsmanager.amazonaws.com"
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey"
        ]
        Resource = "*"
      }
    ]
  })

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-kms"
    Purpose = "CountryIsolatedSecrets"
    Scope   = "Country"
  })
}

resource "aws_kms_alias" "country" {
  count = var.isolation_enabled ? 1 : 0

  name          = "alias/${local.name_prefix}"
  target_key_id = aws_kms_key.country[0].key_id
}

# ============================================
# Country-Specific S3 Bucket
# ============================================
# For countries with strict data residency requirements

resource "aws_s3_bucket" "country" {
  count = var.data_residency_required ? 1 : 0

  bucket = "${local.name_prefix}-data-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.common_tags, {
    Name            = "${local.name_prefix}-data"
    Purpose         = "CountryDataResidency"
    Scope           = "Country"
    DataSovereignty = "Enforced"
  })
}

resource "aws_s3_bucket_versioning" "country" {
  count = var.data_residency_required ? 1 : 0

  bucket = aws_s3_bucket.country[0].id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "country" {
  count = var.data_residency_required ? 1 : 0

  bucket = aws_s3_bucket.country[0].id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = var.isolation_enabled ? aws_kms_key.country[0].arn : var.regional_kms_key_arn
      sse_algorithm     = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "country" {
  count = var.data_residency_required ? 1 : 0

  bucket = aws_s3_bucket.country[0].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "country" {
  count = var.data_residency_required ? 1 : 0

  bucket = aws_s3_bucket.country[0].id

  rule {
    id     = "transition-to-ia"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 180
      storage_class = "GLACIER"
    }
  }
}

# S3 Bucket Policy restricting access
resource "aws_s3_bucket_policy" "country" {
  count = var.data_residency_required ? 1 : 0

  bucket = aws_s3_bucket.country[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowEKSNodesAccess"
        Effect = "Allow"
        Principal = {
          AWS = var.regional_eks_node_role_arn
        }
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.country[0].arn,
          "${aws_s3_bucket.country[0].arn}/*"
        ]
      },
      {
        Sid    = "DenyNonSecureTransport"
        Effect = "Deny"
        Principal = "*"
        Action = "s3:*"
        Resource = [
          aws_s3_bucket.country[0].arn,
          "${aws_s3_bucket.country[0].arn}/*"
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

# ============================================
# Country-Specific Secrets Manager Secrets
# ============================================

resource "aws_secretsmanager_secret" "country_config" {
  count = var.isolation_enabled ? 1 : 0

  name        = "${local.name_prefix}/country-config"
  description = "Country-specific configuration for ${var.country_name}"
  kms_key_id  = aws_kms_key.country[0].arn

  tags = merge(local.common_tags, {
    Purpose = "CountryConfiguration"
    Scope   = "Country"
  })
}

resource "aws_secretsmanager_secret_version" "country_config" {
  count = var.isolation_enabled ? 1 : 0

  secret_id = aws_secretsmanager_secret.country_config[0].id
  secret_string = jsonencode({
    country_code     = var.country_code
    country_name     = var.country_name
    region_id        = var.region_id
    isolation_level  = "high"
    compliance_tags  = var.compliance_tags
    data_residency   = var.data_residency_required
    s3_bucket        = var.data_residency_required ? aws_s3_bucket.country[0].id : null
    kms_key_arn      = aws_kms_key.country[0].arn
  })
}

# ============================================
# Country-Specific EKS Node Group (Optional)
# ============================================
# For isolated workloads requiring dedicated compute

resource "aws_eks_node_group" "country" {
  count = var.dedicated_node_pool ? 1 : 0

  cluster_name    = var.regional_eks_cluster_name
  node_group_name = "${local.name_prefix}-nodes"
  node_role_arn   = var.regional_eks_node_role_arn
  subnet_ids      = aws_subnet.country[*].id

  instance_types = [var.node_pool_vm_size]
  capacity_type  = var.environment == "prod" ? "ON_DEMAND" : "SPOT"
  disk_size      = 128

  scaling_config {
    desired_size = var.node_pool_count
    max_size     = var.node_pool_autoscaling ? var.node_pool_max_count : var.node_pool_count
    min_size     = var.node_pool_autoscaling ? var.node_pool_min_count : var.node_pool_count
  }

  update_config {
    max_unavailable = 1
  }

  labels = {
    "country"       = var.country_code
    "region"        = var.region_id
    "isolation"     = var.isolation_enabled ? "high" : "standard"
    "compliance"    = join("-", var.compliance_tags)
    "nodepool-type" = "country-dedicated"
  }

  dynamic "taint" {
    for_each = var.isolation_enabled ? [1] : []
    content {
      key    = "country"
      value  = var.country_code
      effect = "NO_SCHEDULE"
    }
  }

  dynamic "taint" {
    for_each = var.isolation_enabled ? [1] : []
    content {
      key    = "isolation"
      value  = "high"
      effect = "NO_SCHEDULE"
    }
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-node-group"
  })

  lifecycle {
    ignore_changes = [scaling_config[0].desired_size]
  }
}

# ============================================
# Country-Specific Aurora PostgreSQL Database (Optional)
# ============================================
# Only for countries requiring fully isolated database

resource "aws_db_subnet_group" "country" {
  count = var.dedicated_database ? 1 : 0

  name        = "${local.name_prefix}-db-subnet-group"
  description = "Database subnet group for ${var.country_name}"
  subnet_ids  = aws_subnet.country[*].id

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-db-subnet-group"
  })
}

resource "aws_security_group" "country_rds" {
  count = var.dedicated_database ? 1 : 0

  name        = "${local.name_prefix}-rds-sg"
  description = "Security group for country ${var.country_code} Aurora PostgreSQL"
  vpc_id      = var.regional_vpc_id

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-rds-sg"
    Purpose = "CountryDedicatedDatabase"
  })
}

resource "aws_security_group_rule" "country_rds_ingress" {
  count = var.dedicated_database ? 1 : 0

  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = var.regional_eks_node_sg_id
  security_group_id        = aws_security_group.country_rds[0].id
  description              = "PostgreSQL from EKS"
}

resource "aws_security_group_rule" "country_rds_ingress_self" {
  count = var.dedicated_database ? 1 : 0

  type              = "ingress"
  from_port         = 5432
  to_port           = 5432
  protocol          = "tcp"
  self              = true
  security_group_id = aws_security_group.country_rds[0].id
  description       = "PostgreSQL internal"
}

resource "aws_security_group_rule" "country_rds_egress" {
  count = var.dedicated_database ? 1 : 0

  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.country_rds[0].id
  description       = "Allow all egress"
}

# PostgreSQL Admin Password
resource "random_password" "country_postgresql_admin" {
  count = var.dedicated_database ? 1 : 0

  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "aws_secretsmanager_secret" "country_postgresql_admin" {
  count = var.dedicated_database ? 1 : 0

  name        = "${local.name_prefix}/postgresql-admin"
  description = "PostgreSQL admin credentials for ${local.name_prefix}"
  kms_key_id  = var.isolation_enabled ? aws_kms_key.country[0].arn : var.regional_kms_key_arn

  tags = local.common_tags
}

resource "aws_secretsmanager_secret_version" "country_postgresql_admin" {
  count = var.dedicated_database ? 1 : 0

  secret_id = aws_secretsmanager_secret.country_postgresql_admin[0].id
  secret_string = jsonencode({
    username = var.postgresql_admin_username
    password = random_password.country_postgresql_admin[0].result
  })
}

# RDS Parameter Groups
resource "aws_rds_cluster_parameter_group" "country" {
  count = var.dedicated_database ? 1 : 0

  name        = "${local.name_prefix}-aurora-cluster-pg"
  family      = "aurora-postgresql15"
  description = "Aurora PostgreSQL cluster parameter group for ${var.country_name}"

  parameter {
    name  = "log_statement"
    value = "all"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "1000"
  }

  tags = local.common_tags
}

resource "aws_db_parameter_group" "country" {
  count = var.dedicated_database ? 1 : 0

  name        = "${local.name_prefix}-aurora-instance-pg"
  family      = "aurora-postgresql15"
  description = "Aurora PostgreSQL instance parameter group for ${var.country_name}"

  parameter {
    name  = "log_connections"
    value = "1"
  }

  parameter {
    name  = "log_disconnections"
    value = "1"
  }

  tags = local.common_tags
}

# Aurora Cluster
resource "aws_rds_cluster" "country" {
  count = var.dedicated_database ? 1 : 0

  cluster_identifier = "${local.name_prefix}-aurora"
  engine             = "aurora-postgresql"
  engine_mode        = "provisioned"
  engine_version     = "15.4"
  database_name      = "unified_health_${var.country_code}"
  master_username    = var.postgresql_admin_username
  master_password    = random_password.country_postgresql_admin[0].result

  db_subnet_group_name            = aws_db_subnet_group.country[0].name
  vpc_security_group_ids          = [aws_security_group.country_rds[0].id]
  db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.country[0].name

  storage_encrypted = true
  kms_key_id        = var.isolation_enabled ? aws_kms_key.country[0].arn : var.regional_kms_key_arn

  backup_retention_period      = 35
  preferred_backup_window      = "03:00-04:00"
  preferred_maintenance_window = "sun:04:00-sun:05:00"
  copy_tags_to_snapshot        = true

  deletion_protection = var.environment == "prod"
  skip_final_snapshot = var.environment != "prod"

  enabled_cloudwatch_logs_exports = ["postgresql"]

  serverlessv2_scaling_configuration {
    min_capacity = var.environment == "prod" ? 2 : 0.5
    max_capacity = var.environment == "prod" ? 16 : 4
  }

  tags = merge(local.common_tags, {
    Name            = "${local.name_prefix}-aurora"
    Purpose         = "CountryDedicatedDatabase"
    DataSovereignty = "Enforced"
  })

  lifecycle {
    ignore_changes = [master_password]
  }
}

# Aurora Instance
resource "aws_rds_cluster_instance" "country" {
  count = var.dedicated_database ? (var.environment == "prod" ? 2 : 1) : 0

  identifier         = "${local.name_prefix}-aurora-${count.index + 1}"
  cluster_identifier = aws_rds_cluster.country[0].id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.country[0].engine
  engine_version     = aws_rds_cluster.country[0].engine_version

  db_parameter_group_name = aws_db_parameter_group.country[0].name

  publicly_accessible        = false
  auto_minor_version_upgrade = true

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-aurora-${count.index + 1}"
  })
}

# Store RDS connection info
resource "aws_secretsmanager_secret" "country_rds_connection" {
  count = var.dedicated_database ? 1 : 0

  name        = "${local.name_prefix}/rds-connection"
  description = "RDS connection details for ${local.name_prefix}"
  kms_key_id  = var.isolation_enabled ? aws_kms_key.country[0].arn : var.regional_kms_key_arn

  tags = local.common_tags
}

resource "aws_secretsmanager_secret_version" "country_rds_connection" {
  count = var.dedicated_database ? 1 : 0

  secret_id = aws_secretsmanager_secret.country_rds_connection[0].id
  secret_string = jsonencode({
    username = var.postgresql_admin_username
    password = random_password.country_postgresql_admin[0].result
    host     = aws_rds_cluster.country[0].endpoint
    port     = aws_rds_cluster.country[0].port
    database = "unified_health_${var.country_code}"
  })
}

# ============================================
# CloudWatch / Monitoring
# ============================================

resource "aws_cloudwatch_log_group" "country" {
  name              = "/aws/unified-health/${local.name_prefix}"
  retention_in_days = var.cloudwatch_retention_days

  tags = local.common_tags
}

# SNS Topic for Country Alerts
resource "aws_sns_topic" "country_alerts" {
  name              = "${local.name_prefix}-alerts"
  # Security: Always use KMS encryption for SNS topics
  kms_master_key_id = var.isolation_enabled ? aws_kms_key.country[0].id : var.regional_kms_key_arn

  tags = local.common_tags
}

resource "aws_sns_topic_subscription" "country_email" {
  count     = var.alert_email_address != "" ? 1 : 0
  topic_arn = aws_sns_topic.country_alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email_address
}

# CloudWatch Alarms for Country-Specific Database
resource "aws_cloudwatch_metric_alarm" "country_rds_cpu" {
  count = var.dedicated_database ? 1 : 0

  alarm_name          = "${local.name_prefix}-rds-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Aurora CPU utilization is high for ${var.country_name}"
  alarm_actions       = [aws_sns_topic.country_alerts.arn]

  dimensions = {
    DBClusterIdentifier = aws_rds_cluster.country[0].cluster_identifier
  }

  tags = local.common_tags
}

resource "aws_cloudwatch_metric_alarm" "country_rds_connections" {
  count = var.dedicated_database ? 1 : 0

  alarm_name          = "${local.name_prefix}-rds-connections-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = 100
  alarm_description   = "Aurora connection count is high for ${var.country_name}"
  alarm_actions       = [aws_sns_topic.country_alerts.arn]

  dimensions = {
    DBClusterIdentifier = aws_rds_cluster.country[0].cluster_identifier
  }

  tags = local.common_tags
}

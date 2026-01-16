# =============================================================================
# ECS Fargate Cluster Module
# =============================================================================
# This module creates an ECS cluster with Fargate capacity providers
# Replaces EKS cluster for serverless container orchestration
# =============================================================================

# -----------------------------------------------------------------------------
# ECS Cluster
# -----------------------------------------------------------------------------
resource "aws_ecs_cluster" "main" {
  name = "${var.project}-${var.environment}-cluster"

  setting {
    name  = "containerInsights"
    value = var.enable_container_insights ? "enabled" : "disabled"
  }

  configuration {
    execute_command_configuration {
      logging = "OVERRIDE"

      log_configuration {
        cloud_watch_log_group_name = aws_cloudwatch_log_group.ecs_exec.name
      }
    }
  }

  tags = merge(var.tags, {
    Name        = "${var.project}-${var.environment}-cluster"
    Environment = var.environment
    ManagedBy   = "terraform"
  })
}

# -----------------------------------------------------------------------------
# Capacity Providers (Fargate + Fargate Spot)
# -----------------------------------------------------------------------------
resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name = aws_ecs_cluster.main.name

  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = var.fargate_base_count
    weight            = var.fargate_weight
    capacity_provider = "FARGATE"
  }

  default_capacity_provider_strategy {
    weight            = var.fargate_spot_weight
    capacity_provider = "FARGATE_SPOT"
  }
}

# -----------------------------------------------------------------------------
# CloudWatch Log Groups
# -----------------------------------------------------------------------------
resource "aws_cloudwatch_log_group" "ecs_exec" {
  name              = "/aws/ecs/${var.project}-${var.environment}/exec"
  retention_in_days = var.log_retention_days

  tags = merge(var.tags, {
    Name = "${var.project}-${var.environment}-ecs-exec-logs"
  })
}

resource "aws_cloudwatch_log_group" "ecs_cluster" {
  name              = "/aws/ecs/${var.project}-${var.environment}/cluster"
  retention_in_days = var.log_retention_days

  tags = merge(var.tags, {
    Name = "${var.project}-${var.environment}-cluster-logs"
  })
}

# -----------------------------------------------------------------------------
# Task Execution Role (shared by all services)
# -----------------------------------------------------------------------------
resource "aws_iam_role" "task_execution" {
  name = "${var.project}-${var.environment}-ecs-task-execution"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(var.tags, {
    Name = "${var.project}-${var.environment}-ecs-task-execution"
  })
}

resource "aws_iam_role_policy_attachment" "task_execution" {
  role       = aws_iam_role.task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Additional permissions for Secrets Manager and SSM
resource "aws_iam_role_policy" "task_execution_secrets" {
  name = "${var.project}-${var.environment}-ecs-secrets"
  role = aws_iam_role.task_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = [
          "arn:aws:secretsmanager:${var.aws_region}:${data.aws_caller_identity.current.account_id}:secret:${var.project}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameters",
          "ssm:GetParameter"
        ]
        Resource = [
          "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/${var.project}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt"
        ]
        Resource = var.kms_key_arn != "" ? [var.kms_key_arn] : ["*"]
        Condition = var.kms_key_arn != "" ? {} : {
          StringEquals = {
            "kms:ViaService" = "secretsmanager.${var.aws_region}.amazonaws.com"
          }
        }
      }
    ]
  })
}

# -----------------------------------------------------------------------------
# Security Group for ECS Tasks
# -----------------------------------------------------------------------------
resource "aws_security_group" "ecs_tasks" {
  name        = "${var.project}-${var.environment}-ecs-tasks"
  description = "Security group for ECS Fargate tasks"
  vpc_id      = var.vpc_id

  # Allow inbound from ALB
  ingress {
    description     = "HTTP from ALB"
    from_port       = 3000
    to_port         = 8080
    protocol        = "tcp"
    security_groups = var.alb_security_group_ids
  }

  # Allow all outbound
  egress {
    description = "All outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "${var.project}-${var.environment}-ecs-tasks"
  })
}

# Allow ECS tasks to connect to RDS
resource "aws_security_group_rule" "ecs_to_rds" {
  count = var.rds_security_group_id != "" ? 1 : 0

  type                     = "egress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = var.rds_security_group_id
  security_group_id        = aws_security_group.ecs_tasks.id
  description              = "PostgreSQL to RDS"
}

# Allow ECS tasks to connect to ElastiCache
resource "aws_security_group_rule" "ecs_to_redis" {
  count = var.redis_security_group_id != "" ? 1 : 0

  type                     = "egress"
  from_port                = 6379
  to_port                  = 6379
  protocol                 = "tcp"
  source_security_group_id = var.redis_security_group_id
  security_group_id        = aws_security_group.ecs_tasks.id
  description              = "Redis to ElastiCache"
}

# -----------------------------------------------------------------------------
# Service Discovery Namespace (optional)
# -----------------------------------------------------------------------------
resource "aws_service_discovery_private_dns_namespace" "main" {
  count = var.enable_service_discovery ? 1 : 0

  name        = "${var.project}.${var.environment}.local"
  description = "Service discovery namespace for ${var.project} ${var.environment}"
  vpc         = var.vpc_id

  tags = merge(var.tags, {
    Name = "${var.project}-${var.environment}-service-discovery"
  })
}

# -----------------------------------------------------------------------------
# Data Sources
# -----------------------------------------------------------------------------
data "aws_caller_identity" "current" {}

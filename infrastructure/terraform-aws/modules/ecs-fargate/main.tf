# =============================================================================
# The Unified Health - ECS Fargate Module
# =============================================================================
# This module creates ECS Fargate infrastructure for deploying microservices.
# All services consume the asset-branding package with pinned versions.
#
# Version: 1.0.0
# Last Updated: 2026-01-08
# =============================================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# -----------------------------------------------------------------------------
# Local Variables
# -----------------------------------------------------------------------------

locals {
  cluster_name = "unified-health-${var.environment}"

  common_tags = merge(var.tags, {
    Component   = "ecs-fargate"
    ManagedBy   = "terraform"
    Environment = var.environment
    Product     = "The Unified Health"
    CostCenter  = "platform-infrastructure"
  })

  # Service configurations
  services = {
    "api-gateway" = {
      cpu    = 512
      memory = 1024
      port   = 3000
    }
    "auth-service" = {
      cpu    = 256
      memory = 512
      port   = 3001
    }
    "notification-service" = {
      cpu    = 256
      memory = 512
      port   = 3002
    }
    "telehealth-service" = {
      cpu    = 512
      memory = 1024
      port   = 3003
    }
    "pharmacy-service" = {
      cpu    = 256
      memory = 512
      port   = 3004
    }
    "laboratory-service" = {
      cpu    = 256
      memory = 512
      port   = 3005
    }
    "imaging-service" = {
      cpu    = 512
      memory = 1024
      port   = 3006
    }
    "mental-health-service" = {
      cpu    = 256
      memory = 512
      port   = 3007
    }
    "chronic-care-service" = {
      cpu    = 256
      memory = 512
      port   = 3008
    }
    "clinical-trials-service" = {
      cpu    = 256
      memory = 512
      port   = 3009
    }
    "denial-management-service" = {
      cpu    = 256
      memory = 512
      port   = 3010
    }
    "home-health-service" = {
      cpu    = 256
      memory = 512
      port   = 3011
    }
    "population-health-service" = {
      cpu    = 256
      memory = 512
      port   = 3012
    }
    "price-transparency-service" = {
      cpu    = 256
      memory = 512
      port   = 3013
    }
    "vendor-risk-service" = {
      cpu    = 256
      memory = 512
      port   = 3014
    }
    "interoperability-service" = {
      cpu    = 256
      memory = 512
      port   = 3015
    }
    "web-app" = {
      cpu    = 512
      memory = 1024
      port   = 3100
    }
    "admin-portal" = {
      cpu    = 256
      memory = 512
      port   = 3101
    }
    "provider-portal" = {
      cpu    = 512
      memory = 1024
      port   = 3102
    }
    "kiosk" = {
      cpu    = 256
      memory = 512
      port   = 3103
    }
    "mobile" = {
      cpu    = 256
      memory = 512
      port   = 3104
    }
  }
}

# -----------------------------------------------------------------------------
# ECS Cluster
# -----------------------------------------------------------------------------

resource "aws_ecs_cluster" "main" {
  name = local.cluster_name

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  configuration {
    execute_command_configuration {
      logging = "OVERRIDE"

      log_configuration {
        cloud_watch_encryption_enabled = true
        cloud_watch_log_group_name     = aws_cloudwatch_log_group.ecs_exec.name
      }
    }
  }

  tags = local.common_tags
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name = aws_ecs_cluster.main.name

  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = "FARGATE"
  }
}

# -----------------------------------------------------------------------------
# CloudWatch Log Groups
# -----------------------------------------------------------------------------

resource "aws_cloudwatch_log_group" "ecs_exec" {
  name              = "/ecs/${local.cluster_name}/exec"
  retention_in_days = 30

  tags = local.common_tags
}

resource "aws_cloudwatch_log_group" "services" {
  for_each = local.services

  name              = "/ecs/${local.cluster_name}/${each.key}"
  retention_in_days = var.log_retention_days

  tags = merge(local.common_tags, {
    Service = each.key
  })
}

# -----------------------------------------------------------------------------
# IAM Roles
# -----------------------------------------------------------------------------

# Task Execution Role
resource "aws_iam_role" "ecs_task_execution" {
  name = "${local.cluster_name}-task-execution"

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

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "ecs_task_execution_secrets" {
  name = "secrets-access"
  role = aws_iam_role.ecs_task_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "ssm:GetParameters",
          "ssm:GetParameter"
        ]
        Resource = [
          "arn:aws:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:unified-health/*",
          "arn:aws:ssm:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:parameter/unified-health/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ]
        Resource = "*"
      }
    ]
  })
}

# Task Role
resource "aws_iam_role" "ecs_task" {
  name = "${local.cluster_name}-task"

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

  tags = local.common_tags
}

resource "aws_iam_role_policy" "ecs_task" {
  name = "task-permissions"
  role = aws_iam_role.ecs_task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssmmessages:CreateControlChannel",
          "ssmmessages:CreateDataChannel",
          "ssmmessages:OpenControlChannel",
          "ssmmessages:OpenDataChannel"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "xray:PutTraceSegments",
          "xray:PutTelemetryRecords"
        ]
        Resource = "*"
      }
    ]
  })
}

# -----------------------------------------------------------------------------
# Task Definitions
# -----------------------------------------------------------------------------

resource "aws_ecs_task_definition" "services" {
  for_each = local.services

  family                   = "${local.cluster_name}-${each.key}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = each.value.cpu
  memory                   = each.value.memory
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name      = each.key
      image     = "${var.ecr_repository_url}/${each.key}:${var.service_versions[each.key]}"
      essential = true

      portMappings = [
        {
          containerPort = each.value.port
          hostPort      = each.value.port
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "NODE_ENV"
          value = var.environment
        },
        {
          name  = "PORT"
          value = tostring(each.value.port)
        },
        {
          name  = "ASSET_BRANDING_VERSION"
          value = var.asset_branding_version
        }
      ]

      secrets = [
        {
          name      = "DATABASE_URL"
          valueFrom = "arn:aws:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:unified-health/${var.environment}/database-url"
        },
        {
          name      = "JWT_SECRET"
          valueFrom = "arn:aws:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:unified-health/${var.environment}/jwt-secret"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.services[each.key].name
          "awslogs-region"        = data.aws_region.current.name
          "awslogs-stream-prefix" = "ecs"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:${each.value.port}/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    }
  ])

  tags = merge(local.common_tags, {
    Service              = each.key
    AssetBrandingVersion = var.asset_branding_version
  })
}

# -----------------------------------------------------------------------------
# ECS Services
# -----------------------------------------------------------------------------

resource "aws_ecs_service" "services" {
  for_each = local.services

  name            = each.key
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.services[each.key].arn
  desired_count   = var.environment == "prod" ? 2 : 1
  launch_type     = "FARGATE"

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  deployment_configuration {
    maximum_percent         = 200
    minimum_healthy_percent = 100
  }

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.target_group_arns[each.key]
    container_name   = each.key
    container_port   = each.value.port
  }

  enable_execute_command = true

  tags = merge(local.common_tags, {
    Service = each.key
  })

  lifecycle {
    ignore_changes = [desired_count]
  }
}

# -----------------------------------------------------------------------------
# Security Groups
# -----------------------------------------------------------------------------

resource "aws_security_group" "ecs_tasks" {
  name        = "${local.cluster_name}-ecs-tasks"
  description = "Security group for ECS tasks"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Allow traffic from ALB"
    from_port       = 0
    to_port         = 65535
    protocol        = "tcp"
    security_groups = var.alb_security_group_ids
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}

# -----------------------------------------------------------------------------
# Auto Scaling
# -----------------------------------------------------------------------------

resource "aws_appautoscaling_target" "services" {
  for_each = local.services

  max_capacity       = var.environment == "prod" ? 10 : 3
  min_capacity       = var.environment == "prod" ? 2 : 1
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.services[each.key].name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "cpu" {
  for_each = local.services

  name               = "${each.key}-cpu-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.services[each.key].resource_id
  scalable_dimension = aws_appautoscaling_target.services[each.key].scalable_dimension
  service_namespace  = aws_appautoscaling_target.services[each.key].service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}

resource "aws_appautoscaling_policy" "memory" {
  for_each = local.services

  name               = "${each.key}-memory-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.services[each.key].resource_id
  scalable_dimension = aws_appautoscaling_target.services[each.key].scalable_dimension
  service_namespace  = aws_appautoscaling_target.services[each.key].service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }
    target_value       = 80.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}

# -----------------------------------------------------------------------------
# Data Sources
# -----------------------------------------------------------------------------

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

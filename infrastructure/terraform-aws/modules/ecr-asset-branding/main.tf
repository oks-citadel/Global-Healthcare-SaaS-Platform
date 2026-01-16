# =============================================================================
# The Unified Health - Asset Branding ECR Repository
# =============================================================================
# This module creates the ECR repository for the asset-branding package.
# The branding assets are versioned and immutable - no :latest tags allowed.
#
# Version: 1.0.0
# Last Updated: 2026-01-08
# =============================================================================

terraform {
  required_version = ">= 1.6.0"

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
  repository_name = "unified-health-prod/asset-branding"

  common_tags = merge(var.tags, {
    Component   = "asset-branding"
    ManagedBy   = "terraform"
    Environment = var.environment
    Product     = "The Unified Health"
    CostCenter  = "platform-infrastructure"
  })
}

# -----------------------------------------------------------------------------
# ECR Repository
# -----------------------------------------------------------------------------

resource "aws_ecr_repository" "asset_branding" {
  name                 = local.repository_name
  image_tag_mutability = "IMMUTABLE" # CRITICAL: No mutable tags allowed

  encryption_configuration {
    encryption_type = "KMS"
    kms_key         = var.kms_key_arn != "" ? var.kms_key_arn : null
  }

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = local.common_tags
}

# -----------------------------------------------------------------------------
# ECR Lifecycle Policy
# -----------------------------------------------------------------------------

resource "aws_ecr_lifecycle_policy" "asset_branding" {
  repository = aws_ecr_repository.asset_branding.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Expire untagged images after 7 days"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 7
        }
        action = {
          type = "expire"
        }
      },
      {
        rulePriority = 2
        description  = "Keep last 50 tagged images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v"]
          countType     = "imageCountMoreThan"
          countNumber   = 50
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

# -----------------------------------------------------------------------------
# ECR Repository Policy
# -----------------------------------------------------------------------------

resource "aws_ecr_repository_policy" "asset_branding" {
  repository = aws_ecr_repository.asset_branding.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowPullFromECS"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability"
        ]
      },
      {
        Sid    = "AllowPullFromCodeBuild"
        Effect = "Allow"
        Principal = {
          Service = "codebuild.amazonaws.com"
        }
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability"
        ]
        Condition = {
          StringEquals = {
            "aws:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      },
      {
        Sid    = "AllowCrossAccountPull"
        Effect = "Allow"
        Principal = {
          AWS = var.allowed_account_ids
        }
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:DescribeImages",
          "ecr:DescribeRepositories"
        ]
      }
    ]
  })
}

# -----------------------------------------------------------------------------
# Data Sources
# -----------------------------------------------------------------------------

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

# -----------------------------------------------------------------------------
# Replication Configuration (for multi-region)
# -----------------------------------------------------------------------------

resource "aws_ecr_replication_configuration" "asset_branding" {
  count = length(var.replication_regions) > 0 ? 1 : 0

  replication_configuration {
    rule {
      dynamic "destination" {
        for_each = var.replication_regions
        content {
          region      = destination.value
          registry_id = data.aws_caller_identity.current.account_id
        }
      }

      repository_filter {
        filter      = local.repository_name
        filter_type = "PREFIX_MATCH"
      }
    }
  }
}

# -----------------------------------------------------------------------------
# CloudWatch Alarms
# -----------------------------------------------------------------------------

resource "aws_cloudwatch_metric_alarm" "image_scan_findings" {
  alarm_name          = "${local.repository_name}-critical-vulnerabilities"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "ImageScanFindingsSeverityCritical"
  namespace           = "AWS/ECR"
  period              = 300
  statistic           = "Maximum"
  threshold           = 0
  alarm_description   = "Critical vulnerabilities detected in asset-branding images"

  dimensions = {
    RepositoryName = aws_ecr_repository.asset_branding.name
  }

  alarm_actions = var.alarm_sns_topic_arn != "" ? [var.alarm_sns_topic_arn] : []

  tags = local.common_tags
}

# -----------------------------------------------------------------------------
# SSM Parameters for Version Tracking
# -----------------------------------------------------------------------------

resource "aws_ssm_parameter" "current_version" {
  name        = "/unified-health/${var.environment}/asset-branding/current-version"
  description = "Current deployed version of asset-branding"
  type        = "String"
  value       = var.initial_version

  lifecycle {
    ignore_changes = [value]
  }

  tags = local.common_tags
}

resource "aws_ssm_parameter" "repository_url" {
  name        = "/unified-health/${var.environment}/asset-branding/repository-url"
  description = "ECR repository URL for asset-branding"
  type        = "String"
  value       = aws_ecr_repository.asset_branding.repository_url

  tags = local.common_tags
}

# -----------------------------------------------------------------------------
# IAM Policy for Pushing Images
# -----------------------------------------------------------------------------

resource "aws_iam_policy" "ecr_push" {
  name        = "asset-branding-ecr-push-${var.environment}"
  description = "Policy to allow pushing images to asset-branding ECR repository"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "GetAuthToken"
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      },
      {
        Sid    = "PushPullImages"
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:DescribeImages",
          "ecr:DescribeRepositories",
          "ecr:ListImages"
        ]
        Resource = aws_ecr_repository.asset_branding.arn
      }
    ]
  })

  tags = local.common_tags
}

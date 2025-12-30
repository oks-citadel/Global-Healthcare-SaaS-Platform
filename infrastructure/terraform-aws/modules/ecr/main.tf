# ============================================
# AWS ECR Module
# ============================================
# Replaces: Azure Container Registry (ACR)
# Translation: ACR → ECR, Geo-replication → Cross-region replication
# ============================================

locals {
  name = "${var.project_name}-${var.environment}"

  tags = merge(var.tags, {
    Module = "ecr"
  })
}

# ============================================
# ECR Repositories
# ============================================

resource "aws_ecr_repository" "services" {
  for_each = toset(var.repository_names)

  name                 = "${local.name}/${each.value}"
  image_tag_mutability = var.image_tag_mutability

  image_scanning_configuration {
    scan_on_push = var.scan_on_push
  }

  encryption_configuration {
    encryption_type = "KMS"
    kms_key         = var.kms_key_arn != "" ? var.kms_key_arn : aws_kms_key.ecr[0].arn
  }

  tags = merge(local.tags, {
    Name    = "${local.name}/${each.value}"
    Service = each.value
  })
}

# ============================================
# ECR KMS Key
# ============================================

resource "aws_kms_key" "ecr" {
  count                   = var.kms_key_arn == "" ? 1 : 0
  description             = "KMS key for ECR encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = merge(local.tags, {
    Name = "${local.name}-ecr-kms"
  })
}

resource "aws_kms_alias" "ecr" {
  count         = var.kms_key_arn == "" ? 1 : 0
  name          = "alias/${local.name}-ecr"
  target_key_id = aws_kms_key.ecr[0].key_id
}

# ============================================
# ECR Lifecycle Policies
# ============================================

resource "aws_ecr_lifecycle_policy" "services" {
  for_each   = aws_ecr_repository.services
  repository = each.value.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last ${var.image_count_to_keep} images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v", "release"]
          countType     = "imageCountMoreThan"
          countNumber   = var.image_count_to_keep
        }
        action = {
          type = "expire"
        }
      },
      {
        rulePriority = 2
        description  = "Expire untagged images older than ${var.untagged_image_expiry_days} days"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = var.untagged_image_expiry_days
        }
        action = {
          type = "expire"
        }
      },
      {
        rulePriority = 3
        description  = "Expire dev/feature images older than ${var.dev_image_expiry_days} days"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["dev", "feature", "pr"]
          countType     = "sinceImagePushed"
          countUnit     = "days"
          countNumber   = var.dev_image_expiry_days
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

# ============================================
# ECR Repository Policy (Cross-account access)
# ============================================

resource "aws_ecr_repository_policy" "services" {
  for_each   = var.cross_account_access_arns != [] ? aws_ecr_repository.services : {}
  repository = each.value.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "CrossAccountAccess"
        Effect = "Allow"
        Principal = {
          AWS = var.cross_account_access_arns
        }
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability"
        ]
      }
    ]
  })
}

# ============================================
# ECR Replication (Cross-region)
# ============================================

resource "aws_ecr_replication_configuration" "main" {
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

      dynamic "repository_filter" {
        for_each = var.replication_repository_filters
        content {
          filter      = repository_filter.value
          filter_type = "PREFIX_MATCH"
        }
      }
    }
  }
}

data "aws_caller_identity" "current" {}

# ============================================
# ECR Pull Through Cache (Optional)
# ============================================

resource "aws_ecr_pull_through_cache_rule" "dockerhub" {
  count                 = var.enable_pull_through_cache ? 1 : 0
  ecr_repository_prefix = "dockerhub"
  upstream_registry_url = "registry-1.docker.io"
  credential_arn        = var.dockerhub_credentials_arn
}

resource "aws_ecr_pull_through_cache_rule" "ghcr" {
  count                 = var.enable_pull_through_cache ? 1 : 0
  ecr_repository_prefix = "ghcr"
  upstream_registry_url = "ghcr.io"
  credential_arn        = var.ghcr_credentials_arn
}

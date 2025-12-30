# ============================================
# AWS Secrets Manager Module
# ============================================
# Replaces: Azure Key Vault
# Translation: Key Vault → Secrets Manager + KMS
# ============================================

locals {
  name = "${var.project_name}-${var.environment}-${var.region_name}"

  tags = merge(var.tags, {
    Module = "secrets-manager"
  })
}

# ============================================
# KMS Key for Secrets Encryption
# ============================================

resource "aws_kms_key" "secrets" {
  description             = "KMS key for Secrets Manager ${local.name}"
  deletion_window_in_days = var.kms_deletion_window
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
      },
      {
        Sid    = "Allow EKS Service Accounts"
        Effect = "Allow"
        Principal = {
          AWS = var.eks_node_role_arn
        }
        Action = [
          "kms:Decrypt",
          "kms:DescribeKey"
        ]
        Resource = "*"
      }
    ]
  })

  tags = merge(local.tags, {
    Name = "${local.name}-secrets-kms"
  })
}

resource "aws_kms_alias" "secrets" {
  name          = "alias/${local.name}-secrets"
  target_key_id = aws_kms_key.secrets.key_id
}

data "aws_caller_identity" "current" {}

# ============================================
# Secrets Manager Secrets
# ============================================

# Application secrets placeholder
resource "aws_secretsmanager_secret" "app_secrets" {
  for_each = var.application_secrets

  name        = "${local.name}/${each.key}"
  description = each.value.description
  kms_key_id  = aws_kms_key.secrets.arn

  tags = merge(local.tags, {
    Name    = "${local.name}/${each.key}"
    Purpose = each.value.purpose
  })
}

resource "aws_secretsmanager_secret_version" "app_secrets" {
  for_each = var.application_secrets

  secret_id     = aws_secretsmanager_secret.app_secrets[each.key].id
  secret_string = each.value.initial_value
}

# ============================================
# IAM Policy for Secrets Access
# ============================================

resource "aws_iam_policy" "secrets_read" {
  name        = "${local.name}-secrets-read"
  description = "Allow reading secrets from Secrets Manager"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "SecretsManagerRead"
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = [
          "arn:aws:secretsmanager:*:${data.aws_caller_identity.current.account_id}:secret:${local.name}/*"
        ]
      },
      {
        Sid    = "KMSDecrypt"
        Effect = "Allow"
        Action = [
          "kms:Decrypt",
          "kms:DescribeKey"
        ]
        Resource = [aws_kms_key.secrets.arn]
      }
    ]
  })

  tags = local.tags
}

# ============================================
# Secrets Rotation (Optional)
# ============================================

resource "aws_secretsmanager_secret_rotation" "app_secrets" {
  for_each = { for k, v in var.application_secrets : k => v if v.enable_rotation }

  secret_id           = aws_secretsmanager_secret.app_secrets[each.key].id
  rotation_lambda_arn = var.rotation_lambda_arn

  rotation_rules {
    automatically_after_days = each.value.rotation_days
  }
}

# ============================================
# Resource Policy for Cross-Account Access
# ============================================

resource "aws_secretsmanager_secret_policy" "cross_account" {
  for_each = { for k, v in var.application_secrets : k => v if length(var.cross_account_access_arns) > 0 }

  secret_arn = aws_secretsmanager_secret.app_secrets[each.key].arn

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
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = "*"
      }
    ]
  })
}

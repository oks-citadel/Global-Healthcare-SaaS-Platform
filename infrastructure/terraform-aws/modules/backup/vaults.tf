# ============================================
# AWS Backup Module - Backup Vaults
# ============================================

locals {
  name       = var.region_name != "" ? "${var.project_name}-${var.environment}-${var.region_name}" : "${var.project_name}-${var.environment}"
  vault_name = var.vault_name != "" ? var.vault_name : "${local.name}-backup-vault"

  tags = merge(var.tags, {
    Module = "backup"
  })
}

# ============================================
# Data Sources
# ============================================

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# ============================================
# KMS Key for Backup Vault Encryption
# ============================================

resource "aws_kms_key" "backup" {
  count = var.kms_key_arn == "" ? 1 : 0

  description             = "KMS key for AWS Backup vault encryption - ${local.name}"
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
        Sid    = "Allow Backup Service"
        Effect = "Allow"
        Principal = {
          Service = "backup.amazonaws.com"
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey",
          "kms:CreateGrant"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "kms:CallerAccount" = data.aws_caller_identity.current.account_id
          }
        }
      }
    ]
  })

  tags = merge(local.tags, {
    Name = "${local.name}-backup-kms"
  })
}

resource "aws_kms_alias" "backup" {
  count = var.kms_key_arn == "" ? 1 : 0

  name          = "alias/${local.name}-backup"
  target_key_id = aws_kms_key.backup[0].key_id
}

# ============================================
# Backup Vault
# ============================================

resource "aws_backup_vault" "main" {
  name        = local.vault_name
  kms_key_arn = var.kms_key_arn != "" ? var.kms_key_arn : aws_kms_key.backup[0].arn

  tags = merge(local.tags, {
    Name        = local.vault_name
    Environment = var.environment
  })
}

# ============================================
# Backup Vault Policy
# ============================================

resource "aws_backup_vault_policy" "main" {
  backup_vault_name = aws_backup_vault.main.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowAccountAccess"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action = [
          "backup:DescribeBackupVault",
          "backup:DeleteBackupVault",
          "backup:PutBackupVaultAccessPolicy",
          "backup:DeleteBackupVaultAccessPolicy",
          "backup:GetBackupVaultAccessPolicy",
          "backup:StartBackupJob",
          "backup:GetBackupVaultNotifications",
          "backup:PutBackupVaultNotifications",
          "backup:DeleteBackupVaultNotifications",
          "backup:ListRecoveryPointsByBackupVault"
        ]
        Resource = aws_backup_vault.main.arn
      },
      {
        Sid    = "DenyDeleteRecoveryPoints"
        Effect = "Deny"
        Principal = "*"
        Action   = "backup:DeleteRecoveryPoint"
        Resource = aws_backup_vault.main.arn
        Condition = {
          StringNotEquals = {
            "aws:PrincipalAccount" = data.aws_caller_identity.current.account_id
          }
        }
      }
    ]
  })
}

# ============================================
# Backup Vault Lock (Optional - Compliance)
# ============================================

resource "aws_backup_vault_lock_configuration" "main" {
  count = var.enable_vault_lock ? 1 : 0

  backup_vault_name   = aws_backup_vault.main.name
  min_retention_days  = var.vault_lock_min_retention_days
  max_retention_days  = var.vault_lock_max_retention_days
  changeable_for_days = var.vault_lock_changeable_for_days
}

# ============================================
# Backup Vault Notifications
# ============================================

resource "aws_sns_topic" "backup_notifications" {
  count = var.enable_notifications && var.notification_sns_topic_arn == "" ? 1 : 0

  name         = "${local.name}-backup-notifications"
  display_name = "AWS Backup Notifications for ${var.project_name}"

  kms_master_key_id = var.kms_key_arn != "" ? var.kms_key_arn : aws_kms_key.backup[0].id

  tags = merge(local.tags, {
    Name = "${local.name}-backup-notifications"
  })
}

resource "aws_sns_topic_policy" "backup_notifications" {
  count = var.enable_notifications && var.notification_sns_topic_arn == "" ? 1 : 0

  arn = aws_sns_topic.backup_notifications[0].arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowBackupService"
        Effect = "Allow"
        Principal = {
          Service = "backup.amazonaws.com"
        }
        Action   = "SNS:Publish"
        Resource = aws_sns_topic.backup_notifications[0].arn
        Condition = {
          StringEquals = {
            "aws:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      },
      {
        Sid    = "AllowAccountOwner"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action = [
          "SNS:Subscribe",
          "SNS:SetTopicAttributes",
          "SNS:Receive",
          "SNS:Publish",
          "SNS:ListSubscriptionsByTopic",
          "SNS:GetTopicAttributes"
        ]
        Resource = aws_sns_topic.backup_notifications[0].arn
      }
    ]
  })
}

resource "aws_sns_topic_subscription" "backup_email" {
  count = var.enable_notifications && var.notification_sns_topic_arn == "" ? length(var.notification_emails) : 0

  topic_arn = aws_sns_topic.backup_notifications[0].arn
  protocol  = "email"
  endpoint  = var.notification_emails[count.index]
}

resource "aws_backup_vault_notifications" "main" {
  count = var.enable_notifications ? 1 : 0

  backup_vault_name   = aws_backup_vault.main.name
  sns_topic_arn       = var.notification_sns_topic_arn != "" ? var.notification_sns_topic_arn : aws_sns_topic.backup_notifications[0].arn
  backup_vault_events = var.notification_events
}

# ============================================
# AWS Backup Module - Backup Plans
# ============================================

locals {
  plan_name = var.backup_plan_name != "" ? var.backup_plan_name : "${local.name}-backup-plan"
}

# ============================================
# IAM Role for AWS Backup
# ============================================

resource "aws_iam_role" "backup" {
  name = "${local.name}-backup-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "backup.amazonaws.com"
        }
      }
    ]
  })

  tags = local.tags
}

resource "aws_iam_role_policy_attachment" "backup" {
  role       = aws_iam_role.backup.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup"
}

resource "aws_iam_role_policy_attachment" "restore" {
  role       = aws_iam_role.backup.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForRestores"
}

# Additional policy for S3 backup
resource "aws_iam_role_policy_attachment" "s3_backup" {
  role       = aws_iam_role.backup.name
  policy_arn = "arn:aws:iam::aws:policy/AWSBackupServiceRolePolicyForS3Backup"
}

resource "aws_iam_role_policy_attachment" "s3_restore" {
  role       = aws_iam_role.backup.name
  policy_arn = "arn:aws:iam::aws:policy/AWSBackupServiceRolePolicyForS3Restore"
}

# ============================================
# Backup Plan
# ============================================

resource "aws_backup_plan" "main" {
  name = local.plan_name

  # Daily Backup Rule
  rule {
    rule_name         = "daily-backup"
    target_vault_name = aws_backup_vault.main.name
    schedule          = var.daily_backup_schedule
    start_window      = 60
    completion_window = var.backup_window_minutes

    # Enable continuous backup for point-in-time recovery
    enable_continuous_backup = var.enable_continuous_backup

    lifecycle {
      cold_storage_after = var.daily_backup_cold_storage_after_days > 0 ? var.daily_backup_cold_storage_after_days : null
      delete_after       = var.daily_backup_retention_days
    }

    # Cross-region copy (optional)
    dynamic "copy_action" {
      for_each = var.enable_cross_region_copy && var.copy_destination_vault_arn != "" ? [1] : []
      content {
        destination_vault_arn = var.copy_destination_vault_arn
        lifecycle {
          delete_after = var.copy_retention_days
        }
      }
    }

    recovery_point_tags = merge(local.tags, {
      BackupType = "Daily"
    })
  }

  # Weekly Backup Rule (optional)
  dynamic "rule" {
    for_each = var.enable_weekly_backup ? [1] : []
    content {
      rule_name         = "weekly-backup"
      target_vault_name = aws_backup_vault.main.name
      schedule          = var.weekly_backup_schedule
      start_window      = 60
      completion_window = var.backup_window_minutes

      lifecycle {
        cold_storage_after = var.weekly_backup_cold_storage_after_days > 0 ? var.weekly_backup_cold_storage_after_days : null
        delete_after       = var.weekly_backup_retention_days
      }

      dynamic "copy_action" {
        for_each = var.enable_cross_region_copy && var.copy_destination_vault_arn != "" ? [1] : []
        content {
          destination_vault_arn = var.copy_destination_vault_arn
          lifecycle {
            delete_after = var.weekly_backup_retention_days
          }
        }
      }

      recovery_point_tags = merge(local.tags, {
        BackupType = "Weekly"
      })
    }
  }

  # Monthly Backup Rule (optional)
  dynamic "rule" {
    for_each = var.enable_monthly_backup ? [1] : []
    content {
      rule_name         = "monthly-backup"
      target_vault_name = aws_backup_vault.main.name
      schedule          = var.monthly_backup_schedule
      start_window      = 60
      completion_window = var.backup_window_minutes

      lifecycle {
        cold_storage_after = var.monthly_backup_cold_storage_after_days > 0 ? var.monthly_backup_cold_storage_after_days : null
        delete_after       = var.monthly_backup_retention_days
      }

      dynamic "copy_action" {
        for_each = var.enable_cross_region_copy && var.copy_destination_vault_arn != "" ? [1] : []
        content {
          destination_vault_arn = var.copy_destination_vault_arn
          lifecycle {
            delete_after = var.monthly_backup_retention_days
          }
        }
      }

      recovery_point_tags = merge(local.tags, {
        BackupType = "Monthly"
      })
    }
  }

  # Advanced backup settings
  advanced_backup_setting {
    backup_options = {
      WindowsVSS = var.enable_windows_vss ? "enabled" : "disabled"
    }
    resource_type = "EC2"
  }

  tags = merge(local.tags, {
    Name        = local.plan_name
    Environment = var.environment
  })
}

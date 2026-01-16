# ============================================
# AWS Backup Module Outputs
# ============================================

# ============================================
# Vault Outputs
# ============================================

output "vault_arn" {
  description = "ARN of the backup vault"
  value       = aws_backup_vault.main.arn
}

output "vault_id" {
  description = "ID of the backup vault"
  value       = aws_backup_vault.main.id
}

output "vault_name" {
  description = "Name of the backup vault"
  value       = aws_backup_vault.main.name
}

output "vault_recovery_points" {
  description = "Number of recovery points in the vault"
  value       = aws_backup_vault.main.recovery_points
}

# ============================================
# Plan Outputs
# ============================================

output "plan_arn" {
  description = "ARN of the backup plan"
  value       = aws_backup_plan.main.arn
}

output "plan_id" {
  description = "ID of the backup plan"
  value       = aws_backup_plan.main.id
}

output "plan_name" {
  description = "Name of the backup plan"
  value       = aws_backup_plan.main.name
}

output "plan_version" {
  description = "Version of the backup plan"
  value       = aws_backup_plan.main.version
}

# ============================================
# Selection Outputs
# ============================================

output "selection_ids" {
  description = "Map of backup selection IDs"
  value = {
    resources = length(aws_backup_selection.resources) > 0 ? aws_backup_selection.resources[0].id : null
    tags      = length(aws_backup_selection.tags) > 0 ? aws_backup_selection.tags[0].id : null
    rds       = aws_backup_selection.rds.id
    ebs       = aws_backup_selection.ebs.id
    dynamodb  = aws_backup_selection.dynamodb.id
    efs       = aws_backup_selection.efs.id
    aurora    = aws_backup_selection.aurora.id
  }
}

# ============================================
# IAM Outputs
# ============================================

output "backup_role_arn" {
  description = "ARN of the IAM role used for backups"
  value       = aws_iam_role.backup.arn
}

output "backup_role_name" {
  description = "Name of the IAM role used for backups"
  value       = aws_iam_role.backup.name
}

# ============================================
# KMS Outputs
# ============================================

output "kms_key_arn" {
  description = "ARN of the KMS key used for backup encryption"
  value       = var.kms_key_arn != "" ? var.kms_key_arn : try(aws_kms_key.backup[0].arn, "")
}

output "kms_key_id" {
  description = "ID of the KMS key used for backup encryption"
  value       = var.kms_key_arn != "" ? null : try(aws_kms_key.backup[0].key_id, "")
}

# ============================================
# Notification Outputs
# ============================================

output "notification_sns_topic_arn" {
  description = "ARN of the SNS topic for backup notifications"
  value       = var.enable_notifications ? (var.notification_sns_topic_arn != "" ? var.notification_sns_topic_arn : try(aws_sns_topic.backup_notifications[0].arn, "")) : null
}

# ============================================
# Vault Lock Outputs
# ============================================

output "vault_lock_enabled" {
  description = "Whether vault lock is enabled"
  value       = var.enable_vault_lock
}

output "vault_lock_min_retention" {
  description = "Minimum retention days when vault lock is enabled"
  value       = var.enable_vault_lock ? var.vault_lock_min_retention_days : null
}

output "vault_lock_max_retention" {
  description = "Maximum retention days when vault lock is enabled"
  value       = var.enable_vault_lock ? var.vault_lock_max_retention_days : null
}

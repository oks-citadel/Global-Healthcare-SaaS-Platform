# ============================================
# Secrets Manager Module Outputs
# ============================================

output "kms_key_arn" {
  description = "KMS key ARN for secrets encryption"
  value       = aws_kms_key.secrets.arn
}

output "kms_key_id" {
  description = "KMS key ID"
  value       = aws_kms_key.secrets.key_id
}

output "secret_arns" {
  description = "Map of secret names to ARNs"
  value       = { for k, v in aws_secretsmanager_secret.app_secrets : k => v.arn }
}

output "secret_names" {
  description = "Map of secret keys to full names"
  value       = { for k, v in aws_secretsmanager_secret.app_secrets : k => v.name }
}

output "secrets_read_policy_arn" {
  description = "IAM policy ARN for secrets read access"
  value       = aws_iam_policy.secrets_read.arn
}

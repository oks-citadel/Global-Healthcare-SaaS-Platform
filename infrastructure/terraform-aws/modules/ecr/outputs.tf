# ============================================
# ECR Module Outputs
# ============================================

output "repository_urls" {
  description = "Map of repository names to URLs"
  value       = { for k, v in aws_ecr_repository.services : k => v.repository_url }
}

output "repository_arns" {
  description = "Map of repository names to ARNs"
  value       = { for k, v in aws_ecr_repository.services : k => v.arn }
}

output "registry_id" {
  description = "ECR registry ID"
  value       = try(values(aws_ecr_repository.services)[0].registry_id, "")
}

output "kms_key_arn" {
  description = "KMS key ARN used for encryption"
  value       = var.kms_key_arn != "" ? var.kms_key_arn : try(aws_kms_key.ecr[0].arn, "")
}

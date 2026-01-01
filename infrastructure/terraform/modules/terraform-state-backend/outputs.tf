# ============================================
# Terraform State Backend - Outputs
# ============================================

output "s3_bucket_name" {
  description = "Name of the S3 bucket for Terraform state"
  value       = aws_s3_bucket.terraform_state.id
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket for Terraform state"
  value       = aws_s3_bucket.terraform_state.arn
}

output "dynamodb_table_name" {
  description = "Name of the DynamoDB table for state locking"
  value       = aws_dynamodb_table.terraform_locks.name
}

output "dynamodb_table_arn" {
  description = "ARN of the DynamoDB table for state locking"
  value       = aws_dynamodb_table.terraform_locks.arn
}

output "kms_key_arn" {
  description = "ARN of the KMS key for state encryption (if enabled)"
  value       = var.use_kms_encryption ? aws_kms_key.terraform_state[0].arn : null
}

output "kms_key_alias" {
  description = "Alias of the KMS key for state encryption (if enabled)"
  value       = var.use_kms_encryption ? aws_kms_alias.terraform_state[0].name : null
}

output "backend_config" {
  description = "Backend configuration values to use in tfbackend file"
  value = {
    bucket         = aws_s3_bucket.terraform_state.id
    region         = data.aws_region.current.name
    dynamodb_table = aws_dynamodb_table.terraform_locks.name
    encrypt        = true
    kms_key_id     = var.use_kms_encryption ? aws_kms_key.terraform_state[0].arn : null
  }
}

# ============================================
# Data Sources for Outputs
# ============================================

data "aws_region" "current" {}

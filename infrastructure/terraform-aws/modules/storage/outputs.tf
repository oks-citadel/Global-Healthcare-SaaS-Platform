# ============================================
# Storage Module Outputs
# ============================================

output "main_bucket_id" {
  description = "Main S3 bucket ID"
  value       = aws_s3_bucket.main.id
}

output "main_bucket_arn" {
  description = "Main S3 bucket ARN"
  value       = aws_s3_bucket.main.arn
}

output "main_bucket_regional_domain_name" {
  description = "Main S3 bucket regional domain name"
  value       = aws_s3_bucket.main.bucket_regional_domain_name
}

output "logs_bucket_id" {
  description = "Logs S3 bucket ID"
  value       = aws_s3_bucket.logs.id
}

output "logs_bucket_arn" {
  description = "Logs S3 bucket ARN"
  value       = aws_s3_bucket.logs.arn
}

output "logs_bucket_domain_name" {
  description = "Logs S3 bucket domain name"
  value       = aws_s3_bucket.logs.bucket_domain_name
}

output "backups_bucket_id" {
  description = "Backups S3 bucket ID"
  value       = aws_s3_bucket.backups.id
}

output "backups_bucket_arn" {
  description = "Backups S3 bucket ARN"
  value       = aws_s3_bucket.backups.arn
}

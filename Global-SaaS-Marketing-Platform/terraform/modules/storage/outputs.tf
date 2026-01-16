################################################################################
# Outputs - Storage Module
# Global SaaS Marketing Platform
################################################################################

# Public Assets Bucket Outputs
output "public_assets_bucket_id" {
  description = "ID of the public assets S3 bucket"
  value       = aws_s3_bucket.public_assets.id
}

output "public_assets_bucket_arn" {
  description = "ARN of the public assets S3 bucket"
  value       = aws_s3_bucket.public_assets.arn
}

output "public_assets_bucket_domain_name" {
  description = "Domain name of the public assets S3 bucket"
  value       = aws_s3_bucket.public_assets.bucket_domain_name
}

output "public_assets_bucket_regional_domain_name" {
  description = "Regional domain name of the public assets S3 bucket"
  value       = aws_s3_bucket.public_assets.bucket_regional_domain_name
}

# Private Bucket Outputs
output "private_bucket_id" {
  description = "ID of the private S3 bucket"
  value       = aws_s3_bucket.private.id
}

output "private_bucket_arn" {
  description = "ARN of the private S3 bucket"
  value       = aws_s3_bucket.private.arn
}

output "private_bucket_domain_name" {
  description = "Domain name of the private S3 bucket"
  value       = aws_s3_bucket.private.bucket_domain_name
}

# Logs Bucket Outputs
output "logs_bucket_id" {
  description = "ID of the logs S3 bucket"
  value       = aws_s3_bucket.logs.id
}

output "logs_bucket_arn" {
  description = "ARN of the logs S3 bucket"
  value       = aws_s3_bucket.logs.arn
}

output "logs_bucket_domain_name" {
  description = "Domain name of the logs S3 bucket"
  value       = aws_s3_bucket.logs.bucket_domain_name
}

# Uploads Bucket Outputs
output "uploads_bucket_id" {
  description = "ID of the uploads S3 bucket"
  value       = aws_s3_bucket.uploads.id
}

output "uploads_bucket_arn" {
  description = "ARN of the uploads S3 bucket"
  value       = aws_s3_bucket.uploads.arn
}

output "uploads_bucket_domain_name" {
  description = "Domain name of the uploads S3 bucket"
  value       = aws_s3_bucket.uploads.bucket_domain_name
}

# EFS Outputs
output "efs_file_system_id" {
  description = "ID of the EFS file system"
  value       = var.enable_efs ? aws_efs_file_system.main[0].id : null
}

output "efs_file_system_arn" {
  description = "ARN of the EFS file system"
  value       = var.enable_efs ? aws_efs_file_system.main[0].arn : null
}

output "efs_file_system_dns_name" {
  description = "DNS name of the EFS file system"
  value       = var.enable_efs ? aws_efs_file_system.main[0].dns_name : null
}

output "efs_mount_target_ids" {
  description = "IDs of EFS mount targets"
  value       = var.enable_efs ? aws_efs_mount_target.main[*].id : []
}

output "efs_mount_target_dns_names" {
  description = "DNS names of EFS mount targets"
  value       = var.enable_efs ? aws_efs_mount_target.main[*].dns_name : []
}

output "efs_access_point_ids" {
  description = "Map of EFS access point IDs"
  value       = var.enable_efs ? { for k, v in aws_efs_access_point.main : k => v.id } : {}
}

output "efs_access_point_arns" {
  description = "Map of EFS access point ARNs"
  value       = var.enable_efs ? { for k, v in aws_efs_access_point.main : k => v.arn } : {}
}

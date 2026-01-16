################################################################################
# Outputs - Security Baseline Module
# Global SaaS Marketing Platform
################################################################################

# KMS Key Outputs
output "main_kms_key_arn" {
  description = "ARN of the main KMS key"
  value       = aws_kms_key.main.arn
}

output "main_kms_key_id" {
  description = "ID of the main KMS key"
  value       = aws_kms_key.main.key_id
}

output "main_kms_key_alias" {
  description = "Alias of the main KMS key"
  value       = aws_kms_alias.main.name
}

output "eks_kms_key_arn" {
  description = "ARN of the EKS KMS key"
  value       = aws_kms_key.eks.arn
}

output "eks_kms_key_id" {
  description = "ID of the EKS KMS key"
  value       = aws_kms_key.eks.key_id
}

output "rds_kms_key_arn" {
  description = "ARN of the RDS KMS key"
  value       = aws_kms_key.rds.arn
}

output "rds_kms_key_id" {
  description = "ID of the RDS KMS key"
  value       = aws_kms_key.rds.key_id
}

output "s3_kms_key_arn" {
  description = "ARN of the S3 KMS key"
  value       = aws_kms_key.s3.arn
}

output "s3_kms_key_id" {
  description = "ID of the S3 KMS key"
  value       = aws_kms_key.s3.key_id
}

# IAM Outputs
output "permission_boundary_arn" {
  description = "ARN of the IAM permission boundary policy"
  value       = aws_iam_policy.permission_boundary.arn
}

# CloudTrail Outputs
output "cloudtrail_id" {
  description = "ID of CloudTrail"
  value       = var.enable_cloudtrail ? aws_cloudtrail.main[0].id : null
}

output "cloudtrail_arn" {
  description = "ARN of CloudTrail"
  value       = var.enable_cloudtrail ? aws_cloudtrail.main[0].arn : null
}

output "cloudtrail_s3_bucket_id" {
  description = "ID of CloudTrail S3 bucket"
  value       = var.enable_cloudtrail ? aws_s3_bucket.cloudtrail[0].id : null
}

output "cloudtrail_log_group_arn" {
  description = "ARN of CloudTrail CloudWatch log group"
  value       = var.enable_cloudtrail ? aws_cloudwatch_log_group.cloudtrail[0].arn : null
}

# AWS Config Outputs
output "config_recorder_id" {
  description = "ID of AWS Config recorder"
  value       = var.enable_config ? aws_config_configuration_recorder.main[0].id : null
}

output "config_s3_bucket_id" {
  description = "ID of AWS Config S3 bucket"
  value       = var.enable_config ? aws_s3_bucket.config[0].id : null
}

# GuardDuty Outputs
output "guardduty_detector_id" {
  description = "ID of GuardDuty detector"
  value       = var.enable_guardduty ? aws_guardduty_detector.main[0].id : null
}

# WAF Outputs
output "waf_cloudfront_acl_arn" {
  description = "ARN of CloudFront WAF Web ACL"
  value       = var.enable_waf ? aws_wafv2_web_acl.cloudfront[0].arn : null
}

output "waf_cloudfront_acl_id" {
  description = "ID of CloudFront WAF Web ACL"
  value       = var.enable_waf ? aws_wafv2_web_acl.cloudfront[0].id : null
}

output "waf_alb_acl_arn" {
  description = "ARN of ALB WAF Web ACL"
  value       = var.enable_waf ? aws_wafv2_web_acl.alb[0].arn : null
}

output "waf_alb_acl_id" {
  description = "ID of ALB WAF Web ACL"
  value       = var.enable_waf ? aws_wafv2_web_acl.alb[0].id : null
}

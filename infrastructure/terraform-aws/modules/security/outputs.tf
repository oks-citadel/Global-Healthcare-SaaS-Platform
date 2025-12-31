# ============================================
# AWS Security Services Module - Outputs
# ============================================

output "cloudtrail_arn" {
  description = "ARN of the CloudTrail trail"
  value       = aws_cloudtrail.main.arn
}

output "cloudtrail_bucket_name" {
  description = "Name of the CloudTrail S3 bucket"
  value       = aws_s3_bucket.cloudtrail.id
}

output "cloudtrail_log_group_name" {
  description = "Name of the CloudTrail CloudWatch Log Group"
  value       = aws_cloudwatch_log_group.cloudtrail.name
}

output "guardduty_detector_id" {
  description = "ID of the GuardDuty detector"
  value       = aws_guardduty_detector.main.id
}

output "guardduty_findings_topic_arn" {
  description = "ARN of the GuardDuty findings SNS topic"
  value       = aws_sns_topic.guardduty_findings.arn
}

output "security_hub_findings_topic_arn" {
  description = "ARN of the Security Hub findings SNS topic"
  value       = aws_sns_topic.security_hub_findings.arn
}

output "cloudtrail_kms_key_arn" {
  description = "ARN of the KMS key used for CloudTrail encryption"
  value       = aws_kms_key.cloudtrail.arn
}

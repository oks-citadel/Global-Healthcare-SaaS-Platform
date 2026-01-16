# ============================================
# AWS SES Module - Outputs
# ============================================

output "domain_identity_arn" {
  description = "ARN of the SES domain identity"
  value       = aws_ses_domain_identity.main.arn
}

output "domain_identity" {
  description = "The SES domain identity"
  value       = aws_ses_domain_identity.main.domain
}

output "verification_token" {
  description = "Token for domain verification"
  value       = aws_ses_domain_identity.main.verification_token
  sensitive   = true
}

output "dkim_tokens" {
  description = "DKIM tokens for domain authentication"
  value       = aws_ses_domain_dkim.main.dkim_tokens
}

output "mail_from_domain" {
  description = "Mail from domain for SPF"
  value       = aws_ses_domain_mail_from.main.mail_from_domain
}

output "configuration_set_name" {
  description = "Name of the SES configuration set"
  value       = aws_ses_configuration_set.main.name
}

output "bounce_topic_arn" {
  description = "ARN of the bounce notification SNS topic"
  value       = var.create_notification_topics ? aws_sns_topic.bounce[0].arn : null
}

output "complaint_topic_arn" {
  description = "ARN of the complaint notification SNS topic"
  value       = var.create_notification_topics ? aws_sns_topic.complaint[0].arn : null
}

output "delivery_topic_arn" {
  description = "ARN of the delivery notification SNS topic"
  value       = var.create_notification_topics ? aws_sns_topic.delivery[0].arn : null
}

output "bounce_queue_url" {
  description = "URL of the bounce processing SQS queue"
  value       = var.create_notification_topics ? aws_sqs_queue.bounce_queue[0].url : null
}

output "bounce_queue_arn" {
  description = "ARN of the bounce processing SQS queue"
  value       = var.create_notification_topics ? aws_sqs_queue.bounce_queue[0].arn : null
}

output "complaint_queue_url" {
  description = "URL of the complaint processing SQS queue"
  value       = var.create_notification_topics ? aws_sqs_queue.complaint_queue[0].url : null
}

output "complaint_queue_arn" {
  description = "ARN of the complaint processing SQS queue"
  value       = var.create_notification_topics ? aws_sqs_queue.complaint_queue[0].arn : null
}

output "ses_sender_policy_arn" {
  description = "ARN of the IAM policy for SES sending"
  value       = aws_iam_policy.ses_sender.arn
}

output "ses_smtp_endpoint" {
  description = "SES SMTP endpoint for the region"
  value       = "email-smtp.${data.aws_region.current.name}.amazonaws.com"
}

output "ses_api_endpoint" {
  description = "SES API endpoint for the region"
  value       = "email.${data.aws_region.current.name}.amazonaws.com"
}

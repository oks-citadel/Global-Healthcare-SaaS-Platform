################################################################################
# Outputs - Email Module
# Global SaaS Marketing Platform
################################################################################

# SES Domain Identity Outputs
output "ses_domain_identity_arn" {
  description = "ARN of the SES domain identity"
  value       = aws_ses_domain_identity.main.arn
}

output "ses_domain_identity_verification_token" {
  description = "Verification token for SES domain identity"
  value       = aws_ses_domain_identity.main.verification_token
}

output "ses_dkim_tokens" {
  description = "DKIM tokens for SES domain"
  value       = aws_ses_domain_dkim.main.dkim_tokens
}

output "ses_mail_from_domain" {
  description = "Mail from domain for SES"
  value       = aws_ses_domain_mail_from.main.mail_from_domain
}

# Configuration Set Outputs
output "ses_configuration_set_name" {
  description = "Name of the SES configuration set"
  value       = aws_ses_configuration_set.main.name
}

output "ses_configuration_set_arn" {
  description = "ARN of the SES configuration set"
  value       = aws_ses_configuration_set.main.arn
}

# SNS Topic Outputs
output "ses_events_topic_arn" {
  description = "ARN of the SNS topic for SES events"
  value       = aws_sns_topic.ses_events.arn
}

# Firehose Outputs
output "ses_firehose_delivery_stream_arn" {
  description = "ARN of the Firehose delivery stream for SES events"
  value       = var.enable_firehose_destination ? aws_kinesis_firehose_delivery_stream.ses_events[0].arn : null
}

output "ses_firehose_delivery_stream_name" {
  description = "Name of the Firehose delivery stream for SES events"
  value       = var.enable_firehose_destination ? aws_kinesis_firehose_delivery_stream.ses_events[0].name : null
}

# Template Outputs
output "ses_template_names" {
  description = "Map of SES template names"
  value       = { for k, v in aws_ses_template.main : k => v.name }
}

output "ses_template_arns" {
  description = "Map of SES template ARNs"
  value       = { for k, v in aws_ses_template.main : k => v.arn }
}

# IAM Role Outputs
output "ses_sender_role_arn" {
  description = "ARN of the SES sender IAM role"
  value       = aws_iam_role.ses_sender.arn
}

output "ses_sender_role_name" {
  description = "Name of the SES sender IAM role"
  value       = aws_iam_role.ses_sender.name
}

# SQS Queue Outputs
output "ses_bounces_queue_arn" {
  description = "ARN of the SQS queue for bounce notifications"
  value       = aws_sqs_queue.bounces.arn
}

output "ses_bounces_queue_url" {
  description = "URL of the SQS queue for bounce notifications"
  value       = aws_sqs_queue.bounces.url
}

output "ses_complaints_queue_arn" {
  description = "ARN of the SQS queue for complaint notifications"
  value       = aws_sqs_queue.complaints.arn
}

output "ses_complaints_queue_url" {
  description = "URL of the SQS queue for complaint notifications"
  value       = aws_sqs_queue.complaints.url
}

# DNS Records (for manual setup if Route53 not used)
output "dns_records_required" {
  description = "DNS records required for SES domain verification"
  value = {
    verification = {
      name  = "_amazonses.${var.domain_name}"
      type  = "TXT"
      value = aws_ses_domain_identity.main.verification_token
    }
    dkim = [
      for token in aws_ses_domain_dkim.main.dkim_tokens : {
        name  = "${token}._domainkey.${var.domain_name}"
        type  = "CNAME"
        value = "${token}.dkim.amazonses.com"
      }
    ]
    mail_from_mx = {
      name  = aws_ses_domain_mail_from.main.mail_from_domain
      type  = "MX"
      value = "10 feedback-smtp.${data.aws_region.current.name}.amazonses.com"
    }
    mail_from_spf = {
      name  = aws_ses_domain_mail_from.main.mail_from_domain
      type  = "TXT"
      value = "v=spf1 include:amazonses.com ~all"
    }
  }
}

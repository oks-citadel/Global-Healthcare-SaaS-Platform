# ============================================
# AWS SES Module - Email Delivery
# ============================================
# HIPAA Compliance: Transactional email for healthcare applications
# Features: Domain verification, DKIM, SPF, DMARC, configuration sets
# Replaces: SendGrid (external dependency removed)
# ============================================

locals {
  name = "${var.project_name}-${var.environment}"

  tags = merge(var.tags, {
    Module      = "ses"
    Compliance  = "HIPAA"
    Environment = var.environment
  })
}

# ============================================
# Data Sources
# ============================================

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# ============================================
# SES Domain Identity
# ============================================

resource "aws_ses_domain_identity" "main" {
  domain = var.domain_name
}

resource "aws_ses_domain_identity_verification" "main" {
  count  = var.wait_for_verification ? 1 : 0
  domain = aws_ses_domain_identity.main.id

  depends_on = [aws_route53_record.ses_verification]
}

# ============================================
# Route53 Records for SES Verification
# ============================================

resource "aws_route53_record" "ses_verification" {
  count   = var.route53_zone_id != null ? 1 : 0
  zone_id = var.route53_zone_id
  name    = "_amazonses.${var.domain_name}"
  type    = "TXT"
  ttl     = 600
  records = [aws_ses_domain_identity.main.verification_token]
}

# ============================================
# DKIM Configuration
# ============================================

resource "aws_ses_domain_dkim" "main" {
  domain = aws_ses_domain_identity.main.domain
}

resource "aws_route53_record" "dkim" {
  count   = var.route53_zone_id != null ? 3 : 0
  zone_id = var.route53_zone_id
  name    = "${aws_ses_domain_dkim.main.dkim_tokens[count.index]}._domainkey.${var.domain_name}"
  type    = "CNAME"
  ttl     = 600
  records = ["${aws_ses_domain_dkim.main.dkim_tokens[count.index]}.dkim.amazonses.com"]
}

# ============================================
# Mail From Domain (for SPF)
# ============================================

resource "aws_ses_domain_mail_from" "main" {
  domain           = aws_ses_domain_identity.main.domain
  mail_from_domain = "mail.${var.domain_name}"
}

resource "aws_route53_record" "mail_from_mx" {
  count   = var.route53_zone_id != null ? 1 : 0
  zone_id = var.route53_zone_id
  name    = aws_ses_domain_mail_from.main.mail_from_domain
  type    = "MX"
  ttl     = 600
  records = ["10 feedback-smtp.${data.aws_region.current.name}.amazonses.com"]
}

resource "aws_route53_record" "mail_from_spf" {
  count   = var.route53_zone_id != null ? 1 : 0
  zone_id = var.route53_zone_id
  name    = aws_ses_domain_mail_from.main.mail_from_domain
  type    = "TXT"
  ttl     = 600
  records = ["v=spf1 include:amazonses.com ~all"]
}

# ============================================
# DMARC Record
# ============================================

resource "aws_route53_record" "dmarc" {
  count   = var.route53_zone_id != null && var.enable_dmarc ? 1 : 0
  zone_id = var.route53_zone_id
  name    = "_dmarc.${var.domain_name}"
  type    = "TXT"
  ttl     = 600
  records = ["v=DMARC1; p=${var.dmarc_policy}; rua=mailto:${var.dmarc_rua_email}; ruf=mailto:${var.dmarc_ruf_email}; fo=1"]
}

# ============================================
# SES Configuration Set
# ============================================

resource "aws_ses_configuration_set" "main" {
  name = "${local.name}-config"

  reputation_metrics_enabled = true
  sending_enabled            = true

  delivery_options {
    tls_policy = "Require"
  }

  dynamic "tracking_options" {
    for_each = var.custom_tracking_domain != null && var.custom_tracking_domain != "" ? [1] : []
    content {
      custom_redirect_domain = var.custom_tracking_domain
    }
  }
}

# ============================================
# CloudWatch Event Destinations
# ============================================

resource "aws_ses_event_destination" "cloudwatch" {
  name                   = "${local.name}-cloudwatch"
  configuration_set_name = aws_ses_configuration_set.main.name
  enabled                = true

  matching_types = [
    "send",
    "reject",
    "bounce",
    "complaint",
    "delivery",
    "open",
    "click",
    "renderingFailure"
  ]

  cloudwatch_destination {
    default_value  = "default"
    dimension_name = "ses:source-ip"
    value_source   = "messageTag"
  }
}

# ============================================
# SNS Topics for Bounce/Complaint Handling
# ============================================

resource "aws_sns_topic" "bounce" {
  count = var.create_notification_topics ? 1 : 0

  name              = "${local.name}-ses-bounce"
  kms_master_key_id = var.kms_key_id

  tags = merge(local.tags, {
    Name    = "${local.name}-ses-bounce"
    Purpose = "ses-bounce-notifications"
  })
}

resource "aws_sns_topic" "complaint" {
  count = var.create_notification_topics ? 1 : 0

  name              = "${local.name}-ses-complaint"
  kms_master_key_id = var.kms_key_id

  tags = merge(local.tags, {
    Name    = "${local.name}-ses-complaint"
    Purpose = "ses-complaint-notifications"
  })
}

resource "aws_sns_topic" "delivery" {
  count = var.create_notification_topics ? 1 : 0

  name              = "${local.name}-ses-delivery"
  kms_master_key_id = var.kms_key_id

  tags = merge(local.tags, {
    Name    = "${local.name}-ses-delivery"
    Purpose = "ses-delivery-notifications"
  })
}

# ============================================
# SQS Queues for Processing Notifications
# ============================================

resource "aws_sqs_queue" "bounce_queue" {
  count = var.create_notification_topics ? 1 : 0

  name                       = "${local.name}-ses-bounce-queue"
  message_retention_seconds  = 1209600 # 14 days
  visibility_timeout_seconds = 300
  receive_wait_time_seconds  = 20
  kms_master_key_id          = var.kms_key_id

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.bounce_dlq[0].arn
    maxReceiveCount     = 3
  })

  tags = merge(local.tags, {
    Name    = "${local.name}-ses-bounce-queue"
    Purpose = "ses-bounce-processing"
  })
}

resource "aws_sqs_queue" "bounce_dlq" {
  count = var.create_notification_topics ? 1 : 0

  name                      = "${local.name}-ses-bounce-dlq"
  message_retention_seconds = 1209600 # 14 days
  kms_master_key_id         = var.kms_key_id

  tags = merge(local.tags, {
    Name    = "${local.name}-ses-bounce-dlq"
    Purpose = "ses-bounce-dead-letter"
  })
}

resource "aws_sqs_queue" "complaint_queue" {
  count = var.create_notification_topics ? 1 : 0

  name                       = "${local.name}-ses-complaint-queue"
  message_retention_seconds  = 1209600
  visibility_timeout_seconds = 300
  receive_wait_time_seconds  = 20
  kms_master_key_id          = var.kms_key_id

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.complaint_dlq[0].arn
    maxReceiveCount     = 3
  })

  tags = merge(local.tags, {
    Name    = "${local.name}-ses-complaint-queue"
    Purpose = "ses-complaint-processing"
  })
}

resource "aws_sqs_queue" "complaint_dlq" {
  count = var.create_notification_topics ? 1 : 0

  name                      = "${local.name}-ses-complaint-dlq"
  message_retention_seconds = 1209600
  kms_master_key_id         = var.kms_key_id

  tags = merge(local.tags, {
    Name    = "${local.name}-ses-complaint-dlq"
    Purpose = "ses-complaint-dead-letter"
  })
}

# ============================================
# SNS to SQS Subscriptions
# ============================================

resource "aws_sns_topic_subscription" "bounce_to_sqs" {
  count = var.create_notification_topics ? 1 : 0

  topic_arn            = aws_sns_topic.bounce[0].arn
  protocol             = "sqs"
  endpoint             = aws_sqs_queue.bounce_queue[0].arn
  raw_message_delivery = true
}

resource "aws_sns_topic_subscription" "complaint_to_sqs" {
  count = var.create_notification_topics ? 1 : 0

  topic_arn            = aws_sns_topic.complaint[0].arn
  protocol             = "sqs"
  endpoint             = aws_sqs_queue.complaint_queue[0].arn
  raw_message_delivery = true
}

# ============================================
# SQS Queue Policies
# ============================================

resource "aws_sqs_queue_policy" "bounce_queue" {
  count = var.create_notification_topics ? 1 : 0

  queue_url = aws_sqs_queue.bounce_queue[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowSNS"
        Effect = "Allow"
        Principal = {
          Service = "sns.amazonaws.com"
        }
        Action   = "sqs:SendMessage"
        Resource = aws_sqs_queue.bounce_queue[0].arn
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = aws_sns_topic.bounce[0].arn
          }
        }
      }
    ]
  })
}

resource "aws_sqs_queue_policy" "complaint_queue" {
  count = var.create_notification_topics ? 1 : 0

  queue_url = aws_sqs_queue.complaint_queue[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowSNS"
        Effect = "Allow"
        Principal = {
          Service = "sns.amazonaws.com"
        }
        Action   = "sqs:SendMessage"
        Resource = aws_sqs_queue.complaint_queue[0].arn
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = aws_sns_topic.complaint[0].arn
          }
        }
      }
    ]
  })
}

# ============================================
# SES Identity Notification Configuration
# ============================================

resource "aws_ses_identity_notification_topic" "bounce" {
  count = var.create_notification_topics ? 1 : 0

  topic_arn                = aws_sns_topic.bounce[0].arn
  notification_type        = "Bounce"
  identity                 = aws_ses_domain_identity.main.domain
  include_original_headers = true
}

resource "aws_ses_identity_notification_topic" "complaint" {
  count = var.create_notification_topics ? 1 : 0

  topic_arn                = aws_sns_topic.complaint[0].arn
  notification_type        = "Complaint"
  identity                 = aws_ses_domain_identity.main.domain
  include_original_headers = true
}

resource "aws_ses_identity_notification_topic" "delivery" {
  count = var.create_notification_topics ? 1 : 0

  topic_arn                = aws_sns_topic.delivery[0].arn
  notification_type        = "Delivery"
  identity                 = aws_ses_domain_identity.main.domain
  include_original_headers = false
}

# ============================================
# IAM Policy for SES Access
# ============================================

resource "aws_iam_policy" "ses_sender" {
  name        = "${local.name}-ses-sender"
  description = "Policy to allow sending emails via SES"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowSESSend"
        Effect = "Allow"
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail",
          "ses:SendTemplatedEmail",
          "ses:SendBulkTemplatedEmail"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "ses:FromAddress" = var.allowed_from_addresses
          }
        }
      },
      {
        Sid    = "AllowSESTemplates"
        Effect = "Allow"
        Action = [
          "ses:GetTemplate",
          "ses:ListTemplates"
        ]
        Resource = "*"
      }
    ]
  })

  tags = local.tags
}

# ============================================
# CloudWatch Alarms
# ============================================

resource "aws_cloudwatch_metric_alarm" "bounce_rate" {
  count = var.enable_alarms ? 1 : 0

  alarm_name          = "${local.name}-ses-bounce-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Reputation.BounceRate"
  namespace           = "AWS/SES"
  period              = 300
  statistic           = "Average"
  threshold           = 0.05 # 5% bounce rate threshold
  alarm_description   = "SES bounce rate exceeded 5%"
  treat_missing_data  = "notBreaching"

  alarm_actions = var.alarm_actions
  ok_actions    = var.alarm_actions

  tags = local.tags
}

resource "aws_cloudwatch_metric_alarm" "complaint_rate" {
  count = var.enable_alarms ? 1 : 0

  alarm_name          = "${local.name}-ses-complaint-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Reputation.ComplaintRate"
  namespace           = "AWS/SES"
  period              = 300
  statistic           = "Average"
  threshold           = 0.001 # 0.1% complaint rate threshold
  alarm_description   = "SES complaint rate exceeded 0.1%"
  treat_missing_data  = "notBreaching"

  alarm_actions = var.alarm_actions
  ok_actions    = var.alarm_actions

  tags = local.tags
}

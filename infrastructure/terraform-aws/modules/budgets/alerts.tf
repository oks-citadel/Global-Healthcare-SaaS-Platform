# ============================================
# AWS Budgets Module - SNS Alerts
# ============================================

locals {
  name = "${var.project_name}-${var.environment}"
}

# ============================================
# SNS Topic for Budget Alerts
# ============================================

resource "aws_sns_topic" "budget_alerts" {
  name         = "${local.name}-budget-alerts"
  display_name = "Budget Alerts for ${var.project_name} (${var.environment})"

  kms_master_key_id = aws_kms_key.budget_alerts.id

  tags = merge(var.tags, {
    Name   = "${local.name}-budget-alerts"
    Module = "budgets"
  })
}

# ============================================
# KMS Key for SNS Encryption
# ============================================

resource "aws_kms_key" "budget_alerts" {
  description             = "KMS key for budget alerts SNS topic - ${local.name}"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "Allow Budgets Service"
        Effect = "Allow"
        Principal = {
          Service = "budgets.amazonaws.com"
        }
        Action = [
          "kms:GenerateDataKey*",
          "kms:Decrypt"
        ]
        Resource = "*"
      },
      {
        Sid    = "Allow SNS Service"
        Effect = "Allow"
        Principal = {
          Service = "sns.amazonaws.com"
        }
        Action = [
          "kms:GenerateDataKey*",
          "kms:Decrypt"
        ]
        Resource = "*"
      }
    ]
  })

  tags = merge(var.tags, {
    Name   = "${local.name}-budget-alerts-kms"
    Module = "budgets"
  })
}

resource "aws_kms_alias" "budget_alerts" {
  name          = "alias/${local.name}-budget-alerts"
  target_key_id = aws_kms_key.budget_alerts.key_id
}

# ============================================
# SNS Topic Policy
# ============================================

resource "aws_sns_topic_policy" "budget_alerts" {
  arn = aws_sns_topic.budget_alerts.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowBudgetsToPublish"
        Effect = "Allow"
        Principal = {
          Service = "budgets.amazonaws.com"
        }
        Action   = "SNS:Publish"
        Resource = aws_sns_topic.budget_alerts.arn
        Condition = {
          StringEquals = {
            "aws:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      },
      {
        Sid    = "AllowAccountOwner"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action = [
          "SNS:Subscribe",
          "SNS:SetTopicAttributes",
          "SNS:RemovePermission",
          "SNS:Receive",
          "SNS:Publish",
          "SNS:ListSubscriptionsByTopic",
          "SNS:GetTopicAttributes",
          "SNS:DeleteTopic",
          "SNS:AddPermission"
        ]
        Resource = aws_sns_topic.budget_alerts.arn
      }
    ]
  })
}

# ============================================
# Email Subscriptions
# ============================================

resource "aws_sns_topic_subscription" "email" {
  count = length(var.alert_emails)

  topic_arn = aws_sns_topic.budget_alerts.arn
  protocol  = "email"
  endpoint  = var.alert_emails[count.index]
}

# ============================================
# Data Sources
# ============================================

data "aws_caller_identity" "current" {}

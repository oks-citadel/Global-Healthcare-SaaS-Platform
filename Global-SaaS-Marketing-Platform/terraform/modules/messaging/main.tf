################################################################################
# Messaging Module - Main Configuration
# Global SaaS Marketing Platform
################################################################################

locals {
  common_tags = merge(var.tags, {
    Module = "messaging"
  })
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

################################################################################
# EventBridge Event Bus
################################################################################

resource "aws_cloudwatch_event_bus" "main" {
  name = "${var.project_name}-${var.environment}-event-bus"

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-event-bus"
  })
}

resource "aws_cloudwatch_event_bus_policy" "main" {
  event_bus_name = aws_cloudwatch_event_bus.main.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowAccountAccess"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "events:PutEvents"
        Resource = aws_cloudwatch_event_bus.main.arn
      }
    ]
  })
}

resource "aws_cloudwatch_event_archive" "main" {
  name             = "${var.project_name}-${var.environment}-archive"
  event_source_arn = aws_cloudwatch_event_bus.main.arn
  retention_days   = var.event_archive_retention_days

  event_pattern = jsonencode({
    source = [{ prefix = "${var.project_name}." }]
  })
}

################################################################################
# EventBridge Rules
################################################################################

resource "aws_cloudwatch_event_rule" "main" {
  for_each = var.event_rules

  name           = "${var.project_name}-${var.environment}-${each.key}"
  description    = each.value.description
  event_bus_name = aws_cloudwatch_event_bus.main.name
  event_pattern  = each.value.event_pattern
  state          = each.value.enabled ? "ENABLED" : "DISABLED"

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-${each.key}"
  })
}

resource "aws_cloudwatch_event_target" "sqs" {
  for_each = {
    for k, v in var.event_rules : k => v
    if v.target_type == "sqs"
  }

  rule           = aws_cloudwatch_event_rule.main[each.key].name
  event_bus_name = aws_cloudwatch_event_bus.main.name
  target_id      = "${each.key}-sqs"
  arn            = aws_sqs_queue.main[each.value.target_name].arn

  sqs_target {
    message_group_id = each.value.message_group_id
  }

  dead_letter_config {
    arn = aws_sqs_queue.dlq[each.value.target_name].arn
  }

  retry_policy {
    maximum_event_age_in_seconds = 3600
    maximum_retry_attempts       = 3
  }
}

################################################################################
# SQS Queues
################################################################################

resource "aws_sqs_queue" "main" {
  for_each = var.sqs_queues

  name                       = each.value.fifo ? "${var.project_name}-${var.environment}-${each.key}.fifo" : "${var.project_name}-${var.environment}-${each.key}"
  fifo_queue                 = each.value.fifo
  content_based_deduplication = each.value.fifo ? each.value.content_based_deduplication : null
  deduplication_scope        = each.value.fifo ? each.value.deduplication_scope : null
  fifo_throughput_limit      = each.value.fifo ? each.value.fifo_throughput_limit : null

  visibility_timeout_seconds  = each.value.visibility_timeout_seconds
  message_retention_seconds   = each.value.message_retention_seconds
  max_message_size            = each.value.max_message_size
  delay_seconds               = each.value.delay_seconds
  receive_wait_time_seconds   = each.value.receive_wait_time_seconds

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq[each.key].arn
    maxReceiveCount     = each.value.max_receive_count
  })

  sqs_managed_sse_enabled = each.value.kms_key_id == null
  kms_master_key_id       = each.value.kms_key_id
  kms_data_key_reuse_period_seconds = each.value.kms_key_id != null ? 300 : null

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-${each.key}"
  })
}

resource "aws_sqs_queue" "dlq" {
  for_each = var.sqs_queues

  name       = each.value.fifo ? "${var.project_name}-${var.environment}-${each.key}-dlq.fifo" : "${var.project_name}-${var.environment}-${each.key}-dlq"
  fifo_queue = each.value.fifo

  message_retention_seconds = 1209600 # 14 days

  sqs_managed_sse_enabled = each.value.kms_key_id == null
  kms_master_key_id       = each.value.kms_key_id

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-${each.key}-dlq"
  })
}

resource "aws_sqs_queue_policy" "main" {
  for_each = var.sqs_queues

  queue_url = aws_sqs_queue.main[each.key].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowEventBridge"
        Effect = "Allow"
        Principal = {
          Service = "events.amazonaws.com"
        }
        Action   = "sqs:SendMessage"
        Resource = aws_sqs_queue.main[each.key].arn
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = "${aws_cloudwatch_event_bus.main.arn}/*"
          }
        }
      },
      {
        Sid    = "AllowSNS"
        Effect = "Allow"
        Principal = {
          Service = "sns.amazonaws.com"
        }
        Action   = "sqs:SendMessage"
        Resource = aws_sqs_queue.main[each.key].arn
        Condition = {
          ArnLike = {
            "aws:SourceArn" = "arn:aws:sns:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:${var.project_name}-${var.environment}-*"
          }
        }
      },
      {
        Sid    = "DenyInsecureTransport"
        Effect = "Deny"
        Principal = "*"
        Action   = "sqs:*"
        Resource = aws_sqs_queue.main[each.key].arn
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      }
    ]
  })
}

################################################################################
# SNS Topics
################################################################################

resource "aws_sns_topic" "main" {
  for_each = var.sns_topics

  name         = each.value.fifo ? "${var.project_name}-${var.environment}-${each.key}.fifo" : "${var.project_name}-${var.environment}-${each.key}"
  fifo_topic   = each.value.fifo
  content_based_deduplication = each.value.fifo ? each.value.content_based_deduplication : null

  kms_master_key_id = each.value.kms_key_id

  delivery_policy = jsonencode({
    http = {
      defaultHealthyRetryPolicy = {
        minDelayTarget     = 20
        maxDelayTarget     = 20
        numRetries         = 3
        numMaxDelayRetries = 0
        numNoDelayRetries  = 0
        numMinDelayRetries = 0
        backoffFunction    = "linear"
      }
      disableSubscriptionOverrides = false
    }
  })

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-${each.key}"
  })
}

resource "aws_sns_topic_policy" "main" {
  for_each = var.sns_topics

  arn = aws_sns_topic.main[each.key].arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowAccountPublish"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.main[each.key].arn
      },
      {
        Sid    = "AllowEventBridge"
        Effect = "Allow"
        Principal = {
          Service = "events.amazonaws.com"
        }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.main[each.key].arn
      },
      {
        Sid    = "DenyInsecureTransport"
        Effect = "Deny"
        Principal = "*"
        Action   = "sns:Publish"
        Resource = aws_sns_topic.main[each.key].arn
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      }
    ]
  })
}

# SNS to SQS subscriptions
resource "aws_sns_topic_subscription" "sqs" {
  for_each = {
    for sub in flatten([
      for topic_key, topic in var.sns_topics : [
        for idx, queue_key in coalesce(topic.sqs_subscriptions, []) : {
          key       = "${topic_key}-${queue_key}"
          topic_key = topic_key
          queue_key = queue_key
        }
      ]
    ]) : sub.key => sub
  }

  topic_arn = aws_sns_topic.main[each.value.topic_key].arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.main[each.value.queue_key].arn

  raw_message_delivery = true
}

################################################################################
# Step Functions State Machine
################################################################################

resource "aws_sfn_state_machine" "main" {
  for_each = var.step_functions

  name     = "${var.project_name}-${var.environment}-${each.key}"
  role_arn = aws_iam_role.step_functions[each.key].arn

  definition = each.value.definition

  type = each.value.type

  logging_configuration {
    log_destination        = "${aws_cloudwatch_log_group.step_functions[each.key].arn}:*"
    include_execution_data = true
    level                  = "ALL"
  }

  tracing_configuration {
    enabled = true
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-${each.key}"
  })
}

resource "aws_cloudwatch_log_group" "step_functions" {
  for_each = var.step_functions

  name              = "/aws/vendedlogs/states/${var.project_name}-${var.environment}-${each.key}"
  retention_in_days = var.log_retention_days
  kms_key_id        = var.kms_key_arn

  tags = local.common_tags
}

resource "aws_iam_role" "step_functions" {
  for_each = var.step_functions

  name = "${var.project_name}-${var.environment}-sfn-${each.key}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "states.amazonaws.com"
      }
    }]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy" "step_functions" {
  for_each = var.step_functions

  name = "${var.project_name}-${var.environment}-sfn-${each.key}-policy"
  role = aws_iam_role.step_functions[each.key].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = concat([
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogDelivery",
          "logs:GetLogDelivery",
          "logs:UpdateLogDelivery",
          "logs:DeleteLogDelivery",
          "logs:ListLogDeliveries",
          "logs:PutLogEvents",
          "logs:PutResourcePolicy",
          "logs:DescribeResourcePolicies",
          "logs:DescribeLogGroups"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "xray:PutTraceSegments",
          "xray:PutTelemetryRecords",
          "xray:GetSamplingRules",
          "xray:GetSamplingTargets"
        ]
        Resource = "*"
      }
    ], each.value.additional_policies)
  })
}

################################################################################
# EventBridge Scheduler
################################################################################

resource "aws_scheduler_schedule_group" "main" {
  name = "${var.project_name}-${var.environment}-schedules"

  tags = local.common_tags
}

resource "aws_scheduler_schedule" "main" {
  for_each = var.schedules

  name        = "${var.project_name}-${var.environment}-${each.key}"
  group_name  = aws_scheduler_schedule_group.main.name
  description = each.value.description

  schedule_expression          = each.value.schedule_expression
  schedule_expression_timezone = each.value.timezone
  state                        = each.value.enabled ? "ENABLED" : "DISABLED"

  flexible_time_window {
    mode                      = each.value.flexible_time_window_mode
    maximum_window_in_minutes = each.value.flexible_time_window_mode == "FLEXIBLE" ? each.value.flexible_time_window_minutes : null
  }

  target {
    arn      = each.value.target_arn
    role_arn = aws_iam_role.scheduler.arn

    dynamic "sqs_parameters" {
      for_each = each.value.target_type == "sqs" ? [1] : []
      content {
        message_group_id = each.value.message_group_id
      }
    }

    retry_policy {
      maximum_event_age_in_seconds = 3600
      maximum_retry_attempts       = 3
    }

    dead_letter_config {
      arn = var.scheduler_dlq_arn
    }
  }
}

resource "aws_iam_role" "scheduler" {
  name = "${var.project_name}-${var.environment}-scheduler"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "scheduler.amazonaws.com"
      }
      Condition = {
        StringEquals = {
          "aws:SourceAccount" = data.aws_caller_identity.current.account_id
        }
      }
    }]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy" "scheduler" {
  name = "${var.project_name}-${var.environment}-scheduler-policy"
  role = aws_iam_role.scheduler.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "sqs:SendMessage"
        ]
        Resource = values(aws_sqs_queue.main)[*].arn
      },
      {
        Effect = "Allow"
        Action = [
          "sns:Publish"
        ]
        Resource = values(aws_sns_topic.main)[*].arn
      },
      {
        Effect = "Allow"
        Action = [
          "states:StartExecution"
        ]
        Resource = values(aws_sfn_state_machine.main)[*].arn
      },
      {
        Effect = "Allow"
        Action = [
          "events:PutEvents"
        ]
        Resource = aws_cloudwatch_event_bus.main.arn
      }
    ]
  })
}

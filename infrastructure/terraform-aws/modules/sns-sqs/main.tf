# ============================================
# AWS SNS/SQS Module
# ============================================
# HIPAA Compliance: Messaging infrastructure for healthcare applications
# Features: SNS topics, SQS queues, dead-letter queues, encryption
# ============================================

locals {
  name = "${var.project_name}-${var.environment}"

  tags = merge(var.tags, {
    Module      = "sns-sqs"
    Compliance  = "HIPAA"
    Environment = var.environment
  })
}

# ============================================
# KMS Key for SNS/SQS Encryption
# ============================================

resource "aws_kms_key" "messaging" {
  count = var.create_kms_key ? 1 : 0

  description             = "KMS key for SNS/SQS encryption - ${local.name}"
  deletion_window_in_days = var.kms_key_deletion_window
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
        Sid    = "Allow SNS to use the key"
        Effect = "Allow"
        Principal = {
          Service = "sns.amazonaws.com"
        }
        Action = [
          "kms:GenerateDataKey*",
          "kms:Decrypt"
        ]
        Resource = "*"
      },
      {
        Sid    = "Allow SQS to use the key"
        Effect = "Allow"
        Principal = {
          Service = "sqs.amazonaws.com"
        }
        Action = [
          "kms:GenerateDataKey*",
          "kms:Decrypt"
        ]
        Resource = "*"
      },
      {
        Sid    = "Allow CloudWatch Events to use the key"
        Effect = "Allow"
        Principal = {
          Service = "events.amazonaws.com"
        }
        Action = [
          "kms:GenerateDataKey*",
          "kms:Decrypt"
        ]
        Resource = "*"
      }
    ]
  })

  tags = merge(local.tags, {
    Name = "${local.name}-messaging-kms"
  })
}

resource "aws_kms_alias" "messaging" {
  count = var.create_kms_key ? 1 : 0

  name          = "alias/${local.name}-messaging"
  target_key_id = aws_kms_key.messaging[0].key_id
}

# ============================================
# SNS Topics
# ============================================

resource "aws_sns_topic" "topics" {
  for_each = var.topic_configs

  name         = each.value.fifo_topic ? "${local.name}-${each.key}.fifo" : "${local.name}-${each.key}"
  display_name = each.value.display_name

  # HIPAA: Server-side encryption
  kms_master_key_id = var.create_kms_key ? aws_kms_key.messaging[0].id : var.kms_key_id

  # FIFO topic support
  fifo_topic                  = each.value.fifo_topic
  content_based_deduplication = each.value.fifo_topic ? each.value.content_based_deduplication : null

  # Delivery policy
  delivery_policy = each.value.delivery_policy != null ? jsonencode(each.value.delivery_policy) : null

  tags = merge(local.tags, {
    Name     = "${local.name}-${each.key}"
    TopicKey = each.key
    Purpose  = each.value.purpose
  })
}

# ============================================
# SNS Topic Policies
# ============================================

resource "aws_sns_topic_policy" "topics" {
  for_each = var.topic_configs

  arn = aws_sns_topic.topics[each.key].arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = concat([
      {
        Sid    = "DefaultPolicy"
        Effect = "Allow"
        Principal = {
          AWS = "*"
        }
        Action = [
          "SNS:Publish",
          "SNS:RemovePermission",
          "SNS:SetTopicAttributes",
          "SNS:DeleteTopic",
          "SNS:ListSubscriptionsByTopic",
          "SNS:GetTopicAttributes",
          "SNS:AddPermission",
          "SNS:Subscribe"
        ]
        Resource = aws_sns_topic.topics[each.key].arn
        Condition = {
          StringEquals = {
            "AWS:SourceOwner" = data.aws_caller_identity.current.account_id
          }
        }
      },
      {
        Sid    = "AllowCloudWatchAlarms"
        Effect = "Allow"
        Principal = {
          Service = "cloudwatch.amazonaws.com"
        }
        Action   = "SNS:Publish"
        Resource = aws_sns_topic.topics[each.key].arn
        Condition = {
          ArnLike = {
            "aws:SourceArn" = "arn:aws:cloudwatch:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:alarm:*"
          }
        }
      },
      {
        Sid    = "AllowEventBridge"
        Effect = "Allow"
        Principal = {
          Service = "events.amazonaws.com"
        }
        Action   = "SNS:Publish"
        Resource = aws_sns_topic.topics[each.key].arn
      }
      ],
      # Add custom allowed principals
      [
        for principal in coalesce(each.value.allowed_publishers, []) : {
          Sid    = "AllowPublisher-${replace(principal, "/", "-")}"
          Effect = "Allow"
          Principal = {
            AWS = principal
          }
          Action   = "SNS:Publish"
          Resource = aws_sns_topic.topics[each.key].arn
        }
    ])
  })
}

# ============================================
# SQS Queues
# ============================================

resource "aws_sqs_queue" "queues" {
  for_each = var.queue_configs

  name = each.value.fifo_queue ? "${local.name}-${each.key}.fifo" : "${local.name}-${each.key}"

  # Message settings
  visibility_timeout_seconds = each.value.visibility_timeout_seconds
  message_retention_seconds  = each.value.message_retention_seconds
  max_message_size           = each.value.max_message_size
  delay_seconds              = each.value.delay_seconds
  receive_wait_time_seconds  = each.value.receive_wait_time_seconds

  # FIFO queue settings
  fifo_queue                  = each.value.fifo_queue
  content_based_deduplication = each.value.fifo_queue ? each.value.content_based_deduplication : null
  deduplication_scope         = each.value.fifo_queue ? each.value.deduplication_scope : null
  fifo_throughput_limit       = each.value.fifo_queue ? each.value.fifo_throughput_limit : null

  # HIPAA: Server-side encryption
  sqs_managed_sse_enabled           = var.kms_key_id == null && !var.create_kms_key ? true : null
  kms_master_key_id                 = var.create_kms_key ? aws_kms_key.messaging[0].id : var.kms_key_id
  kms_data_key_reuse_period_seconds = var.kms_key_id != null || var.create_kms_key ? 300 : null

  # Dead-letter queue
  redrive_policy = each.value.enable_dlq ? jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq[each.key].arn
    maxReceiveCount     = each.value.max_receive_count
  }) : null

  tags = merge(local.tags, {
    Name     = "${local.name}-${each.key}"
    QueueKey = each.key
    Purpose  = each.value.purpose
  })
}

# ============================================
# Dead Letter Queues
# ============================================

resource "aws_sqs_queue" "dlq" {
  for_each = {
    for key, config in var.queue_configs :
    key => config
    if config.enable_dlq
  }

  name = each.value.fifo_queue ? "${local.name}-${each.key}-dlq.fifo" : "${local.name}-${each.key}-dlq"

  # Extended retention for DLQ investigation
  message_retention_seconds = each.value.dlq_message_retention_seconds

  # FIFO DLQ for FIFO queues
  fifo_queue = each.value.fifo_queue

  # HIPAA: Server-side encryption
  sqs_managed_sse_enabled           = var.kms_key_id == null && !var.create_kms_key ? true : null
  kms_master_key_id                 = var.create_kms_key ? aws_kms_key.messaging[0].id : var.kms_key_id
  kms_data_key_reuse_period_seconds = var.kms_key_id != null || var.create_kms_key ? 300 : null

  tags = merge(local.tags, {
    Name     = "${local.name}-${each.key}-dlq"
    QueueKey = each.key
    Purpose  = "dead-letter-queue"
  })
}

# ============================================
# SQS Queue Policies
# ============================================

resource "aws_sqs_queue_policy" "queues" {
  for_each = var.queue_configs

  queue_url = aws_sqs_queue.queues[each.key].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = concat([
      {
        Sid    = "DefaultPolicy"
        Effect = "Allow"
        Principal = {
          AWS = data.aws_caller_identity.current.account_id
        }
        Action = [
          "sqs:*"
        ]
        Resource = aws_sqs_queue.queues[each.key].arn
      }
      ],
      # Allow SNS topics to send messages
      [
        for topic_key in coalesce(each.value.subscribe_to_topics, []) : {
          Sid    = "AllowSNS-${topic_key}"
          Effect = "Allow"
          Principal = {
            Service = "sns.amazonaws.com"
          }
          Action   = "sqs:SendMessage"
          Resource = aws_sqs_queue.queues[each.key].arn
          Condition = {
            ArnEquals = {
              "aws:SourceArn" = aws_sns_topic.topics[topic_key].arn
            }
          }
        }
      ],
      # Custom allowed senders
      [
        for principal in coalesce(each.value.allowed_senders, []) : {
          Sid    = "AllowSender-${replace(principal, "/", "-")}"
          Effect = "Allow"
          Principal = {
            AWS = principal
          }
          Action = [
            "sqs:SendMessage"
          ]
          Resource = aws_sqs_queue.queues[each.key].arn
        }
    ])
  })
}

# ============================================
# SNS to SQS Subscriptions
# ============================================

resource "aws_sns_topic_subscription" "sqs" {
  for_each = {
    for subscription in local.sqs_subscriptions :
    "${subscription.topic_key}-${subscription.queue_key}" => subscription
  }

  topic_arn = aws_sns_topic.topics[each.value.topic_key].arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.queues[each.value.queue_key].arn

  # Enable raw message delivery for better performance
  raw_message_delivery = each.value.raw_message_delivery

  # Filter policy for selective message delivery
  filter_policy       = each.value.filter_policy != null ? jsonencode(each.value.filter_policy) : null
  filter_policy_scope = each.value.filter_policy != null ? "MessageAttributes" : null

  # Redrive policy for failed deliveries
  redrive_policy = each.value.enable_redrive ? jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq[each.value.queue_key].arn
  }) : null
}

# ============================================
# Email Subscriptions
# ============================================

resource "aws_sns_topic_subscription" "email" {
  for_each = {
    for subscription in local.email_subscriptions :
    "${subscription.topic_key}-${subscription.email}" => subscription
  }

  topic_arn = aws_sns_topic.topics[each.value.topic_key].arn
  protocol  = "email"
  endpoint  = each.value.email
}

# ============================================
# HTTPS Webhook Subscriptions
# ============================================

resource "aws_sns_topic_subscription" "https" {
  for_each = {
    for subscription in local.https_subscriptions :
    "${subscription.topic_key}-${md5(subscription.endpoint)}" => subscription
  }

  topic_arn = aws_sns_topic.topics[each.value.topic_key].arn
  protocol  = "https"
  endpoint  = each.value.endpoint

  confirmation_timeout_in_minutes = 5
  endpoint_auto_confirms          = each.value.auto_confirm
}

# ============================================
# Lambda Subscriptions
# ============================================

resource "aws_sns_topic_subscription" "lambda" {
  for_each = {
    for subscription in local.lambda_subscriptions :
    "${subscription.topic_key}-${subscription.function_name}" => subscription
  }

  topic_arn = aws_sns_topic.topics[each.value.topic_key].arn
  protocol  = "lambda"
  endpoint  = each.value.function_arn

  filter_policy = each.value.filter_policy != null ? jsonencode(each.value.filter_policy) : null
}

# ============================================
# CloudWatch Alarms for DLQ
# ============================================

resource "aws_cloudwatch_metric_alarm" "dlq_messages" {
  for_each = {
    for key, config in var.queue_configs :
    key => config
    if config.enable_dlq && var.enable_dlq_alarms
  }

  alarm_name          = "${local.name}-${each.key}-dlq-messages"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = 300
  statistic           = "Sum"
  threshold           = var.dlq_alarm_threshold
  alarm_description   = "Messages in DLQ for ${each.key} - indicates processing failures"
  treat_missing_data  = "notBreaching"

  dimensions = {
    QueueName = aws_sqs_queue.dlq[each.key].name
  }

  alarm_actions = var.alarm_actions
  ok_actions    = var.alarm_actions

  tags = local.tags
}

# ============================================
# CloudWatch Alarms for Queue Age
# ============================================

resource "aws_cloudwatch_metric_alarm" "queue_age" {
  for_each = {
    for key, config in var.queue_configs :
    key => config
    if config.enable_age_alarm
  }

  alarm_name          = "${local.name}-${each.key}-message-age"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "ApproximateAgeOfOldestMessage"
  namespace           = "AWS/SQS"
  period              = 300
  statistic           = "Maximum"
  threshold           = each.value.age_alarm_threshold
  alarm_description   = "Messages in ${each.key} queue are getting old - possible processing delay"
  treat_missing_data  = "notBreaching"

  dimensions = {
    QueueName = aws_sqs_queue.queues[each.key].name
  }

  alarm_actions = var.alarm_actions

  tags = local.tags
}

# ============================================
# Locals for Subscription Flattening
# ============================================

locals {
  # Flatten SQS subscriptions
  sqs_subscriptions = flatten([
    for queue_key, queue_config in var.queue_configs : [
      for topic_key in coalesce(queue_config.subscribe_to_topics, []) : {
        queue_key            = queue_key
        topic_key            = topic_key
        raw_message_delivery = queue_config.raw_message_delivery
        filter_policy        = queue_config.filter_policy
        enable_redrive       = queue_config.enable_dlq
      }
    ]
  ])

  # Flatten email subscriptions
  email_subscriptions = flatten([
    for topic_key, topic_config in var.topic_configs : [
      for email in coalesce(topic_config.email_subscriptions, []) : {
        topic_key = topic_key
        email     = email
      }
    ]
  ])

  # Flatten HTTPS subscriptions
  https_subscriptions = flatten([
    for topic_key, topic_config in var.topic_configs : [
      for endpoint in coalesce(topic_config.https_subscriptions, []) : {
        topic_key    = topic_key
        endpoint     = endpoint.url
        auto_confirm = coalesce(endpoint.auto_confirm, false)
      }
    ]
  ])

  # Flatten Lambda subscriptions
  lambda_subscriptions = flatten([
    for topic_key, topic_config in var.topic_configs : [
      for lambda_sub in coalesce(topic_config.lambda_subscriptions, []) : {
        topic_key     = topic_key
        function_name = lambda_sub.function_name
        function_arn  = lambda_sub.function_arn
        filter_policy = lambda_sub.filter_policy
      }
    ]
  ])
}

# ============================================
# Data Sources
# ============================================

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

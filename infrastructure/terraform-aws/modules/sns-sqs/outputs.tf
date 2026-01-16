# ============================================
# AWS SNS/SQS Module - Outputs
# ============================================

# ============================================
# SNS Topic Outputs
# ============================================

output "topic_arns" {
  description = "Map of topic names to their ARNs"
  value = {
    for key, topic in aws_sns_topic.topics :
    key => topic.arn
  }
}

output "topic_ids" {
  description = "Map of topic names to their IDs"
  value = {
    for key, topic in aws_sns_topic.topics :
    key => topic.id
  }
}

output "topic_names" {
  description = "Map of topic keys to their full names"
  value = {
    for key, topic in aws_sns_topic.topics :
    key => topic.name
  }
}

# ============================================
# SQS Queue Outputs
# ============================================

output "queue_urls" {
  description = "Map of queue names to their URLs"
  value = {
    for key, queue in aws_sqs_queue.queues :
    key => queue.url
  }
}

output "queue_arns" {
  description = "Map of queue names to their ARNs"
  value = {
    for key, queue in aws_sqs_queue.queues :
    key => queue.arn
  }
}

output "queue_ids" {
  description = "Map of queue names to their IDs"
  value = {
    for key, queue in aws_sqs_queue.queues :
    key => queue.id
  }
}

output "queue_names" {
  description = "Map of queue keys to their full names"
  value = {
    for key, queue in aws_sqs_queue.queues :
    key => queue.name
  }
}

# ============================================
# Dead Letter Queue Outputs
# ============================================

output "dlq_urls" {
  description = "Map of DLQ names to their URLs"
  value = {
    for key, dlq in aws_sqs_queue.dlq :
    key => dlq.url
  }
}

output "dlq_arns" {
  description = "Map of DLQ names to their ARNs"
  value = {
    for key, dlq in aws_sqs_queue.dlq :
    key => dlq.arn
  }
}

output "dlq_names" {
  description = "Map of DLQ keys to their full names"
  value = {
    for key, dlq in aws_sqs_queue.dlq :
    key => dlq.name
  }
}

# ============================================
# KMS Key Outputs
# ============================================

output "kms_key_arn" {
  description = "ARN of the KMS key used for encryption"
  value       = var.create_kms_key ? aws_kms_key.messaging[0].arn : var.kms_key_id
}

output "kms_key_id" {
  description = "ID of the KMS key used for encryption"
  value       = var.create_kms_key ? aws_kms_key.messaging[0].key_id : var.kms_key_id
}

output "kms_key_alias" {
  description = "Alias of the KMS key"
  value       = var.create_kms_key ? aws_kms_alias.messaging[0].name : null
}

# ============================================
# Subscription Outputs
# ============================================

output "sqs_subscription_arns" {
  description = "Map of SQS subscription identifiers to their ARNs"
  value = {
    for key, sub in aws_sns_topic_subscription.sqs :
    key => sub.arn
  }
}

output "email_subscription_arns" {
  description = "Map of email subscription identifiers to their ARNs"
  value = {
    for key, sub in aws_sns_topic_subscription.email :
    key => sub.arn
  }
}

output "https_subscription_arns" {
  description = "Map of HTTPS subscription identifiers to their ARNs"
  value = {
    for key, sub in aws_sns_topic_subscription.https :
    key => sub.arn
  }
}

output "lambda_subscription_arns" {
  description = "Map of Lambda subscription identifiers to their ARNs"
  value = {
    for key, sub in aws_sns_topic_subscription.lambda :
    key => sub.arn
  }
}

# ============================================
# Alarm Outputs
# ============================================

output "dlq_alarm_arns" {
  description = "Map of DLQ alarm names to their ARNs"
  value = {
    for key, alarm in aws_cloudwatch_metric_alarm.dlq_messages :
    key => alarm.arn
  }
}

output "queue_age_alarm_arns" {
  description = "Map of queue age alarm names to their ARNs"
  value = {
    for key, alarm in aws_cloudwatch_metric_alarm.queue_age :
    key => alarm.arn
  }
}

# ============================================
# Summary Output
# ============================================

output "messaging_summary" {
  description = "Summary of all messaging resources"
  value = {
    topics = {
      for key, topic in aws_sns_topic.topics :
      key => {
        name = topic.name
        arn  = topic.arn
        fifo = var.topic_configs[key].fifo_topic
      }
    }
    queues = {
      for key, queue in aws_sqs_queue.queues :
      key => {
        name    = queue.name
        url     = queue.url
        arn     = queue.arn
        fifo    = var.queue_configs[key].fifo_queue
        has_dlq = var.queue_configs[key].enable_dlq
      }
    }
    encryption = {
      kms_enabled = var.create_kms_key || var.kms_key_id != null
      kms_key_arn = var.create_kms_key ? aws_kms_key.messaging[0].arn : var.kms_key_id
    }
  }
}

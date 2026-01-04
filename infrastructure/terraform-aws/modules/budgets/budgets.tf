# ============================================
# AWS Budgets Module - Budget Resources
# ============================================

locals {
  budget_name = var.budget_name != "" ? var.budget_name : "${local.name}-monthly-budget"

  # Build cost filters dynamically
  cost_filters = merge(
    length(var.cost_filter_service) > 0 ? {
      Service = var.cost_filter_service
    } : {},
    length(var.cost_filter_linked_account) > 0 ? {
      LinkedAccount = var.cost_filter_linked_account
    } : {},
    length(var.cost_filter_region) > 0 ? {
      Region = var.cost_filter_region
    } : {},
    var.cost_filter_tag_key != "" && length(var.cost_filter_tag_values) > 0 ? {
      "TagKeyValue" = [for v in var.cost_filter_tag_values : "user:${var.cost_filter_tag_key}$${v}"]
    } : {}
  )

  # All SNS topic ARNs (created topic + additional)
  all_sns_topic_arns = concat(
    [aws_sns_topic.budget_alerts.arn],
    var.alert_sns_topic_arns
  )
}

# ============================================
# Monthly Cost Budget
# ============================================

resource "aws_budgets_budget" "monthly" {
  name         = local.budget_name
  budget_type  = var.budget_type
  limit_amount = tostring(var.budget_amount)
  limit_unit   = "USD"
  time_unit    = var.budget_time_unit

  # Cost filters (only if specified)
  dynamic "cost_filter" {
    for_each = local.cost_filters
    content {
      name   = cost_filter.key
      values = cost_filter.value
    }
  }

  # Cost types configuration
  cost_types {
    include_credit             = false
    include_discount           = true
    include_other_subscription = true
    include_recurring          = true
    include_refund             = false
    include_subscription       = true
    include_support            = true
    include_tax                = true
    include_upfront            = true
    use_amortized              = false
    use_blended                = false
  }

  # Notification thresholds
  dynamic "notification" {
    for_each = var.alert_thresholds
    content {
      comparison_operator        = "GREATER_THAN"
      threshold                  = notification.value
      threshold_type             = "PERCENTAGE"
      notification_type          = notification.value <= 100 ? "FORECASTED" : "ACTUAL"
      subscriber_sns_topic_arns  = local.all_sns_topic_arns
      subscriber_email_addresses = []
    }
  }

  # Auto action for cost control (optional)
  dynamic "auto_adjust_data" {
    for_each = var.enable_auto_actions ? [] : []
    content {
      auto_adjust_type = "HISTORICAL"
      historical_options {
        budget_adjustment_period = 1
      }
    }
  }

  tags = merge(var.tags, {
    Name        = local.budget_name
    Module      = "budgets"
    Environment = var.environment
  })
}

# ============================================
# Budget Action (Optional - for cost control)
# ============================================

resource "aws_budgets_budget_action" "cost_control" {
  count = var.enable_auto_actions && var.auto_action_iam_role_arn != "" && var.auto_action_policy_arn != "" ? 1 : 0

  budget_name        = aws_budgets_budget.monthly.name
  action_type        = var.auto_action_type
  approval_model     = "AUTOMATIC"
  notification_type  = "ACTUAL"

  action_threshold {
    action_threshold_type  = "PERCENTAGE"
    action_threshold_value = var.auto_action_threshold
  }

  definition {
    iam_action_definition {
      policy_arn = var.auto_action_policy_arn
      roles      = [var.auto_action_iam_role_arn]
    }
  }

  execution_role_arn = var.auto_action_iam_role_arn

  subscriber {
    subscription_type = "SNS"
    address           = aws_sns_topic.budget_alerts.arn
  }
}

# ============================================
# Service-Specific Budgets (Optional)
# ============================================

resource "aws_budgets_budget" "ec2" {
  count = contains(var.cost_filter_service, "Amazon Elastic Compute Cloud - Compute") ? 0 : 1

  name         = "${local.name}-ec2-budget"
  budget_type  = "COST"
  limit_amount = tostring(var.budget_amount * 0.4) # 40% of total for EC2
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  cost_filter {
    name   = "Service"
    values = ["Amazon Elastic Compute Cloud - Compute"]
  }

  cost_types {
    include_credit             = false
    include_discount           = true
    include_other_subscription = true
    include_recurring          = true
    include_refund             = false
    include_subscription       = true
    include_support            = true
    include_tax                = true
    include_upfront            = true
    use_amortized              = false
    use_blended                = false
  }

  notification {
    comparison_operator       = "GREATER_THAN"
    threshold                 = 80
    threshold_type            = "PERCENTAGE"
    notification_type         = "FORECASTED"
    subscriber_sns_topic_arns = local.all_sns_topic_arns
  }

  notification {
    comparison_operator       = "GREATER_THAN"
    threshold                 = 100
    threshold_type            = "PERCENTAGE"
    notification_type         = "ACTUAL"
    subscriber_sns_topic_arns = local.all_sns_topic_arns
  }

  tags = merge(var.tags, {
    Name        = "${local.name}-ec2-budget"
    Module      = "budgets"
    Service     = "EC2"
    Environment = var.environment
  })
}

resource "aws_budgets_budget" "rds" {
  count = contains(var.cost_filter_service, "Amazon Relational Database Service") ? 0 : 1

  name         = "${local.name}-rds-budget"
  budget_type  = "COST"
  limit_amount = tostring(var.budget_amount * 0.25) # 25% of total for RDS
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  cost_filter {
    name   = "Service"
    values = ["Amazon Relational Database Service"]
  }

  cost_types {
    include_credit             = false
    include_discount           = true
    include_other_subscription = true
    include_recurring          = true
    include_refund             = false
    include_subscription       = true
    include_support            = true
    include_tax                = true
    include_upfront            = true
    use_amortized              = false
    use_blended                = false
  }

  notification {
    comparison_operator       = "GREATER_THAN"
    threshold                 = 80
    threshold_type            = "PERCENTAGE"
    notification_type         = "FORECASTED"
    subscriber_sns_topic_arns = local.all_sns_topic_arns
  }

  notification {
    comparison_operator       = "GREATER_THAN"
    threshold                 = 100
    threshold_type            = "PERCENTAGE"
    notification_type         = "ACTUAL"
    subscriber_sns_topic_arns = local.all_sns_topic_arns
  }

  tags = merge(var.tags, {
    Name        = "${local.name}-rds-budget"
    Module      = "budgets"
    Service     = "RDS"
    Environment = var.environment
  })
}

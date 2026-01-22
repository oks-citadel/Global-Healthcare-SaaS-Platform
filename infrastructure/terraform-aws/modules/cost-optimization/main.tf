# ============================================
# Cost Optimization Module
# ============================================
# Implements AWS cost optimization best practices:
# - Budget alerts and anomaly detection
# - Savings Plans recommendations
# - Resource tagging for cost allocation
# - Compute optimization (Spot, Reserved)
# - Storage lifecycle policies
# - Right-sizing recommendations
# ============================================

locals {
  name = "${var.project_name}-${var.environment}"

  cost_tags = merge(var.tags, {
    Module      = "cost-optimization"
    CostCenter  = var.cost_center
    Environment = var.environment
  })
}

# ============================================
# AWS Budgets - Monthly Cost Alerts
# ============================================

resource "aws_budgets_budget" "monthly" {
  name         = "${local.name}-monthly-budget"
  budget_type  = "COST"
  limit_amount = var.monthly_budget_limit
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  cost_filter {
    name   = "TagKeyValue"
    values = ["user:Project$${var.project_name}"]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 50
    threshold_type             = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = var.budget_alert_emails
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = var.budget_alert_emails
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = var.budget_alert_emails
  }
}

# Per-service budgets
resource "aws_budgets_budget" "compute" {
  name         = "${local.name}-compute-budget"
  budget_type  = "COST"
  limit_amount = var.compute_budget_limit
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  cost_filter {
    name   = "Service"
    values = ["Amazon Elastic Compute Cloud - Compute", "Amazon Elastic Container Service"]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = var.budget_alert_emails
  }
}

resource "aws_budgets_budget" "database" {
  name         = "${local.name}-database-budget"
  budget_type  = "COST"
  limit_amount = var.database_budget_limit
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  cost_filter {
    name   = "Service"
    values = ["Amazon Relational Database Service", "Amazon ElastiCache"]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = var.budget_alert_emails
  }
}

# ============================================
# Cost Anomaly Detection
# ============================================

resource "aws_ce_anomaly_monitor" "service" {
  name              = "${local.name}-service-anomaly-monitor"
  monitor_type      = "DIMENSIONAL"
  monitor_dimension = "SERVICE"
}

resource "aws_ce_anomaly_monitor" "custom" {
  name         = "${local.name}-custom-anomaly-monitor"
  monitor_type = "CUSTOM"

  monitor_specification = jsonencode({
    And = null
    Or  = null
    Not = null
    Dimensions = {
      Key          = "LINKED_ACCOUNT"
      Values       = []
      MatchOptions = null
    }
    Tags = {
      Key          = "Project"
      Values       = [var.project_name]
      MatchOptions = null
    }
    CostCategories = null
  })
}

resource "aws_ce_anomaly_subscription" "alerts" {
  name      = "${local.name}-anomaly-subscription"
  frequency = "DAILY"

  monitor_arn_list = [
    aws_ce_anomaly_monitor.service.arn,
    aws_ce_anomaly_monitor.custom.arn,
  ]

  subscriber {
    type    = "EMAIL"
    address = var.budget_alert_emails[0]
  }

  threshold_expression {
    dimension {
      key           = "ANOMALY_TOTAL_IMPACT_PERCENTAGE"
      values        = ["10"]
      match_options = ["GREATER_THAN_OR_EQUAL"]
    }
  }
}

# ============================================
# S3 Intelligent Tiering & Lifecycle
# ============================================

resource "aws_s3_bucket" "cost_optimized_storage" {
  bucket = "${local.name}-optimized-storage"
  tags   = local.cost_tags
}

resource "aws_s3_bucket_intelligent_tiering_configuration" "auto_tier" {
  bucket = aws_s3_bucket.cost_optimized_storage.id
  name   = "AutoTierEntireBucket"

  tiering {
    access_tier = "DEEP_ARCHIVE_ACCESS"
    days        = 180
  }

  tiering {
    access_tier = "ARCHIVE_ACCESS"
    days        = 90
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "optimized" {
  bucket = aws_s3_bucket.cost_optimized_storage.id

  rule {
    id     = "transition-to-ia"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    transition {
      days          = 365
      storage_class = "DEEP_ARCHIVE"
    }
  }

  rule {
    id     = "abort-incomplete-uploads"
    status = "Enabled"

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }

  rule {
    id     = "expire-old-versions"
    status = "Enabled"

    noncurrent_version_expiration {
      noncurrent_days = 90
    }

    noncurrent_version_transition {
      noncurrent_days = 30
      storage_class   = "GLACIER"
    }
  }

  rule {
    id     = "delete-expired-markers"
    status = "Enabled"

    expiration {
      expired_object_delete_marker = true
    }
  }
}

# ============================================
# CloudWatch Log Retention (Cost Savings)
# ============================================

resource "aws_cloudwatch_log_group" "cost_optimized" {
  for_each = var.log_groups

  name              = each.value.name
  retention_in_days = each.value.retention_days
  kms_key_id        = var.log_group_kms_key_arn
  tags              = local.cost_tags
}

# ============================================
# EC2 Spot Fleet for Non-Critical Workloads
# ============================================

resource "aws_spot_fleet_request" "workers" {
  count = var.enable_spot_instances ? 1 : 0

  iam_fleet_role                      = aws_iam_role.spot_fleet[0].arn
  spot_price                          = var.spot_max_price
  target_capacity                     = var.spot_target_capacity
  terminate_instances_with_expiration = true
  valid_until                         = timeadd(timestamp(), "8760h") # 1 year

  launch_specification {
    instance_type          = var.spot_instance_types[0]
    ami                    = var.spot_ami_id
    subnet_id              = var.private_subnet_ids[0]
    vpc_security_group_ids = var.security_group_ids

    tags = merge(local.cost_tags, {
      Name = "${local.name}-spot-worker"
    })
  }

  dynamic "launch_specification" {
    for_each = slice(var.spot_instance_types, 1, length(var.spot_instance_types))
    content {
      instance_type          = launch_specification.value
      ami                    = var.spot_ami_id
      subnet_id              = var.private_subnet_ids[0]
      vpc_security_group_ids = var.security_group_ids

      tags = merge(local.cost_tags, {
        Name = "${local.name}-spot-worker"
      })
    }
  }

  tags = local.cost_tags
}

resource "aws_iam_role" "spot_fleet" {
  count = var.enable_spot_instances ? 1 : 0

  name = "${local.name}-spot-fleet-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "spotfleet.amazonaws.com"
      }
    }]
  })

  tags = local.cost_tags
}

resource "aws_iam_role_policy_attachment" "spot_fleet" {
  count = var.enable_spot_instances ? 1 : 0

  role       = aws_iam_role.spot_fleet[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2SpotFleetTaggingRole"
}

# ============================================
# Auto Scaling with Predictive Scaling
# ============================================

resource "aws_autoscaling_policy" "predictive" {
  count = var.enable_predictive_scaling ? 1 : 0

  name                   = "${local.name}-predictive-scaling"
  autoscaling_group_name = var.autoscaling_group_name
  policy_type            = "PredictiveScaling"

  predictive_scaling_configuration {
    mode                         = "ForecastAndScale"
    scheduling_buffer_time       = 300
    max_capacity_breach_behavior = "IncreaseMaxCapacity"
    max_capacity_buffer          = 10

    metric_specification {
      target_value = var.target_cpu_utilization

      predefined_load_metric_specification {
        predefined_metric_type = "ASGTotalCPUUtilization"
        resource_label         = var.autoscaling_group_name
      }

      predefined_scaling_metric_specification {
        predefined_metric_type = "ASGAverageCPUUtilization"
        resource_label         = var.autoscaling_group_name
      }
    }
  }
}

# Target tracking for cost-efficient scaling
resource "aws_autoscaling_policy" "target_tracking" {
  count = var.autoscaling_group_name != "" ? 1 : 0

  name                   = "${local.name}-target-tracking"
  autoscaling_group_name = var.autoscaling_group_name
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value     = var.target_cpu_utilization
    disable_scale_in = false
  }
}

# Scale down during off-hours
resource "aws_autoscaling_schedule" "scale_down_night" {
  count = var.enable_scheduled_scaling ? 1 : 0

  scheduled_action_name  = "${local.name}-scale-down-night"
  autoscaling_group_name = var.autoscaling_group_name
  min_size               = var.night_min_capacity
  max_size               = var.night_max_capacity
  desired_capacity       = var.night_desired_capacity
  recurrence             = "0 22 * * *" # 10 PM UTC
  time_zone              = "UTC"
}

resource "aws_autoscaling_schedule" "scale_up_morning" {
  count = var.enable_scheduled_scaling ? 1 : 0

  scheduled_action_name  = "${local.name}-scale-up-morning"
  autoscaling_group_name = var.autoscaling_group_name
  min_size               = var.day_min_capacity
  max_size               = var.day_max_capacity
  desired_capacity       = var.day_desired_capacity
  recurrence             = "0 6 * * *" # 6 AM UTC
  time_zone              = "UTC"
}

# ============================================
# RDS Cost Optimization
# ============================================

# RDS Proxy for connection pooling (reduces RDS costs)
resource "aws_db_proxy" "main" {
  count = var.enable_rds_proxy ? 1 : 0

  name                   = "${local.name}-rds-proxy"
  debug_logging          = false
  engine_family          = var.rds_engine_family
  idle_client_timeout    = 1800
  require_tls            = true
  role_arn               = aws_iam_role.rds_proxy[0].arn
  vpc_security_group_ids = var.security_group_ids
  vpc_subnet_ids         = var.private_subnet_ids

  auth {
    auth_scheme               = "SECRETS"
    iam_auth                  = "DISABLED"
    secret_arn                = var.rds_secret_arn
    client_password_auth_type = "MYSQL_NATIVE_PASSWORD"
  }

  tags = local.cost_tags
}

resource "aws_iam_role" "rds_proxy" {
  count = var.enable_rds_proxy ? 1 : 0

  name = "${local.name}-rds-proxy-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "rds.amazonaws.com"
      }
    }]
  })

  tags = local.cost_tags
}

resource "aws_iam_role_policy" "rds_proxy" {
  count = var.enable_rds_proxy ? 1 : 0

  name = "${local.name}-rds-proxy-policy"
  role = aws_iam_role.rds_proxy[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = [var.rds_secret_arn]
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "kms:ViaService" = "secretsmanager.${var.aws_region}.amazonaws.com"
          }
        }
      }
    ]
  })
}

# ============================================
# ElastiCache Cost Optimization
# ============================================

resource "aws_elasticache_replication_group" "cost_optimized" {
  count = var.enable_elasticache ? 1 : 0

  replication_group_id = "${local.name}-cache"
  description          = "Cost-optimized Redis cluster"

  node_type                  = var.cache_node_type
  num_cache_clusters         = var.cache_num_nodes
  port                       = 6379
  parameter_group_name       = "default.redis7"
  automatic_failover_enabled = var.cache_num_nodes > 1
  multi_az_enabled           = var.cache_num_nodes > 1

  # Cost optimization: use reserved nodes pricing
  engine_version = "7.0"

  # Auto-scale based on usage
  snapshot_retention_limit = 1
  snapshot_window          = "05:00-06:00"
  maintenance_window       = "sun:06:00-sun:07:00"

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true

  subnet_group_name  = var.cache_subnet_group
  security_group_ids = var.security_group_ids

  tags = local.cost_tags
}

# ============================================
# Lambda Cost Optimization
# ============================================

resource "aws_lambda_function" "cost_optimizer" {
  count = var.enable_cost_optimizer_lambda ? 1 : 0

  function_name = "${local.name}-cost-optimizer"
  runtime       = "python3.11"
  handler       = "index.handler"
  role          = aws_iam_role.cost_optimizer_lambda[0].arn
  timeout       = 300
  memory_size   = 256

  # Use ARM for 20% cost savings
  architectures = ["arm64"]

  filename         = "${path.module}/lambda/cost-optimizer.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda/cost-optimizer.zip")

  environment {
    variables = {
      ENVIRONMENT   = var.environment
      PROJECT_NAME  = var.project_name
      ALERT_EMAILS  = join(",", var.budget_alert_emails)
      SNS_TOPIC_ARN = var.sns_topic_arn
    }
  }

  tags = local.cost_tags
}

resource "aws_iam_role" "cost_optimizer_lambda" {
  count = var.enable_cost_optimizer_lambda ? 1 : 0

  name = "${local.name}-cost-optimizer-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })

  tags = local.cost_tags
}

resource "aws_iam_role_policy" "cost_optimizer_lambda" {
  count = var.enable_cost_optimizer_lambda ? 1 : 0

  name = "${local.name}-cost-optimizer-policy"
  role = aws_iam_role.cost_optimizer_lambda[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ce:GetCostAndUsage",
          "ce:GetCostForecast",
          "ce:GetReservationUtilization",
          "ce:GetSavingsPlansUtilization",
          "ce:GetRightsizingRecommendation"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ec2:DescribeInstances",
          "ec2:DescribeVolumes",
          "rds:DescribeDBInstances",
          "elasticache:DescribeCacheClusters"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "sns:Publish"
        ]
        Resource = var.sns_topic_arn
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# Schedule daily cost analysis
resource "aws_cloudwatch_event_rule" "daily_cost_analysis" {
  count = var.enable_cost_optimizer_lambda ? 1 : 0

  name                = "${local.name}-daily-cost-analysis"
  description         = "Trigger daily cost optimization analysis"
  schedule_expression = "cron(0 8 * * ? *)" # 8 AM UTC daily

  tags = local.cost_tags
}

resource "aws_cloudwatch_event_target" "cost_optimizer" {
  count = var.enable_cost_optimizer_lambda ? 1 : 0

  rule      = aws_cloudwatch_event_rule.daily_cost_analysis[0].name
  target_id = "TriggerCostOptimizer"
  arn       = aws_lambda_function.cost_optimizer[0].arn
}

resource "aws_lambda_permission" "cost_optimizer" {
  count = var.enable_cost_optimizer_lambda ? 1 : 0

  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cost_optimizer[0].function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.daily_cost_analysis[0].arn
}

# ============================================
# Cost Allocation Tags
# ============================================

resource "aws_ce_cost_allocation_tag" "project" {
  tag_key = "Project"
  status  = "Active"
}

resource "aws_ce_cost_allocation_tag" "environment" {
  tag_key = "Environment"
  status  = "Active"
}

resource "aws_ce_cost_allocation_tag" "cost_center" {
  tag_key = "CostCenter"
  status  = "Active"
}

resource "aws_ce_cost_allocation_tag" "team" {
  tag_key = "Team"
  status  = "Active"
}

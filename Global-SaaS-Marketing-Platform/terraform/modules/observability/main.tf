################################################################################
# Observability Module - Main Configuration
# Global SaaS Marketing Platform
################################################################################

locals {
  common_tags = merge(var.tags, {
    Module = "observability"
  })
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

################################################################################
# CloudWatch Log Groups
################################################################################

resource "aws_cloudwatch_log_group" "application" {
  for_each = var.log_groups

  name              = "/aws/${var.project_name}/${var.environment}/${each.key}"
  retention_in_days = each.value.retention_days
  kms_key_id        = var.kms_key_arn

  tags = merge(local.common_tags, {
    Name      = "${var.project_name}-${var.environment}-${each.key}"
    LogType   = each.value.log_type
  })
}

################################################################################
# CloudWatch Metric Alarms
################################################################################

resource "aws_cloudwatch_metric_alarm" "main" {
  for_each = var.metric_alarms

  alarm_name          = "${var.project_name}-${var.environment}-${each.key}"
  alarm_description   = each.value.description
  comparison_operator = each.value.comparison_operator
  evaluation_periods  = each.value.evaluation_periods
  metric_name         = each.value.metric_name
  namespace           = each.value.namespace
  period              = each.value.period
  statistic           = each.value.statistic
  threshold           = each.value.threshold
  treat_missing_data  = each.value.treat_missing_data

  dimensions = each.value.dimensions

  alarm_actions             = var.alarm_actions
  ok_actions                = var.ok_actions
  insufficient_data_actions = var.insufficient_data_actions

  tags = merge(local.common_tags, {
    Name     = "${var.project_name}-${var.environment}-${each.key}"
    Severity = each.value.severity
  })
}

# Composite Alarm for critical issues
resource "aws_cloudwatch_composite_alarm" "critical" {
  count             = var.enable_composite_alarms ? 1 : 0
  alarm_name        = "${var.project_name}-${var.environment}-critical-composite"
  alarm_description = "Composite alarm for critical issues"

  alarm_rule = join(" OR ", [
    for k, v in var.metric_alarms : "ALARM(${aws_cloudwatch_metric_alarm.main[k].alarm_name})"
    if v.severity == "critical"
  ])

  alarm_actions = var.critical_alarm_actions

  tags = local.common_tags
}

################################################################################
# CloudWatch Dashboard
################################################################################

resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.project_name}-${var.environment}-main"

  dashboard_body = jsonencode({
    widgets = concat(
      # EKS Metrics
      [
        {
          type   = "metric"
          x      = 0
          y      = 0
          width  = 12
          height = 6
          properties = {
            title  = "EKS Cluster CPU/Memory"
            region = data.aws_region.current.name
            metrics = [
              ["ContainerInsights", "node_cpu_utilization", "ClusterName", var.eks_cluster_name, { stat = "Average", period = 300 }],
              [".", "node_memory_utilization", ".", ".", { stat = "Average", period = 300 }]
            ]
            view   = "timeSeries"
            stacked = false
          }
        },
        {
          type   = "metric"
          x      = 12
          y      = 0
          width  = 12
          height = 6
          properties = {
            title  = "EKS Pod Count"
            region = data.aws_region.current.name
            metrics = [
              ["ContainerInsights", "pod_number_of_container_restarts", "ClusterName", var.eks_cluster_name, { stat = "Sum", period = 300 }],
              [".", "node_number_of_running_pods", ".", ".", { stat = "Average", period = 300 }]
            ]
            view   = "timeSeries"
            stacked = false
          }
        }
      ],
      # Aurora Metrics
      [
        {
          type   = "metric"
          x      = 0
          y      = 6
          width  = 12
          height = 6
          properties = {
            title  = "Aurora PostgreSQL Performance"
            region = data.aws_region.current.name
            metrics = [
              ["AWS/RDS", "CPUUtilization", "DBClusterIdentifier", var.aurora_cluster_id, { stat = "Average", period = 300 }],
              [".", "DatabaseConnections", ".", ".", { stat = "Average", period = 300 }],
              [".", "FreeableMemory", ".", ".", { stat = "Average", period = 300 }]
            ]
            view   = "timeSeries"
            stacked = false
          }
        },
        {
          type   = "metric"
          x      = 12
          y      = 6
          width  = 12
          height = 6
          properties = {
            title  = "Aurora PostgreSQL IOPS"
            region = data.aws_region.current.name
            metrics = [
              ["AWS/RDS", "ReadIOPS", "DBClusterIdentifier", var.aurora_cluster_id, { stat = "Average", period = 300 }],
              [".", "WriteIOPS", ".", ".", { stat = "Average", period = 300 }]
            ]
            view   = "timeSeries"
            stacked = false
          }
        }
      ],
      # Redis Metrics
      [
        {
          type   = "metric"
          x      = 0
          y      = 12
          width  = 12
          height = 6
          properties = {
            title  = "ElastiCache Redis"
            region = data.aws_region.current.name
            metrics = [
              ["AWS/ElastiCache", "CPUUtilization", "ReplicationGroupId", var.redis_replication_group_id, { stat = "Average", period = 300 }],
              [".", "DatabaseMemoryUsagePercentage", ".", ".", { stat = "Average", period = 300 }],
              [".", "CurrConnections", ".", ".", { stat = "Average", period = 300 }]
            ]
            view   = "timeSeries"
            stacked = false
          }
        }
      ],
      # Application Metrics
      [
        {
          type   = "metric"
          x      = 12
          y      = 12
          width  = 12
          height = 6
          properties = {
            title  = "Application Latency"
            region = data.aws_region.current.name
            metrics = [
              ["AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", var.alb_arn_suffix, { stat = "p95", period = 300 }],
              [".", ".", ".", ".", { stat = "p99", period = 300 }],
              [".", ".", ".", ".", { stat = "Average", period = 300 }]
            ]
            view   = "timeSeries"
            stacked = false
          }
        }
      ],
      # Error Rates
      [
        {
          type   = "metric"
          x      = 0
          y      = 18
          width  = 12
          height = 6
          properties = {
            title  = "HTTP Error Rates"
            region = data.aws_region.current.name
            metrics = [
              ["AWS/ApplicationELB", "HTTPCode_Target_4XX_Count", "LoadBalancer", var.alb_arn_suffix, { stat = "Sum", period = 300 }],
              [".", "HTTPCode_Target_5XX_Count", ".", ".", { stat = "Sum", period = 300 }],
              [".", "HTTPCode_ELB_5XX_Count", ".", ".", { stat = "Sum", period = 300 }]
            ]
            view   = "timeSeries"
            stacked = false
          }
        },
        {
          type   = "metric"
          x      = 12
          y      = 18
          width  = 12
          height = 6
          properties = {
            title  = "Request Count"
            region = data.aws_region.current.name
            metrics = [
              ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", var.alb_arn_suffix, { stat = "Sum", period = 300 }]
            ]
            view   = "timeSeries"
            stacked = false
          }
        }
      ]
    )
  })
}

################################################################################
# Amazon Managed Prometheus (AMP)
################################################################################

resource "aws_prometheus_workspace" "main" {
  count = var.enable_amp ? 1 : 0
  alias = "${var.project_name}-${var.environment}"

  logging_configuration {
    log_group_arn = "${aws_cloudwatch_log_group.amp[0].arn}:*"
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-amp"
  })
}

resource "aws_cloudwatch_log_group" "amp" {
  count             = var.enable_amp ? 1 : 0
  name              = "/aws/prometheus/${var.project_name}-${var.environment}"
  retention_in_days = var.amp_log_retention_days
  kms_key_id        = var.kms_key_arn

  tags = local.common_tags
}

# AMP Alert Manager Definition
resource "aws_prometheus_alert_manager_definition" "main" {
  count        = var.enable_amp && var.amp_alert_manager_definition != null ? 1 : 0
  workspace_id = aws_prometheus_workspace.main[0].id
  definition   = var.amp_alert_manager_definition
}

# AMP Rule Groups
resource "aws_prometheus_rule_group_namespace" "main" {
  for_each = var.enable_amp ? var.amp_rule_groups : {}

  name         = each.key
  workspace_id = aws_prometheus_workspace.main[0].id
  data         = each.value
}

################################################################################
# Amazon Managed Grafana (AMG)
################################################################################

resource "aws_grafana_workspace" "main" {
  count                    = var.enable_amg ? 1 : 0
  name                     = "${var.project_name}-${var.environment}"
  description              = "Grafana workspace for ${var.project_name} ${var.environment}"
  account_access_type      = "CURRENT_ACCOUNT"
  authentication_providers = var.amg_authentication_providers
  permission_type          = "SERVICE_MANAGED"
  role_arn                 = aws_iam_role.grafana[0].arn

  data_sources = [
    "AMAZON_OPENSEARCH_SERVICE",
    "CLOUDWATCH",
    "PROMETHEUS",
    "XRAY"
  ]

  notification_destinations = ["SNS"]

  configuration = jsonencode({
    unifiedAlerting = {
      enabled = true
    }
    plugins = {
      pluginAdminEnabled = true
    }
  })

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-grafana"
  })
}

resource "aws_iam_role" "grafana" {
  count = var.enable_amg ? 1 : 0
  name  = "${var.project_name}-${var.environment}-grafana"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "grafana.amazonaws.com"
      }
      Condition = {
        StringEquals = {
          "aws:SourceAccount" = data.aws_caller_identity.current.account_id
        }
        StringLike = {
          "aws:SourceArn" = "arn:aws:grafana:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:/workspaces/*"
        }
      }
    }]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy" "grafana" {
  count = var.enable_amg ? 1 : 0
  name  = "${var.project_name}-${var.environment}-grafana-policy"
  role  = aws_iam_role.grafana[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "cloudwatch:DescribeAlarmsForMetric",
          "cloudwatch:DescribeAlarmHistory",
          "cloudwatch:DescribeAlarms",
          "cloudwatch:ListMetrics",
          "cloudwatch:GetMetricStatistics",
          "cloudwatch:GetMetricData",
          "cloudwatch:GetInsightRuleReport"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "logs:DescribeLogGroups",
          "logs:GetLogGroupFields",
          "logs:StartQuery",
          "logs:StopQuery",
          "logs:GetQueryResults",
          "logs:GetLogEvents"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ec2:DescribeTags",
          "ec2:DescribeInstances",
          "ec2:DescribeRegions"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "tag:GetResources"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "aps:ListWorkspaces",
          "aps:DescribeWorkspace",
          "aps:QueryMetrics",
          "aps:GetLabels",
          "aps:GetSeries",
          "aps:GetMetricMetadata"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "xray:BatchGetTraces",
          "xray:GetTraceSummaries",
          "xray:GetTraceGraph",
          "xray:GetGroups",
          "xray:GetGroup",
          "xray:GetTimeSeriesServiceStatistics",
          "xray:GetInsightSummaries",
          "xray:GetInsight",
          "xray:GetServiceGraph"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "es:ESHttpGet",
          "es:DescribeElasticsearchDomains",
          "es:ListDomainNames"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "sns:Publish"
        ]
        Resource = var.alert_sns_topic_arn != null ? var.alert_sns_topic_arn : "*"
      }
    ]
  })
}

################################################################################
# X-Ray
################################################################################

resource "aws_xray_sampling_rule" "main" {
  count         = var.enable_xray ? 1 : 0
  rule_name     = "${var.project_name}-${var.environment}-sampling"
  priority      = 1000
  version       = 1
  reservoir_size = var.xray_reservoir_size
  fixed_rate    = var.xray_fixed_rate
  url_path      = "*"
  host          = "*"
  http_method   = "*"
  service_type  = "*"
  service_name  = "${var.project_name}-${var.environment}-*"
  resource_arn  = "*"

  attributes = {}
}

resource "aws_xray_group" "main" {
  count             = var.enable_xray ? 1 : 0
  group_name        = "${var.project_name}-${var.environment}"
  filter_expression = "service(id(name: \"${var.project_name}-${var.environment}\"))"

  insights_configuration {
    insights_enabled      = true
    notifications_enabled = true
  }

  tags = local.common_tags
}

################################################################################
# CloudWatch Log Insights Queries
################################################################################

resource "aws_cloudwatch_query_definition" "main" {
  for_each = var.log_insights_queries

  name            = "${var.project_name}/${var.environment}/${each.key}"
  log_group_names = each.value.log_groups
  query_string    = each.value.query
}

################################################################################
# Anomaly Detection Alarms
################################################################################

resource "aws_cloudwatch_metric_alarm" "anomaly" {
  for_each = var.anomaly_detection_alarms

  alarm_name          = "${var.project_name}-${var.environment}-anomaly-${each.key}"
  alarm_description   = each.value.description
  comparison_operator = "LessThanLowerOrGreaterThanUpperThreshold"
  evaluation_periods  = each.value.evaluation_periods
  threshold_metric_id = "ad1"

  metric_query {
    id          = "m1"
    return_data = true

    metric {
      metric_name = each.value.metric_name
      namespace   = each.value.namespace
      period      = each.value.period
      stat        = each.value.stat
      dimensions  = each.value.dimensions
    }
  }

  metric_query {
    id          = "ad1"
    expression  = "ANOMALY_DETECTION_BAND(m1, ${each.value.anomaly_standard_deviations})"
    label       = "Anomaly Detection Band"
    return_data = true
  }

  alarm_actions = var.alarm_actions
  ok_actions    = var.ok_actions

  tags = merge(local.common_tags, {
    Name     = "${var.project_name}-${var.environment}-anomaly-${each.key}"
    Severity = each.value.severity
  })
}

################################################################################
# SNS Topics for Alerts
################################################################################

resource "aws_sns_topic" "alerts" {
  name              = "${var.project_name}-${var.environment}-alerts"
  kms_master_key_id = var.kms_key_arn

  tags = local.common_tags
}

resource "aws_sns_topic_policy" "alerts" {
  arn = aws_sns_topic.alerts.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudWatchAlarms"
        Effect = "Allow"
        Principal = {
          Service = "cloudwatch.amazonaws.com"
        }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.alerts.arn
        Condition = {
          ArnLike = {
            "aws:SourceArn" = "arn:aws:cloudwatch:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:alarm:*"
          }
        }
      }
    ]
  })
}

resource "aws_sns_topic_subscription" "email" {
  for_each = toset(var.alert_email_addresses)

  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = each.value
}

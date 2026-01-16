################################################################################
# Production Environment - Main Configuration
# Global SaaS Marketing Platform
################################################################################

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }

  backend "s3" {
    bucket         = "global-saas-marketing-platform-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
      Repository  = "global-saas-marketing-platform"
    }
  }
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
      Repository  = "global-saas-marketing-platform"
    }
  }
}

################################################################################
# Local Variables
################################################################################

locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
    CostCenter  = var.cost_center
  }
}

################################################################################
# Security Baseline Module
################################################################################

module "security_baseline" {
  source = "../../modules/security_baseline"

  project_name = var.project_name
  environment  = var.environment

  kms_deletion_window     = 30
  enable_multi_region_kms = true
  allowed_regions         = var.allowed_regions

  enable_cloudtrail               = true
  cloudtrail_retention_days       = 365
  cloudtrail_log_retention_days   = 365

  enable_config    = true
  enable_guardduty = true

  enable_waf            = true
  waf_rate_limit        = 2000
  waf_blocked_countries = var.waf_blocked_countries
  waf_log_retention_days = 90

  enable_shield_advanced = var.enable_shield_advanced

  tags = local.common_tags
}

################################################################################
# Networking Module
################################################################################

module "networking" {
  source = "../../modules/networking"

  project_name = var.project_name
  environment  = var.environment

  vpc_cidr              = var.vpc_cidr
  az_count              = 3
  enable_nat_gateway    = true
  single_nat_gateway    = false  # Full HA for production
  enable_vpc_endpoints  = true
  enable_flow_logs      = true
  flow_logs_retention_days = 90

  kms_key_arn = module.security_baseline.main_kms_key_arn

  vpc_endpoint_services = [
    "ecr.api",
    "ecr.dkr",
    "ecs",
    "ecs-agent",
    "ecs-telemetry",
    "logs",
    "monitoring",
    "ssm",
    "ssmmessages",
    "ec2messages",
    "kms",
    "secretsmanager",
    "sts",
    "elasticloadbalancing",
    "autoscaling",
    "sqs",
    "sns",
    "events"
  ]

  enable_bastion        = false  # Use Session Manager in production
  bastion_allowed_cidrs = []

  tags = local.common_tags
}

################################################################################
# EKS Cluster Module
################################################################################

module "eks_cluster" {
  source = "../../modules/eks_cluster"

  project_name = var.project_name
  environment  = var.environment

  cluster_version               = var.eks_cluster_version
  subnet_ids                    = module.networking.private_subnet_ids
  node_subnet_ids               = module.networking.private_subnet_ids
  cluster_security_group_id     = module.networking.eks_cluster_security_group_id
  node_security_group_id        = module.networking.eks_nodes_security_group_id
  kms_key_arn                   = module.security_baseline.eks_kms_key_arn

  cluster_endpoint_private_access      = true
  cluster_endpoint_public_access       = false  # Private only in production
  cluster_endpoint_public_access_cidrs = []

  cluster_log_retention_days = 90

  node_groups = {
    system = {
      instance_types             = ["m6i.large", "m6a.large"]
      capacity_type              = "ON_DEMAND"
      disk_size                  = 100
      ami_type                   = "AL2_x86_64"
      desired_size               = 3
      max_size                   = 6
      min_size                   = 3
      max_unavailable_percentage = 25
      labels                     = { workload = "system" }
      taints = [{
        key    = "CriticalAddonsOnly"
        value  = "true"
        effect = "NO_SCHEDULE"
      }]
    }
    general = {
      instance_types             = ["m6i.xlarge", "m6a.xlarge"]
      capacity_type              = "ON_DEMAND"
      disk_size                  = 100
      ami_type                   = "AL2_x86_64"
      desired_size               = 4
      max_size                   = 20
      min_size                   = 3
      max_unavailable_percentage = 25
      labels                     = { workload = "general" }
      taints                     = []
    }
    compute = {
      instance_types             = ["c6i.xlarge", "c6a.xlarge"]
      capacity_type              = "ON_DEMAND"
      disk_size                  = 100
      ami_type                   = "AL2_x86_64"
      desired_size               = 2
      max_size                   = 20
      min_size                   = 2
      max_unavailable_percentage = 25
      labels                     = { workload = "compute" }
      taints                     = []
    }
    spot = {
      instance_types             = ["m6i.xlarge", "m6a.xlarge", "m5.xlarge", "m5a.xlarge"]
      capacity_type              = "SPOT"
      disk_size                  = 100
      ami_type                   = "AL2_x86_64"
      desired_size               = 0
      max_size                   = 50
      min_size                   = 0
      max_unavailable_percentage = 50
      labels                     = { workload = "spot" }
      taints = [{
        key    = "spot"
        value  = "true"
        effect = "PREFER_NO_SCHEDULE"
      }]
    }
  }

  enable_ebs_csi_driver           = true
  enable_efs_csi_driver           = true
  enable_cloudwatch_observability = true
  enable_pod_identity_agent       = true
  enable_guardduty_agent          = true

  enable_aws_load_balancer_controller = true
  enable_cluster_autoscaler           = true
  enable_external_dns                 = true
  enable_cert_manager                 = true

  tags = local.common_tags
}

################################################################################
# Storage Module
################################################################################

module "storage" {
  source = "../../modules/storage"

  project_name = var.project_name
  environment  = var.environment

  kms_key_arn          = module.security_baseline.s3_kms_key_arn
  cors_allowed_origins = var.cors_allowed_origins
  log_retention_days   = 365

  cloudfront_distribution_arn = module.edge_cloudfront.distribution_arn

  enable_efs            = true
  efs_subnet_ids        = module.networking.private_subnet_ids
  efs_security_group_id = module.networking.efs_security_group_id
  efs_performance_mode  = "generalPurpose"
  efs_throughput_mode   = "elastic"

  efs_access_points = {
    app = {
      posix_user = {
        gid = 1000
        uid = 1000
      }
      root_directory = {
        path = "/app"
        creation_info = {
          owner_gid   = 1000
          owner_uid   = 1000
          permissions = "755"
        }
      }
    }
    media = {
      posix_user = {
        gid = 1000
        uid = 1000
      }
      root_directory = {
        path = "/media"
        creation_info = {
          owner_gid   = 1000
          owner_uid   = 1000
          permissions = "755"
        }
      }
    }
    logs = {
      posix_user = {
        gid = 1000
        uid = 1000
      }
      root_directory = {
        path = "/logs"
        creation_info = {
          owner_gid   = 1000
          owner_uid   = 1000
          permissions = "755"
        }
      }
    }
  }

  tags = local.common_tags
}

################################################################################
# Databases Module
################################################################################

resource "random_password" "redis_auth_token" {
  length  = 32
  special = false
}

module "databases" {
  source = "../../modules/databases"

  project_name = var.project_name
  environment  = var.environment

  kms_key_arn        = module.security_baseline.rds_kms_key_arn
  log_retention_days = 90
  sns_topic_arn      = module.messaging.sns_topic_arns["alerts"]

  # Aurora PostgreSQL - Production sizing
  aurora_postgresql_version    = "15.4"
  aurora_database_name         = "marketing"
  aurora_master_username       = "admin"
  db_subnet_group_name         = module.networking.db_subnet_group_name
  rds_security_group_id        = module.networking.rds_security_group_id
  aurora_instance_count        = 3
  aurora_min_capacity          = 2
  aurora_max_capacity          = 64
  aurora_backup_retention_days = 35

  # DynamoDB with provisioned capacity for predictable workloads
  dynamodb_tables = {
    sessions = {
      billing_mode = "PAY_PER_REQUEST"
      hash_key     = "session_id"
      attributes = [
        { name = "session_id", type = "S" },
        { name = "user_id", type = "S" },
        { name = "created_at", type = "N" }
      ]
      global_secondary_indexes = [
        {
          name            = "user-index"
          hash_key        = "user_id"
          range_key       = "created_at"
          projection_type = "ALL"
        }
      ]
      ttl_attribute                = "ttl"
      enable_point_in_time_recovery = true
    }
    cache = {
      billing_mode = "PROVISIONED"
      hash_key     = "cache_key"
      read_capacity  = 100
      write_capacity = 50
      attributes = [
        { name = "cache_key", type = "S" }
      ]
      ttl_attribute                = "ttl"
      enable_point_in_time_recovery = true
      enable_autoscaling           = true
      autoscaling_min_read_capacity  = 50
      autoscaling_max_read_capacity  = 1000
      autoscaling_min_write_capacity = 25
      autoscaling_max_write_capacity = 500
      autoscaling_target_value       = 70
    }
    events = {
      billing_mode = "PAY_PER_REQUEST"
      hash_key     = "event_id"
      range_key    = "timestamp"
      attributes = [
        { name = "event_id", type = "S" },
        { name = "timestamp", type = "N" },
        { name = "user_id", type = "S" },
        { name = "campaign_id", type = "S" }
      ]
      global_secondary_indexes = [
        {
          name            = "user-events-index"
          hash_key        = "user_id"
          range_key       = "timestamp"
          projection_type = "ALL"
        },
        {
          name            = "campaign-events-index"
          hash_key        = "campaign_id"
          range_key       = "timestamp"
          projection_type = "ALL"
        }
      ]
      stream_enabled   = true
      stream_view_type = "NEW_AND_OLD_IMAGES"
      enable_point_in_time_recovery = true
    }
    campaigns = {
      billing_mode = "PAY_PER_REQUEST"
      hash_key     = "campaign_id"
      attributes = [
        { name = "campaign_id", type = "S" },
        { name = "org_id", type = "S" },
        { name = "status", type = "S" }
      ]
      global_secondary_indexes = [
        {
          name            = "org-campaigns-index"
          hash_key        = "org_id"
          range_key       = "status"
          projection_type = "ALL"
        }
      ]
      enable_point_in_time_recovery = true
    }
  }

  # ElastiCache Redis - Production cluster
  elasticache_subnet_group_name = module.networking.elasticache_subnet_group_name
  elasticache_security_group_id = module.networking.elasticache_security_group_id
  redis_version                 = "7.0"
  redis_node_type               = "cache.r6g.xlarge"
  redis_num_cache_clusters      = 3
  redis_auth_token              = random_password.redis_auth_token.result
  redis_snapshot_retention_limit = 14

  # OpenSearch - Production cluster
  enable_opensearch             = true
  create_opensearch_service_linked_role = var.create_opensearch_service_linked_role
  opensearch_subnet_ids         = module.networking.private_subnet_ids
  opensearch_security_group_id  = module.networking.opensearch_security_group_id
  opensearch_version            = "OpenSearch_2.11"
  opensearch_instance_type      = "r6g.xlarge.search"
  opensearch_instance_count     = 3
  opensearch_dedicated_master_enabled = true
  opensearch_dedicated_master_type    = "m6g.large.search"
  opensearch_dedicated_master_count   = 3
  opensearch_volume_size        = 500
  opensearch_iops               = 6000
  opensearch_throughput         = 250
  opensearch_master_user_arn    = var.opensearch_master_user_arn

  tags = local.common_tags
}

################################################################################
# Messaging Module
################################################################################

module "messaging" {
  source = "../../modules/messaging"

  project_name       = var.project_name
  environment        = var.environment
  kms_key_arn        = module.security_baseline.main_kms_key_arn
  log_retention_days = 90

  event_archive_retention_days = 90

  sqs_queues = {
    events = {
      fifo                       = false
      visibility_timeout_seconds = 30
      message_retention_seconds  = 1209600  # 14 days
      max_receive_count          = 5
      kms_key_id                 = module.security_baseline.main_kms_key_arn
    }
    notifications = {
      fifo                       = false
      visibility_timeout_seconds = 60
      message_retention_seconds  = 1209600
      max_receive_count          = 5
      kms_key_id                 = module.security_baseline.main_kms_key_arn
    }
    email-processing = {
      fifo                       = true
      content_based_deduplication = true
      visibility_timeout_seconds = 120
      message_retention_seconds  = 1209600
      max_receive_count          = 3
      kms_key_id                 = module.security_baseline.main_kms_key_arn
    }
    analytics = {
      fifo                       = false
      visibility_timeout_seconds = 300
      message_retention_seconds  = 1209600
      max_receive_count          = 5
      kms_key_id                 = module.security_baseline.main_kms_key_arn
    }
    webhooks = {
      fifo                       = false
      visibility_timeout_seconds = 60
      message_retention_seconds  = 1209600
      max_receive_count          = 10
      kms_key_id                 = module.security_baseline.main_kms_key_arn
    }
  }

  sns_topics = {
    alerts = {
      kms_key_id        = module.security_baseline.main_kms_key_arn
      sqs_subscriptions = ["events"]
    }
    notifications = {
      kms_key_id        = module.security_baseline.main_kms_key_arn
      sqs_subscriptions = ["notifications"]
    }
    email-events = {
      kms_key_id        = module.security_baseline.main_kms_key_arn
      sqs_subscriptions = []
    }
    campaign-events = {
      kms_key_id        = module.security_baseline.main_kms_key_arn
      sqs_subscriptions = ["analytics"]
    }
  }

  step_functions = {
    campaign-orchestrator = {
      definition = jsonencode({
        Comment = "Campaign orchestration workflow"
        StartAt = "ValidateCampaign"
        States = {
          ValidateCampaign = {
            Type     = "Task"
            Resource = "arn:aws:states:::lambda:invoke"
            Parameters = {
              FunctionName = "$${ValidateCampaignFunction}"
              Payload = {
                "campaign.$" = "$.campaign"
              }
            }
            Next = "ScheduleCampaign"
          }
          ScheduleCampaign = {
            Type     = "Task"
            Resource = "arn:aws:states:::lambda:invoke"
            Parameters = {
              FunctionName = "$${ScheduleCampaignFunction}"
              Payload = {
                "campaign.$" = "$.campaign"
              }
            }
            Next = "WaitForSchedule"
          }
          WaitForSchedule = {
            Type            = "Wait"
            TimestampPath   = "$.scheduled_time"
            Next            = "ExecuteCampaign"
          }
          ExecuteCampaign = {
            Type     = "Task"
            Resource = "arn:aws:states:::lambda:invoke"
            Parameters = {
              FunctionName = "$${ExecuteCampaignFunction}"
              Payload = {
                "campaign.$" = "$.campaign"
              }
            }
            End = true
          }
        }
      })
      type = "STANDARD"
      additional_policies = [
        {
          Effect   = "Allow"
          Action   = ["lambda:InvokeFunction"]
          Resource = "*"
        }
      ]
    }
  }

  tags = local.common_tags
}

################################################################################
# Data Lake Module
################################################################################

module "data_lake" {
  source = "../../modules/data_lake"

  project_name       = var.project_name
  environment        = var.environment
  kms_key_arn        = module.security_baseline.s3_kms_key_arn
  log_retention_days = 90

  kinesis_streams = {
    events = {
      retention_period = 168  # 7 days
      stream_mode      = "ON_DEMAND"
    }
    clickstream = {
      retention_period = 72
      stream_mode      = "ON_DEMAND"
    }
    real-time-analytics = {
      retention_period = 24
      stream_mode      = "ON_DEMAND"
    }
  }

  firehose_streams = {
    events = {
      source_stream      = "events"
      s3_prefix          = "raw/events/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/hour=!{timestamp:HH}/"
      error_prefix       = "errors/events/!{firehose:error-output-type}/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/"
      buffer_size        = 128
      buffer_interval    = 300
      compression_format = "GZIP"
    }
    clickstream = {
      source_stream      = "clickstream"
      s3_prefix          = "raw/clickstream/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/hour=!{timestamp:HH}/"
      error_prefix       = "errors/clickstream/!{firehose:error-output-type}/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/"
      buffer_size        = 128
      buffer_interval    = 60
      compression_format = "GZIP"
    }
    real-time-analytics = {
      source_stream      = "real-time-analytics"
      s3_prefix          = "raw/analytics/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/hour=!{timestamp:HH}/"
      error_prefix       = "errors/analytics/!{firehose:error-output-type}/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/"
      buffer_size        = 64
      buffer_interval    = 60
      compression_format = "GZIP"
    }
  }

  glue_tables = {
    events = {
      description           = "Marketing events data"
      classification        = "json"
      s3_prefix             = "raw/events/"
      input_format          = "org.apache.hadoop.mapred.TextInputFormat"
      output_format         = "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat"
      serialization_library = "org.openx.data.jsonserde.JsonSerDe"
      columns = [
        { name = "event_id", type = "string" },
        { name = "event_type", type = "string" },
        { name = "timestamp", type = "bigint" },
        { name = "user_id", type = "string" },
        { name = "campaign_id", type = "string" },
        { name = "properties", type = "map<string,string>" }
      ]
      partition_keys = [
        { name = "year", type = "string" },
        { name = "month", type = "string" },
        { name = "day", type = "string" }
      ]
      enable_partition_projection = true
    }
  }

  glue_crawlers = {
    events = {
      s3_path  = "raw/events/"
      schedule = "cron(0 */4 * * ? *)"
    }
    clickstream = {
      s3_path  = "raw/clickstream/"
      schedule = "cron(0 */4 * * ? *)"
    }
    analytics = {
      s3_path  = "raw/analytics/"
      schedule = "cron(0 */4 * * ? *)"
    }
  }

  athena_bytes_scanned_cutoff = 53687091200  # 50 GB

  athena_named_queries = {
    daily-events-summary = {
      description = "Daily events summary query"
      query       = <<-EOF
        SELECT
          date_trunc('day', from_unixtime(timestamp/1000)) as event_date,
          event_type,
          COUNT(*) as event_count,
          COUNT(DISTINCT user_id) as unique_users
        FROM events
        WHERE year = format_datetime(current_date, 'yyyy')
          AND month = format_datetime(current_date, 'MM')
          AND day = format_datetime(current_date, 'dd')
        GROUP BY 1, 2
        ORDER BY 1 DESC, 3 DESC
      EOF
    }
    campaign-performance = {
      description = "Campaign performance metrics"
      query       = <<-EOF
        SELECT
          campaign_id,
          event_type,
          COUNT(*) as events,
          COUNT(DISTINCT user_id) as unique_users
        FROM events
        WHERE campaign_id IS NOT NULL
        GROUP BY 1, 2
        ORDER BY 1, 3 DESC
      EOF
    }
  }

  enable_lake_formation     = true
  lake_formation_admin_arn  = var.lake_formation_admin_arn

  tags = local.common_tags
}

################################################################################
# Email Module
################################################################################

module "email" {
  source = "../../modules/email"

  project_name       = var.project_name
  environment        = var.environment
  kms_key_arn        = module.security_baseline.main_kms_key_arn
  log_retention_days = 90

  domain_name       = var.ses_domain_name
  route53_zone_id   = var.route53_zone_id
  tracking_domain   = var.ses_tracking_domain
  enable_dmarc      = true
  dmarc_policy      = "reject"
  dmarc_subdomain_policy = "reject"
  dmarc_rua_email   = var.dmarc_email
  dmarc_ruf_email   = var.dmarc_email

  enable_firehose_destination = true
  data_lake_bucket_arn        = module.data_lake.data_lake_bucket_arn

  email_templates = {
    welcome = {
      subject = "Welcome to {{company_name}}"
      html    = "<html><body><h1>Welcome, {{name}}!</h1><p>Thank you for joining us.</p></body></html>"
      text    = "Welcome, {{name}}! Thank you for joining us."
    }
    notification = {
      subject = "{{subject}}"
      html    = "<html><body><h1>{{title}}</h1><p>{{body}}</p></body></html>"
      text    = "{{title}}\n\n{{body}}"
    }
    campaign = {
      subject = "{{subject}}"
      html    = "{{html_content}}"
      text    = "{{text_content}}"
    }
    password-reset = {
      subject = "Reset Your Password"
      html    = "<html><body><h1>Password Reset</h1><p>Click <a href='{{reset_link}}'>here</a> to reset your password.</p></body></html>"
      text    = "Password Reset\n\nVisit this link to reset your password: {{reset_link}}"
    }
  }

  allowed_from_addresses = var.ses_allowed_from_addresses

  tags = local.common_tags
}

################################################################################
# Observability Module
################################################################################

module "observability" {
  source = "../../modules/observability"

  project_name = var.project_name
  environment  = var.environment
  kms_key_arn  = module.security_baseline.main_kms_key_arn

  eks_cluster_name           = module.eks_cluster.cluster_name
  aurora_cluster_id          = module.databases.aurora_cluster_id
  redis_replication_group_id = module.databases.redis_replication_group_id
  alb_arn_suffix             = ""

  log_groups = {
    application = { retention_days = 90, log_type = "application" }
    audit       = { retention_days = 365, log_type = "audit" }
    security    = { retention_days = 365, log_type = "security" }
    performance = { retention_days = 30, log_type = "performance" }
  }

  metric_alarms = {
    high-cpu-aurora = {
      description         = "High CPU utilization on Aurora"
      comparison_operator = "GreaterThanThreshold"
      evaluation_periods  = 3
      metric_name         = "CPUUtilization"
      namespace           = "AWS/RDS"
      period              = 300
      statistic           = "Average"
      threshold           = 70
      dimensions          = { DBClusterIdentifier = module.databases.aurora_cluster_id }
      severity            = "critical"
    }
    high-connections-aurora = {
      description         = "High database connections on Aurora"
      comparison_operator = "GreaterThanThreshold"
      evaluation_periods  = 2
      metric_name         = "DatabaseConnections"
      namespace           = "AWS/RDS"
      period              = 300
      statistic           = "Average"
      threshold           = 500
      dimensions          = { DBClusterIdentifier = module.databases.aurora_cluster_id }
      severity            = "warning"
    }
    low-memory-aurora = {
      description         = "Low freeable memory on Aurora"
      comparison_operator = "LessThanThreshold"
      evaluation_periods  = 3
      metric_name         = "FreeableMemory"
      namespace           = "AWS/RDS"
      period              = 300
      statistic           = "Average"
      threshold           = 1073741824  # 1 GB
      dimensions          = { DBClusterIdentifier = module.databases.aurora_cluster_id }
      severity            = "warning"
    }
    high-cpu-redis = {
      description         = "High CPU utilization on Redis"
      comparison_operator = "GreaterThanThreshold"
      evaluation_periods  = 3
      metric_name         = "CPUUtilization"
      namespace           = "AWS/ElastiCache"
      period              = 300
      statistic           = "Average"
      threshold           = 70
      dimensions          = { ReplicationGroupId = module.databases.redis_replication_group_id }
      severity            = "warning"
    }
    high-memory-redis = {
      description         = "High memory usage on Redis"
      comparison_operator = "GreaterThanThreshold"
      evaluation_periods  = 2
      metric_name         = "DatabaseMemoryUsagePercentage"
      namespace           = "AWS/ElastiCache"
      period              = 300
      statistic           = "Average"
      threshold           = 80
      dimensions          = { ReplicationGroupId = module.databases.redis_replication_group_id }
      severity            = "critical"
    }
  }

  anomaly_detection_alarms = {
    aurora-connections = {
      description                  = "Anomalous database connections"
      metric_name                  = "DatabaseConnections"
      namespace                    = "AWS/RDS"
      period                       = 300
      stat                         = "Average"
      evaluation_periods           = 3
      anomaly_standard_deviations  = 3
      dimensions                   = { DBClusterIdentifier = module.databases.aurora_cluster_id }
      severity                     = "warning"
    }
  }

  alarm_actions          = [module.messaging.sns_topic_arns["alerts"]]
  ok_actions             = [module.messaging.sns_topic_arns["alerts"]]
  critical_alarm_actions = [module.messaging.sns_topic_arns["alerts"]]

  enable_amp             = true
  amp_log_retention_days = 90

  enable_amg                   = true
  amg_authentication_providers = ["AWS_SSO"]
  alert_sns_topic_arn          = module.messaging.sns_topic_arns["alerts"]

  enable_xray         = true
  xray_reservoir_size = 10
  xray_fixed_rate     = 0.01

  log_insights_queries = {
    error-analysis = {
      log_groups = ["/aws/${var.project_name}/${var.environment}/application"]
      query      = <<-EOF
        fields @timestamp, @message
        | filter @message like /(?i)error|exception|fail/
        | sort @timestamp desc
        | limit 100
      EOF
    }
    slow-requests = {
      log_groups = ["/aws/${var.project_name}/${var.environment}/application"]
      query      = <<-EOF
        fields @timestamp, @message
        | filter duration > 1000
        | sort duration desc
        | limit 100
      EOF
    }
  }

  alert_email_addresses = var.alert_email_addresses

  tags = local.common_tags
}

################################################################################
# Edge CloudFront Module
################################################################################

module "edge_cloudfront" {
  source = "../../modules/edge_cloudfront"

  providers = {
    aws = aws.us_east_1
  }

  project_name = var.project_name
  environment  = var.environment

  domain_names        = var.cloudfront_domain_names
  acm_certificate_arn = var.acm_certificate_arn
  route53_zone_id     = var.route53_zone_id

  s3_bucket_regional_domain_name = module.storage.public_assets_bucket_regional_domain_name
  alb_dns_name                   = null
  cloudfront_secret_header       = random_password.cloudfront_secret.result

  price_class          = "PriceClass_All"
  enable_origin_shield = true
  origin_shield_region = "us-east-1"

  waf_web_acl_arn      = module.security_baseline.waf_cloudfront_acl_arn
  cors_allowed_origins = var.cors_allowed_origins

  geo_restriction_type      = var.geo_restriction_type
  geo_restriction_locations = var.geo_restriction_locations

  log_bucket_domain_name = module.storage.logs_bucket_domain_name

  tags = local.common_tags
}

resource "random_password" "cloudfront_secret" {
  length  = 32
  special = false
}

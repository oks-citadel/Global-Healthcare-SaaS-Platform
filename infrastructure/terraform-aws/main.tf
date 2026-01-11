# ============================================
# The Unified Health Platform - AWS Main Configuration
# ============================================
# AZURE MIGRATION COMPLETE - AWS ONLY
# All Azure resources have been translated to AWS equivalents
# ============================================

locals {
  common_tags = {
    Project     = "The Unified Health"
    Environment = var.environment
    ManagedBy   = "terraform"
    Owner       = "citadel-cloud-management"
  }

  # Region configurations
  regions = {
    americas = {
      enabled        = var.deploy_americas
      aws_region     = "us-east-1"
      vpc_cidr       = "10.10.0.0/16"
      azs            = ["us-east-1a", "us-east-1b", "us-east-1c"]
      compliance     = ["HIPAA", "SOC2", "ISO27001"]
    }
    europe = {
      enabled        = var.deploy_europe
      aws_region     = "eu-west-1"
      vpc_cidr       = "10.20.0.0/16"
      azs            = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]
      compliance     = ["GDPR", "ISO27001", "SOC2"]
    }
    africa = {
      enabled        = var.deploy_africa
      aws_region     = "af-south-1"
      vpc_cidr       = "10.30.0.0/16"
      azs            = ["af-south-1a", "af-south-1b", "af-south-1c"]
      compliance     = ["POPIA", "ISO27001", "SOC2"]
    }
  }
}

# ============================================
# Data Sources
# ============================================

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# ============================================
# Global ECR (Container Registry)
# ============================================

module "ecr" {
  source = "./modules/ecr"

  project_name = var.project_name
  environment  = var.environment

  repository_names = [
    # Core API
    "api",
    "api-gateway",
    # Frontend Apps
    "web-app",
    "admin-portal",
    "provider-portal",
    "mobile",
    "kiosk",
    # Healthcare Services
    "auth-service",
    "notification-service",
    "telehealth-service",
    "mental-health-service",
    "chronic-care-service",
    "pharmacy-service",
    "laboratory-service",
    "imaging-service",
    "clinical-trials-service",
    "interoperability-service",
    "price-transparency-service",
    "population-health-service",
    "home-health-service",
    "denial-management-service",
    "vendor-risk-service"
  ]

  replication_regions = compact([
    var.deploy_europe ? "eu-west-1" : "",
    var.deploy_africa ? "af-south-1" : ""
  ])

  tags = local.common_tags
}

# ============================================
# Americas Region
# ============================================

module "vpc_americas" {
  source = "./modules/vpc"
  count  = var.deploy_americas ? 1 : 0

  providers = {
    aws = aws.americas
  }

  project_name    = var.project_name
  environment     = var.environment
  region_name     = "americas"
  aws_region      = "us-east-1"
  vpc_cidr        = local.regions.americas.vpc_cidr
  availability_zones = local.regions.americas.azs

  public_subnet_cidrs      = ["10.10.1.0/24", "10.10.2.0/24", "10.10.3.0/24"]
  private_subnet_cidrs     = ["10.10.11.0/24", "10.10.12.0/24", "10.10.13.0/24"]
  database_subnet_cidrs    = ["10.10.21.0/24", "10.10.22.0/24", "10.10.23.0/24"]
  elasticache_subnet_cidrs = ["10.10.31.0/24", "10.10.32.0/24", "10.10.33.0/24"]

  enable_nat_gateway   = true
  enable_flow_logs     = true
  enable_vpc_endpoints = true

  tags = merge(local.common_tags, {
    Region     = "Americas"
    Compliance = join("-", local.regions.americas.compliance)
  })
}

# ECS Fargate Cluster - Americas (replaces EKS)
module "ecs_americas" {
  source = "./modules/ecs-cluster"
  count  = var.deploy_americas ? 1 : 0

  providers = {
    aws = aws.americas
  }

  project     = var.project_name
  environment = var.environment
  aws_region  = "us-east-1"

  vpc_id                 = module.vpc_americas[0].vpc_id
  alb_security_group_ids = [module.alb_americas[0].alb_security_group_id]

  enable_container_insights = var.ecs_enable_container_insights
  enable_service_discovery  = true
  log_retention_days        = 30

  fargate_weight      = 20
  fargate_spot_weight = 80

  tags = merge(local.common_tags, {
    Region = "Americas"
  })
}

# ALB for Americas region
module "alb_americas" {
  source = "./modules/alb"
  count  = var.deploy_americas ? 1 : 0

  providers = {
    aws = aws.americas
  }

  project_name = var.project_name
  environment  = var.environment
  region_name  = "americas"

  vpc_id     = module.vpc_americas[0].vpc_id
  subnet_ids = module.vpc_americas[0].public_subnet_ids

  certificate_arn    = var.acm_certificate_arn_americas
  access_logs_bucket = var.alb_access_logs_bucket
  enable_access_logs = var.enable_alb_access_logs

  tags = merge(local.common_tags, {
    Region = "Americas"
  })
}

module "rds_americas" {
  source = "./modules/rds"
  count  = var.deploy_americas ? 1 : 0

  providers = {
    aws = aws.americas
  }

  project_name = var.project_name
  environment  = var.environment
  region_name  = "americas"

  vpc_id                    = module.vpc_americas[0].vpc_id
  db_subnet_group_name      = module.vpc_americas[0].db_subnet_group_name
  allowed_security_group_id = module.ecs_americas[0].ecs_tasks_security_group_id

  engine_version        = var.rds_engine_version
  instance_class        = var.rds_instance_class
  backup_retention_days = var.rds_backup_retention_days
  deletion_protection   = var.environment == "prod"

  tags = merge(local.common_tags, {
    Region = "Americas"
  })
}

module "elasticache_americas" {
  source = "./modules/elasticache"
  count  = var.deploy_americas ? 1 : 0

  providers = {
    aws = aws.americas
  }

  project_name = var.project_name
  environment  = var.environment
  region_name  = "americas"

  vpc_id                    = module.vpc_americas[0].vpc_id
  subnet_ids                = module.vpc_americas[0].elasticache_subnet_ids
  allowed_security_group_id = module.ecs_americas[0].ecs_tasks_security_group_id

  node_type          = var.elasticache_node_type
  num_cache_clusters = var.elasticache_num_cache_clusters

  tags = merge(local.common_tags, {
    Region = "Americas"
  })
}

# ============================================
# Europe Region
# ============================================

module "vpc_europe" {
  source = "./modules/vpc"
  count  = var.deploy_europe ? 1 : 0

  providers = {
    aws = aws.europe
  }

  project_name    = var.project_name
  environment     = var.environment
  region_name     = "europe"
  aws_region      = "eu-west-1"
  vpc_cidr        = local.regions.europe.vpc_cidr
  availability_zones = local.regions.europe.azs

  public_subnet_cidrs      = ["10.20.1.0/24", "10.20.2.0/24", "10.20.3.0/24"]
  private_subnet_cidrs     = ["10.20.11.0/24", "10.20.12.0/24", "10.20.13.0/24"]
  database_subnet_cidrs    = ["10.20.21.0/24", "10.20.22.0/24", "10.20.23.0/24"]
  elasticache_subnet_cidrs = ["10.20.31.0/24", "10.20.32.0/24", "10.20.33.0/24"]

  enable_nat_gateway   = true
  enable_flow_logs     = true
  enable_vpc_endpoints = true

  tags = merge(local.common_tags, {
    Region     = "Europe"
    Compliance = join("-", local.regions.europe.compliance)
  })
}

# ECS Fargate Cluster - Europe (replaces EKS)
module "ecs_europe" {
  source = "./modules/ecs-cluster"
  count  = var.deploy_europe ? 1 : 0

  providers = {
    aws = aws.europe
  }

  project     = var.project_name
  environment = var.environment
  aws_region  = "eu-west-1"

  vpc_id                 = module.vpc_europe[0].vpc_id
  alb_security_group_ids = [module.alb_europe[0].alb_security_group_id]

  enable_container_insights = var.ecs_enable_container_insights
  enable_service_discovery  = true
  log_retention_days        = 30

  fargate_weight      = 20
  fargate_spot_weight = 80

  tags = merge(local.common_tags, {
    Region = "Europe"
  })
}

# ALB for Europe region
module "alb_europe" {
  source = "./modules/alb"
  count  = var.deploy_europe ? 1 : 0

  providers = {
    aws = aws.europe
  }

  project_name = var.project_name
  environment  = var.environment
  region_name  = "europe"

  vpc_id     = module.vpc_europe[0].vpc_id
  subnet_ids = module.vpc_europe[0].public_subnet_ids

  certificate_arn    = var.acm_certificate_arn_europe
  access_logs_bucket = var.alb_access_logs_bucket
  enable_access_logs = var.enable_alb_access_logs

  tags = merge(local.common_tags, {
    Region = "Europe"
  })
}

module "rds_europe" {
  source = "./modules/rds"
  count  = var.deploy_europe ? 1 : 0

  providers = {
    aws = aws.europe
  }

  project_name = var.project_name
  environment  = var.environment
  region_name  = "europe"

  vpc_id                    = module.vpc_europe[0].vpc_id
  db_subnet_group_name      = module.vpc_europe[0].db_subnet_group_name
  allowed_security_group_id = module.ecs_europe[0].ecs_tasks_security_group_id

  engine_version        = var.rds_engine_version
  instance_class        = var.rds_instance_class
  backup_retention_days = var.rds_backup_retention_days
  deletion_protection   = var.environment == "prod"

  tags = merge(local.common_tags, {
    Region = "Europe"
  })
}

module "elasticache_europe" {
  source = "./modules/elasticache"
  count  = var.deploy_europe ? 1 : 0

  providers = {
    aws = aws.europe
  }

  project_name = var.project_name
  environment  = var.environment
  region_name  = "europe"

  vpc_id                    = module.vpc_europe[0].vpc_id
  subnet_ids                = module.vpc_europe[0].elasticache_subnet_ids
  allowed_security_group_id = module.ecs_europe[0].ecs_tasks_security_group_id

  node_type          = var.elasticache_node_type
  num_cache_clusters = var.elasticache_num_cache_clusters

  tags = merge(local.common_tags, {
    Region = "Europe"
  })
}

# ============================================
# Africa Region
# ============================================

module "vpc_africa" {
  source = "./modules/vpc"
  count  = var.deploy_africa ? 1 : 0

  providers = {
    aws = aws.africa
  }

  project_name    = var.project_name
  environment     = var.environment
  region_name     = "africa"
  aws_region      = "af-south-1"
  vpc_cidr        = local.regions.africa.vpc_cidr
  availability_zones = local.regions.africa.azs

  public_subnet_cidrs      = ["10.30.1.0/24", "10.30.2.0/24", "10.30.3.0/24"]
  private_subnet_cidrs     = ["10.30.11.0/24", "10.30.12.0/24", "10.30.13.0/24"]
  database_subnet_cidrs    = ["10.30.21.0/24", "10.30.22.0/24", "10.30.23.0/24"]
  elasticache_subnet_cidrs = ["10.30.31.0/24", "10.30.32.0/24", "10.30.33.0/24"]

  enable_nat_gateway   = true
  enable_flow_logs     = true
  enable_vpc_endpoints = true

  tags = merge(local.common_tags, {
    Region     = "Africa"
    Compliance = join("-", local.regions.africa.compliance)
  })
}

# ECS Fargate Cluster - Africa (replaces EKS)
module "ecs_africa" {
  source = "./modules/ecs-cluster"
  count  = var.deploy_africa ? 1 : 0

  providers = {
    aws = aws.africa
  }

  project     = var.project_name
  environment = var.environment
  aws_region  = "af-south-1"

  vpc_id                 = module.vpc_africa[0].vpc_id
  alb_security_group_ids = [module.alb_africa[0].alb_security_group_id]

  enable_container_insights = var.ecs_enable_container_insights
  enable_service_discovery  = true
  log_retention_days        = 30

  fargate_weight      = 20
  fargate_spot_weight = 80

  tags = merge(local.common_tags, {
    Region = "Africa"
  })
}

# ALB for Africa region
module "alb_africa" {
  source = "./modules/alb"
  count  = var.deploy_africa ? 1 : 0

  providers = {
    aws = aws.africa
  }

  project_name = var.project_name
  environment  = var.environment
  region_name  = "africa"

  vpc_id     = module.vpc_africa[0].vpc_id
  subnet_ids = module.vpc_africa[0].public_subnet_ids

  certificate_arn    = var.acm_certificate_arn_africa
  access_logs_bucket = var.alb_access_logs_bucket
  enable_access_logs = var.enable_alb_access_logs

  tags = merge(local.common_tags, {
    Region = "Africa"
  })
}

module "rds_africa" {
  source = "./modules/rds"
  count  = var.deploy_africa ? 1 : 0

  providers = {
    aws = aws.africa
  }

  project_name = var.project_name
  environment  = var.environment
  region_name  = "africa"

  vpc_id                    = module.vpc_africa[0].vpc_id
  db_subnet_group_name      = module.vpc_africa[0].db_subnet_group_name
  allowed_security_group_id = module.ecs_africa[0].ecs_tasks_security_group_id

  engine_version        = var.rds_engine_version
  instance_class        = var.rds_instance_class
  backup_retention_days = var.rds_backup_retention_days
  deletion_protection   = var.environment == "prod"

  tags = merge(local.common_tags, {
    Region = "Africa"
  })
}

module "elasticache_africa" {
  source = "./modules/elasticache"
  count  = var.deploy_africa ? 1 : 0

  providers = {
    aws = aws.africa
  }

  project_name = var.project_name
  environment  = var.environment
  region_name  = "africa"

  vpc_id                    = module.vpc_africa[0].vpc_id
  subnet_ids                = module.vpc_africa[0].elasticache_subnet_ids
  allowed_security_group_id = module.ecs_africa[0].ecs_tasks_security_group_id

  node_type          = var.elasticache_node_type
  num_cache_clusters = var.elasticache_num_cache_clusters

  tags = merge(local.common_tags, {
    Region = "Africa"
  })
}

# ============================================
# Route53 DNS (theunifiedhealth.com)
# ============================================

module "route53" {
  source = "./modules/route53"
  count  = var.enable_route53 ? 1 : 0

  project_name = var.project_name
  environment  = var.environment
  domain_name  = var.domain_name

  # DNS Records - Points to ALB (ECS Fargate)
  records = [
    {
      name            = ""
      type            = "A"
      ttl             = 300
      values          = []
      alias_target    = var.deploy_americas && length(module.alb_americas) > 0 ? {
        dns_name               = module.alb_americas[0].alb_dns_name
        zone_id                = module.alb_americas[0].alb_zone_id
        evaluate_target_health = true
      } : null
      weight          = null
      set_identifier  = null
      geolocation     = null
      latency_region  = null
      health_check_name     = null
      failover_enabled      = false
      failover_type         = null
    },
    {
      name            = "www"
      type            = "CNAME"
      ttl             = 300
      values          = [var.domain_name]
      alias_target    = null
      weight          = null
      set_identifier  = null
      geolocation     = null
      latency_region  = null
      health_check_name     = null
      failover_enabled      = false
      failover_type         = null
    },
    {
      name            = "api"
      type            = "CNAME"
      ttl             = 300
      values          = ["api.${var.domain_name}"]
      alias_target    = null
      weight          = null
      set_identifier  = null
      geolocation     = null
      latency_region  = null
      health_check_name     = null
      failover_enabled      = false
      failover_type         = null
    }
  ]

  health_check_configs = {}
  enable_caa_records     = true
  caa_email              = "security@${var.domain_name}"
  enable_query_logging   = true
  query_log_retention_days = 90
  kms_key_arn            = null
  enable_dnssec          = false
  dnssec_kms_key_arn     = null

  tags = local.common_tags
}

# ============================================
# CodePipeline CI/CD
# ============================================

module "codepipeline" {
  source = "./modules/codepipeline"
  count  = var.enable_codepipeline && var.github_connection_arn != "" ? 1 : 0

  project_name = var.project_name
  environment  = var.environment

  aws_account_id = data.aws_caller_identity.current.account_id
  aws_region     = var.aws_region

  github_connection_arn = var.github_connection_arn
  github_repository     = var.github_repository
  github_branch         = var.github_branch

  # ECS Fargate cluster (replaces EKS)
  ecs_cluster_name = var.deploy_americas ? module.ecs_americas[0].cluster_name : ""

  tags = local.common_tags
}

# ============================================
# AWS SES (Email Delivery - Replaces SendGrid)
# ============================================

module "ses" {
  source = "./modules/ses"
  count  = var.enable_ses ? 1 : 0

  project_name = var.project_name
  environment  = var.environment
  domain_name  = var.domain_name

  route53_zone_id       = var.enable_route53 ? module.route53[0].zone_id : null
  wait_for_verification = false

  enable_dmarc     = true
  dmarc_policy     = "quarantine"
  dmarc_rua_email  = "dmarc-reports@${var.domain_name}"
  dmarc_ruf_email  = "dmarc-forensic@${var.domain_name}"

  create_notification_topics = true
  enable_alarms              = true
  alarm_actions              = []

  allowed_from_addresses = [
    "*@${var.domain_name}",
    "noreply@${var.domain_name}",
    "support@${var.domain_name}",
    "billing@${var.domain_name}",
    "security@${var.domain_name}"
  ]

  tags = local.common_tags
}

# ============================================
# AWS SNS/SQS (Messaging - Replaces Twilio)
# ============================================

module "sns_sqs_americas" {
  source = "./modules/sns-sqs"
  count  = var.deploy_americas && var.enable_sns_sqs ? 1 : 0

  providers = {
    aws = aws.americas
  }

  project_name = var.project_name
  environment  = var.environment

  create_kms_key = true

  # SNS Topics for Healthcare Events
  topic_configs = {
    # User Notifications
    user-notifications = {
      display_name = "User Notifications"
      purpose      = "User-facing-notifications"
      fifo_topic   = false
    }

    # System Alerts
    system-alerts = {
      display_name    = "System Alerts"
      purpose         = "Infrastructure-and-application-alerts"
      fifo_topic      = false
      email_subscriptions = [var.alert_email]
    }

    # Appointment Events
    appointment-events = {
      display_name = "Appointment Events"
      purpose      = "Appointment-lifecycle-events"
      fifo_topic   = false
    }

    # Patient Events
    patient-events = {
      display_name = "Patient Events"
      purpose      = "Patient-registration-and-profile-updates"
      fifo_topic   = false
    }

    # Billing Events
    billing-events = {
      display_name = "Billing Events"
      purpose      = "Payment-and-subscription-events"
      fifo_topic   = false
    }

    # Clinical Events
    clinical-events = {
      display_name                = "Clinical Events"
      purpose                     = "HIPAA-sensitive-clinical-data"
      fifo_topic                  = true
      content_based_deduplication = true
    }

    # Telehealth Events
    telehealth-events = {
      display_name = "Telehealth Events"
      purpose      = "Video-session-events"
      fifo_topic   = false
    }
  }

  # SQS Queues for Processing
  queue_configs = {
    # Email Processing Queue
    email-processing = {
      purpose                    = "Email-sending-queue"
      visibility_timeout_seconds = 60
      message_retention_seconds  = 1209600
      enable_dlq                 = true
      max_receive_count          = 3
      subscribe_to_topics        = ["user-notifications", "billing-events"]
      enable_age_alarm           = true
      age_alarm_threshold        = 3600
    }

    # SMS Processing Queue
    sms-processing = {
      purpose                    = "SMS-push-notification-queue"
      visibility_timeout_seconds = 30
      message_retention_seconds  = 1209600
      enable_dlq                 = true
      max_receive_count          = 3
      subscribe_to_topics        = ["user-notifications", "appointment-events"]
      enable_age_alarm           = true
      age_alarm_threshold        = 1800
    }

    # Appointment Processing Queue
    appointment-processing = {
      purpose                    = "Appointment-scheduling-queue"
      visibility_timeout_seconds = 120
      message_retention_seconds  = 1209600
      enable_dlq                 = true
      max_receive_count          = 5
      subscribe_to_topics        = ["appointment-events"]
      enable_age_alarm           = true
      age_alarm_threshold        = 7200
    }

    # Billing Processing Queue
    billing-processing = {
      purpose                    = "Payment-and-invoice-processing"
      visibility_timeout_seconds = 300
      message_retention_seconds  = 1209600
      enable_dlq                 = true
      max_receive_count          = 5
      subscribe_to_topics        = ["billing-events"]
      enable_age_alarm           = true
      age_alarm_threshold        = 3600
    }

    # Clinical Events Queue (FIFO for ordering)
    clinical-processing = {
      purpose                     = "HIPAA-clinical-data-processing"
      fifo_queue                  = true
      content_based_deduplication = true
      visibility_timeout_seconds  = 300
      message_retention_seconds   = 1209600
      enable_dlq                  = true
      max_receive_count           = 3
      subscribe_to_topics         = ["clinical-events"]
      enable_age_alarm            = true
      age_alarm_threshold         = 1800
    }

    # Analytics Queue
    analytics-processing = {
      purpose                    = "Analytics-and-metrics-processing"
      visibility_timeout_seconds = 60
      message_retention_seconds  = 604800
      enable_dlq                 = true
      max_receive_count          = 3
      subscribe_to_topics        = ["patient-events", "appointment-events", "telehealth-events"]
    }

    # Webhook Processing Queue
    webhook-processing = {
      purpose                    = "External-webhook-ingestion"
      visibility_timeout_seconds = 120
      message_retention_seconds  = 1209600
      enable_dlq                 = true
      max_receive_count          = 5
      enable_age_alarm           = true
      age_alarm_threshold        = 3600
    }
  }

  enable_dlq_alarms   = true
  dlq_alarm_threshold = 1
  alarm_actions       = []

  tags = merge(local.common_tags, {
    Region = "Americas"
  })
}

# ============================================
# AWS Budgets (Cost Monitoring)
# ============================================

module "budgets" {
  source = "./modules/budgets"
  count  = var.enable_budgets ? 1 : 0

  project_name = var.project_name
  environment  = var.environment

  budget_amount    = var.budget_amount
  alert_thresholds = var.budget_alert_thresholds
  alert_emails     = length(var.budget_alert_emails) > 0 ? var.budget_alert_emails : [var.alert_email]

  # Cost filters for healthcare platform
  cost_filter_tag_key    = "Project"
  cost_filter_tag_values = [var.project_name]

  tags = local.common_tags
}

# ============================================
# AWS Backup - Americas Region
# ============================================

module "backup_americas" {
  source = "./modules/backup"
  count  = var.deploy_americas && var.enable_backup ? 1 : 0

  providers = {
    aws = aws.americas
  }

  project_name = var.project_name
  environment  = var.environment
  region_name  = "americas"

  # Backup schedule configuration
  daily_backup_retention_days  = var.backup_retention_days
  enable_weekly_backup         = var.backup_enable_weekly
  weekly_backup_retention_days = var.backup_weekly_retention_days
  enable_monthly_backup        = var.backup_enable_monthly
  monthly_backup_retention_days = var.backup_monthly_retention_days

  # Compliance configuration
  enable_vault_lock = var.backup_enable_vault_lock

  # Cross-region copy for disaster recovery
  enable_cross_region_copy   = var.backup_enable_cross_region_copy && var.deploy_europe
  copy_destination_vault_arn = var.backup_enable_cross_region_copy && var.deploy_europe ? module.backup_europe[0].vault_arn : ""

  # Notifications
  enable_notifications  = true
  notification_emails   = length(var.backup_notification_emails) > 0 ? var.backup_notification_emails : [var.alert_email]

  # Tag-based resource selection
  selection_tags = {
    Backup      = "true"
    Environment = var.environment
  }

  tags = merge(local.common_tags, {
    Region = "Americas"
  })
}

# ============================================
# AWS Backup - Europe Region
# ============================================

module "backup_europe" {
  source = "./modules/backup"
  count  = var.deploy_europe && var.enable_backup ? 1 : 0

  providers = {
    aws = aws.europe
  }

  project_name = var.project_name
  environment  = var.environment
  region_name  = "europe"

  # Backup schedule configuration
  daily_backup_retention_days  = var.backup_retention_days
  enable_weekly_backup         = var.backup_enable_weekly
  weekly_backup_retention_days = var.backup_weekly_retention_days
  enable_monthly_backup        = var.backup_enable_monthly
  monthly_backup_retention_days = var.backup_monthly_retention_days

  # Compliance configuration - GDPR requires stricter controls
  enable_vault_lock             = var.backup_enable_vault_lock
  vault_lock_min_retention_days = 30  # GDPR data retention

  # Cross-region copy for disaster recovery
  enable_cross_region_copy   = var.backup_enable_cross_region_copy && var.deploy_americas
  copy_destination_vault_arn = var.backup_enable_cross_region_copy && var.deploy_americas ? module.backup_americas[0].vault_arn : ""

  # Notifications
  enable_notifications  = true
  notification_emails   = length(var.backup_notification_emails) > 0 ? var.backup_notification_emails : [var.alert_email]

  # Tag-based resource selection
  selection_tags = {
    Backup      = "true"
    Environment = var.environment
  }

  tags = merge(local.common_tags, {
    Region     = "Europe"
    Compliance = "GDPR"
  })
}

# ============================================
# AWS Backup - Africa Region
# ============================================

module "backup_africa" {
  source = "./modules/backup"
  count  = var.deploy_africa && var.enable_backup ? 1 : 0

  providers = {
    aws = aws.africa
  }

  project_name = var.project_name
  environment  = var.environment
  region_name  = "africa"

  # Backup schedule configuration
  daily_backup_retention_days  = var.backup_retention_days
  enable_weekly_backup         = var.backup_enable_weekly
  weekly_backup_retention_days = var.backup_weekly_retention_days
  enable_monthly_backup        = var.backup_enable_monthly
  monthly_backup_retention_days = var.backup_monthly_retention_days

  # Compliance configuration - POPIA requirements
  enable_vault_lock             = var.backup_enable_vault_lock
  vault_lock_min_retention_days = 7

  # Cross-region copy for disaster recovery
  enable_cross_region_copy   = var.backup_enable_cross_region_copy && var.deploy_europe
  copy_destination_vault_arn = var.backup_enable_cross_region_copy && var.deploy_europe ? module.backup_europe[0].vault_arn : ""

  # Notifications
  enable_notifications  = true
  notification_emails   = length(var.backup_notification_emails) > 0 ? var.backup_notification_emails : [var.alert_email]

  # Tag-based resource selection
  selection_tags = {
    Backup      = "true"
    Environment = var.environment
  }

  tags = merge(local.common_tags, {
    Region     = "Africa"
    Compliance = "POPIA"
  })
}

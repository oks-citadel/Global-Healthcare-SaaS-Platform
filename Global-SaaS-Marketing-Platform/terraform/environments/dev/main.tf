################################################################################
# Development Environment - Main Configuration
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
    key            = "dev/terraform.tfstate"
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
  }
}

################################################################################
# Security Baseline Module
################################################################################

module "security_baseline" {
  source = "../../modules/security_baseline"

  project_name = var.project_name
  environment  = var.environment

  kms_deletion_window     = 7
  enable_multi_region_kms = false
  allowed_regions         = [var.aws_region]

  enable_cloudtrail               = true
  cloudtrail_retention_days       = 90
  cloudtrail_log_retention_days   = 30

  enable_config    = true
  enable_guardduty = true

  enable_waf            = true
  waf_rate_limit        = 5000
  waf_blocked_countries = []
  waf_log_retention_days = 14

  enable_shield_advanced = false

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
  az_count              = 2
  enable_nat_gateway    = true
  single_nat_gateway    = true  # Cost saving for dev
  enable_vpc_endpoints  = true
  enable_flow_logs      = true
  flow_logs_retention_days = 14

  kms_key_arn = module.security_baseline.main_kms_key_arn

  vpc_endpoint_services = [
    "ecr.api",
    "ecr.dkr",
    "logs",
    "monitoring",
    "ssm",
    "ssmmessages",
    "ec2messages",
    "kms",
    "secretsmanager",
    "sts"
  ]

  enable_bastion        = true
  bastion_allowed_cidrs = var.bastion_allowed_cidrs

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
  cluster_endpoint_public_access       = true
  cluster_endpoint_public_access_cidrs = var.eks_public_access_cidrs

  cluster_log_retention_days = 14

  node_groups = {
    general = {
      instance_types             = ["t3.medium", "t3a.medium"]
      capacity_type              = "SPOT"
      disk_size                  = 50
      ami_type                   = "AL2_x86_64"
      desired_size               = 2
      max_size                   = 4
      min_size                   = 1
      max_unavailable_percentage = 50
      labels                     = { workload = "general" }
      taints                     = []
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
  cors_allowed_origins = ["*"]
  log_retention_days   = 90

  enable_efs            = true
  efs_subnet_ids        = module.networking.private_subnet_ids
  efs_security_group_id = module.networking.efs_security_group_id
  efs_performance_mode  = "generalPurpose"
  efs_throughput_mode   = "bursting"

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
  log_retention_days = 14

  # Aurora PostgreSQL
  aurora_postgresql_version    = "15.4"
  aurora_database_name         = "marketing"
  aurora_master_username       = "admin"
  db_subnet_group_name         = module.networking.db_subnet_group_name
  rds_security_group_id        = module.networking.rds_security_group_id
  aurora_instance_count        = 1
  aurora_min_capacity          = 0.5
  aurora_max_capacity          = 4
  aurora_backup_retention_days = 7

  # DynamoDB
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
      billing_mode = "PAY_PER_REQUEST"
      hash_key     = "cache_key"
      attributes = [
        { name = "cache_key", type = "S" }
      ]
      ttl_attribute                = "ttl"
      enable_point_in_time_recovery = false
    }
  }

  # ElastiCache Redis
  elasticache_subnet_group_name = module.networking.elasticache_subnet_group_name
  elasticache_security_group_id = module.networking.elasticache_security_group_id
  redis_version                 = "7.0"
  redis_node_type               = "cache.t4g.micro"
  redis_num_cache_clusters      = 1
  redis_auth_token              = random_password.redis_auth_token.result
  redis_snapshot_retention_limit = 3

  # OpenSearch
  enable_opensearch             = false  # Disabled for dev to save costs
  create_opensearch_service_linked_role = false

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
  log_retention_days = 14

  sqs_queues = {
    events = {
      fifo                       = false
      visibility_timeout_seconds = 30
      message_retention_seconds  = 345600
      max_receive_count          = 3
      kms_key_id                 = module.security_baseline.main_kms_key_arn
    }
    notifications = {
      fifo                       = false
      visibility_timeout_seconds = 60
      message_retention_seconds  = 345600
      max_receive_count          = 3
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
  log_retention_days = 14

  kinesis_streams = {
    events = {
      retention_period = 24
      stream_mode      = "ON_DEMAND"
    }
  }

  firehose_streams = {
    events = {
      source_stream      = "events"
      s3_prefix          = "raw/events/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/"
      error_prefix       = "errors/events/!{firehose:error-output-type}/year=!{timestamp:yyyy}/month=!{timestamp:MM}/day=!{timestamp:dd}/"
      buffer_size        = 64
      buffer_interval    = 300
      compression_format = "GZIP"
    }
  }

  athena_bytes_scanned_cutoff = 1073741824  # 1 GB for dev

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
  log_retention_days = 14

  domain_name       = var.ses_domain_name
  route53_zone_id   = var.route53_zone_id
  enable_dmarc      = true
  dmarc_policy      = "none"
  dmarc_rua_email   = var.dmarc_email
  dmarc_ruf_email   = var.dmarc_email

  enable_firehose_destination = true
  data_lake_bucket_arn        = module.data_lake.data_lake_bucket_arn

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
  alb_arn_suffix             = ""  # Will be populated after ALB is created

  log_groups = {
    application = { retention_days = 14, log_type = "application" }
    audit       = { retention_days = 30, log_type = "audit" }
  }

  enable_amp             = true
  amp_log_retention_days = 14

  enable_amg = false  # Disabled for dev

  enable_xray         = true
  xray_reservoir_size = 1
  xray_fixed_rate     = 0.1

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
  alb_dns_name                   = null  # Will be populated after ALB
  cloudfront_secret_header       = random_password.cloudfront_secret.result

  price_class          = "PriceClass_100"
  enable_origin_shield = false  # Disabled for dev

  waf_web_acl_arn      = module.security_baseline.waf_cloudfront_acl_arn
  cors_allowed_origins = ["*"]

  log_bucket_domain_name = module.storage.logs_bucket_domain_name

  tags = local.common_tags
}

resource "random_password" "cloudfront_secret" {
  length  = 32
  special = false
}

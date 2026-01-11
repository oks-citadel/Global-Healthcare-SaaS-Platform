# ============================================
# Production Cost Optimization Configuration
# Comprehensive cost-saving measures for healthcare platform
# ============================================

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

locals {
  project_name = "unified-health"
  environment  = "production"
  cost_center  = "healthcare-platform"

  common_tags = {
    Project     = local.project_name
    Environment = local.environment
    CostCenter  = local.cost_center
    ManagedBy   = "terraform"
    Compliance  = "HIPAA"
  }
}

# ============================================
# Cost Optimization Module
# ============================================

module "cost_optimization" {
  source = "../../modules/cost-optimization"

  project_name = local.project_name
  environment  = local.environment
  cost_center  = local.cost_center

  # Budget Configuration
  monthly_budget_limit  = "15000"
  compute_budget_limit  = "7000"
  database_budget_limit = "3000"
  budget_alert_emails   = var.budget_alert_emails

  # Spot Instance Configuration
  enable_spot_instances = true
  spot_max_price        = "0.10"
  spot_target_capacity  = 3
  spot_instance_types   = ["t3.medium", "t3a.medium", "t3.large", "t3a.large", "m5.large"]
  spot_ami_id           = data.aws_ami.ecs_optimized.id

  # Auto Scaling Configuration
  autoscaling_group_name    = module.ecs.autoscaling_group_name
  enable_predictive_scaling = true
  enable_scheduled_scaling  = true
  target_cpu_utilization    = 70

  # Night scaling (reduce costs during off-hours)
  night_min_capacity     = 2
  night_max_capacity     = 5
  night_desired_capacity = 2

  # Day scaling (handle peak traffic)
  day_min_capacity     = 3
  day_max_capacity     = 15
  day_desired_capacity = 5

  # Network Configuration
  private_subnet_ids = module.vpc.private_subnet_ids
  security_group_ids = [module.security.api_security_group_id]

  # RDS Configuration
  enable_rds_proxy  = true
  rds_engine_family = "POSTGRESQL"
  rds_secret_arn    = module.rds.secret_arn

  # ElastiCache Configuration
  enable_elasticache = true
  cache_node_type    = "cache.t3.small"
  cache_num_nodes    = 2
  cache_subnet_group = module.vpc.elasticache_subnet_group

  # CloudWatch Logs Configuration
  log_groups = {
    api = {
      name           = "/aws/ecs/${local.project_name}-api"
      retention_days = 30
    }
    lambda = {
      name           = "/aws/lambda/${local.project_name}"
      retention_days = 14
    }
    audit = {
      name           = "/aws/${local.project_name}/audit"
      retention_days = 365 # HIPAA compliance
    }
  }

  # Lambda Cost Optimizer
  enable_cost_optimizer_lambda = true
  sns_topic_arn                = module.notifications.cost_alerts_topic_arn

  tags = local.common_tags
}

# ============================================
# CDN Module for Static Asset Optimization
# ============================================

module "cdn" {
  source = "../../modules/cdn"

  project_name = local.project_name
  environment  = local.environment
  cost_center  = local.cost_center

  # S3 Origin
  s3_bucket_regional_domain_name = module.storage.main_bucket_regional_domain_name

  # API Origin
  api_domain_name = module.alb.dns_name

  # Cache Configuration (aggressive caching for cost savings)
  default_ttl = 86400    # 1 day
  max_ttl     = 31536000 # 1 year
  min_ttl     = 3600     # 1 hour

  # Use cheapest price class (US, Canada, Europe)
  price_class = "PriceClass_100"

  # Enable Origin Shield for additional caching layer
  enable_origin_shield = true
  origin_shield_region = "us-east-1"

  # Domain Configuration
  domain_aliases      = var.cdn_domain_aliases
  acm_certificate_arn = module.certificates.cloudfront_certificate_arn

  # Security
  web_acl_id           = module.waf.cloudfront_web_acl_id
  cors_allowed_origins = var.cors_allowed_origins

  # Logging (minimal for cost)
  log_bucket                 = "${module.storage.logs_bucket_id}.s3.amazonaws.com"
  enable_realtime_logs       = false
  realtime_log_sampling_rate = 1

  tags = local.common_tags
}

# ============================================
# Storage Module with Lifecycle Policies
# ============================================

module "storage" {
  source = "../../modules/storage"

  project_name = local.project_name
  environment  = local.environment
  cost_center  = local.cost_center

  enable_versioning           = true
  cloudfront_distribution_arn = module.cdn.distribution_arn
  kms_key_arn                 = module.kms.main_key_arn

  tags = local.common_tags
}

# ============================================
# Compute Savings Plans (if not using Spot)
# ============================================

resource "aws_savingsplans_plan" "compute" {
  count = var.enable_savings_plan ? 1 : 0

  savings_plan_type = "Compute"
  payment_option    = "No Upfront"
  term_in_years     = 1
  commitment        = var.savings_plan_commitment

  tags = local.common_tags
}

# ============================================
# RDS Reserved Instance (for production stability)
# ============================================

# Note: Reserved instances should be purchased via console
# or with careful consideration. This is a placeholder.
# resource "aws_rds_reserved_instance" "main" {
#   offering_id    = data.aws_rds_reserved_instance_offering.postgresql.id
#   instance_count = 1
# }

# ============================================
# Cost Allocation Tags
# ============================================

resource "aws_ce_cost_allocation_tag" "tags" {
  for_each = toset([
    "Project",
    "Environment",
    "CostCenter",
    "Service",
    "Team"
  ])

  tag_key = each.value
  status  = "Active"
}

# ============================================
# Data Sources
# ============================================

data "aws_ami" "ecs_optimized" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-ecs-hvm-*-x86_64-ebs"]
  }
}

# ============================================
# Variables
# ============================================

variable "budget_alert_emails" {
  description = "Email addresses for budget alerts"
  type        = list(string)
}

variable "cdn_domain_aliases" {
  description = "Domain aliases for CloudFront"
  type        = list(string)
  default     = []
}

variable "cors_allowed_origins" {
  description = "Allowed origins for CORS"
  type        = list(string)
  default     = ["*"]
}

variable "enable_savings_plan" {
  description = "Enable Compute Savings Plan"
  type        = bool
  default     = false
}

variable "savings_plan_commitment" {
  description = "Hourly commitment for Savings Plan (USD)"
  type        = string
  default     = "10.00"
}

# ============================================
# Outputs
# ============================================

output "cost_optimization_summary" {
  description = "Cost optimization configuration summary"
  value = {
    cdn_price_class         = "PriceClass_100 (US/Canada/Europe)"
    origin_shield_enabled   = true
    spot_instances          = true
    predictive_scaling      = true
    scheduled_scaling       = true
    rds_proxy_enabled       = true
    s3_intelligent_tiering  = true
    log_retention_optimized = true
    budget_monitoring       = true
  }
}

output "estimated_monthly_savings" {
  description = "Estimated monthly savings from optimizations"
  value = {
    spot_instances    = "30-70% on EC2"
    cdn_price_class   = "~30% vs PriceClass_All"
    origin_shield     = "Reduced origin requests"
    scheduled_scaling = "~40% during off-hours"
    s3_lifecycle      = "Up to 80% on archived data"
    rds_proxy         = "Better connection efficiency"
    compression       = "40-60% bandwidth reduction"
  }
}

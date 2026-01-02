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
    "api-gateway",
    "telehealth-service",
    "mental-health-service",
    "chronic-care-service",
    "pharmacy-service",
    "laboratory-service",
    "auth-service",
    "web-app",
    "provider-portal",
    "admin-portal"
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
    Compliance = join(",", local.regions.americas.compliance)
  })
}

module "eks_americas" {
  source = "./modules/eks"
  count  = var.deploy_americas ? 1 : 0

  providers = {
    aws = aws.americas
  }

  project_name = var.project_name
  environment  = var.environment
  region_name  = "americas"

  vpc_id     = module.vpc_americas[0].vpc_id
  subnet_ids = module.vpc_americas[0].private_subnet_ids

  cluster_version = var.eks_cluster_version

  system_node_instance_types = ["m6i.large"]
  system_node_min_size       = 2
  system_node_max_size       = 4
  system_node_desired_size   = 2

  app_node_instance_types = var.eks_node_instance_types
  app_node_min_size       = var.eks_node_min_size
  app_node_max_size       = var.eks_node_max_size
  app_node_desired_size   = var.eks_node_desired_size

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
  allowed_security_group_id = module.eks_americas[0].node_security_group_id

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
  allowed_security_group_id = module.eks_americas[0].node_security_group_id

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
    Compliance = join(",", local.regions.europe.compliance)
  })
}

module "eks_europe" {
  source = "./modules/eks"
  count  = var.deploy_europe ? 1 : 0

  providers = {
    aws = aws.europe
  }

  project_name = var.project_name
  environment  = var.environment
  region_name  = "europe"

  vpc_id     = module.vpc_europe[0].vpc_id
  subnet_ids = module.vpc_europe[0].private_subnet_ids

  cluster_version = var.eks_cluster_version

  system_node_instance_types = ["m6i.large"]
  system_node_min_size       = 2
  system_node_max_size       = 4
  system_node_desired_size   = 2

  app_node_instance_types = var.eks_node_instance_types
  app_node_min_size       = var.eks_node_min_size
  app_node_max_size       = var.eks_node_max_size
  app_node_desired_size   = var.eks_node_desired_size

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
  allowed_security_group_id = module.eks_europe[0].node_security_group_id

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
  allowed_security_group_id = module.eks_europe[0].node_security_group_id

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
    Compliance = join(",", local.regions.africa.compliance)
  })
}

module "eks_africa" {
  source = "./modules/eks"
  count  = var.deploy_africa ? 1 : 0

  providers = {
    aws = aws.africa
  }

  project_name = var.project_name
  environment  = var.environment
  region_name  = "africa"

  vpc_id     = module.vpc_africa[0].vpc_id
  subnet_ids = module.vpc_africa[0].private_subnet_ids

  cluster_version = var.eks_cluster_version

  system_node_instance_types = ["m6i.large"]
  system_node_min_size       = 2
  system_node_max_size       = 4
  system_node_desired_size   = 2

  app_node_instance_types = var.eks_node_instance_types
  app_node_min_size       = var.eks_node_min_size
  app_node_max_size       = var.eks_node_max_size
  app_node_desired_size   = var.eks_node_desired_size

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
  allowed_security_group_id = module.eks_africa[0].node_security_group_id

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
  allowed_security_group_id = module.eks_africa[0].node_security_group_id

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

  # DNS Records
  records = [
    {
      name            = ""
      type            = "A"
      ttl             = 300
      values          = []
      alias_target    = var.deploy_americas && length(module.eks_americas) > 0 ? {
        dns_name               = module.eks_americas[0].cluster_endpoint
        zone_id                = "Z35SXDOTRQ7X7K"  # us-east-1 ALB zone
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

  eks_cluster_name = var.deploy_americas ? module.eks_americas[0].cluster_name : ""

  tags = local.common_tags
}

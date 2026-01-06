# ============================================
# The Unified Health - Production Configuration
# ============================================
# Domain: theunifiedhealth.com
# AWS Account: 992382449461
# ============================================

project_name = "unified-health"
environment  = "prod"

# Domain Configuration
domain_name    = "theunifiedhealth.com"
enable_route53 = true

# Region Deployment - All regions enabled to preserve existing infrastructure
deploy_americas = true
deploy_europe   = true
deploy_africa   = false

# EKS Configuration
eks_cluster_version     = "1.29"
eks_node_instance_types = ["m6i.large"]
eks_node_min_size       = 2
eks_node_max_size       = 10
eks_node_desired_size   = 3

# RDS Configuration
rds_engine_version        = "15.4"
rds_instance_class        = "db.r6g.large"
rds_backup_retention_days = 30

# ElastiCache Configuration
elasticache_node_type          = "cache.r6g.large"
elasticache_num_cache_clusters = 2

# CI/CD Configuration
enable_codepipeline   = true
github_connection_arn = "arn:aws:codestar-connections:us-east-1:992382449461:connection/0cc565b7-bc2a-4e6b-b40f-c47ccc053e45"
github_repository     = "oks-citadel/Global-Healthcare-SaaS-Platform"
github_branch         = "main"

# Monitoring
cloudwatch_retention_days = 90
enable_enhanced_monitoring = true
alert_email = "ops@theunifiedhealth.com"

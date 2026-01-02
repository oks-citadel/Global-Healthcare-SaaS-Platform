# ============================================
# The Unified Health Platform - Staging Environment
# ============================================
# AWS-ONLY Configuration (Azure Removed)
# ============================================

environment  = "staging"
project_name = "unified-health"
aws_region   = "us-east-1"

# Americas only for staging
deploy_americas = true
deploy_europe   = false
deploy_africa   = false

# Compliance
compliance_standards = ["HIPAA", "SOC2", "ISO27001"]

# EKS Configuration
eks_cluster_version     = "1.29"
eks_node_instance_types = ["m6i.xlarge"]
eks_node_min_size       = 2
eks_node_max_size       = 5
eks_node_desired_size   = 3

# RDS Configuration
rds_engine_version        = "15.4"
rds_instance_class        = "db.serverless"
rds_backup_retention_days = 14

# ElastiCache Configuration
elasticache_node_type          = "cache.r6g.large"
elasticache_num_cache_clusters = 2

# Monitoring
cloudwatch_retention_days  = 60
enable_enhanced_monitoring = true

# Cost management
monthly_budget_usd = 15000

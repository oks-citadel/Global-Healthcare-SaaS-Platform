# ============================================
# UnifiedHealth Platform - Dev Environment
# ============================================
# AWS-ONLY Configuration (Azure Removed)
# ============================================

environment  = "dev"
project_name = "unified-health"
aws_region   = "us-east-1"

# Single region for dev
deploy_americas = true
deploy_europe   = false
deploy_africa   = false

# Compliance (dev uses same standards but relaxed enforcement)
compliance_standards = ["HIPAA", "SOC2"]

# EKS Configuration (smaller for dev)
eks_cluster_version     = "1.29"
eks_node_instance_types = ["m6i.large"]
eks_node_min_size       = 1
eks_node_max_size       = 3
eks_node_desired_size   = 2

# RDS Configuration (smaller for dev)
rds_engine_version        = "15.4"
rds_instance_class        = "db.serverless"
rds_backup_retention_days = 7

# ElastiCache Configuration (smaller for dev)
elasticache_node_type          = "cache.t4g.small"
elasticache_num_cache_clusters = 1

# Monitoring
cloudwatch_retention_days = 30
enable_enhanced_monitoring = false

# Cost management
monthly_budget_usd = 5000

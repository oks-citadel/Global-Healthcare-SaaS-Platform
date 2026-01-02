# ============================================
# The Unified Health Platform - Production Environment
# ============================================
# AWS-ONLY Configuration (Azure Removed)
# Multi-Region Deployment
# ============================================

environment  = "prod"
project_name = "unified-health"
aws_region   = "us-east-1"

# Multi-region for production
deploy_americas = true
deploy_europe   = true
deploy_africa   = true

# Full compliance
compliance_standards    = ["HIPAA", "SOC2", "ISO27001", "GDPR", "POPIA"]
data_residency_required = true

# EKS Configuration (production-grade)
eks_cluster_version     = "1.29"
eks_node_instance_types = ["m6i.xlarge", "m6i.2xlarge"]
eks_node_min_size       = 3
eks_node_max_size       = 20
eks_node_desired_size   = 5

# RDS Configuration (production-grade)
rds_engine_version        = "15.4"
rds_instance_class        = "db.r6g.large"
rds_multi_az              = true
rds_backup_retention_days = 35

# ElastiCache Configuration (production-grade)
elasticache_node_type          = "cache.r6g.xlarge"
elasticache_num_cache_clusters = 3

# Monitoring
cloudwatch_retention_days  = 90
enable_enhanced_monitoring = true

# Cost management
monthly_budget_usd = 50000

# Alert configuration
alert_email = "ops@unifiedhealth.com"

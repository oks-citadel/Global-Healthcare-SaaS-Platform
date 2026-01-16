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

# ECS Fargate Configuration (replaces EKS)
ecs_enable_container_insights = true
ecs_fargate_weight            = 30
ecs_fargate_spot_weight       = 70
ecs_log_retention_days        = 30

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

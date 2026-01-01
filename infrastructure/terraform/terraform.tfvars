# ============================================
# UnifiedHealth Platform - Terraform Variables
# ============================================
# Production deployment configuration for AWS Account: 992382449461
# Organizational Unit: ou-2kqs-qw6vym5t
# ============================================

# AWS Account Configuration
aws_account_id         = "992382449461"
organizational_unit_id = "ou-2kqs-qw6vym5t"

# Core Configuration
project_name = "unified-health"
environment  = "prod"
aws_region   = "us-east-1"

# EKS Configuration
kubernetes_version   = "1.29"
eks_public_access    = true
eks_system_node_count = 2
eks_system_node_size  = "m6i.large"
eks_system_node_min   = 2
eks_system_node_max   = 4
eks_user_node_count   = 3
eks_user_node_size    = "m6i.xlarge"
eks_user_node_min     = 2
eks_user_node_max     = 10

# RDS Configuration
postgresql_admin_username = "unifiedhealth_admin"
rds_instance_class        = "db.serverless"
rds_backup_retention_days = 35

# ElastiCache Configuration
redis_node_type          = "cache.r6g.large"
redis_num_cache_clusters = 2

# Monitoring Configuration
cloudwatch_retention_days = 30
alert_email_address       = "ops@unifiedhealth.example.com"

# Multi-Region Deployment
deploy_americas = true
deploy_europe   = true
deploy_africa   = true

# Compliance Configuration
compliance_standards    = ["HIPAA", "SOC2", "ISO27001", "GDPR", "POPIA"]
data_residency_required = true

# Cost Management
enable_cost_allocation_tags = true
monthly_budget_usd          = 50000

# CI/CD Configuration
github_repository    = "oks-citadel/Global-Healthcare-SaaS-Platform"
github_branch        = "main"
enable_cicd_pipeline = true

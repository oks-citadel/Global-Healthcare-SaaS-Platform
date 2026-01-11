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

# ECS Fargate Configuration (EKS removed - using serverless containers)
ecs_cluster_name           = "unified-health-prod"
ecs_enable_container_insights = true
ecs_capacity_providers     = ["FARGATE", "FARGATE_SPOT"]
ecs_default_capacity_provider = "FARGATE_SPOT"
ecs_task_cpu               = 512
ecs_task_memory            = 1024
ecs_service_min_count      = 2
ecs_service_max_count      = 10

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

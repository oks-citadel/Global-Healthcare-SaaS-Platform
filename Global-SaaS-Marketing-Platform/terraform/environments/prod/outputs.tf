################################################################################
# Outputs - Production Environment
# Global SaaS Marketing Platform
################################################################################

################################################################################
# VPC Outputs
################################################################################

output "vpc_id" {
  description = "ID of the VPC"
  value       = module.networking.vpc_id
}

output "vpc_cidr" {
  description = "CIDR block of the VPC"
  value       = module.networking.vpc_cidr
}

output "private_subnet_ids" {
  description = "IDs of private subnets"
  value       = module.networking.private_subnet_ids
}

output "public_subnet_ids" {
  description = "IDs of public subnets"
  value       = module.networking.public_subnet_ids
}

output "nat_gateway_public_ips" {
  description = "Public IPs of NAT gateways"
  value       = module.networking.nat_gateway_public_ips
}

################################################################################
# EKS Outputs
################################################################################

output "eks_cluster_name" {
  description = "Name of the EKS cluster"
  value       = module.eks_cluster.cluster_name
}

output "eks_cluster_endpoint" {
  description = "Endpoint for EKS cluster"
  value       = module.eks_cluster.cluster_endpoint
}

output "eks_cluster_certificate_authority" {
  description = "Certificate authority data for EKS cluster"
  value       = module.eks_cluster.cluster_certificate_authority_data
  sensitive   = true
}

output "eks_kubeconfig_command" {
  description = "AWS CLI command to update kubeconfig"
  value       = module.eks_cluster.kubeconfig_command
}

output "eks_oidc_provider_arn" {
  description = "ARN of EKS OIDC provider"
  value       = module.eks_cluster.oidc_provider_arn
}

output "eks_node_groups" {
  description = "EKS node groups"
  value       = { for k, v in module.eks_cluster.node_groups : k => v.id }
}

################################################################################
# Database Outputs
################################################################################

output "aurora_cluster_endpoint" {
  description = "Aurora cluster writer endpoint"
  value       = module.databases.aurora_cluster_endpoint
}

output "aurora_reader_endpoint" {
  description = "Aurora cluster reader endpoint"
  value       = module.databases.aurora_cluster_reader_endpoint
}

output "aurora_master_user_secret_arn" {
  description = "ARN of Aurora master user secret"
  value       = module.databases.aurora_master_user_secret_arn
}

output "redis_primary_endpoint" {
  description = "Redis primary endpoint"
  value       = module.databases.redis_primary_endpoint_address
}

output "redis_reader_endpoint" {
  description = "Redis reader endpoint"
  value       = module.databases.redis_reader_endpoint_address
}

output "opensearch_endpoint" {
  description = "OpenSearch domain endpoint"
  value       = module.databases.opensearch_endpoint
}

output "opensearch_dashboard_endpoint" {
  description = "OpenSearch dashboard endpoint"
  value       = module.databases.opensearch_dashboard_endpoint
}

output "dynamodb_table_arns" {
  description = "ARNs of DynamoDB tables"
  value       = module.databases.dynamodb_table_arns
}

output "dynamodb_table_stream_arns" {
  description = "Stream ARNs of DynamoDB tables"
  value       = module.databases.dynamodb_table_stream_arns
}

################################################################################
# Storage Outputs
################################################################################

output "public_assets_bucket" {
  description = "Public assets S3 bucket name"
  value       = module.storage.public_assets_bucket_id
}

output "private_bucket" {
  description = "Private S3 bucket name"
  value       = module.storage.private_bucket_id
}

output "uploads_bucket" {
  description = "Uploads S3 bucket name"
  value       = module.storage.uploads_bucket_id
}

output "logs_bucket" {
  description = "Logs S3 bucket name"
  value       = module.storage.logs_bucket_id
}

output "efs_file_system_id" {
  description = "EFS file system ID"
  value       = module.storage.efs_file_system_id
}

output "efs_access_point_ids" {
  description = "EFS access point IDs"
  value       = module.storage.efs_access_point_ids
}

################################################################################
# CloudFront Outputs
################################################################################

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = module.edge_cloudfront.distribution_id
}

output "cloudfront_distribution_arn" {
  description = "CloudFront distribution ARN"
  value       = module.edge_cloudfront.distribution_arn
}

output "cloudfront_distribution_domain" {
  description = "CloudFront distribution domain name"
  value       = module.edge_cloudfront.distribution_domain_name
}

################################################################################
# Messaging Outputs
################################################################################

output "event_bus_name" {
  description = "EventBridge event bus name"
  value       = module.messaging.event_bus_name
}

output "event_bus_arn" {
  description = "EventBridge event bus ARN"
  value       = module.messaging.event_bus_arn
}

output "sqs_queue_urls" {
  description = "SQS queue URLs"
  value       = module.messaging.sqs_queue_urls
}

output "sqs_queue_arns" {
  description = "SQS queue ARNs"
  value       = module.messaging.sqs_queue_arns
}

output "sns_topic_arns" {
  description = "SNS topic ARNs"
  value       = module.messaging.sns_topic_arns
}

output "step_function_arns" {
  description = "Step Function state machine ARNs"
  value       = module.messaging.step_function_arns
}

################################################################################
# Data Lake Outputs
################################################################################

output "data_lake_bucket" {
  description = "Data lake S3 bucket name"
  value       = module.data_lake.data_lake_bucket_id
}

output "data_lake_bucket_arn" {
  description = "Data lake S3 bucket ARN"
  value       = module.data_lake.data_lake_bucket_arn
}

output "glue_database_name" {
  description = "Glue catalog database name"
  value       = module.data_lake.glue_catalog_database_name
}

output "athena_workgroup" {
  description = "Athena workgroup name"
  value       = module.data_lake.athena_workgroup_name
}

output "kinesis_stream_arns" {
  description = "Kinesis stream ARNs"
  value       = module.data_lake.kinesis_stream_arns
}

output "firehose_delivery_stream_arns" {
  description = "Firehose delivery stream ARNs"
  value       = module.data_lake.firehose_delivery_stream_arns
}

################################################################################
# Email Outputs
################################################################################

output "ses_domain_identity_arn" {
  description = "SES domain identity ARN"
  value       = module.email.ses_domain_identity_arn
}

output "ses_configuration_set" {
  description = "SES configuration set name"
  value       = module.email.ses_configuration_set_name
}

output "ses_template_names" {
  description = "SES template names"
  value       = module.email.ses_template_names
}

output "ses_sender_role_arn" {
  description = "SES sender IAM role ARN"
  value       = module.email.ses_sender_role_arn
}

################################################################################
# Observability Outputs
################################################################################

output "amp_workspace_endpoint" {
  description = "AMP workspace endpoint"
  value       = module.observability.amp_workspace_endpoint
}

output "amg_workspace_endpoint" {
  description = "AMG workspace endpoint"
  value       = module.observability.amg_workspace_endpoint
}

output "cloudwatch_dashboard_name" {
  description = "CloudWatch dashboard name"
  value       = module.observability.dashboard_name
}

output "alerts_topic_arn" {
  description = "Alerts SNS topic ARN"
  value       = module.observability.alerts_topic_arn
}

################################################################################
# Security Outputs
################################################################################

output "kms_main_key_arn" {
  description = "Main KMS key ARN"
  value       = module.security_baseline.main_kms_key_arn
}

output "kms_rds_key_arn" {
  description = "RDS KMS key ARN"
  value       = module.security_baseline.rds_kms_key_arn
}

output "kms_s3_key_arn" {
  description = "S3 KMS key ARN"
  value       = module.security_baseline.s3_kms_key_arn
}

output "waf_cloudfront_acl_arn" {
  description = "WAF CloudFront ACL ARN"
  value       = module.security_baseline.waf_cloudfront_acl_arn
}

output "waf_alb_acl_arn" {
  description = "WAF ALB ACL ARN"
  value       = module.security_baseline.waf_alb_acl_arn
}

output "guardduty_detector_id" {
  description = "GuardDuty detector ID"
  value       = module.security_baseline.guardduty_detector_id
}

output "cloudtrail_arn" {
  description = "CloudTrail ARN"
  value       = module.security_baseline.cloudtrail_arn
}

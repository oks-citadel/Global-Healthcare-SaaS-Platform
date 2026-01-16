################################################################################
# Outputs - Data Lake Module
# Global SaaS Marketing Platform
################################################################################

# S3 Data Lake Outputs
output "data_lake_bucket_id" {
  description = "ID of the data lake S3 bucket"
  value       = aws_s3_bucket.data_lake.id
}

output "data_lake_bucket_arn" {
  description = "ARN of the data lake S3 bucket"
  value       = aws_s3_bucket.data_lake.arn
}

output "data_lake_bucket_domain_name" {
  description = "Domain name of the data lake S3 bucket"
  value       = aws_s3_bucket.data_lake.bucket_domain_name
}

# Kinesis Stream Outputs
output "kinesis_stream_arns" {
  description = "Map of Kinesis stream ARNs"
  value       = { for k, v in aws_kinesis_stream.main : k => v.arn }
}

output "kinesis_stream_names" {
  description = "Map of Kinesis stream names"
  value       = { for k, v in aws_kinesis_stream.main : k => v.name }
}

# Firehose Outputs
output "firehose_delivery_stream_arns" {
  description = "Map of Firehose delivery stream ARNs"
  value       = { for k, v in aws_kinesis_firehose_delivery_stream.main : k => v.arn }
}

output "firehose_delivery_stream_names" {
  description = "Map of Firehose delivery stream names"
  value       = { for k, v in aws_kinesis_firehose_delivery_stream.main : k => v.name }
}

# Glue Catalog Outputs
output "glue_catalog_database_name" {
  description = "Name of the Glue catalog database"
  value       = aws_glue_catalog_database.main.name
}

output "glue_catalog_database_arn" {
  description = "ARN of the Glue catalog database"
  value       = aws_glue_catalog_database.main.arn
}

output "glue_table_names" {
  description = "Map of Glue table names"
  value       = { for k, v in aws_glue_catalog_table.main : k => v.name }
}

output "glue_crawler_names" {
  description = "Map of Glue crawler names"
  value       = { for k, v in aws_glue_crawler.main : k => v.name }
}

output "glue_crawler_role_arn" {
  description = "ARN of the Glue crawler IAM role"
  value       = aws_iam_role.glue_crawler.arn
}

# Athena Outputs
output "athena_workgroup_name" {
  description = "Name of the Athena workgroup"
  value       = aws_athena_workgroup.main.name
}

output "athena_workgroup_arn" {
  description = "ARN of the Athena workgroup"
  value       = aws_athena_workgroup.main.arn
}

output "athena_results_location" {
  description = "S3 location for Athena query results"
  value       = "s3://${aws_s3_bucket.data_lake.id}/athena-results/"
}

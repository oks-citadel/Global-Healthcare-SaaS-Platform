# =============================================================================
# The Unified Health - Asset Branding ECR Module Outputs
# =============================================================================

output "repository_arn" {
  description = "ARN of the ECR repository"
  value       = aws_ecr_repository.asset_branding.arn
}

output "repository_url" {
  description = "URL of the ECR repository"
  value       = aws_ecr_repository.asset_branding.repository_url
}

output "repository_name" {
  description = "Name of the ECR repository"
  value       = aws_ecr_repository.asset_branding.name
}

output "registry_id" {
  description = "Registry ID (AWS account ID)"
  value       = aws_ecr_repository.asset_branding.registry_id
}

output "push_policy_arn" {
  description = "ARN of the IAM policy for pushing images"
  value       = aws_iam_policy.ecr_push.arn
}

output "version_parameter_name" {
  description = "SSM parameter name for current version"
  value       = aws_ssm_parameter.current_version.name
}

output "repository_url_parameter_name" {
  description = "SSM parameter name for repository URL"
  value       = aws_ssm_parameter.repository_url.name
}

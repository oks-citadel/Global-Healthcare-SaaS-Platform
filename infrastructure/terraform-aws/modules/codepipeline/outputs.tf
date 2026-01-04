# ============================================
# The Unified Health - CodePipeline Outputs
# ============================================

output "pipeline_name" {
  description = "Name of the CodePipeline"
  value       = aws_codepipeline.main.name
}

output "pipeline_arn" {
  description = "ARN of the CodePipeline"
  value       = aws_codepipeline.main.arn
}

output "artifacts_bucket_name" {
  description = "Name of the S3 bucket for pipeline artifacts"
  value       = aws_s3_bucket.pipeline_artifacts.id
}

output "codebuild_web_app_name" {
  description = "Name of the web app CodeBuild project"
  value       = aws_codebuild_project.web_app.name
}

output "codebuild_api_service_name" {
  description = "Name of the API service CodeBuild project"
  value       = aws_codebuild_project.api_service.name
}

output "nightly_build_rule_arn" {
  description = "ARN of the EventBridge rule for nightly builds"
  value       = var.enable_nightly_builds ? aws_cloudwatch_event_rule.nightly_build[0].arn : null
}

output "nightly_build_schedule" {
  description = "Schedule expression for nightly builds (9:00 PM daily)"
  value       = var.enable_nightly_builds ? aws_cloudwatch_event_rule.nightly_build[0].schedule_expression : null
}

output "codebuild_deploy_name" {
  description = "Name of the EKS deploy CodeBuild project"
  value       = aws_codebuild_project.deploy.name
}

output "codebuild_role_arn" {
  description = "ARN of the CodeBuild IAM role"
  value       = aws_iam_role.codebuild.arn
}

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

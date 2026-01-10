# ============================================
# CDN Module Outputs
# ============================================

output "distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.main.id
}

output "distribution_arn" {
  description = "CloudFront distribution ARN"
  value       = aws_cloudfront_distribution.main.arn
}

output "distribution_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.main.domain_name
}

output "distribution_hosted_zone_id" {
  description = "CloudFront distribution hosted zone ID"
  value       = aws_cloudfront_distribution.main.hosted_zone_id
}

output "cache_policy_id" {
  description = "ID of the optimized cache policy"
  value       = aws_cloudfront_cache_policy.optimized.id
}

output "api_cache_policy_id" {
  description = "ID of the API cache policy"
  value       = aws_cloudfront_cache_policy.api.id
}

output "origin_access_control_id" {
  description = "Origin Access Control ID"
  value       = aws_cloudfront_origin_access_control.main.id
}

output "url_rewrite_function_arn" {
  description = "URL rewrite function ARN"
  value       = aws_cloudfront_function.url_rewrite.arn
}

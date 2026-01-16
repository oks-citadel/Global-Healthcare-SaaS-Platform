################################################################################
# Outputs - Edge CloudFront Module
# Global SaaS Marketing Platform
################################################################################

# Distribution Outputs
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

output "distribution_status" {
  description = "CloudFront distribution status"
  value       = aws_cloudfront_distribution.main.status
}

output "distribution_etag" {
  description = "CloudFront distribution ETag"
  value       = aws_cloudfront_distribution.main.etag
}

# Origin Access Control
output "s3_oac_id" {
  description = "S3 Origin Access Control ID"
  value       = aws_cloudfront_origin_access_control.s3.id
}

# Cache Policies
output "static_assets_cache_policy_id" {
  description = "ID of static assets cache policy"
  value       = aws_cloudfront_cache_policy.static_assets.id
}

output "dynamic_content_cache_policy_id" {
  description = "ID of dynamic content cache policy"
  value       = aws_cloudfront_cache_policy.dynamic_content.id
}

output "api_cache_policy_id" {
  description = "ID of API cache policy"
  value       = aws_cloudfront_cache_policy.api.id
}

# Origin Request Policies
output "alb_origin_request_policy_id" {
  description = "ID of ALB origin request policy"
  value       = aws_cloudfront_origin_request_policy.alb.id
}

output "s3_origin_request_policy_id" {
  description = "ID of S3 origin request policy"
  value       = aws_cloudfront_origin_request_policy.s3.id
}

# Response Headers Policy
output "security_response_headers_policy_id" {
  description = "ID of security response headers policy"
  value       = aws_cloudfront_response_headers_policy.security.id
}

# CloudFront Functions
output "url_rewrite_function_arn" {
  description = "ARN of URL rewrite CloudFront function"
  value       = aws_cloudfront_function.url_rewrite.arn
}

output "security_headers_function_arn" {
  description = "ARN of security headers CloudFront function"
  value       = aws_cloudfront_function.security_headers.arn
}

# DNS
output "route53_record_names" {
  description = "Route 53 record names created"
  value       = [for r in aws_route53_record.main : r.name]
}

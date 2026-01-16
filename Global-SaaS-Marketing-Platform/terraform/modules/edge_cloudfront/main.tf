################################################################################
# Edge CloudFront Module - Main Configuration
# Global SaaS Marketing Platform
################################################################################

locals {
  common_tags = merge(var.tags, {
    Module = "edge_cloudfront"
  })

  s3_origin_id  = "${var.project_name}-${var.environment}-s3-origin"
  alb_origin_id = "${var.project_name}-${var.environment}-alb-origin"
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

################################################################################
# Origin Access Control for S3
################################################################################

resource "aws_cloudfront_origin_access_control" "s3" {
  name                              = "${var.project_name}-${var.environment}-s3-oac"
  description                       = "OAC for S3 bucket access"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

################################################################################
# Cache Policies
################################################################################

resource "aws_cloudfront_cache_policy" "static_assets" {
  name        = "${var.project_name}-${var.environment}-static-assets"
  comment     = "Cache policy for static assets"
  default_ttl = 86400    # 1 day
  max_ttl     = 31536000 # 1 year
  min_ttl     = 1

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "none"
    }
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true
  }
}

resource "aws_cloudfront_cache_policy" "dynamic_content" {
  name        = "${var.project_name}-${var.environment}-dynamic-content"
  comment     = "Cache policy for dynamic content"
  default_ttl = 0
  max_ttl     = 1
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "all"
    }
    headers_config {
      header_behavior = "whitelist"
      headers {
        items = ["Authorization", "Host", "Origin", "Accept", "Accept-Language"]
      }
    }
    query_strings_config {
      query_string_behavior = "all"
    }
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true
  }
}

resource "aws_cloudfront_cache_policy" "api" {
  name        = "${var.project_name}-${var.environment}-api"
  comment     = "Cache policy for API requests"
  default_ttl = 0
  max_ttl     = 0
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "all"
    }
    headers_config {
      header_behavior = "whitelist"
      headers {
        items = ["Authorization", "Host", "Origin", "Accept", "Content-Type", "X-Requested-With"]
      }
    }
    query_strings_config {
      query_string_behavior = "all"
    }
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true
  }
}

################################################################################
# Origin Request Policies
################################################################################

resource "aws_cloudfront_origin_request_policy" "alb" {
  name    = "${var.project_name}-${var.environment}-alb-origin"
  comment = "Origin request policy for ALB"

  cookies_config {
    cookie_behavior = "all"
  }
  headers_config {
    header_behavior = "allViewerAndWhitelistCloudFront"
    headers {
      items = ["CloudFront-Viewer-Country", "CloudFront-Viewer-City", "CloudFront-Is-Mobile-Viewer", "CloudFront-Is-Desktop-Viewer"]
    }
  }
  query_strings_config {
    query_string_behavior = "all"
  }
}

resource "aws_cloudfront_origin_request_policy" "s3" {
  name    = "${var.project_name}-${var.environment}-s3-origin"
  comment = "Origin request policy for S3"

  cookies_config {
    cookie_behavior = "none"
  }
  headers_config {
    header_behavior = "whitelist"
    headers {
      items = ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]
    }
  }
  query_strings_config {
    query_string_behavior = "none"
  }
}

################################################################################
# Response Headers Policy
################################################################################

resource "aws_cloudfront_response_headers_policy" "security" {
  name    = "${var.project_name}-${var.environment}-security-headers"
  comment = "Security headers policy"

  security_headers_config {
    content_security_policy {
      content_security_policy = var.content_security_policy
      override                = true
    }
    content_type_options {
      override = true
    }
    frame_options {
      frame_option = "DENY"
      override     = true
    }
    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }
    xss_protection {
      mode_block = true
      protection = true
      override   = true
    }
  }

  cors_config {
    access_control_allow_credentials = false
    access_control_max_age_sec       = 600
    origin_override                  = true

    access_control_allow_headers {
      items = ["*"]
    }
    access_control_allow_methods {
      items = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    }
    access_control_allow_origins {
      items = var.cors_allowed_origins
    }
    access_control_expose_headers {
      items = ["ETag", "X-Request-Id"]
    }
  }

  custom_headers_config {
    items {
      header   = "X-Robots-Tag"
      override = true
      value    = var.environment == "prod" ? "all" : "noindex, nofollow"
    }
    items {
      header   = "Cache-Control"
      override = false
      value    = "no-cache"
    }
  }
}

################################################################################
# CloudFront Distribution
################################################################################

resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project_name} ${var.environment} distribution"
  default_root_object = "index.html"
  price_class         = var.price_class
  aliases             = var.domain_names
  web_acl_id          = var.waf_web_acl_arn
  http_version        = "http2and3"

  # S3 Origin for static assets
  origin {
    domain_name              = var.s3_bucket_regional_domain_name
    origin_id                = local.s3_origin_id
    origin_access_control_id = aws_cloudfront_origin_access_control.s3.id
    origin_path              = var.s3_origin_path

    origin_shield {
      enabled              = var.enable_origin_shield
      origin_shield_region = var.origin_shield_region
    }
  }

  # ALB Origin for dynamic content
  dynamic "origin" {
    for_each = var.alb_dns_name != null ? [1] : []
    content {
      domain_name = var.alb_dns_name
      origin_id   = local.alb_origin_id

      custom_origin_config {
        http_port                = 80
        https_port               = 443
        origin_protocol_policy   = "https-only"
        origin_ssl_protocols     = ["TLSv1.2"]
        origin_keepalive_timeout = 60
        origin_read_timeout      = 60
      }

      origin_shield {
        enabled              = var.enable_origin_shield
        origin_shield_region = var.origin_shield_region
      }

      custom_header {
        name  = "X-CloudFront-Secret"
        value = var.cloudfront_secret_header
      }
    }
  }

  # Default behavior (S3 static assets)
  default_cache_behavior {
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = local.s3_origin_id
    viewer_protocol_policy     = "redirect-to-https"
    compress                   = true
    cache_policy_id            = aws_cloudfront_cache_policy.static_assets.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.s3.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.url_rewrite.arn
    }
  }

  # API behavior
  dynamic "ordered_cache_behavior" {
    for_each = var.alb_dns_name != null ? [1] : []
    content {
      path_pattern               = "/api/*"
      allowed_methods            = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
      cached_methods             = ["GET", "HEAD"]
      target_origin_id           = local.alb_origin_id
      viewer_protocol_policy     = "redirect-to-https"
      compress                   = true
      cache_policy_id            = aws_cloudfront_cache_policy.api.id
      origin_request_policy_id   = aws_cloudfront_origin_request_policy.alb.id
      response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
    }
  }

  # GraphQL behavior
  dynamic "ordered_cache_behavior" {
    for_each = var.alb_dns_name != null ? [1] : []
    content {
      path_pattern               = "/graphql"
      allowed_methods            = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
      cached_methods             = ["GET", "HEAD"]
      target_origin_id           = local.alb_origin_id
      viewer_protocol_policy     = "redirect-to-https"
      compress                   = true
      cache_policy_id            = aws_cloudfront_cache_policy.api.id
      origin_request_policy_id   = aws_cloudfront_origin_request_policy.alb.id
      response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
    }
  }

  # Health check behavior
  dynamic "ordered_cache_behavior" {
    for_each = var.alb_dns_name != null ? [1] : []
    content {
      path_pattern               = "/health"
      allowed_methods            = ["GET", "HEAD"]
      cached_methods             = ["GET", "HEAD"]
      target_origin_id           = local.alb_origin_id
      viewer_protocol_policy     = "redirect-to-https"
      compress                   = true
      cache_policy_id            = aws_cloudfront_cache_policy.api.id
      origin_request_policy_id   = aws_cloudfront_origin_request_policy.alb.id
    }
  }

  # Static assets with longer cache
  ordered_cache_behavior {
    path_pattern               = "/static/*"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = local.s3_origin_id
    viewer_protocol_policy     = "redirect-to-https"
    compress                   = true
    cache_policy_id            = aws_cloudfront_cache_policy.static_assets.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.s3.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id
  }

  # Custom error responses for SPA
  custom_error_response {
    error_caching_min_ttl = 10
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }

  custom_error_response {
    error_caching_min_ttl = 10
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = length(var.geo_restriction_locations) > 0 ? var.geo_restriction_type : "none"
      locations        = var.geo_restriction_locations
    }
  }

  viewer_certificate {
    acm_certificate_arn            = var.acm_certificate_arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
    cloudfront_default_certificate = var.acm_certificate_arn == null
  }

  logging_config {
    include_cookies = false
    bucket          = var.log_bucket_domain_name
    prefix          = "cloudfront/${var.project_name}-${var.environment}/"
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-distribution"
  })
}

################################################################################
# CloudFront Functions
################################################################################

resource "aws_cloudfront_function" "url_rewrite" {
  name    = "${var.project_name}-${var.environment}-url-rewrite"
  runtime = "cloudfront-js-2.0"
  comment = "URL rewrite for SPA routing"
  publish = true
  code    = <<-EOF
function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // Check if the URI has a file extension
    if (uri.includes('.')) {
        return request;
    }

    // Check if the URI ends with a trailing slash
    if (uri.endsWith('/') && uri !== '/') {
        request.uri = uri.slice(0, -1);
        return request;
    }

    // For paths without extensions, serve index.html for SPA
    if (!uri.startsWith('/api') && !uri.startsWith('/graphql') && !uri.startsWith('/health') && !uri.startsWith('/static')) {
        // Let CloudFront serve from S3 for SPA routes
        return request;
    }

    return request;
}
EOF
}

resource "aws_cloudfront_function" "security_headers" {
  name    = "${var.project_name}-${var.environment}-security-headers"
  runtime = "cloudfront-js-2.0"
  comment = "Add security headers to responses"
  publish = true
  code    = <<-EOF
function handler(event) {
    var response = event.response;
    var headers = response.headers;

    // Add security headers if not already present
    if (!headers['x-frame-options']) {
        headers['x-frame-options'] = { value: 'DENY' };
    }
    if (!headers['x-content-type-options']) {
        headers['x-content-type-options'] = { value: 'nosniff' };
    }
    if (!headers['x-xss-protection']) {
        headers['x-xss-protection'] = { value: '1; mode=block' };
    }

    return response;
}
EOF
}

################################################################################
# Route 53 Records (if hosted zone provided)
################################################################################

resource "aws_route53_record" "main" {
  for_each = var.route53_zone_id != null ? toset(var.domain_names) : toset([])

  zone_id = var.route53_zone_id
  name    = each.value
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.main.domain_name
    zone_id                = aws_cloudfront_distribution.main.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "main_ipv6" {
  for_each = var.route53_zone_id != null ? toset(var.domain_names) : toset([])

  zone_id = var.route53_zone_id
  name    = each.value
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.main.domain_name
    zone_id                = aws_cloudfront_distribution.main.hosted_zone_id
    evaluate_target_health = false
  }
}

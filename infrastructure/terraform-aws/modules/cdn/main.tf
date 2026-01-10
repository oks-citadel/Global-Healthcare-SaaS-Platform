# ============================================
# CloudFront CDN Module
# Cost-optimized content delivery configuration
# ============================================

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# ============================================
# Origin Access Control for S3
# ============================================

resource "aws_cloudfront_origin_access_control" "main" {
  name                              = "${var.project_name}-${var.environment}-oac"
  description                       = "OAC for ${var.project_name} S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ============================================
# Cache Policy - Optimized for Cost
# ============================================

resource "aws_cloudfront_cache_policy" "optimized" {
  name        = "${var.project_name}-${var.environment}-cache-policy"
  comment     = "Cost-optimized cache policy with long TTLs"
  default_ttl = var.default_ttl
  max_ttl     = var.max_ttl
  min_ttl     = var.min_ttl

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "whitelist"
      headers {
        items = ["Accept", "Accept-Encoding", "Accept-Language", "Origin"]
      }
    }

    query_strings_config {
      query_string_behavior = "whitelist"
      query_strings {
        items = ["v", "version", "hash"]
      }
    }

    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true
  }
}

# API Cache Policy - Shorter TTLs for dynamic content
resource "aws_cloudfront_cache_policy" "api" {
  name        = "${var.project_name}-${var.environment}-api-cache-policy"
  comment     = "Cache policy for API responses"
  default_ttl = 60
  max_ttl     = 300
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "whitelist"
      headers {
        items = ["Authorization", "Accept", "Accept-Encoding"]
      }
    }

    query_strings_config {
      query_string_behavior = "all"
    }

    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true
  }
}

# ============================================
# Origin Request Policy
# ============================================

resource "aws_cloudfront_origin_request_policy" "api" {
  name    = "${var.project_name}-${var.environment}-api-request-policy"
  comment = "Request policy for API origin"

  cookies_config {
    cookie_behavior = "all"
  }

  headers_config {
    header_behavior = "whitelist"
    headers {
      items = [
        "Accept",
        "Accept-Encoding",
        "Accept-Language",
        "Authorization",
        "Content-Type",
        "Origin",
        "Referer",
        "X-Request-ID",
        "X-Tenant-ID"
      ]
    }
  }

  query_strings_config {
    query_string_behavior = "all"
  }
}

# ============================================
# Response Headers Policy
# ============================================

resource "aws_cloudfront_response_headers_policy" "security" {
  name    = "${var.project_name}-${var.environment}-security-headers"
  comment = "Security headers for CloudFront responses"

  security_headers_config {
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

    access_control_allow_headers {
      items = ["*"]
    }

    access_control_allow_methods {
      items = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    }

    access_control_allow_origins {
      items = var.cors_allowed_origins
    }

    access_control_max_age_sec = 86400
    origin_override            = true
  }

  custom_headers_config {
    items {
      header   = "Cache-Control"
      value    = "public, max-age=31536000, immutable"
      override = false
    }
  }
}

# ============================================
# CloudFront Distribution
# ============================================

resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project_name} ${var.environment} CDN Distribution"
  default_root_object = "index.html"
  price_class         = var.price_class
  aliases             = var.domain_aliases
  web_acl_id          = var.web_acl_id

  # Static Assets Origin (S3)
  origin {
    domain_name              = var.s3_bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.main.id
    origin_id                = "S3-${var.project_name}-static"

    origin_shield {
      enabled              = var.enable_origin_shield
      origin_shield_region = var.origin_shield_region
    }
  }

  # API Origin (ALB/API Gateway)
  dynamic "origin" {
    for_each = var.api_domain_name != "" ? [1] : []

    content {
      domain_name = var.api_domain_name
      origin_id   = "API-${var.project_name}"

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
    }
  }

  # Default behavior for static assets
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.project_name}-static"

    cache_policy_id            = aws_cloudfront_cache_policy.optimized.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id

    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.url_rewrite.arn
    }
  }

  # API behavior
  dynamic "ordered_cache_behavior" {
    for_each = var.api_domain_name != "" ? [1] : []

    content {
      path_pattern     = "/api/*"
      allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
      cached_methods   = ["GET", "HEAD"]
      target_origin_id = "API-${var.project_name}"

      cache_policy_id          = aws_cloudfront_cache_policy.api.id
      origin_request_policy_id = aws_cloudfront_origin_request_policy.api.id

      compress               = true
      viewer_protocol_policy = "https-only"
    }
  }

  # Health check endpoint (no caching)
  ordered_cache_behavior {
    path_pattern     = "/health*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = var.api_domain_name != "" ? "API-${var.project_name}" : "S3-${var.project_name}-static"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = false
    viewer_protocol_policy = "https-only"
  }

  # Static assets with long cache (immutable)
  ordered_cache_behavior {
    path_pattern     = "/static/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${var.project_name}-static"

    cache_policy_id            = aws_cloudfront_cache_policy.optimized.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security.id

    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  # SPA fallback for client-side routing
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = var.geo_restriction_type
      locations        = var.geo_restriction_locations
    }
  }

  viewer_certificate {
    acm_certificate_arn            = var.acm_certificate_arn
    ssl_support_method             = var.acm_certificate_arn != "" ? "sni-only" : null
    minimum_protocol_version       = "TLSv1.2_2021"
    cloudfront_default_certificate = var.acm_certificate_arn == ""
  }

  logging_config {
    include_cookies = false
    bucket          = var.log_bucket
    prefix          = "cloudfront/${var.environment}/"
  }

  tags = merge(var.tags, {
    Name        = "${var.project_name}-${var.environment}-cdn"
    Environment = var.environment
    CostCenter  = var.cost_center
  })
}

# ============================================
# CloudFront Function for URL Rewriting
# ============================================

resource "aws_cloudfront_function" "url_rewrite" {
  name    = "${var.project_name}-${var.environment}-url-rewrite"
  runtime = "cloudfront-js-2.0"
  comment = "URL rewriting for SPA and cache optimization"
  publish = true

  code = <<-EOF
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // Add index.html for directory requests
  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  }
  // Handle SPA routes (no extension = HTML route)
  else if (!uri.includes('.')) {
    // Check if it's not an API route
    if (!uri.startsWith('/api/') && !uri.startsWith('/health')) {
      request.uri = '/index.html';
    }
  }

  // Add cache busting for versioned assets
  var cacheVersion = request.querystring.v || request.querystring.version;
  if (cacheVersion) {
    request.headers['x-cache-version'] = { value: cacheVersion.value };
  }

  return request;
}
EOF
}

# ============================================
# CloudFront Real-Time Logs (Optional)
# ============================================

resource "aws_cloudfront_realtime_log_config" "main" {
  count = var.enable_realtime_logs ? 1 : 0

  name          = "${var.project_name}-${var.environment}-realtime-logs"
  sampling_rate = var.realtime_log_sampling_rate

  fields = [
    "timestamp",
    "c-ip",
    "sc-status",
    "cs-method",
    "cs-uri-stem",
    "cs-bytes",
    "sc-bytes",
    "time-taken",
    "x-edge-location",
    "x-edge-result-type",
    "cs-protocol",
    "cs-user-agent"
  ]

  endpoint {
    stream_type = "Kinesis"

    kinesis_stream_config {
      role_arn   = aws_iam_role.cloudfront_realtime_logs[0].arn
      stream_arn = aws_kinesis_stream.cloudfront_logs[0].arn
    }
  }
}

resource "aws_kinesis_stream" "cloudfront_logs" {
  count = var.enable_realtime_logs ? 1 : 0

  name             = "${var.project_name}-${var.environment}-cf-logs"
  shard_count      = 1
  retention_period = 24

  stream_mode_details {
    stream_mode = "PROVISIONED"
  }

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-cf-logs"
  })
}

resource "aws_iam_role" "cloudfront_realtime_logs" {
  count = var.enable_realtime_logs ? 1 : 0

  name = "${var.project_name}-${var.environment}-cf-logs-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "cloudfront_realtime_logs" {
  count = var.enable_realtime_logs ? 1 : 0

  name = "${var.project_name}-${var.environment}-cf-logs-policy"
  role = aws_iam_role.cloudfront_realtime_logs[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "kinesis:DescribeStream",
          "kinesis:PutRecord",
          "kinesis:PutRecords"
        ]
        Resource = aws_kinesis_stream.cloudfront_logs[0].arn
      }
    ]
  })
}

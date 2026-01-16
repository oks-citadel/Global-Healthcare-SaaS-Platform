# ============================================
# UnifiedHealth Platform - Global Resources
# ============================================
# MIGRATED FROM AZURE TO AWS
# Shared resources across all regions:
# - CloudFront (replaces Azure Front Door)
# - Global ECR with cross-region replication (replaces ACR)
# - Global KMS Key (replaces Azure Key Vault)
# - Route 53 (replaces Azure Traffic Manager)
# - WAF (replaces Azure WAF)
# ============================================

# ============================================
# Global CloudWatch Log Group
# ============================================

resource "aws_cloudwatch_log_group" "global" {
  name              = "/aws/unified-health/${var.project_name}-global"
  retention_in_days = 90

  tags = merge(local.common_tags, {
    Scope = "Global"
  })
}

# ============================================
# Global KMS Key (Replaces: Azure Key Vault Global)
# ============================================

resource "aws_kms_key" "global" {
  description             = "Global KMS key for ${var.project_name}"
  deletion_window_in_days = 30
  enable_key_rotation     = true
  multi_region            = true

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM User Permissions"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Sid    = "Allow CloudFront"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action = [
          "kms:Decrypt",
          "kms:Encrypt",
          "kms:GenerateDataKey*"
        ]
        Resource = "*"
      },
      {
        Sid    = "Allow Secrets Manager"
        Effect = "Allow"
        Principal = {
          Service = "secretsmanager.amazonaws.com"
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey"
        ]
        Resource = "*"
      }
    ]
  })

  tags = merge(local.common_tags, {
    Name  = "${var.project_name}-global-kms"
    Scope = "Global"
  })
}

resource "aws_kms_alias" "global" {
  name          = "alias/${var.project_name}-global"
  target_key_id = aws_kms_key.global.key_id
}

# ============================================
# Global ECR Repositories (Replaces: Azure ACR with Geo-replication)
# ============================================

resource "aws_ecr_repository" "global" {
  for_each = toset([
    "api-gateway",
    "telehealth-service",
    "mental-health-service",
    "chronic-care-service",
    "pharmacy-service",
    "laboratory-service",
    "auth-service",
    "web-app",
    "provider-portal",
    "admin-portal"
  ])

  name                 = "${var.project_name}-global/${each.value}"
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "KMS"
    kms_key         = aws_kms_key.global.arn
  }

  tags = merge(local.common_tags, {
    Name    = "${var.project_name}-global/${each.value}"
    Scope   = "Global"
    Service = each.value
  })
}

# ECR Replication Configuration
resource "aws_ecr_replication_configuration" "global" {
  replication_configuration {
    rule {
      destination {
        region      = "eu-west-1"
        registry_id = data.aws_caller_identity.current.account_id
      }

      destination {
        region      = "af-south-1"
        registry_id = data.aws_caller_identity.current.account_id
      }

      repository_filter {
        filter      = "${var.project_name}-global/"
        filter_type = "PREFIX_MATCH"
      }
    }
  }
}

# ECR Lifecycle Policies
resource "aws_ecr_lifecycle_policy" "global" {
  for_each   = aws_ecr_repository.global
  repository = each.value.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 50 production images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v", "release", "prod"]
          countType     = "imageCountMoreThan"
          countNumber   = 50
        }
        action = {
          type = "expire"
        }
      },
      {
        rulePriority = 2
        description  = "Expire untagged images older than 14 days"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 14
        }
        action = {
          type = "expire"
        }
      },
      {
        rulePriority = 3
        description  = "Expire dev/feature images older than 30 days"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["dev", "feature", "pr"]
          countType     = "sinceImagePushed"
          countUnit     = "days"
          countNumber   = 30
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

# ============================================
# S3 Bucket for CloudFront Logs
# ============================================

resource "aws_s3_bucket" "cloudfront_logs" {
  bucket = "${var.project_name}-cloudfront-logs-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.common_tags, {
    Name  = "${var.project_name}-cloudfront-logs"
    Scope = "Global"
  })
}

resource "aws_s3_bucket_versioning" "cloudfront_logs" {
  bucket = aws_s3_bucket.cloudfront_logs.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "cloudfront_logs" {
  bucket = aws_s3_bucket.cloudfront_logs.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.global.arn
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "cloudfront_logs" {
  bucket = aws_s3_bucket.cloudfront_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "cloudfront_logs" {
  bucket = aws_s3_bucket.cloudfront_logs.id

  rule {
    id     = "expire-old-logs"
    status = "Enabled"

    expiration {
      days = 90
    }
  }
}

resource "aws_s3_bucket_ownership_controls" "cloudfront_logs" {
  bucket = aws_s3_bucket.cloudfront_logs.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "cloudfront_logs" {
  depends_on = [aws_s3_bucket_ownership_controls.cloudfront_logs]
  bucket     = aws_s3_bucket.cloudfront_logs.id
  acl        = "log-delivery-write"
}

# ============================================
# WAF Web ACL (Replaces: Azure Front Door WAF)
# ============================================

resource "aws_wafv2_web_acl" "global" {
  name        = "${var.project_name}-global-waf"
  description = "Global WAF Web ACL for ${var.project_name}"
  scope       = "CLOUDFRONT"

  default_action {
    allow {}
  }

  # AWS Managed Rules - Core Rule Set
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-common-rules"
      sampled_requests_enabled   = true
    }
  }

  # AWS Managed Rules - Known Bad Inputs
  rule {
    name     = "AWSManagedRulesKnownBadInputsRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-bad-inputs"
      sampled_requests_enabled   = true
    }
  }

  # AWS Managed Rules - SQL Injection
  rule {
    name     = "AWSManagedRulesSQLiRuleSet"
    priority = 3

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-sqli"
      sampled_requests_enabled   = true
    }
  }

  # Rate Limiting
  rule {
    name     = "RateLimitRule"
    priority = 4

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = 10000
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-rate-limit"
      sampled_requests_enabled   = true
    }
  }

  # Bot Control (for production)
  dynamic "rule" {
    for_each = var.environment == "prod" ? [1] : []
    content {
      name     = "AWSManagedRulesBotControlRuleSet"
      priority = 5

      override_action {
        none {}
      }

      statement {
        managed_rule_group_statement {
          name        = "AWSManagedRulesBotControlRuleSet"
          vendor_name = "AWS"

          managed_rule_group_configs {
            aws_managed_rules_bot_control_rule_set {
              inspection_level = "COMMON"
            }
          }
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = "${var.project_name}-bot-control"
        sampled_requests_enabled   = true
      }
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${var.project_name}-global-waf"
    sampled_requests_enabled   = true
  }

  tags = merge(local.common_tags, {
    Name  = "${var.project_name}-global-waf"
    Scope = "Global"
  })
}

# ============================================
# CloudFront Distribution (Replaces: Azure Front Door)
# ============================================

resource "aws_cloudfront_distribution" "global" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Global CDN for ${var.project_name}"
  default_root_object = "index.html"
  price_class         = var.cloudfront_price_class
  aliases             = var.cloudfront_aliases
  web_acl_id          = aws_wafv2_web_acl.global.arn

  # API Origin (ALB)
  origin {
    domain_name = var.api_origin_domain
    origin_id   = "api-origin"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }

    custom_header {
      name  = "X-CloudFront-Secret"
      value = random_password.cloudfront_origin_secret.result
    }
  }

  # S3 Origin for Static Assets
  origin {
    domain_name              = aws_s3_bucket.main.bucket_regional_domain_name
    origin_id                = "s3-static"
    origin_access_control_id = aws_cloudfront_origin_access_control.s3.id
  }

  # Default Cache Behavior (API)
  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "api-origin"

    forwarded_values {
      query_string = true
      headers      = ["Authorization", "Host", "Origin", "Accept", "Accept-Language"]

      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    compress               = true
  }

  # Static Assets Behavior
  ordered_cache_behavior {
    path_pattern     = "/static/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-static"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
  }

  # Health Check Behavior
  ordered_cache_behavior {
    path_pattern     = "/health*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "api-origin"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn            = var.cloudfront_certificate_arn != "" ? var.cloudfront_certificate_arn : null
    ssl_support_method             = var.cloudfront_certificate_arn != "" ? "sni-only" : null
    minimum_protocol_version       = "TLSv1.2_2021"
    cloudfront_default_certificate = var.cloudfront_certificate_arn == ""
  }

  logging_config {
    include_cookies = false
    bucket          = aws_s3_bucket.cloudfront_logs.bucket_domain_name
    prefix          = "cloudfront/${var.project_name}/"
  }

  tags = merge(local.common_tags, {
    Name  = "${var.project_name}-global-cloudfront"
    Scope = "Global"
  })
}

# CloudFront Origin Access Control for S3
resource "aws_cloudfront_origin_access_control" "s3" {
  name                              = "${var.project_name}-s3-oac"
  description                       = "OAC for S3 origin"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront Origin Secret
resource "random_password" "cloudfront_origin_secret" {
  length  = 32
  special = false
}

resource "aws_secretsmanager_secret" "cloudfront_origin_secret" {
  name        = "${var.project_name}-global/cloudfront-origin-secret"
  description = "Secret for CloudFront origin validation"
  kms_key_id  = aws_kms_key.global.arn

  tags = merge(local.common_tags, {
    Scope = "Global"
  })
}

resource "aws_secretsmanager_secret_version" "cloudfront_origin_secret" {
  secret_id     = aws_secretsmanager_secret.cloudfront_origin_secret.id
  secret_string = random_password.cloudfront_origin_secret.result
}

# ============================================
# Route 53 (Replaces: Azure Traffic Manager)
# ============================================

resource "aws_route53_zone" "global" {
  count = var.manage_dns ? 1 : 0
  name  = var.dns_zone_name

  tags = merge(local.common_tags, {
    Name  = var.dns_zone_name
    Scope = "Global"
  })
}

resource "aws_route53_health_check" "api" {
  count             = var.manage_dns ? 1 : 0
  fqdn              = var.api_origin_domain
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = 3
  request_interval  = 30

  tags = merge(local.common_tags, {
    Name  = "${var.project_name}-api-health-check"
    Scope = "Global"
  })
}

resource "aws_route53_record" "api" {
  count   = var.manage_dns ? 1 : 0
  zone_id = aws_route53_zone.global[0].zone_id
  name    = "api.${var.dns_zone_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.global.domain_name
    zone_id                = aws_cloudfront_distribution.global.hosted_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "web" {
  count   = var.manage_dns ? 1 : 0
  zone_id = aws_route53_zone.global[0].zone_id
  name    = "www.${var.dns_zone_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.global.domain_name
    zone_id                = aws_cloudfront_distribution.global.hosted_zone_id
    evaluate_target_health = true
  }
}

# ============================================
# Global SNS Topic for Alerts
# ============================================

resource "aws_sns_topic" "global_alerts" {
  name              = "${var.project_name}-global-alerts"
  kms_master_key_id = aws_kms_key.global.id

  tags = merge(local.common_tags, {
    Name  = "${var.project_name}-global-alerts"
    Scope = "Global"
  })
}

resource "aws_sns_topic_subscription" "global_email" {
  count     = var.global_alert_email_address != "" ? 1 : 0
  topic_arn = aws_sns_topic.global_alerts.arn
  protocol  = "email"
  endpoint  = var.global_alert_email_address
}

# ============================================
# CloudWatch Alarms for Global Resources
# ============================================

# CloudFront Error Rate Alarm
resource "aws_cloudwatch_metric_alarm" "cloudfront_error_rate" {
  alarm_name          = "${var.project_name}-cloudfront-5xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "5xxErrorRate"
  namespace           = "AWS/CloudFront"
  period              = 300
  statistic           = "Average"
  threshold           = 5
  alarm_description   = "CloudFront 5xx error rate is high"
  alarm_actions       = [aws_sns_topic.global_alerts.arn]

  dimensions = {
    DistributionId = aws_cloudfront_distribution.global.id
    Region         = "Global"
  }

  tags = merge(local.common_tags, {
    Scope = "Global"
  })
}

# CloudFront 4xx Error Rate Alarm
resource "aws_cloudwatch_metric_alarm" "cloudfront_4xx_error_rate" {
  alarm_name          = "${var.project_name}-cloudfront-4xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "4xxErrorRate"
  namespace           = "AWS/CloudFront"
  period              = 300
  statistic           = "Average"
  threshold           = 10
  alarm_description   = "CloudFront 4xx error rate is high"
  alarm_actions       = [aws_sns_topic.global_alerts.arn]

  dimensions = {
    DistributionId = aws_cloudfront_distribution.global.id
    Region         = "Global"
  }

  tags = merge(local.common_tags, {
    Scope = "Global"
  })
}

# WAF Blocked Requests Alarm
resource "aws_cloudwatch_metric_alarm" "waf_blocked_requests" {
  alarm_name          = "${var.project_name}-waf-blocked-requests"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "BlockedRequests"
  namespace           = "AWS/WAFV2"
  period              = 300
  statistic           = "Sum"
  threshold           = 1000
  alarm_description   = "WAF blocked requests is high - potential attack"
  alarm_actions       = [aws_sns_topic.global_alerts.arn]

  dimensions = {
    WebACL = aws_wafv2_web_acl.global.name
    Rule   = "ALL"
  }

  tags = merge(local.common_tags, {
    Scope = "Global"
  })
}

# ============================================
# S3 Bucket Policy for CloudFront
# ============================================

resource "aws_s3_bucket_policy" "main_cloudfront" {
  bucket = aws_s3_bucket.main.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.main.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.global.arn
          }
        }
      }
    ]
  })
}

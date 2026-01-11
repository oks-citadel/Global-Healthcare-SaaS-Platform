# ============================================
# AWS WAFv2 Module
# ============================================
# HIPAA Compliance: Web Application Firewall for healthcare applications
# Features: SQL injection protection, XSS protection, rate limiting, geo-blocking
# ============================================

locals {
  name = "${var.name}-${var.environment}"

  tags = merge(var.tags, {
    Module      = "waf"
    Compliance  = "HIPAA"
    Environment = var.environment
  })

  # Default HIPAA-compliant countries (can be overridden)
  default_allowed_countries = [
    "US", # United States
    "CA", # Canada
    "GB", # United Kingdom
    "DE", # Germany
    "FR", # France
    "AU", # Australia
    "NZ", # New Zealand
    "IE", # Ireland
    "NL", # Netherlands
    "BE", # Belgium
    "CH", # Switzerland
    "AT", # Austria
    "ZA"  # South Africa
  ]

  allowed_countries = length(var.allowed_countries) > 0 ? var.allowed_countries : local.default_allowed_countries
}

# ============================================
# WAFv2 Web ACL
# ============================================

resource "aws_wafv2_web_acl" "main" {
  name        = local.name
  description = "HIPAA-compliant WAF for ${local.name} healthcare platform"
  scope       = var.scope

  default_action {
    allow {}
  }

  # ============================================
  # Rule 1: AWS Managed Rules - Common Rule Set
  # ============================================
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

        # Exclude rules that might cause false positives
        dynamic "rule_action_override" {
          for_each = var.common_ruleset_excluded_rules
          content {
            name = rule_action_override.value
            action_to_use {
              count {}
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.name}-common-rules"
      sampled_requests_enabled   = true
    }
  }

  # ============================================
  # Rule 2: AWS Managed Rules - SQL Injection
  # ============================================
  rule {
    name     = "AWSManagedRulesSQLiRuleSet"
    priority = 2

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
      metric_name                = "${local.name}-sqli-rules"
      sampled_requests_enabled   = true
    }
  }

  # ============================================
  # Rule 3: AWS Managed Rules - Known Bad Inputs
  # ============================================
  rule {
    name     = "AWSManagedRulesKnownBadInputsRuleSet"
    priority = 3

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
      metric_name                = "${local.name}-bad-inputs-rules"
      sampled_requests_enabled   = true
    }
  }

  # ============================================
  # Rule 4: AWS Managed Rules - Linux OS
  # ============================================
  rule {
    name     = "AWSManagedRulesLinuxRuleSet"
    priority = 4

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesLinuxRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.name}-linux-rules"
      sampled_requests_enabled   = true
    }
  }

  # ============================================
  # Rule 5: AWS Managed Rules - Amazon IP Reputation
  # ============================================
  rule {
    name     = "AWSManagedRulesAmazonIpReputationList"
    priority = 5

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesAmazonIpReputationList"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.name}-ip-reputation-rules"
      sampled_requests_enabled   = true
    }
  }

  # ============================================
  # Rule 6: AWS Managed Rules - Anonymous IP List
  # ============================================
  rule {
    name     = "AWSManagedRulesAnonymousIpList"
    priority = 6

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesAnonymousIpList"
        vendor_name = "AWS"

        # Block anonymous/tor traffic for HIPAA compliance
        dynamic "rule_action_override" {
          for_each = var.block_anonymous_ip ? [] : ["AnonymousIPList", "HostingProviderIPList"]
          content {
            name = rule_action_override.value
            action_to_use {
              count {}
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.name}-anonymous-ip-rules"
      sampled_requests_enabled   = true
    }
  }

  # ============================================
  # Rule 7: Rate Limiting (DDoS Protection)
  # ============================================
  rule {
    name     = "RateLimitRule"
    priority = 7

    action {
      block {
        custom_response {
          response_code            = 429
          custom_response_body_key = "rate-limit-response"
        }
      }
    }

    statement {
      rate_based_statement {
        limit              = var.rate_limit
        aggregate_key_type = "IP"

        # Optional: Scope to specific URIs
        dynamic "scope_down_statement" {
          for_each = length(var.rate_limit_uri_paths) > 0 ? [1] : []
          content {
            or_statement {
              dynamic "statement" {
                for_each = var.rate_limit_uri_paths
                content {
                  byte_match_statement {
                    positional_constraint = "STARTS_WITH"
                    search_string         = statement.value
                    field_to_match {
                      uri_path {}
                    }
                    text_transformation {
                      priority = 0
                      type     = "LOWERCASE"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.name}-rate-limit"
      sampled_requests_enabled   = true
    }
  }

  # ============================================
  # Rule 8: Geo-Blocking (HIPAA Data Residency)
  # ============================================
  dynamic "rule" {
    for_each = var.enable_geo_blocking ? [1] : []
    content {
      name     = "GeoBlockRule"
      priority = 8

      action {
        block {
          custom_response {
            response_code            = 403
            custom_response_body_key = "geo-block-response"
          }
        }
      }

      statement {
        not_statement {
          statement {
            geo_match_statement {
              country_codes = local.allowed_countries
            }
          }
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = "${local.name}-geo-block"
        sampled_requests_enabled   = true
      }
    }
  }

  # ============================================
  # Rule 9: XSS Protection
  # ============================================
  rule {
    name     = "XSSProtection"
    priority = 9

    action {
      block {}
    }

    statement {
      xss_match_statement {
        field_to_match {
          body {
            oversize_handling = "CONTINUE"
          }
        }
        text_transformation {
          priority = 0
          type     = "HTML_ENTITY_DECODE"
        }
        text_transformation {
          priority = 1
          type     = "URL_DECODE"
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.name}-xss-body"
      sampled_requests_enabled   = true
    }
  }

  # ============================================
  # Rule 10: Block Known Bot User Agents
  # ============================================
  rule {
    name     = "BlockBadBots"
    priority = 10

    action {
      block {}
    }

    statement {
      or_statement {
        dynamic "statement" {
          for_each = var.blocked_user_agents
          content {
            byte_match_statement {
              positional_constraint = "CONTAINS"
              search_string         = statement.value
              field_to_match {
                single_header {
                  name = "user-agent"
                }
              }
              text_transformation {
                priority = 0
                type     = "LOWERCASE"
              }
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.name}-bad-bots"
      sampled_requests_enabled   = true
    }
  }

  # ============================================
  # Rule 11: IP Allowlist (Healthcare Partners)
  # ============================================
  dynamic "rule" {
    for_each = length(var.ip_allowlist) > 0 ? [1] : []
    content {
      name     = "IPAllowlist"
      priority = 0 # Highest priority

      action {
        allow {}
      }

      statement {
        ip_set_reference_statement {
          arn = aws_wafv2_ip_set.allowlist[0].arn
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = "${local.name}-ip-allowlist"
        sampled_requests_enabled   = true
      }
    }
  }

  # ============================================
  # Rule 12: IP Blocklist
  # ============================================
  dynamic "rule" {
    for_each = length(var.ip_blocklist) > 0 ? [1] : []
    content {
      name     = "IPBlocklist"
      priority = 11

      action {
        block {}
      }

      statement {
        ip_set_reference_statement {
          arn = aws_wafv2_ip_set.blocklist[0].arn
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = "${local.name}-ip-blocklist"
        sampled_requests_enabled   = true
      }
    }
  }

  # ============================================
  # Custom Rules
  # ============================================
  dynamic "rule" {
    for_each = var.custom_rules
    content {
      name     = rule.value.name
      priority = rule.value.priority

      dynamic "action" {
        for_each = rule.value.action == "block" ? [1] : []
        content {
          block {}
        }
      }

      dynamic "action" {
        for_each = rule.value.action == "allow" ? [1] : []
        content {
          allow {}
        }
      }

      dynamic "action" {
        for_each = rule.value.action == "count" ? [1] : []
        content {
          count {}
        }
      }

      statement {
        byte_match_statement {
          positional_constraint = rule.value.positional_constraint
          search_string         = rule.value.search_string
          field_to_match {
            dynamic "uri_path" {
              for_each = rule.value.field_to_match == "uri_path" ? [1] : []
              content {}
            }
            dynamic "query_string" {
              for_each = rule.value.field_to_match == "query_string" ? [1] : []
              content {}
            }
            dynamic "single_header" {
              for_each = rule.value.field_to_match == "header" ? [1] : []
              content {
                name = rule.value.header_name
              }
            }
          }
          text_transformation {
            priority = 0
            type     = "LOWERCASE"
          }
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = "${local.name}-${rule.value.name}"
        sampled_requests_enabled   = true
      }
    }
  }

  # ============================================
  # Custom Response Bodies
  # ============================================
  custom_response_body {
    key = "rate-limit-response"
    content = jsonencode({
      error   = "Too Many Requests"
      message = "Rate limit exceeded. Please try again later."
      code    = 429
    })
    content_type = "APPLICATION_JSON"
  }

  custom_response_body {
    key = "geo-block-response"
    content = jsonencode({
      error   = "Access Denied"
      message = "This service is not available in your region due to regulatory requirements."
      code    = 403
    })
    content_type = "APPLICATION_JSON"
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = local.name
    sampled_requests_enabled   = true
  }

  tags = local.tags
}

# ============================================
# IP Sets
# ============================================

resource "aws_wafv2_ip_set" "allowlist" {
  count = length(var.ip_allowlist) > 0 ? 1 : 0

  name               = "${local.name}-allowlist"
  description        = "Allowed IP addresses for healthcare partners"
  scope              = var.scope
  ip_address_version = "IPV4"
  addresses          = var.ip_allowlist

  tags = merge(local.tags, {
    Name = "${local.name}-allowlist"
  })
}

resource "aws_wafv2_ip_set" "blocklist" {
  count = length(var.ip_blocklist) > 0 ? 1 : 0

  name               = "${local.name}-blocklist"
  description        = "Blocked IP addresses"
  scope              = var.scope
  ip_address_version = "IPV4"
  addresses          = var.ip_blocklist

  tags = merge(local.tags, {
    Name = "${local.name}-blocklist"
  })
}

# ============================================
# WAF Logging Configuration
# ============================================

resource "aws_wafv2_web_acl_logging_configuration" "main" {
  count = var.enable_logging ? 1 : 0

  log_destination_configs = [var.log_destination_arn]
  resource_arn            = aws_wafv2_web_acl.main.arn

  # Redact sensitive headers for HIPAA compliance
  dynamic "redacted_fields" {
    for_each = var.redacted_fields
    content {
      dynamic "single_header" {
        for_each = redacted_fields.value.type == "single_header" ? [1] : []
        content {
          name = redacted_fields.value.name
        }
      }
    }
  }

  # Log filter - reduce costs by filtering specific rules
  dynamic "logging_filter" {
    for_each = var.logging_filter_enabled ? [1] : []
    content {
      default_behavior = "DROP"

      filter {
        behavior    = "KEEP"
        requirement = "MEETS_ANY"

        condition {
          action_condition {
            action = "BLOCK"
          }
        }

        condition {
          action_condition {
            action = "COUNT"
          }
        }
      }
    }
  }
}

# ============================================
# CloudWatch Alarms for WAF
# ============================================

resource "aws_cloudwatch_metric_alarm" "blocked_requests" {
  count = var.enable_alarms ? 1 : 0

  alarm_name          = "${local.name}-blocked-requests-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "BlockedRequests"
  namespace           = "AWS/WAFV2"
  period              = 300
  statistic           = "Sum"
  threshold           = var.blocked_requests_threshold
  alarm_description   = "High number of blocked requests detected"

  dimensions = {
    WebACL = local.name
    Rule   = "ALL"
    Region = var.scope == "REGIONAL" ? data.aws_region.current.name : "Global"
  }

  alarm_actions = var.alarm_actions
  ok_actions    = var.alarm_actions

  tags = local.tags
}

resource "aws_cloudwatch_metric_alarm" "rate_limit_exceeded" {
  count = var.enable_alarms ? 1 : 0

  alarm_name          = "${local.name}-rate-limit-exceeded"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "BlockedRequests"
  namespace           = "AWS/WAFV2"
  period              = 60
  statistic           = "Sum"
  threshold           = var.rate_limit_alarm_threshold
  alarm_description   = "Rate limiting is actively blocking requests"

  dimensions = {
    WebACL = local.name
    Rule   = "RateLimitRule"
    Region = var.scope == "REGIONAL" ? data.aws_region.current.name : "Global"
  }

  alarm_actions = var.alarm_actions

  tags = local.tags
}

# ============================================
# Data Sources
# ============================================

data "aws_region" "current" {}

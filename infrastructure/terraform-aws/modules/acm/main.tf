# ============================================
# AWS ACM (Certificate Manager) Module
# ============================================
# HIPAA Compliance: SSL/TLS certificates for healthcare applications
# Features: DNS validation, wildcard support, auto-renewal
# ============================================

locals {
  name = "${var.project_name}-${var.environment}"

  tags = merge(var.tags, {
    Module      = "acm"
    Compliance  = "HIPAA"
    Environment = var.environment
  })

  # Combine domain name with SANs for validation
  all_domains = concat([var.domain_name], var.subject_alternative_names)

  # Create a map for domain validation options
  domain_validation_options = {
    for dvo in aws_acm_certificate.main.domain_validation_options :
    dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }
}

# ============================================
# ACM Certificate
# ============================================

resource "aws_acm_certificate" "main" {
  domain_name               = var.domain_name
  subject_alternative_names = var.subject_alternative_names
  validation_method         = var.validation_method

  # Key algorithm - RSA_2048 is standard, but ECDSA provides better performance
  key_algorithm = var.key_algorithm

  options {
    certificate_transparency_logging_preference = var.enable_certificate_transparency ? "ENABLED" : "DISABLED"
  }

  lifecycle {
    create_before_destroy = true
  }

  tags = merge(local.tags, {
    Name       = "${local.name}-certificate"
    DomainName = var.domain_name
  })
}

# ============================================
# DNS Validation Records (Route53)
# ============================================

resource "aws_route53_record" "validation" {
  for_each = var.validation_method == "DNS" && var.create_route53_records ? {
    for dvo in aws_acm_certificate.main.domain_validation_options :
    dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  } : {}

  zone_id         = var.route53_zone_id
  name            = each.value.name
  type            = each.value.type
  ttl             = 60
  records         = [each.value.record]
  allow_overwrite = true
}

# ============================================
# Certificate Validation
# ============================================

resource "aws_acm_certificate_validation" "main" {
  count = var.wait_for_validation ? 1 : 0

  certificate_arn = aws_acm_certificate.main.arn

  validation_record_fqdns = var.validation_method == "DNS" && var.create_route53_records ? [
    for record in aws_route53_record.validation :
    record.fqdn
  ] : null

  timeouts {
    create = var.validation_timeout
  }
}

# ============================================
# Wildcard Certificate (Optional)
# ============================================

resource "aws_acm_certificate" "wildcard" {
  count = var.create_wildcard_certificate ? 1 : 0

  domain_name               = "*.${var.domain_name}"
  subject_alternative_names = var.wildcard_additional_sans
  validation_method         = var.validation_method

  key_algorithm = var.key_algorithm

  options {
    certificate_transparency_logging_preference = var.enable_certificate_transparency ? "ENABLED" : "DISABLED"
  }

  lifecycle {
    create_before_destroy = true
  }

  tags = merge(local.tags, {
    Name       = "${local.name}-wildcard-certificate"
    DomainName = "*.${var.domain_name}"
    Type       = "wildcard"
  })
}

resource "aws_route53_record" "wildcard_validation" {
  for_each = var.create_wildcard_certificate && var.validation_method == "DNS" && var.create_route53_records ? {
    for dvo in aws_acm_certificate.wildcard[0].domain_validation_options :
    dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  } : {}

  zone_id         = var.route53_zone_id
  name            = each.value.name
  type            = each.value.type
  ttl             = 60
  records         = [each.value.record]
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "wildcard" {
  count = var.create_wildcard_certificate && var.wait_for_validation ? 1 : 0

  certificate_arn = aws_acm_certificate.wildcard[0].arn

  validation_record_fqdns = var.validation_method == "DNS" && var.create_route53_records ? [
    for record in aws_route53_record.wildcard_validation :
    record.fqdn
  ] : null

  timeouts {
    create = var.validation_timeout
  }
}

# ============================================
# CloudWatch Alarm for Certificate Expiry
# ============================================

resource "aws_cloudwatch_metric_alarm" "certificate_expiry" {
  count = var.enable_expiry_alarm ? 1 : 0

  alarm_name          = "${local.name}-certificate-expiry"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 1
  metric_name         = "DaysToExpiry"
  namespace           = "AWS/CertificateManager"
  period              = 86400 # 24 hours
  statistic           = "Minimum"
  threshold           = var.expiry_alarm_days
  alarm_description   = "Certificate ${var.domain_name} will expire in less than ${var.expiry_alarm_days} days"
  treat_missing_data  = "notBreaching"

  dimensions = {
    CertificateArn = aws_acm_certificate.main.arn
  }

  alarm_actions = var.alarm_actions
  ok_actions    = var.alarm_actions

  tags = local.tags
}

resource "aws_cloudwatch_metric_alarm" "wildcard_certificate_expiry" {
  count = var.create_wildcard_certificate && var.enable_expiry_alarm ? 1 : 0

  alarm_name          = "${local.name}-wildcard-certificate-expiry"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 1
  metric_name         = "DaysToExpiry"
  namespace           = "AWS/CertificateManager"
  period              = 86400
  statistic           = "Minimum"
  threshold           = var.expiry_alarm_days
  alarm_description   = "Wildcard certificate *.${var.domain_name} will expire in less than ${var.expiry_alarm_days} days"
  treat_missing_data  = "notBreaching"

  dimensions = {
    CertificateArn = aws_acm_certificate.wildcard[0].arn
  }

  alarm_actions = var.alarm_actions
  ok_actions    = var.alarm_actions

  tags = local.tags
}

# ============================================
# Data Sources
# ============================================

data "aws_region" "current" {}

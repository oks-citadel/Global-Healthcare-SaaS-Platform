# ============================================
# AWS Route53 DNS Module
# ============================================
# HIPAA Compliance: DNS infrastructure for healthcare applications
# Features: Hosted zones, health checks, failover routing, geo-routing
# ============================================

locals {
  name = "${var.project_name}-${var.environment}"

  tags = merge(var.tags, {
    Module      = "route53"
    Compliance  = "HIPAA"
    Environment = var.environment
  })

  # Flatten records for easier iteration
  a_records = {
    for record in var.records :
    record.name => record
    if record.type == "A"
  }

  cname_records = {
    for record in var.records :
    record.name => record
    if record.type == "CNAME"
  }

  alias_records = {
    for record in var.records :
    record.name => record
    if record.type == "ALIAS"
  }
}

# ============================================
# Route53 Hosted Zone
# ============================================

resource "aws_route53_zone" "main" {
  name    = var.domain_name
  comment = "Managed by Terraform - ${local.name} healthcare platform"

  tags = merge(local.tags, {
    Name = "${local.name}-zone"
  })
}

# ============================================
# Route53 Health Checks
# ============================================

resource "aws_route53_health_check" "endpoints" {
  for_each = var.health_check_configs

  fqdn              = each.value.fqdn
  port              = each.value.port
  type              = each.value.type
  resource_path     = each.value.resource_path
  failure_threshold = each.value.failure_threshold
  request_interval  = each.value.request_interval

  # Enable SNI for HTTPS health checks
  enable_sni = each.value.type == "HTTPS" ? true : false

  # Regions to check from (for redundancy)
  regions = each.value.regions

  # CloudWatch alarm integration
  cloudwatch_alarm_name   = each.value.cloudwatch_alarm_name
  cloudwatch_alarm_region = each.value.cloudwatch_alarm_region
  insufficient_data_health_status = each.value.insufficient_data_health_status

  tags = merge(local.tags, {
    Name        = "${local.name}-health-check-${each.key}"
    Endpoint    = each.value.fqdn
    ServiceType = each.value.service_type
  })
}

# ============================================
# A Records - Standard
# ============================================

resource "aws_route53_record" "a_records" {
  for_each = {
    for record in var.records :
    record.name => record
    if record.type == "A" && !record.failover_enabled && record.alias_target == null
  }

  zone_id = aws_route53_zone.main.zone_id
  name    = each.value.name == "" ? var.domain_name : "${each.value.name}.${var.domain_name}"
  type    = "A"
  ttl     = each.value.ttl
  records = each.value.values

  # Weighted routing policy
  dynamic "weighted_routing_policy" {
    for_each = each.value.weight != null ? [1] : []
    content {
      weight = each.value.weight
    }
  }

  # Geolocation routing policy
  dynamic "geolocation_routing_policy" {
    for_each = each.value.geolocation != null ? [each.value.geolocation] : []
    content {
      continent   = geolocation_routing_policy.value.continent
      country     = geolocation_routing_policy.value.country
      subdivision = geolocation_routing_policy.value.subdivision
    }
  }

  # Latency routing policy
  dynamic "latency_routing_policy" {
    for_each = each.value.latency_region != null ? [1] : []
    content {
      region = each.value.latency_region
    }
  }

  set_identifier = each.value.set_identifier

  health_check_id = each.value.health_check_name != null ? aws_route53_health_check.endpoints[each.value.health_check_name].id : null
}

# ============================================
# A Records - Alias (for ALB, CloudFront, etc.)
# ============================================

resource "aws_route53_record" "a_alias_records" {
  for_each = {
    for record in var.records :
    record.name => record
    if record.type == "A" && record.alias_target != null && !record.failover_enabled
  }

  zone_id = aws_route53_zone.main.zone_id
  name    = each.value.name == "" ? var.domain_name : "${each.value.name}.${var.domain_name}"
  type    = "A"

  alias {
    name                   = each.value.alias_target.dns_name
    zone_id                = each.value.alias_target.zone_id
    evaluate_target_health = each.value.alias_target.evaluate_target_health
  }

  # Weighted routing policy
  dynamic "weighted_routing_policy" {
    for_each = each.value.weight != null ? [1] : []
    content {
      weight = each.value.weight
    }
  }

  # Geolocation routing policy
  dynamic "geolocation_routing_policy" {
    for_each = each.value.geolocation != null ? [each.value.geolocation] : []
    content {
      continent   = geolocation_routing_policy.value.continent
      country     = geolocation_routing_policy.value.country
      subdivision = geolocation_routing_policy.value.subdivision
    }
  }

  set_identifier = each.value.set_identifier
}

# ============================================
# A Records - Failover Primary
# ============================================

resource "aws_route53_record" "a_failover_primary" {
  for_each = {
    for record in var.records :
    record.name => record
    if record.type == "A" && record.failover_enabled && record.failover_type == "PRIMARY"
  }

  zone_id = aws_route53_zone.main.zone_id
  name    = each.value.name == "" ? var.domain_name : "${each.value.name}.${var.domain_name}"
  type    = "A"

  dynamic "alias" {
    for_each = each.value.alias_target != null ? [each.value.alias_target] : []
    content {
      name                   = alias.value.dns_name
      zone_id                = alias.value.zone_id
      evaluate_target_health = alias.value.evaluate_target_health
    }
  }

  ttl     = each.value.alias_target == null ? each.value.ttl : null
  records = each.value.alias_target == null ? each.value.values : null

  failover_routing_policy {
    type = "PRIMARY"
  }

  set_identifier  = "${each.value.name}-primary"
  health_check_id = each.value.health_check_name != null ? aws_route53_health_check.endpoints[each.value.health_check_name].id : null
}

# ============================================
# A Records - Failover Secondary
# ============================================

resource "aws_route53_record" "a_failover_secondary" {
  for_each = {
    for record in var.records :
    record.name => record
    if record.type == "A" && record.failover_enabled && record.failover_type == "SECONDARY"
  }

  zone_id = aws_route53_zone.main.zone_id
  name    = each.value.name == "" ? var.domain_name : "${each.value.name}.${var.domain_name}"
  type    = "A"

  dynamic "alias" {
    for_each = each.value.alias_target != null ? [each.value.alias_target] : []
    content {
      name                   = alias.value.dns_name
      zone_id                = alias.value.zone_id
      evaluate_target_health = alias.value.evaluate_target_health
    }
  }

  ttl     = each.value.alias_target == null ? each.value.ttl : null
  records = each.value.alias_target == null ? each.value.values : null

  failover_routing_policy {
    type = "SECONDARY"
  }

  set_identifier = "${each.value.name}-secondary"
}

# ============================================
# CNAME Records
# ============================================

resource "aws_route53_record" "cname_records" {
  for_each = {
    for record in var.records :
    record.name => record
    if record.type == "CNAME"
  }

  zone_id = aws_route53_zone.main.zone_id
  name    = "${each.value.name}.${var.domain_name}"
  type    = "CNAME"
  ttl     = each.value.ttl
  records = each.value.values

  # Weighted routing policy
  dynamic "weighted_routing_policy" {
    for_each = each.value.weight != null ? [1] : []
    content {
      weight = each.value.weight
    }
  }

  set_identifier = each.value.set_identifier

  health_check_id = each.value.health_check_name != null ? aws_route53_health_check.endpoints[each.value.health_check_name].id : null
}

# ============================================
# MX Records (for email)
# ============================================

resource "aws_route53_record" "mx_records" {
  for_each = {
    for record in var.records :
    record.name => record
    if record.type == "MX"
  }

  zone_id = aws_route53_zone.main.zone_id
  name    = each.value.name == "" ? var.domain_name : "${each.value.name}.${var.domain_name}"
  type    = "MX"
  ttl     = each.value.ttl
  records = each.value.values
}

# ============================================
# TXT Records (for SPF, DKIM, verification)
# ============================================

resource "aws_route53_record" "txt_records" {
  for_each = {
    for record in var.records :
    record.name => record
    if record.type == "TXT"
  }

  zone_id = aws_route53_zone.main.zone_id
  name    = each.value.name == "" ? var.domain_name : "${each.value.name}.${var.domain_name}"
  type    = "TXT"
  ttl     = each.value.ttl
  records = each.value.values
}

# ============================================
# CAA Records (Certificate Authority Authorization)
# ============================================

resource "aws_route53_record" "caa_records" {
  count = var.enable_caa_records ? 1 : 0

  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "CAA"
  ttl     = 3600

  records = [
    "0 issue \"amazon.com\"",
    "0 issue \"amazontrust.com\"",
    "0 issue \"awstrust.com\"",
    "0 issuewild \"amazon.com\"",
    "0 iodef \"mailto:${var.caa_email}\""
  ]
}

# ============================================
# Route53 Query Logging (HIPAA Audit Trail)
# ============================================

resource "aws_route53_query_log" "main" {
  count = var.enable_query_logging ? 1 : 0

  depends_on = [aws_cloudwatch_log_resource_policy.route53]

  cloudwatch_log_group_arn = aws_cloudwatch_log_group.route53_query_logs[0].arn
  zone_id                  = aws_route53_zone.main.zone_id
}

resource "aws_cloudwatch_log_group" "route53_query_logs" {
  count = var.enable_query_logging ? 1 : 0

  name              = "/aws/route53/${var.domain_name}"
  retention_in_days = var.query_log_retention_days

  # KMS encryption for HIPAA compliance
  kms_key_id = var.kms_key_arn

  tags = merge(local.tags, {
    Name       = "${local.name}-route53-query-logs"
    Compliance = "HIPAA-Audit"
  })
}

resource "aws_cloudwatch_log_resource_policy" "route53" {
  count = var.enable_query_logging ? 1 : 0

  policy_name = "${local.name}-route53-query-logging-policy"

  policy_document = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Route53QueryLogsToCloudWatch"
        Effect = "Allow"
        Principal = {
          Service = "route53.amazonaws.com"
        }
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:log-group:/aws/route53/*"
      }
    ]
  })
}

# ============================================
# DNSSEC Signing (Optional - Enhanced Security)
# ============================================

resource "aws_route53_key_signing_key" "main" {
  count = var.enable_dnssec ? 1 : 0

  hosted_zone_id             = aws_route53_zone.main.zone_id
  key_management_service_arn = var.dnssec_kms_key_arn
  name                       = "${local.name}-dnssec-ksk"
}

resource "aws_route53_hosted_zone_dnssec" "main" {
  count = var.enable_dnssec ? 1 : 0

  depends_on = [aws_route53_key_signing_key.main]
  hosted_zone_id = aws_route53_zone.main.zone_id
}

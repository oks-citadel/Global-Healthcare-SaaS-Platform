# ============================================
# AWS Route53 Module - Outputs
# ============================================

output "zone_id" {
  description = "The hosted zone ID"
  value       = aws_route53_zone.main.zone_id
}

output "zone_arn" {
  description = "The hosted zone ARN"
  value       = aws_route53_zone.main.arn
}

output "nameservers" {
  description = "List of nameservers for the hosted zone"
  value       = aws_route53_zone.main.name_servers
}

output "domain_name" {
  description = "The domain name of the hosted zone"
  value       = aws_route53_zone.main.name
}

output "record_fqdns" {
  description = "Map of record names to their FQDNs"
  value = merge(
    {
      for name, record in aws_route53_record.a_records :
      name => record.fqdn
    },
    {
      for name, record in aws_route53_record.a_alias_records :
      name => record.fqdn
    },
    {
      for name, record in aws_route53_record.cname_records :
      name => record.fqdn
    },
    {
      for name, record in aws_route53_record.a_failover_primary :
      "${name}-primary" => record.fqdn
    },
    {
      for name, record in aws_route53_record.a_failover_secondary :
      "${name}-secondary" => record.fqdn
    }
  )
}

output "health_check_ids" {
  description = "Map of health check names to their IDs"
  value = {
    for name, hc in aws_route53_health_check.endpoints :
    name => hc.id
  }
}

output "health_check_arns" {
  description = "Map of health check names to their ARNs"
  value = {
    for name, hc in aws_route53_health_check.endpoints :
    name => hc.arn
  }
}

output "query_log_group_arn" {
  description = "ARN of the CloudWatch log group for query logging"
  value       = var.enable_query_logging ? aws_cloudwatch_log_group.route53_query_logs[0].arn : null
}

output "dnssec_key_signing_key_id" {
  description = "ID of the DNSSEC key signing key"
  value       = var.enable_dnssec ? aws_route53_key_signing_key.main[0].id : null
}

output "primary_failover_records" {
  description = "Map of primary failover record names to FQDNs"
  value = {
    for name, record in aws_route53_record.a_failover_primary :
    name => {
      fqdn = record.fqdn
      type = record.type
    }
  }
}

output "secondary_failover_records" {
  description = "Map of secondary failover record names to FQDNs"
  value = {
    for name, record in aws_route53_record.a_failover_secondary :
    name => {
      fqdn = record.fqdn
      type = record.type
    }
  }
}

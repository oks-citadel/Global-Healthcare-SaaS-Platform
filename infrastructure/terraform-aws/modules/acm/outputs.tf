# ============================================
# AWS ACM Module - Outputs
# ============================================

output "certificate_arn" {
  description = "ARN of the ACM certificate"
  value       = aws_acm_certificate.main.arn
}

output "certificate_id" {
  description = "ID of the ACM certificate"
  value       = aws_acm_certificate.main.id
}

output "certificate_domain_name" {
  description = "Domain name of the ACM certificate"
  value       = aws_acm_certificate.main.domain_name
}

output "certificate_status" {
  description = "Status of the ACM certificate"
  value       = aws_acm_certificate.main.status
}

output "domain_validation_options" {
  description = "Domain validation options for the certificate"
  value       = local.domain_validation_options
}

output "validation_record_fqdns" {
  description = "FQDNs of the DNS validation records"
  value = var.validation_method == "DNS" && var.create_route53_records ? [
    for record in aws_route53_record.validation :
    record.fqdn
  ] : []
}

output "certificate_validated" {
  description = "Whether the certificate has been validated"
  value       = var.wait_for_validation ? aws_acm_certificate_validation.main[0].id != null : null
}

output "wildcard_certificate_arn" {
  description = "ARN of the wildcard ACM certificate"
  value       = var.create_wildcard_certificate ? aws_acm_certificate.wildcard[0].arn : null
}

output "wildcard_certificate_id" {
  description = "ID of the wildcard ACM certificate"
  value       = var.create_wildcard_certificate ? aws_acm_certificate.wildcard[0].id : null
}

output "wildcard_certificate_domain_name" {
  description = "Domain name of the wildcard ACM certificate"
  value       = var.create_wildcard_certificate ? aws_acm_certificate.wildcard[0].domain_name : null
}

output "wildcard_certificate_status" {
  description = "Status of the wildcard ACM certificate"
  value       = var.create_wildcard_certificate ? aws_acm_certificate.wildcard[0].status : null
}

output "wildcard_domain_validation_options" {
  description = "Domain validation options for the wildcard certificate"
  value = var.create_wildcard_certificate ? {
    for dvo in aws_acm_certificate.wildcard[0].domain_validation_options :
    dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  } : {}
}

output "certificate_expiry_alarm_arn" {
  description = "ARN of the certificate expiry CloudWatch alarm"
  value       = var.enable_expiry_alarm ? aws_cloudwatch_metric_alarm.certificate_expiry[0].arn : null
}

output "wildcard_certificate_expiry_alarm_arn" {
  description = "ARN of the wildcard certificate expiry CloudWatch alarm"
  value       = var.create_wildcard_certificate && var.enable_expiry_alarm ? aws_cloudwatch_metric_alarm.wildcard_certificate_expiry[0].arn : null
}

output "all_certificate_arns" {
  description = "List of all certificate ARNs (main and wildcard)"
  value = compact([
    aws_acm_certificate.main.arn,
    var.create_wildcard_certificate ? aws_acm_certificate.wildcard[0].arn : null
  ])
}

output "region" {
  description = "AWS region where certificates are created"
  value       = data.aws_region.current.name
}

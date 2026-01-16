# ============================================
# AWS WAFv2 Module - Outputs
# ============================================

output "web_acl_arn" {
  description = "ARN of the WAF Web ACL"
  value       = aws_wafv2_web_acl.main.arn
}

output "web_acl_id" {
  description = "ID of the WAF Web ACL"
  value       = aws_wafv2_web_acl.main.id
}

output "web_acl_name" {
  description = "Name of the WAF Web ACL"
  value       = aws_wafv2_web_acl.main.name
}

output "web_acl_capacity" {
  description = "Web ACL capacity units used"
  value       = aws_wafv2_web_acl.main.capacity
}

output "ip_allowlist_arn" {
  description = "ARN of the IP allowlist set"
  value       = length(var.ip_allowlist) > 0 ? aws_wafv2_ip_set.allowlist[0].arn : null
}

output "ip_allowlist_id" {
  description = "ID of the IP allowlist set"
  value       = length(var.ip_allowlist) > 0 ? aws_wafv2_ip_set.allowlist[0].id : null
}

output "ip_blocklist_arn" {
  description = "ARN of the IP blocklist set"
  value       = length(var.ip_blocklist) > 0 ? aws_wafv2_ip_set.blocklist[0].arn : null
}

output "ip_blocklist_id" {
  description = "ID of the IP blocklist set"
  value       = length(var.ip_blocklist) > 0 ? aws_wafv2_ip_set.blocklist[0].id : null
}

output "logging_configuration_id" {
  description = "ID of the WAF logging configuration"
  value       = var.enable_logging ? aws_wafv2_web_acl_logging_configuration.main[0].id : null
}

output "blocked_requests_alarm_arn" {
  description = "ARN of the blocked requests CloudWatch alarm"
  value       = var.enable_alarms ? aws_cloudwatch_metric_alarm.blocked_requests[0].arn : null
}

output "rate_limit_alarm_arn" {
  description = "ARN of the rate limit CloudWatch alarm"
  value       = var.enable_alarms ? aws_cloudwatch_metric_alarm.rate_limit_exceeded[0].arn : null
}

output "cloudwatch_metrics" {
  description = "CloudWatch metric details for monitoring"
  value = {
    namespace = "AWS/WAFV2"
    web_acl   = local.name
    metrics = [
      "AllowedRequests",
      "BlockedRequests",
      "CountedRequests",
      "PassedRequests"
    ]
  }
}

output "managed_rules_summary" {
  description = "Summary of managed rules applied"
  value = {
    common_rule_set      = true
    sql_injection        = true
    known_bad_inputs     = true
    linux_os             = true
    amazon_ip_reputation = true
    anonymous_ip_list    = true
  }
}

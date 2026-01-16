# ============================================
# AI Security Module Outputs
# ============================================

# ============================================
# KMS Keys
# ============================================

output "kms_key_arn" {
  description = "ARN of the AI security KMS key"
  value       = aws_kms_key.ai_security.arn
}

output "kms_key_id" {
  description = "ID of the AI security KMS key"
  value       = aws_kms_key.ai_security.id
}

# ============================================
# DynamoDB Tables
# ============================================

output "model_registry_table_name" {
  description = "Name of the AI model registry DynamoDB table"
  value       = aws_dynamodb_table.ai_model_registry.name
}

output "model_registry_table_arn" {
  description = "ARN of the AI model registry DynamoDB table"
  value       = aws_dynamodb_table.ai_model_registry.arn
}

output "risk_assessments_table_name" {
  description = "Name of the AI risk assessments DynamoDB table"
  value       = aws_dynamodb_table.ai_risk_assessments.name
}

output "ethics_decisions_table_name" {
  description = "Name of the AI ethics decisions DynamoDB table"
  value       = aws_dynamodb_table.ai_ethics_decisions.name
}

output "prompt_templates_table_name" {
  description = "Name of the prompt templates DynamoDB table"
  value       = aws_dynamodb_table.prompt_templates.name
}

output "prompt_injection_patterns_table_name" {
  description = "Name of the prompt injection patterns DynamoDB table"
  value       = aws_dynamodb_table.prompt_injection_patterns.name
}

output "content_safety_patterns_table_name" {
  description = "Name of the content safety patterns DynamoDB table"
  value       = aws_dynamodb_table.content_safety_patterns.name
}

output "hallucination_rules_table_name" {
  description = "Name of the hallucination rules DynamoDB table"
  value       = aws_dynamodb_table.hallucination_rules.name
}

output "incidents_table_name" {
  description = "Name of the AI incidents DynamoDB table"
  value       = aws_dynamodb_table.ai_incidents.name
}

output "compliance_audit_table_name" {
  description = "Name of the AI compliance audit DynamoDB table"
  value       = aws_dynamodb_table.ai_compliance_audit.name
}

output "data_subject_requests_table_name" {
  description = "Name of the data subject requests DynamoDB table"
  value       = aws_dynamodb_table.data_subject_requests.name
}

output "explanations_table_name" {
  description = "Name of the AI explanations DynamoDB table"
  value       = aws_dynamodb_table.ai_explanations.name
}

output "fairness_metrics_table_name" {
  description = "Name of the fairness metrics DynamoDB table"
  value       = aws_dynamodb_table.fairness_metrics.name
}

# ============================================
# S3 Buckets
# ============================================

output "audit_logs_bucket_name" {
  description = "Name of the AI audit logs S3 bucket"
  value       = aws_s3_bucket.ai_audit_logs.bucket
}

output "audit_logs_bucket_arn" {
  description = "ARN of the AI audit logs S3 bucket"
  value       = aws_s3_bucket.ai_audit_logs.arn
}

output "training_data_bucket_name" {
  description = "Name of the AI training data S3 bucket"
  value       = aws_s3_bucket.ai_training_data.bucket
}

output "training_data_bucket_arn" {
  description = "ARN of the AI training data S3 bucket"
  value       = aws_s3_bucket.ai_training_data.arn
}

# ============================================
# CloudWatch Log Groups
# ============================================

output "security_events_log_group_name" {
  description = "Name of the AI security events CloudWatch log group"
  value       = aws_cloudwatch_log_group.ai_security_events.name
}

output "prompt_logs_log_group_name" {
  description = "Name of the AI prompt logs CloudWatch log group"
  value       = aws_cloudwatch_log_group.ai_prompt_logs.name
}

output "decision_logs_log_group_name" {
  description = "Name of the AI decision logs CloudWatch log group"
  value       = aws_cloudwatch_log_group.ai_decision_logs.name
}

output "agent_logs_log_group_name" {
  description = "Name of the AI agent logs CloudWatch log group"
  value       = aws_cloudwatch_log_group.ai_agent_logs.name
}

# ============================================
# SNS Topics
# ============================================

output "security_alerts_topic_arn" {
  description = "ARN of the AI security alerts SNS topic"
  value       = aws_sns_topic.ai_security_alerts.arn
}

# ============================================
# Secrets Manager
# ============================================

output "ai_api_keys_secret_arn" {
  description = "ARN of the AI API keys secret"
  value       = aws_secretsmanager_secret.ai_api_keys.arn
}

output "model_credentials_secret_arn" {
  description = "ARN of the model credentials secret"
  value       = aws_secretsmanager_secret.model_credentials.arn
}

# ============================================
# SSM Parameters
# ============================================

output "kill_switch_parameter_name" {
  description = "Name of the AI kill switch SSM parameter"
  value       = aws_ssm_parameter.ai_kill_switch.name
}

output "model_kill_switches" {
  description = "Map of model-specific kill switch parameter names"
  value       = { for k, v in aws_ssm_parameter.model_kill_switches : k => v.name }
}

# ============================================
# WAF
# ============================================

output "waf_web_acl_arn" {
  description = "ARN of the AI API protection WAF Web ACL"
  value       = aws_wafv2_web_acl.ai_api_protection.arn
}

output "waf_web_acl_id" {
  description = "ID of the AI API protection WAF Web ACL"
  value       = aws_wafv2_web_acl.ai_api_protection.id
}

# ============================================
# Lambda Functions
# ============================================

output "prompt_scanner_function_arn" {
  description = "ARN of the prompt security scanner Lambda function"
  value       = aws_lambda_function.prompt_security_scanner.arn
}

output "output_validator_function_arn" {
  description = "ARN of the output safety validator Lambda function"
  value       = aws_lambda_function.output_safety_validator.arn
}

output "incident_response_function_arn" {
  description = "ARN of the incident response Lambda function"
  value       = aws_lambda_function.ai_incident_response.arn
}

# ============================================
# CloudWatch Alarms
# ============================================

output "alarm_arns" {
  description = "Map of CloudWatch alarm ARNs"
  value = {
    prompt_injection   = aws_cloudwatch_metric_alarm.prompt_injection_attempts.arn
    model_confidence   = aws_cloudwatch_metric_alarm.model_confidence_low.arn
    hallucination_rate = aws_cloudwatch_metric_alarm.hallucination_rate_high.arn
    toxicity           = aws_cloudwatch_metric_alarm.toxicity_detected.arn
    bias               = aws_cloudwatch_metric_alarm.bias_detected.arn
    jailbreak          = aws_cloudwatch_metric_alarm.jailbreak_attempts.arn
    cost_anomaly       = aws_cloudwatch_metric_alarm.ai_cost_anomaly.arn
    model_drift        = aws_cloudwatch_metric_alarm.model_drift.arn
  }
}

# ============================================
# IAM
# ============================================

output "lambda_role_arn" {
  description = "ARN of the AI security Lambda IAM role"
  value       = aws_iam_role.ai_security_lambda.arn
}

# ============================================
# Compliance Summary
# ============================================

output "compliance_summary" {
  description = "Summary of compliance controls implemented"
  value = {
    frameworks = [
      "NIST AI RMF",
      "ISO/IEC 42001",
      "OWASP Top 10 for LLM",
      "MITRE ATLAS",
      "EU AI Act",
      "HIPAA",
      "GDPR",
      "CCPA",
      "PIPEDA"
    ]
    controls = {
      governance = {
        model_registry    = true
        risk_assessment   = true
        ethics_review     = true
        version_control   = true
        change_management = true
      }
      data_security = {
        encryption_at_rest    = true
        encryption_in_transit = true
        pii_detection         = true
        data_lineage          = true
        retention_controls    = true
      }
      prompt_security = {
        injection_prevention = true
        jailbreak_detection  = true
        rate_limiting        = true
        input_validation     = true
      }
      output_security = {
        toxicity_filtering      = true
        bias_detection          = true
        hallucination_detection = true
        confidence_thresholds   = true
      }
      monitoring = {
        audit_logging     = true
        anomaly_detection = true
        cost_monitoring   = true
        drift_detection   = true
        siem_ready        = true
      }
      incident_response = {
        kill_switch         = true
        auto_response       = true
        incident_tracking   = true
        rollback_capability = true
      }
    }
    audit_retention_years = 7
  }
}

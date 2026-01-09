# ============================================
# AI Security Module
# Comprehensive AI security controls following:
# - NIST AI RMF
# - ISO/IEC 42001
# - OWASP Top 10 for LLM Applications
# - MITRE ATLAS
# - EU AI Act compliance
# - HIPAA/GDPR/CCPA/PIPEDA requirements
# ============================================

locals {
  name_prefix = "${var.project_name}-${var.environment}"

  common_tags = merge(var.tags, {
    Module      = "ai-security"
    Compliance  = "NIST-AI-RMF,ISO-42001,OWASP-LLM,HIPAA,GDPR"
    ManagedBy   = "Terraform"
  })
}

# ============================================
# 1. AI GOVERNANCE & MODEL REGISTRY
# ============================================

# DynamoDB table for AI Model Registry
resource "aws_dynamodb_table" "ai_model_registry" {
  name           = "${local.name_prefix}-ai-model-registry"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "model_id"
  range_key      = "version"

  attribute {
    name = "model_id"
    type = "S"
  }

  attribute {
    name = "version"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  attribute {
    name = "risk_level"
    type = "S"
  }

  global_secondary_index {
    name            = "status-index"
    hash_key        = "status"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "risk-level-index"
    hash_key        = "risk_level"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.ai_security.arn
  }

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-ai-model-registry"
    Purpose = "AI Model Inventory and Classification"
  })
}

# DynamoDB table for AI Risk Assessments
resource "aws_dynamodb_table" "ai_risk_assessments" {
  name           = "${local.name_prefix}-ai-risk-assessments"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "assessment_id"
  range_key      = "created_at"

  attribute {
    name = "assessment_id"
    type = "S"
  }

  attribute {
    name = "created_at"
    type = "S"
  }

  attribute {
    name = "model_id"
    type = "S"
  }

  global_secondary_index {
    name            = "model-index"
    hash_key        = "model_id"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.ai_security.arn
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-ai-risk-assessments"
    Purpose = "AI Risk Assessment Tracking"
  })
}

# DynamoDB table for AI Ethics Review Board Decisions
resource "aws_dynamodb_table" "ai_ethics_decisions" {
  name           = "${local.name_prefix}-ai-ethics-decisions"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "decision_id"
  range_key      = "decision_date"

  attribute {
    name = "decision_id"
    type = "S"
  }

  attribute {
    name = "decision_date"
    type = "S"
  }

  attribute {
    name = "model_id"
    type = "S"
  }

  global_secondary_index {
    name            = "model-decisions-index"
    hash_key        = "model_id"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.ai_security.arn
  }

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-ai-ethics-decisions"
    Purpose = "AI Ethics Review Board Decisions"
  })
}

# ============================================
# 2. DATA SECURITY & ENCRYPTION
# ============================================

# KMS Key for AI Security
resource "aws_kms_key" "ai_security" {
  description             = "KMS key for AI security encryption - ${local.name_prefix}"
  deletion_window_in_days = 30
  enable_key_rotation     = true
  multi_region            = var.enable_multi_region

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
        Sid    = "Allow AI Services"
        Effect = "Allow"
        Principal = {
          Service = [
            "bedrock.amazonaws.com",
            "sagemaker.amazonaws.com",
            "comprehend.amazonaws.com",
            "lambda.amazonaws.com"
          ]
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
    Name    = "${local.name_prefix}-ai-security-kms"
    Purpose = "AI Data Encryption"
  })
}

resource "aws_kms_alias" "ai_security" {
  name          = "alias/${local.name_prefix}-ai-security"
  target_key_id = aws_kms_key.ai_security.key_id
}

# S3 Bucket for AI Audit Logs (7-year retention for HIPAA)
resource "aws_s3_bucket" "ai_audit_logs" {
  bucket = "${local.name_prefix}-ai-audit-logs-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.common_tags, {
    Name       = "${local.name_prefix}-ai-audit-logs"
    Purpose    = "AI Audit Trail Storage"
    Retention  = "7-years"
    Compliance = "HIPAA,GDPR,SOC2"
  })
}

resource "aws_s3_bucket_versioning" "ai_audit_logs" {
  bucket = aws_s3_bucket.ai_audit_logs.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "ai_audit_logs" {
  bucket = aws_s3_bucket.ai_audit_logs.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.ai_security.arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "ai_audit_logs" {
  bucket = aws_s3_bucket.ai_audit_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "ai_audit_logs" {
  bucket = aws_s3_bucket.ai_audit_logs.id

  rule {
    id     = "ai-audit-retention"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 365
      storage_class = "GLACIER"
    }

    transition {
      days          = 730
      storage_class = "DEEP_ARCHIVE"
    }

    expiration {
      days = 2555  # 7 years for HIPAA compliance
    }
  }
}

# S3 Bucket for Training Data Provenance
resource "aws_s3_bucket" "ai_training_data" {
  bucket = "${local.name_prefix}-ai-training-data-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-ai-training-data"
    Purpose = "AI Training Data Provenance and Lineage"
  })
}

resource "aws_s3_bucket_versioning" "ai_training_data" {
  bucket = aws_s3_bucket.ai_training_data.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "ai_training_data" {
  bucket = aws_s3_bucket.ai_training_data.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.ai_security.arn
      sse_algorithm     = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "ai_training_data" {
  bucket = aws_s3_bucket.ai_training_data.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ============================================
# 3. PROMPT SECURITY & MODEL PROTECTION
# ============================================

# DynamoDB table for Prompt Templates (versioned)
resource "aws_dynamodb_table" "prompt_templates" {
  name           = "${local.name_prefix}-prompt-templates"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "template_id"
  range_key      = "version"

  attribute {
    name = "template_id"
    type = "S"
  }

  attribute {
    name = "version"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  global_secondary_index {
    name            = "status-index"
    hash_key        = "status"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.ai_security.arn
  }

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-prompt-templates"
    Purpose = "Prompt Version Control and Security"
  })
}

# DynamoDB table for Prompt Injection Patterns
resource "aws_dynamodb_table" "prompt_injection_patterns" {
  name           = "${local.name_prefix}-prompt-injection-patterns"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "pattern_id"

  attribute {
    name = "pattern_id"
    type = "S"
  }

  attribute {
    name = "category"
    type = "S"
  }

  global_secondary_index {
    name            = "category-index"
    hash_key        = "category"
    projection_type = "ALL"
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.ai_security.arn
  }

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-prompt-injection-patterns"
    Purpose = "Prompt Injection Detection Patterns"
  })
}

# ============================================
# 4. OUTPUT SECURITY & SAFETY
# ============================================

# DynamoDB table for Toxicity/Bias Patterns
resource "aws_dynamodb_table" "content_safety_patterns" {
  name           = "${local.name_prefix}-content-safety-patterns"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "pattern_id"

  attribute {
    name = "pattern_id"
    type = "S"
  }

  attribute {
    name = "category"
    type = "S"
  }

  global_secondary_index {
    name            = "category-index"
    hash_key        = "category"
    projection_type = "ALL"
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.ai_security.arn
  }

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-content-safety-patterns"
    Purpose = "Toxicity and Bias Detection Patterns"
  })
}

# DynamoDB table for Hallucination Detection Rules
resource "aws_dynamodb_table" "hallucination_rules" {
  name           = "${local.name_prefix}-hallucination-rules"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "rule_id"

  attribute {
    name = "rule_id"
    type = "S"
  }

  attribute {
    name = "domain"
    type = "S"
  }

  global_secondary_index {
    name            = "domain-index"
    hash_key        = "domain"
    projection_type = "ALL"
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.ai_security.arn
  }

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-hallucination-rules"
    Purpose = "Medical Hallucination Detection Rules"
  })
}

# ============================================
# 5. SECRETS & KEY MANAGEMENT
# ============================================

# Secrets Manager for AI API Keys
resource "aws_secretsmanager_secret" "ai_api_keys" {
  name        = "${local.name_prefix}/ai-api-keys"
  description = "API keys for AI services (OpenAI, Anthropic, etc.)"
  kms_key_id  = aws_kms_key.ai_security.arn

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-ai-api-keys"
    Purpose = "AI Service API Keys"
  })
}

resource "aws_secretsmanager_secret_rotation" "ai_api_keys" {
  secret_id           = aws_secretsmanager_secret.ai_api_keys.id
  rotation_lambda_arn = aws_lambda_function.secret_rotation.arn

  rotation_rules {
    automatically_after_days = 90
  }
}

# Secrets Manager for Model Credentials
resource "aws_secretsmanager_secret" "model_credentials" {
  name        = "${local.name_prefix}/model-credentials"
  description = "Credentials for model access and deployment"
  kms_key_id  = aws_kms_key.ai_security.arn

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-model-credentials"
    Purpose = "Model Access Credentials"
  })
}

# ============================================
# 6. LOGGING, MONITORING & DETECTION
# ============================================

# CloudWatch Log Group for AI Security Events
resource "aws_cloudwatch_log_group" "ai_security_events" {
  name              = "/aws/ai-security/${local.name_prefix}/events"
  retention_in_days = 2555  # 7 years for HIPAA

  kms_key_id = aws_kms_key.ai_security.arn

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-ai-security-events"
    Purpose = "AI Security Event Logging"
  })
}

# CloudWatch Log Group for Prompt Logs
resource "aws_cloudwatch_log_group" "ai_prompt_logs" {
  name              = "/aws/ai-security/${local.name_prefix}/prompts"
  retention_in_days = 2555

  kms_key_id = aws_kms_key.ai_security.arn

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-ai-prompt-logs"
    Purpose = "AI Prompt Audit Logging"
  })
}

# CloudWatch Log Group for Model Decision Logs
resource "aws_cloudwatch_log_group" "ai_decision_logs" {
  name              = "/aws/ai-security/${local.name_prefix}/decisions"
  retention_in_days = 2555

  kms_key_id = aws_kms_key.ai_security.arn

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-ai-decision-logs"
    Purpose = "AI Model Decision Logging"
  })
}

# CloudWatch Log Group for Agent Action Logs
resource "aws_cloudwatch_log_group" "ai_agent_logs" {
  name              = "/aws/ai-security/${local.name_prefix}/agents"
  retention_in_days = 2555

  kms_key_id = aws_kms_key.ai_security.arn

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-ai-agent-logs"
    Purpose = "AI Agent Action Logging"
  })
}

# SNS Topic for AI Security Alerts
resource "aws_sns_topic" "ai_security_alerts" {
  name              = "${local.name_prefix}-ai-security-alerts"
  kms_master_key_id = aws_kms_key.ai_security.id

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-ai-security-alerts"
    Purpose = "AI Security Alert Notifications"
  })
}

resource "aws_sns_topic_subscription" "ai_security_email" {
  count     = var.ai_security_email != "" ? 1 : 0
  topic_arn = aws_sns_topic.ai_security_alerts.arn
  protocol  = "email"
  endpoint  = var.ai_security_email
}

# ============================================
# 7. ANOMALY DETECTION & ALERTING
# ============================================

# CloudWatch Metric Alarm - Prompt Injection Attempts
resource "aws_cloudwatch_metric_alarm" "prompt_injection_attempts" {
  alarm_name          = "${local.name_prefix}-prompt-injection-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "PromptInjectionAttempts"
  namespace           = "AI/Security"
  period              = 300
  statistic           = "Sum"
  threshold           = 10
  alarm_description   = "High number of prompt injection attempts detected"
  alarm_actions       = [aws_sns_topic.ai_security_alerts.arn]

  dimensions = {
    Environment = var.environment
  }

  tags = local.common_tags
}

# CloudWatch Metric Alarm - Model Confidence Anomaly
resource "aws_cloudwatch_metric_alarm" "model_confidence_low" {
  alarm_name          = "${local.name_prefix}-model-confidence-low"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 3
  metric_name         = "AverageModelConfidence"
  namespace           = "AI/Security"
  period              = 300
  statistic           = "Average"
  threshold           = 0.6
  alarm_description   = "Model confidence scores consistently low - potential drift"
  alarm_actions       = [aws_sns_topic.ai_security_alerts.arn]

  dimensions = {
    Environment = var.environment
  }

  tags = local.common_tags
}

# CloudWatch Metric Alarm - Hallucination Detection
resource "aws_cloudwatch_metric_alarm" "hallucination_rate_high" {
  alarm_name          = "${local.name_prefix}-hallucination-rate-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "HallucinationRate"
  namespace           = "AI/Security"
  period              = 300
  statistic           = "Average"
  threshold           = 0.05  # 5% hallucination rate
  alarm_description   = "High hallucination rate detected"
  alarm_actions       = [aws_sns_topic.ai_security_alerts.arn]

  dimensions = {
    Environment = var.environment
  }

  tags = local.common_tags
}

# CloudWatch Metric Alarm - Toxicity Detection
resource "aws_cloudwatch_metric_alarm" "toxicity_detected" {
  alarm_name          = "${local.name_prefix}-toxicity-detected"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "ToxicOutputCount"
  namespace           = "AI/Security"
  period              = 60
  statistic           = "Sum"
  threshold           = 0
  alarm_description   = "Toxic content detected in AI output"
  alarm_actions       = [aws_sns_topic.ai_security_alerts.arn]

  dimensions = {
    Environment = var.environment
  }

  tags = local.common_tags
}

# CloudWatch Metric Alarm - Bias Detection
resource "aws_cloudwatch_metric_alarm" "bias_detected" {
  alarm_name          = "${local.name_prefix}-bias-detected"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "BiasIncidentCount"
  namespace           = "AI/Security"
  period              = 300
  statistic           = "Sum"
  threshold           = 5
  alarm_description   = "Potential bias detected in AI outputs"
  alarm_actions       = [aws_sns_topic.ai_security_alerts.arn]

  dimensions = {
    Environment = var.environment
  }

  tags = local.common_tags
}

# CloudWatch Metric Alarm - Jailbreak Attempts
resource "aws_cloudwatch_metric_alarm" "jailbreak_attempts" {
  alarm_name          = "${local.name_prefix}-jailbreak-attempts"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "JailbreakAttempts"
  namespace           = "AI/Security"
  period              = 60
  statistic           = "Sum"
  threshold           = 3
  alarm_description   = "Jailbreak attempts detected"
  alarm_actions       = [aws_sns_topic.ai_security_alerts.arn]

  dimensions = {
    Environment = var.environment
  }

  tags = local.common_tags
}

# CloudWatch Metric Alarm - Cost Anomaly (Denial of Wallet)
resource "aws_cloudwatch_metric_alarm" "ai_cost_anomaly" {
  alarm_name          = "${local.name_prefix}-ai-cost-anomaly"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "AIInferenceCost"
  namespace           = "AI/Security"
  period              = 3600
  statistic           = "Sum"
  threshold           = var.ai_cost_threshold
  alarm_description   = "AI inference costs exceeding threshold - potential denial of wallet attack"
  alarm_actions       = [aws_sns_topic.ai_security_alerts.arn]

  dimensions = {
    Environment = var.environment
  }

  tags = local.common_tags
}

# CloudWatch Metric Alarm - Model Drift Detection
resource "aws_cloudwatch_metric_alarm" "model_drift" {
  alarm_name          = "${local.name_prefix}-model-drift"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 6
  metric_name         = "ModelDriftScore"
  namespace           = "AI/Security"
  period              = 3600
  statistic           = "Average"
  threshold           = 0.15
  alarm_description   = "Model drift detected - outputs deviating from baseline"
  alarm_actions       = [aws_sns_topic.ai_security_alerts.arn]

  dimensions = {
    Environment = var.environment
  }

  tags = local.common_tags
}

# ============================================
# 8. API RATE LIMITING & PROTECTION
# ============================================

# WAF Web ACL for AI API Protection
resource "aws_wafv2_web_acl" "ai_api_protection" {
  name        = "${local.name_prefix}-ai-api-waf"
  description = "WAF rules for AI API protection"
  scope       = "REGIONAL"

  default_action {
    allow {}
  }

  # Rate limiting rule
  rule {
    name     = "ai-api-rate-limit"
    priority = 1

    override_action {
      none {}
    }

    statement {
      rate_based_statement {
        limit              = var.ai_api_rate_limit
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AIAPIRateLimit"
      sampled_requests_enabled   = true
    }
  }

  # SQL Injection protection
  rule {
    name     = "sql-injection-protection"
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
      metric_name                = "SQLInjectionProtection"
      sampled_requests_enabled   = true
    }
  }

  # Known bad inputs
  rule {
    name     = "known-bad-inputs"
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
      metric_name                = "KnownBadInputs"
      sampled_requests_enabled   = true
    }
  }

  # Bot control
  rule {
    name     = "bot-control"
    priority = 4

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesBotControlRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "BotControl"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "AIAPIWebACL"
    sampled_requests_enabled   = true
  }

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-ai-api-waf"
    Purpose = "AI API Rate Limiting and Protection"
  })
}

# ============================================
# 9. INCIDENT RESPONSE & KILL SWITCH
# ============================================

# DynamoDB table for AI Incident Tracking
resource "aws_dynamodb_table" "ai_incidents" {
  name           = "${local.name_prefix}-ai-incidents"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "incident_id"
  range_key      = "created_at"

  attribute {
    name = "incident_id"
    type = "S"
  }

  attribute {
    name = "created_at"
    type = "S"
  }

  attribute {
    name = "severity"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  global_secondary_index {
    name            = "severity-index"
    hash_key        = "severity"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "status-index"
    hash_key        = "status"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.ai_security.arn
  }

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-ai-incidents"
    Purpose = "AI Security Incident Tracking"
  })
}

# SSM Parameter for Kill Switch
resource "aws_ssm_parameter" "ai_kill_switch" {
  name        = "/${local.name_prefix}/ai/kill-switch"
  description = "AI system kill switch - set to 'true' to disable all AI operations"
  type        = "String"
  value       = "false"
  tier        = "Standard"

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-ai-kill-switch"
    Purpose = "Emergency AI System Shutdown"
  })
}

# SSM Parameter for Model-specific Kill Switches
resource "aws_ssm_parameter" "model_kill_switches" {
  for_each = toset(var.ai_model_types)

  name        = "/${local.name_prefix}/ai/models/${each.key}/enabled"
  description = "Enable/disable ${each.key} AI model"
  type        = "String"
  value       = "true"
  tier        = "Standard"

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-${each.key}-switch"
    Purpose = "Model-specific Kill Switch"
  })
}

# ============================================
# 10. LAMBDA FUNCTIONS FOR AI SECURITY
# ============================================

# IAM Role for AI Security Lambda Functions
resource "aws_iam_role" "ai_security_lambda" {
  name = "${local.name_prefix}-ai-security-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy" "ai_security_lambda" {
  name = "${local.name_prefix}-ai-security-lambda-policy"
  role = aws_iam_role.ai_security_lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.ai_model_registry.arn,
          aws_dynamodb_table.ai_incidents.arn,
          aws_dynamodb_table.prompt_injection_patterns.arn,
          aws_dynamodb_table.content_safety_patterns.arn,
          "${aws_dynamodb_table.ai_model_registry.arn}/index/*",
          "${aws_dynamodb_table.ai_incidents.arn}/index/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt",
          "kms:Encrypt",
          "kms:GenerateDataKey"
        ]
        Resource = aws_kms_key.ai_security.arn
      },
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:PutSecretValue"
        ]
        Resource = [
          aws_secretsmanager_secret.ai_api_keys.arn,
          aws_secretsmanager_secret.model_credentials.arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "sns:Publish"
        ]
        Resource = aws_sns_topic.ai_security_alerts.arn
      },
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:PutParameter"
        ]
        Resource = "arn:aws:ssm:*:*:parameter/${local.name_prefix}/ai/*"
      },
      {
        Effect = "Allow"
        Action = [
          "cloudwatch:PutMetricData"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "comprehend:DetectPiiEntities",
          "comprehend:DetectSentiment",
          "comprehend:DetectToxicContent"
        ]
        Resource = "*"
      }
    ]
  })
}

# Lambda function for Secret Rotation
resource "aws_lambda_function" "secret_rotation" {
  function_name = "${local.name_prefix}-secret-rotation"
  role          = aws_iam_role.ai_security_lambda.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  timeout       = 60

  filename         = data.archive_file.secret_rotation.output_path
  source_code_hash = data.archive_file.secret_rotation.output_base64sha256

  environment {
    variables = {
      ENVIRONMENT = var.environment
      KMS_KEY_ID  = aws_kms_key.ai_security.id
    }
  }

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-secret-rotation"
    Purpose = "AI API Key Rotation"
  })
}

# Lambda permission for Secrets Manager
resource "aws_lambda_permission" "secret_rotation" {
  statement_id  = "AllowSecretsManager"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.secret_rotation.function_name
  principal     = "secretsmanager.amazonaws.com"
}

# Lambda function for Prompt Security Scanner
resource "aws_lambda_function" "prompt_security_scanner" {
  function_name = "${local.name_prefix}-prompt-scanner"
  role          = aws_iam_role.ai_security_lambda.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  timeout       = 30
  memory_size   = 512

  filename         = data.archive_file.prompt_scanner.output_path
  source_code_hash = data.archive_file.prompt_scanner.output_base64sha256

  environment {
    variables = {
      ENVIRONMENT              = var.environment
      PATTERNS_TABLE           = aws_dynamodb_table.prompt_injection_patterns.name
      INCIDENTS_TABLE          = aws_dynamodb_table.ai_incidents.name
      SNS_TOPIC_ARN            = aws_sns_topic.ai_security_alerts.arn
      KILL_SWITCH_PARAM        = aws_ssm_parameter.ai_kill_switch.name
    }
  }

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-prompt-scanner"
    Purpose = "Prompt Injection Detection"
  })
}

# Lambda function for Output Safety Validator
resource "aws_lambda_function" "output_safety_validator" {
  function_name = "${local.name_prefix}-output-validator"
  role          = aws_iam_role.ai_security_lambda.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  timeout       = 30
  memory_size   = 512

  filename         = data.archive_file.output_validator.output_path
  source_code_hash = data.archive_file.output_validator.output_base64sha256

  environment {
    variables = {
      ENVIRONMENT         = var.environment
      SAFETY_PATTERNS     = aws_dynamodb_table.content_safety_patterns.name
      HALLUCINATION_RULES = aws_dynamodb_table.hallucination_rules.name
      INCIDENTS_TABLE     = aws_dynamodb_table.ai_incidents.name
      SNS_TOPIC_ARN       = aws_sns_topic.ai_security_alerts.arn
    }
  }

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-output-validator"
    Purpose = "AI Output Safety Validation"
  })
}

# Lambda function for AI Incident Response
resource "aws_lambda_function" "ai_incident_response" {
  function_name = "${local.name_prefix}-incident-response"
  role          = aws_iam_role.ai_security_lambda.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
  timeout       = 60
  memory_size   = 256

  filename         = data.archive_file.incident_response.output_path
  source_code_hash = data.archive_file.incident_response.output_base64sha256

  environment {
    variables = {
      ENVIRONMENT       = var.environment
      INCIDENTS_TABLE   = aws_dynamodb_table.ai_incidents.name
      MODEL_REGISTRY    = aws_dynamodb_table.ai_model_registry.name
      SNS_TOPIC_ARN     = aws_sns_topic.ai_security_alerts.arn
      KILL_SWITCH_PARAM = aws_ssm_parameter.ai_kill_switch.name
    }
  }

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-incident-response"
    Purpose = "AI Security Incident Response Automation"
  })
}

# ============================================
# 11. COMPLIANCE & REGULATORY CONTROLS
# ============================================

# DynamoDB table for Compliance Audit Trail
resource "aws_dynamodb_table" "ai_compliance_audit" {
  name           = "${local.name_prefix}-ai-compliance-audit"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "audit_id"
  range_key      = "timestamp"

  attribute {
    name = "audit_id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  attribute {
    name = "framework"
    type = "S"
  }

  attribute {
    name = "control_id"
    type = "S"
  }

  global_secondary_index {
    name            = "framework-index"
    hash_key        = "framework"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "control-index"
    hash_key        = "control_id"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.ai_security.arn
  }

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-ai-compliance-audit"
    Purpose = "AI Regulatory Compliance Tracking"
  })
}

# DynamoDB table for Data Subject Requests (GDPR/CCPA)
resource "aws_dynamodb_table" "data_subject_requests" {
  name           = "${local.name_prefix}-data-subject-requests"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "request_id"
  range_key      = "created_at"

  attribute {
    name = "request_id"
    type = "S"
  }

  attribute {
    name = "created_at"
    type = "S"
  }

  attribute {
    name = "request_type"
    type = "S"
  }

  attribute {
    name = "status"
    type = "S"
  }

  global_secondary_index {
    name            = "type-index"
    hash_key        = "request_type"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "status-index"
    hash_key        = "status"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.ai_security.arn
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-data-subject-requests"
    Purpose = "GDPR/CCPA Data Subject Request Tracking"
  })
}

# ============================================
# 12. EXPLAINABILITY & TRANSPARENCY
# ============================================

# DynamoDB table for AI Decision Explanations
resource "aws_dynamodb_table" "ai_explanations" {
  name           = "${local.name_prefix}-ai-explanations"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "decision_id"
  range_key      = "timestamp"

  attribute {
    name = "decision_id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  attribute {
    name = "model_id"
    type = "S"
  }

  global_secondary_index {
    name            = "model-index"
    hash_key        = "model_id"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.ai_security.arn
  }

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-ai-explanations"
    Purpose = "AI Decision Explainability"
  })
}

# DynamoDB table for Fairness Metrics
resource "aws_dynamodb_table" "fairness_metrics" {
  name           = "${local.name_prefix}-fairness-metrics"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "metric_id"
  range_key      = "timestamp"

  attribute {
    name = "metric_id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  attribute {
    name = "model_id"
    type = "S"
  }

  global_secondary_index {
    name            = "model-index"
    hash_key        = "model_id"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.ai_security.arn
  }

  tags = merge(local.common_tags, {
    Name    = "${local.name_prefix}-fairness-metrics"
    Purpose = "AI Fairness and Bias Metrics"
  })
}

# ============================================
# DATA SOURCES
# ============================================

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# Lambda deployment packages
data "archive_file" "secret_rotation" {
  type        = "zip"
  output_path = "${path.module}/lambda/secret-rotation.zip"

  source {
    content  = <<EOF
exports.handler = async (event) => {
  console.log('Secret rotation triggered:', JSON.stringify(event));
  // Implement secret rotation logic
  return { statusCode: 200, body: 'Success' };
};
EOF
    filename = "index.js"
  }
}

data "archive_file" "prompt_scanner" {
  type        = "zip"
  output_path = "${path.module}/lambda/prompt-scanner.zip"

  source {
    content  = <<EOF
const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb');
const { CloudWatchClient, PutMetricDataCommand } = require('@aws-sdk/client-cloudwatch');

exports.handler = async (event) => {
  const prompt = event.prompt || '';
  const patterns = [
    /ignore\s+(all\s+)?previous\s+instructions/i,
    /disregard\s+(all\s+)?previous/i,
    /system\s*prompt/i,
    /new\s+instructions/i,
    /<script/i,
    /javascript:/i,
    /onerror\s*=/i,
    /\{\{.*\}\}/,
    /\$\{.*\}/
  ];

  let injectionDetected = false;
  for (const pattern of patterns) {
    if (pattern.test(prompt)) {
      injectionDetected = true;
      break;
    }
  }

  // Record metric
  const cw = new CloudWatchClient({});
  await cw.send(new PutMetricDataCommand({
    Namespace: 'AI/Security',
    MetricData: [{
      MetricName: 'PromptInjectionAttempts',
      Value: injectionDetected ? 1 : 0,
      Unit: 'Count',
      Dimensions: [{ Name: 'Environment', Value: process.env.ENVIRONMENT }]
    }]
  }));

  return { safe: !injectionDetected, message: injectionDetected ? 'Potential injection detected' : 'OK' };
};
EOF
    filename = "index.js"
  }
}

data "archive_file" "output_validator" {
  type        = "zip"
  output_path = "${path.module}/lambda/output-validator.zip"

  source {
    content  = <<EOF
const { CloudWatchClient, PutMetricDataCommand } = require('@aws-sdk/client-cloudwatch');

exports.handler = async (event) => {
  const output = event.output || '';

  // Toxicity patterns
  const toxicPatterns = [/\bkill\b/i, /\bharm\b/i, /\bsuicide\b/i, /\billegal\b/i];
  let toxicityScore = 0;
  for (const pattern of toxicPatterns) {
    if (pattern.test(output)) toxicityScore++;
  }

  // Hallucination indicators (simplified)
  const hallucinationIndicators = [
    /definitely\s+will/i,
    /100%\s+certain/i,
    /guaranteed\s+to/i,
    /always\s+works/i
  ];
  let hallucinationScore = 0;
  for (const pattern of hallucinationIndicators) {
    if (pattern.test(output)) hallucinationScore++;
  }

  const cw = new CloudWatchClient({});
  await cw.send(new PutMetricDataCommand({
    Namespace: 'AI/Security',
    MetricData: [
      { MetricName: 'ToxicOutputCount', Value: toxicityScore, Unit: 'Count', Dimensions: [{ Name: 'Environment', Value: process.env.ENVIRONMENT }] },
      { MetricName: 'HallucinationRate', Value: hallucinationScore > 0 ? 1 : 0, Unit: 'Count', Dimensions: [{ Name: 'Environment', Value: process.env.ENVIRONMENT }] }
    ]
  }));

  return {
    safe: toxicityScore === 0 && hallucinationScore === 0,
    toxicityScore,
    hallucinationScore
  };
};
EOF
    filename = "index.js"
  }
}

data "archive_file" "incident_response" {
  type        = "zip"
  output_path = "${path.module}/lambda/incident-response.zip"

  source {
    content  = <<EOF
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { SSMClient, PutParameterCommand } = require('@aws-sdk/client-ssm');
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

exports.handler = async (event) => {
  const { severity, incidentType, modelId, details } = event;
  const db = new DynamoDBClient({});
  const ssm = new SSMClient({});
  const sns = new SNSClient({});

  // Log incident
  const incidentId = \`INC-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`;
  await db.send(new PutItemCommand({
    TableName: process.env.INCIDENTS_TABLE,
    Item: {
      incident_id: { S: incidentId },
      created_at: { S: new Date().toISOString() },
      severity: { S: severity },
      incident_type: { S: incidentType },
      model_id: { S: modelId || 'unknown' },
      details: { S: JSON.stringify(details) },
      status: { S: 'open' }
    }
  }));

  // Auto-trigger kill switch for critical incidents
  if (severity === 'critical') {
    await ssm.send(new PutParameterCommand({
      Name: process.env.KILL_SWITCH_PARAM,
      Value: 'true',
      Overwrite: true
    }));
  }

  // Send alert
  await sns.send(new PublishCommand({
    TopicArn: process.env.SNS_TOPIC_ARN,
    Subject: \`[AI Security] \${severity.toUpperCase()} - \${incidentType}\`,
    Message: JSON.stringify({ incidentId, severity, incidentType, modelId, details, timestamp: new Date().toISOString() })
  }));

  return { incidentId, killSwitchActivated: severity === 'critical' };
};
EOF
    filename = "index.js"
  }
}

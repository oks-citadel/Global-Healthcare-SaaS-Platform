# ============================================
# AI Security Module Variables
# ============================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "tags" {
  description = "Additional tags for resources"
  type        = map(string)
  default     = {}
}

variable "enable_multi_region" {
  description = "Enable multi-region KMS keys for disaster recovery"
  type        = bool
  default     = false
}

variable "ai_security_email" {
  description = "Email address for AI security alerts"
  type        = string
  default     = ""
}

variable "ai_api_rate_limit" {
  description = "Rate limit for AI API requests per 5 minutes per IP"
  type        = number
  default     = 1000
}

variable "ai_cost_threshold" {
  description = "AI inference cost threshold in USD per hour for denial-of-wallet detection"
  type        = number
  default     = 100
}

variable "ai_model_types" {
  description = "List of AI model types for individual kill switches"
  type        = list(string)
  default = [
    "documentation",
    "coding",
    "triage",
    "medication-safety",
    "patient-messaging"
  ]
}

# ============================================
# Compliance Framework Variables
# ============================================

variable "compliance_frameworks" {
  description = "List of compliance frameworks to enable"
  type        = list(string)
  default = [
    "NIST-AI-RMF",
    "ISO-42001",
    "OWASP-LLM",
    "MITRE-ATLAS",
    "EU-AI-ACT",
    "HIPAA",
    "GDPR",
    "CCPA",
    "PIPEDA"
  ]
}

variable "data_retention_days" {
  description = "Default data retention period in days"
  type        = number
  default     = 2555 # 7 years for HIPAA
}

variable "audit_log_retention_days" {
  description = "Audit log retention period in days"
  type        = number
  default     = 2555 # 7 years for HIPAA
}

# ============================================
# AI Governance Variables
# ============================================

variable "enable_ethics_review" {
  description = "Enable AI ethics review board workflow"
  type        = bool
  default     = true
}

variable "enable_risk_assessment" {
  description = "Enable AI risk assessment tracking"
  type        = bool
  default     = true
}

variable "model_approval_required" {
  description = "Require approval for model deployment"
  type        = bool
  default     = true
}

# ============================================
# Security Detection Variables
# ============================================

variable "enable_prompt_injection_detection" {
  description = "Enable prompt injection detection"
  type        = bool
  default     = true
}

variable "enable_hallucination_detection" {
  description = "Enable hallucination detection in outputs"
  type        = bool
  default     = true
}

variable "enable_toxicity_detection" {
  description = "Enable toxicity detection in outputs"
  type        = bool
  default     = true
}

variable "enable_bias_detection" {
  description = "Enable bias detection in outputs"
  type        = bool
  default     = true
}

variable "enable_pii_detection" {
  description = "Enable PII/PHI detection and redaction"
  type        = bool
  default     = true
}

variable "enable_jailbreak_detection" {
  description = "Enable jailbreak attempt detection"
  type        = bool
  default     = true
}

# ============================================
# Model Security Variables
# ============================================

variable "enable_model_versioning" {
  description = "Enable model version control"
  type        = bool
  default     = true
}

variable "enable_model_rollback" {
  description = "Enable model rollback capability"
  type        = bool
  default     = true
}

variable "model_drift_threshold" {
  description = "Threshold for model drift detection (0-1)"
  type        = number
  default     = 0.15
}

# ============================================
# Incident Response Variables
# ============================================

variable "enable_kill_switch" {
  description = "Enable AI system kill switch"
  type        = bool
  default     = true
}

variable "auto_kill_switch_on_critical" {
  description = "Automatically activate kill switch on critical incidents"
  type        = bool
  default     = true
}

variable "incident_response_sla_minutes" {
  description = "SLA for incident response in minutes"
  type        = number
  default     = 15
}

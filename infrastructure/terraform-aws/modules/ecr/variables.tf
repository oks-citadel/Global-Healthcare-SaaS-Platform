# ============================================
# ECR Module Variables
# ============================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "repository_names" {
  description = "List of ECR repository names to create"
  type        = list(string)
  default = [
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
  ]
}

variable "image_tag_mutability" {
  description = "Image tag mutability (MUTABLE or IMMUTABLE)"
  type        = string
  default     = "IMMUTABLE"
}

variable "scan_on_push" {
  description = "Scan images on push"
  type        = bool
  default     = true
}

variable "kms_key_arn" {
  description = "KMS key ARN for encryption (leave empty to create new)"
  type        = string
  default     = ""
}

variable "image_count_to_keep" {
  description = "Number of tagged images to keep"
  type        = number
  default     = 30
}

variable "untagged_image_expiry_days" {
  description = "Days before untagged images expire"
  type        = number
  default     = 7
}

variable "dev_image_expiry_days" {
  description = "Days before dev/feature images expire"
  type        = number
  default     = 14
}

variable "cross_account_access_arns" {
  description = "AWS account ARNs for cross-account ECR access"
  type        = list(string)
  default     = []
}

variable "replication_regions" {
  description = "Regions for ECR replication"
  type        = list(string)
  default     = []
}

variable "replication_repository_filters" {
  description = "Repository prefix filters for replication"
  type        = list(string)
  default     = []
}

variable "enable_pull_through_cache" {
  description = "Enable pull through cache for external registries"
  type        = bool
  default     = false
}

variable "dockerhub_credentials_arn" {
  description = "Secrets Manager ARN for DockerHub credentials"
  type        = string
  default     = ""
}

variable "ghcr_credentials_arn" {
  description = "Secrets Manager ARN for GHCR credentials"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}

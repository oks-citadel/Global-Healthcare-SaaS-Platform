# ============================================
# ALB Module Variables
# ============================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "region_name" {
  description = "Region name (americas, europe, africa)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for ALB"
  type        = list(string)
}

variable "certificate_arn" {
  description = "ACM certificate ARN"
  type        = string
}

variable "internal" {
  description = "Whether ALB is internal"
  type        = bool
  default     = false
}

variable "allowed_cidrs" {
  description = "CIDR blocks allowed to access internal ALB"
  type        = list(string)
  default     = []
}

variable "deletion_protection" {
  description = "Enable deletion protection"
  type        = bool
  default     = true
}

variable "idle_timeout" {
  description = "Idle timeout in seconds"
  type        = number
  default     = 60
}

variable "enable_access_logs" {
  description = "Enable access logs"
  type        = bool
  default     = true
}

variable "access_logs_bucket" {
  description = "S3 bucket for access logs"
  type        = string
}

variable "target_groups" {
  description = "Map of target groups to create"
  type = map(object({
    port                 = number
    priority             = number
    path_patterns        = list(string)
    health_check_path    = string
    health_check_matcher = string
  }))
  default = {
    api-gateway = {
      port                 = 3000
      priority             = 100
      path_patterns        = ["/api/*", "/health"]
      health_check_path    = "/health"
      health_check_matcher = "200"
    }
  }
}

variable "cloudfront_secret" {
  description = "CloudFront origin validation secret"
  type        = string
  default     = ""
  sensitive   = true
}

variable "alarm_sns_topic_arns" {
  description = "SNS topic ARNs for CloudWatch alarms"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}

################################################################################
# Variables - Production Environment
# Global SaaS Marketing Platform
################################################################################

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "global-saas-marketing"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "cost_center" {
  description = "Cost center for billing"
  type        = string
  default     = "marketing-platform"
}

variable "allowed_regions" {
  description = "List of allowed AWS regions"
  type        = list(string)
  default     = ["us-east-1", "us-west-2", "eu-west-1"]
}

################################################################################
# Networking Variables
################################################################################

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.2.0.0/16"
}

################################################################################
# EKS Variables
################################################################################

variable "eks_cluster_version" {
  description = "Kubernetes version for EKS"
  type        = string
  default     = "1.29"
}

################################################################################
# Domain Variables
################################################################################

variable "ses_domain_name" {
  description = "Domain name for SES"
  type        = string
}

variable "ses_tracking_domain" {
  description = "Custom tracking domain for SES"
  type        = string
  default     = null
}

variable "route53_zone_id" {
  description = "Route53 hosted zone ID"
  type        = string
}

variable "dmarc_email" {
  description = "Email for DMARC reports"
  type        = string
}

variable "ses_allowed_from_addresses" {
  description = "Allowed from email addresses"
  type        = list(string)
}

variable "cloudfront_domain_names" {
  description = "Domain names for CloudFront"
  type        = list(string)
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN for CloudFront"
  type        = string
}

variable "cors_allowed_origins" {
  description = "CORS allowed origins"
  type        = list(string)
}

################################################################################
# Security Variables
################################################################################

variable "enable_shield_advanced" {
  description = "Enable AWS Shield Advanced"
  type        = bool
  default     = false
}

variable "waf_blocked_countries" {
  description = "List of country codes to block"
  type        = list(string)
  default     = []
}

variable "geo_restriction_type" {
  description = "Type of geo restriction (none, whitelist, blacklist)"
  type        = string
  default     = "none"
}

variable "geo_restriction_locations" {
  description = "List of country codes for geo restriction"
  type        = list(string)
  default     = []
}

################################################################################
# Database Variables
################################################################################

variable "create_opensearch_service_linked_role" {
  description = "Create OpenSearch service-linked role"
  type        = bool
  default     = false
}

variable "opensearch_master_user_arn" {
  description = "ARN of OpenSearch master user"
  type        = string
}

################################################################################
# Data Lake Variables
################################################################################

variable "lake_formation_admin_arn" {
  description = "ARN of Lake Formation administrator"
  type        = string
  default     = ""
}

################################################################################
# Monitoring Variables
################################################################################

variable "alert_email_addresses" {
  description = "Email addresses for alerts"
  type        = list(string)
}

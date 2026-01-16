################################################################################
# Variables - Staging Environment
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
  default     = "staging"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

################################################################################
# Networking Variables
################################################################################

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.1.0.0/16"
}

variable "bastion_allowed_cidrs" {
  description = "CIDR blocks allowed to SSH to bastion"
  type        = list(string)
  default     = []
}

################################################################################
# EKS Variables
################################################################################

variable "eks_cluster_version" {
  description = "Kubernetes version for EKS"
  type        = string
  default     = "1.29"
}

variable "eks_public_access_cidrs" {
  description = "CIDR blocks allowed to access public EKS endpoint"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

################################################################################
# Domain Variables
################################################################################

variable "ses_domain_name" {
  description = "Domain name for SES"
  type        = string
}

variable "route53_zone_id" {
  description = "Route53 hosted zone ID"
  type        = string
  default     = null
}

variable "dmarc_email" {
  description = "Email for DMARC reports"
  type        = string
  default     = ""
}

variable "ses_allowed_from_addresses" {
  description = "Allowed from email addresses"
  type        = list(string)
  default     = []
}

variable "cloudfront_domain_names" {
  description = "Domain names for CloudFront"
  type        = list(string)
  default     = []
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN for CloudFront"
  type        = string
  default     = null
}

variable "cors_allowed_origins" {
  description = "CORS allowed origins"
  type        = list(string)
  default     = ["*"]
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
  default     = ""
}

################################################################################
# Monitoring Variables
################################################################################

variable "alert_email_addresses" {
  description = "Email addresses for alerts"
  type        = list(string)
  default     = []
}

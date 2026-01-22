# ============================================
# VPC Module Variables
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

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
}

variable "database_subnet_cidrs" {
  description = "CIDR blocks for database subnets"
  type        = list(string)
}

variable "elasticache_subnet_cidrs" {
  description = "CIDR blocks for ElastiCache subnets"
  type        = list(string)
}

variable "enable_nat_gateway" {
  description = "Enable NAT gateways for private subnets"
  type        = bool
  default     = true
}

variable "enable_flow_logs" {
  description = "Enable VPC flow logs"
  type        = bool
  default     = true
}

variable "flow_logs_retention_days" {
  description = "CloudWatch log retention for flow logs"
  type        = number
  default     = 30
}

variable "flow_logs_kms_key_arn" {
  description = "KMS key ARN for encrypting VPC flow logs (HIPAA compliance)"
  type        = string
  default     = null
}

variable "enable_vpc_endpoints" {
  description = "Enable VPC endpoints for AWS services"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}

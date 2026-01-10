# ============================================
# Cost Optimization Module Variables
# ============================================

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "cost_center" {
  description = "Cost center for billing allocation"
  type        = string
  default     = "healthcare-platform"
}

variable "tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}

# ============================================
# Budget Configuration
# ============================================

variable "monthly_budget_limit" {
  description = "Monthly budget limit in USD"
  type        = string
  default     = "10000"
}

variable "compute_budget_limit" {
  description = "Monthly compute budget limit in USD"
  type        = string
  default     = "5000"
}

variable "database_budget_limit" {
  description = "Monthly database budget limit in USD"
  type        = string
  default     = "2000"
}

variable "budget_alert_emails" {
  description = "Email addresses for budget alerts"
  type        = list(string)
}

# ============================================
# Spot Instance Configuration
# ============================================

variable "enable_spot_instances" {
  description = "Enable Spot instances for non-critical workloads"
  type        = bool
  default     = true
}

variable "spot_max_price" {
  description = "Maximum price for Spot instances"
  type        = string
  default     = "0.10"
}

variable "spot_target_capacity" {
  description = "Target capacity for Spot fleet"
  type        = number
  default     = 2
}

variable "spot_instance_types" {
  description = "Instance types for Spot fleet (diversified for availability)"
  type        = list(string)
  default     = ["t3.medium", "t3a.medium", "t3.large", "t3a.large"]
}

variable "spot_ami_id" {
  description = "AMI ID for Spot instances"
  type        = string
  default     = ""
}

# ============================================
# Auto Scaling Configuration
# ============================================

variable "autoscaling_group_name" {
  description = "Name of the Auto Scaling group"
  type        = string
  default     = ""
}

variable "enable_predictive_scaling" {
  description = "Enable predictive scaling for ASG"
  type        = bool
  default     = true
}

variable "target_cpu_utilization" {
  description = "Target CPU utilization for scaling"
  type        = number
  default     = 70
}

variable "enable_scheduled_scaling" {
  description = "Enable scheduled scaling (night/day)"
  type        = bool
  default     = true
}

variable "night_min_capacity" {
  description = "Minimum capacity during night hours"
  type        = number
  default     = 1
}

variable "night_max_capacity" {
  description = "Maximum capacity during night hours"
  type        = number
  default     = 3
}

variable "night_desired_capacity" {
  description = "Desired capacity during night hours"
  type        = number
  default     = 1
}

variable "day_min_capacity" {
  description = "Minimum capacity during day hours"
  type        = number
  default     = 2
}

variable "day_max_capacity" {
  description = "Maximum capacity during day hours"
  type        = number
  default     = 10
}

variable "day_desired_capacity" {
  description = "Desired capacity during day hours"
  type        = number
  default     = 3
}

# ============================================
# Network Configuration
# ============================================

variable "private_subnet_ids" {
  description = "Private subnet IDs"
  type        = list(string)
  default     = []
}

variable "security_group_ids" {
  description = "Security group IDs"
  type        = list(string)
  default     = []
}

# ============================================
# RDS Configuration
# ============================================

variable "enable_rds_proxy" {
  description = "Enable RDS Proxy for connection pooling"
  type        = bool
  default     = true
}

variable "rds_engine_family" {
  description = "RDS engine family for proxy"
  type        = string
  default     = "POSTGRESQL"
}

variable "rds_secret_arn" {
  description = "ARN of the RDS credentials secret"
  type        = string
  default     = ""
}

# ============================================
# ElastiCache Configuration
# ============================================

variable "enable_elasticache" {
  description = "Enable ElastiCache"
  type        = bool
  default     = true
}

variable "cache_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "cache_num_nodes" {
  description = "Number of cache nodes"
  type        = number
  default     = 1
}

variable "cache_subnet_group" {
  description = "ElastiCache subnet group name"
  type        = string
  default     = ""
}

# ============================================
# CloudWatch Logs Configuration
# ============================================

variable "log_groups" {
  description = "Map of log groups with retention settings"
  type = map(object({
    name           = string
    retention_days = number
  }))
  default = {}
}

# ============================================
# Lambda Configuration
# ============================================

variable "enable_cost_optimizer_lambda" {
  description = "Enable cost optimizer Lambda function"
  type        = bool
  default     = true
}

variable "sns_topic_arn" {
  description = "SNS topic ARN for notifications"
  type        = string
  default     = ""
}

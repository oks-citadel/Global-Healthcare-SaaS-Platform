# =============================================================================
# ECS Service Module - Variables
# =============================================================================

# -----------------------------------------------------------------------------
# Required Variables
# -----------------------------------------------------------------------------
variable "project" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "service_name" {
  description = "Name of the service"
  type        = string
}

variable "cluster_id" {
  description = "ECS cluster ID"
  type        = string
}

variable "cluster_name" {
  description = "ECS cluster name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for ECS tasks"
  type        = list(string)
}

variable "security_group_id" {
  description = "Security group ID for ECS tasks"
  type        = string
}

variable "task_execution_role_arn" {
  description = "ARN of the ECS task execution role"
  type        = string
}

variable "ecr_repository_url" {
  description = "ECR repository URL"
  type        = string
}

# -----------------------------------------------------------------------------
# Task Configuration
# -----------------------------------------------------------------------------
variable "cpu" {
  description = "CPU units for the task (256, 512, 1024, 2048, 4096)"
  type        = number
  default     = 256
}

variable "memory" {
  description = "Memory in MB for the task"
  type        = number
  default     = 512
}

variable "container_port" {
  description = "Container port"
  type        = number
  default     = 3000
}

variable "image_tag" {
  description = "Docker image tag"
  type        = string
  default     = "latest"
}

variable "desired_count" {
  description = "Desired number of tasks"
  type        = number
  default     = 2
}

variable "task_role_arn" {
  description = "ARN of the task IAM role (optional)"
  type        = string
  default     = ""
}

# -----------------------------------------------------------------------------
# Environment Variables and Secrets
# -----------------------------------------------------------------------------
variable "environment_variables" {
  description = "Environment variables for the container"
  type        = map(string)
  default     = {}
}

variable "secrets" {
  description = "Secrets from Secrets Manager or SSM (key = env var name, value = ARN)"
  type        = map(string)
  default     = {}
}

# -----------------------------------------------------------------------------
# Health Check Configuration
# -----------------------------------------------------------------------------
variable "health_check_path" {
  description = "Health check path"
  type        = string
  default     = "/health"
}

variable "health_check_interval" {
  description = "Health check interval in seconds"
  type        = number
  default     = 30
}

variable "health_check_timeout" {
  description = "Health check timeout in seconds"
  type        = number
  default     = 5
}

variable "health_check_retries" {
  description = "Number of health check retries"
  type        = number
  default     = 3
}

variable "health_check_start_period" {
  description = "Health check start period in seconds"
  type        = number
  default     = 60
}

# -----------------------------------------------------------------------------
# Load Balancer Configuration
# -----------------------------------------------------------------------------
variable "alb_listener_arn" {
  description = "ALB listener ARN"
  type        = string
  default     = ""
}

variable "create_listener_rule" {
  description = "Whether to create an ALB listener rule"
  type        = bool
  default     = true
}

variable "listener_rule_priority" {
  description = "Priority for the ALB listener rule"
  type        = number
  default     = 100
}

variable "path_patterns" {
  description = "Path patterns for ALB routing"
  type        = list(string)
  default     = ["/*"]
}

# -----------------------------------------------------------------------------
# Auto Scaling Configuration
# -----------------------------------------------------------------------------
variable "enable_autoscaling" {
  description = "Enable auto scaling"
  type        = bool
  default     = true
}

variable "min_capacity" {
  description = "Minimum number of tasks"
  type        = number
  default     = 2
}

variable "max_capacity" {
  description = "Maximum number of tasks"
  type        = number
  default     = 10
}

variable "cpu_scaling_target" {
  description = "Target CPU utilization for scaling"
  type        = number
  default     = 70
}

variable "memory_scaling_target" {
  description = "Target memory utilization for scaling"
  type        = number
  default     = 80
}

# -----------------------------------------------------------------------------
# Deployment Configuration
# -----------------------------------------------------------------------------
variable "deployment_minimum_healthy_percent" {
  description = "Minimum healthy percent during deployment"
  type        = number
  default     = 100
}

variable "deployment_maximum_percent" {
  description = "Maximum percent during deployment"
  type        = number
  default     = 200
}

variable "use_spot" {
  description = "Use Fargate Spot instances"
  type        = bool
  default     = true
}

variable "enable_execute_command" {
  description = "Enable ECS Exec for debugging"
  type        = bool
  default     = true
}

# -----------------------------------------------------------------------------
# Service Discovery
# -----------------------------------------------------------------------------
variable "service_discovery_registry_arn" {
  description = "Service discovery registry ARN"
  type        = string
  default     = ""
}

# -----------------------------------------------------------------------------
# Monitoring
# -----------------------------------------------------------------------------
variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 30
}

variable "kms_key_arn" {
  description = "KMS key ARN for CloudWatch log encryption (HIPAA compliance)"
  type        = string
  default     = null
}

variable "enable_alarms" {
  description = "Enable CloudWatch alarms"
  type        = bool
  default     = true
}

variable "alarm_sns_topic_arns" {
  description = "SNS topic ARNs for alarm notifications"
  type        = list(string)
  default     = []
}

# -----------------------------------------------------------------------------
# Tags
# -----------------------------------------------------------------------------
variable "tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}

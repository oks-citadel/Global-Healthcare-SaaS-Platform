################################################################################
# ALB Ingress Controller Module - Variables
# Global SaaS Marketing Platform
################################################################################

variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where the ALB will be created"
  type        = string
}

variable "oidc_provider_arn" {
  description = "ARN of the OIDC provider for the EKS cluster"
  type        = string
}

variable "oidc_provider_url" {
  description = "URL of the OIDC provider for the EKS cluster"
  type        = string
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}

################################################################################
# Controller Configuration
################################################################################

variable "install_controller" {
  description = "Whether to install the AWS Load Balancer Controller via Helm"
  type        = bool
  default     = true
}

variable "controller_version" {
  description = "Version of the AWS Load Balancer Controller Helm chart"
  type        = string
  default     = "1.6.2"
}

variable "controller_replica_count" {
  description = "Number of replicas for the controller"
  type        = number
  default     = 2
}

variable "create_service_account" {
  description = "Whether to create a Kubernetes service account for the controller"
  type        = bool
  default     = true
}

variable "controller_resources_requests_cpu" {
  description = "CPU request for the controller pods"
  type        = string
  default     = "100m"
}

variable "controller_resources_requests_memory" {
  description = "Memory request for the controller pods"
  type        = string
  default     = "128Mi"
}

variable "controller_resources_limits_cpu" {
  description = "CPU limit for the controller pods"
  type        = string
  default     = "200m"
}

variable "controller_resources_limits_memory" {
  description = "Memory limit for the controller pods"
  type        = string
  default     = "256Mi"
}

################################################################################
# Ingress Class Configuration
################################################################################

variable "create_ingress_class" {
  description = "Whether to create an IngressClass for ALB"
  type        = bool
  default     = true
}

variable "is_default_ingress_class" {
  description = "Whether this IngressClass should be the default"
  type        = bool
  default     = true
}

################################################################################
# Target Groups Configuration
################################################################################

variable "target_groups" {
  description = "Map of target group configurations"
  type = map(object({
    port                  = number
    protocol              = string
    target_type           = string
    healthy_threshold     = optional(number, 3)
    unhealthy_threshold   = optional(number, 3)
    health_check_timeout  = optional(number, 5)
    health_check_interval = optional(number, 30)
    health_check_path     = optional(string, "/health")
    health_check_port     = optional(string, "traffic-port")
    health_check_protocol = optional(string, "HTTP")
    health_check_matcher  = optional(string, "200")
    deregistration_delay  = optional(number, 300)
    stickiness_type       = optional(string, "lb_cookie")
    stickiness_enabled    = optional(bool, false)
    stickiness_duration   = optional(number, 86400)
  }))
  default = {}
}

################################################################################
# ALB Configuration
################################################################################

variable "public_subnet_ids" {
  description = "List of public subnet IDs for internet-facing ALB"
  type        = list(string)
  default     = []
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for internal ALB"
  type        = list(string)
  default     = []
}

variable "security_group_ids" {
  description = "List of security group IDs to attach to the ALB"
  type        = list(string)
  default     = []
}

variable "ssl_policy" {
  description = "SSL policy for HTTPS listeners"
  type        = string
  default     = "ELBSecurityPolicy-TLS13-1-2-2021-06"
}

variable "certificate_arn" {
  description = "ARN of the ACM certificate for HTTPS"
  type        = string
  default     = ""
}

variable "enable_deletion_protection" {
  description = "Enable deletion protection for the ALB"
  type        = bool
  default     = false
}

variable "enable_access_logs" {
  description = "Enable access logs for the ALB"
  type        = bool
  default     = true
}

variable "access_logs_bucket" {
  description = "S3 bucket for ALB access logs"
  type        = string
  default     = ""
}

variable "access_logs_prefix" {
  description = "S3 prefix for ALB access logs"
  type        = string
  default     = "alb-logs"
}

variable "idle_timeout" {
  description = "Idle timeout for the ALB in seconds"
  type        = number
  default     = 60
}

variable "drop_invalid_header_fields" {
  description = "Whether to drop invalid header fields"
  type        = bool
  default     = true
}

variable "enable_http2" {
  description = "Enable HTTP/2 for the ALB"
  type        = bool
  default     = true
}

variable "enable_waf" {
  description = "Enable WAF association for the ALB"
  type        = bool
  default     = true
}

variable "waf_acl_arn" {
  description = "ARN of the WAF ACL to associate with the ALB"
  type        = string
  default     = ""
}

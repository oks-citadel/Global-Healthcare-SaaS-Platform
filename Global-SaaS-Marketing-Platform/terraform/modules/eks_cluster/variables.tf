################################################################################
# Variables - EKS Cluster Module
# Global SaaS Marketing Platform
################################################################################

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

################################################################################
# Cluster Configuration
################################################################################

variable "cluster_version" {
  description = "Kubernetes version for the EKS cluster"
  type        = string
  default     = "1.29"
}

variable "subnet_ids" {
  description = "Subnet IDs for the EKS cluster"
  type        = list(string)
}

variable "node_subnet_ids" {
  description = "Subnet IDs for EKS node groups"
  type        = list(string)
}

variable "cluster_security_group_id" {
  description = "Security group ID for the EKS cluster"
  type        = string
}

variable "node_security_group_id" {
  description = "Security group ID for EKS nodes"
  type        = string
}

variable "kms_key_arn" {
  description = "KMS key ARN for encrypting EKS secrets"
  type        = string
}

variable "cluster_endpoint_private_access" {
  description = "Enable private API server endpoint"
  type        = bool
  default     = true
}

variable "cluster_endpoint_public_access" {
  description = "Enable public API server endpoint"
  type        = bool
  default     = true
}

variable "cluster_endpoint_public_access_cidrs" {
  description = "CIDR blocks allowed to access public API endpoint"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "service_ipv4_cidr" {
  description = "CIDR block for Kubernetes services"
  type        = string
  default     = "172.20.0.0/16"
}

variable "cluster_enabled_log_types" {
  description = "List of control plane log types to enable"
  type        = list(string)
  default     = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
}

variable "cluster_log_retention_days" {
  description = "Number of days to retain cluster logs"
  type        = number
  default     = 30
}

################################################################################
# Node Groups Configuration
################################################################################

variable "node_groups" {
  description = "Map of EKS managed node group configurations"
  type = map(object({
    instance_types             = list(string)
    capacity_type              = string
    disk_size                  = number
    ami_type                   = string
    desired_size               = number
    max_size                   = number
    min_size                   = number
    max_unavailable_percentage = number
    labels                     = map(string)
    taints = list(object({
      key    = string
      value  = string
      effect = string
    }))
  }))
  default = {
    general = {
      instance_types             = ["m6i.large", "m6a.large"]
      capacity_type              = "ON_DEMAND"
      disk_size                  = 100
      ami_type                   = "AL2_x86_64"
      desired_size               = 2
      max_size                   = 10
      min_size                   = 2
      max_unavailable_percentage = 25
      labels                     = {}
      taints                     = []
    }
  }
}

################################################################################
# Fargate Configuration
################################################################################

variable "fargate_profiles" {
  description = "Map of Fargate profile configurations"
  type = map(object({
    selectors = list(object({
      namespace = string
      labels    = map(string)
    }))
  }))
  default = {}
}

################################################################################
# Addon Versions
################################################################################

variable "vpc_cni_version" {
  description = "Version of VPC CNI addon"
  type        = string
  default     = null
}

variable "coredns_version" {
  description = "Version of CoreDNS addon"
  type        = string
  default     = null
}

variable "coredns_replicas" {
  description = "Number of CoreDNS replicas"
  type        = number
  default     = 2
}

variable "kube_proxy_version" {
  description = "Version of kube-proxy addon"
  type        = string
  default     = null
}

variable "ebs_csi_driver_version" {
  description = "Version of EBS CSI driver addon"
  type        = string
  default     = null
}

variable "efs_csi_driver_version" {
  description = "Version of EFS CSI driver addon"
  type        = string
  default     = null
}

variable "cloudwatch_observability_version" {
  description = "Version of CloudWatch observability addon"
  type        = string
  default     = null
}

variable "pod_identity_agent_version" {
  description = "Version of Pod Identity agent addon"
  type        = string
  default     = null
}

variable "guardduty_agent_version" {
  description = "Version of GuardDuty agent addon"
  type        = string
  default     = null
}

################################################################################
# Addon Toggles
################################################################################

variable "enable_ebs_csi_driver" {
  description = "Enable EBS CSI driver addon"
  type        = bool
  default     = true
}

variable "enable_efs_csi_driver" {
  description = "Enable EFS CSI driver addon"
  type        = bool
  default     = true
}

variable "enable_cloudwatch_observability" {
  description = "Enable CloudWatch observability addon"
  type        = bool
  default     = true
}

variable "enable_pod_identity_agent" {
  description = "Enable Pod Identity agent addon"
  type        = bool
  default     = true
}

variable "enable_guardduty_agent" {
  description = "Enable GuardDuty agent addon"
  type        = bool
  default     = true
}

################################################################################
# IRSA Toggles
################################################################################

variable "enable_aws_load_balancer_controller" {
  description = "Enable AWS Load Balancer Controller IRSA"
  type        = bool
  default     = true
}

variable "enable_cluster_autoscaler" {
  description = "Enable Cluster Autoscaler IRSA"
  type        = bool
  default     = true
}

variable "enable_external_dns" {
  description = "Enable External DNS IRSA"
  type        = bool
  default     = true
}

variable "enable_cert_manager" {
  description = "Enable Cert Manager IRSA"
  type        = bool
  default     = true
}

################################################################################
# Application IRSA
################################################################################

variable "application_irsa_roles" {
  description = "Map of application IRSA role configurations"
  type = map(object({
    namespace       = string
    service_account = string
    policy_json     = string
  }))
  default = {}
}

################################################################################
# Tags
################################################################################

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}

# ============================================
# EKS Module Variables
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
  description = "Subnet IDs for EKS"
  type        = list(string)
}

variable "cluster_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.29"
}

variable "endpoint_public_access" {
  description = "Enable public API endpoint"
  type        = bool
  default     = true
}

variable "public_access_cidrs" {
  description = "CIDR blocks allowed to access public API endpoint"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "enabled_cluster_log_types" {
  description = "Cluster log types to enable"
  type        = list(string)
  default     = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 90
}

variable "kms_key_arn" {
  description = "KMS key ARN for encryption (leave empty to create new)"
  type        = string
  default     = ""
}

# System Node Group
variable "system_node_instance_types" {
  description = "Instance types for system node group"
  type        = list(string)
  default     = ["m6i.large"]
}

variable "system_node_desired_size" {
  description = "Desired size for system node group"
  type        = number
  default     = 2
}

variable "system_node_min_size" {
  description = "Minimum size for system node group"
  type        = number
  default     = 2
}

variable "system_node_max_size" {
  description = "Maximum size for system node group"
  type        = number
  default     = 4
}

# Application Node Group
variable "app_node_instance_types" {
  description = "Instance types for application node group"
  type        = list(string)
  default     = ["m6i.xlarge", "m6i.2xlarge"]
}

variable "app_node_desired_size" {
  description = "Desired size for application node group"
  type        = number
  default     = 3
}

variable "app_node_min_size" {
  description = "Minimum size for application node group"
  type        = number
  default     = 2
}

variable "app_node_max_size" {
  description = "Maximum size for application node group"
  type        = number
  default     = 10
}

variable "app_node_capacity_type" {
  description = "Capacity type for application nodes (ON_DEMAND or SPOT)"
  type        = string
  default     = "ON_DEMAND"
}

variable "node_disk_size" {
  description = "Disk size for nodes in GB"
  type        = number
  default     = 100
}

# Add-on versions
variable "vpc_cni_version" {
  description = "VPC CNI add-on version"
  type        = string
  default     = "v1.18.5-eksbuild.1"
}

variable "coredns_version" {
  description = "CoreDNS add-on version"
  type        = string
  default     = "v1.11.3-eksbuild.1"
}

variable "kube_proxy_version" {
  description = "kube-proxy add-on version"
  type        = string
  default     = "v1.29.7-eksbuild.5"
}

variable "ebs_csi_version" {
  description = "EBS CSI driver add-on version"
  type        = string
  default     = "v1.36.0-eksbuild.1"
}

variable "tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}

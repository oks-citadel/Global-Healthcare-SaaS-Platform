# ============================================
# EKS Module Outputs
# ============================================

output "cluster_id" {
  description = "EKS cluster ID"
  value       = aws_eks_cluster.main.id
}

output "cluster_name" {
  description = "EKS cluster name"
  value       = aws_eks_cluster.main.name
}

output "cluster_arn" {
  description = "EKS cluster ARN"
  value       = aws_eks_cluster.main.arn
}

output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = aws_eks_cluster.main.endpoint
}

output "cluster_ca_certificate" {
  description = "EKS cluster CA certificate"
  value       = aws_eks_cluster.main.certificate_authority[0].data
}

output "cluster_version" {
  description = "EKS cluster version"
  value       = aws_eks_cluster.main.version
}

output "cluster_security_group_id" {
  description = "EKS cluster security group ID"
  value       = aws_security_group.cluster.id
}

output "node_security_group_id" {
  description = "EKS node security group ID"
  value       = aws_security_group.node.id
}

output "node_role_arn" {
  description = "EKS node IAM role ARN"
  value       = aws_iam_role.node.arn
}

output "cluster_role_arn" {
  description = "EKS cluster IAM role ARN"
  value       = aws_iam_role.cluster.arn
}

output "oidc_provider_arn" {
  description = "OIDC provider ARN for IRSA"
  value       = aws_iam_openid_connect_provider.eks.arn
}

output "oidc_provider_url" {
  description = "OIDC provider URL"
  value       = aws_eks_cluster.main.identity[0].oidc[0].issuer
}

output "system_node_group_name" {
  description = "System node group name"
  value       = aws_eks_node_group.system.node_group_name
}

output "application_node_group_name" {
  description = "Application node group name"
  value       = aws_eks_node_group.application.node_group_name
}

output "kms_key_arn" {
  description = "KMS key ARN used for encryption"
  value       = var.kms_key_arn != "" ? var.kms_key_arn : try(aws_kms_key.eks[0].arn, "")
}

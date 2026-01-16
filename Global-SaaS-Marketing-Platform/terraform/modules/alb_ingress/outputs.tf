################################################################################
# ALB Ingress Controller Module - Outputs
# Global SaaS Marketing Platform
################################################################################

output "controller_role_arn" {
  description = "ARN of the IAM role for the AWS Load Balancer Controller"
  value       = aws_iam_role.alb_controller.arn
}

output "controller_role_name" {
  description = "Name of the IAM role for the AWS Load Balancer Controller"
  value       = aws_iam_role.alb_controller.name
}

output "controller_policy_arn" {
  description = "ARN of the IAM policy for the AWS Load Balancer Controller"
  value       = aws_iam_policy.alb_controller.arn
}

output "service_account_name" {
  description = "Name of the Kubernetes service account for the controller"
  value       = local.controller_name
}

output "controller_namespace" {
  description = "Namespace where the controller is installed"
  value       = local.namespace
}

output "ingress_class_name" {
  description = "Name of the IngressClass for ALB"
  value       = var.create_ingress_class ? kubernetes_ingress_class_v1.alb[0].metadata[0].name : null
}

output "target_group_arns" {
  description = "Map of target group ARNs"
  value       = { for k, v in aws_lb_target_group.services : k => v.arn }
}

output "target_group_names" {
  description = "Map of target group names"
  value       = { for k, v in aws_lb_target_group.services : k => v.name }
}

output "target_group_arn_suffixes" {
  description = "Map of target group ARN suffixes for use with CloudWatch"
  value       = { for k, v in aws_lb_target_group.services : k => v.arn_suffix }
}

output "helm_release_name" {
  description = "Name of the Helm release"
  value       = var.install_controller ? helm_release.alb_controller[0].name : null
}

output "helm_release_version" {
  description = "Version of the installed Helm chart"
  value       = var.install_controller ? helm_release.alb_controller[0].version : null
}

output "helm_release_status" {
  description = "Status of the Helm release"
  value       = var.install_controller ? helm_release.alb_controller[0].status : null
}

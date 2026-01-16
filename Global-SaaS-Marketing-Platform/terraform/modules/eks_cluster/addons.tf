################################################################################
# EKS Addons
# Global SaaS Marketing Platform - EKS Cluster Module
################################################################################

################################################################################
# VPC CNI Addon
################################################################################

resource "aws_eks_addon" "vpc_cni" {
  cluster_name                = aws_eks_cluster.main.name
  addon_name                  = "vpc-cni"
  addon_version               = var.vpc_cni_version
  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"

  configuration_values = jsonencode({
    enableNetworkPolicy = "true"
    env = {
      ENABLE_PREFIX_DELEGATION          = "true"
      WARM_PREFIX_TARGET                = "1"
      ENABLE_POD_ENI                    = "true"
      POD_SECURITY_GROUP_ENFORCING_MODE = "standard"
    }
  })

  tags = local.common_tags

  depends_on = [aws_eks_node_group.main]
}

################################################################################
# CoreDNS Addon
################################################################################

resource "aws_eks_addon" "coredns" {
  cluster_name                = aws_eks_cluster.main.name
  addon_name                  = "coredns"
  addon_version               = var.coredns_version
  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"

  configuration_values = jsonencode({
    replicaCount = var.coredns_replicas
    resources = {
      limits = {
        cpu    = "100m"
        memory = "150Mi"
      }
      requests = {
        cpu    = "100m"
        memory = "150Mi"
      }
    }
  })

  tags = local.common_tags

  depends_on = [aws_eks_node_group.main]
}

################################################################################
# Kube Proxy Addon
################################################################################

resource "aws_eks_addon" "kube_proxy" {
  cluster_name                = aws_eks_cluster.main.name
  addon_name                  = "kube-proxy"
  addon_version               = var.kube_proxy_version
  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"

  tags = local.common_tags

  depends_on = [aws_eks_node_group.main]
}

################################################################################
# EBS CSI Driver Addon
################################################################################

resource "aws_eks_addon" "ebs_csi_driver" {
  count                       = var.enable_ebs_csi_driver ? 1 : 0
  cluster_name                = aws_eks_cluster.main.name
  addon_name                  = "aws-ebs-csi-driver"
  addon_version               = var.ebs_csi_driver_version
  service_account_role_arn    = aws_iam_role.ebs_csi_driver[0].arn
  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"

  configuration_values = jsonencode({
    controller = {
      serviceAccount = {
        create = true
        name   = "ebs-csi-controller-sa"
        annotations = {
          "eks.amazonaws.com/role-arn" = aws_iam_role.ebs_csi_driver[0].arn
        }
      }
    }
  })

  tags = local.common_tags

  depends_on = [aws_eks_node_group.main]
}

################################################################################
# EFS CSI Driver Addon
################################################################################

resource "aws_eks_addon" "efs_csi_driver" {
  count                       = var.enable_efs_csi_driver ? 1 : 0
  cluster_name                = aws_eks_cluster.main.name
  addon_name                  = "aws-efs-csi-driver"
  addon_version               = var.efs_csi_driver_version
  service_account_role_arn    = aws_iam_role.efs_csi_driver[0].arn
  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"

  tags = local.common_tags

  depends_on = [aws_eks_node_group.main]
}

################################################################################
# CloudWatch Observability Addon
################################################################################

resource "aws_eks_addon" "cloudwatch_observability" {
  count                       = var.enable_cloudwatch_observability ? 1 : 0
  cluster_name                = aws_eks_cluster.main.name
  addon_name                  = "amazon-cloudwatch-observability"
  addon_version               = var.cloudwatch_observability_version
  service_account_role_arn    = aws_iam_role.cloudwatch_observability[0].arn
  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"

  tags = local.common_tags

  depends_on = [aws_eks_node_group.main]
}

resource "aws_iam_role" "cloudwatch_observability" {
  count = var.enable_cloudwatch_observability ? 1 : 0
  name  = "${local.cluster_name}-cloudwatch-observability"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRoleWithWebIdentity"
      Effect = "Allow"
      Principal = {
        Federated = local.oidc_provider_arn
      }
      Condition = {
        StringEquals = {
          "${local.oidc_provider_url}:aud" = "sts.amazonaws.com"
          "${local.oidc_provider_url}:sub" = "system:serviceaccount:amazon-cloudwatch:cloudwatch-agent"
        }
      }
    }]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "cloudwatch_observability" {
  count      = var.enable_cloudwatch_observability ? 1 : 0
  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/CloudWatchAgentServerPolicy"
  role       = aws_iam_role.cloudwatch_observability[0].name
}

resource "aws_iam_role_policy_attachment" "cloudwatch_observability_xray" {
  count      = var.enable_cloudwatch_observability ? 1 : 0
  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/AWSXrayWriteOnlyAccess"
  role       = aws_iam_role.cloudwatch_observability[0].name
}

################################################################################
# Pod Identity Agent Addon
################################################################################

resource "aws_eks_addon" "pod_identity_agent" {
  count                       = var.enable_pod_identity_agent ? 1 : 0
  cluster_name                = aws_eks_cluster.main.name
  addon_name                  = "eks-pod-identity-agent"
  addon_version               = var.pod_identity_agent_version
  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"

  tags = local.common_tags

  depends_on = [aws_eks_node_group.main]
}

################################################################################
# GuardDuty Agent Addon
################################################################################

resource "aws_eks_addon" "guardduty_agent" {
  count                       = var.enable_guardduty_agent ? 1 : 0
  cluster_name                = aws_eks_cluster.main.name
  addon_name                  = "aws-guardduty-agent"
  addon_version               = var.guardduty_agent_version
  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"

  tags = local.common_tags

  depends_on = [aws_eks_node_group.main]
}

################################################################################
# ALB Ingress Controller Module - Main Configuration
# Global SaaS Marketing Platform
################################################################################

locals {
  common_tags = merge(var.tags, {
    Module = "alb_ingress"
  })

  controller_name = "aws-load-balancer-controller"
  namespace       = "kube-system"
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
data "aws_partition" "current" {}

################################################################################
# IAM Policy for AWS Load Balancer Controller
################################################################################

data "aws_iam_policy_document" "alb_controller" {
  statement {
    sid    = "IAMCreateServiceLinkedRole"
    effect = "Allow"
    actions = [
      "iam:CreateServiceLinkedRole"
    ]
    resources = ["*"]
    condition {
      test     = "StringEquals"
      variable = "iam:AWSServiceName"
      values   = ["elasticloadbalancing.amazonaws.com"]
    }
  }

  statement {
    sid    = "EC2Permissions"
    effect = "Allow"
    actions = [
      "ec2:DescribeAccountAttributes",
      "ec2:DescribeAddresses",
      "ec2:DescribeAvailabilityZones",
      "ec2:DescribeInternetGateways",
      "ec2:DescribeVpcs",
      "ec2:DescribeVpcPeeringConnections",
      "ec2:DescribeSubnets",
      "ec2:DescribeSecurityGroups",
      "ec2:DescribeInstances",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DescribeTags",
      "ec2:GetCoipPoolUsage",
      "ec2:DescribeCoipPools",
      "elasticloadbalancing:DescribeLoadBalancers",
      "elasticloadbalancing:DescribeLoadBalancerAttributes",
      "elasticloadbalancing:DescribeListeners",
      "elasticloadbalancing:DescribeListenerCertificates",
      "elasticloadbalancing:DescribeSSLPolicies",
      "elasticloadbalancing:DescribeRules",
      "elasticloadbalancing:DescribeTargetGroups",
      "elasticloadbalancing:DescribeTargetGroupAttributes",
      "elasticloadbalancing:DescribeTargetHealth",
      "elasticloadbalancing:DescribeTags",
      "elasticloadbalancing:DescribeTrustStores"
    ]
    resources = ["*"]
  }

  statement {
    sid    = "CognitoPermissions"
    effect = "Allow"
    actions = [
      "cognito-idp:DescribeUserPoolClient",
      "acm:ListCertificates",
      "acm:DescribeCertificate",
      "iam:ListServerCertificates",
      "iam:GetServerCertificate",
      "waf-regional:GetWebACL",
      "waf-regional:GetWebACLForResource",
      "waf-regional:AssociateWebACL",
      "waf-regional:DisassociateWebACL",
      "wafv2:GetWebACL",
      "wafv2:GetWebACLForResource",
      "wafv2:AssociateWebACL",
      "wafv2:DisassociateWebACL",
      "shield:GetSubscriptionState",
      "shield:DescribeProtection",
      "shield:CreateProtection",
      "shield:DeleteProtection"
    ]
    resources = ["*"]
  }

  statement {
    sid    = "EC2CreateSecurityGroup"
    effect = "Allow"
    actions = [
      "ec2:AuthorizeSecurityGroupIngress",
      "ec2:RevokeSecurityGroupIngress"
    ]
    resources = ["*"]
  }

  statement {
    sid    = "EC2CreateSecurityGroupWithTag"
    effect = "Allow"
    actions = [
      "ec2:CreateSecurityGroup"
    ]
    resources = ["*"]
  }

  statement {
    sid    = "EC2CreateTags"
    effect = "Allow"
    actions = [
      "ec2:CreateTags"
    ]
    resources = ["arn:${data.aws_partition.current.partition}:ec2:*:*:security-group/*"]
    condition {
      test     = "StringEquals"
      variable = "ec2:CreateAction"
      values   = ["CreateSecurityGroup"]
    }
    condition {
      test     = "Null"
      variable = "aws:RequestTag/elbv2.k8s.aws/cluster"
      values   = ["false"]
    }
  }

  statement {
    sid    = "EC2CreateTagsAny"
    effect = "Allow"
    actions = [
      "ec2:CreateTags",
      "ec2:DeleteTags"
    ]
    resources = ["arn:${data.aws_partition.current.partition}:ec2:*:*:security-group/*"]
    condition {
      test     = "Null"
      variable = "aws:RequestTag/elbv2.k8s.aws/cluster"
      values   = ["true"]
    }
    condition {
      test     = "Null"
      variable = "aws:ResourceTag/elbv2.k8s.aws/cluster"
      values   = ["false"]
    }
  }

  statement {
    sid    = "EC2SecurityGroupModify"
    effect = "Allow"
    actions = [
      "ec2:AuthorizeSecurityGroupIngress",
      "ec2:RevokeSecurityGroupIngress",
      "ec2:DeleteSecurityGroup"
    ]
    resources = ["*"]
    condition {
      test     = "Null"
      variable = "aws:ResourceTag/elbv2.k8s.aws/cluster"
      values   = ["false"]
    }
  }

  statement {
    sid    = "ELBCreateLoadBalancer"
    effect = "Allow"
    actions = [
      "elasticloadbalancing:CreateLoadBalancer",
      "elasticloadbalancing:CreateTargetGroup"
    ]
    resources = ["*"]
    condition {
      test     = "Null"
      variable = "aws:RequestTag/elbv2.k8s.aws/cluster"
      values   = ["false"]
    }
  }

  statement {
    sid    = "ELBCreateListener"
    effect = "Allow"
    actions = [
      "elasticloadbalancing:CreateListener",
      "elasticloadbalancing:DeleteListener",
      "elasticloadbalancing:CreateRule",
      "elasticloadbalancing:DeleteRule"
    ]
    resources = ["*"]
  }

  statement {
    sid    = "ELBAddTags"
    effect = "Allow"
    actions = [
      "elasticloadbalancing:AddTags",
      "elasticloadbalancing:RemoveTags"
    ]
    resources = [
      "arn:${data.aws_partition.current.partition}:elasticloadbalancing:*:*:targetgroup/*/*",
      "arn:${data.aws_partition.current.partition}:elasticloadbalancing:*:*:loadbalancer/net/*/*",
      "arn:${data.aws_partition.current.partition}:elasticloadbalancing:*:*:loadbalancer/app/*/*"
    ]
    condition {
      test     = "Null"
      variable = "aws:RequestTag/elbv2.k8s.aws/cluster"
      values   = ["true"]
    }
    condition {
      test     = "Null"
      variable = "aws:ResourceTag/elbv2.k8s.aws/cluster"
      values   = ["false"]
    }
  }

  statement {
    sid    = "ELBAddTagsOnCreate"
    effect = "Allow"
    actions = [
      "elasticloadbalancing:AddTags",
      "elasticloadbalancing:RemoveTags"
    ]
    resources = [
      "arn:${data.aws_partition.current.partition}:elasticloadbalancing:*:*:listener/net/*/*/*",
      "arn:${data.aws_partition.current.partition}:elasticloadbalancing:*:*:listener/app/*/*/*",
      "arn:${data.aws_partition.current.partition}:elasticloadbalancing:*:*:listener-rule/net/*/*/*",
      "arn:${data.aws_partition.current.partition}:elasticloadbalancing:*:*:listener-rule/app/*/*/*"
    ]
  }

  statement {
    sid    = "ELBModifyResources"
    effect = "Allow"
    actions = [
      "elasticloadbalancing:ModifyLoadBalancerAttributes",
      "elasticloadbalancing:SetIpAddressType",
      "elasticloadbalancing:SetSecurityGroups",
      "elasticloadbalancing:SetSubnets",
      "elasticloadbalancing:DeleteLoadBalancer",
      "elasticloadbalancing:ModifyTargetGroup",
      "elasticloadbalancing:ModifyTargetGroupAttributes",
      "elasticloadbalancing:DeleteTargetGroup"
    ]
    resources = ["*"]
    condition {
      test     = "Null"
      variable = "aws:ResourceTag/elbv2.k8s.aws/cluster"
      values   = ["false"]
    }
  }

  statement {
    sid    = "ELBAddTagsToNew"
    effect = "Allow"
    actions = [
      "elasticloadbalancing:AddTags"
    ]
    resources = [
      "arn:${data.aws_partition.current.partition}:elasticloadbalancing:*:*:targetgroup/*/*",
      "arn:${data.aws_partition.current.partition}:elasticloadbalancing:*:*:loadbalancer/net/*/*",
      "arn:${data.aws_partition.current.partition}:elasticloadbalancing:*:*:loadbalancer/app/*/*"
    ]
    condition {
      test     = "StringEquals"
      variable = "elasticloadbalancing:CreateAction"
      values = [
        "CreateTargetGroup",
        "CreateLoadBalancer"
      ]
    }
    condition {
      test     = "Null"
      variable = "aws:RequestTag/elbv2.k8s.aws/cluster"
      values   = ["false"]
    }
  }

  statement {
    sid    = "ELBRegisterTargets"
    effect = "Allow"
    actions = [
      "elasticloadbalancing:RegisterTargets",
      "elasticloadbalancing:DeregisterTargets"
    ]
    resources = ["arn:${data.aws_partition.current.partition}:elasticloadbalancing:*:*:targetgroup/*/*"]
  }

  statement {
    sid    = "ELBSetCertificates"
    effect = "Allow"
    actions = [
      "elasticloadbalancing:SetWebAcl",
      "elasticloadbalancing:ModifyListener",
      "elasticloadbalancing:AddListenerCertificates",
      "elasticloadbalancing:RemoveListenerCertificates",
      "elasticloadbalancing:ModifyRule"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "alb_controller" {
  name        = "${var.cluster_name}-alb-controller-policy"
  description = "IAM policy for AWS Load Balancer Controller"
  policy      = data.aws_iam_policy_document.alb_controller.json

  tags = local.common_tags
}

################################################################################
# IAM Role for AWS Load Balancer Controller (IRSA)
################################################################################

resource "aws_iam_role" "alb_controller" {
  name = "${var.cluster_name}-alb-controller-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRoleWithWebIdentity"
      Effect = "Allow"
      Principal = {
        Federated = var.oidc_provider_arn
      }
      Condition = {
        StringEquals = {
          "${replace(var.oidc_provider_url, "https://", "")}:sub" = "system:serviceaccount:${local.namespace}:${local.controller_name}"
          "${replace(var.oidc_provider_url, "https://", "")}:aud" = "sts.amazonaws.com"
        }
      }
    }]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "alb_controller" {
  role       = aws_iam_role.alb_controller.name
  policy_arn = aws_iam_policy.alb_controller.arn
}

################################################################################
# Kubernetes Service Account for AWS Load Balancer Controller
################################################################################

resource "kubernetes_service_account" "alb_controller" {
  count = var.create_service_account ? 1 : 0

  metadata {
    name      = local.controller_name
    namespace = local.namespace
    annotations = {
      "eks.amazonaws.com/role-arn" = aws_iam_role.alb_controller.arn
    }
    labels = {
      "app.kubernetes.io/name"       = local.controller_name
      "app.kubernetes.io/component"  = "controller"
      "app.kubernetes.io/managed-by" = "terraform"
    }
  }

  automount_service_account_token = true
}

################################################################################
# Helm Release - AWS Load Balancer Controller
################################################################################

resource "helm_release" "alb_controller" {
  count = var.install_controller ? 1 : 0

  name       = local.controller_name
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  version    = var.controller_version
  namespace  = local.namespace

  set {
    name  = "clusterName"
    value = var.cluster_name
  }

  set {
    name  = "serviceAccount.create"
    value = "false"
  }

  set {
    name  = "serviceAccount.name"
    value = local.controller_name
  }

  set {
    name  = "region"
    value = data.aws_region.current.name
  }

  set {
    name  = "vpcId"
    value = var.vpc_id
  }

  set {
    name  = "replicaCount"
    value = var.controller_replica_count
  }

  set {
    name  = "enableServiceMutatorWebhook"
    value = "false"
  }

  dynamic "set" {
    for_each = var.controller_resources_requests_cpu != null ? [1] : []
    content {
      name  = "resources.requests.cpu"
      value = var.controller_resources_requests_cpu
    }
  }

  dynamic "set" {
    for_each = var.controller_resources_requests_memory != null ? [1] : []
    content {
      name  = "resources.requests.memory"
      value = var.controller_resources_requests_memory
    }
  }

  dynamic "set" {
    for_each = var.controller_resources_limits_cpu != null ? [1] : []
    content {
      name  = "resources.limits.cpu"
      value = var.controller_resources_limits_cpu
    }
  }

  dynamic "set" {
    for_each = var.controller_resources_limits_memory != null ? [1] : []
    content {
      name  = "resources.limits.memory"
      value = var.controller_resources_limits_memory
    }
  }

  depends_on = [kubernetes_service_account.alb_controller]
}

################################################################################
# IngressClass for ALB
################################################################################

resource "kubernetes_ingress_class_v1" "alb" {
  count = var.create_ingress_class ? 1 : 0

  metadata {
    name = "alb"
    annotations = {
      "ingressclass.kubernetes.io/is-default-class" = var.is_default_ingress_class ? "true" : "false"
    }
  }

  spec {
    controller = "ingress.k8s.aws/alb"
  }

  depends_on = [helm_release.alb_controller]
}

################################################################################
# Default Target Group Configurations
################################################################################

resource "aws_lb_target_group" "services" {
  for_each = var.target_groups

  name        = "${var.cluster_name}-${each.key}"
  port        = each.value.port
  protocol    = each.value.protocol
  vpc_id      = var.vpc_id
  target_type = each.value.target_type

  health_check {
    enabled             = true
    healthy_threshold   = lookup(each.value, "healthy_threshold", 3)
    unhealthy_threshold = lookup(each.value, "unhealthy_threshold", 3)
    timeout             = lookup(each.value, "health_check_timeout", 5)
    interval            = lookup(each.value, "health_check_interval", 30)
    path                = lookup(each.value, "health_check_path", "/health")
    port                = lookup(each.value, "health_check_port", "traffic-port")
    protocol            = lookup(each.value, "health_check_protocol", "HTTP")
    matcher             = lookup(each.value, "health_check_matcher", "200")
  }

  deregistration_delay = lookup(each.value, "deregistration_delay", 300)

  stickiness {
    type            = lookup(each.value, "stickiness_type", "lb_cookie")
    enabled         = lookup(each.value, "stickiness_enabled", false)
    cookie_duration = lookup(each.value, "stickiness_duration", 86400)
  }

  tags = merge(local.common_tags, {
    Name    = "${var.cluster_name}-${each.key}"
    Service = each.key
  })

  lifecycle {
    create_before_destroy = true
  }
}

# ============================================
# Scheduled Production Deployment
# The Unified Health Platform
# ============================================
# Deploys latest ECR images to EKS at 9:00 PM daily
# Builds continue throughout the day, deployment is unified
# ============================================

# EventBridge Rule - 9:00 PM UTC daily (adjust for your timezone)
# For US Eastern (EST/EDT), 9 PM = 01:00 or 02:00 UTC next day
resource "aws_cloudwatch_event_rule" "scheduled_deployment" {
  count = var.enable_scheduled_deployment ? 1 : 0

  name                = "${local.name_prefix}-scheduled-deployment"
  description         = "Trigger daily production deployment at 9 PM"
  schedule_expression = "cron(0 2 * * ? *)" # 9 PM EST = 2 AM UTC

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-scheduled-deployment-rule"
  })
}

# EventBridge Target - CodeBuild Project
resource "aws_cloudwatch_event_target" "deploy_target" {
  count = var.enable_scheduled_deployment ? 1 : 0

  rule      = aws_cloudwatch_event_rule.scheduled_deployment[0].name
  target_id = "ScheduledDeploy"
  arn       = aws_codebuild_project.scheduled_deploy[0].arn
  role_arn  = aws_iam_role.eventbridge_codebuild[0].arn
}

# IAM Role for EventBridge to trigger CodeBuild
resource "aws_iam_role" "eventbridge_codebuild" {
  count = var.enable_scheduled_deployment ? 1 : 0

  name = "${local.name_prefix}-eventbridge-codebuild"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "events.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy" "eventbridge_codebuild" {
  count = var.enable_scheduled_deployment ? 1 : 0

  name = "${local.name_prefix}-eventbridge-codebuild-policy"
  role = aws_iam_role.eventbridge_codebuild[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "codebuild:StartBuild"
        ]
        Resource = aws_codebuild_project.scheduled_deploy[0].arn
      }
    ]
  })
}

# CodeBuild Project for Deployment
resource "aws_codebuild_project" "scheduled_deploy" {
  count = var.enable_scheduled_deployment ? 1 : 0

  name          = "${local.name_prefix}-scheduled-deploy"
  description   = "Deploys latest images to EKS at scheduled time"
  build_timeout = 30
  service_role  = aws_iam_role.codebuild_deploy[0].arn

  artifacts {
    type = "NO_ARTIFACTS"
  }

  environment {
    compute_type    = "BUILD_GENERAL1_SMALL"
    image           = "aws/codebuild/amazonlinux2-x86_64-standard:5.0"
    type            = "LINUX_CONTAINER"
    privileged_mode = false

    environment_variable {
      name  = "CLUSTER_NAME"
      value = var.eks_cluster_name
    }

    environment_variable {
      name  = "NAMESPACE"
      value = "unified-health"
    }

    environment_variable {
      name  = "AWS_ACCOUNT_ID"
      value = data.aws_caller_identity.current.account_id
    }
  }

  source {
    type      = "NO_SOURCE"
    buildspec = <<-BUILDSPEC
      version: 0.2
      phases:
        install:
          commands:
            - echo "Installing kubectl..."
            - curl -LO "https://dl.k8s.io/release/v1.29.0/bin/linux/amd64/kubectl"
            - chmod +x kubectl && mv kubectl /usr/local/bin/
        pre_build:
          commands:
            - echo "Configuring kubectl..."
            - aws eks update-kubeconfig --name $CLUSTER_NAME --region $AWS_DEFAULT_REGION
        build:
          commands:
            - echo "=== Scheduled Deployment - $(date) ==="
            - |
              SERVICES="api:unified-health-prod/api web:unified-health-prod/web-app"
              for svc in $SERVICES; do
                NAME=$(echo $svc | cut -d: -f1)
                REPO=$(echo $svc | cut -d: -f2)
                TAG=$(aws ecr describe-images --repository-name $REPO --query 'sort_by(imageDetails, &imagePushedAt)[-1].imageTags[0]' --output text)
                if [ "$TAG" != "None" ] && [ -n "$TAG" ]; then
                  IMAGE="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$REPO:$TAG"
                  CURRENT=$(kubectl get deployment $NAME -n $NAMESPACE -o jsonpath='{.spec.template.spec.containers[0].image}' 2>/dev/null || echo "none")
                  if [ "$CURRENT" != "$IMAGE" ]; then
                    echo "Deploying $NAME: $IMAGE"
                    kubectl set image deployment/$NAME $NAME=$IMAGE -n $NAMESPACE
                    kubectl rollout status deployment/$NAME -n $NAMESPACE --timeout=300s
                  else
                    echo "$NAME already at latest: $TAG"
                  fi
                fi
              done
            - echo "=== Deployment Complete ==="
        post_build:
          commands:
            - kubectl get pods -n $NAMESPACE
    BUILDSPEC
  }

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-scheduled-deploy"
  })
}

# IAM Role for CodeBuild Deployment
resource "aws_iam_role" "codebuild_deploy" {
  count = var.enable_scheduled_deployment ? 1 : 0

  name = "${local.name_prefix}-codebuild-deploy"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "codebuild.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "codebuild_deploy_ecr" {
  count = var.enable_scheduled_deployment ? 1 : 0

  role       = aws_iam_role.codebuild_deploy[0].name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_role_policy" "codebuild_deploy" {
  count = var.enable_scheduled_deployment ? 1 : 0

  name = "${local.name_prefix}-codebuild-deploy-policy"
  role = aws_iam_role.codebuild_deploy[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "eks:DescribeCluster",
          "eks:ListClusters"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:DescribeImages"
        ]
        Resource = "*"
      }
    ]
  })
}

# Add CodeBuild role to EKS aws-auth ConfigMap
# This needs to be done separately - see EKS module or manual kubectl command:
# kubectl edit configmap aws-auth -n kube-system
# Add the role ARN to mapRoles

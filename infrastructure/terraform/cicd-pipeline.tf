# ============================================
# UnifiedHealth Platform - AWS CI/CD Pipeline
# ============================================
# AWS CodePipeline with CodeBuild and ECR
# GitHub → CodePipeline → CodeBuild → ECR → EKS
# ============================================

# ============================================
# CodeBuild IAM Role
# ============================================

resource "aws_iam_role" "codebuild" {
  name = "${local.name_prefix}-codebuild-role"

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

resource "aws_iam_role_policy" "codebuild" {
  name = "${local.name_prefix}-codebuild-policy"
  role = aws_iam_role.codebuild.id

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
        Resource = [
          "arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:log-group:/aws/codebuild/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload"
        ]
        Resource = "arn:aws:ecr:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:repository/${local.name_prefix}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:GetObjectVersion",
          "s3:PutObject"
        ]
        Resource = [
          "${aws_s3_bucket.codepipeline.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = [
          "arn:aws:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:${local.name_prefix}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "eks:DescribeCluster"
        ]
        Resource = aws_eks_cluster.main.arn
      }
    ]
  })
}

# ============================================
# CodePipeline S3 Bucket for Artifacts
# ============================================

resource "aws_s3_bucket" "codepipeline" {
  bucket = "${local.name_prefix}-codepipeline-${data.aws_caller_identity.current.account_id}"

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-codepipeline-artifacts"
  })
}

resource "aws_s3_bucket_versioning" "codepipeline" {
  bucket = aws_s3_bucket.codepipeline.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "codepipeline" {
  bucket = aws_s3_bucket.codepipeline.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.secrets.arn
      sse_algorithm     = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "codepipeline" {
  bucket = aws_s3_bucket.codepipeline.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ============================================
# CodeBuild Projects for Each Service
# ============================================

locals {
  services = {
    "api-gateway"          = { path = "services/api-gateway", port = 3000 }
    "auth-service"         = { path = "services/auth-service", port = 3001 }
    "api"                  = { path = "services/api", port = 8080 }
    "telehealth-service"   = { path = "services/telehealth-service", port = 3001 }
    "mental-health-service" = { path = "services/mental-health-service", port = 3002 }
    "chronic-care-service" = { path = "services/chronic-care-service", port = 3003 }
    "pharmacy-service"     = { path = "services/pharmacy-service", port = 3004 }
    "laboratory-service"   = { path = "services/laboratory-service", port = 3005 }
    "imaging-service"      = { path = "services/imaging-service", port = 3006 }
    "notification-service" = { path = "services/notification-service", port = 3007 }
    "web-app"              = { path = "apps/web", port = 3000 }
    "provider-portal"      = { path = "apps/provider-portal", port = 3002 }
    "admin-portal"         = { path = "apps/admin", port = 3001 }
  }
}

resource "aws_codebuild_project" "services" {
  for_each = local.services

  name          = "${local.name_prefix}-${each.key}"
  description   = "Build and push ${each.key} Docker image to ECR"
  build_timeout = 30
  service_role  = aws_iam_role.codebuild.arn

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_MEDIUM"
    image                       = "aws/codebuild/amazonlinux2-x86_64-standard:5.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
    privileged_mode             = true

    environment_variable {
      name  = "AWS_ACCOUNT_ID"
      value = data.aws_caller_identity.current.account_id
    }

    environment_variable {
      name  = "AWS_REGION"
      value = data.aws_region.current.name
    }

    environment_variable {
      name  = "ECR_REPOSITORY"
      value = "${local.name_prefix}/${each.key}"
    }

    environment_variable {
      name  = "SERVICE_NAME"
      value = each.key
    }

    environment_variable {
      name  = "SERVICE_PATH"
      value = each.value.path
    }

    environment_variable {
      name  = "EKS_CLUSTER_NAME"
      value = aws_eks_cluster.main.name
    }
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = "buildspec.yml"
  }

  logs_config {
    cloudwatch_logs {
      group_name  = "/aws/codebuild/${local.name_prefix}"
      stream_name = each.key
    }
  }

  tags = merge(local.common_tags, {
    Service = each.key
  })
}

# ============================================
# CodeStar Connection for GitHub
# ============================================

resource "aws_codestarconnections_connection" "github" {
  name          = "${local.name_prefix}-github"
  provider_type = "GitHub"

  tags = local.common_tags
}

# ============================================
# CodePipeline IAM Role
# ============================================

resource "aws_iam_role" "codepipeline" {
  name = "${local.name_prefix}-codepipeline-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "codepipeline.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy" "codepipeline" {
  name = "${local.name_prefix}-codepipeline-policy"
  role = aws_iam_role.codepipeline.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:GetObjectVersion",
          "s3:GetBucketVersioning",
          "s3:PutObject"
        ]
        Resource = [
          aws_s3_bucket.codepipeline.arn,
          "${aws_s3_bucket.codepipeline.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "codestar-connections:UseConnection"
        ]
        Resource = aws_codestarconnections_connection.github.arn
      },
      {
        Effect = "Allow"
        Action = [
          "codebuild:BatchGetBuilds",
          "codebuild:StartBuild"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "eks:DescribeCluster"
        ]
        Resource = aws_eks_cluster.main.arn
      }
    ]
  })
}

# ============================================
# CodePipeline - Main Pipeline
# ============================================

resource "aws_codepipeline" "main" {
  name     = "${local.name_prefix}-pipeline"
  role_arn = aws_iam_role.codepipeline.arn

  artifact_store {
    location = aws_s3_bucket.codepipeline.bucket
    type     = "S3"

    encryption_key {
      id   = aws_kms_key.secrets.arn
      type = "KMS"
    }
  }

  stage {
    name = "Source"

    action {
      name             = "GitHub_Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeStarSourceConnection"
      version          = "1"
      output_artifacts = ["source_output"]

      configuration = {
        ConnectionArn    = aws_codestarconnections_connection.github.arn
        FullRepositoryId = var.github_repository
        BranchName       = var.github_branch
      }
    }
  }

  stage {
    name = "Build"

    dynamic "action" {
      for_each = local.services
      content {
        name             = "Build_${replace(action.key, "-", "_")}"
        category         = "Build"
        owner            = "AWS"
        provider         = "CodeBuild"
        input_artifacts  = ["source_output"]
        output_artifacts = ["build_output_${replace(action.key, "-", "_")}"]
        version          = "1"
        run_order        = 1

        configuration = {
          ProjectName = aws_codebuild_project.services[action.key].name
        }
      }
    }
  }

  tags = local.common_tags
}

# ============================================
# CloudWatch Event Rule for Pipeline Notifications
# ============================================

resource "aws_cloudwatch_event_rule" "pipeline_state" {
  name        = "${local.name_prefix}-pipeline-state"
  description = "Capture CodePipeline state changes"

  event_pattern = jsonencode({
    source      = ["aws.codepipeline"]
    detail-type = ["CodePipeline Pipeline Execution State Change"]
    detail = {
      pipeline = [aws_codepipeline.main.name]
      state    = ["FAILED", "SUCCEEDED"]
    }
  })

  tags = local.common_tags
}

resource "aws_cloudwatch_event_target" "pipeline_sns" {
  rule      = aws_cloudwatch_event_rule.pipeline_state.name
  target_id = "SendToSNS"
  arn       = aws_sns_topic.alerts.arn

  input_transformer {
    input_paths = {
      pipeline = "$.detail.pipeline"
      state    = "$.detail.state"
    }
    input_template = "\"Pipeline <pipeline> has <state>\""
  }
}

resource "aws_sns_topic_policy" "pipeline_events" {
  arn = aws_sns_topic.alerts.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudWatchEvents"
        Effect = "Allow"
        Principal = {
          Service = "events.amazonaws.com"
        }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.alerts.arn
      }
    ]
  })
}

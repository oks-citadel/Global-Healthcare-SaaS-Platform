# ============================================
# The Unified Health Platform - AWS CodePipeline
# ============================================
# CI/CD Pipeline: GitHub → CodeBuild → ECR → EKS
# Domain: theunifiedhealth.com
# ============================================

# --------------------------------------------
# S3 Bucket for Pipeline Artifacts
# --------------------------------------------
resource "aws_s3_bucket" "pipeline_artifacts" {
  bucket = "${var.project_name}-${var.environment}-pipeline-artifacts"

  tags = merge(var.tags, {
    Name = "${var.project_name}-pipeline-artifacts"
  })
}

resource "aws_s3_bucket_versioning" "pipeline_artifacts" {
  bucket = aws_s3_bucket.pipeline_artifacts.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "pipeline_artifacts" {
  bucket = aws_s3_bucket.pipeline_artifacts.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}

# --------------------------------------------
# IAM Role for CodePipeline
# --------------------------------------------
resource "aws_iam_role" "codepipeline" {
  name = "${var.project_name}-${var.environment}-codepipeline-role"

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

  tags = var.tags
}

resource "aws_iam_role_policy" "codepipeline" {
  name = "${var.project_name}-${var.environment}-codepipeline-policy"
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
          "s3:PutObject",
          "s3:PutObjectAcl"
        ]
        Resource = [
          aws_s3_bucket.pipeline_artifacts.arn,
          "${aws_s3_bucket.pipeline_artifacts.arn}/*"
        ]
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
          "codestar-connections:UseConnection"
        ]
        Resource = var.github_connection_arn
      },
      {
        Effect = "Allow"
        Action = [
          "eks:DescribeCluster"
        ]
        Resource = "*"
      }
    ]
  })
}

# --------------------------------------------
# IAM Role for CodeBuild
# --------------------------------------------
resource "aws_iam_role" "codebuild" {
  name = "${var.project_name}-${var.environment}-codebuild-role"

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

  tags = var.tags
}

resource "aws_iam_role_policy" "codebuild" {
  name = "${var.project_name}-${var.environment}-codebuild-policy"
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
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:GetObjectVersion",
          "s3:PutObject"
        ]
        Resource = [
          aws_s3_bucket.pipeline_artifacts.arn,
          "${aws_s3_bucket.pipeline_artifacts.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:CompleteLayerUpload",
          "ecr:GetAuthorizationToken",
          "ecr:InitiateLayerUpload",
          "ecr:PutImage",
          "ecr:UploadLayerPart",
          "ecr:BatchGetImage",
          "ecr:GetDownloadUrlForLayer"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "eks:DescribeCluster"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = "*"
      }
    ]
  })
}

# --------------------------------------------
# CodeBuild Projects
# --------------------------------------------

# Web App Build Project
resource "aws_codebuild_project" "web_app" {
  name          = "${var.project_name}-${var.environment}-web-app-build"
  description   = "Build The Unified Health web application"
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
      value = var.aws_account_id
    }

    environment_variable {
      name  = "AWS_REGION"
      value = var.aws_region
    }

    environment_variable {
      name  = "ECR_REPOSITORY"
      value = "unified-health-web-app"
    }

    environment_variable {
      name  = "SERVICE_NAME"
      value = "web-app"
    }

    environment_variable {
      name  = "SERVICE_PATH"
      value = "apps/web"
    }
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = "buildspec.yml"
  }

  tags = var.tags
}

# API Service Build Project
resource "aws_codebuild_project" "api_service" {
  name          = "${var.project_name}-${var.environment}-api-service-build"
  description   = "Build The Unified Health API service"
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
      value = var.aws_account_id
    }

    environment_variable {
      name  = "AWS_REGION"
      value = var.aws_region
    }

    environment_variable {
      name  = "ECR_REPOSITORY"
      value = "unified-health-api"
    }

    environment_variable {
      name  = "SERVICE_NAME"
      value = "api"
    }

    environment_variable {
      name  = "SERVICE_PATH"
      value = "services/api"
    }
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = "buildspec.yml"
  }

  tags = var.tags
}

# --------------------------------------------
# CodePipeline
# --------------------------------------------
resource "aws_codepipeline" "main" {
  name     = "${var.project_name}-${var.environment}-pipeline"
  role_arn = aws_iam_role.codepipeline.arn

  artifact_store {
    location = aws_s3_bucket.pipeline_artifacts.bucket
    type     = "S3"
  }

  # Stage 1: Source from GitHub
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
        ConnectionArn    = var.github_connection_arn
        FullRepositoryId = var.github_repository
        BranchName       = var.github_branch
      }
    }
  }

  # Stage 2: Build Docker Images
  stage {
    name = "Build"

    action {
      name             = "Build_Web_App"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["source_output"]
      output_artifacts = ["web_app_build_output"]
      version          = "1"
      run_order        = 1

      configuration = {
        ProjectName = aws_codebuild_project.web_app.name
      }
    }

    action {
      name             = "Build_API_Service"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["source_output"]
      output_artifacts = ["api_service_build_output"]
      version          = "1"
      run_order        = 1

      configuration = {
        ProjectName = aws_codebuild_project.api_service.name
      }
    }
  }

  # Stage 3: Deploy to EKS
  stage {
    name = "Deploy"

    action {
      name            = "Deploy_to_EKS"
      category        = "Build"
      owner           = "AWS"
      provider        = "CodeBuild"
      input_artifacts = ["web_app_build_output", "api_service_build_output"]
      version         = "1"

      configuration = {
        ProjectName   = aws_codebuild_project.deploy.name
        PrimarySource = "web_app_build_output"
      }
    }
  }

  tags = var.tags
}

# Deploy Project (kubectl apply)
resource "aws_codebuild_project" "deploy" {
  name          = "${var.project_name}-${var.environment}-deploy"
  description   = "Deploy The Unified Health to EKS"
  build_timeout = 20
  service_role  = aws_iam_role.codebuild.arn

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/amazonlinux2-x86_64-standard:5.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"

    environment_variable {
      name  = "EKS_CLUSTER_NAME"
      value = var.eks_cluster_name
    }

    environment_variable {
      name  = "AWS_REGION"
      value = var.aws_region
    }

    environment_variable {
      name  = "NAMESPACE"
      value = "unified-health"
    }
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = <<-EOF
      version: 0.2
      phases:
        install:
          commands:
            - curl -LO "https://dl.k8s.io/release/v1.28.0/bin/linux/amd64/kubectl"
            - chmod +x kubectl
            - mv kubectl /usr/local/bin/
        pre_build:
          commands:
            - echo "Configuring kubectl for EKS..."
            - aws eks update-kubeconfig --name $EKS_CLUSTER_NAME --region $AWS_REGION
        build:
          commands:
            - echo "Deploying to EKS cluster..."
            - kubectl apply -f k8s-patch.yaml -n $NAMESPACE
            - kubectl rollout status deployment/web-app -n $NAMESPACE --timeout=300s
            - kubectl rollout status deployment/api -n $NAMESPACE --timeout=300s
        post_build:
          commands:
            - echo "Deployment completed successfully!"
    EOF
  }

  tags = var.tags
}

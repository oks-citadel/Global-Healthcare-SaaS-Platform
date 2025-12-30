# ============================================
# UnifiedHealth Platform - AWS Provider Configuration
# ============================================
# MIGRATED FROM AZURE TO AWS
# All Azure resources have been replaced with AWS equivalents
# ============================================

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.31.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0.0"
    }
  }
}

# ============================================
# Primary AWS Provider
# ============================================

provider "aws" {
  region = var.aws_region

  # Cross-account access via assume role (optional)
  dynamic "assume_role" {
    for_each = var.assume_role_arn != "" ? [1] : []
    content {
      role_arn     = var.assume_role_arn
      session_name = "TerraformUnifiedHealth"
      external_id  = var.assume_role_external_id
    }
  }

  default_tags {
    tags = {
      Project       = "UnifiedHealth"
      Environment   = var.environment
      ManagedBy     = "Terraform"
      CostCenter    = "Healthcare-Platform"
      DataResidency = var.aws_region
    }
  }
}

# ============================================
# Regional Providers for Multi-Region Deployment
# ============================================

# Americas Region (us-east-1)
provider "aws" {
  alias  = "americas"
  region = "us-east-1"

  dynamic "assume_role" {
    for_each = var.assume_role_arn != "" ? [1] : []
    content {
      role_arn     = var.assume_role_arn
      session_name = "TerraformUnifiedHealthAmericas"
      external_id  = var.assume_role_external_id
    }
  }

  default_tags {
    tags = {
      Project     = "UnifiedHealth"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Region      = "Americas"
      Compliance  = "HIPAA,SOC2"
    }
  }
}

# Europe Region (eu-west-1) - GDPR Compliant
provider "aws" {
  alias  = "europe"
  region = "eu-west-1"

  dynamic "assume_role" {
    for_each = var.assume_role_arn != "" ? [1] : []
    content {
      role_arn     = var.assume_role_arn
      session_name = "TerraformUnifiedHealthEurope"
      external_id  = var.assume_role_external_id
    }
  }

  default_tags {
    tags = {
      Project     = "UnifiedHealth"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Region      = "Europe"
      Compliance  = "GDPR,ISO27001"
    }
  }
}

# Africa Region (af-south-1) - POPIA Compliant
provider "aws" {
  alias  = "africa"
  region = "af-south-1"

  dynamic "assume_role" {
    for_each = var.assume_role_arn != "" ? [1] : []
    content {
      role_arn     = var.assume_role_arn
      session_name = "TerraformUnifiedHealthAfrica"
      external_id  = var.assume_role_external_id
    }
  }

  default_tags {
    tags = {
      Project     = "UnifiedHealth"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Region      = "Africa"
      Compliance  = "POPIA,ISO27001"
    }
  }
}

# ============================================
# Kubernetes Provider (configured after EKS)
# ============================================

provider "kubernetes" {
  host                   = try(aws_eks_cluster.main.endpoint, "")
  cluster_ca_certificate = try(base64decode(aws_eks_cluster.main.certificate_authority[0].data), "")

  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    args = [
      "eks",
      "get-token",
      "--cluster-name",
      try(aws_eks_cluster.main.name, ""),
      "--region",
      var.aws_region
    ]
  }
}

provider "helm" {
  kubernetes {
    host                   = try(aws_eks_cluster.main.endpoint, "")
    cluster_ca_certificate = try(base64decode(aws_eks_cluster.main.certificate_authority[0].data), "")

    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      command     = "aws"
      args = [
        "eks",
        "get-token",
        "--cluster-name",
        try(aws_eks_cluster.main.name, ""),
        "--region",
        var.aws_region
      ]
    }
  }
}

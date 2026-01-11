# ============================================
# AWS Provider Configuration
# ============================================
# Multi-region deployment with assume role
# ============================================

provider "aws" {
  region = var.aws_region

  # Cross-account access via assume role
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
      Project       = "The Unified Health"
      Environment   = var.environment
      ManagedBy     = "terraform"
      Owner         = "citadel-cloud-management"
      CostCenter    = "healthcare-platform"
      Compliance    = join("-", var.compliance_standards)
      DataResidency = var.aws_region
    }
  }
}

# ============================================
# Regional Providers for Multi-Region Deployment
# ============================================

# Americas Region (Primary)
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
      Project     = "The Unified Health"
      Environment = var.environment
      ManagedBy   = "terraform"
      Region      = "Americas"
    }
  }
}

# Europe Region (GDPR)
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
      Project     = "The Unified Health"
      Environment = var.environment
      ManagedBy   = "terraform"
      Region      = "Europe"
      Compliance  = "GDPR"
    }
  }
}

# Africa Region (POPIA)
# Note: af-south-1 requires opt-in. Skip validation when not deploying to Africa.
provider "aws" {
  alias  = "africa"
  region = "af-south-1"

  # Skip credential validation for Africa region when not deployed
  skip_credentials_validation = true
  skip_requesting_account_id  = true

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
      Project     = "The Unified Health"
      Environment = var.environment
      ManagedBy   = "terraform"
      Region      = "Africa"
      Compliance  = "POPIA"
    }
  }
}

# ============================================
# Note: Using ECS Fargate - No Kubernetes/Helm providers needed
# ECS Fargate is a serverless container platform managed via AWS APIs
# See docs/architecture/ecs-fargate-architecture.md
# ============================================

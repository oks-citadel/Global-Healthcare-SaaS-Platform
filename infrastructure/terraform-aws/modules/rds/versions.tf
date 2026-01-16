# ============================================
# RDS Module - Provider Requirements
# ============================================
# Explicit provider declarations to eliminate
# Terraform plan warnings about implicit providers
# ============================================

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = ">= 3.0"
    }
  }
}

# ============================================
# UnifiedHealth Platform - AWS Terraform
# ============================================
# AZURE IS FORBIDDEN - AWS ONLY
# This configuration replaces all Azure infrastructure
# ============================================

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.80.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.35.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.17.0"
    }
  }
}

# ============================================
# AZURE PROVIDER BLOCK - INTENTIONALLY ABSENT
# ============================================
# DO NOT ADD:
# - azurerm provider
# - azuread provider
# - Any Azure-related providers
#
# This is an AWS-ONLY deployment.
# Azure references will fail CI/CD pipelines.
# ============================================

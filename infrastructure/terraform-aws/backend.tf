# ============================================
# Terraform State Backend - AWS S3
# ============================================
# State is stored in S3 with DynamoDB locking
# Separate state files per environment
# ============================================

terraform {
  backend "s3" {
    # These values are populated via -backend-config or environment
    # bucket         = "unified-health-tfstate-${var.environment}"
    # key            = "env/${var.environment}/terraform.tfstate"
    # region         = var.aws_region
    # dynamodb_table = "unified-health-tflock"
    # encrypt        = true

    # Placeholder - override via backend config files
    bucket         = "unified-health-tfstate"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
  }
}

# ============================================
# Backend Bootstrap Resources
# ============================================
# Run this separately first to create the backend
# terraform apply -target=module.backend_bootstrap
# ============================================

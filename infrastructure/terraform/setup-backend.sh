#!/bin/bash
# ============================================
# Terraform Backend Setup Script - AWS S3
# ============================================
# Creates S3 buckets and DynamoDB tables for Terraform state management
# Configures buckets with versioning, encryption, and access controls
#
# Prerequisites:
#   - AWS CLI installed and configured
#   - Appropriate IAM permissions to create S3 buckets and DynamoDB tables
#
# Usage:
#   ./setup-backend.sh                    # Interactive mode
#   ./setup-backend.sh --env dev          # Create dev environment only
#   ./setup-backend.sh --env all          # Create all environments
#   ./setup-backend.sh --env prod --kms   # Create prod with KMS encryption

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="unified-health"
DEFAULT_REGION="us-east-1"
ENVIRONMENTS=("dev" "staging" "prod")

# ============================================
# Helper Functions
# ============================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --env ENV        Environment to create (dev, staging, prod, or all)"
    echo "  --region REGION  AWS region (default: us-east-1)"
    echo "  --kms            Use KMS encryption (recommended for prod)"
    echo "  --dry-run        Show what would be created without creating"
    echo "  --help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --env dev"
    echo "  $0 --env prod --kms"
    echo "  $0 --env all --region us-west-2"
}

check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed. Please install it first."
        log_info "Install guide: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
        exit 1
    fi

    # Check AWS authentication
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "Not authenticated to AWS. Please configure credentials."
        log_info "Run: aws configure"
        exit 1
    fi

    # Show current identity
    local identity
    identity=$(aws sts get-caller-identity --query 'Arn' --output text)
    log_info "Authenticated as: $identity"

    log_success "All prerequisites met"
}

get_bucket_name() {
    local env=$1
    local account_id
    account_id=$(aws sts get-caller-identity --query 'Account' --output text)
    echo "${PROJECT_NAME}-tfstate-${env}-${account_id}"
}

get_table_name() {
    local env=$1
    echo "${PROJECT_NAME}-terraform-locks-${env}"
}

create_s3_bucket() {
    local bucket_name=$1
    local region=$2
    local use_kms=${3:-false}

    log_info "Creating S3 bucket: $bucket_name"

    # Check if bucket already exists
    if aws s3api head-bucket --bucket "$bucket_name" 2>/dev/null; then
        log_warning "Bucket already exists: $bucket_name"
        return 0
    fi

    # Create bucket (special handling for us-east-1)
    if [ "$region" = "us-east-1" ]; then
        aws s3api create-bucket \
            --bucket "$bucket_name" \
            --region "$region"
    else
        aws s3api create-bucket \
            --bucket "$bucket_name" \
            --region "$region" \
            --create-bucket-configuration LocationConstraint="$region"
    fi

    log_success "Bucket created: $bucket_name"
}

enable_bucket_versioning() {
    local bucket_name=$1

    log_info "Enabling versioning for: $bucket_name"

    aws s3api put-bucket-versioning \
        --bucket "$bucket_name" \
        --versioning-configuration Status=Enabled

    log_success "Versioning enabled"
}

enable_bucket_encryption() {
    local bucket_name=$1
    local use_kms=${2:-false}
    local kms_key_alias=$3

    log_info "Configuring encryption for: $bucket_name"

    if [ "$use_kms" = "true" ]; then
        # Create KMS key if it doesn't exist
        local kms_key_arn
        kms_key_arn=$(aws kms describe-key --key-id "alias/${kms_key_alias}" --query 'KeyMetadata.Arn' --output text 2>/dev/null || echo "")

        if [ -z "$kms_key_arn" ] || [ "$kms_key_arn" = "None" ]; then
            log_info "Creating KMS key: $kms_key_alias"
            kms_key_arn=$(aws kms create-key \
                --description "Terraform state encryption key for ${bucket_name}" \
                --query 'KeyMetadata.Arn' \
                --output text)

            aws kms create-alias \
                --alias-name "alias/${kms_key_alias}" \
                --target-key-id "$kms_key_arn"

            log_success "KMS key created: $kms_key_alias"
        fi

        aws s3api put-bucket-encryption \
            --bucket "$bucket_name" \
            --server-side-encryption-configuration "{
                \"Rules\": [{
                    \"ApplyServerSideEncryptionByDefault\": {
                        \"SSEAlgorithm\": \"aws:kms\",
                        \"KMSMasterKeyID\": \"${kms_key_arn}\"
                    },
                    \"BucketKeyEnabled\": true
                }]
            }"
        log_info "KMS encryption configured with key: $kms_key_alias"
    else
        aws s3api put-bucket-encryption \
            --bucket "$bucket_name" \
            --server-side-encryption-configuration '{
                "Rules": [{
                    "ApplyServerSideEncryptionByDefault": {
                        "SSEAlgorithm": "AES256"
                    },
                    "BucketKeyEnabled": true
                }]
            }'
        log_info "SSE-S3 encryption configured"
    fi

    log_success "Encryption enabled"
}

block_public_access() {
    local bucket_name=$1

    log_info "Blocking public access for: $bucket_name"

    aws s3api put-public-access-block \
        --bucket "$bucket_name" \
        --public-access-block-configuration \
            BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

    log_success "Public access blocked"
}

add_bucket_policy() {
    local bucket_name=$1

    log_info "Adding bucket policy for: $bucket_name"

    local account_id
    account_id=$(aws sts get-caller-identity --query 'Account' --output text)

    aws s3api put-bucket-policy \
        --bucket "$bucket_name" \
        --policy "{
            \"Version\": \"2012-10-17\",
            \"Statement\": [
                {
                    \"Sid\": \"EnforceTLS\",
                    \"Effect\": \"Deny\",
                    \"Principal\": \"*\",
                    \"Action\": \"s3:*\",
                    \"Resource\": [
                        \"arn:aws:s3:::${bucket_name}\",
                        \"arn:aws:s3:::${bucket_name}/*\"
                    ],
                    \"Condition\": {
                        \"Bool\": {
                            \"aws:SecureTransport\": \"false\"
                        }
                    }
                },
                {
                    \"Sid\": \"DenyIncorrectEncryptionHeader\",
                    \"Effect\": \"Deny\",
                    \"Principal\": \"*\",
                    \"Action\": \"s3:PutObject\",
                    \"Resource\": \"arn:aws:s3:::${bucket_name}/*\",
                    \"Condition\": {
                        \"StringNotEquals\": {
                            \"s3:x-amz-server-side-encryption\": [\"AES256\", \"aws:kms\"]
                        }
                    }
                }
            ]
        }"

    log_success "Bucket policy applied"
}

enable_access_logging() {
    local bucket_name=$1
    local log_bucket=$2

    log_info "Enabling access logging for: $bucket_name"

    # First ensure the log bucket can receive logs
    aws s3api put-bucket-acl \
        --bucket "$log_bucket" \
        --grant-write URI=http://acs.amazonaws.com/groups/s3/LogDelivery \
        --grant-read-acp URI=http://acs.amazonaws.com/groups/s3/LogDelivery 2>/dev/null || true

    aws s3api put-bucket-logging \
        --bucket "$bucket_name" \
        --bucket-logging-status "{
            \"LoggingEnabled\": {
                \"TargetBucket\": \"${log_bucket}\",
                \"TargetPrefix\": \"${bucket_name}/\"
            }
        }" 2>/dev/null || log_warning "Could not enable access logging - ensure log bucket exists"

    log_success "Access logging configured"
}

create_dynamodb_table() {
    local table_name=$1
    local region=$2
    local env=$3

    log_info "Creating DynamoDB table: $table_name"

    # Check if table already exists
    if aws dynamodb describe-table --table-name "$table_name" --region "$region" &> /dev/null; then
        log_warning "Table already exists: $table_name"
        return 0
    fi

    # Create table with PAY_PER_REQUEST for cost optimization
    aws dynamodb create-table \
        --table-name "$table_name" \
        --attribute-definitions AttributeName=LockID,AttributeType=S \
        --key-schema AttributeName=LockID,KeyType=HASH \
        --billing-mode PAY_PER_REQUEST \
        --region "$region" \
        --tags Key=Project,Value="$PROJECT_NAME" Key=Environment,Value="$env" Key=Purpose,Value=TerraformStateLocking

    log_info "Waiting for table to be active..."
    aws dynamodb wait table-exists --table-name "$table_name" --region "$region"

    log_success "DynamoDB table created: $table_name"

    # Enable point-in-time recovery for production
    if [ "$env" = "prod" ]; then
        log_info "Enabling point-in-time recovery for production table"
        aws dynamodb update-continuous-backups \
            --table-name "$table_name" \
            --region "$region" \
            --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true
        log_success "Point-in-time recovery enabled"
    fi
}

update_tfbackend_file() {
    local env=$1
    local bucket_name=$2
    local table_name=$3
    local region=$4
    local use_kms=$5
    local script_dir

    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local tfbackend_file="${script_dir}/environments/${env}.tfbackend"

    log_info "Updating backend config: $tfbackend_file"

    local kms_line=""
    if [ "$use_kms" = "true" ]; then
        kms_line="kms_key_id     = \"alias/${PROJECT_NAME}-terraform-${env}\""
    else
        kms_line="# kms_key_id   = \"alias/${PROJECT_NAME}-terraform-${env}\"  # Uncomment for KMS encryption"
    fi

    cat > "$tfbackend_file" << EOF
# ============================================
# ${env^} Environment Backend Configuration
# ============================================
# AWS S3 backend for Terraform state management
# Auto-generated by setup-backend.sh on $(date -u +"%Y-%m-%dT%H:%M:%SZ")
#
# Usage: terraform init -backend-config=environments/${env}.tfbackend

# S3 Bucket Configuration
bucket         = "${bucket_name}"
key            = "env/${env}/terraform.tfstate"
region         = "${region}"

# Encryption
encrypt        = true

# DynamoDB table for state locking
dynamodb_table = "${table_name}"

# KMS encryption (recommended for production)
${kms_line}

# Cross-account access (uncomment if needed)
# role_arn     = "arn:aws:iam::ACCOUNT_ID:role/TerraformStateAccess"
EOF

    log_success "Backend config updated: $tfbackend_file"
}

setup_environment() {
    local env=$1
    local region=$2
    local use_kms=$3
    local dry_run=$4

    log_info "============================================"
    log_info "Setting up ${env^^} environment"
    log_info "============================================"

    local bucket_name
    local table_name
    bucket_name=$(get_bucket_name "$env")
    table_name=$(get_table_name "$env")

    log_info "Bucket: $bucket_name"
    log_info "Table: $table_name"
    log_info "Region: $region"
    log_info "KMS: $use_kms"

    if [ "$dry_run" = "true" ]; then
        log_warning "DRY RUN - No resources will be created"
        return 0
    fi

    # Create S3 bucket
    create_s3_bucket "$bucket_name" "$region" "$use_kms"

    # Enable versioning
    enable_bucket_versioning "$bucket_name"

    # Configure encryption
    local kms_alias="${PROJECT_NAME}-terraform-${env}"
    enable_bucket_encryption "$bucket_name" "$use_kms" "$kms_alias"

    # Block public access
    block_public_access "$bucket_name"

    # Add bucket policy
    add_bucket_policy "$bucket_name"

    # Create DynamoDB table
    create_dynamodb_table "$table_name" "$region" "$env"

    # Update tfbackend file
    update_tfbackend_file "$env" "$bucket_name" "$table_name" "$region" "$use_kms"

    log_success "${env^^} environment setup complete!"
}

show_summary() {
    local region=$1

    log_info ""
    log_info "============================================"
    log_info "Backend Setup Summary"
    log_info "============================================"
    log_info ""
    log_info "Region: $region"
    log_info ""

    for env in "${ENVIRONMENTS[@]}"; do
        local bucket_name
        local table_name
        bucket_name=$(get_bucket_name "$env")
        table_name=$(get_table_name "$env")

        log_info "${env^}:"
        log_info "  S3 Bucket: $bucket_name"
        log_info "  DynamoDB Table: $table_name"
        log_info ""
    done

    log_info "============================================"
    log_info ""
    log_info "Next steps:"
    log_info "1. Review the generated .tfbackend files in environments/"
    log_info "2. Initialize Terraform with: terraform init -backend-config=environments/<env>.tfbackend"
    log_info "3. Deploy infrastructure with: ./deploy.sh -e <env> -a apply"
    log_info ""
}

show_iam_policy() {
    log_info ""
    log_info "============================================"
    log_info "Required IAM Policy"
    log_info "============================================"
    log_info ""

    local account_id
    account_id=$(aws sts get-caller-identity --query 'Account' --output text)

    cat << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3BucketAccess",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketVersioning",
        "s3:GetBucketLocation"
      ],
      "Resource": "arn:aws:s3:::${PROJECT_NAME}-tfstate-*"
    },
    {
      "Sid": "S3ObjectAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::${PROJECT_NAME}-tfstate-*/env/*/terraform.tfstate"
    },
    {
      "Sid": "DynamoDBAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:DescribeTable"
      ],
      "Resource": "arn:aws:dynamodb:*:${account_id}:table/${PROJECT_NAME}-terraform-locks-*"
    },
    {
      "Sid": "KMSAccess",
      "Effect": "Allow",
      "Action": [
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:GenerateDataKey"
      ],
      "Resource": "arn:aws:kms:*:${account_id}:key/*",
      "Condition": {
        "StringEquals": {
          "kms:ViaService": "s3.*.amazonaws.com"
        }
      }
    }
  ]
}
EOF
    log_info ""
}

# ============================================
# Main Script
# ============================================

main() {
    local env=""
    local region="$DEFAULT_REGION"
    local use_kms="false"
    local dry_run="false"

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --env)
                env="$2"
                shift 2
                ;;
            --region)
                region="$2"
                shift 2
                ;;
            --kms)
                use_kms="true"
                shift
                ;;
            --dry-run)
                dry_run="true"
                shift
                ;;
            --help)
                usage
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                usage
                exit 1
                ;;
        esac
    done

    log_info "============================================"
    log_info "Terraform Backend Setup - AWS S3"
    log_info "============================================"

    check_prerequisites

    # Interactive mode if no environment specified
    if [ -z "$env" ]; then
        log_info ""
        log_info "Select environment to setup:"
        log_info "  1) dev"
        log_info "  2) staging"
        log_info "  3) prod"
        log_info "  4) all"
        log_info ""
        read -rp "Enter choice [1-4]: " choice

        case $choice in
            1) env="dev" ;;
            2) env="staging" ;;
            3) env="prod" ;;
            4) env="all" ;;
            *)
                log_error "Invalid choice"
                exit 1
                ;;
        esac

        if [ "$env" = "prod" ] && [ "$use_kms" = "false" ]; then
            read -rp "Enable KMS encryption for production? [y/N]: " kms_choice
            if [[ "$kms_choice" =~ ^[Yy]$ ]]; then
                use_kms="true"
            fi
        fi
    fi

    # Setup environments
    if [ "$env" = "all" ]; then
        for e in "${ENVIRONMENTS[@]}"; do
            local env_kms="$use_kms"
            # Auto-enable KMS for production
            if [ "$e" = "prod" ]; then
                env_kms="true"
            fi
            setup_environment "$e" "$region" "$env_kms" "$dry_run"
        done
    else
        # Validate environment
        if [[ ! " ${ENVIRONMENTS[*]} " =~ " ${env} " ]]; then
            log_error "Invalid environment: $env"
            log_info "Valid environments: ${ENVIRONMENTS[*]}"
            exit 1
        fi
        setup_environment "$env" "$region" "$use_kms" "$dry_run"
    fi

    if [ "$dry_run" = "false" ]; then
        show_summary "$region"
        show_iam_policy
    fi

    log_success "Setup complete!"
}

# Run main function
main "$@"

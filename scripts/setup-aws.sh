#!/bin/bash
# ============================================
# UnifiedHealth Platform - AWS Infrastructure Setup
# ============================================
# This script sets up all AWS resources for the platform
# Usage: ./scripts/setup-aws.sh [environment]

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT="${1:-staging}"
AWS_REGION="${AWS_REGION:-us-east-1}"
PROJECT_NAME="unified-health"
EKS_CLUSTER_NAME="${PROJECT_NAME}-eks-${ENVIRONMENT}"
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
RDS_INSTANCE="${PROJECT_NAME}-rds-${ENVIRONMENT}"
ELASTICACHE_CLUSTER="${PROJECT_NAME}-redis-${ENVIRONMENT}"
S3_BUCKET="${PROJECT_NAME}-${ENVIRONMENT}-${AWS_ACCOUNT_ID}"

# EKS Configuration
EKS_NODE_COUNT="${EKS_NODE_COUNT:-3}"
EKS_NODE_TYPE="${EKS_NODE_TYPE:-m5.large}"
EKS_VERSION="${EKS_VERSION:-1.28}"

# Database Configuration
RDS_ENGINE_VERSION="15"
RDS_INSTANCE_CLASS="${RDS_INSTANCE_CLASS:-db.r5.large}"
RDS_STORAGE="${RDS_STORAGE:-100}"
RDS_ADMIN="unifiedhealthadmin"

# ElastiCache Configuration
ELASTICACHE_NODE_TYPE="${ELASTICACHE_NODE_TYPE:-cache.r5.large}"
ELASTICACHE_NUM_NODES="${ELASTICACHE_NUM_NODES:-2}"

# Log functions
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

# Error handler
error_exit() {
    log_error "$1"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    command -v aws >/dev/null 2>&1 || error_exit "AWS CLI is not installed"
    command -v kubectl >/dev/null 2>&1 || error_exit "kubectl is not installed"
    command -v eksctl >/dev/null 2>&1 || error_exit "eksctl is not installed"

    # Check AWS credentials
    aws sts get-caller-identity >/dev/null 2>&1 || error_exit "Not authenticated with AWS. Run 'aws configure' or 'aws sso login'"

    # Get AWS Account ID
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    log_info "Using AWS Account: ${AWS_ACCOUNT_ID}"

    # Update ECR registry with account ID
    ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

    log_success "Prerequisites check passed"
}

# Confirm setup
confirm_setup() {
    log_warning "=========================================="
    log_warning "AWS INFRASTRUCTURE SETUP"
    log_warning "Environment: ${ENVIRONMENT}"
    log_warning "Region: ${AWS_REGION}"
    log_warning "EKS Cluster: ${EKS_CLUSTER_NAME}"
    log_warning "=========================================="

    if [ "${SKIP_CONFIRMATION:-false}" != "true" ]; then
        read -p "Are you sure you want to create these resources? (yes/no): " -r
        if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            log_info "Setup cancelled"
            exit 0
        fi
    fi
}

# Create VPC using eksctl (creates VPC with proper networking)
create_vpc() {
    log_info "VPC will be created automatically by eksctl with EKS cluster..."
    log_success "VPC configuration prepared"
}

# Create ECR repositories
create_ecr() {
    log_info "Creating ECR repositories..."

    REPOSITORIES=("unified-health-api" "unified-health-web" "unified-health-mobile")

    for REPO in "${REPOSITORIES[@]}"; do
        if aws ecr describe-repositories --repository-names "${REPO}" --region "${AWS_REGION}" >/dev/null 2>&1; then
            log_warning "ECR repository ${REPO} already exists"
        else
            aws ecr create-repository \
                --repository-name "${REPO}" \
                --region "${AWS_REGION}" \
                --image-scanning-configuration scanOnPush=true \
                --encryption-configuration encryptionType=AES256 \
                --tags Key=environment,Value="${ENVIRONMENT}" Key=project,Value="${PROJECT_NAME}" || error_exit "Failed to create ECR repository ${REPO}"

            log_success "ECR repository ${REPO} created"
        fi
    done

    # Set lifecycle policy for ECR
    for REPO in "${REPOSITORIES[@]}"; do
        aws ecr put-lifecycle-policy \
            --repository-name "${REPO}" \
            --region "${AWS_REGION}" \
            --lifecycle-policy-text '{
                "rules": [
                    {
                        "rulePriority": 1,
                        "description": "Keep last 30 images",
                        "selection": {
                            "tagStatus": "any",
                            "countType": "imageCountMoreThan",
                            "countNumber": 30
                        },
                        "action": {
                            "type": "expire"
                        }
                    }
                ]
            }' || log_warning "Failed to set lifecycle policy for ${REPO}"
    done

    log_success "ECR repositories configured"
}

# Create EKS cluster
create_eks() {
    log_info "Creating EKS cluster (this may take 15-20 minutes)..."

    if aws eks describe-cluster --name "${EKS_CLUSTER_NAME}" --region "${AWS_REGION}" >/dev/null 2>&1; then
        log_warning "EKS cluster already exists"
    else
        eksctl create cluster \
            --name "${EKS_CLUSTER_NAME}" \
            --region "${AWS_REGION}" \
            --version "${EKS_VERSION}" \
            --nodegroup-name "${PROJECT_NAME}-nodes" \
            --node-type "${EKS_NODE_TYPE}" \
            --nodes "${EKS_NODE_COUNT}" \
            --nodes-min 2 \
            --nodes-max 10 \
            --managed \
            --with-oidc \
            --ssh-access \
            --alb-ingress-access \
            --tags "environment=${ENVIRONMENT},project=${PROJECT_NAME}" || error_exit "Failed to create EKS cluster"

        log_success "EKS cluster created"
    fi

    # Update kubeconfig
    log_info "Updating kubeconfig..."
    aws eks update-kubeconfig \
        --region "${AWS_REGION}" \
        --name "${EKS_CLUSTER_NAME}" || error_exit "Failed to update kubeconfig"

    log_success "Kubeconfig updated"

    # Install AWS Load Balancer Controller
    log_info "Installing AWS Load Balancer Controller..."
    kubectl apply -k "github.com/aws/eks-charts/stable/aws-load-balancer-controller/crds?ref=master" 2>/dev/null || log_warning "ALB controller CRDs may already exist"

    log_success "EKS cluster configured"
}

# Create RDS PostgreSQL
create_rds() {
    log_info "Creating RDS PostgreSQL instance..."

    if aws rds describe-db-instances --db-instance-identifier "${RDS_INSTANCE}" --region "${AWS_REGION}" >/dev/null 2>&1; then
        log_warning "RDS instance already exists"
    else
        # Generate admin password
        RDS_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

        # Get VPC and subnet information from EKS cluster
        VPC_ID=$(aws eks describe-cluster --name "${EKS_CLUSTER_NAME}" --region "${AWS_REGION}" --query 'cluster.resourcesVpcConfig.vpcId' --output text)

        # Get private subnets
        SUBNET_IDS=$(aws ec2 describe-subnets \
            --filters "Name=vpc-id,Values=${VPC_ID}" "Name=tag:kubernetes.io/role/internal-elb,Values=1" \
            --query 'Subnets[*].SubnetId' \
            --output text --region "${AWS_REGION}" | tr '\t' ',')

        # Create DB subnet group
        aws rds create-db-subnet-group \
            --db-subnet-group-name "${PROJECT_NAME}-db-subnet-group-${ENVIRONMENT}" \
            --db-subnet-group-description "Subnet group for ${PROJECT_NAME} ${ENVIRONMENT}" \
            --subnet-ids ${SUBNET_IDS//,/ } \
            --region "${AWS_REGION}" 2>/dev/null || log_warning "DB subnet group may already exist"

        # Create security group for RDS
        RDS_SG_ID=$(aws ec2 create-security-group \
            --group-name "${PROJECT_NAME}-rds-sg-${ENVIRONMENT}" \
            --description "Security group for RDS" \
            --vpc-id "${VPC_ID}" \
            --query 'GroupId' \
            --output text \
            --region "${AWS_REGION}" 2>/dev/null) || RDS_SG_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=${PROJECT_NAME}-rds-sg-${ENVIRONMENT}" --query 'SecurityGroups[0].GroupId' --output text --region "${AWS_REGION}")

        # Allow PostgreSQL access from VPC
        aws ec2 authorize-security-group-ingress \
            --group-id "${RDS_SG_ID}" \
            --protocol tcp \
            --port 5432 \
            --cidr "10.0.0.0/8" \
            --region "${AWS_REGION}" 2>/dev/null || log_warning "Security group rule may already exist"

        # Create RDS instance
        aws rds create-db-instance \
            --db-instance-identifier "${RDS_INSTANCE}" \
            --db-instance-class "${RDS_INSTANCE_CLASS}" \
            --engine postgres \
            --engine-version "${RDS_ENGINE_VERSION}" \
            --master-username "${RDS_ADMIN}" \
            --master-user-password "${RDS_PASSWORD}" \
            --allocated-storage "${RDS_STORAGE}" \
            --storage-type gp3 \
            --storage-encrypted \
            --multi-az \
            --db-subnet-group-name "${PROJECT_NAME}-db-subnet-group-${ENVIRONMENT}" \
            --vpc-security-group-ids "${RDS_SG_ID}" \
            --backup-retention-period 30 \
            --deletion-protection \
            --tags Key=environment,Value="${ENVIRONMENT}" Key=project,Value="${PROJECT_NAME}" \
            --region "${AWS_REGION}" || error_exit "Failed to create RDS instance"

        # Store password in Secrets Manager
        log_info "Storing RDS password in Secrets Manager..."
        aws secretsmanager create-secret \
            --name "${PROJECT_NAME}/${ENVIRONMENT}/rds-admin-password" \
            --secret-string "${RDS_PASSWORD}" \
            --region "${AWS_REGION}" 2>/dev/null || \
        aws secretsmanager update-secret \
            --secret-id "${PROJECT_NAME}/${ENVIRONMENT}/rds-admin-password" \
            --secret-string "${RDS_PASSWORD}" \
            --region "${AWS_REGION}"

        log_success "RDS PostgreSQL instance created"
        log_warning "Admin password stored in Secrets Manager: ${PROJECT_NAME}/${ENVIRONMENT}/rds-admin-password"
    fi
}

# Create ElastiCache Redis
create_elasticache() {
    log_info "Creating ElastiCache Redis cluster..."

    if aws elasticache describe-replication-groups --replication-group-id "${ELASTICACHE_CLUSTER}" --region "${AWS_REGION}" >/dev/null 2>&1; then
        log_warning "ElastiCache cluster already exists"
    else
        # Get VPC and subnet information
        VPC_ID=$(aws eks describe-cluster --name "${EKS_CLUSTER_NAME}" --region "${AWS_REGION}" --query 'cluster.resourcesVpcConfig.vpcId' --output text)

        SUBNET_IDS=$(aws ec2 describe-subnets \
            --filters "Name=vpc-id,Values=${VPC_ID}" "Name=tag:kubernetes.io/role/internal-elb,Values=1" \
            --query 'Subnets[*].SubnetId' \
            --output text --region "${AWS_REGION}" | tr '\t' ',')

        # Create ElastiCache subnet group
        aws elasticache create-cache-subnet-group \
            --cache-subnet-group-name "${PROJECT_NAME}-redis-subnet-group-${ENVIRONMENT}" \
            --cache-subnet-group-description "Subnet group for ${PROJECT_NAME} Redis" \
            --subnet-ids ${SUBNET_IDS//,/ } \
            --region "${AWS_REGION}" 2>/dev/null || log_warning "Cache subnet group may already exist"

        # Create security group for ElastiCache
        REDIS_SG_ID=$(aws ec2 create-security-group \
            --group-name "${PROJECT_NAME}-redis-sg-${ENVIRONMENT}" \
            --description "Security group for ElastiCache" \
            --vpc-id "${VPC_ID}" \
            --query 'GroupId' \
            --output text \
            --region "${AWS_REGION}" 2>/dev/null) || REDIS_SG_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=${PROJECT_NAME}-redis-sg-${ENVIRONMENT}" --query 'SecurityGroups[0].GroupId' --output text --region "${AWS_REGION}")

        # Allow Redis access from VPC
        aws ec2 authorize-security-group-ingress \
            --group-id "${REDIS_SG_ID}" \
            --protocol tcp \
            --port 6379 \
            --cidr "10.0.0.0/8" \
            --region "${AWS_REGION}" 2>/dev/null || log_warning "Security group rule may already exist"

        # Generate auth token
        REDIS_AUTH_TOKEN=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

        # Create ElastiCache replication group
        aws elasticache create-replication-group \
            --replication-group-id "${ELASTICACHE_CLUSTER}" \
            --replication-group-description "${PROJECT_NAME} Redis cluster for ${ENVIRONMENT}" \
            --engine redis \
            --engine-version "7.0" \
            --cache-node-type "${ELASTICACHE_NODE_TYPE}" \
            --num-cache-clusters "${ELASTICACHE_NUM_NODES}" \
            --cache-subnet-group-name "${PROJECT_NAME}-redis-subnet-group-${ENVIRONMENT}" \
            --security-group-ids "${REDIS_SG_ID}" \
            --transit-encryption-enabled \
            --at-rest-encryption-enabled \
            --auth-token "${REDIS_AUTH_TOKEN}" \
            --automatic-failover-enabled \
            --multi-az-enabled \
            --tags Key=environment,Value="${ENVIRONMENT}" Key=project,Value="${PROJECT_NAME}" \
            --region "${AWS_REGION}" || error_exit "Failed to create ElastiCache cluster"

        # Store auth token in Secrets Manager
        log_info "Storing Redis auth token in Secrets Manager..."
        aws secretsmanager create-secret \
            --name "${PROJECT_NAME}/${ENVIRONMENT}/redis-auth-token" \
            --secret-string "${REDIS_AUTH_TOKEN}" \
            --region "${AWS_REGION}" 2>/dev/null || \
        aws secretsmanager update-secret \
            --secret-id "${PROJECT_NAME}/${ENVIRONMENT}/redis-auth-token" \
            --secret-string "${REDIS_AUTH_TOKEN}" \
            --region "${AWS_REGION}"

        log_success "ElastiCache Redis cluster created"
    fi
}

# Create S3 bucket
create_s3() {
    log_info "Creating S3 bucket..."

    S3_BUCKET="${PROJECT_NAME}-${ENVIRONMENT}-${AWS_ACCOUNT_ID}"

    if aws s3api head-bucket --bucket "${S3_BUCKET}" --region "${AWS_REGION}" 2>/dev/null; then
        log_warning "S3 bucket already exists"
    else
        if [ "${AWS_REGION}" == "us-east-1" ]; then
            aws s3api create-bucket \
                --bucket "${S3_BUCKET}" \
                --region "${AWS_REGION}" || error_exit "Failed to create S3 bucket"
        else
            aws s3api create-bucket \
                --bucket "${S3_BUCKET}" \
                --region "${AWS_REGION}" \
                --create-bucket-configuration LocationConstraint="${AWS_REGION}" || error_exit "Failed to create S3 bucket"
        fi

        # Enable versioning
        aws s3api put-bucket-versioning \
            --bucket "${S3_BUCKET}" \
            --versioning-configuration Status=Enabled \
            --region "${AWS_REGION}"

        # Enable encryption
        aws s3api put-bucket-encryption \
            --bucket "${S3_BUCKET}" \
            --server-side-encryption-configuration '{
                "Rules": [
                    {
                        "ApplyServerSideEncryptionByDefault": {
                            "SSEAlgorithm": "AES256"
                        }
                    }
                ]
            }' \
            --region "${AWS_REGION}"

        # Block public access
        aws s3api put-public-access-block \
            --bucket "${S3_BUCKET}" \
            --public-access-block-configuration '{
                "BlockPublicAcls": true,
                "IgnorePublicAcls": true,
                "BlockPublicPolicy": true,
                "RestrictPublicBuckets": true
            }' \
            --region "${AWS_REGION}"

        # Apply tags
        aws s3api put-bucket-tagging \
            --bucket "${S3_BUCKET}" \
            --tagging "TagSet=[{Key=environment,Value=${ENVIRONMENT}},{Key=project,Value=${PROJECT_NAME}}]" \
            --region "${AWS_REGION}"

        log_success "S3 bucket created: ${S3_BUCKET}"
    fi

    # Create folders
    for FOLDER in "backups" "medical-images" "documents"; do
        aws s3api put-object \
            --bucket "${S3_BUCKET}" \
            --key "${FOLDER}/" \
            --region "${AWS_REGION}" 2>/dev/null || true
    done

    log_success "S3 bucket configured"
}

# Create Secrets Manager secrets
create_secrets() {
    log_info "Creating application secrets in Secrets Manager..."

    # JWT Secret
    JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
    aws secretsmanager create-secret \
        --name "${PROJECT_NAME}/${ENVIRONMENT}/jwt-secret" \
        --secret-string "${JWT_SECRET}" \
        --region "${AWS_REGION}" 2>/dev/null || \
    aws secretsmanager update-secret \
        --secret-id "${PROJECT_NAME}/${ENVIRONMENT}/jwt-secret" \
        --secret-string "${JWT_SECRET}" \
        --region "${AWS_REGION}"

    # Encryption Key
    ENCRYPTION_KEY=$(openssl rand -base64 32 | tr -d '\n')
    aws secretsmanager create-secret \
        --name "${PROJECT_NAME}/${ENVIRONMENT}/encryption-key" \
        --secret-string "${ENCRYPTION_KEY}" \
        --region "${AWS_REGION}" 2>/dev/null || \
    aws secretsmanager update-secret \
        --secret-id "${PROJECT_NAME}/${ENVIRONMENT}/encryption-key" \
        --secret-string "${ENCRYPTION_KEY}" \
        --region "${AWS_REGION}"

    # Session Secret
    SESSION_SECRET=$(openssl rand -base64 32 | tr -d '\n')
    aws secretsmanager create-secret \
        --name "${PROJECT_NAME}/${ENVIRONMENT}/session-secret" \
        --secret-string "${SESSION_SECRET}" \
        --region "${AWS_REGION}" 2>/dev/null || \
    aws secretsmanager update-secret \
        --secret-id "${PROJECT_NAME}/${ENVIRONMENT}/session-secret" \
        --secret-string "${SESSION_SECRET}" \
        --region "${AWS_REGION}"

    log_success "Application secrets created in Secrets Manager"
}

# Setup CloudWatch monitoring
setup_monitoring() {
    log_info "Setting up CloudWatch monitoring..."

    # Create CloudWatch log group
    aws logs create-log-group \
        --log-group-name "/aws/eks/${EKS_CLUSTER_NAME}/cluster" \
        --region "${AWS_REGION}" 2>/dev/null || log_warning "Log group may already exist"

    # Set retention policy
    aws logs put-retention-policy \
        --log-group-name "/aws/eks/${EKS_CLUSTER_NAME}/cluster" \
        --retention-in-days 90 \
        --region "${AWS_REGION}" 2>/dev/null || true

    # Create application log group
    aws logs create-log-group \
        --log-group-name "/${PROJECT_NAME}/${ENVIRONMENT}/application" \
        --region "${AWS_REGION}" 2>/dev/null || log_warning "Application log group may already exist"

    aws logs put-retention-policy \
        --log-group-name "/${PROJECT_NAME}/${ENVIRONMENT}/application" \
        --retention-in-days 90 \
        --region "${AWS_REGION}" 2>/dev/null || true

    log_success "CloudWatch monitoring configured"
}

# Output summary
output_summary() {
    log_success "=========================================="
    log_success "AWS Infrastructure Setup Complete!"
    log_success "=========================================="
    log_info "Environment: ${ENVIRONMENT}"
    log_info "Region: ${AWS_REGION}"
    log_info "EKS Cluster: ${EKS_CLUSTER_NAME}"
    log_info "ECR Registry: ${ECR_REGISTRY}"
    log_info "RDS Instance: ${RDS_INSTANCE}"
    log_info "ElastiCache: ${ELASTICACHE_CLUSTER}"
    log_info "S3 Bucket: ${S3_BUCKET}"
    log_success "=========================================="
    log_info ""
    log_info "Next steps:"
    log_info "1. Update kubeconfig: aws eks update-kubeconfig --region ${AWS_REGION} --name ${EKS_CLUSTER_NAME}"
    log_info "2. Run: ./scripts/setup-secrets.sh ${ENVIRONMENT}"
    log_info "3. Deploy application: ./scripts/deploy-${ENVIRONMENT}.sh"
}

# Main setup flow
main() {
    log_info "Starting AWS infrastructure setup..."
    log_info "Environment: ${ENVIRONMENT}"
    log_info "Region: ${AWS_REGION}"

    check_prerequisites
    confirm_setup
    create_ecr
    create_eks
    create_rds
    create_elasticache
    create_s3
    create_secrets
    setup_monitoring
    output_summary
}

# Run main
main "$@"

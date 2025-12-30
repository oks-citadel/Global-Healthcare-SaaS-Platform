#!/bin/bash
# ============================================
# UnifiedHealth Platform - AWS Secrets Setup
# ============================================
# This script creates Kubernetes secrets from AWS Secrets Manager
# and configures IRSA (IAM Roles for Service Accounts) for secure secret access
#
# Usage: ./scripts/setup-secrets.sh [environment]
#
# Prerequisites:
#   - AWS CLI v2 installed and configured
#   - kubectl installed
#   - eksctl installed (for IRSA setup)
#   - Access to AWS EKS cluster
#   - Access to AWS Secrets Manager
#
# Environments: dev, staging, production

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENVIRONMENT="${1:-staging}"
NAMESPACE="unified-health-${ENVIRONMENT}"
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-}"
PROJECT_NAME="unified-health"
EKS_CLUSTER="${EKS_CLUSTER:-${PROJECT_NAME}-eks-${ENVIRONMENT}}"
RDS_INSTANCE="${PROJECT_NAME}-rds-${ENVIRONMENT}"
ELASTICACHE_CLUSTER="${PROJECT_NAME}-redis-${ENVIRONMENT}"
SERVICE_ACCOUNT_NAME="unified-health-api"
IRSA_ROLE_NAME="${PROJECT_NAME}-${ENVIRONMENT}-secrets-role"

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

    command -v kubectl >/dev/null 2>&1 || error_exit "kubectl is not installed"
    command -v aws >/dev/null 2>&1 || error_exit "AWS CLI is not installed"

    # Check if eksctl is available (optional, for IRSA setup)
    if command -v eksctl >/dev/null 2>&1; then
        EKSCTL_AVAILABLE=true
        log_info "eksctl is available - IRSA setup enabled"
    else
        EKSCTL_AVAILABLE=false
        log_warning "eksctl is not installed - IRSA setup will be skipped"
    fi

    # Check AWS credentials
    aws sts get-caller-identity >/dev/null 2>&1 || error_exit "Not authenticated with AWS. Run 'aws configure' or 'aws sso login'"

    # Get AWS Account ID if not set
    if [ -z "${AWS_ACCOUNT_ID}" ]; then
        AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    fi
    export AWS_ACCOUNT_ID

    log_success "Prerequisites check passed"
    log_info "AWS Account ID: ${AWS_ACCOUNT_ID}"
    log_info "AWS Region: ${AWS_REGION}"
    log_info "EKS Cluster: ${EKS_CLUSTER}"
}

# Get EKS credentials
get_eks_credentials() {
    log_info "Getting EKS credentials..."
    aws eks update-kubeconfig \
        --region "${AWS_REGION}" \
        --name "${EKS_CLUSTER}" || error_exit "Failed to get EKS credentials"
    log_success "EKS credentials retrieved"
}

# Create namespace if not exists
create_namespace() {
    log_info "Creating namespace..."

    if kubectl get namespace "${NAMESPACE}" >/dev/null 2>&1; then
        log_warning "Namespace already exists"
    else
        kubectl create namespace "${NAMESPACE}" || error_exit "Failed to create namespace"
        log_success "Namespace created"
    fi
}

# Generate secrets if they don't exist in Secrets Manager
generate_secrets() {
    log_info "Generating secrets..."

    # JWT Secret
    if ! aws secretsmanager describe-secret --secret-id "${PROJECT_NAME}/${ENVIRONMENT}/jwt-secret" --region "${AWS_REGION}" >/dev/null 2>&1; then
        JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
        aws secretsmanager create-secret \
            --name "${PROJECT_NAME}/${ENVIRONMENT}/jwt-secret" \
            --secret-string "${JWT_SECRET}" \
            --region "${AWS_REGION}" || error_exit "Failed to store JWT secret"
        log_success "JWT secret generated"
    fi

    # Encryption Key
    if ! aws secretsmanager describe-secret --secret-id "${PROJECT_NAME}/${ENVIRONMENT}/encryption-key" --region "${AWS_REGION}" >/dev/null 2>&1; then
        ENCRYPTION_KEY=$(openssl rand -base64 32 | tr -d '\n')
        aws secretsmanager create-secret \
            --name "${PROJECT_NAME}/${ENVIRONMENT}/encryption-key" \
            --secret-string "${ENCRYPTION_KEY}" \
            --region "${AWS_REGION}" || error_exit "Failed to store encryption key"
        log_success "Encryption key generated"
    fi

    # Session Secret
    if ! aws secretsmanager describe-secret --secret-id "${PROJECT_NAME}/${ENVIRONMENT}/session-secret" --region "${AWS_REGION}" >/dev/null 2>&1; then
        SESSION_SECRET=$(openssl rand -base64 32 | tr -d '\n')
        aws secretsmanager create-secret \
            --name "${PROJECT_NAME}/${ENVIRONMENT}/session-secret" \
            --secret-string "${SESSION_SECRET}" \
            --region "${AWS_REGION}" || error_exit "Failed to store session secret"
        log_success "Session secret generated"
    fi
}

# Get secrets from AWS Secrets Manager
get_secrets_from_secrets_manager() {
    log_info "Retrieving secrets from Secrets Manager..."

    # JWT Secret
    JWT_SECRET=$(aws secretsmanager get-secret-value \
        --secret-id "${PROJECT_NAME}/${ENVIRONMENT}/jwt-secret" \
        --region "${AWS_REGION}" \
        --query SecretString \
        --output text) || error_exit "Failed to get JWT secret"

    # Encryption Key
    ENCRYPTION_KEY=$(aws secretsmanager get-secret-value \
        --secret-id "${PROJECT_NAME}/${ENVIRONMENT}/encryption-key" \
        --region "${AWS_REGION}" \
        --query SecretString \
        --output text) || error_exit "Failed to get encryption key"

    # Session Secret
    SESSION_SECRET=$(aws secretsmanager get-secret-value \
        --secret-id "${PROJECT_NAME}/${ENVIRONMENT}/session-secret" \
        --region "${AWS_REGION}" \
        --query SecretString \
        --output text) || error_exit "Failed to get session secret"

    # RDS Admin Password
    RDS_PASSWORD=$(aws secretsmanager get-secret-value \
        --secret-id "${PROJECT_NAME}/${ENVIRONMENT}/rds-admin-password" \
        --region "${AWS_REGION}" \
        --query SecretString \
        --output text) || error_exit "Failed to get RDS password"

    # Redis Auth Token
    REDIS_AUTH_TOKEN=$(aws secretsmanager get-secret-value \
        --secret-id "${PROJECT_NAME}/${ENVIRONMENT}/redis-auth-token" \
        --region "${AWS_REGION}" \
        --query SecretString \
        --output text) || error_exit "Failed to get Redis auth token"

    log_success "Secrets retrieved from Secrets Manager"
}

# Build database URL
build_database_url() {
    log_info "Building database URL..."

    # Get RDS endpoint
    RDS_ENDPOINT=$(aws rds describe-db-instances \
        --db-instance-identifier "${RDS_INSTANCE}" \
        --region "${AWS_REGION}" \
        --query 'DBInstances[0].Endpoint.Address' \
        --output text) || error_exit "Failed to get RDS endpoint"

    POSTGRES_USER="unifiedhealthadmin"
    DATABASE_NAME="unified_health"

    DATABASE_URL="postgresql://${POSTGRES_USER}:${RDS_PASSWORD}@${RDS_ENDPOINT}:5432/${DATABASE_NAME}?sslmode=require"

    log_success "Database URL built"
}

# Get Redis hostname
get_redis_host() {
    log_info "Getting Redis hostname..."

    REDIS_HOST=$(aws elasticache describe-replication-groups \
        --replication-group-id "${ELASTICACHE_CLUSTER}" \
        --region "${AWS_REGION}" \
        --query 'ReplicationGroups[0].NodeGroups[0].PrimaryEndpoint.Address' \
        --output text) || error_exit "Failed to get Redis hostname"

    log_success "Redis hostname retrieved: ${REDIS_HOST}"
}

# Create Kubernetes secret
create_kubernetes_secret() {
    log_info "Creating Kubernetes secret..."

    # Delete existing secret if it exists
    kubectl delete secret unified-health-secrets -n "${NAMESPACE}" 2>/dev/null || true

    # Create secret
    kubectl create secret generic unified-health-secrets \
        --namespace="${NAMESPACE}" \
        --from-literal=database-url="${DATABASE_URL}" \
        --from-literal=jwt-secret="${JWT_SECRET}" \
        --from-literal=encryption-key="${ENCRYPTION_KEY}" \
        --from-literal=session-secret="${SESSION_SECRET}" \
        --from-literal=redis-password="${REDIS_AUTH_TOKEN}" \
        || error_exit "Failed to create Kubernetes secret"

    log_success "Kubernetes secret created"
}

# Create ConfigMap
create_configmap() {
    log_info "Creating ConfigMap..."

    # Delete existing ConfigMap if it exists
    kubectl delete configmap unified-health-config -n "${NAMESPACE}" 2>/dev/null || true

    # Create ConfigMap
    kubectl create configmap unified-health-config \
        --namespace="${NAMESPACE}" \
        --from-literal=environment="${ENVIRONMENT}" \
        --from-literal=redis-host="${REDIS_HOST}" \
        --from-literal=aws-region="${AWS_REGION}" \
        --from-literal=log-level="info" \
        --from-literal=node-env="production" \
        || error_exit "Failed to create ConfigMap"

    log_success "ConfigMap created"
}

# Setup AWS Secrets CSI driver (for direct secrets mounting)
setup_secrets_csi_driver() {
    log_info "Setting up AWS Secrets Store CSI driver..."

    # Create SecretProviderClass for AWS Secrets Manager
    cat <<EOF | kubectl apply -f -
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: aws-secrets
  namespace: ${NAMESPACE}
spec:
  provider: aws
  parameters:
    objects: |
      - objectName: "${PROJECT_NAME}/${ENVIRONMENT}/jwt-secret"
        objectType: "secretsmanager"
      - objectName: "${PROJECT_NAME}/${ENVIRONMENT}/encryption-key"
        objectType: "secretsmanager"
      - objectName: "${PROJECT_NAME}/${ENVIRONMENT}/rds-admin-password"
        objectType: "secretsmanager"
      - objectName: "${PROJECT_NAME}/${ENVIRONMENT}/redis-auth-token"
        objectType: "secretsmanager"
  secretObjects:
    - secretName: unified-health-csi-secrets
      type: Opaque
      data:
        - objectName: "${PROJECT_NAME}/${ENVIRONMENT}/jwt-secret"
          key: jwt-secret
        - objectName: "${PROJECT_NAME}/${ENVIRONMENT}/encryption-key"
          key: encryption-key
        - objectName: "${PROJECT_NAME}/${ENVIRONMENT}/rds-admin-password"
          key: database-password
        - objectName: "${PROJECT_NAME}/${ENVIRONMENT}/redis-auth-token"
          key: redis-password
EOF

    log_success "Secrets CSI driver configured"
}

# Setup IRSA (IAM Roles for Service Accounts)
setup_irsa() {
    log_info "Setting up IRSA (IAM Roles for Service Accounts)..."

    if [ "${EKSCTL_AVAILABLE}" != "true" ]; then
        log_warning "eksctl not available, creating IAM role and policy manually..."
        setup_irsa_manual
        return
    fi

    # Check if OIDC provider exists
    OIDC_PROVIDER=$(aws eks describe-cluster \
        --name "${EKS_CLUSTER}" \
        --region "${AWS_REGION}" \
        --query "cluster.identity.oidc.issuer" \
        --output text 2>/dev/null | sed 's|https://||')

    if [ -z "${OIDC_PROVIDER}" ]; then
        log_info "Creating OIDC provider for EKS cluster..."
        eksctl utils associate-iam-oidc-provider \
            --cluster "${EKS_CLUSTER}" \
            --region "${AWS_REGION}" \
            --approve || error_exit "Failed to create OIDC provider"
    else
        log_info "OIDC provider already exists: ${OIDC_PROVIDER}"
    fi

    # Create IAM policy for Secrets Manager access
    POLICY_NAME="${PROJECT_NAME}-${ENVIRONMENT}-secrets-policy"
    POLICY_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:policy/${POLICY_NAME}"

    # Check if policy exists
    if ! aws iam get-policy --policy-arn "${POLICY_ARN}" >/dev/null 2>&1; then
        log_info "Creating IAM policy for Secrets Manager access..."

        cat > /tmp/secrets-policy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "secretsmanager:GetSecretValue",
                "secretsmanager:DescribeSecret"
            ],
            "Resource": [
                "arn:aws:secretsmanager:${AWS_REGION}:${AWS_ACCOUNT_ID}:secret:${PROJECT_NAME}/${ENVIRONMENT}/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "kms:Decrypt",
                "kms:DescribeKey"
            ],
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "kms:ViaService": "secretsmanager.${AWS_REGION}.amazonaws.com"
                }
            }
        }
    ]
}
EOF

        aws iam create-policy \
            --policy-name "${POLICY_NAME}" \
            --policy-document file:///tmp/secrets-policy.json \
            --region "${AWS_REGION}" || error_exit "Failed to create IAM policy"

        rm -f /tmp/secrets-policy.json
        log_success "IAM policy created"
    else
        log_info "IAM policy already exists"
    fi

    # Create service account with IRSA
    log_info "Creating service account with IRSA..."
    eksctl create iamserviceaccount \
        --name "${SERVICE_ACCOUNT_NAME}" \
        --namespace "${NAMESPACE}" \
        --cluster "${EKS_CLUSTER}" \
        --region "${AWS_REGION}" \
        --attach-policy-arn "${POLICY_ARN}" \
        --approve \
        --override-existing-serviceaccounts || log_warning "Failed to create service account with IRSA"

    log_success "IRSA setup completed"
}

# Manual IRSA setup (without eksctl)
setup_irsa_manual() {
    log_info "Setting up IRSA manually..."

    # Get OIDC provider
    OIDC_PROVIDER=$(aws eks describe-cluster \
        --name "${EKS_CLUSTER}" \
        --region "${AWS_REGION}" \
        --query "cluster.identity.oidc.issuer" \
        --output text 2>/dev/null | sed 's|https://||')

    if [ -z "${OIDC_PROVIDER}" ]; then
        log_warning "OIDC provider not found. Run 'eksctl utils associate-iam-oidc-provider' first"
        return 1
    fi

    # Create IAM policy
    POLICY_NAME="${PROJECT_NAME}-${ENVIRONMENT}-secrets-policy"
    POLICY_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:policy/${POLICY_NAME}"

    if ! aws iam get-policy --policy-arn "${POLICY_ARN}" >/dev/null 2>&1; then
        log_info "Creating IAM policy..."

        cat > /tmp/secrets-policy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "secretsmanager:GetSecretValue",
                "secretsmanager:DescribeSecret"
            ],
            "Resource": [
                "arn:aws:secretsmanager:${AWS_REGION}:${AWS_ACCOUNT_ID}:secret:${PROJECT_NAME}/${ENVIRONMENT}/*"
            ]
        }
    ]
}
EOF

        aws iam create-policy \
            --policy-name "${POLICY_NAME}" \
            --policy-document file:///tmp/secrets-policy.json || log_warning "Failed to create policy"

        rm -f /tmp/secrets-policy.json
    fi

    # Create trust policy for the role
    cat > /tmp/trust-policy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/${OIDC_PROVIDER}"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "${OIDC_PROVIDER}:aud": "sts.amazonaws.com",
                    "${OIDC_PROVIDER}:sub": "system:serviceaccount:${NAMESPACE}:${SERVICE_ACCOUNT_NAME}"
                }
            }
        }
    ]
}
EOF

    # Create IAM role
    if ! aws iam get-role --role-name "${IRSA_ROLE_NAME}" >/dev/null 2>&1; then
        log_info "Creating IAM role for IRSA..."
        aws iam create-role \
            --role-name "${IRSA_ROLE_NAME}" \
            --assume-role-policy-document file:///tmp/trust-policy.json || log_warning "Failed to create role"

        aws iam attach-role-policy \
            --role-name "${IRSA_ROLE_NAME}" \
            --policy-arn "${POLICY_ARN}" || log_warning "Failed to attach policy"
    fi

    rm -f /tmp/trust-policy.json

    # Create Kubernetes service account
    ROLE_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:role/${IRSA_ROLE_NAME}"

    cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ${SERVICE_ACCOUNT_NAME}
  namespace: ${NAMESPACE}
  annotations:
    eks.amazonaws.com/role-arn: ${ROLE_ARN}
EOF

    log_success "Manual IRSA setup completed"
}

# Rotate secrets
rotate_secrets() {
    log_info "Rotating secrets..."

    if [ "${ROTATE_SECRETS:-false}" != "true" ]; then
        log_info "Secret rotation not requested (set ROTATE_SECRETS=true to enable)"
        return 0
    fi

    log_warning "Rotating JWT secret..."
    NEW_JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
    aws secretsmanager update-secret \
        --secret-id "${PROJECT_NAME}/${ENVIRONMENT}/jwt-secret" \
        --secret-string "${NEW_JWT_SECRET}" \
        --region "${AWS_REGION}" || log_warning "Failed to rotate JWT secret"

    log_warning "Rotating encryption key..."
    NEW_ENCRYPTION_KEY=$(openssl rand -base64 32 | tr -d '\n')
    aws secretsmanager update-secret \
        --secret-id "${PROJECT_NAME}/${ENVIRONMENT}/encryption-key" \
        --secret-string "${NEW_ENCRYPTION_KEY}" \
        --region "${AWS_REGION}" || log_warning "Failed to rotate encryption key"

    log_warning "Rotating session secret..."
    NEW_SESSION_SECRET=$(openssl rand -base64 32 | tr -d '\n')
    aws secretsmanager update-secret \
        --secret-id "${PROJECT_NAME}/${ENVIRONMENT}/session-secret" \
        --secret-string "${NEW_SESSION_SECRET}" \
        --region "${AWS_REGION}" || log_warning "Failed to rotate session secret"

    log_success "Secrets rotated - you need to restart deployments"
}

# Verify secrets
verify_secrets() {
    log_info "Verifying secrets..."

    # Check if secret exists
    if kubectl get secret unified-health-secrets -n "${NAMESPACE}" >/dev/null 2>&1; then
        log_success "Kubernetes secret exists"

        # Check secret keys
        SECRET_KEYS=$(kubectl get secret unified-health-secrets -n "${NAMESPACE}" -o jsonpath='{.data}' | jq -r 'keys[]')

        log_info "Secret keys found:"
        echo "${SECRET_KEYS}" | while read -r key; do
            log_info "  - ${key}"
        done
    else
        error_exit "Kubernetes secret not found"
    fi

    # Check if ConfigMap exists
    if kubectl get configmap unified-health-config -n "${NAMESPACE}" >/dev/null 2>&1; then
        log_success "ConfigMap exists"
    else
        error_exit "ConfigMap not found"
    fi
}

# Test secret access
test_secret_access() {
    log_info "Testing secret access..."

    # Create a test pod
    cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: secret-test-pod
  namespace: ${NAMESPACE}
spec:
  containers:
  - name: test
    image: busybox
    command: ['sh', '-c', 'echo "Secret test successful" && sleep 10']
    env:
    - name: DATABASE_URL
      valueFrom:
        secretKeyRef:
          name: unified-health-secrets
          key: database-url
    - name: JWT_SECRET
      valueFrom:
        secretKeyRef:
          name: unified-health-secrets
          key: jwt-secret
  restartPolicy: Never
EOF

    # Wait for pod to complete
    sleep 5

    # Check pod status
    POD_STATUS=$(kubectl get pod secret-test-pod -n "${NAMESPACE}" -o jsonpath='{.status.phase}')

    if [ "${POD_STATUS}" == "Running" ] || [ "${POD_STATUS}" == "Succeeded" ]; then
        log_success "Secret access test passed"
    else
        log_warning "Secret access test status: ${POD_STATUS}"
    fi

    # Cleanup test pod
    kubectl delete pod secret-test-pod -n "${NAMESPACE}" 2>/dev/null || true
}

# Output summary
output_summary() {
    log_success "=========================================="
    log_success "Secrets Setup Complete!"
    log_success "=========================================="
    log_info "Environment: ${ENVIRONMENT}"
    log_info "Namespace: ${NAMESPACE}"
    log_info "AWS Region: ${AWS_REGION}"
    log_success "=========================================="
    log_info ""
    log_info "Secrets configured:"
    log_info "  - Database URL"
    log_info "  - JWT Secret"
    log_info "  - Encryption Key"
    log_info "  - Session Secret"
    log_info "  - Redis Password"
    log_info ""
    log_info "Next steps:"
    log_info "1. Verify secrets: kubectl get secrets -n ${NAMESPACE}"
    log_info "2. Deploy application: ./scripts/deploy-${ENVIRONMENT}.sh"
}

# Show usage
show_usage() {
    echo "============================================"
    echo "UnifiedHealth Platform - AWS Secrets Setup"
    echo "============================================"
    echo ""
    echo "Usage: $0 [environment] [options]"
    echo ""
    echo "Environments:"
    echo "  dev         - Development environment"
    echo "  staging     - Staging environment (default)"
    echo "  production  - Production environment"
    echo ""
    echo "Environment Variables:"
    echo "  AWS_REGION        - AWS region (default: us-east-1)"
    echo "  AWS_ACCOUNT_ID    - AWS account ID (auto-detected)"
    echo "  EKS_CLUSTER       - EKS cluster name (default: unified-health-eks-<env>)"
    echo "  ROTATE_SECRETS    - Set to 'true' to rotate secrets"
    echo "  SKIP_IRSA         - Set to 'true' to skip IRSA setup"
    echo ""
    echo "Examples:"
    echo "  $0 staging"
    echo "  $0 production"
    echo "  AWS_REGION=eu-west-1 $0 staging"
    echo "  ROTATE_SECRETS=true $0 production"
    echo ""
}

# Main setup flow
main() {
    # Check for help flag
    if [ "${1:-}" == "-h" ] || [ "${1:-}" == "--help" ]; then
        show_usage
        exit 0
    fi

    log_info "Starting AWS secrets setup..."
    log_info "Environment: ${ENVIRONMENT}"
    log_info "AWS Region: ${AWS_REGION}"

    check_prerequisites
    get_eks_credentials
    create_namespace

    # Setup IRSA first (before secrets)
    if [ "${SKIP_IRSA:-false}" != "true" ]; then
        setup_irsa
    else
        log_info "Skipping IRSA setup (SKIP_IRSA=true)"
    fi

    generate_secrets
    get_secrets_from_secrets_manager
    build_database_url
    get_redis_host
    create_kubernetes_secret
    create_configmap
    setup_secrets_csi_driver
    rotate_secrets
    verify_secrets
    test_secret_access
    output_summary
}

# Run main
main "$@"

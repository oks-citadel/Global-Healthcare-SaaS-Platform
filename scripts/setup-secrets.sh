#!/bin/bash
# ============================================
# UnifiedHealth Platform - Secrets Setup
# ============================================
# This script creates Kubernetes secrets from Azure Key Vault
# Usage: ./scripts/setup-secrets.sh [environment]

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT="${1:-staging}"
NAMESPACE="unified-health-${ENVIRONMENT}"
RESOURCE_GROUP="unified-health-rg-${ENVIRONMENT}"
AKS_CLUSTER="unified-health-aks-${ENVIRONMENT}"
KEYVAULT_NAME="unified-health-kv-${ENVIRONMENT}"
POSTGRES_SERVER="unified-health-postgres-${ENVIRONMENT}"
REDIS_NAME="unified-health-redis-${ENVIRONMENT}"

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
    command -v az >/dev/null 2>&1 || error_exit "Azure CLI is not installed"

    # Check Azure login
    az account show >/dev/null 2>&1 || error_exit "Not logged in to Azure. Run 'az login'"

    log_success "Prerequisites check passed"
}

# Get AKS credentials
get_aks_credentials() {
    log_info "Getting AKS credentials..."
    az aks get-credentials \
        --resource-group "${RESOURCE_GROUP}" \
        --name "${AKS_CLUSTER}" \
        --overwrite-existing || error_exit "Failed to get AKS credentials"
    log_success "AKS credentials retrieved"
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

# Generate secrets if they don't exist in Key Vault
generate_secrets() {
    log_info "Generating secrets..."

    # JWT Secret
    if ! az keyvault secret show --vault-name "${KEYVAULT_NAME}" --name "jwt-secret" >/dev/null 2>&1; then
        JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
        az keyvault secret set \
            --vault-name "${KEYVAULT_NAME}" \
            --name "jwt-secret" \
            --value "${JWT_SECRET}" || error_exit "Failed to store JWT secret"
        log_success "JWT secret generated"
    fi

    # Encryption Key
    if ! az keyvault secret show --vault-name "${KEYVAULT_NAME}" --name "encryption-key" >/dev/null 2>&1; then
        ENCRYPTION_KEY=$(openssl rand -base64 32 | tr -d '\n')
        az keyvault secret set \
            --vault-name "${KEYVAULT_NAME}" \
            --name "encryption-key" \
            --value "${ENCRYPTION_KEY}" || error_exit "Failed to store encryption key"
        log_success "Encryption key generated"
    fi

    # Session Secret
    if ! az keyvault secret show --vault-name "${KEYVAULT_NAME}" --name "session-secret" >/dev/null 2>&1; then
        SESSION_SECRET=$(openssl rand -base64 32 | tr -d '\n')
        az keyvault secret set \
            --vault-name "${KEYVAULT_NAME}" \
            --name "session-secret" \
            --value "${SESSION_SECRET}" || error_exit "Failed to store session secret"
        log_success "Session secret generated"
    fi
}

# Get secrets from Azure Key Vault
get_secrets_from_keyvault() {
    log_info "Retrieving secrets from Key Vault..."

    # JWT Secret
    JWT_SECRET=$(az keyvault secret show \
        --vault-name "${KEYVAULT_NAME}" \
        --name "jwt-secret" \
        --query value -o tsv) || error_exit "Failed to get JWT secret"

    # Encryption Key
    ENCRYPTION_KEY=$(az keyvault secret show \
        --vault-name "${KEYVAULT_NAME}" \
        --name "encryption-key" \
        --query value -o tsv) || error_exit "Failed to get encryption key"

    # Session Secret
    SESSION_SECRET=$(az keyvault secret show \
        --vault-name "${KEYVAULT_NAME}" \
        --name "session-secret" \
        --query value -o tsv) || error_exit "Failed to get session secret"

    # PostgreSQL Admin Password
    POSTGRES_PASSWORD=$(az keyvault secret show \
        --vault-name "${KEYVAULT_NAME}" \
        --name "postgres-admin-password" \
        --query value -o tsv) || error_exit "Failed to get PostgreSQL password"

    # Redis Primary Key
    REDIS_KEY=$(az keyvault secret show \
        --vault-name "${KEYVAULT_NAME}" \
        --name "redis-primary-key" \
        --query value -o tsv) || error_exit "Failed to get Redis key"

    # Storage Account Key
    STORAGE_KEY=$(az keyvault secret show \
        --vault-name "${KEYVAULT_NAME}" \
        --name "storage-account-key" \
        --query value -o tsv) || error_exit "Failed to get storage key"

    # Application Insights Key
    APP_INSIGHTS_KEY=$(az keyvault secret show \
        --vault-name "${KEYVAULT_NAME}" \
        --name "app-insights-key" \
        --query value -o tsv) || log_warning "Failed to get App Insights key"

    log_success "Secrets retrieved from Key Vault"
}

# Build database URL
build_database_url() {
    log_info "Building database URL..."

    POSTGRES_HOST="${POSTGRES_SERVER}.postgres.database.azure.com"
    POSTGRES_USER="unifiedhealthadmin"
    DATABASE_NAME="unified_health"

    DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${DATABASE_NAME}?sslmode=require"

    log_success "Database URL built"
}

# Get Redis hostname
get_redis_host() {
    log_info "Getting Redis hostname..."

    REDIS_HOST=$(az redis show \
        --name "${REDIS_NAME}" \
        --resource-group "${RESOURCE_GROUP}" \
        --query hostName -o tsv) || error_exit "Failed to get Redis hostname"

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
        --from-literal=redis-password="${REDIS_KEY}" \
        --from-literal=storage-account-key="${STORAGE_KEY}" \
        --from-literal=app-insights-key="${APP_INSIGHTS_KEY:-}" \
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
        --from-literal=postgres-host="${POSTGRES_SERVER}.postgres.database.azure.com" \
        --from-literal=log-level="info" \
        --from-literal=node-env="production" \
        || error_exit "Failed to create ConfigMap"

    log_success "ConfigMap created"
}

# Setup CSI driver for Key Vault (alternative method)
setup_csi_driver() {
    log_info "Setting up Azure Key Vault CSI driver..."

    # Create SecretProviderClass
    cat <<EOF | kubectl apply -f -
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: azure-keyvault-secrets
  namespace: ${NAMESPACE}
spec:
  provider: azure
  parameters:
    usePodIdentity: "false"
    useVMManagedIdentity: "true"
    keyvaultName: "${KEYVAULT_NAME}"
    cloudName: "AzurePublicCloud"
    objects: |
      array:
        - |
          objectName: jwt-secret
          objectType: secret
          objectVersion: ""
        - |
          objectName: encryption-key
          objectType: secret
          objectVersion: ""
        - |
          objectName: postgres-admin-password
          objectType: secret
          objectVersion: ""
        - |
          objectName: redis-primary-key
          objectType: secret
          objectVersion: ""
    tenantId: "$(az account show --query tenantId -o tsv)"
  secretObjects:
    - secretName: unified-health-kv-secrets
      type: Opaque
      data:
        - objectName: jwt-secret
          key: jwt-secret
        - objectName: encryption-key
          key: encryption-key
        - objectName: postgres-admin-password
          key: database-password
        - objectName: redis-primary-key
          key: redis-password
EOF

    log_success "CSI driver configured"
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
    az keyvault secret set \
        --vault-name "${KEYVAULT_NAME}" \
        --name "jwt-secret" \
        --value "${NEW_JWT_SECRET}" || log_warning "Failed to rotate JWT secret"

    log_warning "Rotating encryption key..."
    NEW_ENCRYPTION_KEY=$(openssl rand -base64 32 | tr -d '\n')
    az keyvault secret set \
        --vault-name "${KEYVAULT_NAME}" \
        --name "encryption-key" \
        --value "${NEW_ENCRYPTION_KEY}" || log_warning "Failed to rotate encryption key"

    log_warning "Rotating session secret..."
    NEW_SESSION_SECRET=$(openssl rand -base64 32 | tr -d '\n')
    az keyvault secret set \
        --vault-name "${KEYVAULT_NAME}" \
        --name "session-secret" \
        --value "${NEW_SESSION_SECRET}" || log_warning "Failed to rotate session secret"

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
    log_info "Key Vault: ${KEYVAULT_NAME}"
    log_success "=========================================="
    log_info ""
    log_info "Secrets configured:"
    log_info "  - Database URL"
    log_info "  - JWT Secret"
    log_info "  - Encryption Key"
    log_info "  - Session Secret"
    log_info "  - Redis Password"
    log_info "  - Storage Account Key"
    log_info "  - Application Insights Key"
    log_info ""
    log_info "Next steps:"
    log_info "1. Verify secrets: kubectl get secrets -n ${NAMESPACE}"
    log_info "2. Deploy application: ./scripts/deploy-${ENVIRONMENT}.sh"
}

# Main setup flow
main() {
    log_info "Starting secrets setup..."
    log_info "Environment: ${ENVIRONMENT}"

    check_prerequisites
    get_aks_credentials
    create_namespace
    generate_secrets
    get_secrets_from_keyvault
    build_database_url
    get_redis_host
    create_kubernetes_secret
    create_configmap
    setup_csi_driver
    rotate_secrets
    verify_secrets
    test_secret_access
    output_summary
}

# Run main
main "$@"

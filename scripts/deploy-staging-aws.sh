#!/bin/bash
# ============================================
# UnifiedHealth Platform - AWS Staging Deployment
# ============================================
# This script deploys the application to staging environment on AWS
# Usage: ./scripts/deploy-staging-aws.sh
#
# Prerequisites:
#   - AWS CLI v2 installed and configured
#   - kubectl installed
#   - Docker installed
#   - Access to AWS EKS cluster
#   - Access to AWS ECR registry

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
ENVIRONMENT="staging"
NAMESPACE="unified-health-staging"
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-}"
ECR_REGISTRY=""
EKS_CLUSTER="${EKS_CLUSTER:-unified-health-eks-staging}"
VERSION="${VERSION:-$(git rev-parse --short HEAD)}"
BUILD_TIMESTAMP=$(date +%Y%m%d-%H%M%S)
IMAGE_TAG="${VERSION}-${BUILD_TIMESTAMP}"

# CloudWatch configuration
CLOUDWATCH_LOG_GROUP="/aws/eks/${EKS_CLUSTER}/application"

# Log functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"
}

# Error handler
error_exit() {
    log_error "$1"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    command -v docker >/dev/null 2>&1 || error_exit "Docker is not installed"
    command -v kubectl >/dev/null 2>&1 || error_exit "kubectl is not installed"
    command -v aws >/dev/null 2>&1 || error_exit "AWS CLI is not installed"

    # Check AWS credentials
    aws sts get-caller-identity >/dev/null 2>&1 || error_exit "Not authenticated with AWS. Run 'aws configure' or 'aws sso login'"

    # Get AWS Account ID if not set
    if [ -z "${AWS_ACCOUNT_ID}" ]; then
        AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    fi
    ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

    log_success "Prerequisites check passed"
}

# Login to ECR
login_to_ecr() {
    log_info "Logging in to Amazon ECR..."
    aws ecr get-login-password --region "${AWS_REGION}" | docker login --username AWS --password-stdin "${ECR_REGISTRY}" || error_exit "Failed to login to ECR"
    log_success "Logged in to ECR"
}

# Ensure ECR repositories exist
ensure_ecr_repositories() {
    log_info "Ensuring ECR repositories exist..."

    for repo in "unified-health-api" "unified-health-web" "unified-health-mobile"; do
        if ! aws ecr describe-repositories --repository-names "${repo}" --region "${AWS_REGION}" >/dev/null 2>&1; then
            log_info "Creating ECR repository: ${repo}"
            aws ecr create-repository \
                --repository-name "${repo}" \
                --region "${AWS_REGION}" \
                --image-scanning-configuration scanOnPush=true \
                --encryption-configuration encryptionType=AES256 || log_warning "Failed to create ECR repository: ${repo}"
        fi
    done

    log_success "ECR repositories ready"
}

# Build Docker images
build_images() {
    log_info "Building Docker images..."

    cd "${PROJECT_ROOT}"

    # Build API service
    log_info "Building API service..."
    docker build \
        --build-arg NODE_ENV=staging \
        --build-arg BUILD_VERSION="${IMAGE_TAG}" \
        -t "${ECR_REGISTRY}/unified-health-api:${IMAGE_TAG}" \
        -t "${ECR_REGISTRY}/unified-health-api:latest-staging" \
        -f services/api/Dockerfile \
        services/api || error_exit "Failed to build API image"

    # Build Web app
    log_info "Building Web app..."
    docker build \
        --build-arg NODE_ENV=staging \
        --build-arg BUILD_VERSION="${IMAGE_TAG}" \
        -t "${ECR_REGISTRY}/unified-health-web:${IMAGE_TAG}" \
        -t "${ECR_REGISTRY}/unified-health-web:latest-staging" \
        -f apps/web/Dockerfile \
        apps/web || error_exit "Failed to build Web image"

    # Build Mobile app (if Dockerfile exists)
    if [ -f "${PROJECT_ROOT}/apps/mobile/Dockerfile" ]; then
        log_info "Building Mobile app..."
        docker build \
            --build-arg BUILD_VERSION="${IMAGE_TAG}" \
            -t "${ECR_REGISTRY}/unified-health-mobile:${IMAGE_TAG}" \
            -t "${ECR_REGISTRY}/unified-health-mobile:latest-staging" \
            -f apps/mobile/Dockerfile \
            apps/mobile || log_warning "Failed to build Mobile image (non-critical)"
    fi

    log_success "All images built successfully"
}

# Push images to ECR
push_images() {
    log_info "Pushing images to ECR..."

    docker push "${ECR_REGISTRY}/unified-health-api:${IMAGE_TAG}" || error_exit "Failed to push API image"
    docker push "${ECR_REGISTRY}/unified-health-api:latest-staging" || error_exit "Failed to push API latest tag"

    docker push "${ECR_REGISTRY}/unified-health-web:${IMAGE_TAG}" || error_exit "Failed to push Web image"
    docker push "${ECR_REGISTRY}/unified-health-web:latest-staging" || error_exit "Failed to push Web latest tag"

    if docker image inspect "${ECR_REGISTRY}/unified-health-mobile:${IMAGE_TAG}" >/dev/null 2>&1; then
        docker push "${ECR_REGISTRY}/unified-health-mobile:${IMAGE_TAG}" || log_warning "Failed to push Mobile image"
        docker push "${ECR_REGISTRY}/unified-health-mobile:latest-staging" || log_warning "Failed to push Mobile latest tag"
    fi

    log_success "All images pushed successfully"
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
    log_info "Ensuring namespace exists..."
    kubectl create namespace "${NAMESPACE}" 2>/dev/null || true
    log_success "Namespace ready"
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."

    # Create a migration job
    cat <<EOF | kubectl apply -f -
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration-${BUILD_TIMESTAMP}
  namespace: ${NAMESPACE}
spec:
  ttlSecondsAfterFinished: 86400
  backoffLimit: 3
  template:
    spec:
      restartPolicy: Never
      serviceAccountName: unified-health-api
      containers:
      - name: migration
        image: ${ECR_REGISTRY}/unified-health-api:${IMAGE_TAG}
        command: ["pnpm", "db:migrate:deploy"]
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: unified-health-secrets
              key: database-url
        resources:
          requests:
            cpu: "100m"
            memory: "256Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
EOF

    # Wait for migration to complete
    log_info "Waiting for migration to complete..."
    kubectl wait --for=condition=complete \
        --timeout=300s \
        -n "${NAMESPACE}" \
        "job/db-migration-${BUILD_TIMESTAMP}" || error_exit "Database migration failed"

    log_success "Database migrations completed"
}

# Apply Kubernetes configurations
apply_k8s_configs() {
    log_info "Applying Kubernetes configurations..."

    cd "${PROJECT_ROOT}"

    # Update image tags in deployments
    export ECR_REGISTRY IMAGE_TAG

    # Apply namespace
    kubectl apply -f infrastructure/kubernetes/base/namespace.yaml 2>/dev/null || log_warning "Namespace file not found, using created namespace"

    # Apply ConfigMaps and Secrets (if files exist)
    if [ -f infrastructure/kubernetes/base/configmap.yaml ]; then
        kubectl apply -f infrastructure/kubernetes/base/configmap.yaml || log_warning "Failed to apply ConfigMap"
    fi

    if [ -f infrastructure/kubernetes/base/secrets.yaml ]; then
        kubectl apply -f infrastructure/kubernetes/base/secrets.yaml || log_warning "Failed to apply Secrets"
    fi

    # Apply deployments with updated image tags
    if [ -f infrastructure/kubernetes/base/api-deployment.yaml ]; then
        envsubst < infrastructure/kubernetes/base/api-deployment.yaml | kubectl apply -f - || error_exit "Failed to apply API deployment"
    fi

    # Apply overlays if they exist
    if [ -d "infrastructure/kubernetes/overlays/staging" ]; then
        kubectl apply -k infrastructure/kubernetes/overlays/staging || error_exit "Failed to apply staging overlay"
    fi

    log_success "Kubernetes configurations applied"
}

# Deploy API service directly if no overlay exists
deploy_api_service() {
    log_info "Deploying API service..."

    cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: unified-health-api
  namespace: ${NAMESPACE}
  labels:
    app: unified-health-api
    environment: ${ENVIRONMENT}
    version: ${IMAGE_TAG}
spec:
  replicas: 2
  selector:
    matchLabels:
      app: unified-health-api
  template:
    metadata:
      labels:
        app: unified-health-api
        environment: ${ENVIRONMENT}
        version: ${IMAGE_TAG}
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8080"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: unified-health-api
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
      containers:
        - name: api
          image: ${ECR_REGISTRY}/unified-health-api:${IMAGE_TAG}
          imagePullPolicy: Always
          ports:
            - containerPort: 8080
              name: http
          env:
            - name: NODE_ENV
              value: "staging"
            - name: PORT
              value: "8080"
            - name: AWS_REGION
              value: "${AWS_REGION}"
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: unified-health-secrets
                  key: database-url
            - name: REDIS_HOST
              valueFrom:
                configMapKeyRef:
                  name: unified-health-config
                  key: redis-host
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: unified-health-secrets
                  key: jwt-secret
          resources:
            requests:
              cpu: "250m"
              memory: "256Mi"
            limits:
              cpu: "1000m"
              memory: "1Gi"
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /ready
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 5
            timeoutSeconds: 3
            failureThreshold: 3
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop:
                - ALL
          volumeMounts:
            - name: tmp
              mountPath: /tmp
      volumes:
        - name: tmp
          emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: unified-health-api
  namespace: ${NAMESPACE}
  labels:
    app: unified-health-api
spec:
  type: LoadBalancer
  ports:
    - port: 80
      targetPort: 8080
      protocol: TCP
      name: http
  selector:
    app: unified-health-api
EOF

    log_success "API service deployed"
}

# Wait for deployment rollout
wait_for_rollout() {
    log_info "Waiting for deployment rollout..."

    kubectl rollout status deployment/unified-health-api -n "${NAMESPACE}" --timeout=300s || error_exit "API deployment rollout failed"

    log_success "Deployment rollout completed"
}

# Verify deployment health
verify_health() {
    log_info "Verifying deployment health..."

    # Get pod status
    kubectl get pods -n "${NAMESPACE}" -l app=unified-health-api

    # Check if pods are running
    READY_PODS=$(kubectl get pods -n "${NAMESPACE}" -l app=unified-health-api -o json | jq -r '.items[] | select(.status.phase=="Running") | .metadata.name' | wc -l)

    if [ "${READY_PODS}" -eq 0 ]; then
        error_exit "No pods are running"
    fi

    log_success "Deployment health verified: ${READY_PODS} pods running"

    # Get service endpoint
    SERVICE_HOSTNAME=$(kubectl get svc unified-health-api -n "${NAMESPACE}" -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "")
    if [ -n "${SERVICE_HOSTNAME}" ]; then
        log_info "Service endpoint: ${SERVICE_HOSTNAME}"
    else
        log_info "Service endpoint: ClusterIP (LoadBalancer pending)"
    fi
}

# Run smoke tests
run_smoke_tests() {
    log_info "Running smoke tests..."

    # Port forward to API service
    kubectl port-forward -n "${NAMESPACE}" svc/unified-health-api 8080:80 &
    PF_PID=$!

    sleep 5

    # Test health endpoint
    log_info "Testing health endpoint..."
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health 2>/dev/null || echo "000")

    if [ "${HTTP_CODE}" == "200" ]; then
        log_success "Health check passed"
    else
        log_warning "Health check returned: ${HTTP_CODE}"
    fi

    # Test ready endpoint
    log_info "Testing ready endpoint..."
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/ready 2>/dev/null || echo "000")

    if [ "${HTTP_CODE}" == "200" ]; then
        log_success "Ready check passed"
    else
        log_warning "Ready check returned: ${HTTP_CODE}"
    fi

    # Kill port forward
    kill ${PF_PID} 2>/dev/null || true

    log_success "Smoke tests completed"
}

# Check CloudWatch logs
check_cloudwatch_logs() {
    log_info "Checking CloudWatch logs..."

    # Get recent log events
    aws logs filter-log-events \
        --log-group-name "${CLOUDWATCH_LOG_GROUP}" \
        --start-time $(($(date +%s) - 300))000 \
        --limit 10 \
        --region "${AWS_REGION}" \
        --query 'events[].message' \
        --output text 2>/dev/null || log_warning "CloudWatch logs not available"
}

# Tag deployment
tag_deployment() {
    log_info "Tagging deployment..."

    git tag -a "staging-${IMAGE_TAG}" -m "Staging deployment ${IMAGE_TAG}" 2>/dev/null || log_warning "Failed to create git tag"

    log_success "Deployment tagged"
}

# Send notification
send_notification() {
    local status=$1
    local message=$2

    log_info "Sending deployment notification..."

    # Slack notification
    if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
        curl -s -X POST "${SLACK_WEBHOOK_URL}" \
            -H 'Content-Type: application/json' \
            -d "{
                \"text\":\"Staging Deployment ${status}: ${message}\",
                \"attachments\":[{
                    \"color\":\"$([ "${status}" == "SUCCESS" ] && echo "good" || echo "danger")\",
                    \"fields\":[
                        {\"title\":\"Environment\",\"value\":\"${ENVIRONMENT}\",\"short\":true},
                        {\"title\":\"Version\",\"value\":\"${IMAGE_TAG}\",\"short\":true},
                        {\"title\":\"AWS Region\",\"value\":\"${AWS_REGION}\",\"short\":true},
                        {\"title\":\"Cluster\",\"value\":\"${EKS_CLUSTER}\",\"short\":true}
                    ]
                }]
            }" || log_warning "Failed to send Slack notification"
    fi

    # SNS notification (if configured)
    if [ -n "${SNS_TOPIC_ARN:-}" ]; then
        aws sns publish \
            --topic-arn "${SNS_TOPIC_ARN}" \
            --subject "Staging Deployment ${status}" \
            --message "${message}" \
            --region "${AWS_REGION}" || log_warning "Failed to send SNS notification"
    fi
}

# Main deployment flow
main() {
    log_info "Starting AWS staging deployment..."
    log_info "Version: ${VERSION}"
    log_info "Image Tag: ${IMAGE_TAG}"
    log_info "Environment: ${ENVIRONMENT}"
    log_info "AWS Region: ${AWS_REGION}"

    check_prerequisites
    login_to_ecr
    ensure_ecr_repositories
    build_images
    push_images
    get_eks_credentials
    create_namespace
    apply_k8s_configs
    deploy_api_service
    run_migrations
    wait_for_rollout
    verify_health
    run_smoke_tests
    check_cloudwatch_logs
    tag_deployment

    log_success "=========================================="
    log_success "AWS Staging deployment completed successfully!"
    log_success "Version: ${IMAGE_TAG}"
    log_success "Region: ${AWS_REGION}"
    log_success "Cluster: ${EKS_CLUSTER}"
    log_success "=========================================="

    send_notification "SUCCESS" "Version ${IMAGE_TAG} deployed successfully"
}

# Trap errors
trap 'send_notification "FAILED" "Deployment failed at line $LINENO"' ERR

# Run main
main "$@"

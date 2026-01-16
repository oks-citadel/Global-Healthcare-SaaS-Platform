#!/bin/bash
# ============================================
# UnifiedHealth Platform - AWS Production Deployment
# ============================================
# This script deploys the application to production using blue-green deployment on AWS
# Usage: ./scripts/deploy-production-aws.sh
#
# Prerequisites:
#   - AWS CLI v2 installed and configured
#   - kubectl installed
#   - Docker installed
#   - jq installed
#   - Access to AWS EKS cluster
#   - Access to AWS ECR registry
#   - Access to AWS Secrets Manager

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
ENVIRONMENT="production"
NAMESPACE="unified-health-prod"
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-}"
ECR_REGISTRY=""
EKS_CLUSTER="${EKS_CLUSTER:-unified-health-eks-prod}"
VERSION="${VERSION:-$(git describe --tags --abbrev=0 2>/dev/null || git rev-parse --short HEAD)}"
BUILD_TIMESTAMP=$(date +%Y%m%d-%H%M%S)
IMAGE_TAG="${VERSION}-${BUILD_TIMESTAMP}"

# Blue-green deployment colors
CURRENT_COLOR=""
NEW_COLOR=""
BACKUP_NAME="pre-deploy-${BUILD_TIMESTAMP}"

# CloudWatch configuration
CLOUDWATCH_LOG_GROUP="/aws/eks/${EKS_CLUSTER}/application"
CLOUDWATCH_ALARM_PREFIX="unified-health-prod"

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
    command -v jq >/dev/null 2>&1 || error_exit "jq is not installed"

    # Check AWS credentials
    aws sts get-caller-identity >/dev/null 2>&1 || error_exit "Not authenticated with AWS. Run 'aws configure' or 'aws sso login'"

    # Get AWS Account ID if not set
    if [ -z "${AWS_ACCOUNT_ID}" ]; then
        AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    fi
    ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

    # Verify we're on main branch or a release tag
    CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "")
    if [[ "${CURRENT_BRANCH}" != "main" ]] && ! git describe --exact-match --tags HEAD >/dev/null 2>&1; then
        error_exit "Production deployments must be from main branch or a release tag"
    fi

    log_success "Prerequisites check passed"
}

# Confirm deployment
confirm_deployment() {
    log_warning "=========================================="
    log_warning "PRODUCTION DEPLOYMENT"
    log_warning "Version: ${IMAGE_TAG}"
    log_warning "Environment: ${ENVIRONMENT}"
    log_warning "AWS Region: ${AWS_REGION}"
    log_warning "AWS Account: ${AWS_ACCOUNT_ID}"
    log_warning "EKS Cluster: ${EKS_CLUSTER}"
    log_warning "=========================================="

    if [ "${SKIP_CONFIRMATION:-false}" != "true" ]; then
        read -p "Are you sure you want to deploy to PRODUCTION? (yes/no): " -r
        if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            log_info "Deployment cancelled"
            exit 0
        fi
    fi
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

    for repo in "unified-health-api" "unified-health-web"; do
        if ! aws ecr describe-repositories --repository-names "${repo}" --region "${AWS_REGION}" >/dev/null 2>&1; then
            log_info "Creating ECR repository: ${repo}"
            aws ecr create-repository \
                --repository-name "${repo}" \
                --region "${AWS_REGION}" \
                --image-scanning-configuration scanOnPush=true \
                --encryption-configuration encryptionType=AES256 || error_exit "Failed to create ECR repository: ${repo}"
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
        --build-arg NODE_ENV=production \
        --build-arg BUILD_VERSION="${IMAGE_TAG}" \
        -t "${ECR_REGISTRY}/unified-health-api:${IMAGE_TAG}" \
        -t "${ECR_REGISTRY}/unified-health-api:latest" \
        -f services/api/Dockerfile \
        services/api || error_exit "Failed to build API image"

    # Build Web app
    log_info "Building Web app..."
    docker build \
        --build-arg NODE_ENV=production \
        --build-arg BUILD_VERSION="${IMAGE_TAG}" \
        -t "${ECR_REGISTRY}/unified-health-web:${IMAGE_TAG}" \
        -t "${ECR_REGISTRY}/unified-health-web:latest" \
        -f apps/web/Dockerfile \
        apps/web || error_exit "Failed to build Web image"

    log_success "All images built successfully"
}

# Scan images for vulnerabilities
scan_images() {
    log_info "Scanning images for vulnerabilities..."

    for image in "unified-health-api" "unified-health-web"; do
        log_info "Scanning ${image}..."

        # Push image first (ECR scanning happens on push)
        docker push "${ECR_REGISTRY}/${image}:${IMAGE_TAG}" || error_exit "Failed to push ${image}"

        # Wait for scan to complete
        sleep 10

        # Get scan findings
        SCAN_STATUS=$(aws ecr describe-image-scan-findings \
            --repository-name "${image}" \
            --image-id imageTag="${IMAGE_TAG}" \
            --region "${AWS_REGION}" \
            --query 'imageScanStatus.status' \
            --output text 2>/dev/null || echo "PENDING")

        if [ "${SCAN_STATUS}" == "COMPLETE" ]; then
            CRITICAL_COUNT=$(aws ecr describe-image-scan-findings \
                --repository-name "${image}" \
                --image-id imageTag="${IMAGE_TAG}" \
                --region "${AWS_REGION}" \
                --query 'imageScanFindings.findingSeverityCounts.CRITICAL' \
                --output text 2>/dev/null || echo "0")

            if [ "${CRITICAL_COUNT}" != "None" ] && [ "${CRITICAL_COUNT}" -gt 0 ]; then
                log_warning "Found ${CRITICAL_COUNT} CRITICAL vulnerabilities in ${image}"
                if [ "${ALLOW_CRITICAL_VULNERABILITIES:-false}" != "true" ]; then
                    error_exit "Deployment blocked due to critical vulnerabilities"
                fi
            fi
        else
            log_warning "Image scan status: ${SCAN_STATUS}"
        fi
    done

    log_success "Image scanning completed"
}

# Push images to ECR
push_images() {
    log_info "Pushing images to ECR..."

    docker push "${ECR_REGISTRY}/unified-health-api:${IMAGE_TAG}" || error_exit "Failed to push API image"
    docker push "${ECR_REGISTRY}/unified-health-api:latest" || error_exit "Failed to push API latest tag"

    docker push "${ECR_REGISTRY}/unified-health-web:${IMAGE_TAG}" || error_exit "Failed to push Web image"
    docker push "${ECR_REGISTRY}/unified-health-web:latest" || error_exit "Failed to push Web latest tag"

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

# Verify secrets from AWS Secrets Manager
verify_secrets() {
    log_info "Verifying secrets from AWS Secrets Manager..."

    local secrets=(
        "unified-health/${ENVIRONMENT}/jwt-secret"
        "unified-health/${ENVIRONMENT}/encryption-key"
        "unified-health/${ENVIRONMENT}/rds-admin-password"
    )

    for secret in "${secrets[@]}"; do
        if ! aws secretsmanager describe-secret --secret-id "${secret}" --region "${AWS_REGION}" >/dev/null 2>&1; then
            error_exit "Required secret not found: ${secret}"
        fi
    done

    log_success "All required secrets verified"
}

# Determine current and new colors for blue-green deployment
determine_colors() {
    log_info "Determining deployment colors..."

    # Check which color is currently active
    CURRENT_SERVICE=$(kubectl get svc unified-health-api -n "${NAMESPACE}" -o jsonpath='{.spec.selector.color}' 2>/dev/null || echo "")

    if [ "${CURRENT_SERVICE}" == "blue" ]; then
        CURRENT_COLOR="blue"
        NEW_COLOR="green"
    else
        CURRENT_COLOR="green"
        NEW_COLOR="blue"
    fi

    log_info "Current color: ${CURRENT_COLOR:-none}"
    log_info "New color: ${NEW_COLOR}"
}

# Backup database
backup_database() {
    log_info "Creating database backup..."

    if [ -x "${SCRIPT_DIR}/db-backup.sh" ]; then
        "${SCRIPT_DIR}/db-backup.sh" || error_exit "Database backup failed"
        log_success "Database backup created: ${BACKUP_NAME}"
    else
        log_warning "Database backup script not found, skipping backup"
    fi
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
    if ! kubectl wait --for=condition=complete \
        --timeout=600s \
        -n "${NAMESPACE}" \
        "job/db-migration-${BUILD_TIMESTAMP}"; then

        log_error "Database migration failed"
        log_info "Rolling back database..."
        if [ -x "${SCRIPT_DIR}/db-restore.sh" ]; then
            "${SCRIPT_DIR}/db-restore.sh" "${BACKUP_NAME}" || log_error "Database rollback failed"
        fi
        error_exit "Deployment aborted due to migration failure"
    fi

    log_success "Database migrations completed"
}

# Deploy new version to new color
deploy_new_version() {
    log_info "Deploying new version to ${NEW_COLOR} environment..."

    # Create deployment for new color
    cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: unified-health-api-${NEW_COLOR}
  namespace: ${NAMESPACE}
  labels:
    app: unified-health-api
    color: ${NEW_COLOR}
    version: ${IMAGE_TAG}
spec:
  replicas: 3
  selector:
    matchLabels:
      app: unified-health-api
      color: ${NEW_COLOR}
  template:
    metadata:
      labels:
        app: unified-health-api
        color: ${NEW_COLOR}
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
              value: "production"
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
              cpu: "500m"
              memory: "512Mi"
            limits:
              cpu: "2000m"
              memory: "2Gi"
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
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchLabels:
                    app: unified-health-api
                    color: ${NEW_COLOR}
                topologyKey: kubernetes.io/hostname
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: topology.kubernetes.io/zone
          whenUnsatisfiable: ScheduleAnyway
          labelSelector:
            matchLabels:
              app: unified-health-api
              color: ${NEW_COLOR}
EOF

    log_success "New version deployed to ${NEW_COLOR} environment"
}

# Wait for new deployment rollout
wait_for_rollout() {
    log_info "Waiting for ${NEW_COLOR} deployment rollout..."

    kubectl rollout status deployment/unified-health-api-${NEW_COLOR} -n "${NAMESPACE}" --timeout=600s || {
        log_error "Rollout failed"
        return 1
    }

    log_success "Deployment rollout completed"
}

# Verify new deployment health
verify_new_deployment() {
    log_info "Verifying ${NEW_COLOR} deployment health..."

    # Wait for all pods to be ready
    local max_retries=30
    local retry_count=0

    while [ ${retry_count} -lt ${max_retries} ]; do
        READY_PODS=$(kubectl get pods -n "${NAMESPACE}" -l "app=unified-health-api,color=${NEW_COLOR}" -o json | jq -r '.items[] | select(.status.phase=="Running" and (.status.conditions[] | select(.type=="Ready" and .status=="True"))) | .metadata.name' | wc -l)
        TOTAL_PODS=$(kubectl get pods -n "${NAMESPACE}" -l "app=unified-health-api,color=${NEW_COLOR}" --no-headers | wc -l)

        if [ "${READY_PODS}" -eq "${TOTAL_PODS}" ] && [ "${READY_PODS}" -gt 0 ]; then
            log_success "All ${READY_PODS} pods are ready"
            break
        fi

        log_info "Waiting for pods to be ready (${READY_PODS}/${TOTAL_PODS})..."
        sleep 10
        retry_count=$((retry_count + 1))
    done

    if [ ${retry_count} -eq ${max_retries} ]; then
        error_exit "Pods did not become ready in time"
    fi

    # Run health checks
    log_info "Running health checks..."

    # Get a pod name
    POD_NAME=$(kubectl get pods -n "${NAMESPACE}" -l "app=unified-health-api,color=${NEW_COLOR}" -o jsonpath='{.items[0].metadata.name}')

    # Test health endpoint
    if kubectl exec -n "${NAMESPACE}" "${POD_NAME}" -- wget -q -O- http://localhost:8080/health >/dev/null 2>&1; then
        log_success "Health check passed"
    else
        error_exit "Health check failed"
    fi

    # Test ready endpoint
    if kubectl exec -n "${NAMESPACE}" "${POD_NAME}" -- wget -q -O- http://localhost:8080/ready >/dev/null 2>&1; then
        log_success "Ready check passed"
    else
        error_exit "Ready check failed"
    fi

    log_success "${NEW_COLOR} deployment health verified"
}

# Switch traffic to new deployment
switch_traffic() {
    log_info "Switching traffic to ${NEW_COLOR} deployment..."

    # Update service selector
    kubectl patch svc unified-health-api -n "${NAMESPACE}" -p "{\"spec\":{\"selector\":{\"app\":\"unified-health-api\",\"color\":\"${NEW_COLOR}\"}}}" || error_exit "Failed to switch traffic"

    log_success "Traffic switched to ${NEW_COLOR} deployment"
}

# Monitor new deployment with CloudWatch
monitor_deployment() {
    log_info "Monitoring ${NEW_COLOR} deployment for 60 seconds..."

    local monitor_time=60
    local check_interval=10
    local elapsed=0

    while [ ${elapsed} -lt ${monitor_time} ]; do
        # Check pod status
        FAILING_PODS=$(kubectl get pods -n "${NAMESPACE}" -l "app=unified-health-api,color=${NEW_COLOR}" -o json | jq -r '.items[] | select(.status.phase!="Running" or (.status.conditions[] | select(.type=="Ready" and .status!="True"))) | .metadata.name' | wc -l)

        if [ "${FAILING_PODS}" -gt 0 ]; then
            log_error "${FAILING_PODS} pods are failing"
            return 1
        fi

        # Check CloudWatch alarms
        ALARM_STATE=$(aws cloudwatch describe-alarms \
            --alarm-name-prefix "${CLOUDWATCH_ALARM_PREFIX}" \
            --state-value ALARM \
            --region "${AWS_REGION}" \
            --query 'MetricAlarms[].AlarmName' \
            --output text 2>/dev/null || echo "")

        if [ -n "${ALARM_STATE}" ]; then
            log_error "CloudWatch alarms triggered: ${ALARM_STATE}"
            return 1
        fi

        log_info "All pods healthy (${elapsed}/${monitor_time}s)..."
        sleep ${check_interval}
        elapsed=$((elapsed + check_interval))
    done

    log_success "Deployment monitoring completed successfully"
}

# Cleanup old deployment
cleanup_old_deployment() {
    if [ -n "${CURRENT_COLOR}" ]; then
        log_info "Scaling down ${CURRENT_COLOR} deployment..."

        kubectl scale deployment unified-health-api-${CURRENT_COLOR} -n "${NAMESPACE}" --replicas=0 || log_warning "Failed to scale down old deployment"

        log_success "Old deployment scaled down"
    fi
}

# Rollback deployment
rollback_deployment() {
    log_error "Rolling back deployment..."

    if [ -n "${CURRENT_COLOR}" ]; then
        # Switch traffic back
        log_info "Switching traffic back to ${CURRENT_COLOR}..."
        kubectl patch svc unified-health-api -n "${NAMESPACE}" -p "{\"spec\":{\"selector\":{\"app\":\"unified-health-api\",\"color\":\"${CURRENT_COLOR}\"}}}" || log_error "Failed to switch traffic back"

        # Scale up old deployment
        log_info "Scaling up ${CURRENT_COLOR} deployment..."
        kubectl scale deployment unified-health-api-${CURRENT_COLOR} -n "${NAMESPACE}" --replicas=3 || log_error "Failed to scale up old deployment"
    fi

    # Scale down new deployment
    if [ -n "${NEW_COLOR}" ]; then
        log_info "Scaling down ${NEW_COLOR} deployment..."
        kubectl scale deployment unified-health-api-${NEW_COLOR} -n "${NAMESPACE}" --replicas=0 || log_error "Failed to scale down new deployment"
    fi

    # Restore database
    if [ -x "${SCRIPT_DIR}/db-restore.sh" ]; then
        log_info "Restoring database..."
        "${SCRIPT_DIR}/db-restore.sh" "${BACKUP_NAME}" || log_error "Database restore failed"
    fi

    log_warning "Rollback completed"
}

# Tag deployment in git
tag_deployment() {
    log_info "Tagging deployment..."

    git tag -a "production-${IMAGE_TAG}" -m "Production deployment ${IMAGE_TAG}" 2>/dev/null || log_warning "Failed to create git tag"

    log_success "Deployment tagged"
}

# Send notification via SNS
send_notification() {
    local status=$1
    local message=$2

    log_info "Sending deployment notification..."

    # Slack notification
    if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
        curl -s -X POST "${SLACK_WEBHOOK_URL}" \
            -H 'Content-Type: application/json' \
            -d "{
                \"text\":\"Production Deployment ${status}\",
                \"attachments\":[{
                    \"color\":\"$([ "${status}" == "SUCCESS" ] && echo "good" || echo "danger")\",
                    \"fields\":[
                        {\"title\":\"Environment\",\"value\":\"${ENVIRONMENT}\",\"short\":true},
                        {\"title\":\"Version\",\"value\":\"${IMAGE_TAG}\",\"short\":true},
                        {\"title\":\"AWS Region\",\"value\":\"${AWS_REGION}\",\"short\":true},
                        {\"title\":\"Cluster\",\"value\":\"${EKS_CLUSTER}\",\"short\":true},
                        {\"title\":\"Message\",\"value\":\"${message}\",\"short\":false}
                    ]
                }]
            }" || log_warning "Failed to send Slack notification"
    fi

    # SNS notification (if configured)
    if [ -n "${SNS_TOPIC_ARN:-}" ]; then
        aws sns publish \
            --topic-arn "${SNS_TOPIC_ARN}" \
            --subject "Production Deployment ${status}" \
            --message "${message}" \
            --region "${AWS_REGION}" || log_warning "Failed to send SNS notification"
    fi

    # CloudWatch custom metric
    aws cloudwatch put-metric-data \
        --namespace "UnifiedHealth/Deployments" \
        --metric-name "DeploymentStatus" \
        --dimensions "Environment=${ENVIRONMENT},Version=${IMAGE_TAG}" \
        --value "$([ "${status}" == "SUCCESS" ] && echo 1 || echo 0)" \
        --unit Count \
        --region "${AWS_REGION}" 2>/dev/null || log_warning "Failed to send CloudWatch metric"
}

# Main deployment flow
main() {
    log_info "Starting AWS production deployment..."
    log_info "Version: ${VERSION}"
    log_info "Image Tag: ${IMAGE_TAG}"
    log_info "Environment: ${ENVIRONMENT}"
    log_info "AWS Region: ${AWS_REGION}"

    check_prerequisites
    confirm_deployment
    login_to_ecr
    ensure_ecr_repositories
    build_images
    scan_images
    push_images
    get_eks_credentials
    verify_secrets
    determine_colors
    backup_database
    run_migrations
    deploy_new_version
    wait_for_rollout
    verify_new_deployment
    switch_traffic

    if monitor_deployment; then
        cleanup_old_deployment
        tag_deployment

        log_success "=========================================="
        log_success "AWS Production deployment completed successfully!"
        log_success "Version: ${IMAGE_TAG}"
        log_success "Color: ${NEW_COLOR}"
        log_success "Region: ${AWS_REGION}"
        log_success "=========================================="

        send_notification "SUCCESS" "Version ${IMAGE_TAG} deployed successfully to AWS production"
    else
        log_error "Deployment monitoring detected issues"
        rollback_deployment
        send_notification "FAILED" "Deployment failed and was rolled back"
        exit 1
    fi
}

# Trap errors and rollback
trap 'rollback_deployment; send_notification "FAILED" "Deployment failed at line $LINENO"' ERR

# Run main
main "$@"

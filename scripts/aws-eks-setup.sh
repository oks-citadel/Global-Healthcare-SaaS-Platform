#!/bin/bash
# ============================================
# UnifiedHealth Platform - AWS EKS Cluster Setup
# ============================================
# This script sets up an EKS cluster with all required components:
#   - AWS Load Balancer Controller
#   - ExternalDNS for Route 53
#   - Cert-manager with Route 53 DNS01 solver
#   - AWS Secrets Store CSI Driver
#   - Container Insights (CloudWatch)
#   - Cluster Autoscaler
#
# Usage: ./scripts/aws-eks-setup.sh [environment]
#
# Prerequisites:
#   - AWS CLI v2 installed and configured
#   - eksctl installed
#   - kubectl installed
#   - helm installed
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
PROJECT_NAME="unified-health"
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-}"
EKS_CLUSTER="${EKS_CLUSTER:-${PROJECT_NAME}-eks-${ENVIRONMENT}}"
EKS_VERSION="${EKS_VERSION:-1.28}"
DOMAIN_NAME="${DOMAIN_NAME:-unifiedhealth.example.com}"
HOSTED_ZONE_ID="${HOSTED_ZONE_ID:-}"

# Node group configuration
NODE_INSTANCE_TYPE="${NODE_INSTANCE_TYPE:-m5.large}"
NODE_MIN_SIZE="${NODE_MIN_SIZE:-2}"
NODE_MAX_SIZE="${NODE_MAX_SIZE:-10}"
NODE_DESIRED_SIZE="${NODE_DESIRED_SIZE:-3}"

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

    command -v aws >/dev/null 2>&1 || error_exit "AWS CLI is not installed"
    command -v eksctl >/dev/null 2>&1 || error_exit "eksctl is not installed"
    command -v kubectl >/dev/null 2>&1 || error_exit "kubectl is not installed"
    command -v helm >/dev/null 2>&1 || error_exit "Helm is not installed"

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
}

# Create EKS cluster
create_eks_cluster() {
    log_info "Creating EKS cluster: ${EKS_CLUSTER}..."

    # Check if cluster already exists
    if eksctl get cluster --name "${EKS_CLUSTER}" --region "${AWS_REGION}" >/dev/null 2>&1; then
        log_warning "EKS cluster ${EKS_CLUSTER} already exists"
        return 0
    fi

    # Create cluster configuration
    cat > /tmp/eks-cluster-config.yaml <<EOF
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: ${EKS_CLUSTER}
  region: ${AWS_REGION}
  version: "${EKS_VERSION}"
  tags:
    Project: ${PROJECT_NAME}
    Environment: ${ENVIRONMENT}

iam:
  withOIDC: true

vpc:
  cidr: 10.0.0.0/16
  clusterEndpoints:
    publicAccess: true
    privateAccess: true

addons:
  - name: vpc-cni
    version: latest
    attachPolicyARNs:
      - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy
  - name: coredns
    version: latest
  - name: kube-proxy
    version: latest
  - name: aws-ebs-csi-driver
    version: latest
    wellKnownPolicies:
      ebsCSIController: true

managedNodeGroups:
  - name: ${PROJECT_NAME}-ng-${ENVIRONMENT}
    instanceType: ${NODE_INSTANCE_TYPE}
    minSize: ${NODE_MIN_SIZE}
    maxSize: ${NODE_MAX_SIZE}
    desiredCapacity: ${NODE_DESIRED_SIZE}
    volumeSize: 100
    volumeType: gp3
    volumeEncrypted: true
    ssh:
      allow: false
    labels:
      role: application
      environment: ${ENVIRONMENT}
    tags:
      Project: ${PROJECT_NAME}
      Environment: ${ENVIRONMENT}
    iam:
      withAddonPolicies:
        imageBuilder: true
        autoScaler: true
        albIngress: true
        cloudWatch: true
        ebs: true
        efs: true

cloudWatch:
  clusterLogging:
    enableTypes: ["api", "audit", "authenticator", "controllerManager", "scheduler"]
EOF

    log_info "Creating EKS cluster (this may take 15-20 minutes)..."
    eksctl create cluster -f /tmp/eks-cluster-config.yaml || error_exit "Failed to create EKS cluster"

    rm -f /tmp/eks-cluster-config.yaml

    log_success "EKS cluster created successfully"
}

# Get EKS credentials
get_eks_credentials() {
    log_info "Getting EKS credentials..."
    aws eks update-kubeconfig \
        --region "${AWS_REGION}" \
        --name "${EKS_CLUSTER}" || error_exit "Failed to get EKS credentials"
    log_success "EKS credentials retrieved"
}

# Create namespaces
create_namespaces() {
    log_info "Creating namespaces..."

    for ns in "unified-health-${ENVIRONMENT}" "cert-manager" "external-dns" "kube-system"; do
        kubectl create namespace "${ns}" 2>/dev/null || true
    done

    log_success "Namespaces created"
}

# Install AWS Load Balancer Controller
install_aws_load_balancer_controller() {
    log_info "Installing AWS Load Balancer Controller..."

    # Create IAM policy
    POLICY_NAME="AWSLoadBalancerControllerIAMPolicy"
    POLICY_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:policy/${POLICY_NAME}"

    if ! aws iam get-policy --policy-arn "${POLICY_ARN}" >/dev/null 2>&1; then
        log_info "Creating IAM policy for AWS Load Balancer Controller..."
        curl -s -o /tmp/iam_policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.6.1/docs/install/iam_policy.json
        aws iam create-policy \
            --policy-name "${POLICY_NAME}" \
            --policy-document file:///tmp/iam_policy.json || log_warning "Policy may already exist"
        rm -f /tmp/iam_policy.json
    fi

    # Create service account with IRSA
    eksctl create iamserviceaccount \
        --cluster="${EKS_CLUSTER}" \
        --namespace=kube-system \
        --name=aws-load-balancer-controller \
        --attach-policy-arn="${POLICY_ARN}" \
        --region="${AWS_REGION}" \
        --approve \
        --override-existing-serviceaccounts || log_warning "Service account may already exist"

    # Add Helm repo
    helm repo add eks https://aws.github.io/eks-charts
    helm repo update

    # Install controller
    helm upgrade --install aws-load-balancer-controller eks/aws-load-balancer-controller \
        --namespace kube-system \
        --set clusterName="${EKS_CLUSTER}" \
        --set serviceAccount.create=false \
        --set serviceAccount.name=aws-load-balancer-controller \
        --set region="${AWS_REGION}" \
        --set vpcId="$(aws eks describe-cluster --name "${EKS_CLUSTER}" --region "${AWS_REGION}" --query 'cluster.resourcesVpcConfig.vpcId' --output text)" \
        --wait || error_exit "Failed to install AWS Load Balancer Controller"

    log_success "AWS Load Balancer Controller installed"
}

# Install ExternalDNS for Route 53
install_external_dns() {
    log_info "Installing ExternalDNS for Route 53..."

    # Create IAM policy for ExternalDNS
    POLICY_NAME="ExternalDNSPolicy"
    POLICY_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:policy/${POLICY_NAME}"

    if ! aws iam get-policy --policy-arn "${POLICY_ARN}" >/dev/null 2>&1; then
        cat > /tmp/external-dns-policy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "route53:ChangeResourceRecordSets"
            ],
            "Resource": [
                "arn:aws:route53:::hostedzone/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "route53:ListHostedZones",
                "route53:ListResourceRecordSets"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}
EOF

        aws iam create-policy \
            --policy-name "${POLICY_NAME}" \
            --policy-document file:///tmp/external-dns-policy.json || log_warning "Policy may already exist"
        rm -f /tmp/external-dns-policy.json
    fi

    # Create service account with IRSA
    eksctl create iamserviceaccount \
        --cluster="${EKS_CLUSTER}" \
        --namespace=external-dns \
        --name=external-dns \
        --attach-policy-arn="${POLICY_ARN}" \
        --region="${AWS_REGION}" \
        --approve \
        --override-existing-serviceaccounts || log_warning "Service account may already exist"

    # Add Helm repo
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm repo update

    # Install ExternalDNS
    helm upgrade --install external-dns bitnami/external-dns \
        --namespace external-dns \
        --set provider=aws \
        --set aws.region="${AWS_REGION}" \
        --set txtOwnerId="${EKS_CLUSTER}" \
        --set policy=sync \
        --set domainFilters[0]="${DOMAIN_NAME}" \
        --set serviceAccount.create=false \
        --set serviceAccount.name=external-dns \
        --wait || error_exit "Failed to install ExternalDNS"

    log_success "ExternalDNS installed"
}

# Install cert-manager with Route 53 DNS01 solver
install_cert_manager() {
    log_info "Installing cert-manager with Route 53 DNS01 solver..."

    # Create IAM policy for cert-manager
    POLICY_NAME="CertManagerRoute53Policy"
    POLICY_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:policy/${POLICY_NAME}"

    if ! aws iam get-policy --policy-arn "${POLICY_ARN}" >/dev/null 2>&1; then
        cat > /tmp/cert-manager-policy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "route53:GetChange",
            "Resource": "arn:aws:route53:::change/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "route53:ChangeResourceRecordSets",
                "route53:ListResourceRecordSets"
            ],
            "Resource": "arn:aws:route53:::hostedzone/*"
        },
        {
            "Effect": "Allow",
            "Action": "route53:ListHostedZonesByName",
            "Resource": "*"
        }
    ]
}
EOF

        aws iam create-policy \
            --policy-name "${POLICY_NAME}" \
            --policy-document file:///tmp/cert-manager-policy.json || log_warning "Policy may already exist"
        rm -f /tmp/cert-manager-policy.json
    fi

    # Create service account with IRSA
    eksctl create iamserviceaccount \
        --cluster="${EKS_CLUSTER}" \
        --namespace=cert-manager \
        --name=cert-manager \
        --attach-policy-arn="${POLICY_ARN}" \
        --region="${AWS_REGION}" \
        --approve \
        --override-existing-serviceaccounts || log_warning "Service account may already exist"

    # Add Helm repo
    helm repo add jetstack https://charts.jetstack.io
    helm repo update

    # Install cert-manager
    helm upgrade --install cert-manager jetstack/cert-manager \
        --namespace cert-manager \
        --set installCRDs=true \
        --set serviceAccount.create=false \
        --set serviceAccount.name=cert-manager \
        --set securityContext.fsGroup=1001 \
        --wait || error_exit "Failed to install cert-manager"

    # Wait for cert-manager to be ready
    log_info "Waiting for cert-manager to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/cert-manager -n cert-manager
    kubectl wait --for=condition=available --timeout=300s deployment/cert-manager-webhook -n cert-manager

    # Create ClusterIssuer for Let's Encrypt
    log_info "Creating ClusterIssuer for Let's Encrypt..."

    cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@${DOMAIN_NAME}
    privateKeySecretRef:
      name: letsencrypt-prod-account-key
    solvers:
    - dns01:
        route53:
          region: ${AWS_REGION}
          hostedZoneID: ${HOSTED_ZONE_ID:-}
---
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: admin@${DOMAIN_NAME}
    privateKeySecretRef:
      name: letsencrypt-staging-account-key
    solvers:
    - dns01:
        route53:
          region: ${AWS_REGION}
          hostedZoneID: ${HOSTED_ZONE_ID:-}
EOF

    log_success "cert-manager installed with Route 53 DNS01 solver"
}

# Install AWS Secrets Store CSI Driver
install_secrets_csi_driver() {
    log_info "Installing AWS Secrets Store CSI Driver..."

    # Add Helm repo
    helm repo add secrets-store-csi-driver https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts
    helm repo update

    # Install Secrets Store CSI Driver
    helm upgrade --install csi-secrets-store secrets-store-csi-driver/secrets-store-csi-driver \
        --namespace kube-system \
        --set syncSecret.enabled=true \
        --set enableSecretRotation=true \
        --wait || error_exit "Failed to install Secrets Store CSI Driver"

    # Install AWS Provider
    kubectl apply -f https://raw.githubusercontent.com/aws/secrets-store-csi-driver-provider-aws/main/deployment/aws-provider-installer.yaml

    log_success "AWS Secrets Store CSI Driver installed"
}

# Install Cluster Autoscaler
install_cluster_autoscaler() {
    log_info "Installing Cluster Autoscaler..."

    # Create IAM policy for Cluster Autoscaler
    POLICY_NAME="ClusterAutoscalerPolicy"
    POLICY_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:policy/${POLICY_NAME}"

    if ! aws iam get-policy --policy-arn "${POLICY_ARN}" >/dev/null 2>&1; then
        cat > /tmp/cluster-autoscaler-policy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "autoscaling:DescribeAutoScalingGroups",
                "autoscaling:DescribeAutoScalingInstances",
                "autoscaling:DescribeLaunchConfigurations",
                "autoscaling:DescribeScalingActivities",
                "autoscaling:DescribeTags",
                "ec2:DescribeImages",
                "ec2:DescribeInstanceTypes",
                "ec2:DescribeLaunchTemplateVersions",
                "ec2:GetInstanceTypesFromInstanceRequirements",
                "eks:DescribeNodegroup"
            ],
            "Resource": ["*"]
        },
        {
            "Effect": "Allow",
            "Action": [
                "autoscaling:SetDesiredCapacity",
                "autoscaling:TerminateInstanceInAutoScalingGroup"
            ],
            "Resource": ["*"],
            "Condition": {
                "StringEquals": {
                    "aws:ResourceTag/k8s.io/cluster-autoscaler/${EKS_CLUSTER}": "owned"
                }
            }
        }
    ]
}
EOF

        aws iam create-policy \
            --policy-name "${POLICY_NAME}" \
            --policy-document file:///tmp/cluster-autoscaler-policy.json || log_warning "Policy may already exist"
        rm -f /tmp/cluster-autoscaler-policy.json
    fi

    # Create service account with IRSA
    eksctl create iamserviceaccount \
        --cluster="${EKS_CLUSTER}" \
        --namespace=kube-system \
        --name=cluster-autoscaler \
        --attach-policy-arn="${POLICY_ARN}" \
        --region="${AWS_REGION}" \
        --approve \
        --override-existing-serviceaccounts || log_warning "Service account may already exist"

    # Add Helm repo
    helm repo add autoscaler https://kubernetes.github.io/autoscaler
    helm repo update

    # Install Cluster Autoscaler
    helm upgrade --install cluster-autoscaler autoscaler/cluster-autoscaler \
        --namespace kube-system \
        --set autoDiscovery.clusterName="${EKS_CLUSTER}" \
        --set awsRegion="${AWS_REGION}" \
        --set rbac.serviceAccount.create=false \
        --set rbac.serviceAccount.name=cluster-autoscaler \
        --set extraArgs.balance-similar-node-groups=true \
        --set extraArgs.skip-nodes-with-system-pods=false \
        --wait || error_exit "Failed to install Cluster Autoscaler"

    log_success "Cluster Autoscaler installed"
}

# Install Container Insights (CloudWatch)
install_container_insights() {
    log_info "Installing Container Insights (CloudWatch)..."

    # Create namespace
    kubectl create namespace amazon-cloudwatch 2>/dev/null || true

    # Create IAM policy for CloudWatch
    POLICY_ARN="arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"

    # Create service account with IRSA
    eksctl create iamserviceaccount \
        --cluster="${EKS_CLUSTER}" \
        --namespace=amazon-cloudwatch \
        --name=cloudwatch-agent \
        --attach-policy-arn="${POLICY_ARN}" \
        --region="${AWS_REGION}" \
        --approve \
        --override-existing-serviceaccounts || log_warning "Service account may already exist"

    eksctl create iamserviceaccount \
        --cluster="${EKS_CLUSTER}" \
        --namespace=amazon-cloudwatch \
        --name=fluent-bit \
        --attach-policy-arn="${POLICY_ARN}" \
        --region="${AWS_REGION}" \
        --approve \
        --override-existing-serviceaccounts || log_warning "Service account may already exist"

    # Install CloudWatch agent
    curl -s https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/daemonset/container-insights-monitoring/quickstart/cwagent-fluent-bit-quickstart.yaml | \
        sed "s/{{cluster_name}}/${EKS_CLUSTER}/g;s/{{region_name}}/${AWS_REGION}/g" | \
        kubectl apply -f - || log_warning "Container Insights may already be installed"

    log_success "Container Insights installed"
}

# Install Metrics Server
install_metrics_server() {
    log_info "Installing Metrics Server..."

    kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml || log_warning "Metrics Server may already be installed"

    log_success "Metrics Server installed"
}

# Create application namespaces and RBAC
create_application_rbac() {
    log_info "Creating application RBAC..."

    NAMESPACE="unified-health-${ENVIRONMENT}"

    cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  name: unified-health-api
  namespace: ${NAMESPACE}
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: unified-health-role
  namespace: ${NAMESPACE}
rules:
  - apiGroups: [""]
    resources: ["configmaps", "secrets"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: unified-health-rolebinding
  namespace: ${NAMESPACE}
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: unified-health-role
subjects:
  - kind: ServiceAccount
    name: unified-health-api
    namespace: ${NAMESPACE}
EOF

    log_success "Application RBAC created"
}

# Verify cluster setup
verify_cluster_setup() {
    log_info "Verifying cluster setup..."

    # Check nodes
    log_info "Checking nodes..."
    kubectl get nodes

    # Check system pods
    log_info "Checking system pods..."
    kubectl get pods -n kube-system

    # Check AWS Load Balancer Controller
    log_info "Checking AWS Load Balancer Controller..."
    kubectl get deployment aws-load-balancer-controller -n kube-system

    # Check cert-manager
    log_info "Checking cert-manager..."
    kubectl get pods -n cert-manager

    # Check ClusterIssuers
    log_info "Checking ClusterIssuers..."
    kubectl get clusterissuers

    log_success "Cluster setup verification completed"
}

# Output summary
output_summary() {
    log_success "=========================================="
    log_success "EKS Cluster Setup Complete!"
    log_success "=========================================="
    log_info ""
    log_info "Cluster Details:"
    log_info "  Name: ${EKS_CLUSTER}"
    log_info "  Region: ${AWS_REGION}"
    log_info "  Version: ${EKS_VERSION}"
    log_info ""
    log_info "Installed Components:"
    log_info "  - AWS Load Balancer Controller"
    log_info "  - ExternalDNS (Route 53)"
    log_info "  - cert-manager (Let's Encrypt)"
    log_info "  - AWS Secrets Store CSI Driver"
    log_info "  - Cluster Autoscaler"
    log_info "  - Container Insights (CloudWatch)"
    log_info "  - Metrics Server"
    log_info ""
    log_info "Next Steps:"
    log_info "  1. Run secrets setup: ./scripts/setup-secrets.sh ${ENVIRONMENT}"
    log_info "  2. Deploy application: ./scripts/deploy-${ENVIRONMENT}-aws.sh"
    log_info ""
    log_info "Useful Commands:"
    log_info "  kubectl get nodes"
    log_info "  kubectl get pods -A"
    log_info "  kubectl get svc -A"
    log_info ""
}

# Show usage
show_usage() {
    echo "============================================"
    echo "UnifiedHealth Platform - AWS EKS Setup"
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
    echo "  AWS_REGION          - AWS region (default: us-east-1)"
    echo "  EKS_VERSION         - Kubernetes version (default: 1.28)"
    echo "  NODE_INSTANCE_TYPE  - EC2 instance type (default: m5.large)"
    echo "  NODE_MIN_SIZE       - Minimum node count (default: 2)"
    echo "  NODE_MAX_SIZE       - Maximum node count (default: 10)"
    echo "  NODE_DESIRED_SIZE   - Desired node count (default: 3)"
    echo "  DOMAIN_NAME         - Domain for DNS (default: unifiedhealth.example.com)"
    echo "  HOSTED_ZONE_ID      - Route 53 hosted zone ID"
    echo ""
    echo "Examples:"
    echo "  $0 staging"
    echo "  $0 production"
    echo "  AWS_REGION=eu-west-1 NODE_INSTANCE_TYPE=m5.xlarge $0 production"
    echo ""
}

# Main setup flow
main() {
    # Check for help flag
    if [ "${1:-}" == "-h" ] || [ "${1:-}" == "--help" ]; then
        show_usage
        exit 0
    fi

    log_info "Starting AWS EKS cluster setup..."
    log_info "Environment: ${ENVIRONMENT}"
    log_info "AWS Region: ${AWS_REGION}"
    log_info "EKS Version: ${EKS_VERSION}"

    check_prerequisites
    create_eks_cluster
    get_eks_credentials
    create_namespaces
    install_metrics_server
    install_aws_load_balancer_controller
    install_external_dns
    install_cert_manager
    install_secrets_csi_driver
    install_cluster_autoscaler
    install_container_insights
    create_application_rbac
    verify_cluster_setup
    output_summary
}

# Run main
main "$@"

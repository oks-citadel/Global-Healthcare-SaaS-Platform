#!/bin/bash
# ============================================
# DNS-01 Challenge Setup Script for UnifiedHealth (AWS)
# ============================================
# This script sets up AWS Route53 and cert-manager
# for DNS-01 ACME challenges using IRSA
# ============================================

set -e

# Configuration - Update these values
AWS_REGION="${AWS_REGION:-us-east-1}"
EKS_CLUSTER_NAME="${EKS_CLUSTER_NAME:-unified-health-eks}"
HOSTED_ZONE_NAME="unifiedhealth.com"
CERT_MANAGER_NAMESPACE="cert-manager"
CERT_MANAGER_SA_NAME="cert-manager"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}DNS-01 Challenge Setup for UnifiedHealth (AWS)${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v aws &> /dev/null; then
    echo -e "${RED}AWS CLI not found. Please install AWS CLI.${NC}"
    exit 1
fi

if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}kubectl not found. Please install kubectl.${NC}"
    exit 1
fi

if ! command -v helm &> /dev/null; then
    echo -e "${RED}Helm not found. Please install helm.${NC}"
    exit 1
fi

if ! command -v eksctl &> /dev/null; then
    echo -e "${YELLOW}eksctl not found. Some IRSA features may require manual setup.${NC}"
fi

echo -e "${GREEN}Prerequisites OK${NC}"
echo ""

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "Using AWS Account: $AWS_ACCOUNT_ID"
echo "AWS Region: $AWS_REGION"
echo ""

# Step 1: Check/Create Route53 Hosted Zone
echo -e "\n${YELLOW}Step 1: Checking Route53 hosted zone...${NC}"
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name \
    --dns-name "$HOSTED_ZONE_NAME" \
    --query "HostedZones[?Name=='${HOSTED_ZONE_NAME}.'].Id" \
    --output text | cut -d'/' -f3)

if [ -z "$HOSTED_ZONE_ID" ]; then
    echo "Creating Route53 hosted zone for $HOSTED_ZONE_NAME..."
    CALLER_REF=$(date +%s)
    HOSTED_ZONE_ID=$(aws route53 create-hosted-zone \
        --name "$HOSTED_ZONE_NAME" \
        --caller-reference "$CALLER_REF" \
        --query "HostedZone.Id" \
        --output text | cut -d'/' -f3)
    echo -e "${GREEN}Hosted zone created: $HOSTED_ZONE_ID${NC}"
else
    echo -e "${GREEN}Hosted zone already exists: $HOSTED_ZONE_ID${NC}"
fi

# Get nameservers
echo ""
echo -e "${YELLOW}Route53 Name Servers (configure at your domain registrar):${NC}"
aws route53 get-hosted-zone \
    --id "$HOSTED_ZONE_ID" \
    --query "DelegationSet.NameServers" \
    --output text

# Step 2: Check EKS cluster OIDC provider
echo -e "\n${YELLOW}Step 2: Checking EKS OIDC provider...${NC}"
OIDC_ISSUER=$(aws eks describe-cluster \
    --name "$EKS_CLUSTER_NAME" \
    --region "$AWS_REGION" \
    --query "cluster.identity.oidc.issuer" \
    --output text)

if [ -z "$OIDC_ISSUER" ] || [ "$OIDC_ISSUER" == "None" ]; then
    echo -e "${RED}OIDC issuer not found for EKS cluster. Please enable OIDC.${NC}"
    exit 1
fi

echo "OIDC Issuer: $OIDC_ISSUER"
OIDC_ID=$(echo "$OIDC_ISSUER" | cut -d'/' -f5)
echo "OIDC ID: $OIDC_ID"

# Check if OIDC provider exists
OIDC_PROVIDER=$(aws iam list-open-id-connect-providers \
    --query "OpenIDConnectProviderList[?contains(Arn, '$OIDC_ID')].Arn" \
    --output text)

if [ -z "$OIDC_PROVIDER" ]; then
    echo "Creating OIDC provider..."
    if command -v eksctl &> /dev/null; then
        eksctl utils associate-iam-oidc-provider \
            --cluster "$EKS_CLUSTER_NAME" \
            --region "$AWS_REGION" \
            --approve
    else
        echo -e "${RED}eksctl not available. Please create OIDC provider manually.${NC}"
        exit 1
    fi
    echo -e "${GREEN}OIDC provider created${NC}"
else
    echo -e "${GREEN}OIDC provider already exists${NC}"
fi

# Step 3: Create IAM policy for Route53
echo -e "\n${YELLOW}Step 3: Creating IAM policy for cert-manager...${NC}"
POLICY_NAME="CertManagerRoute53Policy"
POLICY_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:policy/${POLICY_NAME}"

# Check if policy exists
POLICY_EXISTS=$(aws iam get-policy --policy-arn "$POLICY_ARN" 2>/dev/null || echo "")

if [ -z "$POLICY_EXISTS" ]; then
    echo "Creating IAM policy..."
    cat > /tmp/cert-manager-policy.json << EOF
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
            "Resource": "arn:aws:route53:::hostedzone/${HOSTED_ZONE_ID}"
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
        --policy-name "$POLICY_NAME" \
        --policy-document file:///tmp/cert-manager-policy.json
    rm /tmp/cert-manager-policy.json
    echo -e "${GREEN}IAM policy created${NC}"
else
    echo -e "${GREEN}IAM policy already exists${NC}"
fi

# Step 4: Create IAM role for cert-manager with IRSA
echo -e "\n${YELLOW}Step 4: Creating IAM role for cert-manager (IRSA)...${NC}"
ROLE_NAME="CertManagerRoute53Role"

# Check if role exists
ROLE_EXISTS=$(aws iam get-role --role-name "$ROLE_NAME" 2>/dev/null || echo "")

if [ -z "$ROLE_EXISTS" ]; then
    echo "Creating IAM role with IRSA trust policy..."
    cat > /tmp/trust-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/${OIDC_ISSUER#https://}"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "${OIDC_ISSUER#https://}:sub": "system:serviceaccount:${CERT_MANAGER_NAMESPACE}:${CERT_MANAGER_SA_NAME}",
                    "${OIDC_ISSUER#https://}:aud": "sts.amazonaws.com"
                }
            }
        }
    ]
}
EOF
    aws iam create-role \
        --role-name "$ROLE_NAME" \
        --assume-role-policy-document file:///tmp/trust-policy.json

    aws iam attach-role-policy \
        --role-name "$ROLE_NAME" \
        --policy-arn "$POLICY_ARN"

    rm /tmp/trust-policy.json
    echo -e "${GREEN}IAM role created and policy attached${NC}"
else
    echo -e "${GREEN}IAM role already exists${NC}"
fi

ROLE_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:role/${ROLE_NAME}"

# Step 5: Update kubeconfig for EKS
echo -e "\n${YELLOW}Step 5: Updating kubeconfig...${NC}"
aws eks update-kubeconfig \
    --name "$EKS_CLUSTER_NAME" \
    --region "$AWS_REGION"
echo -e "${GREEN}kubeconfig updated${NC}"

# Step 6: Check/Install cert-manager
echo -e "\n${YELLOW}Step 6: Checking cert-manager installation...${NC}"
if kubectl get namespace cert-manager &> /dev/null; then
    echo -e "${GREEN}cert-manager namespace exists${NC}"

    # Update cert-manager service account with IRSA annotation
    echo "Updating cert-manager service account with IRSA annotation..."
    kubectl annotate serviceaccount cert-manager \
        -n cert-manager \
        eks.amazonaws.com/role-arn="$ROLE_ARN" \
        --overwrite

    # Restart cert-manager to pick up new credentials
    kubectl rollout restart deployment cert-manager -n cert-manager
else
    echo "cert-manager not installed. Installing with IRSA..."
    helm repo add jetstack https://charts.jetstack.io
    helm repo update
    helm install cert-manager jetstack/cert-manager \
        --namespace cert-manager \
        --create-namespace \
        --version v1.16.2 \
        --set crds.enabled=true \
        --set "serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn=$ROLE_ARN"
fi

echo -e "${GREEN}cert-manager configured with IRSA${NC}"

# Step 7: Display summary
echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Configuration Summary:"
echo "----------------------"
echo "AWS Account ID:       $AWS_ACCOUNT_ID"
echo "AWS Region:           $AWS_REGION"
echo "EKS Cluster:          $EKS_CLUSTER_NAME"
echo "Route53 Hosted Zone:  $HOSTED_ZONE_NAME"
echo "Hosted Zone ID:       $HOSTED_ZONE_ID"
echo "OIDC Issuer:          $OIDC_ISSUER"
echo "IAM Role ARN:         $ROLE_ARN"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Update your domain registrar with the Route53 name servers (shown above)"
echo "2. Wait for DNS propagation (up to 48 hours)"
echo "3. Edit dns01-clusterissuer-route53.yaml with:"
echo "   - region: $AWS_REGION"
echo "   - hostedZoneID: $HOSTED_ZONE_ID"
echo "4. Apply the ClusterIssuer:"
echo "   kubectl apply -f dns01-clusterissuer-route53.yaml"
echo "5. Apply your Certificate resources:"
echo "   kubectl apply -f dns01-certificate.yaml"
echo ""
echo -e "${YELLOW}To verify setup:${NC}"
echo "kubectl describe clusterissuer letsencrypt-prod-dns01"
echo "kubectl describe certificate unified-health-tls-dns01 -n unified-health"

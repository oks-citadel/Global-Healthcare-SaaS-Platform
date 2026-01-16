#!/bin/bash
# ============================================
# Scheduled Production Deployment Script
# The Unified Health Platform
# ============================================
# This script deploys the latest ECR images to production EKS
# Triggered by EventBridge at 9:00 PM daily
# ============================================

set -e

# Configuration
CLUSTER_NAME="unified-health-prod-eks"
NAMESPACE="unified-health"
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="992382449461"
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Services to deploy
SERVICES=(
    "api:unified-health-prod/api"
    "web:unified-health-prod/web-app"
)

echo "=== The Unified Health - Scheduled Production Deployment ==="
echo "Time: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
echo "Cluster: ${CLUSTER_NAME}"
echo "Namespace: ${NAMESPACE}"
echo ""

# Update kubeconfig
echo "Configuring kubectl..."
aws eks update-kubeconfig --name "${CLUSTER_NAME}" --region "${AWS_REGION}"

# Deploy each service
for service_config in "${SERVICES[@]}"; do
    SERVICE_NAME="${service_config%%:*}"
    ECR_REPO="${service_config##*:}"

    echo ""
    echo "--- Deploying ${SERVICE_NAME} ---"

    # Get latest image tag from ECR
    LATEST_TAG=$(aws ecr describe-images \
        --repository-name "${ECR_REPO}" \
        --region "${AWS_REGION}" \
        --query 'sort_by(imageDetails, &imagePushedAt)[-1].imageTags[0]' \
        --output text)

    if [ -z "${LATEST_TAG}" ] || [ "${LATEST_TAG}" == "None" ]; then
        echo "WARNING: No image found for ${ECR_REPO}, skipping..."
        continue
    fi

    IMAGE_URI="${ECR_REGISTRY}/${ECR_REPO}:${LATEST_TAG}"
    echo "Latest image: ${IMAGE_URI}"

    # Get current image
    CURRENT_IMAGE=$(kubectl get deployment "${SERVICE_NAME}" -n "${NAMESPACE}" \
        -o jsonpath='{.spec.template.spec.containers[0].image}' 2>/dev/null || echo "")

    if [ "${CURRENT_IMAGE}" == "${IMAGE_URI}" ]; then
        echo "Already running latest image, skipping..."
        continue
    fi

    echo "Current: ${CURRENT_IMAGE}"
    echo "Deploying: ${IMAGE_URI}"

    # Update deployment
    kubectl set image "deployment/${SERVICE_NAME}" \
        "${SERVICE_NAME}=${IMAGE_URI}" \
        -n "${NAMESPACE}"

    # Wait for rollout
    kubectl rollout status "deployment/${SERVICE_NAME}" \
        -n "${NAMESPACE}" \
        --timeout=300s

    echo "SUCCESS: ${SERVICE_NAME} deployed"
done

echo ""
echo "=== Deployment Complete ==="
echo "Completed at: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"

# Send notification (optional - if SNS topic exists)
if aws sns list-topics --region "${AWS_REGION}" --query 'Topics[?contains(TopicArn, `deployment-notifications`)]' --output text 2>/dev/null | grep -q "deployment"; then
    aws sns publish \
        --topic-arn "arn:aws:sns:${AWS_REGION}:${AWS_ACCOUNT_ID}:deployment-notifications" \
        --subject "Production Deployment Complete" \
        --message "The Unified Health scheduled deployment completed at $(date -u +"%Y-%m-%d %H:%M:%S UTC")" \
        --region "${AWS_REGION}" || echo "SNS notification failed (non-critical)"
fi

exit 0

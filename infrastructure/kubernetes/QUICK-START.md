# Quick Start Guide - Kubernetes Deployment (AWS)

This guide provides quick commands to deploy the Unified Healthcare Platform to Amazon EKS.

## Prerequisites Checklist

- [ ] AWS CLI v2 installed and configured
- [ ] kubectl installed and configured
- [ ] kustomize installed (v5.0+)
- [ ] eksctl installed (v0.150+)
- [ ] EKS cluster created
- [ ] ECR repositories created
- [ ] AWS Secrets Manager configured
- [ ] AWS Load Balancer Controller installed
- [ ] NGINX Ingress Controller installed
- [ ] cert-manager installed
- [ ] AWS IRSA configured

## AWS CLI Setup

### Install AWS CLI v2

```bash
# macOS
brew install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Windows (PowerShell)
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi

# Verify installation
aws --version
```

### Configure AWS CLI

```bash
# Configure with IAM credentials
aws configure
# Enter: AWS Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)

# Or use SSO
aws configure sso
aws sso login --profile your-profile

# Verify credentials
aws sts get-caller-identity
```

### Install eksctl

```bash
# macOS
brew tap weaveworks/tap
brew install weaveworks/tap/eksctl

# Linux
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# Verify installation
eksctl version
```

## Quick Deploy Commands

### 1. Set Environment Variables

```bash
# AWS Configuration
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION="us-east-1"
export ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
export EKS_CLUSTER_NAME="unified-health-dev-americas-eks"

# Application Configuration
export IMAGE_TAG="latest"  # Use specific version in production
```

### 2. Configure EKS Kubeconfig

```bash
# Update kubeconfig for EKS cluster
aws eks update-kubeconfig \
  --region ${AWS_REGION} \
  --name ${EKS_CLUSTER_NAME}

# Verify connection
kubectl cluster-info
kubectl get nodes
```

### 3. Authenticate to ECR

```bash
# Get ECR login password and authenticate Docker
aws ecr get-login-password --region ${AWS_REGION} | \
  docker login --username AWS --password-stdin ${ECR_REGISTRY}

# Verify ECR access
aws ecr describe-repositories --region ${AWS_REGION}
```

### 4. Deploy to Staging

```bash
cd infrastructure/kubernetes
kubectl apply -k overlays/staging
```

### 5. Deploy to Production

```bash
cd infrastructure/kubernetes
kubectl apply -k overlays/production
```

### 6. Verify Deployment

```bash
# Check pods
kubectl get pods -n unified-health-staging
kubectl get pods -n unified-health-production

# Check services
kubectl get svc -n unified-health-staging
kubectl get svc -n unified-health-production

# Check ingress
kubectl get ingress -n unified-health-staging
kubectl get ingress -n unified-health-production

# Check ALB
aws elbv2 describe-load-balancers \
  --query "LoadBalancers[?contains(LoadBalancerName, 'unified-health')].[LoadBalancerName,DNSName]" \
  --output table
```

## Multi-Region Quick Deploy

### Americas (us-east-1)

```bash
export AWS_REGION="us-east-1"
export EKS_CLUSTER_NAME="unified-health-dev-americas-eks"
aws eks update-kubeconfig --region ${AWS_REGION} --name ${EKS_CLUSTER_NAME}
kubectl apply -k overlays/production
```

### Europe (eu-west-1)

```bash
export AWS_REGION="eu-west-1"
export EKS_CLUSTER_NAME="unified-health-dev-europe-eks"
aws eks update-kubeconfig --region ${AWS_REGION} --name ${EKS_CLUSTER_NAME}
kubectl apply -k overlays/production
```

### Africa (af-south-1)

```bash
export AWS_REGION="af-south-1"
export EKS_CLUSTER_NAME="unified-health-dev-africa-eks"
aws eks update-kubeconfig --region ${AWS_REGION} --name ${EKS_CLUSTER_NAME}
kubectl apply -k overlays/production
```

## Common Commands

### View Logs

```bash
# Staging
kubectl logs -n unified-health-staging -l app=unified-health-api --tail=100 -f

# Production
kubectl logs -n unified-health-production -l app=unified-health-api --tail=100 -f

# Stream logs to CloudWatch (via Fluent Bit)
aws logs tail /aws/eks/${EKS_CLUSTER_NAME}/unified-health --follow
```

### Scale Deployment

```bash
# Staging
kubectl scale deployment/unified-health-api --replicas=3 -n unified-health-staging

# Production
kubectl scale deployment/unified-health-api --replicas=5 -n unified-health-production
```

### Restart Deployment

```bash
# Staging
kubectl rollout restart deployment/unified-health-api -n unified-health-staging

# Production
kubectl rollout restart deployment/unified-health-api -n unified-health-production
```

### View Pod Details

```bash
# Staging
kubectl describe pod <pod-name> -n unified-health-staging

# Production
kubectl describe pod <pod-name> -n unified-health-production
```

### Execute Into Pod

```bash
# Staging
kubectl exec -it <pod-name> -n unified-health-staging -- /bin/sh

# Production
kubectl exec -it <pod-name> -n unified-health-production -- /bin/sh
```

### Port Forward for Local Testing

```bash
# Staging
kubectl port-forward -n unified-health-staging svc/unified-health-api 8080:80

# Production
kubectl port-forward -n unified-health-production svc/unified-health-api 8080:80
```

### Update Configuration

```bash
# Edit ConfigMap
kubectl edit configmap unified-health-config -n unified-health-production

# Restart pods to pick up changes
kubectl rollout restart deployment/unified-health-api -n unified-health-production
```

### View Events

```bash
# Staging
kubectl get events -n unified-health-staging --sort-by='.lastTimestamp'

# Production
kubectl get events -n unified-health-production --sort-by='.lastTimestamp'
```

### Rollback Deployment

```bash
# Staging
kubectl rollout undo deployment/unified-health-api -n unified-health-staging

# Production
kubectl rollout undo deployment/unified-health-api -n unified-health-production

# Rollback to specific revision
kubectl rollout undo deployment/unified-health-api --to-revision=2 -n unified-health-production
```

## ECR Commands

### List Images

```bash
aws ecr describe-images \
  --repository-name unified-health/api-gateway \
  --query 'imageDetails[*].[imageTags[0],imagePushedAt]' \
  --output table
```

### Push Image

```bash
# Build and tag
docker build -t ${ECR_REGISTRY}/unified-health/api-gateway:${IMAGE_TAG} .

# Push to ECR
docker push ${ECR_REGISTRY}/unified-health/api-gateway:${IMAGE_TAG}
```

### Delete Old Images

```bash
# Delete untagged images
aws ecr batch-delete-image \
  --repository-name unified-health/api-gateway \
  --image-ids imageTag=old-tag
```

## AWS Secrets Manager Commands

### List Secrets

```bash
aws secretsmanager list-secrets \
  --filter Key="name",Values="unified-health" \
  --query "SecretList[*].[Name,Description]" \
  --output table
```

### Get Secret Value

```bash
aws secretsmanager get-secret-value \
  --secret-id unified-health/jwt-secret \
  --query SecretString \
  --output text
```

### Update Secret

```bash
aws secretsmanager put-secret-value \
  --secret-id unified-health/jwt-secret \
  --secret-string '{"secret":"new-secret-value"}'
```

## Troubleshooting Quick Fixes

### Pods Not Starting

```bash
# Get pod status
kubectl get pods -n unified-health-production

# Describe pod to see events
kubectl describe pod <pod-name> -n unified-health-production

# Check logs
kubectl logs <pod-name> -n unified-health-production

# Check previous container logs (if crashed)
kubectl logs <pod-name> -n unified-health-production --previous
```

### Image Pull Errors

```bash
# Verify ECR authentication
aws ecr get-login-password --region ${AWS_REGION} | \
  docker login --username AWS --password-stdin ${ECR_REGISTRY}

# Check if image exists
aws ecr describe-images \
  --repository-name unified-health/api-gateway \
  --image-ids imageTag=${IMAGE_TAG}

# Verify node IAM role has ECR access
kubectl describe node | grep -A 10 "Labels"
```

### Certificate Issues

```bash
# Check certificate status
kubectl get certificate -n unified-health-production
kubectl describe certificate unified-health-tls-cert -n unified-health-production

# Check cert-manager logs
kubectl logs -n cert-manager -l app=cert-manager --tail=100

# Delete and recreate certificate
kubectl delete certificate unified-health-tls-cert -n unified-health-production
kubectl apply -f base/ingress.yaml
```

### ALB Issues

```bash
# Check AWS Load Balancer Controller logs
kubectl logs -n kube-system -l app.kubernetes.io/name=aws-load-balancer-controller --tail=100

# Describe ingress
kubectl describe ingress -n unified-health-production

# Check target group health
aws elbv2 describe-target-health \
  --target-group-arn <target-group-arn>
```

### Network Issues

```bash
# Test DNS resolution
kubectl run -it --rm debug --image=busybox --restart=Never -- nslookup google.com

# Test database connectivity
kubectl run -it --rm debug --image=postgres:15 --restart=Never -- psql "$DATABASE_URL"

# Check VPC endpoints
aws ec2 describe-vpc-endpoints \
  --filters "Name=vpc-id,Values=<vpc-id>" \
  --query "VpcEndpoints[*].[ServiceName,State]" \
  --output table
```

### IRSA Issues

```bash
# Verify service account annotation
kubectl get sa unified-health-api -n unified-health-production -o yaml | grep eks.amazonaws.com

# Test assume role from pod
kubectl run -it --rm test-irsa \
  --image=amazon/aws-cli \
  --serviceaccount=unified-health-api \
  --namespace=unified-health-production \
  -- aws sts get-caller-identity

# Check IAM role trust relationship
aws iam get-role --role-name unified-health-api-role --query "Role.AssumeRolePolicyDocument"
```

## Monitoring Commands

### Check HPA Status

```bash
kubectl get hpa -n unified-health-production
kubectl describe hpa unified-health-api-hpa -n unified-health-production
```

### Check PDB Status

```bash
kubectl get pdb -n unified-health-production
kubectl describe pdb unified-health-api-pdb -n unified-health-production
```

### Check Resource Usage

```bash
kubectl top nodes
kubectl top pods -n unified-health-production
```

### View Metrics

```bash
# Port forward to metrics endpoint
kubectl port-forward -n unified-health-production svc/unified-health-api 9090:9090

# Access metrics at http://localhost:9090/metrics
```

### CloudWatch Commands

```bash
# Get log groups
aws logs describe-log-groups --query "logGroups[?contains(logGroupName, 'unified-health')].[logGroupName]" --output table

# Tail logs
aws logs tail /aws/eks/${EKS_CLUSTER_NAME}/unified-health --follow

# Query logs
aws logs filter-log-events \
  --log-group-name /aws/eks/${EKS_CLUSTER_NAME}/unified-health \
  --filter-pattern "ERROR" \
  --start-time $(date -d '1 hour ago' +%s)000
```

## Cleanup Commands

### Delete Staging Environment

```bash
kubectl delete namespace unified-health-staging
```

### Delete Production Environment

```bash
# WARNING: This will delete all production resources!
kubectl delete namespace unified-health-production
```

## Security Best Practices

1. Never commit secrets to Git
2. Use AWS Secrets Manager for secret management
3. Use IRSA for pod IAM credentials
4. Rotate secrets regularly
5. Enable Pod Security Standards
6. Use Network Policies to restrict traffic
7. Keep images updated with security patches
8. Use RBAC for access control
9. Enable CloudTrail for audit logging
10. Enable GuardDuty for threat detection

## Performance Tuning

### Adjust Resource Limits

Edit the kustomization.yaml in overlays/production and update resource limits:

```yaml
patches:
  - target:
      kind: Deployment
      name: unified-health-api
    patch: |-
      - op: replace
        path: /spec/template/spec/containers/0/resources/requests/cpu
        value: "1000m"
      - op: replace
        path: /spec/template/spec/containers/0/resources/requests/memory
        value: "1Gi"
```

### Adjust HPA Settings

Edit the HPA to change scaling thresholds:

```bash
kubectl edit hpa unified-health-api-hpa -n unified-health-production
```

### Adjust Database Connection Pool

Edit ConfigMap:

```bash
kubectl edit configmap unified-health-config -n unified-health-production
# Update database-pool-size value
```

## Health Check Endpoints

- **Liveness**: `/health` - Returns 200 if application is alive
- **Readiness**: `/ready` - Returns 200 if application is ready to serve traffic
- **Metrics**: `/metrics` - Prometheus metrics endpoint

## Support

For additional help, refer to:
- Full README: [README.md](README.md)
- Deployment Checklist: [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md)
- Kubernetes Documentation: https://kubernetes.io/docs/
- Amazon EKS Documentation: https://docs.aws.amazon.com/eks/

---

**Last Updated**: 2025-12-29

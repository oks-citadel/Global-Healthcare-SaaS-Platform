# ECS Fargate Maintenance and Upgrade Runbook

**Document Version:** 1.0
**Last Updated:** 2026-01-15
**Owner:** Platform Operations Team

---

## Infrastructure Overview

| Component | Configuration |
|-----------|---------------|
| **Orchestration** | AWS ECS Fargate (Serverless) |
| **Capacity Providers** | FARGATE (20%) + FARGATE_SPOT (80%) |
| **Deployment Strategy** | Rolling with Circuit Breaker + Auto-Rollback |
| **Health Checks** | Container (wget) + ALB Target Group |
| **Auto-Scaling** | CPU (70%) and Memory (80%) target tracking |
| **Image Registry** | Amazon ECR with scan-on-push |
| **Regions** | us-east-1, eu-west-1, af-south-1 |

---

## 1. ECS Fargate Platform Version Management

### Check Current Platform Versions

```bash
# Set environment variables
export CLUSTER_NAME="unified-health-prod-cluster"
export AWS_REGION="us-east-1"

# List all services and their platform versions
aws ecs list-services --cluster $CLUSTER_NAME --region $AWS_REGION \
  --query 'serviceArns[]' --output text | tr '\t' '\n' | while read service; do
  echo "=== $(basename $service) ==="
  aws ecs describe-services --cluster $CLUSTER_NAME --services $service \
    --region $AWS_REGION \
    --query 'services[0].{platformVersion:platformVersion,platformFamily:platformFamily}'
done

# Check task definitions for platform requirements
aws ecs list-task-definitions --family-prefix unified-health --region $AWS_REGION \
  --query 'taskDefinitionArns[-5:]' --output table
```

### Platform Version Compatibility

| Platform Version | Status | Features |
|------------------|--------|----------|
| 1.4.0 (LATEST) | Recommended | EFS, Secrets Manager, init containers |
| 1.3.0 | Supported | Basic Fargate features |

### Update Platform Version

```bash
# Update service to use latest platform version
aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service $SERVICE_NAME \
  --platform-version LATEST \
  --force-new-deployment \
  --region $AWS_REGION
```

---

## 2. Container Image Management

### ECR Lifecycle Policies

The following policies are configured via Terraform:

- **Production images:** Keep last 30 tagged versions
- **Untagged images:** Expire after 14 days
- **Development images:** Expire after 7 days

### Manual Image Operations

```bash
# List repositories
aws ecr describe-repositories --region $AWS_REGION \
  --query 'repositories[].repositoryName' --output table

# List images in a repository
aws ecr describe-images --repository-name unified-health/api-gateway \
  --region $AWS_REGION \
  --query 'imageDetails | sort_by(@, &imagePushedAt) | [-10:]'

# Check image scan results
aws ecr describe-image-scan-findings \
  --repository-name unified-health/api-gateway \
  --image-id imageTag=latest \
  --region $AWS_REGION
```

### Vulnerability Remediation Workflow

1. **Review scan findings:**
   ```bash
   aws ecr describe-image-scan-findings \
     --repository-name $REPO_NAME \
     --image-id imageTag=$TAG \
     --region $AWS_REGION \
     --query 'imageScanFindings.findings[?severity==`CRITICAL` || severity==`HIGH`]'
   ```

2. **Update base image in Dockerfile:**
   ```dockerfile
   # docker/Dockerfile.service
   FROM node:20-alpine  # Update to latest patched version
   ```

3. **Rebuild and push:**
   ```bash
   docker build -t $ECR_URI:$NEW_TAG -f docker/Dockerfile.service .
   docker push $ECR_URI:$NEW_TAG
   ```

4. **Deploy updated image:**
   ```bash
   aws ecs update-service --cluster $CLUSTER_NAME \
     --service $SERVICE_NAME --force-new-deployment
   ```

---

## 3. Service Maintenance

### Health Check Configuration

**Container Health Check (Task Definition):**
```json
{
  "command": ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1"],
  "interval": 30,
  "timeout": 5,
  "retries": 3,
  "startPeriod": 60
}
```

**ALB Target Group Health Check:**
- Path: `/health`
- Interval: 30 seconds
- Healthy threshold: 2
- Unhealthy threshold: 3
- Timeout: 5 seconds

### Check Service Health

```bash
# Service status
aws ecs describe-services --cluster $CLUSTER_NAME \
  --services $SERVICE_NAME --region $AWS_REGION \
  --query 'services[0].{status:status,runningCount:runningCount,desiredCount:desiredCount,deployments:deployments}'

# Task health
aws ecs list-tasks --cluster $CLUSTER_NAME \
  --service-name $SERVICE_NAME --region $AWS_REGION \
  --query 'taskArns[]' --output text | tr '\t' '\n' | while read task; do
  aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $task \
    --query 'tasks[0].{lastStatus:lastStatus,healthStatus:healthStatus,stoppedReason:stoppedReason}'
done

# Target group health
aws elbv2 describe-target-health \
  --target-group-arn $TARGET_GROUP_ARN \
  --region $AWS_REGION
```

### Auto-Scaling Verification

```bash
# Check scaling policies
aws application-autoscaling describe-scaling-policies \
  --service-namespace ecs \
  --resource-id service/$CLUSTER_NAME/$SERVICE_NAME \
  --region $AWS_REGION

# Check scaling activities
aws application-autoscaling describe-scaling-activities \
  --service-namespace ecs \
  --resource-id service/$CLUSTER_NAME/$SERVICE_NAME \
  --region $AWS_REGION \
  --max-results 10
```

---

## 4. Deployment Procedures

### Standard Rolling Deployment

Deployments are handled by CI/CD (GitHub Actions + CodePipeline). Manual deployment:

```bash
# Update service with new task definition
aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service $SERVICE_NAME \
  --task-definition $NEW_TASK_DEF \
  --region $AWS_REGION

# Monitor deployment
watch -n 5 "aws ecs describe-services --cluster $CLUSTER_NAME \
  --services $SERVICE_NAME --region $AWS_REGION \
  --query 'services[0].deployments'"
```

### Blue-Green Deployment

```bash
# 1. Register new task definition
aws ecs register-task-definition --cli-input-json file://task-def.json

# 2. Create new target group
aws elbv2 create-target-group \
  --name ${SERVICE_NAME}-blue \
  --protocol HTTP \
  --port 3000 \
  --vpc-id $VPC_ID \
  --target-type ip

# 3. Update listener to use new target group
aws elbv2 modify-listener \
  --listener-arn $LISTENER_ARN \
  --default-actions Type=forward,TargetGroupArn=$NEW_TARGET_GROUP_ARN

# 4. Clean up old target group after verification
```

### Rollback Procedures

**Automatic Rollback (Circuit Breaker):**
Configured in Terraform - automatically rolls back if deployment fails health checks.

**Manual Rollback:**

```bash
# Get previous task definition revision
PREV_TASK_DEF=$(aws ecs describe-services --cluster $CLUSTER_NAME \
  --services $SERVICE_NAME --region $AWS_REGION \
  --query 'services[0].taskDefinition' --output text | sed 's/:[0-9]*$/:'"$(($(aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --query 'services[0].taskDefinition' --output text | grep -o ':[0-9]*$' | tr -d ':') - 1))"'/')

# Rollback to previous version
aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service $SERVICE_NAME \
  --task-definition $PREV_TASK_DEF \
  --region $AWS_REGION

# Monitor rollback
aws ecs wait services-stable --cluster $CLUSTER_NAME --services $SERVICE_NAME
```

**Emergency Stop:**

```bash
# Scale to zero (stops all tasks)
aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service $SERVICE_NAME \
  --desired-count 0 \
  --region $AWS_REGION
```

---

## 5. Pre-Deployment Checklist

### Task Definition Validation

```bash
# Validate task definition JSON
aws ecs register-task-definition \
  --cli-input-json file://task-def.json \
  --dry-run

# Check resource requirements
cat task-def.json | jq '{cpu: .cpu, memory: .memory, containers: [.containerDefinitions[].name]}'
```

### Environment Variables & Secrets

```bash
# List secrets for service
aws secretsmanager list-secrets \
  --filter Key=name,Values=unified-health/$SERVICE_NAME \
  --region $AWS_REGION

# Verify secret values exist (not actual values)
aws secretsmanager describe-secret \
  --secret-id unified-health/$SERVICE_NAME/database-url \
  --region $AWS_REGION
```

### Service Discovery Health

```bash
# Check Cloud Map namespace
aws servicediscovery list-namespaces --region $AWS_REGION

# Check registered services
aws servicediscovery list-services --region $AWS_REGION \
  --filters Name=NAMESPACE_ID,Values=$NAMESPACE_ID
```

### Load Balancer Target Group Checks

```bash
# Verify target group exists
aws elbv2 describe-target-groups \
  --names ${PROJECT}-${ENV}-${SERVICE_NAME} \
  --region $AWS_REGION

# Check listener rules
aws elbv2 describe-rules \
  --listener-arn $LISTENER_ARN \
  --region $AWS_REGION \
  --query 'Rules[?contains(Actions[0].TargetGroupArn, `'$SERVICE_NAME'`)]'
```

---

## 6. Troubleshooting

### Common Issues

| Issue | Symptoms | Resolution |
|-------|----------|------------|
| Task fails to start | `STOPPED` status, no running tasks | Check CloudWatch logs, verify image exists |
| Health check failures | Unhealthy targets in ALB | Verify `/health` endpoint, check security groups |
| Out of memory | Task killed with exit code 137 | Increase memory in task definition |
| Secrets access denied | `ResourceInitializationError` | Check task execution role permissions |

### Debug Commands

```bash
# View task stopped reason
aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $TASK_ARN \
  --query 'tasks[0].{stoppedReason:stoppedReason,stopCode:stopCode}'

# View CloudWatch logs
aws logs get-log-events \
  --log-group-name /aws/ecs/$CLUSTER_NAME/$SERVICE_NAME \
  --log-stream-name $LOG_STREAM \
  --limit 100

# Execute command in running container (requires ECS Exec enabled)
aws ecs execute-command \
  --cluster $CLUSTER_NAME \
  --task $TASK_ARN \
  --container $SERVICE_NAME \
  --interactive \
  --command "/bin/sh"
```

---

## 7. Maintenance Windows

| Region | Maintenance Window (UTC) | Local Time |
|--------|-------------------------|------------|
| us-east-1 (Americas) | Sun 06:00-10:00 | Sun 01:00-05:00 EST |
| eu-west-1 (Europe) | Sun 02:00-06:00 | Sun 02:00-06:00 GMT |
| af-south-1 (Africa) | Sun 00:00-04:00 | Sun 02:00-06:00 SAST |

---

## Quick Reference

```bash
# Service status
aws ecs describe-services --cluster $CLUSTER --services $SVC --query 'services[0].{status:status,running:runningCount,desired:desiredCount}'

# Force new deployment
aws ecs update-service --cluster $CLUSTER --service $SVC --force-new-deployment

# Scale service
aws ecs update-service --cluster $CLUSTER --service $SVC --desired-count 5

# View logs
aws logs tail /aws/ecs/$CLUSTER/$SVC --follow

# List running tasks
aws ecs list-tasks --cluster $CLUSTER --service-name $SVC --desired-status RUNNING
```

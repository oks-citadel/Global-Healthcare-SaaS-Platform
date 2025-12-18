# UnifiedHealth Microservices - Deployment Checklist

## Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Node.js 20+ installed on all servers
- [ ] Docker and Docker Compose installed
- [ ] PostgreSQL 15+ configured
- [ ] Redis 7+ configured
- [ ] SSL certificates obtained for production domains
- [ ] DNS records configured

### 2. Environment Variables
- [ ] Create `.env` files for all services
- [ ] Set unique JWT_SECRET in production (min 32 characters)
- [ ] Configure DATABASE_URL for each service with production credentials
- [ ] Set CORS_ORIGIN to your frontend domain(s)
- [ ] Configure Redis connection details
- [ ] Set NODE_ENV=production for all services

### 3. Database Preparation
- [ ] Create separate databases for each service:
  - [ ] telehealth_db
  - [ ] mental_health_db
  - [ ] chronic_care_db
  - [ ] pharmacy_db
  - [ ] laboratory_db
- [ ] Set up database user with appropriate permissions
- [ ] Configure database backups
- [ ] Run database migrations for each service
- [ ] Verify database connections

### 4. Security Configuration
- [ ] Generate strong JWT secret key
- [ ] Configure rate limiting thresholds
- [ ] Set up firewall rules
- [ ] Configure HTTPS/TLS
- [ ] Enable database encryption at rest
- [ ] Set up VPC/network isolation
- [ ] Configure secrets management (AWS Secrets Manager, Azure Key Vault, etc.)

### 5. Service Configuration
- [ ] Review and adjust rate limits
- [ ] Configure service URLs in API Gateway
- [ ] Set appropriate timeout values
- [ ] Configure logging levels
- [ ] Set up health check intervals

### 6. Build and Test
- [ ] Run `npm install` for all services
- [ ] Run `npm run build` for all services
- [ ] Run `npm test` for all services
- [ ] Run `npm run typecheck` for all services
- [ ] Test health endpoints
- [ ] Test authentication flow
- [ ] Perform integration testing
- [ ] Load testing (recommended)

---

## Deployment Steps

### Option 1: Docker Compose Deployment

#### Step 1: Prepare Docker Environment
```bash
cd services
chmod +x scripts/create-multiple-postgresql-databases.sh
```

#### Step 2: Create Production Docker Compose Override
Create `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  api-gateway:
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
    restart: always

  telehealth-service:
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${TELEHEALTH_DATABASE_URL}
    restart: always

  # ... repeat for all services
```

#### Step 3: Deploy
```bash
docker-compose -f docker-compose.microservices.yml -f docker-compose.prod.yml up -d --build
```

#### Step 4: Verify Deployment
```bash
# Check all containers are running
docker-compose ps

# Check health endpoints
curl https://your-domain.com/health
curl https://your-domain.com/api/telehealth/health
# ... check all services
```

---

### Option 2: Kubernetes Deployment

#### Step 1: Create Kubernetes Manifests
Create deployment files for each service:
- `k8s/api-gateway-deployment.yaml`
- `k8s/telehealth-service-deployment.yaml`
- `k8s/mental-health-service-deployment.yaml`
- `k8s/chronic-care-service-deployment.yaml`
- `k8s/pharmacy-service-deployment.yaml`
- `k8s/laboratory-service-deployment.yaml`

#### Step 2: Create ConfigMaps and Secrets
```bash
kubectl create secret generic jwt-secret --from-literal=JWT_SECRET=your-secret-key
kubectl create configmap service-urls --from-file=config/service-urls.env
```

#### Step 3: Deploy Services
```bash
kubectl apply -f k8s/
```

#### Step 4: Set Up Ingress
Create ingress rules for routing to API Gateway

---

### Option 3: Cloud Platform Deployment

#### AWS ECS/Fargate
1. Build and push Docker images to ECR
2. Create ECS cluster
3. Create task definitions for each service
4. Create services with load balancers
5. Configure Application Load Balancer
6. Set up RDS for PostgreSQL
7. Set up ElastiCache for Redis

#### Google Cloud Run
1. Build and push images to GCR
2. Deploy each service to Cloud Run
3. Configure Cloud SQL for PostgreSQL
4. Configure Memorystore for Redis
5. Set up Cloud Load Balancer

#### Azure Container Instances
1. Build and push images to ACR
2. Deploy container instances
3. Configure Azure Database for PostgreSQL
4. Configure Azure Cache for Redis
5. Set up Azure Application Gateway

---

## Post-Deployment Checklist

### 1. Verify Services
- [ ] All services are running
- [ ] All health checks passing
- [ ] Database connections working
- [ ] Redis connection working
- [ ] Service-to-service communication working
- [ ] API Gateway routing correctly

### 2. Test API Endpoints
- [ ] Authentication endpoints working
- [ ] Telehealth service endpoints accessible
- [ ] Mental health service endpoints accessible
- [ ] Chronic care service endpoints accessible
- [ ] Pharmacy service endpoints accessible
- [ ] Laboratory service endpoints accessible

### 3. Monitor Performance
- [ ] Set up monitoring dashboards (Grafana, Datadog, etc.)
- [ ] Configure alerting (PagerDuty, Opsgenie, etc.)
- [ ] Monitor error rates
- [ ] Monitor response times
- [ ] Monitor resource usage
- [ ] Check database query performance

### 4. Security Verification
- [ ] HTTPS working correctly
- [ ] JWT authentication working
- [ ] Rate limiting functioning
- [ ] CORS configured correctly
- [ ] No sensitive data in logs
- [ ] Database access restricted
- [ ] Redis access restricted

### 5. Backup Configuration
- [ ] Database backups scheduled
- [ ] Backup restoration tested
- [ ] Disaster recovery plan documented
- [ ] Backup retention policy set

### 6. Documentation
- [ ] Update API documentation
- [ ] Document deployment procedures
- [ ] Create runbook for common issues
- [ ] Document scaling procedures
- [ ] Update architectural diagrams

---

## Monitoring Setup

### Application Monitoring
```bash
# Prometheus metrics endpoint setup
# Add to each service's package.json
npm install prom-client

# Add metrics endpoint to each service
# app.get('/metrics', async (req, res) => {
#   res.set('Content-Type', register.contentType);
#   res.end(await register.metrics());
# });
```

### Log Aggregation
Options:
1. **ELK Stack** (Elasticsearch, Logstash, Kibana)
2. **Loki + Grafana**
3. **CloudWatch** (AWS)
4. **Stackdriver** (GCP)
5. **Azure Monitor**

### Distributed Tracing
Options:
1. **Jaeger**
2. **Zipkin**
3. **AWS X-Ray**
4. **Google Cloud Trace**

---

## Scaling Checklist

### Horizontal Scaling
- [ ] Configure auto-scaling policies
- [ ] Set up load balancers
- [ ] Test scaling up/down
- [ ] Monitor scaling metrics
- [ ] Configure health checks for load balancers

### Vertical Scaling
- [ ] Identify resource bottlenecks
- [ ] Increase CPU/memory as needed
- [ ] Test performance improvements
- [ ] Update resource limits in deployment configs

### Database Scaling
- [ ] Set up read replicas
- [ ] Configure connection pooling
- [ ] Implement caching strategy
- [ ] Monitor query performance
- [ ] Consider database sharding if needed

---

## Rollback Procedure

### Quick Rollback
```bash
# Docker Compose
docker-compose -f docker-compose.microservices.yml down
docker-compose -f docker-compose.microservices.yml up -d --build <previous-image-tag>

# Kubernetes
kubectl rollout undo deployment/api-gateway
kubectl rollout undo deployment/telehealth-service
# ... for all services
```

### Database Rollback
```bash
# Run down migration
cd telehealth-service
npx prisma migrate resolve --rolled-back <migration-name>
```

---

## Maintenance Windows

### Planned Maintenance Checklist
- [ ] Notify users 48 hours in advance
- [ ] Schedule during low-traffic period
- [ ] Create backup before maintenance
- [ ] Test rollback procedure
- [ ] Have team on standby
- [ ] Document changes made
- [ ] Verify all services after maintenance

---

## Emergency Contacts

Create list of:
- [ ] DevOps team contacts
- [ ] Database administrators
- [ ] Security team
- [ ] Cloud provider support
- [ ] On-call rotation schedule

---

## Compliance Checklist

### HIPAA Compliance
- [ ] Encrypt data at rest
- [ ] Encrypt data in transit
- [ ] Implement audit logging
- [ ] Set up access controls
- [ ] Configure backup retention (6+ years)
- [ ] Implement Business Associate Agreements
- [ ] Regular security audits
- [ ] Incident response plan

### GDPR Compliance
- [ ] Implement data deletion procedures
- [ ] Configure data export functionality
- [ ] Set up consent management
- [ ] Implement data breach notification
- [ ] Document data processing activities

---

## Performance Benchmarks

Target metrics:
- [ ] API response time < 200ms (p95)
- [ ] API response time < 500ms (p99)
- [ ] Health check response < 100ms
- [ ] Database query time < 50ms (average)
- [ ] Uptime > 99.9%
- [ ] Error rate < 0.1%

---

## Cost Optimization

- [ ] Right-size compute resources
- [ ] Use spot/preemptible instances where appropriate
- [ ] Implement auto-scaling
- [ ] Set up budget alerts
- [ ] Review and optimize database queries
- [ ] Implement caching strategy
- [ ] Use CDN for static assets
- [ ] Archive old data

---

## Disaster Recovery

### Backup Strategy
- [ ] Daily automated backups
- [ ] Weekly full backups
- [ ] Monthly long-term backups
- [ ] Test backup restoration monthly
- [ ] Store backups in multiple regions
- [ ] Encrypt backups

### Recovery Time Objectives
- [ ] Define RTO (Recovery Time Objective)
- [ ] Define RPO (Recovery Point Objective)
- [ ] Document recovery procedures
- [ ] Test disaster recovery annually
- [ ] Update DR plan regularly

---

## Sign-Off

### Development Team
- [ ] Code reviewed and approved
- [ ] Tests passed
- [ ] Documentation updated

### DevOps Team
- [ ] Infrastructure provisioned
- [ ] Deployment scripts tested
- [ ] Monitoring configured

### Security Team
- [ ] Security review completed
- [ ] Penetration testing done
- [ ] Compliance verified

### Product Team
- [ ] Features verified
- [ ] User acceptance testing completed
- [ ] Release notes prepared

---

## Post-Launch Monitoring (First 24 Hours)

- [ ] Hour 0-1: Monitor every 5 minutes
- [ ] Hour 1-4: Monitor every 15 minutes
- [ ] Hour 4-24: Monitor every 30 minutes
- [ ] Check error logs continuously
- [ ] Monitor user feedback channels
- [ ] Track performance metrics
- [ ] Be ready for quick rollback if needed

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Version**: _______________
**Rollback Plan Tested**: [ ] Yes [ ] No
**All Checks Passed**: [ ] Yes [ ] No

---

## Quick Reference Commands

```bash
# Check all service health
for port in 3000 3001 3002 3003 3004 3005; do
  echo "Port $port:" && curl http://localhost:$port/health
done

# View all container logs
docker-compose -f docker-compose.microservices.yml logs -f

# Restart specific service
docker-compose -f docker-compose.microservices.yml restart telehealth-service

# Scale service
docker-compose -f docker-compose.microservices.yml up -d --scale telehealth-service=3

# Database backup
docker exec services_postgres_1 pg_dump -U postgres telehealth_db > backup.sql

# Database restore
docker exec -i services_postgres_1 psql -U postgres telehealth_db < backup.sql
```

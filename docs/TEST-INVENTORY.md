# UnifiedHealth Platform - Complete Test Inventory

## Application Access URLs

| Component | URL | Status |
|-----------|-----|--------|
| Web Application | http://20.3.27.63 | Active |
| API Base | http://20.3.27.63/api/v1 | Active |
| Health Check | http://20.3.27.63/health | Active |
| HTTPS (when domain configured) | https://yourdomain.com | Pending DNS |

---

## 1. Infrastructure Verification Tests

### 1.1 Azure Portal Verification
| Test | Steps | Expected Result |
|------|-------|-----------------|
| Resource Group | Azure Portal > Resource Groups > rg-unified-health-dev2 | All resources visible |
| AKS Cluster | Azure Portal > Kubernetes Services > aks-unified-health-dev2 | Status: Running |
| PostgreSQL | Azure Portal > Azure Database for PostgreSQL > psql-unified-health-dev2 | Status: Available |
| Redis Cache | Azure Portal > Azure Cache for Redis > redis-unified-health-dev2 | Status: Running |
| Container Registry | Azure Portal > Container Registries > acrunifiedhealthdev2 | Status: Succeeded |
| Key Vault | Azure Portal > Key Vaults > kv-unified-dev2 | Status: Succeeded |

### 1.2 CLI Infrastructure Tests
```bash
# Verify AKS cluster
az aks show --resource-group rg-unified-health-dev2 --name aks-unified-health-dev2 --query "provisioningState"

# Verify PostgreSQL
az postgres flexible-server show --resource-group rg-unified-health-dev2 --name psql-unified-health-dev2 --query "state"

# Verify Redis
az redis show --resource-group rg-unified-health-dev2 --name redis-unified-health-dev2 --query "provisioningState"

# Verify ACR
az acr show --resource-group rg-unified-health-dev2 --name acrunifiedhealthdev2 --query "provisioningState"
```

---

## 2. Kubernetes Cluster Tests

### 2.1 Node Health
```bash
kubectl get nodes
kubectl describe nodes | grep -A5 "Conditions:"
```
| Expected | Result |
|----------|--------|
| 2 nodes Ready | aks-system-*, aks-user-* |
| K8s Version | v1.32.9 |

### 2.2 Pod Status
```bash
kubectl get pods -n unified-health
kubectl get pods -n ingress-nginx
kubectl get pods -n cert-manager
```

| Namespace | Pods | Expected Status |
|-----------|------|-----------------|
| unified-health | web-demo-* | Running (1/1) |
| unified-health | unified-health-api-* | Running (1/1) x2 |
| ingress-nginx | ingress-nginx-controller-* | Running (1/1) x2 |
| cert-manager | cert-manager-* | Running (1/1) |
| cert-manager | cert-manager-webhook-* | Running (1/1) |
| cert-manager | cert-manager-cainjector-* | Running (1/1) |

### 2.3 Service Status
```bash
kubectl get svc -n unified-health
kubectl get svc -n ingress-nginx
```

| Service | Type | External IP |
|---------|------|-------------|
| ingress-nginx-controller | LoadBalancer | 20.3.27.63 |
| web-demo | ClusterIP | - |
| unified-health-api | ClusterIP | - |

### 2.4 Ingress Configuration
```bash
kubectl get ingress -n unified-health
kubectl describe ingress unified-health-ingress -n unified-health
```

---

## 3. Application Functional Tests

### 3.1 Web Application Tests
| Test ID | Test Name | URL | Method | Expected Response |
|---------|-----------|-----|--------|-------------------|
| WEB-001 | Landing Page Load | http://20.3.27.63/ | GET | 200 OK, HTML page |
| WEB-002 | Page Title | http://20.3.27.63/ | GET | "UnifiedHealth Platform" |
| WEB-003 | Status Section | http://20.3.27.63/ | GET | All status indicators green |
| WEB-004 | Mobile Responsive | http://20.3.27.63/ | GET | Page renders on mobile |

### 3.2 API Endpoint Tests
| Test ID | Test Name | Endpoint | Method | Expected Response |
|---------|-----------|----------|--------|-------------------|
| API-001 | Health Check | /health | GET | `{"status":"healthy","timestamp":"..."}` |
| API-002 | Ready Check | /ready | GET | `{"ready":true}` |
| API-003 | Root Endpoint | / | GET | `{"message":"UnifiedHealth API","version":"1.0.0"}` |
| API-004 | System Status | /api/v1/status | GET | `{"status":"operational","services":{...}}` |
| API-005 | Health Packages | /api/v1/health-packages | GET | Array of 3 packages |
| API-006 | Providers List | /api/v1/providers | GET | Array of 3 providers |

### 3.3 API Response Validation
```bash
# Test from command line
curl http://20.3.27.63/health
curl http://20.3.27.63/api/v1/status
curl http://20.3.27.63/api/v1/health-packages
curl http://20.3.27.63/api/v1/providers
```

Expected Health Packages Response:
```json
{
  "packages": [
    {"id": 1, "name": "Basic Health Checkup", "price": 99, "tests": ["Blood Test", "Urine Test", "BMI"]},
    {"id": 2, "name": "Executive Health Package", "price": 299, "tests": ["Full Blood Panel", "ECG", "X-Ray", "Consultation"]},
    {"id": 3, "name": "Cardiac Screening", "price": 199, "tests": ["ECG", "Echo", "Lipid Profile", "Stress Test"]}
  ]
}
```

Expected Providers Response:
```json
{
  "providers": [
    {"id": 1, "name": "City General Hospital", "specialty": "Multi-specialty", "rating": 4.5},
    {"id": 2, "name": "Heart Care Center", "specialty": "Cardiology", "rating": 4.8},
    {"id": 3, "name": "Wellness Clinic", "specialty": "Preventive Care", "rating": 4.3}
  ]
}
```

---

## 4. Security Tests

### 4.1 TLS/HTTPS Tests (After Domain Configuration)
| Test ID | Test Name | Expected Result |
|---------|-----------|-----------------|
| SEC-001 | HTTPS Redirect | HTTP redirects to HTTPS |
| SEC-002 | Valid Certificate | Let's Encrypt cert valid |
| SEC-003 | TLS Version | TLS 1.2 or higher |
| SEC-004 | HSTS Header | Strict-Transport-Security present |

### 4.2 Network Security
| Test ID | Test Name | Command | Expected Result |
|---------|-----------|---------|-----------------|
| SEC-005 | NSG Rules | `az network nsg rule list...` | Only ports 80, 443 open |
| SEC-006 | Private Endpoints | Azure Portal | PostgreSQL on private network |
| SEC-007 | Key Vault Access | Azure Portal | RBAC configured |

---

## 5. Performance Tests

### 5.1 Response Time Tests
| Test ID | Endpoint | Target Response Time |
|---------|----------|---------------------|
| PERF-001 | / (Landing Page) | < 500ms |
| PERF-002 | /health | < 100ms |
| PERF-003 | /api/v1/health-packages | < 200ms |
| PERF-004 | /api/v1/providers | < 200ms |

### 5.2 Load Testing (Optional)
```bash
# Using Apache Bench
ab -n 100 -c 10 http://20.3.27.63/health

# Using hey
hey -n 100 -c 10 http://20.3.27.63/api/v1/status
```

---

## 6. High Availability Tests

### 6.1 Pod Resilience
| Test ID | Test Name | Command | Expected Result |
|---------|-----------|---------|-----------------|
| HA-001 | Pod Recovery | `kubectl delete pod <pod-name>` | New pod created |
| HA-002 | API Redundancy | Kill one API pod | Other pod serves traffic |
| HA-003 | Ingress Redundancy | Kill one ingress pod | Other pod serves traffic |

### 6.2 Node Resilience
| Test ID | Test Name | Expected Result |
|---------|-----------|-----------------|
| HA-004 | Single Node Failure | Pods reschedule to other node |
| HA-005 | AKS Auto-scaling | Nodes scale 1-2 based on load |

---

## 7. Monitoring & Logging Tests

### 7.1 Log Verification
```bash
# Check API logs
kubectl logs -n unified-health -l app=unified-health-api --tail=50

# Check Web logs
kubectl logs -n unified-health -l app=web-demo --tail=50

# Check Ingress logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller --tail=50
```

### 7.2 Metrics (Azure Monitor)
| Metric | Location | Expected |
|--------|----------|----------|
| CPU Usage | Azure Portal > AKS > Metrics | < 70% |
| Memory Usage | Azure Portal > AKS > Metrics | < 80% |
| Pod Count | Azure Portal > AKS > Insights | 5+ pods |
| Node Count | Azure Portal > AKS > Insights | 2 nodes |

---

## 8. DNS Configuration Tests (When Domain Available)

### 8.1 GoDaddy DNS Setup
1. Log in to GoDaddy
2. Go to DNS Management
3. Add A Records:
   - Type: A, Name: @, Value: 20.3.27.63, TTL: 600
   - Type: A, Name: www, Value: 20.3.27.63, TTL: 600
   - Type: A, Name: api, Value: 20.3.27.63, TTL: 600

### 8.2 DNS Propagation Test
```bash
# Check DNS propagation
nslookup yourdomain.com
dig yourdomain.com

# Online tools
# https://dnschecker.org
# https://whatsmydns.net
```

### 8.3 SSL Certificate Verification
```bash
# After DNS propagation
kubectl get certificate -n unified-health
kubectl describe certificate -n unified-health
```

---

## 9. Browser Compatibility Tests

| Browser | Version | Test Result |
|---------|---------|-------------|
| Chrome | Latest | [ ] Pass |
| Firefox | Latest | [ ] Pass |
| Safari | Latest | [ ] Pass |
| Edge | Latest | [ ] Pass |
| Mobile Chrome | Latest | [ ] Pass |
| Mobile Safari | Latest | [ ] Pass |

---

## 10. Integration Tests Checklist

| # | Test Category | Test Item | Status |
|---|---------------|-----------|--------|
| 1 | Infrastructure | All Azure resources provisioned | [ ] |
| 2 | Infrastructure | AKS cluster healthy | [ ] |
| 3 | Infrastructure | PostgreSQL accessible | [ ] |
| 4 | Infrastructure | Redis accessible | [ ] |
| 5 | Kubernetes | All pods running | [ ] |
| 6 | Kubernetes | Ingress configured | [ ] |
| 7 | Kubernetes | Services accessible | [ ] |
| 8 | Application | Landing page loads | [ ] |
| 9 | Application | API health endpoint works | [ ] |
| 10 | Application | Health packages API works | [ ] |
| 11 | Application | Providers API works | [ ] |
| 12 | Security | NSG rules correct | [ ] |
| 13 | Security | HTTPS working (after DNS) | [ ] |
| 14 | Performance | Response times acceptable | [ ] |
| 15 | HA | Pod recovery works | [ ] |

---

## Quick Verification Commands

```bash
# Full cluster status
kubectl get all -n unified-health
kubectl get all -n ingress-nginx

# Test all endpoints
curl -s http://20.3.27.63/ | head -5
curl -s http://20.3.27.63/health
curl -s http://20.3.27.63/api/v1/status
curl -s http://20.3.27.63/api/v1/health-packages
curl -s http://20.3.27.63/api/v1/providers

# Internal cluster test (run from pod)
kubectl exec -n unified-health deployment/unified-health-api -- wget -qO- http://web-demo/
kubectl exec -n unified-health deployment/unified-health-api -- wget -qO- http://unified-health-api/health
```

---

## Troubleshooting

### Common Issues

1. **Site not reachable from browser**
   - Wait 5-10 minutes for Azure LB health probes
   - Check NSG rules: `az network nsg rule list...`
   - Verify pod status: `kubectl get pods -n unified-health`

2. **API returning errors**
   - Check API logs: `kubectl logs -n unified-health -l app=unified-health-api`
   - Verify ConfigMap: `kubectl get configmap -n unified-health`

3. **SSL certificate not issued**
   - Check cert-manager logs: `kubectl logs -n cert-manager -l app=cert-manager`
   - Verify ClusterIssuer: `kubectl get clusterissuer`
   - Check certificate status: `kubectl describe certificate -n unified-health`

---

## Summary

| Category | Count | Status |
|----------|-------|--------|
| Infrastructure Tests | 6 | Configured |
| Kubernetes Tests | 8 | Configured |
| API Endpoint Tests | 6 | Configured |
| Security Tests | 7 | Configured |
| Performance Tests | 4 | Configured |
| HA Tests | 5 | Configured |
| Browser Tests | 6 | Pending |
| **Total Tests** | **42** | Ready |

---

*Document generated: December 2025*
*Platform: UnifiedHealth on Azure*
*Environment: dev2*

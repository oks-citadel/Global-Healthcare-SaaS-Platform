# Country-Level Deployment Quick Reference Guide

## Quick Start

### Deploy a Single Country

```bash
# Americas
kubectl apply -k infrastructure/kubernetes/overlays/americas/us/
kubectl apply -k infrastructure/kubernetes/overlays/americas/ca/
kubectl apply -k infrastructure/kubernetes/overlays/americas/br/

# Europe
kubectl apply -k infrastructure/kubernetes/overlays/europe/de/  # Strict isolation
kubectl apply -k infrastructure/kubernetes/overlays/europe/gb/

# Africa
kubectl apply -k infrastructure/kubernetes/overlays/africa/za/
kubectl apply -k infrastructure/kubernetes/overlays/africa/ng/
kubectl apply -k infrastructure/kubernetes/overlays/africa/ke/
```

### Preview Before Deploying

```bash
# See what will be created
kubectl kustomize infrastructure/kubernetes/overlays/americas/us/

# Check Germany's strict isolation setup
kubectl kustomize infrastructure/kubernetes/overlays/europe/de/ | grep -A 20 "kind: NetworkPolicy"
```

## Country-Specific Details

### United States (US)
```yaml
Namespace: healthcare-us
Compliance: HIPAA/HITECH
Payment: Stripe (USD)
Features: Medicare, Medicaid, 50-state support
```

### Canada (CA)
```yaml
Namespace: healthcare-ca
Compliance: PIPEDA/PHIPA
Payment: Stripe (CAD)
Features: Provincial health, bilingual, OHIP
```

### Brazil (BR)
```yaml
Namespace: healthcare-br
Compliance: LGPD
Payment: MercadoPago (BRL)
Features: SUS, ANVISA, PIX/Boleto
```

### Germany (DE) - STRICT ISOLATION
```yaml
Namespace: healthcare-de
Compliance: GDPR-Strict/BDSG/SGB V
Payment: Stripe-DE (EUR)
Features: Gematik, E-prescription, Isolated storage
Special: Network policies, dedicated resources, no cross-border
```

**Germany requires additional setup:**
```bash
# 1. Deploy storage classes first
kubectl apply -f infrastructure/kubernetes/overlays/europe/de/dedicated-pvc.yaml

# 2. Verify network policies
kubectl get networkpolicies -n healthcare-de

# 3. Check resource quotas
kubectl describe resourcequota de-dedicated-quota -n healthcare-de
```

### United Kingdom (GB)
```yaml
Namespace: healthcare-gb
Compliance: UK GDPR/DPA 2018
Payment: Stripe-GB (GBP)
Features: NHS integration, GP Connect, NHS Spine
```

### South Africa (ZA)
```yaml
Namespace: healthcare-za
Compliance: POPIA
Payment: Paystack (ZAR)
Features: Medical schemes, 11 languages, HIV/TB programs
```

### Nigeria (NG)
```yaml
Namespace: healthcare-ng
Compliance: NDPR
Payment: Paystack (NGN)
Features: NHIS, Mobile-first, USSD/M-Pesa
```

### Kenya (KE)
```yaml
Namespace: healthcare-ke
Compliance: DPA 2019
Payment: M-Pesa (KES)
Features: NHIF/SHA, UHC, 47 counties
```

## Verification Commands

### Check Deployment Status
```bash
# Check namespace exists
kubectl get namespace healthcare-{country-code}

# View all resources in country
kubectl get all -n healthcare-{country-code}

# Check pods are running
kubectl get pods -n healthcare-{country-code}

# View services
kubectl get svc -n healthcare-{country-code}
```

### Germany-Specific Checks
```bash
# Verify network isolation
kubectl get networkpolicies -n healthcare-de
kubectl describe networkpolicy de-strict-isolation-policy -n healthcare-de

# Check resource allocation
kubectl get resourcequota -n healthcare-de
kubectl describe resourcequota de-dedicated-quota -n healthcare-de

# Verify dedicated storage
kubectl get pvc -n healthcare-de
kubectl get storageclass de-isolated-storage
```

### Configuration Verification
```bash
# Check ConfigMap values
kubectl get configmap shared-config -n healthcare-{country-code} -o yaml

# Verify country-specific config
kubectl get configmap country-specific-config -n healthcare-{country-code} -o yaml

# Check secrets
kubectl get secrets -n healthcare-{country-code}
```

## Troubleshooting

### Pod Not Starting
```bash
# Check pod events
kubectl describe pod {pod-name} -n healthcare-{country-code}

# View logs
kubectl logs {pod-name} -n healthcare-{country-code}

# Check resource limits
kubectl get resourcequota -n healthcare-{country-code}
```

### Germany Network Issues
```bash
# Verify network policies aren't blocking required traffic
kubectl get networkpolicies -n healthcare-de

# Test DNS resolution
kubectl run -it --rm debug --image=busybox --restart=Never -n healthcare-de -- nslookup kubernetes.default

# Check egress gateway connectivity
kubectl get pods -n istio-system | grep egressgateway
```

### Storage Issues
```bash
# Check PVC status
kubectl get pvc -n healthcare-{country-code}

# Describe PVC for events
kubectl describe pvc {pvc-name} -n healthcare-{country-code}

# Verify storage class exists
kubectl get storageclass
```

## Update Procedures

### Update Country Configuration
```bash
# Edit the configmap-patch.yaml
vim infrastructure/kubernetes/overlays/americas/us/configmap-patch.yaml

# Apply changes
kubectl apply -k infrastructure/kubernetes/overlays/americas/us/

# Verify update
kubectl get configmap shared-config -n healthcare-us -o yaml
```

### Update Container Images
```bash
# Edit kustomization.yaml to update image tags
vim infrastructure/kubernetes/overlays/americas/us/kustomization.yaml

# Apply updated images
kubectl apply -k infrastructure/kubernetes/overlays/americas/us/

# Watch rollout
kubectl rollout status deployment us-api-gateway -n healthcare-us
```

### Scale Country Deployment
```bash
# Edit replicas in kustomization.yaml
vim infrastructure/kubernetes/overlays/americas/us/kustomization.yaml

# Apply changes
kubectl apply -k infrastructure/kubernetes/overlays/americas/us/

# Verify scaling
kubectl get deployments -n healthcare-us
```

## Multi-Country Deployment Scripts

### Deploy All Countries in a Region
```bash
#!/bin/bash
# Deploy all Americas countries
for country in us ca br; do
  echo "Deploying $country..."
  kubectl apply -k infrastructure/kubernetes/overlays/americas/$country/
  sleep 5
done
```

### Deploy All Countries
```bash
#!/bin/bash
COUNTRIES=(
  "americas/us"
  "americas/ca"
  "americas/br"
  "europe/de"
  "europe/gb"
  "africa/za"
  "africa/ng"
  "africa/ke"
)

for country in "${COUNTRIES[@]}"; do
  echo "Deploying $country..."
  kubectl apply -k infrastructure/kubernetes/overlays/$country/
  sleep 10
done
```

### Health Check All Countries
```bash
#!/bin/bash
COUNTRIES=(us ca br de gb za ng ke)

for country in "${COUNTRIES[@]}"; do
  echo "Checking $country..."
  kubectl get pods -n healthcare-$country --field-selector=status.phase!=Running
done
```

## Monitoring

### View Country Metrics
```bash
# Get resource usage per country
kubectl top pods -n healthcare-{country-code}
kubectl top nodes -l country={country-code}

# Check service health
kubectl get pods -n healthcare-{country-code} --watch
```

### Check Logs
```bash
# View logs from all pods in country
kubectl logs -l country={country-code} -n healthcare-{country-code} --tail=100

# Stream logs
kubectl logs -f deployment/us-api-gateway -n healthcare-us
```

## Cleanup

### Delete a Country Deployment
```bash
# Delete all resources for a country
kubectl delete -k infrastructure/kubernetes/overlays/americas/us/

# Or delete namespace (removes everything)
kubectl delete namespace healthcare-us
```

### Delete All Country Deployments
```bash
#!/bin/bash
NAMESPACES=(healthcare-us healthcare-ca healthcare-br healthcare-de healthcare-gb healthcare-za healthcare-ng healthcare-ke)

for ns in "${NAMESPACES[@]}"; do
  echo "Deleting $ns..."
  kubectl delete namespace $ns
done
```

## Best Practices

1. **Always preview before deploying**
   ```bash
   kubectl kustomize overlays/americas/us/ | less
   ```

2. **Deploy to staging first**
   ```bash
   kubectl apply -k overlays/americas/us/ --dry-run=server
   ```

3. **Monitor during rollout**
   ```bash
   kubectl get pods -n healthcare-us --watch
   ```

4. **Verify network policies (Germany)**
   ```bash
   kubectl describe networkpolicy -n healthcare-de
   ```

5. **Check resource quotas regularly**
   ```bash
   kubectl describe resourcequota -n healthcare-{country-code}
   ```

6. **Keep ConfigMaps in version control**
   - Always edit YAML files, not live resources
   - Use `kubectl apply`, not `kubectl edit`

7. **Test compliance settings**
   - Verify data residency rules
   - Check encryption settings
   - Validate access controls

## Emergency Procedures

### Rollback Country Deployment
```bash
# Find previous revision
kubectl rollout history deployment us-api-gateway -n healthcare-us

# Rollback to previous version
kubectl rollout undo deployment us-api-gateway -n healthcare-us

# Rollback to specific revision
kubectl rollout undo deployment us-api-gateway -n healthcare-us --to-revision=2
```

### Emergency Scale Down
```bash
# Scale specific deployment to 0
kubectl scale deployment us-api-gateway -n healthcare-us --replicas=0

# Scale all deployments in namespace
kubectl scale deployment --all -n healthcare-us --replicas=0
```

### Emergency Network Isolation (Add to any country)
```bash
# Apply strict deny-all network policy
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: emergency-deny-all
  namespace: healthcare-us
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
EOF
```

## Support Contacts

- **Platform Team**: platform-team@healthcare.com
- **Security Team**: security@healthcare.com
- **Compliance Team**: compliance@healthcare.com
- **On-Call**: +1-XXX-XXX-XXXX

## Additional Resources

- Architecture Documentation: `infrastructure/kubernetes/ARCHITECTURE.md`
- Kustomize Guide: `infrastructure/kubernetes/KUSTOMIZE-README.md`
- Deployment Checklist: `infrastructure/kubernetes/DEPLOYMENT-CHECKLIST.md`
- Country Overlays Summary: `infrastructure/kubernetes/overlays/COUNTRY-OVERLAYS-SUMMARY.md`

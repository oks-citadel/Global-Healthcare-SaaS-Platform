# Kubernetes Multi-Region Deployment - Quick Reference

## Quick Deploy Commands

### Deploy to Americas
```bash
./deploy-regions.sh deploy americas
```

### Deploy to Europe (GDPR)
```bash
./deploy-regions.sh deploy europe
```

### Deploy to Africa
```bash
./deploy-regions.sh deploy africa
```

### Deploy All Regions
```bash
./deploy-regions.sh deploy-all
```

## Quick Check Commands

### Preview Before Deploying
```bash
./deploy-regions.sh preview <region>
```

### Validate Manifests
```bash
./validate-manifests.sh
```

### Check Health
```bash
./deploy-regions.sh health <region>
```

### View Logs
```bash
./deploy-regions.sh logs <region> <service-name>
# Example: ./deploy-regions.sh logs americas api-gateway
```

## Quick Scale Commands

### Scale a Service
```bash
./deploy-regions.sh scale <region> <service> <replicas>
# Example: ./deploy-regions.sh scale americas api-gateway 5
```

## Quick Rollback Commands

### Rollback All Services in Region
```bash
./deploy-regions.sh rollback <region>
```

### Rollback Single Service
```bash
kubectl rollout undo deployment/<service> -n healthcare-<region>
```

## Service Names

All services available for deployment:
- `api-gateway`
- `telehealth-service`
- `mental-health-service`
- `chronic-care-service`
- `pharmacy-service`
- `laboratory-service`

## Region Names

Available regions:
- `americas` (US, Canada, Brazil)
- `europe` (EU/UK with GDPR)
- `africa` (Africa with mobile-first)

## Namespaces

- Americas: `healthcare-americas`
- Europe: `healthcare-europe`
- Africa: `healthcare-africa`

## Common kubectl Commands

### Get All Pods
```bash
kubectl get pods -n healthcare-<region>
```

### Get All Services
```bash
kubectl get svc -n healthcare-<region>
```

### Get Ingress
```bash
kubectl get ingress -n healthcare-<region>
```

### Get HPA Status
```bash
kubectl get hpa -n healthcare-<region>
```

### Describe Pod
```bash
kubectl describe pod <pod-name> -n healthcare-<region>
```

### View Pod Logs
```bash
kubectl logs <pod-name> -n healthcare-<region>
kubectl logs <pod-name> -n healthcare-<region> -f  # Follow logs
```

### Port Forward to Service
```bash
kubectl port-forward svc/<service-name> 8080:80 -n healthcare-<region>
```

### Execute Command in Pod
```bash
kubectl exec -it <pod-name> -n healthcare-<region> -- /bin/sh
```

## File Locations

### Base Configurations
- Services: `base/services/<service-name>/`
- Shared: `base/shared/`
- Ingress: `base/ingress/`

### Region Overlays
- Americas: `overlays/americas/`
- Europe: `overlays/europe/`
- Africa: `overlays/africa/`

## Important Files to Update Before Deploy

1. **Secrets**: `base/shared/secrets.yaml`
   - Replace all CHANGEME values
   - Use: `openssl rand -base64 32` to generate keys

2. **Domains**: `base/ingress/ingress.yaml`
   - Update domain names
   - Update certificate issuer

3. **IAM Roles**: Service YAML files
   - Update AWS IAM role ARNs

4. **Image Tags**: Overlay `kustomization.yaml` files
   - Update image versions per region

## Monitoring Endpoints

All services expose:
- `/health/live` - Liveness probe
- `/health/ready` - Readiness probe
- `/health/startup` - Startup probe
- `/metrics` - Prometheus metrics (port 9091)

## Resource Requirements Per Region

### Americas (Production)
- Replicas: 3 per service
- Resources: High (production-level)

### Europe (Production + GDPR)
- Replicas: 3-4 per service
- Resources: High (production-level)

### Africa (Cost-Optimized)
- Replicas: 2-3 per service
- Resources: Medium (optimized)

## Troubleshooting Quick Fixes

### Pod Not Starting
```bash
kubectl describe pod <pod-name> -n healthcare-<region>
kubectl logs <pod-name> -n healthcare-<region>
```

### Service Not Accessible
```bash
kubectl get endpoints -n healthcare-<region>
kubectl describe svc <service-name> -n healthcare-<region>
```

### Ingress Not Working
```bash
kubectl describe ingress healthcare-platform-ingress -n healthcare-<region>
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx
```

### High Memory/CPU
```bash
kubectl top pods -n healthcare-<region>
kubectl top nodes
```

## Emergency Contacts

For critical issues:
- Check logs first: `./deploy-regions.sh logs <region> <service>`
- Check health: `./deploy-regions.sh health <region>`
- Rollback if needed: `./deploy-regions.sh rollback <region>`

## Documentation References

- Full Documentation: `KUSTOMIZE-README.md`
- Deployment Summary: `DEPLOYMENT-SUMMARY.md`
- This Quick Reference: `QUICK-REFERENCE.md`

## License

Copyright © 2024 Healthcare Platform. All rights reserved.

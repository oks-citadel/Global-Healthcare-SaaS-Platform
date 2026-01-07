# Pod Disruption Budgets (PDBs)

## Overview

Pod Disruption Budgets (PDBs) are Kubernetes resources that limit the number of pods of a replicated application that can be simultaneously down due to voluntary disruptions. They are essential for maintaining high availability during cluster maintenance operations.

## What Are Pod Disruption Budgets?

A PodDisruptionBudget is a Kubernetes API object that specifies the minimum number of replicas that must remain available (or the maximum number that can be unavailable) during voluntary disruptions such as:

- **Node drains** for maintenance or upgrades
- **Rolling updates** of deployments
- **Cluster autoscaling** operations (scale down)
- **Manual pod evictions** via `kubectl drain` or API calls
- **Spot/preemptible instance termination** handling

### Important Distinction

PDBs only protect against **voluntary disruptions**. They do not protect against **involuntary disruptions** such as:

- Hardware failures
- Kernel panics
- Network partitions
- Out-of-memory conditions
- Node crashes

## Why Are PDBs Important?

### 1. High Availability Guarantee
PDBs ensure that a minimum number of pods remain running during maintenance operations, preventing service outages.

### 2. Safe Cluster Operations
Cluster administrators can safely perform node drains and upgrades knowing that applications will maintain availability.

### 3. Compliance Requirements
Healthcare applications often require specific uptime guarantees. PDBs help meet SLA requirements.

### 4. Graceful Degradation
By controlling the rate of pod termination, PDBs allow time for load balancers to detect and route traffic appropriately.

## PDB Configuration in This Directory

### api-pdb.yaml
- **Service**: Unified Health API
- **minAvailable**: 2
- **Recommendation**: Run at least 3 replicas in production

### web-pdb.yaml
- **Service**: Unified Health Web Frontend
- **minAvailable**: 2
- **Recommendation**: Run at least 3 replicas in production

### auth-pdb.yaml
- **Service**: Authentication Service
- **minAvailable**: 1
- **Recommendation**: Run at least 2 replicas in production

## Configuration Options

### minAvailable

Specifies the minimum number of pods that must remain available:

```yaml
spec:
  minAvailable: 2  # At least 2 pods must always be running
```

Can also be specified as a percentage:

```yaml
spec:
  minAvailable: "50%"  # At least 50% of pods must be running
```

### maxUnavailable

Alternative to minAvailable - specifies maximum pods that can be down:

```yaml
spec:
  maxUnavailable: 1  # At most 1 pod can be unavailable
```

Can also be a percentage:

```yaml
spec:
  maxUnavailable: "25%"  # At most 25% of pods can be unavailable
```

### unhealthyPodEvictionPolicy

Controls how unhealthy pods are handled during disruptions:

- **IfHealthyBudget**: Unhealthy pods can be evicted if healthy pods satisfy the budget
- **AlwaysAllow**: Unhealthy pods can always be evicted regardless of the budget

```yaml
spec:
  unhealthyPodEvictionPolicy: IfHealthyBudget
```

## Impact on Operations

### Node Drain Behavior

When you run `kubectl drain <node>`:

1. Kubernetes checks PDBs for all pods on the node
2. If evicting a pod would violate its PDB, the drain operation waits
3. The drain continues only when the PDB allows eviction
4. If a PDB cannot be satisfied, the drain will eventually timeout

### Rolling Update Behavior

During deployment updates:

1. Kubernetes respects PDBs when terminating old pods
2. New pods must become ready before old pods can be terminated (if PDB would be violated)
3. Updates may take longer but maintain availability

### Cluster Autoscaler Behavior

When the cluster autoscaler scales down:

1. It checks if removing a node would violate any PDBs
2. Nodes with pods protected by strict PDBs may not be removed
3. This prevents availability issues during cost optimization

## Best Practices

### 1. Match PDB to Replica Count

| Replicas | minAvailable | Disruption Allowed |
|----------|--------------|-------------------|
| 2        | 1            | 1 pod             |
| 3        | 2            | 1 pod             |
| 4        | 2            | 2 pods            |
| 5        | 3            | 2 pods            |

### 2. Consider Your SLA

- **99.9% uptime**: Use `minAvailable: 2` with 3+ replicas
- **99.99% uptime**: Use `minAvailable: 3` with 4+ replicas
- **Critical services**: Consider percentage-based budgets

### 3. Use Appropriate Selectors

Ensure PDB selectors match your deployment labels exactly:

```yaml
# Deployment
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: my-app
      app.kubernetes.io/component: api

# PDB (must match)
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: my-app
      app.kubernetes.io/component: api
```

### 4. Monitor PDB Status

Check PDB status regularly:

```bash
# View all PDBs
kubectl get pdb -n unified-health

# Detailed PDB information
kubectl describe pdb api-pdb -n unified-health

# Check disruptions allowed
kubectl get pdb -n unified-health -o wide
```

### 5. Test Before Production

Always test PDBs in staging:

```bash
# Simulate a node drain
kubectl drain <node-name> --dry-run=client

# Check which pods would be evicted
kubectl get pods -n unified-health -o wide
```

## Troubleshooting

### Drain Operation Stuck

If `kubectl drain` is stuck:

1. Check PDB status: `kubectl get pdb -n unified-health`
2. Verify replica count: `kubectl get deployment -n unified-health`
3. Check pod health: `kubectl get pods -n unified-health`
4. If needed, use `--ignore-daemonsets` or `--delete-emptydir-data`

### PDB Blocking Updates

If deployments are slow or stuck:

1. Ensure enough replicas are running
2. Check pod readiness probes
3. Verify resource availability for new pods
4. Consider temporarily relaxing PDB during emergency updates

### Common Errors

```
Cannot evict pod as it would violate the pod's disruption budget.
```

**Solution**: Ensure more replicas are running than minAvailable, or wait for pods to become ready.

## Environment-Specific Overrides

PDB values can be overridden per environment using Kustomize overlays:

```yaml
# overlays/production/pdb-patch.yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api-pdb
spec:
  minAvailable: 3  # Higher availability for production
```

## Related Documentation

- [Kubernetes PDB Documentation](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/)
- [Specifying a Disruption Budget](https://kubernetes.io/docs/tasks/run-application/configure-pdb/)
- [Unified Health Platform Operations Guide](https://docs.thetheunifiedhealth.com/ops)

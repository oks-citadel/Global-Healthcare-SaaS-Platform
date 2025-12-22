# nip.io DNS-01 Workarounds for UnifiedHealth Platform

## The Problem

The current setup uses `api.20-3-27-63.nip.io` as the domain. nip.io is a wildcard DNS service that:
- Resolves `*.IP.nip.io` to the embedded IP address
- Does NOT allow you to control DNS records
- Does NOT support DNS-01 challenges

Since port 80 is blocked by an external firewall, HTTP-01 challenges fail, and DNS-01 cannot work directly with nip.io.

## Available Options

### Option 1: Register a Real Domain (Recommended for Production)

**Cost**: ~$10-15/year for a domain

1. Register a domain (e.g., `unifiedhealth.io`, `unified-health.dev`)
2. Create an Azure DNS Zone for it
3. Point domain nameservers to Azure DNS
4. Use the DNS-01 ClusterIssuer with Azure DNS

**Files to use**:
- `dns01-clusterissuer-azure.yaml`
- `dns-zone-cert-manager.tf`

**Benefits**:
- Full production-ready solution
- Wildcard certificates supported
- Professional domain name

---

### Option 2: Use sslip.io Instead of nip.io

**Cost**: Free

sslip.io is similar to nip.io but has implemented DNS-01 support for some scenarios.

1. Replace `nip.io` with `sslip.io` in your configuration
2. Try: `api.20-3-27-63.sslip.io`

**Note**: This may or may not work depending on sslip.io's current implementation. Test first with Let's Encrypt staging.

---

### Option 3: Self-Signed Certificates (Development Only)

**Cost**: Free

Use cert-manager's built-in selfsigned issuer:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: selfsigned-issuer
spec:
  selfSigned: {}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: unified-health-selfsigned
  namespace: unified-health
spec:
  secretName: unified-health-selfsigned-tls
  issuerRef:
    name: selfsigned-issuer
    kind: ClusterIssuer
  dnsNames:
  - api.20-3-27-63.nip.io
  duration: 8760h  # 1 year
  renewBefore: 720h  # 30 days
```

**Limitations**:
- Browsers will show security warnings
- Not suitable for production
- Clients must trust the self-signed CA

---

### Option 4: ACME-DNS with CNAME Delegation

**Cost**: Free (if self-hosted) or small hosting cost

This is the most complex but allows DNS-01 with any domain:

1. Deploy acme-dns server
2. Register nip.io domain with acme-dns
3. **Problem**: You cannot create CNAME records in nip.io

**Workaround**: Use a parent domain you control to delegate `_acme-challenge`:

```
_acme-challenge.api.20-3-27-63.nip.io CNAME your-subdomain.acme-dns.server
```

But since you don't control `nip.io`, this won't work directly.

**Real solution**: Use ACME-DNS with a domain you control, then create a CNAME from `_acme-challenge.yourdomain.com`.

---

### Option 5: Use Azure Front Door / Application Gateway with Managed Certificates

**Cost**: Azure Front Door/App Gateway pricing

Azure services can provision and manage their own certificates:

1. Deploy Azure Front Door or Application Gateway
2. Configure managed certificates (Azure handles the ACME challenges)
3. Point your services behind the managed endpoint

**Note**: This changes the architecture significantly.

---

### Option 6: Obtain Certificate Externally and Import

**Cost**: Time

1. Use certbot or another ACME client on a machine where port 80 is accessible
2. Obtain the certificate manually
3. Import into Kubernetes as a secret

```bash
# On a machine with port 80 open
certbot certonly --standalone -d api.20-3-27-63.nip.io

# Import to Kubernetes
kubectl create secret tls unified-health-tls \
  --cert=/etc/letsencrypt/live/api.20-3-27-63.nip.io/fullchain.pem \
  --key=/etc/letsencrypt/live/api.20-3-27-63.nip.io/privkey.pem \
  -n unified-health
```

**Limitations**:
- Manual renewal required every 90 days
- Requires a machine with port 80 accessible

---

## Recommended Path Forward

### For Development/Testing:
1. Use **self-signed certificates** (Option 3)
2. Configure local trust for development machines

### For Production:
1. **Register a real domain** (Option 1)
2. Set up Azure DNS with cert-manager DNS-01
3. Use the provided configuration files

### Quick Development Setup (Self-Signed)

```bash
# Create self-signed issuer
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: selfsigned-issuer
spec:
  selfSigned: {}
EOF

# Create self-signed certificate for nip.io domain
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: unified-health-dev-tls
  namespace: unified-health
spec:
  secretName: unified-health-dev-tls
  issuerRef:
    name: selfsigned-issuer
    kind: ClusterIssuer
  dnsNames:
  - api.20-3-27-63.nip.io
  - "*.20-3-27-63.nip.io"
  duration: 8760h
  renewBefore: 720h
  privateKey:
    algorithm: RSA
    size: 4096
EOF

# Update ingress to use the self-signed certificate
kubectl patch ingress unified-health-ingress -n unified-health \
  --type='json' \
  -p='[{"op": "replace", "path": "/spec/tls/0/secretName", "value": "unified-health-dev-tls"}]'
```

---

## Summary Table

| Option | Works with nip.io? | Production Ready? | Complexity | Cost |
|--------|-------------------|-------------------|------------|------|
| Real Domain + Azure DNS | N/A (replace nip.io) | Yes | Medium | ~$15/yr |
| sslip.io | Maybe | Maybe | Low | Free |
| Self-Signed | Yes | No | Low | Free |
| ACME-DNS | No (need owned domain) | Yes | High | Free |
| Azure Front Door | Yes | Yes | Medium | $$$$ |
| External Certificate | Yes | Yes (manual) | Medium | Free |

**Recommendation**: For the UnifiedHealth platform moving towards production, register a real domain and use Azure DNS with DNS-01 challenges.

# DNS Record Plan and Cutover Steps

> **Version:** 1.0.0
> **Last Updated:** 2026-01-24
> **DNS Provider:** GoDaddy (No delegation to external providers)

## DNS Architecture Overview

```
                    GoDaddy DNS (Authoritative)
                              │
           ┌──────────────────┼──────────────────┐
           │                  │                  │
           ▼                  ▼                  ▼
    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │   Vercel    │    │   Railway   │    │   Other     │
    │  (Frontend) │    │  (Backend)  │    │  (Email)    │
    └─────────────┘    └─────────────┘    └─────────────┘
```

## Pre-Cutover Checklist

### T-7 Days: Preparation
- [ ] Document current DNS records (export from GoDaddy)
- [ ] Verify Vercel project domains configured
- [ ] Verify Railway custom domain configured
- [ ] Test applications with preview/staging URLs

### T-48 Hours: TTL Reduction
- [ ] Lower all TTLs to 300 seconds (5 minutes)
- [ ] Verify TTL changes propagated

### T-24 Hours: Final Verification
- [ ] All services healthy on new infrastructure
- [ ] Database migration complete
- [ ] SSL certificates provisioned (Vercel auto, Railway auto)
- [ ] Team notified of cutover window

### T-0: Cutover
- [ ] Execute DNS record changes
- [ ] Monitor propagation
- [ ] Verify all endpoints

### T+24 Hours: Post-Cutover
- [ ] Restore TTLs to production values
- [ ] Monitor for issues
- [ ] Document lessons learned

---

## GoDaddy DNS Records

### Production DNS Records

> **IMPORTANT:** Replace `yourdomain.com` with your actual domain.
> Replace Vercel/Railway values with your actual deployment values.

#### A Records

| Host | Type | Value | TTL | Purpose |
|------|------|-------|-----|---------|
| `@` | A | `76.76.21.21` | 300 → 3600 | Root domain → Vercel |

**Note:** Vercel's IP `76.76.21.21` is their anycast IP for root domains.

#### CNAME Records

| Host | Type | Value | TTL | Purpose |
|------|------|-------|-----|---------|
| `app` | CNAME | `cname.vercel-dns.com` | 300 → 3600 | Main web application |
| `admin` | CNAME | `cname.vercel-dns.com` | 300 → 3600 | Admin dashboard |
| `provider` | CNAME | `cname.vercel-dns.com` | 300 → 3600 | Provider portal |
| `kiosk` | CNAME | `cname.vercel-dns.com` | 300 → 3600 | Kiosk application |
| `staging` | CNAME | `cname.vercel-dns.com` | 300 → 3600 | Staging environment |
| `api` | CNAME | `<project>.up.railway.app` | 300 → 3600 | API Gateway |
| `api-staging` | CNAME | `<staging-project>.up.railway.app` | 300 → 3600 | Staging API |
| `ws` | CNAME | `<telehealth>.up.railway.app` | 300 → 3600 | WebSocket/Realtime |
| `www` | CNAME | `cname.vercel-dns.com` | 300 → 3600 | www redirect |

#### TXT Records (Verification)

| Host | Type | Value | TTL | Purpose |
|------|------|-------|-----|---------|
| `@` | TXT | `v=spf1 include:_spf.google.com ~all` | 3600 | SPF for email |
| `_dmarc` | TXT | `v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com` | 3600 | DMARC policy |
| `@` | TXT | `google-site-verification=<value>` | 3600 | Google verification |

#### MX Records (Email - if applicable)

| Host | Type | Priority | Value | TTL | Purpose |
|------|------|----------|-------|-----|---------|
| `@` | MX | 1 | `aspmx.l.google.com` | 3600 | Primary mail |
| `@` | MX | 5 | `alt1.aspmx.l.google.com` | 3600 | Backup mail |
| `@` | MX | 5 | `alt2.aspmx.l.google.com` | 3600 | Backup mail |

---

## Step-by-Step Cutover Procedure

### Step 1: Export Current Records (T-7 days)

```bash
# Document current DNS state
# GoDaddy doesn't have CLI, use web interface:
# 1. Log into GoDaddy
# 2. Go to DNS Management
# 3. Screenshot or export all records
# 4. Save to /docs/dns-backup-YYYY-MM-DD.txt
```

**Manual Documentation Template:**
```
DNS Backup - yourdomain.com - YYYY-MM-DD
========================================
Record Type | Host | Value | TTL
----------------------------------------
A           | @    | x.x.x.x | 3600
CNAME       | www  | ... | 3600
...
```

### Step 2: Lower TTLs (T-48 hours)

**GoDaddy Web Interface:**
1. Log into GoDaddy Account
2. Navigate to: My Products → Domains → DNS
3. For each record that will change:
   - Click the pencil/edit icon
   - Change TTL from `3600` (1 hour) to `300` (5 minutes)
   - Save

**Records to update TTL:**
- [ ] `@` (A record)
- [ ] `app` (CNAME)
- [ ] `admin` (CNAME)
- [ ] `provider` (CNAME)
- [ ] `kiosk` (CNAME)
- [ ] `api` (CNAME)
- [ ] `ws` (CNAME)
- [ ] `staging` (CNAME)
- [ ] `www` (CNAME)

### Step 3: Verify TTL Propagation (T-24 hours)

```bash
# Check TTL has propagated
dig +short yourdomain.com | head -1
dig yourdomain.com | grep -E "^yourdomain.com.*IN.*A" | awk '{print $2}'

# Should show 300 (or close to it)
# If still showing old TTL, wait and retry
```

### Step 4: Verify Target Infrastructure (T-12 hours)

```bash
# Verify Vercel is ready
curl -I https://your-project.vercel.app
# Should return 200 OK

# Verify Railway is ready
curl -I https://your-project.up.railway.app/health
# Should return 200 OK with health response

# Verify SSL certificates
echo | openssl s_client -connect your-project.vercel.app:443 2>/dev/null | openssl x509 -noout -dates
echo | openssl s_client -connect your-project.up.railway.app:443 2>/dev/null | openssl x509 -noout -dates
```

### Step 5: Execute DNS Changes (T-0)

**GoDaddy Web Interface - Execute in Order:**

#### 5a. Update Root Domain (A Record)
1. Edit `@` A record
2. Change value to: `76.76.21.21`
3. Keep TTL at `300`
4. Save

#### 5b. Add/Update Frontend CNAMEs
```
Host: app
Type: CNAME
Value: cname.vercel-dns.com
TTL: 300
```

Repeat for: `admin`, `provider`, `kiosk`, `staging`, `www`

#### 5c. Add/Update API CNAME
```
Host: api
Type: CNAME
Value: <your-railway-project>.up.railway.app
TTL: 300
```

#### 5d. Add/Update WebSocket CNAME
```
Host: ws
Type: CNAME
Value: <your-telehealth-service>.up.railway.app
TTL: 300
```

### Step 6: Monitor Propagation (T+0 to T+30 minutes)

```bash
# Monitor DNS propagation in real-time
watch -n 30 'dig +short yourdomain.com && dig +short app.yourdomain.com && dig +short api.yourdomain.com'

# Check from multiple locations using online tools:
# - https://www.whatsmydns.net/
# - https://dnschecker.org/

# Verify each endpoint
curl -I https://yourdomain.com
curl -I https://app.yourdomain.com
curl -I https://admin.yourdomain.com
curl -I https://api.yourdomain.com/health
```

### Step 7: Validate Application (T+30 minutes)

```bash
# Run validation script
./scripts/validate-deployment.sh

# Manual checks:
# [ ] Homepage loads
# [ ] Login works
# [ ] API responses correct
# [ ] WebSocket connections work
# [ ] Admin portal accessible
# [ ] Provider portal accessible
```

**Validation Script (`scripts/validate-deployment.sh`):**
```bash
#!/bin/bash
set -e

DOMAIN="yourdomain.com"
ENDPOINTS=(
    "https://$DOMAIN"
    "https://app.$DOMAIN"
    "https://admin.$DOMAIN"
    "https://provider.$DOMAIN"
    "https://api.$DOMAIN/health"
)

echo "Validating deployment..."

for endpoint in "${ENDPOINTS[@]}"; do
    echo -n "Checking $endpoint... "
    status=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint")
    if [ "$status" -eq 200 ]; then
        echo "OK ($status)"
    else
        echo "FAILED ($status)"
        exit 1
    fi
done

echo ""
echo "All endpoints validated successfully!"
```

### Step 8: Restore Production TTLs (T+24 hours)

After confirming stable operation for 24 hours:

1. Log into GoDaddy
2. For each record, update TTL from `300` to `3600`
3. Save changes

---

## DNS Propagation Timing

| Phase | Expected Duration | Notes |
|-------|-------------------|-------|
| TTL reduction propagation | 1-24 hours | Depends on current TTL |
| DNS change propagation | 5-30 minutes | With 300s TTL |
| Global propagation | 1-4 hours | All ISPs updated |
| Full cache expiry | 24-48 hours | Worst case |

---

## Rollback DNS Plan

### Rollback Trigger Conditions

Execute rollback if ANY of these occur:
- [ ] Application errors exceed 5% error rate for 10+ minutes
- [ ] API latency P95 > 5 seconds for 10+ minutes
- [ ] Authentication completely broken
- [ ] Database connectivity lost
- [ ] Management decision to abort

### Rollback Procedure

#### Immediate Rollback (< 30 minutes from cutover)

Since TTLs are low (300s), rollback is fast:

1. **Restore A Record:**
   ```
   Host: @
   Type: A
   Value: <OLD-IP-ADDRESS>  # From backup
   TTL: 300
   ```

2. **Restore CNAMEs:**
   ```
   Host: app
   Type: CNAME
   Value: <OLD-CNAME-VALUE>  # From backup
   TTL: 300
   ```

3. Repeat for all changed records

4. **Verify rollback:**
   ```bash
   # Wait 5-10 minutes
   dig +short yourdomain.com
   curl -I https://yourdomain.com
   ```

#### Rollback Record Reference

**Keep this information readily available during cutover:**

| Record | Old Value | New Value (Vercel/Railway) |
|--------|-----------|---------------------------|
| `@` A | `<current-ip>` | `76.76.21.21` |
| `app` CNAME | `<current-value>` | `cname.vercel-dns.com` |
| `admin` CNAME | `<current-value>` | `cname.vercel-dns.com` |
| `api` CNAME | `<current-value>` | `<project>.up.railway.app` |

### Rollback Propagation Expectations

With 300-second TTL:
- **50% of users:** < 5 minutes
- **90% of users:** < 10 minutes
- **99% of users:** < 30 minutes

---

## GoDaddy-Specific Instructions

### Accessing DNS Management

1. Go to https://dcc.godaddy.com/
2. Sign in to your account
3. Click "DNS" next to your domain
4. Or: My Products → All Products and Services → Domains → DNS

### Adding a New Record

1. Click "Add" button
2. Select record type (A, CNAME, TXT, etc.)
3. Fill in:
   - **Host/Name:** Subdomain (or @ for root)
   - **Points to/Value:** Target address
   - **TTL:** Time to live
4. Click "Save"

### Editing Existing Record

1. Find the record in the list
2. Click the pencil icon (edit)
3. Modify values
4. Click "Save"

### Deleting a Record

1. Find the record in the list
2. Click the trash icon (delete)
3. Confirm deletion

### Important GoDaddy Notes

- **Propagation:** GoDaddy updates typically propagate within 5-15 minutes
- **CNAME at root:** GoDaddy does not support CNAME at root (`@`), use A record
- **Multiple A records:** For load balancing, add multiple A records with same host
- **TTL minimum:** GoDaddy minimum TTL is 600 seconds (10 minutes) on some plans
- **Apex domain:** Must use A record, not CNAME

---

## Verification Commands Reference

```bash
# Basic DNS lookup
dig yourdomain.com
dig app.yourdomain.com
dig api.yourdomain.com

# Short output (just the IP/value)
dig +short yourdomain.com
dig +short app.yourdomain.com CNAME

# Check specific nameserver
dig @8.8.8.8 yourdomain.com
dig @1.1.1.1 yourdomain.com

# Check TTL
dig yourdomain.com | grep -E "^yourdomain" | awk '{print $2}'

# Check all record types
dig yourdomain.com ANY

# Trace DNS resolution path
dig +trace yourdomain.com

# Check NS records (verify GoDaddy is authoritative)
dig NS yourdomain.com

# Check MX records
dig MX yourdomain.com

# Check TXT records (SPF, DMARC)
dig TXT yourdomain.com
dig TXT _dmarc.yourdomain.com

# HTTP check
curl -I https://yourdomain.com
curl -I -H "Host: yourdomain.com" https://76.76.21.21

# SSL certificate check
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates

# Full connectivity test
curl -v https://api.yourdomain.com/health
```

---

## Cutover Timing Recommendations

### Best Cutover Windows

| Day | Time (UTC) | Risk Level | Notes |
|-----|------------|------------|-------|
| Tuesday | 14:00-18:00 | Low | Mid-week, business hours |
| Wednesday | 14:00-18:00 | Low | Mid-week, business hours |
| Thursday | 14:00-16:00 | Medium | Before weekend |

### Avoid Cutover During

- Mondays (post-weekend issues)
- Fridays (reduced support availability)
- Weekends (minimal staffing)
- Holidays
- Month-end (high traffic periods)
- Known high-traffic events

### Recommended Cutover Schedule

```
T-48h (Monday 14:00 UTC)
├── Lower TTLs to 300s
├── Final infrastructure verification
└── Send team notification

T-24h (Tuesday 14:00 UTC)
├── Verify TTL propagation
├── Final staging tests
├── Prepare rollback records
└── Team standup

T-0 (Wednesday 14:00 UTC)
├── Begin cutover
├── Execute DNS changes
├── Monitor propagation
└── Validate endpoints

T+1h (Wednesday 15:00 UTC)
├── Initial validation complete
├── Monitor for issues
└── Go/No-go decision

T+24h (Thursday 14:00 UTC)
├── Restore TTLs to 3600s
├── Close maintenance window
└── Post-mortem if needed
```

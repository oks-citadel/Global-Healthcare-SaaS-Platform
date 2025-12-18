# GitHub Secrets Setup Guide

This document lists all the secrets that need to be configured in your GitHub repository for the CI/CD pipelines to work properly.

## Required Secrets

### Azure Authentication

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `AZURE_CREDENTIALS` | Azure service principal credentials (JSON) | `az ad sp create-for-rbac --name "github-actions-sp" --role contributor --scopes /subscriptions/d8afbfb0-0c60-4d11-a1c7-a614235f5eb6 --sdk-auth` |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription ID | `d8afbfb0-0c60-4d11-a1c7-a614235f5eb6` |
| `AZURE_TENANT_ID` | Azure tenant ID | From Azure portal or `az account show` |
| `AZURE_CLIENT_ID` | Azure service principal client ID | From service principal creation output |
| `AZURE_CLIENT_SECRET` | Azure service principal client secret | From service principal creation output |

### Database

| Secret Name | Description | Example |
|------------|-------------|---------|
| `POSTGRESQL_ADMIN_PASSWORD` | PostgreSQL admin password | Strong random password (32+ chars) |
| `DATABASE_URL` | Full database connection string | `postgresql://user:pass@host:5432/db?sslmode=require` |

### Application Secrets

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `JWT_SECRET` | Secret for signing JWT tokens | Generate with `openssl rand -base64 64` |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | Generate with `openssl rand -base64 64` |
| `ENCRYPTION_KEY` | AES encryption key for PHI data | Generate with `openssl rand -hex 32` |

### Third-Party Integrations

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `SENDGRID_API_KEY` | SendGrid email service API key | From SendGrid dashboard |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | From Twilio console |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | From Twilio console |
| `TWILIO_PHONE_NUMBER` | Twilio phone number | From Twilio console |
| `STRIPE_SECRET_KEY` | Stripe secret key | From Stripe dashboard |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | From Stripe webhooks dashboard |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON | From Firebase console |

### Notifications

| Secret Name | Description |
|------------|-------------|
| `SLACK_WEBHOOK_URL` | Slack webhook for deployment notifications |
| `PAGERDUTY_ROUTING_KEY` | PagerDuty routing key for alerts |

## Setting Up Secrets

### Using GitHub CLI

```bash
# Azure credentials
gh secret set AZURE_SUBSCRIPTION_ID --body "d8afbfb0-0c60-4d11-a1c7-a614235f5eb6"
gh secret set AZURE_CREDENTIALS --body "$(cat azure-credentials.json)"

# Database
gh secret set POSTGRESQL_ADMIN_PASSWORD --body "your-secure-password"

# JWT
gh secret set JWT_SECRET --body "$(openssl rand -base64 64)"
gh secret set JWT_REFRESH_SECRET --body "$(openssl rand -base64 64)"

# Encryption
gh secret set ENCRYPTION_KEY --body "$(openssl rand -hex 32)"
```

### Using GitHub Web UI

1. Go to your repository on GitHub
2. Click **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add each secret from the tables above

## Environment-Specific Secrets

Create these secrets for each environment (staging, production):

### Staging Environment
- `STAGING_DATABASE_URL`
- `STAGING_REDIS_URL`

### Production Environment
- `PROD_DATABASE_URL`
- `PROD_REDIS_URL`

## Creating Azure Service Principal

Run this command to create a service principal with the correct permissions:

```bash
az ad sp create-for-rbac \
  --name "github-actions-unified-health" \
  --role contributor \
  --scopes /subscriptions/d8afbfb0-0c60-4d11-a1c7-a614235f5eb6 \
  --sdk-auth
```

Save the output JSON and use it as the `AZURE_CREDENTIALS` secret.

## Verifying Secrets

After setting up secrets, run a test workflow to verify they're working:

```bash
gh workflow run ci.yml
```

Check the workflow run logs for any authentication errors.

# GitHub Secrets Setup Guide

This document lists all the secrets that need to be configured in your GitHub repository for the CI/CD pipelines to work properly.

## Required Secrets

### AWS Authentication

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `AWS_ACCESS_KEY_ID` | AWS access key ID | From IAM user creation or `aws iam create-access-key` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key | From IAM user creation output |
| `AWS_REGION` | AWS region for deployment | e.g., `us-east-1` |
| `AWS_ACCOUNT_ID` | AWS account ID | `aws sts get-caller-identity --query Account --output text` |

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
# AWS credentials
gh secret set AWS_ACCESS_KEY_ID --body "your-access-key-id"
gh secret set AWS_SECRET_ACCESS_KEY --body "your-secret-access-key"
gh secret set AWS_REGION --body "us-east-1"
gh secret set AWS_ACCOUNT_ID --body "$(aws sts get-caller-identity --query Account --output text)"

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

## Creating AWS IAM User for GitHub Actions

Run these commands to create an IAM user with the correct permissions:

```bash
# Create IAM user
aws iam create-user --user-name github-actions-unified-health

# Attach required policies
aws iam attach-user-policy \
  --user-name github-actions-unified-health \
  --policy-arn arn:aws:iam::aws:policy/AmazonEKSClusterPolicy

aws iam attach-user-policy \
  --user-name github-actions-unified-health \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess

# Create access key
aws iam create-access-key --user-name github-actions-unified-health
```

Save the output access key ID and secret and use them as `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` secrets.

## Verifying Secrets

After setting up secrets, run a test workflow to verify they're working:

```bash
gh workflow run ci.yml
```

Check the workflow run logs for any authentication errors.

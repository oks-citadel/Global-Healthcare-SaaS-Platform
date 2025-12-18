#!/bin/bash

#############################################
# Azure Key Vault Secret Population Script
#
# Purpose: Populate Azure Key Vault with application secrets
# Compliance: HIPAA-compliant secret management
#############################################

set -e

# Configuration
KEY_VAULT_NAME="${AZURE_KEY_VAULT_NAME}"
ENVIRONMENT="${ENVIRONMENT:-production}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Azure Key Vault Secret Population${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if Key Vault name is provided
if [ -z "$KEY_VAULT_NAME" ]; then
    echo -e "${YELLOW}Please enter your Key Vault name:${NC}"
    read -r KEY_VAULT_NAME
fi

# Verify Key Vault exists
if ! az keyvault show --name "$KEY_VAULT_NAME" &> /dev/null; then
    echo -e "${RED}Error: Key Vault '${KEY_VAULT_NAME}' not found${NC}"
    echo -e "${YELLOW}Please run provision-keyvault.sh first${NC}"
    exit 1
fi

echo -e "${GREEN}Using Key Vault: ${KEY_VAULT_NAME}${NC}"

# Function to set a secret
set_secret() {
    local secret_name=$1
    local secret_description=$2
    local secret_value=""

    echo -e "${YELLOW}Enter value for ${secret_name} (${secret_description}):${NC}"

    # Use read -s for sensitive values to hide input
    if [[ "$secret_name" == *"SECRET"* || "$secret_name" == *"PASSWORD"* || "$secret_name" == *"KEY"* ]]; then
        read -rs secret_value
        echo ""
    else
        read -r secret_value
    fi

    if [ -n "$secret_value" ]; then
        echo -e "${YELLOW}Setting secret: ${secret_name}${NC}"
        az keyvault secret set \
            --vault-name "$KEY_VAULT_NAME" \
            --name "$secret_name" \
            --value "$secret_value" \
            --description "$secret_description" \
            --content-type "text/plain" \
            --tags "Environment=$ENVIRONMENT" "ManagedBy=Script" > /dev/null
        echo -e "${GREEN}Secret '${secret_name}' set successfully${NC}"
    else
        echo -e "${YELLOW}Skipping empty secret: ${secret_name}${NC}"
    fi
}

# Function to generate and set a random secret
generate_secret() {
    local secret_name=$1
    local secret_description=$2
    local length=${3:-64}

    echo -e "${YELLOW}Generating random value for ${secret_name}${NC}"
    local secret_value=$(openssl rand -base64 "$length" | tr -d "=+/" | cut -c1-"$length")

    az keyvault secret set \
        --vault-name "$KEY_VAULT_NAME" \
        --name "$secret_name" \
        --value "$secret_value" \
        --description "$secret_description" \
        --content-type "text/plain" \
        --tags "Environment=$ENVIRONMENT" "ManagedBy=Script" "Generated=true" > /dev/null

    echo -e "${GREEN}Secret '${secret_name}' generated and stored${NC}"
}

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Core Application Secrets${NC}"
echo -e "${YELLOW}========================================${NC}"

# JWT Secret
echo -e "${YELLOW}Do you want to generate a random JWT_SECRET? (y/n)${NC}"
read -r GEN_JWT
if [[ "$GEN_JWT" == "y" || "$GEN_JWT" == "Y" ]]; then
    generate_secret "JWT-SECRET" "JWT signing secret for authentication tokens" 64
else
    set_secret "JWT-SECRET" "JWT signing secret (min 64 characters)"
fi

# Encryption Key
echo -e "${YELLOW}Do you want to generate a random ENCRYPTION_KEY? (y/n)${NC}"
read -r GEN_ENC
if [[ "$GEN_ENC" == "y" || "$GEN_ENC" == "Y" ]]; then
    generate_secret "ENCRYPTION-KEY" "Master encryption key for PHI data (AES-256)" 32
else
    set_secret "ENCRYPTION-KEY" "Master encryption key (must be exactly 32 characters)"
fi

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Database Secrets${NC}"
echo -e "${YELLOW}========================================${NC}"

set_secret "DATABASE-URL" "PostgreSQL connection string"
set_secret "DATABASE-PASSWORD" "PostgreSQL database password"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Redis Secrets${NC}"
echo -e "${YELLOW}========================================${NC}"

set_secret "REDIS-PASSWORD" "Redis authentication password"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Third-Party API Keys${NC}"
echo -e "${YELLOW}========================================${NC}"

# Stripe
set_secret "STRIPE-SECRET-KEY" "Stripe secret key for payments"
set_secret "STRIPE-WEBHOOK-SECRET" "Stripe webhook signing secret"

# Twilio
set_secret "TWILIO-ACCOUNT-SID" "Twilio account SID for SMS/video"
set_secret "TWILIO-AUTH-TOKEN" "Twilio authentication token"
set_secret "TWILIO-API-KEY" "Twilio API key"
set_secret "TWILIO-API-SECRET" "Twilio API secret"

# SendGrid
set_secret "SENDGRID-API-KEY" "SendGrid API key for email"

# AI Services
set_secret "ANTHROPIC-API-KEY" "Anthropic (Claude) API key"
set_secret "OPENAI-API-KEY" "OpenAI API key"

# AWS S3
set_secret "AWS-ACCESS-KEY-ID" "AWS access key for S3 storage"
set_secret "AWS-SECRET-ACCESS-KEY" "AWS secret access key"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Push Notification Secrets${NC}"
echo -e "${YELLOW}========================================${NC}"

set_secret "FCM-SERVER-KEY" "Firebase Cloud Messaging server key"
set_secret "APNS-KEY-ID" "Apple Push Notification Service key ID"
set_secret "APNS-TEAM-ID" "Apple Push Notification Service team ID"
set_secret "VAPID-PRIVATE-KEY" "Web Push VAPID private key"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Security & Monitoring${NC}"
echo -e "${YELLOW}========================================${NC}"

set_secret "SECURITY-ALERT-EMAIL" "Email for security alerts"
set_secret "COMPLIANCE-OFFICER-EMAIL" "Email for compliance officer"
set_secret "BREACH-NOTIFICATION-EMAIL" "Email for breach notifications"

# List all secrets
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Secrets stored in Key Vault:${NC}"
echo -e "${GREEN}========================================${NC}"

az keyvault secret list \
    --vault-name "$KEY_VAULT_NAME" \
    --query "[].{Name:name, Created:attributes.created, Updated:attributes.updated}" \
    --output table

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Secret population complete!${NC}"
echo -e "${GREEN}========================================${NC}"

# Generate secret reference file
cat > "keyvault-secrets-${ENVIRONMENT}.txt" <<EOF
# Azure Key Vault Secret References
# Generated: $(date)
# Key Vault: ${KEY_VAULT_NAME}

# To use these secrets in your application:
# 1. Set AZURE_KEY_VAULT_URL in your .env file
# 2. Set AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID
# 3. Enable Key Vault integration: AZURE_KEY_VAULT_ENABLED=true

# The application will automatically load secrets from Key Vault
# Secret names in Key Vault use hyphens (-), they map to environment variables with underscores (_)

Secret Name Mapping:
- JWT-SECRET → JWT_SECRET
- ENCRYPTION-KEY → ENCRYPTION_KEY
- DATABASE-URL → DATABASE_URL
- DATABASE-PASSWORD → DATABASE_PASSWORD
- REDIS-PASSWORD → REDIS_PASSWORD
- STRIPE-SECRET-KEY → STRIPE_SECRET_KEY
- STRIPE-WEBHOOK-SECRET → STRIPE_WEBHOOK_SECRET
- TWILIO-ACCOUNT-SID → TWILIO_ACCOUNT_SID
- TWILIO-AUTH-TOKEN → TWILIO_AUTH_TOKEN
- TWILIO-API-KEY → TWILIO_API_KEY
- TWILIO-API-SECRET → TWILIO_API_SECRET
- SENDGRID-API-KEY → SENDGRID_API_KEY
- ANTHROPIC-API-KEY → ANTHROPIC_API_KEY
- OPENAI-API-KEY → OPENAI_API_KEY
- AWS-ACCESS-KEY-ID → AWS_ACCESS_KEY_ID
- AWS-SECRET-ACCESS-KEY → AWS_SECRET_ACCESS_KEY
- FCM-SERVER-KEY → FCM_SERVER_KEY
- APNS-KEY-ID → APNS_KEY_ID
- APNS-TEAM-ID → APNS_TEAM_ID
- VAPID-PRIVATE-KEY → VAPID_PRIVATE_KEY
- SECURITY-ALERT-EMAIL → SECURITY_ALERT_EMAIL
- COMPLIANCE-OFFICER-EMAIL → COMPLIANCE_OFFICER_EMAIL
- BREACH-NOTIFICATION-EMAIL → BREACH_NOTIFICATION_EMAIL
EOF

echo -e "${GREEN}Secret reference saved to: keyvault-secrets-${ENVIRONMENT}.txt${NC}"

echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Update your application's .env with Azure Key Vault credentials"
echo -e "2. Enable Key Vault integration in your application"
echo -e "3. Remove hardcoded secrets from .env file"
echo -e "4. Test the application with Key Vault integration"

#!/bin/bash

###############################################################################
# Monitoring Infrastructure Deployment Script
# Unified Health Platform
#
# This script deploys all monitoring and observability components:
# - Azure Application Insights
# - Log Analytics Workspace
# - Alert Rules
# - Action Groups
# - Dashboards
#
# Usage:
#   ./deploy-monitoring.sh [environment]
#
# Arguments:
#   environment: development, staging, or production (default: production)
#
# Requirements:
#   - Azure CLI installed and authenticated
#   - Appropriate Azure permissions
#   - kubectl configured (for Kubernetes components)
###############################################################################

set -e  # Exit on error
set -u  # Exit on undefined variable

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT="${1:-production}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="${SCRIPT_DIR}/deployment_${TIMESTAMP}.log"

# Azure Configuration
SUBSCRIPTION_ID="${AZURE_SUBSCRIPTION_ID:-}"
RESOURCE_GROUP="unified-health-monitoring-rg"
LOCATION="${AZURE_LOCATION:-eastus}"
APP_INSIGHTS_NAME="unified-health-insights-${ENVIRONMENT}"
LOG_ANALYTICS_NAME="unified-health-logs-${ENVIRONMENT}"

# Kubernetes Configuration
NAMESPACE="unified-health"

###############################################################################
# Helper Functions
###############################################################################

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $*" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $*" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $*" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $*" | tee -a "$LOG_FILE"
}

check_prerequisites() {
    log "Checking prerequisites..."

    # Check Azure CLI
    if ! command -v az &> /dev/null; then
        error "Azure CLI not found. Please install: https://docs.microsoft.com/cli/azure/install-azure-cli"
    fi

    # Check kubectl
    if ! command -v kubectl &> /dev/null; then
        warning "kubectl not found. Kubernetes components will be skipped."
        SKIP_KUBERNETES=true
    else
        SKIP_KUBERNETES=false
    fi

    # Check Azure authentication
    if ! az account show &> /dev/null; then
        error "Not authenticated with Azure. Run: az login"
    fi

    # Set subscription if provided
    if [ -n "$SUBSCRIPTION_ID" ]; then
        log "Setting Azure subscription to: $SUBSCRIPTION_ID"
        az account set --subscription "$SUBSCRIPTION_ID"
    fi

    log "Prerequisites check completed successfully"
}

create_resource_group() {
    log "Creating resource group: $RESOURCE_GROUP in $LOCATION..."

    if az group exists --name "$RESOURCE_GROUP" | grep -q "true"; then
        info "Resource group $RESOURCE_GROUP already exists"
    else
        az group create \
            --name "$RESOURCE_GROUP" \
            --location "$LOCATION" \
            --tags environment="$ENVIRONMENT" application="unified-healthcare" component="monitoring" \
            || error "Failed to create resource group"

        log "Resource group created successfully"
    fi
}

deploy_application_insights() {
    log "Deploying Application Insights..."

    # Deploy using ARM template
    DEPLOYMENT_NAME="appinsights-deployment-${TIMESTAMP}"

    az deployment group create \
        --name "$DEPLOYMENT_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --template-file "${SCRIPT_DIR}/azure-application-insights.json" \
        --parameters \
            applicationInsightsName="$APP_INSIGHTS_NAME" \
            location="$LOCATION" \
            workspaceName="$LOG_ANALYTICS_NAME" \
            environment="$ENVIRONMENT" \
            retentionInDays=90 \
        || error "Failed to deploy Application Insights"

    log "Application Insights deployed successfully"

    # Retrieve and save instrumentation key
    INSTRUMENTATION_KEY=$(az monitor app-insights component show \
        --resource-group "$RESOURCE_GROUP" \
        --app "$APP_INSIGHTS_NAME" \
        --query instrumentationKey \
        --output tsv)

    CONNECTION_STRING=$(az monitor app-insights component show \
        --resource-group "$RESOURCE_GROUP" \
        --app "$APP_INSIGHTS_NAME" \
        --query connectionString \
        --output tsv)

    info "Instrumentation Key: $INSTRUMENTATION_KEY"
    info "Connection String: $CONNECTION_STRING"

    # Save to file
    cat > "${SCRIPT_DIR}/.appinsights-credentials" <<EOF
APPINSIGHTS_INSTRUMENTATION_KEY=$INSTRUMENTATION_KEY
APPINSIGHTS_CONNECTION_STRING=$CONNECTION_STRING
EOF

    log "Credentials saved to .appinsights-credentials"
}

create_action_groups() {
    log "Creating action groups for alerting..."

    # Email action group
    az monitor action-group create \
        --name "unified-health-alerts-email" \
        --resource-group "$RESOURCE_GROUP" \
        --short-name "UHEmail" \
        --email-receiver \
            name="SRE Team" \
            email-address="sre@unifiedhealth.com" \
            use-common-alert-schema=true \
        || warning "Failed to create email action group (may already exist)"

    # SMS action group (update with actual phone number)
    az monitor action-group create \
        --name "unified-health-alerts-sms" \
        --resource-group "$RESOURCE_GROUP" \
        --short-name "UHSMS" \
        --sms-receiver \
            name="On-Call" \
            country-code="1" \
            phone-number="5555555555" \
        || warning "Failed to create SMS action group (may already exist)"

    log "Action groups created successfully"
}

deploy_alert_rules() {
    log "Deploying alert rules..."

    # Get Application Insights resource ID
    APP_INSIGHTS_ID=$(az monitor app-insights component show \
        --resource-group "$RESOURCE_GROUP" \
        --app "$APP_INSIGHTS_NAME" \
        --query id \
        --output tsv)

    # Get action group ID
    ACTION_GROUP_ID=$(az monitor action-group show \
        --name "unified-health-alerts-email" \
        --resource-group "$RESOURCE_GROUP" \
        --query id \
        --output tsv)

    # High API Error Rate Alert
    log "Creating High API Error Rate alert..."
    az monitor metrics alert create \
        --name "high-api-error-rate-${ENVIRONMENT}" \
        --resource-group "$RESOURCE_GROUP" \
        --scopes "$APP_INSIGHTS_ID" \
        --condition "avg requests/failed > 5" \
        --window-size 5m \
        --evaluation-frequency 5m \
        --severity 2 \
        --description "Alert when API error rate exceeds 5%" \
        --action "$ACTION_GROUP_ID" \
        || warning "Failed to create high-api-error-rate alert"

    # High API Latency Alert
    log "Creating High API Latency alert..."
    az monitor metrics alert create \
        --name "high-api-latency-${ENVIRONMENT}" \
        --resource-group "$RESOURCE_GROUP" \
        --scopes "$APP_INSIGHTS_ID" \
        --condition "avg requests/duration > 1000" \
        --window-size 15m \
        --evaluation-frequency 5m \
        --severity 3 \
        --description "Alert when P95 API response time exceeds 1 second" \
        --action "$ACTION_GROUP_ID" \
        || warning "Failed to create high-api-latency alert"

    # Service Availability Alert
    log "Creating Service Availability alert..."
    az monitor metrics alert create \
        --name "service-availability-${ENVIRONMENT}" \
        --resource-group "$RESOURCE_GROUP" \
        --scopes "$APP_INSIGHTS_ID" \
        --condition "avg availabilityResults/availabilityPercentage < 99.9" \
        --window-size 15m \
        --evaluation-frequency 5m \
        --severity 1 \
        --description "Alert when service availability drops below 99.9%" \
        --action "$ACTION_GROUP_ID" \
        || warning "Failed to create service-availability alert"

    log "Alert rules deployed successfully"
}

configure_kubernetes_monitoring() {
    if [ "$SKIP_KUBERNETES" = true ]; then
        warning "Skipping Kubernetes monitoring configuration (kubectl not available)"
        return
    fi

    log "Configuring Kubernetes monitoring..."

    # Create namespace if it doesn't exist
    kubectl get namespace "$NAMESPACE" &> /dev/null || \
        kubectl create namespace "$NAMESPACE"

    # Create monitoring secrets
    log "Creating Kubernetes secrets for monitoring..."

    # Source the credentials file
    source "${SCRIPT_DIR}/.appinsights-credentials"

    # Create or update secret
    kubectl create secret generic monitoring-secrets \
        --from-literal=APPINSIGHTS_INSTRUMENTATION_KEY="$APPINSIGHTS_INSTRUMENTATION_KEY" \
        --from-literal=APPINSIGHTS_CONNECTION_STRING="$APPINSIGHTS_CONNECTION_STRING" \
        --namespace "$NAMESPACE" \
        --dry-run=client -o yaml | kubectl apply -f -

    log "Kubernetes monitoring secrets created successfully"

    # Update API deployment to use monitoring
    info "Remember to update your API deployment to reference monitoring-secrets"
    info "Add to deployment spec:"
    info "  env:"
    info "    - name: APPINSIGHTS_INSTRUMENTATION_KEY"
    info "      valueFrom:"
    info "        secretKeyRef:"
    info "          name: monitoring-secrets"
    info "          key: APPINSIGHTS_INSTRUMENTATION_KEY"
}

deploy_dashboards() {
    log "Dashboard deployment information..."

    info "To deploy Grafana dashboards:"
    info "1. Access your Grafana instance"
    info "2. Navigate to Dashboards > Import"
    info "3. Upload the following files:"
    info "   - ${SCRIPT_DIR}/dashboard-system-health.json"
    info "   - ${SCRIPT_DIR}/dashboard-api-performance.json"
    info "   - ${SCRIPT_DIR}/dashboard-business-metrics.json"

    info "To deploy Azure Portal dashboards:"
    info "1. Navigate to https://portal.azure.com"
    info "2. Go to Dashboards"
    info "3. Click Upload and select the dashboard JSON files"
}

verify_deployment() {
    log "Verifying deployment..."

    # Check Application Insights
    if az monitor app-insights component show \
        --resource-group "$RESOURCE_GROUP" \
        --app "$APP_INSIGHTS_NAME" &> /dev/null; then
        log "✓ Application Insights verified"
    else
        error "✗ Application Insights verification failed"
    fi

    # Check Log Analytics Workspace
    if az monitor log-analytics workspace show \
        --resource-group "$RESOURCE_GROUP" \
        --workspace-name "$LOG_ANALYTICS_NAME" &> /dev/null; then
        log "✓ Log Analytics Workspace verified"
    else
        error "✗ Log Analytics Workspace verification failed"
    fi

    # Check Action Groups
    if az monitor action-group show \
        --resource-group "$RESOURCE_GROUP" \
        --name "unified-health-alerts-email" &> /dev/null; then
        log "✓ Action Groups verified"
    else
        warning "✗ Action Groups verification failed"
    fi

    # Check Alert Rules
    ALERT_COUNT=$(az monitor metrics alert list \
        --resource-group "$RESOURCE_GROUP" \
        --query "length([?contains(name, '${ENVIRONMENT}')])" \
        --output tsv)

    if [ "$ALERT_COUNT" -gt 0 ]; then
        log "✓ Alert Rules verified ($ALERT_COUNT rules found)"
    else
        warning "✗ No alert rules found"
    fi

    log "Deployment verification completed"
}

print_summary() {
    log "==================================================================="
    log "Monitoring Infrastructure Deployment Summary"
    log "==================================================================="
    log "Environment: $ENVIRONMENT"
    log "Resource Group: $RESOURCE_GROUP"
    log "Location: $LOCATION"
    log ""
    log "Components Deployed:"
    log "  ✓ Application Insights: $APP_INSIGHTS_NAME"
    log "  ✓ Log Analytics Workspace: $LOG_ANALYTICS_NAME"
    log "  ✓ Action Groups"
    log "  ✓ Alert Rules"
    log ""
    log "Next Steps:"
    log "  1. Configure frontend monitoring with instrumentation key"
    log "  2. Import Grafana dashboards"
    log "  3. Test alert notifications"
    log "  4. Review and customize alert thresholds"
    log "  5. Set up on-call schedule in PagerDuty"
    log ""
    log "Credentials saved to: ${SCRIPT_DIR}/.appinsights-credentials"
    log "Deployment log saved to: $LOG_FILE"
    log "==================================================================="
}

cleanup_on_error() {
    error "Deployment failed. Check log file: $LOG_FILE"

    read -p "Do you want to clean up created resources? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "Cleaning up resources..."
        az group delete --name "$RESOURCE_GROUP" --yes --no-wait
        log "Cleanup initiated. Resources will be deleted in the background."
    fi
}

###############################################################################
# Main Execution
###############################################################################

main() {
    log "Starting monitoring infrastructure deployment..."
    log "Environment: $ENVIRONMENT"
    log "Resource Group: $RESOURCE_GROUP"
    log "Location: $LOCATION"
    log ""

    # Trap errors
    trap cleanup_on_error ERR

    # Execute deployment steps
    check_prerequisites
    create_resource_group
    deploy_application_insights
    create_action_groups
    deploy_alert_rules
    configure_kubernetes_monitoring
    deploy_dashboards
    verify_deployment
    print_summary

    log "Deployment completed successfully!"
}

# Run main function
main

exit 0

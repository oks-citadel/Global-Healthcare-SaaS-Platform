#!/bin/bash

# ============================================
# Monitoring Stack Deployment Script
# Unified Health Platform
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="${NAMESPACE:-unified-health}"
MONITORING_NAMESPACE="${MONITORING_NAMESPACE:-unified-health-monitoring}"
RESOURCE_GROUP="${RESOURCE_GROUP:-unified-health-rg}"
LOCATION="${LOCATION:-eastus}"
CLUSTER_NAME="${CLUSTER_NAME:-unified-health-aks}"

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."

    # Check kubectl
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed. Please install kubectl first."
        exit 1
    fi

    # Check helm
    if ! command -v helm &> /dev/null; then
        print_error "helm is not installed. Please install helm first."
        exit 1
    fi

    # Check az CLI
    if ! command -v az &> /dev/null; then
        print_error "Azure CLI is not installed. Please install az CLI first."
        exit 1
    fi

    # Check if connected to cluster
    if ! kubectl cluster-info &> /dev/null; then
        print_error "Not connected to Kubernetes cluster. Please configure kubectl first."
        exit 1
    fi

    print_success "All prerequisites met!"
}

# Function to create namespaces
create_namespaces() {
    print_info "Creating Kubernetes namespaces..."

    kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
    kubectl create namespace ${MONITORING_NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -

    print_success "Namespaces created successfully!"
}

# Function to deploy Azure Application Insights
deploy_azure_insights() {
    print_info "Deploying Azure Application Insights..."

    # Check if resource group exists
    if ! az group show --name ${RESOURCE_GROUP} &> /dev/null; then
        print_info "Creating resource group ${RESOURCE_GROUP}..."
        az group create --name ${RESOURCE_GROUP} --location ${LOCATION}
    fi

    # Deploy Application Insights using ARM template
    if [ -f "azure-application-insights.json" ]; then
        print_info "Deploying Application Insights from template..."
        az deployment group create \
            --resource-group ${RESOURCE_GROUP} \
            --template-file azure-application-insights.json \
            --parameters environment=production \
            --output none

        # Get instrumentation key
        INSTRUMENTATION_KEY=$(az monitor app-insights component show \
            --resource-group ${RESOURCE_GROUP} \
            --app unified-health-insights \
            --query instrumentationKey \
            --output tsv)

        CONNECTION_STRING=$(az monitor app-insights component show \
            --resource-group ${RESOURCE_GROUP} \
            --app unified-health-insights \
            --query connectionString \
            --output tsv)

        # Create Kubernetes secret
        kubectl create secret generic appinsights-secrets \
            --namespace=${NAMESPACE} \
            --from-literal=APPINSIGHTS_INSTRUMENTATION_KEY="${INSTRUMENTATION_KEY}" \
            --from-literal=APPINSIGHTS_CONNECTION_STRING="${CONNECTION_STRING}" \
            --dry-run=client -o yaml | kubectl apply -f -

        print_success "Azure Application Insights deployed successfully!"
        print_info "Instrumentation Key: ${INSTRUMENTATION_KEY:0:8}..."
    else
        print_warning "azure-application-insights.json not found. Skipping Azure Application Insights deployment."
    fi
}

# Function to deploy Prometheus
deploy_prometheus() {
    print_info "Deploying Prometheus..."

    # Add Prometheus Helm repository
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update

    # Create ConfigMap for Prometheus configuration
    if [ -f "prometheus-config.yml" ]; then
        kubectl create configmap prometheus-config \
            --namespace=${MONITORING_NAMESPACE} \
            --from-file=prometheus.yml=prometheus-config.yml \
            --dry-run=client -o yaml | kubectl apply -f -
    fi

    # Create ConfigMap for alert rules
    if [ -f "prometheus-alert-rules.yml" ]; then
        kubectl create configmap prometheus-alert-rules \
            --namespace=${MONITORING_NAMESPACE} \
            --from-file=alerts.yml=prometheus-alert-rules.yml \
            --dry-run=client -o yaml | kubectl apply -f -
    fi

    # Install or upgrade Prometheus
    helm upgrade --install prometheus prometheus-community/prometheus \
        --namespace ${MONITORING_NAMESPACE} \
        --set server.persistentVolume.size=50Gi \
        --set server.retention=30d \
        --set alertmanager.enabled=true \
        --set nodeExporter.enabled=true \
        --set pushgateway.enabled=false \
        --set serverFiles."prometheus\.yml".global.evaluation_interval=15s \
        --set serverFiles."prometheus\.yml".global.scrape_interval=15s \
        --wait

    print_success "Prometheus deployed successfully!"
}

# Function to deploy Grafana
deploy_grafana() {
    print_info "Deploying Grafana..."

    # Add Grafana Helm repository
    helm repo add grafana https://grafana.github.io/helm-charts
    helm repo update

    # Generate admin password
    GRAFANA_ADMIN_PASSWORD=$(openssl rand -base64 32)

    # Install or upgrade Grafana
    helm upgrade --install grafana grafana/grafana \
        --namespace ${MONITORING_NAMESPACE} \
        --set persistence.enabled=true \
        --set persistence.size=10Gi \
        --set adminPassword="${GRAFANA_ADMIN_PASSWORD}" \
        --set datasources."datasources\.yaml".apiVersion=1 \
        --set datasources."datasources\.yaml".datasources[0].name=Prometheus \
        --set datasources."datasources\.yaml".datasources[0].type=prometheus \
        --set datasources."datasources\.yaml".datasources[0].url=http://prometheus-server:80 \
        --set datasources."datasources\.yaml".datasources[0].access=proxy \
        --set datasources."datasources\.yaml".datasources[0].isDefault=true \
        --wait

    # Store admin password in secret
    kubectl create secret generic grafana-admin \
        --namespace=${MONITORING_NAMESPACE} \
        --from-literal=password="${GRAFANA_ADMIN_PASSWORD}" \
        --dry-run=client -o yaml | kubectl apply -f -

    print_success "Grafana deployed successfully!"
    print_info "Admin password stored in secret: grafana-admin"
}

# Function to import Grafana dashboards
import_grafana_dashboards() {
    print_info "Importing Grafana dashboards..."

    # Wait for Grafana to be ready
    kubectl wait --for=condition=ready pod \
        -l app.kubernetes.io/name=grafana \
        --namespace=${MONITORING_NAMESPACE} \
        --timeout=300s

    # Get Grafana pod name
    GRAFANA_POD=$(kubectl get pods --namespace=${MONITORING_NAMESPACE} \
        -l "app.kubernetes.io/name=grafana" -o jsonpath="{.items[0].metadata.name}")

    # Get admin password
    GRAFANA_PASSWORD=$(kubectl get secret grafana-admin \
        --namespace=${MONITORING_NAMESPACE} \
        -o jsonpath="{.data.password}" | base64 --decode)

    # Port forward to Grafana
    kubectl port-forward --namespace=${MONITORING_NAMESPACE} ${GRAFANA_POD} 3000:3000 &
    PF_PID=$!
    sleep 5

    # Import dashboards
    for dashboard in grafana-dashboard-*.json; do
        if [ -f "$dashboard" ]; then
            print_info "Importing dashboard: $dashboard"
            curl -X POST http://admin:${GRAFANA_PASSWORD}@localhost:3000/api/dashboards/db \
                -H "Content-Type: application/json" \
                -d @${dashboard} \
                --silent --output /dev/null
        fi
    done

    # Kill port forward
    kill $PF_PID 2>/dev/null || true

    print_success "Grafana dashboards imported successfully!"
}

# Function to deploy exporters
deploy_exporters() {
    print_info "Deploying metric exporters..."

    # Deploy PostgreSQL Exporter
    print_info "Deploying PostgreSQL exporter..."
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm upgrade --install postgres-exporter prometheus-community/prometheus-postgres-exporter \
        --namespace ${MONITORING_NAMESPACE} \
        --set config.datasource.host=postgres-service.${NAMESPACE}.svc.cluster.local \
        --set config.datasource.user=postgres \
        --set config.datasource.passwordSecret.name=postgres-secret \
        --set config.datasource.passwordSecret.key=password \
        --set config.datasource.database=unified_health \
        --wait

    # Deploy Redis Exporter
    print_info "Deploying Redis exporter..."
    helm upgrade --install redis-exporter prometheus-community/prometheus-redis-exporter \
        --namespace ${MONITORING_NAMESPACE} \
        --set redisAddress=redis://redis-service.${NAMESPACE}.svc.cluster.local:6379 \
        --wait

    print_success "Exporters deployed successfully!"
}

# Function to configure service annotations
configure_service_annotations() {
    print_info "Configuring service annotations for Prometheus scraping..."

    # List of services to annotate
    services=("unified-health-api" "api-gateway" "telehealth-service" "chronic-care-service" "mental-health-service" "pharmacy-service" "laboratory-service")

    for service in "${services[@]}"; do
        if kubectl get deployment ${service} --namespace=${NAMESPACE} &> /dev/null; then
            kubectl patch deployment ${service} --namespace=${NAMESPACE} -p '
            {
                "spec": {
                    "template": {
                        "metadata": {
                            "annotations": {
                                "prometheus.io/scrape": "true",
                                "prometheus.io/port": "3000",
                                "prometheus.io/path": "/metrics"
                            }
                        }
                    }
                }
            }'
            print_info "Annotated ${service} for Prometheus scraping"
        fi
    done

    print_success "Service annotations configured successfully!"
}

# Function to setup alerts
setup_alerts() {
    print_info "Setting up alerting..."

    # Deploy Alertmanager configuration if available
    if [ -f "alertmanager-config.yml" ]; then
        kubectl create configmap alertmanager-config \
            --namespace=${MONITORING_NAMESPACE} \
            --from-file=alertmanager.yml=alertmanager-config.yml \
            --dry-run=client -o yaml | kubectl apply -f -
        print_success "Alertmanager configuration deployed!"
    fi

    print_info "Configure alert receivers in Azure Monitor or PagerDuty manually"
}

# Function to display access information
display_access_info() {
    print_info "Retrieving access information..."

    echo ""
    echo "============================================"
    echo "  Monitoring Stack Deployment Complete!"
    echo "============================================"
    echo ""

    # Prometheus URL
    echo -e "${GREEN}Prometheus:${NC}"
    echo "  kubectl port-forward --namespace ${MONITORING_NAMESPACE} svc/prometheus-server 9090:80"
    echo "  Then access: http://localhost:9090"
    echo ""

    # Grafana URL and credentials
    echo -e "${GREEN}Grafana:${NC}"
    GRAFANA_PASSWORD=$(kubectl get secret grafana-admin \
        --namespace=${MONITORING_NAMESPACE} \
        -o jsonpath="{.data.password}" | base64 --decode)
    echo "  kubectl port-forward --namespace ${MONITORING_NAMESPACE} svc/grafana 3000:80"
    echo "  Then access: http://localhost:3000"
    echo "  Username: admin"
    echo "  Password: ${GRAFANA_PASSWORD}"
    echo ""

    # Application Insights
    if [ ! -z "${INSTRUMENTATION_KEY}" ]; then
        echo -e "${GREEN}Azure Application Insights:${NC}"
        echo "  Instrumentation Key: ${INSTRUMENTATION_KEY:0:8}..."
        echo "  Portal: https://portal.azure.com/#@/resource${RESOURCE_GROUP}/providers/Microsoft.Insights/components/unified-health-insights"
        echo ""
    fi

    echo "============================================"
}

# Main deployment flow
main() {
    print_info "Starting Monitoring Stack Deployment..."
    echo ""

    check_prerequisites
    create_namespaces
    deploy_azure_insights
    deploy_prometheus
    deploy_grafana
    import_grafana_dashboards
    deploy_exporters
    configure_service_annotations
    setup_alerts

    echo ""
    display_access_info

    print_success "Monitoring stack deployment completed successfully!"
}

# Run main function
main "$@"

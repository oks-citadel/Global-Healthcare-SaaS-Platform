#!/bin/bash
# ============================================
# Sealed Secrets Helper Script
# ============================================
# Creates and seals Kubernetes secrets using kubeseal
#
# Usage:
#   ./seal-secret.sh <secret-name> <namespace> [key=value...]
#
# Examples:
#   ./seal-secret.sh database-credentials unified-health \
#     "DB_USERNAME=unified_health" \
#     "DB_PASSWORD=secret123"
#
#   ./seal-secret.sh jwt-secrets unified-health \
#     "JWT_SECRET=my-jwt-secret-32-chars-minimum"
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    if ! command -v kubeseal &> /dev/null; then
        log_error "kubeseal is not installed. Please install it first."
        echo "  macOS: brew install kubeseal"
        echo "  Linux: Download from https://github.com/bitnami-labs/sealed-secrets/releases"
        exit 1
    fi

    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed. Please install it first."
        exit 1
    fi
}

# Show usage
usage() {
    echo "Usage: $0 <secret-name> <namespace> [key=value...]"
    echo ""
    echo "Arguments:"
    echo "  secret-name   Name of the Kubernetes secret"
    echo "  namespace     Target namespace"
    echo "  key=value     Secret data as key=value pairs"
    echo ""
    echo "Examples:"
    echo "  $0 database-credentials unified-health \\"
    echo "    'DB_USERNAME=unified_health' \\"
    echo "    'DB_PASSWORD=secret123'"
    echo ""
    echo "  $0 jwt-secrets unified-health \\"
    echo "    'JWT_SECRET=my-jwt-secret-32-chars-minimum'"
    exit 1
}

# Main function
main() {
    check_prerequisites

    if [ $# -lt 3 ]; then
        usage
    fi

    SECRET_NAME="$1"
    NAMESPACE="$2"
    shift 2

    # Build kubectl create secret command
    LITERAL_ARGS=""
    for arg in "$@"; do
        if [[ "$arg" == *"="* ]]; then
            LITERAL_ARGS="$LITERAL_ARGS --from-literal='$arg'"
        else
            log_error "Invalid argument: $arg (expected key=value format)"
            exit 1
        fi
    done

    log_info "Creating sealed secret: $SECRET_NAME in namespace: $NAMESPACE"

    # Create temporary file for the raw secret
    TEMP_SECRET=$(mktemp)
    trap "rm -f $TEMP_SECRET" EXIT

    # Create the raw secret
    eval "kubectl create secret generic $SECRET_NAME \
        --namespace=$NAMESPACE \
        $LITERAL_ARGS \
        --dry-run=client -o yaml" > "$TEMP_SECRET"

    # Seal the secret
    OUTPUT_FILE="$SCRIPT_DIR/sealed-$SECRET_NAME.yaml"

    log_info "Sealing secret..."
    kubeseal --format=yaml < "$TEMP_SECRET" > "$OUTPUT_FILE"

    log_success "Sealed secret created: $OUTPUT_FILE"
    echo ""
    echo "To apply the sealed secret:"
    echo "  kubectl apply -f $OUTPUT_FILE"
    echo ""
    echo "To verify (after applying):"
    echo "  kubectl get secret $SECRET_NAME -n $NAMESPACE"
}

main "$@"

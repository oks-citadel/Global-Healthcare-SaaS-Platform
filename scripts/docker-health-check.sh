#!/bin/bash

# ============================================
# UnifiedHealth Platform - Docker Health Check Script
# Verifies all services are healthy in CI/CD
# ============================================

set -e  # Exit on error
set -u  # Exit on undefined variable

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
MAX_RETRIES="${MAX_RETRIES:-30}"
RETRY_INTERVAL="${RETRY_INTERVAL:-10}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.yml}"

# Services to check
SERVICES=(
    "api:http://localhost:8080/health"
    "web:http://localhost:3000/api/health"
    "postgres:postgresql"
    "redis:redis"
)

# ============================================
# Helper Functions
# ============================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "\n${BLUE}=======================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}=======================================${NC}\n"
}

# ============================================
# Health Check Functions
# ============================================

check_http_health() {
    local service_name=$1
    local url=$2
    local retry_count=0

    log_info "Checking HTTP health for ${service_name}..."

    while [ $retry_count -lt $MAX_RETRIES ]; do
        if curl -f -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
            log_success "${service_name} is healthy"
            return 0
        else
            retry_count=$((retry_count + 1))
            if [ $retry_count -lt $MAX_RETRIES ]; then
                log_warning "${service_name} not ready yet (attempt ${retry_count}/${MAX_RETRIES}). Retrying in ${RETRY_INTERVAL}s..."
                sleep $RETRY_INTERVAL
            fi
        fi
    done

    log_error "${service_name} failed health check after ${MAX_RETRIES} attempts"
    return 1
}

check_docker_health() {
    local service_name=$1
    local retry_count=0

    log_info "Checking Docker health status for ${service_name}..."

    while [ $retry_count -lt $MAX_RETRIES ]; do
        local health_status=$(docker-compose -f "$COMPOSE_FILE" ps -q "$service_name" 2>/dev/null | xargs docker inspect --format='{{.State.Health.Status}}' 2>/dev/null || echo "unknown")

        if [ "$health_status" = "healthy" ]; then
            log_success "${service_name} is healthy"
            return 0
        elif [ "$health_status" = "unhealthy" ]; then
            log_error "${service_name} is unhealthy"
            return 1
        else
            retry_count=$((retry_count + 1))
            if [ $retry_count -lt $MAX_RETRIES ]; then
                log_warning "${service_name} status: ${health_status} (attempt ${retry_count}/${MAX_RETRIES}). Retrying in ${RETRY_INTERVAL}s..."
                sleep $RETRY_INTERVAL
            fi
        fi
    done

    log_error "${service_name} failed health check after ${MAX_RETRIES} attempts"
    return 1
}

check_postgres_health() {
    local service_name="postgres"
    local retry_count=0

    log_info "Checking PostgreSQL health..."

    while [ $retry_count -lt $MAX_RETRIES ]; do
        if docker-compose -f "$COMPOSE_FILE" exec -T "$service_name" pg_isready -U unified_health > /dev/null 2>&1; then
            log_success "PostgreSQL is healthy"
            return 0
        else
            retry_count=$((retry_count + 1))
            if [ $retry_count -lt $MAX_RETRIES ]; then
                log_warning "PostgreSQL not ready yet (attempt ${retry_count}/${MAX_RETRIES}). Retrying in ${RETRY_INTERVAL}s..."
                sleep $RETRY_INTERVAL
            fi
        fi
    done

    log_error "PostgreSQL failed health check after ${MAX_RETRIES} attempts"
    return 1
}

check_redis_health() {
    local service_name="redis"
    local retry_count=0

    log_info "Checking Redis health..."

    while [ $retry_count -lt $MAX_RETRIES ]; do
        if docker-compose -f "$COMPOSE_FILE" exec -T "$service_name" redis-cli ping > /dev/null 2>&1; then
            log_success "Redis is healthy"
            return 0
        else
            retry_count=$((retry_count + 1))
            if [ $retry_count -lt $MAX_RETRIES ]; then
                log_warning "Redis not ready yet (attempt ${retry_count}/${MAX_RETRIES}). Retrying in ${RETRY_INTERVAL}s..."
                sleep $RETRY_INTERVAL
            fi
        fi
    done

    log_error "Redis failed health check after ${MAX_RETRIES} attempts"
    return 1
}

check_container_running() {
    local service_name=$1

    log_info "Checking if ${service_name} container is running..."

    local container_status=$(docker-compose -f "$COMPOSE_FILE" ps -q "$service_name" 2>/dev/null | xargs docker inspect --format='{{.State.Running}}' 2>/dev/null || echo "false")

    if [ "$container_status" = "true" ]; then
        log_success "${service_name} container is running"
        return 0
    else
        log_error "${service_name} container is not running"
        return 1
    fi
}

show_container_logs() {
    local service_name=$1
    local lines=${2:-50}

    log_info "Last ${lines} lines of ${service_name} logs:"
    echo "----------------------------------------"
    docker-compose -f "$COMPOSE_FILE" logs --tail="$lines" "$service_name" 2>/dev/null || echo "Unable to fetch logs"
    echo "----------------------------------------"
}

# ============================================
# Main Health Check
# ============================================

main() {
    print_header "UnifiedHealth Health Check Script"

    log_info "Configuration:"
    echo "  Max Retries:      ${MAX_RETRIES}"
    echo "  Retry Interval:   ${RETRY_INTERVAL}s"
    echo "  Compose File:     ${COMPOSE_FILE}"
    echo ""

    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi

    # Check if docker-compose file exists
    if [ ! -f "$COMPOSE_FILE" ]; then
        log_error "Docker Compose file '${COMPOSE_FILE}' not found"
        exit 1
    fi

    print_header "Checking Container Status"

    local all_healthy=true

    # Check if containers are running
    for service_name in api web postgres redis; do
        if ! check_container_running "$service_name"; then
            all_healthy=false
            show_container_logs "$service_name" 20
        fi
    done

    print_header "Checking Service Health"

    # Check PostgreSQL health
    if ! check_postgres_health; then
        all_healthy=false
        show_container_logs "postgres" 20
    fi

    # Check Redis health
    if ! check_redis_health; then
        all_healthy=false
        show_container_logs "redis" 20
    fi

    # Check API health
    if ! check_http_health "api" "http://localhost:8080/health"; then
        all_healthy=false
        show_container_logs "api" 50
    fi

    # Check Web health
    if ! check_http_health "web" "http://localhost:3000/api/health"; then
        all_healthy=false
        show_container_logs "web" 50
    fi

    # Summary
    print_header "Health Check Summary"

    if [ "$all_healthy" = true ]; then
        log_success "All services are healthy!"
        echo ""
        echo "Service Status:"
        docker-compose -f "$COMPOSE_FILE" ps
        exit 0
    else
        log_error "Some services are unhealthy"
        echo ""
        echo "Service Status:"
        docker-compose -f "$COMPOSE_FILE" ps
        exit 1
    fi
}

# ============================================
# Script Entry Point
# ============================================

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -f|--file)
            COMPOSE_FILE="$2"
            shift 2
            ;;
        -r|--retries)
            MAX_RETRIES="$2"
            shift 2
            ;;
        -i|--interval)
            RETRY_INTERVAL="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -f, --file FILE       Docker Compose file (default: docker-compose.yml)"
            echo "  -r, --retries NUM     Max retry attempts (default: 30)"
            echo "  -i, --interval SEC    Retry interval in seconds (default: 10)"
            echo "  -h, --help            Show this help message"
            echo ""
            echo "Environment Variables:"
            echo "  MAX_RETRIES           Maximum number of retry attempts"
            echo "  RETRY_INTERVAL        Seconds between retry attempts"
            echo "  COMPOSE_FILE          Docker Compose file to use"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            echo "Use -h or --help for usage information"
            exit 1
            ;;
    esac
done

# Run main function
main "$@"

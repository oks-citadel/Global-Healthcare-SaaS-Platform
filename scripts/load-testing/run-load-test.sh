#!/usr/bin/env bash

#######################################################################
# Load Test Runner Script
# Global Healthcare SaaS Platform
#
# This script provides a convenient wrapper for running k6 load tests
# with proper configuration and result handling.
#
# Usage:
#   ./run-load-test.sh <test-type> <scenario> [options]
#
# Examples:
#   ./run-load-test.sh smoke api-health
#   ./run-load-test.sh load auth-flow
#   ./run-load-test.sh stress api-endpoints
#   ./run-load-test.sh load all
#   ./run-load-test.sh load api-health --url http://staging.example.com
#
#######################################################################

set -euo pipefail

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCENARIOS_DIR="${SCRIPT_DIR}/scenarios"
RESULTS_DIR="${SCRIPT_DIR}/results"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
TEST_TYPE="${1:-load}"
SCENARIO="${2:-api-health}"
BASE_URL="${K6_BASE_URL:-http://localhost:3000}"
API_URL="${K6_API_URL:-http://localhost:4000/api/v1}"
AUTH_URL="${K6_AUTH_URL:-http://localhost:4001/auth}"
ENVIRONMENT="${K6_ENVIRONMENT:-local}"

# Available scenarios
AVAILABLE_SCENARIOS=("api-health" "auth-flow" "api-endpoints")

# Available test types
AVAILABLE_TYPES=("smoke" "load" "stress" "spike" "soak")

#######################################################################
# Helper Functions
#######################################################################

print_banner() {
    echo ""
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}  Global Healthcare SaaS Platform - Load Testing${NC}"
    echo -e "${BLUE}============================================================${NC}"
    echo ""
}

print_usage() {
    echo "Usage: $0 <test-type> <scenario> [options]"
    echo ""
    echo "Test Types:"
    echo "  smoke    - Minimal load, verify system works (5 VUs, 2 min)"
    echo "  load     - Typical expected load (50-100 VUs, 5 min)"
    echo "  stress   - Push beyond normal capacity (100-200 VUs, 10 min)"
    echo "  spike    - Sudden traffic spike (10-500 VUs, 3 min)"
    echo "  soak     - Sustained load over time (100 VUs, 30 min)"
    echo ""
    echo "Scenarios:"
    echo "  api-health     - Health check endpoints"
    echo "  auth-flow      - Authentication flow"
    echo "  api-endpoints  - Main API endpoints"
    echo "  all            - Run all scenarios"
    echo ""
    echo "Options:"
    echo "  --url <url>        Base URL for testing"
    echo "  --api-url <url>    API gateway URL"
    echo "  --auth-url <url>   Auth service URL"
    echo "  --env <name>       Environment name (local, staging, production)"
    echo "  --verbose          Enable verbose output"
    echo "  --json             Output results to JSON"
    echo "  --help             Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  K6_BASE_URL        Base URL (default: http://localhost:3000)"
    echo "  K6_API_URL         API URL (default: http://localhost:4000/api/v1)"
    echo "  K6_AUTH_URL        Auth URL (default: http://localhost:4001/auth)"
    echo "  K6_TEST_USER       Test user email"
    echo "  K6_TEST_PASSWORD   Test user password"
    echo ""
    echo "Examples:"
    echo "  $0 smoke api-health"
    echo "  $0 load auth-flow --url http://staging.example.com"
    echo "  $0 stress api-endpoints --verbose"
    echo "  $0 load all"
    echo ""
}

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

check_k6_installed() {
    if ! command -v k6 &> /dev/null; then
        log_error "k6 is not installed!"
        echo ""
        echo "Please install k6 using one of these methods:"
        echo ""
        echo "  macOS:   brew install k6"
        echo "  Windows: choco install k6"
        echo "  Linux:   sudo apt-get install k6"
        echo "  Docker:  docker pull grafana/k6"
        echo ""
        echo "See README.md for detailed installation instructions."
        exit 1
    fi

    K6_VERSION=$(k6 version 2>&1 | head -n1)
    log_info "Using $K6_VERSION"
}

validate_test_type() {
    local type="$1"
    for valid_type in "${AVAILABLE_TYPES[@]}"; do
        if [[ "$type" == "$valid_type" ]]; then
            return 0
        fi
    done
    log_error "Invalid test type: $type"
    echo "Valid types: ${AVAILABLE_TYPES[*]}"
    exit 1
}

validate_scenario() {
    local scenario="$1"
    if [[ "$scenario" == "all" ]]; then
        return 0
    fi
    for valid_scenario in "${AVAILABLE_SCENARIOS[@]}"; do
        if [[ "$scenario" == "$valid_scenario" ]]; then
            return 0
        fi
    done
    log_error "Invalid scenario: $scenario"
    echo "Valid scenarios: ${AVAILABLE_SCENARIOS[*]} all"
    exit 1
}

create_results_dir() {
    if [[ ! -d "$RESULTS_DIR" ]]; then
        mkdir -p "$RESULTS_DIR"
        log_info "Created results directory: $RESULTS_DIR"
    fi
}

#######################################################################
# Main Functions
#######################################################################

run_scenario() {
    local scenario="$1"
    local test_type="$2"
    local scenario_file="${SCENARIOS_DIR}/${scenario}.js"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local result_file="${RESULTS_DIR}/${scenario}-${test_type}-${timestamp}.json"

    if [[ ! -f "$scenario_file" ]]; then
        log_error "Scenario file not found: $scenario_file"
        return 1
    fi

    echo ""
    log_info "Running scenario: $scenario ($test_type)"
    log_info "Target: $BASE_URL"
    echo ""

    # Build k6 command
    local k6_cmd="k6 run"

    # Add output if JSON requested
    if [[ "${OUTPUT_JSON:-false}" == "true" ]]; then
        k6_cmd="$k6_cmd --out json=$result_file"
    fi

    # Add verbose flag
    if [[ "${VERBOSE:-false}" == "true" ]]; then
        k6_cmd="$k6_cmd --verbose"
    fi

    # Run k6 with environment variables
    K6_BASE_URL="$BASE_URL" \
    K6_API_URL="$API_URL" \
    K6_AUTH_URL="$AUTH_URL" \
    K6_ENVIRONMENT="$ENVIRONMENT" \
    K6_STAGES="$test_type" \
    K6_VERBOSE="${VERBOSE:-false}" \
    $k6_cmd "$scenario_file"

    local exit_code=$?

    if [[ $exit_code -eq 0 ]]; then
        log_success "Scenario $scenario completed successfully"
    else
        log_error "Scenario $scenario failed with exit code $exit_code"
    fi

    return $exit_code
}

run_all_scenarios() {
    local test_type="$1"
    local failed=0

    for scenario in "${AVAILABLE_SCENARIOS[@]}"; do
        echo ""
        echo -e "${BLUE}============================================================${NC}"
        echo -e "${BLUE}  Running: $scenario${NC}"
        echo -e "${BLUE}============================================================${NC}"

        if ! run_scenario "$scenario" "$test_type"; then
            ((failed++))
        fi

        # Small delay between scenarios
        if [[ "$scenario" != "${AVAILABLE_SCENARIOS[-1]}" ]]; then
            log_info "Waiting 10 seconds before next scenario..."
            sleep 10
        fi
    done

    echo ""
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}  All Scenarios Complete${NC}"
    echo -e "${BLUE}============================================================${NC}"
    echo ""

    if [[ $failed -gt 0 ]]; then
        log_warning "$failed scenario(s) failed"
        return 1
    else
        log_success "All scenarios passed"
        return 0
    fi
}

parse_args() {
    # Skip first two positional args (test-type and scenario)
    shift 2 || true

    while [[ $# -gt 0 ]]; do
        case "$1" in
            --url)
                BASE_URL="$2"
                shift 2
                ;;
            --api-url)
                API_URL="$2"
                shift 2
                ;;
            --auth-url)
                AUTH_URL="$2"
                shift 2
                ;;
            --env)
                ENVIRONMENT="$2"
                shift 2
                ;;
            --verbose)
                VERBOSE="true"
                shift
                ;;
            --json)
                OUTPUT_JSON="true"
                shift
                ;;
            --help|-h)
                print_usage
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                print_usage
                exit 1
                ;;
        esac
    done
}

#######################################################################
# Main Execution
#######################################################################

main() {
    print_banner

    # Check for help flag first
    if [[ "${1:-}" == "--help" ]] || [[ "${1:-}" == "-h" ]]; then
        print_usage
        exit 0
    fi

    # Validate arguments
    if [[ $# -lt 2 ]]; then
        log_error "Missing required arguments"
        print_usage
        exit 1
    fi

    TEST_TYPE="$1"
    SCENARIO="$2"

    # Parse additional arguments
    parse_args "$@"

    # Validate inputs
    validate_test_type "$TEST_TYPE"
    validate_scenario "$SCENARIO"

    # Check prerequisites
    check_k6_installed
    create_results_dir

    # Print configuration
    echo ""
    log_info "Configuration:"
    echo "  Test Type:   $TEST_TYPE"
    echo "  Scenario:    $SCENARIO"
    echo "  Base URL:    $BASE_URL"
    echo "  API URL:     $API_URL"
    echo "  Auth URL:    $AUTH_URL"
    echo "  Environment: $ENVIRONMENT"
    echo ""

    # Run tests
    local start_time=$(date +%s)
    local exit_code=0

    if [[ "$SCENARIO" == "all" ]]; then
        if ! run_all_scenarios "$TEST_TYPE"; then
            exit_code=1
        fi
    else
        if ! run_scenario "$SCENARIO" "$TEST_TYPE"; then
            exit_code=1
        fi
    fi

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    echo ""
    log_info "Total execution time: ${duration}s"
    echo ""

    exit $exit_code
}

# Run main function
main "$@"

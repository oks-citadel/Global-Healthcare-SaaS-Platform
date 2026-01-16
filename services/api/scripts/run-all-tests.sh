#!/bin/bash

###############################################################################
# Unified Healthcare Platform - Complete Test Suite Runner
# Runs all API tests including integration tests, load tests, and validation
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results tracking
TOTAL_SUITES=0
PASSED_SUITES=0
FAILED_SUITES=0

# Functions
print_header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}   $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

run_test_suite() {
    local suite_name=$1
    local command=$2

    TOTAL_SUITES=$((TOTAL_SUITES + 1))

    print_header "$suite_name"

    if eval "$command"; then
        print_success "$suite_name passed"
        PASSED_SUITES=$((PASSED_SUITES + 1))
        return 0
    else
        print_error "$suite_name failed"
        FAILED_SUITES=$((FAILED_SUITES + 1))
        return 1
    fi
}

# Parse command line arguments
RUN_INTEGRATION=${RUN_INTEGRATION:-true}
RUN_LOAD=${RUN_LOAD:-false}
RUN_VALIDATION=${RUN_VALIDATION:-true}
SKIP_INSTALL=${SKIP_INSTALL:-false}

while [[ $# -gt 0 ]]; do
    case $1 in
        --integration-only)
            RUN_INTEGRATION=true
            RUN_LOAD=false
            RUN_VALIDATION=false
            shift
            ;;
        --load-only)
            RUN_INTEGRATION=false
            RUN_LOAD=true
            RUN_VALIDATION=false
            shift
            ;;
        --validation-only)
            RUN_INTEGRATION=false
            RUN_LOAD=false
            RUN_VALIDATION=true
            shift
            ;;
        --all)
            RUN_INTEGRATION=true
            RUN_LOAD=true
            RUN_VALIDATION=true
            shift
            ;;
        --skip-install)
            SKIP_INSTALL=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --integration-only   Run only integration tests"
            echo "  --load-only         Run only load tests"
            echo "  --validation-only   Run only validation tests"
            echo "  --all               Run all tests (default: integration + validation)"
            echo "  --skip-install      Skip dependency installation"
            echo "  --help              Show this help message"
            echo ""
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Start
print_header "Unified Healthcare Platform - API Test Suite"

# Check prerequisites
print_info "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi
print_success "Node.js $(node --version) found"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm is not installed"
    exit 1
fi
print_success "pnpm $(pnpm --version) found"

# Check k6 if load tests are requested
if [ "$RUN_LOAD" = true ]; then
    if ! command -v k6 &> /dev/null; then
        print_warning "k6 is not installed - skipping load tests"
        print_info "Install k6: https://k6.io/docs/getting-started/installation/"
        RUN_LOAD=false
    else
        print_success "k6 $(k6 version --quiet) found"
    fi
fi

# Install dependencies
if [ "$SKIP_INSTALL" = false ]; then
    print_header "Installing Dependencies"
    if pnpm install; then
        print_success "Dependencies installed"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
else
    print_info "Skipping dependency installation"
fi

# Integration Tests
if [ "$RUN_INTEGRATION" = true ]; then
    print_header "Running Integration Tests"

    # Authentication tests
    run_test_suite "Authentication Tests" \
        "pnpm vitest run tests/integration/auth-complete.api.test.ts --reporter=verbose"

    # Authorization tests
    run_test_suite "Authorization (RBAC) Tests" \
        "pnpm vitest run tests/integration/authorization.api.test.ts --reporter=verbose"

    # Input validation tests
    run_test_suite "Input Validation Tests" \
        "pnpm vitest run tests/integration/input-validation.api.test.ts --reporter=verbose"

    # Error handling tests
    run_test_suite "Error Handling Tests" \
        "pnpm vitest run tests/integration/error-handling.api.test.ts --reporter=verbose"

    # Coverage report
    print_header "Generating Coverage Report"
    if pnpm vitest run --coverage; then
        print_success "Coverage report generated"
        print_info "View coverage report: coverage/index.html"
    else
        print_warning "Failed to generate coverage report"
    fi
fi

# Load Tests
if [ "$RUN_LOAD" = true ]; then
    print_header "Running Load Tests"

    # Check if API server is running
    print_info "Checking if API server is running..."
    if curl -s http://localhost:8080/health > /dev/null; then
        print_success "API server is running"
    else
        print_error "API server is not running at http://localhost:8080"
        print_info "Start the server with: pnpm dev"
        exit 1
    fi

    # Login flow load test
    run_test_suite "Login Flow Load Test" \
        "k6 run --quiet tests/load/login-flow.k6.js"

    # Appointment booking load test
    run_test_suite "Appointment Booking Load Test" \
        "k6 run --quiet tests/load/appointment-booking.k6.js"

    # Concurrent users simulation
    run_test_suite "Concurrent Users Simulation" \
        "k6 run --quiet tests/load/concurrent-users.k6.js"
fi

# Validation Tests
if [ "$RUN_VALIDATION" = true ]; then
    print_header "Running Validation Tests"

    # OpenAPI validation
    run_test_suite "OpenAPI Specification Validation" \
        "pnpm tsx tests/validate-openapi.ts"
fi

# Summary
print_header "Test Suite Summary"

echo ""
echo "Total Test Suites: $TOTAL_SUITES"
echo -e "${GREEN}Passed: $PASSED_SUITES${NC}"
echo -e "${RED}Failed: $FAILED_SUITES${NC}"
echo ""

if [ $FAILED_SUITES -eq 0 ]; then
    print_success "All test suites passed! 🎉"
    echo ""
    print_info "Next steps:"
    echo "  • Review coverage report: coverage/index.html"
    echo "  • Check load test results"
    echo "  • Review API documentation: http://localhost:8080/api/docs"
    echo ""
    exit 0
else
    print_error "Some test suites failed"
    echo ""
    print_info "Troubleshooting:"
    echo "  • Check test logs above for detailed errors"
    echo "  • Ensure database is running: docker-compose up -d"
    echo "  • Verify environment variables are set correctly"
    echo "  • Review test documentation: tests/README.md"
    echo ""
    exit 1
fi

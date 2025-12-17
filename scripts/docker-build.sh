#!/bin/bash

# ============================================
# UnifiedHealth Platform - Docker Build Script
# Builds, tags, and pushes Docker images
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
REGISTRY="${DOCKER_REGISTRY:-unifiedhealth.azurecr.io}"
PROJECT_NAME="unifiedhealth"
GIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "latest")
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
VERSION="${VERSION:-1.0.0}"

# Build mode: dev or prod
BUILD_MODE="${BUILD_MODE:-prod}"

# Services to build
SERVICES=("api" "web" "mobile")

# Docker build arguments
DOCKER_BUILD_ARGS=(
    "--build-arg BUILD_DATE=${BUILD_DATE}"
    "--build-arg VERSION=${VERSION}"
    "--build-arg GIT_SHA=${GIT_SHA}"
    "--build-arg GIT_BRANCH=${GIT_BRANCH}"
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
# Build Functions
# ============================================

build_image() {
    local service=$1
    local context_path=$2
    local dockerfile_path="${context_path}/Dockerfile"

    if [ ! -f "$dockerfile_path" ]; then
        log_warning "Dockerfile not found at ${dockerfile_path}, skipping ${service}"
        return 1
    fi

    log_info "Building ${service} image..."

    # Determine target stage based on build mode
    local target="production"
    if [ "$BUILD_MODE" = "dev" ]; then
        target="development"
    fi

    # Build the image
    docker build \
        --target ${target} \
        --tag "${PROJECT_NAME}/${service}:${GIT_SHA}" \
        --tag "${PROJECT_NAME}/${service}:${VERSION}" \
        --tag "${PROJECT_NAME}/${service}:latest" \
        --tag "${REGISTRY}/${PROJECT_NAME}/${service}:${GIT_SHA}" \
        --tag "${REGISTRY}/${PROJECT_NAME}/${service}:${VERSION}" \
        --tag "${REGISTRY}/${PROJECT_NAME}/${service}:latest" \
        ${DOCKER_BUILD_ARGS[@]} \
        -f "${dockerfile_path}" \
        "${context_path}"

    if [ $? -eq 0 ]; then
        log_success "Successfully built ${service} image"
        return 0
    else
        log_error "Failed to build ${service} image"
        return 1
    fi
}

tag_image() {
    local service=$1
    local additional_tag=$2

    log_info "Tagging ${service} with ${additional_tag}..."

    docker tag \
        "${PROJECT_NAME}/${service}:${GIT_SHA}" \
        "${REGISTRY}/${PROJECT_NAME}/${service}:${additional_tag}"

    if [ $? -eq 0 ]; then
        log_success "Successfully tagged ${service} with ${additional_tag}"
    else
        log_error "Failed to tag ${service} with ${additional_tag}"
    fi
}

push_image() {
    local service=$1

    log_info "Pushing ${service} images to registry..."

    # Push all tags
    docker push "${REGISTRY}/${PROJECT_NAME}/${service}:${GIT_SHA}"
    docker push "${REGISTRY}/${PROJECT_NAME}/${service}:${VERSION}"
    docker push "${REGISTRY}/${PROJECT_NAME}/${service}:latest"

    if [ $? -eq 0 ]; then
        log_success "Successfully pushed ${service} images"
        return 0
    else
        log_error "Failed to push ${service} images"
        return 1
    fi
}

login_registry() {
    log_info "Logging into Docker registry..."

    if [ -n "${DOCKER_USERNAME:-}" ] && [ -n "${DOCKER_PASSWORD:-}" ]; then
        echo "${DOCKER_PASSWORD}" | docker login "${REGISTRY}" -u "${DOCKER_USERNAME}" --password-stdin
    elif [ -n "${ACR_SERVICE_PRINCIPAL_ID:-}" ] && [ -n "${ACR_SERVICE_PRINCIPAL_PASSWORD:-}" ]; then
        # Azure Container Registry login
        echo "${ACR_SERVICE_PRINCIPAL_PASSWORD}" | docker login "${REGISTRY}" -u "${ACR_SERVICE_PRINCIPAL_ID}" --password-stdin
    else
        log_warning "No registry credentials provided, skipping login"
        log_warning "Set DOCKER_USERNAME/DOCKER_PASSWORD or ACR credentials to push images"
        return 1
    fi

    if [ $? -eq 0 ]; then
        log_success "Successfully logged into registry"
        return 0
    else
        log_error "Failed to login to registry"
        return 1
    fi
}

# ============================================
# Main Script
# ============================================

main() {
    print_header "UnifiedHealth Docker Build Script"

    log_info "Configuration:"
    echo "  Registry:     ${REGISTRY}"
    echo "  Version:      ${VERSION}"
    echo "  Git SHA:      ${GIT_SHA}"
    echo "  Git Branch:   ${GIT_BRANCH}"
    echo "  Build Date:   ${BUILD_DATE}"
    echo "  Build Mode:   ${BUILD_MODE}"
    echo ""

    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi

    # Build images
    print_header "Building Docker Images"

    local build_failed=0

    # Build API service
    if build_image "api" "./services/api"; then
        log_success "API build successful"
    else
        build_failed=1
    fi

    # Build Web service
    if build_image "web" "./apps/web"; then
        log_success "Web build successful"
    else
        build_failed=1
    fi

    # Build Mobile service (optional, mainly for CI)
    if build_image "mobile" "./apps/mobile"; then
        log_success "Mobile build successful"
    else
        log_warning "Mobile build skipped or failed (this is optional)"
    fi

    if [ $build_failed -eq 1 ]; then
        log_error "Some builds failed. Exiting."
        exit 1
    fi

    # Additional tagging for branches
    print_header "Additional Tagging"

    if [ "$GIT_BRANCH" = "main" ] || [ "$GIT_BRANCH" = "master" ]; then
        for service in "${SERVICES[@]}"; do
            tag_image "$service" "stable"
        done
    elif [ "$GIT_BRANCH" = "develop" ]; then
        for service in "${SERVICES[@]}"; do
            tag_image "$service" "dev"
        done
    fi

    # Push images if PUSH=true
    if [ "${PUSH:-false}" = "true" ]; then
        print_header "Pushing Images to Registry"

        if login_registry; then
            local push_failed=0

            for service in "${SERVICES[@]}"; do
                if ! push_image "$service"; then
                    push_failed=1
                fi
            done

            if [ $push_failed -eq 1 ]; then
                log_error "Some pushes failed"
                exit 1
            fi
        else
            log_warning "Skipping push due to login failure"
        fi
    else
        log_info "Skipping push (set PUSH=true to push images)"
    fi

    # Print summary
    print_header "Build Summary"

    log_success "Build completed successfully!"
    echo ""
    echo "Built images:"
    for service in "${SERVICES[@]}"; do
        echo "  - ${PROJECT_NAME}/${service}:${GIT_SHA}"
        echo "  - ${PROJECT_NAME}/${service}:${VERSION}"
        echo "  - ${PROJECT_NAME}/${service}:latest"
    done
    echo ""

    if [ "${PUSH:-false}" = "true" ]; then
        echo "Images pushed to: ${REGISTRY}"
    else
        echo "To push images, run: PUSH=true ./scripts/docker-build.sh"
    fi
}

# Run main function
main "$@"

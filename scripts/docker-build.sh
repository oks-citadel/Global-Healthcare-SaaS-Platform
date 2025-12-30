#!/bin/bash

# ============================================
# UnifiedHealth Platform - Docker Build Script
# Builds, tags, and pushes Docker images to AWS ECR
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
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo '')}"
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
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

check_aws_credentials() {
    log_info "Checking AWS credentials..."

    if ! aws sts get-caller-identity >/dev/null 2>&1; then
        log_error "Not authenticated with AWS. Run 'aws configure' or 'aws sso login'"
        exit 1
    fi

    # Get AWS Account ID if not set
    if [ -z "${AWS_ACCOUNT_ID}" ]; then
        AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
        ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    fi

    log_success "AWS credentials verified"
}

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
        --tag "${ECR_REGISTRY}/${PROJECT_NAME}-${service}:${GIT_SHA}" \
        --tag "${ECR_REGISTRY}/${PROJECT_NAME}-${service}:${VERSION}" \
        --tag "${ECR_REGISTRY}/${PROJECT_NAME}-${service}:latest" \
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
        "${ECR_REGISTRY}/${PROJECT_NAME}-${service}:${additional_tag}"

    if [ $? -eq 0 ]; then
        log_success "Successfully tagged ${service} with ${additional_tag}"
    else
        log_error "Failed to tag ${service} with ${additional_tag}"
    fi
}

push_image() {
    local service=$1

    log_info "Pushing ${service} images to ECR..."

    # Push all tags
    docker push "${ECR_REGISTRY}/${PROJECT_NAME}-${service}:${GIT_SHA}"
    docker push "${ECR_REGISTRY}/${PROJECT_NAME}-${service}:${VERSION}"
    docker push "${ECR_REGISTRY}/${PROJECT_NAME}-${service}:latest"

    if [ $? -eq 0 ]; then
        log_success "Successfully pushed ${service} images"
        return 0
    else
        log_error "Failed to push ${service} images"
        return 1
    fi
}

login_ecr() {
    log_info "Logging into Amazon ECR..."

    aws ecr get-login-password --region "${AWS_REGION}" | docker login --username AWS --password-stdin "${ECR_REGISTRY}"

    if [ $? -eq 0 ]; then
        log_success "Successfully logged into ECR"
        return 0
    else
        log_error "Failed to login to ECR"
        return 1
    fi
}

create_ecr_repositories() {
    log_info "Ensuring ECR repositories exist..."

    for service in "${SERVICES[@]}"; do
        local repo_name="${PROJECT_NAME}-${service}"
        if ! aws ecr describe-repositories --repository-names "${repo_name}" --region "${AWS_REGION}" >/dev/null 2>&1; then
            log_info "Creating ECR repository: ${repo_name}"
            aws ecr create-repository \
                --repository-name "${repo_name}" \
                --region "${AWS_REGION}" \
                --image-scanning-configuration scanOnPush=true || log_warning "Failed to create repository ${repo_name}"
        fi
    done
}

# ============================================
# Main Script
# ============================================

main() {
    print_header "UnifiedHealth Docker Build Script"

    # Check AWS credentials first
    check_aws_credentials

    log_info "Configuration:"
    echo "  Registry:     ${ECR_REGISTRY}"
    echo "  Version:      ${VERSION}"
    echo "  Git SHA:      ${GIT_SHA}"
    echo "  Git Branch:   ${GIT_BRANCH}"
    echo "  Build Date:   ${BUILD_DATE}"
    echo "  Build Mode:   ${BUILD_MODE}"
    echo "  AWS Region:   ${AWS_REGION}"
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
        print_header "Pushing Images to ECR"

        if login_ecr; then
            # Ensure repositories exist
            create_ecr_repositories

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
            log_warning "Skipping push due to ECR login failure"
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
        echo "  - ${ECR_REGISTRY}/${PROJECT_NAME}-${service}:${GIT_SHA}"
    done
    echo ""

    if [ "${PUSH:-false}" = "true" ]; then
        echo "Images pushed to: ${ECR_REGISTRY}"
    else
        echo "To push images, run: PUSH=true ./scripts/docker-build.sh"
    fi
}

# Run main function
main "$@"

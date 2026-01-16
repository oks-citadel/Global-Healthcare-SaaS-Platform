#!/usr/bin/env bash

#==============================================================================
# SBOM Generation Script for UnifiedHealth Platform
# Generates CycloneDX SBOMs for all workspaces in the monorepo using Syft
#
# Usage:
#   ./scripts/generate-sbom.sh [version]
#
# Arguments:
#   version   Optional version string (defaults to git tag or commit hash)
#
# Environment Variables:
#   SBOM_OUTPUT_DIR   Output directory for SBOMs (default: ./sbom-artifacts)
#   SBOM_FORMAT       Output format: json or xml (default: json)
#
# Prerequisites:
#   - Syft (https://github.com/anchore/syft)
#   Install: curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin
#==============================================================================

set -euo pipefail

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Default configuration
VERSION="${1:-}"
SBOM_OUTPUT_DIR="${SBOM_OUTPUT_DIR:-${ROOT_DIR}/sbom-artifacts}"
SBOM_FORMAT="${SBOM_FORMAT:-json}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

#------------------------------------------------------------------------------
# Utility functions
#------------------------------------------------------------------------------

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
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

#------------------------------------------------------------------------------
# Check prerequisites
#------------------------------------------------------------------------------

check_syft() {
    if ! command -v syft &> /dev/null; then
        log_error "Syft is not installed. Please install it first:"
        log_error "  curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin"
        log_error "Or use the CI pipeline which has Syft pre-installed."
        exit 1
    fi
}

#------------------------------------------------------------------------------
# Version detection
#------------------------------------------------------------------------------

get_version() {
    if [[ -n "${VERSION}" ]]; then
        echo "${VERSION}"
        return
    fi

    # Try to get version from git tag
    if git describe --tags --exact-match 2>/dev/null; then
        return
    fi

    # Fall back to git short hash
    if git rev-parse --short HEAD 2>/dev/null; then
        return
    fi

    # Final fallback
    echo "unknown"
}

#------------------------------------------------------------------------------
# SBOM generation functions
#------------------------------------------------------------------------------

generate_sbom() {
    local workspace_dir="$1"
    local workspace_name="$2"
    local version="$3"
    local output_file="${SBOM_OUTPUT_DIR}/sbom-${workspace_name}-${version}.${SBOM_FORMAT}"

    log_info "Generating SBOM for ${workspace_name}..."

    # Check if package.json exists
    if [[ ! -f "${workspace_dir}/package.json" ]]; then
        log_warning "No package.json found in ${workspace_dir}, skipping..."
        return 0
    fi

    # Determine syft output format
    local syft_format="cyclonedx-${SBOM_FORMAT}"

    # Generate SBOM using Syft
    if syft scan "dir:${workspace_dir}" \
        --output "${syft_format}=${output_file}" \
        --name "${workspace_name}" \
        --version "${version}" 2>/dev/null; then
        log_success "Generated: ${output_file}"
        return 0
    else
        log_error "Failed to generate SBOM for ${workspace_name}"
        return 1
    fi
}

find_workspaces() {
    # Parse pnpm-workspace.yaml to find workspace patterns
    local workspace_file="${ROOT_DIR}/pnpm-workspace.yaml"
    local workspaces=()

    if [[ -f "${workspace_file}" ]]; then
        # Extract workspace patterns from pnpm-workspace.yaml
        local patterns
        patterns=$(grep -E '^\s*-\s*' "${workspace_file}" | sed 's/.*-\s*//' | sed "s/['\"]//g" | tr -d ' ')

        for pattern in ${patterns}; do
            # Remove glob suffix if present
            pattern="${pattern%/*}"

            # Find directories matching the pattern
            if [[ -d "${ROOT_DIR}/${pattern}" ]]; then
                for dir in "${ROOT_DIR}/${pattern}"/*; do
                    if [[ -d "${dir}" && -f "${dir}/package.json" ]]; then
                        workspaces+=("${dir}")
                    fi
                done
            fi
        done
    fi

    # Also check common workspace directories
    for dir in apps packages services; do
        if [[ -d "${ROOT_DIR}/${dir}" ]]; then
            for subdir in "${ROOT_DIR}/${dir}"/*; do
                if [[ -d "${subdir}" && -f "${subdir}/package.json" ]]; then
                    # Avoid duplicates
                    local found=0
                    for ws in "${workspaces[@]:-}"; do
                        if [[ "${ws}" == "${subdir}" ]]; then
                            found=1
                            break
                        fi
                    done
                    if [[ ${found} -eq 0 ]]; then
                        workspaces+=("${subdir}")
                    fi
                fi
            done
        fi
    done

    printf '%s\n' "${workspaces[@]:-}"
}

#------------------------------------------------------------------------------
# Main execution
#------------------------------------------------------------------------------

main() {
    log_info "=========================================="
    log_info "UnifiedHealth SBOM Generation"
    log_info "=========================================="

    # Check prerequisites
    check_syft

    # Navigate to root directory
    cd "${ROOT_DIR}"

    # Get version
    VERSION=$(get_version)
    log_info "Version: ${VERSION}"
    log_info "Output directory: ${SBOM_OUTPUT_DIR}"
    log_info "Format: ${SBOM_FORMAT}"
    log_info "Generator: Syft (CycloneDX)"

    # Create output directory
    mkdir -p "${SBOM_OUTPUT_DIR}"

    # Track statistics
    local total=0
    local success=0
    local failed=0
    local generated_files=()

    # Generate root SBOM
    log_info "------------------------------------------"
    log_info "Generating root project SBOM..."
    log_info "------------------------------------------"

    ((total++)) || true
    if generate_sbom "${ROOT_DIR}" "root" "${VERSION}"; then
        ((success++)) || true
        generated_files+=("sbom-root-${VERSION}.${SBOM_FORMAT}")
    else
        ((failed++)) || true
    fi

    # Find and process workspaces
    log_info "------------------------------------------"
    log_info "Processing workspaces..."
    log_info "------------------------------------------"

    local workspaces
    workspaces=$(find_workspaces)

    if [[ -n "${workspaces}" ]]; then
        while IFS= read -r workspace_dir; do
            if [[ -n "${workspace_dir}" ]]; then
                local workspace_name
                workspace_name=$(basename "${workspace_dir}")
                local parent_dir
                parent_dir=$(basename "$(dirname "${workspace_dir}")")
                local full_name="${parent_dir}-${workspace_name}"

                ((total++)) || true
                if generate_sbom "${workspace_dir}" "${full_name}" "${VERSION}"; then
                    ((success++)) || true
                    generated_files+=("sbom-${full_name}-${VERSION}.${SBOM_FORMAT}")
                else
                    ((failed++)) || true
                fi
            fi
        done <<< "${workspaces}"
    else
        log_warning "No workspaces found"
    fi

    # Generate checksums
    log_info "------------------------------------------"
    log_info "Generating checksums..."
    log_info "------------------------------------------"

    (
        cd "${SBOM_OUTPUT_DIR}"
        if ls *.json *.xml 2>/dev/null | head -1 > /dev/null; then
            sha256sum *.json *.xml 2>/dev/null > checksums.sha256 || true
            log_success "Generated: checksums.sha256"
        fi
    )

    # Create manifest
    log_info "------------------------------------------"
    log_info "Creating manifest..."
    log_info "------------------------------------------"

    cat > "${SBOM_OUTPUT_DIR}/sbom-manifest.json" << EOF
{
  "manifestVersion": "1.0",
  "platform": "unified-health-platform",
  "version": "${VERSION}",
  "generatedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "generator": {
    "tool": "syft",
    "format": "cyclonedx",
    "script": "scripts/generate-sbom.sh"
  },
  "format": "${SBOM_FORMAT}",
  "statistics": {
    "total": ${total},
    "success": ${success},
    "failed": ${failed}
  },
  "files": $(printf '%s\n' "${generated_files[@]:-}" | jq -R . | jq -s .),
  "compliance": {
    "frameworks": ["HIPAA", "SOC2", "GDPR"],
    "retentionPeriod": "7 years"
  }
}
EOF

    log_success "Generated: sbom-manifest.json"

    # Print summary
    log_info "=========================================="
    log_info "SBOM Generation Complete"
    log_info "=========================================="
    log_info "Total workspaces processed: ${total}"
    log_success "Successful: ${success}"
    if [[ ${failed} -gt 0 ]]; then
        log_error "Failed: ${failed}"
    fi
    log_info "Output directory: ${SBOM_OUTPUT_DIR}"
    log_info ""

    # List generated files
    log_info "Generated files:"
    ls -la "${SBOM_OUTPUT_DIR}"

    # Return exit code based on failures
    if [[ ${failed} -gt 0 ]]; then
        return 1
    fi

    return 0
}

# Run main function
main "$@"

#!/bin/bash

# Build script for Global Healthcare SaaS Platform
# This script builds all packages, services, and apps

set -e  # Exit on error

echo "========================================="
echo "Global Healthcare SaaS Platform - Build"
echo "========================================="
echo ""

# Navigate to project root
cd "$(dirname "$0")"

echo "Step 1: Installing dependencies..."
pnpm install

echo ""
echo "Step 2: Building all packages and apps..."
pnpm build

echo ""
echo "========================================="
echo "Build completed successfully!"
echo "========================================="

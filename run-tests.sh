#!/bin/bash

# Script to run tests across the monorepo
echo "Running tests across Global Healthcare SaaS Platform..."
echo "=================================================="
echo ""

# Change to project root
cd "$(dirname "$0")"

# Run tests using turbo
echo "Running all tests with turbo..."
pnpm test

# Capture exit code
EXIT_CODE=$?

echo ""
echo "=================================================="
echo "Tests completed with exit code: $EXIT_CODE"
echo ""

exit $EXIT_CODE

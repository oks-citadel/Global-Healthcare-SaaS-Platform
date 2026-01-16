#!/bin/bash

# Reset Database Script
# This script resets the database and reseeds it with test data

set -e  # Exit on error

echo "=========================================="
echo "Database Reset and Seed Script"
echo "=========================================="
echo ""
echo "WARNING: This will delete ALL data in the database!"
echo ""

# Check if running in production
if [ "$NODE_ENV" = "production" ]; then
  echo "ERROR: Cannot reset database in production environment!"
  exit 1
fi

# Confirm before proceeding
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "Operation cancelled."
  exit 0
fi

echo ""
echo "Step 1: Resetting database with migrations..."
echo "----------------------------------------------"
npx prisma migrate reset --force --skip-seed

echo ""
echo "Step 2: Generating Prisma Client..."
echo "----------------------------------------------"
npx prisma generate

echo ""
echo "Step 3: Seeding database with test data..."
echo "----------------------------------------------"
npx prisma db seed

echo ""
echo "=========================================="
echo "Database reset completed successfully!"
echo "=========================================="
echo ""
echo "Test Credentials:"
echo "  Admin:    admin@unifiedhealth.com / Admin123!"
echo "  Provider: dr.smith@unifiedhealth.com / Provider123!"
echo "  Patient:  john.doe@example.com / Patient123!"
echo ""

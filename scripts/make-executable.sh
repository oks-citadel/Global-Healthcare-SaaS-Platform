#!/bin/bash
# ============================================
# Make all scripts executable
# ============================================
# Usage: ./scripts/make-executable.sh

echo "Making all scripts executable..."

chmod +x scripts/deploy-staging.sh
chmod +x scripts/deploy-production.sh
chmod +x scripts/rollback.sh
chmod +x scripts/setup-azure.sh
chmod +x scripts/setup-secrets.sh
chmod +x scripts/db-backup.sh
chmod +x scripts/db-restore.sh

echo "Done! All scripts are now executable."

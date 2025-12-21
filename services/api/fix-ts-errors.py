#!/usr/bin/env python3
"""
Script to fix TypeScript compilation errors in the services/api directory
"""

import os
import re
from pathlib import Path

def fix_logger_imports(file_path):
    """Fix logger imports from '../config/logger' to '../utils/logger.js'"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace config/logger with utils/logger.js
    content = content.replace("from '../config/logger'", "from '../utils/logger.js'")
    content = content.replace("from '../../config/logger'", "from '../../utils/logger.js'")
    content = content.replace('from "../config/logger"', 'from "../utils/logger.js"')
    content = content.replace('from "../../config/logger"', 'from "../../utils/logger.js"')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return True

def fix_logger_calls(file_path):
    """Fix logger calls that pass objects as first argument"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix logger.error calls
    content = re.sub(
        r"logger\.error\('([^']+)':\s*,\s*error\)",
        r"logger.error('\1', { error })",
        content
    )
    content = re.sub(
        r'logger\.error\("([^"]+)":\s*,\s*error\)',
        r'logger.error("\1", { error })',
        content
    )
    content = re.sub(
        r"logger\.error\(`([^`]+)`:\s*,\s*error\)",
        r"logger.error(`\1`, { error })",
        content
    )

    # Fix logger.warn calls
    content = re.sub(
        r"logger\.warn\(`([^`]+)`:\s*,\s*error\)",
        r"logger.warn(`\1`, { error })",
        content
    )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return True

def fix_stripe_subscription_properties(file_path):
    """Add type assertions for Stripe subscription properties"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix current_period_start and current_period_end
    content = re.sub(
        r'subscription\.current_period_start',
        r'(subscription as any).current_period_start',
        content
    )
    content = re.sub(
        r'subscription\.current_period_end',
        r'(subscription as any).current_period_end',
        content
    )

    # Fix in controllers where it's result.subscription
    content = re.sub(
        r'result\.subscription\.current_period_start',
        r'(result.subscription as any).current_period_start',
        content
    )
    content = re.sub(
        r'result\.subscription\.current_period_end',
        r'(result.subscription as any).current_period_end',
        content
    )

    # Fix where it's subscription.stripeSubscription
    content = re.sub(
        r'subscription\.stripeSubscription\.current_period_start',
        r'(subscription.stripeSubscription as any).current_period_start',
        content
    )
    content = re.sub(
        r'subscription\.stripeSubscription\.current_period_end',
        r'(subscription.stripeSubscription as any).current_period_end',
        content
    )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return True

def main():
    """Main function to fix all TypeScript errors"""
    base_dir = Path(__file__).parent / 'src'

    # Get all TypeScript files
    ts_files = list(base_dir.rglob('*.ts'))

    print(f"Found {len(ts_files)} TypeScript files")
    print("Fixing errors...")

    # Files with logger import issues
    logger_import_files = [
        'lib/database-optimization.ts',
        'lib/redis-cache.ts',
        'middleware/compression.middleware.ts',
    ]

    # Files with Stripe subscription property issues
    stripe_files = [
        'controllers/payment.controller.ts',
        'services/payment.service.ts',
        'services/stripe-webhook.service.ts',
        'lib/stripe-webhook-handler.ts',
    ]

    # Files with logger call issues
    logger_call_files = [
        'lib/database-optimization.ts',
    ]

    # Fix logger imports
    print("\n1. Fixing logger imports...")
    for file_rel in logger_import_files:
        file_path = base_dir / file_rel
        if file_path.exists():
            fix_logger_imports(file_path)
            print(f"  ✓ Fixed {file_rel}")
        else:
            print(f"  ✗ File not found: {file_rel}")

    # Fix logger calls
    print("\n2. Fixing logger function calls...")
    for file_rel in logger_call_files:
        file_path = base_dir / file_rel
        if file_path.exists():
            fix_logger_calls(file_path)
            print(f"  ✓ Fixed {file_rel}")
        else:
            print(f"  ✗ File not found: {file_rel}")

    # Fix Stripe subscription properties
    print("\n3. Fixing Stripe API type mismatches...")
    for file_rel in stripe_files:
        file_path = base_dir / file_rel
        if file_path.exists():
            fix_stripe_subscription_properties(file_path)
            print(f"  ✓ Fixed {file_rel}")
        else:
            print(f"  ✗ File not found: {file_rel}")

    print("\n✓ All fixes applied!")
    print("\nRun 'npx tsc --noEmit' to verify the fixes.")

if __name__ == '__main__':
    main()

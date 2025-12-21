#!/bin/bash

# Script to fix TypeScript compilation errors

echo "Fixing TypeScript compilation errors..."

# Fix 1: Update logger imports from '../config/logger' to '../utils/logger.js'
echo "Fixing logger imports..."
find src -type f -name "*.ts" -exec sed -i "s|from '../config/logger'|from '../utils/logger.js'|g" {} +
find src -type f -name "*.ts" -exec sed -i "s|from '../../config/logger'|from '../../utils/logger.js'|g" {} +

# Fix 2: Fix logger calls that pass objects as first argument
echo "Fixing logger function signatures..."

# database-optimization.ts
sed -i "s|logger.error('Failed to analyze query:', error)|logger.error('Failed to analyze query', { error })|g" src/lib/database-optimization.ts
sed -i "s|logger.error('Failed to get table stats:', error)|logger.error('Failed to get table stats', { error })|g" src/lib/database-optimization.ts
sed -i "s|logger.error('Failed to get index stats:', error)|logger.error('Failed to get index stats', { error })|g" src/lib/database-optimization.ts
sed -i "s|logger.error('Failed to find unused indexes:', error)|logger.error('Failed to find unused indexes', { error })|g" src/lib/database-optimization.ts
sed -i "s|logger.warn(\`Transaction attempt \${attempt} failed:\`, error)|logger.warn(\`Transaction attempt \${attempt} failed\`, { error })|g" src/lib/database-optimization.ts
sed -i "s|logger.error(\`Health check failed for pool \${name}:\`, error)|logger.error(\`Health check failed for pool \${name}\`, { error })|g" src/lib/database-optimization.ts

# Fix 3: Add type assertions for Stripe subscription properties
echo "Fixing Stripe API type mismatches..."

# payment.controller.ts
sed -i "s|currentPeriodStart: result.subscription.current_period_start,|currentPeriodStart: (result.subscription as any).current_period_start,|g" src/controllers/payment.controller.ts
sed -i "s|currentPeriodEnd: result.subscription.current_period_end,|currentPeriodEnd: (result.subscription as any).current_period_end,|g" src/controllers/payment.controller.ts
sed -i "s|currentPeriodEnd: subscription.current_period_end,|currentPeriodEnd: (subscription as any).current_period_end,|g" src/controllers/payment.controller.ts
sed -i "s|currentPeriodStart: subscription.stripeSubscription.current_period_start,|currentPeriodStart: (subscription.stripeSubscription as any).current_period_start,|g" src/controllers/payment.controller.ts
sed -i "s|currentPeriodEnd: subscription.stripeSubscription.current_period_end,|currentPeriodEnd: (subscription.stripeSubscription as any).current_period_end,|g" src/controllers/payment.controller.ts

# payment.service.ts - use regex to add type assertions
sed -i "s|new Date(subscription.current_period_start \* 1000)|new Date((subscription as any).current_period_start * 1000)|g" src/services/payment.service.ts
sed -i "s|new Date(subscription.current_period_end \* 1000)|new Date((subscription as any).current_period_end * 1000)|g" src/services/payment.service.ts

# stripe-webhook.service.ts
sed -i "s|new Date(subscription.current_period_start \* 1000)|new Date((subscription as any).current_period_start * 1000)|g" src/services/stripe-webhook.service.ts
sed -i "s|new Date(subscription.current_period_end \* 1000)|new Date((subscription as any).current_period_end * 1000)|g" src/services/stripe-webhook.service.ts
sed -i "s|subscription.current_period_end \* 1000|(subscription as any).current_period_end * 1000|g" src/services/stripe-webhook.service.ts

# stripe-webhook-handler.ts
sed -i "s|new Date(subscription.current_period_start \* 1000)|new Date((subscription as any).current_period_start * 1000)|g" src/lib/stripe-webhook-handler.ts
sed -i "s|new Date(subscription.current_period_end \* 1000)|new Date((subscription as any).current_period_end * 1000)|g" src/lib/stripe-webhook-handler.ts
sed -i "s|subscription.current_period_end \* 1000|(subscription as any).current_period_end * 1000|g" src/lib/stripe-webhook-handler.ts

echo "Done! Run 'npx tsc --noEmit' to verify the fixes."

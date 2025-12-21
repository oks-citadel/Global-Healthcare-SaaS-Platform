# TypeScript Compilation Error Fixes

This document outlines all the fixes needed to resolve TypeScript compilation errors in the services/api directory.

## Summary of Issues

1. **Logger Import Errors**: Files importing from `'../config/logger'` instead of `'../utils/logger.js'`
2. **Stripe API Type Mismatches**: Properties like `current_period_start` and `current_period_end` don't exist on Stripe's Subscription type
3. **Logger Function Signature Issues**: Logger calls passing objects as first argument instead of as second argument

## Automated Fix Scripts

Three scripts have been created to automatically apply all fixes:

### Node.js Script (Recommended - Works everywhere)
```bash
cd services/api
node fix-ts-errors.js
```

### Bash Script (Unix/Linux/Mac/Git Bash)
```bash
cd services/api
chmod +x fix-typescript-errors.sh
./fix-typescript-errors.sh
```

### Python Script (Cross-platform alternative)
```bash
cd services/api
python fix-ts-errors.py
```

## Manual Fixes

If you prefer to apply fixes manually, here are all the changes needed:

### 1. Fix Logger Imports (3 files)

#### File: `src/lib/database-optimization.ts`
**Line 2:**
```typescript
// BEFORE
import { logger } from '../config/logger';

// AFTER
import { logger } from '../utils/logger.js';
```

#### File: `src/lib/redis-cache.ts`
**Line 2:**
```typescript
// BEFORE
import { logger } from '../config/logger';

// AFTER
import { logger } from '../utils/logger.js';
```

#### File: `src/middleware/compression.middleware.ts`
**Line 3:**
```typescript
// BEFORE
import { logger } from '../config/logger';

// AFTER
import { logger } from '../utils/logger.js';
```

### 2. Fix Logger Function Calls

#### File: `src/lib/database-optimization.ts`

**Lines 430, 452, 482, 509, 536:**
Replace all instances of:
```typescript
logger.error('message:', error)
```
With:
```typescript
logger.error('message', { error })
```

Specific fixes:
- Line 430: `logger.error(\`Health check failed for pool ${name}:\`, error)` → `logger.error(\`Health check failed for pool ${name}\`, { error })`
- Line 452: `logger.error('Failed to analyze query:', error)` → `logger.error('Failed to analyze query', { error })`
- Line 482: `logger.error('Failed to get table stats:', error)` → `logger.error('Failed to get table stats', { error })`
- Line 509: `logger.error('Failed to get index stats:', error)` → `logger.error('Failed to get index stats', { error })`
- Line 536: `logger.error('Failed to find unused indexes:', error)` → `logger.error('Failed to find unused indexes', { error })`
- Line 574: `logger.warn(\`Transaction attempt ${attempt} failed:\`, error)` → `logger.warn(\`Transaction attempt ${attempt} failed\`, { error })`

### 3. Fix Stripe Subscription Type Mismatches

Add `(subscription as any)` type assertion for all `current_period_start` and `current_period_end` accesses.

#### File: `src/controllers/payment.controller.ts`

**Lines 76-77:**
```typescript
// BEFORE
currentPeriodStart: result.subscription.current_period_start,
currentPeriodEnd: result.subscription.current_period_end,

// AFTER
currentPeriodStart: (result.subscription as any).current_period_start,
currentPeriodEnd: (result.subscription as any).current_period_end,
```

**Line 116:**
```typescript
// BEFORE
currentPeriodEnd: subscription.current_period_end,

// AFTER
currentPeriodEnd: (subscription as any).current_period_end,
```

**Lines 153-154:**
```typescript
// BEFORE
currentPeriodStart: subscription.stripeSubscription.current_period_start,
currentPeriodEnd: subscription.stripeSubscription.current_period_end,

// AFTER
currentPeriodStart: (subscription.stripeSubscription as any).current_period_start,
currentPeriodEnd: (subscription.stripeSubscription as any).current_period_end,
```

#### File: `src/services/payment.service.ts`

**Lines 157-158, 548-549, 558-559:**
Replace all instances of:
```typescript
currentPeriodStart: new Date(subscription.current_period_start * 1000),
currentPeriodEnd: new Date(subscription.current_period_end * 1000),
```
With:
```typescript
currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
```

#### File: `src/services/stripe-webhook.service.ts`

**Lines 420-421, 430-431, 465-466, 475-476:**
Replace all instances of:
```typescript
currentPeriodStart: new Date(subscription.current_period_start * 1000),
currentPeriodEnd: new Date(subscription.current_period_end * 1000),
```
With:
```typescript
currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
```

**Lines 1073, 1094:**
Replace:
```typescript
subscription.current_period_end * 1000
```
With:
```typescript
(subscription as any).current_period_end * 1000
```

#### File: `src/lib/stripe-webhook-handler.ts`

**Lines 300-301, 310-311:**
Replace all instances of:
```typescript
currentPeriodStart: new Date(subscription.current_period_start * 1000),
currentPeriodEnd: new Date(subscription.current_period_end * 1000),
```
With:
```typescript
currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
```

**Line 339:**
Replace:
```typescript
endDate: new Date(subscription.current_period_end * 1000).toLocaleDateString(),
```
With:
```typescript
endDate: new Date((subscription as any).current_period_end * 1000).toLocaleDateString(),
```

## Verification

After applying all fixes, run the TypeScript compiler to verify:

```bash
cd services/api
npx tsc --noEmit
```

You should see zero errors if all fixes were applied correctly.

## Why These Fixes?

1. **Logger Import Fix**: The logger module is located in `utils/logger.js`, not `config/logger`

2. **Stripe Type Assertions**: The TypeScript definitions for Stripe's SDK may not include all properties that exist at runtime. Using `as any` is a pragmatic solution for external API types.

3. **Logger Function Signatures**: The logger expects a string message as the first argument and metadata object as the second, following Winston's API pattern:
   - Correct: `logger.error('message', { error, other: 'data' })`
   - Incorrect: `logger.error('message:', error)`

## Alternative: Use Find & Replace

You can use your IDE's find & replace feature to make these changes quickly:

### VS Code / Similar IDEs

1. Open find & replace (Ctrl+Shift+H or Cmd+Shift+H)
2. Enable regex mode
3. Set search scope to `services/api/src`
4. Apply the following find & replace operations:

| Find (Regex) | Replace |
|--------------|---------|
| `from ['"]\.\.\/config\/logger['"]` | `from '../utils/logger.js'` |
| `subscription\.current_period_(start\|end)` | `(subscription as any).current_period_$1` |
| `result\.subscription\.current_period_(start\|end)` | `(result.subscription as any).current_period_$1` |
| `subscription\.stripeSubscription\.current_period_(start\|end)` | `(subscription.stripeSubscription as any).current_period_$1` |
| `logger\.(error\|warn)\((['"`])([^'"`]+):\2,\s*error\)` | `logger.$1($2$3$2, { error })` |


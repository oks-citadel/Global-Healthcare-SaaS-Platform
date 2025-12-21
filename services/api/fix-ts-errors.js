#!/usr/bin/env node
/**
 * Script to fix TypeScript compilation errors in the services/api directory
 *
 * Usage: node fix-ts-errors.js
 */

const fs = require('fs');
const path = require('path');

// File paths relative to src directory
const FILES_TO_FIX = {
  loggerImports: [
    'lib/database-optimization.ts',
    'lib/redis-cache.ts',
    'middleware/compression.middleware.ts',
  ],
  stripeTypes: [
    'controllers/payment.controller.ts',
    'services/payment.service.ts',
    'services/stripe-webhook.service.ts',
    'lib/stripe-webhook-handler.ts',
  ],
  loggerCalls: [
    'lib/database-optimization.ts',
  ],
};

const srcDir = path.join(__dirname, 'src');

function fixLoggerImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  content = content.replace(/from ['"]\.\.\/config\/logger['"]/g, "from '../utils/logger.js'");
  content = content.replace(/from ['"]\.\.\/\.\.\/config\/logger['"]/g, "from '../../utils/logger.js'");

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  return false;
}

function fixLoggerCalls(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // Fix logger.error('message:', error) -> logger.error('message', { error })
  content = content.replace(
    /logger\.error\((['"`])([^'"` ]+):\1,\s*error\)/g,
    "logger.error($1$2$1, { error })"
  );

  // Fix logger.error(`template:`, error) -> logger.error(`template`, { error })
  content = content.replace(
    /logger\.error\(`([^`]+):`\s*,\s*error\)/g,
    "logger.error(`$1`, { error })"
  );

  // Fix logger.warn patterns
  content = content.replace(
    /logger\.warn\(`([^`]+)`:\s*,\s*error\)/g,
    "logger.warn(`$1`, { error })"
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  return false;
}

function fixStripeTypes(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // Fix subscription.current_period_start/end
  content = content.replace(
    /\bsubscription\.current_period_(start|end)\b/g,
    "(subscription as any).current_period_$1"
  );

  // Fix result.subscription.current_period_start/end
  content = content.replace(
    /\bresult\.subscription\.current_period_(start|end)\b/g,
    "(result.subscription as any).current_period_$1"
  );

  // Fix subscription.stripeSubscription.current_period_start/end
  content = content.replace(
    /\bsubscription\.stripeSubscription\.current_period_(start|end)\b/g,
    "(subscription.stripeSubscription as any).current_period_$1"
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  return false;
}

function main() {
  console.log('🔧 Fixing TypeScript compilation errors...\n');

  let totalFixed = 0;

  // Fix logger imports
  console.log('1️⃣  Fixing logger imports...');
  for (const file of FILES_TO_FIX.loggerImports) {
    const filePath = path.join(srcDir, file);
    if (fs.existsSync(filePath)) {
      if (fixLoggerImports(filePath)) {
        console.log(`   ✅ Fixed ${file}`);
        totalFixed++;
      } else {
        console.log(`   ⏭️  No changes needed in ${file}`);
      }
    } else {
      console.log(`   ❌ File not found: ${file}`);
    }
  }

  // Fix logger calls
  console.log('\n2️⃣  Fixing logger function calls...');
  for (const file of FILES_TO_FIX.loggerCalls) {
    const filePath = path.join(srcDir, file);
    if (fs.existsSync(filePath)) {
      if (fixLoggerCalls(filePath)) {
        console.log(`   ✅ Fixed ${file}`);
        totalFixed++;
      } else {
        console.log(`   ⏭️  No changes needed in ${file}`);
      }
    } else {
      console.log(`   ❌ File not found: ${file}`);
    }
  }

  // Fix Stripe types
  console.log('\n3️⃣  Fixing Stripe API type mismatches...');
  for (const file of FILES_TO_FIX.stripeTypes) {
    const filePath = path.join(srcDir, file);
    if (fs.existsSync(filePath)) {
      if (fixStripeTypes(filePath)) {
        console.log(`   ✅ Fixed ${file}`);
        totalFixed++;
      } else {
        console.log(`   ⏭️  No changes needed in ${file}`);
      }
    } else {
      console.log(`   ❌ File not found: ${file}`);
    }
  }

  console.log(`\n✨ Done! Fixed ${totalFixed} file(s).`);
  console.log('\n📝 Next step: Run "npx tsc --noEmit" to verify the fixes.\n');
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = { fixLoggerImports, fixLoggerCalls, fixStripeTypes };

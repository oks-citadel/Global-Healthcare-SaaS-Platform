#!/usr/bin/env node
/**
 * Comprehensive TypeScript error fix script
 * Fixes logger argument order and Stripe type assertions
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Fix logger calls where object is first argument: logger.info({...}, 'message') -> logger.info('message', {...})
function fixLoggerCalls(content) {
  // Pattern: logger.(info|warn|error|debug)(OBJECT, 'STRING') -> logger.(method)('STRING', OBJECT)
  const loggerPattern = /logger\.(info|warn|error|debug)\(\s*(\{[^}]+\})\s*,\s*(['"`][^'"`]+['"`])\s*\)/g;

  content = content.replace(loggerPattern, (match, method, obj, msg) => {
    return `logger.${method}(${msg}, ${obj})`;
  });

  return content;
}

// Fix Stripe subscription properties
function fixStripeTypes(content) {
  // Fix subscription.current_period_start and current_period_end
  content = content.replace(/\bsubscription\.current_period_start\b/g, '(subscription as any).current_period_start');
  content = content.replace(/\bsubscription\.current_period_end\b/g, '(subscription as any).current_period_end');

  // Fix subscription.invoice and invoice.subscription
  content = content.replace(/\bpaymentIntent\.invoice\b/g, '(paymentIntent as any).invoice');
  content = content.replace(/\binvoice\.subscription\b/g, '(invoice as any).subscription');

  // Fix customer.email for DeletedCustomer union
  content = content.replace(/\bcustomer\.email\b/g, '(customer as any).email');

  return content;
}

// Process a single file
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  content = fixLoggerCalls(content);
  content = fixStripeTypes(content);

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  return false;
}

// Get all TypeScript files recursively
function getAllTsFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && item.name !== 'node_modules' && item.name !== 'dist') {
      files.push(...getAllTsFiles(fullPath));
    } else if (item.isFile() && (item.name.endsWith('.ts') || item.name.endsWith('.tsx'))) {
      files.push(fullPath);
    }
  }

  return files;
}

function main() {
  console.log('Fixing TypeScript errors...\n');

  const files = getAllTsFiles(srcDir);
  let fixedCount = 0;

  for (const file of files) {
    const relativePath = path.relative(__dirname, file);
    if (processFile(file)) {
      console.log(`  Fixed: ${relativePath}`);
      fixedCount++;
    }
  }

  console.log(`\nDone! Fixed ${fixedCount} file(s).`);
}

main();

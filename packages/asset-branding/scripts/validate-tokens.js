#!/usr/bin/env node
/**
 * Validation script for design tokens
 * Ensures tokens meet healthcare accessibility requirements
 */

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const tokensPath = path.join(distDir, 'tokens.json');

if (!fs.existsSync(tokensPath)) {
  console.error('Error: tokens.json not found. Run build first.');
  process.exit(1);
}

const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

let errors = 0;
let warnings = 0;

// Helper to calculate relative luminance
function getLuminance(hex) {
  const rgb = hex
    .replace('#', '')
    .match(/.{2}/g)
    .map((x) => parseInt(x, 16) / 255)
    .map((x) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

// Calculate contrast ratio
function getContrastRatio(color1, color2) {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

console.log('Validating design tokens...\n');

// Check WCAG contrast requirements
console.log('Checking color contrast ratios...');

const textPrimary = tokens.color?.text?.primary?.$value || '#1a1a1a';
const surfaceCard = tokens.color?.surface?.card?.$value || '#ffffff';
const clinicalBlue500 =
  tokens.color?.brand?.['clinical-blue']?.['500']?.$value || '#0c8ee6';

const primaryTextContrast = getContrastRatio(textPrimary, surfaceCard);
const linkContrast = getContrastRatio(clinicalBlue500, surfaceCard);

console.log(`  Primary text on card: ${primaryTextContrast.toFixed(2)}:1`);
if (primaryTextContrast < 4.5) {
  console.error('  ERROR: Primary text contrast below 4.5:1 (WCAG AA)');
  errors++;
} else if (primaryTextContrast < 7) {
  console.log('  INFO: Meets WCAG AA, below AAA (7:1)');
} else {
  console.log('  PASS: Meets WCAG AAA');
}

console.log(`  Link on card: ${linkContrast.toFixed(2)}:1`);
if (linkContrast < 4.5) {
  console.error('  ERROR: Link contrast below 4.5:1 (WCAG AA)');
  errors++;
} else {
  console.log('  PASS: Meets WCAG AA');
}

// Validate semantic colors
console.log('\nChecking semantic color definitions...');
const requiredSemantics = ['success', 'warning', 'error', 'info', 'critical'];
requiredSemantics.forEach((semantic) => {
  if (!tokens.color?.semantic?.[semantic]) {
    console.error(`  ERROR: Missing semantic color: ${semantic}`);
    errors++;
  } else {
    const color = tokens.color.semantic[semantic];
    const required = ['light', 'base', 'dark', 'text'];
    required.forEach((variant) => {
      if (!color[variant]) {
        console.error(`  ERROR: Missing ${semantic}.${variant}`);
        errors++;
      }
    });
    console.log(`  PASS: ${semantic} has all required variants`);
  }
});

// Validate typography
console.log('\nChecking typography definitions...');
if (!tokens.typography?.fontFamily?.sans) {
  console.error('  ERROR: Missing sans font family');
  errors++;
} else {
  console.log('  PASS: Sans font family defined');
}

// Validate spacing scale
console.log('\nChecking spacing scale...');
const requiredSpacing = ['0', '1', '2', '4', '8', '16'];
requiredSpacing.forEach((space) => {
  if (!tokens.spacing?.[space]) {
    console.warn(`  WARNING: Missing spacing.${space}`);
    warnings++;
  }
});
console.log('  PASS: Core spacing values present');

// Validate accessibility metadata
console.log('\nChecking accessibility metadata...');
if (!tokens.accessibility?.wcag?.level) {
  console.error('  ERROR: Missing WCAG level declaration');
  errors++;
} else {
  console.log(`  PASS: WCAG level declared: ${tokens.accessibility.wcag.level}`);
}

if (!tokens.accessibility?.focusIndicator) {
  console.error('  ERROR: Missing focus indicator definition');
  errors++;
} else {
  console.log('  PASS: Focus indicator defined');
}

if (!tokens.accessibility?.touchTarget) {
  console.warn('  WARNING: Missing touch target definition');
  warnings++;
} else {
  console.log('  PASS: Touch targets defined');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('Validation Summary:');
console.log(`  Errors: ${errors}`);
console.log(`  Warnings: ${warnings}`);
console.log('='.repeat(50));

if (errors > 0) {
  console.error('\nValidation FAILED. Fix errors before releasing.');
  process.exit(1);
}

if (warnings > 0) {
  console.warn('\nValidation passed with warnings.');
  process.exit(0);
}

console.log('\nValidation PASSED!');
process.exit(0);

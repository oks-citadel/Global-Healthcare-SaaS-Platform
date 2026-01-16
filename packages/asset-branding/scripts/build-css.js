#!/usr/bin/env node
/**
 * Build script for CSS theme
 * Processes and optimizes theme.css for distribution
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Read source CSS
const cssPath = path.join(srcDir, 'theme.css');
let css = fs.readFileSync(cssPath, 'utf-8');

// Add build header
const header = `/**
 * The Unified Health - Design System Theme
 * Generated: ${new Date().toISOString()}
 * Version: ${require('../package.json').version}
 *
 * DO NOT EDIT DIRECTLY - This file is auto-generated.
 * Edit src/theme.css instead and rebuild.
 */

`;

css = header + css;

// Write to dist
fs.writeFileSync(path.join(distDir, 'theme.css'), css);

// Create minified version
const minified = css
  .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
  .replace(/\s+/g, ' ') // Collapse whitespace
  .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around delimiters
  .trim();

fs.writeFileSync(path.join(distDir, 'theme.min.css'), minified);

console.log('CSS theme built successfully!');
console.log(`  - theme.css: ${(css.length / 1024).toFixed(2)} KB`);
console.log(`  - theme.min.css: ${(minified.length / 1024).toFixed(2)} KB`);

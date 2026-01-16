#!/usr/bin/env node
/**
 * Build script for design tokens
 * Generates optimized tokens.json for distribution
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy and validate tokens
const tokensPath = path.join(srcDir, 'tokens.json');
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

// Add build metadata
tokens.metadata = {
  ...tokens.metadata,
  builtAt: new Date().toISOString(),
  packageVersion: require('../package.json').version,
};

// Write optimized tokens
fs.writeFileSync(
  path.join(distDir, 'tokens.json'),
  JSON.stringify(tokens, null, 2)
);

// Copy theme files
const themeFiles = ['patient.theme.json', 'provider.theme.json'];
themeFiles.forEach((file) => {
  const srcPath = path.join(srcDir, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(distDir, file));
  }
});

console.log('Design tokens built successfully!');

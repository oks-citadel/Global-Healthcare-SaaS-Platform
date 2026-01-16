# @unified-health/asset-branding

Healthcare-grade brand system and design tokens for The Unified Health platform.

## Overview

This package provides the single source of truth for all visual identity across patient, provider, admin, and partner surfaces. It includes:

- **Design Tokens** - Colors, typography, spacing, shadows, and more
- **CSS Theme** - CSS custom properties for runtime styling
- **Role-Based Themes** - Patient and provider-specific configurations
- **SVG Icons** - Healthcare-specific iconography
- **Tailwind Preset** - Ready-to-use Tailwind CSS configuration

## Installation

```bash
pnpm add @unified-health/asset-branding
```

## Usage

### Import Design Tokens

```tsx
import tokens from '@unified-health/asset-branding/tokens';
import { clinicalBlue, semanticColors } from '@unified-health/asset-branding';

// Use color values
const primaryColor = clinicalBlue[500]; // #0c8ee6
```

### Import CSS Theme

```tsx
// In your app entry point
import '@unified-health/asset-branding/theme.css';
```

```css
/* Use CSS variables */
.button {
  background: var(--uh-clinical-blue-500);
  color: var(--uh-text-inverse);
}
```

### Tailwind CSS Preset

```javascript
// tailwind.config.js
const unifiedHealthPreset = require('@unified-health/asset-branding/tailwind');

module.exports = {
  presets: [unifiedHealthPreset],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
};
```

### Role-Based Theming

```tsx
import { getThemeByRole } from '@unified-health/asset-branding';

const theme = getThemeByRole('patient'); // or 'provider'
```

## Package Structure

```
dist/
├── index.js          # CommonJS bundle
├── index.mjs         # ESM bundle
├── index.d.ts        # TypeScript declarations
├── tokens.json       # Design tokens
├── theme.css         # CSS variables
├── patient.theme.json
└── provider.theme.json
icons/
├── healthcare.svg
├── shield-check.svg
└── ... (more icons)
```

## Design Principles

- **Clinical Blue** - Trust-first healthcare palette
- **Trust Black** - Clear, readable typography
- **Accent Green** - Restrained success indicators
- **Low Motion** - Accessibility-first animations
- **WCAG AA+** - Full accessibility compliance

## Version Policy

- **Major:** Breaking visual changes
- **Minor:** New tokens/components (backward compatible)
- **Patch:** Bug fixes, documentation

**IMPORTANT:** Always pin to specific versions. Never use `:latest`.

## Documentation

- [Brand System](/brand/brand-system.md)
- [UX Language Standards](/brand/ux-language-standards.md)
- [Clinical UX Checklist](/qa/clinical-ux-risk-checklist.md)
- [UI Trust Model](/docs/architecture/ui-trust-model.md)
- [Deployment Guide](/docs/deployment/asset-branding-guide.md)

## License

UNLICENSED - The Unified Health, Inc.

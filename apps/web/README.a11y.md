# Accessibility Implementation

This document provides a quick reference for the accessibility (a11y) implementation in the Unified Health Platform web application.

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Install accessibility testing tools
npm install --save-dev eslint-plugin-jsx-a11y cypress cypress-axe axe-core
```

### Usage

```tsx
// Import accessibility components
import { SkipLink, VisuallyHidden, FocusTrap, LiveRegion } from '@/components/a11y';

// Import accessibility hooks
import { useFocusManagement, useAriaLive, useReducedMotion } from '@/hooks/useA11y';

// Import layout components
import { PageLayout, Header, Main, Footer } from '@/components/layout';

// Import form components
import { FormField, TextAreaField, CheckboxField } from '@/components/forms/FormField';

// Import DataTable
import { DataTable } from '@/components/DataTable';
```

## File Structure

```
apps/web/
├── src/
│   ├── components/
│   │   ├── a11y/
│   │   │   ├── SkipLink.tsx          # Skip to main content
│   │   │   ├── VisuallyHidden.tsx    # Screen reader only text
│   │   │   ├── FocusTrap.tsx         # Focus management for modals
│   │   │   ├── LiveRegion.tsx        # ARIA live announcements
│   │   │   └── index.ts
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Semantic header with nav
│   │   │   ├── Main.tsx              # Main content area
│   │   │   ├── Footer.tsx            # Semantic footer
│   │   │   ├── PageLayout.tsx        # Page wrapper
│   │   │   └── index.ts
│   │   ├── forms/
│   │   │   └── FormField.tsx         # Accessible form fields
│   │   └── DataTable.tsx             # Accessible data table
│   ├── hooks/
│   │   └── useA11y.ts                # Accessibility hooks
│   ├── styles/
│   │   └── a11y.css                  # Accessibility styles
│   └── app/
│       └── layout.tsx                # Root layout
├── cypress/
│   ├── e2e/
│   │   └── a11y.spec.ts             # Accessibility tests
│   └── support/
│       └── commands.ts               # Custom commands
├── .eslintrc.js                      # ESLint with a11y rules
├── cypress.config.ts                 # Cypress configuration
└── tailwind.config.js                # Tailwind with a11y utilities
```

## Components

### SkipLink
```tsx
<SkipLink targetId="main-content">Skip to main content</SkipLink>
```

### VisuallyHidden
```tsx
<button>
  <IconEdit />
  <VisuallyHidden>Edit profile</VisuallyHidden>
</button>
```

### FocusTrap
```tsx
<FocusTrap active={isModalOpen}>
  <div role="dialog" aria-modal="true">
    Modal content
  </div>
</FocusTrap>
```

### LiveRegion
```tsx
<LiveRegion politeness="polite">
  Profile updated successfully
</LiveRegion>
```

## Hooks

### useFocusManagement
```tsx
const { focusFirst, focusLast, hasFocus } = useFocusManagement(containerRef);
```

### useAriaLive
```tsx
const { announce, LiveRegion } = useAriaLive();
announce('Data saved successfully', 'polite');
```

### useReducedMotion
```tsx
const { prefersReducedMotion, shouldAnimate } = useReducedMotion();
```

## Testing

```bash
# Run accessibility tests
npm run test:a11y

# Open Cypress UI
npm run test:a11y:open

# Lint for accessibility issues
npm run lint:a11y
```

## Documentation

Full documentation: [docs-unified/development/accessibility.md](../../docs-unified/development/accessibility.md)

## WCAG 2.1 AA Compliance

This implementation meets WCAG 2.1 Level AA standards:

- ✅ Perceivable (Images, color contrast, structure)
- ✅ Operable (Keyboard navigation, focus management)
- ✅ Understandable (Clear labels, error messages)
- ✅ Robust (Semantic HTML, ARIA attributes)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Screen readers: NVDA, JAWS, VoiceOver, TalkBack

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

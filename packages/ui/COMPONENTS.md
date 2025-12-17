# Component Reference

Quick reference guide for all available components in @healthcare/ui.

## Navigation

- [Button](#button)
- [Input](#input)
- [Select](#select)
- [Modal](#modal)
- [Card](#card)
- [Table](#table)
- [Badge](#badge)
- [Avatar](#avatar)
- [Alert](#alert)
- [Tabs](#tabs)
- [DatePicker](#datepicker)

---

## Button

Multi-purpose button component with loading states and icon support.

### Variants
- `primary` - Main call-to-action (blue background)
- `secondary` - Secondary actions (purple background)
- `outline` - Outlined style (transparent with border)
- `ghost` - Minimal style (no background)

### Sizes
- `sm` - Small (compact spacing)
- `md` - Medium (default)
- `lg` - Large (prominent)

### Features
- Loading spinner animation
- Left/right icon positioning
- Full-width option
- Disabled state support

---

## Input

Text input component with comprehensive form features.

### Input Types
- `text` - Standard text input
- `email` - Email validation
- `password` - Password masking
- `number` - Numeric input
- `tel` - Phone number
- `url` - URL validation

### Features
- Label and helper text
- Error state and message
- Prefix icon (search, email, etc.)
- Suffix icon (visibility toggle, etc.)
- Three size variants
- Full-width option

---

## Select

Advanced dropdown select with search and multi-select.

### Features
- Single selection mode
- Multi-selection mode with checkmarks
- Search/filter options
- Keyboard navigation
- Disabled options
- Custom placeholder
- Error state
- Helper text

### Use Cases
- Dropdown menus
- Multi-select filters
- Category selection
- Tag selection

---

## Modal

Accessible modal dialog for overlays and forms.

### Size Options
- `sm` - Small (max-w-md)
- `md` - Medium (max-w-lg)
- `lg` - Large (max-w-2xl)
- `xl` - Extra large (max-w-4xl)
- `full` - Full width (with margin)

### Features
- Close on overlay click (optional)
- Close on Escape key (optional)
- Custom header with title
- Scrollable content area
- Footer with action buttons
- Backdrop blur effect
- Body scroll lock

---

## Card

Versatile container component for content grouping.

### Sections
- Header - Title and metadata
- Body - Main content
- Footer - Actions and links

### Features
- Clickable variant for navigation
- Custom padding (none, sm, md, lg)
- Shadow levels (none, sm, md, lg)
- Border control
- Hover effects
- Button or div rendering

---

## Table

Enterprise-grade data table component.

### Features
- **Sorting**: Click column headers to sort
- **Pagination**: Built-in page controls
- **Selection**: Single or multi-row selection
- **Custom Rendering**: Render custom cell content
- **Loading State**: Loading spinner
- **Empty State**: Custom empty message
- **Striped Rows**: Alternating row colors
- **Hover Effect**: Row highlighting

### Column Configuration
```tsx
{
  key: 'field-name',
  header: 'Display Name',
  sortable: true,
  render: (item) => <CustomComponent />,
  width: '200px'
}
```

---

## Badge

Status indicator and label component.

### Variants
- `primary` - Blue
- `secondary` - Purple
- `success` - Green (active, completed)
- `warning` - Yellow (pending, caution)
- `error` - Red (failed, error)
- `info` - Blue (informational)
- `medical` - Teal (healthcare-specific)

### Features
- Three size options
- Rounded or pill style
- Optional status dot
- Semantic colors

---

## Avatar

User avatar with image or initials fallback.

### Sizes
- `xs` - 24px
- `sm` - 32px
- `md` - 40px
- `lg` - 48px
- `xl` - 64px
- `2xl` - 96px

### Features
- Image display
- Automatic initials generation
- Fallback to initials on error
- Status indicators (online, offline, away, busy)
- Circle or square shapes
- Gradient background for initials

---

## Alert

Contextual feedback and notification messages.

### Variants
- `info` - Informational messages (blue)
- `success` - Success confirmations (green)
- `warning` - Warning notices (yellow)
- `error` - Error messages (red)

### Features
- Optional title
- Dismissible with close button
- Default semantic icons
- Custom icon support
- Multi-line content support

---

## Tabs

Tab navigation for organizing content.

### Variants
- `line` - Underline style (default)
- `pills` - Pill button style
- `enclosed` - Enclosed box style

### Features
- Controlled and uncontrolled modes
- Icon support in tabs
- Disabled tab states
- Keyboard navigation (Arrow keys)
- Full-width option
- Active state indicators

---

## DatePicker

Calendar-based date selection component.

### Variants
- `DatePicker` - Single date selection
- `DateRangePicker` - Date range selection

### Features
- Calendar interface
- Min/max date constraints
- Date formatting (via date-fns)
- Disabled dates
- Keyboard navigation
- Accessible controls
- Month/year navigation
- Today highlighting

---

## Color System

### Healthcare Palette

**Primary (Blue)**
- Main actions, links, primary buttons
- Conveys trust and professionalism

**Secondary (Purple)**
- Secondary actions, highlights
- Adds visual interest

**Success (Green)**
- Positive outcomes, confirmations
- Active/healthy states

**Warning (Yellow)**
- Cautions, pending states
- Attention required

**Error (Red)**
- Errors, critical issues
- Failed operations

**Info (Blue)**
- Informational messages
- Helpful tips

**Medical (Teal)**
- Healthcare-specific elements
- Medical badges and indicators

Each color has 11 shades (50-950) for maximum flexibility.

---

## Accessibility

All components follow WCAG 2.1 Level AA guidelines:

- Keyboard navigation support
- ARIA labels and roles
- Focus indicators
- Semantic HTML
- Color contrast ratios
- Screen reader compatibility

---

## Design Principles

1. **Consistency**: Uniform spacing, colors, and patterns
2. **Accessibility**: WCAG compliant, keyboard accessible
3. **Flexibility**: Customizable props and styling
4. **Performance**: Optimized rendering, tree-shakeable
5. **Healthcare-First**: Built for medical workflows
6. **Type Safety**: Full TypeScript support
7. **Responsive**: Mobile-friendly by default

---

## Best Practices

### Forms
- Always provide labels for inputs
- Show error messages inline
- Use helper text for guidance
- Group related fields

### Tables
- Keep columns under 10 for readability
- Use pagination for large datasets
- Provide sort functionality for data exploration
- Show loading states during data fetch

### Modals
- Use for focused tasks
- Don't nest modals
- Provide clear close options
- Keep content concise

### Feedback
- Use appropriate Alert variants
- Show loading states for async operations
- Provide success confirmations
- Make errors actionable

---

## Component Size Guide

| Component | Small | Medium | Large |
|-----------|-------|--------|-------|
| Button | 32px | 40px | 52px |
| Input | 32px | 40px | 52px |
| Badge | 20px | 24px | 32px |
| Avatar | 24px | 32px | 48px |

---

## Import Patterns

```tsx
// Named imports (recommended)
import { Button, Input, Card } from '@healthcare/ui';

// Individual imports (tree-shaking)
import { Button } from '@healthcare/ui/Button';

// Type imports
import type { ButtonProps } from '@healthcare/ui';
```

---

## Theming

Customize the component library by extending the Tailwind config:

```javascript
// tailwind.config.js
module.exports = {
  presets: [
    require('@healthcare/ui/tailwind.config.js')
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          // Your custom colors
        }
      }
    }
  }
}
```

---

For detailed usage examples, see [EXAMPLES.md](./EXAMPLES.md).
For installation and setup, see [README.md](./README.md).

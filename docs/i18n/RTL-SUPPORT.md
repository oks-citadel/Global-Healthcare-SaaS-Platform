# RTL (Right-to-Left) Language Support

This document describes the implementation and testing of Right-to-Left (RTL) language support in the Global Healthcare SaaS Platform.

## Overview

The platform fully supports RTL languages to ensure accessibility and usability for users in regions where RTL scripts are predominant. Our RTL implementation follows industry best practices and WCAG accessibility guidelines.

## Supported RTL Languages

| Language | Code | Status | Coverage |
|----------|------|--------|----------|
| Arabic | `ar` | Full Support | 100% |
| Hebrew | `he` | Full Support | 100% |
| Farsi/Persian | `fa` | Full Support | 100% |
| Urdu | `ur` | Partial Support | 85% |
| Pashto | `ps` | Planned | - |
| Sindhi | `sd` | Planned | - |

## How RTL is Implemented

### 1. Document Direction

The `dir` attribute is set on the `<html>` element based on the user's selected language:

```html
<!-- LTR Language (English) -->
<html lang="en" dir="ltr">

<!-- RTL Language (Arabic) -->
<html lang="ar" dir="rtl">
```

### 2. Language Detection Flow

```
User Request
    │
    ▼
┌─────────────────────┐
│ Check URL Parameter │
│ (?lang=ar)          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Check User Profile  │
│ Language Preference │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Check Browser       │
│ Accept-Language     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Apply Default       │
│ (English - LTR)     │
└─────────────────────┘
```

### 3. CSS Implementation

#### Using CSS Logical Properties

We use CSS logical properties instead of physical properties for automatic RTL adaptation:

```css
/* Avoid physical properties */
.card {
  /* Don't use: margin-left, padding-right, etc. */
}

/* Use logical properties */
.card {
  margin-inline-start: 1rem;  /* margin-left in LTR, margin-right in RTL */
  margin-inline-end: 0.5rem;  /* margin-right in LTR, margin-left in RTL */
  padding-inline: 1rem;       /* padding-left and padding-right */
  padding-block: 0.5rem;      /* padding-top and padding-bottom */
}
```

#### Common Property Mappings

| Physical Property | Logical Property |
|-------------------|------------------|
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `left` | `inset-inline-start` |
| `right` | `inset-inline-end` |
| `text-align: left` | `text-align: start` |
| `text-align: right` | `text-align: end` |
| `float: left` | `float: inline-start` |
| `float: right` | `float: inline-end` |
| `border-left` | `border-inline-start` |
| `border-right` | `border-inline-end` |

#### RTL-Specific Overrides

For cases requiring explicit RTL handling:

```css
/* Base styles (LTR) */
.icon-arrow {
  transform: rotate(0deg);
}

/* RTL override using :dir() pseudo-class */
.icon-arrow:dir(rtl) {
  transform: rotate(180deg);
}

/* Alternative: Using [dir="rtl"] selector */
[dir="rtl"] .icon-arrow {
  transform: rotate(180deg);
}
```

### 4. Component-Level Implementation

#### React Component Example

```tsx
import { useDirection } from '@/hooks/useDirection';

export function NavigationArrow() {
  const { isRTL } = useDirection();

  return (
    <svg
      className="nav-arrow"
      style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }}
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}
```

#### Direction Hook

```tsx
// hooks/useDirection.ts
import { useRouter } from 'next/router';

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

export function useDirection() {
  const { locale } = useRouter();

  const isRTL = RTL_LANGUAGES.includes(locale || 'en');
  const direction = isRTL ? 'rtl' : 'ltr';

  return { isRTL, direction };
}
```

### 5. Layout Mirroring

#### Flex and Grid Layouts

Flexbox and Grid layouts automatically mirror in RTL when using `dir="rtl"`:

```css
/* This automatically mirrors in RTL */
.flex-container {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

/* Use logical alignment */
.flex-container {
  justify-content: flex-start; /* Start of reading direction */
}
```

#### Manual Mirroring When Needed

```css
/* Icons that need explicit mirroring */
.directional-icon {
  transform: scaleX(1);
}

[dir="rtl"] .directional-icon {
  transform: scaleX(-1);
}

/* Exception: Icons that should NOT mirror */
.universal-icon {
  /* Clock, checkmark, X, etc. - same in all directions */
}
```

### 6. Fonts and Typography

#### Font Family Configuration

```css
:root {
  --font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-family-arabic: 'Noto Sans Arabic', 'Traditional Arabic', sans-serif;
  --font-family-hebrew: 'Noto Sans Hebrew', 'Arial Hebrew', sans-serif;
}

body {
  font-family: var(--font-family-base);
}

[lang="ar"] body,
[lang="fa"] body,
[lang="ur"] body {
  font-family: var(--font-family-arabic);
}

[lang="he"] body {
  font-family: var(--font-family-hebrew);
}
```

#### Line Height Adjustments

Arabic and other RTL scripts may require different line heights:

```css
[dir="rtl"] {
  line-height: 1.8; /* Slightly increased for RTL scripts */
}
```

### 7. Form Elements

#### Input Fields

```css
/* Text inputs automatically flip in RTL */
input[type="text"],
input[type="email"],
input[type="password"],
textarea {
  text-align: start; /* Inherits direction */
}

/* Number inputs may need special handling */
input[type="number"] {
  direction: ltr; /* Numbers always LTR */
  text-align: end; /* Align to end in RTL context */
}
```

#### Phone Number Inputs

```css
/* Phone numbers should remain LTR */
input[type="tel"] {
  direction: ltr;
  unicode-bidi: embed;
}
```

### 8. Tables

```css
/* Tables automatically mirror in RTL */
table {
  text-align: start;
}

/* First/last column styling */
td:first-child {
  padding-inline-start: 1rem;
}

td:last-child {
  padding-inline-end: 1rem;
}
```

## Testing RTL Layouts

### Manual Testing Checklist

1. **Text Alignment**
   - [ ] All text aligns to the right in RTL mode
   - [ ] Headlines and body text properly aligned
   - [ ] Numbers and special characters display correctly

2. **Layout Mirroring**
   - [ ] Navigation moves to the right side
   - [ ] Sidebars flip position
   - [ ] Cards and containers mirror correctly
   - [ ] Spacing is consistent (no visual gaps)

3. **Icons and Images**
   - [ ] Directional icons mirror appropriately
   - [ ] Non-directional icons remain unchanged
   - [ ] Images with text are properly handled

4. **Forms**
   - [ ] Input fields align correctly
   - [ ] Labels position correctly relative to inputs
   - [ ] Validation messages appear in correct position
   - [ ] Form buttons align to expected position

5. **Navigation**
   - [ ] Menu items read right-to-left
   - [ ] Dropdowns open in correct direction
   - [ ] Breadcrumbs display in correct order
   - [ ] Back/forward arrows mirror

6. **Modals and Dialogs**
   - [ ] Close button in correct corner
   - [ ] Content aligns correctly
   - [ ] Buttons positioned appropriately

### Automated Testing

See `/tests/i18n/rtl-verification.spec.ts` for automated RTL layout tests.

```bash
# Run RTL tests
pnpm test:i18n

# Run specific RTL tests
npx playwright test rtl-verification
```

### Browser DevTools Testing

1. **Chrome DevTools**:
   - Open Elements panel
   - Find `<html>` element
   - Add `dir="rtl"` attribute
   - Observe layout changes

2. **Firefox**:
   - Use Layout panel for Flexbox/Grid debugging
   - Toggle `dir` attribute in Inspector

### Testing Tools

- **Playwright**: Automated cross-browser RTL testing
- **Storybook**: Visual component testing with RTL decorator
- **BrowserStack**: Cross-browser/device RTL testing

## Known Limitations

### 1. Third-Party Components

Some third-party components may not fully support RTL:

| Component | Issue | Workaround |
|-----------|-------|------------|
| Date Picker | Calendar doesn't mirror | Use custom RTL date picker |
| Rich Text Editor | Mixed content issues | Wrap in RTL-aware container |
| Charts | Axis labels may overlap | Custom chart configuration |

### 2. Mixed Content

Bidirectional text (mixing RTL and LTR content) can cause issues:

```html
<!-- Problematic -->
<p>The API endpoint is https://api.example.com in Arabic: نقطة النهاية</p>

<!-- Solution: Use unicode-bidi -->
<p>The API endpoint is <span dir="ltr">https://api.example.com</span> in Arabic: نقطة النهاية</p>
```

### 3. PDF Generation

PDF exports may require separate RTL handling:
- Use RTL-compatible PDF libraries
- Pre-process content for proper text direction

### 4. Email Templates

HTML emails have limited RTL support:
- Use inline `dir="rtl"` attributes
- Test across email clients
- Provide plain-text RTL alternatives

### 5. Animations

Some animations may need adjustment for RTL:

```css
/* LTR animation */
@keyframes slide-in {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

/* RTL animation */
@keyframes slide-in-rtl {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* Apply based on direction */
.slide-element {
  animation: slide-in 0.3s ease-out;
}

[dir="rtl"] .slide-element {
  animation: slide-in-rtl 0.3s ease-out;
}
```

## Best Practices

### DO

- Use CSS logical properties everywhere
- Test with real RTL content, not just mirrored LTR
- Include native speakers in testing
- Support bidirectional text properly
- Use `unicode-bidi` for embedded LTR content
- Design components with RTL in mind from the start

### DON'T

- Hard-code `left` and `right` in styles
- Use directional icons without mirroring logic
- Assume all RTL languages have same requirements
- Forget to test form validation in RTL
- Ignore scrollbar position in RTL contexts

## Resources

- [MDN: CSS Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
- [W3C: Structural Markup and Right-to-left Text](https://www.w3.org/International/questions/qa-html-dir)
- [RTL Styling 101](https://rtlstyling.com/)
- [Material Design: Bidirectionality](https://material.io/design/usability/bidirectionality.html)

## Contact

For RTL-related questions or issues:
- Create an issue with the `i18n` and `rtl` labels
- Contact the internationalization team

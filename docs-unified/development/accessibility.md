# Accessibility Guidelines (WCAG 2.1 AA)

## Overview

This document outlines the accessibility standards and guidelines for the Unified Health Platform. We are committed to meeting **WCAG 2.1 Level AA** compliance to ensure our platform is accessible to all users, including those with disabilities.

## Table of Contents

- [Core Principles](#core-principles)
- [Components and Utilities](#components-and-utilities)
- [Implementation Guidelines](#implementation-guidelines)
- [Testing Checklist](#testing-checklist)
- [Common Patterns](#common-patterns)
- [Resources](#resources)

---

## Core Principles

### POUR: The Foundation of Accessibility

1. **Perceivable**: Information must be presentable to users in ways they can perceive
2. **Operable**: User interface components must be operable
3. **Understandable**: Information and operation must be understandable
4. **Robust**: Content must be robust enough to work with assistive technologies

### WCAG 2.1 Level AA Requirements

We aim to meet all Level A and AA success criteria:

- **Level A**: Minimum level of accessibility
- **Level AA**: Recommended level for most content
- **Level AAA**: Highest level (we strive for this where feasible)

---

## Components and Utilities

### Accessibility Components (`apps/web/src/components/a11y/`)

#### SkipLink
Allows keyboard users to skip repetitive navigation.

```tsx
import { SkipLink } from '@/components/a11y';

// Basic usage
<SkipLink targetId="main-content">Skip to main content</SkipLink>

// Multiple skip links
<SkipLinks
  links={[
    { targetId: 'main-content', label: 'Skip to main content' },
    { targetId: 'main-navigation', label: 'Skip to navigation' },
  ]}
/>
```

**WCAG:** 2.4.1 Bypass Blocks (Level A)

#### VisuallyHidden
Hides content visually while keeping it accessible to screen readers.

```tsx
import { VisuallyHidden } from '@/components/a11y';

<button>
  <IconEdit />
  <VisuallyHidden>Edit profile</VisuallyHidden>
</button>
```

**WCAG:** 1.3.1 Info and Relationships (Level A), 2.4.4 Link Purpose (Level A)

#### FocusTrap
Traps keyboard focus within a container (essential for modals).

```tsx
import { FocusTrap } from '@/components/a11y';

<FocusTrap active={isModalOpen}>
  <div role="dialog" aria-modal="true">
    <h2>Modal Title</h2>
    <button onClick={closeModal}>Close</button>
  </div>
</FocusTrap>
```

**WCAG:** 2.1.2 No Keyboard Trap (Level A), 2.4.3 Focus Order (Level A)

#### LiveRegion
Announces dynamic content changes to screen readers.

```tsx
import { LiveRegion, StatusMessage } from '@/components/a11y';

// Success message
<StatusMessage type="success">
  Profile updated successfully
</StatusMessage>

// Error message (assertive)
<StatusMessage type="error">
  Please correct the form errors
</StatusMessage>

// Custom live region
<LiveRegion politeness="polite" visuallyHidden>
  Loading complete, {itemCount} items found
</LiveRegion>
```

**WCAG:** 4.1.3 Status Messages (Level AA)

### Accessibility Hooks (`apps/web/src/hooks/useA11y.ts`)

#### useFocusManagement
Manages focus state and navigation.

```tsx
import { useFocusManagement } from '@/hooks/useA11y';

const MyComponent = () => {
  const containerRef = useRef(null);
  const { focusFirst, focusLast, hasFocus } = useFocusManagement(containerRef);

  return (
    <div ref={containerRef}>
      <button onClick={focusFirst}>Focus First</button>
      {/* ... */}
    </div>
  );
};
```

#### useAriaLive
Programmatic announcements for screen readers.

```tsx
import { useAriaLive } from '@/hooks/useA11y';

const MyComponent = () => {
  const { announce, LiveRegion } = useAriaLive();

  const handleSave = async () => {
    await saveData();
    announce('Data saved successfully', 'polite');
  };

  return (
    <>
      <button onClick={handleSave}>Save</button>
      <LiveRegion />
    </>
  );
};
```

#### useReducedMotion
Respects user's motion preferences.

```tsx
import { useReducedMotion } from '@/hooks/useA11y';

const MyComponent = () => {
  const { prefersReducedMotion, shouldAnimate } = useReducedMotion();

  return (
    <motion.div
      animate={shouldAnimate ? { x: 100 } : {}}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
    >
      Content
    </motion.div>
  );
};
```

**WCAG:** 2.3.3 Animation from Interactions (Level AAA)

#### useKeyboardNavigation
Custom keyboard navigation patterns.

```tsx
import { useKeyboardNavigation } from '@/hooks/useA11y';

const { handleKeyDown } = useKeyboardNavigation({
  onEnter: () => selectItem(),
  onEscape: () => close(),
  onArrowDown: () => focusNext(),
  onArrowUp: () => focusPrevious(),
});

<div onKeyDown={handleKeyDown}>{/* ... */}</div>
```

---

## Implementation Guidelines

### 1. Semantic HTML

Always use semantic HTML elements for their intended purpose.

**✅ Good:**
```tsx
<header role="banner">
  <nav role="navigation" aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main id="main-content" role="main">
  <h1>Page Title</h1>
  <article>...</article>
</main>

<footer role="contentinfo">
  <p>&copy; 2024 Unified Health</p>
</footer>
```

**❌ Bad:**
```tsx
<div class="header">
  <div class="nav">
    <div class="nav-item">Home</div>
  </div>
</div>
```

**WCAG:** 1.3.1 Info and Relationships (Level A)

### 2. Keyboard Navigation

All interactive elements must be keyboard accessible.

**Requirements:**
- All interactive elements must be focusable
- Focus order must be logical
- Focus indicators must be visible
- No keyboard traps

**✅ Good:**
```tsx
<button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
  className="focus:ring-2 focus:ring-blue-500"
>
  Submit
</button>
```

**Testing:**
- Tab through all interactive elements
- Ensure focus indicator is visible
- Test Enter/Space on buttons
- Test Escape to close modals

**WCAG:** 2.1.1 Keyboard (Level A), 2.4.7 Focus Visible (Level AA)

### 3. Forms and Labels

Every form input must have an associated label.

**✅ Good:**
```tsx
// Option 1: Associated label
<label htmlFor="email">Email Address</label>
<input
  id="email"
  type="email"
  required
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && (
  <div id="email-error" role="alert">
    Please enter a valid email address
  </div>
)}

// Option 2: aria-label
<input
  type="email"
  aria-label="Email Address"
  required
/>

// Option 3: Wrapped label
<label>
  Email Address
  <input type="email" required />
</label>
```

**Required field indicators:**
```tsx
<label htmlFor="name" className="required">
  Full Name
  <VisuallyHidden>(required)</VisuallyHidden>
</label>
```

**Error messages:**
```tsx
<input
  id="email"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && (
  <div id="email-error" role="alert" className="error-message">
    Please enter a valid email address
  </div>
)}
```

**WCAG:** 1.3.1 Info and Relationships (Level A), 3.3.1 Error Identification (Level A), 3.3.2 Labels or Instructions (Level A)

### 4. Color Contrast

Ensure sufficient color contrast ratios.

**Requirements:**
- Normal text (< 18pt): 4.5:1
- Large text (≥ 18pt or 14pt bold): 3:1
- UI components and graphics: 3:1

**Tools:**
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools Accessibility Panel
- axe DevTools

**✅ Good color combinations:**
```css
/* Text on white background */
color: #1f2937; /* gray-800: 11.46:1 */
color: #374151; /* gray-700: 8.59:1 */

/* Text on dark background */
background: #1f2937;
color: #f3f4f6; /* gray-100: 11.46:1 */
```

**❌ Bad:**
```css
color: #9ca3af; /* gray-400 on white: 2.85:1 - Too low! */
```

**WCAG:** 1.4.3 Contrast (Minimum) (Level AA), 1.4.11 Non-text Contrast (Level AA)

### 5. Images and Alternative Text

All images must have appropriate alt text.

**✅ Good:**
```tsx
// Meaningful image
<img src="doctor.jpg" alt="Dr. Smith examining patient" />

// Decorative image
<img src="pattern.svg" alt="" role="presentation" />

// Complex image
<figure>
  <img src="chart.png" alt="Blood pressure chart" />
  <figcaption id="chart-desc">
    Chart showing blood pressure readings over 6 months,
    with systolic pressure ranging from 120-140 mmHg.
  </figcaption>
</figure>

// Icon button
<button aria-label="Close dialog">
  <CloseIcon aria-hidden="true" />
</button>
```

**Alt text guidelines:**
- Describe the content and function
- Be concise (< 150 characters)
- Don't include "image of" or "picture of"
- Use `alt=""` for decorative images
- Use `aria-label` for icon buttons

**WCAG:** 1.1.1 Non-text Content (Level A)

### 6. Headings and Structure

Use proper heading hierarchy.

**✅ Good:**
```tsx
<h1>Dashboard</h1>
  <h2>Appointments</h2>
    <h3>Today's Appointments</h3>
    <h3>Upcoming Appointments</h3>
  <h2>Messages</h2>
    <h3>Unread Messages</h3>
```

**❌ Bad:**
```tsx
<h1>Dashboard</h1>
  <h3>Appointments</h3> {/* Skipped h2! */}
    <h4>Today</h4>
  <h2>Messages</h2>
```

**Rules:**
- Start with `<h1>` (only one per page)
- Don't skip heading levels
- Use headings for structure, not styling

**WCAG:** 1.3.1 Info and Relationships (Level A), 2.4.6 Headings and Labels (Level AA)

### 7. Tables

Data tables must have proper structure.

**✅ Good:**
```tsx
<table>
  <caption>Patient Appointments</caption>
  <thead>
    <tr>
      <th scope="col">Patient Name</th>
      <th scope="col">Date</th>
      <th scope="col">Time</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">John Doe</th>
      <td>2024-01-15</td>
      <td>10:00 AM</td>
      <td>Confirmed</td>
    </tr>
  </tbody>
</table>
```

**Or use our DataTable component:**
```tsx
<DataTable
  caption="Patient Appointments"
  data={appointments}
  columns={[
    { id: 'name', header: 'Patient Name', accessorKey: 'name', scope: 'row' },
    { id: 'date', header: 'Date', accessorKey: 'date', sortable: true },
    { id: 'time', header: 'Time', accessorKey: 'time' },
  ]}
/>
```

**WCAG:** 1.3.1 Info and Relationships (Level A)

### 8. Modal Dialogs

Accessible modal implementation.

**✅ Good:**
```tsx
import { FocusTrap } from '@/components/a11y';

const [isOpen, setIsOpen] = useState(false);

<FocusTrap active={isOpen}>
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    aria-describedby="modal-desc"
  >
    <h2 id="modal-title">Confirm Appointment</h2>
    <p id="modal-desc">Please confirm your appointment for...</p>

    <button onClick={() => setIsOpen(false)}>Cancel</button>
    <button onClick={handleConfirm}>Confirm</button>
  </div>
</FocusTrap>
```

**Requirements:**
- Use `role="dialog"` and `aria-modal="true"`
- Label with `aria-labelledby` and `aria-describedby`
- Trap focus within modal
- Close on Escape key
- Return focus on close
- Prevent background scrolling

**WCAG:** 2.1.2 No Keyboard Trap (Level A), 2.4.3 Focus Order (Level A)

### 9. Touch Target Size

Interactive elements must be large enough.

**Minimum size: 44x44 pixels** (WCAG 2.5.5 Level AAA)

**✅ Good:**
```tsx
<button className="min-h-[44px] min-w-[44px] px-4 py-2">
  Save
</button>
```

**WCAG:** 2.5.5 Target Size (Level AAA)

### 10. Reduced Motion

Respect user's motion preferences.

**CSS:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**JavaScript:**
```tsx
import { useReducedMotion } from '@/hooks/useA11y';

const { shouldAnimate } = useReducedMotion();

<motion.div
  animate={shouldAnimate ? { opacity: 1 } : {}}
>
  Content
</motion.div>
```

**WCAG:** 2.3.3 Animation from Interactions (Level AAA)

---

## Testing Checklist

### Manual Testing

#### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical and intuitive
- [ ] Focus indicators are clearly visible
- [ ] No keyboard traps exist
- [ ] Skip links work correctly
- [ ] Modal focus management works
- [ ] Escape key closes modals/dropdowns

#### Screen Reader Testing
- [ ] All images have appropriate alt text
- [ ] Form inputs have labels
- [ ] Error messages are announced
- [ ] Status messages are announced
- [ ] Dynamic content changes are announced
- [ ] Page title is descriptive
- [ ] Landmark regions are properly labeled
- [ ] Heading hierarchy is logical

#### Visual Testing
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators are visible
- [ ] Text is readable at 200% zoom
- [ ] Layout works with text spacing adjustments
- [ ] UI works without color alone
- [ ] Works in high contrast mode

#### Mobile/Touch Testing
- [ ] Touch targets are at least 44x44px
- [ ] Works with screen reader (VoiceOver/TalkBack)
- [ ] Works with zoom enabled
- [ ] No horizontal scrolling at 320px width

### Automated Testing

#### Using Cypress + axe

```bash
# Install dependencies
npm install --save-dev cypress cypress-axe axe-core

# Run tests
npx cypress run --spec "cypress/e2e/a11y.spec.ts"
```

#### Using ESLint

```bash
# Lint for accessibility issues
npm run lint
```

#### Browser Extensions

- **axe DevTools**: Comprehensive accessibility scanner
- **WAVE**: Visual accessibility checker
- **Lighthouse**: Accessibility audit in Chrome DevTools

### CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
- name: Run Accessibility Tests
  run: npm run test:a11y

- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
  with:
    configPath: './.lighthouserc.json'
```

---

## Common Patterns

### Accessible Button

```tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  'aria-label'?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  'aria-label': ariaLabel,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className={clsx(
      'px-4 py-2 rounded-lg',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'min-h-[44px] min-w-[44px]',
      variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
      variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300'
    )}
  >
    {children}
  </button>
);
```

### Accessible Form

```tsx
const Form = () => {
  const [errors, setErrors] = useState({});
  const { announce } = useAriaLive();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation logic
    if (Object.keys(errors).length > 0) {
      announce(`Form has ${Object.keys(errors).length} errors. Please correct them.`, 'assertive');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="required">
          Email Address
          <VisuallyHidden>(required)</VisuallyHidden>
        </label>
        <input
          id="email"
          type="email"
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <div id="email-error" role="alert" className="error-message">
            {errors.email}
          </div>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};
```

### Accessible Dropdown

```tsx
const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { handleKeyDown } = useKeyboardNavigation({
    onEscape: () => setIsOpen(false),
    onEnter: () => setIsOpen(!isOpen),
  });

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="dropdown-menu"
      >
        Options
      </button>

      {isOpen && (
        <ul
          id="dropdown-menu"
          role="menu"
          className="absolute mt-2"
        >
          <li role="menuitem">
            <button>Option 1</button>
          </li>
          <li role="menuitem">
            <button>Option 2</button>
          </li>
        </ul>
      )}
    </div>
  );
};
```

---

## Resources

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Screen Readers
- **Windows**: NVDA (free), JAWS
- **macOS**: VoiceOver (built-in)
- **iOS**: VoiceOver (built-in)
- **Android**: TalkBack (built-in)

### Training
- [Web Accessibility Course (Udacity)](https://www.udacity.com/course/web-accessibility--ud891)
- [Accessibility Fundamentals (Deque University)](https://dequeuniversity.com/)
- [Microsoft Accessibility Fundamentals](https://docs.microsoft.com/en-us/learn/paths/accessibility-fundamentals/)

---

## Questions?

For accessibility questions or issues:
1. Check this documentation first
2. Review WCAG 2.1 guidelines
3. Test with screen readers
4. Consult the team's accessibility champion
5. Open an issue on GitHub with the `a11y` label

---

**Last Updated:** December 2024
**Maintained By:** Frontend Team
**Version:** 1.0.0

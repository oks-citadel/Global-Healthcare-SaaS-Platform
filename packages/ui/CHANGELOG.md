# Changelog

All notable changes to the @healthcare/ui component library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-17

### Added

#### Core Components
- **Button**: Multi-variant button component with loading states and icon support
  - Variants: primary, secondary, outline, ghost
  - Sizes: sm, md, lg
  - Loading state with spinner animation
  - Left/right icon positioning
  - Full-width option

- **Input**: Form input component with comprehensive features
  - Types: text, email, password, number
  - Label and helper text support
  - Error state handling
  - Prefix and suffix icon support
  - Size variants: sm, md, lg

- **Select**: Advanced dropdown select component
  - Single and multi-select modes
  - Search/filter functionality
  - Keyboard navigation
  - Custom option rendering
  - Disabled states

- **Modal**: Accessible modal dialog component
  - Multiple size options (sm, md, lg, xl, full)
  - Close on overlay click
  - Close on Escape key
  - Customizable header and footer
  - Body scroll lock when open

- **Card**: Versatile container component
  - Header, body, and footer sections
  - Clickable variant for interactive cards
  - Customizable padding and shadows
  - Hover effects
  - Border controls

- **Table**: Feature-rich data table
  - Sortable columns
  - Pagination support
  - Row selection (single/multiple)
  - Custom cell rendering
  - Loading state
  - Striped and hover variants
  - Empty state handling

- **Badge**: Status indicator component
  - Multiple variants: primary, secondary, success, warning, error, info, medical
  - Size options: sm, md, lg
  - Rounded and pill styles
  - Optional status dot

- **Avatar**: User avatar component
  - Image or initials display
  - Fallback to initials when image fails
  - Size variants: xs, sm, md, lg, xl, 2xl
  - Status indicators: online, offline, away, busy
  - Circle or square shapes

- **Alert**: Contextual feedback messages
  - Variants: info, success, warning, error
  - Optional title
  - Dismissible option
  - Custom icons
  - Default semantic icons

- **Tabs**: Tab navigation component
  - Multiple variants: line, pills, enclosed
  - Controlled and uncontrolled modes
  - Icon support
  - Disabled tab states
  - Full-width option
  - Keyboard navigation

- **DatePicker**: Calendar date selection
  - Single date picker
  - Date range picker (DateRangePicker)
  - Min/max date constraints
  - Accessible calendar interface
  - Custom date formatting
  - Integration with date-fns

#### Design System

- **Healthcare-Focused Color Palette**
  - Primary (blue): Main actions and branding
  - Secondary (purple): Secondary actions
  - Success (green): Positive outcomes
  - Warning (yellow): Caution states
  - Error (red): Error states
  - Info (blue): Informational messages
  - Medical (teal): Healthcare-specific elements

- **Typography System**
  - Font families: Inter (sans), Cal Sans (display)
  - Comprehensive font size scale (xs to 5xl)
  - Optimized line heights

- **Spacing and Layout**
  - Consistent padding and margin scales
  - Responsive breakpoints
  - Shadow system (sm, md, lg, xl)
  - Border radius variants

#### Build and Development

- TypeScript support with full type definitions
- TailwindCSS for styling
- tsup for fast bundling
- ESM and CJS module formats
- Source maps for debugging
- Tree-shakeable exports
- PostCSS with Autoprefixer

#### Documentation

- Comprehensive README with installation and usage
- Component API documentation
- Real-world usage examples (EXAMPLES.md)
- Healthcare-specific use cases
- Form, table, and dashboard examples

### Dependencies

#### Peer Dependencies
- react ^18.0.0
- react-dom ^18.0.0
- tailwindcss ^3.0.0

#### Dependencies
- clsx ^2.0.0 - Conditional class names
- date-fns ^3.0.0 - Date utilities
- react-day-picker ^8.10.0 - Calendar component

#### Dev Dependencies
- TypeScript ^5.3.0
- tsup ^8.0.0
- ESLint ^8.0.0
- Autoprefixer ^10.4.0
- PostCSS ^8.4.0

### Project Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── Alert.tsx
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── DatePicker.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Select.tsx
│   │   ├── Table.tsx
│   │   └── Tabs.tsx
│   └── index.ts
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.js
├── .gitignore
├── README.md
├── EXAMPLES.md
└── CHANGELOG.md
```

### Notes

This is the initial release of the @healthcare/ui component library, designed specifically for the Unified Healthcare Platform. All components follow accessibility best practices and are built with healthcare workflows in mind.

[1.0.0]: https://github.com/healthcare/ui/releases/tag/v1.0.0

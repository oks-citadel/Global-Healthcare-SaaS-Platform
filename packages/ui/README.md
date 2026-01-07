# @healthcare/ui

Shared UI component library for the Unified Health Platform. Built with React, TypeScript, and TailwindCSS.

## Installation

```bash
npm install @healthcare/ui
# or
pnpm add @healthcare/ui
# or
yarn add @healthcare/ui
```

## Setup

### 1. Install Peer Dependencies

```bash
npm install react react-dom tailwindcss
```

### 2. Configure Tailwind

In your `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@healthcare/ui/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [
    require('@healthcare/ui/tailwind.config.js'),
  ],
}
```

## Components

### Button

A versatile button component with multiple variants and states.

```tsx
import { Button } from '@healthcare/ui';

<Button variant="primary" size="md" loading={false}>
  Click me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `icon`: React.ReactNode
- `iconPosition`: 'left' | 'right'
- `fullWidth`: boolean

### Input

Text input with label, helper text, and error states.

```tsx
import { Input } from '@healthcare/ui';

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error="Invalid email"
  helperText="We'll never share your email"
  prefixIcon={<MailIcon />}
/>
```

**Props:**
- `label`: string
- `helperText`: string
- `error`: string
- `prefixIcon`: React.ReactNode
- `suffixIcon`: React.ReactNode
- `inputSize`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean

### Select

Dropdown select with search and multi-select support.

```tsx
import { Select } from '@healthcare/ui';

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
];

<Select
  label="Choose option"
  options={options}
  value={selectedValue}
  onChange={setSelectedValue}
  searchable
  multiSelect
/>
```

**Props:**
- `label`: string
- `options`: SelectOption[]
- `value`: string | string[]
- `onChange`: (value: string | string[]) => void
- `placeholder`: string
- `multiSelect`: boolean
- `searchable`: boolean

### Modal

Accessible modal dialog with customizable content.

```tsx
import { Modal, Button } from '@healthcare/ui';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"
  closeOnOverlay
  closeOnEscape
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button variant="primary">Confirm</Button>
    </>
  }
>
  <p>Modal content goes here</p>
</Modal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `children`: React.ReactNode
- `footer`: React.ReactNode
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `closeOnOverlay`: boolean
- `closeOnEscape`: boolean

### Card

Container component with header, body, and footer sections.

```tsx
import { Card } from '@healthcare/ui';

<Card
  header="Card Title"
  footer={<Button>Action</Button>}
  clickable
  onClick={() => console.log('Card clicked')}
  padding="md"
  shadow="md"
  hover
>
  <p>Card content</p>
</Card>
```

**Props:**
- `header`: React.ReactNode
- `footer`: React.ReactNode
- `clickable`: boolean
- `onClick`: () => void
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `shadow`: 'none' | 'sm' | 'md' | 'lg'
- `hover`: boolean

### Table

Feature-rich table with sorting, pagination, and row selection.

```tsx
import { Table } from '@healthcare/ui';

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  {
    key: 'status',
    header: 'Status',
    render: (item) => <Badge variant="success">{item.status}</Badge>
  },
];

<Table
  data={data}
  columns={columns}
  loading={false}
  selectable
  onSelectionChange={(rows) => console.log(rows)}
  pagination={{
    currentPage: 1,
    pageSize: 10,
    totalItems: 100,
    onPageChange: (page) => setCurrentPage(page),
  }}
  striped
  hover
/>
```

**Props:**
- `data`: T[]
- `columns`: Column<T>[]
- `loading`: boolean
- `selectable`: boolean
- `onSelectionChange`: (rows: T[]) => void
- `pagination`: PaginationConfig
- `emptyMessage`: string
- `striped`: boolean
- `hover`: boolean

### Badge

Status badges with color variants.

```tsx
import { Badge } from '@healthcare/ui';

<Badge variant="success" size="md" dot>
  Active
</Badge>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'medical'
- `size`: 'sm' | 'md' | 'lg'
- `rounded`: boolean
- `dot`: boolean

### Avatar

Display user avatars with images or initials.

```tsx
import { Avatar } from '@healthcare/ui';

<Avatar
  src="/path/to/image.jpg"
  alt="John Doe"
  initials="JD"
  size="md"
  status="online"
  shape="circle"
/>
```

**Props:**
- `src`: string
- `alt`: string
- `initials`: string
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
- `status`: 'online' | 'offline' | 'away' | 'busy'
- `shape`: 'circle' | 'square'

### Alert

Contextual feedback messages.

```tsx
import { Alert } from '@healthcare/ui';

<Alert
  variant="success"
  title="Success!"
  dismissible
  onDismiss={() => console.log('Dismissed')}
>
  Your changes have been saved successfully.
</Alert>
```

**Props:**
- `variant`: 'info' | 'success' | 'warning' | 'error'
- `title`: string
- `children`: React.ReactNode
- `dismissible`: boolean
- `onDismiss`: () => void
- `icon`: React.ReactNode

### Tabs

Tab navigation component with multiple variants.

```tsx
import { Tabs } from '@healthcare/ui';

const tabs = [
  { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
  { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div> },
];

<Tabs
  tabs={tabs}
  defaultTab="tab1"
  onChange={(tabId) => console.log(tabId)}
  variant="line"
  fullWidth
/>
```

**Props:**
- `tabs`: Tab[]
- `defaultTab`: string
- `activeTab`: string (controlled)
- `onChange`: (tabId: string) => void
- `variant`: 'line' | 'pills' | 'enclosed'
- `fullWidth`: boolean

### DatePicker

Calendar date picker with range support.

```tsx
import { DatePicker, DateRangePicker } from '@healthcare/ui';

// Single date
<DatePicker
  label="Select Date"
  value={date}
  onChange={setDate}
  minDate={new Date()}
/>

// Date range
<DateRangePicker
  label="Select Date Range"
  value={dateRange}
  onChange={setDateRange}
/>
```

**Props:**
- `label`: string
- `value`: Date | DateRange
- `onChange`: (date: Date | DateRange | undefined) => void
- `placeholder`: string
- `error`: string
- `helperText`: string
- `disabled`: boolean
- `minDate`: Date
- `maxDate`: Date

## Theming

The component library uses a healthcare-focused color palette with support for:

- **Primary colors**: Blue tones for main actions
- **Secondary colors**: Purple tones for secondary actions
- **Status colors**: Success (green), Warning (yellow), Error (red), Info (blue)
- **Medical colors**: Teal tones for healthcare-specific elements

### Custom Colors

You can extend or override colors in your Tailwind config:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Your custom primary colors
        },
      },
    },
  },
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build the library
pnpm build

# Watch mode for development
pnpm dev

# Type check
pnpm type-check

# Lint
pnpm lint
```

## License

MIT

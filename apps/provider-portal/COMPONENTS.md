# Component Documentation

## UI Components

All UI components are located in `src/components/ui/` and can be imported from `@/components/ui`.

### Button

A customizable button component with multiple variants and sizes.

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" isLoading={false}>
  Click Me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `disabled`: boolean
- All standard button HTML attributes

**Examples:**
```tsx
<Button variant="primary">Save</Button>
<Button variant="danger" size="sm">Delete</Button>
<Button variant="outline" isLoading={true}>Loading...</Button>
```

---

### Card

Container component for grouped content.

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

<Card padding="md">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

**Props:**
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `className`: string

**Sub-components:**
- `CardHeader`: Header section
- `CardTitle`: Title with consistent styling
- `CardContent`: Content section

---

### Badge

Small label component for status indicators.

```tsx
import { Badge } from '@/components/ui';

<Badge variant="success" size="md">
  Active
</Badge>
```

**Props:**
- `variant`: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray'
- `size`: 'sm' | 'md' | 'lg'
- `className`: string

**Examples:**
```tsx
<Badge variant="success">Completed</Badge>
<Badge variant="warning" size="sm">Pending</Badge>
<Badge variant="danger">Critical</Badge>
```

---

### Input

Form input with label, error handling, and helper text.

```tsx
import { Input } from '@/components/ui';

<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error="Invalid email"
  helperText="We'll never share your email"
  required
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `required`: boolean
- All standard input HTML attributes

**Features:**
- Automatic required indicator (*)
- Error state styling
- Helper text support
- Full TypeScript support

---

### Select

Dropdown select component with label and error handling.

```tsx
import { Select } from '@/components/ui';

<Select
  label="Status"
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]}
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  error="Please select a status"
  required
/>
```

**Props:**
- `label`: string
- `options`: Array<{ value: string; label: string }>
- `error`: string
- `helperText`: string
- `required`: boolean
- All standard select HTML attributes

---

### Modal

Overlay modal dialog component.

```tsx
import { Modal } from '@/components/ui';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"
  showCloseButton={true}
>
  <div>Modal content</div>
</Modal>
```

**Props:**
- `isOpen`: boolean - Controls visibility
- `onClose`: () => void - Close handler
- `title`: string - Optional title
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `showCloseButton`: boolean - Show X button

**Features:**
- Backdrop click to close
- Escape key to close
- Body scroll lock when open
- Smooth animations

---

## Layout Components

### DashboardLayout

Main layout wrapper for authenticated pages.

```tsx
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout>
      <div>Your page content</div>
    </DashboardLayout>
  );
}
```

**Features:**
- Includes Sidebar navigation
- Includes Header with search and user menu
- Responsive layout
- Consistent padding and spacing

---

### Sidebar

Navigation sidebar component.

```tsx
import { Sidebar } from '@/components/layout/Sidebar';
```

**Features:**
- Active route highlighting
- Icons for each menu item
- Fixed positioning
- Scrollable navigation

**Navigation Items:**
- Dashboard
- Patients
- Appointments
- Consultations
- Clinical Notes
- Prescriptions
- Lab Orders
- Schedule
- Profile
- Settings

---

### Header

Top header with search and user menu.

```tsx
import { Header } from '@/components/layout/Header';
```

**Features:**
- Global search bar
- Notification bell with indicator
- User profile dropdown
- Responsive design

---

## Domain Components

### PatientCard

Card component for displaying patient information.

```tsx
import { PatientCard } from '@/components/patients/PatientCard';

<PatientCard
  patient={patientData}
  onClick={() => navigate(`/patients/${patient.id}`)}
/>
```

**Props:**
- `patient`: Patient - Full patient object
- `onClick`: () => void - Click handler

**Displays:**
- Patient name and avatar
- MRN and age
- Contact information
- Allergies (up to 3, with overflow indicator)
- Status badge

---

## Component Patterns

### Form Pattern

```tsx
const [formData, setFormData] = useState({
  name: '',
  email: ''
});
const [errors, setErrors] = useState({});

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Validation
  // API call
};

return (
  <form onSubmit={handleSubmit}>
    <Input
      label="Name"
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      error={errors.name}
      required
    />
    <Button type="submit">Save</Button>
  </form>
);
```

---

### Modal Form Pattern

```tsx
const [isOpen, setIsOpen] = useState(false);

const FormContent = () => (
  <div className="space-y-4">
    <Input label="Field" />
    <div className="flex justify-end space-x-3">
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="primary">Save</Button>
    </div>
  </div>
);

return (
  <>
    <Button onClick={() => setIsOpen(true)}>Open Form</Button>
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Form">
      <FormContent />
    </Modal>
  </>
);
```

---

### List with Filters Pattern

```tsx
const [searchQuery, setSearchQuery] = useState('');
const [statusFilter, setStatusFilter] = useState('all');

const filteredItems = items.filter(item => {
  const matchesSearch = searchQuery === '' ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
  return matchesSearch && matchesStatus;
});

return (
  <div>
    <div className="flex gap-4 mb-4">
      <Input
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Select
        options={[
          { value: 'all', label: 'All' },
          { value: 'active', label: 'Active' }
        ]}
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      />
    </div>
    {filteredItems.map(item => (
      <Card key={item.id}>{item.name}</Card>
    ))}
  </div>
);
```

---

### Tab Navigation Pattern

```tsx
const [activeTab, setActiveTab] = useState('overview');

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'history', label: 'History' }
];

return (
  <div>
    <nav className="border-b border-gray-200">
      <div className="flex space-x-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 border-b-2 ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
    {activeTab === 'overview' && <OverviewTab />}
    {activeTab === 'history' && <HistoryTab />}
  </div>
);
```

---

## Styling Guidelines

### Colors

Use Tailwind color utilities:
- **Primary**: `bg-primary-600`, `text-primary-600`
- **Success**: `bg-green-600`, `text-green-600`
- **Warning**: `bg-yellow-600`, `text-yellow-600`
- **Danger**: `bg-red-600`, `text-red-600`
- **Info**: `bg-blue-600`, `text-blue-600`

### Spacing

Use consistent spacing:
- **Gap between items**: `space-y-4`, `space-x-4`
- **Card padding**: `p-6`
- **Section spacing**: `mb-6`

### Typography

Use semantic font sizes:
- **Page title**: `text-2xl font-bold`
- **Section title**: `text-lg font-semibold`
- **Body text**: `text-base`
- **Small text**: `text-sm`
- **Extra small**: `text-xs`

### Responsive Design

Use Tailwind breakpoints:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

---

## Accessibility

All components follow accessibility best practices:

1. **Keyboard Navigation**: All interactive elements are keyboard accessible
2. **ARIA Labels**: Proper ARIA attributes where needed
3. **Focus States**: Visible focus indicators
4. **Color Contrast**: WCAG AA compliant
5. **Screen Readers**: Semantic HTML and labels

---

## Best Practices

1. **Always use TypeScript types** for component props
2. **Extract reusable logic** into custom hooks
3. **Keep components focused** - single responsibility
4. **Use composition** over complex props
5. **Provide default values** for optional props
6. **Handle loading and error states** in data components
7. **Make components accessible** by default
8. **Write self-documenting code** with clear prop names

---

## Testing Components

```tsx
// Example test pattern
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Button isLoading>Click Me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## Creating New Components

When creating a new component:

1. Create file in appropriate directory (`ui/`, `layout/`, or domain-specific)
2. Define TypeScript interface for props
3. Implement component with proper typing
4. Add default props where appropriate
5. Export from index.ts if in `ui/`
6. Document in this file
7. Test the component

Example template:
```tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  variant?: 'default' | 'alternate';
  onClick?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  variant = 'default',
  onClick
}) => {
  return (
    <div className={variant === 'default' ? 'bg-white' : 'bg-gray-50'}>
      <h3>{title}</h3>
      {onClick && <button onClick={onClick}>Action</button>}
    </div>
  );
};
```

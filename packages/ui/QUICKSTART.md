# Quick Start Guide

Get up and running with @healthcare/ui in 5 minutes.

## Installation

```bash
# Using pnpm (recommended for monorepo)
pnpm add @healthcare/ui

# Using npm
npm install @healthcare/ui

# Using yarn
yarn add @healthcare/ui
```

## Install Peer Dependencies

```bash
pnpm add react react-dom tailwindcss
```

## Setup Tailwind CSS

### 1. Create/Update `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
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

### 2. Create/Update `postcss.config.js`

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 3. Import Tailwind in your CSS

```css
/* styles/globals.css or src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Import CSS in your app

```tsx
// App.tsx or index.tsx
import './styles/globals.css';
```

## Your First Component

```tsx
import { Button } from '@healthcare/ui';

function App() {
  return (
    <Button variant="primary" onClick={() => alert('Hello!')}>
      Click me
    </Button>
  );
}

export default App;
```

## Building a Simple Form

```tsx
import { Card, Input, Select, Button, Alert } from '@healthcare/ui';
import { useState } from 'react';

function PatientForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [condition, setCondition] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const conditions = [
    { value: 'checkup', label: 'General Checkup' },
    { value: 'followup', label: 'Follow-up Visit' },
    { value: 'emergency', label: 'Emergency' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email, condition });
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card
        header={<h2 className="text-xl font-bold">New Patient Form</h2>}
        padding="lg"
        shadow="lg"
      >
        {submitted && (
          <Alert
            variant="success"
            title="Success!"
            dismissible
            onDismiss={() => setSubmitted(false)}
          >
            Patient information submitted successfully.
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />

          <Select
            label="Reason for Visit"
            options={conditions}
            value={condition}
            onChange={setCondition}
            placeholder="Select a reason"
            fullWidth
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" fullWidth>
              Submit
            </Button>
            <Button type="button" variant="ghost" fullWidth>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default PatientForm;
```

## Creating a Data Table

```tsx
import { Table, Badge, Button } from '@healthcare/ui';

function PatientList() {
  const patients = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'Active',
      lastVisit: '2024-01-15',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'Inactive',
      lastVisit: '2023-12-20',
    },
  ];

  const columns = [
    {
      key: 'name',
      header: 'Patient Name',
      sortable: true,
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      render: (patient) => (
        <Badge
          variant={patient.status === 'Active' ? 'success' : 'warning'}
          dot
        >
          {patient.status}
        </Badge>
      ),
    },
    {
      key: 'lastVisit',
      header: 'Last Visit',
      sortable: true,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (patient) => (
        <Button size="sm" variant="outline">
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Patients</h1>
      <Table
        data={patients}
        columns={columns}
        striped
        hover
      />
    </div>
  );
}

export default PatientList;
```

## Using Modal Dialogs

```tsx
import { Modal, Button, Input } from '@healthcare/ui';
import { useState } from 'react';

function AppointmentScheduler() {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState('');

  const handleConfirm = () => {
    console.log('Appointment scheduled for:', date);
    setIsOpen(false);
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        Schedule Appointment
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Schedule Appointment"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              Confirm
            </Button>
          </>
        }
      >
        <Input
          label="Appointment Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
        />
      </Modal>
    </div>
  );
}

export default AppointmentScheduler;
```

## Common Patterns

### Loading States

```tsx
import { Button, Table, Card } from '@healthcare/ui';
import { useState } from 'react';

function DataLoader() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const loadData = async () => {
    setLoading(true);
    // Fetch data
    const result = await fetchPatients();
    setData(result);
    setLoading(false);
  };

  return (
    <div>
      <Button loading={loading} onClick={loadData}>
        Load Data
      </Button>

      <Table
        data={data}
        columns={columns}
        loading={loading}
        emptyMessage="No patients found"
      />
    </div>
  );
}
```

### Error Handling

```tsx
import { Alert, Input, Button } from '@healthcare/ui';
import { useState } from 'react';

function FormWithValidation() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    setError('');
    return true;
  };

  return (
    <div>
      {error && (
        <Alert variant="error" dismissible onDismiss={() => setError('')}>
          {error}
        </Alert>
      )}

      <Input
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        onBlur={validate}
      />
    </div>
  );
}
```

### User Profile

```tsx
import { Avatar, Card, Badge } from '@healthcare/ui';

function UserProfile() {
  const user = {
    name: 'Dr. Sarah Smith',
    role: 'Cardiologist',
    avatar: '/avatars/sarah.jpg',
    status: 'online',
  };

  return (
    <Card padding="md" shadow="md">
      <div className="flex items-center gap-4">
        <Avatar
          src={user.avatar}
          alt={user.name}
          size="lg"
          status={user.status}
        />
        <div>
          <h3 className="font-bold">{user.name}</h3>
          <Badge variant="medical">{user.role}</Badge>
        </div>
      </div>
    </Card>
  );
}
```

## Styling Tips

### Custom Classes

All components accept `className` prop for custom styling:

```tsx
<Button className="mt-4 shadow-xl">
  Custom Styled Button
</Button>
```

### Responsive Design

Use Tailwind's responsive prefixes:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</div>
```

### Dark Mode (Future)

Components are built to support dark mode:

```tsx
<Card className="dark:bg-gray-800 dark:text-white">
  Content
</Card>
```

## TypeScript Support

All components are fully typed:

```tsx
import { ButtonProps, InputProps } from '@healthcare/ui';

// Custom wrapper with typed props
function CustomButton(props: ButtonProps) {
  return <Button {...props} />;
}

// Type-safe column definitions
import { Column } from '@healthcare/ui';

interface Patient {
  id: number;
  name: string;
  email: string;
}

const columns: Column<Patient>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
];
```

## Next Steps

1. **Explore Components**: Check out [COMPONENTS.md](./COMPONENTS.md) for a complete reference
2. **See Examples**: Review [EXAMPLES.md](./EXAMPLES.md) for real-world patterns
3. **Read API Docs**: See [README.md](./README.md) for detailed API documentation
4. **Customize Theme**: Extend the Tailwind config to match your brand

## Troubleshooting

### Styles not appearing?

1. Make sure Tailwind is configured correctly
2. Check that you imported the CSS file
3. Verify the content paths in `tailwind.config.js`

### TypeScript errors?

1. Ensure `@types/react` and `@types/react-dom` are installed
2. Check that `tsconfig.json` includes the UI package
3. Update to the latest version of the package

### Build errors?

1. Clear your build cache: `rm -rf .next` or `rm -rf dist`
2. Reinstall dependencies: `pnpm install`
3. Check for peer dependency conflicts

## Getting Help

- Check the [README.md](./README.md) for detailed documentation
- Review [EXAMPLES.md](./EXAMPLES.md) for code samples
- See [COMPONENTS.md](./COMPONENTS.md) for component reference
- Check [CHANGELOG.md](./CHANGELOG.md) for recent updates

## Example Project Structure

```
my-healthcare-app/
├── src/
│   ├── components/
│   │   ├── PatientForm.tsx
│   │   ├── PatientList.tsx
│   │   └── Dashboard.tsx
│   ├── pages/
│   │   ├── index.tsx
│   │   └── patients.tsx
│   ├── styles/
│   │   └── globals.css
│   └── App.tsx
├── public/
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

Happy coding!

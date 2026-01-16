# Provider Portal - Quick Start Guide

## Installation & Setup

### 1. Install Dependencies

```bash
cd apps/provider-portal
npm install
```

### 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_WS_URL=ws://localhost:4000
NEXT_PUBLIC_TELEHEALTH_API_KEY=your_telehealth_api_key
NEXT_PUBLIC_APP_NAME=Provider Portal
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001)

## Default Login (Mock Data)

Use any credentials for development (authentication is mocked):
- Email: `doctor@example.com`
- Password: `password`

## Key Features Overview

### Dashboard (`/dashboard`)
- View today's appointments and statistics
- Quick access to pending tasks
- Recent activity feed
- Critical alerts and notifications

### Patient Management (`/patients`)
- Browse all patients with search and filters
- View comprehensive patient details
- Access medical history, allergies, medications
- Manage patient information

### Appointments (`/appointments`)
- **Calendar View**: Weekly schedule with time slots
- **List View**: Detailed appointment listings
- Create, update, confirm, and cancel appointments
- Support for in-person and telehealth visits

### Telehealth (`/consultations`)
- Schedule video consultations
- Join video calls with patients
- Built-in controls (mute, video, screen share)
- Session history and notes

### Prescriptions (`/prescriptions`)
- Create electronic prescriptions
- Specify medication, dosage, frequency
- Send to pharmacy electronically
- Track prescription status and refills

### Lab Orders (`/lab-orders`)
- Order laboratory tests
- Select multiple tests per order
- Set priority (routine, urgent, STAT)
- Review results with reference ranges
- Identify abnormal results

### Schedule Management (`/schedule`)
- Configure weekly working hours
- Set appointment slot durations
- Block time for meetings, holidays, PTO
- Manage availability preferences

### Profile (`/profile`)
- Professional information (NPI, license, specialty)
- Education and certifications
- Languages spoken
- Professional biography
- Practice preferences

### Settings (`/settings`)
- Account management
- Notification preferences
- Security settings (2FA, session timeout)
- Privacy controls

## Application Architecture

### Tech Stack
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first styling
- **React Query** - Server state management
- **Zustand** - Client state management
- **Axios** - HTTP client with interceptors

### Folder Structure

```
src/
├── app/                    # Next.js pages
├── components/
│   ├── layout/            # Layout components (Sidebar, Header)
│   ├── patients/          # Patient-specific components
│   └── ui/                # Reusable UI components
├── lib/
│   ├── api/               # API client methods
│   ├── api-client.ts      # Axios configuration
│   └── query-client.ts    # React Query setup
├── store/                 # Zustand stores
├── types/                 # TypeScript definitions
└── utils/                 # Helper functions
```

## Development Tips

### Adding a New Page

1. Create page file in `src/app/[route]/page.tsx`
2. Use the DashboardLayout wrapper
3. Add route to Sidebar navigation

Example:
```tsx
'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function NewPage() {
  return (
    <DashboardLayout>
      <div>Your content here</div>
    </DashboardLayout>
  );
}
```

### Using API Methods

```tsx
import { patientsApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

// In your component
const { data, isLoading } = useQuery({
  queryKey: ['patients'],
  queryFn: () => patientsApi.getPatients(),
});
```

### Creating Forms

```tsx
import { Input, Button } from '@/components/ui';
import { useState } from 'react';

const [formData, setFormData] = useState({ name: '' });

return (
  <form onSubmit={handleSubmit}>
    <Input
      label="Name"
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    />
    <Button type="submit">Save</Button>
  </form>
);
```

### Using UI Components

All UI components are exported from `@/components/ui`:

```tsx
import { Button, Card, Badge, Modal, Input, Select } from '@/components/ui';

<Button variant="primary">Click Me</Button>
<Badge variant="success">Active</Badge>
<Card>Content</Card>
```

## Building for Production

```bash
# Create optimized build
npm run build

# Start production server
npm run start
```

## Code Quality

```bash
# Type checking
npm run type-check

# Linting
npm run lint
```

## Common Tasks

### Add a New API Endpoint

1. Create method in appropriate file in `src/lib/api/`
2. Use the `apiClient` for HTTP calls
3. Define TypeScript types in `src/types/index.ts`

### Create a Reusable Component

1. Add component to `src/components/ui/`
2. Export from `src/components/ui/index.ts`
3. Use TypeScript for props

### Add Authentication

The auth store is at `src/store/auth-store.ts`:

```tsx
import { useAuthStore } from '@/store/auth-store';

const { provider, isAuthenticated } = useAuthStore();
```

## Troubleshooting

### Port Already in Use
The app runs on port 3001. If occupied, change in `package.json`:
```json
"dev": "next dev -p 3002"
```

### API Connection Issues
Check `.env.local` has correct `NEXT_PUBLIC_API_URL`

### Type Errors
Run `npm run type-check` to see all TypeScript errors

## Next Steps

1. Connect to your backend API
2. Implement real authentication
3. Add form validation with Zod
4. Implement real-time features with WebSockets
5. Add data persistence
6. Implement HIPAA compliance measures
7. Add comprehensive error handling
8. Create integration tests

## Support

For questions or issues:
- Check the main README.md
- Review component documentation
- Examine existing implementations
- Contact the development team

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

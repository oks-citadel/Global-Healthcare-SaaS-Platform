# Admin Dashboard - Unified Health Platform

A comprehensive admin dashboard built with Next.js 14 for managing the Unified Health Platform.

## Features

- **Dashboard**: Overview with key metrics, charts, and recent activity
- **User Management**: List, create, edit, suspend, and activate users
- **Provider Management**: Verify and approve healthcare providers
- **Appointment Management**: Monitor and manage all appointments
- **Billing**: Subscription and invoice management with revenue tracking
- **Reports**: Analytics and insights with exportable reports
- **Audit Logs**: Track all administrative actions
- **Settings**: Platform configuration and preferences

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5.3
- **Styling**: TailwindCSS
- **Data Fetching**: React Query (TanStack Query)
- **UI Components**: Radix UI
- **Charts**: Recharts
- **Tables**: TanStack Table
- **Forms**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 20+ and npm/yarn
- Backend API running (see backend documentation)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Build

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## Project Structure

```
apps/admin/
├── src/
│   ├── app/
│   │   ├── (dashboard)/          # Protected dashboard routes
│   │   │   ├── dashboard/        # Main dashboard
│   │   │   ├── users/            # User management
│   │   │   ├── providers/        # Provider management
│   │   │   ├── appointments/     # Appointments
│   │   │   ├── billing/          # Billing & subscriptions
│   │   │   ├── reports/          # Analytics & reports
│   │   │   ├── audit-logs/       # Audit logs
│   │   │   └── settings/         # Platform settings
│   │   ├── login/                # Login page
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home (redirects to login)
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   ├── sidebar.tsx           # Sidebar navigation
│   │   ├── data-table.tsx        # Data table component
│   │   └── stat-card.tsx         # Stat card component
│   └── lib/
│       ├── api.ts                # API client and functions
│       └── utils.ts              # Utility functions
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Routes

- `/login` - Admin authentication
- `/dashboard` - Main dashboard with metrics
- `/users` - User list and management
- `/users/[id]` - User details
- `/providers` - Provider list and verification
- `/providers/[id]` - Provider details
- `/appointments` - Appointment overview
- `/billing` - Subscriptions and invoices
- `/reports` - Analytics and reports
- `/audit-logs` - System audit logs
- `/settings` - Platform configuration

## API Integration

The admin dashboard communicates with the backend API through the following endpoints:

- `POST /api/admin/auth/login` - Admin authentication
- `GET /api/admin/dashboard/metrics` - Dashboard metrics
- `GET /api/admin/users` - List users
- `GET /api/admin/providers` - List providers
- `POST /api/admin/providers/:id/verify` - Verify provider
- `GET /api/admin/appointments` - List appointments
- `GET /api/admin/billing/subscriptions` - List subscriptions
- `GET /api/admin/audit-logs` - Audit logs
- `GET /api/admin/settings` - Get settings
- `PUT /api/admin/settings` - Update settings

## Authentication

The admin dashboard uses JWT token-based authentication:

1. Login with admin credentials
2. Token stored in localStorage
3. Token included in all API requests
4. Automatic redirect to login on 401 responses

## Development Tips

- Use React Query DevTools for debugging API calls
- Check browser console for API errors
- Use the data table search and filter features
- Export reports for external analysis

## License

Copyright © 2024 Unified Health Platform

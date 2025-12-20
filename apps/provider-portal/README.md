# Provider Portal

Healthcare Provider Portal for doctors, nurses, and specialists to manage patient care, appointments, prescriptions, and more.

## Features

### Patient Management
- **Patient Directory**: Browse and search all patients
- **Patient Profiles**: Comprehensive patient information including:
  - Demographics and contact information
  - Medical history and chronic conditions
  - Current medications
  - Known allergies
  - Insurance information

### Appointments & Scheduling
- **Calendar View**: Weekly calendar with daily time slots
- **List View**: Detailed appointment listings
- **Appointment Management**: Create, update, confirm, and cancel appointments
- **Multiple Types**: Support for in-person, telehealth, and follow-up appointments
- **Status Tracking**: Track pending, confirmed, in-progress, and completed appointments

### Telehealth Consultations
- **Video Calls**: Built-in video consultation interface
- **Session Management**: Schedule and manage virtual appointments
- **Equipment Testing**: Test camera and microphone before sessions
- **Recording**: Session recording capabilities (placeholder)
- **Quality Monitoring**: Connection quality tracking

### Clinical Documentation
- **SOAP Notes**: Create and manage clinical notes following SOAP format
  - Subjective (patient description)
  - Objective (provider observations)
  - Assessment (diagnosis)
  - Plan (treatment plan)
- **Vital Signs**: Record patient vital signs
- **Attachments**: Upload and manage documents
- **Digital Signatures**: Sign and lock clinical notes

### Prescription Management (e-Prescribing)
- **Create Prescriptions**: Digital prescription creation
- **Medication Database**: Search and select medications
- **Dosage Management**: Specify dosage, frequency, and route
- **Refills**: Manage prescription refills
- **Pharmacy Integration**: Send prescriptions directly to pharmacies
- **Status Tracking**: Track active, pending, and completed prescriptions

### Lab Orders & Results
- **Order Tests**: Create lab orders with multiple tests
- **Priority Levels**: Routine, urgent, and STAT orders
- **Results Viewing**: Review lab results with reference ranges
- **Abnormal Alerts**: Highlight abnormal and critical results
- **Lab Integration**: Connect with Quest, LabCorp, and other lab facilities

### Schedule & Availability
- **Weekly Schedule**: Configure working hours for each day
- **Slot Duration**: Customize appointment slot lengths
- **Block Times**: Set unavailable times and exceptions
- **Holidays**: Mark full-day or partial-day blocks
- **Preferences**: Auto-confirm appointments, buffer times, accepting new patients

### Provider Profile
- **Professional Information**: NPI, license, specialty
- **Education**: Medical school and degrees
- **Certifications**: Board certifications and credentials
- **Languages**: Languages spoken
- **Bio**: Professional biography
- **Preferences**: Practice preferences and settings

### Dashboard
- **Quick Stats**: Today's appointments, active patients, pending labs
- **Upcoming Appointments**: List of today's schedule
- **Recent Activity**: Track recent actions and updates
- **Alerts**: Critical notifications and pending items
- **Quick Actions**: Fast access to common tasks

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5.3
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form with Zod validation
- **Date Utilities**: date-fns
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.local.example .env.local
```

3. Update environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_WS_URL=ws://localhost:4000
NEXT_PUBLIC_TELEHEALTH_API_KEY=your_telehealth_api_key
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3001](http://localhost:3001)

### Build

Create a production build:

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

## Project Structure

```
provider-portal/
├── src/
│   ├── app/                      # Next.js 14 app directory
│   │   ├── appointments/         # Appointment management pages
│   │   ├── consultations/        # Telehealth consultation pages
│   │   ├── dashboard/            # Dashboard page
│   │   ├── lab-orders/           # Lab orders and results
│   │   ├── login/                # Authentication pages
│   │   ├── patients/             # Patient management pages
│   │   │   └── [id]/             # Patient detail page
│   │   ├── prescriptions/        # Prescription management
│   │   ├── profile/              # Provider profile page
│   │   ├── schedule/             # Availability management
│   │   ├── settings/             # Settings page
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page (redirects to dashboard)
│   │   ├── providers.tsx         # React Query provider
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── layout/               # Layout components
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── patients/             # Patient-specific components
│   │   │   └── PatientCard.tsx
│   │   └── ui/                   # Reusable UI components
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Select.tsx
│   │       └── index.ts
│   ├── lib/
│   │   ├── api/                  # API client methods
│   │   │   ├── appointments.ts
│   │   │   ├── auth.ts
│   │   │   ├── clinical-notes.ts
│   │   │   ├── lab-orders.ts
│   │   │   ├── patients.ts
│   │   │   ├── prescriptions.ts
│   │   │   ├── schedule.ts
│   │   │   └── index.ts
│   │   ├── api-client.ts         # Axios configuration
│   │   └── query-client.ts       # React Query configuration
│   ├── store/
│   │   └── auth-store.ts         # Zustand auth store
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   └── utils/                    # Utility functions
├── public/                       # Static assets
├── .env.local.example            # Environment variables template
├── .eslintrc.json               # ESLint configuration
├── .gitignore                   # Git ignore rules
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.ts           # Tailwind configuration
└── tsconfig.json                # TypeScript configuration
```

## Pages & Routes

- `/login` - Provider authentication
- `/dashboard` - Main dashboard with stats and quick actions
- `/patients` - Patient list with search and filters
- `/patients/[id]` - Individual patient details and medical history
- `/appointments` - Calendar and list views of appointments
- `/consultations` - Telehealth video consultation interface
- `/prescriptions` - E-prescribing system
- `/lab-orders` - Laboratory test ordering and results
- `/schedule` - Provider availability management
- `/profile` - Provider professional profile
- `/settings` - Account and system settings

## API Integration

The application is designed to work with a backend API. All API calls are configured through the API client in `src/lib/api-client.ts`.

### Authentication

The API client automatically:
- Adds JWT token to all requests
- Handles token refresh on 401 errors
- Redirects to login on authentication failures

### Available API Methods

See `src/lib/api/` for all available API methods organized by feature.

## State Management

- **Authentication State**: Zustand store (`src/store/auth-store.ts`)
- **Server State**: React Query for API data fetching and caching
- **Form State**: React Hook Form for form management

## Type Safety

All data structures are fully typed using TypeScript. See `src/types/index.ts` for comprehensive type definitions including:
- Provider and Patient types
- Appointment and Schedule types
- Prescription and Medication types
- Lab Order and Result types
- Clinical documentation types

## Styling

The application uses TailwindCSS with a custom design system:

### Color Palette
- **Primary**: Blue tones for main actions
- **Medical Green**: Success states and active medications
- **Medical Blue**: Information and diagnostics
- **Medical Purple**: Telehealth and video calls
- **Medical Red**: Alerts and critical results
- **Medical Orange**: Warnings and pending items

### Components
All UI components are built with consistent styling and support variants for different states and use cases.

## HIPAA Compliance Considerations

When deploying this application:

1. **Encryption**: Use HTTPS/TLS for all communications
2. **Authentication**: Implement strong authentication (consider MFA)
3. **Authorization**: Implement role-based access control
4. **Audit Logs**: Track all access to patient data
5. **Session Management**: Implement secure session handling
6. **Data Encryption**: Encrypt sensitive data at rest
7. **Secure Communications**: Use encrypted channels for telehealth

## Contributing

When contributing to this project:

1. Follow the established code structure
2. Maintain TypeScript type safety
3. Use existing UI components when possible
4. Follow HIPAA best practices
5. Write meaningful commit messages

## License

This is a proprietary application for healthcare providers.

## Support

For support and questions, contact the development team.

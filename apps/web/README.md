# UnifiedHealth Web Portal

Next.js 14 web application for the Unified Healthcare Platform patient portal.

## Features Implemented

### Authentication System
- **Login & Registration**: Complete authentication flow with form validation
- **JWT Token Management**: Automatic token refresh and storage
- **Protected Routes**: Middleware-based route protection
- **Session Persistence**: Zustand store with local storage persistence

### Core Components

#### API Client (`src/lib/api.ts`)
- Axios instance with base URL configuration
- Request interceptor for JWT token injection
- Response interceptor for automatic token refresh
- Token storage utilities (localStorage)
- Comprehensive error handling

#### Auth Store (`src/store/auth.ts`)
- Zustand store for global auth state management
- Actions: login, logout, setUser, setTokens
- Persistent storage with selective state serialization
- Type-safe selectors for performance optimization

#### Auth Hooks (`src/hooks/useAuth.ts`)
- `useLogin` - Login mutation with React Query
- `useRegister` - Registration mutation with React Query
- `useLogout` - Logout with state cleanup
- `useCurrentUser` - Fetch current user data
- `useAuth` - Access auth state and user info

#### Layout Components
- **Header** (`src/components/layout/Header.tsx`)
  - Navigation with active route highlighting
  - User info display
  - Logout functionality

- **Sidebar** (`src/components/layout/Sidebar.tsx`)
  - Navigation menu with icons
  - Active route indication
  - Quick access to all major sections

- **MainLayout** (`src/components/layout/MainLayout.tsx`)
  - Wrapper component combining header and sidebar
  - Responsive layout structure

### Pages

#### Auth Pages
- **Login** (`src/app/login/page.tsx`)
  - Email/password form with validation
  - Remember me checkbox
  - Forgot password link
  - Registration link
  - Error handling with user feedback

- **Register** (`src/app/register/page.tsx`)
  - Multi-field registration form
  - Strong password validation
  - Terms & conditions acceptance
  - Password strength indicator
  - Automatic login after registration

#### Dashboard Pages
- **Main Dashboard** (`src/app/(dashboard)/page.tsx`)
  - Stats overview cards
  - Upcoming appointments list
  - Quick action buttons
  - Loading states with skeletons

- **Appointments** (`src/app/(dashboard)/appointments/page.tsx`)
  - Filterable appointments list (all, scheduled, completed, cancelled)
  - Appointment cards with detailed information
  - Status badges and type icons
  - Book appointment button
  - Stats summary cards

- **Profile** (`src/app/(dashboard)/profile/page.tsx`)
  - Personal information editing
  - Medical information (height, weight, blood type)
  - Address management
  - Emergency contact
  - Medical history display
  - Allergies display
  - Edit/Save/Cancel workflow

#### Dashboard Layout (`src/app/(dashboard)/layout.tsx`)
- Protected route wrapper
- Authentication check with redirect
- React Query provider
- Loading state handling

### Middleware (`src/middleware.ts`)
- Route protection for dashboard pages
- Automatic redirect to login for unauthenticated users
- Redirect to dashboard for authenticated users on auth pages
- Query parameter for return URL after login

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Data Fetching**: React Query (@tanstack/react-query)
- **HTTP Client**: Axios
- **Form Management**: React Hook Form
- **Validation**: Zod
- **UI Utilities**: clsx, tailwind-merge

## Project Structure

```
apps/web/
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── appointments/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── providers.tsx
│   ├── components/
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── MainLayout.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   ├── store/
│   │   └── auth.ts
│   ├── types/
│   │   ├── auth.ts
│   │   └── index.ts
│   └── middleware.ts
├── .env.local.example
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on http://localhost:4000

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
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_APP_NAME=UnifiedHealth
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

### Build

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## API Integration

The frontend expects the following API endpoints:

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Token refresh
- `GET /api/v1/auth/me` - Get current user

### Dashboard
- `GET /api/v1/dashboard/stats` - Dashboard statistics
- `GET /api/v1/appointments` - Get appointments (with filters)

### Profile
- `GET /api/v1/patients/profile` - Get user profile
- `PUT /api/v1/patients/profile` - Update user profile

## Features

### Form Validation
- Client-side validation using Zod schemas
- Real-time error feedback
- Custom validation rules
- Password strength requirements

### Authentication Flow
1. User enters credentials
2. Form validation
3. API request with loading state
4. Token storage in localStorage
5. User data stored in Zustand
6. Automatic redirect to dashboard
7. Persistent session across page reloads

### Token Refresh
- Automatic token refresh on 401 errors
- Request queue during token refresh
- Fallback to login on refresh failure
- Seamless user experience

### Protected Routes
- Middleware-based protection
- Automatic redirect to login
- Return URL preservation
- Token validation

### Error Handling
- User-friendly error messages
- Network error detection
- API error parsing
- Loading and error states

## TypeScript Types

All components and functions are fully typed with TypeScript:
- User types
- Auth types
- API response types
- Form data types
- Component prop types

## Styling

The application uses TailwindCSS with:
- Custom color palette
- Responsive design
- Consistent spacing
- Hover and focus states
- Loading animations
- Status badges
- Cards and containers

## Next Steps

To extend the application:
1. Add more dashboard pages (messages, prescriptions, lab results)
2. Implement appointment booking flow
3. Add real-time chat with Socket.io
4. Implement video consultation with WebRTC
5. Add notification system
6. Implement file upload for documents
7. Add payment integration with Stripe
8. Create admin portal
9. Add multi-language support
10. Implement dark mode

## Contributing

This is a monorepo application. Make sure to:
- Follow TypeScript best practices
- Use React Hook Form for forms
- Implement proper error handling
- Add loading states
- Write meaningful commit messages
- Test all features before committing

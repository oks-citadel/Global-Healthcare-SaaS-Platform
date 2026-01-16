# Next.js Web Portal File Structure

## Complete Directory Tree

```
apps/web/
│
├── src/
│   │
│   ├── app/                                    # Next.js 14 App Router
│   │   │
│   │   ├── (dashboard)/                       # Route group for authenticated pages
│   │   │   ├── appointments/
│   │   │   │   └── page.tsx                   # Appointments list page ✅
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   └── page.tsx                   # User profile page ✅
│   │   │   │
│   │   │   ├── layout.tsx                     # Dashboard layout (protected) ✅
│   │   │   └── page.tsx                       # Main dashboard page ✅
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx                       # Login page ✅
│   │   │
│   │   ├── register/
│   │   │   └── page.tsx                       # Registration page ✅
│   │   │
│   │   ├── globals.css                        # Global CSS with Tailwind ✅
│   │   ├── layout.tsx                         # Root layout ✅
│   │   └── providers.tsx                      # React Query provider ✅
│   │
│   ├── components/                            # React Components
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx                     # Navigation header ✅
│   │   │   ├── Sidebar.tsx                    # Side navigation ✅
│   │   │   └── MainLayout.tsx                 # Main layout wrapper ✅
│   │   │
│   │   └── ui/
│   │       └── LoadingSpinner.tsx             # Loading spinner component ✅
│   │
│   ├── hooks/                                 # Custom React Hooks
│   │   └── useAuth.ts                         # Authentication hooks ✅
│   │                                          # - useLogin
│   │                                          # - useRegister
│   │                                          # - useLogout
│   │                                          # - useCurrentUser
│   │                                          # - useAuth
│   │
│   ├── lib/                                   # Utilities & Helpers
│   │   ├── api.ts                            # Axios API client ✅
│   │   │                                     # - Request/Response interceptors
│   │   │                                     # - Token refresh logic
│   │   │                                     # - Token storage utilities
│   │   │                                     # - Error handling
│   │   │
│   │   └── utils.ts                          # Utility functions ✅
│   │                                         # - cn() for class names
│   │                                         # - Date formatting
│   │
│   ├── store/                                # State Management
│   │   └── auth.ts                           # Zustand auth store ✅
│   │                                         # - Auth state
│   │                                         # - Actions (login, logout, etc.)
│   │                                         # - Persistent storage
│   │
│   ├── types/                                # TypeScript Type Definitions
│   │   ├── auth.ts                          # Auth types ✅
│   │   │                                    # - User
│   │   │                                    # - AuthTokens
│   │   │                                    # - LoginCredentials
│   │   │                                    # - RegisterData
│   │   │                                    # - AuthResponse
│   │   │
│   │   └── index.ts                         # Core types ✅
│   │                                        # - Appointment
│   │                                        # - DashboardStats
│   │                                        # - PatientProfile
│   │                                        # - EmergencyContact
│   │                                        # - MedicalHistory
│   │                                        # - Allergy
│   │
│   └── middleware.ts                        # Next.js middleware ✅
│                                            # - Route protection
│                                            # - Authentication check
│                                            # - Redirects
│
├── .env.local.example                       # Environment variables template ✅
├── .env.local                               # Environment variables (create this)
├── next.config.js                           # Next.js configuration
├── package.json                             # Dependencies ✅
├── postcss.config.js                        # PostCSS configuration ✅
├── tailwind.config.js                       # TailwindCSS configuration ✅
├── tsconfig.json                           # TypeScript configuration
│
├── README.md                               # Full documentation ✅
├── QUICK_START.md                          # Quick start guide ✅
├── IMPLEMENTATION_SUMMARY.md               # Implementation details ✅
└── FILE_STRUCTURE.md                       # This file ✅

✅ = Implemented
```

## File Relationships Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      middleware.ts                               │
│  • Checks authentication                                         │
│  • Protects routes                                              │
│  • Redirects based on auth state                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    app/layout.tsx                                │
│  • Root HTML structure                                           │
│  • Wraps with Providers                                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   app/providers.tsx                              │
│  • React Query Client                                           │
│  • Global providers                                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
            ┌────────────┴────────────┐
            │                         │
            ▼                         ▼
┌──────────────────────┐  ┌──────────────────────────────────────┐
│  Public Pages        │  │  Protected Pages                      │
│  • login/page.tsx    │  │  (dashboard)/layout.tsx              │
│  • register/page.tsx │  │    ├── page.tsx (Dashboard)          │
└──────┬───────────────┘  │    ├── appointments/page.tsx         │
       │                  │    └── profile/page.tsx              │
       │                  └──────────┬────────────────────────────┘
       │                             │
       │                             │ Uses
       │                             ▼
       │                  ┌──────────────────────────────────────┐
       │                  │  components/layout/                   │
       │                  │    ├── MainLayout.tsx                │
       │                  │    ├── Header.tsx                    │
       │                  │    └── Sidebar.tsx                   │
       │                  └──────────┬────────────────────────────┘
       │                             │
       └────────────┬────────────────┘
                    │
                    │ Uses
                    ▼
       ┌────────────────────────────┐
       │    hooks/useAuth.ts         │
       │  • useLogin                 │
       │  • useRegister              │
       │  • useLogout                │
       │  • useCurrentUser           │
       └────────────┬────────────────┘
                    │
       ┌────────────┴────────────┐
       │                         │
       ▼                         ▼
┌──────────────────┐  ┌──────────────────────────┐
│  store/auth.ts   │  │  lib/api.ts              │
│  • User state    │  │  • Axios instance        │
│  • Auth actions  │  │  • Interceptors          │
│  • Persistence   │  │  • Token refresh         │
└──────────────────┘  └────────┬─────────────────┘
                               │
                               │ HTTP Requests
                               ▼
                    ┌──────────────────────┐
                    │   Backend API        │
                    │   localhost:4000     │
                    └──────────────────────┘
```

## Data Flow Diagrams

### Authentication Flow

```
User Login
    │
    ▼
login/page.tsx
    │ (React Hook Form + Zod validation)
    ▼
hooks/useAuth.ts (useLogin)
    │ (React Query mutation)
    ▼
lib/api.ts (POST /auth/login)
    │
    ▼
Backend API
    │ (Returns user + tokens)
    ▼
store/auth.ts (login action)
    │ (Store user, save tokens)
    ▼
localStorage (tokens)
    │
    ▼
Redirect to Dashboard
```

### Protected Page Access

```
User navigates to /appointments
    │
    ▼
middleware.ts
    │ (Check for accessToken)
    ├─ No token → Redirect to /login
    └─ Has token ▼
         │
         ▼
(dashboard)/layout.tsx
    │ (Double check auth state)
    ├─ Not authenticated → Redirect to /login
    └─ Authenticated ▼
         │
         ▼
appointments/page.tsx
    │ (useQuery to fetch data)
    ▼
lib/api.ts
    │ (Add token to headers)
    ▼
Backend API
    │ (Returns data or 401)
    ├─ 401 → Attempt token refresh
    │         └─ Success → Retry request
    │         └─ Failure → Redirect to /login
    └─ 200 → Return data to component
```

### Form Submission Flow

```
User fills form in register/page.tsx
    │
    ▼
React Hook Form (onChange validation)
    │
    ▼
Zod Schema Validation
    │ (Check all fields)
    ├─ Invalid → Show errors
    └─ Valid ▼
         │
         ▼
hooks/useAuth.ts (useRegister)
    │ (React Query mutation)
    ├─ Loading → Show spinner, disable button
    │
    ▼
lib/api.ts (POST /auth/register)
    │
    ▼
Backend API
    │
    ├─ Error → Display error message
    │
    └─ Success ▼
         │
         ▼
store/auth.ts (login action)
    │
    ▼
Redirect to Dashboard
```

## Component Dependencies

### login/page.tsx Dependencies
```
login/page.tsx
├── hooks/useAuth.ts (useLogin, useAuth)
├── lib/api.ts (getErrorMessage)
├── lib/utils.ts (cn)
├── react-hook-form
├── zod
└── next/navigation (useRouter)
```

### Dashboard Layout Dependencies
```
(dashboard)/layout.tsx
├── hooks/useAuth.ts (useAuth)
├── components/layout/MainLayout.tsx
│   ├── components/layout/Header.tsx
│   │   ├── hooks/useAuth.ts (useAuth, useLogout)
│   │   └── lib/utils.ts (cn)
│   └── components/layout/Sidebar.tsx
│       └── lib/utils.ts (cn)
├── @tanstack/react-query (QueryClientProvider)
└── next/navigation (useRouter)
```

### Appointments Page Dependencies
```
appointments/page.tsx
├── lib/api.ts (apiClient)
├── lib/utils.ts (formatDateTime, cn)
├── types/index.ts (Appointment)
├── @tanstack/react-query (useQuery)
└── next/link (Link)
```

## State Management Flow

```
┌─────────────────────────────────────────────┐
│            Zustand Auth Store               │
│  (store/auth.ts)                            │
│                                             │
│  State:                                     │
│  • user: User | null                        │
│  • isAuthenticated: boolean                 │
│  • isLoading: boolean                       │
│                                             │
│  Actions:                                   │
│  • login(user, tokens)                      │
│  • logout()                                 │
│  • setUser(user)                           │
│  • setTokens(tokens)                       │
│  • setLoading(boolean)                     │
│                                             │
│  Persistence:                               │
│  • localStorage: "auth-storage"            │
│  • Persists: user, isAuthenticated         │
└─────────────────┬───────────────────────────┘
                  │
                  │ Used by
                  │
    ┌─────────────┼─────────────┬──────────────┐
    │             │             │              │
    ▼             ▼             ▼              ▼
useAuth.ts    Header.tsx   middleware.ts   layout.tsx
(hooks)       (component)  (protection)   (check auth)
```

## API Client Flow

```
┌─────────────────────────────────────────────┐
│           API Client (lib/api.ts)           │
│                                             │
│  Axios Instance                             │
│  • baseURL: NEXT_PUBLIC_API_URL            │
│  • timeout: 30000ms                         │
│                                             │
│  Request Interceptor:                       │
│  1. Get accessToken from localStorage      │
│  2. Add to Authorization header            │
│                                             │
│  Response Interceptor:                      │
│  1. On 401 error:                          │
│     a. Start token refresh                 │
│     b. Queue failed requests              │
│     c. Call /auth/refresh                 │
│     d. Update tokens                       │
│     e. Retry original request             │
│     f. Process queue                       │
│  2. On refresh failure:                    │
│     a. Clear tokens                        │
│     b. Redirect to login                   │
│                                             │
│  Token Storage:                            │
│  • getAccessToken()                        │
│  • getRefreshToken()                       │
│  • setTokens()                             │
│  • clearTokens()                           │
└─────────────────────────────────────────────┘
```

## TypeScript Type System

```
types/auth.ts
├── User
│   ├── id: string
│   ├── email: string
│   ├── firstName: string
│   ├── lastName: string
│   ├── role: 'patient' | 'doctor' | 'admin'
│   └── ...
│
├── AuthTokens
│   ├── accessToken: string
│   └── refreshToken: string
│
├── LoginCredentials
│   ├── email: string
│   └── password: string
│
├── RegisterData
│   ├── email: string
│   ├── password: string
│   ├── firstName: string
│   └── ...
│
└── AuthResponse
    ├── user: User
    └── tokens: AuthTokens

types/index.ts
├── Appointment
├── DashboardStats
├── PatientProfile
├── MedicalHistory
├── Allergy
└── EmergencyContact
```

## Styling Architecture

```
Global Styles (app/globals.css)
    │
    ├── @tailwind base
    ├── @tailwind components
    └── @tailwind utilities
         │
         └── Custom utilities

TailwindCSS Config (tailwind.config.js)
    │
    ├── Content paths
    ├── Theme extensions
    │   ├── Colors (primary, secondary, etc.)
    │   ├── Border radius
    │   └── Spacing
    └── Plugins

Component Styles
    │
    ├── Utility classes (Tailwind)
    ├── cn() function (clsx + tailwind-merge)
    └── Conditional styling
```

## Build & Runtime Flow

```
Development:
npm run dev
    │
    ├── Next.js compiles TypeScript
    ├── TailwindCSS processes styles
    ├── Hot reload on file changes
    └── Server runs on :3000

Production:
npm run build
    │
    ├── TypeScript compilation
    ├── TailwindCSS purge unused styles
    ├── Next.js optimization
    ├── Route pre-rendering
    └── .next/ build output

npm start
    │
    └── Serve production build
```

## Key Files Summary

| File | Purpose | Key Features |
|------|---------|-------------|
| `middleware.ts` | Route protection | Token validation, redirects |
| `lib/api.ts` | API client | Interceptors, token refresh |
| `store/auth.ts` | Auth state | Zustand, persistence |
| `hooks/useAuth.ts` | Auth logic | React Query mutations |
| `app/(dashboard)/layout.tsx` | Protected wrapper | Auth check, providers |
| `components/layout/MainLayout.tsx` | Layout | Header + Sidebar |

## Configuration Files

| File | Purpose |
|------|---------|
| `tsconfig.json` | TypeScript settings, path aliases |
| `tailwind.config.js` | TailwindCSS theme, colors |
| `postcss.config.js` | PostCSS plugins |
| `next.config.js` | Next.js configuration |
| `.env.local` | Environment variables |
| `package.json` | Dependencies, scripts |

---

This file structure represents a complete, production-ready Next.js 14 application with authentication, protected routes, and core dashboard functionality.

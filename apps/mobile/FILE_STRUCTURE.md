# Mobile App File Structure

## Complete Directory Tree

```
apps/mobile/
│
├── app/                                    # Expo Router - File-based navigation
│   ├── (auth)/                            # Auth group (login/register)
│   │   ├── _layout.tsx                    # Auth stack layout
│   │   ├── login.tsx                      # Login screen
│   │   └── register.tsx                   # Registration screen
│   │
│   ├── (tabs)/                            # Main app tabs
│   │   ├── _layout.tsx                    # Bottom tabs layout
│   │   ├── index.tsx                      # Home screen (dashboard)
│   │   ├── appointments.tsx               # Appointments list screen
│   │   └── profile.tsx                    # User profile screen
│   │
│   ├── _layout.tsx                        # Root layout with providers
│   └── index.tsx                          # Entry point (redirects)
│
├── src/                                    # Source code
│   ├── api/                               # API layer
│   │   └── client.ts                      # Axios client with interceptors
│   │
│   ├── components/                        # Reusable UI components
│   │   ├── Button.tsx                     # Custom button component
│   │   ├── Card.tsx                       # Card container component
│   │   ├── Input.tsx                      # Form input component
│   │   ├── LoadingSpinner.tsx            # Loading indicator
│   │   └── index.ts                       # Component exports
│   │
│   ├── hooks/                             # Custom React hooks
│   │   ├── useAuth.ts                     # Authentication hook
│   │   ├── useAppointments.ts            # Appointments data hooks
│   │   └── index.ts                       # Hook exports
│   │
│   ├── store/                             # State management
│   │   └── authStore.ts                   # Zustand auth store
│   │
│   ├── theme/                             # Design system
│   │   └── index.ts                       # Theme configuration
│   │
│   └── types/                             # TypeScript types
│       └── index.ts                       # Type definitions
│
├── .env.example                           # Environment variables template
├── .eslintrc.js                          # ESLint configuration
├── .gitignore                            # Git ignore rules
├── app.json                              # Expo app configuration
├── babel.config.js                       # Babel configuration
├── eas.json                              # EAS Build configuration
├── FILE_STRUCTURE.md                     # This file
├── IMPLEMENTATION_SUMMARY.md             # Detailed implementation guide
├── package.json                          # Dependencies and scripts
├── QUICKSTART.md                         # Quick start guide
├── README.md                             # Main documentation
└── tsconfig.json                         # TypeScript configuration
```

## File Descriptions

### Root Configuration Files

| File | Purpose |
|------|---------|
| `.env.example` | Template for environment variables (API URL, etc.) |
| `.eslintrc.js` | Code linting rules and configuration |
| `.gitignore` | Files/folders to ignore in git |
| `app.json` | Expo app metadata and configuration |
| `babel.config.js` | JavaScript transpilation settings |
| `eas.json` | EAS Build and Submit configuration |
| `package.json` | npm dependencies and scripts |
| `tsconfig.json` | TypeScript compiler options |

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation |
| `QUICKSTART.md` | Getting started guide |
| `IMPLEMENTATION_SUMMARY.md` | Detailed implementation overview |
| `FILE_STRUCTURE.md` | This file - project structure |

### App Directory (Navigation)

#### Root Level
- **`app/_layout.tsx`**: Root layout with QueryClient provider, auth initialization, and navigation guards
- **`app/index.tsx`**: Entry point that redirects to appropriate route based on auth state

#### Auth Group - `app/(auth)/`
- **`_layout.tsx`**: Stack navigator for authentication screens
- **`login.tsx`**: Email/password login with validation
- **`register.tsx`**: User registration with role selection

#### Tabs Group - `app/(tabs)/`
- **`_layout.tsx`**: Bottom tab navigator for main app
- **`index.tsx`**: Home dashboard with quick actions and upcoming appointments
- **`appointments.tsx`**: Full appointments list with filtering (upcoming/past/cancelled)
- **`profile.tsx`**: User profile with settings menu and logout

### Source Directory - `src/`

#### API - `src/api/`
- **`client.ts`**:
  - Axios instance with base URL
  - Request interceptor for auth tokens
  - Response interceptor for token refresh
  - Secure token storage utilities
  - HTTP method wrappers (get, post, put, patch, delete)

#### Components - `src/components/`
- **`Button.tsx`**: Customizable button with variants, sizes, loading state
- **`Card.tsx`**: Container component with elevation and outline variants
- **`Input.tsx`**: Form input with label, error, helper text, and icons
- **`LoadingSpinner.tsx`**: Loading indicator with optional message
- **`index.ts`**: Component exports barrel file

#### Hooks - `src/hooks/`
- **`useAuth.ts`**: Auth store wrapper hook
- **`useAppointments.ts`**: React Query hooks for appointments CRUD
- **`index.ts`**: Hook exports barrel file

#### Store - `src/store/`
- **`authStore.ts`**:
  - Zustand store for authentication
  - Persisted state with expo-secure-store
  - Login, register, logout actions
  - Auto-initialization logic

#### Theme - `src/theme/`
- **`index.ts`**:
  - Color palette (primary, secondary, success, error, etc.)
  - Spacing scale (xs to xxxl)
  - Typography (fonts, sizes, weights)
  - Border radius values
  - Shadow presets

#### Types - `src/types/`
- **`index.ts`**:
  - User, Doctor, Appointment types
  - Auth-related types (credentials, tokens, responses)
  - API response types (paginated, errors)

## Import Paths

### Absolute Imports (configured in tsconfig.json)
```typescript
// Components
import { Button, Input, Card } from '@components';

// Hooks
import { useAuth, useAppointments } from '@hooks';

// API
import { apiClient } from '@api/client';

// Store
import { useAuthStore } from '@store/authStore';

// Theme
import { colors, spacing, typography } from '@theme';

// Types
import { User, Appointment } from '@types';
```

### Relative Imports (from components/screens)
```typescript
// From app/ screens
import { Button } from '../../src/components';
import { useAuth } from '../../src/hooks';

// From src/ files
import { colors } from '../theme';
import { User } from '../types';
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`, `LoadingSpinner.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.ts`, `useAppointments.ts`)
- **Screens**: camelCase (e.g., `login.tsx`, `appointments.tsx`)
- **Layouts**: `_layout.tsx` (Expo Router convention)
- **Stores**: camelCase with 'Store' suffix (e.g., `authStore.ts`)
- **Types**: `index.ts` for consolidated exports
- **Config**: lowercase or kebab-case (e.g., `tsconfig.json`, `babel.config.js`)

## Code Organization Principles

1. **Feature-based**: Group related functionality together
2. **Separation of Concerns**: API, UI, state, and business logic separated
3. **Reusability**: Shared components and hooks in dedicated folders
4. **Type Safety**: TypeScript types centralized and exported
5. **Configuration**: All config files at root level
6. **Documentation**: Comprehensive docs for onboarding and reference

## Adding New Files

### New Screen
```
app/my-screen.tsx  (or app/(group)/my-screen.tsx)
```

### New Component
```
src/components/MyComponent.tsx
+ Export from src/components/index.ts
```

### New Hook
```
src/hooks/useMyData.ts
+ Export from src/hooks/index.ts
```

### New Store
```
src/store/myStore.ts
```

### New Type
```
Add to src/types/index.ts (or create src/types/myTypes.ts)
```

## File Size Guidelines

- **Components**: 100-300 lines (split if larger)
- **Screens**: 200-500 lines (extract components if larger)
- **Hooks**: 50-200 lines (one hook per file)
- **Stores**: 100-300 lines (split by domain if larger)
- **Types**: 50-200 lines per file

## Dependencies Between Files

```
app/_layout.tsx
  └─> src/hooks/useAuth.ts
        └─> src/store/authStore.ts
              └─> src/api/client.ts
                    └─> src/types/index.ts

app/(tabs)/index.tsx
  └─> src/hooks/useAppointments.ts
  └─> src/components/*
  └─> src/theme/index.ts

src/components/Button.tsx
  └─> src/theme/index.ts
```

## Bundle Size Impact

Approximate contribution to bundle size:
- **Expo + React Native**: ~3 MB (base)
- **Navigation (expo-router)**: ~200 KB
- **State (Zustand + React Query)**: ~150 KB
- **API (Axios)**: ~100 KB
- **Custom Code**: ~50 KB
- **Total**: ~3.5 MB (minified)

## Development Workflow

1. **Start**: Run `npm run dev`
2. **Edit**: Modify files in `src/` or `app/`
3. **Hot Reload**: Changes reflect automatically
4. **Test**: Manual testing on simulator/device
5. **Commit**: Git commit changes
6. **Build**: Create build with EAS

## Production Build Output

After build:
- **iOS**: `.ipa` file (~30-50 MB)
- **Android**: `.apk` or `.aab` file (~25-40 MB)
- **OTA Updates**: JavaScript bundle (~1-2 MB)

## Summary

- **Total Files**: 30+ source files
- **Total Lines**: ~2,500+ lines of code
- **Languages**: TypeScript (95%), JavaScript (5%)
- **Architecture**: Feature-based with clear separation
- **Maintainability**: High (clear structure, good documentation)
- **Scalability**: Excellent (easy to extend)

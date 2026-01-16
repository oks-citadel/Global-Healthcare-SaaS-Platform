# Unified Health Mobile App

React Native mobile application for the Unified Health platform, built with Expo.

## Features

- **Authentication**: Secure login and registration with JWT tokens stored in expo-secure-store
- **Appointments Management**: View, book, and cancel appointments
- **User Profile**: Manage personal information and settings
- **Real-time Data**: React Query for efficient data fetching and caching
- **State Management**: Zustand for global state with persistent storage
- **Type Safety**: Full TypeScript support

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: expo-router (file-based routing)
- **State Management**: Zustand with expo-secure-store persistence
- **Data Fetching**: React Query (@tanstack/react-query)
- **API Client**: Axios with interceptors
- **Styling**: StyleSheet API with theme system
- **Type Safety**: TypeScript

## Project Structure

```
apps/mobile/
├── app/                      # Expo Router pages
│   ├── (auth)/              # Auth screens (login, register)
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/              # Main app tabs
│   │   ├── _layout.tsx
│   │   ├── index.tsx        # Home screen
│   │   ├── appointments.tsx
│   │   └── profile.tsx
│   └── _layout.tsx          # Root layout
├── src/
│   ├── api/                 # API client and configuration
│   │   └── client.ts
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── index.ts
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useAppointments.ts
│   │   └── index.ts
│   ├── store/               # Zustand stores
│   │   └── authStore.ts
│   ├── theme/               # Theme configuration
│   │   └── index.ts
│   └── types/               # TypeScript type definitions
│       └── index.ts
├── package.json
├── tsconfig.json
├── babel.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Emulator
- Physical device with Expo Go app (optional)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update the API URL in `.env` to point to your backend:
```
API_URL=http://localhost:3000/api
```

### Running the App

Start the development server:
```bash
npm run dev
```

Run on specific platforms:
```bash
npm run ios       # iOS Simulator
npm run android   # Android Emulator
npm run web       # Web browser
```

## Key Features Implementation

### Authentication

The app uses a secure authentication system with:
- JWT tokens stored in expo-secure-store
- Automatic token refresh on 401 responses
- Protected routes with navigation guards
- Persistent login across app restarts

### API Client

Configured with:
- Request interceptors to add auth tokens
- Response interceptors for token refresh
- Error handling with automatic retries
- Base URL configuration for dev/prod

### State Management

- **Auth Store**: User session, tokens, login/logout actions
- **Zustand**: Lightweight state management with middleware
- **Persistence**: Secure storage for sensitive data

### Data Fetching

React Query provides:
- Automatic caching and background refetching
- Optimistic updates for mutations
- Loading and error states
- Pagination support

### Theme System

Centralized theme with:
- Color palette (primary, secondary, success, error, etc.)
- Typography scale
- Spacing constants
- Shadow presets
- Light/dark mode support

## Components

### Button
Customizable button with variants (primary, secondary, outline, ghost, danger) and sizes.

### Input
Form input with validation, error states, and helper text support.

### Card
Container component with elevation and outline variants.

### LoadingSpinner
Loading indicator with optional message and fullscreen mode.

## Screens

### Authentication
- **Login**: Email/password login with validation
- **Register**: User registration with role selection

### Main App
- **Home**: Dashboard with quick actions and upcoming appointments
- **Appointments**: List of all appointments with tabs (upcoming, past, cancelled)
- **Profile**: User profile with settings menu and logout

## Development

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

### Testing
```bash
npm run test
```

## Building

### Development Build
```bash
npm run build:preview
```

### Production Build
```bash
npm run build:production
```

## Deployment

The app uses EAS (Expo Application Services) for building and deployment:

1. Configure EAS:
```bash
eas build:configure
```

2. Build for app stores:
```bash
npm run build:production
```

3. Submit to stores:
```bash
npm run submit
```

## Environment Variables

- `API_URL`: Backend API base URL
- `NODE_ENV`: Environment (development/production)
- `ENABLE_ANALYTICS`: Enable analytics tracking
- `ENABLE_PUSH_NOTIFICATIONS`: Enable push notifications

## API Integration

The app expects the following API endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user

### Appointments
- `GET /appointments` - List appointments
- `GET /appointments/:id` - Get appointment details
- `POST /appointments` - Create appointment
- `PATCH /appointments/:id` - Update appointment
- `PATCH /appointments/:id/cancel` - Cancel appointment
- `GET /appointments/upcoming` - Get upcoming appointments
- `GET /appointments/past` - Get past appointments

## Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Write descriptive commit messages
4. Test on both iOS and Android
5. Update documentation as needed

## License

MIT

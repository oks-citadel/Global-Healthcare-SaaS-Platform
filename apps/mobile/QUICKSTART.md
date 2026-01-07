# Quick Start Guide - Unified Health Mobile App

## Installation

1. **Install dependencies**:
```bash
cd apps/mobile
npm install
```

2. **Set up environment**:
```bash
cp .env.example .env
```

Edit `.env` and update the API URL:
```
API_URL=http://localhost:3000/api
```

## Running the App

### Development Mode

Start Expo development server:
```bash
npm run dev
```

This will show a QR code. You can:
- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Scan QR code with Expo Go app on your phone

### Platform-Specific Commands

```bash
npm run ios       # Run on iOS Simulator (Mac only)
npm run android   # Run on Android Emulator
npm run web       # Run in web browser
```

## Project Structure Overview

```
apps/mobile/
├── app/                          # Expo Router pages (file-based routing)
│   ├── (auth)/                   # Authentication screens
│   │   ├── login.tsx            # Login screen
│   │   └── register.tsx         # Register screen
│   ├── (tabs)/                   # Main app with tab navigation
│   │   ├── index.tsx            # Home screen
│   │   ├── appointments.tsx     # Appointments screen
│   │   └── profile.tsx          # Profile screen
│   └── _layout.tsx              # Root layout with providers
│
├── src/
│   ├── api/
│   │   └── client.ts            # Axios instance with interceptors
│   ├── components/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── LoadingSpinner.tsx
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts          # Authentication hook
│   │   └── useAppointments.ts  # Appointments data hooks
│   ├── store/
│   │   └── authStore.ts        # Zustand auth store with persistence
│   ├── theme/
│   │   └── index.ts            # Theme configuration (colors, spacing, etc.)
│   └── types/
│       └── index.ts            # TypeScript type definitions
```

## Key Features

### 1. Authentication
- **Secure Storage**: JWT tokens stored in expo-secure-store
- **Auto Refresh**: Automatic token refresh on expiry
- **Persistent Login**: Stay logged in across app restarts
- **Protected Routes**: Automatic navigation based on auth state

### 2. API Client
- **Interceptors**: Auto-inject auth tokens in requests
- **Error Handling**: Automatic retry and token refresh
- **Type Safety**: Full TypeScript support

### 3. State Management
- **Zustand**: Lightweight global state
- **Persistence**: Secure storage for sensitive data
- **React Query**: Server state management with caching

### 4. Navigation
- **File-based Routing**: Expo Router for intuitive navigation
- **Auth Flow**: Separate stacks for auth and main app
- **Tab Navigation**: Bottom tabs for main screens

## Common Tasks

### Adding a New Screen

1. Create a new file in `app/` directory:
```tsx
// app/new-screen.tsx
export default function NewScreen() {
  return (
    <View>
      <Text>New Screen</Text>
    </View>
  );
}
```

2. Navigate to it:
```tsx
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/new-screen');
```

### Creating a New Component

1. Create component in `src/components/`:
```tsx
// src/components/MyComponent.tsx
import React from 'react';
import { View, Text } from 'react-native';

export const MyComponent = () => {
  return (
    <View>
      <Text>My Component</Text>
    </View>
  );
};
```

2. Export from index:
```tsx
// src/components/index.ts
export { MyComponent } from './MyComponent';
```

### Adding a New API Endpoint

1. Create a hook in `src/hooks/`:
```tsx
// src/hooks/useMyData.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';

export const useMyData = () => {
  return useQuery({
    queryKey: ['myData'],
    queryFn: async () => {
      return await apiClient.get('/my-endpoint');
    },
  });
};
```

2. Use in component:
```tsx
import { useMyData } from '../src/hooks/useMyData';

const { data, isLoading, error } = useMyData();
```

### Styling with Theme

```tsx
import { colors, spacing, typography } from '../src/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary[500],
    padding: spacing.md,
  },
  text: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.light.text.primary,
  },
});
```

## Testing

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

### Unit Tests
```bash
npm run test
```

## Building for Production

### Preview Build (Internal Testing)
```bash
npm run build:preview
```

### Production Build (App Store)
```bash
npm run build:production
```

## Troubleshooting

### Metro Bundler Cache Issues
```bash
expo start -c
```

### Clean Install
```bash
rm -rf node_modules
npm install
```

### iOS Simulator Issues
```bash
npx expo run:ios --clean
```

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
npx expo run:android
```

## Environment Configuration

### Development
- Uses local API: `http://localhost:3000/api`
- Debug mode enabled
- Hot reloading enabled

### Production
- Uses production API URL
- Minified and optimized
- Error tracking enabled

## Next Steps

1. **Connect to Backend**: Ensure your backend API is running
2. **Test Authentication**: Try login/register flows
3. **Explore Screens**: Navigate through home, appointments, profile
4. **Customize Theme**: Modify colors and styles in `src/theme/index.ts`
5. **Add Features**: Extend with new screens and functionality

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://expo.github.io/router/docs/)
- [React Native](https://reactnative.dev/)
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)

## Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review the code comments in each file
3. Consult the official documentation links above

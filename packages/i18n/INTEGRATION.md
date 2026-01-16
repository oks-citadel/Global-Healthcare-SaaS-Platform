# i18n Integration Guide

This guide shows how to integrate the i18n package into different parts of the Unified Health Platform.

## Web App Integration

### Step 1: Update Root Layout

```tsx
// apps/web/src/app/layout.tsx
import { AppI18nProvider } from './providers/I18nProvider';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppI18nProvider>
          {children}
        </AppI18nProvider>
      </body>
    </html>
  );
}
```

### Step 2: Add Language Switcher to Navigation

```tsx
// apps/web/src/components/Navigation.tsx
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from '@unified-health/i18n/hooks/useTranslation';

export function Navigation() {
  const { t } = useTranslation('common');

  return (
    <nav className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        <a href="/">{t('nav.home')}</a>
        <a href="/appointments">{t('nav.appointments')}</a>
        <a href="/patients">{t('nav.patients')}</a>
      </div>

      <LanguageSwitcher variant="dropdown" />
    </nav>
  );
}
```

### Step 3: Update Login Page

```tsx
// apps/web/src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useTranslation } from '@unified-health/i18n/hooks/useTranslation';

export default function LoginPage() {
  const { t } = useTranslation('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-3xl font-bold">{t('login.title')}</h2>
          <p className="text-gray-600">{t('login.subtitle')}</p>
        </div>

        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              {t('login.email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('login.email')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              {t('login.password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('login.password')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded" />
              <span className="ml-2 text-sm">{t('login.rememberMe')}</span>
            </label>
            <a href="/forgot-password" className="text-sm text-primary">
              {t('login.forgotPassword')}
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md"
          >
            {t('login.submit')}
          </button>
        </form>

        <p className="text-center text-sm">
          {t('login.noAccount')}{' '}
          <a href="/register" className="text-primary">
            {t('login.signUp')}
          </a>
        </p>
      </div>
    </div>
  );
}
```

### Step 4: Update Dashboard

```tsx
// apps/web/src/app/dashboard/page.tsx
'use client';

import { useTranslation } from '@unified-health/i18n/hooks/useTranslation';
import { formatDate, formatNumber } from '@unified-health/i18n';

export default function DashboardPage() {
  const { t } = useTranslation('dashboard');
  const userName = 'Dr. Smith'; // Get from auth context

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        {t('welcome', { name: userName })}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title={t('stats.todayAppointments')}
          value="12"
          icon="calendar"
        />
        <StatCard
          title={t('stats.patients')}
          value={formatNumber(1234)}
          icon="users"
        />
        <StatCard
          title={t('stats.revenue')}
          value="$45,678"
          icon="dollar"
        />
        <StatCard
          title={t('stats.patientSatisfaction')}
          value="98%"
          icon="heart"
        />
      </div>

      {/* More dashboard content */}
    </div>
  );
}
```

### Step 5: Error Handling

```tsx
// apps/web/src/components/ErrorBoundary.tsx
'use client';

import { useTranslation } from '@unified-health/i18n/hooks/useTranslation';

export function ErrorDisplay({ error }: { error: Error }) {
  const { t } = useTranslation('errors');

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{t('general.error')}</h1>
        <p className="text-gray-600 mb-8">{t('general.serverError')}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-white px-6 py-2 rounded-md"
        >
          {t('actions.tryAgain')}
        </button>
      </div>
    </div>
  );
}
```

## API Integration

### Step 1: Add Middleware

```typescript
// services/api/src/index.ts
import express from 'express';
import { languageMiddleware, errorHandler } from './lib/i18n';

const app = express();

// Add body parser
app.use(express.json());

// Add i18n middleware (early in the chain)
app.use(languageMiddleware);

// Your routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patients', patientRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(3001, () => {
  console.log('API server running on port 3001');
});
```

### Step 2: Use in Controllers

```typescript
// services/api/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { formatErrorResponse, translateError } from '../lib/i18n';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Your authentication logic
      const user = await authenticate(email, password);

      if (!user) {
        const language = req.language || 'en';
        const errorResponse = formatErrorResponse(
          'auth.invalidCredentials',
          language,
          401
        );
        return res.status(401).json(errorResponse);
      }

      // Success response
      const message = req.t('auth:login.success');
      res.json({
        success: true,
        message,
        user,
        token: generateToken(user),
      });
    } catch (error) {
      throw error; // Will be caught by error handler middleware
    }
  }

  async register(req: Request, res: Response) {
    try {
      // Validation
      const errors = validateRegistration(req.body);
      if (errors.length > 0) {
        const language = req.language || 'en';
        const translatedErrors = errors.map(err => ({
          field: err.field,
          message: req.translations.errors(`validation.${err.type}`, {
            field: err.field,
            ...err.params
          })
        }));

        return res.status(400).json({
          success: false,
          errors: translatedErrors
        });
      }

      // Registration logic
      const user = await createUser(req.body);

      const message = req.t('auth:register.success');
      res.status(201).json({
        success: true,
        message,
        user,
      });
    } catch (error) {
      throw error;
    }
  }
}
```

### Step 3: Custom Error Classes

```typescript
// services/api/src/lib/errors.ts
export class AppError extends Error {
  constructor(
    public errorKey: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(errorKey);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(details?: any) {
    super('general.badRequest', 400, details);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(errorKey: string = 'auth.unauthorized') {
    super(errorKey, 401);
    this.name = 'UnauthorizedError';
  }
}

export class NotFoundError extends AppError {
  constructor(errorKey: string = 'general.notFound') {
    super(errorKey, 404);
    this.name = 'NotFoundError';
  }
}

// Usage in controller
import { UnauthorizedError, NotFoundError } from '../lib/errors';

if (!user) {
  throw new UnauthorizedError('auth.invalidCredentials');
}

if (!appointment) {
  throw new NotFoundError('appointments.notFound');
}
```

## Mobile App Integration

### Step 1: Update App Entry Point

```tsx
// apps/mobile/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppI18nProvider } from './src/providers/I18nProvider';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <AppI18nProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AppI18nProvider>
  );
}
```

### Step 2: Create Settings Screen with Language Selector

```tsx
// apps/mobile/src/screens/SettingsScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from '@unified-health/i18n/hooks/useTranslation';
import { useLanguage } from '../providers/I18nProvider';
import { languageNames, languageFlags } from '@unified-health/i18n';

export function SettingsScreen() {
  const { t } = useTranslation('common');
  const { currentLanguage, changeLanguage, isChanging } = useLanguage();

  const languages = ['en', 'es', 'fr'] as const;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('nav.settings')}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language / Idioma / Langue</Text>

        {languages.map((lang) => (
          <TouchableOpacity
            key={lang}
            style={[
              styles.languageOption,
              currentLanguage === lang && styles.languageOptionActive,
            ]}
            onPress={() => changeLanguage(lang)}
            disabled={isChanging}
          >
            <Text style={styles.languageFlag}>{languageFlags[lang]}</Text>
            <Text style={styles.languageName}>{languageNames[lang]}</Text>
            {currentLanguage === lang && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
  languageOptionActive: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#2196f3',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
  },
  checkmark: {
    fontSize: 20,
    color: '#2196f3',
  },
});
```

## Testing i18n

### Unit Tests

```typescript
// apps/web/src/__tests__/i18n.test.ts
import { renderHook } from '@testing-library/react';
import { useTranslation } from '@unified-health/i18n/hooks/useTranslation';
import { changeLanguage } from '@unified-health/i18n';

describe('i18n', () => {
  it('should translate keys correctly', () => {
    const { result } = renderHook(() => useTranslation('common'));
    expect(result.current.t('app.name')).toBe('Unified Health Platform');
  });

  it('should handle interpolation', () => {
    const { result } = renderHook(() => useTranslation('dashboard'));
    expect(result.current.t('welcome', { name: 'John' })).toBe(
      'Welcome back, John!'
    );
  });

  it('should change language', async () => {
    await changeLanguage('es');
    const { result } = renderHook(() => useTranslation('common'));
    expect(result.current.t('app.name')).toBe('Plataforma de Salud Unificada');
  });
});
```

## Deployment Checklist

- [ ] Verify all translation files are complete
- [ ] Test language switching in all apps (web, mobile, API)
- [ ] Test middleware locale detection
- [ ] Verify date/time formatting for all locales
- [ ] Test error messages in all languages
- [ ] Ensure fallback to English works
- [ ] Test with different Accept-Language headers
- [ ] Verify cookie/localStorage persistence
- [ ] Test mobile device language detection
- [ ] Review and test all interpolation scenarios
- [ ] Test RTL languages (if applicable)
- [ ] Verify SEO meta tags use correct language

## Common Issues and Solutions

### Issue: Translations not updating

**Solution:** Clear browser cache and localStorage
```javascript
localStorage.removeItem('i18nextLng');
window.location.reload();
```

### Issue: Missing translation keys

**Solution:** Check the namespace and key path
```typescript
// Correct
t('common:app.name')
t('auth:login.title')

// Incorrect
t('app.name') // if not using 'common' as default namespace
```

### Issue: Language not persisting

**Solution:** Ensure middleware is properly configured and cookies are enabled

## Resources

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [Next.js Internationalization](https://nextjs.org/docs/advanced-features/i18n-routing)
- [React Native Localization](https://docs.expo.dev/versions/latest/sdk/localization/)

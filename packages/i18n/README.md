# @unified-health/i18n

Internationalization package for the Unified Health Platform. Provides comprehensive translation support for English, Spanish, and French across web, mobile, and API applications.

## Features

- Full TypeScript support with autocomplete
- Support for 3 languages: English (en), Spanish (es), French (fr)
- React hooks for easy integration
- Server-side translation support
- Automatic language detection
- LocalStorage/AsyncStorage persistence
- Namespace organization (common, auth, dashboard, appointments, errors)
- Helper functions for date, time, number, and currency formatting

## Installation

```bash
# Using pnpm (recommended)
pnpm add @unified-health/i18n

# Using npm
npm install @unified-health/i18n

# Using yarn
yarn add @unified-health/i18n
```

## Usage

### Web Application (Next.js/React)

#### 1. Wrap your app with I18nProvider

```tsx
// app/layout.tsx or _app.tsx
import { AppI18nProvider } from '@unified-health/i18n';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppI18nProvider>
          {children}
        </AppI18nProvider>
      </body>
    </html>
  );
}
```

#### 2. Use translations in components

```tsx
import { useTranslation } from '@unified-health/i18n/hooks/useTranslation';

function MyComponent() {
  // Using default namespace (common)
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('app.name')}</h1>
      <p>{t('app.tagline')}</p>
    </div>
  );
}
```

#### 3. Use specific namespaces

```tsx
import { useTranslation } from '@unified-health/i18n/hooks/useTranslation';

function LoginForm() {
  const { t } = useTranslation('auth');

  return (
    <form>
      <h2>{t('login.title')}</h2>
      <input placeholder={t('login.email')} />
      <input placeholder={t('login.password')} />
      <button>{t('login.submit')}</button>
    </form>
  );
}
```

#### 4. Use multiple namespaces

```tsx
import { useTranslation } from '@unified-health/i18n/hooks/useTranslation';

function ErrorPage() {
  const { t } = useTranslation(['common', 'errors']);

  return (
    <div>
      <h1>{t('errors:auth.invalidCredentials')}</h1>
      <button>{t('common:actions.back')}</button>
    </div>
  );
}
```

#### 5. Add Language Switcher

```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

function Header() {
  return (
    <header>
      <nav>
        {/* Dropdown variant */}
        <LanguageSwitcher />

        {/* Button variant */}
        <LanguageSwitcher variant="buttons" />

        {/* Compact variant */}
        <LanguageSwitcher variant="compact" />
      </nav>
    </header>
  );
}
```

### Mobile Application (React Native)

#### 1. Wrap your app with I18nProvider

```tsx
// App.tsx
import { AppI18nProvider } from './providers/I18nProvider';

export default function App() {
  return (
    <AppI18nProvider>
      <NavigationContainer>
        {/* Your app navigation */}
      </NavigationContainer>
    </AppI18nProvider>
  );
}
```

#### 2. Use translations in components

```tsx
import { View, Text, Button } from 'react-native';
import { useTranslation } from '@unified-health/i18n/hooks/useTranslation';
import { useLanguage } from './providers/I18nProvider';

function SettingsScreen() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, isChanging } = useLanguage();

  return (
    <View>
      <Text>{t('common:settings.language')}</Text>
      <Text>Current: {currentLanguage}</Text>

      <Button
        title="English"
        onPress={() => changeLanguage('en')}
        disabled={isChanging}
      />
      <Button
        title="Español"
        onPress={() => changeLanguage('es')}
        disabled={isChanging}
      />
      <Button
        title="Français"
        onPress={() => changeLanguage('fr')}
        disabled={isChanging}
      />
    </View>
  );
}
```

### API/Server-side (Express)

#### 1. Use middleware for automatic language detection

```typescript
import express from 'express';
import { languageMiddleware, errorHandler } from './lib/i18n';

const app = express();

// Add language middleware
app.use(languageMiddleware);

// Your routes
app.get('/api/users', (req, res) => {
  // Use attached translation function
  const message = req.t('common:app.name');

  // Or use namespace-specific translations
  const errorMsg = req.translations.errors('auth.unauthorized');

  res.json({ message });
});

// Add error handler (must be last)
app.use(errorHandler);
```

#### 2. Translate error messages

```typescript
import { translateError, formatErrorResponse } from './lib/i18n';

// In your route handler
app.post('/api/login', async (req, res) => {
  try {
    // Your login logic
  } catch (error) {
    const language = req.language || 'en';
    const errorResponse = formatErrorResponse(
      'auth.invalidCredentials',
      language,
      401
    );
    return res.status(401).json(errorResponse);
  }
});
```

#### 3. Translate validation errors

```typescript
import { translateValidationError } from './lib/i18n';

const errors = validationResult(req);
if (!errors.isEmpty()) {
  const language = req.language || 'en';
  const translatedErrors = errors.array().map(err => ({
    field: err.param,
    message: translateValidationError(err.param, 'required', language)
  }));

  return res.status(400).json({ errors: translatedErrors });
}
```

## Helper Functions

### Format Date

```typescript
import { formatDate } from '@unified-health/i18n';

const date = new Date();
const formatted = formatDate(date); // Uses current language
// en: "January 15, 2024"
// es: "15 de enero de 2024"
// fr: "15 janvier 2024"
```

### Format Time

```typescript
import { formatTime } from '@unified-health/i18n';

const date = new Date();
const formatted = formatTime(date);
// en: "02:30 PM"
// es: "14:30"
// fr: "14:30"
```

### Format Number

```typescript
import { formatNumber } from '@unified-health/i18n';

const number = 1234567.89;
const formatted = formatNumber(number);
// en: "1,234,567.89"
// es: "1.234.567,89"
// fr: "1 234 567,89"
```

### Format Currency

```typescript
import { formatCurrency } from '@unified-health/i18n';

const amount = 1234.56;
const formatted = formatCurrency(amount, 'USD');
// en: "$1,234.56"
// es: "1.234,56 US$"
// fr: "1 234,56 $US"
```

### Change Language Programmatically

```typescript
import { changeLanguage } from '@unified-health/i18n';

await changeLanguage('es'); // Switch to Spanish
```

### Get Current Language

```typescript
import { getCurrentLanguage } from '@unified-health/i18n';

const lang = getCurrentLanguage(); // Returns 'en', 'es', or 'fr'
```

## Available Namespaces

### common
General app strings, navigation, actions, status, time, pagination, validation, confirmations

### auth
Authentication and authorization strings (login, register, password reset, 2FA)

### dashboard
Dashboard-specific strings (stats, quick actions, recent activity, calendar, performance)

### appointments
Appointment management strings (create, edit, cancel, reschedule, types, status, filters)

### errors
Error messages (general errors, validation errors, auth errors, appointment errors, etc.)

## Translation Keys Structure

```typescript
// Example: Accessing nested translations
t('app.name')                           // "Unified Health Platform"
t('nav.appointments')                   // "Appointments"
t('actions.save')                       // "Save"
t('auth:login.title')                   // "Sign In"
t('errors:auth.invalidCredentials')     // "Invalid email or password"
t('appointments:status.scheduled')      // "Scheduled"
```

## Interpolation

```typescript
// With parameters
t('dashboard.welcome', { name: 'John' })
// en: "Welcome back, John!"
// es: "¡Bienvenido de nuevo, John!"

t('pagination.showing', { from: 1, to: 10, total: 100 })
// en: "Showing 1 to 10 of 100 entries"
// es: "Mostrando 1 a 10 de 100 entradas"
```

## TypeScript Support

The package includes full TypeScript definitions with autocomplete support:

```typescript
import { useTranslation } from '@unified-health/i18n/hooks/useTranslation';
import type { SupportedLanguage, TranslationNamespace } from '@unified-health/i18n';

// TypeScript will autocomplete available namespaces
const { t } = useTranslation('auth');

// TypeScript will autocomplete translation keys
t('login.title'); // Autocomplete works!
```

## Adding New Languages

To add a new language:

1. Create a new folder in `src/locales/` (e.g., `de` for German)
2. Copy all JSON files from an existing language folder
3. Translate all strings
4. Update `src/index.ts` to include the new language in `resources` and `supportedLanguages`
5. Add language name and flag to `languageNames` and `languageFlags`

## Best Practices

1. Always use translation keys, never hardcode strings
2. Keep translations organized by namespace
3. Use interpolation for dynamic values
4. Test all languages during development
5. Use the language switcher component for consistency
6. Handle missing translations gracefully
7. Consider cultural differences in date/time/number formatting

## License

Proprietary - Unified Health Platform

# Contributing to Hospital Kiosk Application

Thank you for your interest in contributing to the Hospital Kiosk application. This document provides guidelines and standards for development.

## Development Setup

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Getting Started

1. Clone the repository
2. Navigate to the kiosk directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3004 in your browser

## Code Standards

### TypeScript

- Use TypeScript for all new files
- Enable strict mode in tsconfig.json
- Define proper types for all props and state
- Avoid using `any` type unless absolutely necessary

Example:
```typescript
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  // Component implementation
}
```

### React Components

- Use functional components with hooks
- Prefer composition over inheritance
- Keep components focused and single-purpose
- Use descriptive component names

Example:
```typescript
// Good
export function AppointmentScheduler() { ... }

// Avoid
export function Component1() { ... }
```

### Styling

- Use Tailwind CSS utility classes
- Follow the kiosk-specific design tokens
- Maintain minimum touch target sizes (44px)
- Use custom classes for touch-friendly interactions

Example:
```typescript
<button className="btn-touch btn-primary">
  Click Me
</button>
```

### File Organization

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable components
│   └── ui/          # Base UI components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and helpers
└── types/           # TypeScript type definitions
```

## Touch-Screen Guidelines

### Touch Target Sizes

Always use appropriate touch target sizes:

- **Minimum**: 44px × 44px (accessibility standard)
- **Comfortable**: 56px × 56px (recommended for primary actions)
- **Large**: 72px × 72px (for critical actions)

Use the predefined classes:
```typescript
<button className="btn-touch">      {/* 44px min height */}
<button className="btn-touch-lg">   {/* 56px min height */}
<button className="btn-touch-xl">   {/* 72px min height */}
```

### Visual Feedback

Provide clear feedback for touch interactions:

```typescript
// Active state with scale animation
className="active:scale-95 transition-all duration-200"

// Focus state for accessibility
className="focus-visible:ring-4 focus-visible:ring-primary-500"
```

### Typography

Use kiosk-optimized font sizes:

```typescript
text-kiosk-xs   // 18px - minimum readable size
text-kiosk-sm   // 20px - secondary text
text-kiosk-base // 24px - body text
text-kiosk-lg   // 30px - subheadings
text-kiosk-xl   // 36px - headings
text-kiosk-2xl  // 48px - page titles
text-kiosk-3xl  // 60px - hero text
```

## Accessibility

### WCAG 2.1 AA Compliance

- Maintain color contrast ratio of 4.5:1 for normal text
- Maintain color contrast ratio of 3:1 for large text
- Provide text alternatives for images
- Ensure keyboard navigation works
- Use semantic HTML elements

### Screen Reader Support

```typescript
// Good
<button aria-label="Close keyboard">
  <X className="w-6 h-6" />
</button>

// Avoid
<button>
  <X className="w-6 h-6" />
</button>
```

### Focus Management

- Ensure all interactive elements are keyboard accessible
- Provide visible focus indicators
- Manage focus appropriately in modals and dialogs

## Multi-Language Support

### Adding Translations

Edit `src/components/LanguageProvider.tsx`:

```typescript
const translations: Record<Language, Record<string, string>> = {
  en: {
    'your.new.key': 'English text',
  },
  es: {
    'your.new.key': 'Spanish text',
  },
  zh: {
    'your.new.key': 'Chinese text',
  },
}
```

### Using Translations

```typescript
import { useLanguage } from '@/components/LanguageProvider'

function MyComponent() {
  const { t } = useLanguage()
  return <h1>{t('your.new.key')}</h1>
}
```

## State Management

### Local State

Use `useState` for component-local state:

```typescript
const [count, setCount] = useState(0)
```

### Shared State

Use Context API for shared state:

```typescript
// Create context
const MyContext = createContext<MyContextType | undefined>(undefined)

// Provider component
export function MyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialState)
  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  )
}

// Custom hook
export function useMyContext() {
  const context = useContext(MyContext)
  if (!context) throw new Error('useMyContext must be used within MyProvider')
  return context
}
```

## API Integration

### Creating API Functions

Create API functions in `src/lib/api.ts`:

```typescript
export async function createAppointment(data: AppointmentData) {
  try {
    const response = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to create appointment')
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}
```

### Error Handling

Always handle errors gracefully:

```typescript
try {
  await createAppointment(data)
  // Success handling
} catch (error) {
  // Show user-friendly error message
  setError('Unable to schedule appointment. Please try again.')
}
```

## Testing

### Component Testing

Write tests for components:

```typescript
import { render, screen } from '@testing-library/react'
import { ActionButton } from './ActionButton'

describe('ActionButton', () => {
  it('renders with correct label', () => {
    render(
      <ActionButton
        icon={Clock}
        label="Check In"
        description="Check in for appointment"
        color="primary"
        onClick={() => {}}
      />
    )
    expect(screen.getByText('Check In')).toBeInTheDocument()
  })
})
```

### Running Tests

```bash
npm test
```

## Performance Optimization

### Code Splitting

Use dynamic imports for large components:

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
})
```

### Image Optimization

Use Next.js Image component:

```typescript
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Hospital Logo"
  width={200}
  height={100}
  priority
/>
```

### Memoization

Use React.memo and useMemo for expensive operations:

```typescript
const MemoizedComponent = React.memo(MyComponent)

const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data)
}, [data])
```

## Git Workflow

### Branch Naming

- Feature: `feature/description`
- Bug fix: `fix/description`
- Hotfix: `hotfix/description`

### Commit Messages

Follow conventional commits:

```
feat: add payment processing feature
fix: resolve keyboard input bug
docs: update README with deployment instructions
style: improve button contrast ratio
refactor: simplify virtual keyboard logic
test: add tests for check-in flow
chore: update dependencies
```

### Pull Request Process

1. Create feature branch from `main`
2. Make changes and commit
3. Push to remote repository
4. Create pull request with description
5. Request review from team members
6. Address review comments
7. Merge after approval

## Code Review Checklist

- [ ] Code follows TypeScript and React best practices
- [ ] Touch targets meet minimum size requirements
- [ ] Components are accessible (ARIA labels, keyboard navigation)
- [ ] Translations are provided for all user-facing text
- [ ] Error handling is implemented
- [ ] Loading states are shown for async operations
- [ ] Code is properly typed
- [ ] No console errors or warnings
- [ ] Responsive design works on target screen sizes
- [ ] Auto-logout functionality works correctly

## Common Pitfalls

### Avoid Small Touch Targets

```typescript
// Bad
<button className="px-2 py-1 text-sm">Click</button>

// Good
<button className="btn-touch btn-primary">Click</button>
```

### Avoid Hard-coded Strings

```typescript
// Bad
<h1>Welcome to Hospital Kiosk</h1>

// Good
<h1>{t('home.welcome')}</h1>
```

### Avoid Inline Styles

```typescript
// Bad
<div style={{ fontSize: '24px', color: 'blue' }}>Text</div>

// Good
<div className="text-kiosk-base text-primary-600">Text</div>
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Questions?

If you have questions or need help, reach out to the development team or create an issue in the repository.

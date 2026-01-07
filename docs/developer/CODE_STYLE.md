# Code Style Guide

## Overview

This document outlines the coding standards and best practices for the Unified Health Global Platform. Consistent code style improves readability, maintainability, and collaboration.

## General Principles

1. **Write Clean Code** - Code should be self-documenting
2. **Follow SOLID Principles** - Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion
3. **Keep It Simple** - Avoid over-engineering
4. **Be Consistent** - Follow established patterns
5. **Test Your Code** - Write tests for all business logic
6. **Document Complex Logic** - Add comments for non-obvious code

## TypeScript/JavaScript

### Naming Conventions

**Variables and Functions - camelCase**
```typescript
const userName = 'John Doe';
const isAuthenticated = true;

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**Classes and Interfaces - PascalCase**
```typescript
class UserService {
  // ...
}

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}
```

**Constants - UPPER_SNAKE_CASE**
```typescript
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.theunifiedhealth.com';
const JWT_EXPIRY_TIME = 3600;
```

**Private Class Members - Prefix with underscore**
```typescript
class UserRepository {
  private _connection: DatabaseConnection;

  constructor(connection: DatabaseConnection) {
    this._connection = connection;
  }
}
```

**Boolean Variables - Prefix with is/has/can/should**
```typescript
const isLoading = false;
const hasPermission = true;
const canEdit = false;
const shouldUpdate = true;
```

### File Naming

**Component Files - PascalCase.tsx**
```
UserProfile.tsx
AppointmentCard.tsx
PatientDashboard.tsx
```

**Service/Utility Files - camelCase.ts**
```
userService.ts
authUtils.ts
dateFormatter.ts
```

**Type/Interface Files - camelCase.types.ts**
```
user.types.ts
appointment.types.ts
api.types.ts
```

### Code Organization

**Imports Order**
```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 2. Internal modules (absolute imports)
import { UserService } from '@/services/user.service';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/date';

// 3. Type imports
import type { User } from '@/types/user.types';

// 4. Relative imports
import './UserProfile.css';
```

**Export Order**
```typescript
// 1. Types/Interfaces
export interface UserProfile {
  // ...
}

// 2. Constants
export const DEFAULT_AVATAR = '/images/default-avatar.png';

// 3. Functions
export function formatUserName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}

// 4. Classes
export class UserService {
  // ...
}

// 5. Default export (if any)
export default UserProfile;
```

### Type Safety

**Always Use TypeScript Types**
```typescript
// ❌ Bad
function getUser(id) {
  return fetch(`/api/users/${id}`);
}

// ✅ Good
function getUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`).then(res => res.json());
}
```

**Avoid Any Type**
```typescript
// ❌ Bad
function processData(data: any) {
  return data.map(item => item.value);
}

// ✅ Good
interface DataItem {
  value: number;
}

function processData(data: DataItem[]): number[] {
  return data.map(item => item.value);
}
```

**Use Type Guards**
```typescript
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj
  );
}

function processUser(data: unknown) {
  if (isUser(data)) {
    // TypeScript knows data is User here
    console.log(data.email);
  }
}
```

### Functions

**Use Arrow Functions for Callbacks**
```typescript
// ❌ Bad
users.map(function(user) {
  return user.name;
});

// ✅ Good
users.map(user => user.name);
```

**Keep Functions Small**
```typescript
// ❌ Bad - Too many responsibilities
function processUserAndSendEmail(userData: any) {
  // Validate
  if (!userData.email) throw new Error('Email required');

  // Create user
  const user = createUser(userData);

  // Send welcome email
  sendEmail(user.email, 'Welcome!');

  // Log activity
  logActivity('user_created', user.id);

  // Update analytics
  updateAnalytics('new_user');

  return user;
}

// ✅ Good - Single responsibility
function createUser(userData: UserData): User {
  validateUserData(userData);
  return userRepository.create(userData);
}

function onUserCreated(user: User): void {
  sendWelcomeEmail(user);
  logUserCreation(user);
  trackNewUser();
}
```

**Use Descriptive Parameter Names**
```typescript
// ❌ Bad
function book(d: Date, p: string, t: string) {
  // ...
}

// ✅ Good
function bookAppointment(
  date: Date,
  patientId: string,
  appointmentType: string
) {
  // ...
}
```

### Error Handling

**Use Custom Error Classes**
```typescript
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with ID ${id} not found`);
    this.name = 'NotFoundError';
  }
}
```

**Handle Errors Gracefully**
```typescript
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new NotFoundError('User', id);
      }
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof NotFoundError) {
      logger.warn('User not found', { id });
      throw error;
    }

    logger.error('Failed to fetch user', { id, error });
    throw new Error('Failed to fetch user');
  }
}
```

### Async/Await

**Always Use async/await Over Promises**
```typescript
// ❌ Bad
function getUsers() {
  return fetch('/api/users')
    .then(res => res.json())
    .then(users => users.filter(u => u.active))
    .catch(error => console.error(error));
}

// ✅ Good
async function getUsers(): Promise<User[]> {
  try {
    const response = await fetch('/api/users');
    const users = await response.json();
    return users.filter(u => u.active);
  } catch (error) {
    logger.error('Failed to get users', error);
    throw error;
  }
}
```

## React/Next.js

### Component Structure

**Functional Components with TypeScript**
```typescript
import React, { useState, useEffect } from 'react';
import type { FC } from 'react';

interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

export const UserProfile: FC<UserProfileProps> = ({ userId, onUpdate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <ErrorMessage>User not found</ErrorMessage>;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};
```

**Use Custom Hooks**
```typescript
// hooks/useUser.ts
export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading, error };
}

// Component usage
const UserProfile: FC<Props> = ({ userId }) => {
  const { user, loading, error } = useUser(userId);
  // ...
};
```

### State Management

**Prefer Local State**
```typescript
// ✅ Good for component-specific state
const [isOpen, setIsOpen] = useState(false);
```

**Use Zustand for Global State**
```typescript
// stores/userStore.ts
import { create } from 'zustand';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// Component usage
const { user, setUser } = useUserStore();
```

### Component Props

**Use Interface for Props**
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const Button: FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  icon,
}) => {
  // ...
};
```

## API Design

### RESTful Conventions

**Use Proper HTTP Methods**
```typescript
// ❌ Bad
POST /api/getUsers
POST /api/deleteUser/:id

// ✅ Good
GET /api/users
DELETE /api/users/:id
```

**Use Plural Nouns for Collections**
```typescript
// ❌ Bad
GET /api/user
GET /api/appointment

// ✅ Good
GET /api/users
GET /api/appointments
```

### Request/Response Format

**Standard Response Format**
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta: {
    requestId: string;
    timestamp: string;
  };
}
```

**Validation with Zod**
```typescript
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['patient', 'provider', 'admin']),
});

export async function createUser(req: Request, res: Response) {
  try {
    const validated = createUserSchema.parse(req.body);
    const user = await userService.create(validated);

    res.status(201).json({
      success: true,
      data: user,
      meta: {
        requestId: req.id,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: error.errors,
        },
      });
    }
    throw error;
  }
}
```

## Database

### Prisma Best Practices

**Use Transactions for Related Operations**
```typescript
async function createAppointmentWithPayment(data: AppointmentData) {
  return prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.create({
      data: {
        patientId: data.patientId,
        providerId: data.providerId,
        startTime: data.startTime,
      },
    });

    const payment = await tx.payment.create({
      data: {
        appointmentId: appointment.id,
        amount: data.amount,
        status: 'pending',
      },
    });

    return { appointment, payment };
  });
}
```

**Use Select to Limit Fields**
```typescript
// ❌ Bad - Returns all fields including passwordHash
const user = await prisma.user.findUnique({
  where: { id: userId },
});

// ✅ Good - Only returns needed fields
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
  },
});
```

## Testing

### Test Structure

**Follow AAA Pattern (Arrange, Act, Assert)**
```typescript
describe('UserService', () => {
  it('should create a new user', async () => {
    // Arrange
    const userData = {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
    };

    // Act
    const user = await userService.create(userData);

    // Assert
    expect(user).toBeDefined();
    expect(user.email).toBe(userData.email);
    expect(user.passwordHash).not.toBe(userData.password);
  });
});
```

### Test Naming

```typescript
// Format: should [expected behavior] when [condition]
it('should return 401 when token is invalid', async () => {
  // ...
});

it('should create appointment when slot is available', async () => {
  // ...
});
```

## Documentation

### JSDoc Comments

```typescript
/**
 * Creates a new user account
 *
 * @param userData - User registration data
 * @returns The created user object
 * @throws {ValidationError} If user data is invalid
 * @throws {ConflictError} If email already exists
 *
 * @example
 * ```typescript
 * const user = await createUser({
 *   email: 'john@example.com',
 *   password: 'SecurePass123!',
 *   firstName: 'John',
 *   lastName: 'Doe'
 * });
 * ```
 */
async function createUser(userData: CreateUserDto): Promise<User> {
  // ...
}
```

## Code Review Checklist

- [ ] Code follows TypeScript/JavaScript style guide
- [ ] All functions have appropriate types
- [ ] Error handling is comprehensive
- [ ] Tests are included and passing
- [ ] No console.log or debugger statements
- [ ] Comments explain "why", not "what"
- [ ] Variable and function names are descriptive
- [ ] No code duplication (DRY principle)
- [ ] Security best practices followed
- [ ] Performance considerations addressed

---

**Last Updated:** 2025-12-17

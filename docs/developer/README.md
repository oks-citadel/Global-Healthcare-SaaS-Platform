# Developer Guide

Welcome to the UnifiedHealth Global Platform developer documentation. This guide will help you set up your development environment, understand the codebase, and contribute effectively to the project.

## Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 20.x LTS | JavaScript runtime |
| **pnpm** | 9.x | Package manager |
| **Docker** | 24.x | Containerization |
| **Docker Compose** | 2.x | Multi-container orchestration |
| **Git** | 2.x | Version control |
| **PostgreSQL** | 15.x | Primary database (optional, can use Docker) |
| **Redis** | 7.x | Cache (optional, can use Docker) |

### Installation

1. **Clone the Repository**

```bash
git clone https://github.com/unified-health/platform.git
cd platform
```

2. **Install Dependencies**

```bash
pnpm install
```

3. **Set Up Environment Variables**

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/unified_health"
MONGODB_URI="mongodb://localhost:27017/unified_health"
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# API Keys
STRIPE_SECRET_KEY="sk_test_..."
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
SENDGRID_API_KEY="SG..."
```

4. **Start Development Databases**

```bash
docker-compose up -d postgres redis mongodb elasticsearch
```

5. **Run Database Migrations**

```bash
pnpm db:migrate
pnpm db:seed
```

6. **Start Development Servers**

```bash
pnpm dev
```

This starts all services in development mode with hot reload.

### Access Points

Once running, access the services at:

| Service | URL | Description |
|---------|-----|-------------|
| Web App | http://localhost:3000 | Patient portal |
| Provider Portal | http://localhost:3001 | Healthcare provider interface |
| Admin Dashboard | http://localhost:3002 | Admin panel |
| API Gateway | http://localhost:8080 | REST API |
| API Documentation | http://localhost:8080/docs | Swagger UI |
| Database Admin | http://localhost:5555 | Prisma Studio |

**Default Test Credentials:**
```
Email: test@example.com
Password: TestPassword123!
```

## Project Structure

```
unified-health-platform/
├── apps/                              # Application packages
│   ├── web/                           # Next.js patient portal
│   │   ├── src/
│   │   │   ├── app/                   # Next.js 14 app directory
│   │   │   ├── components/            # React components
│   │   │   ├── lib/                   # Utilities
│   │   │   └── styles/                # Global styles
│   │   ├── public/                    # Static assets
│   │   └── package.json
│   ├── mobile/                        # React Native mobile app
│   │   ├── src/
│   │   │   ├── screens/               # Mobile screens
│   │   │   ├── components/            # Mobile components
│   │   │   ├── navigation/            # Navigation config
│   │   │   └── services/              # API services
│   │   └── package.json
│   └── admin/                         # Admin dashboard
│       └── src/
│
├── services/                          # Backend microservices
│   └── api/                           # Main API service
│       ├── src/
│       │   ├── controllers/           # Request handlers
│       │   ├── services/              # Business logic
│       │   ├── repositories/          # Data access layer
│       │   ├── middleware/            # Express middleware
│       │   ├── routes/                # API routes
│       │   ├── dtos/                  # Data transfer objects
│       │   ├── utils/                 # Utilities
│       │   └── index.ts               # Entry point
│       ├── prisma/                    # Database schema
│       │   ├── schema.prisma          # Prisma schema
│       │   ├── migrations/            # Migration files
│       │   └── seed.ts                # Seed data
│       ├── tests/                     # Tests
│       │   ├── unit/                  # Unit tests
│       │   ├── integration/           # Integration tests
│       │   └── e2e/                   # End-to-end tests
│       └── package.json
│
├── packages/                          # Shared packages
│   ├── ui/                            # Shared UI components
│   │   ├── src/
│   │   │   ├── components/            # Reusable components
│   │   │   ├── hooks/                 # Custom hooks
│   │   │   └── utils/                 # UI utilities
│   │   └── package.json
│   ├── shared/                        # Shared utilities
│   │   ├── src/
│   │   │   ├── types/                 # TypeScript types
│   │   │   ├── constants/             # Constants
│   │   │   └── utils/                 # Common utilities
│   │   └── package.json
│   ├── sdk/                           # JavaScript SDK
│   └── i18n/                          # Internationalization
│
├── infrastructure/                    # Infrastructure as Code
│   ├── terraform/                     # Terraform configs
│   ├── kubernetes/                    # K8s manifests
│   ├── helm/                          # Helm charts
│   └── monitoring/                    # Monitoring config
│
├── docs/                              # Documentation
│   ├── api/                           # API docs
│   ├── architecture/                  # Architecture docs
│   ├── developer/                     # Developer guides
│   ├── user/                          # User guides
│   └── compliance/                    # Compliance docs
│
├── scripts/                           # Utility scripts
│   ├── setup-dev.sh                   # Dev environment setup
│   ├── generate-types.sh              # Type generation
│   └── db-backup.sh                   # Database backup
│
├── .github/                           # GitHub configuration
│   ├── workflows/                     # CI/CD workflows
│   └── CODEOWNERS                     # Code ownership
│
├── docker-compose.yml                 # Docker services
├── Makefile                           # Common commands
├── package.json                       # Root package
├── pnpm-workspace.yaml               # PNPM workspace
├── turbo.json                         # Turborepo config
└── README.md                          # Project readme
```

## Development Workflow

### 1. Branch Strategy

We follow **Git Flow**:

```
main (production)
  └── develop (staging)
       ├── feature/user-profile
       ├── feature/appointment-booking
       ├── bugfix/login-issue
       └── hotfix/critical-security-patch
```

**Branch Naming:**
- `feature/feature-name` - New features
- `bugfix/bug-name` - Bug fixes
- `hotfix/critical-fix` - Production hotfixes
- `chore/task-name` - Maintenance tasks
- `docs/documentation-update` - Documentation updates

### 2. Development Process

1. **Create a Branch**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

2. **Make Changes**
```bash
# Make your code changes
# Write tests
# Update documentation
```

3. **Run Tests**
```bash
pnpm test              # Run all tests
pnpm test:unit         # Unit tests only
pnpm test:integration  # Integration tests
pnpm test:coverage     # Coverage report
```

4. **Lint and Format**
```bash
pnpm lint              # Check linting
pnpm lint:fix          # Auto-fix issues
pnpm format            # Format code
pnpm typecheck         # TypeScript check
```

5. **Commit Changes**
```bash
git add .
git commit -m "feat: add user profile page"
```

**Commit Message Format:**
```
type(scope): subject

body

footer
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Tests
- `chore` - Maintenance

**Examples:**
```
feat(auth): add multi-factor authentication
fix(appointments): resolve booking conflict issue
docs(api): update authentication guide
```

6. **Push and Create PR**
```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

### 3. Code Review Process

**Before Requesting Review:**
- All tests pass
- Code is formatted and linted
- Documentation is updated
- No console.log or debug code
- Branch is up to date with develop

**Review Checklist:**
- Code follows style guide
- Tests provide adequate coverage
- No security vulnerabilities
- Performance considerations addressed
- Error handling is comprehensive
- Documentation is clear

## Testing Guide

### Unit Tests

**Location:** `tests/unit/`

```typescript
// Example: tests/unit/services/user.service.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { UserService } from '@/services/user.service';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'John',
      lastName: 'Doe'
    };

    const user = await userService.create(userData);

    expect(user).toBeDefined();
    expect(user.email).toBe(userData.email);
  });

  it('should throw error for duplicate email', async () => {
    const userData = {
      email: 'existing@example.com',
      password: 'Password123!'
    };

    await expect(userService.create(userData))
      .rejects
      .toThrow('Email already exists');
  });
});
```

### Integration Tests

**Location:** `tests/integration/`

```typescript
// Example: tests/integration/api/auth.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '@/index';

describe('Authentication API', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'newuser@example.com',
        password: 'Password123!',
        firstName: 'Jane',
        lastName: 'Doe'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe('newuser@example.com');
  });

  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123!'
      });

    expect(response.status).toBe(200);
    expect(response.body.data.accessToken).toBeDefined();
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test tests/unit/services/user.service.test.ts

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage

# Run only integration tests
pnpm test:integration
```

## Database Management

### Prisma Workflow

**1. Update Schema**

Edit `prisma/schema.prisma`:
```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  firstName     String
  lastName      String
  passwordHash  String
  role          Role     @default(PATIENT)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([email])
}

enum Role {
  PATIENT
  PROVIDER
  ADMIN
}
```

**2. Create Migration**
```bash
pnpm db:migrate
```

This creates a migration file and applies it.

**3. Generate Prisma Client**
```bash
pnpm db:generate
```

**4. Seed Database**
```bash
pnpm db:seed
```

### Database Commands

```bash
# Open Prisma Studio (Database GUI)
pnpm db:studio

# Reset database (⚠️ Deletes all data)
pnpm db:reset

# Backup database
pnpm db:backup

# Restore from backup
pnpm db:restore backups/backup-file.sql
```

## Debugging

### VS Code Configuration

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug API",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["dev"],
      "cwd": "${workspaceFolder}/services/api",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### Debug Tips

1. **Enable Debug Logs**
```env
LOG_LEVEL=debug
```

2. **Use Debug Breakpoints**
```typescript
debugger; // Browser will pause here
```

3. **Console Logging**
```typescript
console.log('User data:', JSON.stringify(user, null, 2));
```

4. **Database Query Logging**
```env
DATABASE_LOGGING=true
```

## Common Commands

### Makefile Commands

```bash
make dev              # Start development
make build            # Build all packages
make test             # Run tests
make lint             # Lint code
make clean            # Clean build artifacts
make docker-up        # Start Docker services
make docker-down      # Stop Docker services
```

### PNPM Scripts

```bash
pnpm dev              # Start all services
pnpm build            # Build for production
pnpm test             # Run tests
pnpm lint             # Lint code
pnpm format           # Format code
pnpm typecheck        # TypeScript check
```

## Documentation

- [Local Setup Guide](./LOCAL_SETUP.md) - Detailed setup instructions
- [Code Style Guide](./CODE_STYLE.md) - Coding standards
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- [Testing Guide](./TESTING.md) - Testing best practices
- [Database Guide](./DATABASE.md) - Database management

## Getting Help

- **Documentation:** https://docs.unifiedhealthcare.com
- **API Reference:** https://api.unifiedhealthcare.com/docs
- **Community Forum:** https://community.unifiedhealthcare.com
- **Slack Channel:** #engineering
- **GitHub Issues:** https://github.com/unified-health/platform/issues

## Next Steps

1. ✅ Complete [Local Setup](./LOCAL_SETUP.md)
2. 📖 Read [Code Style Guide](./CODE_STYLE.md)
3. 🧪 Review [Testing Guide](./TESTING.md)
4. 🤝 Check [Contributing Guidelines](./CONTRIBUTING.md)
5. 🏗️ Explore [Architecture Documentation](../architecture/README.md)

---

**Last Updated:** 2025-12-17
**Version:** 1.0.0

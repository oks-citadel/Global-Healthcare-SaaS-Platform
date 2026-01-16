# Contributing Guide

## Global SaaS Marketing Platform

Thank you for your interest in contributing to the Global SaaS Marketing Platform.

## Development Setup

### Prerequisites

- Node.js 20 LTS
- pnpm v8+
- Docker & Docker Compose
- Git

### Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Global-SaaS-Marketing-Platform
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment:
   ```bash
   cp .env.example .env
   ```

4. Start development services:
   ```bash
   docker-compose up -d
   pnpm db:migrate
   pnpm dev
   ```

## Code Standards

### TypeScript

- Use TypeScript strict mode
- Prefer interfaces over type aliases for object shapes
- Use explicit return types on exported functions
- Avoid `any` type - use `unknown` when type is uncertain

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `user-service.ts` |
| Classes | PascalCase | `UserService` |
| Functions | camelCase | `getUserById` |
| Constants | SCREAMING_SNAKE | `MAX_RETRY_COUNT` |
| Interfaces | PascalCase (I-prefix optional) | `UserProfile` |
| Types | PascalCase | `ApiResponse<T>` |

### Directory Structure

```
services/<service-name>/
├── src/
│   ├── modules/          # Feature modules
│   │   └── <module>/
│   │       ├── dto/      # Data transfer objects
│   │       ├── entities/ # Database entities
│   │       ├── <module>.controller.ts
│   │       ├── <module>.service.ts
│   │       └── <module>.module.ts
│   ├── common/           # Shared utilities
│   ├── config/           # Configuration
│   ├── app.module.ts     # Root module
│   └── main.ts           # Entry point
├── prisma/               # Database schema
├── test/                 # E2E tests
└── package.json
```

## Git Workflow

### Branch Naming

- `feature/<ticket-id>-short-description` - New features
- `fix/<ticket-id>-short-description` - Bug fixes
- `chore/<description>` - Maintenance tasks
- `docs/<description>` - Documentation updates

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Maintenance

**Examples:**
```
feat(seo): add sitemap pagination support
fix(analytics): correct event timestamp calculation
docs(readme): update deployment instructions
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes following code standards
3. Write/update tests for your changes
4. Run linting and tests locally:
   ```bash
   pnpm lint
   pnpm test
   pnpm typecheck
   ```
5. Push your branch and create a PR
6. Fill out the PR template completely
7. Request review from team members
8. Address review feedback
9. Squash and merge when approved

### PR Template

```markdown
## Summary
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how to test the changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No security vulnerabilities introduced
```

## Testing Guidelines

### Unit Tests

- Test individual functions/methods
- Mock external dependencies
- Aim for >80% code coverage

```typescript
describe('UserService', () => {
  it('should create a user', async () => {
    const result = await userService.create(userData);
    expect(result).toMatchObject(expectedUser);
  });
});
```

### Integration Tests

- Test module interactions
- Use test database
- Clean up after tests

### E2E Tests

- Test complete user flows
- Use realistic test data
- Run against staging-like environment

## Security Guidelines

### Never commit:
- API keys or secrets
- Passwords or tokens
- Private keys
- AWS credentials

### Always:
- Use environment variables for secrets
- Validate and sanitize user input
- Use parameterized queries
- Follow OWASP guidelines
- Review dependencies for vulnerabilities

## Documentation

### Code Comments

- Write self-documenting code
- Add comments for complex logic
- Document public APIs with JSDoc

```typescript
/**
 * Generates a sitemap for the specified domain
 * @param domain - The domain to generate sitemap for
 * @param options - Generation options
 * @returns The generated sitemap XML
 */
async generateSitemap(domain: string, options?: SitemapOptions): Promise<string>
```

### README Updates

Update relevant documentation when:
- Adding new features
- Changing configuration
- Modifying APIs
- Updating dependencies

## Getting Help

- Check existing issues and PRs
- Review documentation
- Ask in team channels
- Create an issue for bugs

## License

By contributing, you agree that your contributions will be licensed under the project's license.

# API Documentation and SDK Setup Guide

This guide explains how to set up, use, and generate the API documentation and TypeScript SDK for the Unified Health Platform.

## Overview

The Unified Health Platform includes:

1. **Swagger/OpenAPI Documentation** - Interactive API documentation
2. **TypeScript SDK** - Type-safe client library for API access
3. **Comprehensive Endpoint Docs** - Detailed markdown documentation
4. **SDK Generation Scripts** - Automated SDK generation from OpenAPI spec

## Quick Start

### 1. Install Dependencies

```bash
# Install API dependencies (includes Swagger)
cd services/api
npm install

# Install SDK dependencies
cd ../../packages/sdk
npm install
```

### 2. Start the API Server

```bash
cd services/api
npm run dev
```

The API will start on http://localhost:8080

### 3. Access API Documentation

Open your browser and navigate to:
- **Swagger UI**: http://localhost:8080/api/docs
- **OpenAPI JSON**: http://localhost:8080/api/docs/openapi.json
- **OpenAPI YAML**: http://localhost:8080/api/docs/openapi.yaml

### 4. Build the SDK

```bash
cd packages/sdk
npm run build
```

### 5. Use the SDK in Your Applications

```bash
# For web app
cd apps/web
npm install  # This will install the SDK as a workspace dependency
npm run dev

# For mobile app
cd apps/mobile
npm install  # This will install the SDK as a workspace dependency
npm run dev
```

## File Structure

```
Global-Healthcare-SaaS-Platform/
├── services/api/
│   └── src/
│       ├── docs/
│       │   └── swagger.ts              # Swagger configuration
│       └── index.ts                    # Updated with Swagger routes
│
├── packages/sdk/
│   ├── src/
│   │   ├── client.ts                   # Main API client
│   │   ├── types.ts                    # TypeScript types
│   │   └── index.ts                    # Package exports
│   ├── package.json                    # SDK package config
│   ├── tsconfig.json                   # TypeScript config
│   └── README.md                       # SDK documentation
│
├── scripts/
│   └── generate-sdk.sh                 # SDK generation script
│
├── docs-unified/api/
│   ├── getting-started.md              # Quick start guide
│   ├── README.md                       # API docs overview
│   └── endpoints/
│       ├── auth.md                     # Auth endpoints
│       ├── patients.md                 # Patient endpoints
│       ├── appointments.md             # Appointment endpoints
│       ├── encounters.md               # Encounter endpoints
│       ├── documents.md                # Document endpoints
│       └── README.md                   # Endpoints overview
│
└── apps/
    ├── web/package.json                # Updated with SDK dependency
    └── mobile/package.json             # Updated with SDK dependency
```

## Using Swagger UI

### Accessing Swagger UI

1. Start the API server: `cd services/api && npm run dev`
2. Open http://localhost:8080/api/docs in your browser
3. You'll see interactive documentation for all endpoints

### Testing Endpoints

1. Click on any endpoint to expand it
2. Click "Try it out"
3. Fill in the parameters
4. Click "Execute"
5. View the response

### Authentication in Swagger

1. Click the "Authorize" button at the top
2. Enter your JWT token in the format: `Bearer <your-token>`
3. Click "Authorize"
4. All subsequent requests will include the token

## Using the TypeScript SDK

### Installation in Your App

The SDK is already added as a workspace dependency in both web and mobile apps:

```json
{
  "dependencies": {
    "@unified-health/sdk": "workspace:*"
  }
}
```

### Basic Usage

```typescript
import { createClient } from '@unified-health/sdk';

// Create client
const client = createClient({
  baseURL: 'http://localhost:8080/api/v1',
});

// Login
const auth = await client.login({
  email: 'user@example.com',
  password: 'password',
});

// The SDK automatically handles token storage and refresh
console.log('Logged in as:', auth.user.firstName);

// Use the API
const appointments = await client.listAppointments({
  page: 1,
  limit: 10,
});
```

### With Token Persistence

```typescript
import { createClient } from '@unified-health/sdk';

const client = createClient({
  baseURL: 'http://localhost:8080/api/v1',
  // Load existing tokens
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  // Save new tokens when refreshed
  onTokenRefresh: (tokens) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  },
});
```

### With React Query

```typescript
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@unified-health/sdk';

const client = createClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  accessToken: getAccessToken(),
});

function useAppointments() {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: () => client.listAppointments({ page: 1, limit: 20 }),
  });
}
```

## SDK Generation

### Manual Generation

To regenerate the SDK from the OpenAPI specification:

```bash
# Make the script executable
chmod +x scripts/generate-sdk.sh

# Run the generation script
./scripts/generate-sdk.sh
```

The script will:
1. Check if the API is running
2. Download the OpenAPI specification
3. Optionally generate code using openapi-generator
4. Build the SDK package

### Custom SDK (Recommended)

The current SDK is handcrafted with TypeScript for better type safety and developer experience. It includes:

- Full TypeScript support
- Automatic token refresh
- Error handling
- All API endpoints
- Comprehensive types

## API Documentation

### Markdown Documentation

Comprehensive endpoint documentation is available in `docs-unified/api/`:

- **Getting Started**: `docs-unified/api/getting-started.md`
- **Auth Endpoints**: `docs-unified/api/endpoints/auth.md`
- **Patient Endpoints**: `docs-unified/api/endpoints/patients.md`
- **Appointment Endpoints**: `docs-unified/api/endpoints/appointments.md`
- **Encounter Endpoints**: `docs-unified/api/endpoints/encounters.md`
- **Document Endpoints**: `docs-unified/api/endpoints/documents.md`

### OpenAPI Specification

The OpenAPI spec is automatically generated and served at:
- JSON: http://localhost:4000/api/docs/openapi.json
- YAML: http://localhost:4000/api/docs/openapi.yaml

You can use this spec with various tools:
- Import into Postman
- Generate client libraries
- Validate API contracts
- Generate documentation

## Development Workflow

### 1. Update API Endpoints

When you add or modify API endpoints:

```typescript
// services/api/src/routes/example.ts
router.post('/example', async (req, res) => {
  // Your endpoint logic
});
```

### 2. Update Swagger Documentation

The Swagger UI automatically includes your endpoints. You can add JSDoc comments for better documentation:

```typescript
/**
 * @swagger
 * /api/v1/example:
 *   post:
 *     summary: Example endpoint
 *     tags: [Example]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 */
router.post('/example', handler);
```

### 3. Update SDK Types

Update the types in `packages/sdk/src/types.ts`:

```typescript
export interface ExampleInput {
  name: string;
}

export interface ExampleResponse {
  id: string;
  name: string;
}
```

### 4. Update SDK Client

Add the method to `packages/sdk/src/client.ts`:

```typescript
public async example(input: ExampleInput): Promise<ExampleResponse> {
  return this.request<ExampleResponse>({
    method: 'POST',
    url: '/example',
    data: input,
  });
}
```

### 5. Update Documentation

Add documentation to `docs-unified/api/endpoints/`:

```markdown
## Example Endpoint

### Create Example

POST /api/v1/example

Request body:
...
```

### 6. Rebuild SDK

```bash
cd packages/sdk
npm run build
```

### 7. Test in Your App

```bash
cd apps/web
npm run dev
```

## Configuration

### Swagger Configuration

Edit `services/api/src/docs/swagger.ts` to customize:
- API information (title, version, description)
- Servers (development, staging, production)
- Tags and grouping
- Authentication schemes
- Common schemas

### SDK Configuration

Edit `packages/sdk/package.json` to customize:
- Package metadata
- Build configuration
- Dependencies

## Troubleshooting

### Swagger UI Not Loading

1. Ensure the API server is running
2. Check that swagger dependencies are installed
3. Verify the route is registered in `src/index.ts`
4. Check browser console for errors

### SDK Build Errors

1. Check TypeScript errors: `npm run typecheck`
2. Ensure all types are properly exported
3. Verify imports use `.js` extension for ESM compatibility

### Authentication Issues

1. Verify tokens are being stored correctly
2. Check token expiration
3. Ensure refresh token logic is working
4. Test with Swagger UI first

### CORS Issues

1. Check CORS configuration in `services/api/src/index.ts`
2. Verify the origin is allowed
3. Ensure credentials are included in requests

## Next Steps

1. **Explore the API**: Open http://localhost:8080/api/docs
2. **Read the Documentation**: Check `docs-unified/api/getting-started.md`
3. **Try the SDK**: Import in your app and test endpoints
4. **Build Features**: Use the SDK to build your application features

## Additional Resources

- [API Getting Started Guide](./docs-unified/api/getting-started.md)
- [SDK README](./packages/sdk/README.md)
- [Endpoint Documentation](./docs-unified/api/endpoints/README.md)
- [Swagger/OpenAPI Specification](https://swagger.io/specification/)

## Support

For questions or issues:
- Check the documentation first
- Review the code examples
- Open an issue on GitHub
- Contact the development team

---

Happy coding! 🚀

# Imaging Service - Quick Start Guide

Get the Imaging Service up and running in minutes.

## Prerequisites

- Node.js 20.x or higher
- PostgreSQL 14.x or higher
- Azure Storage account (optional for local development)

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set your database connection:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/imaging_db?schema=public"
```

For Azure Storage (optional in development):
```env
AZURE_STORAGE_CONNECTION_STRING="your_connection_string"
```

### 3. Set Up Database

Generate Prisma client:
```bash
npm run prisma:generate
```

Run migrations:
```bash
npm run prisma:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

The service will start on `http://localhost:3006`

## Verify Installation

Check the health endpoint:
```bash
curl http://localhost:3006/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "imaging-service",
  "timestamp": "2025-12-19T...",
  "uptime": 5.123
}
```

## Using Docker

### Quick Start with Docker Compose

```bash
docker-compose up -d
```

This will start:
- Imaging Service on port 3006
- PostgreSQL database on port 5436

### Stop Services

```bash
docker-compose down
```

### View Logs

```bash
docker-compose logs -f imaging-service
```

## Database Management

### View Database in Prisma Studio

```bash
npm run prisma:studio
```

This opens a GUI at `http://localhost:5555` to browse your data.

### Create New Migration

After modifying the schema:
```bash
npm run prisma:migrate
```

### Reset Database (Development Only)

```bash
npx prisma migrate reset
```

## API Testing

### Create an Imaging Order

```bash
curl -X POST http://localhost:3006/api/imaging-orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "patientId": "patient-123",
    "providerId": "provider-456",
    "facilityId": "facility-789",
    "modality": "CT",
    "bodyPart": "Chest",
    "clinicalIndication": "Rule out pneumonia",
    "requestedBy": "Dr. Smith"
  }'
```

### Get All Orders

```bash
curl http://localhost:3006/api/imaging-orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create a Study

```bash
curl -X POST http://localhost:3006/api/studies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "orderId": "YOUR_ORDER_ID",
    "studyDate": "2025-12-20",
    "studyDescription": "CT Chest",
    "modality": "CT",
    "bodyPart": "Chest",
    "patientId": "patient-123",
    "patientName": "John Doe"
  }'
```

## Common Tasks

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Run Production Build

```bash
npm start
```

### Lint Code

```bash
npm run lint
```

### Run Tests

```bash
npm test
```

## Project Structure

```
imaging-service/
├── src/
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── types/            # TypeScript types
│   ├── utils/            # Utilities
│   ├── app.ts            # Express app setup
│   └── index.ts          # Entry point
├── prisma/
│   └── schema.prisma     # Database schema
├── logs/                 # Application logs
├── .env                  # Environment variables
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── Dockerfile            # Docker image
└── docker-compose.yml    # Docker services
```

## Troubleshooting

### Database Connection Error

Ensure PostgreSQL is running:
```bash
# Check PostgreSQL status
pg_isready

# Start PostgreSQL (if using Homebrew on Mac)
brew services start postgresql

# Or using Docker
docker run -d \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=imaging_db \
  -p 5432:5432 \
  postgres:15
```

### Port Already in Use

Change the port in `.env`:
```env
PORT=3007
```

### Azure Storage Not Configured

For local development, Azure Storage is optional. The service will log a warning but continue to work. To properly configure:

1. Create an Azure Storage account
2. Get the connection string
3. Add to `.env`:
```env
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;..."
```

### Prisma Client Not Generated

Run:
```bash
npm run prisma:generate
```

## Next Steps

1. Review the full [README.md](README.md) for detailed documentation
2. Check [API_EXAMPLES.md](API_EXAMPLES.md) for comprehensive API examples
3. Explore the Prisma schema in `prisma/schema.prisma`
4. Set up authentication tokens for API access
5. Configure integration with other services (EHR, Notification)

## Support

For issues and questions:
- Check the logs in `logs/` directory
- Review the error messages
- Consult the API documentation

## Development Tips

1. Use Prisma Studio to inspect database: `npm run prisma:studio`
2. Enable debug logging: Set `LOG_LEVEL=debug` in `.env`
3. Use nodemon for auto-reload: Already configured with `npm run dev`
4. Test with tools like Postman, Insomnia, or curl
5. Check health endpoint regularly: `http://localhost:3006/health`

Happy coding!

# Quick Start Guide - Chronic Care Service

Get the Chronic Care Service up and running in minutes.

## Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ running
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies
```bash
cd services/chronic-care-service
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and set your database connection:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/chronic_care
PORT=3003
CORS_ORIGIN=*
```

### 3. Setup Database
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate
```

### 4. Start the Service

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm run build
npm start
```

The service will start on `http://localhost:3003`

## Verify Installation

### Check Health Endpoint
```bash
curl http://localhost:3003/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "chronic-care-service",
  "version": "2.0.0",
  "features": [
    "Care Plan Management",
    "RPM Device Integration",
    "Vital Sign Monitoring",
    "Alert & Threshold Management",
    "Goal Setting & Tracking",
    "Patient Engagement Analytics"
  ]
}
```

## Quick Test Workflow

### 1. Set Authentication Headers
All requests need these headers:
```bash
X-User-Id: 123e4567-e89b-12d3-a456-426614174000
X-User-Email: test@example.com
X-User-Role: provider
```

### 2. Create a Care Plan
```bash
curl -X POST http://localhost:3003/care-plans \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 123e4567-e89b-12d3-a456-426614174000" \
  -H "X-User-Email: provider@example.com" \
  -H "X-User-Role: provider" \
  -d '{
    "patientId": "456e4567-e89b-12d3-a456-426614174000",
    "condition": "Diabetes Type 2",
    "goals": {"a1c": "Lower A1C below 7.0%"},
    "interventions": {"medication": "Metformin 500mg"},
    "reviewSchedule": "monthly"
  }'
```

### 3. Register a Device
Switch to patient headers:
```bash
curl -X POST http://localhost:3003/devices \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 456e4567-e89b-12d3-a456-426614174000" \
  -H "X-User-Email: patient@example.com" \
  -H "X-User-Role: patient" \
  -d '{
    "deviceType": "glucose_meter",
    "manufacturer": "Accu-Chek",
    "model": "Guide",
    "serialNumber": "TEST-001"
  }'
```

### 4. Submit Vital Signs
```bash
curl -X POST http://localhost:3003/vitals \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 456e4567-e89b-12d3-a456-426614174000" \
  -H "X-User-Email: patient@example.com" \
  -H "X-User-Role: patient" \
  -d '{
    "vitalType": "blood_glucose",
    "value": 125,
    "unit": "mg/dL",
    "notes": "Fasting morning reading"
  }'
```

### 5. Create an Alert Threshold
Switch back to provider:
```bash
curl -X POST http://localhost:3003/alerts/thresholds \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 123e4567-e89b-12d3-a456-426614174000" \
  -H "X-User-Email: provider@example.com" \
  -H "X-User-Role: provider" \
  -d '{
    "patientId": "456e4567-e89b-12d3-a456-426614174000",
    "vitalType": "blood_glucose",
    "criticalMin": 70,
    "criticalMax": 250,
    "warningMin": 80,
    "warningMax": 180
  }'
```

### 6. Create a Goal
```bash
curl -X POST http://localhost:3003/goals \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 456e4567-e89b-12d3-a456-426614174000" \
  -H "X-User-Email: patient@example.com" \
  -H "X-User-Role: patient" \
  -d '{
    "patientId": "456e4567-e89b-12d3-a456-426614174000",
    "title": "Maintain healthy glucose levels",
    "goalType": "vital_sign",
    "targetValue": 120,
    "targetUnit": "mg/dL"
  }'
```

## Common Commands

### Development
```bash
npm run dev          # Start in watch mode
npm run build        # Compile TypeScript
npm run typecheck    # Type checking
npm run lint         # Run ESLint
```

### Database
```bash
npm run db:generate       # Generate Prisma client
npm run db:migrate        # Run migrations (dev)
npm run db:migrate:prod   # Run migrations (production)
```

## Project Structure
```
chronic-care-service/
├── src/
│   ├── index.ts              # Application entry point
│   ├── middleware/
│   │   └── extractUser.ts    # Authentication middleware
│   ├── routes/
│   │   ├── alerts.ts         # Alert endpoints
│   │   ├── carePlans.ts      # Care plan endpoints
│   │   ├── devices.ts        # Device endpoints
│   │   ├── goals.ts          # Goal endpoints
│   │   └── vitals.ts         # Vital sign endpoints
│   └── services/
│       ├── AlertService.ts
│       ├── CarePlanTemplateService.ts
│       ├── DeviceService.ts
│       ├── EngagementService.ts
│       ├── GoalService.ts
│       └── VitalSignService.ts
├── prisma/
│   └── schema.prisma         # Database schema
├── .env.example              # Environment template
├── package.json
├── tsconfig.json
├── README.md                 # Full documentation
├── API_EXAMPLES.md           # API usage examples
├── IMPLEMENTATION_SUMMARY.md # Implementation details
└── QUICK_START.md            # This file
```

## Troubleshooting

### Port Already in Use
Change the PORT in `.env`:
```env
PORT=3004
```

### Database Connection Error
Verify PostgreSQL is running:
```bash
psql -U username -d chronic_care
```

Check DATABASE_URL format:
```
postgresql://username:password@host:port/database
```

### Prisma Client Not Generated
Run generation command:
```bash
npm run db:generate
```

### TypeScript Errors
Ensure all dependencies are installed:
```bash
npm install
```

Check TypeScript version:
```bash
npx tsc --version
```

## Next Steps

1. **Read the Documentation**
   - `README.md` - Full service documentation
   - `API_EXAMPLES.md` - Detailed API examples
   - `IMPLEMENTATION_SUMMARY.md` - Technical details

2. **Seed Sample Data**
   - Create care plan templates
   - Set up test patients
   - Configure default thresholds

3. **Integrate with Frontend**
   - Update CORS_ORIGIN in `.env`
   - Implement authentication flow
   - Build patient and provider dashboards

4. **Set Up Monitoring**
   - Configure logging
   - Set up error tracking
   - Implement health checks

5. **Deploy**
   - Set up production database
   - Configure environment variables
   - Deploy to cloud platform

## Support

For issues or questions:
1. Check the documentation files
2. Review the Prisma schema
3. Test with the provided examples
4. Check service logs for errors

## Development Tips

### Hot Reload
The dev server uses `tsx watch` for instant reload on file changes.

### Database Inspection
Use Prisma Studio to inspect data:
```bash
npx prisma studio
```

### Testing APIs
Use tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

### Code Quality
Run before committing:
```bash
npm run typecheck
npm run lint
```

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | HTTP server port | 3003 |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `CORS_ORIGIN` | Allowed CORS origins | * |
| `NODE_ENV` | Environment (development/production) | development |
| `LOG_LEVEL` | Logging level | info |

## API Endpoint Summary

### By Category
- **Care Plans**: 6 endpoints
- **Devices**: 7 endpoints
- **Vitals**: 6 endpoints
- **Alerts**: 10 endpoints
- **Goals**: 9 endpoints

### By HTTP Method
- **GET**: 24 endpoints
- **POST**: 16 endpoints
- **PATCH**: 11 endpoints
- **DELETE**: 3 endpoints

**Total: 54 endpoints**

## Database Tables

- CarePlan
- CarePlanTemplate
- CareTask
- MonitoringDevice
- VitalReading
- Alert
- AlertThreshold
- Goal
- GoalProgress
- PatientEngagement

## Success Indicators

Service is working correctly when:
- ✅ Health check returns 200 status
- ✅ Database migrations complete without errors
- ✅ Prisma client generates successfully
- ✅ Server starts and listens on configured port
- ✅ API endpoints respond to requests
- ✅ Authentication middleware validates headers
- ✅ Threshold alerts are created automatically

## Getting Help

Review these files in order:
1. `QUICK_START.md` (this file) - Getting started
2. `README.md` - Service overview and features
3. `API_EXAMPLES.md` - API usage examples
4. `IMPLEMENTATION_SUMMARY.md` - Technical implementation details

Happy coding!

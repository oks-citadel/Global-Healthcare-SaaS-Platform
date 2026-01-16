# Quick Start Guide - Mental Health Service

Get the Mental Health Service up and running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ running
- npm or yarn

## Step 1: Install Dependencies

```bash
cd services/mental-health-service
npm install
```

## Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/mental_health_db
PORT=3002
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## Step 3: Setup Database

### Create Database
```bash
createdb mental_health_db
```

### Run Migrations
```bash
npm run db:migrate
```

### Generate Prisma Client
```bash
npm run db:generate
```

## Step 4: Start the Service

```bash
npm run dev
```

The service will start on `http://localhost:3002`

## Step 5: Verify it's Working

### Check Health
```bash
curl http://localhost:3002/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "mental-health-service",
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

### Get Assessment Questions (No Auth Required)
```bash
curl http://localhost:3002/assessments/instruments/PHQ9/questions
```

## Quick Test Endpoints

### 1. Create a Therapy Session

```bash
curl -X POST http://localhost:3002/sessions \
  -H "Content-Type: application/json" \
  -H "x-user-id: 550e8400-e29b-41d4-a716-446655440000" \
  -H "x-user-email: patient@example.com" \
  -H "x-user-role: patient" \
  -d '{
    "therapistId": "660e8400-e29b-41d4-a716-446655440000",
    "sessionType": "individual",
    "scheduledAt": "2024-02-01T14:00:00Z",
    "duration": 60,
    "modality": "CBT"
  }'
```

### 2. Submit PHQ-9 Assessment

```bash
curl -X POST http://localhost:3002/assessments \
  -H "Content-Type: application/json" \
  -H "x-user-id: 660e8400-e29b-41d4-a716-446655440000" \
  -H "x-user-email: provider@example.com" \
  -H "x-user-role: provider" \
  -d '{
    "patientId": "550e8400-e29b-41d4-a716-446655440000",
    "assessmentType": "PHQ9",
    "results": {
      "responses": {
        "phq9_1": 2,
        "phq9_2": 2,
        "phq9_3": 1,
        "phq9_4": 2,
        "phq9_5": 1,
        "phq9_6": 1,
        "phq9_7": 1,
        "phq9_8": 0,
        "phq9_9": 0
      }
    }
  }'
```

### 3. Create Treatment Plan

```bash
curl -X POST http://localhost:3002/treatment-plans \
  -H "Content-Type: application/json" \
  -H "x-user-id: 660e8400-e29b-41d4-a716-446655440000" \
  -H "x-user-email: provider@example.com" \
  -H "x-user-role: provider" \
  -d '{
    "patientId": "550e8400-e29b-41d4-a716-446655440000",
    "diagnosis": ["Major Depressive Disorder"],
    "interventions": {"therapy": "CBT", "frequency": "Weekly"},
    "frequency": "weekly",
    "startDate": "2024-01-01T00:00:00Z",
    "reviewDate": "2024-04-01T00:00:00Z",
    "goals": [
      {
        "description": "Reduce depressive symptoms",
        "strategies": ["Cognitive restructuring", "Behavioral activation"],
        "targetDate": "2024-03-01T00:00:00Z"
      }
    ]
  }'
```

### 4. Grant Consent

```bash
curl -X POST http://localhost:3002/consent/grant \
  -H "Content-Type: application/json" \
  -H "x-user-id: 550e8400-e29b-41d4-a716-446655440000" \
  -H "x-user-email: patient@example.com" \
  -H "x-user-role: patient" \
  -d '{
    "providerId": "660e8400-e29b-41d4-a716-446655440000",
    "consentType": "treatment",
    "purpose": "Mental health treatment",
    "expiresAt": "2024-12-31T23:59:59Z"
  }'
```

### 5. Trigger Crisis Alert

```bash
curl -X POST http://localhost:3002/crisis-alerts \
  -H "Content-Type: application/json" \
  -H "x-user-id: 550e8400-e29b-41d4-a716-446655440000" \
  -H "x-user-email: patient@example.com" \
  -H "x-user-role: patient" \
  -d '{
    "patientId": "550e8400-e29b-41d4-a716-446655440000",
    "crisisType": "panic_attack",
    "severity": "medium",
    "description": "Experiencing severe anxiety and panic"
  }'
```

## Common User UUIDs for Testing

Use these consistent UUIDs in your tests:

**Patients:**
- `550e8400-e29b-41d4-a716-446655440000` - Test Patient 1
- `550e8400-e29b-41d4-a716-446655440001` - Test Patient 2

**Providers:**
- `660e8400-e29b-41d4-a716-446655440000` - Test Provider 1
- `660e8400-e29b-41d4-a716-446655440001` - Test Provider 2

**Admin:**
- `770e8400-e29b-41d4-a716-446655440000` - Test Admin

## Development Workflow

### 1. Make Code Changes
Edit files in `src/`

### 2. Service Auto-Restarts
The dev server watches for changes and restarts automatically

### 3. Test Changes
Use curl or Postman to test endpoints

### 4. Database Changes
If you modify `prisma/schema.prisma`:

```bash
# Create migration
npx prisma migrate dev --name your_change_description

# Generate new Prisma client
npm run db:generate
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3002
lsof -ti:3002 | xargs kill -9
# Or change PORT in .env
```

### Database Connection Error
```bash
# Verify PostgreSQL is running
pg_isready

# Check connection string
echo $DATABASE_URL
```

### Prisma Client Not Generated
```bash
npm run db:generate
```

### Migration Errors
```bash
# Reset database (WARNING: loses all data)
npx prisma migrate reset

# Or manually fix:
npx prisma migrate resolve --rolled-back "migration_name"
```

## Next Steps

1. **Read the Documentation**
   - `README.md` - Full feature overview
   - `API_ENDPOINTS.md` - Complete API reference
   - `ARCHITECTURE.md` - System architecture

2. **Explore the Code**
   - `src/routes/` - API endpoint handlers
   - `src/services/` - Business logic
   - `src/types/` - TypeScript definitions

3. **Test All Features**
   - Try each endpoint
   - Test different user roles
   - Verify consent controls work

4. **Review Compliance**
   - Understand 42 CFR Part 2 requirements
   - Test consent workflows
   - Review audit requirements

## Development Tools

### Prisma Studio (Database GUI)
```bash
npx prisma studio
```
Opens at `http://localhost:5555`

### View Database Schema
```bash
npx prisma db pull
```

### Format Prisma Schema
```bash
npx prisma format
```

### TypeScript Type Check
```bash
npm run typecheck
```

### Lint Code
```bash
npm run lint
```

## API Testing with Postman

Import this collection structure:

1. Create folders for each resource:
   - Sessions
   - Assessments
   - Treatment Plans
   - Medications
   - Crisis
   - Group Sessions
   - Progress Notes
   - Consent

2. Set environment variables:
   - `baseUrl`: http://localhost:3002
   - `patientId`: 550e8400-e29b-41d4-a716-446655440000
   - `providerId`: 660e8400-e29b-41d4-a716-446655440000

3. Add headers to all requests:
   - `x-user-id`: {{userId}}
   - `x-user-email`: user@example.com
   - `x-user-role`: patient|provider|admin

## Getting Help

- Check `README.md` for feature documentation
- See `API_ENDPOINTS.md` for endpoint details
- Review `DEPLOYMENT.md` for production setup
- Read `ARCHITECTURE.md` for system design

## Emergency Resources

Built into the service:
```bash
curl http://localhost:3002/crisis/hotlines/info
```

Returns:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- SAMHSA Helpline: 1-800-662-4357
- Emergency: 911

---

You're all set! The Mental Health Service is now running and ready for development.

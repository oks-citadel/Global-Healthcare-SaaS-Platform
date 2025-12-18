# UnifiedHealth Microservices - Quick Start Guide

## Quick Start with Docker (Recommended)

The fastest way to get all microservices running:

### 1. Prerequisites
- Docker Desktop installed and running
- 8GB RAM minimum
- Ports 3000-3005, 5432, 6379 available

### 2. Start All Services
```bash
cd services
docker-compose -f docker-compose.microservices.yml up --build
```

This will start:
- API Gateway (http://localhost:3000)
- Telehealth Service (http://localhost:3001)
- Mental Health Service (http://localhost:3002)
- Chronic Care Service (http://localhost:3003)
- Pharmacy Service (http://localhost:3004)
- Laboratory Service (http://localhost:3005)
- PostgreSQL (localhost:5432)
- Redis (localhost:6379)

### 3. Verify Services Are Running
Open a new terminal and check health endpoints:

```bash
# API Gateway
curl http://localhost:3000/health

# Telehealth Service
curl http://localhost:3001/health

# Mental Health Service
curl http://localhost:3002/health

# Chronic Care Service
curl http://localhost:3003/health

# Pharmacy Service
curl http://localhost:3004/health

# Laboratory Service
curl http://localhost:3005/health
```

All should return `{"status":"healthy","service":"...","timestamp":"..."}`

### 4. View Service Registry
```bash
curl http://localhost:3000/services
```

---

## Development Setup (Without Docker)

### 1. Prerequisites
- Node.js 20+ installed
- PostgreSQL 15+ installed and running
- Redis 7+ installed and running

### 2. Create Databases
```sql
CREATE DATABASE telehealth_db;
CREATE DATABASE mental_health_db;
CREATE DATABASE chronic_care_db;
CREATE DATABASE pharmacy_db;
CREATE DATABASE laboratory_db;
```

### 3. Install Dependencies for All Services
```bash
# Run from services directory
for service in api-gateway telehealth-service mental-health-service chronic-care-service pharmacy-service laboratory-service; do
  echo "Installing dependencies for $service..."
  cd $service && npm install && cd ..
done
```

### 4. Generate Prisma Clients
```bash
cd telehealth-service && npx prisma generate && cd ..
cd mental-health-service && npx prisma generate && cd ..
cd chronic-care-service && npx prisma generate && cd ..
cd pharmacy-service && npx prisma generate && cd ..
cd laboratory-service && npx prisma generate && cd ..
```

### 5. Run Database Migrations
```bash
cd telehealth-service && npx prisma migrate dev && cd ..
cd mental-health-service && npx prisma migrate dev && cd ..
cd chronic-care-service && npx prisma migrate dev && cd ..
cd pharmacy-service && npx prisma migrate dev && cd ..
cd laboratory-service && npx prisma migrate dev && cd ..
```

### 6. Create .env Files

Create `.env` in each service directory:

**api-gateway/.env:**
```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
REDIS_HOST=localhost
REDIS_PORT=6379
TELEHEALTH_SERVICE_URL=http://localhost:3001
MENTAL_HEALTH_SERVICE_URL=http://localhost:3002
CHRONIC_CARE_SERVICE_URL=http://localhost:3003
PHARMACY_SERVICE_URL=http://localhost:3004
LABORATORY_SERVICE_URL=http://localhost:3005
CORS_ORIGIN=*
```

**telehealth-service/.env:**
```env
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/telehealth_db?schema=public
CORS_ORIGIN=*
```

**mental-health-service/.env:**
```env
PORT=3002
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mental_health_db?schema=public
CORS_ORIGIN=*
```

**chronic-care-service/.env:**
```env
PORT=3003
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/chronic_care_db?schema=public
CORS_ORIGIN=*
```

**pharmacy-service/.env:**
```env
PORT=3004
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pharmacy_db?schema=public
CORS_ORIGIN=*
```

**laboratory-service/.env:**
```env
PORT=3005
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/laboratory_db?schema=public
CORS_ORIGIN=*
```

### 7. Start Services (Each in Separate Terminal)

**Terminal 1 - API Gateway:**
```bash
cd api-gateway
npm run dev
```

**Terminal 2 - Telehealth:**
```bash
cd telehealth-service
npm run dev
```

**Terminal 3 - Mental Health:**
```bash
cd mental-health-service
npm run dev
```

**Terminal 4 - Chronic Care:**
```bash
cd chronic-care-service
npm run dev
```

**Terminal 5 - Pharmacy:**
```bash
cd pharmacy-service
npm run dev
```

**Terminal 6 - Laboratory:**
```bash
cd laboratory-service
npm run dev
```

---

## Testing the API

### 1. Get JWT Token (from main API service)
First, you need to authenticate with the main API to get a JWT token:

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@test.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "patient"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@test.com",
    "password": "password123"
  }'
```

Copy the `accessToken` from the response.

### 2. Test Telehealth Service
```bash
# List appointments
curl http://localhost:3000/api/telehealth/appointments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create appointment
curl -X POST http://localhost:3000/api/telehealth/appointments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "providerId": "provider-uuid-here",
    "scheduledAt": "2024-12-20T10:00:00Z",
    "duration": 30,
    "type": "video",
    "reasonForVisit": "Annual checkup"
  }'
```

### 3. Test Mental Health Service
```bash
# List therapy sessions
curl http://localhost:3000/api/mental-health/sessions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get crisis hotline info (no auth required)
curl http://localhost:3000/api/mental-health/crisis/hotlines/info
```

### 4. Test Chronic Care Service
```bash
# List care plans
curl http://localhost:3000/api/chronic-care/care-plans \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Register monitoring device
curl -X POST http://localhost:3000/api/chronic-care/devices \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceType": "blood_pressure_monitor",
    "manufacturer": "Omron",
    "model": "BP7100",
    "serialNumber": "SN123456789"
  }'
```

### 5. Test Pharmacy Service
```bash
# List pharmacies (no auth required)
curl http://localhost:3000/api/pharmacy/pharmacies

# List prescriptions
curl http://localhost:3000/api/pharmacy/prescriptions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Test Laboratory Service
```bash
# List lab orders
curl http://localhost:3000/api/laboratory/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Common Commands

### Docker Commands
```bash
# Start all services
docker-compose -f docker-compose.microservices.yml up -d

# View logs
docker-compose -f docker-compose.microservices.yml logs -f

# View specific service logs
docker-compose -f docker-compose.microservices.yml logs -f telehealth-service

# Stop all services
docker-compose -f docker-compose.microservices.yml down

# Stop and remove volumes
docker-compose -f docker-compose.microservices.yml down -v

# Rebuild specific service
docker-compose -f docker-compose.microservices.yml up --build telehealth-service

# Scale a service
docker-compose -f docker-compose.microservices.yml up --scale telehealth-service=3
```

### Database Commands
```bash
# Access PostgreSQL
docker exec -it services_postgres_1 psql -U postgres

# List databases
\l

# Connect to database
\c telehealth_db

# List tables
\dt
```

### Development Commands
```bash
# Build all services
for service in api-gateway telehealth-service mental-health-service chronic-care-service pharmacy-service laboratory-service; do
  cd $service && npm run build && cd ..
done

# Run tests
for service in api-gateway telehealth-service mental-health-service chronic-care-service pharmacy-service laboratory-service; do
  cd $service && npm test && cd ..
done

# Type check
for service in api-gateway telehealth-service mental-health-service chronic-care-service pharmacy-service laboratory-service; do
  cd $service && npm run typecheck && cd ..
done
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Database Connection Issues
1. Verify PostgreSQL is running:
   ```bash
   docker ps | grep postgres
   ```

2. Check DATABASE_URL format:
   ```
   postgresql://username:password@host:port/database?schema=public
   ```

3. Reset database:
   ```bash
   cd telehealth-service
   npx prisma migrate reset
   ```

### Redis Connection Issues
1. Verify Redis is running:
   ```bash
   docker ps | grep redis
   ```

2. Test Redis connection:
   ```bash
   docker exec -it services_redis_1 redis-cli ping
   ```

### Service Won't Start
1. Check logs:
   ```bash
   docker-compose logs <service-name>
   ```

2. Verify environment variables are set

3. Ensure dependencies are installed:
   ```bash
   npm install
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

---

## Next Steps

1. Read the full [MICROSERVICES_README.md](./MICROSERVICES_README.md) for detailed architecture
2. Review individual service Prisma schemas for data models
3. Implement frontend clients for each service
4. Add monitoring and logging (Prometheus, Grafana, ELK)
5. Implement CI/CD pipelines
6. Add API documentation with Swagger
7. Implement event-driven communication between services

---

## Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Verify all services are healthy: Check `/health` endpoints
3. Review environment variables
4. Check database connections

---

## Service Ports Summary

| Service | Port | Health Check |
|---------|------|--------------|
| API Gateway | 3000 | http://localhost:3000/health |
| Telehealth | 3001 | http://localhost:3001/health |
| Mental Health | 3002 | http://localhost:3002/health |
| Chronic Care | 3003 | http://localhost:3003/health |
| Pharmacy | 3004 | http://localhost:3004/health |
| Laboratory | 3005 | http://localhost:3005/health |
| PostgreSQL | 5432 | - |
| Redis | 6379 | - |

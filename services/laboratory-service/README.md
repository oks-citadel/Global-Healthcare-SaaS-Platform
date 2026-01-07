# Laboratory Service

A comprehensive Laboratory Information System (LIS) for managing laboratory orders, test results, sample tracking, and reporting as part of the Unified Health SaaS Platform.

## Features

### Core Capabilities
- **Lab Test Ordering System**: Create and manage lab orders with multiple tests
- **Test Catalog Management**: Comprehensive test catalog with pricing, requirements, and reference ranges
- **Sample Tracking**: Complete specimen lifecycle from collection to disposal
- **Results Management**: Entry, validation, and verification of test results
- **Reference Ranges**: Age and gender-specific normal ranges with abnormal flagging
- **Critical Value Alerts**: Automatic detection and notification of critical values
- **HL7/FHIR Integration**: Standards-compliant messaging for interoperability
- **PDF Report Generation**: Professional laboratory reports

### Technical Features
- TypeScript with full type safety
- Express.js REST API
- Prisma ORM with PostgreSQL
- Zod validation
- Winston logging
- FHIR R4 resources
- HL7 v2.5 messages

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up database:
```bash
npm run db:generate
npm run db:migrate
```

4. Start development server:
```bash
npm run dev
```

The service will be available at `http://localhost:3005`

## Environment Variables

```env
# Server Configuration
PORT=3005
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/laboratory

# CORS
CORS_ORIGIN=*

# External Services
NOTIFICATION_SERVICE_URL=http://localhost:3002

# Logging
LOG_LEVEL=info
```

## API Documentation

### Health Check
```bash
curl http://localhost:3005/health
```

### API Endpoints Overview
```bash
curl http://localhost:3005/api-docs
```

### Key Endpoints

#### Lab Orders
- `POST /lab-orders` - Create new order
- `GET /lab-orders` - List orders
- `GET /lab-orders/:id` - Get order details
- `PATCH /lab-orders/:id/status` - Update status
- `GET /lab-orders/:id/results` - Get results

#### Lab Results
- `POST /lab-results` - Create result
- `POST /lab-results/bulk` - Bulk create results
- `GET /lab-results/patient/:id` - Get patient results
- `GET /lab-results/abnormal` - Get abnormal results
- `PATCH /lab-results/:id/verify` - Verify result

#### Test Catalog
- `GET /test-catalog` - List tests
- `GET /test-catalog/search` - Search tests
- `POST /test-catalog` - Add test (admin only)

#### Samples
- `POST /samples` - Create sample
- `GET /samples` - Track samples
- `PATCH /samples/:id/receive` - Receive sample
- `PATCH /samples/:id/reject` - Reject sample

See [API_REFERENCE.md](./API_REFERENCE.md) for complete documentation.

## Project Structure

```
laboratory-service/
├── src/
│   ├── index.ts              # Legacy entry point
│   ├── server.ts             # Main entry point
│   ├── middleware/
│   │   └── extractUser.ts    # Authentication middleware
│   ├── routes/
│   │   ├── lab-orders.ts     # Lab order routes
│   │   ├── lab-results.ts    # Results routes
│   │   ├── test-catalog.ts   # Catalog routes
│   │   ├── samples.ts        # Sample routes
│   │   ├── orders.ts         # Legacy routes
│   │   └── results.ts        # Legacy routes
│   ├── services/
│   │   ├── OrderService.ts           # Order management
│   │   ├── ResultsService.ts         # Results management
│   │   ├── SampleTrackingService.ts  # Sample tracking
│   │   ├── AlertService.ts           # Critical alerts
│   │   ├── ReportService.ts          # PDF generation
│   │   └── TestCatalogService.ts     # Catalog management
│   ├── utils/
│   │   ├── fhir.ts          # FHIR conversion
│   │   ├── hl7.ts           # HL7 messaging
│   │   ├── logger.ts        # Winston logger
│   │   └── validators.ts    # Zod schemas
│   └── types/
│       └── index.ts         # TypeScript types
├── prisma/
│   └── schema.prisma        # Database schema
├── IMPLEMENTATION.md        # Implementation guide
├── SCHEMA_UPDATE.md         # Schema migration guide
└── API_REFERENCE.md         # API documentation
```

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run typecheck
```

### Database Migrations
```bash
# Create a new migration
npm run db:migrate

# Apply migrations in production
npm run db:migrate:prod

# Regenerate Prisma client
npm run db:generate
```

## Deployment

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

### Docker (if applicable)
```bash
docker build -t laboratory-service .
docker run -p 3005:3005 laboratory-service
```

## Database Schema

The service uses a comprehensive schema for laboratory operations:

- **LabOrder**: Laboratory orders
- **LabTest**: Individual tests within orders
- **LabResult**: Test results with components
- **Sample**: Specimen tracking
- **TestCatalog**: Test definitions
- **ReferenceRange**: Normal value ranges
- **CriticalValueAlert**: Critical value notifications

See [SCHEMA_UPDATE.md](./SCHEMA_UPDATE.md) for the complete schema.

## Integration

### FHIR Resources
The service generates FHIR R4 resources:
- DiagnosticReport for lab orders
- Observation for individual results
- Bundle for collections

Example:
```bash
GET /lab-orders/:id/fhir
```

### HL7 Messages
Supports HL7 v2.5 ORU^R01 messages:
```bash
GET /lab-orders/:id/hl7
```

### Notification Service
Integrates with notification service for:
- Critical value alerts
- Result ready notifications
- Order status updates

## Security

### Authentication
Uses header-based authentication:
- `x-user-id`: User UUID
- `x-user-role`: User role
- `x-user-email`: User email

### Authorization
Role-based access control:
- **Admin**: Full access
- **Provider**: Order creation, result viewing
- **Lab Tech**: Sample and result management
- **Patient**: View own data only

### Data Protection
- Input validation with Zod
- SQL injection prevention via Prisma
- XSS protection via Helmet
- CORS configuration

## Monitoring

### Logs
Winston logger with:
- Console output (development)
- File logging (production)
- Structured JSON format
- Multiple log levels

Log files:
- `logs/laboratory-combined.log`
- `logs/laboratory-error.log`

### Health Checks
```bash
GET /health
```

Returns service status and uptime.

## Troubleshooting

### Database Connection Issues
```bash
# Test database connection
npx prisma db push

# Check migrations
npx prisma migrate status
```

### Port Already in Use
```bash
# Change port in .env
PORT=3006
```

### Prisma Client Issues
```bash
# Regenerate Prisma client
npm run db:generate
```

## Contributing

1. Create a feature branch
2. Make changes with tests
3. Run linting and tests
4. Submit pull request

## License

Proprietary - Unified Health Platform

## Support

For issues or questions:
- Email: support@theunifiedhealth.com
- Slack: #laboratory-service
- Documentation: /docs/laboratory-service

## Changelog

### v1.0.0 (Initial Release)
- Complete LIS implementation
- Lab order management
- Results entry and validation
- Sample tracking
- Test catalog
- FHIR/HL7 integration
- PDF report generation
- Critical value alerts

## Roadmap

### v1.1.0
- Real-time notifications via WebSockets
- Advanced reporting and analytics
- Batch processing
- Quality control tracking

### v1.2.0
- Instrument integration
- Barcode scanning
- Mobile app support
- Enhanced FHIR capabilities

### v2.0.0
- Multi-laboratory support
- Advanced workflow automation
- Machine learning for result validation
- Predictive analytics

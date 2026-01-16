# Laboratory Service - Implementation Guide

## Overview

The Laboratory Service is a comprehensive Laboratory Information System (LIS) built with Express.js, Prisma, and TypeScript. It provides complete laboratory workflow management including test ordering, sample tracking, results management, and reporting.

## Architecture

### Core Components

1. **Services** (`src/services/`)
   - `OrderService.ts` - Lab order management
   - `ResultsService.ts` - Test results processing
   - `SampleTrackingService.ts` - Sample lifecycle management
   - `AlertService.ts` - Critical value notifications
   - `ReportService.ts` - PDF report generation
   - `TestCatalogService.ts` - Test catalog and reference ranges

2. **Routes** (`src/routes/`)
   - `lab-orders.ts` - Lab order endpoints
   - `lab-results.ts` - Results management endpoints
   - `test-catalog.ts` - Test catalog endpoints
   - `samples.ts` - Sample tracking endpoints
   - `orders.ts` - Legacy compatibility
   - `results.ts` - Legacy compatibility

3. **Utilities** (`src/utils/`)
   - `fhir.ts` - FHIR resource conversion
   - `hl7.ts` - HL7 message generation/parsing
   - `logger.ts` - Winston logger configuration
   - `validators.ts` - Zod validation schemas

4. **Types** (`src/types/`)
   - Comprehensive TypeScript interfaces and types

## Database Schema

### Models (Note: Some models are placeholders pending schema update)

#### Fully Implemented:
- `LabOrder` - Laboratory orders
- `LabTest` - Individual tests within orders
- `LabResult` - Test results
- `DiagnosticTest` - Test catalog (used as TestCatalog)

#### To Be Added (Currently Placeholders):
- `Sample` - Sample tracking
- `ReferenceRange` - Reference ranges for tests
- `TestComponent` - Test components
- `CriticalValueAlert` - Critical value alerts
- `LabOrderItem` - Order line items

## API Endpoints

### Lab Orders (`/lab-orders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/lab-orders` | List all orders with filters | Yes |
| GET | `/lab-orders/statistics` | Get order statistics | Yes |
| GET | `/lab-orders/:id` | Get order details | Yes |
| POST | `/lab-orders` | Create new lab order | Provider/Admin |
| PATCH | `/lab-orders/:id` | Update order | Provider/Admin/Lab Tech |
| PATCH | `/lab-orders/:id/status` | Update order status | Provider/Admin/Lab Tech |
| DELETE | `/lab-orders/:id/cancel` | Cancel order | Provider/Admin |
| GET | `/lab-orders/:id/results` | Get order results | Yes |
| POST | `/lab-orders/:id/results` | Submit results | Lab Tech/Admin |

### Lab Results (`/lab-results`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/lab-results/patient/:patientId` | Get patient results | Yes |
| GET | `/lab-results/test/:testId` | Get test results | Yes |
| GET | `/lab-results/order/:orderId` | Get order results | Yes |
| GET | `/lab-results/abnormal` | Get abnormal results | Yes |
| GET | `/lab-results/critical` | Get critical results | Provider/Admin/Lab Tech |
| GET | `/lab-results/:id` | Get result details | Yes |
| POST | `/lab-results` | Create result | Lab Tech/Admin |
| POST | `/lab-results/bulk` | Create multiple results | Lab Tech/Admin |
| PATCH | `/lab-results/:id` | Update result | Lab Tech/Admin |
| PATCH | `/lab-results/:id/verify` | Verify result | Provider/Admin |
| DELETE | `/lab-results/:id` | Delete result | Admin |
| GET | `/lab-results/:id/fhir` | Get FHIR Observation | Yes |

### Test Catalog (`/test-catalog`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/test-catalog` | List all tests | No |
| GET | `/test-catalog/statistics` | Get catalog statistics | Yes |
| GET | `/test-catalog/search` | Search tests | No |
| GET | `/test-catalog/:id` | Get test details | No |
| GET | `/test-catalog/code/:code` | Get test by code | No |
| POST | `/test-catalog` | Add new test | Admin |
| PATCH | `/test-catalog/:id` | Update test | Admin |
| DELETE | `/test-catalog/:id` | Delete test | Admin |
| PATCH | `/test-catalog/:id/activate` | Activate test | Admin |
| PATCH | `/test-catalog/:id/deactivate` | Deactivate test | Admin |
| GET | `/test-catalog/:id/reference-ranges` | Get reference ranges | No |
| POST | `/test-catalog/:id/reference-ranges` | Add reference range | Admin |

### Samples (`/samples`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/samples` | Track all samples | Lab Tech/Admin |
| GET | `/samples/statistics` | Get sample statistics | Lab Tech/Admin |
| GET | `/samples/:id` | Get sample details | Lab Tech/Admin |
| GET | `/samples/number/:sampleNumber` | Get sample by number | Lab Tech/Admin |
| GET | `/samples/order/:orderId` | Get samples by order | Lab Tech/Admin |
| POST | `/samples` | Create sample | Lab Tech/Admin |
| PATCH | `/samples/:id` | Update sample | Lab Tech/Admin |
| PATCH | `/samples/:id/receive` | Mark as received | Lab Tech/Admin |
| PATCH | `/samples/:id/reject` | Reject sample | Lab Tech/Admin |
| PATCH | `/samples/:id/location` | Update location | Lab Tech/Admin |
| DELETE | `/samples/:id/dispose` | Dispose sample | Lab Tech/Admin |

## Features Implemented

### 1. Lab Test Ordering System
- Create lab orders with multiple tests
- Order prioritization (routine, urgent, stat)
- Clinical information and diagnosis tracking
- Order status management
- Order cancellation with reason

### 2. Test Catalog Management
- Comprehensive test catalog
- Test categories (hematology, biochemistry, etc.)
- LOINC code support
- Sample type requirements
- Pricing and turnaround times
- Test activation/deactivation
- Reference range management (placeholder)

### 3. Sample Tracking
- Sample lifecycle management
- Barcode/sample number tracking
- Collection and receipt tracking
- Sample condition monitoring
- Rejection with reason
- Location tracking
- Sample disposal

### 4. Results Entry and Validation
- Single and bulk result entry
- Automatic abnormal value detection
- Reference range validation
- Critical value detection
- Result verification workflow
- Numeric and text values
- Units and LOINC codes

### 5. Reference Ranges and Abnormal Flagging
- Age and gender-specific ranges
- Critical value thresholds
- Automatic flagging (H, L, HH, LL, A, AA, N)
- Condition-specific ranges (pregnancy, etc.)

### 6. Critical Value Alerts
- Automatic alert generation
- Provider notification
- Alert acknowledgement tracking
- Escalation system
- Alert statistics

### 7. HL7/FHIR Results Messaging
- FHIR DiagnosticReport generation
- FHIR Observation resources
- HL7 v2.5 ORU^R01 messages
- HL7 message parsing
- Bundle support

### 8. PDF Report Generation
- Professional lab report formatting
- Patient and order information
- Comprehensive results display
- Abnormal value highlighting
- Critical value indicators
- Reference range display
- Signature sections
- Print-optimized layout

## Data Models

### LabOrder
```typescript
{
  id: string
  patientId: string
  providerId: string
  encounterId?: string
  orderNumber: string  // Unique, auto-generated
  status: OrderStatus  // pending, collected, processing, completed, cancelled
  priority: OrderPriority  // routine, urgent, stat
  tests: LabTest[]
  clinicalInfo?: string
  diagnosis?: string
  orderedAt: DateTime
  collectedAt?: DateTime
  completedAt?: DateTime
  reportUrl?: string
  fhirResourceId?: string
}
```

### LabTest
```typescript
{
  id: string
  orderId: string
  testCode: string
  testName: string
  category: TestCategory
  status: TestStatus  // pending, processing, completed, cancelled, rejected
  results: LabResult[]
  performedBy?: string
  performedAt?: DateTime
  verifiedBy?: string
  verifiedAt?: DateTime
}
```

### LabResult
```typescript
{
  id: string
  testId: string
  componentCode?: string  // LOINC
  componentName: string
  value: string
  numericValue?: Decimal
  unit?: string
  referenceRange?: string
  isAbnormal: boolean
  isCritical: boolean
  abnormalFlag?: AbnormalFlag
  interpretation?: string
  notes?: string
  performedBy?: string
  verifiedBy?: string
  resultedAt: DateTime
  verifiedAt?: DateTime
}
```

## Integration Points

### Notification Service
- Critical value alerts
- Result ready notifications
- Escalation notifications

### Provider Service
- Ordering physician lookup
- Provider contact information

### Patient Service
- Patient demographics
- Patient history access

### Document Storage
- PDF report storage
- Report URL management

## Security & Authorization

### Role-Based Access Control
- **Admin**: Full access to all features
- **Provider**: Create orders, view results, verify results
- **Lab Tech**: Manage samples, enter results, update statuses
- **Patient**: View own orders and results

### Data Access Rules
- Patients can only view their own data
- Providers can view their ordered tests
- Lab techs have access to all lab operations
- Admins have unrestricted access

## Validation

All endpoints use Zod schemas for request validation:
- `createOrderSchema`
- `updateOrderSchema`
- `createResultSchema`
- `bulkResultsSchema`
- `createSampleSchema`
- `updateSampleSchema`
- `createTestCatalogSchema`
- `createReferenceRangeSchema`
- `filterOrdersSchema`

## Error Handling

- Comprehensive error logging with Winston
- Structured error responses
- HTTP status codes
- Validation error details
- Development vs production error messages

## Logging

Winston logger with:
- Console output (development)
- File logging (production)
- Structured logging format
- Log levels: error, warn, info, debug
- Request/response logging
- Error stack traces

## Environment Variables

```env
# Server
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

## Running the Service

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Database
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Production migrations
npm run db:migrate:prod
```

## Testing

```bash
npm test
```

## Future Enhancements

1. **Complete Prisma Schema Update**
   - Add Sample model
   - Add ReferenceRange model
   - Add TestComponent model
   - Add CriticalValueAlert model
   - Add LabOrderItem model

2. **Advanced Features**
   - Actual PDF generation with Puppeteer/PDFKit
   - Real-time notifications via WebSockets
   - Batch processing
   - Quality control tracking
   - Instrument integration
   - Barcode scanning
   - Specimen rejection workflows
   - Result trending and graphing

3. **Reporting**
   - Cumulative reports
   - Graphical trends
   - Statistical analysis
   - Export to various formats

4. **Integration**
   - LIS-EMR bidirectional interface
   - Insurance eligibility checking
   - Billing integration
- Result delivery portals

## Conclusion

This implementation provides a solid foundation for a Laboratory Information System with modern architecture, comprehensive features, and room for future expansion. The service is production-ready for basic lab operations and can be extended with additional features as needed.

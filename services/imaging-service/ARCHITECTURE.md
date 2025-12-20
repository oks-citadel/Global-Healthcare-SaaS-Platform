# Imaging Service Architecture

## Overview

The Imaging Service is a comprehensive radiology and medical imaging microservice designed for healthcare SaaS platforms. It manages the complete imaging workflow from order placement through report finalization, with DICOM support and PACS integration capabilities.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Applications                      │
│          (EHR, Radiology Workstation, Mobile Apps)          │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS/REST API
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   Imaging Service (Port 3006)                │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │              Express.js Application                 │     │
│  │  ┌──────────────────────────────────────────────┐  │     │
│  │  │         Authentication Middleware            │  │     │
│  │  └──────────────────────────────────────────────┘  │     │
│  │  ┌──────────────────────────────────────────────┐  │     │
│  │  │              API Routes Layer                │  │     │
│  │  │  - Orders    - Studies    - Images           │  │     │
│  │  │  - Reports   - Critical Findings             │  │     │
│  │  └──────────────────────────────────────────────┘  │     │
│  │  ┌──────────────────────────────────────────────┐  │     │
│  │  │           Controllers Layer                  │  │     │
│  │  │  Request validation and response handling    │  │     │
│  │  └──────────────────────────────────────────────┘  │     │
│  │  ┌──────────────────────────────────────────────┐  │     │
│  │  │            Services Layer                    │  │     │
│  │  │  - OrderService                              │  │     │
│  │  │  - StudyService                              │  │     │
│  │  │  - ImageService                              │  │     │
│  │  │  - ReportService                             │  │     │
│  │  │  - CriticalFindingService                    │  │     │
│  │  │  - PACSService (placeholder)                 │  │     │
│  │  └──────────────────────────────────────────────┘  │     │
│  └────────────────────────────────────────────────────┘     │
└───────────┬───────────────────────────┬──────────────────────┘
            │                           │
            │                           │
┌───────────▼──────────┐    ┌──────────▼──────────────────────┐
│   PostgreSQL DB      │    │   Azure Blob Storage            │
│   (Prisma ORM)       │    │   (Medical Images)              │
│                      │    │                                 │
│  - ImagingOrder      │    │  - DICOM files                  │
│  - Study             │    │  - Thumbnails                   │
│  - Image (metadata)  │    │  - Image derivatives            │
│  - RadiologyReport   │    │                                 │
│  - CriticalFinding   │    │  Storage with SAS tokens        │
└──────────────────────┘    └─────────────────────────────────┘
```

## Component Architecture

### 1. API Layer

**Routes** (`src/routes/`)
- Define HTTP endpoints and methods
- Apply middleware (authentication, validation)
- Map requests to controllers
- Handle route-level concerns

**Controllers** (`src/controllers/`)
- Process HTTP requests
- Validate input data
- Call appropriate services
- Format responses
- Handle HTTP status codes

### 2. Business Logic Layer

**Services** (`src/services/`)

1. **OrderService**
   - Imaging order lifecycle management
   - Order scheduling and tracking
   - Status transitions
   - Patient order history

2. **StudyService**
   - DICOM study registration
   - Accession number generation
   - Study Instance UID management
   - Study-level metadata
   - Status workflow management

3. **ImageService**
   - Image metadata storage
   - Series/instance organization
   - Storage URL management
   - Image count tracking
   - Azure Blob integration

4. **ReportService**
   - Report creation and editing
   - Report signing workflow
   - Amendment tracking
   - Radiologist workload management

5. **CriticalFindingService**
   - Critical finding registration
   - Automated notifications
   - Acknowledgment tracking
   - Follow-up management

6. **PACSService** (placeholder)
   - DICOM protocol integration
   - C-STORE, C-FIND, C-MOVE
   - Worklist management
   - Future PACS connectivity

### 3. Data Layer

**Prisma ORM**
- Type-safe database access
- Migration management
- Query building
- Connection pooling

**Database Models**
- ImagingOrder: Order tracking
- Study: DICOM study metadata
- Image: Image-level metadata
- RadiologyReport: Report content
- CriticalFinding: Critical alerts

### 4. Infrastructure Layer

**Storage** (`src/utils/azureStorage.ts`)
- Azure Blob Storage client
- Upload/download operations
- SAS token generation
- Container management

**Authentication** (`src/middleware/auth.ts`)
- JWT token verification
- Role-based access control
- User context injection

**Validation** (`src/middleware/validation.ts`)
- Input validation using express-validator
- Schema validation
- Error formatting

**Logging** (`src/utils/logger.ts`)
- Winston logger
- Structured logging
- Multiple transports
- Log levels

**Error Handling** (`src/utils/errorHandler.ts`)
- Centralized error handling
- Custom error classes
- Error formatting
- Stack trace management

## Data Flow

### Imaging Order Workflow

```
1. Create Order
   ↓
2. Schedule Appointment
   ↓
3. Patient Arrives → Update Status
   ↓
4. Perform Study → Register Study
   ↓
5. Upload Images → Create Image Records
   ↓
6. Radiologist Reviews → Create Report
   ↓
7. Sign Report → Finalize
   ↓
8. Deliver Results → Complete Order
```

### Critical Finding Workflow

```
1. Radiologist identifies critical finding
   ↓
2. Create CriticalFinding record
   ↓
3. System triggers notifications
   ↓
4. Notify ordering provider, care team
   ↓
5. Provider acknowledges finding
   ↓
6. Follow-up action initiated
   ↓
7. Track follow-up status
```

## Database Schema

### Entity Relationships

```
ImagingOrder (1) ──── (N) Study
                         │
Study (1) ──────────── (N) Image
  │
  ├── (N) RadiologyReport
  │
  └── (N) CriticalFinding
```

### Key Indexes

- `ImagingOrder`: patientId, providerId, facilityId, status, scheduledAt
- `Study`: orderId, patientId, studyDate, modality, status, accessionNumber, studyInstanceUID
- `Image`: studyId, seriesInstanceUID, sopInstanceUID
- `RadiologyReport`: studyId, radiologistId, status
- `CriticalFinding`: studyId, severity, notificationSent

## DICOM Integration

### DICOM Hierarchy

```
Patient
  └── Study (Study Instance UID)
       └── Series (Series Instance UID)
            └── Image (SOP Instance UID)
```

### DICOM Metadata Stored

**Study Level:**
- Study Instance UID
- Accession Number
- Study Date/Time
- Study Description
- Modality
- Referring Physician

**Series Level:**
- Series Instance UID
- Series Number
- Series Description
- Modality

**Image Level:**
- SOP Instance UID
- Instance Number
- Image dimensions (rows, columns)
- Pixel spacing
- Slice thickness
- Window settings

### PACS Integration (Planned)

**DICOM Services:**
- **C-STORE**: Receive images from modalities
- **C-FIND**: Query PACS for studies
- **C-MOVE**: Retrieve images from PACS
- **C-ECHO**: Verify PACS connectivity
- **Worklist**: Manage scheduled procedures

## Security Architecture

### Authentication & Authorization

1. **JWT Token-based Authentication**
   - Bearer token in Authorization header
   - Token expiration management
   - Refresh token support (future)

2. **Role-Based Access Control (RBAC)**
   - Radiologist role
   - Technologist role
   - Physician role
   - Administrator role

3. **Data Access Controls**
   - Patient data isolation
   - Facility-based access
   - Audit logging

### Data Protection

1. **Encryption**
   - TLS/HTTPS for data in transit
   - Encrypted storage (Azure)
   - Database encryption at rest

2. **PHI Handling**
   - HIPAA compliance ready
   - Minimal PHI in logs
   - De-identification support
   - Audit trail

3. **Storage Security**
   - SAS tokens for image access
   - Time-limited access URLs
   - Container-level security
   - Network isolation

## Scalability Considerations

### Horizontal Scaling

- Stateless service design
- Load balancer compatible
- Shared database pool
- Distributed caching (future)

### Database Optimization

- Indexed queries
- Connection pooling
- Query optimization
- Pagination for large datasets

### Storage Optimization

- CDN for image delivery (future)
- Image compression
- Thumbnail generation
- Tiered storage (hot/cool/archive)

### Performance

- Async operations
- Background job processing (future)
- Caching layer (future)
- Database query optimization

## Monitoring & Observability

### Health Checks

- `/health` endpoint
- Database connectivity check
- Storage availability check
- Service dependencies

### Logging

- Request/response logging
- Error logging with stack traces
- Audit logging for critical operations
- Structured JSON logs

### Metrics (Future)

- Request rate and latency
- Error rate
- Database query performance
- Storage operations
- Critical finding response time

## Integration Points

### External Services

1. **Notification Service**
   - Critical finding alerts
   - Report availability notifications
   - Order status updates

2. **EHR Service**
   - Patient demographics
   - Order placement
   - Result delivery
   - Clinical context

3. **PACS System** (future)
   - Image storage
   - Image retrieval
   - Worklist management

### Event-Driven Architecture (Future)

- Order created events
- Study completed events
- Report signed events
- Critical finding events

## Deployment Architecture

### Container Deployment

```
Docker Container
├── Node.js Runtime
├── Application Code
├── Prisma Client
└── Dependencies
```

### Environment Configuration

- Development: Local PostgreSQL + mock storage
- Staging: Azure PostgreSQL + Azure Storage
- Production: Azure PostgreSQL + Azure Storage + CDN

### Infrastructure as Code

- Docker Compose for local development
- Kubernetes manifests (future)
- Terraform for cloud resources (future)

## API Design Principles

1. **RESTful Design**
   - Resource-based URLs
   - HTTP method semantics
   - Proper status codes
   - HATEOAS (future)

2. **Versioning**
   - URL-based versioning (future)
   - Backward compatibility
   - Deprecation strategy

3. **Error Handling**
   - Consistent error format
   - Meaningful error messages
   - Error codes
   - Validation errors

4. **Pagination**
   - Offset-based pagination
   - Configurable page size
   - Total count in response
   - Navigation metadata

## Testing Strategy

### Unit Tests
- Service layer business logic
- Utility functions
- Validation logic

### Integration Tests
- API endpoints
- Database operations
- External service calls

### End-to-End Tests
- Complete workflows
- Critical paths
- User scenarios

## Future Enhancements

1. **DICOM Integration**
   - Full DICOM protocol support
   - Direct PACS connectivity
   - DICOM viewer integration

2. **AI/ML Integration**
   - Automated image analysis
   - Anomaly detection
   - Report suggestions

3. **Advanced Features**
   - Real-time collaboration
   - Voice recognition for dictation
   - Template management
   - Comparison tools

4. **Performance**
   - Caching layer (Redis)
   - Message queue (RabbitMQ/Kafka)
   - Background job processing
   - CDN integration

5. **Analytics**
   - Radiologist productivity
   - Turnaround time tracking
   - Quality metrics
   - Utilization reports

## Technology Stack Summary

- **Runtime**: Node.js 20.x
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 14+ with Prisma ORM
- **Storage**: Azure Blob Storage
- **Authentication**: JWT
- **Logging**: Winston
- **Validation**: express-validator
- **Container**: Docker
- **API**: RESTful HTTP/JSON

## Best Practices

1. **Code Organization**
   - Separation of concerns
   - Single responsibility principle
   - Dependency injection
   - Type safety with TypeScript

2. **Error Handling**
   - Async error handling
   - Custom error classes
   - Centralized error middleware
   - Meaningful error messages

3. **Database**
   - Prisma migrations
   - Type-safe queries
   - Connection pooling
   - Index optimization

4. **Security**
   - Input validation
   - Authentication on all routes
   - Rate limiting (future)
   - CORS configuration

5. **Logging**
   - Structured logging
   - Appropriate log levels
   - No sensitive data in logs
   - Request correlation IDs (future)

## Conclusion

The Imaging Service is designed as a production-ready, scalable microservice that handles the complete medical imaging workflow. It follows modern architectural patterns, implements best practices for security and performance, and provides a foundation for future enhancements including full PACS integration and AI-powered features.

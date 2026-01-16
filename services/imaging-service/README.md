# Imaging Service

Radiology and medical imaging service for the Global Healthcare SaaS Platform. This service handles imaging orders, study management, DICOM metadata, image storage, radiology reports, and critical findings alerts.

## Features

- **Imaging Order Management**: Create, track, and manage radiology orders
- **Study Tracking**: Support for X-ray, CT, MRI, Ultrasound, and other modalities
- **DICOM Metadata Handling**: Store and retrieve DICOM metadata
- **Image Storage Integration**: Azure Blob Storage for medical images
- **Radiology Report Management**: Create, edit, sign, and amend reports
- **Critical Findings Alerts**: Automated notifications for critical findings
- **PACS Integration**: Placeholder for future PACS connectivity

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Azure Blob Storage
- **Authentication**: JWT (placeholder)
- **Logging**: Winston

## Prerequisites

- Node.js 20.x or higher
- PostgreSQL 14.x or higher
- Azure Storage account (for image storage)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL`: PostgreSQL connection string
- `AZURE_STORAGE_CONNECTION_STRING`: Azure Storage connection string
- `PORT`: Service port (default: 3006)

3. Generate Prisma client:
```bash
npm run prisma:generate
```

4. Run database migrations:
```bash
npm run prisma:migrate
```

## Development

Start the development server:
```bash
npm run dev
```

The service will be available at `http://localhost:3006`

## API Endpoints

### Imaging Orders
- `POST /api/imaging-orders` - Create imaging order
- `GET /api/imaging-orders` - List orders
- `GET /api/imaging-orders/:id` - Get order details
- `PATCH /api/imaging-orders/:id` - Update order
- `DELETE /api/imaging-orders/:id` - Cancel order
- `GET /api/imaging-orders/patient/:patientId` - Get patient orders

### Studies
- `POST /api/studies` - Register new study
- `GET /api/studies` - List studies
- `GET /api/studies/:id` - Get study details
- `PATCH /api/studies/:id` - Update study
- `PATCH /api/studies/:id/status` - Update study status
- `GET /api/studies/accession/:accessionNumber` - Get study by accession number

### Images
- `POST /api/studies/:id/images` - Upload image metadata
- `GET /api/studies/:id/images` - Get study images
- `GET /api/studies/:id/series/:seriesUID/images` - Get series images
- `GET /api/images/:id` - Get image details
- `GET /api/images/:id/url` - Get image URL with SAS token
- `PATCH /api/images/:id/metadata` - Update image metadata
- `DELETE /api/images/:id` - Delete image

### Radiology Reports
- `POST /api/reports` - Create radiology report
- `GET /api/reports/:id` - Get report details
- `GET /api/reports/study/:studyId` - Get study reports
- `PATCH /api/reports/:id` - Update report
- `POST /api/reports/:id/sign` - Sign report
- `POST /api/reports/:id/amend` - Amend report
- `GET /api/reports/radiologist/:radiologistId` - Get radiologist reports
- `DELETE /api/reports/:id` - Delete preliminary report

### Critical Findings
- `POST /api/critical-findings` - Report critical finding
- `GET /api/critical-findings/:id` - Get finding details
- `GET /api/critical-findings/study/:studyId` - Get study findings
- `GET /api/critical-findings/pending` - Get pending findings
- `GET /api/critical-findings/severity/:severity` - Get findings by severity
- `PATCH /api/critical-findings/:id` - Update finding
- `POST /api/critical-findings/:id/acknowledge` - Acknowledge finding

## Database Models

### ImagingOrder
- Patient and provider information
- Modality and body part
- Clinical indication
- Priority and status tracking
- Scheduling information

### Study
- DICOM study metadata
- Accession number and Study Instance UID
- Patient demographics
- Modality and body part
- Series and instance counts
- Status workflow

### Image
- DICOM image metadata
- Series and SOP Instance UIDs
- Image dimensions and properties
- Storage URLs (Azure Blob)
- Acquisition parameters

### RadiologyReport
- Report content (findings, impression, recommendations)
- Status workflow (preliminary, final, amended)
- Radiologist information
- Signature and timestamps
- Amendment tracking

### CriticalFinding
- Finding description and severity
- Notification tracking
- Acknowledgement workflow
- Follow-up management

## DICOM Support

The service stores DICOM metadata and manages references to DICOM images stored in Azure Blob Storage. Key DICOM tags supported:

- **Patient**: Patient ID, Name, DOB, Sex
- **Study**: Study Instance UID, Accession Number, Study Date/Time
- **Series**: Series Instance UID, Series Number, Modality
- **Image**: SOP Instance UID, Instance Number
- **Image Properties**: Rows, Columns, Pixel Spacing, Slice Thickness
- **Display**: Window Center/Width

## Modalities Supported

- CR (Computed Radiography)
- CT (Computed Tomography)
- MR (Magnetic Resonance)
- US (Ultrasound)
- XA (X-Ray Angiography)
- DX (Digital Radiography)
- MG (Mammography)
- NM (Nuclear Medicine)
- PT (Positron Emission Tomography)
- PET_CT (PET-CT)
- RF (Radiofluoroscopy)
- OT (Other)

## Priority Levels

- **STAT**: Immediate/Emergency
- **URGENT**: Same-day
- **ROUTINE**: Normal scheduling

## Status Workflows

### Order Status
PENDING → SCHEDULED → IN_PROGRESS → COMPLETED (or CANCELLED/ON_HOLD)

### Study Status
SCHEDULED → ARRIVED → IN_PROGRESS → COMPLETED → PRELIMINARY → FINAL (or CANCELLED)

### Report Status
PRELIMINARY → FINAL → AMENDED/CORRECTED

## Critical Finding Severity

- **CRITICAL**: Life-threatening, requires immediate action
- **HIGH**: Urgent, requires prompt attention
- **MODERATE**: Important, requires timely follow-up
- **LOW**: Note for awareness

## Docker Support

Build the Docker image:
```bash
docker build -t imaging-service .
```

Run the container:
```bash
docker run -p 3006:3006 --env-file .env imaging-service
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Service port | 3006 |
| NODE_ENV | Environment | development |
| DATABASE_URL | PostgreSQL connection | - |
| AZURE_STORAGE_CONNECTION_STRING | Azure Storage | - |
| AZURE_STORAGE_CONTAINER_NAME | Container name | medical-images |
| NOTIFICATION_SERVICE_URL | Notification service | - |
| EHR_SERVICE_URL | EHR service | - |
| JWT_SECRET | JWT secret key | - |
| LOG_LEVEL | Logging level | info |

## Integration Points

### Notification Service
Critical findings automatically trigger notifications to:
- Ordering provider
- Radiologist
- Care team members
- Configurable recipients

### EHR Service
- Patient demographics sync
- Order placement
- Report delivery
- Result acknowledgment

### PACS Integration (Planned)
- DICOM C-STORE (receive images)
- DICOM C-FIND (query studies)
- DICOM C-MOVE (retrieve images)
- Worklist management (DICOM MWL)

## Security Considerations

- All endpoints require authentication
- Role-based access control (RBAC)
- Audit logging for all operations
- Encrypted storage for PHI
- HIPAA compliance ready
- DICOM de-identification support

## Logging

Winston logger with multiple transports:
- Console (development)
- File (error.log, combined.log)
- Structured JSON format
- Request/response logging
- Error stack traces

## Testing

Run tests:
```bash
npm test
```

## License

MIT

## Support

For issues and questions, please contact the Global Healthcare development team.

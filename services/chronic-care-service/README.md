# Chronic Care Service - Remote Patient Monitoring (RPM)

A comprehensive chronic care management service with full Remote Patient Monitoring (RPM) capabilities, part of the Global Healthcare SaaS Platform.

## Features

### Core Capabilities
- **Care Plan Management** - Create and manage comprehensive care plans with templates
- **RPM Device Integration** - Support for blood pressure monitors, glucose meters, pulse oximeters, weight scales, and more
- **Automated Vital Sign Collection** - Batch and real-time vital sign submission
- **Threshold Alerts & Escalation** - Configurable alert thresholds with automatic escalation
- **Patient Engagement Tracking** - Monitor patient activity and engagement levels
- **Care Team Coordination** - Multi-provider access with role-based permissions
- **Goal Setting & Progress Tracking** - Set patient goals and track progress over time
- **Educational Content Delivery** - Track patient interaction with educational materials

### Supported Devices
- Blood Pressure Monitors
- Glucose Meters
- Pulse Oximeters
- Weight Scales
- Thermometers
- Heart Rate Monitors
- Peak Flow Meters
- ECG Monitors

### Vital Sign Types
- Blood Pressure (Systolic/Diastolic)
- Heart Rate
- Blood Glucose
- Oxygen Saturation (SpO2)
- Temperature
- Weight
- Respiratory Rate
- Peak Flow

## API Endpoints

### Care Plans

#### GET /care-plans
List care plans for the authenticated user
- **Patient**: Returns their own care plans
- **Provider**: Returns all care plans they manage

#### POST /care-plans
Create a comprehensive care plan
```json
{
  "patientId": "uuid",
  "condition": "Diabetes Type 2",
  "goals": {},
  "interventions": {},
  "reviewSchedule": "monthly",
  "templateId": "uuid (optional)",
  "tasks": [
    {
      "title": "Check blood glucose",
      "taskType": "measurement",
      "frequency": "daily"
    }
  ],
  "thresholds": [
    {
      "vitalType": "blood_glucose",
      "criticalMin": 70,
      "criticalMax": 180,
      "warningMin": 80,
      "warningMax": 140
    }
  ]
}
```

#### GET /care-plans/:id
Get detailed care plan with tasks, vitals, and alerts

#### PATCH /care-plans/:id
Update care plan (provider only)

#### GET /care-plans/templates
Get available care plan templates

#### POST /care-plans/templates
Create a new care plan template (provider/admin only)

### Devices

#### POST /devices
Register a new RPM device
```json
{
  "deviceType": "blood_pressure_monitor",
  "manufacturer": "Omron",
  "model": "BP785N",
  "serialNumber": "ABC123456"
}
```

#### GET /devices
List all devices for authenticated patient

#### GET /devices/:patientId
List devices for a specific patient (provider access)

#### GET /devices/:patientId/health
Get device health report (sync status, battery levels, issues)

#### PATCH /devices/:id
Update device information

#### POST /devices/:id/sync
Sync device and update battery level
```json
{
  "batteryLevel": 75
}
```

#### DELETE /devices/:id
Remove or decommission device

### Vital Signs

#### POST /vitals
Submit a single vital reading
```json
{
  "vitalType": "blood_glucose",
  "value": 120,
  "unit": "mg/dL",
  "notes": "Fasting measurement",
  "deviceId": "uuid (optional)",
  "carePlanId": "uuid (optional)"
}
```

#### POST /vitals/batch
Submit multiple vital readings at once
```json
{
  "readings": [
    {
      "vitalType": "blood_pressure_systolic",
      "value": 130,
      "unit": "mmHg"
    },
    {
      "vitalType": "blood_pressure_diastolic",
      "value": 85,
      "unit": "mmHg"
    }
  ]
}
```

#### GET /vitals/:patientId
Get vital sign history with optional filters
- Query params: `vitalType`, `startDate`, `endDate`, `limit`, `carePlanId`

#### GET /vitals/:patientId/latest
Get latest reading for each vital type

#### GET /vitals/:patientId/statistics
Get statistical analysis for a specific vital type
- Required query param: `vitalType`
- Optional: `startDate`, `endDate`
- Returns: average, min, max, median, count

#### GET /vitals/:patientId/abnormal
Get all abnormal (out-of-threshold) vital readings

### Alerts

#### GET /alerts
List alerts with filters
- Query params: `status`, `severity`, `patientId`, `carePlanId`, `startDate`, `endDate`

#### GET /alerts/summary/:patientId
Get alert summary statistics

#### POST /alerts
Create a manual alert (provider only)
```json
{
  "patientId": "uuid",
  "alertType": "missed_medication",
  "severity": "warning",
  "title": "Missed Medication",
  "description": "Patient missed morning insulin dose"
}
```

#### PATCH /alerts/:id
Update alert with action
```json
{
  "action": "acknowledge" | "resolve" | "dismiss"
}
```

#### PATCH /alerts/:id/acknowledge
Acknowledge an alert

#### PATCH /alerts/:id/resolve
Resolve an alert

#### GET /alerts/thresholds/:patientId
Get alert thresholds for a patient

#### POST /alerts/thresholds
Create alert threshold (provider only)
```json
{
  "patientId": "uuid",
  "vitalType": "blood_glucose",
  "criticalMin": 70,
  "criticalMax": 180,
  "warningMin": 80,
  "warningMax": 140
}
```

#### PATCH /alerts/thresholds/:id
Update threshold values

#### DELETE /alerts/thresholds/:id
Deactivate threshold

### Goals

#### GET /goals/:patientId
List goals for a patient with optional filters
- Query params: `carePlanId`, `status`, `goalType`

#### GET /goals/:patientId/summary
Get active goals summary with progress percentages

#### GET /goals/detail/:goalId
Get detailed goal information with progress history

#### GET /goals/detail/:goalId/statistics
Get goal statistics and progress analysis

#### POST /goals
Create a new goal
```json
{
  "patientId": "uuid",
  "title": "Lower A1C to 6.5%",
  "goalType": "clinical_outcome",
  "targetValue": 6.5,
  "targetUnit": "%",
  "targetDate": "2024-12-31T00:00:00Z"
}
```

#### PATCH /goals/:id
Update goal

#### POST /goals/:id/progress
Record goal progress
```json
{
  "currentValue": 7.2,
  "currentUnit": "%",
  "notes": "Quarterly lab results"
}
```

#### GET /goals/:id/progress
Get goal progress history

#### DELETE /goals/:id
Delete goal

## Database Models

### CarePlan
- Patient and provider IDs
- Condition (Diabetes, Hypertension, COPD, etc.)
- Goals and interventions (JSON)
- Review schedule
- Relations to tasks, vitals, alerts

### CarePlanTemplate
- Reusable care plan templates by condition
- Default goals, interventions, tasks, thresholds
- Version control

### MonitoringDevice
- Device type, manufacturer, model
- Serial number (unique)
- Battery level and last sync time
- Status (active, inactive, maintenance, decommissioned)

### VitalReading
- Vital type and value with unit
- Recorded timestamp
- Links to patient, device, care plan
- Abnormal flag (set by threshold evaluation)

### Alert
- Alert type and severity (info, warning, critical)
- Status (new, acknowledged, resolved, dismissed)
- Acknowledgment and resolution tracking

### AlertThreshold
- Configurable per patient and vital type
- Critical and warning thresholds (min/max)
- Condition-specific thresholds

### Goal
- Goal type (vital_sign, weight_loss, activity, etc.)
- Target value and date
- Status (active, achieved, not_achieved, cancelled)
- Progress tracking relation

### GoalProgress
- Progress records with values and timestamps
- Notes and metadata

### PatientEngagement
- Engagement tracking by type
- Activity history and metadata
- Used for engagement scoring

## Alert Thresholds

### Severity Levels
- **Critical**: Requires immediate attention
- **Warning**: Outside normal range but not critical
- **Info**: Informational alerts

### Automatic Evaluation
When vital signs are submitted, the system automatically:
1. Checks against configured thresholds for the patient
2. Creates alerts if values exceed thresholds
3. Marks readings as abnormal
4. Tracks engagement activity

### Escalation
Thresholds support both warning and critical levels for automatic escalation.

## Services

### CarePlanTemplateService
- Template CRUD operations
- Version management
- Template-based care plan creation

### DeviceService
- Device registration and management
- Health monitoring
- Battery and sync tracking
- Automatic offline alerts

### VitalSignService
- Single and batch vital submission
- Historical data retrieval
- Statistical analysis
- Abnormal reading detection

### AlertService
- Alert creation and management
- Threshold evaluation engine
- Alert summary and filtering
- Threshold CRUD operations

### GoalService
- Goal creation and tracking
- Progress recording
- Achievement detection
- Statistical analysis

### EngagementService
- Activity tracking
- Engagement scoring
- Trend analysis
- Inactive patient detection

## Authentication

All endpoints require user authentication via headers:
- `x-user-id`: User UUID
- `x-user-email`: User email
- `x-user-role`: User role (patient, provider, admin)

## Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Development
npm run dev

# Production
npm run build
npm start
```

## Environment Variables

```env
PORT=3003
DATABASE_URL=postgresql://user:password@localhost:5432/chronic_care
CORS_ORIGIN=*
```

## Health Check

GET /health returns service status and available features:
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
  ],
  "timestamp": "2024-01-15T12:00:00Z"
}
```

## Response Format

All API responses follow this format:

### Success
```json
{
  "data": {},
  "message": "Operation successful",
  "count": 10
}
```

### Error
```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "details": []
}
```

## Use Cases

### Remote Patient Monitoring
1. Patient registers RPM devices
2. Devices automatically sync vital signs
3. System evaluates against thresholds
4. Alerts notify care team of issues
5. Providers review and respond to alerts
6. Engagement tracked throughout

### Chronic Disease Management
1. Provider creates care plan from template
2. Sets patient-specific goals and thresholds
3. Patient records vitals daily
4. System tracks progress toward goals
5. Automated alerts for out-of-range readings
6. Regular care plan reviews

### Population Health
1. Providers monitor multiple patients
2. Alert dashboards show critical patients
3. Engagement scores identify inactive patients
4. Goal achievement tracked across population
5. Device health monitored for compliance

## Development

Built with:
- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- Zod for validation

## License

Proprietary - Global Healthcare SaaS Platform

# Chronic Care Service - API Examples

This document provides practical examples for all API endpoints.

## Authentication Headers

All requests require these headers:
```
x-user-id: 123e4567-e89b-12d3-a456-426614174000
x-user-email: patient@example.com
x-user-role: patient
```

## Care Plans

### Create Care Plan from Template

```bash
POST /care-plans
Content-Type: application/json

{
  "patientId": "123e4567-e89b-12d3-a456-426614174000",
  "condition": "Diabetes Type 2",
  "templateId": "tmpl-diabetes-123",
  "goals": {
    "a1c": "Lower A1C below 7.0%",
    "weight": "Lose 10 pounds",
    "glucose": "Maintain fasting glucose 80-130 mg/dL"
  },
  "interventions": {
    "medication": "Metformin 500mg twice daily",
    "diet": "Low carb diet, 1800 calories/day",
    "exercise": "30 minutes walking 5x/week"
  },
  "reviewSchedule": "monthly",
  "nextReviewDate": "2024-02-15T00:00:00Z",
  "tasks": [
    {
      "title": "Check blood glucose",
      "description": "Morning fasting glucose reading",
      "taskType": "measurement",
      "frequency": "daily"
    },
    {
      "title": "Take Metformin",
      "taskType": "medication",
      "frequency": "twice_daily"
    }
  ],
  "thresholds": [
    {
      "vitalType": "blood_glucose",
      "criticalMin": 70,
      "criticalMax": 250,
      "warningMin": 80,
      "warningMax": 180
    },
    {
      "vitalType": "weight",
      "warningMax": 200
    }
  ]
}
```

### Get Care Plan Templates

```bash
GET /care-plans/templates?condition=Diabetes
```

Response:
```json
{
  "data": [
    {
      "id": "tmpl-diabetes-123",
      "name": "Diabetes Type 2 Management",
      "condition": "Diabetes Type 2",
      "description": "Standard care plan for Type 2 Diabetes patients",
      "goals": {
        "a1c": "Achieve A1C < 7.0%",
        "glucose": "Fasting glucose 80-130 mg/dL"
      },
      "thresholds": {
        "blood_glucose": {
          "criticalMin": 70,
          "criticalMax": 250
        }
      }
    }
  ],
  "count": 1
}
```

## Devices

### Register Blood Pressure Monitor

```bash
POST /devices
Content-Type: application/json

{
  "deviceType": "blood_pressure_monitor",
  "manufacturer": "Omron",
  "model": "BP785N",
  "serialNumber": "OMR-BP-20240115-001"
}
```

Response:
```json
{
  "data": {
    "id": "dev-123",
    "patientId": "123e4567-e89b-12d3-a456-426614174000",
    "deviceType": "blood_pressure_monitor",
    "manufacturer": "Omron",
    "model": "BP785N",
    "serialNumber": "OMR-BP-20240115-001",
    "status": "active",
    "batteryLevel": null,
    "lastSyncAt": null,
    "createdAt": "2024-01-15T10:00:00Z"
  },
  "message": "Device registered successfully"
}
```

### Get Device Health Report

```bash
GET /devices/123e4567-e89b-12d3-a456-426614174000/health
```

Response:
```json
{
  "data": [
    {
      "deviceId": "dev-123",
      "deviceType": "blood_pressure_monitor",
      "status": "active",
      "lastSync": "2024-01-15T08:30:00Z",
      "batteryLevel": 75,
      "issues": [],
      "healthy": true
    },
    {
      "deviceId": "dev-456",
      "deviceType": "glucose_meter",
      "status": "active",
      "lastSync": "2024-01-10T14:00:00Z",
      "batteryLevel": 15,
      "issues": [
        "Not synced in 24+ hours",
        "Low battery level"
      ],
      "healthy": false
    }
  ]
}
```

### Sync Device

```bash
POST /devices/dev-123/sync
Content-Type: application/json

{
  "batteryLevel": 75
}
```

## Vital Signs

### Submit Single Vital Reading

```bash
POST /vitals
Content-Type: application/json

{
  "vitalType": "blood_glucose",
  "value": 125,
  "unit": "mg/dL",
  "notes": "Fasting morning reading",
  "deviceId": "dev-456",
  "carePlanId": "plan-123"
}
```

### Submit Batch Vital Readings

```bash
POST /vitals/batch
Content-Type: application/json

{
  "readings": [
    {
      "vitalType": "blood_pressure_systolic",
      "value": 128,
      "unit": "mmHg",
      "recordedAt": "2024-01-15T08:00:00Z"
    },
    {
      "vitalType": "blood_pressure_diastolic",
      "value": 82,
      "unit": "mmHg",
      "recordedAt": "2024-01-15T08:00:00Z"
    },
    {
      "vitalType": "heart_rate",
      "value": 72,
      "unit": "bpm",
      "recordedAt": "2024-01-15T08:00:00Z"
    },
    {
      "vitalType": "weight",
      "value": 185,
      "unit": "lbs",
      "deviceId": "dev-789"
    }
  ]
}
```

Response:
```json
{
  "data": [
    {
      "success": true,
      "data": {
        "id": "vital-001",
        "vitalType": "blood_pressure_systolic",
        "value": 128
      }
    },
    {
      "success": true,
      "data": {
        "id": "vital-002",
        "vitalType": "blood_pressure_diastolic",
        "value": 82
      }
    }
  ],
  "summary": {
    "total": 4,
    "successful": 4,
    "failed": 0
  }
}
```

### Get Vital History

```bash
GET /vitals/123e4567-e89b-12d3-a456-426614174000?vitalType=blood_glucose&startDate=2024-01-01&limit=50
```

### Get Latest Vitals

```bash
GET /vitals/123e4567-e89b-12d3-a456-426614174000/latest
```

Response:
```json
{
  "data": [
    {
      "id": "vital-123",
      "vitalType": "blood_glucose",
      "value": 125,
      "unit": "mg/dL",
      "recordedAt": "2024-01-15T08:00:00Z",
      "isAbnormal": false
    },
    {
      "id": "vital-456",
      "vitalType": "blood_pressure_systolic",
      "value": 128,
      "unit": "mmHg",
      "recordedAt": "2024-01-15T08:05:00Z",
      "isAbnormal": false
    }
  ],
  "count": 2
}
```

### Get Vital Statistics

```bash
GET /vitals/123e4567-e89b-12d3-a456-426614174000/statistics?vitalType=blood_glucose&startDate=2024-01-01&endDate=2024-01-15
```

Response:
```json
{
  "data": {
    "vitalType": "blood_glucose",
    "count": 45,
    "average": 128.5,
    "min": 95,
    "max": 175,
    "median": 125,
    "latest": {
      "value": 125,
      "recordedAt": "2024-01-15T08:00:00Z"
    },
    "oldest": {
      "value": 132,
      "recordedAt": "2024-01-01T08:00:00Z"
    }
  }
}
```

## Alerts

### Create Manual Alert

```bash
POST /alerts
Content-Type: application/json

{
  "patientId": "123e4567-e89b-12d3-a456-426614174000",
  "carePlanId": "plan-123",
  "alertType": "missed_medication",
  "severity": "warning",
  "title": "Missed Medication",
  "description": "Patient missed morning insulin dose on 01/15/2024"
}
```

### List Alerts with Filters

```bash
GET /alerts?status=new&severity=critical&patientId=123e4567-e89b-12d3-a456-426614174000
```

Response:
```json
{
  "data": [
    {
      "id": "alert-001",
      "patientId": "123e4567-e89b-12d3-a456-426614174000",
      "alertType": "vital_out_of_range",
      "severity": "critical",
      "title": "Blood Glucose Critical",
      "description": "blood_glucose critically high: 250 (threshold: 180)",
      "status": "new",
      "createdAt": "2024-01-15T09:30:00Z"
    }
  ],
  "count": 1
}
```

### Acknowledge Alert

```bash
PATCH /alerts/alert-001/acknowledge
```

### Resolve Alert

```bash
PATCH /alerts/alert-001/resolve
```

### Update Alert (Generic)

```bash
PATCH /alerts/alert-001
Content-Type: application/json

{
  "action": "resolve"
}
```

### Get Alert Summary

```bash
GET /alerts/summary/123e4567-e89b-12d3-a456-426614174000
```

Response:
```json
{
  "data": {
    "total": 15,
    "new": 3,
    "acknowledged": 5,
    "resolved": 7,
    "critical": 2,
    "warning": 8,
    "info": 5
  }
}
```

### Create Alert Threshold

```bash
POST /alerts/thresholds
Content-Type: application/json

{
  "patientId": "123e4567-e89b-12d3-a456-426614174000",
  "carePlanId": "plan-123",
  "vitalType": "blood_glucose",
  "condition": "Diabetes Type 2",
  "criticalMin": 70,
  "criticalMax": 250,
  "warningMin": 80,
  "warningMax": 180
}
```

### Get Patient Thresholds

```bash
GET /alerts/thresholds/123e4567-e89b-12d3-a456-426614174000?vitalType=blood_glucose
```

Response:
```json
{
  "data": [
    {
      "id": "threshold-001",
      "patientId": "123e4567-e89b-12d3-a456-426614174000",
      "vitalType": "blood_glucose",
      "criticalMin": 70,
      "criticalMax": 250,
      "warningMin": 80,
      "warningMax": 180,
      "isActive": true
    }
  ],
  "count": 1
}
```

## Goals

### Create Patient Goal

```bash
POST /goals
Content-Type: application/json

{
  "patientId": "123e4567-e89b-12d3-a456-426614174000",
  "carePlanId": "plan-123",
  "title": "Lower A1C to 6.5%",
  "description": "Achieve A1C of 6.5% or lower through diet, exercise, and medication adherence",
  "goalType": "clinical_outcome",
  "targetValue": 6.5,
  "targetUnit": "%",
  "targetDate": "2024-06-30T00:00:00Z",
  "frequency": "quarterly"
}
```

### Get Patient Goals

```bash
GET /goals/123e4567-e89b-12d3-a456-426614174000?status=active
```

Response:
```json
{
  "data": [
    {
      "id": "goal-001",
      "patientId": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Lower A1C to 6.5%",
      "goalType": "clinical_outcome",
      "targetValue": 6.5,
      "targetUnit": "%",
      "targetDate": "2024-06-30T00:00:00Z",
      "status": "active",
      "progress": [
        {
          "currentValue": 7.2,
          "recordedAt": "2024-01-15T00:00:00Z"
        }
      ]
    }
  ],
  "count": 1
}
```

### Record Goal Progress

```bash
POST /goals/goal-001/progress
Content-Type: application/json

{
  "currentValue": 7.0,
  "currentUnit": "%",
  "notes": "3-month lab results show improvement",
  "recordedAt": "2024-01-15T00:00:00Z"
}
```

### Get Goals Summary

```bash
GET /goals/123e4567-e89b-12d3-a456-426614174000/summary
```

Response:
```json
{
  "data": [
    {
      "id": "goal-001",
      "title": "Lower A1C to 6.5%",
      "goalType": "clinical_outcome",
      "targetValue": 6.5,
      "targetUnit": "%",
      "targetDate": "2024-06-30T00:00:00Z",
      "latestProgress": {
        "currentValue": 7.0,
        "recordedAt": "2024-01-15T00:00:00Z"
      },
      "progressPercentage": 45
    }
  ],
  "count": 1
}
```

### Get Goal Statistics

```bash
GET /goals/detail/goal-001/statistics
```

Response:
```json
{
  "data": {
    "goalId": "goal-001",
    "totalRecords": 3,
    "latestValue": 7.0,
    "latestDate": "2024-01-15T00:00:00Z",
    "oldestValue": 7.8,
    "oldestDate": "2023-10-15T00:00:00Z",
    "targetValue": 6.5,
    "targetUnit": "%",
    "progress": 45,
    "status": "active"
  }
}
```

## Common Query Parameters

### Date Filtering
- `startDate`: ISO 8601 datetime (e.g., "2024-01-01T00:00:00Z")
- `endDate`: ISO 8601 datetime
- `limit`: Number of results (default varies by endpoint)

### Status Filtering
- Care Plans: `active`, `completed`, `suspended`, `cancelled`
- Alerts: `new`, `acknowledged`, `resolved`, `dismissed`
- Goals: `active`, `achieved`, `not_achieved`, `cancelled`
- Devices: `active`, `inactive`, `maintenance`, `decommissioned`

### Severity Filtering (Alerts)
- `info`, `warning`, `critical`

## Error Responses

### Validation Error
```json
{
  "error": "Validation Error",
  "details": [
    {
      "code": "invalid_type",
      "expected": "number",
      "received": "string",
      "path": ["value"],
      "message": "Expected number, received string"
    }
  ]
}
```

### Forbidden
```json
{
  "error": "Forbidden",
  "message": "Access denied"
}
```

### Not Found
```json
{
  "error": "Not Found",
  "message": "Goal not found"
}
```

## Rate Limiting

Currently no rate limiting is enforced, but consider implementing:
- 100 requests per minute per user for standard endpoints
- 1000 requests per minute for batch vital submissions
- 10 requests per minute for report generation

## Batch Operations

### Best Practices for Batch Vital Submissions
1. Submit vitals in batches of up to 100 readings
2. Include device sync timestamp in batch
3. Use consistent recordedAt timestamps for readings taken simultaneously
4. Handle partial failures gracefully - some readings may succeed while others fail

## Webhooks (Future Enhancement)

Consider implementing webhooks for:
- Critical alerts created
- Goals achieved
- Devices offline for 24+ hours
- Care plan review due

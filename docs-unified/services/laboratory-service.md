# Laboratory Service Documentation

**Document Version:** 1.0
**Classification:** Technical - Service Documentation
**Owner:** Platform Engineering / Clinical Operations
**Last Updated:** December 2024

---

## Table of Contents

1. [Overview](#1-overview)
2. [Service Architecture](#2-service-architecture)
3. [API Endpoints](#3-api-endpoints)
4. [Data Models](#4-data-models)
5. [Integration Points](#5-integration-points)
6. [Clinical Workflows](#6-clinical-workflows)
7. [Laboratory Partners](#7-laboratory-partners)
8. [Test Catalog](#8-test-catalog)
9. [Results Processing](#9-results-processing)
10. [Quality Assurance](#10-quality-assurance)

---

## 1. Overview

The Laboratory Service manages the complete lifecycle of laboratory testing, from order placement to results delivery, including integration with external laboratory partners and internal health checkup workflows.

### 1.1 Service Purpose

- Laboratory test ordering and tracking
- Results ingestion from partner labs
- AI-powered result analysis and flagging
- FHIR-compliant observation management
- Critical value alerting
- Trend analysis and visualization

### 1.2 Key Capabilities

| Capability | Description |
|------------|-------------|
| **Test Ordering** | Create lab orders with CPT/LOINC codes |
| **Partner Integration** | Connect to Quest, Labcorp, regional labs |
| **Results Ingestion** | HL7 v2.5, FHIR, CSV, API import |
| **AI Analysis** | Anomaly detection, trend analysis, risk scoring |
| **Critical Alerts** | Real-time provider notification for critical values |
| **Reporting** | Comprehensive patient lab reports with trends |

### 1.3 Technical Stack

```yaml
Technology Stack:
  Runtime: Node.js 20 / Bun
  Framework: Express.js / Fastify
  Database: PostgreSQL 15 (structured data), MongoDB (documents)
  Cache: Redis (results cache, session)
  Messaging: Kafka (events), Redis Pub/Sub (real-time)
  Storage: S3 / Azure Blob (PDF reports, images)
  AI/ML: Python microservice for analysis
```

---

## 2. Service Architecture

### 2.1 Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    LABORATORY SERVICE                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    API LAYER                                │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │ │
│  │  │   REST API   │  │  GraphQL     │  │  HL7 v2.5    │     │ │
│  │  │   (Express)  │  │  (Apollo)    │  │  Receiver    │     │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  BUSINESS LOGIC                             │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │ │
│  │  │    Order     │  │    Result    │  │   Alert      │     │ │
│  │  │   Manager    │  │   Processor  │  │   Handler    │     │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │ │
│  │  │  Integration │  │     AI       │  │   Report     │     │ │
│  │  │   Adapter    │  │   Analysis   │  │  Generator   │     │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    DATA LAYER                               │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │ │
│  │  │ PostgreSQL   │  │   MongoDB    │  │    Redis     │     │ │
│  │  │  (Orders,    │  │  (Raw data,  │  │   (Cache,    │     │ │
│  │  │   Results)   │  │   PDFs)      │  │   Sessions)  │     │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              EXTERNAL INTEGRATIONS                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │ │
│  │  │    Quest     │  │   Labcorp    │  │   Regional   │     │ │
│  │  │ Diagnostics  │  │              │  │     Labs     │     │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │ │
│  │  ┌──────────────┐  ┌──────────────┐                       │ │
│  │  │ FHIR Server  │  │ Notification │                       │ │
│  │  │              │  │   Service    │                       │ │
│  │  └──────────────┘  └──────────────┘                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 Service Dependencies

| Dependency | Purpose | Fallback Strategy |
|-----------|---------|-------------------|
| **Patient Service** | Patient demographics | Cached patient data |
| **Provider Service** | Ordering provider info | Cached provider directory |
| **FHIR Server** | Store as Observation resources | Queue for later sync |
| **Notification Service** | Critical value alerts | SMS fallback |
| **AI Service** | Result analysis | Manual review queue |

---

## 3. API Endpoints

### 3.1 Laboratory Orders

#### POST /api/v1/lab/orders

Create a new laboratory order.

**Request:**
```json
{
  "patientId": "pat_123456",
  "providerId": "prov_789012",
  "encounterId": "enc_345678",
  "orderType": "routine",
  "tests": [
    {
      "loincCode": "2093-3",
      "description": "Total Cholesterol",
      "cptCode": "82465"
    },
    {
      "loincCode": "2085-9",
      "description": "HDL Cholesterol",
      "cptCode": "83718"
    },
    {
      "loincCode": "2089-1",
      "description": "LDL Cholesterol",
      "cptCode": "83721"
    }
  ],
  "priority": "routine",
  "clinicalInfo": "Routine lipid panel for cardiovascular risk assessment",
  "fasting": true,
  "preferredLab": "quest",
  "scheduledDate": "2024-12-20T08:00:00Z"
}
```

**Response:**
```json
{
  "orderId": "ord_901234",
  "status": "pending",
  "requisitionNumber": "REQ-2024-12345",
  "tests": [...],
  "instructions": {
    "fasting": "8-12 hours before specimen collection",
    "location": "Quest Diagnostics - Downtown",
    "address": "123 Main St, Suite 100, City, State 12345",
    "hours": "Monday-Friday 7:00 AM - 5:00 PM"
  },
  "estimatedCompletionDate": "2024-12-21T17:00:00Z",
  "createdAt": "2024-12-19T10:00:00Z"
}
```

#### GET /api/v1/lab/orders/{orderId}

Retrieve order details and status.

**Response:**
```json
{
  "orderId": "ord_901234",
  "status": "collected",
  "timeline": [
    {
      "status": "pending",
      "timestamp": "2024-12-19T10:00:00Z",
      "note": "Order created"
    },
    {
      "status": "scheduled",
      "timestamp": "2024-12-20T07:30:00Z",
      "note": "Patient checked in"
    },
    {
      "status": "collected",
      "timestamp": "2024-12-20T08:15:00Z",
      "note": "Specimen collected"
    }
  ],
  "patient": {...},
  "provider": {...},
  "tests": [...],
  "estimatedCompletionDate": "2024-12-21T17:00:00Z"
}
```

### 3.2 Laboratory Results

#### GET /api/v1/lab/results

Get laboratory results for a patient.

**Query Parameters:**
```
patientId: required
status: optional (pending|completed|abnormal)
dateFrom: optional
dateTo: optional
testType: optional (LOINC code)
```

**Response:**
```json
{
  "results": [
    {
      "resultId": "res_123456",
      "orderId": "ord_901234",
      "testName": "Total Cholesterol",
      "loincCode": "2093-3",
      "value": 245,
      "unit": "mg/dL",
      "referenceRange": {
        "low": 0,
        "high": 200,
        "interpretation": "High"
      },
      "status": "abnormal",
      "flag": "HIGH",
      "collectedAt": "2024-12-20T08:15:00Z",
      "resultedAt": "2024-12-21T14:30:00Z",
      "performingLab": "Quest Diagnostics"
    },
    {
      "resultId": "res_123457",
      "orderId": "ord_901234",
      "testName": "HDL Cholesterol",
      "loincCode": "2085-9",
      "value": 35,
      "unit": "mg/dL",
      "referenceRange": {
        "low": 40,
        "high": 60,
        "interpretation": "Low"
      },
      "status": "abnormal",
      "flag": "LOW",
      "collectedAt": "2024-12-20T08:15:00Z",
      "resultedAt": "2024-12-21T14:30:00Z",
      "performingLab": "Quest Diagnostics"
    }
  ],
  "aiAnalysis": {
    "riskScore": 0.72,
    "category": "high",
    "recommendations": [
      "Consider statin therapy",
      "Recommend lifestyle modifications",
      "Follow-up lipid panel in 3 months"
    ]
  }
}
```

#### POST /api/v1/lab/results/import

Import results from external laboratory (HL7 v2.5 or FHIR).

**Request (HL7 v2.5):**
```
MSH|^~\&|LAB|Quest|UnifiedHealth|PROD|20241221143000||ORU^R01|MSG123456|P|2.5
PID|1||PAT123456||Doe^John||19800101|M
OBR|1||ORD901234|2093-3^Total Cholesterol^LN
OBX|1|NM|2093-3^Total Cholesterol^LN||245|mg/dL|0-200|H|||F
```

**Request (FHIR R4):**
```json
{
  "resourceType": "Observation",
  "status": "final",
  "code": {
    "coding": [
      {
        "system": "http://loinc.org",
        "code": "2093-3",
        "display": "Total Cholesterol"
      }
    ]
  },
  "subject": {
    "reference": "Patient/pat_123456"
  },
  "valueQuantity": {
    "value": 245,
    "unit": "mg/dL",
    "system": "http://unitsofmeasure.org",
    "code": "mg/dL"
  },
  "referenceRange": [
    {
      "low": {"value": 0},
      "high": {"value": 200}
    }
  ],
  "interpretation": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
          "code": "H",
          "display": "High"
        }
      ]
    }
  ]
}
```

### 3.3 Test Catalog

#### GET /api/v1/lab/catalog

Retrieve available laboratory tests.

**Query Parameters:**
```
category: optional (chemistry|hematology|immunology|microbiology)
search: optional (test name or LOINC code)
```

**Response:**
```json
{
  "tests": [
    {
      "loincCode": "2093-3",
      "testName": "Total Cholesterol",
      "category": "chemistry",
      "cptCode": "82465",
      "specimenType": "serum",
      "volume": "1 mL",
      "turnaroundTime": "1 day",
      "fasting": true,
      "price": {
        "USD": 35.00,
        "NGN": 14000.00
      }
    }
  ]
}
```

---

## 4. Data Models

### 4.1 Lab Order Schema

```typescript
interface LabOrder {
  orderId: string;
  requisitionNumber: string;
  patientId: string;
  providerId: string;
  encounterId?: string;
  orderType: 'routine' | 'stat' | 'urgent' | 'asap';
  status: 'pending' | 'scheduled' | 'collected' | 'in-progress' | 'completed' | 'cancelled';
  tests: LabTest[];
  priority: 'routine' | 'urgent' | 'stat';
  clinicalInfo?: string;
  icd10Codes?: string[];
  fasting: boolean;
  preferredLab: string;
  scheduledDate?: Date;
  collectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface LabTest {
  loincCode: string;
  testName: string;
  cptCode: string;
  specimenType: string;
  notes?: string;
}
```

### 4.2 Lab Result Schema

```typescript
interface LabResult {
  resultId: string;
  orderId: string;
  testName: string;
  loincCode: string;
  value: number | string;
  unit: string;
  referenceRange: {
    low?: number;
    high?: number;
    text?: string;
    interpretation: 'Normal' | 'Low' | 'High' | 'Critical';
  };
  status: 'preliminary' | 'final' | 'corrected' | 'cancelled';
  flag?: 'LOW' | 'HIGH' | 'CRITICAL' | 'ABNORMAL';
  collectedAt: Date;
  resultedAt: Date;
  performingLab: string;
  performingLabContact?: string;
  notes?: string;
  aiAnalysis?: AIAnalysis;
}

interface AIAnalysis {
  riskScore: number;
  category: 'low' | 'moderate' | 'high' | 'critical';
  recommendations: string[];
  trends?: {
    direction: 'improving' | 'stable' | 'worsening';
    historicalValues: Array<{
      value: number;
      date: Date;
    }>;
  };
}
```

---

## 5. Integration Points

### 5.1 Laboratory Partners

| Partner | Integration Type | Data Format | Turnaround Time |
|---------|-----------------|-------------|-----------------|
| **Quest Diagnostics** | API (REST) | HL7 v2.5, FHIR R4 | 1-3 days |
| **Labcorp** | API (REST) | HL7 v2.5, FHIR R4 | 1-3 days |
| **Regional Labs (US)** | HL7 Interface | HL7 v2.5 | 1-5 days |
| **Nigerian Labs** | Custom API | JSON | 2-7 days |
| **Kenyan Labs** | Custom API | JSON | 2-7 days |

### 5.2 FHIR Synchronization

**Observation Resource Mapping:**

```javascript
// Convert internal result to FHIR Observation
function toFHIRObservation(result: LabResult): Observation {
  return {
    resourceType: "Observation",
    id: result.resultId,
    status: result.status,
    category: [{
      coding: [{
        system: "http://terminology.hl7.org/CodeSystem/observation-category",
        code: "laboratory",
        display: "Laboratory"
      }]
    }],
    code: {
      coding: [{
        system: "http://loinc.org",
        code: result.loincCode,
        display: result.testName
      }]
    },
    subject: {
      reference: `Patient/${result.patientId}`
    },
    effectiveDateTime: result.collectedAt,
    issued: result.resultedAt,
    valueQuantity: {
      value: result.value,
      unit: result.unit,
      system: "http://unitsofmeasure.org"
    },
    referenceRange: [{
      low: { value: result.referenceRange.low },
      high: { value: result.referenceRange.high }
    }],
    interpretation: [{
      coding: [{
        system: "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
        code: getFHIRInterpretationCode(result.flag)
      }]
    }]
  };
}
```

---

## 6. Clinical Workflows

### 6.1 Standard Lab Order Workflow

```
┌──────────────────────────────────────────────────────────────────┐
│              LABORATORY ORDERING WORKFLOW                         │
└──────────────────────────────────────────────────────────────────┘

Provider                 Laboratory Service         External Lab       Patient
   │                            │                         │              │
   │  Order Lab Tests           │                         │              │
   ├───────────────────────────▶│                         │              │
   │                            │                         │              │
   │                            │  Create Requisition     │              │
   │                            ├────────────────────────▶│              │
   │                            │                         │              │
   │                            │  Send Order Confirmation              │
   │◀───────────────────────────┤                         │              │
   │                            │                         │              │
   │                            │  Send Patient Instructions            │
   │                            ├──────────────────────────────────────▶│
   │                            │                         │              │
   │                            │                         │  Visit Lab   │
   │                            │                         │◀─────────────┤
   │                            │                         │              │
   │                            │  Update: Collected      │              │
   │                            │◀────────────────────────┤              │
   │                            │                         │              │
   │                            │  Update: In Progress    │              │
   │                            │◀────────────────────────┤              │
   │                            │                         │              │
   │                            │  Receive Results (HL7)  │              │
   │                            │◀────────────────────────┤              │
   │                            │                         │              │
   │                            │  AI Analysis            │              │
   │                            │  (Anomaly Detection)    │              │
   │                            │                         │              │
   │  Critical Value Alert      │                         │              │
   │◀───────────────────────────┤                         │              │
   │                            │                         │              │
   │                            │  Sync to FHIR Server    │              │
   │                            │                         │              │
   │                            │  Send Results Notification            │
   │                            ├──────────────────────────────────────▶│
   │                            │                         │              │
```

### 6.2 Critical Value Handling

**Critical Value Thresholds:**

| Test | Critical Low | Critical High | Action |
|------|-------------|--------------|---------|
| **Glucose** | < 40 mg/dL | > 500 mg/dL | Immediate provider notification |
| **Potassium** | < 2.5 mEq/L | > 6.5 mEq/L | Immediate provider notification |
| **Hemoglobin** | < 5.0 g/dL | > 20.0 g/dL | Immediate provider notification |
| **White Blood Cell Count** | < 2.0 K/µL | > 30.0 K/µL | Immediate provider notification |
| **Troponin** | N/A | > 0.04 ng/mL | Emergency alert to cardiology |

**Alert Workflow:**
```javascript
async function handleCriticalValue(result: LabResult): Promise<void> {
  // 1. Flag the result
  result.flag = 'CRITICAL';
  result.status = 'final';

  // 2. Notify ordering provider immediately
  await notificationService.sendUrgent({
    to: result.providerId,
    channel: ['sms', 'push', 'email'],
    subject: 'CRITICAL LAB VALUE',
    message: `Critical value for ${result.testName}: ${result.value} ${result.unit}`,
    priority: 'critical',
    requiresAcknowledgment: true
  });

  // 3. If no acknowledgment within 15 minutes, escalate
  setTimeout(async () => {
    const acknowledged = await checkAcknowledgment(result.resultId);
    if (!acknowledged) {
      await escalateToOnCallProvider(result);
    }
  }, 15 * 60 * 1000);

  // 4. Log in audit trail
  await auditService.log({
    action: 'CRITICAL_VALUE_ALERT',
    resource: 'LabResult',
    resourceId: result.resultId,
    severity: 'critical'
  });
}
```

---

## 7. Laboratory Partners

### 7.1 Quest Diagnostics Integration

**API Configuration:**
```yaml
quest:
  baseUrl: https://api.questdiagnostics.com/v1
  authentication:
    type: OAuth2
    tokenUrl: https://auth.questdiagnostics.com/oauth/token
    clientId: ${QUEST_CLIENT_ID}
    clientSecret: ${QUEST_CLIENT_SECRET}
  endpoints:
    createOrder: /orders
    getResults: /results
    catalog: /tests
  formats:
    order: HL7v2.5
    results: FHIR R4
```

### 7.2 Regional Lab Networks

**Nigeria:**
- Clina-Lancet Laboratories
- Pathcare Nigeria
- Synlab Nigeria
- Regional hospital labs

**Kenya:**
- Lancet Kenya
- Pathologists Lancet Kenya
- Aga Khan University Hospital Lab

**Ghana:**
- Medlab Ghana
- Lister Hospital Laboratory
- Korle Bu Teaching Hospital

---

## 8. Test Catalog

### 8.1 Common Test Panels

#### Complete Blood Count (CBC)

| Component | LOINC Code | Reference Range |
|-----------|-----------|-----------------|
| White Blood Cell Count | 6690-2 | 4.5-11.0 K/µL |
| Red Blood Cell Count | 789-8 | 4.5-5.9 M/µL (M), 4.1-5.1 M/µL (F) |
| Hemoglobin | 718-7 | 13.5-17.5 g/dL (M), 12.0-16.0 g/dL (F) |
| Hematocrit | 4544-3 | 38.8-50.0% (M), 34.9-44.5% (F) |
| Platelet Count | 777-3 | 150-400 K/µL |

#### Comprehensive Metabolic Panel (CMP)

| Component | LOINC Code | Reference Range |
|-----------|-----------|-----------------|
| Glucose | 2345-7 | 70-100 mg/dL (fasting) |
| Calcium | 17861-6 | 8.5-10.5 mg/dL |
| Sodium | 2951-2 | 136-145 mEq/L |
| Potassium | 2823-3 | 3.5-5.0 mEq/L |
| Creatinine | 2160-0 | 0.7-1.3 mg/dL (M), 0.6-1.1 mg/dL (F) |
| BUN | 3094-0 | 7-20 mg/dL |

#### Lipid Panel

| Component | LOINC Code | Reference Range |
|-----------|-----------|-----------------|
| Total Cholesterol | 2093-3 | < 200 mg/dL |
| HDL Cholesterol | 2085-9 | > 40 mg/dL (M), > 50 mg/dL (F) |
| LDL Cholesterol | 2089-1 | < 100 mg/dL |
| Triglycerides | 2571-8 | < 150 mg/dL |

---

## 9. Results Processing

### 9.1 AI-Powered Analysis

**Anomaly Detection:**
```python
# AI Analysis Service (Python)

from sklearn.ensemble import IsolationForest
import numpy as np

class LabResultAnalyzer:
    def __init__(self):
        self.models = {}

    def analyze_result(self, result: dict) -> dict:
        """
        Analyze lab result for anomalies and risk scoring.
        """
        # Load historical patient data
        historical = self.get_patient_history(result['patientId'], result['loincCode'])

        # Detect anomalies
        anomaly_score = self.detect_anomaly(result['value'], historical)

        # Calculate trend
        trend = self.calculate_trend(historical)

        # Calculate risk score
        risk_score = self.calculate_risk(result, historical)

        # Generate recommendations
        recommendations = self.generate_recommendations(
            result, risk_score, trend
        )

        return {
            'riskScore': risk_score,
            'category': self.categorize_risk(risk_score),
            'anomalyScore': anomaly_score,
            'trend': trend,
            'recommendations': recommendations
        }

    def detect_anomaly(self, value: float, historical: list) -> float:
        """
        Use Isolation Forest to detect anomalies.
        """
        if len(historical) < 5:
            return 0.0

        X = np.array(historical).reshape(-1, 1)
        model = IsolationForest(contamination=0.1)
        model.fit(X)

        score = model.decision_function([[value]])[0]
        return abs(score)

    def calculate_risk(self, result: dict, historical: list) -> float:
        """
        Calculate cardiovascular/metabolic risk based on test.
        """
        # Implement risk scoring algorithms
        # (Framingham, ASCVD, etc.)
        pass
```

### 9.2 Result Validation

**Validation Rules:**

```javascript
const validationRules = {
  'glucose': {
    min: 0,
    max: 1000,
    criticalLow: 40,
    criticalHigh: 500,
    unit: 'mg/dL'
  },
  'potassium': {
    min: 0,
    max: 10,
    criticalLow: 2.5,
    criticalHigh: 6.5,
    unit: 'mEq/L'
  },
  'hemoglobin': {
    min: 0,
    max: 25,
    criticalLow: 5.0,
    criticalHigh: 20.0,
    unit: 'g/dL'
  }
};

function validateResult(result: LabResult): ValidationResult {
  const rule = validationRules[result.loincCode];

  if (!rule) {
    return { valid: true };
  }

  const errors = [];

  // Range validation
  if (result.value < rule.min || result.value > rule.max) {
    errors.push(`Value ${result.value} outside valid range`);
  }

  // Unit validation
  if (result.unit !== rule.unit) {
    errors.push(`Unexpected unit: ${result.unit}, expected: ${rule.unit}`);
  }

  // Critical value check
  if (result.value <= rule.criticalLow || result.value >= rule.criticalHigh) {
    return {
      valid: true,
      critical: true,
      message: `Critical value detected: ${result.value} ${result.unit}`
    };
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
```

---

## 10. Quality Assurance

### 10.1 Quality Metrics

| Metric | Target | Current |
|--------|--------|---------|
| **Order Turnaround Time** | < 24 hours (routine) | 18 hours |
| **Critical Value Notification** | < 15 minutes | 8 minutes |
| **Result Accuracy** | > 99.5% | 99.7% |
| **HL7 Interface Uptime** | > 99.9% | 99.95% |
| **Provider Satisfaction** | > 4.5/5 | 4.7/5 |

### 10.2 Audit Trail

```javascript
// Comprehensive audit logging
await auditService.log({
  eventType: 'LAB_RESULT_VIEWED',
  userId: currentUser.id,
  patientId: result.patientId,
  resourceType: 'LabResult',
  resourceId: result.resultId,
  action: 'READ',
  timestamp: new Date(),
  ipAddress: request.ip,
  userAgent: request.headers['user-agent'],
  phi: true  // Contains PHI
});
```

### 10.3 Compliance Requirements

- **CLIA Compliance**: All partner labs must be CLIA-certified
- **HIPAA Compliance**: Encrypted data transmission, audit logging
- **State Licensure**: Verify provider license for ordering labs
- **Informed Consent**: Patient consent for testing documented

---

## Appendix A: LOINC Code Reference

Common LOINC codes used in the platform:

| LOINC Code | Test Name | Category |
|-----------|-----------|----------|
| 2093-3 | Total Cholesterol | Chemistry |
| 2085-9 | HDL Cholesterol | Chemistry |
| 2089-1 | LDL Cholesterol | Chemistry |
| 2571-8 | Triglycerides | Chemistry |
| 2345-7 | Glucose | Chemistry |
| 4548-4 | Hemoglobin A1c | Chemistry |
| 718-7 | Hemoglobin | Hematology |
| 777-3 | Platelet Count | Hematology |
| 2160-0 | Creatinine | Chemistry |
| 3094-0 | Blood Urea Nitrogen | Chemistry |

---

## Appendix B: Integration Testing

```bash
# Test Quest Diagnostics integration
npm run test:integration:quest

# Test HL7 message parsing
npm run test:hl7

# Test FHIR synchronization
npm run test:fhir-sync
```

---

*Document Version: 1.0*
*Last Updated: December 2024*
*Owner: Platform Engineering / Clinical Operations*

# Chronic Care Service Documentation

**Document Version:** 1.0
**Last Updated:** December 2024

---

## 1. Overview

The Chronic Care Service provides comprehensive management for patients with chronic conditions including diabetes, hypertension, COPD, and heart disease through care plans, remote monitoring, and medication adherence tracking.

### 1.1 Core Capabilities

- Personalized care plan creation and management
- Remote patient monitoring (RPM) integration
- Medication adherence tracking
- Vital signs tracking and alerts
- Care team coordination
- Patient education and coaching
- Goal setting and progress tracking

### 1.2 Supported Conditions

| Condition | ICD-10 | Monitoring Parameters | Interventions |
|-----------|--------|----------------------|---------------|
| **Type 2 Diabetes** | E11 | Blood glucose, HbA1c, weight | Diet, exercise, medications |
| **Hypertension** | I10 | Blood pressure, heart rate | Medications, lifestyle |
| **COPD** | J44 | SpO2, FEV1, symptoms | Medications, pulmonary rehab |
| **Heart Failure** | I50 | Weight, BP, edema | Medications, fluid restriction |
| **Asthma** | J45 | Peak flow, symptoms | Medications, trigger avoidance |

---

## 2. Care Plan Management

### 2.1 Care Plan Structure

```typescript
interface CarePlan {
  planId: string;
  patientId: string;
  condition: string;
  icd10Code: string;
  status: 'active' | 'completed' | 'cancelled' | 'on-hold';
  startDate: Date;
  endDate?: Date;

  goals: Array<{
    goalId: string;
    description: string;
    target: string;
    deadline?: Date;
    status: 'not-started' | 'in-progress' | 'achieved' | 'not-achieved';
    progress: number;  // 0-100
  }>;

  interventions: Array<{
    type: 'medication' | 'exercise' | 'diet' | 'education' | 'monitoring';
    description: string;
    frequency: string;
    instructions: string;
  }>;

  careTeam: Array<{
    role: 'primary-physician' | 'specialist' | 'nurse' | 'dietitian' | 'care-coordinator';
    providerId: string;
  }>;

  vitalParameters: Array<{
    parameter: 'blood-glucose' | 'blood-pressure' | 'weight' | 'spo2';
    target: { min?: number; max?: number; ideal?: number };
    frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
  }>;
}
```

### 2.2 Example: Diabetes Care Plan

```json
{
  "planId": "plan_123456",
  "patientId": "pat_789012",
  "condition": "Type 2 Diabetes Mellitus",
  "icd10Code": "E11.9",
  "status": "active",
  "startDate": "2024-01-15",

  "goals": [
    {
      "goalId": "goal_1",
      "description": "Achieve HbA1c < 7.0%",
      "target": "< 7.0%",
      "deadline": "2024-06-15",
      "status": "in-progress",
      "progress": 65
    },
    {
      "goalId": "goal_2",
      "description": "Lose 10 pounds",
      "target": "185 lbs",
      "deadline": "2024-06-15",
      "status": "in-progress",
      "progress": 40
    }
  ],

  "interventions": [
    {
      "type": "medication",
      "description": "Metformin 500mg twice daily",
      "frequency": "twice-daily",
      "instructions": "Take with meals"
    },
    {
      "type": "monitoring",
      "description": "Blood glucose monitoring",
      "frequency": "fasting + bedtime",
      "instructions": "Record fasting and bedtime readings"
    },
    {
      "type": "diet",
      "description": "Low-carb diet (< 150g carbs/day)",
      "frequency": "daily",
      "instructions": "Consult with dietitian"
    },
    {
      "type": "exercise",
      "description": "30 minutes moderate exercise",
      "frequency": "5x/week",
      "instructions": "Walking, cycling, or swimming"
    }
  ],

  "vitalParameters": [
    {
      "parameter": "blood-glucose",
      "target": { "min": 70, "max": 180, "ideal": 100 },
      "frequency": "daily"
    },
    {
      "parameter": "weight",
      "target": { "max": 185 },
      "frequency": "weekly"
    }
  ]
}
```

---

## 3. Remote Patient Monitoring

### 3.1 Device Integration

**Supported Devices:**

| Device Type | Manufacturer | Connectivity | Measurements |
|------------|--------------|--------------|--------------|
| **Glucometer** | OneTouch, Accu-Chek | Bluetooth | Blood glucose |
| **Blood Pressure Monitor** | Omron, Withings | Bluetooth, WiFi | BP, heart rate |
| **Weight Scale** | Withings, Fitbit | Bluetooth, WiFi | Weight, BMI, body fat % |
| **Pulse Oximeter** | Masimo, Nonin | Bluetooth | SpO2, heart rate |
| **Spirometer** | Smart Peak Flow | Bluetooth | FEV1, PEF |

### 3.2 Data Ingestion

**API Example:**
```json
POST /api/v1/chronic-care/vitals
{
  "patientId": "pat_789012",
  "vitalType": "blood-glucose",
  "value": 142,
  "unit": "mg/dL",
  "measuredAt": "2024-12-19T07:30:00Z",
  "deviceId": "device_345678",
  "tags": ["fasting"],
  "notes": "Before breakfast"
}
```

### 3.3 Alert Rules

```typescript
interface AlertRule {
  condition: string;
  parameter: string;
  threshold: {
    criticalHigh?: number;
    high?: number;
    low?: number;
    criticalLow?: number;
  };
  action: 'notify-patient' | 'notify-provider' | 'escalate' | 'schedule-visit';
  recipients: string[];
}
```

**Example Alert Rules:**

```javascript
const diabetesAlerts = [
  {
    condition: "E11",
    parameter: "blood-glucose",
    threshold: {
      criticalHigh: 400,
      high: 250,
      low: 70,
      criticalLow: 50
    },
    action: "escalate",
    recipients: ["primary-physician", "endocrinologist"]
  },
  {
    condition: "I10",
    parameter: "systolic-bp",
    threshold: {
      criticalHigh: 180,
      high: 140,
      low: 90,
      criticalLow: 70
    },
    action: "notify-provider",
    recipients: ["primary-physician"]
  }
];
```

---

## 4. Medication Adherence

### 4.1 Adherence Tracking

**Metrics:**
- Proportion of Days Covered (PDC)
- Medication Possession Ratio (MPR)
- Self-reported adherence
- Refill timeliness

**Calculation Example:**
```typescript
function calculatePDC(prescriptions: Prescription[], startDate: Date, endDate: Date): number {
  const totalDays = daysBetween(startDate, endDate);
  const coveredDays = new Set();

  prescriptions.forEach(rx => {
    const fillDate = rx.fillDate;
    const daysSupply = rx.daysSupply;

    for (let i = 0; i < daysSupply; i++) {
      coveredDays.add(addDays(fillDate, i));
    }
  });

  return (coveredDays.size / totalDays) * 100;
}
```

### 4.2 Medication Reminders

```json
POST /api/v1/chronic-care/reminders
{
  "patientId": "pat_789012",
  "medicationId": "med_456789",
  "schedule": {
    "times": ["08:00", "20:00"],
    "timezone": "America/New_York",
    "frequency": "daily"
  },
  "channels": ["push", "sms"],
  "enabled": true
}
```

---

## 5. Care Coordination

### 5.1 Care Team Roles

| Role | Responsibilities |
|------|-----------------|
| **Primary Care Physician** | Overall care coordination, treatment decisions |
| **Specialist** | Condition-specific management |
| **Care Coordinator/Nurse** | Patient engagement, monitoring, education |
| **Dietitian** | Nutritional counseling |
| **Pharmacist** | Medication management, reconciliation |
| **Social Worker** | Resource coordination, psychosocial support |

### 5.2 Care Team Communication

```
GET /api/v1/chronic-care/care-team/{planId}
POST /api/v1/chronic-care/care-team/{planId}/message
GET /api/v1/chronic-care/care-team/{planId}/tasks
```

---

## 6. Patient Education

### 6.1 Educational Content

**Content Types:**
- Condition overview and management
- Medication information
- Diet and nutrition guides
- Exercise recommendations
- Self-management skills
- Warning signs and when to seek care

**API Example:**
```json
GET /api/v1/chronic-care/education?
  condition=E11&
  topic=diet&
  language=en
```

### 6.2 Progress Tracking

**Dashboard Metrics:**
- Days since last reading
- Readings in range (%)
- Medication adherence (%)
- Goals achieved
- Provider visits completed
- Education modules completed

---

## 7. Analytics & Reporting

### 7.1 Population Health Dashboard

**Metrics:**
- Total patients enrolled
- Active care plans
- Average adherence rate
- Readmission rate (30-day, 90-day)
- Hospital admission rate
- Emergency department visits
- Cost savings

### 7.2 Patient Outcomes

```typescript
interface PatientOutcome {
  patientId: string;
  condition: string;
  enrollmentDate: Date;

  baseline: {
    hba1c?: number;
    bloodPressure?: { systolic: number; diastolic: number };
    weight?: number;
    medication Count?: number;
  };

  current: {
    hba1c?: number;
    bloodPressure?: { systolic: number; diastolic: number };
    weight?: number;
    medicationCount?: number;
  };

  improvement: {
    hba1cChange?: number;
    bpChange?: number;
    weightChange?: number;
  };

  costSavings?: number;
}
```

---

## 8. FHIR Integration

### 8.1 FHIR Resources

**CarePlan Resource:**
```json
{
  "resourceType": "CarePlan",
  "id": "plan_123456",
  "status": "active",
  "intent": "plan",
  "category": [{
    "coding": [{
      "system": "http://hl7.org/fhir/us/core/CodeSystem/careplan-category",
      "code": "assess-plan"
    }]
  }],
  "subject": { "reference": "Patient/pat_789012" },
  "period": {
    "start": "2024-01-15"
  },
  "activity": [
    {
      "detail": {
        "kind": "MedicationRequest",
        "code": {
          "coding": [{
            "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
            "code": "860975",
            "display": "Metformin 500 MG"
          }]
        },
        "status": "in-progress",
        "scheduledTiming": {
          "repeat": {
            "frequency": 2,
            "period": 1,
            "periodUnit": "d"
          }
        }
      }
    }
  ]
}
```

---

## 9. Quality Metrics

| Metric | Target | Current |
|--------|--------|---------|
| **Patient Enrollment** | 5,000 | 4,200 |
| **Medication Adherence (PDC)** | > 80% | 76% |
| **HbA1c Control (< 7%)** | > 70% | 68% |
| **BP Control (< 140/90)** | > 75% | 72% |
| **30-Day Readmission Rate** | < 10% | 8.5% |
| **Patient Engagement** | > 70% | 74% |
| **Provider Satisfaction** | > 4.5/5 | 4.6/5 |

---

*Document Version: 1.0*
*Last Updated: December 2024*

# Mental Health Service Documentation

**Document Version:** 1.0
**Classification:** Technical - Service Documentation
**Owner:** Platform Engineering / Clinical Operations
**Last Updated:** December 2024

---

## 1. Overview

The Mental Health Service provides comprehensive mental healthcare including therapy, psychiatry, crisis support, and mental wellness programs through secure telehealth and asynchronous messaging.

### 1.1 Key Capabilities

- Individual therapy sessions (video, audio, chat)
- Psychiatric consultations and medication management
- Crisis intervention and 24/7 support
- Mental health assessments (PHQ-9, GAD-7, etc.)
- Group therapy sessions
- Self-help resources and guided programs
- Provider-patient secure messaging

### 1.2 Technical Stack

```yaml
Runtime: Node.js 20 / TypeScript
Framework: Express.js / NestJS
Database: PostgreSQL (structured), MongoDB (sessions, notes)
Cache: Redis (sessions, presence)
Real-time: Socket.IO (video, chat)
Video: Twilio Video / Daily.co
Storage: S3 (recordings, documents)
```

---

## 2. Service Architecture

```
┌────────────────────────────────────────────────────────────┐
│             MENTAL HEALTH SERVICE                           │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  API LAYER: REST, WebSocket, Video Signaling         │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  BUSINESS LOGIC                                       │ │
│  │  - Therapy Session Manager                           │ │
│  │  - Assessment Engine                                 │ │
│  │  - Crisis Triage                                     │ │
│  │  - Provider Matching                                 │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  DATA LAYER: PostgreSQL, MongoDB, Redis              │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  INTEGRATIONS                                         │ │
│  │  - FHIR Server (Condition, Procedure)                │ │
│  │  - Notification Service (Reminders, Crisis)          │ │
│  │  - Billing Service                                   │ │
│  │  - Crisis Hotlines (988, local resources)            │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## 3. Core Features

### 3.1 Therapy Sessions

**Session Types:**
- Individual therapy (45-60 min)
- Couples therapy (60 min)
- Family therapy (60 min)
- Group therapy (60-90 min)

**Modalities:**
- Cognitive Behavioral Therapy (CBT)
- Dialectical Behavior Therapy (DBT)
- Acceptance and Commitment Therapy (ACT)
- Mindfulness-Based Stress Reduction (MBSR)
- Psychodynamic therapy
- Solution-Focused Brief Therapy (SFBT)

### 3.2 Mental Health Assessments

**Screening Tools:**

| Assessment | Purpose | Scoring | Frequency |
|-----------|---------|---------|-----------|
| **PHQ-9** | Depression screening | 0-27 (0-4: minimal, 20-27: severe) | Bi-weekly |
| **GAD-7** | Anxiety screening | 0-21 (0-4: minimal, 15-21: severe) | Bi-weekly |
| **PCL-5** | PTSD screening | 0-80 (31+: probable PTSD) | Monthly |
| **MDQ** | Bipolar screening | 0-13 (7+: positive screen) | Initial, as needed |
| **AUDIT** | Alcohol use | 0-40 (8+: harmful drinking) | Quarterly |

**API Example:**
```json
POST /api/v1/mental-health/assessments
{
  "patientId": "pat_123456",
  "assessmentType": "PHQ-9",
  "responses": [
    { "question": 1, "score": 2 },
    { "question": 2, "score": 3 }
  ],
  "totalScore": 18,
  "severity": "moderate-severe",
  "recommendedAction": "clinical-intervention"
}
```

### 3.3 Crisis Support

**Crisis Triage Workflow:**

```
Patient Crisis Alert
      ↓
Automated Risk Assessment (Severity 1-5)
      ↓
Severity 4-5: Immediate crisis counselor connection
Severity 2-3: Same-day appointment offered
Severity 1: Resources + scheduled follow-up
      ↓
Crisis Session
      ↓
Safety Plan Created
      ↓
Follow-up scheduled within 24-48 hours
```

**Crisis Resources:**
- 988 Suicide & Crisis Lifeline
- Crisis Text Line (Text HOME to 741741)
- SAMHSA National Helpline: 1-800-662-4357
- Veterans Crisis Line: 1-800-273-8255 (Press 1)

---

## 4. API Endpoints

### 4.1 Therapy Appointments

```
POST /api/v1/mental-health/appointments
GET /api/v1/mental-health/appointments
GET /api/v1/mental-health/appointments/{id}
PATCH /api/v1/mental-health/appointments/{id}
DELETE /api/v1/mental-health/appointments/{id}/cancel
```

### 4.2 Therapy Sessions

```
POST /api/v1/mental-health/sessions/{id}/start
POST /api/v1/mental-health/sessions/{id}/end
POST /api/v1/mental-health/sessions/{id}/notes
GET /api/v1/mental-health/sessions/{id}/recording
```

### 4.3 Assessments

```
GET /api/v1/mental-health/assessments/types
POST /api/v1/mental-health/assessments
GET /api/v1/mental-health/assessments/{id}
GET /api/v1/mental-health/assessments/history
```

### 4.4 Crisis Support

```
POST /api/v1/mental-health/crisis/alert
GET /api/v1/mental-health/crisis/resources
POST /api/v1/mental-health/safety-plan
```

---

## 5. Data Models

```typescript
interface TherapySession {
  sessionId: string;
  appointmentId: string;
  patientId: string;
  therapistId: string;
  sessionType: 'individual' | 'couples' | 'family' | 'group';
  modality: 'CBT' | 'DBT' | 'ACT' | 'MBSR' | 'psychodynamic';
  startTime: Date;
  endTime?: Date;
  duration: number;
  sessionNumber: number;
  notes?: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  riskAssessment?: {
    suicidalIdeation: boolean;
    homicidalIdeation: boolean;
    selfHarm: boolean;
    severity: 1 | 2 | 3 | 4 | 5;
  };
  homework?: string[];
  nextAppointment?: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
}

interface MentalHealthAssessment {
  assessmentId: string;
  patientId: string;
  assessmentType: 'PHQ-9' | 'GAD-7' | 'PCL-5' | 'MDQ' | 'AUDIT';
  responses: Array<{
    questionNumber: number;
    score: number;
  }>;
  totalScore: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'moderate-severe' | 'severe';
  recommendedAction: string;
  administeredBy?: string;
  completedAt: Date;
}
```

---

## 6. Provider Matching

**Matching Algorithm:**

```javascript
async function matchTherapist(patient, preferences) {
  const criteria = {
    specialty: preferences.concerns,
    availability: preferences.schedule,
    licensedIn: patient.state,
    gender: preferences.gender,
    ethnicity: preferences.ethnicity,
    language: preferences.language,
    modality: preferences.therapyType
  };

  const therapists = await db.therapists.find({
    specialty: { $in: criteria.specialty },
    licensedStates: criteria.licensedIn,
    accepting: true
  });

  return therapists
    .map(t => ({ therapist: t, score: calculateMatchScore(t, criteria) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
```

---

## 7. Compliance & Privacy

### 7.1 HIPAA Compliance

- End-to-end encryption for video sessions
- Encrypted storage of session notes
- Access controls and audit logging
- BAA agreements with all therapists
- Minimum necessary principle for data access

### 7.2 State Licensure

- Therapists licensed in patient's state
- Real-time license verification
- Automatic scheduling blocks for unlicensed states
- Multi-state compact participation (PSYPACT, ASWB)

### 7.3 Documentation Requirements

**Therapy Note Template (SOAP Format):**
```
Subjective: Patient's reported symptoms, concerns, progress
Objective: Therapist observations, mental status exam
Assessment: Clinical impressions, DSM-5 diagnosis
Plan: Treatment interventions, homework, next session goals
```

---

## 8. Quality Metrics

| Metric | Target | Current |
|--------|--------|---------|
| **Time to First Appointment** | < 48 hours | 36 hours |
| **Patient Satisfaction** | > 4.5/5 | 4.7/5 |
| **Therapist Retention** | > 85% | 88% |
| **Crisis Response Time** | < 5 minutes | 3 minutes |
| **Session Completion Rate** | > 80% | 83% |
| **Symptom Improvement** | > 50% reduction | 58% reduction |

---

*Document Version: 1.0*
*Last Updated: December 2024*
*Owner: Platform Engineering / Clinical Operations*

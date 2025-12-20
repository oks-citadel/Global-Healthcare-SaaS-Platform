# Mental Health Service

Comprehensive behavioral health service providing therapy session management, treatment planning, mental health assessments, crisis intervention, and medication management with full 42 CFR Part 2 compliance.

## Features

### Core Features
- **Therapy Session Management** - Individual, group, couples, and family therapy sessions
- **Treatment Plans** - Goal-based treatment planning with progress tracking
- **Mental Health Assessments** - PHQ-9, GAD-7, Columbia Suicide Severity Rating Scale (C-SSRS)
- **Crisis Intervention** - 24/7 crisis support with severity-based escalation
- **Medication Management** - Psychotropic medication tracking and management
- **Progress Notes** - SOAP, DAP, BIRP, and GIRP format documentation
- **Group Therapy** - Group session scheduling and attendance tracking
- **Confidentiality Controls** - 42 CFR Part 2 compliance for substance use disorder records

### Assessment Instruments

#### PHQ-9 (Patient Health Questionnaire - Depression)
- 9-item screening for depression severity
- Auto-scoring: 0-27 scale
- Severity levels: None (0-4), Mild (5-9), Moderate (10-14), Moderately Severe (15-19), Severe (20-27)
- Includes suicidal ideation screening

#### GAD-7 (Generalized Anxiety Disorder)
- 7-item screening for anxiety severity
- Auto-scoring: 0-21 scale
- Severity levels: Minimal (0-4), Mild (5-9), Moderate (10-14), Severe (15-21)

#### C-SSRS (Columbia Suicide Severity Rating Scale)
- Evidence-based suicide risk assessment
- 6 screening questions
- Risk levels: None, Low, Moderate, High, Imminent
- Immediate intervention triggers

## API Endpoints

### Therapy Sessions

#### Create Session
```http
POST /sessions
Content-Type: application/json

{
  "therapistId": "uuid",
  "sessionType": "individual|group|couples|family",
  "scheduledAt": "2024-01-15T14:00:00Z",
  "duration": 60,
  "modality": "CBT",
  "notes": "Initial intake session"
}
```

#### List Sessions
```http
GET /sessions?status=scheduled&startDate=2024-01-01&endDate=2024-12-31
```

#### Get Session Details
```http
GET /sessions/:id
```

#### Add Session Notes
```http
POST /sessions/:id/notes
Content-Type: application/json

{
  "noteType": "SOAP",
  "subjective": "Patient reports feeling anxious",
  "objective": "Patient appeared restless, made good eye contact",
  "assessment": "Moderate anxiety symptoms consistent with GAD",
  "plan": "Continue CBT, practice relaxation techniques"
}
```

#### Update Session
```http
PATCH /sessions/:id
Content-Type: application/json

{
  "status": "completed",
  "actualStartTime": "2024-01-15T14:00:00Z",
  "actualEndTime": "2024-01-15T15:00:00Z",
  "homework": "Practice deep breathing 3x daily"
}
```

### Treatment Plans

#### Create Treatment Plan
```http
POST /treatment-plans
Content-Type: application/json

{
  "patientId": "uuid",
  "diagnosis": ["Major Depressive Disorder", "Generalized Anxiety Disorder"],
  "interventions": {
    "therapy": "Cognitive Behavioral Therapy",
    "frequency": "Weekly sessions"
  },
  "frequency": "weekly",
  "startDate": "2024-01-01T00:00:00Z",
  "reviewDate": "2024-04-01T00:00:00Z",
  "goals": [
    {
      "description": "Reduce anxiety symptoms by 50%",
      "targetDate": "2024-03-01T00:00:00Z",
      "strategies": ["Deep breathing exercises", "Cognitive restructuring", "Exposure therapy"],
      "measurements": {
        "baseline": "GAD-7 score: 15",
        "target": "GAD-7 score: 7 or below"
      }
    }
  ]
}
```

#### Get Patient's Treatment Plan
```http
GET /treatment-plans/patient/:patientId
```

#### Update Treatment Plan
```http
PATCH /treatment-plans/:id
Content-Type: application/json

{
  "status": "active",
  "reviewDate": "2024-07-01T00:00:00Z"
}
```

#### Add Goal to Plan
```http
POST /treatment-plans/:id/goals
Content-Type: application/json

{
  "description": "Improve sleep quality",
  "strategies": ["Sleep hygiene", "Relaxation techniques"],
  "targetDate": "2024-02-01T00:00:00Z"
}
```

#### Update Goal Progress
```http
PATCH /treatment-plans/goals/:goalId
Content-Type: application/json

{
  "progress": 75,
  "status": "in_progress",
  "barriers": ["Work stress interfering with practice"]
}
```

### Assessments

#### Get Assessment Questions
```http
GET /assessments/instruments/PHQ9/questions
GET /assessments/instruments/GAD7/questions
```

#### Submit Assessment
```http
POST /assessments
Content-Type: application/json

{
  "patientId": "uuid",
  "assessmentType": "PHQ9",
  "results": {
    "responses": {
      "phq9_1": 2,
      "phq9_2": 2,
      "phq9_3": 1,
      "phq9_4": 2,
      "phq9_5": 1,
      "phq9_6": 1,
      "phq9_7": 1,
      "phq9_8": 0,
      "phq9_9": 0
    }
  },
  "notes": "Patient cooperative during assessment"
}
```
*Auto-scores and returns severity, interpretation, and recommendations*

#### Score Assessment (Preview)
```http
POST /assessments/score
Content-Type: application/json

{
  "assessmentType": "GAD7",
  "responses": {
    "gad7_1": 3,
    "gad7_2": 2,
    "gad7_3": 3,
    "gad7_4": 2,
    "gad7_5": 1,
    "gad7_6": 2,
    "gad7_7": 2
  }
}
```

#### Get Patient Assessments
```http
GET /assessments?patientId=uuid&assessmentType=PHQ9
```

#### Get Assessment Statistics
```http
GET /assessments/stats/:patientId
```

### Crisis Intervention

#### Trigger Crisis Protocol
```http
POST /crisis-alerts
Content-Type: application/json

{
  "patientId": "uuid",
  "crisisType": "suicidal_ideation",
  "severity": "high",
  "description": "Patient expressing active suicidal thoughts with plan"
}
```

#### Update Crisis Intervention
```http
PATCH /crisis/:id
Content-Type: application/json

{
  "status": "monitoring",
  "interventions": ["Safety plan created", "Emergency contacts notified"],
  "outcome": "Patient stabilized, agreed to safety contract",
  "followUpNeeded": true,
  "followUpDate": "2024-01-16T10:00:00Z"
}
```

#### Get Crisis Dashboard (Providers)
```http
GET /crisis/active/dashboard
```
*Returns active interventions grouped by severity*

#### Get Emergency Hotlines
```http
GET /crisis/hotlines/info
```

### Medications

#### Prescribe Medication
```http
POST /medications
Content-Type: application/json

{
  "patientId": "uuid",
  "medicationName": "Sertraline",
  "medicationClass": "antidepressant",
  "dosage": "50mg",
  "frequency": "Once daily",
  "route": "oral",
  "startDate": "2024-01-01T00:00:00Z",
  "indication": "Major Depressive Disorder",
  "sideEffects": ["Nausea", "Headache"],
  "interactions": ["Avoid MAOIs"]
}
```

#### Get Patient Medications
```http
GET /medications/patient/:patientId?status=active
```

#### Get Active Medications Summary
```http
GET /medications/patient/:patientId/active
```

#### Update Medication
```http
PATCH /medications/:id
Content-Type: application/json

{
  "dosage": "100mg",
  "status": "active"
}
```

#### Discontinue Medication
```http
POST /medications/:id/discontinue
```

### Group Sessions

#### Create Group Session
```http
POST /group-sessions
Content-Type: application/json

{
  "groupId": "uuid",
  "sessionDate": "2024-01-20T18:00:00Z",
  "duration": 90,
  "topic": "Coping with Anxiety",
  "objectives": ["Learn grounding techniques", "Share experiences", "Build support network"],
  "materials": {
    "handouts": ["Grounding_Exercises.pdf"],
    "resources": ["Anxiety_Workbook"]
  }
}
```

#### Record Attendance
```http
POST /group-sessions/:id/attendance
Content-Type: application/json

{
  "attendees": [
    {
      "patientId": "uuid1",
      "attended": true,
      "participation": "Active participation, shared personal experience"
    },
    {
      "patientId": "uuid2",
      "attended": false
    }
  ]
}
```

#### Get Patient's Group Sessions
```http
GET /group-sessions/patient/:patientId/sessions
```

### Progress Notes

#### Create Progress Note
```http
POST /progress-notes
Content-Type: application/json

{
  "sessionId": "uuid",
  "patientId": "uuid",
  "noteType": "SOAP",
  "subjective": "Patient reports improvement in mood, less frequent crying episodes",
  "objective": "Appropriate affect, good eye contact, engaged in conversation",
  "assessment": "Depression symptoms improving with medication and therapy",
  "plan": "Continue current treatment, monitor for side effects",
  "riskAssessment": "Low risk for self-harm",
  "interventions": ["CBT techniques", "Medication management"],
  "homework": "Continue mood journal, practice cognitive restructuring",
  "isConfidential": true
}
```

#### Get Progress Notes for Patient
```http
GET /progress-notes/patient/:patientId
```

#### Get Progress Notes for Session
```http
GET /progress-notes/session/:sessionId
```

### Consent Management (42 CFR Part 2)

#### Grant Consent
```http
POST /consent/grant
Content-Type: application/json

{
  "providerId": "uuid",
  "consentType": "treatment",
  "purpose": "Substance use disorder treatment",
  "expiresAt": "2024-12-31T23:59:59Z",
  "substanceUseDisclosure": true,
  "disclosureScope": "treatment,medication",
  "redisclosure": false
}
```

#### Check Consent
```http
GET /consent/check/:patientId/:providerId
```

#### Get My Consents
```http
GET /consent/my-consents
```

#### Revoke Consent
```http
POST /consent/:consentId/revoke
```

#### Create Emergency Consent (72-hour)
```http
POST /consent/emergency
Content-Type: application/json

{
  "patientId": "uuid",
  "emergencyReason": "Patient experiencing acute crisis"
}
```

#### Get 42 CFR Part 2 Compliance Info
```http
GET /consent/compliance/cfr-part2
```

## Database Models

### TherapySession
- Session tracking with status, modality, and scheduling
- Supports individual, group, couples, and family therapy

### TreatmentPlan & TreatmentGoal
- Comprehensive treatment planning
- Goal-based progress tracking with measurements

### MentalHealthAssessment & AssessmentResponse
- Standardized assessment instruments
- Auto-scoring with severity interpretation

### ProgressNote
- Multiple format support (SOAP, DAP, BIRP, GIRP)
- Risk assessment and intervention tracking

### CrisisIntervention
- Crisis type and severity classification
- Escalation and follow-up protocols

### PsychMedication
- Medication class categorization
- Side effect and interaction tracking

### GroupSession & GroupSessionAttendee
- Group therapy scheduling
- Attendance and participation tracking

### ConsentRecord
- 42 CFR Part 2 compliant consent tracking
- Substance use disclosure controls
- Expiration and revocation management

## Privacy & Compliance

### 42 CFR Part 2 Compliance
This service implements comprehensive controls for substance use disorder records:

1. **Written Consent Required** - All disclosures require explicit patient consent
2. **Specific Purpose** - Consents must specify disclosure purpose
3. **Scope Control** - Define what information can be shared
4. **Expiration Dates** - All consents have expiration dates
5. **Revocation Rights** - Patients can revoke consent at any time
6. **Redisclosure Prohibition** - Recipients cannot re-share without additional consent
7. **Emergency Exception** - 72-hour emergency consents available

### Access Control
- Role-based access (patient, provider, admin)
- Consent verification on sensitive data access
- Audit logging for compliance

## Development

### Setup
```bash
npm install
```

### Database Migration
```bash
npm run db:migrate
```

### Generate Prisma Client
```bash
npm run db:generate
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/mental_health
PORT=3002
CORS_ORIGIN=http://localhost:3000
```

## Emergency Resources

- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **SAMHSA National Helpline**: 1-800-662-4357
- **Emergency Services**: 911

## License

Private - Global Healthcare SaaS Platform

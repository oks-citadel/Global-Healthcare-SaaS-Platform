# Mental Health Service - API Endpoints

## Base URL
`http://localhost:3002`

---

## Therapy Sessions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/sessions` | Create therapy session | Yes (Patient) |
| GET | `/sessions` | List sessions | Yes |
| GET | `/sessions/:id` | Get session details | Yes |
| PATCH | `/sessions/:id` | Update session | Yes |
| DELETE | `/sessions/:id` | Cancel session | Yes |

---

## Treatment Plans

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/treatment-plans` | Create treatment plan | Yes (Provider) |
| GET | `/treatment-plans/patient/:patientId` | Get patient's active plan | Yes |
| GET | `/treatment-plans/:id` | Get plan details | Yes |
| PATCH | `/treatment-plans/:id` | Update plan | Yes (Provider) |
| POST | `/treatment-plans/:id/goals` | Add goal to plan | Yes (Provider) |
| PATCH | `/treatment-plans/goals/:goalId` | Update goal progress | Yes (Provider) |
| GET | `/treatment-plans/:id/progress` | Get plan progress | Yes |

---

## Assessments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/assessments/instruments/:type/questions` | Get assessment questions | No |
| POST | `/assessments` | Submit assessment (auto-scores) | Yes (Provider) |
| POST | `/assessments/score` | Preview score without saving | Yes |
| GET | `/assessments` | List assessments | Yes |
| GET | `/assessments/:id` | Get assessment details | Yes |
| GET | `/assessments/stats/:patientId` | Get patient statistics | Yes |

### Available Assessment Types
- `PHQ9` - Depression screening
- `GAD7` - Anxiety screening
- `PCL5` - PTSD screening
- `AUDIT` - Alcohol use
- `DAST` - Drug use
- `MDQ` - Bipolar disorder
- `YBOCS` - OCD
- `PSS` - Perceived stress

---

## Crisis Intervention

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/crisis-alerts` | Trigger crisis protocol | Yes |
| GET | `/crisis` | List crisis interventions | Yes |
| GET | `/crisis/:id` | Get intervention details | Yes |
| PATCH | `/crisis/:id` | Update intervention | Yes (Provider) |
| GET | `/crisis/active/dashboard` | Get crisis dashboard | Yes (Provider) |
| GET | `/crisis/hotlines/info` | Get emergency hotlines | No |

---

## Medications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/medications` | Prescribe medication | Yes (Provider) |
| GET | `/medications/patient/:patientId` | Get patient medications | Yes |
| GET | `/medications/:id` | Get medication details | Yes |
| PATCH | `/medications/:id` | Update medication | Yes (Provider) |
| POST | `/medications/:id/discontinue` | Discontinue medication | Yes (Provider) |
| GET | `/medications/patient/:patientId/active` | Get active medications summary | Yes |

---

## Group Sessions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/group-sessions` | Create group session | Yes (Provider) |
| GET | `/group-sessions` | List group sessions | Yes |
| GET | `/group-sessions/:id` | Get session details | Yes |
| PATCH | `/group-sessions/:id` | Update session | Yes (Provider) |
| POST | `/group-sessions/:id/attendance` | Record attendance | Yes (Provider) |
| GET | `/group-sessions/patient/:patientId/sessions` | Get patient's sessions | Yes |

---

## Progress Notes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/progress-notes` | Create progress note | Yes (Provider) |
| GET | `/progress-notes/patient/:patientId` | Get patient notes | Yes |
| GET | `/progress-notes/session/:sessionId` | Get session notes | Yes |
| GET | `/progress-notes/:id` | Get note details | Yes |
| PATCH | `/progress-notes/:id` | Update note | Yes (Provider) |
| POST | `/sessions/:sessionId/notes` | Add note to session | Yes (Provider) |

### Note Formats Supported
- `SOAP` - Subjective, Objective, Assessment, Plan
- `DAP` - Data, Assessment, Plan
- `BIRP` - Behavior, Intervention, Response, Plan
- `GIRP` - Goals, Intervention, Response, Plan

---

## Consent Management (42 CFR Part 2)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/consent/grant` | Grant consent to provider | Yes (Patient) |
| GET | `/consent/my-consents` | Get patient's consents | Yes (Patient) |
| GET | `/consent/check/:patientId/:providerId` | Check consent validity | Yes |
| POST | `/consent/:consentId/revoke` | Revoke consent | Yes (Patient) |
| GET | `/consent/:consentId` | Get consent details | Yes |
| POST | `/consent/emergency` | Create emergency consent (72hr) | Yes (Provider) |
| GET | `/consent/compliance/cfr-part2` | Get compliance information | No |

---

## Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Service health status | No |

---

## Authentication

All endpoints (except public ones) require authentication via API Gateway headers:
- `x-user-id`: User's UUID
- `x-user-email`: User's email
- `x-user-role`: User's role (patient, provider, admin)

---

## Response Formats

### Success Response
```json
{
  "data": { /* result object */ },
  "message": "Success message"
}
```

### List Response
```json
{
  "data": [ /* array of results */ ],
  "count": 10
}
```

### Error Response
```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "details": { /* optional error details */ }
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing authentication)
- `403` - Forbidden (insufficient permissions or missing consent)
- `404` - Not Found
- `500` - Internal Server Error

---

## Privacy & Compliance

### 42 CFR Part 2 Protected Information
When accessing substance use disorder records or creating progress notes marked as confidential:
1. Valid patient consent is required
2. Consent must be specific to the provider
3. Consent can be revoked at any time
4. Emergency 72-hour consents available for crisis situations

### Consent Requirements
- Treatment plans: Requires active consent
- Progress notes: Requires active consent if marked confidential
- Assessments: Provider access only
- Medications: Provider who prescribed or with valid consent
- Crisis interventions: Open to all providers during active crisis

---

## Rate Limiting

Currently not implemented. Consider implementing rate limiting in production:
- Crisis endpoints: No rate limit (emergency access)
- Assessment submissions: 10 per hour per patient
- Standard endpoints: 100 requests per minute per user

---

## Webhooks / Events (Future)

Consider implementing webhooks for:
- Crisis alerts (immediate notification)
- Assessment results requiring follow-up
- Treatment plan review due dates
- Medication refill reminders
- Group session reminders

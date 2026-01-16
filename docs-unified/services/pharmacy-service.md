# Pharmacy Service Documentation

**Document Version:** 1.0
**Last Updated:** December 2024

---

## 1. Overview

The Pharmacy Service manages electronic prescribing, medication management, drug interaction checking, and pharmacy network integration for medication fulfillment and delivery.

### 1.1 Core Capabilities

- E-prescribing (NCPDP SCRIPT Standard)
- Medication history and reconciliation
- Drug interaction and allergy checking
- Pharmacy network integration
- Medication adherence tracking
- Refill management and reminders
- Home delivery coordination

### 1.2 Technology Stack

```yaml
Runtime: Node.js 20 / TypeScript
Database: PostgreSQL (prescriptions), Redis (cache)
Integrations: Surescripts (e-prescribe), DrFirst, RxNorm, FDB
Messaging: Kafka (prescription events)
```

---

## 2. E-Prescribing Workflow

```
Provider                Pharmacy Service          Surescripts Network        Pharmacy
   │                           │                            │                    │
   │  Create Prescription      │                            │                    │
   ├──────────────────────────>│                            │                    │
   │                           │  Check Drug Interactions   │                    │
   │                           │  Check Allergies           │                    │
   │                           │                            │                    │
   │                           │  Submit e-Prescription     │                    │
   │                           ├───────────────────────────>│                    │
   │                           │                            │  Route to Pharmacy │
   │                           │                            ├───────────────────>│
   │                           │                            │                    │
   │                           │  Confirmation              │                    │
   │<──────────────────────────┤<───────────────────────────┤                    │
   │                           │                            │                    │
   │                           │                            │  Fill Prescription │
   │                           │                            │<───────────────────┤
   │                           │  Status Update: Ready      │                    │
   │                           │<───────────────────────────┤                    │
   │                           │                            │                    │
   │  Notify Patient           │                            │                    │
   │<──────────────────────────┤                            │                    │
```

---

## 3. API Endpoints

### 3.1 Prescriptions

```
POST /api/v1/pharmacy/prescriptions
GET /api/v1/pharmacy/prescriptions
GET /api/v1/pharmacy/prescriptions/{id}
POST /api/v1/pharmacy/prescriptions/{id}/cancel
POST /api/v1/pharmacy/prescriptions/{id}/refill
```

**Create Prescription Example:**
```json
POST /api/v1/pharmacy/prescriptions
{
  "patientId": "pat_123456",
  "providerId": "prov_789012",
  "medication": {
    "rxNormCode": "197361",
    "name": "Lisinopril 10 MG Oral Tablet",
    "dosage": "10 mg",
    "route": "oral",
    "frequency": "once daily",
    "duration": "30 days",
    "quantity": 30,
    "refills": 3
  },
  "diagnosis": "I10",
  "instructions": "Take one tablet by mouth once daily in the morning",
  "pharmacyId": "pharm_456789",
  "substitutionAllowed": true
}
```

### 3.2 Drug Interaction Checking

```
POST /api/v1/pharmacy/interactions/check
{
  "medications": [
    {"rxNormCode": "197361"},
    {"rxNormCode": "308136"}
  ],
  "allergies": ["penicillin"],
  "conditions": ["I10", "E11.9"]
}
```

**Response:**
```json
{
  "interactions": [
    {
      "severity": "moderate",
      "type": "drug-drug",
      "drugs": ["Lisinopril", "Hydrochlorothiazide"],
      "description": "May increase risk of hypotension",
      "recommendation": "Monitor blood pressure closely"
    }
  ],
  "allergies": [],
  "contraindications": []
}
```

---

## 4. Medication Management

### 4.1 Medication Reconciliation

**Process:**
1. Retrieve medication history from Surescripts
2. Compare with patient-reported medications
3. Identify discrepancies
4. Clinician review and reconciliation
5. Update master medication list

### 4.2 Adherence Tracking

```typescript
interface MedicationAdherence {
  prescriptionId: string;
  patientId: string;
  medication: string;
  startDate: Date;
  expectedRefillDate: Date;
  actualRefillDate?: Date;
  adherenceScore: number;  // 0-100
  missedDoses: number;
  status: 'adherent' | 'non-adherent' | 'at-risk';
}
```

---

## 5. Pharmacy Network Integration

### 5.1 Partner Pharmacies

| Partner | Coverage | Integration | Services |
|---------|----------|-------------|----------|
| **CVS** | US nationwide | Surescripts | Pickup, delivery |
| **Walgreens** | US nationwide | Surescripts | Pickup, delivery |
| **Amazon Pharmacy** | US nationwide | API | Home delivery |
| **HealthMart** | Nigeria | Custom API | Pickup |
| **Goodlife Pharmacy** | Kenya | Custom API | Pickup, delivery |

### 5.2 Pharmacy Search

```
GET /api/v1/pharmacy/search?
  location=12.9716,-77.5946&
  radius=10&
  services=delivery&
  insurance=aetna
```

---

## 6. Medication Database

### 6.1 RxNorm Integration

**RxNorm Concept Types:**
- SCD (Semantic Clinical Drug): Full drug description
- SBD (Semantic Branded Drug): Brand name version
- GPCK (Generic Pack): Package information
- BPCK (Branded Pack): Branded package

**Example:**
```json
{
  "rxNormCode": "197361",
  "name": "Lisinopril 10 MG Oral Tablet",
  "tty": "SCD",
  "ingredients": ["Lisinopril"],
  "strength": "10 mg",
  "doseForm": "Oral Tablet",
  "route": "Oral"
}
```

### 6.2 Common Medications

| Medication | RxNorm | Category | Common Uses |
|-----------|--------|----------|-------------|
| Lisinopril 10mg | 197361 | ACE Inhibitor | Hypertension |
| Metformin 500mg | 860975 | Antidiabetic | Type 2 Diabetes |
| Atorvastatin 20mg | 617318 | Statin | High Cholesterol |
| Levothyroxine 50mcg | 966224 | Thyroid | Hypothyroidism |
| Amlodipine 5mg | 197361 | CCB | Hypertension |

---

## 7. Compliance & Safety

### 7.1 DEA Controlled Substances

**Schedule Requirements:**
- Schedule II: No refills, written prescription required (with exceptions)
- Schedule III-IV: Up to 5 refills within 6 months
- Schedule V: Varies by state

**EPCS (Electronic Prescribing of Controlled Substances):**
- Two-factor authentication required
- Enhanced provider identity verification
- Secure transmission to pharmacy

### 7.2 State Regulations

**Prescription Monitoring Programs (PMP):**
- Query PMP before prescribing controlled substances
- Report all controlled substance prescriptions
- Varies by state (some mandatory, some voluntary)

---

## 8. Quality Metrics

| Metric | Target | Current |
|--------|--------|---------|
| **E-Prescription Success Rate** | > 99% | 99.3% |
| **Drug Interaction Alert Response** | < 2 seconds | 1.2 seconds |
| **Prescription Delivery Time** | < 24 hours | 18 hours |
| **Medication Adherence Rate** | > 80% | 76% |
| **Refill Reminder Engagement** | > 60% | 64% |

---

*Document Version: 1.0*
*Last Updated: December 2024*

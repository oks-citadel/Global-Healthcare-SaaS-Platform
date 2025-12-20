# Pharmacy Service - Complete Implementation

A comprehensive pharmacy fulfillment service with drug safety checks, inventory management, controlled substance tracking, and prior authorization workflow.

## Features Implemented

### 1. Core Features
- ✅ E-prescribing (NCPDP SCRIPT format support)
- ✅ Drug-drug interaction checking
- ✅ Drug-allergy checking
- ✅ Formulary management
- ✅ Inventory tracking (FEFO - First Expired, First Out)
- ✅ Dispensing workflow with safety checks
- ✅ Refill management
- ✅ Controlled substance tracking (DEA Schedule II-V)
- ✅ Prior authorization workflow
- ✅ PDMP (Prescription Drug Monitoring Program) integration

### 2. Database Models

Located in `/prisma/schema-new.prisma`:

- **Prescription** - Prescription records
- **PrescriptionItem** - Individual medication items
- **Medication** - Drug formulary with NDC and RxNorm codes
- **DrugInteraction** - Drug-drug interaction database
- **DrugAllergy** - Patient allergy records
- **Dispensing** - Medication dispensing records
- **Inventory** - Pharmacy inventory management
- **PriorAuthorization** - Prior auth requests and approvals
- **ControlledSubstanceLog** - Controlled substance dispensing logs
- **Pharmacy** - Pharmacy information

### 3. Services

Located in `/src/services/`:

#### PrescriptionService
- Create, read, update prescriptions
- Check expired prescriptions
- Manage refill counts
- Track prescription validity

#### InteractionCheckService
- Drug-drug interaction checking
- Drug-allergy checking
- Comprehensive safety checks
- Manage patient allergy records

#### DispenseService
- Full dispensing workflow with safety checks
- Inventory verification
- Drug interaction validation
- Allergy checking
- Controlled substance logging
- PDMP integration
- Refill management

#### InventoryService
- Add/update inventory
- Check medication availability
- FEFO inventory management
- Low stock alerts
- Expiring medication tracking
- Inventory reservation system

#### PriorAuthService
- Submit prior authorization requests
- Approve/deny authorizations
- Appeal process
- Expiration tracking
- Statistics and reporting

#### PDMPService
- PDMP checking (controlled substances)
- Detect multiple providers
- Detect multiple pharmacies
- Overlapping prescription detection
- Early refill alerts
- Dangerous drug combination warnings
- PDMP reporting

### 4. API Endpoints

#### Prescription Management
```
POST   /prescriptions              - Create prescription
GET    /prescriptions              - List prescriptions
GET    /prescriptions/:id          - Get prescription details
PATCH  /prescriptions/:id          - Update prescription
POST   /prescriptions/:id/refill   - Request refill
GET    /prescriptions/:id/refills-remaining - Check refills
```

#### Dispensing
```
POST   /dispense                           - Dispense medication
GET    /dispense/patient/:patientId        - Dispensing history
GET    /dispense/:id                       - Get dispensing details
POST   /dispense/:id/return                - Return medication
GET    /dispense/current-medications/:patientId - Current meds
```

#### Drug Interactions
```
POST   /drug-interactions/check            - Check drug-drug interactions
POST   /drug-interactions/check-allergies  - Check drug allergies
POST   /drug-interactions/safety-check     - Comprehensive safety check
GET    /drug-interactions/allergies/:patientId - Get patient allergies
POST   /drug-interactions/allergies        - Add patient allergy
DELETE /drug-interactions/allergies/:id    - Deactivate allergy
```

#### Inventory
```
GET    /inventory                    - Get pharmacy inventory
POST   /inventory                    - Add inventory item
GET    /inventory/check-availability - Check if medication available
GET    /inventory/quantity           - Get available quantity
GET    /inventory/reorder-list       - Get medications needing reorder
GET    /inventory/expiring           - Get expiring medications
PATCH  /inventory/:id                - Update inventory
DELETE /inventory/:id                - Deactivate inventory
POST   /inventory/reserve            - Reserve inventory
POST   /inventory/release            - Release reserved inventory
```

#### Prior Authorization
```
POST   /prior-auth                    - Submit prior auth request
GET    /prior-auth                    - List prior authorizations
GET    /prior-auth/:id                - Get prior auth details
POST   /prior-auth/:id/approve        - Approve prior auth
POST   /prior-auth/:id/deny           - Deny prior auth
POST   /prior-auth/:id/appeal         - Appeal prior auth
GET    /prior-auth/check-required/:medicationId - Check if required
GET    /prior-auth/check-active/:patientId/:medicationName - Check active auth
GET    /prior-auth/expiring-soon      - Get expiring authorizations
GET    /prior-auth/statistics         - Get statistics
```

#### Controlled Substances (PDMP)
```
GET    /controlled-substances/:patientId          - Check PDMP
GET    /controlled-substances/history/:patientId  - Get CS history
POST   /controlled-substances/report/:logId       - Report to PDMP
GET    /controlled-substances/unreported          - Get unreported dispensings
POST   /controlled-substances/bulk-report         - Bulk report to PDMP
GET    /controlled-substances/statistics          - Get PDMP statistics
```

#### Formulary
```
GET    /formulary                     - Search formulary
GET    /formulary/:id                 - Get medication details
POST   /formulary                     - Add medication
PATCH  /formulary/:id                 - Update medication
DELETE /formulary/:id                 - Deactivate medication
GET    /formulary/by-ndc/:ndcCode     - Lookup by NDC
GET    /formulary/controlled-substances - Get controlled substances
GET    /formulary/therapeutic-classes - Get therapeutic classes
```

### 5. Utility Modules

Located in `/src/utils/`:

#### RxNorm Utility
- RxNorm code validation
- Drug name normalization
- Strength and dosage form extraction
- Mock RxNorm lookup (ready for API integration)

#### NDC Utility
- NDC format validation
- NDC formatting (10-digit to 11-digit conversion)
- NDC segment extraction (labeler, product, package codes)
- Barcode format generation

#### NCPDP SCRIPT Utility
- Generate NEWRX (new prescription)
- Generate RXFILL (fill notification)
- Generate REFRES (refill request)
- Generate REFRESP (refill response)
- Generate RXCHG (prescription change)
- Generate CHGRES (change response)
- Generate CANRX (cancel prescription)
- Generate STATUS (status notification)
- Message validation and serialization

### 6. Safety Features

#### Drug Interaction Checking
- Severity levels: mild, moderate, severe, contraindicated
- Clinical effects documentation
- Management recommendations
- Documentation quality tracking

#### Allergy Checking
- Reaction types: mild, moderate, severe, anaphylaxis
- Symptom tracking
- Provider verification
- Active/inactive status

#### Controlled Substance Safety
- DEA Schedule tracking (II-V)
- PDMP integration
- Multiple provider detection
- Multiple pharmacy detection
- Overlapping prescription detection
- Early refill detection
- Dangerous combination warnings (opioids + benzodiazepines)

### 7. Inventory Management

#### Features
- FEFO (First Expired, First Out) dispensing
- Lot number tracking
- Expiration date tracking
- Low stock alerts
- Reorder level management
- Inventory reservation system
- Cost tracking

### 8. Integration Standards

#### RxNorm
- Standardized drug nomenclature
- Concept unique identifiers (RxCUI)
- Ready for NLM RxNorm API integration

#### NDC (National Drug Code)
- FDA drug identification
- 10-digit and 11-digit format support
- Labeler, product, and package codes
- Ready for FDA NDC Directory API

#### NCPDP SCRIPT
- Electronic prescribing standard
- Version 2017071 support
- Multiple message types
- XML/JSON serialization ready

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup

Replace the old schema with the new comprehensive schema:
```bash
# Backup current schema
cp prisma/schema.prisma prisma/schema.prisma.backup

# Use new schema
cp prisma/schema-new.prisma prisma/schema.prisma

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate
```

### 3. Environment Variables

Create a `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/pharmacy_db"
PORT=3004
CORS_ORIGIN="*"
```

### 4. Update Application Entry Point

Replace the old index.ts with the new one:
```bash
cp src/index-updated.ts src/index.ts
```

### 5. Start the Service
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Usage Examples

### 1. Create Prescription with Safety Checks
```javascript
POST /prescriptions
{
  "patientId": "patient-uuid",
  "items": [
    {
      "medicationName": "Lisinopril 10mg",
      "dosage": "10mg",
      "frequency": "once daily",
      "quantity": 30,
      "refillsAllowed": 3,
      "ndcCode": "00002-0315-01",
      "rxNormCode": "314076"
    }
  ],
  "validUntil": "2025-12-31T00:00:00Z"
}
```

### 2. Dispense Medication with Full Safety Checks
```javascript
POST /dispense
{
  "prescriptionId": "prescription-uuid",
  "prescriptionItemId": "item-uuid",
  "medicationId": "medication-uuid",
  "patientId": "patient-uuid",
  "pharmacyId": "pharmacy-uuid",
  "quantityDispensed": 30,
  "ndcCode": "00002-0315-01",
  "lotNumber": "LOT123456",
  "daysSupply": 30
}
```

### 3. Check Drug Interactions
```javascript
POST /drug-interactions/check
{
  "medications": [
    "Warfarin",
    "Aspirin",
    "Ibuprofen"
  ]
}
```

### 4. Check PDMP for Controlled Substances
```javascript
GET /controlled-substances/:patientId?deaSchedule=II
```

### 5. Submit Prior Authorization
```javascript
POST /prior-auth
{
  "prescriptionId": "prescription-uuid",
  "prescriptionItemId": "item-uuid",
  "patientId": "patient-uuid",
  "providerId": "provider-uuid",
  "medicationName": "Humira",
  "diagnosis": ["Rheumatoid Arthritis"],
  "justification": "Patient has failed first-line therapy with methotrexate..."
}
```

## Security Considerations

### Access Control
- Provider: Create prescriptions
- Pharmacist: Dispense medications, manage inventory, check PDMP
- Admin: Approve prior auth, manage formulary
- Patient: View own prescriptions

### Audit Trail
- All dispensings logged
- Controlled substance logs for PDMP reporting
- Prior authorization audit trail
- Interaction and allergy check results stored

### Controlled Substances
- DEA schedule tracking
- PDMP integration
- Mandatory pharmacist review
- Refill restrictions enforced

## Future Enhancements

1. **External API Integrations**
   - RxNorm API (NLM)
   - FDA NDC Directory API
   - State PDMP APIs
   - E-prescribing networks (Surescripts)

2. **Advanced Features**
   - Medication therapy management (MTM)
   - Drug utilization review (DUR)
   - Automated refill reminders
   - Medication synchronization
   - 340B program support

3. **Analytics**
   - Prescription volume analytics
   - Controlled substance reporting
   - Prior authorization metrics
   - Inventory optimization

## Architecture

```
pharmacy-service/
├── prisma/
│   ├── schema.prisma          # Current schema
│   └── schema-new.prisma      # Comprehensive new schema
├── src/
│   ├── services/              # Business logic
│   │   ├── PrescriptionService.ts
│   │   ├── InteractionCheckService.ts
│   │   ├── DispenseService.ts
│   │   ├── InventoryService.ts
│   │   ├── PriorAuthService.ts
│   │   └── PDMPService.ts
│   ├── routes/                # API endpoints
│   │   ├── prescriptions-enhanced.ts
│   │   ├── dispense.ts
│   │   ├── interactions.ts
│   │   ├── inventory.ts
│   │   ├── priorAuth.ts
│   │   ├── pdmp.ts
│   │   └── formulary.ts
│   ├── utils/                 # Utility functions
│   │   ├── rxNorm.ts          # RxNorm utilities
│   │   ├── ndc.ts             # NDC utilities
│   │   └── ncpdpScript.ts     # NCPDP SCRIPT utilities
│   ├── middleware/
│   │   └── extractUser.ts
│   └── index.ts               # Application entry
└── package.json
```

## Compliance

This service is designed to support:
- HIPAA compliance (patient data protection)
- DEA regulations (controlled substances)
- PDMP reporting requirements
- NCPDP SCRIPT standard
- NDC and RxNorm standards

## Support

For questions or issues, please refer to the main project documentation.

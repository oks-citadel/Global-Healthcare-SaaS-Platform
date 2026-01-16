# Prisma Schema Update Instructions

The current implementation uses placeholder code for some models (Sample, ReferenceRange, etc.) that are not yet in the Prisma schema. To fully enable all features, replace the contents of `prisma/schema.prisma` with the following complete schema:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==========================================
// Laboratory Domain
// ==========================================

model LabOrder {
  id              String         @id @default(uuid())
  patientId       String
  providerId      String
  encounterId     String?
  orderNumber     String         @unique
  status          OrderStatus    @default(pending)
  priority        OrderPriority  @default(routine)
  items           LabOrderItem[]
  tests           LabTest[]
  samples         Sample[]
  clinicalInfo    String?        // Clinical indication
  diagnosis       String?
  orderedAt       DateTime       @default(now())
  collectedAt     DateTime?
  completedAt     DateTime?
  reportUrl       String?        // PDF report URL
  fhirResourceId  String?        // FHIR DiagnosticReport ID
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  @@index([patientId])
  @@index([providerId])
  @@index([status])
  @@index([orderNumber])
  @@index([orderedAt])
}

model LabOrderItem {
  id              String       @id @default(uuid())
  orderId         String
  order           LabOrder     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  testCatalogId   String
  testCatalog     TestCatalog  @relation(fields: [testCatalogId], references: [id])
  quantity        Int          @default(1)
  status          TestStatus   @default(pending)
  notes           String?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  @@index([orderId])
  @@index([testCatalogId])
  @@index([status])
}

enum OrderStatus {
  pending
  collected
  processing
  completed
  cancelled
  partial
}

enum OrderPriority {
  routine
  urgent
  stat
}

model LabTest {
  id              String       @id @default(uuid())
  orderId         String
  order           LabOrder     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  sampleId        String?
  sample          Sample?      @relation(fields: [sampleId], references: [id])
  testCode        String
  testName        String
  category        TestCategory
  status          TestStatus   @default(pending)
  results         LabResult[]
  performedBy     String?
  performedAt     DateTime?
  verifiedBy      String?
  verifiedAt      DateTime?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  @@index([orderId])
  @@index([sampleId])
  @@index([testCode])
  @@index([status])
}

enum TestCategory {
  hematology
  biochemistry
  immunology
  microbiology
  pathology
  radiology
  cardiology
  endocrinology
  molecular
  genetics
  toxicology
  other
}

enum TestStatus {
  pending
  processing
  completed
  cancelled
  rejected
}

model LabResult {
  id              String       @id @default(uuid())
  testId          String
  test            LabTest      @relation(fields: [testId], references: [id], onDelete: Cascade)
  componentCode   String?      // LOINC code
  componentName   String
  value           String
  numericValue    Decimal?     @db.Decimal(15, 4)
  unit            String?
  referenceRange  String?
  isAbnormal      Boolean      @default(false)
  isCritical      Boolean      @default(false)
  abnormalFlag    AbnormalFlag?
  interpretation  String?
  notes           String?
  performedBy     String?
  verifiedBy      String?
  resultedAt      DateTime     @default(now())
  verifiedAt      DateTime?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  @@index([testId])
  @@index([isAbnormal])
  @@index([isCritical])
  @@index([resultedAt])
}

enum AbnormalFlag {
  H        // High
  L        // Low
  HH       // Critical High
  LL       // Critical Low
  A        // Abnormal
  AA       // Very Abnormal
  N        // Normal
}

model Sample {
  id              String       @id @default(uuid())
  orderId         String
  order           LabOrder     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  sampleNumber    String       @unique
  sampleType      SampleType
  containerType   String?
  volume          String?
  bodySource      String?      // Site of collection
  collectedBy     String?
  collectedAt     DateTime?
  receivedAt      DateTime?
  status          SampleStatus @default(pending)
  priority        OrderPriority @default(routine)
  rejectionReason String?
  condition       String?      // hemolyzed, lipemic, clotted, etc.
  tests           LabTest[]
  location        String?      // Current storage location
  expiresAt       DateTime?
  notes           String?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  @@index([orderId])
  @@index([sampleNumber])
  @@index([status])
  @@index([sampleType])
}

enum SampleType {
  blood_serum
  blood_plasma
  whole_blood
  urine
  stool
  sputum
  csf
  tissue
  swab
  other
}

enum SampleStatus {
  pending
  collected
  received
  processing
  completed
  rejected
  disposed
}

model TestCatalog {
  id              String         @id @default(uuid())
  code            String         @unique
  name            String
  category        TestCategory
  loincCode       String?
  description     String?
  methodology     String?
  preparation     String?        // Patient preparation instructions
  sampleType      SampleType
  containerType   String?
  minVolume       String?
  turnaroundTime  String?        // e.g., "24-48 hours"
  price           Decimal        @db.Decimal(10, 2)
  currency        String         @default("USD")
  components      TestComponent[]
  referenceRanges ReferenceRange[]
  orderItems      LabOrderItem[]
  isActive        Boolean        @default(true)
  requiresFasting Boolean        @default(false)
  requiresConsent Boolean        @default(false)
  ageRestriction  String?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  @@index([code])
  @@index([category])
  @@index([isActive])
  @@index([loincCode])
}

model TestComponent {
  id              String       @id @default(uuid())
  testCatalogId   String
  testCatalog     TestCatalog  @relation(fields: [testCatalogId], references: [id], onDelete: Cascade)
  code            String
  name            String
  loincCode       String?
  unit            String?
  dataType        String       @default("numeric") // numeric, text, coded
  defaultValue    String?
  sortOrder       Int          @default(0)
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  @@index([testCatalogId])
  @@index([code])
}

model ReferenceRange {
  id              String       @id @default(uuid())
  testCatalogId   String
  testCatalog     TestCatalog  @relation(fields: [testCatalogId], references: [id], onDelete: Cascade)
  componentCode   String?
  componentName   String
  lowValue        Decimal?     @db.Decimal(15, 4)
  highValue       Decimal?     @db.Decimal(15, 4)
  textValue       String?
  unit            String?
  criticalLow     Decimal?     @db.Decimal(15, 4)
  criticalHigh    Decimal?     @db.Decimal(15, 4)
  ageMin          Int?         // Age in years
  ageMax          Int?
  gender          String?      // M, F, or null for both
  condition       String?      // pregnancy, etc.
  interpretation  String?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  @@index([testCatalogId])
  @@index([componentCode])
}

model CriticalValueAlert {
  id              String       @id @default(uuid())
  resultId        String
  patientId       String
  providerId      String
  testName        String
  componentName   String
  value           String
  referenceRange  String?
  alertedAt       DateTime     @default(now())
  acknowledgedAt  DateTime?
  acknowledgedBy  String?
  notificationSent Boolean     @default(false)
  escalated       Boolean      @default(false)
  notes           String?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  @@index([patientId])
  @@index([providerId])
  @@index([acknowledgedAt])
  @@index([alertedAt])
}
```

## Migration Steps

1. **Backup your current database**
   ```bash
   pg_dump your_database > backup.sql
   ```

2. **Update the schema file**
   - Replace `prisma/schema.prisma` with the above content

3. **Generate migration**
   ```bash
   npm run db:migrate
   ```
   - Name the migration: `add_complete_lis_models`

4. **Update service code**
   - Remove placeholder comments in:
     - `src/services/SampleTrackingService.ts`
     - `src/services/AlertService.ts`
     - `src/services/TestCatalogService.ts`
   - Uncomment the actual Prisma operations

5. **Regenerate Prisma Client**
   ```bash
   npm run db:generate
   ```

6. **Test the service**
   ```bash
   npm run dev
   ```

## Breaking Changes

- The old `DiagnosticTest` model is replaced by `TestCatalog`
- You may need to migrate existing data from `DiagnosticTest` to `TestCatalog`

## Data Migration (if needed)

If you have existing data in `DiagnosticTest`:

```sql
-- Migrate DiagnosticTest to TestCatalog
INSERT INTO "TestCatalog" (
  id, code, name, category, description, preparation,
  "sampleType", "turnaroundTime", price, currency, "isActive",
  "createdAt", "updatedAt"
)
SELECT
  id, code, name, category, description, preparation,
  COALESCE("sampleType", 'other')::text::"SampleType",
  "turnaroundTime", price, currency, "isActive",
  "createdAt", "updatedAt"
FROM "DiagnosticTest";

-- You can then drop DiagnosticTest if no longer needed
-- DROP TABLE "DiagnosticTest";
```

## Notes

- The schema includes comprehensive indexes for performance
- All timestamps are managed automatically
- UUID primary keys are used throughout
- Proper foreign key relationships with cascade deletes
- Enums for type safety
- Support for soft deletes (via isActive flags where applicable)

# FHIR-Aware UI Trust Model

**Version:** 1.0.0
**Last Updated:** 2026-01-08
**Scope:** Data Provenance, Freshness, and Trust Indicators
**Compliance:** FHIR R4, HL7 v2.x, HIPAA, 21st Century Cures Act

---

## Executive Summary

This document defines how The Unified Health platform visually represents data trustworthiness, provenance, and freshness in the user interface. Healthcare data comes from multiple sources with varying levels of verification; the UI must clearly communicate this without overwhelming users.

**Core Principle:** No authority collapse. Users must always understand where data came from and how trustworthy it is.

---

## 1. Trust Model Architecture

### 1.1 Data Trust Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRUST LEVEL HIERARCHY                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  VERIFIED (Highest Trust)                                        │
│  └── EHR System Data                                             │
│  └── Lab Results (direct integration)                            │
│  └── Imaging Reports (PACS integration)                          │
│  └── Provider-entered data                                       │
│                                                                  │
│  AUTHENTICATED                                                   │
│  └── Patient-reported with identity verification                 │
│  └── Connected device data (FDA-cleared)                         │
│  └── Pharmacy data (direct integration)                          │
│                                                                  │
│  IMPORTED                                                        │
│  └── FHIR bulk data from external sources                        │
│  └── C-CDA document imports                                      │
│  └── Claims data                                                 │
│                                                                  │
│  PATIENT-REPORTED (Requires Verification)                        │
│  └── Self-entered health data                                    │
│  └── Consumer device data                                        │
│  └── Questionnaire responses                                     │
│                                                                  │
│  UNVERIFIED (Lowest Trust)                                       │
│  └── Free-text entries                                           │
│  └── Historical data without provenance                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Trust Level Definitions

| Trust Level | Color | Icon | Description |
|-------------|-------|------|-------------|
| Verified | `#22c55e` (Green) | Shield Check | Data from verified, integrated clinical systems |
| Authenticated | `#3b82f6` (Blue) | Check Circle | Data from authenticated sources with identity verification |
| Imported | `#8b5cf6` (Purple) | Link | Data imported from external FHIR/HL7 sources |
| Patient-Reported | `#f59e0b` (Amber) | User | Self-reported data requiring clinical review |
| Unverified | `#6b7280` (Gray) | Question Mark | Data without clear provenance |

---

## 2. Visual Indicator Specifications

### 2.1 Data Provenance Badges

**Badge Component Structure:**

```tsx
interface ProvenanceBadge {
  source: DataSource;
  timestamp: ISO8601DateTime;
  trustLevel: TrustLevel;
  verificationStatus?: 'verified' | 'pending' | 'failed';
}

// Visual rendering
<Badge
  variant={trustLevel}
  icon={getTrustIcon(trustLevel)}
  tooltip={getProvenanceTooltip(source, timestamp)}
>
  {getSourceLabel(source)}
</Badge>
```

**Badge Styles:**

```css
/* Verified - EHR/Lab Data */
.badge-verified {
  background: var(--uh-success-light);
  color: var(--uh-success-text);
  border: 1px solid var(--uh-success-base);
}

/* Authenticated - Provider/Pharmacy */
.badge-authenticated {
  background: var(--uh-info-light);
  color: var(--uh-info-text);
  border: 1px solid var(--uh-info-base);
}

/* Imported - External FHIR */
.badge-imported {
  background: #f3e8ff;
  color: #6b21a8;
  border: 1px solid #a855f7;
}

/* Patient-Reported */
.badge-patient-reported {
  background: var(--uh-warning-light);
  color: var(--uh-warning-text);
  border: 1px solid var(--uh-warning-base);
}

/* Unverified */
.badge-unverified {
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #9ca3af;
}
```

### 2.2 Freshness Indicators

**Freshness Calculation:**

```typescript
type FreshnessLevel = 'current' | 'recent' | 'stale' | 'historical';

function calculateFreshness(
  timestamp: Date,
  dataType: ClinicalDataType
): FreshnessLevel {
  const ageMs = Date.now() - timestamp.getTime();
  const thresholds = getFreshnessThresholds(dataType);

  if (ageMs <= thresholds.current) return 'current';
  if (ageMs <= thresholds.recent) return 'recent';
  if (ageMs <= thresholds.stale) return 'stale';
  return 'historical';
}
```

**Freshness Thresholds by Data Type:**

| Data Type | Current | Recent | Stale | Historical |
|-----------|---------|--------|-------|------------|
| Vital Signs | < 1 hour | 1-24 hours | 1-7 days | > 7 days |
| Lab Results | < 24 hours | 1-7 days | 7-30 days | > 30 days |
| Medications | < 24 hours | 1-7 days | 7-30 days | > 30 days |
| Allergies | < 7 days | 7-30 days | 30-90 days | > 90 days |
| Immunizations | < 30 days | 30-180 days | 180-365 days | > 365 days |
| Diagnoses | < 7 days | 7-30 days | 30-90 days | > 90 days |

**Freshness Visual Treatment:**

```css
/* Current - No special treatment */
.freshness-current {
  /* Default styling */
}

/* Recent - Subtle indicator */
.freshness-recent {
  /* Standard text color */
}

/* Stale - Warning indicator */
.freshness-stale {
  position: relative;
}
.freshness-stale::after {
  content: '';
  position: absolute;
  right: -4px;
  top: -4px;
  width: 8px;
  height: 8px;
  background: var(--uh-warning-base);
  border-radius: 50%;
}

/* Historical - Muted treatment */
.freshness-historical {
  opacity: 0.7;
  font-style: italic;
}
```

### 2.3 Sync State Indicators

**Sync States:**

| State | Icon | Color | Description |
|-------|------|-------|-------------|
| Synced | Cloud Check | Green | Data synchronized with source |
| Syncing | Refresh (animated) | Blue | Active synchronization |
| Pending | Clock | Amber | Changes queued for sync |
| Conflict | Alert Triangle | Red | Sync conflict requiring resolution |
| Offline | Cloud Off | Gray | Unable to sync |

**Sync Indicator Component:**

```tsx
<SyncIndicator
  state="synced"
  lastSync={new Date('2026-01-08T15:42:00Z')}
  source="Epic MyChart"
/>

// Renders:
// ✓ Synced with Epic MyChart · 5 minutes ago
```

---

## 3. Source-Specific Indicators

### 3.1 FHIR Resource Attribution

Each FHIR resource displayed in the UI must show:

1. **Source System** - Where the data originated
2. **Last Updated** - When the data was last modified
3. **Author** - Who created/modified the data (if available)

```tsx
interface FHIRResourceAttribution {
  resourceType: string;
  id: string;
  meta: {
    source?: string;        // e.g., "urn:uuid:hospital-epic-system"
    lastUpdated: string;    // ISO 8601
    versionId?: string;
  };
  contained?: Resource[];
}

// UI Display
<ResourceCard resource={observation}>
  <AttributionFooter>
    <SourceBadge source={observation.meta.source} />
    <Timestamp value={observation.meta.lastUpdated} format="relative" />
    {observation.performer && (
      <Author performer={observation.performer} />
    )}
  </AttributionFooter>
</ResourceCard>
```

### 3.2 Common Data Sources

| Source Type | Display Label | Icon | Trust Level |
|-------------|---------------|------|-------------|
| Epic | Epic MyChart | Epic logo | Verified |
| Cerner | Cerner Portal | Cerner logo | Verified |
| Quest | Quest Diagnostics | Lab flask | Verified |
| Labcorp | Labcorp | Lab flask | Verified |
| CVS | CVS Pharmacy | Pharmacy icon | Authenticated |
| Walgreens | Walgreens | Pharmacy icon | Authenticated |
| Apple Health | Apple Health | Apple icon | Patient-Reported |
| Fitbit | Fitbit | Activity icon | Patient-Reported |
| Manual Entry | Self-Reported | Pencil icon | Patient-Reported |

---

## 4. Service-to-UI Responsibility Matrix

### 4.1 Data Flow Responsibilities

| Responsibility | Service Layer | API Gateway | Frontend |
|----------------|---------------|-------------|----------|
| Data Provenance | ✓ Capture & store | ✓ Pass through | ✓ Display |
| Timestamp | ✓ Generate | ✓ Validate | ✓ Format & display |
| Source Attribution | ✓ Record | ✓ Include in response | ✓ Render badge |
| Trust Level | ✓ Calculate | ✓ Include in response | ✓ Apply visual treatment |
| Freshness | ✓ Not responsible | ✓ Not responsible | ✓ Calculate & display |
| Sync State | ✓ Track | ✓ Include in response | ✓ Display indicator |
| Conflict Detection | ✓ Detect | ✓ Report | ✓ Prompt resolution |

### 4.2 Required API Response Fields

Every clinical data response MUST include:

```typescript
interface ClinicalDataResponse<T> {
  data: T;
  meta: {
    source: {
      system: string;      // Source system identifier
      name: string;        // Human-readable name
      type: SourceType;    // 'ehr' | 'lab' | 'pharmacy' | 'patient' | 'external'
    };
    provenance: {
      recorded: ISO8601DateTime;
      author?: {
        name: string;
        role: string;
        organization?: string;
      };
    };
    trustLevel: TrustLevel;
    lastSync?: ISO8601DateTime;
    syncStatus: SyncStatus;
  };
}
```

### 4.3 Frontend Display Requirements

| Data Type | Required Indicators |
|-----------|-------------------|
| Lab Results | Source + Timestamp + Trust Badge |
| Medications | Source + Prescriber + Status |
| Vital Signs | Source + Timestamp + Device (if applicable) |
| Allergies | Source + Reported Date + Verification Status |
| Diagnoses | Source + Provider + Onset Date |
| Immunizations | Source + Administered By + Date |
| Documents | Source + Author + Date + Document Type |

---

## 5. User Interface Patterns

### 5.1 Clinical Data Card

```
┌─────────────────────────────────────────────────────────────────┐
│ Blood Pressure                              [Stale] [Synced ✓] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Systolic: 120 mmHg                                             │
│   Diastolic: 80 mmHg                                             │
│   Pulse: 72 bpm                                                  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ [Epic MyChart] Recorded by Dr. Smith · January 5, 2026          │
│ 3 days ago                                                       │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Medication List Item

```
┌─────────────────────────────────────────────────────────────────┐
│ [✓] Lisinopril 10mg                                [CVS]       │
│     Take 1 tablet by mouth daily                                │
│     Prescribed by Dr. Johnson · Last filled Dec 15, 2025       │
│     [Active] [Verified]                                         │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Patient-Reported Data Callout

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚠ Patient-Reported Information                                  │
├─────────────────────────────────────────────────────────────────┤
│ The following data was entered by the patient and has not       │
│ been verified by a healthcare provider.                         │
│                                                                  │
│ • Blood Glucose: 145 mg/dL (January 8, 2026 at 8:30 AM)        │
│ • Weight: 185 lbs (January 7, 2026)                             │
│                                                                  │
│ [Mark as Reviewed]                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Conflict Resolution UI

### 6.1 Data Conflict Display

When conflicting data exists from multiple sources:

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚠ Conflicting Information Detected                              │
├─────────────────────────────────────────────────────────────────┤
│ Different values found for: Allergies                           │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [Epic] Penicillin - Severe (Anaphylaxis)                    │ │
│ │ Last updated: January 3, 2026 by Dr. Williams               │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [Patient Portal] Penicillin - Moderate (Rash)               │ │
│ │ Last updated: January 5, 2026 by Patient                    │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ Clinical guidance: When severity differs, use most severe       │
│ reaction documented.                                             │
│                                                                  │
│ [Keep Epic Record] [Keep Both] [Request Provider Review]        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Implementation Checklist

### 7.1 Required Components

- [ ] `<ProvenanceBadge />` - Source attribution display
- [ ] `<FreshnessIndicator />` - Data age indicator
- [ ] `<SyncStatus />` - Synchronization state
- [ ] `<TrustLevelBadge />` - Trust level visualization
- [ ] `<ConflictResolution />` - Data conflict UI
- [ ] `<SourceAttribution />` - Detailed source information
- [ ] `<DataTimestamp />` - Formatted timestamp with relative time

### 7.2 Required API Changes

- [ ] All clinical endpoints include `meta.source`
- [ ] All clinical endpoints include `meta.provenance`
- [ ] All clinical endpoints include `meta.trustLevel`
- [ ] Sync status available for connected sources
- [ ] Conflict detection enabled for multi-source data

### 7.3 Testing Requirements

- [ ] Visual regression tests for all trust indicators
- [ ] Accessibility tests for color + icon combinations
- [ ] E2E tests for conflict resolution flows
- [ ] Unit tests for freshness calculation
- [ ] Integration tests for provenance propagation

---

## 8. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-08 | Initial release |

---

**Document Owner:** Platform Architecture Team
**Clinical Review:** Chief Medical Informatics Officer
**Next Review:** 2026-04-08

---

*This document is part of The Unified Health Platform Architecture Documentation.*

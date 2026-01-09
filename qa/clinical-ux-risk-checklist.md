# Clinical UX Risk & Safety Checklist

**Version:** 1.0.0
**Last Updated:** 2026-01-08
**Classification:** Required for Production Release
**Compliance:** FDA Human Factors Guidance, IEC 62366-1, HIPAA

---

## Overview

This checklist ensures all user interfaces on The Unified Health platform meet clinical safety requirements. Every feature touching clinical data, patient interactions, or healthcare workflows MUST pass these checks before production deployment.

**Failure to pass any CRITICAL item blocks release.**

---

## 1. Role & Access Clarity

### 1.1 User Role Identification [CRITICAL]

| Check | Pass | Fail | N/A |
|-------|------|------|-----|
| Current user role is clearly displayed | □ | □ | □ |
| Role-specific UI elements are visually distinct | □ | □ | □ |
| No patient data visible without proper authentication | □ | □ | □ |
| Role switching requires explicit confirmation | □ | □ | □ |
| "Acting on behalf of" clearly indicated if applicable | □ | □ | □ |

**Validation Rules:**
```
ASSERT: User role displayed within 100px of primary navigation
ASSERT: Role badge visible on every screen with clinical data
ASSERT: Session timeout <= 15 minutes for clinical sessions
```

### 1.2 Patient Context Clarity [CRITICAL]

| Check | Pass | Fail | N/A |
|-------|------|------|-----|
| Active patient clearly identified by name and DOB | □ | □ | □ |
| Patient context persists across screen navigation | □ | □ | □ |
| Patient photo displayed (if available) for verification | □ | □ | □ |
| Warning displayed when switching between patients | □ | □ | □ |
| No patient data displayed without explicit selection | □ | □ | □ |

**Validation Rules:**
```
ASSERT: Patient identifier includes minimum 2 data points (name + DOB)
ASSERT: Patient context banner visible on all clinical screens
ASSERT: Context switch triggers confirmation modal
```

---

## 2. Data Provenance & Trust

### 2.1 Source Attribution [CRITICAL]

| Check | Pass | Fail | N/A |
|-------|------|------|-----|
| All clinical data shows source system | □ | □ | □ |
| Data timestamp is visible and accurate | □ | □ | □ |
| External data marked distinctly | □ | □ | □ |
| Patient-reported data clearly labeled | □ | □ | □ |
| AI-generated content has mandatory disclosure | □ | □ | □ |

**Validation Rules:**
```
ASSERT: Every clinical data point has source metadata
ASSERT: Timestamps include timezone
ASSERT: AI content includes "AI-assisted" badge + date
```

### 2.2 Data Freshness Indicators [REQUIRED]

| Check | Pass | Fail | N/A |
|-------|------|------|-----|
| Last sync time displayed for real-time data | □ | □ | □ |
| Stale data (>24h) shows visual warning | □ | □ | □ |
| "Last updated" timestamp on all clinical summaries | □ | □ | □ |
| Cache age visible where relevant | □ | □ | □ |

**Freshness Thresholds:**
| Data Type | Fresh | Warning | Stale |
|-----------|-------|---------|-------|
| Vitals | <1h | 1-24h | >24h |
| Lab Results | <24h | 1-7d | >7d |
| Medications | <24h | 1-7d | >7d |
| Allergies | <7d | 7-30d | >30d |

---

## 3. Error Prevention & Recovery

### 3.1 Destructive Action Protection [CRITICAL]

| Check | Pass | Fail | N/A |
|-------|------|------|-----|
| Delete actions require confirmation | □ | □ | □ |
| Confirmation includes specific item name | □ | □ | □ |
| "Undo" available within 30 seconds where possible | □ | □ | □ |
| Cancel orders/referrals requires reason | □ | □ | □ |
| No single-click destructive actions | □ | □ | □ |

**Validation Rules:**
```
ASSERT: DELETE/CANCEL actions require 2-step confirmation
ASSERT: Confirmation dialog repeats action in plain language
ASSERT: Destructive buttons use error color (red)
ASSERT: Destructive buttons never placed in "confirm" position
```

### 3.2 Input Validation [CRITICAL]

| Check | Pass | Fail | N/A |
|-------|------|------|-----|
| Clinical values have reasonable range validation | □ | □ | □ |
| Out-of-range values trigger warning (not blocking) | □ | □ | □ |
| Date validation prevents future dates where inappropriate | □ | □ | □ |
| Unit conversion clearly displayed | □ | □ | □ |
| Required fields clearly marked before submission | □ | □ | □ |

**Clinical Range Examples:**
```
Heart Rate: 30-250 bpm (warning outside 50-120)
Blood Pressure Systolic: 60-300 mmHg
Blood Glucose: 20-600 mg/dL
Temperature: 90-110°F / 32-43°C
Weight: 0.5-1500 lbs / 0.2-700 kg
```

### 3.3 Safe Error Recovery [REQUIRED]

| Check | Pass | Fail | N/A |
|-------|------|------|-----|
| Form data preserved on error | □ | □ | □ |
| Error messages are specific and actionable | □ | □ | □ |
| Network errors do not lose unsaved clinical notes | □ | □ | □ |
| Session timeout saves draft when possible | □ | □ | □ |
| Retry mechanisms available for failed submissions | □ | □ | □ |

---

## 4. Clinical Communication Safety

### 4.1 Message Clarity [CRITICAL]

| Check | Pass | Fail | N/A |
|-------|------|------|-----|
| Clinical messages include sender identification | □ | □ | □ |
| Timestamps on all messages | □ | □ | □ |
| Read receipts available for critical messages | □ | □ | □ |
| Urgent messages visually distinct | □ | □ | □ |
| No message truncation hiding critical content | □ | □ | □ |

**Validation Rules:**
```
ASSERT: Message sender includes name + role + organization
ASSERT: Timestamp format: "January 8, 2026 at 3:42 PM EST"
ASSERT: Urgent badge visible without scrolling
ASSERT: Full message content accessible without truncation
```

### 4.2 Notification Safety [REQUIRED]

| Check | Pass | Fail | N/A |
|-------|------|------|-----|
| Critical notifications cannot be dismissed without action | □ | □ | □ |
| Notification priority reflected in visual treatment | □ | □ | □ |
| Expired/resolved notifications clearly marked | □ | □ | □ |
| No false urgency in non-critical notifications | □ | □ | □ |
| Notification preferences clearly explained | □ | □ | □ |

---

## 5. Clinical Workflow Safety

### 5.1 Order Entry [CRITICAL]

| Check | Pass | Fail | N/A |
|-------|------|------|-----|
| Drug-drug interaction warnings displayed | □ | □ | □ |
| Allergy alerts prominently displayed | □ | □ | □ |
| Dosing guidance visible during order entry | □ | □ | □ |
| Order review screen before submission | □ | □ | □ |
| Verbal orders require attestation | □ | □ | □ |

**Validation Rules:**
```
ASSERT: Allergy banner visible during medication ordering
ASSERT: High-risk medications require explicit acknowledgment
ASSERT: Order confirmation shows full order details
ASSERT: "Sign" action requires authentication
```

### 5.2 Result Review [CRITICAL]

| Check | Pass | Fail | N/A |
|-------|------|------|-----|
| Abnormal results highlighted | □ | □ | □ |
| Critical results require acknowledgment | □ | □ | □ |
| Reference ranges displayed with results | □ | □ | □ |
| Trending data available for comparison | □ | □ | □ |
| Result acknowledgment logged with timestamp | □ | □ | □ |

---

## 6. Accessibility Safety

### 6.1 WCAG Compliance [REQUIRED]

| Check | Pass | Fail | N/A |
|-------|------|------|-----|
| Color contrast ratio >= 4.5:1 for normal text | □ | □ | □ |
| Color contrast ratio >= 3:1 for large text | □ | □ | □ |
| No information conveyed by color alone | □ | □ | □ |
| Focus indicators visible on all interactive elements | □ | □ | □ |
| Screen reader announces clinical alerts | □ | □ | □ |

**Validation Rules:**
```
ASSERT: All text meets WCAG AA contrast requirements
ASSERT: Status indicators use color + icon + text
ASSERT: Keyboard navigation covers all functionality
ASSERT: aria-live regions for dynamic clinical updates
```

### 6.2 Motor Accessibility [REQUIRED]

| Check | Pass | Fail | N/A |
|-------|------|------|-----|
| Touch targets >= 44x44px | □ | □ | □ |
| Adequate spacing between interactive elements | □ | □ | □ |
| No time limits on critical clinical tasks | □ | □ | □ |
| Drag-and-drop has keyboard alternative | □ | □ | □ |

---

## 7. Emergency & Edge Cases

### 7.1 Emergency Access [CRITICAL]

| Check | Pass | Fail | N/A |
|-------|------|------|-----|
| Emergency access ("break the glass") available | □ | □ | □ |
| Emergency access fully audited | □ | □ | □ |
| Emergency contact information accessible | □ | □ | □ |
| System downtime shows emergency alternatives | □ | □ | □ |

### 7.2 Offline Behavior [REQUIRED]

| Check | Pass | Fail | N/A |
|-------|------|------|-----|
| Offline state clearly indicated | □ | □ | □ |
| No silent data loss during connectivity issues | □ | □ | □ |
| Queued actions visible and manageable | □ | □ | □ |
| Reconnection attempts transparent to user | □ | □ | □ |

---

## 8. AI & Automation Safety

### 8.1 AI-Assisted Features [CRITICAL]

| Check | Pass | Fail | N/A |
|-------|------|------|-----|
| AI-generated content clearly labeled | □ | □ | □ |
| Confidence levels displayed where applicable | □ | □ | □ |
| Human review required for clinical decisions | □ | □ | □ |
| AI limitations disclosed | □ | □ | □ |
| Override mechanism available | □ | □ | □ |

**Validation Rules:**
```
ASSERT: AI badge present on all AI-generated content
ASSERT: "This is not medical advice" disclaimer on AI summaries
ASSERT: Provider approval required for AI-suggested actions
```

### 8.2 Automation Guardrails [REQUIRED]

| Check | Pass | Fail | N/A |
|-------|------|------|-----|
| Automated actions logged with full context | □ | □ | □ |
| User can review automated changes | □ | □ | □ |
| Automation failures clearly reported | □ | □ | □ |
| No automated clinical decisions without oversight | □ | □ | □ |

---

## 9. Audit & Compliance

### 9.1 Audit Trail [CRITICAL]

| Check | Pass | Fail | N/A |
|-------|------|------|-----|
| All clinical data access logged | □ | □ | □ |
| All modifications logged with before/after | □ | □ | □ |
| Audit logs immutable | □ | □ | □ |
| User can view their own activity log | □ | □ | □ |

### 9.2 Regulatory Compliance [CRITICAL]

| Check | Pass | Fail | N/A |
|-------|------|------|-----|
| PHI handling follows minimum necessary principle | □ | □ | □ |
| Consent captured before data sharing | □ | □ | □ |
| Data retention policies enforced | □ | □ | □ |
| Export includes complete audit history | □ | □ | □ |

---

## 10. Sign-Off Requirements

### Pre-Production Checklist

| Requirement | Completed | Date | Reviewer |
|-------------|-----------|------|----------|
| All CRITICAL items passed | □ | ___/___/___ | _________ |
| All REQUIRED items passed | □ | ___/___/___ | _________ |
| Clinical review completed | □ | ___/___/___ | _________ |
| Security review completed | □ | ___/___/___ | _________ |
| Accessibility audit passed | □ | ___/___/___ | _________ |

### Approval Signatures

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | ____________ | ____________ | ___/___/___ |
| Clinical Lead | ____________ | ____________ | ___/___/___ |
| Engineering Lead | ____________ | ____________ | ___/___/___ |
| QA Lead | ____________ | ____________ | ___/___/___ |

---

## Automated Assertion Rules

The following assertions are enforced in CI/CD:

```javascript
// clinical-safety-assertions.js

module.exports = {
  rules: [
    {
      id: 'patient-context-visible',
      severity: 'critical',
      assertion: 'Patient identifier visible on clinical screens',
      selector: '[data-testid="patient-context"]',
      condition: 'exists && visible'
    },
    {
      id: 'clinical-timestamp-present',
      severity: 'critical',
      assertion: 'Clinical data includes timestamp',
      selector: '[data-clinical-value]',
      condition: 'hasAttribute("data-timestamp")'
    },
    {
      id: 'destructive-action-confirmation',
      severity: 'critical',
      assertion: 'Destructive actions require confirmation',
      selector: '[data-action="delete"], [data-action="cancel"]',
      condition: 'triggersConfirmation()'
    },
    {
      id: 'ai-content-labeled',
      severity: 'critical',
      assertion: 'AI-generated content is labeled',
      selector: '[data-source="ai"]',
      condition: 'hasVisibleLabel("AI-assisted")'
    },
    {
      id: 'contrast-ratio-minimum',
      severity: 'required',
      assertion: 'Text contrast ratio meets WCAG AA',
      selector: 'body *',
      condition: 'contrastRatio >= 4.5'
    },
    {
      id: 'touch-target-size',
      severity: 'required',
      assertion: 'Interactive elements meet touch target size',
      selector: 'button, a, input, [role="button"]',
      condition: 'width >= 44 && height >= 44'
    }
  ],

  failBuildOn: ['critical'],
  warnOn: ['required']
};
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-08 | Initial release |

---

**Document Owner:** Quality Assurance Team
**Clinical Review:** Chief Medical Officer
**Last Audit:** 2026-01-08
**Next Review:** 2026-04-08

---

*This checklist is mandatory for all production releases on The Unified Health platform.*

# UX Language Standards - The Unified Health

**Version:** 1.0.0
**Last Updated:** 2026-01-08
**Compliance:** HIPAA-Aligned, FDA 21 CFR Part 11 Considerations
**Accessibility:** WCAG 2.1 AA+

---

## Executive Summary

This document establishes healthcare-grade UX writing standards for The Unified Health platform. All user-facing copy must prioritize clinical safety, regulatory compliance, and patient trust. These standards are mandatory across all patient, provider, admin, and communication surfaces.

---

## 1. Core Principles

### 1.1 Trust-First Language

Every word must reinforce trust. Healthcare decisions are high-stakes; language must be:

- **Clear**: No ambiguity in meaning
- **Accurate**: Factually correct and clinically precise
- **Honest**: No exaggeration or manipulation
- **Supportive**: Empathetic without being patronizing

### 1.2 Reading Level Guidelines

| Audience | Reading Level | Examples |
|----------|---------------|----------|
| Patients | 6th-8th grade | Plain language, common words |
| Caregivers | 8th-10th grade | Some medical terms with explanations |
| Providers | Professional | Standard medical terminology |
| Administrators | Business | Technical accuracy, regulatory language |

### 1.3 Voice & Tone

**Brand Voice Attributes:**
- Clinical (precise, evidence-based)
- Calm (reassuring, not alarmist)
- Human (empathetic, not cold)
- Clear (simple, not condescending)

**Tone Adjustments by Context:**

| Context | Tone | Example |
|---------|------|---------|
| Success states | Warm, affirming | "Your appointment is confirmed for..." |
| Error states | Helpful, calm | "We couldn't process that. Here's what to try..." |
| Clinical alerts | Clear, direct | "Action needed: Review your medication list" |
| Critical warnings | Urgent, precise | "Contact your provider immediately if..." |

---

## 2. HIPAA-Aligned Writing Rules

### 2.1 Prohibited Language Patterns

**NEVER use:**

| Prohibited | Reason | Use Instead |
|------------|--------|-------------|
| "Your diagnosis is..." | Implied clinical judgment | "Your provider noted..." |
| "You have [condition]" | Platform cannot diagnose | "Your records indicate..." |
| "This will cure/fix..." | No treatment guarantees | "This may help with..." |
| "100% secure" | No absolute security claims | "We protect your data with..." |
| "Guaranteed results" | Clinical outcomes vary | "Based on clinical evidence..." |
| "Best/Only treatment" | Limits informed consent | "One option your provider may discuss..." |
| "Nothing to worry about" | Minimizes patient concerns | "Your provider can answer questions about..." |

### 2.2 Required Language Patterns

**ALWAYS include:**

| Requirement | Example |
|-------------|---------|
| Consent clarity | "By continuing, you agree to..." |
| Reversibility | "You can change this anytime in Settings" |
| Data handling | "This information will be shared with..." |
| Timestamps | "Last updated: January 8, 2026 at 3:42 PM EST" |
| Source attribution | "From: Dr. Smith's office on 01/05/2026" |

### 2.3 Conditional/Qualified Statements

When presenting health information:

```
WRONG: "Your blood pressure is normal."
RIGHT: "Your blood pressure reading of 120/80 mmHg was recorded on [date]. Discuss the meaning of this result with your provider."

WRONG: "You should take this medication."
RIGHT: "Your provider prescribed [medication]. Follow the instructions provided with your prescription."

WRONG: "This symptom means..."
RIGHT: "Contact your healthcare provider if you experience [symptom]."
```

---

## 3. Consent Language Templates

### 3.1 Data Sharing Consent

```
Standard Template:
"By enabling [feature], you authorize The Unified Health to share [specific data types] with [specific parties] for [specific purpose]. You can revoke this authorization at any time in your Privacy Settings. This does not affect data already shared."
```

### 3.2 Treatment Consent (Provider-Initiated)

```
Standard Template:
"Your provider at [organization] has requested your authorization to [action]. By providing your electronic signature below, you confirm:
• You understand the purpose of this [treatment/procedure]
• You have had the opportunity to ask questions
• You voluntarily consent to proceed

You may withdraw consent at any time before the [treatment/procedure] begins."
```

### 3.3 Communication Preferences

```
Standard Template:
"Choose how you'd like to receive [type] notifications:

□ Email to [masked email]
□ Text message to [masked phone]
□ Push notification on this device
□ Secure message in your account

You can update these preferences anytime. Standard message and data rates may apply for text messages."
```

---

## 4. Error & Empty State Language

### 4.1 Error Message Structure

Every error message must include:
1. **What happened** (factual, brief)
2. **Why it matters** (if not obvious)
3. **What to do next** (actionable)

```
Structure: [What happened]. [What to do next].

WRONG: "Error 500: Internal Server Error"
RIGHT: "We couldn't complete your request. Please try again in a few minutes. If this continues, contact support."

WRONG: "Invalid input"
RIGHT: "Please enter a valid date in MM/DD/YYYY format."

WRONG: "Session expired"
RIGHT: "Your session ended for your security. Sign in again to continue."
```

### 4.2 Empty State Language

Provide context and a clear next action:

```
No appointments:
"You don't have any upcoming appointments. Schedule a visit to get started."

No messages:
"No messages yet. Your care team will reach out here when needed."

No medications:
"No medications on file. Your provider can add prescriptions during your next visit."

No search results:
"No results for '[query]'. Try different search terms or browse by category."
```

### 4.3 Downtime & Maintenance

```
Planned Maintenance:
"We're improving The Unified Health for you. We'll be back at [time] [timezone]. Your data is safe and secure."

Unplanned Outage:
"Some features are temporarily unavailable. We're working to restore full service. For urgent medical needs, contact your provider directly or call 911."
```

---

## 5. Clinical Safety Language

### 5.1 Emergency Disclaimers

Required on all symptom-related or health content pages:

```
Standard Emergency Disclaimer:
"If you're experiencing a medical emergency, call 911 or go to your nearest emergency room immediately. This platform is not a substitute for emergency medical care."
```

### 5.2 AI-Generated Content Framing

When AI assists in generating clinical insights:

```
Required Framing:
"AI-Assisted Insight: This summary was generated to help you understand your health information. It is not medical advice. Discuss any questions with your healthcare provider."

Required Attribution:
"Generated by [AI system name] on [date]. Based on [data sources]. Reviewed by: [if applicable]"
```

### 5.3 Clinical Data Provenance

Always indicate source and freshness:

```
Lab Result:
"Result: 120 mg/dL
Source: LabCorp
Collected: January 5, 2026
Received: January 6, 2026"

Vital Signs:
"Blood Pressure: 118/76 mmHg
Recorded by: You (home measurement)
Date: January 8, 2026 at 8:30 AM"
```

---

## 6. Approved & Prohibited Phrase Lists

### 6.1 Approved Phrases

| Category | Approved Phrases |
|----------|------------------|
| Welcome | "Welcome back", "Good to see you", "Let's get started" |
| Success | "Done", "Saved", "Confirmed", "Sent", "Updated" |
| Actions | "Continue", "Submit", "Save", "Review", "Learn more" |
| Help | "Need help?", "Questions?", "Contact support", "Learn how" |
| Progress | "Step X of Y", "Almost there", "One more step" |
| Privacy | "Your data is protected", "Only you and your care team can see this" |

### 6.2 Prohibited Phrases

| Prohibited | Reason |
|------------|--------|
| "Just", "Simply", "Easy" | Minimizes difficulty, may frustrate users |
| "Obviously", "Clearly" | Condescending |
| "Please be patient" | Shifts burden to user |
| "Oops!" | Unprofessional in healthcare context |
| "Don't worry" | Dismisses valid concerns |
| "Trust us" | Undermines credibility |
| "Never", "Always", "Guarantee" | Absolute claims |
| "Treatment", "Diagnosis" (as platform actions) | Platform doesn't treat or diagnose |

---

## 7. Accessibility Language Requirements

### 7.1 Alt Text for Images

```
Clinical Images:
"[Chart/diagram] showing [what it displays]. [Key insight if critical]."

Icons:
"[Action] icon" or decorative images should have empty alt=""

Photos:
"Photo of [subject] in [context]"
```

### 7.2 Link Text

```
WRONG: "Click here", "Learn more", "Read more"
RIGHT: "View your lab results", "Read about blood pressure", "Download your health summary"
```

### 7.3 Form Labels

```
WRONG: "Email" (placeholder only)
RIGHT: "Email address" (visible label) with "yourname@example.com" (placeholder example)

Required Fields:
"Email address (required)" or use asterisk with legend explaining "*Required field"
```

---

## 8. Localization Considerations

### 8.1 Date & Time Formats

| Region | Date Format | Example |
|--------|-------------|---------|
| US | MM/DD/YYYY | 01/08/2026 |
| International | DD/MM/YYYY or YYYY-MM-DD | 08/01/2026 or 2026-01-08 |
| Display | Month DD, YYYY | January 8, 2026 |

Always include timezone for appointments and time-sensitive information.

### 8.2 Unit Formatting

| Measurement | US | Metric |
|-------------|-----|--------|
| Weight | lb | kg |
| Height | ft/in | cm |
| Temperature | °F | °C |
| Blood glucose | mg/dL | mmol/L |

Display user's preferred unit with option to see alternative.

---

## 9. Enforcement & Compliance

### 9.1 Review Requirements

- All new UX copy must be reviewed against this document
- Changes to clinical-facing language require clinical review
- Legal review required for consent and data handling language

### 9.2 CI/CD Enforcement

The following checks are enforced in the build pipeline:

1. Prohibited phrase detection
2. Reading level analysis (Flesch-Kincaid)
3. Accessibility attribute validation
4. Consent template compliance

### 9.3 Audit Trail

All copy changes in clinical contexts are logged with:
- Timestamp
- Author
- Previous version
- Approval chain

---

## 10. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-08 | Initial release |

---

**Document Owner:** UX Writing Team
**Clinical Review:** Chief Medical Officer
**Legal Review:** Compliance Department
**Next Review Date:** 2026-07-08

---

*This document is part of The Unified Health Brand System and is subject to the platform's governance policies.*

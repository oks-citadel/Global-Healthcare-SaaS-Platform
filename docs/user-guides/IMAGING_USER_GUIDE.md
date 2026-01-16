# Imaging Service User Guide

## Overview

The Imaging Service manages radiology orders, medical imaging studies, and diagnostic reports. This guide explains how patients and clinicians use the imaging features to order, view, and manage medical images including X-rays, CT scans, MRIs, and ultrasounds.

---

## Table of Contents

1. [For Patients](#for-patients)
   - [Understanding Imaging Orders](#understanding-imaging-orders)
   - [Preparing for Your Imaging Exam](#preparing-for-your-imaging-exam)
   - [Finding an Imaging Center](#finding-an-imaging-center)
   - [Viewing Your Images and Reports](#viewing-your-images-and-reports)
2. [For Clinicians](#for-clinicians)
   - [Ordering Imaging Studies](#ordering-imaging-studies)
   - [Viewing Imaging Results](#viewing-imaging-results)
   - [Reviewing Radiology Reports](#reviewing-radiology-reports)
   - [Managing Critical Findings](#managing-critical-findings)
3. [For Radiologists](#for-radiologists)
   - [Reading Studies](#reading-studies)
   - [Creating Reports](#creating-reports)
   - [Critical Findings Protocol](#critical-findings-protocol)
4. [Common Imaging Exams Reference](#common-imaging-exams-reference)
5. [Troubleshooting](#troubleshooting)

---

## For Patients

### Understanding Imaging Orders

#### Accessing Your Imaging Orders

1. Log in to your **Patient Portal**
2. Click **"Imaging"** in the main navigation
3. View your imaging dashboard

#### Dashboard Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    IMAGING                                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  PENDING EXAMS                                           │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │  📷 MRI Brain without Contrast                          │   │
│  │     Ordered: Jan 10, 2025 | Status: Needs Scheduling    │   │
│  │     [Schedule Exam] [View Preparation]                   │   │
│  │                                                          │   │
│  │  📷 CT Chest with Contrast                              │   │
│  │     Scheduled: Jan 15, 2025 @ 2:00 PM                   │   │
│  │     Location: Main Hospital Radiology                    │   │
│  │     [View Details] [Reschedule]                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  COMPLETED STUDIES                                       │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │  ✓ Chest X-ray - Jan 5, 2025           [View Images]    │   │
│  │  ✓ Ultrasound Abdomen - Dec 15, 2024   [View Images]    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [View All Studies] [Find Imaging Center] [Preparation Guides] │
└─────────────────────────────────────────────────────────────────┘
```

#### Order Status Explained

| Status               | Meaning                        |
| -------------------- | ------------------------------ |
| **Ordered**          | Provider has ordered the exam  |
| **Needs Scheduling** | Ready for you to schedule      |
| **Scheduled**        | Appointment confirmed          |
| **Checked In**       | You've arrived for exam        |
| **In Progress**      | Exam being performed           |
| **Completed**        | Exam finished, awaiting report |
| **Report Available** | Final report ready to view     |

---

### Preparing for Your Imaging Exam

#### Step 1: Check Preparation Requirements

1. Go to **"Imaging"** > **"Pending Exams"**
2. Click on your exam
3. Select **"View Preparation Instructions"**

#### Common Preparation by Exam Type

| Exam Type               | Preparation                                 |
| ----------------------- | ------------------------------------------- |
| **X-ray**               | Usually none; remove jewelry/metal          |
| **CT without Contrast** | Usually none                                |
| **CT with Contrast**    | Fast 4 hours; check kidney function         |
| **MRI**                 | Remove all metal; safety screening required |
| **Ultrasound Abdomen**  | Fast 8-12 hours                             |
| **Ultrasound Pelvic**   | Full bladder (drink 32 oz water)            |
| **Mammogram**           | No deodorant or powder                      |

#### Contrast Preparation

If your exam requires contrast:

1. **Before the Exam:**
   - Complete kidney function blood test
   - Fast for 4 hours before
   - Stay hydrated (water is okay)
   - Inform staff of any allergies

2. **Medications:**
   - Metformin: Stop day of exam, resume 48 hours after
   - Blood thinners: Follow specific instructions
   - Regular medications: Take as normal unless instructed

#### MRI Safety Screening

**You cannot have an MRI if you have:**

- Pacemaker (unless MRI-conditional)
- Cochlear implant
- Metal fragments in eyes
- Certain aneurysm clips

**Inform your technologist if you have:**

- Joint replacements
- Metal plates/screws
- Tattoos (some inks contain metal)
- IUD
- Dental implants

---

### Finding an Imaging Center

#### Step 1: Access Center Finder

1. Click **"Imaging"** > **"Find Imaging Center"**
2. Enter your location or allow location access

#### Step 2: Filter Results

| Filter           | Options                            |
| ---------------- | ---------------------------------- |
| **Exam Type**    | X-ray, CT, MRI, Ultrasound, etc.   |
| **Distance**     | Within 5, 10, 25 miles             |
| **Availability** | Soonest available, specific date   |
| **Insurance**    | In-network facilities              |
| **Features**     | Open MRI, pediatric, evening hours |

#### Step 3: Schedule Appointment

1. Select imaging center
2. Choose available time slot
3. Complete pre-registration questions
4. Receive confirmation

#### What to Bring

- [ ] Photo ID
- [ ] Insurance card
- [ ] Imaging order (if not electronic)
- [ ] Prior imaging CDs (if requested)
- [ ] List of current medications
- [ ] Lab results (if required for contrast)

---

### Viewing Your Images and Reports

#### Accessing Your Studies

1. Go to **"Imaging"** > **"My Studies"**
2. Select the study you want to view

#### Viewing Images

```
┌─────────────────────────────────────────────────────────────────┐
│  STUDY: Chest X-ray (2 views)                                   │
│  Date: January 5, 2025                                          │
│  Facility: Main Hospital Radiology                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │                    [IMAGE VIEWER]                        │   │
│  │                                                          │   │
│  │    ┌──────────────────┐  ┌──────────────────┐           │   │
│  │    │                  │  │                  │           │   │
│  │    │   PA View        │  │   Lateral View   │           │   │
│  │    │                  │  │                  │           │   │
│  │    └──────────────────┘  └──────────────────┘           │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Zoom In] [Zoom Out] [Rotate] [Measure] [Full Screen]         │
│                                                                 │
│  REPORT SUMMARY:                                                │
│  ─────────────────────────────────────────────────────────────  │
│  Impression: No acute cardiopulmonary disease.                  │
│                                                                 │
│  [View Full Report] [Download Images] [Share with Provider]    │
└─────────────────────────────────────────────────────────────────┘
```

#### Reading Your Report

Reports include:

| Section        | What It Contains                   |
| -------------- | ---------------------------------- |
| **Exam Info**  | What was performed, technique used |
| **Comparison** | Prior studies compared to          |
| **Findings**   | Detailed observations              |
| **Impression** | Summary and conclusions            |

#### Downloading and Sharing

- **Download Images**: Get CD-quality images on your device
- **Share with Provider**: Send to doctors outside our network
- **Request CD**: Physical disc mailed to you

---

## For Clinicians

### Ordering Imaging Studies

#### Step 1: Access Order Entry

1. From patient chart, click **"Orders"** > **"Imaging"**
2. Or use **"Order Imaging"** quick action

#### Step 2: Select Exam

1. Search by:
   - Body part (chest, abdomen, head)
   - Modality (CT, MRI, X-ray, Ultrasound)
   - Indication (rule out PE, trauma)
2. Select appropriate study

#### Step 3: Complete Order Details

```
┌─────────────────────────────────────────────────────────────────┐
│  IMAGING ORDER: CT Chest                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Exam: CT Chest [With Contrast ▼]                               │
│                                                                 │
│  Clinical Indication:                                           │
│  [Shortness of breath, rule out pulmonary embolism]            │
│                                                                 │
│  ICD-10 Diagnosis:                                              │
│  [R06.02 - Shortness of breath]                [Add Code]      │
│  [I26.99 - PE suspected]                                        │
│                                                                 │
│  Priority:                                                      │
│  ○ Routine (24-72 hours)                                        │
│  ● Urgent (same day)                                            │
│  ○ STAT (within hours)                                          │
│                                                                 │
│  Contrast:                                                      │
│  ☑ IV Contrast required                                         │
│  Recent Creatinine: 0.9 mg/dL (01/05/2025) ✓                   │
│  Allergies: None documented ✓                                   │
│                                                                 │
│  Special Instructions:                                          │
│  [Patient claustrophobic - may need sedation for MRI]          │
│                                                                 │
│  Preferred Facility: [Main Hospital Radiology ▼]                │
│                                                                 │
│  [Cancel] [Save Draft] [Sign & Send Order]                     │
└─────────────────────────────────────────────────────────────────┘
```

#### Order Decision Support

The system provides guidance on:

- **Appropriateness criteria** (ACR guidelines)
- **Prior authorization requirements**
- **Alternative exams** (lower radiation options)
- **Duplicate order alerts**

---

### Viewing Imaging Results

#### Results Notification

1. Receive notification when report is final
2. Go to **"Results"** > **"Imaging"**
3. View results inbox

#### Integrated Viewer

```
┌─────────────────────────────────────────────────────────────────┐
│  IMAGING RESULTS: CT Chest with Contrast                        │
│  Patient: John Smith | DOB: 05/15/1960 | MRN: 12345678         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────┬────────────────────────────────────┐   │
│  │                    │  RADIOLOGY REPORT                   │   │
│  │   IMAGE VIEWER     │  ─────────────────────────────────  │   │
│  │                    │                                     │   │
│  │   [CT Images]      │  FINDINGS:                          │   │
│  │                    │  Lungs: No pulmonary embolism.      │   │
│  │   Scroll through   │  Clear bilateral lung fields.       │   │
│  │   slices using     │                                     │   │
│  │   mouse wheel      │  Heart: Normal size. No pericardial │   │
│  │                    │  effusion.                          │   │
│  │   [Tools]          │                                     │   │
│  │   - Window/Level   │  IMPRESSION:                        │   │
│  │   - Measure        │  1. No evidence of pulmonary        │   │
│  │   - Annotate       │     embolism.                       │   │
│  │                    │  2. No acute cardiopulmonary        │   │
│  │                    │     abnormality.                    │   │
│  └────────────────────┴────────────────────────────────────┘   │
│                                                                 │
│  [Mark Reviewed] [Add Comment] [Message Patient] [Order F/U]   │
└─────────────────────────────────────────────────────────────────┘
```

#### Comparison Studies

- View prior studies side-by-side
- Track changes over time
- Compare measurements

---

### Reviewing Radiology Reports

#### Report Components

| Section        | Content                                       |
| -------------- | --------------------------------------------- |
| **Header**     | Patient info, exam details, ordering provider |
| **History**    | Clinical indication provided                  |
| **Technique**  | How exam was performed, contrast used         |
| **Comparison** | Prior studies referenced                      |
| **Findings**   | Detailed organ-by-organ observations          |
| **Impression** | Summary, diagnosis, recommendations           |

#### Review Actions

1. **Mark Reviewed**: Acknowledge you've read the report
2. **Add Clinical Comment**: Document your response
3. **Notify Patient**: Send results with explanation
4. **Order Follow-Up**: Additional imaging or consult
5. **Refer to Specialist**: If findings warrant

---

### Managing Critical Findings

#### What are Critical Findings?

Findings requiring urgent communication:

- Pulmonary embolism
- Aortic dissection
- Tension pneumothorax
- Acute stroke
- Tumor concerning for malignancy
- Fracture at risk of displacement

#### Critical Finding Workflow

1. **Radiologist Detection**
   - Identifies critical finding
   - Initiates critical alert protocol

2. **Immediate Notification**
   - System pages ordering provider
   - Phone call from radiologist
   - Alert in dashboard

3. **Acknowledgment Required**
   - Provider must acknowledge receipt
   - Document action taken
   - Time-stamped for compliance

4. **Patient Notification**
   - Inform patient of findings
   - Arrange appropriate care
   - Document communication

---

## For Radiologists

### Reading Studies

#### Worklist Management

1. Log in to **Radiology Portal**
2. Access **"Worklist"**
3. View studies by:
   - Priority (STAT, Urgent, Routine)
   - Modality
   - Assigned radiologist
   - Age of study

#### Study Reading Interface

```
┌─────────────────────────────────────────────────────────────────┐
│  DIAGNOSTIC VIEWER                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                                                        │    │
│  │              [FULL DICOM VIEWER]                       │    │
│  │                                                        │    │
│  │   Multiple monitors supported                          │    │
│  │   Hanging protocols applied automatically              │    │
│  │   Prior comparison auto-loaded                         │    │
│  │                                                        │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  TOOLS:                                                         │
│  [W/L] [Zoom] [Pan] [Scroll] [Measure] [ROI] [3D] [Report]     │
│                                                                 │
│  PATIENT INFO:                    CLINICAL HISTORY:             │
│  Name: John Smith                 SOB, r/o PE                   │
│  DOB: 05/15/1960                  PMH: HTN, DM                  │
│  MRN: 12345678                    Prior studies: 3              │
└─────────────────────────────────────────────────────────────────┘
```

---

### Creating Reports

#### Report Entry Methods

1. **Voice Dictation**: Speak findings, AI transcribes
2. **Template-Based**: Use structured templates
3. **Free Text**: Type report directly
4. **AI-Assisted**: AI suggests findings, you approve

#### Report Template Example

```
EXAMINATION: CT Chest with IV Contrast

CLINICAL INDICATION: [Auto-populated from order]

COMPARISON: [Select prior studies]

TECHNIQUE: [Standard template for modality]

FINDINGS:

CHEST WALL AND AXILLA:
[Normal / Describe abnormalities]

LUNGS AND AIRWAYS:
[Normal / Describe abnormalities]

PLEURA:
[No pleural effusion / Describe]

MEDIASTINUM:
[Normal heart size / Describe]

UPPER ABDOMEN:
[Normal visualized portions / Describe]

OSSEOUS STRUCTURES:
[No acute osseous abnormality / Describe]

IMPRESSION:
1. [Primary finding]
2. [Secondary finding]

RECOMMENDATIONS:
[If applicable]

_________________________________
Radiologist Name, MD
[Date/Time]
```

#### Signing Reports

1. Review dictation/entry
2. Make corrections
3. Apply electronic signature
4. Report released to ordering provider

---

### Critical Findings Protocol

#### Identifying Critical Findings

System auto-flags certain terms:

- "Pulmonary embolism"
- "Aortic dissection"
- "Tension pneumothorax"
- "Acute stroke"
- "Suspicious mass"

#### Communication Requirements

1. **Document Attempt**
   - Time of finding
   - Attempts to reach provider
   - Who was contacted
   - Acknowledgment received

2. **Escalation**
   - If provider unreachable in 30 minutes
   - Contact backup provider
   - Escalate to department head if needed

---

## Common Imaging Exams Reference

### Modality Guide

| Modality             | Best For                             | Considerations                   |
| -------------------- | ------------------------------------ | -------------------------------- |
| **X-ray**            | Bones, chest, quick screening        | Radiation, limited soft tissue   |
| **CT**               | Trauma, cancer, detailed anatomy     | Radiation, contrast for vessels  |
| **MRI**              | Soft tissue, brain, spine, joints    | No metal, takes longer           |
| **Ultrasound**       | Pregnancy, abdominal organs, vessels | Operator-dependent, no radiation |
| **Nuclear Medicine** | Function (heart, thyroid, bone)      | Requires radiotracer             |
| **PET/CT**           | Cancer staging                       | Combines PET and CT              |
| **Mammography**      | Breast cancer screening              | For breast tissue only           |

### Turnaround Times

| Priority | Expected Time |
| -------- | ------------- |
| STAT     | 1-2 hours     |
| Urgent   | Same day      |
| Routine  | 24-48 hours   |

---

## Troubleshooting

### Common Issues

#### "Cannot View Images"

1. Check browser compatibility (Chrome recommended)
2. Clear browser cache
3. Ensure stable internet connection
4. Try different browser

#### "Order Not Showing at Imaging Center"

1. Verify order was signed
2. Check if facility is in-network
3. Confirm patient demographics match
4. Contact scheduling for assistance

#### "Need Prior Authorization"

1. Check insurance requirements in order
2. Submit PA through portal
3. Wait for approval before scheduling
4. STAT orders may have expedited PA process

### Getting Help

| Issue              | Contact                  |
| ------------------ | ------------------------ |
| Portal problems    | support@unifiedhealth.io |
| Scheduling         | Imaging center directly  |
| Clinical questions | Your ordering provider   |
| Urgent results     | Radiology reading room   |

---

## Quick Reference

### For Patients

1. View orders: **Imaging > Pending Exams**
2. Schedule exam: **Click "Schedule Exam"** on order
3. Find center: **Imaging > Find Imaging Center**
4. View results: **Imaging > My Studies**

### For Clinicians

1. Order imaging: **Patient Chart > Orders > Imaging**
2. View results: **Results > Imaging**
3. Critical findings: Immediate page/notification
4. Comparison: Auto-loads in viewer

### For Radiologists

1. Worklist: **Radiology Portal > Worklist**
2. Report: Use dictation or templates
3. Critical: Follow communication protocol
4. Sign: Apply e-signature to finalize

---

_Last Updated: December 2024_
_Version: 1.0_

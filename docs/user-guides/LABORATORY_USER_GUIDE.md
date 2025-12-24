# Laboratory Service User Guide

## Overview

The Laboratory Service manages lab test orders, specimen collection, and results delivery. This guide explains how patients and clinicians use laboratory features to order, track, and review diagnostic tests.

---

## Table of Contents

1. [For Patients](#for-patients)
   - [Understanding Lab Orders](#understanding-lab-orders)
   - [Preparing for Lab Tests](#preparing-for-lab-tests)
   - [Finding a Lab Location](#finding-a-lab-location)
   - [Viewing Your Results](#viewing-your-results)
   - [Understanding Your Results](#understanding-your-results)
2. [For Clinicians](#for-clinicians)
   - [Ordering Lab Tests](#ordering-lab-tests)
   - [Managing Lab Orders](#managing-lab-orders)
   - [Reviewing Results](#reviewing-results)
   - [Critical Value Handling](#critical-value-handling)
3. [For Lab Technicians](#for-lab-technicians)
   - [Processing Specimens](#processing-specimens)
   - [Entering Results](#entering-results)
4. [Common Lab Tests Reference](#common-lab-tests-reference)
5. [Troubleshooting](#troubleshooting)

---

## For Patients

### Understanding Lab Orders

#### Accessing Your Lab Orders

1. Log in to your **Patient Portal**
2. Click **"Laboratory"** in the main navigation
3. View your laboratory dashboard

#### Dashboard Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    LABORATORY                                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  PENDING ORDERS                                          │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │  📋 Complete Blood Count (CBC)                          │   │
│  │     Ordered: Jan 10, 2025 | Status: Awaiting Collection │   │
│  │     [Find Lab] [View Details]                           │   │
│  │                                                          │   │
│  │  📋 Lipid Panel + HbA1c                                 │   │
│  │     Ordered: Jan 10, 2025 | Status: Awaiting Collection │   │
│  │     [Find Lab] [View Details]                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  RECENT RESULTS                                          │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │  ✓ Basic Metabolic Panel - Jan 5, 2025 [View Results]   │   │
│  │  ✓ Thyroid Panel - Dec 20, 2024 [View Results]          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [View All Results] [Find Lab Location] [Test Preparation]     │
└─────────────────────────────────────────────────────────────────┘
```

#### Order Status Explained

| Status                   | Meaning                       |
| ------------------------ | ----------------------------- |
| **Ordered**              | Provider has ordered the test |
| **Awaiting Collection**  | Ready for you to go to lab    |
| **Collected**            | Specimen has been collected   |
| **In Progress**          | Lab is processing your sample |
| **Results Available**    | Results ready to view         |
| **Reviewed by Provider** | Your doctor has reviewed      |

---

### Preparing for Lab Tests

#### Step 1: Check Preparation Requirements

1. Go to **"Laboratory"** > **"Pending Orders"**
2. Click on the test name
3. View **"Preparation Instructions"**

#### Common Preparation Requirements

| Test                | Preparation                                    |
| ------------------- | ---------------------------------------------- |
| **Fasting Glucose** | No food or drink (except water) for 8-12 hours |
| **Lipid Panel**     | Fast for 9-12 hours                            |
| **Thyroid Tests**   | Usually none; take medications as normal       |
| **CBC**             | Usually none required                          |
| **Urinalysis**      | Collect midstream sample                       |
| **Stool Sample**    | Collect at home with provided kit              |

#### Fasting Instructions

If your test requires fasting:

1. **Stop eating** at the time indicated (usually 8-12 hours before)
2. **Water is okay** - stay hydrated
3. **Avoid** coffee, tea, juice, and alcohol
4. **Take medications** as directed by your provider
5. **Schedule morning appointments** for easier fasting

---

### Finding a Lab Location

#### Step 1: Access Lab Finder

1. Click **"Laboratory"** > **"Find a Lab"**
2. Allow location access or enter your address

#### Step 2: Filter Options

| Filter       | Description                          |
| ------------ | ------------------------------------ |
| **Distance** | Within 5, 10, 25 miles               |
| **Hours**    | Open now, early morning, weekends    |
| **Services** | Walk-in, appointment only, pediatric |
| **Network**  | In-network with your insurance       |

#### Step 3: View Lab Details

- Address and directions
- Operating hours
- Phone number
- Wait times (if available)
- Services offered
- Appointment scheduling

#### Step 4: Schedule or Walk In

1. **Appointment**: Click **"Schedule Visit"** and select time
2. **Walk-In**: Note hours and go directly

#### What to Bring

- [ ] Photo ID
- [ ] Insurance card
- [ ] Lab order (electronic or printed)
- [ ] List of current medications

---

### Viewing Your Results

#### Step 1: Access Results

1. Go to **"Laboratory"** > **"My Results"**
2. Results appear when available (usually 1-7 days)
3. You will receive a notification when ready

#### Step 2: Open Result Report

1. Click on the test name
2. View detailed results

#### Results Display

```
┌─────────────────────────────────────────────────────────────────┐
│  COMPLETE BLOOD COUNT (CBC)                                     │
│  Collection Date: January 10, 2025                              │
│  Reported: January 11, 2025                                     │
│  Ordering Provider: Dr. Smith                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TEST                 RESULT    UNITS      REFERENCE RANGE      │
│  ─────────────────────────────────────────────────────────────  │
│  WBC                  7.2       K/uL       4.5 - 11.0      ✓    │
│  RBC                  4.8       M/uL       4.2 - 5.4       ✓    │
│  Hemoglobin           14.5      g/dL       12.0 - 16.0     ✓    │
│  Hematocrit           43.2      %          36.0 - 48.0     ✓    │
│  Platelets            245       K/uL       150 - 400       ✓    │
│  MCV                  90        fL         80 - 100        ✓    │
│  MCH                  30.2      pg         27 - 33         ✓    │
│  MCHC                 33.6      g/dL       32 - 36         ✓    │
│                                                                 │
│  Legend: ✓ Normal  ⬆ High  ⬇ Low  ⚠ Critical                  │
│                                                                 │
│  [Download PDF] [Print] [Share with Provider] [Ask a Question] │
└─────────────────────────────────────────────────────────────────┘
```

---

### Understanding Your Results

#### Result Flags

| Flag         | Meaning                | Action                    |
| ------------ | ---------------------- | ------------------------- |
| ✓ (Normal)   | Within reference range | No action needed          |
| ⬆ (High)     | Above reference range  | Discuss with provider     |
| ⬇ (Low)      | Below reference range  | Discuss with provider     |
| ⚠ (Critical) | Significantly abnormal | Provider will contact you |

#### Reference Ranges

- Reference ranges vary by:
  - Age
  - Sex
  - Lab methodology
- Your result compared to "normal" for your demographic
- Slight variations from range may not be concerning

#### Questions About Results?

1. Click **"Ask a Question"** on the result
2. Message your provider
3. Schedule follow-up appointment if needed

---

## For Clinicians

### Ordering Lab Tests

#### Step 1: Access Order Entry

1. From patient chart, click **"Orders"** > **"Laboratory"**
2. Or click **"Order Labs"** quick action

#### Step 2: Search for Tests

1. Type test name in search box
2. Search by:
   - Common name (e.g., "cholesterol")
   - Panel name (e.g., "lipid panel")
   - Individual test (e.g., "LDL-C")
   - Diagnosis (e.g., tests for "diabetes")

#### Step 3: Configure Order

```
┌─────────────────────────────────────────────────────────────────┐
│  ORDER: COMPREHENSIVE METABOLIC PANEL                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Tests Included:                                                │
│  ☑ Glucose       ☑ BUN         ☑ Creatinine    ☑ Sodium        │
│  ☑ Potassium     ☑ Chloride    ☑ CO2           ☑ Calcium       │
│  ☑ Total Protein ☑ Albumin     ☑ Bilirubin     ☑ Alk Phos      │
│  ☑ AST           ☑ ALT                                          │
│                                                                 │
│  Priority:        ○ Routine  ○ Urgent  ○ STAT                  │
│  Collection:      ○ Future   ○ Today                           │
│  Fasting:         ☑ Fasting required (8-12 hours)              │
│                                                                 │
│  Diagnosis/Indication:                                          │
│  [E11.9 - Type 2 diabetes without complications]               │
│  [Add ICD-10 Code]                                              │
│                                                                 │
│  Special Instructions:                                          │
│  [Patient on metformin - check renal function]                 │
│                                                                 │
│  Preferred Lab:   [Quest Diagnostics - Main St]  [Change]      │
│                                                                 │
│  [Cancel]  [Add to Order Set]  [Sign & Send Order]             │
└─────────────────────────────────────────────────────────────────┘
```

#### Step 4: Sign and Send

1. Review order details
2. Apply electronic signature
3. Order transmitted to selected lab
4. Patient notified of pending order

#### Order Sets

Create reusable order sets for common scenarios:

| Order Set               | Included Tests                           |
| ----------------------- | ---------------------------------------- |
| **Annual Physical**     | CBC, CMP, Lipid Panel, TSH, Urinalysis   |
| **Diabetes Management** | HbA1c, Fasting Glucose, CMP, Lipid Panel |
| **Cardiac Workup**      | Lipid Panel, CMP, Troponin, BNP          |
| **Prenatal Panel**      | CBC, Blood Type, Rubella, HIV, HBsAg     |

---

### Managing Lab Orders

#### Viewing Pending Orders

1. Go to **"Orders"** > **"Lab Orders"**
2. Filter by:
   - Status (pending, collected, resulted)
   - Date range
   - Patient
   - Ordering provider

#### Order Actions

| Action      | Use Case                         |
| ----------- | -------------------------------- |
| **Cancel**  | Patient declined or order error  |
| **Modify**  | Change lab location or add tests |
| **Reorder** | Repeat previous test             |
| **Track**   | View specimen status             |

---

### Reviewing Results

#### Results Inbox

1. Go to **"Results"** > **"Lab Results"**
2. View inbox with new results
3. Filter by:
   - Unreviewed
   - Abnormal only
   - Critical values

#### Result Review Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│  LAB RESULT REVIEW                                              │
├─────────────────────────────────────────────────────────────────┤
│  Patient: John Smith, DOB: 05/15/1965                          │
│  Test: Comprehensive Metabolic Panel                           │
│  Collected: 01/10/2025    Reported: 01/11/2025                 │
│                                                                 │
│  ABNORMAL VALUES:                                               │
│  ─────────────────────────────────────────────────────────────  │
│  Glucose         142 ⬆   mg/dL    (70-100)                     │
│  Creatinine      1.4 ⬆   mg/dL    (0.7-1.3)                    │
│  eGFR            52 ⬇    mL/min   (>60)                        │
│                                                                 │
│  NORMAL VALUES: [Show 11 more]                                  │
│                                                                 │
│  TREND COMPARISON:                                              │
│  Creatinine: 1.2 (6mo ago) → 1.3 (3mo ago) → 1.4 (current) ↗  │
│                                                                 │
│  CLINICAL CONTEXT:                                              │
│  - Diabetes Type 2 (diagnosed 2018)                            │
│  - Hypertension                                                 │
│  - Current meds: Metformin, Lisinopril                         │
│                                                                 │
│  ACTIONS:                                                       │
│  [Mark Reviewed] [Add Comment] [Message Patient] [Order F/U]   │
│  [Add to Problem List] [Adjust Medication] [Refer]             │
└─────────────────────────────────────────────────────────────────┘
```

#### Review Actions

1. **Mark Reviewed**: Acknowledge you've seen results
2. **Add Comment**: Document your interpretation
3. **Message Patient**: Send results with explanation
4. **Order Follow-Up**: Schedule repeat testing
5. **Refer**: Send to specialist

---

### Critical Value Handling

#### What are Critical Values?

Critical values are life-threatening results requiring immediate action.

| Test       | Critical Low | Critical High |
| ---------- | ------------ | ------------- |
| Glucose    | < 40 mg/dL   | > 500 mg/dL   |
| Potassium  | < 2.5 mEq/L  | > 6.5 mEq/L   |
| Sodium     | < 120 mEq/L  | > 160 mEq/L   |
| Hemoglobin | < 7.0 g/dL   | > 20 g/dL     |
| WBC        | < 2.0 K/uL   | > 30 K/uL     |
| Platelets  | < 50 K/uL    | > 1000 K/uL   |

#### Critical Value Workflow

1. **Immediate Notification**
   - System pages ordering provider
   - Alert appears in dashboard
   - Phone call from lab

2. **Required Response**
   - Acknowledge receipt
   - Document action taken
   - Patient notification

3. **Documentation**
   - Time result received
   - Time patient contacted
   - Actions ordered
   - Follow-up plan

---

## For Lab Technicians

### Processing Specimens

#### Receiving Specimens

1. Log in to **Lab Portal**
2. Go to **"Specimen Receiving"**
3. Scan specimen barcode
4. Verify:
   - Patient identity
   - Specimen type
   - Collection time
   - Order match

#### Specimen Status Updates

| Status         | When to Use         |
| -------------- | ------------------- |
| **Received**   | Specimen logged in  |
| **Processing** | Testing in progress |
| **Completed**  | Results ready       |
| **Rejected**   | Specimen inadequate |

#### Rejection Reasons

- Hemolyzed sample
- Insufficient quantity
- Wrong container
- Mislabeled
- Temperature excursion
- Expired specimen

---

### Entering Results

#### Step 1: Access Result Entry

1. Go to **"Results Entry"**
2. Select pending orders
3. Enter values for each test

#### Step 2: Validation

1. System checks against reference ranges
2. Flags abnormal and critical values
3. Delta checks against previous results

#### Step 3: Verification

1. Review all entered values
2. Apply electronic signature
3. Results released to ordering system

---

## Common Lab Tests Reference

### Routine Panels

| Panel             | Tests Included                             | Common Uses                 |
| ----------------- | ------------------------------------------ | --------------------------- |
| **CBC**           | WBC, RBC, Hemoglobin, Platelets            | Anemia, infection, bleeding |
| **CMP**           | Glucose, electrolytes, kidney, liver       | General health screening    |
| **BMP**           | Glucose, electrolytes, kidney              | Kidney function, diabetes   |
| **Lipid Panel**   | Total cholesterol, LDL, HDL, Triglycerides | Cardiovascular risk         |
| **Thyroid Panel** | TSH, T3, T4                                | Thyroid disorders           |

### Turnaround Times

| Test Category         | Typical Time |
| --------------------- | ------------ |
| STAT orders           | 1-4 hours    |
| Routine chemistry     | 24 hours     |
| Hematology            | 24 hours     |
| Microbiology cultures | 2-5 days     |
| Specialized tests     | 3-7 days     |

---

## Troubleshooting

### Common Issues

#### "Order Not Appearing at Lab"

1. Verify order was signed
2. Check if lab is in-network
3. Confirm patient demographics match
4. Contact lab with order number

#### "Results Not Available"

- Check expected turnaround time
- Verify specimen was collected
- Contact lab for status update

#### "Results Look Wrong"

- Compare with previous results
- Check if fasting was required
- Discuss with ordering provider
- Lab can rerun if specimen available

### Getting Help

| Issue               | Contact                  |
| ------------------- | ------------------------ |
| Portal problems     | support@unifiedhealth.io |
| Clinical questions  | Your healthcare provider |
| Lab location issues | Lab directly             |
| Insurance coverage  | Your insurance company   |

---

## Quick Reference

### For Patients

1. View orders: **Laboratory > Pending Orders**
2. Find lab: **Laboratory > Find a Lab**
3. View results: **Laboratory > My Results**
4. Preparation info: Click on test name

### For Clinicians

1. Order labs: **Patient Chart > Orders > Laboratory**
2. Review results: **Results > Lab Results**
3. Critical values: Immediate notification via page/alert
4. Trends: View in patient chart > Labs tab

---

_Last Updated: December 2024_
_Version: 1.0_

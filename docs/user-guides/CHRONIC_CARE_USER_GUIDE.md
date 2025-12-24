# Chronic Care Service User Guide

## Overview

The Chronic Care Service provides Remote Patient Monitoring (RPM), care plan management, and health tracking for patients with chronic conditions such as diabetes, hypertension, and heart disease. This guide covers how to use monitoring devices, track health metrics, and manage care plans.

---

## Table of Contents

1. [For Patients](#for-patients)
   - [Getting Started with Remote Monitoring](#getting-started-with-remote-monitoring)
   - [Setting Up Your Devices](#setting-up-your-devices)
   - [Taking and Recording Measurements](#taking-and-recording-measurements)
   - [Understanding Your Dashboard](#understanding-your-dashboard)
   - [Managing Alerts and Notifications](#managing-alerts-and-notifications)
   - [Working with Your Care Team](#working-with-your-care-team)
2. [For Clinicians](#for-clinicians)
   - [Managing Patient Enrollments](#managing-patient-enrollments)
   - [Creating Care Plans](#creating-care-plans)
   - [Monitoring Patient Data](#monitoring-patient-data)
   - [Responding to Alerts](#responding-to-alerts)
   - [Care Plan Reviews](#care-plan-reviews)
3. [Device Guides](#device-guides)
4. [Troubleshooting](#troubleshooting)

---

## For Patients

### Getting Started with Remote Monitoring

#### What is Remote Patient Monitoring?

Remote Patient Monitoring (RPM) allows you to:

- Track your health at home
- Share data with your care team automatically
- Receive timely interventions
- Reduce hospital visits
- Better manage chronic conditions

#### Enrolling in the Program

1. Your provider will enroll you in chronic care management
2. You'll receive a welcome kit with:
   - Monitoring devices
   - Setup instructions
   - Quick start guide
3. Complete the enrollment questionnaire
4. Schedule your onboarding call

---

### Setting Up Your Devices

#### Supported Devices

| Device Type                | Examples               | What It Measures                  |
| -------------------------- | ---------------------- | --------------------------------- |
| **Blood Pressure Monitor** | Omron, Withings        | Systolic/Diastolic BP, Heart Rate |
| **Glucose Meter**          | Contour Next, OneTouch | Blood Glucose                     |
| **Weight Scale**           | Withings, FitBit Aria  | Weight, BMI                       |
| **Pulse Oximeter**         | iHealth, Masimo        | Oxygen Saturation (SpO2)          |
| **Activity Tracker**       | FitBit, Apple Watch    | Steps, Activity, Sleep            |

#### Step 1: Download the App

1. Go to your app store (iOS/Android)
2. Search for **"UnifiedHealth Connect"**
3. Download and install

#### Step 2: Pair Your Device

1. Open the app
2. Go to **"Devices"** > **"Add Device"**
3. Select your device type
4. Follow pairing instructions:
   - Enable Bluetooth on your phone
   - Put device in pairing mode
   - Select device when it appears
   - Confirm pairing

#### Step 3: Test the Connection

1. Take a test measurement
2. Verify reading appears in the app
3. Check that data synced to your dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  DEVICE SETUP: Blood Pressure Monitor                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: Turn on your blood pressure monitor                   │
│  Step 2: Press and hold the Bluetooth button for 3 seconds     │
│  Step 3: Look for "Omron BP785N" in the list below             │
│                                                                 │
│  AVAILABLE DEVICES:                                             │
│  ─────────────────────────────────────────────────────────────  │
│  📱 Omron BP785N                              [Pair]           │
│  📱 Unknown Device                            [Pair]           │
│                                                                 │
│  Device not showing? [Troubleshoot] [Manual Entry]             │
└─────────────────────────────────────────────────────────────────┘
```

---

### Taking and Recording Measurements

#### Daily Measurement Schedule

Your care team may recommend:

| Measurement    | Frequency  | Best Time                  |
| -------------- | ---------- | -------------------------- |
| Blood Pressure | 2x daily   | Morning and evening        |
| Blood Glucose  | 1-4x daily | Before meals, at bedtime   |
| Weight         | Daily      | Morning, after bathroom    |
| Pulse Oximetry | As needed  | If feeling short of breath |

#### Taking Blood Pressure

1. Sit quietly for 5 minutes
2. Place cuff on bare upper arm
3. Rest arm on flat surface at heart level
4. Press start on device
5. Remain still during measurement
6. Reading syncs automatically

**Tips for Accurate Readings:**

- Same time each day
- Empty bladder first
- No caffeine 30 minutes before
- No talking during measurement
- Take 2 readings, 1 minute apart

#### Taking Blood Glucose

1. Wash hands with warm water
2. Insert test strip into meter
3. Use lancet to prick finger
4. Apply blood to test strip
5. Wait for reading
6. Log meal status (fasting/after meal)

#### Recording Weight

1. Place scale on flat, hard surface
2. Weigh at the same time daily
3. Wear similar clothing
4. Stand still until reading complete
5. Data syncs automatically

#### Manual Entry

If your device doesn't sync:

1. Go to **"Vitals"** > **"Add Reading"**
2. Select vital type
3. Enter value manually
4. Add date/time
5. Save entry

---

### Understanding Your Dashboard

#### Accessing Your Dashboard

1. Log in to **Patient Portal**
2. Click **"Chronic Care"** in navigation
3. View your health dashboard

#### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHRONIC CARE DASHBOARD                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  TODAY'S READINGS                                        │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │  🩺 Blood Pressure: 128/82 mmHg (8:15 AM)       ✓       │   │
│  │  📊 Blood Glucose: 142 mg/dL (7:30 AM)          ⬆       │   │
│  │  ⚖️ Weight: 185.2 lbs (7:00 AM)                 ✓       │   │
│  │  ❤️ Pulse: 72 bpm                               ✓       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  7-DAY TRENDS                                            │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │  BP:  ▁▂▂▃▂▂▂  Average: 126/80                          │   │
│  │  BG:  ▃▄▂▅▃▄▃  Average: 138 mg/dL                       │   │
│  │  Wt:  ▄▄▄▃▃▃▃  Trend: -1.2 lbs this week               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  MY GOALS                                                │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │  ☑ Keep BP under 130/80 (80% of readings in range)      │   │
│  │  ○ Reduce A1C to 7.0% (Next check: Feb 15)             │   │
│  │  ○ Lose 10 lbs (Progress: 4/10 lbs)                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Take Reading] [View History] [Message Care Team] [Devices]   │
└─────────────────────────────────────────────────────────────────┘
```

#### Understanding Your Trends

| Trend          | Meaning                    |
| -------------- | -------------------------- |
| ✓ **In Range** | Reading within your target |
| ⬆ **High**     | Above your target range    |
| ⬇ **Low**      | Below your target range    |
| ⚠ **Alert**    | Needs immediate attention  |

---

### Managing Alerts and Notifications

#### Types of Alerts

| Alert Level     | Color  | Meaning            | Action                 |
| --------------- | ------ | ------------------ | ---------------------- |
| **Information** | Blue   | Reminder or tip    | Review when convenient |
| **Warning**     | Yellow | Approaching limits | Monitor closely        |
| **Critical**    | Red    | Outside safe range | Contact care team      |

#### Setting Up Notifications

1. Go to **"Settings"** > **"Notifications"**
2. Choose notification preferences:
   - Push notifications
   - SMS alerts
   - Email summaries
3. Set quiet hours (no alerts during sleep)

#### Responding to Alerts

**Warning Alert:**

1. Retake measurement to confirm
2. Note any symptoms
3. Follow self-care instructions
4. Monitor for changes

**Critical Alert:**

1. Your care team is automatically notified
2. Follow emergency instructions
3. Call your provider if instructed
4. Seek emergency care if symptoms severe

---

### Working with Your Care Team

#### Care Plan Overview

1. Go to **"Chronic Care"** > **"My Care Plan"**
2. View your personalized plan including:
   - Condition being managed
   - Target goals
   - Medications
   - Scheduled tasks
   - Next appointments

#### Communication

**Messaging Your Care Team:**

1. Click **"Message Care Team"**
2. Select message type:
   - Question about readings
   - Medication question
   - Symptom report
   - General inquiry
3. Send message
4. Response within 24 hours (business days)

**Urgent Concerns:**

- Use phone call for urgent issues
- Call 911 for emergencies

#### Scheduled Check-Ins

- Monthly phone/video review with care manager
- Quarterly provider visits
- Annual comprehensive review

---

## For Clinicians

### Managing Patient Enrollments

#### Enrolling a New Patient

1. Go to **"Chronic Care"** > **"Enrollments"**
2. Click **"Enroll Patient"**
3. Select patient from chart
4. Choose program type:
   - Diabetes Management
   - Hypertension Control
   - Heart Failure
   - COPD Management
   - Multi-condition

5. Configure monitoring parameters:
   - Devices to be provided
   - Measurement frequency
   - Alert thresholds
   - Care team members

#### Enrollment Checklist

- [ ] Patient consent obtained
- [ ] Insurance eligibility verified (CPT 99453, 99454, 99457)
- [ ] Devices ordered/shipped
- [ ] Care plan created
- [ ] Onboarding call scheduled
- [ ] Patient trained on devices

---

### Creating Care Plans

#### Step 1: Start New Care Plan

1. From patient chart, go to **"Chronic Care"** > **"Care Plans"**
2. Click **"New Care Plan"**
3. Select template or create custom

#### Step 2: Configure Care Plan

```
┌─────────────────────────────────────────────────────────────────┐
│  NEW CARE PLAN                                                   │
├─────────────────────────────────────────────────────────────────┤
│  Template: [Diabetes Type 2 Management ▼]                       │
│                                                                 │
│  CONDITION: Diabetes Type 2 (E11.9)                             │
│                                                                 │
│  GOALS:                                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. HbA1c Goal: [7.0] % by [06/01/2025]                  │   │
│  │ 2. Fasting Glucose: [80-130] mg/dL                      │   │
│  │ 3. Post-meal Glucose: [<180] mg/dL                      │   │
│  │ 4. Weight Goal: [Lose 5%] by [06/01/2025]               │   │
│  │ [+ Add Goal]                                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  MONITORING SCHEDULE:                                           │
│  ☑ Blood Glucose: [2x daily] - [Before breakfast, Before bed]  │
│  ☑ Blood Pressure: [1x daily] - [Morning]                       │
│  ☑ Weight: [Daily] - [Morning]                                  │
│                                                                 │
│  ALERT THRESHOLDS:                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Blood Glucose:                                           │   │
│  │   Critical Low: [<70] mg/dL                              │   │
│  │   Warning Low: [<80] mg/dL                               │   │
│  │   Warning High: [>180] mg/dL                             │   │
│  │   Critical High: [>300] mg/dL                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Cancel] [Save Draft] [Activate Care Plan]                    │
└─────────────────────────────────────────────────────────────────┘
```

#### Step 3: Assign Care Team

1. Add care team members:
   - Primary physician
   - Care manager/nurse
   - Dietitian (if applicable)
   - Pharmacist (if applicable)
2. Set notification preferences for each member

#### Step 4: Activate Plan

1. Review complete care plan
2. Set start date
3. Activate plan
4. Patient receives notification

---

### Monitoring Patient Data

#### Population Dashboard

1. Go to **"Chronic Care"** > **"Dashboard"**
2. View all enrolled patients

```
┌─────────────────────────────────────────────────────────────────┐
│  CHRONIC CARE POPULATION DASHBOARD                              │
├─────────────────────────────────────────────────────────────────┤
│  Total Enrolled: 156 patients                                   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ALERTS REQUIRING ATTENTION                              │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │  🔴 Critical (3)   🟡 Warning (12)   🔵 Info (8)        │   │
│  │                                                          │   │
│  │  John Smith - BP 185/110 (30 min ago) [Review]          │   │
│  │  Mary Johnson - Glucose 42 (1 hr ago) [Review]          │   │
│  │  Robert Davis - Weight +5 lbs/3 days [Review]           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ENGAGEMENT STATUS                                       │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │  ✓ Active (120)  ⚠ Low engagement (24)  ✗ Inactive (12)│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [View All Patients] [Export Report] [Schedule Reviews]        │
└─────────────────────────────────────────────────────────────────┘
```

#### Individual Patient View

1. Click on patient name
2. View detailed monitoring data:
   - Latest readings
   - Trends over time
   - Goal progress
   - Alert history
   - Device status

---

### Responding to Alerts

#### Alert Queue

1. Go to **"Chronic Care"** > **"Alerts"**
2. View alerts sorted by priority

#### Alert Response Workflow

1. **Review Alert**
   - View triggering reading
   - Check trend data
   - Review patient history

2. **Take Action**
   - Call patient
   - Send message
   - Adjust thresholds
   - Update care plan
   - Order labs
   - Schedule appointment

3. **Document**
   - Record action taken
   - Set follow-up reminder
   - Close alert

#### Documentation Template

```
ALERT RESPONSE DOCUMENTATION

Alert: Blood Glucose 42 mg/dL (Critical Low)
Patient: Mary Johnson
Time: 01/15/2025 2:30 PM

Action Taken:
- Called patient at 2:35 PM
- Patient confirmed hypoglycemic episode
- Instructed to consume 15g fast-acting carbs
- Symptoms resolved after 15 minutes
- Glucose recheck: 98 mg/dL

Follow-Up:
- Review medication dosing at next visit
- Scheduled call for tomorrow AM
- Added reminder to check meal patterns

Documented by: Nurse Smith, RN
Time: 3:15 PM
```

---

### Care Plan Reviews

#### Monthly Review Checklist

- [ ] Review all vital sign trends
- [ ] Check goal progress
- [ ] Review medication adherence
- [ ] Assess device usage/engagement
- [ ] Update care plan as needed
- [ ] Document monthly summary
- [ ] Bill appropriate CPT codes

#### Quarterly Comprehensive Review

- Full care plan evaluation
- Goal reassessment
- Threshold adjustments
- Team coordination meeting
- Patient satisfaction check

---

## Device Guides

### Blood Pressure Monitor Setup

1. Install batteries
2. Download companion app
3. Enable Bluetooth
4. Follow pairing wizard
5. Test with practice reading

### Glucose Meter Setup

1. Insert test strip
2. Pair via Bluetooth
3. Enter meter ID code
4. Take test reading
5. Verify sync to app

### Scale Setup

1. Place on hard, flat surface
2. Install batteries/charge
3. Open app > Add Device
4. Step on scale to wake
5. Complete pairing

---

## Troubleshooting

### Common Issues

#### "Device Won't Pair"

1. Restart Bluetooth on phone
2. Remove device from Bluetooth settings
3. Put device in pairing mode again
4. Try pairing from app (not phone settings)

#### "Readings Not Syncing"

1. Check Bluetooth is enabled
2. Open app near device
3. Take new reading
4. Force sync in app settings
5. Enter manually if needed

#### "Incorrect Readings"

- Blood Pressure: Check cuff size, position, rest before
- Glucose: Verify test strips not expired
- Weight: Place on hard floor, stand still

### Getting Help

| Issue             | Contact                         |
| ----------------- | ------------------------------- |
| Device problems   | 1-800-XXX-XXXX (Device Support) |
| App issues        | support@unifiedhealth.io        |
| Medical questions | Your care team                  |
| Emergency         | 911                             |

---

## Quick Reference

### For Patients

1. Take readings: Use device, syncs automatically
2. View dashboard: **Chronic Care > Dashboard**
3. Message team: **Chronic Care > Message Care Team**
4. View care plan: **Chronic Care > My Care Plan**

### For Clinicians

1. Enroll patient: **Chronic Care > Enrollments > Enroll Patient**
2. View alerts: **Chronic Care > Alerts**
3. Population view: **Chronic Care > Dashboard**
4. Care plan: **Patient Chart > Chronic Care > Care Plans**

---

_Last Updated: December 2024_
_Version: 1.0_

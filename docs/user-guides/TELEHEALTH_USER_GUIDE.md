# Telehealth Service User Guide

## Overview

The Telehealth Service enables secure video consultations between patients and healthcare providers. This guide covers how to schedule, join, and manage virtual appointments.

---

## Table of Contents

1. [For Patients](#for-patients)
   - [Scheduling a Video Appointment](#scheduling-a-video-appointment)
   - [Preparing for Your Visit](#preparing-for-your-visit)
   - [Joining a Video Call](#joining-a-video-call)
   - [During the Consultation](#during-the-consultation)
   - [After Your Visit](#after-your-visit)
2. [For Clinicians](#for-clinicians)
   - [Managing Your Schedule](#managing-your-schedule)
   - [Starting a Video Visit](#starting-a-video-visit)
   - [Conducting the Consultation](#conducting-the-consultation)
   - [Completing Visit Documentation](#completing-visit-documentation)
3. [Technical Requirements](#technical-requirements)
4. [Troubleshooting](#troubleshooting)

---

## For Patients

### Scheduling a Video Appointment

#### Step 1: Access the Appointment Scheduler

1. Log in to your **Patient Portal** at `https://app.unifiedhealth.io`
2. Click **"Appointments"** in the main navigation menu
3. Select **"Schedule New Appointment"**

#### Step 2: Choose Appointment Type

1. Select **"Video Visit"** from the appointment type options
2. Choose your preferred specialty:
   - Primary Care
   - Specialist Consultation
   - Follow-up Visit
   - Urgent Care

#### Step 3: Select Provider and Time

1. Browse available providers or search by name
2. View provider profiles including:
   - Credentials and specialties
   - Languages spoken
   - Patient ratings
3. Select an available time slot from the calendar
4. Confirm your selection

#### Step 4: Complete Booking

1. Review appointment details:
   - Provider name
   - Date and time (shown in your local timezone)
   - Visit type
2. Add a reason for your visit (optional but recommended)
3. Click **"Confirm Appointment"**
4. Receive confirmation via:
   - Email
   - SMS (if enabled)
   - In-app notification

---

### Preparing for Your Visit

#### 24 Hours Before

1. You will receive a reminder notification
2. Complete any pre-visit questionnaires:
   - Navigate to **"Appointments"** > **"Upcoming"**
   - Click on your appointment
   - Select **"Complete Pre-Visit Forms"**

#### 15 Minutes Before

1. Find a quiet, private location
2. Ensure good lighting (face a window or light source)
3. Test your equipment:
   - Click **"Test My Setup"** on your appointment page
   - Allow camera and microphone access when prompted
   - Verify video and audio are working

#### Checklist

- [ ] Stable internet connection (WiFi recommended)
- [ ] Device charged or plugged in
- [ ] Camera and microphone working
- [ ] List of medications ready
- [ ] Questions for your provider written down
- [ ] Insurance card available (if needed)

---

### Joining a Video Call

#### Step 1: Access Your Appointment

1. Log in to the Patient Portal
2. Navigate to **"Appointments"** > **"Upcoming"**
3. Find your scheduled video visit
4. The **"Join Video Visit"** button activates 10 minutes before your appointment

#### Step 2: Enter the Virtual Waiting Room

1. Click **"Join Video Visit"**
2. Grant camera and microphone permissions if prompted
3. You will enter the virtual waiting room
4. Wait for your provider to start the session

#### Step 3: Connect with Your Provider

1. When the provider joins, you will be connected automatically
2. Confirm you can see and hear each other
3. If issues occur, use the **"Troubleshoot"** button

---

### During the Consultation

#### Available Features

| Feature           | How to Use                                  |
| ----------------- | ------------------------------------------- |
| **Mute/Unmute**   | Click the microphone icon                   |
| **Camera On/Off** | Click the camera icon                       |
| **Chat**          | Click the chat bubble to send text messages |
| **Share Screen**  | Click "Share" to show documents or images   |
| **Full Screen**   | Click the expand icon                       |
| **Settings**      | Adjust audio/video settings                 |

#### Best Practices

- Speak clearly and face the camera
- Minimize background noise
- Keep your face well-lit and visible
- Have your medication bottles nearby if discussing prescriptions
- Take notes during the visit

---

### After Your Visit

#### Step 1: Review Visit Summary

1. After the call ends, you will receive a visit summary
2. Access it via **"Appointments"** > **"Past Visits"**
3. Review:
   - Diagnosis (if applicable)
   - Treatment plan
   - Prescriptions ordered
   - Follow-up instructions

#### Step 2: Complete Follow-Up Actions

1. **Prescriptions**: View and manage at **"Pharmacy"** section
2. **Lab Orders**: Schedule at **"Laboratory"** section
3. **Follow-Up Appointment**: Schedule if recommended
4. **Feedback**: Rate your experience to help improve services

---

## For Clinicians

### Managing Your Schedule

#### Accessing the Provider Dashboard

1. Log in to the **Provider Portal** at `https://provider.unifiedhealth.io`
2. Navigate to **"Schedule"** in the main menu

#### Setting Availability

1. Click **"Manage Availability"**
2. Set your available hours for video visits:
   - Select days of the week
   - Define time blocks (e.g., 9:00 AM - 12:00 PM)
   - Set appointment duration (15, 30, 45, or 60 minutes)
3. Save your availability

#### Viewing Appointments

| View        | Description                            |
| ----------- | -------------------------------------- |
| **Daily**   | Hour-by-hour schedule for today        |
| **Weekly**  | Week overview with all appointments    |
| **Monthly** | Calendar view with appointment counts  |
| **List**    | Sortable list of upcoming appointments |

---

### Starting a Video Visit

#### Step 1: Prepare for the Session

1. Review patient information before the call:
   - Click on the appointment in your schedule
   - Select **"View Patient Chart"**
   - Review:
     - Chief complaint / reason for visit
     - Medical history
     - Current medications
     - Recent lab results
     - Previous visit notes

#### Step 2: Start the Video Call

1. When ready, click **"Start Video Visit"**
2. You will enter the video room
3. The patient will be notified and connected

#### Step 3: Admit the Patient

1. Verify patient identity:
   - Confirm name and date of birth
   - Verify location (for licensing compliance)
2. Obtain verbal consent for telehealth visit
3. Begin the consultation

---

### Conducting the Consultation

#### Dashboard Features

```
┌─────────────────────────────────────────────────────────────────┐
│                     VIDEO CONSULTATION                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────────────────────────┐  │
│  │                 │  │  PATIENT CHART                      │  │
│  │   VIDEO FEED    │  │  ─────────────────────────────────  │  │
│  │                 │  │  Chief Complaint: [...]             │  │
│  │   [Patient]     │  │  Vitals: [...]                      │  │
│  │                 │  │  Medications: [...]                 │  │
│  │                 │  │  Allergies: [...]                   │  │
│  └─────────────────┘  └─────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ACTIONS                                                 │   │
│  │  [Add Note] [Order Rx] [Order Lab] [Refer] [Schedule]   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Mute] [Camera] [Screen Share] [Chat] [End Call]              │
└─────────────────────────────────────────────────────────────────┘
```

#### Quick Actions During Visit

| Action                 | Steps                                                                |
| ---------------------- | -------------------------------------------------------------------- |
| **Add Clinical Note**  | Click "Add Note" > Type observations > Save                          |
| **Order Prescription** | Click "Order Rx" > Search medication > Set dosage > Send to pharmacy |
| **Order Lab Tests**    | Click "Order Lab" > Select tests > Choose lab location               |
| **Make Referral**      | Click "Refer" > Select specialty > Add notes                         |
| **Schedule Follow-Up** | Click "Schedule" > Select timeframe > Book                           |

---

### Completing Visit Documentation

#### Step 1: Complete Visit Note

1. After ending the call, the documentation screen appears
2. Complete the structured note:

```
SUBJECTIVE
- Chief Complaint: [Auto-populated from intake]
- History of Present Illness: [Document symptoms, duration, severity]
- Review of Systems: [Check applicable systems]

OBJECTIVE
- Vital Signs: [If patient-reported or from devices]
- Physical Exam: [Visual observations from video]
- General Appearance: [Document observations]

ASSESSMENT
- Diagnosis: [Select ICD-10 codes]
- Differential Diagnoses: [If applicable]

PLAN
- Treatment: [Medications, therapies]
- Patient Education: [Instructions provided]
- Follow-Up: [Next steps]
```

#### Step 2: Submit Orders

1. Review any orders created during the visit
2. Confirm and sign prescriptions (e-prescribe)
3. Submit lab orders to patient's preferred lab
4. Send referrals to specialists

#### Step 3: Finalize and Sign

1. Review complete documentation
2. Click **"Sign and Complete Visit"**
3. Visit summary is automatically sent to patient

---

## Technical Requirements

### Minimum Requirements

| Component            | Patient                                        | Provider                  |
| -------------------- | ---------------------------------------------- | ------------------------- |
| **Browser**          | Chrome 80+, Firefox 75+, Safari 13+, Edge 80+  | Chrome 80+ (recommended)  |
| **Internet**         | 1.5 Mbps download/upload                       | 3 Mbps download/upload    |
| **Camera**           | 720p webcam                                    | 1080p webcam              |
| **Microphone**       | Built-in or external                           | Headset recommended       |
| **Operating System** | Windows 10+, macOS 10.14+, iOS 13+, Android 8+ | Windows 10+, macOS 10.14+ |

### Recommended Setup

- Wired internet connection (Ethernet)
- External webcam with good low-light performance
- Noise-canceling headset
- Second monitor for clinicians (patient chart + video)

---

## Troubleshooting

### Common Issues and Solutions

#### "Camera Not Working"

1. Check if camera is blocked by another application
2. Verify browser has camera permission:
   - Chrome: Settings > Privacy > Camera
   - Safari: Preferences > Websites > Camera
3. Try refreshing the page
4. Restart your browser

#### "Cannot Hear / Be Heard"

1. Check if microphone is muted in the app
2. Verify system volume is up
3. Check browser microphone permissions
4. Try a different browser
5. Test with headphones

#### "Poor Video Quality"

1. Close other applications using bandwidth
2. Move closer to your WiFi router
3. Switch to wired connection if possible
4. Lower video quality in settings
5. Turn off HD video temporarily

#### "Connection Dropped"

1. Check your internet connection
2. Refresh the page
3. Click "Rejoin" in your appointment page
4. If issues persist, contact support

### Getting Help

| Issue Type          | Contact                                        |
| ------------------- | ---------------------------------------------- |
| Technical problems  | Click "Help" in the app or call 1-800-XXX-XXXX |
| Medical emergencies | Call 911 immediately                           |
| Billing questions   | support@unifiedhealth.io                       |

---

## Privacy and Security

- All video calls are encrypted end-to-end
- No recordings are stored without explicit consent
- Sessions comply with HIPAA regulations
- Access requires authenticated login

---

## Quick Reference Card

### For Patients

1. Log in 15 minutes early
2. Test camera and microphone
3. Click "Join Video Visit" when button is active
4. Wait in virtual waiting room
5. Connect with provider when they join

### For Clinicians

1. Review patient chart before visit
2. Click "Start Video Visit" when ready
3. Verify patient identity
4. Conduct consultation using dashboard tools
5. Complete documentation and sign visit

---

_Last Updated: December 2024_
_Version: 1.0_

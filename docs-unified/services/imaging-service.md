# Imaging Service Documentation

**Document Version:** 1.0
**Last Updated:** December 2024

---

## 1. Overview

The Imaging Service manages medical imaging workflows including DICOM storage, PACS integration, AI-powered image analysis, and radiology reporting.

### 1.1 Core Capabilities

- DICOM image storage and retrieval
- PACS (Picture Archiving and Communication System) integration
- AI-powered image analysis and anomaly detection
- Radiology report generation
- Image viewing and manipulation (DICOM viewer)
- Multi-modality support (X-ray, CT, MRI, Ultrasound, Mammography)

### 1.2 Technology Stack

```yaml
Runtime: Python 3.11 / FastAPI
DICOM: Orthanc PACS Server, pydicom
Database: PostgreSQL (metadata), MongoDB (reports)
Storage: S3 / Azure Blob (DICOM files)
AI/ML: PyTorch, TensorFlow (image analysis models)
Viewer: Cornerstone.js (web DICOM viewer)
```

---

## 2. Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 IMAGING SERVICE                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐│
│  │  DICOM Gateway                                          ││
│  │  - C-STORE (receive images)                            ││
│  │  - C-FIND (query)                                      ││
│  │  - C-MOVE (retrieve)                                   ││
│  └────────────────────────────────────────────────────────┘│
│                         │                                   │
│  ┌────────────────────────────────────────────────────────┐│
│  │  Image Processing Pipeline                             ││
│  │  - DICOM validation                                    ││
│  │  - Metadata extraction                                 ││
│  │  - Image preprocessing                                 ││
│  │  - AI analysis                                         ││
│  └────────────────────────────────────────────────────────┘│
│                         │                                   │
│  ┌────────────────────────────────────────────────────────┐│
│  │  Storage Layer                                          ││
│  │  - Orthanc PACS                                        ││
│  │  - S3/Azure Blob                                       ││
│  │  - PostgreSQL (metadata)                               ││
│  └────────────────────────────────────────────────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. DICOM Operations

### 3.1 DICOM Storage (C-STORE)

**Workflow:**
```
Imaging Device → DICOM C-STORE → Imaging Service → Orthanc PACS → Storage
                                        ↓
                                 Metadata Extract
                                        ↓
                                  PostgreSQL DB
                                        ↓
                                   AI Analysis
                                        ↓
                              Radiologist Worklist
```

### 3.2 Supported Modalities

| Modality | Code | Description | AI Analysis |
|----------|------|-------------|-------------|
| **X-Ray** | CR, DX | Chest X-ray, skeletal | Pneumonia, fractures |
| **CT** | CT | Computed Tomography | Stroke, tumors |
| **MRI** | MR | Magnetic Resonance | Brain, spine lesions |
| **Ultrasound** | US | Sonography | Organ assessment |
| **Mammography** | MG | Breast imaging | Breast cancer screening |

---

## 4. API Endpoints

### 4.1 Imaging Studies

```
POST /api/v1/imaging/studies
GET /api/v1/imaging/studies
GET /api/v1/imaging/studies/{id}
GET /api/v1/imaging/studies/{id}/series
GET /api/v1/imaging/studies/{id}/images
```

**Create Study:**
```json
POST /api/v1/imaging/studies
{
  "patientId": "pat_123456",
  "orderId": "ord_789012",
  "modality": "CR",
  "bodyPart": "CHEST",
  "studyDescription": "Chest X-Ray PA and Lateral",
  "indication": "Rule out pneumonia",
  "priority": "routine",
  "scheduledDate": "2024-12-20T10:00:00Z",
  "performingFacility": "Downtown Radiology"
}
```

### 4.2 Image Upload

```
POST /api/v1/imaging/upload
Content-Type: multipart/form-data

{
  "studyId": "study_345678",
  "files": [dicom_file_1.dcm, dicom_file_2.dcm]
}
```

### 4.3 AI Analysis

```
POST /api/v1/imaging/analyze/{studyId}
{
  "models": ["chest-xray-pneumonia", "fracture-detection"],
  "priority": "high"
}
```

**AI Analysis Response:**
```json
{
  "analysisId": "analysis_901234",
  "studyId": "study_345678",
  "status": "completed",
  "findings": [
    {
      "model": "chest-xray-pneumonia",
      "confidence": 0.87,
      "finding": "Possible pneumonia in right lower lobe",
      "coordinates": {
        "x": 245,
        "y": 387,
        "width": 120,
        "height": 95
      },
      "severity": "moderate",
      "recommendation": "Radiologist review recommended"
    }
  ],
  "completedAt": "2024-12-19T14:30:00Z"
}
```

---

## 5. DICOM Data Model

### 5.1 DICOM Tags

**Key DICOM Tags:**

| Tag | Name | Description |
|-----|------|-------------|
| (0010,0020) | Patient ID | Unique patient identifier |
| (0020,000D) | Study Instance UID | Unique study identifier |
| (0020,000E) | Series Instance UID | Series identifier |
| (0008,0060) | Modality | Imaging modality (CR, CT, MR, etc.) |
| (0018,0015) | Body Part Examined | Anatomical region |
| (0008,0020) | Study Date | Date of study |
| (0008,1030) | Study Description | Clinical description |

### 5.2 Study Metadata Schema

```typescript
interface ImagingStudy {
  studyId: string;
  studyInstanceUID: string;
  patientId: string;
  orderId?: string;
  modality: 'CR' | 'CT' | 'MR' | 'US' | 'MG';
  bodyPart: string;
  studyDescription: string;
  indication?: string;
  studyDate: Date;
  performingFacility: string;
  series: Array<{
    seriesInstanceUID: string;
    seriesNumber: number;
    seriesDescription: string;
    imageCount: number;
  }>;
  status: 'scheduled' | 'in-progress' | 'completed' | 'reported';
  aiAnalysis?: AIAnalysisResult;
  radiologyReport?: RadiologyReport;
}
```

---

## 6. AI-Powered Image Analysis

### 6.1 Available AI Models

| Model | Modality | Detection | Accuracy |
|-------|----------|-----------|----------|
| **CheXNet** | Chest X-ray | 14 pathologies | 91.2% |
| **Pneumonia Detector** | Chest X-ray | Pneumonia | 93.5% |
| **Fracture Detection** | X-ray | Bone fractures | 89.7% |
| **Breast Cancer Screening** | Mammography | Masses, calcifications | 87.3% |
| **Stroke Detection** | CT Brain | Hemorrhage, ischemia | 92.1% |

### 6.2 AI Analysis Pipeline

```python
class ImageAnalyzer:
    def __init__(self):
        self.models = self.load_models()

    async def analyze_study(self, study_id: str, models: List[str]):
        # 1. Retrieve DICOM images
        images = await self.get_dicom_images(study_id)

        # 2. Preprocess images
        preprocessed = self.preprocess(images)

        # 3. Run AI models
        results = []
        for model_name in models:
            model = self.models[model_name]
            predictions = model.predict(preprocessed)
            results.append(self.format_findings(predictions))

        # 4. Generate heat maps
        heatmaps = self.generate_heatmaps(preprocessed, results)

        # 5. Calculate confidence scores
        confidence = self.calculate_confidence(results)

        return {
            'findings': results,
            'heatmaps': heatmaps,
            'confidence': confidence
        }
```

### 6.3 Human-in-the-Loop Review

**AI-Assisted Workflow:**
```
AI Analysis → Flag High Confidence Findings → Radiologist Review → Final Report
              │
              └─→ Low Confidence or Critical → Immediate Radiologist Review
```

---

## 7. Radiology Reporting

### 7.1 Structured Report Template

```json
{
  "reportId": "report_567890",
  "studyId": "study_345678",
  "radiologistId": "prov_234567",
  "reportDate": "2024-12-19T16:00:00Z",
  "sections": {
    "technique": "PA and lateral views of the chest",
    "comparison": "None available",
    "findings": "The lungs are clear. No focal consolidation, pleural effusion, or pneumothorax. Heart size is normal. Mediastinal contours are unremarkable.",
    "impression": "No acute cardiopulmonary abnormality."
  },
  "criticalFindings": false,
  "status": "final",
  "signedBy": "prov_234567",
  "signedAt": "2024-12-19T16:15:00Z"
}
```

---

## 8. PACS Integration

### 8.1 Orthanc Configuration

```json
{
  "Name": "UnifiedHealth PACS",
  "DicomAet": "UNIFIEDHEALTH",
  "DicomPort": 4242,
  "HttpPort": 8042,
  "RemoteAccessAllowed": true,
  "AuthenticationEnabled": true,
  "SslEnabled": true,
  "StorageDirectory": "/var/lib/orthanc/db",
  "PostgreSQL": {
    "EnableIndex": true,
    "EnableStorage": false,
    "Host": "postgres.internal",
    "Database": "orthanc"
  },
  "AwsS3Storage": {
    "BucketName": "unifiedhealth-dicom",
    "Region": "us-east-1"
  }
}
```

### 8.2 HL7 Integration

**HL7 ORM Order Message:**
```
MSH|^~\&|EMR|UnifiedHealth|PACS|Radiology|20241219140000||ORM^O01|MSG123|P|2.5
PID|1||PAT123456||Doe^John||19800101|M
OBR|1||ORD789012|CR^Chest X-Ray^LOINC|||20241220100000
```

---

## 9. Image Viewer Integration

### 9.1 Web DICOM Viewer (Cornerstone.js)

**Features:**
- Multi-planar reconstruction (MPR)
- Windowing and leveling
- Zoom, pan, rotate
- Measurements (length, angle, area)
- Annotations
- Cine (for CT/MRI series)
- Compare studies side-by-side

### 9.2 Mobile Viewer

- DICOM image rendering on iOS/Android
- Touch gestures for manipulation
- Offline viewing capability
- Secure image download

---

## 10. Quality Metrics

| Metric | Target | Current |
|--------|--------|---------|
| **DICOM Upload Success Rate** | > 99% | 99.5% |
| **Image Retrieval Time** | < 2 seconds | 1.4 seconds |
| **AI Analysis Time** | < 5 minutes | 3.2 minutes |
| **Report Turnaround Time** | < 24 hours (routine) | 18 hours |
| **Critical Finding Notification** | < 30 minutes | 22 minutes |
| **AI Accuracy (vs. Radiologist)** | > 90% | 91.3% |

---

*Document Version: 1.0*
*Last Updated: December 2024*

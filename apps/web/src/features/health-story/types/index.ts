/**
 * Health Story Timeline Types
 * Types for the patient health journey visualization feature
 */

// Event types for the timeline
export type TimelineEventType =
  | 'diagnosis'
  | 'treatment'
  | 'medication'
  | 'procedure'
  | 'lab_result'
  | 'imaging'
  | 'appointment'
  | 'hospitalization'
  | 'vaccination'
  | 'vital_reading'
  | 'lifestyle_change'
  | 'milestone'
  | 'note';

// Severity/impact levels
export type EventSeverity = 'info' | 'low' | 'moderate' | 'high' | 'critical';

// Timeline event status
export type EventStatus = 'active' | 'resolved' | 'ongoing' | 'completed' | 'scheduled';

// Chapter organization types
export type ChapterType = 'condition' | 'time_period' | 'body_system' | 'treatment_plan';

/**
 * Base timeline event
 */
export interface TimelineEvent {
  id: string;
  patientId: string;
  type: TimelineEventType;
  title: string;
  description: string;
  plainLanguageSummary: string;
  date: string;
  endDate?: string;
  severity: EventSeverity;
  status: EventStatus;
  relatedConditions: string[];
  relatedEvents: string[];
  providers: EventProvider[];
  location?: EventLocation;
  attachments: EventAttachment[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Provider associated with an event
 */
export interface EventProvider {
  id: string;
  name: string;
  specialty: string;
  role: string;
  imageUrl?: string;
}

/**
 * Location where event occurred
 */
export interface EventLocation {
  facilityName: string;
  facilityType: 'hospital' | 'clinic' | 'lab' | 'pharmacy' | 'home' | 'telehealth' | 'other';
  address?: string;
  city?: string;
  state?: string;
}

/**
 * Attachments for events
 */
export interface EventAttachment {
  id: string;
  name: string;
  type: 'document' | 'image' | 'lab_report' | 'prescription' | 'other';
  url: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

/**
 * Chapter in the health story
 */
export interface StoryChapter {
  id: string;
  type: ChapterType;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  events: TimelineEvent[];
  insights: ChapterInsight[];
  summary: string;
  isActive: boolean;
  order: number;
}

/**
 * Insight derived from health data
 */
export interface ChapterInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  recommendation?: string;
  confidence: number;
  relatedEvents: string[];
  createdAt: string;
}

export type InsightType =
  | 'trend'
  | 'achievement'
  | 'warning'
  | 'improvement'
  | 'correlation'
  | 'reminder'
  | 'milestone';

/**
 * Achievement/milestone in health journey
 */
export interface HealthAchievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  earnedAt: string;
  category: 'wellness' | 'compliance' | 'improvement' | 'engagement' | 'milestone';
  points?: number;
  shareableText: string;
}

/**
 * Complete health story for a patient
 */
export interface HealthStory {
  id: string;
  patientId: string;
  patientName: string;
  chapters: StoryChapter[];
  achievements: HealthAchievement[];
  overallSummary: string;
  lastUpdated: string;
  totalEvents: number;
  dateRange: {
    start: string;
    end: string;
  };
}

/**
 * Timeline filter options
 */
export interface TimelineFilters {
  eventTypes?: TimelineEventType[];
  dateRange?: {
    start: string;
    end: string;
  };
  severity?: EventSeverity[];
  status?: EventStatus[];
  conditions?: string[];
  providers?: string[];
  searchQuery?: string;
}

/**
 * Timeline view mode
 */
export type TimelineViewMode = 'chronological' | 'by_chapter' | 'by_condition' | 'by_provider';

/**
 * Share configuration
 */
export interface ShareConfig {
  shareableId: string;
  expiresAt: string;
  permissions: SharePermissions;
  accessedBy: ShareAccess[];
  shareUrl: string;
  qrCodeUrl?: string;
}

export interface SharePermissions {
  viewTimeline: boolean;
  viewDocuments: boolean;
  viewLabResults: boolean;
  viewMedications: boolean;
  downloadEnabled: boolean;
  chaptersIncluded: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ShareAccess {
  accessedAt: string;
  accessedBy: string;
  accessType: 'view' | 'download';
  ipAddress?: string;
}

/**
 * Export configuration
 */
export interface ExportConfig {
  format: 'pdf' | 'html' | 'json' | 'fhir';
  includeAttachments: boolean;
  includeInsights: boolean;
  chaptersIncluded: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  anonymize: boolean;
}

/**
 * API response types
 */
export interface HealthStoryResponse {
  success: boolean;
  data: HealthStory;
}

export interface TimelineEventsResponse {
  success: boolean;
  data: {
    events: TimelineEvent[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
    };
  };
}

export interface ShareResponse {
  success: boolean;
  data: ShareConfig;
}

export interface ExportResponse {
  success: boolean;
  data: {
    downloadUrl: string;
    expiresAt: string;
    format: string;
    fileSize: number;
  };
}

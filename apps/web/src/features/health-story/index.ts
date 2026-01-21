/**
 * Health Story Timeline Feature
 * Patient engagement feature for visualizing health journey as a narrative story
 */

// Components
export { HealthTimeline } from './components/HealthTimeline';
export { TimelineEvent } from './components/TimelineEvent';
export { ChapterHeader } from './components/ChapterHeader';
export { InsightCard } from './components/InsightCard';
export { ShareDialog } from './components/ShareDialog';
export { ExportButton } from './components/ExportButton';

// Hooks
export {
  useHealthStory,
  useStoryChapters,
  useStoryChapter,
  useGenerateHealthStory,
  useShareHealthStory,
  useHealthStoryShares,
  useRevokeShare,
  useSharedHealthStory,
  useExportHealthStory,
  useUpdateChapterOrder,
  useAddStoryNote,
  useHealthStorySummary,
  healthStoryKeys,
} from './hooks/useHealthStory';

export {
  useTimelineEvents,
  useTimelineEvent,
  useRelatedEvents,
  useTimelineFilters,
  useTimelineViewMode,
  useAddEventNote,
  useLinkEvents,
  groupEventsByField,
  groupEventsByPeriod,
  getEventTypeInfo,
  getSeverityInfo,
  timelineEventKeys,
} from './hooks/useTimelineEvents';

// Services
export {
  simplifyMedicalTerm,
  simplifyMedicalText,
  generateEventSummary,
  generateChapterNarrative,
  generateChapterInsights,
  detectAchievements,
  organizeIntoChapters,
  generateOverallSummary,
} from './services/storyGenerator';

// Types
export type {
  TimelineEventType,
  EventSeverity,
  EventStatus,
  ChapterType,
  TimelineEvent as TimelineEventData,
  EventProvider,
  EventLocation,
  EventAttachment,
  StoryChapter,
  ChapterInsight,
  InsightType,
  HealthAchievement,
  HealthStory,
  TimelineFilters,
  TimelineViewMode,
  ShareConfig,
  SharePermissions,
  ShareAccess,
  ExportConfig,
  HealthStoryResponse,
  TimelineEventsResponse,
  ShareResponse,
  ExportResponse,
} from './types';

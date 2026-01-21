'use client';

/**
 * HealthTimeline Component
 * Main timeline visualization component for the patient health journey
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  HealthStory,
  TimelineEvent as TimelineEventData,
  TimelineEventType,
  TimelineFilters,
  TimelineViewMode,
  StoryChapter,
  ShareConfig,
  SharePermissions,
  ExportConfig,
} from '../types';
import { TimelineEvent } from './TimelineEvent';
import { ChapterHeader } from './ChapterHeader';
import { InsightCard } from './InsightCard';
import { ShareDialog } from './ShareDialog';
import { ExportButton } from './ExportButton';
import {
  useTimelineFilters,
  useTimelineViewMode,
  groupEventsByPeriod,
} from '../hooks/useTimelineEvents';

interface HealthTimelineProps {
  healthStory: HealthStory;
  onShare?: (permissions: SharePermissions, expiresIn: number) => Promise<ShareConfig>;
  onExport?: (config: ExportConfig) => Promise<{ downloadUrl: string; fileSize: number }>;
  onEventClick?: (eventId: string) => void;
  onChapterClick?: (chapterId: string) => void;
  existingShares?: ShareConfig[];
  isLoading?: boolean;
}

export const HealthTimeline: React.FC<HealthTimelineProps> = ({
  healthStory,
  onShare,
  onExport,
  onEventClick,
  onChapterClick,
  existingShares = [],
  isLoading = false,
}) => {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const {
    filters,
    updateFilters,
    clearFilters,
    setEventTypes,
    setSearchQuery,
    hasActiveFilters,
  } = useTimelineFilters();

  const { viewMode, setViewMode } = useTimelineViewMode();

  // Get all events from chapters
  const allEvents = useMemo(() => {
    return healthStory.chapters.flatMap((chapter) => chapter.events);
  }, [healthStory.chapters]);

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    let events = [...allEvents];

    if (filters.eventTypes?.length) {
      events = events.filter((e) => filters.eventTypes!.includes(e.type));
    }

    if (filters.dateRange) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      events = events.filter((e) => {
        const eventDate = new Date(e.date);
        return eventDate >= startDate && eventDate <= endDate;
      });
    }

    if (filters.severity?.length) {
      events = events.filter((e) => filters.severity!.includes(e.severity));
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query) ||
          e.plainLanguageSummary.toLowerCase().includes(query)
      );
    }

    // Sort by date descending
    return events.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [allEvents, filters]);

  // Group events based on view mode
  const groupedContent = useMemo(() => {
    switch (viewMode) {
      case 'by_chapter':
        return {
          type: 'chapters' as const,
          data: healthStory.chapters,
        };
      case 'by_condition': {
        const conditionMap = new Map<string, TimelineEventData[]>();
        for (const event of filteredEvents) {
          if (event.relatedConditions.length > 0) {
            for (const condition of event.relatedConditions) {
              const existing = conditionMap.get(condition) || [];
              existing.push(event);
              conditionMap.set(condition, existing);
            }
          } else {
            const existing = conditionMap.get('General') || [];
            existing.push(event);
            conditionMap.set('General', existing);
          }
        }
        return {
          type: 'grouped' as const,
          data: conditionMap,
          groupType: 'condition',
        };
      }
      case 'by_provider': {
        const providerMap = new Map<string, TimelineEventData[]>();
        for (const event of filteredEvents) {
          if (event.providers.length > 0) {
            for (const provider of event.providers) {
              const key = provider.name;
              const existing = providerMap.get(key) || [];
              existing.push(event);
              providerMap.set(key, existing);
            }
          } else {
            const existing = providerMap.get('Unknown Provider') || [];
            existing.push(event);
            providerMap.set('Unknown Provider', existing);
          }
        }
        return {
          type: 'grouped' as const,
          data: providerMap,
          groupType: 'provider',
        };
      }
      case 'chronological':
      default: {
        const periodGroups = groupEventsByPeriod(filteredEvents, 'month');
        return {
          type: 'chronological' as const,
          data: periodGroups,
        };
      }
    }
  }, [viewMode, filteredEvents, healthStory.chapters]);

  const handleEventToggle = useCallback((eventId: string) => {
    setExpandedEventId((prev) => (prev === eventId ? null : eventId));
    onEventClick?.(eventId);
  }, [onEventClick]);

  const handleChapterToggle = useCallback((chapterId: string) => {
    setExpandedChapterId((prev) => (prev === chapterId ? null : chapterId));
    onChapterClick?.(chapterId);
  }, [onChapterClick]);

  const formatPeriodLabel = (periodKey: string) => {
    const [year, month] = periodKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const eventTypeOptions = [
    { value: 'diagnosis', label: 'Diagnoses' },
    { value: 'treatment', label: 'Treatments' },
    { value: 'medication', label: 'Medications' },
    { value: 'procedure', label: 'Procedures' },
    { value: 'lab_result', label: 'Lab Results' },
    { value: 'imaging', label: 'Imaging' },
    { value: 'appointment', label: 'Appointments' },
    { value: 'vaccination', label: 'Vaccinations' },
  ];

  const viewModeOptions: Array<{ value: TimelineViewMode; label: string; icon: JSX.Element }> = [
    {
      value: 'chronological',
      label: 'Timeline',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      value: 'by_chapter',
      label: 'Chapters',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      value: 'by_condition',
      label: 'Conditions',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      value: 'by_provider',
      label: 'Providers',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {healthStory.patientName}&apos;s Health Story
            </h1>
            <p className="mt-2 text-gray-600">
              {healthStory.overallSummary}
            </p>
            <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
              <span>{healthStory.totalEvents} events</span>
              <span>|</span>
              <span>{healthStory.chapters.length} chapters</span>
              <span>|</span>
              <span>{healthStory.achievements.length} achievements</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {onShare && (
              <button
                onClick={() => setIsShareDialogOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            )}
            {onExport && (
              <ExportButton
                onExport={onExport}
                availableChapters={healthStory.chapters.map((c) => ({
                  id: c.id,
                  title: c.title,
                }))}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{healthStory.totalEvents}</p>
              <p className="text-sm text-gray-500">Total Events</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{healthStory.chapters.length}</p>
              <p className="text-sm text-gray-500">Chapters</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {healthStory.chapters.filter((c) => c.isActive).length}
              </p>
              <p className="text-sm text-gray-500">Active Conditions</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div
          className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-yellow-300 transition-colors"
          onClick={() => setShowAchievements(!showAchievements)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {healthStory.achievements.length}
              </p>
              <p className="text-sm text-gray-500">Achievements</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements section (collapsible) */}
      {showAchievements && healthStory.achievements.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthStory.achievements.map((achievement) => (
              <InsightCard
                key={achievement.id}
                achievement={achievement}
                variant="default"
              />
            ))}
          </div>
        </div>
      )}

      {/* Filters and view controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search your health story..."
              value={filters.searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* View mode toggle */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {viewModeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setViewMode(option.value)}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === option.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {option.icon}
                <span className="ml-1.5 hidden sm:inline">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Event type filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          {eventTypeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                const currentTypes = filters.eventTypes || [];
                if (currentTypes.includes(option.value as TimelineEventType)) {
                  setEventTypes(
                    currentTypes.filter((t) => t !== option.value) as TimelineEventType[]
                  );
                } else {
                  setEventTypes([...currentTypes, option.value as TimelineEventType]);
                }
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filters.eventTypes?.includes(option.value as TimelineEventType)
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Timeline content */}
      <div className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : groupedContent.type === 'chapters' ? (
          // Chapter view
          <div className="space-y-6">
            {(groupedContent.data as StoryChapter[]).map((chapter) => (
              <div key={chapter.id}>
                <ChapterHeader
                  chapter={chapter}
                  isExpanded={expandedChapterId === chapter.id}
                  onToggleExpand={() => handleChapterToggle(chapter.id)}
                  onViewChapter={onChapterClick}
                />
                {expandedChapterId === chapter.id && (
                  <div className="pl-4 border-l-2 border-gray-200 ml-6">
                    {chapter.events.map((event, index) => (
                      <TimelineEvent
                        key={event.id}
                        event={event}
                        isExpanded={expandedEventId === event.id}
                        onToggleExpand={() => handleEventToggle(event.id)}
                        showConnector={true}
                        isFirst={index === 0}
                        isLast={index === chapter.events.length - 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : groupedContent.type === 'chronological' ? (
          // Chronological view
          <div>
            {Array.from((groupedContent.data as Map<string, TimelineEventData[]>).entries()).map(
              ([period, events]) => (
                <div key={period} className="mb-8">
                  <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm py-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {formatPeriodLabel(period)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {events.length} event{events.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="space-y-1">
                    {events.map((event, index) => (
                      <TimelineEvent
                        key={event.id}
                        event={event}
                        isExpanded={expandedEventId === event.id}
                        onToggleExpand={() => handleEventToggle(event.id)}
                        showConnector={true}
                        isFirst={index === 0}
                        isLast={index === events.length - 1}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          // Grouped view (by condition or provider)
          <div>
            {Array.from((groupedContent.data as Map<string, TimelineEventData[]>).entries()).map(
              ([groupName, events]) => (
                <div key={groupName} className="mb-8">
                  <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm py-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{groupName}</h3>
                    <p className="text-sm text-gray-500">
                      {events.length} event{events.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="space-y-1">
                    {events.map((event, index) => (
                      <TimelineEvent
                        key={event.id}
                        event={event}
                        isExpanded={expandedEventId === event.id}
                        onToggleExpand={() => handleEventToggle(event.id)}
                        showConnector={true}
                        isFirst={index === 0}
                        isLast={index === events.length - 1}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Empty state */}
        {filteredEvents.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 mb-4">
              {hasActiveFilters
                ? 'Try adjusting your filters to see more events.'
                : 'Your health story will appear here as you interact with healthcare providers.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Share dialog */}
      {onShare && (
        <ShareDialog
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          onShare={onShare}
          availableChapters={healthStory.chapters.map((c) => ({
            id: c.id,
            title: c.title,
          }))}
          existingShares={existingShares}
        />
      )}
    </div>
  );
};

export default HealthTimeline;

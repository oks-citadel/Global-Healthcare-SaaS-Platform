/**
 * useTimelineEvents Hook
 * Manages timeline events with filtering, pagination, and real-time updates
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';
import apiClient from '@/lib/api';
import {
  TimelineEvent,
  TimelineEventsResponse,
  TimelineFilters,
  TimelineViewMode,
  TimelineEventType,
  EventSeverity,
} from '../types';

// Query key factory for timeline events
export const timelineEventKeys = {
  all: ['timeline-events'] as const,
  events: (patientId: string) => [...timelineEventKeys.all, patientId] as const,
  filteredEvents: (patientId: string, filters: TimelineFilters) =>
    [...timelineEventKeys.events(patientId), filters] as const,
  event: (eventId: string) => [...timelineEventKeys.all, 'event', eventId] as const,
  relatedEvents: (eventId: string) => [...timelineEventKeys.all, 'related', eventId] as const,
};

const DEFAULT_PAGE_SIZE = 20;

/**
 * Fetch timeline events with pagination
 */
export function useTimelineEvents(
  patientId: string,
  filters?: TimelineFilters,
  pageSize: number = DEFAULT_PAGE_SIZE
) {
  return useInfiniteQuery({
    queryKey: timelineEventKeys.filteredEvents(patientId, filters || {}),
    queryFn: async ({ pageParam = 0 }) => {
      const params: Record<string, unknown> = {
        limit: pageSize,
        offset: pageParam,
      };

      if (filters?.eventTypes?.length) {
        params.eventTypes = filters.eventTypes.join(',');
      }
      if (filters?.dateRange) {
        params.startDate = filters.dateRange.start;
        params.endDate = filters.dateRange.end;
      }
      if (filters?.severity?.length) {
        params.severity = filters.severity.join(',');
      }
      if (filters?.status?.length) {
        params.status = filters.status.join(',');
      }
      if (filters?.conditions?.length) {
        params.conditions = filters.conditions.join(',');
      }
      if (filters?.providers?.length) {
        params.providers = filters.providers.join(',');
      }
      if (filters?.searchQuery) {
        params.search = filters.searchQuery;
      }

      const response = await apiClient.get<TimelineEventsResponse>(
        `/health-story/${patientId}/events`,
        { params }
      );

      return response.data.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((acc, page) => acc + page.events.length, 0);
      if (loadedCount >= lastPage.pagination.total) {
        return undefined;
      }
      return loadedCount;
    },
    enabled: !!patientId,
  });
}

/**
 * Fetch a single timeline event
 */
export function useTimelineEvent(eventId: string) {
  return useQuery<TimelineEvent>({
    queryKey: timelineEventKeys.event(eventId),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: TimelineEvent }>(
        `/health-story/events/${eventId}`
      );
      return response.data.data;
    },
    enabled: !!eventId,
  });
}

/**
 * Fetch related events for a specific event
 */
export function useRelatedEvents(eventId: string) {
  return useQuery<TimelineEvent[]>({
    queryKey: timelineEventKeys.relatedEvents(eventId),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: TimelineEvent[] }>(
        `/health-story/events/${eventId}/related`
      );
      return response.data.data;
    },
    enabled: !!eventId,
  });
}

/**
 * Hook for managing timeline filters state
 */
export function useTimelineFilters(initialFilters?: Partial<TimelineFilters>) {
  const [filters, setFilters] = useState<TimelineFilters>(initialFilters || {});

  const updateFilters = useCallback((updates: Partial<TimelineFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const setEventTypes = useCallback((types: TimelineEventType[]) => {
    setFilters((prev) => ({ ...prev, eventTypes: types }));
  }, []);

  const setDateRange = useCallback((start: string, end: string) => {
    setFilters((prev) => ({ ...prev, dateRange: { start, end } }));
  }, []);

  const setSeverity = useCallback((severity: EventSeverity[]) => {
    setFilters((prev) => ({ ...prev, severity }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query || undefined }));
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      (filters.eventTypes?.length ?? 0) > 0 ||
      !!filters.dateRange ||
      (filters.severity?.length ?? 0) > 0 ||
      (filters.status?.length ?? 0) > 0 ||
      (filters.conditions?.length ?? 0) > 0 ||
      (filters.providers?.length ?? 0) > 0 ||
      !!filters.searchQuery
    );
  }, [filters]);

  return {
    filters,
    updateFilters,
    clearFilters,
    setEventTypes,
    setDateRange,
    setSeverity,
    setSearchQuery,
    hasActiveFilters,
  };
}

/**
 * Hook for managing timeline view mode
 */
export function useTimelineViewMode(initialMode: TimelineViewMode = 'chronological') {
  const [viewMode, setViewMode] = useState<TimelineViewMode>(initialMode);

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => {
      const modes: TimelineViewMode[] = ['chronological', 'by_chapter', 'by_condition', 'by_provider'];
      const currentIndex = modes.indexOf(prev);
      return modes[(currentIndex + 1) % modes.length];
    });
  }, []);

  return {
    viewMode,
    setViewMode,
    toggleViewMode,
  };
}

/**
 * Add a note to a timeline event
 */
export function useAddEventNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      note,
    }: {
      eventId: string;
      note: string;
    }) => {
      const response = await apiClient.post(
        `/health-story/events/${eventId}/notes`,
        { note }
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: timelineEventKeys.event(variables.eventId),
      });
    },
  });
}

/**
 * Link events together
 */
export function useLinkEvents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sourceEventId,
      targetEventId,
      relationship,
    }: {
      sourceEventId: string;
      targetEventId: string;
      relationship: 'related' | 'caused_by' | 'resulted_in' | 'followup';
    }) => {
      const response = await apiClient.post(
        `/health-story/events/${sourceEventId}/link`,
        {
          targetEventId,
          relationship,
        }
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: timelineEventKeys.event(variables.sourceEventId),
      });
      queryClient.invalidateQueries({
        queryKey: timelineEventKeys.relatedEvents(variables.sourceEventId),
      });
      queryClient.invalidateQueries({
        queryKey: timelineEventKeys.event(variables.targetEventId),
      });
    },
  });
}

/**
 * Group events by a specific field
 */
export function groupEventsByField<K extends keyof TimelineEvent>(
  events: TimelineEvent[],
  field: K
): Map<TimelineEvent[K], TimelineEvent[]> {
  const grouped = new Map<TimelineEvent[K], TimelineEvent[]>();

  for (const event of events) {
    const key = event[field];
    const existing = grouped.get(key) || [];
    existing.push(event);
    grouped.set(key, existing);
  }

  return grouped;
}

/**
 * Group events by month/year
 */
export function groupEventsByPeriod(
  events: TimelineEvent[],
  period: 'day' | 'week' | 'month' | 'year'
): Map<string, TimelineEvent[]> {
  const grouped = new Map<string, TimelineEvent[]>();

  for (const event of events) {
    const date = new Date(event.date);
    let key: string;

    switch (period) {
      case 'day':
        key = date.toISOString().split('T')[0];
        break;
      case 'week': {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        key = startOfWeek.toISOString().split('T')[0];
        break;
      }
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'year':
        key = String(date.getFullYear());
        break;
    }

    const existing = grouped.get(key) || [];
    existing.push(event);
    grouped.set(key, existing);
  }

  return grouped;
}

/**
 * Get event type display info
 */
export function getEventTypeInfo(type: TimelineEventType): {
  label: string;
  color: string;
  icon: string;
} {
  const typeInfo: Record<TimelineEventType, { label: string; color: string; icon: string }> = {
    diagnosis: { label: 'Diagnosis', color: 'red', icon: 'stethoscope' },
    treatment: { label: 'Treatment', color: 'blue', icon: 'pill' },
    medication: { label: 'Medication', color: 'purple', icon: 'capsule' },
    procedure: { label: 'Procedure', color: 'orange', icon: 'scalpel' },
    lab_result: { label: 'Lab Result', color: 'green', icon: 'flask' },
    imaging: { label: 'Imaging', color: 'cyan', icon: 'scan' },
    appointment: { label: 'Appointment', color: 'indigo', icon: 'calendar' },
    hospitalization: { label: 'Hospitalization', color: 'red', icon: 'hospital' },
    vaccination: { label: 'Vaccination', color: 'teal', icon: 'syringe' },
    vital_reading: { label: 'Vital Reading', color: 'pink', icon: 'heartbeat' },
    lifestyle_change: { label: 'Lifestyle Change', color: 'yellow', icon: 'leaf' },
    milestone: { label: 'Milestone', color: 'gold', icon: 'star' },
    note: { label: 'Note', color: 'gray', icon: 'note' },
  };

  return typeInfo[type] || { label: type, color: 'gray', icon: 'circle' };
}

/**
 * Get severity display info
 */
export function getSeverityInfo(severity: EventSeverity): {
  label: string;
  color: string;
  bgColor: string;
} {
  const severityInfo: Record<EventSeverity, { label: string; color: string; bgColor: string }> = {
    info: { label: 'Info', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    low: { label: 'Low', color: 'text-green-600', bgColor: 'bg-green-100' },
    moderate: { label: 'Moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    high: { label: 'High', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    critical: { label: 'Critical', color: 'text-red-600', bgColor: 'bg-red-100' },
  };

  return severityInfo[severity] || severityInfo.info;
}

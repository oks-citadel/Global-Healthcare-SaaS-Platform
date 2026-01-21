/**
 * useHealthStory Hook
 * Manages the complete health story data and operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import {
  HealthStory,
  HealthStoryResponse,
  ShareConfig,
  ShareResponse,
  SharePermissions,
  ExportConfig,
  ExportResponse,
  StoryChapter,
  ChapterType,
} from '../types';

// Query key factory for health story
export const healthStoryKeys = {
  all: ['health-story'] as const,
  story: (patientId: string) => [...healthStoryKeys.all, 'story', patientId] as const,
  chapters: (patientId: string) => [...healthStoryKeys.all, 'chapters', patientId] as const,
  chapter: (patientId: string, chapterId: string) =>
    [...healthStoryKeys.chapters(patientId), chapterId] as const,
  achievements: (patientId: string) => [...healthStoryKeys.all, 'achievements', patientId] as const,
  shares: (patientId: string) => [...healthStoryKeys.all, 'shares', patientId] as const,
  share: (shareId: string) => [...healthStoryKeys.all, 'share', shareId] as const,
};

/**
 * Fetch the complete health story for a patient
 */
export function useHealthStory(patientId: string) {
  return useQuery<HealthStory>({
    queryKey: healthStoryKeys.story(patientId),
    queryFn: async () => {
      const response = await apiClient.get<HealthStoryResponse>(
        `/health-story/${patientId}`
      );
      return response.data.data;
    },
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch chapters for a patient's health story
 */
export function useStoryChapters(patientId: string, type?: ChapterType) {
  return useQuery<StoryChapter[]>({
    queryKey: [...healthStoryKeys.chapters(patientId), type],
    queryFn: async () => {
      const params = type ? { type } : {};
      const response = await apiClient.get<{ success: boolean; data: StoryChapter[] }>(
        `/health-story/${patientId}/chapters`,
        { params }
      );
      return response.data.data;
    },
    enabled: !!patientId,
  });
}

/**
 * Fetch a specific chapter
 */
export function useStoryChapter(patientId: string, chapterId: string) {
  return useQuery<StoryChapter>({
    queryKey: healthStoryKeys.chapter(patientId, chapterId),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: StoryChapter }>(
        `/health-story/${patientId}/chapters/${chapterId}`
      );
      return response.data.data;
    },
    enabled: !!patientId && !!chapterId,
  });
}

/**
 * Generate or regenerate the health story
 */
export function useGenerateHealthStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      patientId,
      options,
    }: {
      patientId: string;
      options?: {
        chapterType?: ChapterType;
        includeInsights?: boolean;
        dateRange?: { start: string; end: string };
      };
    }) => {
      const response = await apiClient.post<HealthStoryResponse>(
        `/health-story/${patientId}/generate`,
        options
      );
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(healthStoryKeys.story(variables.patientId), data);
      queryClient.invalidateQueries({
        queryKey: healthStoryKeys.chapters(variables.patientId),
      });
    },
  });
}

/**
 * Create a shareable link for the health story
 */
export function useShareHealthStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      patientId,
      permissions,
      expiresIn,
    }: {
      patientId: string;
      permissions: SharePermissions;
      expiresIn?: number; // hours
    }) => {
      const response = await apiClient.post<ShareResponse>(
        `/health-story/${patientId}/share`,
        {
          permissions,
          expiresIn: expiresIn || 72, // default 72 hours
        }
      );
      return response.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: healthStoryKeys.shares(variables.patientId),
      });
    },
  });
}

/**
 * Get active shares for a patient's health story
 */
export function useHealthStoryShares(patientId: string) {
  return useQuery<ShareConfig[]>({
    queryKey: healthStoryKeys.shares(patientId),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: ShareConfig[] }>(
        `/health-story/${patientId}/shares`
      );
      return response.data.data;
    },
    enabled: !!patientId,
  });
}

/**
 * Revoke a share
 */
export function useRevokeShare() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ patientId, shareId }: { patientId: string; shareId: string }) => {
      await apiClient.delete(`/health-story/${patientId}/shares/${shareId}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: healthStoryKeys.shares(variables.patientId),
      });
    },
  });
}

/**
 * Access a shared health story (public endpoint)
 */
export function useSharedHealthStory(shareId: string) {
  return useQuery<HealthStory>({
    queryKey: healthStoryKeys.share(shareId),
    queryFn: async () => {
      const response = await apiClient.get<HealthStoryResponse>(
        `/health-story/shared/${shareId}`
      );
      return response.data.data;
    },
    enabled: !!shareId,
    retry: false,
  });
}

/**
 * Export the health story
 */
export function useExportHealthStory() {
  return useMutation({
    mutationFn: async ({
      patientId,
      config,
    }: {
      patientId: string;
      config: ExportConfig;
    }) => {
      const response = await apiClient.post<ExportResponse>(
        `/health-story/${patientId}/export`,
        config
      );
      return response.data.data;
    },
  });
}

/**
 * Update chapter order/organization
 */
export function useUpdateChapterOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      patientId,
      chapterIds,
    }: {
      patientId: string;
      chapterIds: string[];
    }) => {
      const response = await apiClient.patch<{ success: boolean }>(
        `/health-story/${patientId}/chapters/order`,
        { chapterIds }
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: healthStoryKeys.chapters(variables.patientId),
      });
    },
  });
}

/**
 * Add a custom note to the health story
 */
export function useAddStoryNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      patientId,
      chapterId,
      note,
    }: {
      patientId: string;
      chapterId?: string;
      note: {
        title: string;
        content: string;
        date: string;
      };
    }) => {
      const response = await apiClient.post(
        `/health-story/${patientId}/notes`,
        {
          chapterId,
          ...note,
        }
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: healthStoryKeys.story(variables.patientId),
      });
      if (variables.chapterId) {
        queryClient.invalidateQueries({
          queryKey: healthStoryKeys.chapter(variables.patientId, variables.chapterId),
        });
      }
    },
  });
}

/**
 * Get summary statistics for the health story
 */
export function useHealthStorySummary(patientId: string) {
  return useQuery({
    queryKey: [...healthStoryKeys.story(patientId), 'summary'],
    queryFn: async () => {
      const response = await apiClient.get<{
        success: boolean;
        data: {
          totalEvents: number;
          totalChapters: number;
          totalAchievements: number;
          dateRange: { start: string; end: string };
          eventsByType: Record<string, number>;
          recentActivity: { date: string; count: number }[];
        };
      }>(`/health-story/${patientId}/summary`);
      return response.data.data;
    },
    enabled: !!patientId,
  });
}

import { apiClient } from '../api-client';
import { ProviderSchedule, AvailabilityException } from '@/types';

export const scheduleApi = {
  getSchedule: async (): Promise<ProviderSchedule[]> => {
    return apiClient.get<ProviderSchedule[]>('/schedule');
  },

  updateSchedule: async (schedules: ProviderSchedule[]): Promise<ProviderSchedule[]> => {
    return apiClient.put<ProviderSchedule[]>('/schedule', { schedules });
  },

  getExceptions: async (startDate?: string, endDate?: string): Promise<AvailabilityException[]> => {
    return apiClient.get<AvailabilityException[]>('/schedule/exceptions', {
      params: { startDate, endDate },
    });
  },

  createException: async (
    data: Omit<AvailabilityException, 'id' | 'providerId'>
  ): Promise<AvailabilityException> => {
    return apiClient.post<AvailabilityException>('/schedule/exceptions', data);
  },

  deleteException: async (id: string): Promise<void> => {
    return apiClient.delete(`/schedule/exceptions/${id}`);
  },
};

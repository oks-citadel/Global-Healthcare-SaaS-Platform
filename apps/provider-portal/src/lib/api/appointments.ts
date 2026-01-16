import { apiClient } from '../api-client';
import { Appointment, PaginatedResponse, AppointmentFilters, TimeSlot } from '@/types';

export const appointmentsApi = {
  getAppointments: async (
    page = 1,
    pageSize = 20,
    filters?: AppointmentFilters
  ): Promise<PaginatedResponse<Appointment>> => {
    return apiClient.get<PaginatedResponse<Appointment>>('/appointments', {
      params: { page, pageSize, ...filters },
    });
  },

  getAppointmentById: async (id: string): Promise<Appointment> => {
    return apiClient.get<Appointment>(`/appointments/${id}`);
  },

  getTodayAppointments: async (): Promise<Appointment[]> => {
    return apiClient.get<Appointment[]>('/appointments/today');
  },

  getUpcomingAppointments: async (days = 7): Promise<Appointment[]> => {
    return apiClient.get<Appointment[]>('/appointments/upcoming', {
      params: { days },
    });
  },

  createAppointment: async (
    data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Appointment> => {
    return apiClient.post<Appointment>('/appointments', data);
  },

  updateAppointment: async (id: string, data: Partial<Appointment>): Promise<Appointment> => {
    return apiClient.put<Appointment>(`/appointments/${id}`, data);
  },

  cancelAppointment: async (id: string, reason?: string): Promise<Appointment> => {
    return apiClient.patch<Appointment>(`/appointments/${id}/cancel`, { reason });
  },

  confirmAppointment: async (id: string): Promise<Appointment> => {
    return apiClient.patch<Appointment>(`/appointments/${id}/confirm`);
  },

  getAvailableSlots: async (date: string, duration: number): Promise<TimeSlot[]> => {
    return apiClient.get<TimeSlot[]>('/appointments/available-slots', {
      params: { date, duration },
    });
  },
};

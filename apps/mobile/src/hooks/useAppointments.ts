import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import {
  Appointment,
  CreateAppointmentData,
  PaginatedResponse,
} from '../types';

// Fetch appointments list
export const useAppointments = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['appointments', page, limit],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<Appointment>>(
        `/appointments?page=${page}&limit=${limit}`
      );
      return response;
    },
  });
};

// Fetch single appointment
export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: async () => {
      const response = await apiClient.get<Appointment>(`/appointments/${id}`);
      return response;
    },
    enabled: !!id,
  });
};

// Create appointment mutation
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAppointmentData) => {
      const response = await apiClient.post<Appointment>('/appointments', data);
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch appointments list
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

// Update appointment mutation
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Appointment>;
    }) => {
      const response = await apiClient.patch<Appointment>(
        `/appointments/${id}`,
        data
      );
      return response;
    },
    onSuccess: (data) => {
      // Invalidate appointments list
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      // Update cached appointment
      queryClient.setQueryData(['appointment', data.id], data);
    },
  });
};

// Cancel appointment mutation
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch<Appointment>(
        `/appointments/${id}/cancel`
      );
      return response;
    },
    onSuccess: (data) => {
      // Invalidate appointments list
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      // Update cached appointment
      queryClient.setQueryData(['appointment', data.id], data);
    },
  });
};

// Fetch upcoming appointments
export const useUpcomingAppointments = (limit = 5) => {
  return useQuery({
    queryKey: ['appointments', 'upcoming', limit],
    queryFn: async () => {
      const response = await apiClient.get<Appointment[]>(
        `/appointments/upcoming?limit=${limit}`
      );
      return response;
    },
  });
};

// Fetch past appointments
export const usePastAppointments = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['appointments', 'past', page, limit],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<Appointment>>(
        `/appointments/past?page=${page}&limit=${limit}`
      );
      return response;
    },
  });
};

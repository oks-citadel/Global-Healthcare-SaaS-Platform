import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import {
  Appointment,
  Document,
  PatientProfile,
  BookAppointmentData,
} from '@/types';

// Query key factory
const patientKeys = {
  all: ['patient'] as const,
  appointments: () => [...patientKeys.all, 'appointments'] as const,
  appointment: (id: string) => [...patientKeys.appointments(), id] as const,
  documents: () => [...patientKeys.all, 'documents'] as const,
  document: (id: string) => [...patientKeys.documents(), id] as const,
  profile: () => [...patientKeys.all, 'profile'] as const,
};

// Fetch my appointments
interface UseMyAppointmentsOptions {
  status?: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
}

export function useMyAppointments(options?: UseMyAppointmentsOptions) {
  return useQuery<Appointment[]>({
    queryKey: [...patientKeys.appointments(), options],
    queryFn: async () => {
      const params = options ? { status: options.status } : {};
      const response = await apiClient.get('/patient/appointments', { params });
      return response.data;
    },
  });
}

// Fetch single appointment
export function useAppointment(id: string) {
  return useQuery<Appointment>({
    queryKey: patientKeys.appointment(id),
    queryFn: async () => {
      const response = await apiClient.get(`/patient/appointments/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Book appointment mutation
export function useBookAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BookAppointmentData) => {
      const response = await apiClient.post('/patient/appointments', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate appointments query to refetch
      queryClient.invalidateQueries({ queryKey: patientKeys.appointments() });
    },
  });
}

// Cancel appointment mutation
export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const response = await apiClient.put(`/patient/appointments/${appointmentId}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.appointments() });
    },
  });
}

// Reschedule appointment mutation
export function useRescheduleAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ appointmentId, dateTime }: { appointmentId: string; dateTime: string }) => {
      const response = await apiClient.put(`/patient/appointments/${appointmentId}/reschedule`, {
        dateTime,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.appointments() });
    },
  });
}

// Fetch my documents
export function useMyDocuments() {
  return useQuery<Document[]>({
    queryKey: patientKeys.documents(),
    queryFn: async () => {
      const response = await apiClient.get('/patient/documents');
      return response.data;
    },
  });
}

// Upload document mutation
interface UploadDocumentData {
  file: File;
  type: 'lab-result' | 'prescription' | 'imaging' | 'insurance' | 'other';
  category: string;
  description?: string;
  tags?: string[];
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UploadDocumentData) => {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('type', data.type);
      formData.append('category', data.category);
      if (data.description) formData.append('description', data.description);
      if (data.tags) formData.append('tags', JSON.stringify(data.tags));

      const response = await apiClient.post('/patient/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.documents() });
    },
  });
}

// Delete document mutation
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      const response = await apiClient.delete(`/patient/documents/${documentId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.documents() });
    },
  });
}

// Fetch my profile
export function useMyProfile() {
  return useQuery<PatientProfile>({
    queryKey: patientKeys.profile(),
    queryFn: async () => {
      const response = await apiClient.get('/patient/profile');
      return response.data;
    },
  });
}

// Update profile mutation
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<PatientProfile>) => {
      const response = await apiClient.put('/patient/profile', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.profile() });
    },
  });
}

// Fetch available providers
export function useProviders(specialty?: string) {
  return useQuery({
    queryKey: ['providers', specialty],
    queryFn: async () => {
      const params = specialty ? { specialty } : {};
      const response = await apiClient.get('/providers', { params });
      return response.data;
    },
  });
}

// Fetch provider availability
export function useProviderAvailability(providerId: string, date?: string) {
  return useQuery({
    queryKey: ['provider-availability', providerId, date],
    queryFn: async () => {
      const params = date ? { date } : {};
      const response = await apiClient.get(`/providers/${providerId}/availability`, { params });
      return response.data;
    },
    enabled: !!providerId,
  });
}

// Fetch dashboard stats
export function useDashboardStats() {
  return useQuery({
    queryKey: [...patientKeys.all, 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/patient/dashboard/stats');
      return response.data;
    },
  });
}

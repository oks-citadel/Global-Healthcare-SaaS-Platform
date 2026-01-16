import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { getErrorMessage } from '@/lib/api';
import {
  Patient,
  Encounter,
  ProviderAppointment,
  ProviderStats,
  MedicalHistory,
  ClinicalNote,
  PaginatedResponse,
  PatientsListParams,
  EncountersListParams,
  AppointmentsListParams,
  AvailabilitySlot,
  TimeSlot,
} from '@/types/provider';

// Provider Stats
export function useProviderStats() {
  return useQuery<ProviderStats>({
    queryKey: ['provider', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get<ProviderStats>('/provider/stats');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Provider Appointments
export function useProviderAppointments(params?: AppointmentsListParams) {
  return useQuery<PaginatedResponse<ProviderAppointment>>({
    queryKey: ['provider', 'appointments', params],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<ProviderAppointment>>(
        '/provider/appointments',
        { params }
      );
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useProviderAppointment(appointmentId: string) {
  return useQuery<ProviderAppointment>({
    queryKey: ['provider', 'appointments', appointmentId],
    queryFn: async () => {
      const response = await apiClient.get<ProviderAppointment>(
        `/provider/appointments/${appointmentId}`
      );
      return response.data;
    },
    enabled: !!appointmentId,
  });
}

export function useTodayAppointments() {
  const today = new Date().toISOString().split('T')[0];
  return useProviderAppointments({
    fromDate: today,
    toDate: today,
    sortBy: 'dateTime',
    sortOrder: 'asc',
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appointmentId,
      status,
    }: {
      appointmentId: string;
      status: ProviderAppointment['status'];
    }) => {
      const response = await apiClient.patch(
        `/provider/appointments/${appointmentId}/status`,
        { status }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider', 'appointments'] });
      queryClient.invalidateQueries({ queryKey: ['provider', 'stats'] });
    },
  });
}

// Provider Patients
export function useProviderPatients(params?: PatientsListParams) {
  return useQuery<PaginatedResponse<Patient>>({
    queryKey: ['provider', 'patients', params],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<Patient>>(
        '/provider/patients',
        { params }
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProviderPatient(patientId: string) {
  return useQuery<Patient>({
    queryKey: ['provider', 'patients', patientId],
    queryFn: async () => {
      const response = await apiClient.get<Patient>(`/provider/patients/${patientId}`);
      return response.data;
    },
    enabled: !!patientId,
  });
}

export function usePatientMedicalHistory(patientId: string) {
  return useQuery<MedicalHistory>({
    queryKey: ['provider', 'patients', patientId, 'medical-history'],
    queryFn: async () => {
      const response = await apiClient.get<MedicalHistory>(
        `/provider/patients/${patientId}/medical-history`
      );
      return response.data;
    },
    enabled: !!patientId,
  });
}

export function usePatientEncounters(patientId: string, params?: EncountersListParams) {
  return useQuery<PaginatedResponse<Encounter>>({
    queryKey: ['provider', 'patients', patientId, 'encounters', params],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<Encounter>>(
        `/provider/patients/${patientId}/encounters`,
        { params }
      );
      return response.data;
    },
    enabled: !!patientId,
  });
}

// Provider Encounters
export function useProviderEncounters(params?: EncountersListParams) {
  return useQuery<PaginatedResponse<Encounter>>({
    queryKey: ['provider', 'encounters', params],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<Encounter>>(
        '/provider/encounters',
        { params }
      );
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useProviderEncounter(encounterId: string) {
  return useQuery<Encounter>({
    queryKey: ['provider', 'encounters', encounterId],
    queryFn: async () => {
      const response = await apiClient.get<Encounter>(
        `/provider/encounters/${encounterId}`
      );
      return response.data;
    },
    enabled: !!encounterId,
  });
}

export function useCreateEncounter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      encounterData: Partial<Encounter>
    ): Promise<Encounter> => {
      const response = await apiClient.post<Encounter>(
        '/provider/encounters',
        encounterData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider', 'encounters'] });
      queryClient.invalidateQueries({ queryKey: ['provider', 'stats'] });
    },
  });
}

export function useUpdateEncounter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      encounterId,
      data,
    }: {
      encounterId: string;
      data: Partial<Encounter>;
    }): Promise<Encounter> => {
      const response = await apiClient.patch<Encounter>(
        `/provider/encounters/${encounterId}`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['provider', 'encounters', variables.encounterId],
      });
      queryClient.invalidateQueries({ queryKey: ['provider', 'encounters'] });
      queryClient.invalidateQueries({ queryKey: ['provider', 'stats'] });
    },
  });
}

export function useStartEncounter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (encounterId: string): Promise<Encounter> => {
      const response = await apiClient.post<Encounter>(
        `/provider/encounters/${encounterId}/start`
      );
      return response.data;
    },
    onSuccess: (_, encounterId) => {
      queryClient.invalidateQueries({
        queryKey: ['provider', 'encounters', encounterId],
      });
      queryClient.invalidateQueries({ queryKey: ['provider', 'encounters'] });
      queryClient.invalidateQueries({ queryKey: ['provider', 'stats'] });
    },
  });
}

export function useEndEncounter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (encounterId: string): Promise<Encounter> => {
      const response = await apiClient.post<Encounter>(
        `/provider/encounters/${encounterId}/end`
      );
      return response.data;
    },
    onSuccess: (_, encounterId) => {
      queryClient.invalidateQueries({
        queryKey: ['provider', 'encounters', encounterId],
      });
      queryClient.invalidateQueries({ queryKey: ['provider', 'encounters'] });
      queryClient.invalidateQueries({ queryKey: ['provider', 'stats'] });
    },
  });
}

// Clinical Notes
export function useEncounterNotes(encounterId: string) {
  return useQuery<ClinicalNote[]>({
    queryKey: ['provider', 'encounters', encounterId, 'notes'],
    queryFn: async () => {
      const response = await apiClient.get<ClinicalNote[]>(
        `/provider/encounters/${encounterId}/notes`
      );
      return response.data;
    },
    enabled: !!encounterId,
  });
}

export function useAddClinicalNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      encounterId,
      note,
    }: {
      encounterId: string;
      note: Partial<ClinicalNote>;
    }): Promise<ClinicalNote> => {
      const response = await apiClient.post<ClinicalNote>(
        `/provider/encounters/${encounterId}/notes`,
        note
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['provider', 'encounters', variables.encounterId, 'notes'],
      });
      queryClient.invalidateQueries({
        queryKey: ['provider', 'encounters', variables.encounterId],
      });
    },
  });
}

export function useUpdateClinicalNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      encounterId,
      noteId,
      note,
    }: {
      encounterId: string;
      noteId: string;
      note: Partial<ClinicalNote>;
    }): Promise<ClinicalNote> => {
      const response = await apiClient.patch<ClinicalNote>(
        `/provider/encounters/${encounterId}/notes/${noteId}`,
        note
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['provider', 'encounters', variables.encounterId, 'notes'],
      });
    },
  });
}

// Provider Schedule
export function useProviderAvailability() {
  return useQuery<AvailabilitySlot[]>({
    queryKey: ['provider', 'availability'],
    queryFn: async () => {
      const response = await apiClient.get<AvailabilitySlot[]>(
        '/provider/availability'
      );
      return response.data;
    },
  });
}

export function useUpdateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      slots: Partial<AvailabilitySlot>[]
    ): Promise<AvailabilitySlot[]> => {
      const response = await apiClient.put<AvailabilitySlot[]>(
        '/provider/availability',
        { slots }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider', 'availability'] });
    },
  });
}

export function useWeeklySchedule(weekStart: string) {
  return useQuery<Record<string, TimeSlot[]>>({
    queryKey: ['provider', 'schedule', weekStart],
    queryFn: async () => {
      const response = await apiClient.get<Record<string, TimeSlot[]>>(
        '/provider/schedule',
        { params: { weekStart } }
      );
      return response.data;
    },
  });
}

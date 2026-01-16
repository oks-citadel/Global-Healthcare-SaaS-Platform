/**
 * Medical Records Hooks
 * Manages patient medical records, prescriptions, and health data
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import {
  MedicalRecord,
  MedicalRecordType,
  MedicalRecordSearchParams,
  Prescription,
  PatientProfile,
  Allergy,
  VitalSigns,
  PaginatedResponse,
} from '../types';

// Fetch medical records with filters
export const useMedicalRecords = (params: MedicalRecordSearchParams = {}) => {
  return useInfiniteQuery({
    queryKey: ['medical-records', params],
    queryFn: async ({ pageParam = 1 }) => {
      const queryParams = new URLSearchParams();

      if (params.type) queryParams.append('type', params.type);
      if (params.status) queryParams.append('status', params.status);
      if (params.providerId) queryParams.append('providerId', params.providerId);
      if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
      if (params.dateTo) queryParams.append('dateTo', params.dateTo);
      if (params.search) queryParams.append('search', params.search);

      queryParams.append('page', String(pageParam));
      queryParams.append('limit', String(params.limit || 20));

      const response = await apiClient.get<PaginatedResponse<MedicalRecord>>(
        `/medical-records?${queryParams.toString()}`
      );
      return response;
    },
    getNextPageParam: (lastPage, pages) => {
      const totalPages = Math.ceil(lastPage.total / (params.limit || 20));
      return pages.length < totalPages ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Fetch single medical record
export const useMedicalRecord = (id: string) => {
  return useQuery({
    queryKey: ['medical-record', id],
    queryFn: async () => {
      const response = await apiClient.get<MedicalRecord>(`/medical-records/${id}`);
      return response;
    },
    enabled: !!id,
  });
};

// Fetch records by type
export const useRecordsByType = (type: MedicalRecordType) => {
  return useQuery({
    queryKey: ['medical-records', 'type', type],
    queryFn: async () => {
      const response = await apiClient.get<MedicalRecord[]>(
        `/medical-records/type/${type}`
      );
      return response;
    },
  });
};

// Fetch lab results
export const useLabResults = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['medical-records', 'lab-results', page, limit],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<MedicalRecord>>(
        `/medical-records?type=lab-result&page=${page}&limit=${limit}`
      );
      return response;
    },
  });
};

// Fetch imaging records
export const useImagingRecords = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['medical-records', 'imaging', page, limit],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<MedicalRecord>>(
        `/medical-records?type=imaging&page=${page}&limit=${limit}`
      );
      return response;
    },
  });
};

// Fetch immunization records
export const useImmunizations = () => {
  return useQuery({
    queryKey: ['medical-records', 'immunizations'],
    queryFn: async () => {
      const response = await apiClient.get<MedicalRecord[]>(
        `/medical-records/immunizations`
      );
      return response;
    },
  });
};

// Download medical record file
export const useDownloadRecord = () => {
  return useMutation({
    mutationFn: async (recordId: string) => {
      const response = await apiClient.get<{ downloadUrl: string }>(
        `/medical-records/${recordId}/download`
      );
      return response;
    },
  });
};

// Share medical record
export const useShareRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      recordId,
      recipientIds,
      expiresAt,
    }: {
      recordId: string;
      recipientIds: string[];
      expiresAt?: string;
    }) => {
      const response = await apiClient.post(`/medical-records/${recordId}/share`, {
        recipientIds,
        expiresAt,
      });
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['medical-record', variables.recordId]
      });
    },
  });
};

// ===== Prescriptions =====

// Fetch prescriptions
export const usePrescriptions = (status?: string) => {
  return useQuery({
    queryKey: ['prescriptions', status],
    queryFn: async () => {
      const params = status ? `?status=${status}` : '';
      const response = await apiClient.get<Prescription[]>(
        `/prescriptions${params}`
      );
      return response;
    },
  });
};

// Fetch single prescription
export const usePrescription = (id: string) => {
  return useQuery({
    queryKey: ['prescription', id],
    queryFn: async () => {
      const response = await apiClient.get<Prescription>(`/prescriptions/${id}`);
      return response;
    },
    enabled: !!id,
  });
};

// Request prescription refill
export const useRequestRefill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prescriptionId: string) => {
      const response = await apiClient.post<Prescription>(
        `/prescriptions/${prescriptionId}/refill`
      );
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      queryClient.setQueryData(['prescription', data.id], data);
    },
  });
};

// Update preferred pharmacy
export const useUpdatePharmacy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      prescriptionId,
      pharmacyId,
    }: {
      prescriptionId: string;
      pharmacyId: string;
    }) => {
      const response = await apiClient.patch<Prescription>(
        `/prescriptions/${prescriptionId}/pharmacy`,
        { pharmacyId }
      );
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      queryClient.setQueryData(['prescription', data.id], data);
    },
  });
};

// Search nearby pharmacies
export const useNearbyPharmacies = (
  latitude: number,
  longitude: number,
  radiusMiles = 10
) => {
  return useQuery({
    queryKey: ['pharmacies', 'nearby', latitude, longitude, radiusMiles],
    queryFn: async () => {
      const response = await apiClient.get<Array<{
        id: string;
        name: string;
        address: string;
        phone: string;
        distance: number;
        hours: string;
      }>>(`/pharmacies/nearby?lat=${latitude}&lng=${longitude}&radius=${radiusMiles}`);
      return response;
    },
    enabled: !!latitude && !!longitude,
  });
};

// ===== Patient Profile & Health Data =====

// Fetch patient profile
export const usePatientProfile = () => {
  return useQuery({
    queryKey: ['patient', 'profile'],
    queryFn: async () => {
      const response = await apiClient.get<PatientProfile>('/patients/profile');
      return response;
    },
  });
};

// Update patient profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<PatientProfile>) => {
      const response = await apiClient.patch<PatientProfile>(
        '/patients/profile',
        data
      );
      return response;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['patient', 'profile'], data);
    },
  });
};

// ===== Allergies =====

// Fetch allergies
export const useAllergies = () => {
  return useQuery({
    queryKey: ['patient', 'allergies'],
    queryFn: async () => {
      const response = await apiClient.get<Allergy[]>('/patients/allergies');
      return response;
    },
  });
};

// Add allergy
export const useAddAllergy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (allergy: Omit<Allergy, 'id'>) => {
      const response = await apiClient.post<Allergy>('/patients/allergies', allergy);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', 'allergies'] });
    },
  });
};

// Remove allergy
export const useRemoveAllergy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (allergyId: string) => {
      await apiClient.delete(`/patients/allergies/${allergyId}`);
      return allergyId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', 'allergies'] });
    },
  });
};

// ===== Vital Signs =====

// Fetch vital signs history
export const useVitalSigns = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['patient', 'vitals', startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await apiClient.get<VitalSigns[]>(
        `/patients/vitals?${params.toString()}`
      );
      return response;
    },
  });
};

// Log vital signs
export const useLogVitals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vitals: Omit<VitalSigns, 'recordedAt'>) => {
      const response = await apiClient.post<VitalSigns>('/patients/vitals', {
        ...vitals,
        recordedAt: new Date().toISOString(),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', 'vitals'] });
    },
  });
};

// ===== Health Summary =====

// Fetch health summary
export const useHealthSummary = () => {
  return useQuery({
    queryKey: ['patient', 'health-summary'],
    queryFn: async () => {
      const response = await apiClient.get<{
        recentRecords: MedicalRecord[];
        activePrescriptions: Prescription[];
        upcomingAppointments: number;
        allergies: Allergy[];
        lastVitals?: VitalSigns;
        dueImmunizations: string[];
      }>('/patients/health-summary');
      return response;
    },
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { getErrorMessage } from '@/lib/api';
import toast from '@/lib/toast';

// Types
export interface MedicalRecord {
  id: string;
  type: 'lab-result' | 'imaging' | 'visit-summary' | 'immunization' | 'prescription' | 'other';
  title: string;
  date: string;
  provider: string;
  providerId?: string;
  status: 'normal' | 'completed' | 'attention' | 'pending' | 'abnormal';
  summary?: string;
  description?: string;
  category?: string;
  tags?: string[];
  documentUrl?: string;
  fileType?: string;
  fileSize?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecordFilters {
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  providerId?: string;
  status?: string;
  search?: string;
}

// Query keys
const medicalRecordsKeys = {
  all: ['medical-records'] as const,
  lists: () => [...medicalRecordsKeys.all, 'list'] as const,
  list: (filters?: MedicalRecordFilters) => [...medicalRecordsKeys.lists(), filters] as const,
  details: () => [...medicalRecordsKeys.all, 'detail'] as const,
  detail: (id: string) => [...medicalRecordsKeys.details(), id] as const,
};

// Fetch medical records with filters
export function useMedicalRecords(filters?: MedicalRecordFilters) {
  return useQuery<MedicalRecord[]>({
    queryKey: medicalRecordsKeys.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/medical-records', {
        params: filters,
      });
      return response.data;
    },
  });
}

// Fetch single medical record
export function useMedicalRecord(id: string) {
  return useQuery<MedicalRecord>({
    queryKey: medicalRecordsKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/medical-records/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Download medical record document
export function useDownloadMedicalRecord() {
  return useMutation({
    mutationFn: async (recordId: string) => {
      const response = await apiClient.get(`/medical-records/${recordId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    },
    onSuccess: (blob, recordId) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `medical-record-${recordId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Medical record downloaded successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Share medical record with provider
export function useShareMedicalRecord() {
  return useMutation({
    mutationFn: async (data: { recordId: string; providerId: string; message?: string }) => {
      const response = await apiClient.post(`/medical-records/${data.recordId}/share`, {
        providerId: data.providerId,
        message: data.message,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Medical record shared successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Delete medical record (if allowed)
export function useDeleteMedicalRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recordId: string) => {
      const response = await apiClient.delete(`/medical-records/${recordId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicalRecordsKeys.lists() });
      toast.success('Medical record deleted successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Fetch medical record statistics
export function useMedicalRecordStats() {
  return useQuery({
    queryKey: [...medicalRecordsKeys.all, 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/medical-records/stats');
      return response.data;
    },
  });
}

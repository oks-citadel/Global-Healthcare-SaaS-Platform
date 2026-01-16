import { apiClient } from '../api-client';
import { Prescription, PaginatedResponse } from '@/types';

export const prescriptionsApi = {
  getPrescriptions: async (
    page = 1,
    pageSize = 20,
    patientId?: string
  ): Promise<PaginatedResponse<Prescription>> => {
    return apiClient.get<PaginatedResponse<Prescription>>('/prescriptions', {
      params: { page, pageSize, patientId },
    });
  },

  getPrescriptionById: async (id: string): Promise<Prescription> => {
    return apiClient.get<Prescription>(`/prescriptions/${id}`);
  },

  createPrescription: async (
    data: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt' | 'isSent' | 'sentAt'>
  ): Promise<Prescription> => {
    return apiClient.post<Prescription>('/prescriptions', data);
  },

  updatePrescription: async (id: string, data: Partial<Prescription>): Promise<Prescription> => {
    return apiClient.put<Prescription>(`/prescriptions/${id}`, data);
  },

  sendPrescription: async (id: string, pharmacyId: string): Promise<Prescription> => {
    return apiClient.post<Prescription>(`/prescriptions/${id}/send`, { pharmacyId });
  },

  cancelPrescription: async (id: string, reason: string): Promise<Prescription> => {
    return apiClient.patch<Prescription>(`/prescriptions/${id}/cancel`, { reason });
  },

  getPatientPrescriptions: async (patientId: string): Promise<Prescription[]> => {
    return apiClient.get<Prescription[]>(`/patients/${patientId}/prescriptions`);
  },
};

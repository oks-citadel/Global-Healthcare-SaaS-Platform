import { apiClient } from '../api-client';
import { LabOrder, PaginatedResponse } from '@/types';

export const labOrdersApi = {
  getLabOrders: async (
    page = 1,
    pageSize = 20,
    patientId?: string
  ): Promise<PaginatedResponse<LabOrder>> => {
    return apiClient.get<PaginatedResponse<LabOrder>>('/lab-orders', {
      params: { page, pageSize, patientId },
    });
  },

  getLabOrderById: async (id: string): Promise<LabOrder> => {
    return apiClient.get<LabOrder>(`/lab-orders/${id}`);
  },

  createLabOrder: async (
    data: Omit<LabOrder, 'id' | 'createdAt' | 'updatedAt' | 'results'>
  ): Promise<LabOrder> => {
    return apiClient.post<LabOrder>('/lab-orders', data);
  },

  updateLabOrder: async (id: string, data: Partial<LabOrder>): Promise<LabOrder> => {
    return apiClient.put<LabOrder>(`/lab-orders/${id}`, data);
  },

  cancelLabOrder: async (id: string, reason: string): Promise<LabOrder> => {
    return apiClient.patch<LabOrder>(`/lab-orders/${id}/cancel`, { reason });
  },

  getPatientLabOrders: async (patientId: string): Promise<LabOrder[]> => {
    return apiClient.get<LabOrder[]>(`/patients/${patientId}/lab-orders`);
  },

  getPendingResults: async (): Promise<LabOrder[]> => {
    return apiClient.get<LabOrder[]>('/lab-orders/pending-results');
  },
};

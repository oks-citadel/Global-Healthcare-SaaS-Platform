import { apiClient } from '../api-client';
import { Patient, PaginatedResponse, PatientFilters, MedicalHistory } from '@/types';

export const patientsApi = {
  getPatients: async (
    page = 1,
    pageSize = 20,
    filters?: PatientFilters
  ): Promise<PaginatedResponse<Patient>> => {
    return apiClient.get<PaginatedResponse<Patient>>('/patients', {
      params: { page, pageSize, ...filters },
    });
  },

  getPatientById: async (id: string): Promise<Patient> => {
    return apiClient.get<Patient>(`/patients/${id}`);
  },

  searchPatients: async (query: string): Promise<Patient[]> => {
    return apiClient.get<Patient[]>('/patients/search', {
      params: { q: query },
    });
  },

  getMedicalHistory: async (patientId: string): Promise<MedicalHistory> => {
    return apiClient.get<MedicalHistory>(`/patients/${patientId}/medical-history`);
  },

  updatePatient: async (id: string, data: Partial<Patient>): Promise<Patient> => {
    return apiClient.put<Patient>(`/patients/${id}`, data);
  },

  createPatient: async (data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> => {
    return apiClient.post<Patient>('/patients', data);
  },
};

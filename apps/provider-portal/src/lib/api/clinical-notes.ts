import { apiClient } from '../api-client';
import { SOAPNote, PaginatedResponse } from '@/types';

export const clinicalNotesApi = {
  getNotes: async (
    page = 1,
    pageSize = 20,
    patientId?: string
  ): Promise<PaginatedResponse<SOAPNote>> => {
    return apiClient.get<PaginatedResponse<SOAPNote>>('/clinical-notes', {
      params: { page, pageSize, patientId },
    });
  },

  getNoteById: async (id: string): Promise<SOAPNote> => {
    return apiClient.get<SOAPNote>(`/clinical-notes/${id}`);
  },

  createNote: async (
    data: Omit<SOAPNote, 'id' | 'createdAt' | 'updatedAt' | 'isSigned' | 'signedAt'>
  ): Promise<SOAPNote> => {
    return apiClient.post<SOAPNote>('/clinical-notes', data);
  },

  updateNote: async (id: string, data: Partial<SOAPNote>): Promise<SOAPNote> => {
    return apiClient.put<SOAPNote>(`/clinical-notes/${id}`, data);
  },

  signNote: async (id: string): Promise<SOAPNote> => {
    return apiClient.post<SOAPNote>(`/clinical-notes/${id}/sign`);
  },

  getPatientNotes: async (patientId: string): Promise<SOAPNote[]> => {
    return apiClient.get<SOAPNote[]>(`/patients/${patientId}/clinical-notes`);
  },

  uploadAttachment: async (noteId: string, file: File): Promise<SOAPNote> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<SOAPNote>(`/clinical-notes/${noteId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

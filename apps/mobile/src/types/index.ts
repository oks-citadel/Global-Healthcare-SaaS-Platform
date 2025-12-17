export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'patient' | 'doctor';
  phone?: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone?: string;
  avatar?: string;
  rating?: number;
  bio?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctor?: Doctor;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  reason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentData {
  doctorId: string;
  date: string;
  time: string;
  reason?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

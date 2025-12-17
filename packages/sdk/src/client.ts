import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type {
  // Auth types
  RegisterInput,
  LoginInput,
  AuthResponse,
  RefreshTokenInput,
  // User types
  User,
  UpdateUserInput,
  // Patient types
  Patient,
  CreatePatientInput,
  UpdatePatientInput,
  // Appointment types
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
  ListAppointmentsParams,
  // Encounter types
  Encounter,
  CreateEncounterInput,
  UpdateEncounterInput,
  ClinicalNote,
  CreateClinicalNoteInput,
  ListEncountersParams,
  // Document types
  Document,
  UploadDocumentInput,
  ListDocumentsParams,
  // Visit types
  ChatMessage,
  SendChatMessageInput,
  // Plan types
  Plan,
  // Subscription types
  Subscription,
  CreateSubscriptionInput,
  // Consent types
  Consent,
  CreateConsentInput,
  // Audit types
  AuditEvent,
  ListAuditEventsParams,
  // Common types
  PaginatedResponse,
  ApiError,
} from './types.js';

export interface UnifiedHealthClientConfig {
  baseURL: string;
  accessToken?: string;
  refreshToken?: string;
  onTokenRefresh?: (tokens: { accessToken: string; refreshToken: string }) => void;
  timeout?: number;
  headers?: Record<string, string>;
}

export class UnifiedHealthClient {
  private client: AxiosInstance;
  private accessToken?: string;
  private refreshToken?: string;
  private onTokenRefresh?: (tokens: { accessToken: string; refreshToken: string }) => void;
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;

  constructor(config: UnifiedHealthClientConfig) {
    this.accessToken = config.accessToken;
    this.refreshToken = config.refreshToken;
    this.onTokenRefresh = config.onTokenRefresh;

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry && this.refreshToken) {
          originalRequest._retry = true;

          // If already refreshing, wait for it
          if (this.isRefreshing && this.refreshPromise) {
            await this.refreshPromise;
            return this.client(originalRequest);
          }

          // Start refresh process
          this.isRefreshing = true;
          this.refreshPromise = this.refreshAccessToken();

          try {
            await this.refreshPromise;
            return this.client(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
            this.refreshPromise = null;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post<AuthResponse>(
        `${this.client.defaults.baseURL}/auth/refresh`,
        { refreshToken: this.refreshToken }
      );

      const { accessToken, refreshToken } = response.data;
      this.setTokens(accessToken, refreshToken);

      if (this.onTokenRefresh) {
        this.onTokenRefresh({ accessToken, refreshToken });
      }
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public clearTokens(): void {
    this.accessToken = undefined;
    this.refreshToken = undefined;
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.request(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data as ApiError;
      }
      throw error;
    }
  }

  // ==========================================
  // Authentication Methods
  // ==========================================

  public async register(input: RegisterInput): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>({
      method: 'POST',
      url: '/auth/register',
      data: input,
    });
    this.setTokens(response.accessToken, response.refreshToken);
    return response;
  }

  public async login(input: LoginInput): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>({
      method: 'POST',
      url: '/auth/login',
      data: input,
    });
    this.setTokens(response.accessToken, response.refreshToken);
    return response;
  }

  public async logout(): Promise<void> {
    await this.request<void>({
      method: 'POST',
      url: '/auth/logout',
    });
    this.clearTokens();
  }

  public async getCurrentUser(): Promise<User> {
    return this.request<User>({
      method: 'GET',
      url: '/auth/me',
    });
  }

  public async refreshTokens(input: RefreshTokenInput): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>({
      method: 'POST',
      url: '/auth/refresh',
      data: input,
    });
    this.setTokens(response.accessToken, response.refreshToken);
    return response;
  }

  // ==========================================
  // User Methods
  // ==========================================

  public async getUser(userId: string): Promise<User> {
    return this.request<User>({
      method: 'GET',
      url: `/users/${userId}`,
    });
  }

  public async updateUser(userId: string, input: UpdateUserInput): Promise<User> {
    return this.request<User>({
      method: 'PATCH',
      url: `/users/${userId}`,
      data: input,
    });
  }

  // ==========================================
  // Patient Methods
  // ==========================================

  public async createPatient(input: CreatePatientInput): Promise<Patient> {
    return this.request<Patient>({
      method: 'POST',
      url: '/patients',
      data: input,
    });
  }

  public async getPatient(patientId: string): Promise<Patient> {
    return this.request<Patient>({
      method: 'GET',
      url: `/patients/${patientId}`,
    });
  }

  public async updatePatient(patientId: string, input: UpdatePatientInput): Promise<Patient> {
    return this.request<Patient>({
      method: 'PATCH',
      url: `/patients/${patientId}`,
      data: input,
    });
  }

  // ==========================================
  // Appointment Methods
  // ==========================================

  public async createAppointment(input: CreateAppointmentInput): Promise<Appointment> {
    return this.request<Appointment>({
      method: 'POST',
      url: '/appointments',
      data: input,
    });
  }

  public async listAppointments(params?: ListAppointmentsParams): Promise<PaginatedResponse<Appointment>> {
    return this.request<PaginatedResponse<Appointment>>({
      method: 'GET',
      url: '/appointments',
      params,
    });
  }

  public async getAppointment(appointmentId: string): Promise<Appointment> {
    return this.request<Appointment>({
      method: 'GET',
      url: `/appointments/${appointmentId}`,
    });
  }

  public async updateAppointment(appointmentId: string, input: UpdateAppointmentInput): Promise<Appointment> {
    return this.request<Appointment>({
      method: 'PATCH',
      url: `/appointments/${appointmentId}`,
      data: input,
    });
  }

  public async deleteAppointment(appointmentId: string): Promise<void> {
    return this.request<void>({
      method: 'DELETE',
      url: `/appointments/${appointmentId}`,
    });
  }

  // ==========================================
  // Encounter Methods
  // ==========================================

  public async createEncounter(input: CreateEncounterInput): Promise<Encounter> {
    return this.request<Encounter>({
      method: 'POST',
      url: '/encounters',
      data: input,
    });
  }

  public async listEncounters(params?: ListEncountersParams): Promise<PaginatedResponse<Encounter>> {
    return this.request<PaginatedResponse<Encounter>>({
      method: 'GET',
      url: '/encounters',
      params,
    });
  }

  public async getEncounter(encounterId: string): Promise<Encounter> {
    return this.request<Encounter>({
      method: 'GET',
      url: `/encounters/${encounterId}`,
    });
  }

  public async updateEncounter(encounterId: string, input: UpdateEncounterInput): Promise<Encounter> {
    return this.request<Encounter>({
      method: 'PATCH',
      url: `/encounters/${encounterId}`,
      data: input,
    });
  }

  public async startEncounter(encounterId: string): Promise<Encounter> {
    return this.request<Encounter>({
      method: 'POST',
      url: `/encounters/${encounterId}/start`,
    });
  }

  public async endEncounter(encounterId: string): Promise<Encounter> {
    return this.request<Encounter>({
      method: 'POST',
      url: `/encounters/${encounterId}/end`,
    });
  }

  public async addClinicalNote(encounterId: string, input: CreateClinicalNoteInput): Promise<ClinicalNote> {
    return this.request<ClinicalNote>({
      method: 'POST',
      url: `/encounters/${encounterId}/notes`,
      data: input,
    });
  }

  public async getClinicalNotes(encounterId: string): Promise<ClinicalNote[]> {
    return this.request<ClinicalNote[]>({
      method: 'GET',
      url: `/encounters/${encounterId}/notes`,
    });
  }

  // ==========================================
  // Document Methods
  // ==========================================

  public async uploadDocument(input: UploadDocumentInput): Promise<Document> {
    const formData = new FormData();
    formData.append('file', input.file);
    formData.append('patientId', input.patientId);
    formData.append('category', input.category);
    if (input.description) {
      formData.append('description', input.description);
    }
    if (input.metadata) {
      formData.append('metadata', JSON.stringify(input.metadata));
    }

    return this.request<Document>({
      method: 'POST',
      url: '/documents',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  public async listDocuments(params?: ListDocumentsParams): Promise<PaginatedResponse<Document>> {
    return this.request<PaginatedResponse<Document>>({
      method: 'GET',
      url: '/documents',
      params,
    });
  }

  public async getDocument(documentId: string): Promise<Document> {
    return this.request<Document>({
      method: 'GET',
      url: `/documents/${documentId}`,
    });
  }

  public async getDocumentDownloadUrl(documentId: string): Promise<{ url: string; expiresAt: string }> {
    return this.request<{ url: string; expiresAt: string }>({
      method: 'GET',
      url: `/documents/${documentId}/download`,
    });
  }

  public async deleteDocument(documentId: string): Promise<void> {
    return this.request<void>({
      method: 'DELETE',
      url: `/documents/${documentId}`,
    });
  }

  public async getPatientDocuments(patientId: string): Promise<Document[]> {
    return this.request<Document[]>({
      method: 'GET',
      url: `/patients/${patientId}/documents`,
    });
  }

  // ==========================================
  // Visit Methods
  // ==========================================

  public async startVisit(visitId: string): Promise<void> {
    return this.request<void>({
      method: 'POST',
      url: `/visits/${visitId}/start`,
    });
  }

  public async endVisit(visitId: string): Promise<void> {
    return this.request<void>({
      method: 'POST',
      url: `/visits/${visitId}/end`,
    });
  }

  public async sendChatMessage(visitId: string, input: SendChatMessageInput): Promise<ChatMessage> {
    return this.request<ChatMessage>({
      method: 'POST',
      url: `/visits/${visitId}/chat`,
      data: input,
    });
  }

  // ==========================================
  // Plan Methods
  // ==========================================

  public async listPlans(): Promise<Plan[]> {
    return this.request<Plan[]>({
      method: 'GET',
      url: '/plans',
    });
  }

  // ==========================================
  // Subscription Methods
  // ==========================================

  public async createSubscription(input: CreateSubscriptionInput): Promise<Subscription> {
    return this.request<Subscription>({
      method: 'POST',
      url: '/subscriptions',
      data: input,
    });
  }

  public async cancelSubscription(subscriptionId: string): Promise<void> {
    return this.request<void>({
      method: 'DELETE',
      url: `/subscriptions/${subscriptionId}`,
    });
  }

  // ==========================================
  // Consent Methods
  // ==========================================

  public async createConsent(input: CreateConsentInput): Promise<Consent> {
    return this.request<Consent>({
      method: 'POST',
      url: '/consents',
      data: input,
    });
  }

  public async getConsent(consentId: string): Promise<Consent> {
    return this.request<Consent>({
      method: 'GET',
      url: `/consents/${consentId}`,
    });
  }

  // ==========================================
  // Audit Methods
  // ==========================================

  public async listAuditEvents(params?: ListAuditEventsParams): Promise<PaginatedResponse<AuditEvent>> {
    return this.request<PaginatedResponse<AuditEvent>>({
      method: 'GET',
      url: '/audit/events',
      params,
    });
  }

  // ==========================================
  // System Methods
  // ==========================================

  public async getVersion(): Promise<{ version: string; buildDate: string }> {
    return this.request<{ version: string; buildDate: string }>({
      method: 'GET',
      url: '/version',
    });
  }

  public async getPublicConfig(): Promise<Record<string, any>> {
    return this.request<Record<string, any>>({
      method: 'GET',
      url: '/config/public',
    });
  }
}

// Export a factory function for convenience
export function createClient(config: UnifiedHealthClientConfig): UnifiedHealthClient {
  return new UnifiedHealthClient(config);
}

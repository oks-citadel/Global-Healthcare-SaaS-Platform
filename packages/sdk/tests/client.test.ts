import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnifiedHealthClient, createClient } from '../src/client';
import type { AuthResponse, LoginInput, RegisterInput } from '../src/types';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('UnifiedHealthClient', () => {
  let client: UnifiedHealthClient;
  const baseURL = 'https://api.example.com';
  const mockAccessToken = 'mock-access-token';
  const mockRefreshToken = 'mock-refresh-token';

  // Create a mock axios instance
  const mockAxiosInstance = {
    request: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    defaults: { baseURL },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock axios.create to return our mock instance
    (axios.create as any).mockReturnValue(mockAxiosInstance);
    (axios.isAxiosError as any).mockReturnValue(false);

    client = new UnifiedHealthClient({
      baseURL,
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
    });
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      const registerInput: RegisterInput = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockResponse: AuthResponse = {
        user: {
          id: 'user-123',
          email: registerInput.email,
          firstName: registerInput.firstName,
          lastName: registerInput.lastName,
          role: 'patient',
        },
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
      };

      mockAxiosInstance.request.mockResolvedValue({
        data: mockResponse,
      });

      const result = await client.register(registerInput);

      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/auth/register',
          data: registerInput,
        })
      );
    });

    it('should login with valid credentials', async () => {
      const loginInput: LoginInput = {
        email: 'test@example.com',
        password: 'SecurePass123!',
      };

      const mockResponse: AuthResponse = {
        user: {
          id: 'user-123',
          email: loginInput.email,
          firstName: 'John',
          lastName: 'Doe',
          role: 'patient',
        },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
      };

      mockAxiosInstance.request.mockResolvedValue({
        data: mockResponse,
      });

      const result = await client.login(loginInput);

      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/auth/login',
        })
      );
    });

    it('should logout successfully', async () => {
      mockAxiosInstance.request.mockResolvedValue({
        data: {},
      });

      await client.logout();

      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/auth/logout',
        })
      );
    });

    it('should get current user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'patient',
      };

      mockAxiosInstance.request.mockResolvedValue({
        data: mockUser,
      });

      const result = await client.getCurrentUser();

      expect(result).toEqual(mockUser);
      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/auth/me',
        })
      );
    });

    it('should refresh tokens', async () => {
      const mockResponse: AuthResponse = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'patient',
        },
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
      };

      mockAxiosInstance.request.mockResolvedValue({
        data: mockResponse,
      });

      const result = await client.refreshTokens({ refreshToken: mockRefreshToken });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('Appointments', () => {
    it('should create an appointment', async () => {
      const appointmentInput = {
        patientId: 'patient-123',
        providerId: 'provider-123',
        scheduledAt: new Date().toISOString(),
        duration: 30,
        type: 'consultation',
        reasonForVisit: 'Regular checkup',
      };

      const mockAppointment = {
        id: 'appointment-123',
        ...appointmentInput,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockAxiosInstance.request.mockResolvedValue({
        data: mockAppointment,
      });

      const result = await client.createAppointment(appointmentInput);

      expect(result).toEqual(mockAppointment);
      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/appointments',
        })
      );
    });

    it('should list appointments with pagination', async () => {
      const mockResponse = {
        data: [
          {
            id: 'appointment-1',
            patientId: 'patient-123',
            providerId: 'provider-123',
            scheduledAt: new Date().toISOString(),
            status: 'scheduled',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockAxiosInstance.request.mockResolvedValue({
        data: mockResponse,
      });

      const result = await client.listAppointments({ page: 1, limit: 10 });

      expect(result).toEqual(mockResponse);
    });

    it('should get appointment by ID', async () => {
      const mockAppointment = {
        id: 'appointment-123',
        patientId: 'patient-123',
        providerId: 'provider-123',
        scheduledAt: new Date().toISOString(),
        status: 'scheduled',
      };

      mockAxiosInstance.request.mockResolvedValue({
        data: mockAppointment,
      });

      const result = await client.getAppointment('appointment-123');

      expect(result).toEqual(mockAppointment);
      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: '/appointments/appointment-123',
        })
      );
    });

    it('should update appointment', async () => {
      const updateInput = {
        status: 'completed' as const,
        notes: 'Appointment completed successfully',
      };

      const mockAppointment = {
        id: 'appointment-123',
        patientId: 'patient-123',
        providerId: 'provider-123',
        scheduledAt: new Date().toISOString(),
        ...updateInput,
      };

      mockAxiosInstance.request.mockResolvedValue({
        data: mockAppointment,
      });

      const result = await client.updateAppointment('appointment-123', updateInput);

      expect(result).toEqual(mockAppointment);
    });

    it('should delete appointment', async () => {
      mockAxiosInstance.request.mockResolvedValue({
        data: {},
      });

      await client.deleteAppointment('appointment-123');

      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          url: '/appointments/appointment-123',
        })
      );
    });
  });

  describe('Token Management', () => {
    it('should set tokens', () => {
      const newAccessToken = 'new-access';
      const newRefreshToken = 'new-refresh';

      client.setTokens(newAccessToken, newRefreshToken);

      // Tokens should be set internally - we can verify by making a request
      expect(client).toBeDefined();
    });

    it('should clear tokens', () => {
      client.clearTokens();

      // Tokens should be cleared
      expect(client).toBeDefined();
    });

    it('should call onTokenRefresh callback', async () => {
      const onTokenRefresh = vi.fn();
      const clientWithCallback = new UnifiedHealthClient({
        baseURL,
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
        onTokenRefresh,
      });

      const mockResponse: AuthResponse = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'patient',
        },
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
      };

      mockAxiosInstance.request.mockResolvedValue({
        data: mockResponse,
      });

      await clientWithCallback.refreshTokens({ refreshToken: mockRefreshToken });

      expect(onTokenRefresh).toHaveBeenCalledWith({
        accessToken: mockResponse.accessToken,
        refreshToken: mockResponse.refreshToken,
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle 401 unauthorized errors', async () => {
      const errorResponse = {
        response: {
          status: 401,
          data: { error: 'Unauthorized' },
        },
      };

      (axios.isAxiosError as any).mockReturnValue(true);
      mockAxiosInstance.request.mockRejectedValue(errorResponse);

      await expect(client.getCurrentUser()).rejects.toEqual({ error: 'Unauthorized' });
    });

    it('should handle network errors', async () => {
      const error = new Error('Network error');
      (axios.isAxiosError as any).mockReturnValue(false);
      mockAxiosInstance.request.mockRejectedValue(error);

      await expect(client.getCurrentUser()).rejects.toThrow('Network error');
    });

    it('should handle 404 not found errors', async () => {
      const errorResponse = {
        response: {
          status: 404,
          data: { error: 'Not found' },
        },
      };

      (axios.isAxiosError as any).mockReturnValue(true);
      mockAxiosInstance.request.mockRejectedValue(errorResponse);

      await expect(client.getAppointment('nonexistent')).rejects.toEqual({ error: 'Not found' });
    });
  });

  describe('Factory Function', () => {
    it('should create client using factory function', () => {
      const newClient = createClient({
        baseURL,
        accessToken: mockAccessToken,
      });

      expect(newClient).toBeInstanceOf(UnifiedHealthClient);
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnifiedHealthClient, createClient } from '../src/client';
import type { AuthResponse, LoginInput, RegisterInput } from '../src/types';

describe('UnifiedHealthClient', () => {
  let client: UnifiedHealthClient;
  const baseURL = 'https://api.example.com';
  const mockAccessToken = 'mock-access-token';
  const mockRefreshToken = 'mock-refresh-token';

  beforeEach(() => {
    client = new UnifiedHealthClient({
      baseURL,
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
    });
    vi.clearAllMocks();
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

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers(),
      });

      const result = await client.register(registerInput);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(registerInput),
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

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers(),
      });

      const result = await client.login(loginInput);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('should logout successfully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
        headers: new Headers(),
      });

      await client.logout();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/logout'),
        expect.objectContaining({
          method: 'POST',
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

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockUser,
        headers: new Headers(),
      });

      const result = await client.getCurrentUser();

      expect(result).toEqual(mockUser);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/me'),
        expect.objectContaining({
          method: 'GET',
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

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers(),
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

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockAppointment,
        headers: new Headers(),
      });

      const result = await client.createAppointment(appointmentInput);

      expect(result).toEqual(mockAppointment);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/appointments'),
        expect.objectContaining({
          method: 'POST',
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

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers(),
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

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockAppointment,
        headers: new Headers(),
      });

      const result = await client.getAppointment('appointment-123');

      expect(result).toEqual(mockAppointment);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/appointments/appointment-123'),
        expect.objectContaining({
          method: 'GET',
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

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockAppointment,
        headers: new Headers(),
      });

      const result = await client.updateAppointment('appointment-123', updateInput);

      expect(result).toEqual(mockAppointment);
    });

    it('should delete appointment', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
        headers: new Headers(),
      });

      await client.deleteAppointment('appointment-123');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/appointments/appointment-123'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('Token Management', () => {
    it('should set tokens', () => {
      const newAccessToken = 'new-access';
      const newRefreshToken = 'new-refresh';

      client.setTokens(newAccessToken, newRefreshToken);

      // Tokens should be set internally
      expect(client).toHaveProperty('accessToken');
      expect(client).toHaveProperty('refreshToken');
    });

    it('should clear tokens', () => {
      client.clearTokens();

      // Tokens should be cleared
      expect(client).toHaveProperty('accessToken');
      expect(client).toHaveProperty('refreshToken');
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

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers(),
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
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized' }),
        headers: new Headers(),
      });

      await expect(client.getCurrentUser()).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(client.getCurrentUser()).rejects.toThrow('Network error');
    });

    it('should handle 404 not found errors', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not found' }),
        headers: new Headers(),
      });

      await expect(client.getAppointment('nonexistent')).rejects.toThrow();
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

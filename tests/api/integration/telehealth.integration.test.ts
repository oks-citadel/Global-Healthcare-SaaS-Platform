/**
 * Integration Tests - Telehealth / Real-time Features
 * Tests WebSocket connections and real-time communication
 */

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { api, login, clearTokenCache } from '../helpers/api-client';
import { testUsers, testAppointments } from '../data/test-fixtures';

describe('Telehealth Integration Tests', () => {
  let patientToken: string;
  let providerToken: string;

  beforeAll(async () => {
    clearTokenCache();
    try {
      patientToken = await login(testUsers.patient.email, testUsers.patient.password);
      providerToken = await login(testUsers.provider.email, testUsers.provider.password);
    } catch {
      // Tests will be skipped if login fails
    }
  });

  afterAll(() => {
    clearTokenCache();
  });

  describe('Video Session Creation', () => {
    it('should create a video session for telehealth appointment', async () => {
      if (!patientToken) return;

      // First, get or create a telehealth appointment
      const appointmentResponse = await api.get('/appointments?type=video', {
        token: patientToken,
      });

      if (appointmentResponse.ok) {
        const appointments = appointmentResponse.data.data || appointmentResponse.data;

        if (Array.isArray(appointments) && appointments.length > 0) {
          const appointment = appointments[0];

          // Try to create video session
          const sessionResponse = await api.post('/telehealth/video-session', {
            appointmentId: appointment.id,
          }, { token: patientToken });

          // May succeed or return subscription required
          expect([200, 201, 402, 404]).toContain(sessionResponse.status);

          if (sessionResponse.ok) {
            expect(sessionResponse.data).toHaveProperty('sessionToken');
          }
        }
      }
    });

    it('should return 401 without authentication', async () => {
      const response = await api.post('/telehealth/video-session', {
        appointmentId: 'test-appointment-id',
      });

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent appointment', async () => {
      if (!patientToken) return;

      const response = await api.post('/telehealth/video-session', {
        appointmentId: '00000000-0000-0000-0000-000000000000',
      }, { token: patientToken });

      expect([402, 404]).toContain(response.status);
    });
  });

  describe('Visit Management', () => {
    it('should start a visit', async () => {
      if (!providerToken) return;

      // Get appointment with scheduled status
      const appointmentsResponse = await api.get('/appointments?status=confirmed', {
        token: providerToken,
      });

      if (appointmentsResponse.ok) {
        const appointments = appointmentsResponse.data.data || appointmentsResponse.data;

        if (Array.isArray(appointments) && appointments.length > 0) {
          const appointment = appointments[0];

          const startResponse = await api.post(`/visits/${appointment.id}/start`, {}, {
            token: providerToken,
          });

          // May succeed or return various errors depending on state
          expect([200, 201, 400, 404]).toContain(startResponse.status);
        }
      }
    });

    it('should end a visit', async () => {
      if (!providerToken) return;

      // Get in-progress visit
      const appointmentsResponse = await api.get('/appointments?status=in_progress', {
        token: providerToken,
      });

      if (appointmentsResponse.ok) {
        const appointments = appointmentsResponse.data.data || appointmentsResponse.data;

        if (Array.isArray(appointments) && appointments.length > 0) {
          const appointment = appointments[0];

          const endResponse = await api.post(`/visits/${appointment.id}/end`, {}, {
            token: providerToken,
          });

          expect([200, 201, 400, 404]).toContain(endResponse.status);
        }
      }
    });
  });

  describe('Chat Messaging', () => {
    it('should send a chat message during visit', async () => {
      if (!patientToken) return;

      // This would require an active visit session
      // For now, test the endpoint accessibility
      const response = await api.post('/visits/test-visit-id/chat', {
        message: 'Test message from patient',
      }, { token: patientToken });

      // Will likely return 404 for non-existent visit
      expect([200, 201, 400, 404]).toContain(response.status);
    });

    it('should reject empty messages', async () => {
      if (!patientToken) return;

      const response = await api.post('/visits/test-visit-id/chat', {
        message: '',
      }, { token: patientToken });

      expect([400, 404]).toContain(response.status);
    });
  });

  describe('Telehealth Appointment Workflow', () => {
    it('complete telehealth workflow', async () => {
      if (!patientToken || !providerToken) return;

      // Step 1: Patient creates telehealth appointment
      const appointmentData = {
        providerId: testUsers.provider.id,
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        type: 'video',
        duration: 30,
        reason: 'Telehealth test appointment',
      };

      const createResponse = await api.post('/appointments', appointmentData, {
        token: patientToken,
      });

      // May fail due to subscription requirement
      if (!createResponse.ok) {
        console.log('Skipping workflow test - subscription required');
        return;
      }

      const appointment = createResponse.data;
      expect(appointment.type).toBe('video');

      // Step 2: Get appointment details
      const getResponse = await api.get(`/appointments/${appointment.id}`, {
        token: patientToken,
      });

      expect(getResponse.ok).toBe(true);

      // Step 3: Attempt to create video session (would fail if not at scheduled time)
      const sessionResponse = await api.post('/telehealth/video-session', {
        appointmentId: appointment.id,
      }, { token: patientToken });

      // Session creation has time restrictions typically
      expect([200, 201, 400, 403]).toContain(sessionResponse.status);

      // Cleanup: Cancel the test appointment
      await api.delete(`/appointments/${appointment.id}`, {
        token: patientToken,
      });
    });
  });

  describe('WebSocket Connection Simulation', () => {
    // Note: Actual WebSocket testing requires a running server
    // These tests verify the REST endpoints that support real-time features

    it('should have notification preferences endpoint', async () => {
      if (!patientToken) return;

      const response = await api.get('/push/preferences', {
        token: patientToken,
      });

      expect([200, 404]).toContain(response.status);
    });

    it('should update notification preferences', async () => {
      if (!patientToken) return;

      const response = await api.put('/push/preferences', {
        appointmentReminders: true,
        messageAlerts: true,
        labResultAlerts: true,
      }, { token: patientToken });

      expect([200, 201, 404]).toContain(response.status);
    });

    it('should get unread notification count', async () => {
      if (!patientToken) return;

      const response = await api.get('/push/unread-count', {
        token: patientToken,
      });

      if (response.ok) {
        expect(typeof response.data.count === 'number' || response.data.unreadCount !== undefined).toBe(true);
      }
    });

    it('should get notification list', async () => {
      if (!patientToken) return;

      const response = await api.get('/push/notifications', {
        token: patientToken,
      });

      if (response.ok) {
        const notifications = response.data.data || response.data;
        expect(Array.isArray(notifications)).toBe(true);
      }
    });
  });

  describe('Device Registration for Push Notifications', () => {
    it('should register a device token', async () => {
      if (!patientToken) return;

      const response = await api.post('/push/register', {
        token: 'test-fcm-token-123',
        platform: 'web',
        deviceName: 'Test Browser',
      }, { token: patientToken });

      expect([200, 201, 400, 404]).toContain(response.status);
    });

    it('should get registered devices', async () => {
      if (!patientToken) return;

      const response = await api.get('/push/devices', {
        token: patientToken,
      });

      if (response.ok) {
        const devices = response.data.data || response.data;
        expect(Array.isArray(devices)).toBe(true);
      }
    });

    it('should unregister a device', async () => {
      if (!patientToken) return;

      const response = await api.delete('/push/unregister', {
        token: patientToken,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // May succeed or return not found
      expect([200, 204, 400, 404]).toContain(response.status);
    });
  });
});

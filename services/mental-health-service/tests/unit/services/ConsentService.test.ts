/**
 * Unit Tests for ConsentService (42 CFR Part 2 Compliance)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConsentService } from '../../../src/services/ConsentService';
import { mockPrismaClient } from '../helpers/mocks';
import {
  mockConsent,
  mockExpiredConsent,
  mockSubstanceUseConsent,
} from '../helpers/fixtures';

// Mock the Prisma client
vi.mock('../../../src/generated/client', () => ({
  PrismaClient: vi.fn(() => mockPrismaClient()),
}));

describe('ConsentService', () => {
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    mockPrisma = mockPrismaClient();
    vi.clearAllMocks();
  });

  describe('hasValidConsent', () => {
    it('should return true when active non-expired consent exists', async () => {
      mockPrisma.consentRecord.findFirst.mockResolvedValue(mockConsent);

      const result = await ConsentService.hasValidConsent(
        'patient-123',
        'provider-123',
        'treatment'
      );

      expect(result).toBe(true);
    });

    it('should return false when no consent exists', async () => {
      mockPrisma.consentRecord.findFirst.mockResolvedValue(null);

      const result = await ConsentService.hasValidConsent(
        'patient-123',
        'provider-123',
        'treatment'
      );

      expect(result).toBe(false);
    });

    it('should check for active status', async () => {
      mockPrisma.consentRecord.findFirst.mockResolvedValue(null);

      await ConsentService.hasValidConsent('patient-123', 'provider-123');

      const findCall = mockPrisma.consentRecord.findFirst.mock.calls[0][0];
      expect(findCall.where.status).toBe('active');
    });

    it('should check consent not expired', async () => {
      mockPrisma.consentRecord.findFirst.mockResolvedValue(null);

      await ConsentService.hasValidConsent('patient-123', 'provider-123');

      const findCall = mockPrisma.consentRecord.findFirst.mock.calls[0][0];
      expect(findCall.where.OR).toBeDefined();
      // Should check for null expiresAt or future date
      expect(findCall.where.OR).toEqual([
        { expiresAt: null },
        { expiresAt: { gt: expect.any(Date) } },
      ]);
    });

    it('should default consent type to treatment', async () => {
      mockPrisma.consentRecord.findFirst.mockResolvedValue(null);

      await ConsentService.hasValidConsent('patient-123', 'provider-123');

      const findCall = mockPrisma.consentRecord.findFirst.mock.calls[0][0];
      expect(findCall.where.consentType).toBe('treatment');
    });
  });

  describe('canDiscloseSubstanceUse', () => {
    it('should return true when substance use disclosure consent exists', async () => {
      mockPrisma.consentRecord.findFirst.mockResolvedValue(mockSubstanceUseConsent);

      const result = await ConsentService.canDiscloseSubstanceUse(
        'patient-123',
        'provider-123'
      );

      expect(result).toBe(true);
    });

    it('should return false when no substance use consent', async () => {
      mockPrisma.consentRecord.findFirst.mockResolvedValue(null);

      const result = await ConsentService.canDiscloseSubstanceUse(
        'patient-123',
        'provider-123'
      );

      expect(result).toBe(false);
    });

    it('should specifically check substanceUseDisclosure flag', async () => {
      mockPrisma.consentRecord.findFirst.mockResolvedValue(null);

      await ConsentService.canDiscloseSubstanceUse('patient-123', 'provider-123');

      const findCall = mockPrisma.consentRecord.findFirst.mock.calls[0][0];
      expect(findCall.where.substanceUseDisclosure).toBe(true);
    });
  });

  describe('grantConsent', () => {
    it('should create a new consent record', async () => {
      mockPrisma.consentRecord.create.mockResolvedValue(mockConsent);

      const result = await ConsentService.grantConsent({
        patientId: 'patient-123',
        providerId: 'provider-123',
        consentType: 'treatment',
        purpose: 'Mental health treatment',
      });

      expect(mockPrisma.consentRecord.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          patientId: 'patient-123',
          providerId: 'provider-123',
          consentType: 'treatment',
          purpose: 'Mental health treatment',
          status: 'active',
        }),
      });
      expect(result).toBeDefined();
    });

    it('should set grantedAt to current date', async () => {
      mockPrisma.consentRecord.create.mockResolvedValue(mockConsent);

      await ConsentService.grantConsent({
        patientId: 'patient-123',
        providerId: 'provider-123',
        consentType: 'treatment',
        purpose: 'Treatment',
      });

      const createCall = mockPrisma.consentRecord.create.mock.calls[0][0];
      expect(createCall.data.grantedAt).toBeInstanceOf(Date);
    });

    it('should default substanceUseDisclosure to false', async () => {
      mockPrisma.consentRecord.create.mockResolvedValue(mockConsent);

      await ConsentService.grantConsent({
        patientId: 'patient-123',
        providerId: 'provider-123',
        consentType: 'treatment',
        purpose: 'Treatment',
      });

      const createCall = mockPrisma.consentRecord.create.mock.calls[0][0];
      expect(createCall.data.substanceUseDisclosure).toBe(false);
    });

    it('should allow substance use disclosure when specified', async () => {
      mockPrisma.consentRecord.create.mockResolvedValue(mockSubstanceUseConsent);

      await ConsentService.grantConsent({
        patientId: 'patient-123',
        providerId: 'provider-123',
        consentType: 'treatment',
        purpose: 'SUD Treatment',
        substanceUseDisclosure: true,
      });

      const createCall = mockPrisma.consentRecord.create.mock.calls[0][0];
      expect(createCall.data.substanceUseDisclosure).toBe(true);
    });

    it('should set disclosure scope from input', async () => {
      mockPrisma.consentRecord.create.mockResolvedValue(mockConsent);

      await ConsentService.grantConsent({
        patientId: 'patient-123',
        providerId: 'provider-123',
        consentType: 'treatment',
        purpose: 'Treatment',
        disclosureScope: 'treatment',
      });

      const createCall = mockPrisma.consentRecord.create.mock.calls[0][0];
      expect(createCall.data.disclosureScope).toEqual(['treatment']);
    });
  });

  describe('revokeConsent', () => {
    it('should revoke consent successfully', async () => {
      mockPrisma.consentRecord.findUnique.mockResolvedValue(mockConsent);
      mockPrisma.consentRecord.update.mockResolvedValue({
        ...mockConsent,
        status: 'revoked',
        revokedAt: new Date(),
      });

      const result = await ConsentService.revokeConsent('consent-123', 'patient-123');

      expect(mockPrisma.consentRecord.update).toHaveBeenCalledWith({
        where: { id: 'consent-123' },
        data: {
          status: 'revoked',
          revokedAt: expect.any(Date),
        },
      });
      expect(result.status).toBe('revoked');
    });

    it('should throw error when consent not found', async () => {
      mockPrisma.consentRecord.findUnique.mockResolvedValue(null);

      await expect(ConsentService.revokeConsent('non-existent', 'patient-123'))
        .rejects.toThrow('Consent not found or unauthorized');
    });

    it('should throw error when patient ID does not match', async () => {
      mockPrisma.consentRecord.findUnique.mockResolvedValue(mockConsent);

      await expect(ConsentService.revokeConsent('consent-123', 'different-patient'))
        .rejects.toThrow('Consent not found or unauthorized');
    });
  });

  describe('getPatientConsents', () => {
    it('should return all active consents for patient', async () => {
      mockPrisma.consentRecord.findMany.mockResolvedValue([mockConsent, mockSubstanceUseConsent]);

      const result = await ConsentService.getPatientConsents('patient-123');

      expect(mockPrisma.consentRecord.findMany).toHaveBeenCalledWith({
        where: {
          patientId: 'patient-123',
          status: 'active',
        },
        orderBy: { grantedAt: 'desc' },
      });
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no active consents', async () => {
      mockPrisma.consentRecord.findMany.mockResolvedValue([]);

      const result = await ConsentService.getPatientConsents('patient-123');

      expect(result).toHaveLength(0);
    });

    it('should order by grantedAt descending', async () => {
      mockPrisma.consentRecord.findMany.mockResolvedValue([]);

      await ConsentService.getPatientConsents('patient-123');

      const findCall = mockPrisma.consentRecord.findMany.mock.calls[0][0];
      expect(findCall.orderBy.grantedAt).toBe('desc');
    });
  });

  describe('updateExpiredConsents', () => {
    it('should update expired consents to expired status', async () => {
      mockPrisma.consentRecord.updateMany.mockResolvedValue({ count: 5 });

      const result = await ConsentService.updateExpiredConsents();

      expect(mockPrisma.consentRecord.updateMany).toHaveBeenCalledWith({
        where: {
          status: 'active',
          expiresAt: {
            lt: expect.any(Date),
          },
        },
        data: {
          status: 'expired',
        },
      });
      expect(result.count).toBe(5);
    });

    it('should return count of 0 when no expired consents', async () => {
      mockPrisma.consentRecord.updateMany.mockResolvedValue({ count: 0 });

      const result = await ConsentService.updateExpiredConsents();

      expect(result.count).toBe(0);
    });
  });

  describe('validateAccess', () => {
    it('should allow access with valid consent', async () => {
      mockPrisma.consentRecord.findFirst.mockResolvedValue({
        ...mockConsent,
        disclosureScope: ['treatment', '*'],
      });

      const result = await ConsentService.validateAccess(
        'patient-123',
        'provider-123',
        'treatment'
      );

      expect(result.allowed).toBe(true);
      expect(result.reason).toBe('Valid consent found');
      expect(result.consentId).toBe('consent-123');
    });

    it('should deny access without consent', async () => {
      mockPrisma.consentRecord.findFirst.mockResolvedValue(null);

      const result = await ConsentService.validateAccess(
        'patient-123',
        'provider-123',
        'treatment'
      );

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('No valid consent found');
    });

    it('should deny access when resource type not in scope', async () => {
      mockPrisma.consentRecord.findFirst.mockResolvedValue({
        ...mockConsent,
        disclosureScope: ['treatment'],
      });

      const result = await ConsentService.validateAccess(
        'patient-123',
        'provider-123',
        'substance_use'
      );

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Resource type not within consent scope');
    });

    it('should allow access when wildcard scope', async () => {
      mockPrisma.consentRecord.findFirst.mockResolvedValue({
        ...mockConsent,
        disclosureScope: ['*'],
      });

      const result = await ConsentService.validateAccess(
        'patient-123',
        'provider-123',
        'any_resource'
      );

      expect(result.allowed).toBe(true);
    });

    it('should allow access when no scope restrictions', async () => {
      mockPrisma.consentRecord.findFirst.mockResolvedValue({
        ...mockConsent,
        disclosureScope: [],
      });

      const result = await ConsentService.validateAccess(
        'patient-123',
        'provider-123',
        'treatment'
      );

      expect(result.allowed).toBe(true);
    });
  });

  describe('createEmergencyConsent', () => {
    it('should create 72-hour emergency consent', async () => {
      const emergencyConsent = {
        ...mockConsent,
        consentType: 'emergency_contact',
        purpose: 'Emergency: Patient in crisis',
      };
      mockPrisma.consentRecord.create.mockResolvedValue(emergencyConsent);

      const result = await ConsentService.createEmergencyConsent(
        'patient-123',
        'provider-123',
        'Patient in crisis'
      );

      expect(mockPrisma.consentRecord.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          consentType: 'emergency_contact',
          purpose: expect.stringContaining('Emergency'),
          substanceUseDisclosure: false,
        }),
      });
      expect(result).toBeDefined();
    });

    it('should set expiration to 72 hours from now', async () => {
      mockPrisma.consentRecord.create.mockResolvedValue(mockConsent);

      await ConsentService.createEmergencyConsent(
        'patient-123',
        'provider-123',
        'Emergency reason'
      );

      const createCall = mockPrisma.consentRecord.create.mock.calls[0][0];
      const expiresAt = createCall.data.expiresAt;
      const now = new Date();

      // Verify expiration is approximately 72 hours from now
      const hoursDiff = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60);
      expect(hoursDiff).toBeGreaterThan(71);
      expect(hoursDiff).toBeLessThan(73);
    });

    it('should include emergency reason in purpose', async () => {
      mockPrisma.consentRecord.create.mockResolvedValue(mockConsent);

      await ConsentService.createEmergencyConsent(
        'patient-123',
        'provider-123',
        'Suicide risk assessment'
      );

      const createCall = mockPrisma.consentRecord.create.mock.calls[0][0];
      expect(createCall.data.purpose).toContain('Suicide risk assessment');
    });

    it('should not allow substance use disclosure in emergency consent', async () => {
      mockPrisma.consentRecord.create.mockResolvedValue(mockConsent);

      await ConsentService.createEmergencyConsent(
        'patient-123',
        'provider-123',
        'Emergency'
      );

      const createCall = mockPrisma.consentRecord.create.mock.calls[0][0];
      expect(createCall.data.substanceUseDisclosure).toBe(false);
    });
  });
});

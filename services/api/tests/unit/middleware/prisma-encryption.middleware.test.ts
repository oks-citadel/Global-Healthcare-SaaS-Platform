import { describe, it, expect, vi, beforeEach } from 'vitest';

// Set up environment before imports
process.env.FIELD_ENCRYPTION_KEY = 'test-field-encryption-key-32bytes!';

import {
  fieldEncryptionMiddleware,
  createSelectiveEncryptionMiddleware,
  encryptRecord,
  decryptRecord,
} from '../../../src/middleware/prisma-encryption.middleware.js';
import { isEncrypted } from '../../../src/lib/field-encryption.js';

// Mock logger
vi.mock('../../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
  logSecurityEvent: vi.fn(),
}));

describe('Prisma Encryption Middleware', () => {
  describe('fieldEncryptionMiddleware', () => {
    const createMockNext = (result: unknown) => vi.fn().mockResolvedValue(result);

    describe('write operations', () => {
      it('should encrypt data on create', async () => {
        const mockNext = createMockNext({ id: '1', address: 'encrypted' });

        const params = {
          model: 'PatientHome',
          action: 'create',
          args: {
            data: {
              id: '1',
              patientId: 'p1',
              address: '123 Main St',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
            },
          },
          dataPath: [],
          runInTransaction: false,
        };

        await fieldEncryptionMiddleware(params as any, mockNext);

        // Verify next was called
        expect(mockNext).toHaveBeenCalled();

        // Check that data was encrypted before passing to next
        const passedParams = mockNext.mock.calls[0][0];
        expect(isEncrypted(passedParams.args.data.address)).toBe(true);
        expect(isEncrypted(passedParams.args.data.city)).toBe(true);
        expect(isEncrypted(passedParams.args.data.state)).toBe(true);
        expect(isEncrypted(passedParams.args.data.zipCode)).toBe(true);
      });

      it('should encrypt data on update', async () => {
        const mockNext = createMockNext({ id: '1' });

        const params = {
          model: 'PatientHome',
          action: 'update',
          args: {
            where: { id: '1' },
            data: {
              address: '456 Oak Ave',
            },
          },
          dataPath: [],
          runInTransaction: false,
        };

        await fieldEncryptionMiddleware(params as any, mockNext);

        const passedParams = mockNext.mock.calls[0][0];
        expect(isEncrypted(passedParams.args.data.address)).toBe(true);
      });

      it('should encrypt data on upsert', async () => {
        const mockNext = createMockNext({ id: '1' });

        const params = {
          model: 'PatientHome',
          action: 'upsert',
          args: {
            where: { id: '1' },
            create: {
              address: '123 Main St',
              city: 'Boston',
            },
            update: {
              address: '456 Oak Ave',
            },
          },
          dataPath: [],
          runInTransaction: false,
        };

        await fieldEncryptionMiddleware(params as any, mockNext);

        const passedParams = mockNext.mock.calls[0][0];
        expect(isEncrypted(passedParams.args.create.address)).toBe(true);
        expect(isEncrypted(passedParams.args.create.city)).toBe(true);
        expect(isEncrypted(passedParams.args.update.address)).toBe(true);
      });

      it('should encrypt data on createMany', async () => {
        const mockNext = createMockNext({ count: 2 });

        const params = {
          model: 'PatientHome',
          action: 'createMany',
          args: {
            data: [
              { address: '123 Main St', city: 'NYC' },
              { address: '456 Oak Ave', city: 'LA' },
            ],
          },
          dataPath: [],
          runInTransaction: false,
        };

        await fieldEncryptionMiddleware(params as any, mockNext);

        const passedParams = mockNext.mock.calls[0][0];
        expect(isEncrypted(passedParams.args.data[0].address)).toBe(true);
        expect(isEncrypted(passedParams.args.data[1].address)).toBe(true);
      });
    });

    describe('read operations', () => {
      it('should decrypt data on findUnique', async () => {
        // Create encrypted data
        const encryptedRecord = encryptRecord('PatientHome', {
          id: '1',
          address: '123 Main St',
          city: 'New York',
        });

        const mockNext = createMockNext(encryptedRecord);

        const params = {
          model: 'PatientHome',
          action: 'findUnique',
          args: {
            where: { id: '1' },
          },
          dataPath: [],
          runInTransaction: false,
        };

        const result = await fieldEncryptionMiddleware(params as any, mockNext);

        expect((result as any).address).toBe('123 Main St');
        expect((result as any).city).toBe('New York');
      });

      it('should decrypt data on findMany', async () => {
        const encryptedRecords = [
          encryptRecord('PatientHome', { id: '1', address: '123 Main St' }),
          encryptRecord('PatientHome', { id: '2', address: '456 Oak Ave' }),
        ];

        const mockNext = createMockNext(encryptedRecords);

        const params = {
          model: 'PatientHome',
          action: 'findMany',
          args: {},
          dataPath: [],
          runInTransaction: false,
        };

        const result = await fieldEncryptionMiddleware(params as any, mockNext) as any[];

        expect(result[0].address).toBe('123 Main St');
        expect(result[1].address).toBe('456 Oak Ave');
      });

      it('should handle null results', async () => {
        const mockNext = createMockNext(null);

        const params = {
          model: 'PatientHome',
          action: 'findUnique',
          args: { where: { id: 'nonexistent' } },
          dataPath: [],
          runInTransaction: false,
        };

        const result = await fieldEncryptionMiddleware(params as any, mockNext);

        expect(result).toBeNull();
      });
    });

    describe('models without encryption', () => {
      it('should pass through models without encrypted fields', async () => {
        const data = { id: '1', name: 'Test Plan' };
        const mockNext = createMockNext(data);

        const params = {
          model: 'Plan',
          action: 'create',
          args: { data },
          dataPath: [],
          runInTransaction: false,
        };

        await fieldEncryptionMiddleware(params as any, mockNext);

        // Data should be unchanged
        const passedParams = mockNext.mock.calls[0][0];
        expect(passedParams.args.data).toEqual(data);
      });
    });

    describe('global fields', () => {
      it('should encrypt SSN field on any model', async () => {
        const mockNext = createMockNext({ id: '1' });

        const params = {
          model: 'User',
          action: 'create',
          args: {
            data: {
              id: '1',
              ssn: '123-45-6789',
              name: 'John Doe',
            },
          },
          dataPath: [],
          runInTransaction: false,
        };

        await fieldEncryptionMiddleware(params as any, mockNext);

        const passedParams = mockNext.mock.calls[0][0];
        expect(isEncrypted(passedParams.args.data.ssn)).toBe(true);
        expect(passedParams.args.data.name).toBe('John Doe'); // Not encrypted
      });
    });
  });

  describe('createSelectiveEncryptionMiddleware', () => {
    it('should exclude specified models', async () => {
      const middleware = createSelectiveEncryptionMiddleware({
        excludeModels: ['PatientHome'],
      });

      const mockNext = vi.fn().mockResolvedValue({ id: '1' });

      const params = {
        model: 'PatientHome',
        action: 'create',
        args: {
          data: { address: '123 Main St' },
        },
        dataPath: [],
        runInTransaction: false,
      };

      await middleware(params as any, mockNext);

      // Data should be unchanged (not encrypted)
      const passedParams = mockNext.mock.calls[0][0];
      expect(passedParams.args.data.address).toBe('123 Main St');
    });

    it('should only include specified models', async () => {
      const middleware = createSelectiveEncryptionMiddleware({
        includeModels: ['Caregiver'],
      });

      const mockNext = vi.fn().mockResolvedValue({ id: '1' });

      // This model is not in includeModels, should be skipped
      const params = {
        model: 'PatientHome',
        action: 'create',
        args: {
          data: { address: '123 Main St' },
        },
        dataPath: [],
        runInTransaction: false,
      };

      await middleware(params as any, mockNext);

      const passedParams = mockNext.mock.calls[0][0];
      expect(passedParams.args.data.address).toBe('123 Main St');
    });

    it('should add additional fields to encrypt', async () => {
      const middleware = createSelectiveEncryptionMiddleware({
        additionalFields: {
          User: ['customField'],
        },
      });

      const mockNext = vi.fn().mockResolvedValue({ id: '1' });

      const params = {
        model: 'User',
        action: 'create',
        args: {
          data: {
            customField: 'sensitive',
            phone: '555-1234',
          },
        },
        dataPath: [],
        runInTransaction: false,
      };

      await middleware(params as any, mockNext);

      const passedParams = mockNext.mock.calls[0][0];
      expect(isEncrypted(passedParams.args.data.customField)).toBe(true);
      expect(isEncrypted(passedParams.args.data.phone)).toBe(true);
    });

    it('should exclude specified fields', async () => {
      const middleware = createSelectiveEncryptionMiddleware({
        excludeFields: {
          PatientHome: ['city', 'state'],
        },
      });

      const mockNext = vi.fn().mockResolvedValue({ id: '1' });

      const params = {
        model: 'PatientHome',
        action: 'create',
        args: {
          data: {
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
          },
        },
        dataPath: [],
        runInTransaction: false,
      };

      await middleware(params as any, mockNext);

      const passedParams = mockNext.mock.calls[0][0];
      expect(isEncrypted(passedParams.args.data.address)).toBe(true);
      expect(isEncrypted(passedParams.args.data.zipCode)).toBe(true);
      expect(passedParams.args.data.city).toBe('New York'); // Not encrypted
      expect(passedParams.args.data.state).toBe('NY'); // Not encrypted
    });
  });

  describe('encryptRecord / decryptRecord', () => {
    it('should encrypt a single record', () => {
      const record = {
        id: '1',
        address: '123 Main St',
        city: 'NYC',
        zipCode: '10001',
      };

      const encrypted = encryptRecord('PatientHome', record);

      expect(encrypted.id).toBe('1');
      expect(isEncrypted(encrypted.address as string)).toBe(true);
      expect(isEncrypted(encrypted.city as string)).toBe(true);
      expect(isEncrypted(encrypted.zipCode as string)).toBe(true);
    });

    it('should decrypt a single record', () => {
      const original = {
        id: '1',
        address: '123 Main St',
        city: 'NYC',
      };

      const encrypted = encryptRecord('PatientHome', original);
      const decrypted = decryptRecord('PatientHome', encrypted);

      expect(decrypted.address).toBe('123 Main St');
      expect(decrypted.city).toBe('NYC');
    });

    it('should return unchanged for models without encrypted fields', () => {
      const record = {
        id: '1',
        name: 'Test',
      };

      const result = encryptRecord('UnknownModel', record);

      // Global fields like 'ssn' would still be encrypted if present
      // But 'name' is not a global field, so it stays unchanged
      expect(result.name).toBe('Test');
    });
  });
});

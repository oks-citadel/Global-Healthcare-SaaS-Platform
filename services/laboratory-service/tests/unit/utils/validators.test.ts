/**
 * Unit Tests for Validators Utility
 */

import { describe, it, expect } from 'vitest';
import {
  validateReferenceRange,
  validateCriticalValue,
  createOrderSchema,
  updateOrderSchema,
  createResultSchema,
  createSampleSchema,
  createTestCatalogSchema,
} from '../../../src/utils/validators';

describe('Validators', () => {
  describe('validateReferenceRange', () => {
    it('should return normal when value is within range', () => {
      const result = validateReferenceRange(7500, '4500-11000');

      expect(result.isAbnormal).toBe(false);
      expect(result.isCritical).toBe(false);
      expect(result.abnormalFlag).toBe('N');
    });

    it('should return abnormal high when value is above range', () => {
      const result = validateReferenceRange(12000, '4500-11000');

      expect(result.isAbnormal).toBe(true);
      expect(result.isCritical).toBe(false);
      expect(result.abnormalFlag).toBe('H');
    });

    it('should return abnormal low when value is below range', () => {
      const result = validateReferenceRange(3000, '4500-11000');

      expect(result.isAbnormal).toBe(true);
      expect(result.isCritical).toBe(false);
      expect(result.abnormalFlag).toBe('L');
    });

    it('should return critical high when value is significantly above range', () => {
      const result = validateReferenceRange(18000, '4500-11000');

      expect(result.isAbnormal).toBe(true);
      expect(result.isCritical).toBe(true);
      expect(result.abnormalFlag).toBe('HH');
    });

    it('should return critical low when value is significantly below range', () => {
      const result = validateReferenceRange(2000, '4500-11000');

      expect(result.isAbnormal).toBe(true);
      expect(result.isCritical).toBe(true);
      expect(result.abnormalFlag).toBe('LL');
    });

    it('should handle boundary values correctly - at lower bound', () => {
      const result = validateReferenceRange(4500, '4500-11000');

      expect(result.isAbnormal).toBe(false);
      expect(result.isCritical).toBe(false);
    });

    it('should handle boundary values correctly - at upper bound', () => {
      const result = validateReferenceRange(11000, '4500-11000');

      expect(result.isAbnormal).toBe(false);
      expect(result.isCritical).toBe(false);
    });

    it('should handle invalid range format gracefully', () => {
      const result = validateReferenceRange(7500, 'invalid');

      expect(result.isAbnormal).toBe(false);
      expect(result.isCritical).toBe(false);
    });

    it('should handle decimal values in range', () => {
      const result = validateReferenceRange(14.5, '12.0-17.0');

      expect(result.isAbnormal).toBe(false);
    });

    it('should handle ranges with spaces', () => {
      const result = validateReferenceRange(15, '10 - 20');

      expect(result.isAbnormal).toBe(false);
    });
  });

  describe('validateCriticalValue', () => {
    it('should return true when value is below critical low', () => {
      const result = validateCriticalValue(100, 150, 450);

      expect(result).toBe(true);
    });

    it('should return true when value is above critical high', () => {
      const result = validateCriticalValue(500, 150, 450);

      expect(result).toBe(true);
    });

    it('should return false when value is within critical range', () => {
      const result = validateCriticalValue(300, 150, 450);

      expect(result).toBe(false);
    });

    it('should handle undefined critical low', () => {
      const result = validateCriticalValue(300, undefined, 450);

      expect(result).toBe(false);
    });

    it('should handle undefined critical high', () => {
      const result = validateCriticalValue(300, 150, undefined);

      expect(result).toBe(false);
    });

    it('should handle both undefined critical values', () => {
      const result = validateCriticalValue(300, undefined, undefined);

      expect(result).toBe(false);
    });

    it('should handle boundary value at critical low', () => {
      const result = validateCriticalValue(150, 150, 450);

      expect(result).toBe(false);
    });

    it('should handle boundary value at critical high', () => {
      const result = validateCriticalValue(450, 150, 450);

      expect(result).toBe(false);
    });
  });

  describe('createOrderSchema', () => {
    it('should validate a valid order input', () => {
      const validInput = {
        patientId: '123e4567-e89b-12d3-a456-426614174000',
        tests: [
          {
            testCode: 'CBC',
            testName: 'Complete Blood Count',
            category: 'hematology',
          },
        ],
      };

      const result = createOrderSchema.safeParse(validInput);

      expect(result.success).toBe(true);
    });

    it('should require at least one test', () => {
      const invalidInput = {
        patientId: '123e4567-e89b-12d3-a456-426614174000',
        tests: [],
      };

      const result = createOrderSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });

    it('should validate patient ID is a UUID', () => {
      const invalidInput = {
        patientId: 'invalid-uuid',
        tests: [{ testCode: 'CBC', testName: 'CBC', category: 'hematology' }],
      };

      const result = createOrderSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });

    it('should default priority to routine', () => {
      const input = {
        patientId: '123e4567-e89b-12d3-a456-426614174000',
        tests: [{ testCode: 'CBC', testName: 'CBC', category: 'hematology' }],
      };

      const result = createOrderSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.priority).toBe('routine');
      }
    });

    it('should validate priority enum values', () => {
      const invalidInput = {
        patientId: '123e4567-e89b-12d3-a456-426614174000',
        priority: 'invalid',
        tests: [{ testCode: 'CBC', testName: 'CBC', category: 'hematology' }],
      };

      const result = createOrderSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });

    it('should accept valid priority values', () => {
      const priorities = ['routine', 'urgent', 'stat'];

      priorities.forEach(priority => {
        const input = {
          patientId: '123e4567-e89b-12d3-a456-426614174000',
          priority,
          tests: [{ testCode: 'CBC', testName: 'CBC', category: 'hematology' }],
        };

        const result = createOrderSchema.safeParse(input);
        expect(result.success).toBe(true);
      });
    });

    it('should validate category enum values', () => {
      const categories = [
        'hematology', 'biochemistry', 'immunology', 'microbiology',
        'pathology', 'radiology', 'cardiology', 'endocrinology',
        'molecular', 'genetics', 'toxicology', 'other',
      ];

      categories.forEach(category => {
        const input = {
          patientId: '123e4567-e89b-12d3-a456-426614174000',
          tests: [{ testCode: 'TEST', testName: 'Test', category }],
        };

        const result = createOrderSchema.safeParse(input);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('updateOrderSchema', () => {
    it('should validate status update', () => {
      const result = updateOrderSchema.safeParse({ status: 'processing' });

      expect(result.success).toBe(true);
    });

    it('should validate collectedAt date', () => {
      const result = updateOrderSchema.safeParse({
        collectedAt: '2025-01-01T10:00:00Z',
      });

      expect(result.success).toBe(true);
    });

    it('should allow empty update', () => {
      const result = updateOrderSchema.safeParse({});

      expect(result.success).toBe(true);
    });

    it('should validate reportUrl is a valid URL', () => {
      const result = updateOrderSchema.safeParse({
        reportUrl: 'https://example.com/report.pdf',
      });

      expect(result.success).toBe(true);
    });

    it('should reject invalid reportUrl', () => {
      const result = updateOrderSchema.safeParse({
        reportUrl: 'not-a-url',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('createResultSchema', () => {
    it('should validate a valid result input', () => {
      const validInput = {
        testId: '123e4567-e89b-12d3-a456-426614174000',
        componentName: 'White Blood Cells',
        value: '7500',
      };

      const result = createResultSchema.safeParse(validInput);

      expect(result.success).toBe(true);
    });

    it('should require componentName', () => {
      const invalidInput = {
        testId: '123e4567-e89b-12d3-a456-426614174000',
        value: '7500',
      };

      const result = createResultSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });

    it('should require value', () => {
      const invalidInput = {
        testId: '123e4567-e89b-12d3-a456-426614174000',
        componentName: 'WBC',
      };

      const result = createResultSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });

    it('should validate abnormal flag enum', () => {
      const flags = ['H', 'L', 'HH', 'LL', 'A', 'AA', 'N'];

      flags.forEach(flag => {
        const input = {
          testId: '123e4567-e89b-12d3-a456-426614174000',
          componentName: 'WBC',
          value: '7500',
          abnormalFlag: flag,
        };

        const result = createResultSchema.safeParse(input);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid abnormal flag', () => {
      const input = {
        testId: '123e4567-e89b-12d3-a456-426614174000',
        componentName: 'WBC',
        value: '7500',
        abnormalFlag: 'INVALID',
      };

      const result = createResultSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it('should default isAbnormal to false', () => {
      const input = {
        testId: '123e4567-e89b-12d3-a456-426614174000',
        componentName: 'WBC',
        value: '7500',
      };

      const result = createResultSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isAbnormal).toBe(false);
      }
    });
  });

  describe('createSampleSchema', () => {
    it('should validate a valid sample input', () => {
      const validInput = {
        orderId: '123e4567-e89b-12d3-a456-426614174000',
        sampleType: 'whole_blood',
      };

      const result = createSampleSchema.safeParse(validInput);

      expect(result.success).toBe(true);
    });

    it('should validate sample type enum', () => {
      const sampleTypes = [
        'blood_serum', 'blood_plasma', 'whole_blood', 'urine',
        'stool', 'sputum', 'csf', 'tissue', 'swab', 'other',
      ];

      sampleTypes.forEach(sampleType => {
        const input = {
          orderId: '123e4567-e89b-12d3-a456-426614174000',
          sampleType,
        };

        const result = createSampleSchema.safeParse(input);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid sample type', () => {
      const input = {
        orderId: '123e4567-e89b-12d3-a456-426614174000',
        sampleType: 'invalid_type',
      };

      const result = createSampleSchema.safeParse(input);

      expect(result.success).toBe(false);
    });
  });

  describe('createTestCatalogSchema', () => {
    it('should validate a valid test catalog input', () => {
      const validInput = {
        code: 'CBC',
        name: 'Complete Blood Count',
        category: 'hematology',
        sampleType: 'whole_blood',
        price: 50.00,
      };

      const result = createTestCatalogSchema.safeParse(validInput);

      expect(result.success).toBe(true);
    });

    it('should require code', () => {
      const invalidInput = {
        name: 'Complete Blood Count',
        category: 'hematology',
        sampleType: 'whole_blood',
        price: 50.00,
      };

      const result = createTestCatalogSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });

    it('should require positive price', () => {
      const invalidInput = {
        code: 'CBC',
        name: 'Complete Blood Count',
        category: 'hematology',
        sampleType: 'whole_blood',
        price: -10,
      };

      const result = createTestCatalogSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });

    it('should default currency to USD', () => {
      const input = {
        code: 'CBC',
        name: 'Complete Blood Count',
        category: 'hematology',
        sampleType: 'whole_blood',
        price: 50.00,
      };

      const result = createTestCatalogSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.currency).toBe('USD');
      }
    });

    it('should default requiresFasting to false', () => {
      const input = {
        code: 'CBC',
        name: 'Complete Blood Count',
        category: 'hematology',
        sampleType: 'whole_blood',
        price: 50.00,
      };

      const result = createTestCatalogSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.requiresFasting).toBe(false);
      }
    });
  });
});

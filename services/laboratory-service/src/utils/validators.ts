import { z } from 'zod';

export const createOrderSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  encounterId: z.string().uuid('Invalid encounter ID').optional(),
  priority: z.enum(['routine', 'urgent', 'stat']).default('routine'),
  tests: z
    .array(
      z.object({
        testCode: z.string().min(1, 'Test code is required'),
        testName: z.string().min(1, 'Test name is required'),
        category: z.enum([
          'hematology',
          'biochemistry',
          'immunology',
          'microbiology',
          'pathology',
          'radiology',
          'cardiology',
          'endocrinology',
          'molecular',
          'genetics',
          'toxicology',
          'other',
        ]),
      })
    )
    .min(1, 'At least one test is required'),
  clinicalInfo: z.string().optional(),
  diagnosis: z.string().optional(),
});

export const updateOrderSchema = z.object({
  status: z
    .enum(['pending', 'collected', 'processing', 'completed', 'cancelled', 'partial'])
    .optional(),
  collectedAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional(),
  reportUrl: z.string().url().optional(),
});

export const createResultSchema = z.object({
  testId: z.string().uuid('Invalid test ID'),
  componentCode: z.string().optional(),
  componentName: z.string().min(1, 'Component name is required'),
  value: z.string().min(1, 'Value is required'),
  numericValue: z.number().optional(),
  unit: z.string().optional(),
  referenceRange: z.string().optional(),
  isAbnormal: z.boolean().default(false),
  isCritical: z.boolean().default(false),
  abnormalFlag: z.enum(['H', 'L', 'HH', 'LL', 'A', 'AA', 'N']).optional(),
  interpretation: z.string().optional(),
  notes: z.string().optional(),
  performedBy: z.string().optional(),
  verifiedBy: z.string().optional(),
});

export const bulkResultsSchema = z.object({
  testId: z.string().uuid('Invalid test ID'),
  results: z.array(createResultSchema.omit({ testId: true })),
});

export const createSampleSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  sampleType: z.enum([
    'blood_serum',
    'blood_plasma',
    'whole_blood',
    'urine',
    'stool',
    'sputum',
    'csf',
    'tissue',
    'swab',
    'other',
  ]),
  containerType: z.string().optional(),
  volume: z.string().optional(),
  bodySource: z.string().optional(),
  collectedBy: z.string().optional(),
  priority: z.enum(['routine', 'urgent', 'stat']).default('routine'),
  notes: z.string().optional(),
});

export const updateSampleSchema = z.object({
  status: z
    .enum(['pending', 'collected', 'received', 'processing', 'completed', 'rejected', 'disposed'])
    .optional(),
  receivedAt: z.coerce.date().optional(),
  condition: z.string().optional(),
  location: z.string().optional(),
  rejectionReason: z.string().optional(),
  expiresAt: z.coerce.date().optional(),
});

export const createTestCatalogSchema = z.object({
  code: z.string().min(1, 'Test code is required'),
  name: z.string().min(1, 'Test name is required'),
  category: z.enum([
    'hematology',
    'biochemistry',
    'immunology',
    'microbiology',
    'pathology',
    'radiology',
    'cardiology',
    'endocrinology',
    'molecular',
    'genetics',
    'toxicology',
    'other',
  ]),
  loincCode: z.string().optional(),
  description: z.string().optional(),
  methodology: z.string().optional(),
  preparation: z.string().optional(),
  sampleType: z.enum([
    'blood_serum',
    'blood_plasma',
    'whole_blood',
    'urine',
    'stool',
    'sputum',
    'csf',
    'tissue',
    'swab',
    'other',
  ]),
  containerType: z.string().optional(),
  minVolume: z.string().optional(),
  turnaroundTime: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  currency: z.string().default('USD'),
  requiresFasting: z.boolean().default(false),
  requiresConsent: z.boolean().default(false),
  ageRestriction: z.string().optional(),
});

export const createReferenceRangeSchema = z.object({
  componentCode: z.string().optional(),
  componentName: z.string().min(1, 'Component name is required'),
  lowValue: z.number().optional(),
  highValue: z.number().optional(),
  textValue: z.string().optional(),
  unit: z.string().optional(),
  criticalLow: z.number().optional(),
  criticalHigh: z.number().optional(),
  ageMin: z.number().int().min(0).optional(),
  ageMax: z.number().int().min(0).optional(),
  gender: z.enum(['M', 'F']).optional(),
  condition: z.string().optional(),
  interpretation: z.string().optional(),
});

export const filterOrdersSchema = z.object({
  patientId: z.string().uuid().optional(),
  providerId: z.string().uuid().optional(),
  status: z
    .enum(['pending', 'collected', 'processing', 'completed', 'cancelled', 'partial'])
    .optional(),
  priority: z.enum(['routine', 'urgent', 'stat']).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  category: z
    .enum([
      'hematology',
      'biochemistry',
      'immunology',
      'microbiology',
      'pathology',
      'radiology',
      'cardiology',
      'endocrinology',
      'molecular',
      'genetics',
      'toxicology',
      'other',
    ])
    .optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export function validateReferenceRange(value: number, range: string): {
  isAbnormal: boolean;
  isCritical: boolean;
  abnormalFlag?: string;
} {
  // Parse reference range (e.g., "10-20", "< 10", "> 5")
  const rangePattern = /^([\d.]+)\s*-\s*([\d.]+)$/;
  const match = range.match(rangePattern);

  if (match) {
    const low = parseFloat(match[1]);
    const high = parseFloat(match[2]);

    if (value < low) {
      return {
        isAbnormal: true,
        isCritical: value < low * 0.5,
        abnormalFlag: value < low * 0.5 ? 'LL' : 'L',
      };
    }

    if (value > high) {
      return {
        isAbnormal: true,
        isCritical: value > high * 1.5,
        abnormalFlag: value > high * 1.5 ? 'HH' : 'H',
      };
    }

    return { isAbnormal: false, isCritical: false, abnormalFlag: 'N' };
  }

  return { isAbnormal: false, isCritical: false };
}

export function validateCriticalValue(
  value: number,
  criticalLow?: number,
  criticalHigh?: number
): boolean {
  if (criticalLow !== undefined && value < criticalLow) {
    return true;
  }

  if (criticalHigh !== undefined && value > criticalHigh) {
    return true;
  }

  return false;
}

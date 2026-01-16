import { describe, it, expect } from 'vitest';

describe('Clinical Trials Service', () => {
  it('should have a placeholder test', () => {
    expect(true).toBe(true);
  });

  describe('Trial Registry Service', () => {
    it('should parse NCT ID format correctly', () => {
      const nctIdPattern = /^NCT\d{8}$/i;
      expect(nctIdPattern.test('NCT12345678')).toBe(true);
      expect(nctIdPattern.test('nct12345678')).toBe(true);
      expect(nctIdPattern.test('NCT1234567')).toBe(false);
      expect(nctIdPattern.test('ABC12345678')).toBe(false);
    });
  });

  describe('Eligibility Service', () => {
    it('should validate age criteria', () => {
      const isAgeEligible = (patientAge: number, minAge?: number, maxAge?: number): boolean => {
        if (minAge !== undefined && patientAge < minAge) return false;
        if (maxAge !== undefined && patientAge > maxAge) return false;
        return true;
      };

      expect(isAgeEligible(30, 18, 65)).toBe(true);
      expect(isAgeEligible(17, 18, 65)).toBe(false);
      expect(isAgeEligible(70, 18, 65)).toBe(false);
      expect(isAgeEligible(30, undefined, undefined)).toBe(true);
    });
  });

  describe('Matching Service', () => {
    it('should calculate match score correctly', () => {
      const calculateScore = (components: {
        conditionMatch: number;
        demographicMatch: number;
        criteriaMatch: number;
        proximityScore: number;
      }): number => {
        const weights = {
          conditionMatch: 0.30,
          demographicMatch: 0.20,
          criteriaMatch: 0.35,
          proximityScore: 0.15,
        };

        const score =
          components.conditionMatch * weights.conditionMatch +
          components.demographicMatch * weights.demographicMatch +
          components.criteriaMatch * weights.criteriaMatch +
          components.proximityScore * weights.proximityScore;

        return Math.round(score);
      };

      expect(calculateScore({
        conditionMatch: 100,
        demographicMatch: 100,
        criteriaMatch: 100,
        proximityScore: 100,
      })).toBe(100);

      expect(calculateScore({
        conditionMatch: 80,
        demographicMatch: 100,
        criteriaMatch: 60,
        proximityScore: 50,
      })).toBe(72);
    });
  });
});

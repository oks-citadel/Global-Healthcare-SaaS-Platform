/**
 * Unit Tests for AssessmentService
 */

import { describe, it, expect } from 'vitest';
import { AssessmentService } from '../../../src/services/AssessmentService';
import { mockPHQ9Responses, mockGAD7Responses, mockCSSRSResponses, mockCSSRSHighRisk } from '../helpers/fixtures';

describe('AssessmentService', () => {
  describe('PHQ-9 Questions', () => {
    it('should have 9 questions', () => {
      expect(AssessmentService.PHQ9_QUESTIONS).toHaveLength(9);
    });

    it('should have proper question structure', () => {
      const question = AssessmentService.PHQ9_QUESTIONS[0];
      expect(question.id).toBe('phq9_1');
      expect(question.question).toBeDefined();
      expect(question.type).toBe('scale');
      expect(question.options).toHaveLength(4);
    });

    it('should have options with values 0-3', () => {
      const question = AssessmentService.PHQ9_QUESTIONS[0];
      expect(question.options?.map(o => o.value)).toEqual([0, 1, 2, 3]);
    });
  });

  describe('GAD-7 Questions', () => {
    it('should have 7 questions', () => {
      expect(AssessmentService.GAD7_QUESTIONS).toHaveLength(7);
    });

    it('should have proper question structure', () => {
      const question = AssessmentService.GAD7_QUESTIONS[0];
      expect(question.id).toBe('gad7_1');
      expect(question.question).toBeDefined();
      expect(question.type).toBe('scale');
    });
  });

  describe('C-SSRS Questions', () => {
    it('should have 6 questions', () => {
      expect(AssessmentService.CSSRS_QUESTIONS).toHaveLength(6);
    });

    it('should all be yes/no type', () => {
      expect(AssessmentService.CSSRS_QUESTIONS.every(q => q.type === 'yes_no')).toBe(true);
    });
  });

  describe('scorePHQ9', () => {
    it('should return minimal depression for score 0-4', () => {
      const responses = {
        phq9_1: 1, phq9_2: 1, phq9_3: 0, phq9_4: 1,
        phq9_5: 0, phq9_6: 0, phq9_7: 0, phq9_8: 0, phq9_9: 0,
      };
      const result = AssessmentService.scorePHQ9(responses);

      expect(result.totalScore).toBe(3);
      expect(result.severity).toBe('none');
      expect(result.interpretation).toContain('Minimal');
    });

    it('should return mild depression for score 5-9', () => {
      const responses = {
        phq9_1: 2, phq9_2: 1, phq9_3: 1, phq9_4: 1,
        phq9_5: 1, phq9_6: 0, phq9_7: 0, phq9_8: 0, phq9_9: 0,
      };
      const result = AssessmentService.scorePHQ9(responses);

      expect(result.totalScore).toBe(6);
      expect(result.severity).toBe('mild');
      expect(result.interpretation).toContain('Mild');
    });

    it('should return moderate depression for score 10-14', () => {
      const responses = {
        phq9_1: 2, phq9_2: 2, phq9_3: 2, phq9_4: 2,
        phq9_5: 1, phq9_6: 1, phq9_7: 1, phq9_8: 0, phq9_9: 0,
      };
      const result = AssessmentService.scorePHQ9(responses);

      expect(result.totalScore).toBe(11);
      expect(result.severity).toBe('moderate');
      expect(result.interpretation).toContain('Moderate');
    });

    it('should return moderately severe for score 15-19', () => {
      const responses = {
        phq9_1: 3, phq9_2: 3, phq9_3: 2, phq9_4: 2,
        phq9_5: 2, phq9_6: 2, phq9_7: 2, phq9_8: 0, phq9_9: 0,
      };
      const result = AssessmentService.scorePHQ9(responses);

      expect(result.totalScore).toBe(16);
      expect(result.severity).toBe('moderately_severe');
    });

    it('should return severe depression for score 20+', () => {
      const responses = {
        phq9_1: 3, phq9_2: 3, phq9_3: 3, phq9_4: 3,
        phq9_5: 3, phq9_6: 2, phq9_7: 2, phq9_8: 2, phq9_9: 0,
      };
      const result = AssessmentService.scorePHQ9(responses);

      expect(result.totalScore).toBe(21);
      expect(result.severity).toBe('severe');
      expect(result.interpretation).toContain('Severe');
    });

    it('should add suicidal ideation alert when question 9 is positive', () => {
      const responses = {
        phq9_1: 1, phq9_2: 1, phq9_3: 1, phq9_4: 1,
        phq9_5: 1, phq9_6: 1, phq9_7: 1, phq9_8: 1, phq9_9: 2,
      };
      const result = AssessmentService.scorePHQ9(responses);

      expect(result.recommendations[0]).toContain('Suicidal ideation');
    });

    it('should handle missing responses as 0', () => {
      const responses = { phq9_1: 1, phq9_2: 1 };
      const result = AssessmentService.scorePHQ9(responses);

      expect(result.totalScore).toBe(2);
    });

    it('should include appropriate recommendations', () => {
      const result = AssessmentService.scorePHQ9(mockPHQ9Responses);

      expect(result.recommendations).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('scoreGAD7', () => {
    it('should return minimal anxiety for score 0-4', () => {
      const responses = {
        gad7_1: 1, gad7_2: 1, gad7_3: 0, gad7_4: 1,
        gad7_5: 0, gad7_6: 0, gad7_7: 0,
      };
      const result = AssessmentService.scoreGAD7(responses);

      expect(result.totalScore).toBe(3);
      expect(result.severity).toBe('minimal');
      expect(result.interpretation).toContain('Minimal');
    });

    it('should return mild anxiety for score 5-9', () => {
      const responses = {
        gad7_1: 2, gad7_2: 1, gad7_3: 1, gad7_4: 1,
        gad7_5: 1, gad7_6: 1, gad7_7: 0,
      };
      const result = AssessmentService.scoreGAD7(responses);

      expect(result.totalScore).toBe(7);
      expect(result.severity).toBe('mild');
    });

    it('should return moderate anxiety for score 10-14', () => {
      const result = AssessmentService.scoreGAD7(mockGAD7Responses);

      expect(result.totalScore).toBe(11);
      expect(result.severity).toBe('moderate');
      expect(result.interpretation).toContain('Moderate');
    });

    it('should return severe anxiety for score 15+', () => {
      const responses = {
        gad7_1: 3, gad7_2: 3, gad7_3: 3, gad7_4: 3,
        gad7_5: 2, gad7_6: 2, gad7_7: 2,
      };
      const result = AssessmentService.scoreGAD7(responses);

      expect(result.totalScore).toBe(18);
      expect(result.severity).toBe('severe');
    });

    it('should handle missing responses as 0', () => {
      const responses = { gad7_1: 1, gad7_2: 1 };
      const result = AssessmentService.scoreGAD7(responses);

      expect(result.totalScore).toBe(2);
    });
  });

  describe('scoreCSSRS', () => {
    it('should return no risk for all negative responses', () => {
      const result = AssessmentService.scoreCSSRS(mockCSSRSResponses);

      expect(result.totalScore).toBe(0);
      expect(result.severity).toBe('none');
      expect(result.interpretation).toContain('No suicidal ideation');
    });

    it('should return low risk for wish to be dead only', () => {
      const responses = {
        ...mockCSSRSResponses,
        cssrs_1: true,
      };
      const result = AssessmentService.scoreCSSRS(responses);

      expect(result.totalScore).toBe(1);
      expect(result.severity).toBe('mild');
    });

    it('should return moderate risk for suicidal thoughts', () => {
      const responses = {
        ...mockCSSRSResponses,
        cssrs_1: true,
        cssrs_2: true,
      };
      const result = AssessmentService.scoreCSSRS(responses);

      expect(result.totalScore).toBe(2);
      expect(result.severity).toBe('moderate');
    });

    it('should return high risk for suicidal intent', () => {
      const result = AssessmentService.scoreCSSRS(mockCSSRSHighRisk);

      expect(result.totalScore).toBe(4);
      expect(result.severity).toBe('moderately_severe');
      expect(result.recommendations).toContain('IMMEDIATE ACTION REQUIRED');
    });

    it('should return imminent risk for suicidal plan or behavior', () => {
      const responses = {
        cssrs_1: true,
        cssrs_2: true,
        cssrs_3: true,
        cssrs_4: true,
        cssrs_5: true,
        cssrs_6: true,
      };
      const result = AssessmentService.scoreCSSRS(responses);

      expect(result.totalScore).toBe(6);
      expect(result.severity).toBe('severe');
      expect(result.recommendations).toContain('EMERGENCY INTERVENTION REQUIRED');
    });

    it('should include subscores', () => {
      const result = AssessmentService.scoreCSSRS(mockCSSRSHighRisk);

      expect(result.subscores).toBeDefined();
      expect(result.subscores?.riskLevel).toBeDefined();
      expect(result.subscores?.positiveIndicators).toBeDefined();
    });
  });

  describe('getAssessmentQuestions', () => {
    it('should return PHQ9 questions', () => {
      const questions = AssessmentService.getAssessmentQuestions('PHQ9');

      expect(questions).toBe(AssessmentService.PHQ9_QUESTIONS);
      expect(questions).toHaveLength(9);
    });

    it('should return GAD7 questions', () => {
      const questions = AssessmentService.getAssessmentQuestions('GAD7');

      expect(questions).toBe(AssessmentService.GAD7_QUESTIONS);
      expect(questions).toHaveLength(7);
    });

    it('should return empty array for unknown type', () => {
      const questions = AssessmentService.getAssessmentQuestions('UNKNOWN' as any);

      expect(questions).toEqual([]);
    });
  });

  describe('scoreAssessment', () => {
    it('should score PHQ9 assessment', () => {
      const result = AssessmentService.scoreAssessment('PHQ9', mockPHQ9Responses);

      expect(result.totalScore).toBe(11);
      expect(result.severity).toBe('moderate');
    });

    it('should score GAD7 assessment', () => {
      const result = AssessmentService.scoreAssessment('GAD7', mockGAD7Responses);

      expect(result.totalScore).toBe(11);
      expect(result.severity).toBe('moderate');
    });

    it('should return default result for unknown type', () => {
      const result = AssessmentService.scoreAssessment('UNKNOWN' as any, {});

      expect(result.totalScore).toBe(0);
      expect(result.severity).toBe('none');
      expect(result.interpretation).toContain('not implemented');
    });

    it('should filter non-numeric responses', () => {
      const mixedResponses = {
        phq9_1: 2,
        phq9_2: 2,
        some_boolean: true,
        phq9_3: 1,
      };
      const result = AssessmentService.scoreAssessment('PHQ9', mixedResponses as any);

      expect(result.totalScore).toBe(5);
    });
  });

  describe('Clinical Thresholds', () => {
    it('should have PHQ9 thresholds at 5, 10, 15, 20', () => {
      const scores = [4, 5, 9, 10, 14, 15, 19, 20];
      const severities = scores.map(score => {
        const responses: Record<string, number> = {};
        for (let i = 1; i <= 9; i++) responses[`phq9_${i}`] = 0;
        let remaining = score;
        for (let i = 1; i <= 9 && remaining > 0; i++) {
          const value = Math.min(remaining, 3);
          responses[`phq9_${i}`] = value;
          remaining -= value;
        }
        return AssessmentService.scorePHQ9(responses).severity;
      });

      expect(severities[0]).toBe('none');      // 4
      expect(severities[1]).toBe('mild');      // 5
      expect(severities[2]).toBe('mild');      // 9
      expect(severities[3]).toBe('moderate');  // 10
      expect(severities[4]).toBe('moderate');  // 14
      expect(severities[5]).toBe('moderately_severe'); // 15
      expect(severities[6]).toBe('moderately_severe'); // 19
      expect(severities[7]).toBe('severe');    // 20
    });

    it('should have GAD7 thresholds at 5, 10, 15', () => {
      const scores = [4, 5, 9, 10, 14, 15];
      const severities = scores.map(score => {
        const responses: Record<string, number> = {};
        for (let i = 1; i <= 7; i++) responses[`gad7_${i}`] = 0;
        let remaining = score;
        for (let i = 1; i <= 7 && remaining > 0; i++) {
          const value = Math.min(remaining, 3);
          responses[`gad7_${i}`] = value;
          remaining -= value;
        }
        return AssessmentService.scoreGAD7(responses).severity;
      });

      expect(severities[0]).toBe('minimal');  // 4
      expect(severities[1]).toBe('mild');     // 5
      expect(severities[2]).toBe('mild');     // 9
      expect(severities[3]).toBe('moderate'); // 10
      expect(severities[4]).toBe('moderate'); // 14
      expect(severities[5]).toBe('severe');   // 15
    });
  });
});

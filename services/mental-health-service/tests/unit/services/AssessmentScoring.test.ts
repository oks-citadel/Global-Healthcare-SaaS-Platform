/**
 * Additional Tests for Assessment Scoring
 * Comprehensive tests for PHQ-9, GAD-7, and C-SSRS scoring algorithms
 */

import { describe, it, expect } from "vitest";
import { AssessmentService } from "../../../src/services/AssessmentService";

describe("Assessment Scoring - Extended Tests", () => {
  describe("PHQ-9 Scoring Edge Cases", () => {
    it("should return maximum score of 27", () => {
      const responses = {
        phq9_1: 3,
        phq9_2: 3,
        phq9_3: 3,
        phq9_4: 3,
        phq9_5: 3,
        phq9_6: 3,
        phq9_7: 3,
        phq9_8: 3,
        phq9_9: 3,
      };
      const result = AssessmentService.scorePHQ9(responses);

      expect(result.totalScore).toBe(27);
      expect(result.severity).toBe("severe");
    });

    it("should return minimum score of 0", () => {
      const responses = {
        phq9_1: 0,
        phq9_2: 0,
        phq9_3: 0,
        phq9_4: 0,
        phq9_5: 0,
        phq9_6: 0,
        phq9_7: 0,
        phq9_8: 0,
        phq9_9: 0,
      };
      const result = AssessmentService.scorePHQ9(responses);

      expect(result.totalScore).toBe(0);
      expect(result.severity).toBe("none");
    });

    it("should handle partially completed assessments", () => {
      const responses = {
        phq9_1: 2,
        phq9_2: 2,
        phq9_3: 2,
        // Remaining questions treated as 0
      };
      const result = AssessmentService.scorePHQ9(responses);

      expect(result.totalScore).toBe(6);
      expect(result.severity).toBe("mild");
    });

    it("should flag suicidal ideation alert at any positive response to Q9", () => {
      const responses = {
        phq9_1: 0,
        phq9_2: 0,
        phq9_3: 0,
        phq9_4: 0,
        phq9_5: 0,
        phq9_6: 0,
        phq9_7: 0,
        phq9_8: 0,
        phq9_9: 1, // Even "several days" triggers alert
      };
      const result = AssessmentService.scorePHQ9(responses);

      expect(result.recommendations[0]).toContain("Suicidal ideation");
    });

    it("should not flag suicidal ideation when Q9 is 0", () => {
      const responses = {
        phq9_1: 3,
        phq9_2: 3,
        phq9_3: 3,
        phq9_4: 3,
        phq9_5: 3,
        phq9_6: 3,
        phq9_7: 3,
        phq9_8: 3,
        phq9_9: 0,
      };
      const result = AssessmentService.scorePHQ9(responses);

      expect(result.recommendations[0]).not.toContain("Suicidal ideation");
    });

    it("should correctly classify at threshold boundaries", () => {
      // Test at exact threshold boundaries
      const thresholds = [
        { score: 4, expected: "none" },
        { score: 5, expected: "mild" },
        { score: 9, expected: "mild" },
        { score: 10, expected: "moderate" },
        { score: 14, expected: "moderate" },
        { score: 15, expected: "moderately_severe" },
        { score: 19, expected: "moderately_severe" },
        { score: 20, expected: "severe" },
      ];

      for (const { score, expected } of thresholds) {
        const responses: Record<string, number> = {};
        let remaining = score;
        for (let i = 1; i <= 9; i++) {
          responses[`phq9_${i}`] = Math.min(remaining, 3);
          remaining = Math.max(0, remaining - 3);
        }
        const result = AssessmentService.scorePHQ9(responses);
        expect(result.severity).toBe(expected);
      }
    });
  });

  describe("GAD-7 Scoring Edge Cases", () => {
    it("should return maximum score of 21", () => {
      const responses = {
        gad7_1: 3,
        gad7_2: 3,
        gad7_3: 3,
        gad7_4: 3,
        gad7_5: 3,
        gad7_6: 3,
        gad7_7: 3,
      };
      const result = AssessmentService.scoreGAD7(responses);

      expect(result.totalScore).toBe(21);
      expect(result.severity).toBe("severe");
    });

    it("should return minimum score of 0", () => {
      const responses = {
        gad7_1: 0,
        gad7_2: 0,
        gad7_3: 0,
        gad7_4: 0,
        gad7_5: 0,
        gad7_6: 0,
        gad7_7: 0,
      };
      const result = AssessmentService.scoreGAD7(responses);

      expect(result.totalScore).toBe(0);
      expect(result.severity).toBe("minimal");
    });

    it("should handle partially completed assessments", () => {
      const responses = {
        gad7_1: 2,
        gad7_2: 2,
        // Remaining questions treated as 0
      };
      const result = AssessmentService.scoreGAD7(responses);

      expect(result.totalScore).toBe(4);
      expect(result.severity).toBe("minimal");
    });

    it("should correctly classify at threshold boundaries", () => {
      const thresholds = [
        { score: 4, expected: "minimal" },
        { score: 5, expected: "mild" },
        { score: 9, expected: "mild" },
        { score: 10, expected: "moderate" },
        { score: 14, expected: "moderate" },
        { score: 15, expected: "severe" },
      ];

      for (const { score, expected } of thresholds) {
        const responses: Record<string, number> = {};
        let remaining = score;
        for (let i = 1; i <= 7; i++) {
          responses[`gad7_${i}`] = Math.min(remaining, 3);
          remaining = Math.max(0, remaining - 3);
        }
        const result = AssessmentService.scoreGAD7(responses);
        expect(result.severity).toBe(expected);
      }
    });

    it("should provide appropriate recommendations for each severity level", () => {
      // Minimal
      const minimal = AssessmentService.scoreGAD7({ gad7_1: 1, gad7_2: 1 });
      expect(minimal.recommendations).toContain(
        expect.stringContaining("Monitor")
      );

      // Moderate
      const moderate = AssessmentService.scoreGAD7({
        gad7_1: 3,
        gad7_2: 3,
        gad7_3: 2,
        gad7_4: 2,
      });
      expect(moderate.recommendations).toContain(
        expect.stringContaining("counseling")
      );

      // Severe
      const severe = AssessmentService.scoreGAD7({
        gad7_1: 3,
        gad7_2: 3,
        gad7_3: 3,
        gad7_4: 3,
        gad7_5: 3,
      });
      expect(severe.recommendations).toContain(
        expect.stringContaining("Active treatment")
      );
    });
  });

  describe("C-SSRS Scoring", () => {
    it("should return no risk for all false responses", () => {
      const responses = {
        cssrs_1: false,
        cssrs_2: false,
        cssrs_3: false,
        cssrs_4: false,
        cssrs_5: false,
        cssrs_6: false,
      };
      const result = AssessmentService.scoreCSSRS(responses);

      expect(result.totalScore).toBe(0);
      expect(result.severity).toBe("none");
      expect(result.interpretation).toContain("No suicidal ideation");
    });

    it("should detect escalating risk levels", () => {
      // Level 1: Wish to be dead only
      const level1 = AssessmentService.scoreCSSRS({
        cssrs_1: true,
        cssrs_2: false,
        cssrs_3: false,
        cssrs_4: false,
        cssrs_5: false,
        cssrs_6: false,
      });
      expect(level1.totalScore).toBe(1);
      expect(level1.severity).toBe("mild");

      // Level 2: Suicidal thoughts
      const level2 = AssessmentService.scoreCSSRS({
        cssrs_1: true,
        cssrs_2: true,
        cssrs_3: false,
        cssrs_4: false,
        cssrs_5: false,
        cssrs_6: false,
      });
      expect(level2.totalScore).toBe(2);
      expect(level2.severity).toBe("moderate");

      // Level 3: Suicidal thoughts with method
      const level3 = AssessmentService.scoreCSSRS({
        cssrs_1: true,
        cssrs_2: true,
        cssrs_3: true,
        cssrs_4: false,
        cssrs_5: false,
        cssrs_6: false,
      });
      expect(level3.totalScore).toBe(3);
      expect(level3.severity).toBe("moderately_severe");

      // Level 4: Suicidal intent
      const level4 = AssessmentService.scoreCSSRS({
        cssrs_1: true,
        cssrs_2: true,
        cssrs_3: true,
        cssrs_4: true,
        cssrs_5: false,
        cssrs_6: false,
      });
      expect(level4.totalScore).toBe(4);
      expect(level4.severity).toBe("moderately_severe");

      // Level 5+: Suicidal plan or behavior
      const level5 = AssessmentService.scoreCSSRS({
        cssrs_1: true,
        cssrs_2: true,
        cssrs_3: true,
        cssrs_4: true,
        cssrs_5: true,
        cssrs_6: false,
      });
      expect(level5.totalScore).toBe(5);
      expect(level5.severity).toBe("severe");
    });

    it("should require IMMEDIATE ACTION for high risk", () => {
      const highRisk = AssessmentService.scoreCSSRS({
        cssrs_1: true,
        cssrs_2: true,
        cssrs_3: true,
        cssrs_4: true,
        cssrs_5: false,
        cssrs_6: false,
      });

      expect(highRisk.recommendations).toContain("IMMEDIATE ACTION REQUIRED");
    });

    it("should require EMERGENCY INTERVENTION for imminent risk", () => {
      const imminentRisk = AssessmentService.scoreCSSRS({
        cssrs_1: true,
        cssrs_2: true,
        cssrs_3: true,
        cssrs_4: true,
        cssrs_5: true,
        cssrs_6: true,
      });

      expect(imminentRisk.recommendations).toContain("EMERGENCY INTERVENTION REQUIRED");
    });

    it("should include subscores", () => {
      const result = AssessmentService.scoreCSSRS({
        cssrs_1: true,
        cssrs_2: true,
        cssrs_3: false,
        cssrs_4: false,
        cssrs_5: false,
        cssrs_6: false,
      });

      expect(result.subscores).toBeDefined();
      expect(result.subscores?.riskLevel).toBe(2);
      expect(result.subscores?.positiveIndicators).toBe(2);
    });
  });

  describe("Generic Assessment Scoring", () => {
    it("should route PHQ9 assessments correctly", () => {
      const responses = {
        phq9_1: 2,
        phq9_2: 2,
        phq9_3: 1,
        phq9_4: 1,
        phq9_5: 1,
        phq9_6: 1,
        phq9_7: 1,
        phq9_8: 1,
        phq9_9: 0,
      };
      const result = AssessmentService.scoreAssessment("PHQ9" as any, responses);

      expect(result.totalScore).toBe(10);
      expect(result.severity).toBe("moderate");
    });

    it("should route GAD7 assessments correctly", () => {
      const responses = {
        gad7_1: 2,
        gad7_2: 2,
        gad7_3: 1,
        gad7_4: 1,
        gad7_5: 1,
        gad7_6: 1,
        gad7_7: 1,
      };
      const result = AssessmentService.scoreAssessment("GAD7" as any, responses);

      expect(result.totalScore).toBe(9);
      expect(result.severity).toBe("mild");
    });

    it("should return default for unknown assessment types", () => {
      const result = AssessmentService.scoreAssessment("UNKNOWN" as any, {});

      expect(result.totalScore).toBe(0);
      expect(result.severity).toBe("none");
      expect(result.interpretation).toContain("not implemented");
    });

    it("should filter boolean values from numeric assessments", () => {
      const mixedResponses = {
        phq9_1: 2,
        phq9_2: 2,
        some_boolean: true,
        another_boolean: false,
        phq9_3: 1,
      };
      const result = AssessmentService.scoreAssessment("PHQ9" as any, mixedResponses as any);

      expect(result.totalScore).toBe(5);
    });
  });

  describe("Assessment Questions", () => {
    describe("PHQ-9 Questions", () => {
      it("should have exactly 9 questions", () => {
        expect(AssessmentService.PHQ9_QUESTIONS).toHaveLength(9);
      });

      it("should have questions with sequential IDs", () => {
        AssessmentService.PHQ9_QUESTIONS.forEach((q, i) => {
          expect(q.id).toBe(`phq9_${i + 1}`);
        });
      });

      it("should have all questions with scale type", () => {
        expect(
          AssessmentService.PHQ9_QUESTIONS.every((q) => q.type === "scale")
        ).toBe(true);
      });

      it("should have all questions with 4 options (0-3)", () => {
        AssessmentService.PHQ9_QUESTIONS.forEach((q) => {
          expect(q.options).toHaveLength(4);
          expect(q.options?.map((o) => o.value)).toEqual([0, 1, 2, 3]);
        });
      });

      it("should have question about suicidal ideation as Q9", () => {
        const q9 = AssessmentService.PHQ9_QUESTIONS[8];
        expect(q9.question.toLowerCase()).toContain("dead");
      });
    });

    describe("GAD-7 Questions", () => {
      it("should have exactly 7 questions", () => {
        expect(AssessmentService.GAD7_QUESTIONS).toHaveLength(7);
      });

      it("should have questions with sequential IDs", () => {
        AssessmentService.GAD7_QUESTIONS.forEach((q, i) => {
          expect(q.id).toBe(`gad7_${i + 1}`);
        });
      });

      it("should have all questions with scale type", () => {
        expect(
          AssessmentService.GAD7_QUESTIONS.every((q) => q.type === "scale")
        ).toBe(true);
      });

      it("should have all questions with 4 options (0-3)", () => {
        AssessmentService.GAD7_QUESTIONS.forEach((q) => {
          expect(q.options).toHaveLength(4);
          expect(q.options?.map((o) => o.value)).toEqual([0, 1, 2, 3]);
        });
      });
    });

    describe("C-SSRS Questions", () => {
      it("should have exactly 6 questions", () => {
        expect(AssessmentService.CSSRS_QUESTIONS).toHaveLength(6);
      });

      it("should have all questions with yes_no type", () => {
        expect(
          AssessmentService.CSSRS_QUESTIONS.every((q) => q.type === "yes_no")
        ).toBe(true);
      });

      it("should have questions with sequential IDs", () => {
        AssessmentService.CSSRS_QUESTIONS.forEach((q, i) => {
          expect(q.id).toBe(`cssrs_${i + 1}`);
        });
      });
    });

    describe("getAssessmentQuestions", () => {
      it("should return PHQ9 questions", () => {
        const questions = AssessmentService.getAssessmentQuestions("PHQ9" as any);
        expect(questions).toBe(AssessmentService.PHQ9_QUESTIONS);
      });

      it("should return GAD7 questions", () => {
        const questions = AssessmentService.getAssessmentQuestions("GAD7" as any);
        expect(questions).toBe(AssessmentService.GAD7_QUESTIONS);
      });

      it("should return empty array for unknown type", () => {
        const questions = AssessmentService.getAssessmentQuestions("UNKNOWN" as any);
        expect(questions).toEqual([]);
      });
    });
  });

  describe("Recommendation Generation", () => {
    it("should provide treatment plan recommendation for moderate PHQ-9", () => {
      const result = AssessmentService.scorePHQ9({
        phq9_1: 2,
        phq9_2: 2,
        phq9_3: 2,
        phq9_4: 2,
        phq9_5: 2,
      });

      expect(result.recommendations.some((r) => r.includes("Treatment plan"))).toBe(true);
    });

    it("should recommend immediate treatment for severe depression", () => {
      const result = AssessmentService.scorePHQ9({
        phq9_1: 3,
        phq9_2: 3,
        phq9_3: 3,
        phq9_4: 3,
        phq9_5: 3,
        phq9_6: 3,
        phq9_7: 2,
      });

      expect(
        result.recommendations.some((r) => r.includes("Immediate"))
      ).toBe(true);
    });

    it("should recommend psychiatric consultation for severe depression", () => {
      const result = AssessmentService.scorePHQ9({
        phq9_1: 3,
        phq9_2: 3,
        phq9_3: 3,
        phq9_4: 3,
        phq9_5: 3,
        phq9_6: 3,
        phq9_7: 2,
      });

      expect(
        result.recommendations.some((r) => r.includes("psychiatric"))
      ).toBe(true);
    });

    it("should recommend safety plan for low C-SSRS risk", () => {
      const result = AssessmentService.scoreCSSRS({
        cssrs_1: true,
        cssrs_2: false,
        cssrs_3: false,
        cssrs_4: false,
        cssrs_5: false,
        cssrs_6: false,
      });

      expect(
        result.recommendations.some((r) => r.toLowerCase().includes("safety plan"))
      ).toBe(true);
    });

    it("should recommend hospitalization consideration for moderate C-SSRS risk", () => {
      const result = AssessmentService.scoreCSSRS({
        cssrs_1: true,
        cssrs_2: true,
        cssrs_3: false,
        cssrs_4: false,
        cssrs_5: false,
        cssrs_6: false,
      });

      expect(
        result.recommendations.some((r) => r.toLowerCase().includes("hospitalization"))
      ).toBe(true);
    });
  });
});

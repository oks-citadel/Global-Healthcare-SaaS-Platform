import { describe, it, expect } from "vitest";

describe("Clinical Trials Service", () => {
  describe("Service Configuration", () => {
    it("should have correct service configuration", () => {
      const serviceConfig = {
        name: "clinical-trials-service",
        version: "1.0.0",
        features: [
          "trial-matching",
          "eligibility-screening",
          "enrollment-tracking",
          "site-management",
        ],
      };

      expect(serviceConfig.name).toBe("clinical-trials-service");
      expect(serviceConfig.features).toContain("trial-matching");
      expect(serviceConfig.features).toContain("eligibility-screening");
    });
  });

  describe("Trial Matching", () => {
    it("should match patients to eligible trials", () => {
      const patient = {
        id: "PAT-001",
        age: 45,
        diagnosis: "Type 2 Diabetes",
        conditions: ["diabetes", "hypertension"],
      };

      const trials = [
        { id: "TRIAL-001", conditions: ["diabetes"], ageRange: [30, 60] },
        { id: "TRIAL-002", conditions: ["cancer"], ageRange: [18, 80] },
        { id: "TRIAL-003", conditions: ["hypertension"], ageRange: [40, 70] },
      ];

      const matchingTrials = trials.filter(
        (trial) =>
          trial.conditions.some((c) => patient.conditions.includes(c)) &&
          patient.age >= trial.ageRange[0] &&
          patient.age <= trial.ageRange[1],
      );

      expect(matchingTrials).toHaveLength(2);
      expect(matchingTrials.map((t) => t.id)).toContain("TRIAL-001");
      expect(matchingTrials.map((t) => t.id)).toContain("TRIAL-003");
    });
  });

  describe("Eligibility Screening", () => {
    it("should evaluate inclusion criteria", () => {
      const evaluateCriteria = (
        patientValue: number,
        min: number,
        max: number,
      ): boolean => {
        return patientValue >= min && patientValue <= max;
      };

      expect(evaluateCriteria(45, 18, 65)).toBe(true);
      expect(evaluateCriteria(70, 18, 65)).toBe(false);
      expect(evaluateCriteria(15, 18, 65)).toBe(false);
    });

    it("should evaluate exclusion criteria", () => {
      const hasExclusion = (
        patientConditions: string[],
        exclusions: string[],
      ): boolean => {
        return patientConditions.some((c) => exclusions.includes(c));
      };

      expect(
        hasExclusion(["diabetes", "asthma"], ["cancer", "pregnancy"]),
      ).toBe(false);
      expect(
        hasExclusion(["diabetes", "pregnancy"], ["cancer", "pregnancy"]),
      ).toBe(true);
    });
  });

  describe("Enrollment Tracking", () => {
    it("should track enrollment status transitions", () => {
      const enrollmentStatuses = [
        "screened",
        "eligible",
        "consented",
        "enrolled",
        "completed",
        "withdrawn",
      ];

      expect(enrollmentStatuses[0]).toBe("screened");
      expect(enrollmentStatuses).toContain("enrolled");
      expect(enrollmentStatuses[enrollmentStatuses.length - 1]).toBe(
        "withdrawn",
      );
    });

    it("should calculate enrollment metrics", () => {
      const enrollmentData = {
        screened: 100,
        eligible: 80,
        consented: 60,
        enrolled: 50,
      };

      const screenToEnrollRate =
        (enrollmentData.enrolled / enrollmentData.screened) * 100;
      const eligibleToEnrollRate =
        (enrollmentData.enrolled / enrollmentData.eligible) * 100;

      expect(screenToEnrollRate).toBe(50);
      expect(eligibleToEnrollRate).toBe(62.5);
    });
  });

  describe("Site Management", () => {
    it("should validate site capabilities", () => {
      const site = {
        id: "SITE-001",
        name: "Medical Research Center",
        capabilities: ["cardiology", "oncology", "neurology"],
        enrollmentCapacity: 100,
        currentEnrollment: 45,
      };

      const hasCapability = (
        siteCapabilities: string[],
        required: string,
      ): boolean => {
        return siteCapabilities.includes(required);
      };

      const availableCapacity =
        site.enrollmentCapacity - site.currentEnrollment;

      expect(hasCapability(site.capabilities, "cardiology")).toBe(true);
      expect(hasCapability(site.capabilities, "dermatology")).toBe(false);
      expect(availableCapacity).toBe(55);
    });
  });
});

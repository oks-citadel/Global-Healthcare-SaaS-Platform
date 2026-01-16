import { describe, it, expect } from "vitest";
import { patientService } from "../../../src/services/patient.service.js";
import { NotFoundError, ConflictError } from "../../../src/utils/errors.js";

describe("PatientService", () => {
  const validPatientInput = {
    userId: `user-${Date.now()}`,
    dateOfBirth: "1990-01-15",
    gender: "male" as const,
    bloodType: "A+",
    allergies: ["Penicillin"],
    emergencyContact: {
      name: "Jane Doe",
      phone: "+1234567890",
      relationship: "spouse",
    },
  };

  describe("createPatient", () => {
    it("should create a new patient successfully", async () => {
      const input = {
        ...validPatientInput,
        userId: `user-create-${Date.now()}`,
      };

      const result = await patientService.createPatient(input);

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("medicalRecordNumber");
      expect(result.userId).toBe(input.userId);
      // dateOfBirth is returned as ISO string, check it contains the input date
      expect(result.dateOfBirth).toContain('1990-01-15');
      expect(result.gender).toBe(input.gender);
      expect(result.bloodType).toBe(input.bloodType);
      expect(result.allergies).toEqual(input.allergies);
      expect(result.emergencyContact).toEqual(input.emergencyContact);
    });

    it("should generate a unique medical record number", async () => {
      const input1 = {
        ...validPatientInput,
        userId: `user-mrn1-${Date.now()}`,
      };
      const input2 = {
        ...validPatientInput,
        userId: `user-mrn2-${Date.now()}`,
      };

      const result1 = await patientService.createPatient(input1);
      const result2 = await patientService.createPatient(input2);

      expect(result1.medicalRecordNumber).not.toBe(result2.medicalRecordNumber);
      expect(result1.medicalRecordNumber).toMatch(/^MRN-/);
    });

    it("should throw ConflictError when patient already exists for user", async () => {
      const userId = `user-duplicate-${Date.now()}`;
      const input = { ...validPatientInput, userId };

      await patientService.createPatient(input);

      await expect(patientService.createPatient(input)).rejects.toThrow(
        ConflictError,
      );
    });

    it("should allow optional fields to be omitted", async () => {
      const input = {
        userId: `user-minimal-${Date.now()}`,
        dateOfBirth: "1985-06-20",
        gender: "female" as const,
      };

      const result = await patientService.createPatient(input);

      expect(result.bloodType).toBeNull();
      expect(result.allergies).toEqual([]);
      expect(result.emergencyContact).toBeNull();
    });
  });

  describe("getPatientById", () => {
    it("should return patient by ID", async () => {
      const input = {
        ...validPatientInput,
        userId: `user-get-${Date.now()}`,
      };

      const created = await patientService.createPatient(input);
      const result = await patientService.getPatientById(created.id);

      expect(result.id).toBe(created.id);
      expect(result.userId).toBe(input.userId);
    });

    it("should throw NotFoundError for non-existent patient", async () => {
      await expect(
        patientService.getPatientById("non-existent-id"),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("getPatientByUserId", () => {
    it("should return patient by user ID", async () => {
      const userId = `user-byuserid-${Date.now()}`;
      const input = { ...validPatientInput, userId };

      await patientService.createPatient(input);
      const result = await patientService.getPatientByUserId(userId);

      expect(result).not.toBeNull();
      expect(result?.userId).toBe(userId);
    });

    it("should return null for non-existent user ID", async () => {
      const result =
        await patientService.getPatientByUserId("non-existent-user");
      expect(result).toBeNull();
    });
  });

  describe("updatePatient", () => {
    it("should update patient fields", async () => {
      const input = {
        ...validPatientInput,
        userId: `user-update-${Date.now()}`,
      };

      const created = await patientService.createPatient(input);

      const updateInput = {
        bloodType: "B+",
        allergies: ["Penicillin", "Sulfa"],
      };

      const result = await patientService.updatePatient(
        created.id,
        updateInput,
      );

      expect(result.bloodType).toBe("B+");
      expect(result.allergies).toEqual(["Penicillin", "Sulfa"]);
      expect(result.gender).toBe(input.gender); // Unchanged
    });

    it("should update emergency contact", async () => {
      const input = {
        ...validPatientInput,
        userId: `user-update-ec-${Date.now()}`,
      };

      const created = await patientService.createPatient(input);

      const newContact = {
        name: "John Doe",
        phone: "+0987654321",
        relationship: "brother",
      };

      const result = await patientService.updatePatient(created.id, {
        emergencyContact: newContact,
      });

      expect(result.emergencyContact).toEqual(newContact);
    });

    it("should throw NotFoundError when patient does not exist", async () => {
      await expect(
        patientService.updatePatient("non-existent-id", { bloodType: "O+" }),
      ).rejects.toThrow(NotFoundError);
    });

    it("should update the updatedAt timestamp", async () => {
      const input = {
        ...validPatientInput,
        userId: `user-timestamp-${Date.now()}`,
      };

      const created = await patientService.createPatient(input);
      const originalUpdatedAt = created.updatedAt;

      // Small delay to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated = await patientService.updatePatient(created.id, {
        bloodType: "AB+",
      });

      expect(new Date(updated.updatedAt).getTime()).toBeGreaterThan(
        new Date(originalUpdatedAt).getTime(),
      );
    });
  });
});

import { describe, it, expect } from "vitest";
import { encounterService } from "../../../src/services/encounter.service.js";
import { NotFoundError, BadRequestError } from "../../../src/utils/errors.js";

describe("EncounterService", () => {
  const validEncounterInput = {
    patientId: `patient-${Date.now()}`,
    providerId: `provider-${Date.now()}`,
    type: "virtual" as const,
    reasonForVisit: "Annual checkup",
  };

  describe("createEncounter", () => {
    it("should create a new encounter successfully", async () => {
      const input = {
        ...validEncounterInput,
        patientId: `patient-create-${Date.now()}`,
      };

      const result = await encounterService.createEncounter(
        input,
        input.providerId,
      );

      expect(result).toHaveProperty("id");
      expect(result.patientId).toBe(input.patientId);
      expect(result.providerId).toBe(input.providerId);
      expect(result.type).toBe("virtual");
      expect(result.status).toBe("planned");
      expect(result.startedAt).toBeNull();
      expect(result.endedAt).toBeNull();
      expect(result.notes).toEqual([]);
    });

    it("should accept optional appointmentId", async () => {
      const input = {
        ...validEncounterInput,
        patientId: `patient-appt-${Date.now()}`,
        appointmentId: "appointment-123",
      };

      const result = await encounterService.createEncounter(
        input,
        input.providerId,
      );

      expect(result.appointmentId).toBe("appointment-123");
    });

    it("should create encounter with different types", async () => {
      const types = ["virtual", "in_person", "phone"] as const;

      for (const type of types) {
        const input = {
          ...validEncounterInput,
          patientId: `patient-type-${type}-${Date.now()}`,
          type,
        };

        const result = await encounterService.createEncounter(
          input,
          input.providerId,
        );
        expect(result.type).toBe(type);
      }
    });
  });

  describe("getEncounterById", () => {
    it("should return encounter by ID", async () => {
      const input = {
        ...validEncounterInput,
        patientId: `patient-get-${Date.now()}`,
      };

      const created = await encounterService.createEncounter(
        input,
        input.providerId,
      );
      const result = await encounterService.getEncounterById(created.id);

      expect(result.id).toBe(created.id);
      expect(result.patientId).toBe(input.patientId);
    });

    it("should throw NotFoundError for non-existent encounter", async () => {
      await expect(
        encounterService.getEncounterById("non-existent-id"),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("updateEncounter", () => {
    it("should update encounter status from planned to in_progress", async () => {
      const input = {
        ...validEncounterInput,
        patientId: `patient-update-${Date.now()}`,
      };

      const created = await encounterService.createEncounter(
        input,
        input.providerId,
      );
      const result = await encounterService.updateEncounter(created.id, {
        status: "in_progress",
      });

      expect(result.status).toBe("in_progress");
      expect(result.startedAt).not.toBeNull();
    });

    it("should update encounter status from in_progress to finished", async () => {
      const input = {
        ...validEncounterInput,
        patientId: `patient-finish-${Date.now()}`,
      };

      const created = await encounterService.createEncounter(
        input,
        input.providerId,
      );

      // First transition to in_progress
      await encounterService.updateEncounter(created.id, {
        status: "in_progress",
      });

      // Then to finished
      const result = await encounterService.updateEncounter(created.id, {
        status: "finished",
      });

      expect(result.status).toBe("finished");
      expect(result.endedAt).not.toBeNull();
    });

    it("should throw BadRequestError for invalid status transition", async () => {
      const input = {
        ...validEncounterInput,
        patientId: `patient-invalid-${Date.now()}`,
      };

      const created = await encounterService.createEncounter(
        input,
        input.providerId,
      );

      // Cannot go directly from planned to finished
      await expect(
        encounterService.updateEncounter(created.id, { status: "finished" }),
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw NotFoundError for non-existent encounter", async () => {
      await expect(
        encounterService.updateEncounter("non-existent-id", {
          status: "in_progress",
        }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("addClinicalNote", () => {
    it("should add a clinical note to encounter", async () => {
      const input = {
        ...validEncounterInput,
        patientId: `patient-note-${Date.now()}`,
      };

      const created = await encounterService.createEncounter(
        input,
        input.providerId,
      );

      const noteInput = {
        noteType: "progress" as const,
        content: "Patient reports feeling better.",
      };

      const result = await encounterService.addClinicalNote(
        created.id,
        noteInput,
        "provider-123",
      );

      expect(result).toHaveProperty("id");
      expect(result.encounterId).toBe(created.id);
      expect(result.noteType).toBe("progress");
      expect(result.content).toBe("Patient reports feeling better.");
      expect(result.authorId).toBe("provider-123");
    });

    it("should add multiple notes to the same encounter", async () => {
      const input = {
        ...validEncounterInput,
        patientId: `patient-multi-note-${Date.now()}`,
      };

      const created = await encounterService.createEncounter(
        input,
        input.providerId,
      );

      await encounterService.addClinicalNote(
        created.id,
        { noteType: "assessment" as const, content: "Initial assessment" },
        "provider-123",
      );

      await encounterService.addClinicalNote(
        created.id,
        { noteType: "plan" as const, content: "Treatment plan" },
        "provider-123",
      );

      const notes = await encounterService.getClinicalNotes(created.id);
      expect(notes).toHaveLength(2);
    });

    it("should throw NotFoundError for non-existent encounter", async () => {
      await expect(
        encounterService.addClinicalNote(
          "non-existent-id",
          { noteType: "progress" as const, content: "Test" },
          "provider-123",
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw BadRequestError when adding note to cancelled encounter", async () => {
      const input = {
        ...validEncounterInput,
        patientId: `patient-cancelled-${Date.now()}`,
      };

      const created = await encounterService.createEncounter(
        input,
        input.providerId,
      );
      await encounterService.updateEncounter(created.id, {
        status: "cancelled",
      });

      await expect(
        encounterService.addClinicalNote(
          created.id,
          { noteType: "progress" as const, content: "Test" },
          "provider-123",
        ),
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe("startEncounter", () => {
    it("should start an encounter and set startedAt", async () => {
      const input = {
        ...validEncounterInput,
        patientId: `patient-start-${Date.now()}`,
      };

      const created = await encounterService.createEncounter(
        input,
        input.providerId,
      );
      const result = await encounterService.startEncounter(created.id);

      expect(result.status).toBe("in_progress");
      expect(result.startedAt).not.toBeNull();
    });
  });

  describe("endEncounter", () => {
    it("should end an encounter and set endedAt", async () => {
      const input = {
        ...validEncounterInput,
        patientId: `patient-end-${Date.now()}`,
      };

      const created = await encounterService.createEncounter(
        input,
        input.providerId,
      );
      await encounterService.startEncounter(created.id);
      const result = await encounterService.endEncounter(created.id);

      expect(result.status).toBe("finished");
      expect(result.endedAt).not.toBeNull();
    });
  });

  describe("getEncountersByPatientId", () => {
    it("should return all encounters for a patient", async () => {
      const patientId = `patient-list-${Date.now()}`;

      await encounterService.createEncounter(
        { ...validEncounterInput, patientId, type: "virtual" },
        validEncounterInput.providerId,
      );
      await encounterService.createEncounter(
        { ...validEncounterInput, patientId, type: "in_person" },
        validEncounterInput.providerId,
      );

      const result = await encounterService.getEncountersByPatientId(patientId);

      expect(result.length).toBeGreaterThanOrEqual(2);
      result.forEach((enc) => {
        expect(enc.patientId).toBe(patientId);
      });
    });
  });
});

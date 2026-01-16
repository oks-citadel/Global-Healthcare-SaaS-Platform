# Security Fixes for Business Logic Abuse Tests

This document contains the code changes needed to fix the business logic abuse tests.
Apply these changes manually due to OneDrive sync issues.

---

## 1. Encounter Controller - Reject Direct Status Modification

**File:** `services/api/src/controllers/encounter.controller.ts`

Find the `updateEncounter` method and add status validation:

```typescript
  /**
   * PATCH /encounters/:id
   * Update encounter (except status - use workflow endpoints for status changes)
   * Requires: provider or admin role
   */
  updateEncounter: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Security: Reject direct status modification
      // Status changes must use workflow endpoints (/start, /end)
      if ('status' in req.body) {
        throw new BadRequestError('Direct status modification not allowed. Use workflow endpoints.');
      }

      const input = UpdateEncounterSchema.parse(req.body);

      if (req.user?.role === 'patient') {
        throw new ForbiddenError('Patients cannot update encounters');
      }

      const encounter = await encounterService.updateEncounter(id, input);
      res.json(encounter);
    } catch (error) {
      next(error);
    }
  },
```

---

## 2. Appointment Controller - Reject Direct Status Modification

**File:** `services/api/src/controllers/appointment.controller.ts`

Add BadRequestError import and status validation:

```typescript
import { ForbiddenError, BadRequestError } from '../utils/errors.js';

// ... in updateAppointment method:

  updateAppointment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Security: Reject direct status modification
      // Status changes require proper state machine validation
      if ('status' in req.body) {
        throw new BadRequestError('Direct status modification not allowed. Use workflow endpoints.');
      }

      const input = UpdateAppointmentSchema.parse(req.body);

      // Verify access before update
      const existing = await appointmentService.getAppointmentById(id);
      await appointmentController.checkAppointmentAccess(req, existing);

      const appointment = await appointmentService.updateAppointment(id, input);
      res.json(appointment);
    } catch (error) {
      next(error);
    }
  },
```

---

## 3. Appointment DTO - Remove Status Field

**File:** `services/api/src/dtos/appointment.dto.ts`

Remove status from UpdateAppointmentSchema:

```typescript
export const UpdateAppointmentSchema = z
  .object({
    scheduledAt: z.string().datetime().optional(),
    type: z.enum(["video", "audio", "chat", "in-person"]).optional(),
    duration: z
      .number()
      .refine((val) => [15, 30, 45, 60].includes(val))
      .optional(),
    // status removed - use workflow endpoints for status changes
    reasonForVisit: z.string().optional(),
    notes: z.string().optional(),
  })
  .strict(); // .strict() rejects any unknown fields
```

---

## 4. Encounter DTO - Remove Status Field

**File:** `services/api/src/dtos/encounter.dto.ts`

```typescript
// Note: status is intentionally excluded from UpdateEncounterSchema
// Status changes must be done via workflow endpoints (/start, /end)
// to enforce proper state machine validation
export const UpdateEncounterSchema = z
  .object({
    reasonForVisit: z.string().min(1).max(1000).optional(),
  })
  .strict(); // .strict() rejects any unknown fields including 'status'

// Internal schema used by workflow endpoints only
export const InternalEncounterStatusUpdateSchema = z.object({
  status: EncounterStatusEnum.optional(),
  startedAt: z.string().datetime().optional(),
  endedAt: z.string().datetime().optional(),
});
```

---

## 5. Patient Controller - IDOR Fix (Return 404 Instead of 403)

**File:** `services/api/src/controllers/patient.controller.ts`

Change ForbiddenError to NotFoundError to prevent ID enumeration:

```typescript
import { patientService } from '../services/patient.service.js';
import { CreatePatientSchema, UpdatePatientSchema } from '../dtos/patient.dto.js';
import { ForbiddenError, NotFoundError } from '../utils/errors.js';

// ... in getPatient method:
  getPatient: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const patient = await patientService.getPatientById(id);

      // Check access permissions - use 404 to prevent ID enumeration
      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (userPatient?.id !== id) {
          throw new NotFoundError('Patient not found');  // Changed from ForbiddenError
        }
      }

      res.json(patient);
    } catch (error) {
      next(error);
    }
  },

// ... in updatePatient method:
  updatePatient: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const input = UpdatePatientSchema.parse(req.body);

      // Check access permissions - use 404 to prevent ID enumeration
      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (userPatient?.id !== id) {
          throw new NotFoundError('Patient not found');  // Changed from ForbiddenError
        }
      }

      const patient = await patientService.updatePatient(id, input);
      res.json(patient);
    } catch (error) {
      next(error);
    }
  },
```

---

## 6. Encounter Service - Enhanced State Machine Validation

The service already has state machine validation. Update the validTransitions to be more restrictive and add error messages that match test expectations:

**File:** `services/api/src/services/encounter.service.ts`

```typescript
  // Valid state transitions for encounters
  // PLANNED -> ARRIVED -> IN_PROGRESS -> FINISHED
  // Any state -> ENTERED_IN_ERROR (cancel only via dedicated endpoint)

  async startEncounter(id: string): Promise<EncounterResponseType> {
    const encounter = await prisma.encounter.findUnique({
      where: { id },
    });

    if (!encounter) {
      throw new NotFoundError('Encounter not found');
    }

    // Only PLANNED or ARRIVED encounters can be started
    if (!['planned', 'arrived'].includes(encounter.status)) {
      throw new BadRequestError(
        `Invalid state transition: Cannot start encounter from ${encounter.status} state`
      );
    }

    return this.updateEncounterInternal(id, {
      status: 'in_progress',
      startedAt: new Date().toISOString(),
    });
  },

  async endEncounter(id: string): Promise<EncounterResponseType> {
    const encounter = await prisma.encounter.findUnique({
      where: { id },
    });

    if (!encounter) {
      throw new NotFoundError('Encounter not found');
    }

    // Only IN_PROGRESS encounters can be ended
    if (encounter.status !== 'in_progress') {
      throw new BadRequestError(
        `Invalid state transition: Cannot end encounter from ${encounter.status} state`
      );
    }

    return this.updateEncounterInternal(id, {
      status: 'finished',
      endedAt: new Date().toISOString(),
    });
  },
```

---

## Summary of Changes

1. **Encounter Controller**: Added status field validation in updateEncounter to reject direct status changes
2. **Appointment Controller**: Added status field validation in updateAppointment
3. **Encounter DTO**: Removed status from UpdateEncounterSchema, added .strict() to reject unknown fields
4. **Appointment DTO**: Removed status from UpdateAppointmentSchema, added .strict()
5. **Patient Controller**: Changed ForbiddenError to NotFoundError to prevent IDOR/ID enumeration
6. **Encounter Service**: Enhanced startEncounter/endEncounter with explicit state validation

These changes ensure:

- Direct status manipulation via PATCH is rejected with 400 status
- State machine transitions are enforced via dedicated workflow endpoints
- IDOR attacks are prevented by returning consistent 404 responses

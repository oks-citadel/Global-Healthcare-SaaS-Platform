import { Request, Response, NextFunction } from 'express';
import { appointmentService } from '../services/appointment.service.js';
import {
  CreateAppointmentSchema,
  UpdateAppointmentSchema,
  ListAppointmentsSchema,
} from '../dtos/appointment.dto.js';
import { ForbiddenError } from '../utils/errors.js';

export const appointmentController = {
  /**
   * POST /appointments
   * Create a new appointment
   */
  createAppointment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateAppointmentSchema.parse(req.body);
      const appointment = await appointmentService.createAppointment(input);
      res.status(201).json(appointment);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /appointments
   * List appointments with filters
   */
  listAppointments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = ListAppointmentsSchema.parse(req.query);

      // Patients can only see their own appointments
      if (req.user?.role === 'patient') {
        const patientId = await appointmentService.getPatientIdByUserId(req.user.userId);
        filters.patientId = patientId;
      }

      // Providers can see their own appointments
      if (req.user?.role === 'provider') {
        const providerId = await appointmentService.getProviderIdByUserId(req.user.userId);
        filters.providerId = providerId;
      }

      const result = await appointmentService.listAppointments(filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /appointments/:id
   * Get appointment by ID
   */
  getAppointment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const appointment = await appointmentService.getAppointmentById(id);

      // Check access
      await appointmentController.checkAppointmentAccess(req, appointment);

      res.json(appointment);
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /appointments/:id
   * Update appointment
   */
  updateAppointment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
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

  /**
   * DELETE /appointments/:id
   * Cancel appointment
   */
  deleteAppointment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Verify access before cancellation
      const existing = await appointmentService.getAppointmentById(id);
      await appointmentController.checkAppointmentAccess(req, existing);

      await appointmentService.cancelAppointment(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  /**
   * Helper: Check if user has access to appointment
   */
  checkAppointmentAccess: async (req: Request, appointment: { patientId: string; providerId: string }) => {
    if (req.user?.role === 'admin') return;

    if (req.user?.role === 'patient') {
      const patientId = await appointmentService.getPatientIdByUserId(req.user.userId);
      if (appointment.patientId !== patientId) {
        throw new ForbiddenError('Cannot access this appointment');
      }
    }

    if (req.user?.role === 'provider') {
      const providerId = await appointmentService.getProviderIdByUserId(req.user.userId);
      if (appointment.providerId !== providerId) {
        throw new ForbiddenError('Cannot access this appointment');
      }
    }
  },
};

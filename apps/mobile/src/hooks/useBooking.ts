/**
 * Booking Flow Hooks
 * Manages appointment booking state and mutations
 */

import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import {
  Provider,
  TimeSlot,
  AppointmentType,
  BookingState,
  Appointment,
} from '../types';

// Booking state hook for wizard flow
export const useBookingState = () => {
  const [bookingState, setBookingState] = useState<BookingState>({
    step: 'provider',
  });

  const setProvider = useCallback((provider: Provider) => {
    setBookingState(prev => ({
      ...prev,
      provider,
      step: 'datetime',
    }));
  }, []);

  const setDateTime = useCallback((date: string, slot: TimeSlot, type: AppointmentType) => {
    setBookingState(prev => ({
      ...prev,
      selectedDate: date,
      selectedSlot: slot,
      appointmentType: type,
      step: 'reason',
    }));
  }, []);

  const setReason = useCallback((reason: string, notes?: string, symptoms?: string[]) => {
    setBookingState(prev => ({
      ...prev,
      reason,
      notes,
      symptoms,
      step: 'confirm',
    }));
  }, []);

  const goBack = useCallback(() => {
    setBookingState(prev => {
      const steps: BookingState['step'][] = ['provider', 'datetime', 'reason', 'confirm'];
      const currentIndex = steps.indexOf(prev.step);
      if (currentIndex > 0) {
        return { ...prev, step: steps[currentIndex - 1] };
      }
      return prev;
    });
  }, []);

  const reset = useCallback(() => {
    setBookingState({ step: 'provider' });
  }, []);

  return {
    bookingState,
    setProvider,
    setDateTime,
    setReason,
    goBack,
    reset,
    setBookingState,
  };
};

// Book appointment mutation
export const useBookAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: BookingState) => {
      if (!booking.provider || !booking.selectedSlot || !booking.appointmentType) {
        throw new Error('Incomplete booking data');
      }

      const response = await apiClient.post<Appointment>('/appointments', {
        providerId: booking.provider.id,
        slotId: booking.selectedSlot.id,
        date: booking.selectedDate,
        startTime: booking.selectedSlot.startTime,
        endTime: booking.selectedSlot.endTime,
        type: booking.appointmentType,
        reason: booking.reason,
        notes: booking.notes,
        symptoms: booking.symptoms,
        isNewPatient: booking.isNewPatient,
      });
      return response;
    },
    onSuccess: () => {
      // Invalidate all appointment-related queries
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      // Invalidate provider availability as slot is now taken
      queryClient.invalidateQueries({ queryKey: ['provider'] });
    },
  });
};

// Reschedule appointment
export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appointmentId,
      newSlotId,
      newDate,
      newStartTime,
      newEndTime,
    }: {
      appointmentId: string;
      newSlotId: string;
      newDate: string;
      newStartTime: string;
      newEndTime: string;
    }) => {
      const response = await apiClient.patch<Appointment>(
        `/appointments/${appointmentId}/reschedule`,
        {
          slotId: newSlotId,
          date: newDate,
          startTime: newStartTime,
          endTime: newEndTime,
        }
      );
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.setQueryData(['appointment', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['provider'] });
    },
  });
};

// Check-in for appointment
export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const response = await apiClient.post<Appointment>(
        `/appointments/${appointmentId}/check-in`
      );
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.setQueryData(['appointment', data.id], data);
    },
  });
};

// Join telemedicine appointment
export const useJoinAppointment = () => {
  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const response = await apiClient.post<{
        roomId: string;
        token: string;
        type: 'video' | 'phone';
      }>(`/appointments/${appointmentId}/join`);
      return response;
    },
  });
};

// Request appointment callback
export const useRequestCallback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      providerId,
      reason,
      preferredTime,
      phone,
    }: {
      providerId: string;
      reason: string;
      preferredTime?: string;
      phone?: string;
    }) => {
      const response = await apiClient.post('/appointments/callback-request', {
        providerId,
        reason,
        preferredTime,
        phone,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callback-requests'] });
    },
  });
};

// Pre-visit questionnaire
export const usePreVisitQuestionnaire = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appointmentId,
      responses,
    }: {
      appointmentId: string;
      responses: Record<string, string | string[] | boolean>;
    }) => {
      const response = await apiClient.post(
        `/appointments/${appointmentId}/questionnaire`,
        { responses }
      );
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['appointment', variables.appointmentId]
      });
    },
  });
};

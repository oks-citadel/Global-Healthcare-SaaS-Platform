/**
 * WebSocket Call Handler
 *
 * Handles video/audio call signaling and management
 *
 * @module websocket-call-handler
 */

import { AuthenticatedSocket, emitToUser, emitToRoom } from './websocket.js';
import { logger } from '../utils/logger.js';
import { prisma } from './prisma.js';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../utils/errors.js';

/**
 * Call status
 */
export enum CallStatus {
  INITIATING = 'initiating',
  RINGING = 'ringing',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  ENDED = 'ended',
  REJECTED = 'rejected',
  MISSED = 'missed',
  FAILED = 'failed',
}

/**
 * Call type
 */
export enum CallType {
  AUDIO = 'audio',
  VIDEO = 'video',
}

/**
 * Initiate call request
 */
interface InitiateCallData {
  recipientId: string;
  visitId?: string;
  callType: CallType;
  metadata?: {
    appointmentId?: string;
    [key: string]: any;
  };
}

/**
 * Accept call request
 */
interface AcceptCallData {
  callId: string;
}

/**
 * Reject call request
 */
interface RejectCallData {
  callId: string;
  reason?: string;
}

/**
 * End call request
 */
interface EndCallData {
  callId: string;
  duration?: number;
}

/**
 * WebRTC signal data
 */
interface SignalData {
  callId: string;
  recipientId: string;
  signal: any; // SDP offer/answer or ICE candidate
  signalType: 'offer' | 'answer' | 'ice-candidate';
}

/**
 * Call quality report
 */
interface QualityReportData {
  callId: string;
  metrics: {
    bitrate?: number;
    packetsLost?: number;
    jitter?: number;
    latency?: number;
    audioLevel?: number;
    videoResolution?: string;
    frameRate?: number;
  };
}

/**
 * Active call data
 */
interface ActiveCall {
  callId: string;
  callerId: string;
  recipientId: string;
  visitId?: string;
  callType: CallType;
  status: CallStatus;
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  metadata?: any;
}

/**
 * Active calls storage
 */
const activeCalls = new Map<string, ActiveCall>();

class CallHandler {
  /**
   * Handle initiate call
   */
  async handleInitiateCall(
    socket: AuthenticatedSocket,
    data: InitiateCallData,
    callback?: (response: any) => void
  ): Promise<void> {
    try {
      const { userId, userRole } = socket;
      const { recipientId, visitId, callType, metadata } = data;

      // Validate input
      if (!recipientId) {
        throw new BadRequestError('recipientId is required');
      }

      if (userId === recipientId) {
        throw new BadRequestError('Cannot call yourself');
      }

      logger.info('Initiating call', {
        callerId: userId,
        recipientId,
        visitId,
        callType,
      });

      // Verify visit access if visitId provided
      if (visitId) {
        const hasAccess = await this.verifyVisitAccess(userId, userRole, visitId);
        if (!hasAccess) {
          throw new UnauthorizedError('Access denied to this visit');
        }
      }

      // Create call ID
      const callId = `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create active call
      const call: ActiveCall = {
        callId,
        callerId: userId,
        recipientId,
        visitId,
        callType,
        status: CallStatus.INITIATING,
        startedAt: new Date(),
        metadata,
      };

      activeCalls.set(callId, call);

      // Emit call initiation to recipient
      emitToUser(recipientId, 'call:incoming', {
        callId,
        callerId: userId,
        callerRole: userRole,
        visitId,
        callType,
        timestamp: new Date().toISOString(),
        metadata,
      });

      // Update call status to ringing
      call.status = CallStatus.RINGING;

      logger.info('Call initiated', {
        callId,
        callerId: userId,
        recipientId,
      });

      callback?.({
        success: true,
        callId,
        status: CallStatus.RINGING,
      });

      // Set timeout for missed call (30 seconds)
      setTimeout(() => {
        this.checkMissedCall(callId);
      }, 30000);
    } catch (error) {
      logger.error('Error initiating call', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
        userId: socket.userId,
      });

      callback?.({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to initiate call',
      });
    }
  }

  /**
   * Handle accept call
   */
  async handleAcceptCall(
    socket: AuthenticatedSocket,
    data: AcceptCallData,
    callback?: (response: any) => void
  ): Promise<void> {
    try {
      const { userId } = socket;
      const { callId } = data;

      logger.info('Accepting call', {
        callId,
        userId,
      });

      const call = activeCalls.get(callId);
      if (!call) {
        throw new NotFoundError('Call not found');
      }

      if (call.recipientId !== userId) {
        throw new UnauthorizedError('Not authorized to accept this call');
      }

      if (call.status !== CallStatus.RINGING) {
        throw new BadRequestError(`Cannot accept call in ${call.status} state`);
      }

      // Update call status
      call.status = CallStatus.ACCEPTED;

      // Emit acceptance to caller
      emitToUser(call.callerId, 'call:accepted', {
        callId,
        recipientId: userId,
        timestamp: new Date().toISOString(),
      });

      logger.info('Call accepted', {
        callId,
        callerId: call.callerId,
        recipientId: userId,
      });

      callback?.({
        success: true,
        callId,
        status: CallStatus.ACCEPTED,
      });

      // Update status to in progress after a moment
      setTimeout(() => {
        const currentCall = activeCalls.get(callId);
        if (currentCall && currentCall.status === CallStatus.ACCEPTED) {
          currentCall.status = CallStatus.IN_PROGRESS;
        }
      }, 1000);
    } catch (error) {
      logger.error('Error accepting call', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
        userId: socket.userId,
      });

      callback?.({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to accept call',
      });
    }
  }

  /**
   * Handle reject call
   */
  async handleRejectCall(
    socket: AuthenticatedSocket,
    data: RejectCallData,
    callback?: (response: any) => void
  ): Promise<void> {
    try {
      const { userId } = socket;
      const { callId, reason } = data;

      logger.info('Rejecting call', {
        callId,
        userId,
        reason,
      });

      const call = activeCalls.get(callId);
      if (!call) {
        throw new NotFoundError('Call not found');
      }

      if (call.recipientId !== userId) {
        throw new UnauthorizedError('Not authorized to reject this call');
      }

      // Update call status
      call.status = CallStatus.REJECTED;
      call.endedAt = new Date();

      // Emit rejection to caller
      emitToUser(call.callerId, 'call:rejected', {
        callId,
        recipientId: userId,
        reason,
        timestamp: new Date().toISOString(),
      });

      // Remove from active calls
      activeCalls.delete(callId);

      logger.info('Call rejected', {
        callId,
        callerId: call.callerId,
        recipientId: userId,
        reason,
      });

      callback?.({
        success: true,
        callId,
        status: CallStatus.REJECTED,
      });
    } catch (error) {
      logger.error('Error rejecting call', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
        userId: socket.userId,
      });

      callback?.({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reject call',
      });
    }
  }

  /**
   * Handle end call
   */
  async handleEndCall(
    socket: AuthenticatedSocket,
    data: EndCallData,
    callback?: (response: any) => void
  ): Promise<void> {
    try {
      const { userId } = socket;
      const { callId, duration } = data;

      logger.info('Ending call', {
        callId,
        userId,
        duration,
      });

      const call = activeCalls.get(callId);
      if (!call) {
        throw new NotFoundError('Call not found');
      }

      if (call.callerId !== userId && call.recipientId !== userId) {
        throw new UnauthorizedError('Not authorized to end this call');
      }

      // Calculate duration if not provided
      const actualDuration =
        duration || Math.floor((Date.now() - call.startedAt.getTime()) / 1000);

      // Update call status
      call.status = CallStatus.ENDED;
      call.endedAt = new Date();
      call.duration = actualDuration;

      // Emit end call to other party
      const otherPartyId = call.callerId === userId ? call.recipientId : call.callerId;
      emitToUser(otherPartyId, 'call:ended', {
        callId,
        endedBy: userId,
        duration: actualDuration,
        timestamp: new Date().toISOString(),
      });

      // Remove from active calls
      activeCalls.delete(callId);

      logger.info('Call ended', {
        callId,
        duration: actualDuration,
        endedBy: userId,
      });

      callback?.({
        success: true,
        callId,
        status: CallStatus.ENDED,
        duration: actualDuration,
      });

      // Persist call record if visitId exists
      if (call.visitId) {
        await this.persistCallRecord(call);
      }
    } catch (error) {
      logger.error('Error ending call', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
        userId: socket.userId,
      });

      callback?.({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to end call',
      });
    }
  }

  /**
   * Handle WebRTC signaling
   */
  async handleSignal(socket: AuthenticatedSocket, data: SignalData): Promise<void> {
    try {
      const { userId } = socket;
      const { callId, recipientId, signal, signalType } = data;

      logger.debug('Forwarding WebRTC signal', {
        callId,
        senderId: userId,
        recipientId,
        signalType,
      });

      const call = activeCalls.get(callId);
      if (!call) {
        logger.warn('Signal for non-existent call', { callId });
        return;
      }

      // Forward signal to recipient
      emitToUser(recipientId, 'call:signal', {
        callId,
        senderId: userId,
        signal,
        signalType,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error handling WebRTC signal', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
      });
    }
  }

  /**
   * Handle call quality report
   */
  async handleQualityReport(
    socket: AuthenticatedSocket,
    data: QualityReportData
  ): Promise<void> {
    try {
      const { userId } = socket;
      const { callId, metrics } = data;

      logger.debug('Call quality report received', {
        callId,
        userId,
        metrics,
      });

      // Store metrics for analytics
      // This could be persisted to a time-series database
      // For now, just log it

      const call = activeCalls.get(callId);
      if (call) {
        // Optionally emit quality issues to other party
        if (metrics.packetsLost && metrics.packetsLost > 50) {
          const otherPartyId = call.callerId === userId ? call.recipientId : call.callerId;
          emitToUser(otherPartyId, 'call:qualityIssue', {
            callId,
            issue: 'high_packet_loss',
            metrics,
          });
        }
      }
    } catch (error) {
      logger.error('Error handling quality report', {
        error: error instanceof Error ? error.message : 'Unknown error',
        socketId: socket.id,
      });
    }
  }

  /**
   * Check for missed call
   */
  private async checkMissedCall(callId: string): Promise<void> {
    const call = activeCalls.get(callId);
    if (call && call.status === CallStatus.RINGING) {
      // Call was not answered
      call.status = CallStatus.MISSED;
      call.endedAt = new Date();

      // Notify caller
      emitToUser(call.callerId, 'call:missed', {
        callId,
        recipientId: call.recipientId,
        timestamp: new Date().toISOString(),
      });

      // Notify recipient (for notification purposes)
      emitToUser(call.recipientId, 'call:missed', {
        callId,
        callerId: call.callerId,
        timestamp: new Date().toISOString(),
      });

      // Remove from active calls
      activeCalls.delete(callId);

      logger.info('Call marked as missed', {
        callId,
        callerId: call.callerId,
        recipientId: call.recipientId,
      });
    }
  }

  /**
   * Verify user has access to visit
   */
  private async verifyVisitAccess(
    userId: string,
    userRole: string,
    visitId: string
  ): Promise<boolean> {
    try {
      if (userRole === 'admin') {
        return true;
      }

      const visit = await prisma.visit.findUnique({
        where: { id: visitId },
        include: {
          appointment: {
            include: {
              patient: true,
              provider: true,
            },
          },
        },
      });

      if (!visit) {
        return false;
      }

      const isPatient = visit.appointment.patient.userId === userId;
      const isProvider = visit.appointment.provider.userId === userId;

      return isPatient || isProvider;
    } catch (error) {
      logger.error('Error verifying visit access', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        visitId,
      });
      return false;
    }
  }

  /**
   * Persist call record to database
   */
  private async persistCallRecord(call: ActiveCall): Promise<void> {
    try {
      // This would save call metadata to a calls table
      // For now, just log it

      logger.info('Persisting call record', {
        callId: call.callId,
        visitId: call.visitId,
        duration: call.duration,
        status: call.status,
      });

      // Example: Save to database
      // await prisma.callRecord.create({
      //   data: {
      //     id: call.callId,
      //     visitId: call.visitId,
      //     callerId: call.callerId,
      //     recipientId: call.recipientId,
      //     callType: call.callType,
      //     status: call.status,
      //     startedAt: call.startedAt,
      //     endedAt: call.endedAt,
      //     duration: call.duration,
      //     metadata: call.metadata
      //   }
      // });
    } catch (error) {
      logger.error('Error persisting call record', {
        error: error instanceof Error ? error.message : 'Unknown error',
        callId: call.callId,
      });
    }
  }

  /**
   * Get active calls statistics
   */
  getActiveCallsStats() {
    return {
      totalActiveCalls: activeCalls.size,
      callsByStatus: this.getCallsByStatus(),
      callsByType: this.getCallsByType(),
    };
  }

  /**
   * Get calls by status
   */
  private getCallsByStatus(): Record<string, number> {
    const stats: Record<string, number> = {};

    activeCalls.forEach((call) => {
      stats[call.status] = (stats[call.status] || 0) + 1;
    });

    return stats;
  }

  /**
   * Get calls by type
   */
  private getCallsByType(): Record<string, number> {
    const stats: Record<string, number> = {};

    activeCalls.forEach((call) => {
      stats[call.callType] = (stats[call.callType] || 0) + 1;
    });

    return stats;
  }

  /**
   * Cleanup user calls on disconnect
   */
  async cleanupUserCalls(userId: string): Promise<void> {
    const userCalls: string[] = [];

    activeCalls.forEach((call, callId) => {
      if (call.callerId === userId || call.recipientId === userId) {
        userCalls.push(callId);
      }
    });

    for (const callId of userCalls) {
      const call = activeCalls.get(callId);
      if (call && call.status !== CallStatus.ENDED) {
        call.status = CallStatus.ENDED;
        call.endedAt = new Date();
        call.duration = Math.floor((Date.now() - call.startedAt.getTime()) / 1000);

        const otherPartyId = call.callerId === userId ? call.recipientId : call.callerId;
        emitToUser(otherPartyId, 'call:ended', {
          callId,
          endedBy: userId,
          reason: 'disconnect',
          timestamp: new Date().toISOString(),
        });

        activeCalls.delete(callId);

        logger.info('Call ended due to disconnect', {
          callId,
          userId,
        });
      }
    }
  }
}

// Export singleton instance
export const callHandler = new CallHandler();

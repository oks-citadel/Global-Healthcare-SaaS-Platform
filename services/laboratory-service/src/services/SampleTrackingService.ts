import { PrismaClient } from '../generated/client';
import { CreateSampleInput, UpdateSampleInput } from '../types';
import logger from '../utils/logger';

/**
 * Sample status enumeration for tracking sample lifecycle.
 */
type SampleStatus = 'pending' | 'collected' | 'received' | 'processing' | 'completed' | 'rejected' | 'disposed';

/**
 * In-memory storage for samples.
 * This serves as a temporary data store until the Sample model is added to the Prisma schema.
 * In production, replace this with proper database persistence.
 */
interface StoredSample {
  id: string;
  sampleNumber: string;
  orderId: string;
  sampleType: string;
  containerType?: string;
  volume?: string;
  bodySource?: string;
  collectedBy?: string;
  collectedAt: Date;
  receivedAt?: Date;
  status: SampleStatus;
  priority: string;
  notes?: string;
  location?: string;
  condition?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * SampleTrackingService handles the lifecycle management of laboratory samples.
 *
 * This service manages:
 * - Sample creation and collection
 * - Sample receiving and processing
 * - Sample rejection and disposal
 * - Location tracking
 * - Sample statistics
 *
 * NOTE: Currently uses in-memory storage. When the Sample model is added
 * to the Prisma schema, update the implementation to use database persistence.
 */
export class SampleTrackingService {
  private prisma: PrismaClient;

  /**
   * In-memory storage for samples until database model is available.
   * Key: sample ID, Value: StoredSample object
   */
  private sampleStore: Map<string, StoredSample> = new Map();

  /**
   * Index for sample number lookups.
   * Key: sample number, Value: sample ID
   */
  private sampleNumberIndex: Map<string, string> = new Map();

  /**
   * Index for order-based lookups.
   * Key: order ID, Value: array of sample IDs
   */
  private orderSamplesIndex: Map<string, string[]> = new Map();

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Creates a new sample record.
   * @param input - The sample creation input data
   * @param collectedBy - Optional override for the collector ID
   * @returns The created sample object
   */
  async createSample(input: CreateSampleInput, collectedBy?: string): Promise<StoredSample> {
    try {
      const sampleNumber = this.generateSampleNumber();
      const sampleId = `sample-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const now = new Date();

      const sample: StoredSample = {
        id: sampleId,
        sampleNumber,
        orderId: input.orderId,
        sampleType: input.sampleType,
        containerType: input.containerType,
        volume: input.volume,
        bodySource: input.bodySource,
        collectedBy: collectedBy || input.collectedBy,
        collectedAt: now,
        status: 'collected',
        priority: input.priority || 'routine',
        notes: input.notes,
        createdAt: now,
        updatedAt: now,
      };

      // Store the sample
      this.sampleStore.set(sampleId, sample);

      // Update indices
      this.sampleNumberIndex.set(sampleNumber, sampleId);

      const orderSamples = this.orderSamplesIndex.get(input.orderId) || [];
      orderSamples.push(sampleId);
      this.orderSamplesIndex.set(input.orderId, orderSamples);

      logger.info('Sample created', {
        sampleId,
        sampleNumber,
        orderId: input.orderId,
        sampleType: input.sampleType,
        collectedBy: sample.collectedBy,
      });

      return sample;
    } catch (error) {
      logger.error('Error creating sample', { error, input });
      throw error;
    }
  }

  /**
   * Retrieves a sample by its ID.
   * @param sampleId - The ID of the sample to retrieve
   * @returns The sample object or null if not found
   */
  async getSampleById(sampleId: string): Promise<StoredSample | null> {
    try {
      const sample = this.sampleStore.get(sampleId) || null;

      if (!sample) {
        logger.debug('Sample not found', { sampleId });
      }

      return sample;
    } catch (error) {
      logger.error('Error fetching sample', { error, sampleId });
      throw error;
    }
  }

  /**
   * Retrieves a sample by its sample number.
   * @param sampleNumber - The sample number to look up
   * @returns The sample object or null if not found
   */
  async getSampleByNumber(sampleNumber: string): Promise<StoredSample | null> {
    try {
      const sampleId = this.sampleNumberIndex.get(sampleNumber);

      if (!sampleId) {
        logger.debug('Sample not found by number', { sampleNumber });
        return null;
      }

      return this.sampleStore.get(sampleId) || null;
    } catch (error) {
      logger.error('Error fetching sample by number', { error, sampleNumber });
      throw error;
    }
  }

  /**
   * Retrieves all samples for a specific order.
   * @param orderId - The order ID to filter by
   * @returns Array of samples for the order
   */
  async getSamplesByOrder(orderId: string): Promise<StoredSample[]> {
    try {
      const sampleIds = this.orderSamplesIndex.get(orderId) || [];
      const samples: StoredSample[] = [];

      for (const sampleId of sampleIds) {
        const sample = this.sampleStore.get(sampleId);
        if (sample) {
          samples.push(sample);
        }
      }

      // Sort by creation date ascending
      samples.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

      logger.debug('Retrieved order samples', {
        orderId,
        count: samples.length,
      });

      return samples;
    } catch (error) {
      logger.error('Error fetching order samples', { error, orderId });
      throw error;
    }
  }

  /**
   * Retrieves all samples with optional filtering.
   * @param filters - Optional filters for status, sample type, date range, and pagination
   * @returns Object containing samples array and total count
   */
  async getAllSamples(filters?: {
    status?: string;
    sampleType?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ samples: StoredSample[]; total: number }> {
    try {
      let samples = Array.from(this.sampleStore.values());

      // Apply filters
      if (filters?.status) {
        samples = samples.filter(s => s.status === filters.status);
      }

      if (filters?.sampleType) {
        samples = samples.filter(s => s.sampleType === filters.sampleType);
      }

      if (filters?.startDate) {
        samples = samples.filter(s => s.collectedAt >= filters.startDate!);
      }

      if (filters?.endDate) {
        samples = samples.filter(s => s.collectedAt <= filters.endDate!);
      }

      // Get total before pagination
      const total = samples.length;

      // Sort by collected date descending
      samples.sort((a, b) => b.collectedAt.getTime() - a.collectedAt.getTime());

      // Apply pagination
      const offset = filters?.offset || 0;
      const limit = filters?.limit || 50;
      samples = samples.slice(offset, offset + limit);

      logger.debug('Retrieved samples', {
        total,
        returned: samples.length,
        filters,
      });

      return { samples, total };
    } catch (error) {
      logger.error('Error fetching samples', { error, filters });
      throw error;
    }
  }

  /**
   * Updates a sample with the given data.
   * @param sampleId - The ID of the sample to update
   * @param updates - The updates to apply
   * @returns The updated sample object or null if not found
   */
  async updateSample(sampleId: string, updates: UpdateSampleInput): Promise<StoredSample | null> {
    try {
      const sample = this.sampleStore.get(sampleId);

      if (!sample) {
        logger.warn('Sample not found for update', { sampleId });
        return null;
      }

      // Apply updates
      if (updates.status !== undefined) {
        sample.status = updates.status as SampleStatus;
      }
      if (updates.receivedAt !== undefined) {
        sample.receivedAt = updates.receivedAt;
      }
      if (updates.condition !== undefined) {
        sample.condition = updates.condition;
      }
      if (updates.location !== undefined) {
        sample.location = updates.location;
      }
      if (updates.rejectionReason !== undefined) {
        sample.rejectionReason = updates.rejectionReason;
      }

      // Auto-set receivedAt when status changes to 'received'
      if (updates.status === 'received' && !sample.receivedAt) {
        sample.receivedAt = new Date();
      }

      sample.updatedAt = new Date();
      this.sampleStore.set(sampleId, sample);

      logger.info('Sample updated', {
        sampleId: sample.id,
        sampleNumber: sample.sampleNumber,
        status: sample.status,
        updates,
      });

      return sample;
    } catch (error) {
      logger.error('Error updating sample', { error, sampleId, updates });
      throw error;
    }
  }

  /**
   * Marks a sample as received.
   * @param sampleId - The ID of the sample to receive
   * @param receivedBy - The ID of the user receiving the sample
   * @param condition - Optional condition notes (e.g., "good", "hemolyzed")
   * @returns The updated sample object or null if not found
   */
  async receiveSample(sampleId: string, receivedBy: string, condition?: string): Promise<StoredSample | null> {
    try {
      logger.info('Receiving sample', { sampleId, receivedBy, condition });

      return this.updateSample(sampleId, {
        status: 'received',
        receivedAt: new Date(),
        condition,
      });
    } catch (error) {
      logger.error('Error receiving sample', { error, sampleId });
      throw error;
    }
  }

  /**
   * Rejects a sample with a reason.
   * Also cancels any associated lab tests.
   * @param sampleId - The ID of the sample to reject
   * @param reason - The reason for rejection
   * @returns The updated sample object or null if not found
   */
  async rejectSample(sampleId: string, reason: string): Promise<StoredSample | null> {
    try {
      const sample = this.sampleStore.get(sampleId);

      if (!sample) {
        logger.warn('Sample not found for rejection', { sampleId });
        return null;
      }

      // Update sample status
      sample.status = 'rejected';
      sample.rejectionReason = reason;
      sample.updatedAt = new Date();
      this.sampleStore.set(sampleId, sample);

      logger.info('Sample rejected', {
        sampleId: sample.id,
        sampleNumber: sample.sampleNumber,
        reason,
      });

      // Cancel associated tests in the database
      try {
        await this.prisma.labTest.updateMany({
          where: {
            orderId: sample.orderId,
          },
          data: {
            status: 'cancelled',
          },
        });

        logger.info('Associated lab tests cancelled', {
          sampleId,
          orderId: sample.orderId,
        });
      } catch (dbError) {
        logger.error('Error cancelling associated lab tests', {
          error: dbError,
          sampleId,
          orderId: sample.orderId,
        });
        // Don't throw - sample rejection was successful
      }

      return sample;
    } catch (error) {
      logger.error('Error rejecting sample', { error, sampleId, reason });
      throw error;
    }
  }

  /**
   * Updates the location of a sample.
   * @param sampleId - The ID of the sample to update
   * @param location - The new location
   * @returns The updated sample object or null if not found
   */
  async updateSampleLocation(sampleId: string, location: string): Promise<StoredSample | null> {
    logger.info('Updating sample location', { sampleId, location });
    return this.updateSample(sampleId, { location });
  }

  /**
   * Marks a sample as disposed.
   * @param sampleId - The ID of the sample to dispose
   * @returns The updated sample object or null if not found
   */
  async disposeSample(sampleId: string): Promise<StoredSample | null> {
    try {
      logger.info('Disposing sample', { sampleId });

      return this.updateSample(sampleId, {
        status: 'disposed',
      });
    } catch (error) {
      logger.error('Error disposing sample', { error, sampleId });
      throw error;
    }
  }

  /**
   * Retrieves statistics about samples.
   * @returns Object containing sample statistics by status
   */
  async getSampleStatistics(): Promise<{
    total: number;
    byStatus: {
      pending: number;
      collected: number;
      received: number;
      processing: number;
      completed: number;
      rejected: number;
      disposed: number;
    };
  }> {
    try {
      const samples = Array.from(this.sampleStore.values());

      const stats = {
        total: samples.length,
        byStatus: {
          pending: samples.filter(s => s.status === 'pending').length,
          collected: samples.filter(s => s.status === 'collected').length,
          received: samples.filter(s => s.status === 'received').length,
          processing: samples.filter(s => s.status === 'processing').length,
          completed: samples.filter(s => s.status === 'completed').length,
          rejected: samples.filter(s => s.status === 'rejected').length,
          disposed: samples.filter(s => s.status === 'disposed').length,
        },
      };

      logger.debug('Retrieved sample statistics', stats);

      return stats;
    } catch (error) {
      logger.error('Error fetching sample statistics', { error });
      throw error;
    }
  }

  /**
   * Generates a unique sample number.
   * Format: SMP-{timestamp}-{random}
   * @returns A unique sample number string
   */
  private generateSampleNumber(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `SMP-${timestamp}-${random}`;
  }

  /**
   * Marks a sample as processing.
   * @param sampleId - The ID of the sample to mark as processing
   * @returns The updated sample object or null if not found
   */
  async startProcessing(sampleId: string): Promise<StoredSample | null> {
    logger.info('Starting sample processing', { sampleId });
    return this.updateSample(sampleId, { status: 'processing' });
  }

  /**
   * Marks a sample as completed.
   * @param sampleId - The ID of the sample to mark as completed
   * @returns The updated sample object or null if not found
   */
  async completeSample(sampleId: string): Promise<StoredSample | null> {
    logger.info('Completing sample', { sampleId });
    return this.updateSample(sampleId, { status: 'completed' });
  }

  /**
   * Retrieves samples by their status.
   * @param status - The status to filter by
   * @param limit - Maximum number of samples to return (default: 50)
   * @returns Array of samples with the given status
   */
  async getSamplesByStatus(status: SampleStatus, limit: number = 50): Promise<StoredSample[]> {
    try {
      const { samples } = await this.getAllSamples({ status, limit });
      return samples;
    } catch (error) {
      logger.error('Error fetching samples by status', { error, status });
      throw error;
    }
  }

  /**
   * Clears all samples from memory. Useful for testing.
   * WARNING: This will delete all sample data. Use with caution.
   */
  async clearAllSamples(): Promise<void> {
    this.sampleStore.clear();
    this.sampleNumberIndex.clear();
    this.orderSamplesIndex.clear();
    logger.warn('All samples cleared from memory');
  }
}

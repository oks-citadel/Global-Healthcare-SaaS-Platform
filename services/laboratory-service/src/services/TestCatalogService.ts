import { PrismaClient, TestCategory } from '../generated/client';
import { CreateTestCatalogInput, ReferenceRangeInput } from '../types';
import logger from '../utils/logger';

/**
 * In-memory storage for reference ranges.
 * This serves as a temporary data store until the ReferenceRange model is added to the Prisma schema.
 * In production, replace this with proper database persistence.
 */
interface StoredReferenceRange {
  id: string;
  testCatalogId: string;
  componentCode?: string;
  componentName: string;
  lowValue?: number;
  highValue?: number;
  textValue?: string;
  unit?: string;
  criticalLow?: number;
  criticalHigh?: number;
  ageMin?: number;
  ageMax?: number;
  gender?: string;
  condition?: string;
  interpretation?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * TestCatalogService manages the catalog of available diagnostic tests.
 *
 * This service handles:
 * - Creating and managing test catalog entries
 * - Managing reference ranges for test components
 * - Searching and filtering tests
 * - Test activation/deactivation
 * - Test statistics
 *
 * NOTE: Reference ranges currently use in-memory storage. When the ReferenceRange model
 * is added to the Prisma schema, update the implementation to use database persistence.
 */
export class TestCatalogService {
  private prisma: PrismaClient;

  /**
   * In-memory storage for reference ranges until database model is available.
   * Key: range ID, Value: StoredReferenceRange object
   */
  private referenceRangeStore: Map<string, StoredReferenceRange> = new Map();

  /**
   * Index for test-based reference range lookups.
   * Key: test catalog ID, Value: array of reference range IDs
   */
  private testRangesIndex: Map<string, string[]> = new Map();

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Creates a new test catalog entry.
   * @param input - The test creation input data
   * @returns The created test object
   */
  async createTest(input: CreateTestCatalogInput) {
    try {
      // Note: Using DiagnosticTest model from existing schema
      // In production with updated schema, you would use TestCatalog model
      const test = await this.prisma.diagnosticTest.create({
        data: {
          code: input.code,
          name: input.name,
          category: input.category,
          description: input.description,
          preparation: input.preparation,
          sampleType: input.sampleType,
          turnaroundTime: input.turnaroundTime,
          price: input.price,
          currency: input.currency || 'USD',
          isActive: true,
        },
      });

      logger.info('Test catalog entry created', {
        testId: test.id,
        code: test.code,
        name: test.name,
      });

      return test;
    } catch (error) {
      logger.error('Error creating test catalog entry', { error, input });
      throw error;
    }
  }

  /**
   * Retrieves a test by its ID.
   * @param testId - The ID of the test to retrieve
   * @returns The test object or null if not found
   */
  async getTestById(testId: string) {
    try {
      const test = await this.prisma.diagnosticTest.findUnique({
        where: { id: testId },
      });

      return test;
    } catch (error) {
      logger.error('Error fetching test', { error, testId });
      throw error;
    }
  }

  /**
   * Retrieves a test by its code.
   * @param code - The test code to look up
   * @returns The test object or null if not found
   */
  async getTestByCode(code: string) {
    try {
      const test = await this.prisma.diagnosticTest.findUnique({
        where: { code },
      });

      return test;
    } catch (error) {
      logger.error('Error fetching test by code', { error, code });
      throw error;
    }
  }

  /**
   * Retrieves all tests with optional filtering.
   * @param filters - Optional filters for category, active status, search, and pagination
   * @returns Object containing tests array and total count
   */
  async getAllTests(filters?: {
    category?: TestCategory;
    isActive?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      const where: any = {};

      if (filters?.category) {
        where.category = filters.category;
      }

      if (filters?.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      if (filters?.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { code: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const [tests, total] = await Promise.all([
        this.prisma.diagnosticTest.findMany({
          where,
          orderBy: { name: 'asc' },
          take: filters?.limit || 50,
          skip: filters?.offset || 0,
        }),
        this.prisma.diagnosticTest.count({ where }),
      ]);

      return { tests, total };
    } catch (error) {
      logger.error('Error fetching tests', { error, filters });
      throw error;
    }
  }

  /**
   * Retrieves active tests by category.
   * @param category - The test category to filter by
   * @returns Object containing tests array and total count
   */
  async getTestsByCategory(category: TestCategory) {
    return this.getAllTests({ category, isActive: true });
  }

  /**
   * Updates a test catalog entry.
   * @param testId - The ID of the test to update
   * @param updates - The updates to apply
   * @returns The updated test object
   */
  async updateTest(testId: string, updates: Partial<CreateTestCatalogInput>) {
    try {
      const test = await this.prisma.diagnosticTest.update({
        where: { id: testId },
        data: updates,
      });

      logger.info('Test catalog entry updated', {
        testId: test.id,
        code: test.code,
      });

      return test;
    } catch (error) {
      logger.error('Error updating test', { error, testId, updates });
      throw error;
    }
  }

  /**
   * Deactivates a test catalog entry.
   * @param testId - The ID of the test to deactivate
   * @returns The updated test object
   */
  async deactivateTest(testId: string) {
    try {
      const test = await this.prisma.diagnosticTest.update({
        where: { id: testId },
        data: { isActive: false },
      });

      logger.info('Test catalog entry deactivated', {
        testId: test.id,
        code: test.code,
      });

      return test;
    } catch (error) {
      logger.error('Error deactivating test', { error, testId });
      throw error;
    }
  }

  /**
   * Activates a test catalog entry.
   * @param testId - The ID of the test to activate
   * @returns The updated test object
   */
  async activateTest(testId: string) {
    try {
      const test = await this.prisma.diagnosticTest.update({
        where: { id: testId },
        data: { isActive: true },
      });

      logger.info('Test catalog entry activated', {
        testId: test.id,
        code: test.code,
      });

      return test;
    } catch (error) {
      logger.error('Error activating test', { error, testId });
      throw error;
    }
  }

  /**
   * Deletes a test catalog entry.
   * @param testId - The ID of the test to delete
   * @returns The deleted test object
   */
  async deleteTest(testId: string) {
    try {
      // Also delete associated reference ranges from in-memory store
      const rangeIds = this.testRangesIndex.get(testId) || [];
      for (const rangeId of rangeIds) {
        this.referenceRangeStore.delete(rangeId);
      }
      this.testRangesIndex.delete(testId);

      const test = await this.prisma.diagnosticTest.delete({
        where: { id: testId },
      });

      logger.info('Test catalog entry deleted', {
        testId: test.id,
        code: test.code,
      });

      return test;
    } catch (error) {
      logger.error('Error deleting test', { error, testId });
      throw error;
    }
  }

  /**
   * Searches for tests by query string.
   * @param query - The search query
   * @param limit - Maximum number of results to return (default: 20)
   * @returns Object containing matching tests and total count
   */
  async searchTests(query: string, limit: number = 20) {
    return this.getAllTests({ search: query, isActive: true, limit });
  }

  /**
   * Retrieves statistics about the test catalog.
   * @returns Object containing test statistics
   */
  async getTestStatistics() {
    try {
      const [total, active, inactive] = await Promise.all([
        this.prisma.diagnosticTest.count(),
        this.prisma.diagnosticTest.count({ where: { isActive: true } }),
        this.prisma.diagnosticTest.count({ where: { isActive: false } }),
      ]);

      // Count by category
      const categories = await this.prisma.diagnosticTest.groupBy({
        by: ['category'],
        _count: true,
        where: { isActive: true },
      });

      const byCategory = categories.reduce(
        (acc, curr) => {
          acc[curr.category] = curr._count;
          return acc;
        },
        {} as Record<string, number>
      );

      return {
        total,
        active,
        inactive,
        byCategory,
      };
    } catch (error) {
      logger.error('Error fetching test statistics', { error });
      throw error;
    }
  }

  /**
   * Adds a reference range for a test component.
   * Reference ranges define normal values for test components and can be
   * specific to age, gender, or other conditions.
   *
   * @param testId - The ID of the test to add the reference range to
   * @param rangeData - The reference range data
   * @returns The created reference range object
   */
  async addReferenceRange(testId: string, rangeData: ReferenceRangeInput): Promise<StoredReferenceRange> {
    try {
      // Verify the test exists
      const test = await this.getTestById(testId);
      if (!test) {
        throw new Error(`Test with ID ${testId} not found`);
      }

      const rangeId = `range-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const now = new Date();

      const range: StoredReferenceRange = {
        id: rangeId,
        testCatalogId: testId,
        componentCode: rangeData.componentCode,
        componentName: rangeData.componentName,
        lowValue: rangeData.lowValue,
        highValue: rangeData.highValue,
        textValue: rangeData.textValue,
        unit: rangeData.unit,
        criticalLow: rangeData.criticalLow,
        criticalHigh: rangeData.criticalHigh,
        ageMin: rangeData.ageMin,
        ageMax: rangeData.ageMax,
        gender: rangeData.gender,
        condition: rangeData.condition,
        interpretation: rangeData.interpretation,
        createdAt: now,
        updatedAt: now,
      };

      // Store the reference range
      this.referenceRangeStore.set(rangeId, range);

      // Update the test index
      const testRanges = this.testRangesIndex.get(testId) || [];
      testRanges.push(rangeId);
      this.testRangesIndex.set(testId, testRanges);

      logger.info('Reference range added', {
        rangeId,
        testId,
        componentName: rangeData.componentName,
        lowValue: rangeData.lowValue,
        highValue: rangeData.highValue,
      });

      return range;
    } catch (error) {
      logger.error('Error adding reference range', { error, testId, rangeData });
      throw error;
    }
  }

  /**
   * Retrieves all reference ranges for a test.
   * @param testId - The ID of the test to get reference ranges for
   * @returns Array of reference ranges for the test, sorted by component name
   */
  async getReferenceRanges(testId: string): Promise<StoredReferenceRange[]> {
    try {
      const rangeIds = this.testRangesIndex.get(testId) || [];
      const ranges: StoredReferenceRange[] = [];

      for (const rangeId of rangeIds) {
        const range = this.referenceRangeStore.get(rangeId);
        if (range) {
          ranges.push(range);
        }
      }

      // Sort by component name
      ranges.sort((a, b) => a.componentName.localeCompare(b.componentName));

      logger.debug('Retrieved reference ranges', {
        testId,
        count: ranges.length,
      });

      return ranges;
    } catch (error) {
      logger.error('Error fetching reference ranges', { error, testId });
      throw error;
    }
  }

  /**
   * Updates a reference range.
   * @param rangeId - The ID of the reference range to update
   * @param updates - The updates to apply
   * @returns The updated reference range object or null if not found
   */
  async updateReferenceRange(rangeId: string, updates: Partial<ReferenceRangeInput>): Promise<StoredReferenceRange | null> {
    try {
      const range = this.referenceRangeStore.get(rangeId);

      if (!range) {
        logger.warn('Reference range not found for update', { rangeId });
        return null;
      }

      // Apply updates
      if (updates.componentCode !== undefined) {
        range.componentCode = updates.componentCode;
      }
      if (updates.componentName !== undefined) {
        range.componentName = updates.componentName;
      }
      if (updates.lowValue !== undefined) {
        range.lowValue = updates.lowValue;
      }
      if (updates.highValue !== undefined) {
        range.highValue = updates.highValue;
      }
      if (updates.textValue !== undefined) {
        range.textValue = updates.textValue;
      }
      if (updates.unit !== undefined) {
        range.unit = updates.unit;
      }
      if (updates.criticalLow !== undefined) {
        range.criticalLow = updates.criticalLow;
      }
      if (updates.criticalHigh !== undefined) {
        range.criticalHigh = updates.criticalHigh;
      }
      if (updates.ageMin !== undefined) {
        range.ageMin = updates.ageMin;
      }
      if (updates.ageMax !== undefined) {
        range.ageMax = updates.ageMax;
      }
      if (updates.gender !== undefined) {
        range.gender = updates.gender;
      }
      if (updates.condition !== undefined) {
        range.condition = updates.condition;
      }
      if (updates.interpretation !== undefined) {
        range.interpretation = updates.interpretation;
      }

      range.updatedAt = new Date();
      this.referenceRangeStore.set(rangeId, range);

      logger.info('Reference range updated', {
        rangeId,
        testId: range.testCatalogId,
        componentName: range.componentName,
      });

      return range;
    } catch (error) {
      logger.error('Error updating reference range', { error, rangeId, updates });
      throw error;
    }
  }

  /**
   * Deletes a reference range.
   * @param rangeId - The ID of the reference range to delete
   * @returns The deleted reference range object or null if not found
   */
  async deleteReferenceRange(rangeId: string): Promise<StoredReferenceRange | null> {
    try {
      const range = this.referenceRangeStore.get(rangeId);

      if (!range) {
        logger.warn('Reference range not found for deletion', { rangeId });
        return null;
      }

      // Remove from store
      this.referenceRangeStore.delete(rangeId);

      // Remove from test index
      const testRanges = this.testRangesIndex.get(range.testCatalogId);
      if (testRanges) {
        const index = testRanges.indexOf(rangeId);
        if (index > -1) {
          testRanges.splice(index, 1);
        }
        this.testRangesIndex.set(range.testCatalogId, testRanges);
      }

      logger.info('Reference range deleted', {
        rangeId,
        testId: range.testCatalogId,
        componentName: range.componentName,
      });

      return range;
    } catch (error) {
      logger.error('Error deleting reference range', { error, rangeId });
      throw error;
    }
  }

  /**
   * Retrieves a single reference range by ID.
   * @param rangeId - The ID of the reference range to retrieve
   * @returns The reference range object or null if not found
   */
  async getReferenceRangeById(rangeId: string): Promise<StoredReferenceRange | null> {
    try {
      const range = this.referenceRangeStore.get(rangeId) || null;

      if (!range) {
        logger.debug('Reference range not found', { rangeId });
      }

      return range;
    } catch (error) {
      logger.error('Error fetching reference range', { error, rangeId });
      throw error;
    }
  }

  /**
   * Finds the applicable reference range for a test result based on patient demographics.
   * @param testId - The ID of the test
   * @param componentName - The component name to find the range for
   * @param patientAge - Optional patient age for age-specific ranges
   * @param patientGender - Optional patient gender for gender-specific ranges
   * @returns The most specific applicable reference range or null if none found
   */
  async findApplicableReferenceRange(
    testId: string,
    componentName: string,
    patientAge?: number,
    patientGender?: string
  ): Promise<StoredReferenceRange | null> {
    try {
      const ranges = await this.getReferenceRanges(testId);

      // Filter by component name
      let applicable = ranges.filter(r => r.componentName === componentName);

      if (applicable.length === 0) {
        return null;
      }

      // Score each range based on specificity
      const scored = applicable.map(range => {
        let score = 0;
        let matches = true;

        // Check age range
        if (patientAge !== undefined) {
          if (range.ageMin !== undefined && patientAge < range.ageMin) {
            matches = false;
          }
          if (range.ageMax !== undefined && patientAge > range.ageMax) {
            matches = false;
          }
          if (range.ageMin !== undefined || range.ageMax !== undefined) {
            score += 1; // Age-specific ranges are more specific
          }
        }

        // Check gender
        if (patientGender !== undefined && range.gender !== undefined) {
          if (range.gender.toLowerCase() !== patientGender.toLowerCase()) {
            matches = false;
          }
          score += 1; // Gender-specific ranges are more specific
        }

        return { range, score, matches };
      });

      // Filter to only matching ranges and sort by specificity (higher score = more specific)
      const matching = scored
        .filter(s => s.matches)
        .sort((a, b) => b.score - a.score);

      if (matching.length === 0) {
        // Fall back to ranges without restrictions
        const unrestricted = ranges.find(
          r => r.componentName === componentName &&
               r.ageMin === undefined &&
               r.ageMax === undefined &&
               r.gender === undefined
        );
        return unrestricted || null;
      }

      return matching[0].range;
    } catch (error) {
      logger.error('Error finding applicable reference range', {
        error,
        testId,
        componentName,
      });
      throw error;
    }
  }

  /**
   * Clears all reference ranges from memory. Useful for testing.
   * WARNING: This will delete all reference range data. Use with caution.
   */
  async clearAllReferenceRanges(): Promise<void> {
    this.referenceRangeStore.clear();
    this.testRangesIndex.clear();
    logger.warn('All reference ranges cleared from memory');
  }
}

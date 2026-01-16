#!/usr/bin/env npx ts-node

/**
 * Data Migration Script: Encrypt Existing PII Data
 *
 * This script encrypts existing unencrypted PII data in the database.
 * It should be run as a one-time migration after deploying field-level encryption.
 *
 * IMPORTANT:
 * - Backup your database before running this script
 * - Run in a maintenance window with low traffic
 * - Test on a staging environment first
 * - Monitor for any errors during migration
 *
 * Usage:
 *   npx ts-node scripts/migrate-encrypt-existing-data.ts [--dry-run] [--batch-size=100] [--model=User]
 *
 * Options:
 *   --dry-run      Preview changes without modifying data
 *   --batch-size   Number of records to process at once (default: 100)
 *   --model        Specific model to migrate (optional, migrates all if not specified)
 *   --verbose      Show detailed progress
 */

import { PrismaClient } from '../src/generated/client/index.js';
import {
  encryptField,
  isEncrypted,
  getEncryptedFieldsForModel,
  ENCRYPTED_FIELDS,
} from '../src/lib/field-encryption.js';

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const verbose = args.includes('--verbose');
const batchSizeArg = args.find((a) => a.startsWith('--batch-size='));
const batchSize = batchSizeArg ? parseInt(batchSizeArg.split('=')[1], 10) : 100;
const modelArg = args.find((a) => a.startsWith('--model='));
const specificModel = modelArg ? modelArg.split('=')[1] : null;

const prisma = new PrismaClient();

interface MigrationResult {
  model: string;
  total: number;
  processed: number;
  encrypted: number;
  skipped: number;
  errors: number;
  errorDetails: string[];
}

interface MigrationSummary {
  startTime: Date;
  endTime?: Date;
  dryRun: boolean;
  results: MigrationResult[];
  totalRecords: number;
  totalEncrypted: number;
  totalErrors: number;
}

/**
 * Get models that have encryption configured
 */
function getModelsToMigrate(): string[] {
  const models = Object.keys(ENCRYPTED_FIELDS).filter(
    (m) => m !== '_global' && ENCRYPTED_FIELDS[m].length > 0
  );

  // Add models that only have global fields but exist in the database
  const allModels = [
    'User',
    'Patient',
    'Caregiver',
    'PatientHome',
    'MileageEntry',
    'ClinicalNote',
    'Appointment',
    'ChatMessage',
  ];

  // Return unique models that either have specific fields or global fields
  return [...new Set([...models, ...allModels])];
}

/**
 * Log with timestamp
 */
function log(message: string, level: 'info' | 'warn' | 'error' | 'debug' = 'info'): void {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '[INFO]',
    warn: '[WARN]',
    error: '[ERROR]',
    debug: '[DEBUG]',
  }[level];

  if (level === 'debug' && !verbose) {
    return;
  }

  console.log(`${timestamp} ${prefix} ${message}`);
}

/**
 * Encrypt a single record's fields
 */
function encryptRecordFields(
  record: Record<string, unknown>,
  fields: string[]
): { updated: boolean; data: Record<string, unknown> } {
  const result = { ...record };
  let updated = false;

  for (const field of fields) {
    const value = result[field];

    if (value === null || value === undefined) {
      continue;
    }

    if (typeof value === 'string' && !isEncrypted(value) && value.trim() !== '') {
      result[field] = encryptField(value);
      updated = true;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // Handle JSON fields
      const jsonResult = encryptJsonField(value as Record<string, unknown>);
      if (jsonResult.updated) {
        result[field] = jsonResult.data;
        updated = true;
      }
    }
  }

  return { updated, data: result };
}

/**
 * Encrypt string values in a JSON object
 */
function encryptJsonField(
  obj: Record<string, unknown>
): { updated: boolean; data: Record<string, unknown> } {
  let updated = false;
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && !isEncrypted(value) && value.trim() !== '') {
      result[key] = encryptField(value);
      updated = true;
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const nested = encryptJsonField(value as Record<string, unknown>);
      result[key] = nested.data;
      if (nested.updated) updated = true;
    } else {
      result[key] = value;
    }
  }

  return { updated, data: result };
}

/**
 * Migrate a single model's data
 */
async function migrateModel(modelName: string): Promise<MigrationResult> {
  const result: MigrationResult = {
    model: modelName,
    total: 0,
    processed: 0,
    encrypted: 0,
    skipped: 0,
    errors: 0,
    errorDetails: [],
  };

  const fields = getEncryptedFieldsForModel(modelName);

  if (fields.length === 0) {
    log(`Skipping ${modelName}: no encrypted fields configured`, 'debug');
    return result;
  }

  log(`Migrating ${modelName} (fields: ${fields.join(', ')})`);

  // Get the Prisma model dynamically
  const model = (prisma as Record<string, unknown>)[
    modelName.charAt(0).toLowerCase() + modelName.slice(1)
  ] as {
    count: () => Promise<number>;
    findMany: (args: { skip: number; take: number }) => Promise<Record<string, unknown>[]>;
    update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<unknown>;
  };

  if (!model) {
    log(`Model ${modelName} not found in Prisma client`, 'warn');
    return result;
  }

  try {
    // Count total records
    result.total = await model.count();
    log(`Found ${result.total} ${modelName} records to process`, 'debug');

    if (result.total === 0) {
      return result;
    }

    // Process in batches
    let offset = 0;

    while (offset < result.total) {
      const records = await model.findMany({
        skip: offset,
        take: batchSize,
      });

      for (const record of records) {
        result.processed++;

        try {
          const { updated, data } = encryptRecordFields(record, fields);

          if (!updated) {
            result.skipped++;
            log(`${modelName} ${record.id}: already encrypted or empty`, 'debug');
            continue;
          }

          if (dryRun) {
            result.encrypted++;
            log(`${modelName} ${record.id}: would encrypt (dry run)`, 'debug');
          } else {
            // Remove id from update data
            const { id, createdAt, updatedAt, ...updateData } = data;

            await model.update({
              where: { id: record.id as string },
              data: updateData,
            });

            result.encrypted++;
            log(`${modelName} ${record.id}: encrypted successfully`, 'debug');
          }
        } catch (error) {
          result.errors++;
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          result.errorDetails.push(`${record.id}: ${errorMessage}`);
          log(`${modelName} ${record.id}: error - ${errorMessage}`, 'error');
        }
      }

      offset += batchSize;

      // Progress update
      const progress = Math.min(100, Math.round((offset / result.total) * 100));
      log(`${modelName}: ${progress}% complete (${result.encrypted} encrypted, ${result.skipped} skipped, ${result.errors} errors)`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log(`Failed to migrate ${modelName}: ${errorMessage}`, 'error');
    result.errorDetails.push(`Model error: ${errorMessage}`);
    result.errors++;
  }

  return result;
}

/**
 * Main migration function
 */
async function runMigration(): Promise<void> {
  const summary: MigrationSummary = {
    startTime: new Date(),
    dryRun,
    results: [],
    totalRecords: 0,
    totalEncrypted: 0,
    totalErrors: 0,
  };

  console.log('');
  console.log('='.repeat(60));
  console.log('Field-Level Encryption Migration');
  console.log('='.repeat(60));
  console.log(`Mode: ${dryRun ? 'DRY RUN (no changes will be made)' : 'LIVE'}`);
  console.log(`Batch Size: ${batchSize}`);
  console.log(`Started: ${summary.startTime.toISOString()}`);
  console.log('='.repeat(60));
  console.log('');

  if (!dryRun) {
    console.log('WARNING: This will modify your database!');
    console.log('Make sure you have a backup before proceeding.');
    console.log('');
  }

  const models = specificModel ? [specificModel] : getModelsToMigrate();

  log(`Models to migrate: ${models.join(', ')}`);
  console.log('');

  for (const model of models) {
    const result = await migrateModel(model);
    summary.results.push(result);
    summary.totalRecords += result.total;
    summary.totalEncrypted += result.encrypted;
    summary.totalErrors += result.errors;
  }

  summary.endTime = new Date();

  // Print summary
  console.log('');
  console.log('='.repeat(60));
  console.log('Migration Summary');
  console.log('='.repeat(60));
  console.log(`Duration: ${((summary.endTime.getTime() - summary.startTime.getTime()) / 1000).toFixed(2)}s`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log('');

  console.log('Results by Model:');
  console.log('-'.repeat(60));

  for (const result of summary.results) {
    if (result.total > 0) {
      console.log(`${result.model}:`);
      console.log(`  Total: ${result.total}`);
      console.log(`  Encrypted: ${result.encrypted}`);
      console.log(`  Skipped: ${result.skipped}`);
      console.log(`  Errors: ${result.errors}`);

      if (result.errorDetails.length > 0 && verbose) {
        console.log(`  Error Details:`);
        result.errorDetails.slice(0, 5).forEach((e) => console.log(`    - ${e}`));
        if (result.errorDetails.length > 5) {
          console.log(`    ... and ${result.errorDetails.length - 5} more`);
        }
      }
    }
  }

  console.log('-'.repeat(60));
  console.log(`Total Records: ${summary.totalRecords}`);
  console.log(`Total Encrypted: ${summary.totalEncrypted}`);
  console.log(`Total Errors: ${summary.totalErrors}`);
  console.log('='.repeat(60));

  if (summary.totalErrors > 0) {
    console.log('');
    console.log('WARNING: Some records failed to encrypt. Review the errors above.');
    console.log('You may need to fix these records manually or re-run the migration.');
  }

  if (dryRun) {
    console.log('');
    console.log('This was a DRY RUN. No changes were made to the database.');
    console.log('Run without --dry-run to apply changes.');
  }
}

/**
 * Entry point
 */
async function main(): Promise<void> {
  try {
    // Verify encryption key is set
    if (!process.env.FIELD_ENCRYPTION_KEY && !process.env.ENCRYPTION_KEY) {
      console.error('ERROR: FIELD_ENCRYPTION_KEY or ENCRYPTION_KEY must be set');
      process.exit(1);
    }

    await runMigration();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

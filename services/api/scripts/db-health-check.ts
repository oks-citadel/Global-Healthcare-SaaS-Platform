import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient({
  log: ['error'],
});

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

interface HealthCheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  details?: any;
}

const results: HealthCheckResult[] = [];

// ==================================================
// Helper Functions
// ==================================================

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logResult(result: HealthCheckResult) {
  const icon = result.status === 'pass' ? '✓' : result.status === 'fail' ? '✗' : '⚠';
  const color = result.status === 'pass' ? 'green' : result.status === 'fail' ? 'red' : 'yellow';

  log(`${icon} ${result.name}: ${result.message}`, color);
  if (result.details) {
    console.log('  Details:', result.details);
  }
}

function addResult(name: string, status: 'pass' | 'fail' | 'warn', message: string, details?: any) {
  results.push({ name, status, message, details });
}

// ==================================================
// Health Check Functions
// ==================================================

async function checkDatabaseConnection(): Promise<void> {
  try {
    await prisma.$connect();
    addResult('Database Connection', 'pass', 'Successfully connected to database');
  } catch (error) {
    addResult(
      'Database Connection',
      'fail',
      'Failed to connect to database',
      error instanceof Error ? error.message : String(error)
    );
  }
}

async function checkDatabaseVersion(): Promise<void> {
  try {
    const result = await prisma.$queryRaw<[{ version: string }]>`SELECT version() as version`;
    const version = result[0]?.version || 'Unknown';
    const postgresVersion = version.match(/PostgreSQL (\d+\.\d+)/)?.[1];

    if (postgresVersion) {
      const majorVersion = parseInt(postgresVersion.split('.')[0]);
      if (majorVersion >= 13) {
        addResult('Database Version', 'pass', `PostgreSQL ${postgresVersion}`, { fullVersion: version });
      } else {
        addResult(
          'Database Version',
          'warn',
          `PostgreSQL ${postgresVersion} (upgrade recommended)`,
          { fullVersion: version }
        );
      }
    } else {
      addResult('Database Version', 'warn', 'Could not determine version', { fullVersion: version });
    }
  } catch (error) {
    addResult('Database Version', 'fail', 'Failed to check version', error);
  }
}

async function checkDatabaseSize(): Promise<void> {
  try {
    const result = await prisma.$queryRaw<[{ size: string }]>`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size
    `;
    const size = result[0]?.size || 'Unknown';
    addResult('Database Size', 'pass', size);
  } catch (error) {
    addResult('Database Size', 'fail', 'Failed to check database size', error);
  }
}

async function checkTableCounts(): Promise<void> {
  try {
    const tables = [
      { name: 'User', model: prisma.user },
      { name: 'Patient', model: prisma.patient },
      { name: 'Provider', model: prisma.provider },
      { name: 'Appointment', model: prisma.appointment },
      { name: 'Subscription', model: prisma.subscription },
      { name: 'Plan', model: prisma.plan },
    ];

    const counts: Record<string, number> = {};
    for (const table of tables) {
      counts[table.name] = await table.model.count();
    }

    addResult('Table Row Counts', 'pass', 'Successfully counted all tables', counts);
  } catch (error) {
    addResult('Table Row Counts', 'fail', 'Failed to count table rows', error);
  }
}

async function checkIndexes(): Promise<void> {
  try {
    const result = await prisma.$queryRaw<
      Array<{ tablename: string; indexname: string; indexdef: string }>
    >`
      SELECT
        tablename,
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname
    `;

    const indexCount = result.length;
    const tableIndexes = result.reduce((acc, idx) => {
      acc[idx.tablename] = (acc[idx.tablename] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    addResult('Database Indexes', 'pass', `Found ${indexCount} indexes`, tableIndexes);
  } catch (error) {
    addResult('Database Indexes', 'fail', 'Failed to check indexes', error);
  }
}

async function checkForeignKeys(): Promise<void> {
  try {
    const result = await prisma.$queryRaw<
      Array<{ constraint_name: string; table_name: string }>
    >`
      SELECT
        con.conname as constraint_name,
        rel.relname as table_name
      FROM pg_constraint con
      JOIN pg_class rel ON con.conrelid = rel.oid
      WHERE con.contype = 'f'
    `;

    const fkCount = result.length;
    addResult('Foreign Key Constraints', 'pass', `Found ${fkCount} foreign key constraints`);
  } catch (error) {
    addResult('Foreign Key Constraints', 'fail', 'Failed to check foreign keys', error);
  }
}

async function checkDataIntegrity(): Promise<void> {
  try {
    // Check for orphaned patients (patients without users)
    const orphanedPatients = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count
      FROM "Patient" p
      LEFT JOIN "User" u ON p."userId" = u.id
      WHERE u.id IS NULL
    `;

    // Check for orphaned providers
    const orphanedProviders = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count
      FROM "Provider" p
      LEFT JOIN "User" u ON p."userId" = u.id
      WHERE u.id IS NULL
    `;

    const patientCount = Number(orphanedPatients[0]?.count || 0);
    const providerCount = Number(orphanedProviders[0]?.count || 0);

    if (patientCount === 0 && providerCount === 0) {
      addResult('Data Integrity', 'pass', 'No orphaned records found');
    } else {
      addResult('Data Integrity', 'warn', 'Found orphaned records', {
        orphanedPatients: patientCount,
        orphanedProviders: providerCount,
      });
    }
  } catch (error) {
    addResult('Data Integrity', 'fail', 'Failed to check data integrity', error);
  }
}

async function checkConnectionPool(): Promise<void> {
  try {
    const result = await prisma.$queryRaw<
      Array<{ state: string; count: bigint }>
    >`
      SELECT
        state,
        COUNT(*) as count
      FROM pg_stat_activity
      WHERE datname = current_database()
      GROUP BY state
    `;

    const connections = result.reduce((acc, row) => {
      acc[row.state] = Number(row.count);
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(connections).reduce((sum, count) => sum + count, 0);

    // PostgreSQL default max_connections is 100
    if (total < 80) {
      addResult('Connection Pool', 'pass', `${total} active connections`, connections);
    } else {
      addResult('Connection Pool', 'warn', `${total} active connections (approaching limit)`, connections);
    }
  } catch (error) {
    addResult('Connection Pool', 'fail', 'Failed to check connection pool', error);
  }
}

async function checkDiskSpace(): Promise<void> {
  try {
    const result = await prisma.$queryRaw<
      Array<{ tablespace: string; size: string }>
    >`
      SELECT
        spcname as tablespace,
        pg_size_pretty(pg_tablespace_size(spcname)) as size
      FROM pg_tablespace
    `;

    addResult('Tablespace Sizes', 'pass', 'Disk space information retrieved', result);
  } catch (error) {
    addResult('Tablespace Sizes', 'warn', 'Could not retrieve disk space info', error);
  }
}

async function checkLongRunningQueries(): Promise<void> {
  try {
    const result = await prisma.$queryRaw<
      Array<{
        pid: number;
        duration: string;
        query: string;
        state: string;
      }>
    >`
      SELECT
        pid,
        now() - pg_stat_activity.query_start AS duration,
        query,
        state
      FROM pg_stat_activity
      WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes'
        AND state != 'idle'
        AND datname = current_database()
    `;

    if (result.length === 0) {
      addResult('Long Running Queries', 'pass', 'No long-running queries detected');
    } else {
      addResult('Long Running Queries', 'warn', `Found ${result.length} long-running queries`, result);
    }
  } catch (error) {
    addResult('Long Running Queries', 'fail', 'Failed to check long-running queries', error);
  }
}

async function checkMigrationStatus(): Promise<void> {
  try {
    // Check if _prisma_migrations table exists
    const result = await prisma.$queryRaw<
      Array<{ migration_name: string; finished_at: Date | null }>
    >`
      SELECT migration_name, finished_at
      FROM _prisma_migrations
      ORDER BY finished_at DESC
      LIMIT 1
    `;

    if (result.length > 0) {
      const lastMigration = result[0];
      if (lastMigration.finished_at) {
        addResult(
          'Migration Status',
          'pass',
          `Last migration: ${lastMigration.migration_name}`,
          { finishedAt: lastMigration.finished_at }
        );
      } else {
        addResult('Migration Status', 'warn', 'Last migration not finished', lastMigration);
      }
    } else {
      addResult('Migration Status', 'warn', 'No migrations found in database');
    }
  } catch (error) {
    addResult('Migration Status', 'fail', 'Failed to check migration status', error);
  }
}

async function checkDeadlocks(): Promise<void> {
  try {
    const result = await prisma.$queryRaw<[{ deadlocks: bigint }]>`
      SELECT deadlocks
      FROM pg_stat_database
      WHERE datname = current_database()
    `;

    const deadlocks = Number(result[0]?.deadlocks || 0);

    if (deadlocks === 0) {
      addResult('Deadlocks', 'pass', 'No deadlocks detected');
    } else if (deadlocks < 10) {
      addResult('Deadlocks', 'warn', `${deadlocks} deadlocks detected (acceptable)`, { count: deadlocks });
    } else {
      addResult('Deadlocks', 'warn', `${deadlocks} deadlocks detected (investigate)`, { count: deadlocks });
    }
  } catch (error) {
    addResult('Deadlocks', 'fail', 'Failed to check deadlocks', error);
  }
}

async function checkCacheHitRatio(): Promise<void> {
  try {
    const result = await prisma.$queryRaw<
      Array<{
        cache_hit_ratio: number;
      }>
    >`
      SELECT
        ROUND(
          100.0 * sum(blks_hit) / NULLIF(sum(blks_hit) + sum(blks_read), 0),
          2
        ) as cache_hit_ratio
      FROM pg_stat_database
      WHERE datname = current_database()
    `;

    const hitRatio = result[0]?.cache_hit_ratio || 0;

    if (hitRatio >= 90) {
      addResult('Cache Hit Ratio', 'pass', `${hitRatio}% (excellent)`);
    } else if (hitRatio >= 80) {
      addResult('Cache Hit Ratio', 'warn', `${hitRatio}% (good, but could be better)`);
    } else {
      addResult('Cache Hit Ratio', 'warn', `${hitRatio}% (consider increasing shared_buffers)`);
    }
  } catch (error) {
    addResult('Cache Hit Ratio', 'fail', 'Failed to check cache hit ratio', error);
  }
}

// ==================================================
// Main Health Check Runner
// ==================================================

async function runHealthChecks(): Promise<void> {
  log('\n============================================', 'cyan');
  log('  Database Health Check', 'cyan');
  log('  Unified Healthcare Platform', 'cyan');
  log('============================================\n', 'cyan');

  const checks = [
    { name: 'Database Connection', fn: checkDatabaseConnection },
    { name: 'Database Version', fn: checkDatabaseVersion },
    { name: 'Database Size', fn: checkDatabaseSize },
    { name: 'Table Counts', fn: checkTableCounts },
    { name: 'Indexes', fn: checkIndexes },
    { name: 'Foreign Keys', fn: checkForeignKeys },
    { name: 'Data Integrity', fn: checkDataIntegrity },
    { name: 'Connection Pool', fn: checkConnectionPool },
    { name: 'Disk Space', fn: checkDiskSpace },
    { name: 'Long Running Queries', fn: checkLongRunningQueries },
    { name: 'Migration Status', fn: checkMigrationStatus },
    { name: 'Deadlocks', fn: checkDeadlocks },
    { name: 'Cache Hit Ratio', fn: checkCacheHitRatio },
  ];

  for (const check of checks) {
    try {
      await check.fn();
    } catch (error) {
      addResult(check.name, 'fail', 'Unexpected error during check', error);
    }
  }

  // Display all results
  log('\nResults:', 'blue');
  log('========\n', 'blue');

  results.forEach(logResult);

  // Summary
  const passed = results.filter((r) => r.status === 'pass').length;
  const failed = results.filter((r) => r.status === 'fail').length;
  const warnings = results.filter((r) => r.status === 'warn').length;

  log('\n============================================', 'cyan');
  log('Summary:', 'cyan');
  log(`  Total Checks: ${results.length}`, 'cyan');
  log(`  Passed: ${passed}`, 'green');
  log(`  Warnings: ${warnings}`, 'yellow');
  log(`  Failed: ${failed}`, 'red');
  log('============================================\n', 'cyan');

  // Exit code based on results
  if (failed > 0) {
    log('❌ Health check FAILED', 'red');
    process.exit(1);
  } else if (warnings > 0) {
    log('⚠️  Health check PASSED with warnings', 'yellow');
    process.exit(0);
  } else {
    log('✅ Health check PASSED', 'green');
    process.exit(0);
  }
}

// ==================================================
// Execute Health Checks
// ==================================================

runHealthChecks()
  .catch((error) => {
    log('\n❌ Fatal error during health check:', 'red');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

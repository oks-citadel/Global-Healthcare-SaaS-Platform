/**
 * Example integration of monitoring, logging, and tracing
 * This file shows how to integrate all monitoring features in your Express app
 */

import express from 'express';
import { initTracing } from './tracing.js';
import { metricsMiddleware } from '../middleware/metrics.middleware.js';
import { correlationMiddleware } from '../middleware/correlation.middleware.js';
import { logger } from '../utils/logger.js';
import metricsRouter from '../routes/metrics.js';
import {
  appointmentsCreated,
  usersRegistered,
  dbQueryDuration,
  dbConnectionPoolActive,
} from './metrics.js';

// Initialize tracing at application startup
initTracing();

const app = express();

// Add correlation ID middleware first
app.use(correlationMiddleware);

// Add metrics middleware (exclude /health and /metrics endpoints)
app.use((req, res, next) => {
  if (req.path === '/health' || req.path === '/metrics') {
    return next();
  }
  return metricsMiddleware(req, res, next);
});

// Expose metrics endpoint
app.use('/metrics', metricsRouter);

// Example: Using metrics in your business logic
app.post('/api/appointments', async (req, res) => {
  try {
    logger.info('Creating appointment', { userId: req.body.userId });

    // Your business logic here
    const appointment = await createAppointment(req.body);

    // Record business metric
    appointmentsCreated.inc({
      status: 'scheduled',
      type: req.body.type || 'general',
    });

    logger.info('Appointment created successfully', {
      appointmentId: appointment.id,
    });

    res.json(appointment);
  } catch (error) {
    logger.error('Failed to create appointment', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Example: Using tracing in your service layer
import { withSpan } from './tracing.js';

class UserService {
  async createUser(data: CreateUserDto) {
    return await withSpan(
      'UserService.createUser',
      async (span) => {
        span.setAttribute('user.email', data.email);
        span.setAttribute('user.role', data.role);

        // Your user creation logic
        const user = await this.repository.create(data);

        // Record metric
        usersRegistered.inc({
          role: data.role,
          organization_type: data.organizationType || 'individual',
        });

        return user;
      }
    );
  }
}

// Example: Database query with metrics
async function executeQuery(query: string, params: unknown[]) {
  const startTime = Date.now();

  try {
    const result = await prisma.$queryRaw(query, ...params);

    // Record successful query
    const duration = (Date.now() - startTime) / 1000;
    dbQueryDuration.observe(
      {
        operation: 'query',
        table: extractTableName(query),
        status: 'success',
      },
      duration
    );

    return result;
  } catch (error) {
    // Record failed query
    const duration = (Date.now() - startTime) / 1000;
    dbQueryDuration.observe(
      {
        operation: 'query',
        table: extractTableName(query),
        status: 'error',
      },
      duration
    );

    throw error;
  }
}

// Example: Monitoring database connection pool
function monitorConnectionPool() {
  setInterval(() => {
    // Get pool stats from your database client
    const stats = getPoolStats();

    dbConnectionPoolActive.set(stats.active);
    dbConnectionPoolIdle.set(stats.idle);
    dbConnectionPoolWaiting.set(stats.waiting);
  }, 5000); // Update every 5 seconds
}

// Example: Using audit logging
import { auditLog } from '../utils/logger.js';

app.get('/api/patients/:id/records', async (req, res) => {
  const userId = req.user.id;
  const patientId = req.params.id;

  // Log the sensitive data access
  auditLog(
    'patient_records_access',
    userId,
    `patient/${patientId}/records`,
    {
      accessType: 'view',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    }
  );

  // Your business logic
  const records = await getPatientRecords(patientId);
  res.json(records);
});

// Example: Using performance logging
import { logPerformance } from '../utils/logger.js';

app.get('/api/reports/analytics', async (req, res) => {
  const startTime = Date.now();

  try {
    const analytics = await generateAnalytics(req.query);

    const duration = Date.now() - startTime;
    logPerformance('generate_analytics', duration, {
      reportType: req.query.type,
      dateRange: req.query.range,
    });

    res.json(analytics);
  } catch (error) {
    logger.error('Analytics generation failed', { error });
    res.status(500).json({ error: 'Failed to generate analytics' });
  }
});

// Example: Using security logging
import { logSecurityEvent } from '../utils/logger.js';

app.post('/api/auth/login', async (req, res) => {
  try {
    const user = await authenticateUser(req.body.email, req.body.password);

    // Log successful login
    logSecurityEvent('user_login', 'low', {
      userId: user.id,
      email: user.email,
      ipAddress: req.ip,
      success: true,
    });

    res.json({ token: generateToken(user) });
  } catch (error) {
    // Log failed login
    logSecurityEvent('failed_login_attempt', 'medium', {
      email: req.body.email,
      ipAddress: req.ip,
      reason: 'invalid_credentials',
    });

    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Helper functions (implement based on your needs)
function createAppointment(data: unknown) {
  // Implementation
}

function extractTableName(query: string): string {
  // Extract table name from SQL query
  const match = query.match(/FROM\s+(\w+)/i);
  return match ? match[1] : 'unknown';
}

function getPoolStats() {
  // Get connection pool statistics from your database client
  return {
    active: 0,
    idle: 0,
    waiting: 0,
  };
}

function getPatientRecords(patientId: string) {
  // Implementation
}

function generateAnalytics(query: unknown) {
  // Implementation
}

function authenticateUser(email: string, password: string) {
  // Implementation
}

function generateToken(user: unknown) {
  // Implementation
}

interface CreateUserDto {
  email: string;
  role: string;
  organizationType?: string;
}

export { app };

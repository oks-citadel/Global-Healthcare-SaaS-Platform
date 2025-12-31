import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '../generated/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface TransactionRequest extends Request {
  transactionId?: string;
  correlationId?: string;
  transactionStartTime?: number;
}

/**
 * Middleware to log all interoperability transactions
 */
export const transactionLogger = async (
  req: TransactionRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Skip health checks
  if (req.path === '/health') {
    next();
    return;
  }

  // Generate or extract IDs
  req.transactionId = uuidv4();
  req.correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
  req.transactionStartTime = Date.now();

  // Set response headers
  res.setHeader('X-Transaction-ID', req.transactionId);
  res.setHeader('X-Correlation-ID', req.correlationId);

  // Determine transaction type from path
  const transactionType = getTransactionType(req.path, req.method);

  // Log request
  logger.info('Transaction started', {
    transactionId: req.transactionId,
    correlationId: req.correlationId,
    method: req.method,
    path: req.path,
    type: transactionType,
    userId: (req as any).user?.id,
  });

  // Capture response
  const originalSend = res.send.bind(res);
  res.send = function (body: any): Response {
    const processingTime = Date.now() - (req.transactionStartTime || Date.now());

    // Log to database asynchronously
    logTransaction({
      transactionId: req.transactionId!,
      type: transactionType,
      direction: 'inbound',
      status: res.statusCode < 400 ? 'completed' : 'failed',
      requestUrl: req.originalUrl,
      requestMethod: req.method,
      responseCode: res.statusCode,
      processingTimeMs: processingTime,
      userId: (req as any).user?.id,
      correlationId: req.correlationId!,
    }).catch((err) => {
      logger.error('Failed to log transaction', { error: err.message });
    });

    logger.info('Transaction completed', {
      transactionId: req.transactionId,
      statusCode: res.statusCode,
      processingTimeMs: processingTime,
    });

    return originalSend(body);
  };

  next();
};

/**
 * Log transaction to database
 */
async function logTransaction(data: {
  transactionId: string;
  type: string;
  direction: 'inbound' | 'outbound';
  status: string;
  requestUrl?: string;
  requestMethod?: string;
  responseCode?: number;
  processingTimeMs?: number;
  userId?: string;
  correlationId?: string;
  partnerId?: string;
  payload?: any;
  errorMessage?: string;
}): Promise<void> {
  try {
    await prisma.transactionLog.create({
      data: {
        transactionId: data.transactionId,
        type: mapTransactionType(data.type),
        direction: data.direction,
        status: mapTransactionStatus(data.status),
        requestUrl: data.requestUrl,
        requestMethod: data.requestMethod,
        responseCode: data.responseCode,
        processingTimeMs: data.processingTimeMs,
        userId: data.userId,
        correlationId: data.correlationId,
        partnerId: data.partnerId,
        payload: data.payload,
        errorMessage: data.errorMessage,
        completedAt: new Date(),
      },
    });
  } catch (error) {
    logger.error('Database error logging transaction', { error });
  }
}

/**
 * Determine transaction type from request path
 */
function getTransactionType(path: string, method: string): string {
  if (path.startsWith('/fhir')) {
    if (method === 'GET') return 'fhir_search';
    if (method === 'POST') return 'fhir_create';
    if (method === 'PUT') return 'fhir_update';
    if (method === 'DELETE') return 'fhir_delete';
    return 'fhir_read';
  }
  if (path.startsWith('/x12')) {
    if (path.includes('270')) return 'x12_270_eligibility';
    if (path.includes('271')) return 'x12_271_eligibility_response';
    if (path.includes('276')) return 'x12_claim_status';
    if (path.includes('278')) return 'x12_278_prior_auth';
    if (path.includes('835')) return 'x12_835_payment';
    if (path.includes('837')) return 'x12_837_claim';
    return 'x12_270_eligibility';
  }
  if (path.startsWith('/ccda')) {
    if (method === 'GET') return 'ccda_query';
    if (method === 'POST') return 'ccda_submit';
    return 'ccda_retrieve';
  }
  if (path.startsWith('/direct')) {
    if (method === 'POST') return 'direct_message_send';
    return 'direct_message_receive';
  }
  if (path.startsWith('/tefca')) {
    if (method === 'GET') return 'tefca_query';
    return 'tefca_response';
  }
  if (path.startsWith('/carequality')) {
    if (method === 'GET') return 'carequality_query';
    return 'carequality_retrieve';
  }
  if (path.startsWith('/commonwell')) {
    return 'commonwell_query';
  }
  return 'fhir_read';
}

/**
 * Map string type to enum value
 */
function mapTransactionType(type: string): any {
  const typeMap: Record<string, string> = {
    fhir_search: 'fhir_search',
    fhir_create: 'fhir_create',
    fhir_update: 'fhir_update',
    fhir_delete: 'fhir_delete',
    fhir_read: 'fhir_read',
    x12_270_eligibility: 'x12_270_eligibility',
    x12_271_eligibility_response: 'x12_271_eligibility_response',
    x12_claim_status: 'x12_276_claim_status',
    x12_278_prior_auth: 'x12_278_prior_auth',
    x12_835_payment: 'x12_835_payment',
    x12_837_claim: 'x12_837_claim',
    ccda_query: 'ccda_query',
    ccda_submit: 'ccda_submit',
    ccda_retrieve: 'ccda_retrieve',
    direct_message_send: 'direct_message_send',
    direct_message_receive: 'direct_message_receive',
    tefca_query: 'tefca_query',
    tefca_response: 'tefca_response',
    carequality_query: 'carequality_query',
    carequality_retrieve: 'carequality_retrieve',
    commonwell_query: 'commonwell_query',
  };
  return typeMap[type] || 'fhir_read';
}

/**
 * Map string status to enum value
 */
function mapTransactionStatus(status: string): any {
  const statusMap: Record<string, string> = {
    pending: 'pending',
    processing: 'processing',
    completed: 'completed',
    failed: 'failed',
    timeout: 'timeout',
    cancelled: 'cancelled',
    retrying: 'retrying',
  };
  return statusMap[status] || 'pending';
}

export { logTransaction };

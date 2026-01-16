/**
 * Email Service Wrapper
 * Re-exports the comprehensive AWS SES email service from services/email
 * This maintains backward compatibility with existing imports
 */

export { emailService, EmailService } from '../services/email/index.js';
export type {
  EmailOptions,
  EmailResult,
  EmailTemplateData,
  SecurityAlertType,
  EmailType,
} from '../services/email/index.js';

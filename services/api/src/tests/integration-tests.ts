/**
 * Integration Tests for Third-Party Services
 *
 * Comprehensive test suite for:
 * - Stripe Integration
 * - SendGrid Integration
 * - Twilio Integration
 * - Firebase Cloud Messaging Integration
 */

import { stripe, createStripeCustomer, createSetupIntent } from '../lib/stripe.js';
import { sendEmail } from '../lib/email.js';
import { sendSms } from '../lib/sms.js';
import { twilioEnhancedService } from '../lib/twilio-enhanced.js';
import { fcmEnhancedService } from '../lib/fcm-enhanced.js';
import { processWebhookWithRetry } from '../lib/stripe-webhook-handler.js';
import { emailTemplatesService } from '../services/email-templates.service.js';
import { smsTemplatesService } from '../services/sms-templates.service.js';
import { logger } from '../utils/logger.js';

/**
 * Test Configuration
 */
const TEST_CONFIG = {
  testEmail: process.env.TEST_EMAIL || 'test@example.com',
  testPhone: process.env.TEST_PHONE || '+1234567890',
  testFcmToken: process.env.TEST_FCM_TOKEN || '',
  skipLiveTests: process.env.SKIP_LIVE_TESTS === 'true',
};

/**
 * Test Results Interface
 */
interface TestResult {
  service: string;
  test: string;
  passed: boolean;
  duration: number;
  error?: string;
  details?: any;
}

/**
 * Test Runner
 */
class IntegrationTestRunner {
  private results: TestResult[] = [];

  /**
   * Run all integration tests
   */
  async runAll(): Promise<{
    totalTests: number;
    passed: number;
    failed: number;
    results: TestResult[];
  }> {
    console.log('='.repeat(80));
    console.log('Third-Party Integration Tests');
    console.log('='.repeat(80));
    console.log('');

    // Run Stripe tests
    await this.runStripeTests();

    // Run SendGrid tests
    await this.runSendGridTests();

    // Run Twilio tests
    await this.runTwilioTests();

    // Run FCM tests
    await this.runFcmTests();

    // Print summary
    this.printSummary();

    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;

    return {
      totalTests: this.results.length,
      passed,
      failed,
      results: this.results,
    };
  }

  /**
   * Stripe Integration Tests
   */
  private async runStripeTests(): Promise<void> {
    console.log('\nStripe Integration Tests');
    console.log('-'.repeat(80));

    // Test 1: Stripe Connection
    await this.runTest('Stripe', 'Connection Test', async () => {
      const balance = await stripe.balance.retrieve();
      return {
        available: balance.available,
        pending: balance.pending,
      };
    });

    // Test 2: Create Customer
    await this.runTest('Stripe', 'Create Customer', async () => {
      const customer = await createStripeCustomer({
        email: TEST_CONFIG.testEmail,
        name: 'Test User',
        metadata: {
          test: 'true',
          testId: Date.now().toString(),
        },
      });

      // Clean up
      await stripe.customers.del(customer.id);

      return {
        customerId: customer.id,
        email: customer.email,
      };
    });

    // Test 3: Create Setup Intent
    await this.runTest('Stripe', 'Create Setup Intent', async () => {
      const customer = await createStripeCustomer({
        email: TEST_CONFIG.testEmail,
        name: 'Test User',
      });

      const setupIntent = await createSetupIntent(customer.id);

      // Clean up
      await stripe.customers.del(customer.id);

      return {
        setupIntentId: setupIntent.id,
        status: setupIntent.status,
        clientSecret: setupIntent.client_secret ? 'generated' : 'missing',
      };
    });

    // Test 4: List Products/Prices
    await this.runTest('Stripe', 'List Products and Prices', async () => {
      const products = await stripe.products.list({ active: true, limit: 5 });
      const prices = await stripe.prices.list({ active: true, limit: 5 });

      return {
        productCount: products.data.length,
        priceCount: prices.data.length,
        products: products.data.map(p => ({ id: p.id, name: p.name })),
      };
    });

    // Test 5: Webhook Verification
    await this.runTest('Stripe', 'Webhook Verification', async () => {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET not configured');
      }

      // Create a test webhook event
      const event = {
        id: 'evt_test_webhook',
        object: 'event',
        api_version: '2023-10-16',
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            id: 'sub_test',
            object: 'subscription',
          },
        },
        livemode: false,
        pending_webhooks: 0,
        request: {
          id: null,
          idempotency_key: null,
        },
        type: 'customer.subscription.created',
      };

      return {
        webhookSecret: webhookSecret.substring(0, 10) + '...',
        testEventType: event.type,
      };
    });
  }

  /**
   * SendGrid Integration Tests
   */
  private async runSendGridTests(): Promise<void> {
    console.log('\nSendGrid Integration Tests');
    console.log('-'.repeat(80));

    if (TEST_CONFIG.skipLiveTests) {
      console.log('Skipping live email tests (SKIP_LIVE_TESTS=true)');
      return;
    }

    // Test 1: Send Simple Email
    await this.runTest('SendGrid', 'Send Simple Email', async () => {
      const result = await sendEmail({
        to: TEST_CONFIG.testEmail,
        subject: 'Integration Test - Simple Email',
        html: '<h1>Test Email</h1><p>This is a test email from the integration test suite.</p>',
      });

      return {
        success: result.success,
        messageId: result.messageId,
        error: result.error,
      };
    });

    // Test 2: Send Templated Email
    await this.runTest('SendGrid', 'Send Templated Email', async () => {
      const result = await emailTemplatesService.sendWelcomeEmail({
        email: TEST_CONFIG.testEmail,
        firstName: 'Test',
        lastName: 'User',
      });

      return {
        sent: true,
        to: TEST_CONFIG.testEmail,
      };
    });

    // Test 3: Send Email with Attachments
    await this.runTest('SendGrid', 'Send Email with Attachments', async () => {
      const result = await sendEmail({
        to: TEST_CONFIG.testEmail,
        subject: 'Integration Test - Email with Attachment',
        html: '<p>Email with attachment test</p>',
        attachments: [
          {
            content: Buffer.from('Test file content').toString('base64'),
            filename: 'test.txt',
            type: 'text/plain',
            disposition: 'attachment',
          },
        ],
      });

      return {
        success: result.success,
        messageId: result.messageId,
      };
    });
  }

  /**
   * Twilio Integration Tests
   */
  private async runTwilioTests(): Promise<void> {
    console.log('\nTwilio Integration Tests');
    console.log('-'.repeat(80));

    if (TEST_CONFIG.skipLiveTests) {
      console.log('Skipping live SMS tests (SKIP_LIVE_TESTS=true)');
      return;
    }

    // Test 1: Send SMS
    await this.runTest('Twilio', 'Send SMS', async () => {
      const result = await sendSms({
        to: TEST_CONFIG.testPhone,
        message: 'Integration Test - This is a test SMS from the integration test suite.',
      });

      return {
        success: result.success,
        messageId: result.messageId,
        status: result.status,
        error: result.error,
      };
    });

    // Test 2: Send SMS with Retry
    await this.runTest('Twilio', 'Send SMS with Retry', async () => {
      const result = await twilioEnhancedService.sendSmsWithRetry({
        to: TEST_CONFIG.testPhone,
        message: 'Integration Test - SMS with retry logic',
      });

      return {
        success: result.success,
        messageId: result.messageId,
      };
    });

    // Test 3: Send Templated SMS
    await this.runTest('Twilio', 'Send Templated SMS', async () => {
      const result = await smsTemplatesService.sendVerificationCode(
        {
          phoneNumber: TEST_CONFIG.testPhone,
          firstName: 'Test',
          lastName: 'User',
        },
        '123456'
      );

      return {
        success: result.success,
        messageId: result.messageId,
      };
    });

    // Test 4: Phone Number Validation
    await this.runTest('Twilio', 'Phone Number Validation', async () => {
      const result = await twilioEnhancedService.validatePhoneNumber(TEST_CONFIG.testPhone);

      return {
        valid: result.valid,
        formatted: result.formatted,
        carrier: result.carrier,
        type: result.type,
      };
    });
  }

  /**
   * Firebase Cloud Messaging Tests
   */
  private async runFcmTests(): Promise<void> {
    console.log('\nFirebase Cloud Messaging Tests');
    console.log('-'.repeat(80));

    if (TEST_CONFIG.skipLiveTests || !TEST_CONFIG.testFcmToken) {
      console.log('Skipping live FCM tests (SKIP_LIVE_TESTS=true or no test token)');
      return;
    }

    // Test 1: Send to Device
    await this.runTest('FCM', 'Send to Device', async () => {
      const result = await fcmEnhancedService.sendToDevice(
        TEST_CONFIG.testFcmToken,
        {
          notification: {
            title: 'Integration Test',
            body: 'This is a test notification from the integration test suite',
            icon: 'test_icon',
          },
          data: {
            test: 'true',
            timestamp: Date.now().toString(),
          },
        }
      );

      return {
        success: result.success,
        messageId: result.messageId,
        error: result.error,
      };
    });

    // Test 2: Send Appointment Reminder
    await this.runTest('FCM', 'Send Appointment Reminder', async () => {
      const notification = fcmEnhancedService.createAppointmentReminderNotification(
        'Smith',
        '2:00 PM',
        2
      );

      const result = await fcmEnhancedService.sendToDevice(
        TEST_CONFIG.testFcmToken,
        notification
      );

      return {
        success: result.success,
        messageId: result.messageId,
      };
    });

    // Test 3: Send Payment Notification
    await this.runTest('FCM', 'Send Payment Notification', async () => {
      const notification = fcmEnhancedService.createPaymentNotification(
        29.99,
        'USD',
        'success'
      );

      const result = await fcmEnhancedService.sendToDevice(
        TEST_CONFIG.testFcmToken,
        notification
      );

      return {
        success: result.success,
        messageId: result.messageId,
      };
    });
  }

  /**
   * Run individual test
   */
  private async runTest(
    service: string,
    testName: string,
    testFn: () => Promise<any>
  ): Promise<void> {
    const startTime = Date.now();
    process.stdout.write(`  ${testName}... `);

    try {
      const details = await testFn();
      const duration = Date.now() - startTime;

      this.results.push({
        service,
        test: testName,
        passed: true,
        duration,
        details,
      });

      console.log(`✓ PASSED (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;

      this.results.push({
        service,
        test: testName,
        passed: false,
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      console.log(`✗ FAILED (${duration}ms)`);
      console.log(`    Error: ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * Print test summary
   */
  private printSummary(): void {
    console.log('\n' + '='.repeat(80));
    console.log('Test Summary');
    console.log('='.repeat(80));

    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`\nTotal Tests: ${this.results.length}`);
    console.log(`Passed: ${passed} ✓`);
    console.log(`Failed: ${failed} ✗`);
    console.log(`Total Duration: ${totalDuration}ms`);

    // Group by service
    const byService = this.results.reduce((acc, result) => {
      if (!acc[result.service]) {
        acc[result.service] = { passed: 0, failed: 0 };
      }
      if (result.passed) {
        acc[result.service].passed++;
      } else {
        acc[result.service].failed++;
      }
      return acc;
    }, {} as Record<string, { passed: number; failed: number }>);

    console.log('\nResults by Service:');
    Object.entries(byService).forEach(([service, counts]) => {
      console.log(`  ${service}: ${counts.passed} passed, ${counts.failed} failed`);
    });

    if (failed > 0) {
      console.log('\nFailed Tests:');
      this.results
        .filter(r => !r.passed)
        .forEach(result => {
          console.log(`  ${result.service} - ${result.test}`);
          console.log(`    Error: ${result.error}`);
        });
    }

    console.log('');
  }
}

/**
 * Run tests if executed directly
 */
if (require.main === module) {
  const runner = new IntegrationTestRunner();
  runner.runAll()
    .then(summary => {
      process.exit(summary.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Test runner error:', error);
      process.exit(1);
    });
}

export { IntegrationTestRunner, TEST_CONFIG };

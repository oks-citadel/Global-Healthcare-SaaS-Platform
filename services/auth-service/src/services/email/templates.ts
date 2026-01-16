/**
 * Email Templates
 * Professional HTML email templates for all authentication-related emails
 */

import { EmailTemplateData, SecurityAlertType } from './types.js';

// Brand colors and styles
const BRAND_STYLES = {
  primaryColor: '#4F46E5',
  primaryDark: '#4338CA',
  secondaryColor: '#10B981',
  warningColor: '#F59E0B',
  dangerColor: '#EF4444',
  textColor: '#1F2937',
  textLight: '#6B7280',
  backgroundColor: '#F9FAFB',
  white: '#FFFFFF',
  borderColor: '#E5E7EB',
};

/**
 * Base email template wrapper
 */
function baseTemplate(content: string, preheader?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>The Unified Health</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset styles */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: ${BRAND_STYLES.backgroundColor};
    }
    /* Button styles */
    .button {
      display: inline-block;
      padding: 14px 32px;
      background-color: ${BRAND_STYLES.primaryColor};
      color: ${BRAND_STYLES.white} !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      border-radius: 8px;
      transition: background-color 0.2s;
    }
    .button:hover {
      background-color: ${BRAND_STYLES.primaryDark};
    }
    .button-secondary {
      background-color: ${BRAND_STYLES.secondaryColor};
    }
    .button-warning {
      background-color: ${BRAND_STYLES.warningColor};
    }
    .button-danger {
      background-color: ${BRAND_STYLES.dangerColor};
    }
    /* Responsive styles */
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 0 16px !important;
      }
      .content {
        padding: 24px 20px !important;
      }
      .button {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${BRAND_STYLES.backgroundColor}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  ${preheader ? `<div style="display: none; font-size: 1px; color: ${BRAND_STYLES.backgroundColor}; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">${preheader}</div>` : ''}

  <!-- Main Container -->
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${BRAND_STYLES.backgroundColor};">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" class="container" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: ${BRAND_STYLES.white}; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${BRAND_STYLES.primaryColor} 0%, ${BRAND_STYLES.primaryDark} 100%); padding: 32px 40px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: ${BRAND_STYLES.white}; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                The Unified Health
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                Your Healthcare, Unified
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding: 40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: ${BRAND_STYLES.backgroundColor}; border-top: 1px solid ${BRAND_STYLES.borderColor}; border-radius: 0 0 12px 12px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 12px; color: ${BRAND_STYLES.textLight}; font-size: 13px;">
                      &copy; ${new Date().getFullYear()} The Unified Health. All rights reserved.
                    </p>
                    <p style="margin: 0; color: ${BRAND_STYLES.textLight}; font-size: 12px;">
                      This email was sent to you because you have an account with The Unified Health.<br>
                      If you did not request this email, please contact our support team.
                    </p>
                    <p style="margin: 16px 0 0; font-size: 12px;">
                      <a href="#" style="color: ${BRAND_STYLES.primaryColor}; text-decoration: none; margin: 0 8px;">Privacy Policy</a>
                      <span style="color: ${BRAND_STYLES.borderColor};">|</span>
                      <a href="#" style="color: ${BRAND_STYLES.primaryColor}; text-decoration: none; margin: 0 8px;">Terms of Service</a>
                      <span style="color: ${BRAND_STYLES.borderColor};">|</span>
                      <a href="#" style="color: ${BRAND_STYLES.primaryColor}; text-decoration: none; margin: 0 8px;">Contact Support</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Password Reset Email Template
 */
export function passwordResetTemplate(data: EmailTemplateData): { html: string; text: string } {
  const greeting = data.firstName ? `Hi ${data.firstName},` : 'Hello,';
  const expiryText = data.expiryHours ? `${data.expiryHours} hour${data.expiryHours > 1 ? 's' : ''}` : '1 hour';

  const html = baseTemplate(`
    <h2 style="margin: 0 0 24px; color: ${BRAND_STYLES.textColor}; font-size: 24px; font-weight: 600;">
      Reset Your Password
    </h2>

    <p style="margin: 0 0 16px; color: ${BRAND_STYLES.textColor}; font-size: 16px; line-height: 1.6;">
      ${greeting}
    </p>

    <p style="margin: 0 0 24px; color: ${BRAND_STYLES.textColor}; font-size: 16px; line-height: 1.6;">
      We received a request to reset your password for your The Unified Health account. Click the button below to create a new password:
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 8px 0 32px;">
          <a href="${data.resetUrl}" class="button" style="display: inline-block; padding: 14px 32px; background-color: ${BRAND_STYLES.primaryColor}; color: ${BRAND_STYLES.white}; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px;">
            Reset Password
          </a>
        </td>
      </tr>
    </table>

    <div style="background-color: ${BRAND_STYLES.backgroundColor}; border-left: 4px solid ${BRAND_STYLES.warningColor}; padding: 16px 20px; border-radius: 4px; margin: 0 0 24px;">
      <p style="margin: 0; color: ${BRAND_STYLES.textColor}; font-size: 14px; line-height: 1.5;">
        <strong>Security Notice:</strong> This link will expire in ${expiryText} and can only be used once. If you didn't request this password reset, please ignore this email or contact our support team if you have concerns.
      </p>
    </div>

    <p style="margin: 0 0 8px; color: ${BRAND_STYLES.textLight}; font-size: 14px;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="margin: 0; word-break: break-all; font-size: 13px;">
      <a href="${data.resetUrl}" style="color: ${BRAND_STYLES.primaryColor}; text-decoration: underline;">${data.resetUrl}</a>
    </p>
  `, 'Reset your password for The Unified Health');

  const text = `
Reset Your Password

${greeting}

We received a request to reset your password for your The Unified Health account.

Click this link to reset your password:
${data.resetUrl}

Security Notice: This link will expire in ${expiryText} and can only be used once.

If you didn't request this password reset, please ignore this email.

---
The Unified Health
Your Healthcare, Unified
  `.trim();

  return { html, text };
}

/**
 * Email Verification Template
 */
export function emailVerificationTemplate(data: EmailTemplateData): { html: string; text: string } {
  const greeting = data.firstName ? `Hi ${data.firstName},` : 'Hello,';
  const expiryText = data.expiryHours ? `${data.expiryHours} hour${data.expiryHours > 1 ? 's' : ''}` : '24 hours';

  const html = baseTemplate(`
    <h2 style="margin: 0 0 24px; color: ${BRAND_STYLES.textColor}; font-size: 24px; font-weight: 600;">
      Verify Your Email Address
    </h2>

    <p style="margin: 0 0 16px; color: ${BRAND_STYLES.textColor}; font-size: 16px; line-height: 1.6;">
      ${greeting}
    </p>

    <p style="margin: 0 0 24px; color: ${BRAND_STYLES.textColor}; font-size: 16px; line-height: 1.6;">
      Thank you for registering with The Unified Health! To complete your registration and access all features, please verify your email address by clicking the button below:
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 8px 0 32px;">
          <a href="${data.verifyUrl}" class="button" style="display: inline-block; padding: 14px 32px; background-color: ${BRAND_STYLES.secondaryColor}; color: ${BRAND_STYLES.white}; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px;">
            Verify Email Address
          </a>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 24px; color: ${BRAND_STYLES.textLight}; font-size: 14px; line-height: 1.5;">
      This verification link will expire in ${expiryText}. If you did not create an account with The Unified Health, you can safely ignore this email.
    </p>

    <p style="margin: 0 0 8px; color: ${BRAND_STYLES.textLight}; font-size: 14px;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="margin: 0; word-break: break-all; font-size: 13px;">
      <a href="${data.verifyUrl}" style="color: ${BRAND_STYLES.primaryColor}; text-decoration: underline;">${data.verifyUrl}</a>
    </p>
  `, 'Verify your email address for The Unified Health');

  const text = `
Verify Your Email Address

${greeting}

Thank you for registering with The Unified Health!

To complete your registration, please verify your email address by visiting this link:
${data.verifyUrl}

This verification link will expire in ${expiryText}.

If you did not create an account with The Unified Health, you can safely ignore this email.

---
The Unified Health
Your Healthcare, Unified
  `.trim();

  return { html, text };
}

/**
 * Welcome Email Template
 */
export function welcomeTemplate(data: EmailTemplateData): { html: string; text: string } {
  const greeting = data.firstName ? `Hi ${data.firstName},` : 'Hello,';

  const html = baseTemplate(`
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; background-color: ${BRAND_STYLES.secondaryColor}; color: ${BRAND_STYLES.white}; width: 64px; height: 64px; border-radius: 50%; line-height: 64px; font-size: 32px; margin-bottom: 16px;">
        &#10003;
      </div>
    </div>

    <h2 style="margin: 0 0 24px; color: ${BRAND_STYLES.textColor}; font-size: 24px; font-weight: 600; text-align: center;">
      Welcome to The Unified Health!
    </h2>

    <p style="margin: 0 0 16px; color: ${BRAND_STYLES.textColor}; font-size: 16px; line-height: 1.6;">
      ${greeting}
    </p>

    <p style="margin: 0 0 24px; color: ${BRAND_STYLES.textColor}; font-size: 16px; line-height: 1.6;">
      Your account has been successfully created. We're excited to have you as part of The Unified Health community. Here's what you can do with your new account:
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
      <tr>
        <td style="padding: 16px; background-color: ${BRAND_STYLES.backgroundColor}; border-radius: 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding: 8px 0;">
                <span style="color: ${BRAND_STYLES.secondaryColor}; font-size: 18px; margin-right: 12px;">&#9679;</span>
                <span style="color: ${BRAND_STYLES.textColor}; font-size: 15px;">Book appointments with healthcare providers</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <span style="color: ${BRAND_STYLES.secondaryColor}; font-size: 18px; margin-right: 12px;">&#9679;</span>
                <span style="color: ${BRAND_STYLES.textColor}; font-size: 15px;">Access secure telehealth consultations</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <span style="color: ${BRAND_STYLES.secondaryColor}; font-size: 18px; margin-right: 12px;">&#9679;</span>
                <span style="color: ${BRAND_STYLES.textColor}; font-size: 15px;">View and manage your medical records</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <span style="color: ${BRAND_STYLES.secondaryColor}; font-size: 18px; margin-right: 12px;">&#9679;</span>
                <span style="color: ${BRAND_STYLES.textColor}; font-size: 15px;">Manage prescriptions and medications</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <span style="color: ${BRAND_STYLES.secondaryColor}; font-size: 18px; margin-right: 12px;">&#9679;</span>
                <span style="color: ${BRAND_STYLES.textColor}; font-size: 15px;">Receive personalized health insights</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 8px 0 24px;">
          <a href="${data.dashboardUrl}" class="button" style="display: inline-block; padding: 14px 32px; background-color: ${BRAND_STYLES.primaryColor}; color: ${BRAND_STYLES.white}; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px;">
            Go to Dashboard
          </a>
        </td>
      </tr>
    </table>

    <div style="border-top: 1px solid ${BRAND_STYLES.borderColor}; padding-top: 24px;">
      <p style="margin: 0 0 16px; color: ${BRAND_STYLES.textColor}; font-size: 15px; font-weight: 600;">
        Need Help Getting Started?
      </p>
      <p style="margin: 0; color: ${BRAND_STYLES.textLight}; font-size: 14px; line-height: 1.6;">
        Our support team is here to help. Contact us at <a href="mailto:${data.supportEmail || 'support@theunifiedhealth.com'}" style="color: ${BRAND_STYLES.primaryColor}; text-decoration: none;">${data.supportEmail || 'support@theunifiedhealth.com'}</a> if you have any questions.
      </p>
    </div>
  `, 'Welcome to The Unified Health - Your account is ready');

  const text = `
Welcome to The Unified Health!

${greeting}

Your account has been successfully created. We're excited to have you as part of The Unified Health community.

Here's what you can do with your new account:
- Book appointments with healthcare providers
- Access secure telehealth consultations
- View and manage your medical records
- Manage prescriptions and medications
- Receive personalized health insights

Get started by visiting your dashboard:
${data.dashboardUrl}

Need Help?
Our support team is here to help. Contact us at ${data.supportEmail || 'support@theunifiedhealth.com'} if you have any questions.

---
The Unified Health
Your Healthcare, Unified
  `.trim();

  return { html, text };
}

/**
 * Security Alert Email Template
 */
export function securityAlertTemplate(data: EmailTemplateData): { html: string; text: string } {
  const greeting = data.firstName ? `Hi ${data.firstName},` : 'Hello,';

  const alertConfig = getSecurityAlertConfig(data.alertType);
  const formattedTimestamp = data.timestamp || new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const html = baseTemplate(`
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; background-color: ${alertConfig.color}; color: ${BRAND_STYLES.white}; width: 64px; height: 64px; border-radius: 50%; line-height: 64px; font-size: 28px; margin-bottom: 16px;">
        ${alertConfig.icon}
      </div>
    </div>

    <h2 style="margin: 0 0 24px; color: ${BRAND_STYLES.textColor}; font-size: 24px; font-weight: 600; text-align: center;">
      ${alertConfig.title}
    </h2>

    <p style="margin: 0 0 16px; color: ${BRAND_STYLES.textColor}; font-size: 16px; line-height: 1.6;">
      ${greeting}
    </p>

    <p style="margin: 0 0 24px; color: ${BRAND_STYLES.textColor}; font-size: 16px; line-height: 1.6;">
      ${alertConfig.message}
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
      <tr>
        <td style="padding: 20px; background-color: ${BRAND_STYLES.backgroundColor}; border-radius: 8px; border-left: 4px solid ${alertConfig.color};">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding: 8px 0; color: ${BRAND_STYLES.textLight}; font-size: 14px; width: 100px;">When:</td>
              <td style="padding: 8px 0; color: ${BRAND_STYLES.textColor}; font-size: 14px; font-weight: 500;">${formattedTimestamp}</td>
            </tr>
            ${data.ipAddress ? `
            <tr>
              <td style="padding: 8px 0; color: ${BRAND_STYLES.textLight}; font-size: 14px;">IP Address:</td>
              <td style="padding: 8px 0; color: ${BRAND_STYLES.textColor}; font-size: 14px; font-weight: 500;">${data.ipAddress}</td>
            </tr>
            ` : ''}
            ${data.location ? `
            <tr>
              <td style="padding: 8px 0; color: ${BRAND_STYLES.textLight}; font-size: 14px;">Location:</td>
              <td style="padding: 8px 0; color: ${BRAND_STYLES.textColor}; font-size: 14px; font-weight: 500;">${data.location}</td>
            </tr>
            ` : ''}
            ${data.userAgent ? `
            <tr>
              <td style="padding: 8px 0; color: ${BRAND_STYLES.textLight}; font-size: 14px;">Device:</td>
              <td style="padding: 8px 0; color: ${BRAND_STYLES.textColor}; font-size: 14px; font-weight: 500;">${data.userAgent}</td>
            </tr>
            ` : ''}
          </table>
        </td>
      </tr>
    </table>

    ${alertConfig.actionRequired ? `
    <div style="background-color: #FEF2F2; border: 1px solid ${BRAND_STYLES.dangerColor}; padding: 16px 20px; border-radius: 8px; margin: 0 0 24px;">
      <p style="margin: 0; color: ${BRAND_STYLES.dangerColor}; font-size: 14px; font-weight: 600;">
        &#9888; If this wasn't you, take immediate action:
      </p>
      <ol style="margin: 12px 0 0; padding-left: 20px; color: ${BRAND_STYLES.textColor}; font-size: 14px; line-height: 1.8;">
        <li>Change your password immediately</li>
        <li>Enable two-factor authentication if not already enabled</li>
        <li>Review your account activity</li>
        <li>Contact our support team</li>
      </ol>
    </div>
    ` : ''}

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 8px 0;">
          <a href="${data.loginUrl || '#'}" class="button" style="display: inline-block; padding: 14px 32px; background-color: ${BRAND_STYLES.primaryColor}; color: ${BRAND_STYLES.white}; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px; margin-right: 12px;">
            Review Account
          </a>
        </td>
      </tr>
    </table>
  `, `Security Alert: ${alertConfig.title}`);

  const text = `
Security Alert: ${alertConfig.title}

${greeting}

${alertConfig.message}

Details:
- When: ${formattedTimestamp}
${data.ipAddress ? `- IP Address: ${data.ipAddress}` : ''}
${data.location ? `- Location: ${data.location}` : ''}
${data.userAgent ? `- Device: ${data.userAgent}` : ''}

${alertConfig.actionRequired ? `
If this wasn't you, take immediate action:
1. Change your password immediately
2. Enable two-factor authentication if not already enabled
3. Review your account activity
4. Contact our support team
` : ''}

Review your account at: ${data.loginUrl}

---
The Unified Health
Your Healthcare, Unified
  `.trim();

  return { html, text };
}

/**
 * Get security alert configuration based on type
 */
function getSecurityAlertConfig(alertType?: SecurityAlertType): {
  title: string;
  message: string;
  icon: string;
  color: string;
  actionRequired: boolean;
} {
  const configs: Record<SecurityAlertType, ReturnType<typeof getSecurityAlertConfig>> = {
    new_login: {
      title: 'New Sign-In Detected',
      message: 'We noticed a new sign-in to your The Unified Health account. If this was you, no action is needed.',
      icon: '&#128274;',
      color: BRAND_STYLES.primaryColor,
      actionRequired: true,
    },
    password_changed: {
      title: 'Password Changed',
      message: 'Your password was successfully changed. If you made this change, you can ignore this email.',
      icon: '&#128272;',
      color: BRAND_STYLES.secondaryColor,
      actionRequired: true,
    },
    mfa_enabled: {
      title: 'Two-Factor Authentication Enabled',
      message: 'Two-factor authentication has been enabled on your account. This adds an extra layer of security to your account.',
      icon: '&#128737;',
      color: BRAND_STYLES.secondaryColor,
      actionRequired: false,
    },
    mfa_disabled: {
      title: 'Two-Factor Authentication Disabled',
      message: 'Two-factor authentication has been disabled on your account. If you did not make this change, please secure your account immediately.',
      icon: '&#9888;',
      color: BRAND_STYLES.warningColor,
      actionRequired: true,
    },
    account_locked: {
      title: 'Account Temporarily Locked',
      message: 'Your account has been temporarily locked due to multiple failed sign-in attempts. This is a security measure to protect your account.',
      icon: '&#128274;',
      color: BRAND_STYLES.dangerColor,
      actionRequired: true,
    },
    suspicious_activity: {
      title: 'Suspicious Activity Detected',
      message: 'We detected unusual activity on your account. Please review your recent account activity and take action if necessary.',
      icon: '&#9888;',
      color: BRAND_STYLES.dangerColor,
      actionRequired: true,
    },
    new_device: {
      title: 'New Device Added',
      message: 'A new device was used to access your account. If you recognize this device, no action is needed.',
      icon: '&#128187;',
      color: BRAND_STYLES.primaryColor,
      actionRequired: true,
    },
  };

  return configs[alertType || 'new_login'] || configs.new_login;
}

/**
 * MFA Enabled Confirmation Email Template
 */
export function mfaEnabledTemplate(data: EmailTemplateData): { html: string; text: string } {
  return securityAlertTemplate({
    ...data,
    alertType: 'mfa_enabled',
  });
}

/**
 * MFA Disabled Alert Email Template
 */
export function mfaDisabledTemplate(data: EmailTemplateData): { html: string; text: string } {
  return securityAlertTemplate({
    ...data,
    alertType: 'mfa_disabled',
  });
}

/**
 * Account Locked Email Template
 */
export function accountLockedTemplate(data: EmailTemplateData): { html: string; text: string } {
  return securityAlertTemplate({
    ...data,
    alertType: 'account_locked',
  });
}

/**
 * New Login Notification Email Template
 */
export function loginNotificationTemplate(data: EmailTemplateData): { html: string; text: string } {
  return securityAlertTemplate({
    ...data,
    alertType: 'new_login',
  });
}

export const emailTemplates = {
  passwordReset: passwordResetTemplate,
  emailVerification: emailVerificationTemplate,
  welcome: welcomeTemplate,
  securityAlert: securityAlertTemplate,
  mfaEnabled: mfaEnabledTemplate,
  mfaDisabled: mfaDisabledTemplate,
  accountLocked: accountLockedTemplate,
  loginNotification: loginNotificationTemplate,
};

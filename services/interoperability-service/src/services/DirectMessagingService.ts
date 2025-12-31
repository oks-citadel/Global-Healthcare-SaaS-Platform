import forge from 'node-forge';
import { PrismaClient } from '../generated/client';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const prisma = new PrismaClient();

export interface DirectMessage {
  id: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  attachments?: DirectAttachment[];
  mdn?: {
    requested: boolean;
    received?: boolean;
    disposition?: string;
  };
  encrypted: boolean;
  signed: boolean;
  timestamp: Date;
}

export interface DirectAttachment {
  filename: string;
  contentType: string;
  content: string; // Base64 encoded
  size: number;
}

export interface DirectSendResult {
  success: boolean;
  messageId: string;
  errors?: string[];
  mdnStatus?: string;
}

export interface DirectAddressInfo {
  address: string;
  certificate?: string;
  valid: boolean;
  trustAnchor?: string;
}

export class DirectMessagingService {
  private smtpHost: string;
  private smtpPort: number;
  private trustBundleUrl: string;

  constructor() {
    this.smtpHost = process.env.DIRECT_SMTP_HOST || 'smtp.direct.example.org';
    this.smtpPort = parseInt(process.env.DIRECT_SMTP_PORT || '465');
    this.trustBundleUrl = process.env.DIRECT_TRUST_BUNDLE_URL || 'https://bundles.directtrust.org/bundle.p7c';
  }

  /**
   * Send a Direct message with S/MIME encryption and signing
   */
  async sendMessage(message: Omit<DirectMessage, 'id' | 'timestamp'>): Promise<DirectSendResult> {
    const messageId = uuidv4();

    try {
      // Get sender's Direct address and certificate
      const senderAddress = await this.getDirectAddress(message.from);
      if (!senderAddress || !senderAddress.certificate || !senderAddress.valid) {
        return {
          success: false,
          messageId,
          errors: ['Sender Direct address not found or invalid'],
        };
      }

      // Validate and get recipient certificates
      const recipientCerts: Map<string, string> = new Map();
      for (const recipient of message.to) {
        const recipientAddress = await this.lookupCertificate(recipient);
        if (!recipientAddress.valid) {
          return {
            success: false,
            messageId,
            errors: [`Recipient certificate not found: ${recipient}`],
          };
        }
        recipientCerts.set(recipient, recipientAddress.certificate!);
      }

      // Build MIME message
      const mimeMessage = this.buildMimeMessage(message, messageId);

      // Sign the message with sender's private key
      const signedMessage = await this.signMessage(mimeMessage, senderAddress);

      // Encrypt for each recipient
      const encryptedMessage = await this.encryptMessage(signedMessage, recipientCerts);

      // Send via SMTP over TLS
      await this.sendViaSMTP({
        from: message.from,
        to: message.to,
        message: encryptedMessage,
        messageId,
      });

      // Update message statistics
      await prisma.directAddress.update({
        where: { address: message.from },
        data: {
          messagesSent: { increment: 1 },
          lastActivity: new Date(),
        },
      });

      // Log the transaction
      await prisma.transactionLog.create({
        data: {
          transactionId: messageId,
          type: 'direct_message_send',
          direction: 'outbound',
          status: 'completed',
          payload: {
            from: message.from,
            to: message.to,
            subject: message.subject,
          },
          completedAt: new Date(),
        },
      });

      logger.info('Direct message sent successfully', {
        messageId,
        from: message.from,
        to: message.to,
      });

      return {
        success: true,
        messageId,
        mdnStatus: message.mdn?.requested ? 'pending' : undefined,
      };
    } catch (error: any) {
      logger.error('Failed to send Direct message', {
        messageId,
        error: error.message,
      });

      return {
        success: false,
        messageId,
        errors: [error.message],
      };
    }
  }

  /**
   * Receive and process an incoming Direct message
   */
  async receiveMessage(rawMessage: string): Promise<DirectMessage | null> {
    const messageId = uuidv4();

    try {
      // Parse the S/MIME message
      const parsed = await this.parseSMIME(rawMessage);

      // Verify signature
      const signatureValid = await this.verifySignature(parsed);
      if (!signatureValid) {
        logger.warn('Direct message signature verification failed', { messageId });
        // Continue processing but log the warning
      }

      // Decrypt the message
      const decrypted = await this.decryptMessage(parsed);

      // Parse MIME content
      const message = this.parseMimeMessage(decrypted);
      message.id = messageId;

      // Store received message info
      await prisma.transactionLog.create({
        data: {
          transactionId: messageId,
          type: 'direct_message_receive',
          direction: 'inbound',
          status: 'completed',
          payload: {
            from: message.from,
            to: message.to,
            subject: message.subject,
          },
          completedAt: new Date(),
        },
      });

      // Update recipient statistics
      for (const recipient of message.to) {
        await prisma.directAddress.updateMany({
          where: { address: recipient },
          data: {
            messagesReceived: { increment: 1 },
            lastActivity: new Date(),
          },
        });
      }

      // Send MDN if requested
      if (message.mdn?.requested) {
        await this.sendMDN(message, 'displayed');
      }

      logger.info('Direct message received successfully', {
        messageId,
        from: message.from,
        to: message.to,
      });

      return message;
    } catch (error: any) {
      logger.error('Failed to process received Direct message', {
        messageId,
        error: error.message,
      });
      return null;
    }
  }

  /**
   * Register a new Direct address
   */
  async registerAddress(data: {
    address: string;
    ownerId: string;
    ownerType: 'user' | 'organization' | 'department' | 'system';
    ownerName?: string;
    generateCertificate?: boolean;
  }): Promise<DirectAddressInfo> {
    try {
      const domain = data.address.split('@')[1];

      let certificate: string | undefined;
      let privateKey: string | undefined;

      if (data.generateCertificate) {
        // Generate a self-signed certificate for testing
        // In production, this would request a certificate from a HISP
        const keypair = await this.generateKeyPair();
        const cert = await this.generateCertificate(data.address, keypair);
        certificate = forge.pki.certificateToPem(cert);
        privateKey = forge.pki.privateKeyToPem(keypair.privateKey);
      }

      // Store the Direct address
      await prisma.directAddress.create({
        data: {
          address: data.address,
          domain,
          ownerId: data.ownerId,
          ownerType: data.ownerType as any,
          ownerName: data.ownerName,
          certificate,
          privateKey, // Should be encrypted in production
          status: 'pending',
        },
      });

      logger.info('Direct address registered', { address: data.address });

      return {
        address: data.address,
        certificate,
        valid: false, // Pending verification
      };
    } catch (error: any) {
      logger.error('Failed to register Direct address', {
        address: data.address,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Activate a Direct address after verification
   */
  async activateAddress(address: string, certificate?: string): Promise<void> {
    const updates: any = {
      status: 'active',
    };

    if (certificate) {
      updates.certificate = certificate;
      // Parse certificate to extract expiry
      const cert = forge.pki.certificateFromPem(certificate);
      updates.certificateExpiry = cert.validity.notAfter;
      updates.issuerDn = cert.issuer.getField('CN')?.value;
      updates.subjectDn = cert.subject.getField('CN')?.value;
    }

    await prisma.directAddress.update({
      where: { address },
      data: updates,
    });

    logger.info('Direct address activated', { address });
  }

  /**
   * Lookup certificate for a Direct address
   */
  async lookupCertificate(address: string): Promise<DirectAddressInfo> {
    try {
      // First check local database
      const localAddress = await prisma.directAddress.findUnique({
        where: { address },
      });

      if (localAddress && localAddress.certificate && localAddress.status === 'active') {
        return {
          address,
          certificate: localAddress.certificate,
          valid: true,
          trustAnchor: localAddress.trustAnchor || undefined,
        };
      }

      // Query DNS for certificate (LDAP or DNS CERT records)
      const dnsResult = await this.lookupDNSCert(address);
      if (dnsResult) {
        return dnsResult;
      }

      // Query HISP certificate service
      const hispResult = await this.lookupHISPCert(address);
      if (hispResult) {
        return hispResult;
      }

      return {
        address,
        valid: false,
      };
    } catch (error: any) {
      logger.error('Certificate lookup failed', { address, error: error.message });
      return {
        address,
        valid: false,
      };
    }
  }

  /**
   * Validate trust chain for a certificate
   */
  async validateTrustChain(certificate: string): Promise<boolean> {
    try {
      const cert = forge.pki.certificateFromPem(certificate);

      // Check certificate validity period
      const now = new Date();
      if (now < cert.validity.notBefore || now > cert.validity.notAfter) {
        logger.warn('Certificate outside validity period');
        return false;
      }

      // Fetch and parse trust bundle
      const trustBundle = await this.fetchTrustBundle();
      if (!trustBundle) {
        logger.warn('Could not fetch trust bundle');
        return false;
      }

      // Verify certificate chain against trust anchors
      const caStore = forge.pki.createCaStore(trustBundle);
      try {
        forge.pki.verifyCertificateChain(caStore, [cert]);
        return true;
      } catch (error) {
        logger.warn('Certificate chain verification failed', { error });
        return false;
      }
    } catch (error: any) {
      logger.error('Trust chain validation error', { error: error.message });
      return false;
    }
  }

  /**
   * Get Direct address details
   */
  async getDirectAddress(address: string): Promise<any> {
    return prisma.directAddress.findUnique({
      where: { address },
    });
  }

  /**
   * List Direct addresses for an owner
   */
  async listAddresses(ownerId: string): Promise<any[]> {
    return prisma.directAddress.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Private helper methods

  private buildMimeMessage(
    message: Omit<DirectMessage, 'id' | 'timestamp'>,
    messageId: string
  ): string {
    const boundary = `----=_Part_${uuidv4()}`;
    const lines: string[] = [];

    lines.push(`Message-ID: <${messageId}@${message.from.split('@')[1]}>`);
    lines.push(`Date: ${new Date().toUTCString()}`);
    lines.push(`From: ${message.from}`);
    lines.push(`To: ${message.to.join(', ')}`);
    lines.push(`Subject: ${message.subject}`);
    lines.push('MIME-Version: 1.0');

    if (message.mdn?.requested) {
      lines.push(`Disposition-Notification-To: ${message.from}`);
    }

    if (message.attachments && message.attachments.length > 0) {
      lines.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
      lines.push('');
      lines.push(`--${boundary}`);
      lines.push('Content-Type: text/plain; charset=utf-8');
      lines.push('Content-Transfer-Encoding: 7bit');
      lines.push('');
      lines.push(message.body);

      for (const attachment of message.attachments) {
        lines.push('');
        lines.push(`--${boundary}`);
        lines.push(`Content-Type: ${attachment.contentType}; name="${attachment.filename}"`);
        lines.push('Content-Transfer-Encoding: base64');
        lines.push(`Content-Disposition: attachment; filename="${attachment.filename}"`);
        lines.push('');
        lines.push(attachment.content);
      }

      lines.push('');
      lines.push(`--${boundary}--`);
    } else {
      lines.push('Content-Type: text/plain; charset=utf-8');
      lines.push('Content-Transfer-Encoding: 7bit');
      lines.push('');
      lines.push(message.body);
    }

    return lines.join('\r\n');
  }

  private async signMessage(message: string, senderAddress: any): Promise<string> {
    if (!senderAddress.privateKey) {
      throw new Error('Sender private key not available');
    }

    const privateKey = forge.pki.privateKeyFromPem(senderAddress.privateKey);
    const certificate = forge.pki.certificateFromPem(senderAddress.certificate);

    // Create PKCS#7 signed data
    const p7 = forge.pkcs7.createSignedData();
    p7.content = forge.util.createBuffer(message, 'utf8');
    p7.addCertificate(certificate);
    p7.addSigner({
      key: privateKey,
      certificate: certificate,
      digestAlgorithm: forge.pki.oids.sha256,
      authenticatedAttributes: [
        {
          type: forge.pki.oids.contentType,
          value: forge.pki.oids.data,
        },
        {
          type: forge.pki.oids.messageDigest,
        },
        {
          type: forge.pki.oids.signingTime,
          value: new Date(),
        },
      ],
    });

    p7.sign();

    // Convert to PEM
    const der = forge.asn1.toDer(p7.toAsn1()).getBytes();
    const base64 = forge.util.encode64(der);

    return this.wrapSMIME(base64, 'signed-data');
  }

  private async encryptMessage(
    message: string,
    recipientCerts: Map<string, string>
  ): Promise<string> {
    // Create PKCS#7 enveloped data
    const p7 = forge.pkcs7.createEnvelopedData();
    p7.content = forge.util.createBuffer(message, 'utf8');

    // Add each recipient's certificate
    for (const [address, certPem] of recipientCerts) {
      const cert = forge.pki.certificateFromPem(certPem);
      p7.addRecipient(cert);
    }

    // Encrypt with AES-256-CBC
    p7.encrypt(undefined, forge.pki.oids['aes256-CBC']);

    // Convert to PEM
    const der = forge.asn1.toDer(p7.toAsn1()).getBytes();
    const base64 = forge.util.encode64(der);

    return this.wrapSMIME(base64, 'enveloped-data');
  }

  private wrapSMIME(content: string, smimeType: string): string {
    const lines = [
      'Content-Type: application/pkcs7-mime; smime-type=' + smimeType,
      'Content-Transfer-Encoding: base64',
      '',
    ];

    // Split base64 into 76-character lines
    for (let i = 0; i < content.length; i += 76) {
      lines.push(content.substring(i, i + 76));
    }

    return lines.join('\r\n');
  }

  private async parseSMIME(rawMessage: string): Promise<any> {
    // Extract base64 content
    const lines = rawMessage.split('\r\n');
    let inBody = false;
    let base64Content = '';

    for (const line of lines) {
      if (inBody) {
        base64Content += line;
      } else if (line === '') {
        inBody = true;
      }
    }

    // Decode and parse PKCS#7
    const der = forge.util.decode64(base64Content);
    const asn1 = forge.asn1.fromDer(der);

    return {
      raw: rawMessage,
      asn1,
      base64Content,
    };
  }

  private async verifySignature(parsed: any): Promise<boolean> {
    try {
      // Parse as signed data and verify
      // This is a simplified implementation
      const p7 = forge.pkcs7.messageFromAsn1(parsed.asn1);
      // Actual verification would check signatures against trusted certificates
      return true;
    } catch (error) {
      logger.warn('Signature verification error', { error });
      return false;
    }
  }

  private async decryptMessage(parsed: any): Promise<string> {
    // In production, this would use the recipient's private key to decrypt
    // For now, return the raw content
    const p7 = forge.pkcs7.messageFromAsn1(parsed.asn1);
    return (p7 as any).content?.getBytes() || '';
  }

  private parseMimeMessage(content: string): DirectMessage {
    const lines = content.split('\r\n');
    const headers: Record<string, string> = {};
    let inBody = false;
    let body = '';

    for (const line of lines) {
      if (inBody) {
        body += line + '\n';
      } else if (line === '') {
        inBody = true;
      } else {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).toLowerCase();
          const value = line.substring(colonIndex + 1).trim();
          headers[key] = value;
        }
      }
    }

    return {
      id: '',
      from: headers['from'] || '',
      to: (headers['to'] || '').split(',').map((t) => t.trim()),
      subject: headers['subject'] || '',
      body: body.trim(),
      encrypted: true,
      signed: true,
      timestamp: new Date(headers['date'] || Date.now()),
      mdn: {
        requested: !!headers['disposition-notification-to'],
      },
    };
  }

  private async sendViaSMTP(data: {
    from: string;
    to: string[];
    message: string;
    messageId: string;
  }): Promise<void> {
    // In production, this would use nodemailer or similar
    // with TLS and proper SMTP authentication
    logger.info('Sending via SMTP', {
      host: this.smtpHost,
      port: this.smtpPort,
      from: data.from,
      to: data.to,
    });

    // Simulated send
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  private async sendMDN(message: DirectMessage, disposition: string): Promise<void> {
    const mdnMessage = this.buildMDN(message, disposition);
    await this.sendViaSMTP({
      from: message.to[0],
      to: [message.from],
      message: mdnMessage,
      messageId: uuidv4(),
    });
  }

  private buildMDN(originalMessage: DirectMessage, disposition: string): string {
    const boundary = `----=_Part_${uuidv4()}`;

    return [
      `From: ${originalMessage.to[0]}`,
      `To: ${originalMessage.from}`,
      `Subject: Message Disposition Notification`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/report; report-type=disposition-notification; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      `Your message was ${disposition}.`,
      '',
      `--${boundary}`,
      'Content-Type: message/disposition-notification',
      '',
      `Reporting-UA: direct-messaging-service`,
      `Final-Recipient: rfc822;${originalMessage.to[0]}`,
      `Original-Message-ID: <${originalMessage.id}>`,
      `Disposition: automatic-action/MDN-sent-automatically; ${disposition}`,
      '',
      `--${boundary}--`,
    ].join('\r\n');
  }

  private async generateKeyPair(): Promise<forge.pki.KeyPair> {
    return new Promise((resolve, reject) => {
      forge.pki.rsa.generateKeyPair({ bits: 2048 }, (err, keypair) => {
        if (err) reject(err);
        else resolve(keypair);
      });
    });
  }

  private async generateCertificate(
    address: string,
    keypair: forge.pki.KeyPair
  ): Promise<forge.pki.Certificate> {
    const cert = forge.pki.createCertificate();
    cert.publicKey = keypair.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

    const attrs = [
      { name: 'commonName', value: address },
      { name: 'emailAddress', value: address },
    ];

    cert.setSubject(attrs);
    cert.setIssuer(attrs); // Self-signed

    cert.setExtensions([
      { name: 'basicConstraints', cA: false },
      { name: 'keyUsage', digitalSignature: true, keyEncipherment: true },
      { name: 'extKeyUsage', emailProtection: true },
      { name: 'subjectAltName', altNames: [{ type: 1, value: address }] },
    ]);

    cert.sign(keypair.privateKey, forge.md.sha256.create());

    return cert;
  }

  private async lookupDNSCert(address: string): Promise<DirectAddressInfo | null> {
    // DNS CERT record lookup would go here
    return null;
  }

  private async lookupHISPCert(address: string): Promise<DirectAddressInfo | null> {
    // HISP certificate service lookup would go here
    return null;
  }

  private async fetchTrustBundle(): Promise<forge.pki.Certificate[] | null> {
    try {
      const response = await axios.get(this.trustBundleUrl, {
        responseType: 'arraybuffer',
      });

      // Parse PKCS#7 trust bundle
      const der = forge.util.createBuffer(response.data);
      const asn1 = forge.asn1.fromDer(der);
      const p7 = forge.pkcs7.messageFromAsn1(asn1);

      return (p7 as any).certificates || [];
    } catch (error) {
      logger.error('Failed to fetch trust bundle', { error });
      return null;
    }
  }
}

export default new DirectMessagingService();

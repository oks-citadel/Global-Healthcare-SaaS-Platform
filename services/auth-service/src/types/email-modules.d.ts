// Type declarations for optional email provider modules
// These are dynamically imported and may not be installed

declare module '@sendgrid/mail' {
  interface MailService {
    setApiKey(key: string): void;
    send(data: any): Promise<any[]>;
  }
  const mail: MailService;
  export default mail;
}

declare module '@aws-sdk/client-ses' {
  export class SESClient {
    constructor(config: { region?: string });
    send(command: any): Promise<any>;
  }
  export class SendEmailCommand {
    constructor(input: any);
  }
}

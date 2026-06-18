export interface EmailAddress {
  address: string;
  name?: string;
}

export interface EmailOptions {
  from: EmailAddress;
  to: EmailAddress | EmailAddress[];
  subject: string;
  html: string;
  text?: string;          // plain text fallback
  replyTo?: EmailAddress;
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  attachments?: Array<{
    filename: string;
    content?: Buffer | string;
    path?: string;
    contentType?: string;
  }>;
}

export interface EmailProvider {
  send(options: EmailOptions): Promise<{ id: string; success: boolean }>;
}

export type EmailProviderName = 'resend' | 'zeptomail';
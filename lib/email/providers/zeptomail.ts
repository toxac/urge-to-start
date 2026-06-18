import { SendMailClient } from 'zeptomail';
import { EmailProvider, EmailOptions } from '../types';

// Custom type for ZeptoMail success response (as per their API docs)
interface ZeptomailSuccessResponse {
  request_id: string;
  message: string;
  code?: string;
  // There might be other fields, but we only need request_id
}

export class ZeptomailProvider implements EmailProvider {
  private client: SendMailClient;

  constructor(url: string, token: string) {
    // token should be like "zoho-enczapikey <your-send-mail-token>"
    this.client = new SendMailClient({ url, token });
  }

  async send(options: EmailOptions): Promise<{ id: string; success: boolean }> {
    const { from, to, subject, html, text, replyTo, cc, bcc, attachments } = options;

    const payload: any = {
      from: {
        address: from.address,
        name: from.name,
      },
      to: (Array.isArray(to) ? to : [to]).map((t) => ({
        email_address: {
          address: t.address,
          name: t.name,
        },
      })),
      subject,
      htmlbody: html,
      textbody: text,
    };

    if (replyTo) {
      payload.reply_to = {
        address: replyTo.address,
        name: replyTo.name,
      };
    }

    if (cc) {
      payload.cc = (Array.isArray(cc) ? cc : [cc]).map((c) => ({
        email_address: {
          address: c.address,
          name: c.name,
        },
      }));
    }

    if (bcc) {
      payload.bcc = (Array.isArray(bcc) ? bcc : [bcc]).map((b) => ({
        email_address: {
          address: b.address,
          name: b.name,
        },
      }));
    }

    if (attachments && attachments.length > 0) {
      payload.attachments = attachments.map((a) => ({
        name: a.filename,
        content: a.content ? Buffer.from(a.content).toString('base64') : undefined,
        mime_type: a.contentType,
        // If using pre-uploaded files, you could also set file_cache_key
      }));
    }

    // Send the email – the library returns a Promise
    const response = (await this.client.sendMail(payload)) as ZeptomailSuccessResponse;

    // Now TypeScript knows response has 'request_id'
    return { id: response.request_id || '', success: true };
  }
}
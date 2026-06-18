import { Resend } from 'resend';
import { EmailProvider, EmailOptions } from '../types';

export class ResendProvider implements EmailProvider {
  private client: Resend;

  constructor(apiKey: string) {
    this.client = new Resend(apiKey);
  }

  async send(options: EmailOptions): Promise<{ id: string; success: boolean }> {
    const { from, to, subject, html, text, replyTo, cc, bcc, attachments } = options;

    const toArray = Array.isArray(to) ? to.map(t => t.address) : [to.address];
    const fromStr = `${from.name || ''} <${from.address}>`.trim();

    const response = await this.client.emails.send({
      from: fromStr,
      to: toArray,
      subject,
      html,
      text,
      replyTo: replyTo?.address,      // <-- changed from reply_to
      cc: cc?.map(c => c.address),
      bcc: bcc?.map(b => b.address),
      attachments,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return { id: response.data?.id || '', success: true };
  }
}
import { EmailOptions, EmailProvider, EmailProviderName } from './types';
import { ResendProvider } from './providers/resend';
import { ZeptomailProvider } from './providers/zeptomail';
import { enqueueEmail, processQueue } from './queue';

// Singleton provider instance
let provider: EmailProvider;

function getProvider(): EmailProvider {
  if (provider) return provider;

  const providerName = (process.env.EMAIL_PROVIDER as EmailProviderName) || 'resend';

  switch (providerName) {
    case 'resend':
      provider = new ResendProvider(process.env.RESEND_API_KEY!);
      break;
    case 'zeptomail':
      provider = new ZeptomailProvider(
        process.env.ZEPTOMAIL_URL || 'https://api.zeptomail.in/v1.1/email',
        process.env.ZEPTOMAIL_TOKEN!
      );
      break;
    default:
      throw new Error(`Unsupported email provider: ${providerName}`);
  }

  return provider;
}

/**
 * Send a single email immediately (transactional).
 */
export async function sendEmail(options: EmailOptions): Promise<{ id: string; success: boolean }> {
  const provider = getProvider();
  return provider.send(options);
}

/**
 * Queue an email for later processing (newsletters, bulk).
 */
export async function queueEmail(options: EmailOptions, scheduledFor?: Date): Promise<void> {
  await enqueueEmail(options, scheduledFor);
}

/**
 * Process the queue (call this from a cron job / Edge Function).
 * @param limit - number of emails to process in this run
 */
export async function processQueuedEmails(limit: number = 10): Promise<void> {
  await processQueue(limit);
}

// Re-export types for convenience
export * from './types';
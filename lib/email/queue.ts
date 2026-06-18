import { createClient } from '@supabase/supabase-js';
import { EmailOptions } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_SUPABASE_SECRET_KEY!;

// Create a Supabase client with the service role (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Insert an email into the queue.
 * @param options - EmailOptions
 * @param scheduledFor - optional Date to schedule later
 */
export async function enqueueEmail(
  options: EmailOptions,
  scheduledFor?: Date
): Promise<void> {
  const { error } = await supabase.from('email_queue').insert({
    options: options,               // stored as JSONB
    scheduled_for: scheduledFor ? scheduledFor.toISOString() : null,
    status: 'pending',
  });

  if (error) {
    console.error('Failed to enqueue email:', error);
    throw new Error(`Failed to enqueue email: ${error.message}`);
  }
}

/**
 * Process pending emails that are due.
 * Fetches up to `limit` records, sends them, and updates status.
 * @param limit - max number to process in one batch (default 10)
 */
export async function processQueue(limit: number = 10): Promise<void> {
  const now = new Date().toISOString();

  // 1. Fetch pending emails that are ready to send
  const { data: emails, error: fetchError } = await supabase
    .from('email_queue')
    .select('*')
    .eq('status', 'pending')
    .or(`scheduled_for.is.null,scheduled_for.lte.${now}`)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (fetchError) {
    console.error('Failed to fetch queue:', fetchError);
    throw fetchError;
  }

  if (!emails || emails.length === 0) {
    return; // nothing to do
  }

  // 2. Process each email sequentially (or you can send in parallel)
  for (const item of emails) {
    const options = item.options as EmailOptions;
    try {
      // sendEmail is imported from index – avoid circular by dynamic import or moving send logic.
      // We'll call the send function from index via a direct import.
      const { sendEmail } = await import('./index'); // dynamic to avoid circular
      const result = await sendEmail(options);

      // Mark as sent
      await supabase
        .from('email_queue')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          error: null,
        })
        .eq('id', item.id);
    } catch (err: any) {
      // Mark as failed
      await supabase
        .from('email_queue')
        .update({
          status: 'failed',
          error: err.message || 'Unknown error',
        })
        .eq('id', item.id);
    }
  }
}
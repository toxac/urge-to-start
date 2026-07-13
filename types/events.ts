import {z} from 'zod';

export const CreateEventSchema = z.object({
  title: z.string().min(1).max(255).trim(),
  description: z.string().min(1),
  event_date: z.string().datetime(),
  timezone: z.string().min(1).trim().default('UTC'),
  format: z.enum(['virtual', 'irl']),
  type: z.enum(['pitch', 'standup', 'mentor_session', 'launch', 'networking', 'program_based']),
  price: z.number().min(0).default(0),
  currency: z.string().min(3).max(5).trim().toUpperCase().default('INR'),
  is_free_for_member: z.boolean().default(true),
  is_public: z.boolean().default(true),
  contact_email: z.string().email().trim(),
  speakers: z.array(z.record(z.string(), z.any())).default([]),
  venue_details: z.record(z.string(), z.any()).default({}),
  redeemable_points: z.number().int().min(0).default(0),
  video_link: z.string().url().optional().nullable(),
});

export const QueryEventsSchema = z.object({
  format: z.enum(['virtual', 'irl']).optional().nullable(),
  type: z.enum(['pitch', 'standup', 'mentor_session', 'launch', 'networking', 'program_based']).optional().nullable(),
  includePrivate: z.boolean().default(false),
});

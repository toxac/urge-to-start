import {z} from 'zod';

export const SubmitListingSchema = z.object({
  title: z.string().min(1).max(255).trim(),
  tagline: z.string().min(1).max(255).trim(),
  description: z.string().min(1),
  category: z.string().min(1).trim(),
  listing_type: z.enum(['peer_service', 'provider_perk']),
  cta_url: z.string().url(),
  cta_type: z.string().default('Apply Now'),
  price_display: z.string().default('Free'),
  promo_code: z.string().trim().optional().nullable(),
});

export const QueryListingsSchema = z.object({
  listing_type: z.enum(['peer_service', 'provider_perk']).optional().nullable(),
  category: z.string().optional().nullable(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export const SubmitReviewSchema = z.object({
  listingId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(1000).trim(),
});

export const SubmitFlagSchema = z.object({
  listingId: z.string().uuid(),
  reason: z.enum(['broken_link', 'misleading_offer', 'spam_or_abuse', 'expired_perk', 'failed_to_deliver']),
  details: z.string().max(1000).optional().nullable(),
});

export const AdminAuditSchema = z.object({
  listingId: z.string().uuid(),
  ai_verification_score: z.number().min(0).max(100),
  ai_audit_notes: z.string().min(1),
  status: z.enum(['approved', 'rejected', 'draft', 'expired']),
});
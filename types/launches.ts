import {z} from 'zod';

// =========================================================================
// ZOD RUNTIME SCHEMAS
// =========================================================================
export const SubmitLaunchSchema = z.object({
  project_id: z.string().uuid(),
  title: z.string().min(1).max(255).trim(),
  tagline: z.string().min(1).max(255).trim(),
  description: z.string().min(1),
  launch_url: z.string().url(),
  thumbnail_url: z.string().url().optional().nullable(),
  media_assets: z.array(z.string().url()).default([]),
  sector: z.string().min(1).trim(),
  location: z.string().min(1).trim(),
  business_type: z.string().min(1).trim(),
  pricing_hint: z.string().min(1).trim().default('Free'),
});
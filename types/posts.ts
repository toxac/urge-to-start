import { z } from 'zod';

export const AddCommentSchema = z.object({
  postId: z.string().uuid(),
  text: z.string().min(1).max(1000).trim(),
});

export const ToggleStatusSchema = z.object({
  postId: z.string().uuid(),
  is_published: z.boolean(),
});

export const CreatePostSchema = z.object({
  title: z.string().min(1).max(255).trim(),
  content: z.string().min(1),
  // Direct parity alignment to your database post_category enum strings
  category: z.enum([
    "build_journal",
    "marketing_win",
    "traction_milestone",
    "ask_for_help",
    "resource_share",
    "project_launch" // Accounts for our extended bidirectional launch category
  ]),
  is_published: z.boolean().default(true),
  project_id: z.string().uuid().optional().nullable(),
});

export const UpdatePostSchema = CreatePostSchema.partial();

export const QueryPostsSchema = z.object({
  category: z.enum([
    "build_journal",
    "marketing_win",
    "traction_milestone",
    "ask_for_help",
    "resource_share",
    "project_launch"
  ]).optional().nullable(),
  projectId: z.string().uuid().optional().nullable(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
  sortBy: z.enum(['latest', 'top_voted']).default('latest'),
});
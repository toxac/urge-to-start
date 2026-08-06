// types/posts.ts
import { z } from 'zod';
import { Database } from './supabase';

export type UserPostRow = Database['public']['Tables']['user_posts']['Row'];

export const CreatePostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Post content must be at least 10 characters'),
  category: z.enum([
    'build_journal',
    'marketing_win',
    'traction_milestone',
    'ask_for_help',
    'resource_share',
    'project_launch',
    'introduction',
  ]),
});
// actions/posts.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { ActionResponse } from '@/types/profiles';
import { CreatePostSchema, UserPostRow } from '@/types/posts';

/**
 * Creates a community post of any category (e.g. 'introduction')
 */
export async function createCommunityPostAction(
  rawInput: z.infer<typeof CreatePostSchema>
): Promise<ActionResponse<UserPostRow>> {
  try {
    const validated = CreatePostSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    // Generate unique slug
    const slug = `${validated.category}-${Date.now()}`;

    // Insert Post into user_posts
    const { data, error } = await supabase
      .from('user_posts')
      .insert({
        user_id: user.id,
        title: validated.title,
        content: validated.content,
        category: validated.category,
        slug,
        is_published: true,
      })
      .select()
      .single();

    if (error || !data) throw error;

    revalidatePath('/program');
    revalidatePath('/community');
    return { success: true, data: data as UserPostRow };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to publish post' };
  }
}
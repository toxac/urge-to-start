'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Database } from '@/types/supabase';
import { createClient } from '@/lib/supabase/server';

type PostRow = Database['public']['Tables']['user_posts']['Row'];
type PostInsert = Database['public']['Tables']['user_posts']['Insert'];
type PostUpdate = Database['public']['Tables']['user_posts']['Update'];

export const AddCommentSchema = z.object({
  postId: z.string().uuid(),
  text: z.string().min(1).max(1000).trim(),
});

export const ToggleStatusSchema = z.object({
  postId: z.string().uuid(),
  is_published: z.boolean(),
});

type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

// =========================================================================
// ZOD RUNTIME VALIDATION SCHEMAS
// =========================================================================

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

// =========================================================================
// HELPER ROUTINE
// =========================================================================
function generateSlug(title: string): string {
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return `${cleanTitle}-${Math.random().toString(36).substring(2, 7)}`;
}

// =========================================================================
// SERVER ACTIONS IMPLEMENTATION
// =========================================================================

/**
 * POST: Instantiates a fresh community post entry.
 */
export async function createUserPost(rawInput: z.infer<typeof CreatePostSchema>): Promise<ActionResponse<PostRow>> {
  try {
    const validated = CreatePostSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required to publish community content' };
    }

    const uniqueSlug = generateSlug(validated.title);

    const postPayload: PostInsert = {
      ...validated,
      user_id: user.id,
      slug: uniqueSlug,
      upvote_count: 0,
      downvote_count: 0,
      flag_count: 0,
      xp_awarded: false,
      feedback: {},
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('user_posts')
      .insert(postPayload)
      .select()
      .single();

    if (error || !data) throw error;

    revalidatePath('/');
    revalidatePath('/community');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create community timeline post' };
  }
}

/**
 * PATCH: Securely modifies an existing post row. Employs user tenancy checks.
 */
export async function updateUserPost(id: string, rawInput: z.infer<typeof UpdatePostSchema>): Promise<ActionResponse<PostRow>> {
  try {
    const validated = UpdatePostSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: 'Authentication credentials not verified' };

    // 1. TENANCY CONTROL: Ensure the item exists and belongs strictly to the active caller
    const { data: currentPost, error: fetchError } = await supabase
      .from('user_posts')
      .select('user_id, slug')
      .eq('id', id)
      .single();

    if (fetchError || !currentPost) return { success: false, error: 'Target community post not found' };
    if (currentPost.user_id !== user.id) {
      return { success: false, error: 'Access Denied: You do not carry structural ownership of this post row' };
    }

    // 2. Map payload modifications
    const postUpdatePayload: PostUpdate = {
      ...validated,
      updated_at: new Date().toISOString(),
    };

    // Regenerate url slug parameters only if a new title header string is specified
    if (validated.title) {
      postUpdatePayload.slug = generateSlug(validated.title);
    }

    const { data, error } = await supabase
      .from('user_posts')
      .update(postUpdatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) throw error;

    revalidatePath('/');
    revalidatePath('/community');
    revalidatePath(`/posts/${currentPost.slug}`);
    revalidatePath(`/posts/${data.slug}`);

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to apply modifications to post parameters' };
  }
}

/**
 * DELETE: Erases a community post row safely.
 */
export async function deleteUserPost(id: string): Promise<ActionResponse<{ deleted: boolean }>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: 'Authentication required' };

    const { data: currentPost, error: fetchError } = await supabase
      .from('user_posts')
      .select('user_id, slug')
      .eq('id', id)
      .single();

    if (fetchError || !currentPost) return { success: false, error: 'Post resource target not located' };
    if (currentPost.user_id !== user.id) return { success: false, error: 'Unauthorized: Tenancy mismatch caught' };

    const { error: deleteError } = await supabase
      .from('user_posts')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    revalidatePath('/');
    revalidatePath('/community');
    revalidatePath(`/posts/${currentPost.slug}`);

    return { success: true, data: { deleted: true } };
  } catch (err: any) {
    return { success: false, error: err.message || 'System exception executing data deletion' };
  }
}

/**
 * GET Equivalent: Reads filtered, paginated rows from user_posts to feed timeline layout streams.
 */
export async function getCommunityPosts(
  rawInput: z.infer<typeof QueryPostsSchema>
): Promise<ActionResponse<PostRow[]>> {
  try {
    const query = QueryPostsSchema.parse(rawInput);
    const supabase = await createClient();

    let dbQuery = supabase
      .from('user_posts')
      .select('*')
      .eq('is_published', true);

    // Apply optional contextual column filtering scopes
    if (query.category) {
      // We safely cast with 'as any' or the direct enum definition to satisfy Supabase's generated builder type checks
      dbQuery = dbQuery.eq('category', query.category as any);
    }
    if (query.projectId) {
      dbQuery = dbQuery.eq('project_id', query.projectId);
    }

    // Apply database execution sorting chains
    if (query.sortBy === 'top_voted') {
      dbQuery = dbQuery.order('upvote_count', { ascending: false });
    } else {
      dbQuery = dbQuery.order('created_at', { ascending: false });
    }

    const { data, error } = await dbQuery.range(query.offset, query.offset + query.limit - 1);

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to extract timeline feed streams' };
  }
}

/**
 * POST: Upvote / Downvote atomic calculation modifier toggle engine.
 */
export async function voteOnPost(id: string, voteType: 'upvote' | 'downvote'): Promise<ActionResponse<{ upvotes: number; downvotes: number }>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: 'Authentication trace missing' };

    // Fetch active baseline counts to ensure transactional accuracy
    const { data: post, error: fetchError } = await supabase
      .from('user_posts')
      .select('upvote_count, downvote_count, slug')
      .eq('id', id)
      .single();

    if (fetchError || !post) return { success: false, error: 'Target timeline entry not found' };

    const updatePayload: { upvote_count?: number; downvote_count?: number; updated_at: string } = {
      updated_at: new Date().toISOString()
    };

    if (voteType === 'upvote') {
      updatePayload.upvote_count = post.upvote_count + 1;
    } else {
      updatePayload.downvote_count = post.downvote_count + 1;
    }

    const { error: updateError } = await supabase
      .from('user_posts')
      .update(updatePayload)
      .eq('id', id);

    if (updateError) throw updateError;

    revalidatePath('/');
    revalidatePath('/community');
    revalidatePath(`/posts/${post.slug}`);

    return { 
      success: true, 
      data: { 
        upvotes: updatePayload.upvote_count ?? post.upvote_count, 
        downvotes: updatePayload.downvote_count ?? post.downvote_count 
      } 
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to commit feed ranking vote transformation' };
  }
}


/**
 * POST: Appends a structured comment object directly inside the post's feedback JSON column.
 * Eliminates the need for complex multi-table relational join configurations.
 */
export async function addCommentToPost(rawInput: z.infer<typeof AddCommentSchema>): Promise<ActionResponse<{ commentCount: number }>> {
  try {
    const validated = AddCommentSchema.parse(rawInput);
    const supabase = await createClient();

    // Enforce authentication presence checks
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'You must be authenticated to join community discussions' };
    }

    // 1. Fetch the existing post row to pull current feedback JSON states
    const { data: post, error: fetchErr } = await supabase
      .from('user_posts')
      .select('feedback, slug')
      .eq('id', validated.postId)
      .single();

    if (fetchErr || !post) return { success: false, error: 'Target post entry not found' };

    // 2. Parse existing feedback array safely or initialize an empty collection array
    let currentComments = Array.isArray(post.feedback) ? post.feedback : [];

    // 3. Build a distinct, immutable comment record node
    const newCommentNode = {
      id: `comment_${Math.random().toString(36).substring(2, 15)}`,
      user_id: user.id,
      user_name: user.user_metadata?.full_name || 'Anonymous Maker',
      text: validated.text,
      created_at: new Date().toISOString()
    };

    const updatedComments = [...currentComments, newCommentNode];

    // 4. Update the row with the newly appended payload array
    const { error: updateErr } = await supabase
      .from('user_posts')
      .update({ 
        feedback: updatedComments as any, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', validated.postId);

    if (updateErr) throw updateErr;

    // Purge cached route positions to display comments instantly on the client UI component views
    revalidatePath(`/posts/${post.slug}`);
    revalidatePath('/community');

    return { success: true, data: { commentCount: updatedComments.length } };
  } catch (err: any) {
    return { success: false, error: err.message || 'System error processing your comment submission' };
  }
}

/**
 * POST: Securely increments the content flag counter tracker.
 * Automates safety quarantine actions if flag thresholds are violated.
 */
export async function flagPost(postId: string): Promise<ActionResponse<{ flagged: boolean; quarantined: boolean }>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: 'Authentication required' };

    // 1. Fetch active target row parameters
    const { data: post, error: fetchErr } = await supabase
      .from('user_posts')
      .select('flag_count, slug, is_published')
      .eq('id', postId)
      .single();

    if (fetchErr || !post) return { success: false, error: 'Target timeline item could not be verified' };

    const directNewFlagCount = post.flag_count + 1;
    
    // Safety Barrier: If a post gets flagged 5 times, auto-quarantine it (flip is_published to false)
    const shouldQuarantine = directNewFlagCount >= 5;
    
    const updatePayload: { flag_count: number; is_published?: boolean; updated_at: string } = {
      flag_count: directNewFlagCount,
      updated_at: new Date().toISOString()
    };

    if (shouldQuarantine) {
      updatePayload.is_published = false;
    }

    const { error: updateErr } = await supabase
      .from('user_posts')
      .update(updatePayload)
      .eq('id', postId);

    if (updateErr) throw updateErr;

    revalidatePath('/');
    revalidatePath('/community');
    revalidatePath(`/posts/${post.slug}`);

    return { 
      success: true, 
      data: { 
        flagged: true, 
        quarantined: shouldQuarantine 
      } 
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'System failed to register moderation flag tokens' };
  }
}

/**
 * PATCH: Shifts post publication visibility status states between draft and live modes.
 * Enforces strict user context row ownership guards.
 */
export async function togglePostPublishStatus(rawInput: z.infer<typeof ToggleStatusSchema>): Promise<ActionResponse<{ is_published: boolean }>> {
  try {
    const validated = ToggleStatusSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: 'Authentication required' };

    // 1. TENANCY CONTROL GUARD: Enforce that the active user owns this row record before committing mutations
    const { data: post, error: fetchErr } = await supabase
      .from('user_posts')
      .select('user_id, slug')
      .eq('id', validated.postId)
      .single();

    if (fetchErr || !post) return { success: false, error: 'Target post not found' };
    if (post.user_id !== user.id) return { success: false, error: 'Access Denied: Row ownership tenancy violation' };

    // 2. Commit the visibility state parameter change
    const { error: updateErr } = await supabase
      .from('user_posts')
      .update({ 
        is_published: validated.is_published, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', validated.postId);

    if (updateErr) throw updateErr;

    // Refresh directory indexes
    revalidatePath('/');
    revalidatePath('/community');
    revalidatePath(`/posts/${post.slug}`);

    return { success: true, data: { is_published: validated.is_published } };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to modify publication state settings' };
  }
}
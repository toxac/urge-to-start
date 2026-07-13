'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/supabase';
import { createClient } from '@/lib/supabase/server';
import { SubmitLaunchSchema } from '@/types/launches';

type LaunchRow = Database['public']['Tables']['launches']['Row'];
type LaunchInsert = Database['public']['Tables']['launches']['Insert'];
type PostInsert = Database['public']['Tables']['user_posts']['Insert'];

type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };



// =========================================================================
// SERVER ACTIONS LAYER
// =========================================================================

/**
 * POST: Public multi-table sequence that builds a community discussion post
 * and hooks its verified ID directly into the new launch database column record.
 */
export async function publishProjectLaunch(
  rawInput: z.infer<typeof SubmitLaunchSchema>
): Promise<ActionResponse<{ launch: LaunchRow; postId: string }>> {
  try {
    const validated = SubmitLaunchSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication signature required to execute a launch sequence' };
    }

    // 1. BOUNDARY TENANCY GUARD CHECK: Verify project ownership parameters
    const { data: project, error: projErr } = await supabase
      .from('projects')
      .select('id, user_id, biz_name')
      .eq('id', validated.project_id)
      .single();

    if (projErr || !project) {
      return { success: false, error: 'The specified target project sandbox profile could not be located' };
    }

    if (project.user_id !== user.id) {
      return { success: false, error: 'Cross-tenant violation: You do not possess structural ownership of this project' };
    }

    // 2. DUPLICATE LAUNCH PROTECTION: Check for pre-existing active launches
    const { data: existingLaunch } = await supabase
      .from('launches')
      .select('id')
      .eq('project_id', validated.project_id)
      .eq('is_active', true)
      .maybeSingle();

    if (existingLaunch) {
      return { success: false, error: 'This project profile already possesses an active live marketplace launch tracking row' };
    }

    // 3. GENERATE COLLISION-FREE COMMUNITY FEED SLUG DETAILS
    const baseSlugPart = (project.biz_name || validated.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const cleanSlug = `${baseSlugPart}-launch-${Math.random().toString(36).substring(2, 7)}`;

    // 4. STEP ONE INSERTER: Create companion row inside user_posts first
    // Employs your updated 'project_launch' enum category parameter seamlessly
    const postPayload: PostInsert = {
      user_id: user.id,
      project_id: project.id,
      slug: cleanSlug,
      title: `🚀 Live Launch: ${validated.title}`,
      category: 'project_launch' as any, // Casted to any temporarily until your physical db types are pulled via CLI
      content: `## ${validated.tagline}\n\n${validated.description}\n\n---\n\n💡 **Launch Details**: View screenshots, business metrics, and structural specifications for this product directly on the official [Launch Details Showcase Page](/launch/${project.id}).`,
      is_published: true,
      upvote_count: 0,
      downvote_count: 0,
      flag_count: 0,
      xp_awarded: false,
      feedback: {},
      updated_at: new Date().toISOString()
    };

    const { data: insertedPost, error: postInsertErr } = await supabase
      .from('user_posts')
      .insert(postPayload)
      .select('id')
      .single();

    if (postInsertErr || !insertedPost) throw postInsertErr;

    // 5. STEP TWO INSERTER: Bind the newly generated post ID directly to the launch row column
    const launchPayload: LaunchInsert & { post_id: string } = {
      ...validated,
      user_id: user.id,
      post_id: insertedPost.id, // Direct physical database structural binding mapping
      status: 'live',
      is_active: true,
      is_public: true,
      launched_at: new Date().toISOString(),
      upvotes_count: 0,
      updated_at: new Date().toISOString()
    };

    const { data: launch, error: launchInsertErr } = await supabase
      .from('launches')
      .insert(launchPayload as any) // Safely casted during schema restructuring
      .select()
      .single();

    if (launchInsertErr || !launch) {
      // Manual database rollback guard sequence: clear post row if launch execution breaks
      await supabase.from('user_posts').delete().eq('id', insertedPost.id);
      throw launchInsertErr;
    }

    // 6. PURGE AND CLEAR DEPLOYED REVALIDATION PATHS
    revalidatePath('/');
    revalidatePath('/launches');
    revalidatePath(`/launch/${launch.id}`);

    return {
      success: true,
      data: {
        launch,
        postId: insertedPost.id
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Fatal exception executed during bidirectional multitable sync' };
  }
}
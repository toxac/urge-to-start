'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Database, Json } from '@/types/supabase';
import { createClient } from '@/lib/supabase/server';

type ProgressRow = Database['public']['Tables']['user_progress']['Row'];
type ProgressInsert = Database['public']['Tables']['user_progress']['Insert'];
type AccomplishmentInsert = Database['public']['Tables']['user_accomplishments']['Insert'];

type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

// =========================================================================
// ZOD RUNTIME VALIDATION SCHEMAS
// =========================================================================

export const CompleteTaskSchema = z.object({
  taskId: z.string().uuid(),
  savedPayload: z.record(z.string(), z.any()).default({}),
});

// =========================================================================
// SERVER ACTIONS LAYER
// =========================================================================

/**
 * POST: Marks an individual task completed.
 * Safely handles idempotency, increments global profiles XP, and processes automatic milestone unlocks.
 */
export async function completeTaskExecution(rawInput: z.infer<typeof CompleteTaskSchema>): Promise<ActionResponse<{ 
  taskPointsAwarded: number; 
  questCompleted: boolean; 
  questPointsAwarded: number; 
  badgeUnlocked: string | null; 
}>> {
  try {
    const validated = CompleteTaskSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: 'Authentication required to submit task execution states' };

    // 1. RESOLVE TASK & ACCOMPANYING STRUCTURAL DETAILS
    const { data: task, error: taskErr } = await supabase
      .from('tasks')
      .select('id, quest_id, mission_id, grant_points, title')
      .eq('id', validated.taskId)
      .single();

    if (taskErr || !task) return { success: false, error: 'The specified platform task could not be verified' };

    // 2. IDEMPOTENCY GUARD: Check if the user has already marked this item complete
    const { data: currentProgress } = await supabase
      .from('user_progress')
      .select('status')
      .eq('user_id', user.id)
      .eq('task_id', task.id)
      .maybeSingle();

    if (currentProgress && currentProgress.status === 'completed') {
      return { success: false, error: 'Idempotency Block: This action task has already been recorded as completed' };
    }

    let pointsToAward = task.grant_points;

    // 3. TRANSACTION COHESION STEP A: Write or Update user_progress status logs
    const progressPayload: ProgressInsert = {
      user_id: user.id,
      item_type: 'task',
      task_id: task.id,
      quest_id: task.quest_id,
      mission_id: task.mission_id,
      status: 'completed',
      saved_payload: validated.savedPayload as Json,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (currentProgress) {
      const { error: updErr } = await supabase
        .from('user_progress')
        .update({ status: 'completed', saved_payload: validated.savedPayload as Json, completed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('task_id', task.id);
      if (updErr) throw updErr;
    } else {
      const { error: insErr } = await supabase.from('user_progress').insert(progressPayload);
      if (insErr) throw insErr;
    }

    // 4. AUTOMATIC UNLOCKS LOOP: Evaluate parent Quest completion states
    // Fetch all companion tasks that are attached to this parent quest
    const { data: allQuestTasks } = await supabase
      .from('tasks')
      .select('id')
      .eq('quest_id', task.quest_id);

    // Fetch the user's completed tasks for this specific quest
    const { data: userCompletedQuestTasks } = await supabase
      .from('user_progress')
      .select('task_id')
      .eq('user_id', user.id)
      .eq('quest_id', task.quest_id)
      .eq('status', 'completed');

    const totalQuestTasksCount = allQuestTasks?.length || 0;
    const completedQuestTasksCount = (userCompletedQuestTasks?.length || 0) + (currentProgress ? 0 : 1); // Add current execution if it wasn't tracked in DB yet

    let questCompleted = false;
    let questPointsAwarded = 0;
    let badgeUnlocked: string | null = null;

    if (totalQuestTasksCount > 0 && completedQuestTasksCount >= totalQuestTasksCount) {
      questCompleted = true;

      // Extract quest milestone bonuses and badge parameters
      const { data: quest } = await supabase
        .from('quests')
        .select('grant_points_bonus, badge_key_reward')
        .eq('id', task.quest_id)
        .single();

      if (quest) {
        questPointsAwarded = quest.grant_points_bonus;
        pointsToAward += questPointsAwarded;

        // If the quest rewards a badge, verify it isn't already logged and write to achievements
        if (quest.badge_key_reward) {
          const { data: existingAchievement } = await supabase
            .from('user_accomplishments')
            .select('id')
            .eq('user_id', user.id)
            .eq('badge_key', quest.badge_key_reward)
            .maybeSingle();

          if (!existingAchievement) {
            badgeUnlocked = quest.badge_key_reward;
            const accomplishmentPayload: AccomplishmentInsert = {
              user_id: user.id,
              badge_key: quest.badge_key_reward,
              awarded_at: new Date().toISOString()
            };
            await supabase.from('user_accomplishments').insert(accomplishmentPayload);
          }
        }
      }

      // Record whole Quest entity block as completed inside user_progress tracking
      const questProgressRecord: ProgressInsert = {
        user_id: user.id,
        item_type: 'quest',
        quest_id: task.quest_id,
        mission_id: task.mission_id,
        status: 'completed',
        saved_payload: {},
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      await supabase.from('user_progress').insert(questProgressRecord);
    }

    // 5. TRANSACTION COHESION STEP B: Atomically increment user's platform XP profile row balance
    const { data: profile } = await supabase.from('profiles').select('accumulated_xp').eq('id', user.id).single();
    if (profile) {
      const freshXPTotal = (profile.accumulated_xp || 0) + pointsToAward;
      await supabase
        .from('profiles')
        .update({ accumulated_xp: freshXPTotal, updated_at: new Date().toISOString() })
        .eq('id', user.id);
    }

    revalidatePath('/dashboard/missions');
    revalidatePath(`/dashboard/missions/${task.mission_id}`);

    return {
      success: true,
      data: {
        taskPointsAwarded: task.grant_points,
        questCompleted,
        questPointsAwarded,
        badgeUnlocked
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to process task completion sequence' };
  }
}

/**
 * GET: Fetches the calling user's entire completion history log dataset.
 */
export async function getMyProgressTracker(): Promise<ActionResponse<ProgressRow[]>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: 'Authentication required to extract user progress logs' };

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, error: err.message || 'System exception compiling user progress dataset' };
  }
}
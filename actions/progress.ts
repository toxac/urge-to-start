// actions/progress.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Database, Json } from '@/types/supabase';
import { createClient } from '@/lib/supabase/server';
import { LogReflectionSchema } from '@/types/progress';

type ProgressRow = Database['public']['Tables']['user_progress']['Row'];
type ProgressInsert = Database['public']['Tables']['user_progress']['Insert'];
type AccomplishmentInsert = Database['public']['Tables']['user_accomplishments']['Insert'];

type ActionResponse<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

// =========================================================================
// ZOD RUNTIME VALIDATION SCHEMAS (NOT EXPORTED - keep internal only)
// =========================================================================

// Accepts both string IDs (e.g., 'mission1_quest3_task3') and standard UUIDs
const CompleteTaskSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required'),
  savedPayload: z.record(z.string(), z.any()).default({}),
});

// =========================================================================
// SERVER ACTIONS LAYER
// =========================================================================

/**
 * POST: Logs a reflection for off-app tasks or log counters.
 * Appends a new reflection entry to the reflections array in user_progress.
 * Automatically completes the task when reflections reach or exceed targetCount.
 */
export async function logTaskReflectionAction(
  rawInput: z.infer<typeof LogReflectionSchema>
): Promise<ActionResponse<{ progressRow: ProgressRow; isCompleted: boolean }>> {
  try {
    const validated = LogReflectionSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    // 1. Fetch task details to verify mission and quest IDs
    const { data: taskData, error: taskErr } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', validated.taskId)
      .single();

    if (taskErr || !taskData) {
      return { success: false, error: 'The specified task could not be verified' };
    }

    const task = taskData as Record<string, any>;

    // 2. Fetch current user progress row for this task
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('task_id', task.id)
      .maybeSingle();

    const currentReflections = (existingProgress?.reflections as unknown as any[]) || [];

    const newEntry = {
      id: crypto.randomUUID(),
      count_index: currentReflections.length + 1,
      reflection_text: validated.reflectionText,
      logged_at: new Date().toISOString(),
    };

    const updatedReflections = [...currentReflections, newEntry];
    const targetCount = validated.targetCount > 0 ? validated.targetCount : 1;
    const isCompleted = updatedReflections.length >= targetCount;

    // 3. Upsert into user_progress
    let savedRow: ProgressRow;

    if (existingProgress) {
      const { data: updated, error: updErr } = await supabase
        .from('user_progress')
        .update({
          reflections: updatedReflections as unknown as Json,
          status: isCompleted ? 'completed' : 'in_progress',
          completed_at: isCompleted ? new Date().toISOString() : existingProgress.completed_at,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingProgress.id)
        .select()
        .single();

      if (updErr || !updated) throw updErr;
      savedRow = updated;
    } else {
      const progressPayload: ProgressInsert = {
        user_id: user.id,
        item_type: 'task',
        task_id: task.id,
        quest_id: task.quest_id,
        mission_id: task.mission_id,
        reflections: updatedReflections as unknown as Json,
        saved_payload: {} as Json,
        status: isCompleted ? 'completed' : 'in_progress',
        completed_at: isCompleted ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      const { data: inserted, error: insErr } = await supabase
        .from('user_progress')
        .insert(progressPayload)
        .select()
        .single();

      if (insErr || !inserted) throw insErr;
      savedRow = inserted;
    }

    // 4. Trigger completion sequence if target is newly reached
    if (isCompleted && existingProgress?.status !== 'completed') {
      await completeTaskExecution({
        taskId: task.id,
        savedPayload: {
          reflections_count: updatedReflections.length,
          last_reflection: validated.reflectionText,
        },
      });
    }

    if (task.mission_id) {
      revalidatePath('/dashboard/missions');
      revalidatePath(`/dashboard/missions/${task.mission_id}`);
    }

    return {
      success: true,
      data: {
        progressRow: savedRow,
        isCompleted,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to log reflection entry' };
  }
}

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
    const { data: taskData, error: taskErr } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', validated.taskId)
      .single();

    if (taskErr || !taskData) return { success: false, error: 'The specified platform task could not be verified' };

    const task = taskData as Record<string, any>;

    // 2. IDEMPOTENCY GUARD: Check if the user has already marked this item complete
    const { data: currentProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('task_id', task.id)
      .maybeSingle();

    if (currentProgress && currentProgress.status === 'completed') {
      return { success: false, error: 'Idempotency Block: This action task has already been recorded as completed' };
    }

    let pointsToAward = Number(task.grant_points) || 0;

    // 3. TRANSACTION COHESION STEP A: Write or Update user_progress status logs
    if (currentProgress) {
      const { error: updErr } = await supabase
        .from('user_progress')
        .update({ 
          status: 'completed', 
          saved_payload: validated.savedPayload as Json, 
          completed_at: new Date().toISOString(), 
          updated_at: new Date().toISOString() 
        })
        .eq('id', currentProgress.id);
      if (updErr) throw updErr;
    } else {
      const progressPayload: ProgressInsert = {
        user_id: user.id,
        item_type: 'task',
        task_id: task.id,
        quest_id: task.quest_id,
        mission_id: task.mission_id,
        status: 'completed',
        saved_payload: validated.savedPayload as Json,
        reflections: [] as unknown as Json,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const { error: insErr } = await supabase.from('user_progress').insert(progressPayload);
      if (insErr) throw insErr;
    }

    // 4. AUTOMATIC UNLOCKS LOOP: Evaluate parent Quest completion states
    let questCompleted = false;
    let questPointsAwarded = 0;
    let badgeUnlocked: string | null = null;

    if (task.quest_id) {
      const { data: allQuestTasks } = await supabase
        .from('tasks')
        .select('id')
        .eq('quest_id', task.quest_id);

      const { data: userCompletedQuestTasks } = await supabase
        .from('user_progress')
        .select('task_id')
        .eq('user_id', user.id)
        .eq('quest_id', task.quest_id)
        .eq('status', 'completed');

      const totalQuestTasksCount = allQuestTasks?.length || 0;
      const completedQuestTasksCount = (userCompletedQuestTasks?.length || 0) + (currentProgress ? 0 : 1);

      if (totalQuestTasksCount > 0 && completedQuestTasksCount >= totalQuestTasksCount) {
        questCompleted = true;

        const { data: questData } = await supabase
          .from('quests')
          .select('*')
          .eq('id', task.quest_id)
          .single();

        const quest = questData as Record<string, any> | null;

        if (quest && quest.ai_config) {
          const aiConfig = quest.ai_config as {
            on_success?: {
              grant_points?: number;
              badge_key?: string;
            };
          };
          
          const onSuccess = aiConfig.on_success || {};
          questPointsAwarded = onSuccess.grant_points || 0;
          pointsToAward += questPointsAwarded;

          const badgeKey = onSuccess.badge_key;
          if (badgeKey) {
            const { data: existingAchievement } = await supabase
              .from('user_accomplishments')
              .select('id')
              .eq('user_id', user.id)
              .eq('badge_key', badgeKey)
              .maybeSingle();

            if (!existingAchievement) {
              badgeUnlocked = badgeKey;
              const accomplishmentPayload: AccomplishmentInsert = {
                user_id: user.id,
                badge_key: badgeKey,
                awarded_at: new Date().toISOString()
              };
              await supabase.from('user_accomplishments').insert(accomplishmentPayload);
            }
          }
        }

        const questProgressRecord: ProgressInsert = {
          user_id: user.id,
          item_type: 'quest',
          quest_id: task.quest_id,
          mission_id: task.mission_id,
          status: 'completed',
          saved_payload: {} as Json,
          reflections: [] as unknown as Json,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        await supabase.from('user_progress').insert(questProgressRecord);
      }
    }

    // 5. TRANSACTION COHESION STEP B: Increment user's platform XP profile row balance
    const { data: profile } = await supabase.from('profiles').select('accumulated_xp').eq('id', user.id).single();
    if (profile) {
      const freshXPTotal = (profile.accumulated_xp || 0) + pointsToAward;
      await supabase
        .from('profiles')
        .update({ accumulated_xp: freshXPTotal, updated_at: new Date().toISOString() })
        .eq('id', user.id);
    }

    revalidatePath('/dashboard/missions');
    if (task.mission_id) {
      revalidatePath(`/dashboard/missions/${task.mission_id}`);
    }

    return {
      success: true,
      data: {
        taskPointsAwarded: Number(task.grant_points) || 0,
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
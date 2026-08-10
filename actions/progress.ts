// actions/progress.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Database, Json } from '@/types/supabase';
import { createClient } from '@/lib/supabase/server';
import { LogReflectionSchema } from '@/types/progress';

type ProgressRow = Database['public']['Tables']['user_progress']['Row'];
type ProgressInsert = Database['public']['Tables']['user_progress']['Insert'];
type ProgressStatus = Database['public']['Enums']['progress_status'];

// ⚡ EXPORTED & ROBUST ACTION RESPONSE TYPE
export type ActionResponse<T> = 
  | { success: true; data: T; error?: string } 
  | { success: false; error: string; data?: T };

// =========================================================================
// ZOD SCHEMAS
// =========================================================================
interface SetInProgressParams {
  taskId: string;
  questId?: string;
  missionId?: string;
}

const RecordProgressSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required'),
  questId: z.string().min(1, 'Quest ID is required'),
  missionId: z.string().min(1, 'Mission ID is required'),
  savedPayload: z.record(z.string(), z.any()).default({}),
  status: z.enum(['in_progress', 'completed', 'not_started', 'repeat', 'blocked']).default('completed'),
});

// =========================================================================
// SERVER ACTIONS
// =========================================================================

/**
 * 1. POST: Logs/upserts task progress in user_progress.
 */
export async function recordTaskProgressAction(
  rawInput: z.infer<typeof RecordProgressSchema>
): Promise<ActionResponse<ProgressRow>> {
  try {
    const validated = RecordProgressSchema.parse(rawInput);
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const now = new Date().toISOString();
    const progressStatus = validated.status as ProgressStatus;

    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('task_id', validated.taskId)
      .maybeSingle();

    let savedRow: ProgressRow;

    if (existingProgress) {
      const { data: updated, error: updErr } = await supabase
        .from('user_progress')
        .update({
          status: progressStatus,
          saved_payload: validated.savedPayload as Json,
          completed_at: progressStatus === 'completed' ? (existingProgress.completed_at || now) : null,
          updated_at: now,
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
        task_id: validated.taskId,
        quest_id: validated.questId,
        mission_id: validated.missionId,
        status: progressStatus,
        saved_payload: validated.savedPayload as Json,
        reflections: [] as unknown as Json,
        completed_at: progressStatus === 'completed' ? now : null,
        updated_at: now,
      };

      const { data: inserted, error: insErr } = await supabase
        .from('user_progress')
        .insert(progressPayload)
        .select()
        .single();

      if (insErr || !inserted) throw insErr;
      savedRow = inserted;
    }

    revalidatePath('/program');
    revalidatePath(`/program/mission/${validated.missionId}`);
    revalidatePath(`/program/quest/${validated.questId}`);

    return { success: true, data: savedRow };
  } catch (err: any) {
    console.error('❌ Error in recordTaskProgressAction:', err);
    return { success: false, error: err.message || 'Failed to record progress' };
  }
}

/**
 * 2. POST: Logs a reflection entry for off-app tasks or log counter tasks.
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

    const { data: taskData, error: taskErr } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', validated.taskId)
      .single();

    if (taskErr || !taskData) {
      return { success: false, error: 'The specified task could not be verified' };
    }

    const task = taskData as Record<string, any>;

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
    const progressStatus: ProgressStatus = isCompleted ? 'completed' : 'in_progress';
    const now = new Date().toISOString();

    let savedRow: ProgressRow;

    if (existingProgress) {
      const { data: updated, error: updErr } = await supabase
        .from('user_progress')
        .update({
          reflections: updatedReflections as unknown as Json,
          status: progressStatus,
          completed_at: isCompleted ? (existingProgress.completed_at || now) : null,
          updated_at: now,
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
        status: progressStatus,
        completed_at: isCompleted ? now : null,
        updated_at: now,
      };

      const { data: inserted, error: insErr } = await supabase
        .from('user_progress')
        .insert(progressPayload)
        .select()
        .single();

      if (insErr || !inserted) throw insErr;
      savedRow = inserted;
    }

    revalidatePath('/program');
    if (task.mission_id) {
      revalidatePath(`/program/mission/${task.mission_id}`);
    }

    return {
      success: true,
      data: {
        progressRow: savedRow,
        isCompleted,
      },
    };
  } catch (err: any) {
    console.error('❌ Error in logTaskReflectionAction:', err);
    return { success: false, error: err.message || 'Failed to log reflection entry' };
  }
}

/**
 * 3. GET: Fetches the active user's complete user_progress array.
 */
export async function getMyProgressTracker(): Promise<ActionResponse<ProgressRow[]>> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: 'Authentication required' };

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to fetch user progress dataset' };
  }
}

/**
 * Ensures a user_progress row exists with status = 'in_progress'
 */
export async function setTaskStatusInProgressAction({
  taskId,
  questId,
  missionId,
}: SetInProgressParams): Promise<ActionResponse<ProgressRow>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required' };
    }

    // ⚡ Derive mission_id and quest_id if not explicitly provided
    // e.g. "mission1_quest3_task3" -> quest_id = "mission1_quest3", mission_id = "mission-1"
    const resolvedQuestId = questId || taskId.split('_task')[0];
    const resolvedMissionId = missionId || 'mission-1';

    const { data, error } = await supabase
      .from('user_progress')
      .upsert(
        {
          user_id: user.id,
          task_id: taskId,
          quest_id: resolvedQuestId,
          mission_id: resolvedMissionId,
          item_type: 'task',
          status: 'in_progress',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,task_id' }
      )
      .select()
      .single();

    if (error || !data) throw error;

    revalidatePath('/program');
    return { success: true, data: data as ProgressRow };
  } catch (err: any) {
    console.error('❌ Error setting task in_progress status:', err);
    return { success: false, error: err.message || 'Failed to update task status' };
  }
}
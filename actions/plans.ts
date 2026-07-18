// actions/plans.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { GenerateScheduleSchema, ScheduleConfigSchema, UserPlanInsert, UserPlan } from '@/types/plans';
import { urgePlaybook } from '@/lib/playbook';

async function getPlansForItem(itemType: string, itemId: string): Promise<UserPlan[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('user_plans')
    .select('*')
    .eq('user_id', user.id)
    .eq('item_type', itemType)
    .eq('item_id', itemId)
    .order('start_time', { ascending: true });

  if (error) throw new Error(error.message);
  return data as UserPlan[];
}

export async function getQuestPlans(questId: string): Promise<UserPlan[]> {
  return getPlansForItem('quest', questId);
}

export async function getTaskPlans(taskId: string): Promise<UserPlan[]> {
  return getPlansForItem('task', taskId);
}

export async function generateQuestSchedule(params: z.infer<typeof GenerateScheduleSchema>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Fetch profile config
  const { data: profile } = await supabase
    .from('profiles')
    .select('schedule_config')
    .eq('id', user.id)
    .single();

  const parsedConfig = ScheduleConfigSchema.safeParse(profile?.schedule_config);
  const config = parsedConfig.success ? parsedConfig.data : ScheduleConfigSchema.parse({});

  // Use override if provided
  const override = params.override;
  const preferredDays = override?.preferred_days ?? config.preferred_days;
  const preferredHourStart = override?.preferred_hours?.start ?? config.preferred_hours.start;
  const preferredHourEnd = override?.preferred_hours?.end ?? config.preferred_hours.end;

  // Generate time slots (next 7 days)
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() + 1);
  const endDate = new Date(now);
  endDate.setDate(now.getDate() + 7);

  const dayMap: Record<string, number> = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6
  };
  const preferredDayNumbers = preferredDays.map(d => dayMap[d.toLowerCase()]);

  const slotDuration = params.durationMinutes * 60 * 1000;
  const [startH, startM] = preferredHourStart.split(':').map(Number);
  const [endH, endM] = preferredHourEnd.split(':').map(Number);

  const slots: { start: Date; end: Date }[] = [];
  let current = new Date(startDate);
  let sessionsCreated = 0;
  const maxSessions = params.taskIds.length; // one session per selected task

  while (current <= endDate && sessionsCreated < maxSessions) {
    const dayOfWeek = current.getDay();
    if (preferredDayNumbers.includes(dayOfWeek)) {
      const slotStart = new Date(current);
      slotStart.setHours(startH, startM, 0, 0);
      const slotEnd = new Date(slotStart);
      slotEnd.setTime(slotStart.getTime() + slotDuration);
      const windowEnd = new Date(current);
      windowEnd.setHours(endH, endM, 0, 0);
      if (slotEnd <= windowEnd) {
        slots.push({ start: slotStart, end: slotEnd });
        sessionsCreated++;
      }
    }
    current.setDate(current.getDate() + 1);
  }

  if (slots.length === 0) {
    throw new Error('No available time slots found based on your availability.');
  }

  // Build insert data – one plan per task, in order
  const quest = urgePlaybook[params.missionId]?.quests?.[params.questId];
  const tasks = quest?.tasks || [];
  const selectedTasks = tasks.filter(t => params.taskIds.includes(t.id));
  const plans: UserPlanInsert[] = slots.map((slot, index) => {
    const task = selectedTasks[index];
    return {
      user_id: user.id,
      item_type: 'task',
      item_id: task.id,
      start_time: slot.start.toISOString(),
      end_time: slot.end.toISOString(),
      status: 'scheduled',
      reminder_sent: false,
      metadata: {
        sessionNumber: index + 1,
        totalSessions: slots.length,
        missionId: params.missionId,
        questId: params.questId,
        taskId: task.id,
        taskTitle: task.title,
        questTitle: quest?.title,
        url: `/program/quest/${quest?.slug || params.questId}`,
      },
    };
  });

  const { data, error } = await supabase
    .from('user_plans')
    .insert(plans)
    .select();

  if (error) throw new Error(error.message);
  return { success: true, data: data as UserPlan[] };
}

export async function updatePlanStatus(planId: string, status: 'completed' | 'missed' | 'cancelled') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('user_plans')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', planId)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function completeAllPlansForQuest(questId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // We now have plans with item_type = 'task', but we want to complete all plans for a quest.
  // Since we store questId in metadata, we can query by metadata->>questId
  const { error } = await supabase
    .from('user_plans')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('item_type', 'task')
    .eq('status', 'scheduled')
    .filter('metadata->>questId', 'eq', questId);

  if (error) throw new Error(error.message);
  return { success: true };
}
// actions/plans.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { GenerateScheduleSchema, ScheduleConfigSchema, UserPlanInsert, UserPlan } from '@/types/plans';

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

export async function generateQuestSchedule(params: z.infer<typeof GenerateScheduleSchema>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

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

  // Generate slots (next 7 days)
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

  while (current <= endDate && sessionsCreated < params.numberOfSessions) {
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

  const plans: UserPlanInsert[] = slots.map((slot, index) => ({
    user_id: user.id,
    item_type: 'quest',
    item_id: params.questId,
    start_time: slot.start.toISOString(),
    end_time: slot.end.toISOString(),
    status: 'scheduled',
    reminder_sent: false,
    metadata: {
      sessionNumber: index + 1,
      totalSessions: slots.length,
      missionId: params.missionId,
    },
  }));

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

export async function completeQuestPlans(questId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('user_plans')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('item_type', 'quest')
    .eq('item_id', questId)
    .eq('status', 'scheduled');

  if (error) throw new Error(error.message);
  return { success: true };
}
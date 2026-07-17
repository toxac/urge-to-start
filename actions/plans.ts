'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { GenerateScheduleSchema, ScheduleConfigSchema, UserPlanInsert } from '@/types/plans';

export async function generateQuestSchedule(params: z.infer<typeof GenerateScheduleSchema>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Fetch profile with schedule_config
  const { data: profile } = await supabase
    .from('profiles')
    .select('schedule_config')
    .eq('id', user.id)
    .single();

  // Parse schedule_config safely
  const parsedConfig = ScheduleConfigSchema.safeParse(profile?.schedule_config);
  const config = parsedConfig.success ? parsedConfig.data : ScheduleConfigSchema.parse({});

  const preferredDays = config.preferred_days;
  const preferredHourStart = config.preferred_hours.start;
  const preferredHourEnd = config.preferred_hours.end;
  // timezone can be used later, but not needed for slot generation

  // Prepare date range (next 7 days)
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() + 1);
  const endDate = new Date(now);
  endDate.setDate(now.getDate() + 7);

  const dayMap: Record<string, number> = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6
  };
  const preferredDayNumbers = preferredDays.map(d => dayMap[d.toLowerCase()]);

  const slotDuration = params.durationMinutes * 60 * 1000; // ms
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

  // Build insert data
  const plans: UserPlanInsert[] = slots.map((slot, index) => ({
    user_id: user.id,
    item_type: 'quest',
    item_id: params.questId,
    mission_id: params.missionId,
    quest_id: params.questId,
    task_id: params.taskId || null,
    start_time: slot.start.toISOString(),
    end_time: slot.end.toISOString(),
    status: 'scheduled',
    reminder_sent: false,
    metadata: {
      sessionNumber: index + 1,
      totalSessions: slots.length,
    },
  }));

  const { data, error } = await supabase
    .from('user_plans')
    .insert(plans)
    .select();

  if (error) throw new Error(error.message);
  return { success: true, data };
}

export async function getQuestPlans(missionId: string, questId: string, taskId?: string) {
  // ... same as before
}

export async function updatePlanStatus(planId: string, status: 'completed' | 'missed' | 'cancelled') {
  // ... same as before
}
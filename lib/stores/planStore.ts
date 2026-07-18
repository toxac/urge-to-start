// lib/stores/planStore.ts
import { map } from 'nanostores';
import type { UserPlan } from '@/types/plans';
import { getQuestPlans, generateQuestSchedule, updatePlanStatus, completeAllPlansForQuest } from '@/actions/plans';

export const $plans = map<Record<string, UserPlan[]>>({});
export const $planLoading = map<Record<string, boolean>>({});
export const $planError = map<Record<string, string | null>>({});

export async function fetchPlans(questId: string) {
  if ($plans.get()[questId] !== undefined) return;
  $planLoading.setKey(questId, true);
  $planError.setKey(questId, null);
  try {
    const data = await getQuestPlans(questId);
    $plans.setKey(questId, data);
  } catch (error: any) {
    $planError.setKey(questId, error.message);
  } finally {
    $planLoading.setKey(questId, false);
  }
}

export async function generateAndSetPlans(params: {
  missionId: string;
  questId: string;
  taskIds: string[];
  durationMinutes: number;
  override?: any;
}) {
  $planLoading.setKey(params.questId, true);
  try {
    const result = await generateQuestSchedule(params);
    if (result.success) {
      $plans.setKey(params.questId, result.data);
      return result.data;
    }
    throw new Error('Generation failed');
  } catch (error: any) {
    $planError.setKey(params.questId, error.message);
    throw error;
  } finally {
    $planLoading.setKey(params.questId, false);
  }
}

export async function updatePlan(planId: string, status: 'completed' | 'missed' | 'cancelled') {
  await updatePlanStatus(planId, status);
  // Optimistically update the store
  for (const [questId, plans] of Object.entries($plans.get())) {
    const idx = plans.findIndex(p => p.id === planId);
    if (idx !== -1) {
      const updated = [...plans];
      updated[idx] = { ...updated[idx], status };
      $plans.setKey(questId, updated);
      break;
    }
  }
}

export async function completeAllPlans(questId: string) {
  await completeAllPlansForQuest(questId);
  const plans = $plans.get()[questId];
  if (plans) {
    $plans.setKey(questId, plans.map(p => p.status === 'scheduled' ? { ...p, status: 'completed' } : p));
  }
}

export function clearPlans() {
  $plans.set({});
  $planLoading.set({});
  $planError.set({});
}
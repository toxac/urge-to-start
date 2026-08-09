// lib/utils/taskExecution.ts
import { recordTaskProgressAction } from '@/actions/progress';
import { recordAccomplishment } from '@/actions/accomplishments';
import { setProgressStoreRow, $progressStore, ProgressRow } from '@/lib/stores/progressStore';
import { setAccomplishmentStoreRow } from '@/lib/stores/accomplishmentStore';
import { TaskSchema, QuestSchema } from '@/types/playbook';

interface ProcessTaskCompletionParams {
  task: TaskSchema;
  quest?: QuestSchema;
  savedPayload: Record<string, any>;
}

export async function processTaskCompletion({
  task,
  quest,
  savedPayload,
}: ProcessTaskCompletionParams) {
  // 1. Record Progress in user_progress
  const progressRes = await recordTaskProgressAction({
    taskId: task.id,
    questId: task.quest_id,
    missionId: task.mission_id,
    savedPayload,
    status: 'completed',
  });

  if (!progressRes.success) {
    return { 
      success: false as const, 
      error: progressRes.error || 'Failed to record task progress' 
    };
  }

  // Update client progress store with type cast
  setProgressStoreRow(progressRes.data as ProgressRow);

  // 2. Award Task XP (Points only, no badge)
  const taskAccomplishmentRes = await recordAccomplishment({
    awardedFor: 'task',
    relatedTable: 'tasks',
    relatedReferenceId: task.id,
    title: `Completed ${task.title}`,
    pointsGranted: task.grant_points || 25,
  });

  if (taskAccomplishmentRes.success && taskAccomplishmentRes.accomplishmentRow) {
    setAccomplishmentStoreRow(taskAccomplishmentRes.accomplishmentRow);
  }

  // 3. Optional Quest Milestone Evaluation
  if (quest && quest.badge_config) {
    const currentProgress = $progressStore.get();
    const allQuestTasks = quest.tasks || [];

    const completedTaskCount = allQuestTasks.filter(
      (t) => t.id === task.id || currentProgress[t.id]?.status === 'completed'
    ).length;

    const isQuestComplete = allQuestTasks.length > 0 && completedTaskCount === allQuestTasks.length;

    if (isQuestComplete) {
      // Award Quest Milestone (Badge + Bonus Points)
      const questAccomplishmentRes = await recordAccomplishment({
        awardedFor: 'quest',
        relatedTable: 'quests',
        relatedReferenceId: quest.id,
        title: `Quest Completed: ${quest.title}`,
        description: quest.badge_config.description,
        pointsGranted: 100, // Bonus Quest XP
        badgeGranted: quest.badge_config.key,
      });

      if (questAccomplishmentRes.success && questAccomplishmentRes.accomplishmentRow) {
        setAccomplishmentStoreRow(questAccomplishmentRes.accomplishmentRow);
      }
    }
  }

  return { success: true as const, data: progressRes.data };
}
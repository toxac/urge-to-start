// hooks/useKipProgress.ts
import { useStore } from '@nanostores/react';
import { $progressStore, ProgressRow } from '@/lib/stores/progressStore';
import { $playbookStore } from '@/lib/stores/companionStore';
import { useMemo } from 'react';

export function useKipProgress() {
  const progress = useStore($progressStore);
  const playbook = useStore($playbookStore);

  return useMemo(() => {
    const progressRows = Object.values(progress) as ProgressRow[];
    const completedTasks = progressRows.filter(p => p.status === 'completed');
    const totalCompleted = completedTasks.length;

    // Last activity – find the most recent updated_at
    let lastActivityDate: Date | null = null;
    for (const row of progressRows) {
      if (row.updated_at) {
        const d = new Date(row.updated_at);
        if (!lastActivityDate || d > lastActivityDate) {
          lastActivityDate = d;
        }
      }
    }

    let driftDays: number | null = null;
    let isDrifting = false;
    if (lastActivityDate) {
      const now = new Date();
      const diffMs = now.getTime() - lastActivityDate.getTime();
      driftDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      isDrifting = driftDays >= 7;
    }

    // Find the next incomplete task
    let nextTask: { missionId: string; questId: string; taskId: string; title: string; questTitle: string; missionTitle: string } | null = null;
    const missionIds = Object.keys(playbook).sort((a, b) => playbook[a].sequence - playbook[b].sequence);
    for (const mId of missionIds) {
      const mission = playbook[mId];
      const questKeys = Object.keys(mission.quests).sort((a, b) => mission.quests[a].sequence - mission.quests[b].sequence);
      for (const qKey of questKeys) {
        const quest = mission.quests[qKey];
        const tasks = [...quest.tasks].sort((a, b) => a.sequence - b.sequence);
        for (const task of tasks) {
          if (progress[task.id]?.status !== 'completed') {
            nextTask = {
              missionId: mId,
              questId: qKey,
              taskId: task.id,
              title: task.title,
              questTitle: quest.title,
              missionTitle: mission.title,
            };
            break;
          }
        }
        if (nextTask) break;
      }
      if (nextTask) break;
    }

    return {
      totalCompleted,
      lastActivityDate,
      driftDays,
      isDrifting,
      nextTask,
      progressRows,
      completedTasks,
    };
  }, [progress, playbook]);
}
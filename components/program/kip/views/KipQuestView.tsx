// components/program/kip/views/KipQuestView.tsx
'use client';

import React from 'react';
import { KipBlueprintModule } from '../modules/KipBlueprintModule';
import { KipTaskModule } from '../modules/KipTaskModule';
import type { Mission, Quest} from '@/types/playbook';
import type { ProgressRow } from '@/lib/stores/progressStore';

interface Props {
  missionId: string;
  questId: string;
  activeTaskId: string | null;
  mission: Mission | null;
  quest: Quest | null;
  progress: Record<string, ProgressRow>;
  onStartTask: (taskId: string) => void;
  onCloseTask: () => void;
  onProgressUpdate?: (taskId: string, payload: any) => void;
}

export function KipQuestView({
  missionId,
  questId,
  activeTaskId,
  mission,
  quest,
  progress,
  onStartTask,
  onCloseTask,
  onProgressUpdate,
}: Props) {
  if (!quest) {
    return <p className="text-muted-foreground italic text-center py-4">Quest not found.</p>;
  }

  // If we have an active task, render the task module
  if (activeTaskId) {
    const task = quest.tasks.find((t) => t.id === activeTaskId);
    if (!task) {
      return <p className="text-muted-foreground italic text-center py-4">Task not found.</p>;
    }
    return (
      <KipTaskModule
        task={task}
        questId={questId}
        missionId={missionId}
        progress={progress}
        onCloseTask={onCloseTask}
        onProgressUpdate={onProgressUpdate}
      />
    );
  }

  // Otherwise render the blueprint (overview)
  return (
    <KipBlueprintModule
      quest={quest}
      missionId={missionId}
      progress={progress}
      onStartTask={onStartTask}
    />
  );
}
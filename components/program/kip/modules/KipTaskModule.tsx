// components/program/kip/modules/KipTaskModule.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ProgressRow } from '@/lib/stores/progressStore';
import { Task } from '@/types/playbook';
import { KipRecommendationItem } from './KipRecommendationItem';
import { KipObservationZone } from './KipObservationZone';
import { KipReflectionZone } from './KipReflectionZone';
import { KipQuestionZone } from './KipQuestionZone';

interface Props {
  task: Task;
  questId: string;
  missionId: string;
  progress: Record<string, ProgressRow>;
  onCloseTask: () => void;
  onProgressUpdate?: (taskId: string, payload: any) => void; // optional
}

export function KipTaskModule({ task, questId, missionId, progress, onCloseTask, onProgressUpdate }: Props) {
  const taskProgress = progress[task.id];
  const isCompleted = taskProgress?.status === 'completed';
  const isObservationTask = task.type === 'observation';
  const retroSaved = taskProgress?.saved_payload?.retrospective;

  return (
    <div className="space-y-4">
      {/* Task Header */}
      <div className="p-3.5 border rounded-xl bg-muted/20 border-border/70">
        <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
          Active Task {task.sequence}
        </span>
        <h4 className="text-xs font-bold text-foreground pt-1.5">{task.title}</h4>
        {task.description && <p className="text-[10px] text-muted-foreground mt-1">{task.description}</p>}
      </div>

      {/* Observation Zone */}
      {isObservationTask && !isCompleted && (
        <KipObservationZone
          taskId={task.id}
          questId={questId}
          missionId={missionId}
          observationPrompt={task.ai_config?.observation_prompt}
          guideQuestions={task.observation_config?.guide_questions}
          analysisPrompt={task.ai_config?.observation_analysis_prompt}
          initialAnalysis={taskProgress?.saved_payload?.observation_analysis}
          onAnalysisReceived={(analysis) => {
            // Optionally update progress with analysis – done in the zone itself.
            // We could also set a flag to update the progress store here if needed.
          }}
        />
      )}

      {/* Recommendations */}
      {!isCompleted && task.ai_config?.recommendations && task.ai_config.recommendations.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">
            Suggested Material For This Step
          </span>
          {task.ai_config.recommendations.map((rec, idx) => (
            <KipRecommendationItem
              key={idx}
              recommendation={rec}
              taskId={task.id}
              questId={questId}
              missionId={missionId}
            />
          ))}
        </div>
      )}

      {!isCompleted && (
        <div className="space-y-2 mt-4">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">
            Have a question?
          </span>
          <KipQuestionZone itemType="task" itemId={task.id} />
        </div>
      )}

      {/* Reflection Zone */}
      {isCompleted && !retroSaved?.userResponseText && (
        <KipReflectionZone
          taskId={task.id}
          questId={questId}
          missionId={missionId}
          reflectionPrompt={task.ai_config?.reflection_prompt}
          onSuccess={() => {
            // Optionally update progress store – the zone does not save to progress directly,
            // but we could call a store update here.
          }}
        />
      )}

      {/* Completed Reflection Feedback */}
      {isCompleted && retroSaved?.aiValidationText && (
        <div className="space-y-3 animate-in fade-in">
          <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1.5 leading-relaxed font-medium text-[11px] border-border/70">
            <span className="font-bold text-foreground block text-[10px] uppercase tracking-wide text-muted-foreground">
              Kip's Note:
            </span>
            <p className="text-foreground/90 italic">"{retroSaved.aiValidationText}"</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-8 font-bold text-[11px] rounded-lg flex-1 bg-background">
              💾 Save to Diary Archive
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 font-bold text-[11px] rounded-lg text-primary hover:bg-primary/5"
              onClick={onCloseTask}
            >
              Back to Overview
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
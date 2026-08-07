// app/(platform)/program/quest/[id]/page.tsx
'use client';

import React, { use, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { $playbookStore, setCompanionFocus } from '@/lib/stores/companionStore';
import { $progressStore } from '@/lib/stores/progressStore';
import { $profileStore } from '@/lib/stores/profileStore'; 
import { TaskFormRegistry } from '@/components/program/TaskFormRegistry'; 
import { ChevronLeft, CheckCircle2, Lock, Eye, Play, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MissionSchema, QuestSchema, TaskSchema } from '@/types/playbook';

export default function QuestActionCenterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const questParamId = resolvedParams.id;

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const playbook = useStore($playbookStore);
  const progress = useStore($progressStore);
  const profile = useStore($profileStore);

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Strongly typed matching for active mission and quest
  let activeMissionId = '';
  let currentQuest: QuestSchema | null = null;

  for (const [mId, mission] of Object.entries(playbook || {}) as [string, MissionSchema][]) {
    const foundQuest = mission.quests?.find((q: QuestSchema) => q.id === questParamId);
    if (foundQuest) {
      activeMissionId = mission.id || mId;
      currentQuest = foundQuest;
      break;
    }
  }

  const tasks: TaskSchema[] = currentQuest?.tasks || [];
  const currentUserId = profile?.id || '';

  const completedCount = tasks.filter((t: TaskSchema) => progress[t.id]?.status === 'completed').length;
  const progressRatioPercentage = tasks.length > 0 ? Math.min(100, Math.floor((completedCount / tasks.length) * 100)) : 0;
  const nextIncompleteTask = tasks.find((t: TaskSchema) => progress[t.id]?.status !== 'completed');

  // Sync Companion Focus
  useEffect(() => {
    if (currentQuest) {
      setCompanionFocus({
        pageType: 'quest',
        activeMissionId,
        activeQuestId: currentQuest.id,
        activeTaskId: activeTaskId,
      });
    }
  }, [activeTaskId, activeMissionId, currentQuest]);

  if (!currentQuest) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-32 animate-in fade-in duration-200">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span className="text-xs font-sans font-medium text-muted-foreground tracking-wide">
          Opening quest workspace...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300 text-left">

      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-5">
        <button
          onClick={() => {
            startTransition(() => {
              router.push(`/program/mission/${activeMissionId}`);
            });
          }}
          disabled={isPending}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Mission
        </button>
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground/60">
          Quest Work Center
        </span>
      </div>

      {/* Quest Meta Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-muted/30 border border-border p-6 rounded-2xl">
        <div className="space-y-1 text-left">
          <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            Active Chapter Focus
          </span>
          <h1 className="text-xl font-bold tracking-tight text-foreground pt-1.5">
            {currentQuest.title}
          </h1>
        </div>

        <div className="space-y-1 shrink-0 text-left md:text-right">
          <span className="text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-wider block">Progress</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted border border-border rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressRatioPercentage}%` }} />
            </div>
            <span className="text-xs font-bold text-foreground">{progressRatioPercentage}%</span>
          </div>
        </div>
      </div>

      {/* WORKSPACE LAYOUT SWITCHER */}
      {activeTaskId ? (
        /* TASK EXECUTION BUBBLE VIEW */
        (() => {
          const activeTask = tasks.find((t: TaskSchema) => t.id === activeTaskId);
          const activeTaskProgress = progress[activeTaskId];
          
          if (!activeTask) return null;

          return (
            <div className="border border-primary rounded-2xl bg-card shadow-md p-6 space-y-6 animate-in zoom-in-95 duration-200 text-left">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
                    Executing Step Challenge
                  </span>
                  <h2 className="text-base font-bold text-foreground">{activeTask.title}</h2>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-[11px] font-semibold cursor-pointer"
                  onClick={() => setActiveTaskId(null)}
                >
                  Close Step
                </Button>
              </div>

              <TaskFormRegistry
                task={activeTask}
                userId={currentUserId}
                existingProgress={activeTaskProgress}
                onSuccess={() => {
                  setActiveTaskId(null);
                }}
              />
            </div>
          );
        })()
      ) : (
        /* CHAPTER PROGRESS TIMELINE BOARD VIEW */
        <div className="space-y-4">
          <div className="text-left pb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Tasks Checklist
            </h3>
          </div>

          {tasks.map((task: TaskSchema, index: number) => {
            const taskProgress = progress[task.id];
            const isTaskCompleted = taskProgress?.status === 'completed';

            // Sequential lock rule: previous task must be completed
            const isLocked = index > 0 && progress[tasks[index - 1].id]?.status !== 'completed';

            return (
              <div
                key={task.id}
                className={`transition-all duration-200 rounded-2xl border p-5 flex items-center justify-between gap-4 text-left ${
                  isLocked
                    ? 'border-border/40 bg-muted/20 opacity-40 pointer-events-none'
                    : 'border-border bg-card/50 hover:border-border-hover cursor-pointer opacity-95 hover:opacity-100 shadow-sm'
                }`}
                onClick={() => {
                  if (!isLocked) setActiveTaskId(task.id);
                }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="shrink-0">
                    {isTaskCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4 text-muted-foreground/60 m-0.5" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-primary/40 flex items-center justify-center text-[10px] font-bold text-primary font-sans">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5 truncate">
                    <h4 className="text-sm font-bold text-foreground truncate tracking-tight">
                      {task.title}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate max-w-xl font-medium">
                      {task.briefing_text}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  {!isLocked && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-xl font-sans text-xs font-bold text-primary hover:text-primary hover:bg-primary/5 px-3 flex items-center gap-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTaskId(task.id);
                      }}
                    >
                      {isTaskCompleted ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review Work</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-primary/10" />
                          <span>Start Task</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Quick Callout */}
          {nextIncompleteTask && (
            <div className="p-4 border rounded-xl bg-muted/20 border-dashed text-left flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>Next step: <strong>&ldquo;{nextIncompleteTask.title}&rdquo;</strong>.</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground animate-pulse" />
            </div>
          )}
        </div>
      )}

    </div>
  );
}
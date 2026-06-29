'use client';

import React, { useEffect, useState, useRef, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { $playbookStore, setCompanionFocus } from '@/lib/stores/companionStore';
import { $progressStore } from '@/lib/stores/progressStore';
import { $profileStore } from '@/lib/stores/profileStore'; // Fetch profile metadata id securely
import { TaskFormRegistry } from '@/components/program/TaskFormRegistry'; // ⚡ Import the actual form registry
import { ChevronLeft, CheckCircle2, Lock, Eye, Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QuestActionCenterPage() {
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // Connect Atomic Stores
  const playbook = useStore($playbookStore);
  const progress = useStore($progressStore);
  const profile = useStore($profileStore);

  // Local navigation state override override
  const [overrideTaskId, setOverrideTaskId] = useState<string | null>(null);

  // 1. Resolve target structures out of static file mappings
  let activeMissionId = '';
  let activeQuestKey = '';
  let currentQuest: any = null;

  Object.entries(playbook || {}).forEach(([mId, mission]) => {
    Object.entries(mission.quests || {}).forEach(([qKey, quest]) => {
      if (quest.slug === params.slug) {
        activeMissionId = mId;
        activeQuestKey = qKey;
        currentQuest = quest;
      }
    });
  });

  if (!currentQuest) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-32 animate-in fade-in duration-200">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span className="text-xs font-sans font-medium text-muted-foreground tracking-wide">
          Loading active workspace parameters...
        </span>
      </div>
    );
  }

  const tasks = currentQuest.tasks || [];
  const currentUserId = profile?.id || '';

  // 2. Identify chronological active/next task based on actual progression records
  const nextIncompleteTask = tasks.find((t: any) => progress[t.id]?.status !== 'completed') || tasks[tasks.length - 1];
  
  // Core selected item tracking: defaults to next incomplete task, but yields to explicit manual user selection
  const activeTaskId = overrideTaskId || nextIncompleteTask?.id;
  const currentSelectedTask = tasks.find((t: any) => t.id === activeTaskId) || nextIncompleteTask;

  // 3. Synchronize Companion focus layers down to the specific focused card
  useEffect(() => {
    if (currentSelectedTask) {
      setCompanionFocus({
        pageType: 'quest',
        activeMissionId,
        activeQuestId: activeQuestKey,
        activeTaskId: currentSelectedTask.id,
      });
    }
  }, [currentSelectedTask?.id, activeMissionId, activeQuestKey]);

  // Calculate overarching quest statistics
  const completedCount = tasks.filter((t: any) => progress[t.id]?.status === 'completed').length;
  const progressRatioPercentage = Math.min(100, Math.floor((completedCount / tasks.length) * 100));

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      
      {/* Back Navigation Bar Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-5">
        <button 
          onClick={() => {
            startTransition(() => {
              router.push(`/platform/program/mission/${activeMissionId}`);
            });
          }}
          disabled={isPending}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition flex-row"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Roadmap
        </button>
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground/60">
          Quest Focus Center
        </span>
      </div>

      {/* Quest Context Meta Frame Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-muted/30 border border-border p-6 rounded-2xl">
        <div className="space-y-1 text-left">
          <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            Active Exploration Track
          </span>
          <h1 className="text-xl font-bold tracking-tight text-foreground pt-1.5">
            {currentQuest.title}
          </h1>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-xl">
            {currentQuest.subtitle}
          </p>
        </div>

        {/* Progress bar indicators */}
        <div className="space-y-1 shrink-0 text-left md:text-right">
          <span className="text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-wider block">Quest Completion</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted border border-border rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressRatioPercentage}%` }} />
            </div>
            <span className="text-xs font-bold text-foreground">{progressRatioPercentage}%</span>
          </div>
        </div>
      </div>

      {/* ─── DYNAMIC UNIFIED TIMELINE LOOP ─── */}
      <div className="space-y-4">
        {tasks.map((task: any, index: number) => {
          const taskProgress = progress[task.id];
          const isTaskCompleted = taskProgress?.status === 'completed';
          const isTaskFocusedNow = activeTaskId === task.id;

          // Sequential Lock Gate Rules: A task is locked if the previous task is not completed yet
          const isLocked = index > 0 && progress[tasks[index - 1].id]?.status !== 'completed';

          return (
            <div 
              key={task.id}
              className={`transition-all duration-200 rounded-2xl border ${
                isTaskFocusedNow 
                  ? 'border-primary bg-card/100 shadow-md ring-1 ring-primary/20' 
                  : isLocked 
                    ? 'border-border/40 bg-muted/20 opacity-40 pointer-events-none'
                    : 'border-border bg-card/50 hover:border-border-hover cursor-pointer opacity-85 hover:opacity-100'
              }`}
              onClick={() => {
                if (!isLocked && !isTaskFocusedNow) {
                  setOverrideTaskId(task.id);
                }
              }}
            >
              {/* COMPONENT CASE 1: Active Focused Task — Renders full interactive Form Registry */}
              {isTaskFocusedNow ? (
                <div className="animate-in fade-in duration-200">
                  <TaskFormRegistry 
                    task={task}
                    userId={currentUserId}
                    existingProgress={taskProgress}
                    onSuccess={() => {
                      // Automatically advance local view state parameter once input saves successfully
                      setOverrideTaskId(null);
                    }}
                  />
                </div>
              ) : (
                /* COMPONENT CASE 2: Collapsed Summary Row (For Completed or Accessible tasks) */
                <div className="p-5 flex items-center justify-between gap-4 text-left">
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
                      <p className="text-xs text-muted-foreground truncate max-w-md font-medium">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions Toggle Status Indicators */}
                  <div className="shrink-0 pl-2">
                    {!isLocked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 rounded-xl font-sans text-xs font-semibold text-primary hover:text-primary hover:bg-primary/5 px-3 flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation(); // Avoid triggering double click events on parent box wrapper
                          setOverrideTaskId(task.id);
                        }}
                      >
                        {isTaskCompleted ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Answer</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-primary/10" />
                            <span>Open Task</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
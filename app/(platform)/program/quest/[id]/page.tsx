// app/(platform)/program/quest/[id]/page.tsx
'use client';

import React, { use, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { $playbookStore } from '@/lib/stores/playbookStore';
import { $progressStore } from '@/lib/stores/progressStore';
import { $profileStore } from '@/lib/stores/profileStore';
import { $focusMode } from '@/lib/stores/focusMode';
import { setCompanionFocus } from '@/lib/stores/companionStore';
import { TaskFormRegistry } from '@/components/program/TaskFormRegistry';
import { ProgramHeader } from '@/components/program/ProgramHeader';
import { ChevronLeft, CheckCircle2, Lock, Eye, Play, Loader2, ArrowRight, EyeOff } from 'lucide-react';
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
  const focusMode = useStore($focusMode);

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [markdownHtml, setMarkdownHtml] = useState<string | null>(null);
  const [loadingMarkdown, setLoadingMarkdown] = useState(false);

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
        activeTaskId,
      });
    }
  }, [activeTaskId, activeMissionId, currentQuest]);

  // Fetch markdown content for quest
  useEffect(() => {
    if (currentQuest?.content_path) {
      setLoadingMarkdown(true);
      fetch(`/api/markdown?path=${encodeURIComponent(currentQuest.content_path)}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to load markdown');
          return res.text();
        })
        .then(html => setMarkdownHtml(html))
        .catch(err => {
          console.error('Error loading markdown:', err);
          setMarkdownHtml(null);
        })
        .finally(() => setLoadingMarkdown(false));
    }
  }, [currentQuest]);

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

  // Format estimated time
  const inApp = currentQuest.estimated_in_app_minutes || 0;
  const offApp = currentQuest.estimated_off_app_minutes || 0;
  const estimatedTime = `~${inApp} min in-app${offApp > 0 ? `, ${offApp} min off-app` : ''}`;

  // Toggle focus mode
  const toggleFocusMode = () => {
    $focusMode.set(!focusMode);
  };

  // Show extra content only when NOT in focus mode AND no task is open
  const showExtraContent = !focusMode && !activeTaskId;

  return (
    <div className="w-full py-4 space-y-8 animate-in fade-in duration-300 text-left relative">
      {/* ─── Focus Mode Toggle Button ─── */}
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-6 right-6 z-50 rounded-full h-10 w-10 p-0 shadow-lg bg-background border border-border hover:bg-muted transition-colors"
        onClick={toggleFocusMode}
        title={focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
      >
        {focusMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </Button>

      {/* ─── EXTRA CONTENT (hidden when focus mode OR task open) ─── */}
      {showExtraContent && (
        <>
          <ProgramHeader
            type="quest"
            title={currentQuest.title}
            sequence={currentQuest.sequence}
            estimatedTime={estimatedTime}
            videoUrl={currentQuest.video_url}
          />

          {loadingMarkdown && (
            <div className="py-8 text-center text-muted-foreground text-xs">
              <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
              Loading quest content...
            </div>
          )}
          {markdownHtml && !loadingMarkdown && (
            <div
              className="prose prose-sm md:prose-base max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: markdownHtml }}
            />
          )}
        </>
      )}

      {/* ─── TASK FORM OR CHECKLIST ─── */}
      {activeTaskId ? (
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
        /* ─── TASKS CHECKLIST CARD ─── */
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border/60 bg-muted/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Tasks Checklist
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {progressRatioPercentage}%
                </span>
                <div className="w-24 h-2 bg-muted border border-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressRatioPercentage}%` }} />
                </div>
              </div>
            </div>
          </div>
          <div className="divide-y divide-border/40">
            {tasks.map((task: TaskSchema, index: number) => {
              const taskProgress = progress[task.id];
              const isTaskCompleted = taskProgress?.status === 'completed';
              const isLocked = index > 0 && progress[tasks[index - 1].id]?.status !== 'completed';

              return (
                <div
                  key={task.id}
                  className={`px-6 py-5 flex items-center justify-between gap-4 text-left transition duration-200 ${
                    isLocked
                      ? 'opacity-40 pointer-events-none'
                      : 'hover:bg-muted/20 cursor-pointer'
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
          </div>
          {nextIncompleteTask && (
            <div className="px-6 py-4 border-t border-border/40 bg-muted/10 text-left flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>Next step: <strong>&ldquo;{nextIncompleteTask.title}&rdquo;</strong>.</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground animate-pulse" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
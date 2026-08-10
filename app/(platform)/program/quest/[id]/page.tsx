// app/(platform)/program/quest/[id]/page.tsx
'use client';

import React, { use, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { $playbookStore } from '@/lib/stores/playbookStore';
import { $progressStore } from '@/lib/stores/progressStore';
import { $profileStore } from '@/lib/stores/profileStore';
import { $accomplishmentStore } from '@/lib/stores/accomplishmentStore';
import { setCompanionFocus } from '@/lib/stores/companionStore';
import { TaskFormRegistry } from '@/components/program/TaskFormRegistry';
import { ProgramHeader } from '@/components/program/ProgramHeader';
import { 
  CheckCircle2, 
  Lock, 
  Eye, 
  Play, 
  Loader2, 
  ArrowRight, 
  Trophy, 
  Award, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  const accomplishments = useStore($accomplishmentStore);

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [markdownHtml, setMarkdownHtml] = useState<string | null>(null);
  const [loadingMarkdown, setLoadingMarkdown] = useState(false);

  let activeMission: MissionSchema | null = null;
  let activeMissionId = '';
  let currentQuest: QuestSchema | null = null;

  for (const [mId, mission] of Object.entries(playbook || {}) as [string, MissionSchema][]) {
    const foundQuest = mission.quests?.find((q: QuestSchema) => q.id === questParamId);
    if (foundQuest) {
      activeMission = mission;
      activeMissionId = mission.id || mId;
      currentQuest = foundQuest;
      break;
    }
  }

  const tasks: TaskSchema[] = currentQuest?.tasks || [];
  const currentUserId = profile?.id || '';

  const completedCount = tasks.filter((t: TaskSchema) => progress[t.id]?.status === 'completed').length;
  const isQuestFullyCompleted = tasks.length > 0 && completedCount === tasks.length;
  const progressRatioPercentage = tasks.length > 0 ? Math.min(100, Math.floor((completedCount / tasks.length) * 100)) : 0;
  const nextIncompleteTask = tasks.find((t: TaskSchema) => progress[t.id]?.status !== 'completed');

  // Determine Next Quest in the sequence
  const currentQuestIndex = activeMission?.quests?.findIndex((q) => q.id === currentQuest?.id) ?? -1;
  const nextQuest = currentQuestIndex >= 0 && activeMission?.quests?.[currentQuestIndex + 1] 
    ? activeMission.quests[currentQuestIndex + 1] 
    : null;

  // Determine if entire mission is complete (no next quest AND current quest finished)
  const isMissionFullyCompleted = !nextQuest && isQuestFullyCompleted;
  const nextMissionId = 'mission-2'; // Next mission in sequence

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

  return (
    <div className="w-full py-4 space-y-8 animate-in fade-in duration-300 text-left relative">
      
      {/* ─── QUEST HEADER & LESSON CONTENT ─── */}
      {!activeTaskId && (
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

      {/* ─── QUEST / MISSION COMPLETED CELEBRATION BANNER ─── */}
      {isQuestFullyCompleted && !activeTaskId && (
        <div className={`w-full border rounded-2xl p-6 shadow-md space-y-5 animate-in slide-in-from-top-4 duration-300 ${
          isMissionFullyCompleted 
            ? 'bg-gradient-to-r from-amber-500/10 via-primary/10 to-emerald-500/10 border-amber-500/40' 
            : 'bg-gradient-to-r from-emerald-500/10 via-primary/5 to-amber-500/10 border-emerald-500/30'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${
                isMissionFullyCompleted 
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-500' 
                  : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-500'
              }`}>
                <Trophy className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    isMissionFullyCompleted ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {isMissionFullyCompleted ? '🎉 Mission Mastered!' : 'Quest Accomplished!'}
                  </span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[9px] font-mono">
                    100% Complete
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {isMissionFullyCompleted ? `Completed ${activeMission?.title || 'Mission 1'}` : currentQuest.title}
                </h3>
              </div>
            </div>

            {/* Action Button: Next Quest OR Next Mission */}
            <div className="shrink-0">
              {nextQuest ? (
                <Button
                  onClick={() => {
                    startTransition(() => {
                      router.push(`/program/quest/${nextQuest.id}`);
                    });
                  }}
                  disabled={isPending}
                  className="h-10 px-5 text-xs font-bold tracking-wider uppercase cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Start Quest {nextQuest.sequence}: {nextQuest.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              ) : (
                /* 🎓 MISSION GRADUATION CTA */
                <Button
                  onClick={() => {
                    startTransition(() => {
                      router.push(`/program/mission/${nextMissionId}`);
                    });
                  }}
                  disabled={isPending}
                  className="h-11 px-6 text-xs font-bold tracking-wider uppercase cursor-pointer gap-2 bg-gradient-to-r from-amber-500 to-primary text-white shadow-lg hover:brightness-110 transition"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-200" />
                      <span>Graduate & Unlock Mission 2</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Displays Mission Success Message if whole mission completed */}
          {isMissionFullyCompleted && activeMission?.success_message && (
            <div className="p-4 rounded-xl bg-card/80 border border-amber-500/30 space-y-1.5">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Mission Milestone Achievement
              </span>
              <p className="text-xs text-foreground font-medium leading-relaxed italic">
                "{activeMission.success_message}"
              </p>
            </div>
          )}

          {/* Badge & XP Rewards Summary */}
          <div className="p-4 rounded-xl bg-card border border-border/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <span className="font-bold text-foreground block">
                  {isMissionFullyCompleted ? 'Mission 1 Founder Badge Unlocked' : (currentQuest.badge_config?.title || 'Quest Badge Unlocked')}
                </span>
                <p className="text-muted-foreground text-[11px]">
                  {isMissionFullyCompleted 
                    ? 'You have faced rejection, built real-world momentum, and completed your mindset audit.' 
                    : 'All quest challenges successfully validated.'}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs font-mono font-bold text-amber-500 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {isMissionFullyCompleted ? '+200 Bonus XP' : '+100 Bonus XP'}
            </Badge>
          </div>
        </div>
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
              const isTaskInProgress = taskProgress?.status === 'in_progress';
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
                        ) : isTaskInProgress ? (
                          <>
                            <Play className="w-3 h-3 fill-amber-500/20 text-amber-500" />
                            <span className="text-amber-500">Continue Task</span>
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
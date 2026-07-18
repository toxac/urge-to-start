// components/program/kip/modules/KipBlueprintModule.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { Button } from '@/components/ui/button';
import { Calendar, Sparkles, Loader2, RefreshCw, Trash2, ChevronRight } from 'lucide-react';
import { useKipProgress } from '@/hooks/useKipProgress';
import { PlanDialog } from './PlanDialog';
import type { Quest } from '@/types/playbook';
import type { ProgressRow } from '@/lib/stores/progressStore';
import { toast } from 'sonner';

import { $plans, $planLoading, fetchPlans, updatePlan, completeAllPlans } from '@/lib/stores/planStore';

interface Props {
  quest: Quest;
  missionId: string;
  progress: Record<string, ProgressRow>;
  onStartTask: (taskId: string) => void;
}

export function KipBlueprintModule({ quest, missionId, progress, onStartTask }: Props) {
  const { totalCompleted, nextTask } = useKipProgress();
  const [dialogOpen, setDialogOpen] = useState(false);

  const plansMap = useStore($plans);
  const loadingMap = useStore($planLoading);
  const plans = plansMap[quest.id] || [];
  const loading = loadingMap[quest.id] || false;

  useEffect(() => {
    fetchPlans(quest.id);
  }, [quest.id]);

  const tasks = quest.tasks || [];
  const completedCount = tasks.filter((t: any) => progress[t.id]?.status === 'completed').length;
  const progressRatio = Math.min(100, Math.floor((completedCount / tasks.length) * 100));
  const isQuestFullyCompleted = tasks.length > 0 && completedCount === tasks.length;

  useEffect(() => {
    if (isQuestFullyCompleted && plans.some(p => p.status === 'scheduled')) {
      completeAllPlans(quest.id).then(() => {
        toast.success('All sessions marked as completed – great job!');
      }).catch(err => {
        console.error(err);
        toast.error('Failed to update plan status');
      });
    }
  }, [isQuestFullyCompleted, plans, quest.id]);

  const handleDeleteAllPlans = async () => {
    if (!confirm('Delete all scheduled sessions for this quest?')) return;
    try {
      const scheduled = plans.filter(p => p.status === 'scheduled');
      await Promise.all(scheduled.map(p => updatePlan(p.id, 'cancelled')));
      toast.success('All sessions cancelled');
    } catch (error) {
      toast.error('Failed to cancel sessions');
    }
  };

  const scheduledPlans = plans.filter(p => p.status === 'scheduled');

  const formatPlanTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = d.toLocaleDateString(undefined, { weekday: 'short' });
    const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    return `${day} at ${time}`;
  };

  // Build task lookup map
  const taskMap = tasks.reduce((acc, t) => ({ ...acc, [t.id]: t }), {} as Record<string, any>);

  return (
    <div className="space-y-5 animate-in fade-in duration-200 text-left">
      <div className="space-y-1">
        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase tracking-wider">
          Chapter Overview
        </span>
        <h3 className="text-sm font-bold text-foreground pt-1">{quest.title}</h3>
        <p className="text-muted-foreground leading-relaxed text-[11px] font-medium">{quest.description}</p>
      </div>

      {/* Progress block */}
      <div className="border border-border bg-muted/30 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-foreground">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>Your Progress</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground font-medium">Tasks completed</span>
          <span className="font-bold text-foreground">{completedCount} / {tasks.length}</span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressRatio}%` }} />
        </div>
        {isQuestFullyCompleted && (
          <div className="mt-2 p-3 border border-emerald-500/20 bg-emerald-500/5 rounded-xl text-center space-y-2 animate-in zoom-in-95">
            <div className="flex items-center justify-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>Chapter Complete!</span>
            </div>
            <p className="text-muted-foreground text-[11px] font-medium leading-relaxed">
              You cleared all tasks in this chapter. Well done!
            </p>
            {quest.ai_config?.on_success?.badge_key && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-bold uppercase tracking-wider mx-auto">
                🏆 Unlocked: {quest.ai_config.on_success.badge_key}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Schedule block – consistent style with progress */}
      <div className="border border-border bg-card rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-foreground">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>Your Schedule</span>
          </div>
          <div className="flex gap-1">
            {scheduledPlans.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-[10px] text-muted-foreground"
                onClick={handleDeleteAllPlans}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-[10px] font-bold gap-1"
              onClick={() => setDialogOpen(true)}
              disabled={loading}
            >
              {scheduledPlans.length > 0 ? <RefreshCw className="w-3 h-3" /> : '📅 Plan'}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        ) : scheduledPlans.length === 0 && plans.filter(p => p.status === 'completed').length === 0 ? (
          <p className="text-muted-foreground text-[11px] italic">No active plans. Click "Plan" to schedule your tasks.</p>
        ) : (
          <ul className="space-y-1.5">
            {plans.filter(p => p.status !== 'cancelled').map((plan) => {
              const isPast = new Date(plan.end_time) < new Date();
              const isCompleted = plan.status === 'completed';
              const isScheduled = plan.status === 'scheduled';
              const task = taskMap[plan.item_id];
              // ✅ Safe metadata access
              const meta = plan.metadata as Record<string, any> | undefined;
              const taskTitle = task?.title || meta?.taskTitle || 'Unknown task';
              const taskSeq = task?.sequence || meta?.taskSequence || '';

              return (
                <li key={plan.id} className="flex items-center justify-between text-xs">
                  <span className="truncate">
                    {isCompleted && <span className="mr-1.5 text-emerald-500">✅</span>}
                    <span className={isPast && isScheduled ? 'text-muted-foreground' : ''}>
                      {taskSeq}. {taskTitle} – {formatPlanTime(plan.start_time)}
                    </span>
                    {isPast && isScheduled && <span className="ml-1.5 text-amber-600 text-[10px]">(past)</span>}
                  </span>
                  {isScheduled && !isPast && (
                    <span className="text-[10px] text-muted-foreground">upcoming</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Common Questions placeholder */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">
          Common Questions for this Chapter
        </span>
        <div className="space-y-1.5">
          <button className="w-full p-2.5 rounded-xl border border-border/80 bg-background text-left hover:border-primary/40 transition flex items-center justify-between text-muted-foreground font-medium group text-[11px] cursor-pointer">
            <span>How do I protect these blocks with a busy family schedule?</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition" />
          </button>
          <button className="w-full p-2.5 rounded-xl border border-border/80 bg-background text-left hover:border-primary/40 transition flex items-center justify-between text-muted-foreground font-medium group text-[11px] cursor-pointer">
            <span>What happens if I encounter an unexpected delay?</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition" />
          </button>
        </div>
      </div>

      <PlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        missionId={missionId}
        questId={quest.id}
        tasks={tasks.map(t => ({
          id: t.id,
          title: t.title,
          sequence: t.sequence,
          completed: progress[t.id]?.status === 'completed',
        }))}
        existingPlans={scheduledPlans}
      />
    </div>
  );
}
// components/program/kip/modules/KipBlueprintModule.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Sparkles, Loader2, Clock, ChevronRight, RefreshCw, Trash2 } from 'lucide-react';
import { useKipProgress } from '@/hooks/useKipProgress';
import { getQuestPlans, updatePlanStatus, generateQuestSchedule, completeQuestPlans } from '@/actions/plans';
import { PlanDialog } from './PlanDialog';
import type { Quest } from '@/types/playbook';
import type { ProgressRow } from '@/lib/stores/progressStore';
import type { UserPlan } from '@/types/plans';
import { toast } from 'sonner';

interface Props {
  quest: Quest;
  missionId: string;
  progress: Record<string, ProgressRow>;
  onStartTask: (taskId: string) => void;
}

export function KipBlueprintModule({ quest, missionId, progress, onStartTask }: Props) {
  const { totalCompleted, nextTask } = useKipProgress();
  const [plans, setPlans] = useState<UserPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Load existing plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getQuestPlans(quest.id);
        setPlans(data);
      } catch (error) {
        console.error('Failed to fetch plans:', error);
        toast.error('Could not load your plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [quest.id]);

  // Calculate completion metrics
  const tasks = quest.tasks || [];
  const completedCount = tasks.filter((t: any) => progress[t.id]?.status === 'completed').length;
  const progressRatio = Math.min(100, Math.floor((completedCount / tasks.length) * 100));
  const isQuestFullyCompleted = tasks.length > 0 && completedCount === tasks.length;

  // Auto‑complete plans when quest is fully completed
  useEffect(() => {
    if (isQuestFullyCompleted && plans.some(p => p.status === 'scheduled')) {
      completeQuestPlans(quest.id).then(() => {
        setPlans(prev => prev.map(p => p.status === 'scheduled' ? { ...p, status: 'completed' } : p));
        toast.success('All sessions marked as completed – great job!');
      }).catch(err => {
        console.error(err);
        toast.error('Failed to update plan status');
      });
    }
  }, [isQuestFullyCompleted, plans, quest.id]);

  const handleScheduleGenerated = (newPlans: UserPlan[]) => {
    setPlans(newPlans);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleDeleteAllPlans = async () => {
    if (!confirm('Delete all scheduled sessions for this quest?')) return;
    try {
      await Promise.all(plans.map(p => updatePlanStatus(p.id, 'cancelled')));
      setPlans([]);
      toast.success('All sessions cancelled');
    } catch (error) {
      toast.error('Failed to cancel sessions');
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200 text-left">
      {/* Title & description */}
      <div className="space-y-1">
        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase tracking-wider">
          Chapter Overview
        </span>
        <h3 className="text-sm font-bold text-foreground pt-1">{quest.title}</h3>
        <p className="text-muted-foreground leading-relaxed text-[11px] font-medium">{quest.description}</p>
      </div>

      {/* Progress */}
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

      {/* Planning Section */}
      <div className="border border-border bg-card rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
            Your Schedule
          </span>
          <div className="flex gap-1">
            {plans.some(p => p.status === 'scheduled') && (
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
              onClick={handleOpenDialog}
              disabled={loading}
            >
              {plans.length > 0 ? <RefreshCw className="w-3 h-3" /> : '📅 Plan'}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        ) : plans.filter(p => p.status !== 'cancelled').length === 0 ? (
          <p className="text-muted-foreground text-[11px] italic">No active plans. Click "Plan" to schedule your sessions.</p>
        ) : (
          <ul className="space-y-2">
            {plans.filter(p => p.status !== 'cancelled').map((plan) => {
              const isPast = new Date(plan.end_time) < new Date();
              const isCompleted = plan.status === 'completed';
              const isScheduled = plan.status === 'scheduled';
              const metadata = (plan.metadata || {}) as { sessionNumber?: number; totalSessions?: number };

              return (
                <li key={plan.id} className="flex items-center justify-between p-2 border rounded-lg bg-muted/10 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <Clock className={`w-3 h-3 ${isPast ? 'text-muted-foreground' : isCompleted ? 'text-emerald-500' : 'text-primary'}`} />
                    <span className={`font-medium truncate ${isPast ? 'text-muted-foreground' : isCompleted ? 'text-emerald-600' : 'text-foreground'}`}>
                      {new Date(plan.start_time).toLocaleDateString()} at {new Date(plan.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-muted-foreground">–</span>
                    <span className="text-muted-foreground text-[10px]">
                      {Math.round((new Date(plan.end_time).getTime() - new Date(plan.start_time).getTime()) / 60000)} min
                    </span>
                    {metadata.sessionNumber && (
                      <span className="text-[9px] text-muted-foreground">(#{metadata.sessionNumber})</span>
                    )}
                    {isPast && isScheduled && (
                      <span className="text-[9px] text-amber-600">(past)</span>
                    )}
                    {isCompleted && (
                      <span className="text-[9px] text-emerald-600">✅ done</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {isScheduled && !isPast && (
                      <span className="text-[10px] text-muted-foreground">upcoming</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Common Questions (placeholder) */}
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

      {/* Dialog for creating plans */}
      <PlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        missionId={missionId}
        questId={quest.id}
        onSuccess={handleScheduleGenerated}
        existingPlans={plans.filter(p => p.status === 'scheduled')} // optional – for rescheduling
      />
    </div>
  );
}
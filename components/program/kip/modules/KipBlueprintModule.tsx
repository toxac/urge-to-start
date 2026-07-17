// components/program/kip/modules/KipBlueprintModule.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Sparkles, CheckCircle2, Loader2, Clock, ChevronRight } from 'lucide-react';
import { useKipCalendar } from '@/hooks/useKipCalendar';
import { generateQuestSchedule, getQuestPlans, updatePlanStatus } from '@/actions/plans';
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
  const { generateAndDownloadICS } = useKipCalendar();
  const [plans, setPlans] = useState<UserPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  // Load existing plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getQuestPlans(missionId, quest.id);
        setPlans(data);
      } catch (error) {
        console.error('Failed to fetch plans:', error);
        toast.error('Could not load your plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [missionId, quest.id]);

  const handleGenerateSchedule = async () => {
    setGenerating(true);
    try {
      const result = await generateQuestSchedule({
        missionId,
        questId: quest.id,
        numberOfSessions: 3,
        durationMinutes: 60,
      });
      if (result.success) {
        setPlans(result.data);
        toast.success(`Planned ${result.data.length} sessions for this quest!`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate schedule');
    } finally {
      setGenerating(false);
    }
  };

  const handleUpdateStatus = async (planId: string, status: 'completed' | 'missed' | 'cancelled') => {
    setUpdating(planId);
    try {
      await updatePlanStatus(planId, status);
      setPlans(prev => prev.map(p => p.id === planId ? { ...p, status } : p));
      toast.success(`Session marked as ${status}`);
    } catch (error) {
      toast.error('Failed to update plan');
    } finally {
      setUpdating(null);
    }
  };

  // Calculate completion ratio
  const tasks = quest.tasks || [];
  const completedCount = tasks.filter((t: any) => progress[t.id]?.status === 'completed').length;
  const progressRatio = Math.min(100, Math.floor((completedCount / tasks.length) * 100));
  const isQuestFullyCompleted = tasks.length > 0 && completedCount === tasks.length;

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

      {/* Progress & time estimates */}
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
          <Button
            size="sm"
            variant="outline"
            className="h-6 text-[10px] font-bold gap-1"
            onClick={handleGenerateSchedule}
            disabled={generating || loading}
          >
            {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : '📅 Plan this quest'}
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        ) : plans.length === 0 ? (
          <p className="text-muted-foreground text-[11px] italic">No plans yet. Click "Plan this quest" to schedule your sessions.</p>
        ) : (
          <ul className="space-y-2">
            {plans.map((plan) => {
              const isPast = new Date(plan.end_time) < new Date();
              const isCompleted = plan.status === 'completed';
              const isMissed = plan.status === 'missed';
              const isCancelled = plan.status === 'cancelled';
              const isScheduled = plan.status === 'scheduled';
              const metadata = (plan.metadata || {}) as { sessionNumber?: number; totalSessions?: number };

              return (
                <li key={plan.id} className="flex items-center justify-between p-2 border rounded-lg bg-muted/10 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <Clock className={`w-3 h-3 ${isPast ? 'text-muted-foreground' : 'text-primary'}`} />
                    <span className="font-medium truncate">
                      {new Date(plan.start_time).toLocaleDateString()} at {new Date(plan.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-muted-foreground">–</span>
                    <span className="text-muted-foreground text-[10px]">
                      {Math.round((new Date(plan.end_time).getTime() - new Date(plan.start_time).getTime()) / 60000)} min
                    </span>
                    {metadata.sessionNumber && (
                      <span className="text-[9px] text-muted-foreground">(#{metadata.sessionNumber})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {isScheduled && !isPast && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-[10px] text-green-600 hover:bg-green-50"
                          onClick={() => handleUpdateStatus(plan.id, 'completed')}
                          disabled={updating === plan.id}
                        >
                          {updating === plan.id ? <Loader2 className="w-3 h-3 animate-spin" /> : '✅ Done'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-[10px] text-red-600 hover:bg-red-50"
                          onClick={() => handleUpdateStatus(plan.id, 'missed')}
                          disabled={updating === plan.id}
                        >
                          {updating === plan.id ? <Loader2 className="w-3 h-3 animate-spin" /> : '❌ Miss'}
                        </Button>
                      </>
                    )}
                    {(isCompleted || isMissed || isCancelled) && (
                      <span className="text-[10px] text-muted-foreground capitalize">{plan.status}</span>
                    )}
                    {isPast && isScheduled && (
                      <span className="text-[10px] text-amber-600">(past)</span>
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
    </div>
  );
}
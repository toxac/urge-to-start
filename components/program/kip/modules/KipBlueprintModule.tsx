// components/program/kip/modules/KipBlueprintModule.tsx
'use client';

import React from 'react';
import { Calendar, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressRow } from '@/lib/stores/progressStore';
import { Quest } from '@/types/playbook';
import { downloadICS } from '@/lib/calendar/ics';
import { KipProgressBar } from '../shared/KipProgressBar';

interface Props {
  quest: Quest;
  missionId: string;
  progress: Record<string, ProgressRow>;
  onStartTask: (taskId: string) => void; // required
}

export function KipBlueprintModule({ quest, missionId, progress, onStartTask }: Props)  {
  const tasks = quest.tasks || [];
  const completedCount = tasks.filter((t) => progress[t.id]?.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressRatio = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  const isQuestFullyCompleted = totalTasks > 0 && completedCount === totalTasks;

  // Generate ICS events based on estimated times
  const handleLockSlots = () => {
    const inAppMinutes = quest.estimated_in_app_minutes || 45;
    const offAppMinutes = quest.estimated_off_app_minutes || 0;
    const totalMinutes = inAppMinutes + offAppMinutes;

    // Create 3 sessions of ~60 minutes each (adjusted)
    const sessionMinutes = Math.max(60, Math.ceil(totalMinutes / 3));
    const events = [];
    const now = new Date();
    for (let i = 0; i < 3; i++) {
      const start = new Date(now.getTime() + (i + 1) * 24 * 60 * 60 * 1000);
      const end = new Date(start.getTime() + sessionMinutes * 60 * 1000);
      events.push({
        title: `${quest.title} – session ${i + 1}`,
        start: start.toISOString(),
        end: end.toISOString(),
        description: `Work on quest: ${quest.description || 'No description'}. Recommended time: ${sessionMinutes} min.`,
      });
    }
    downloadICS(events, `kip-${quest.slug}.ics`);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200 text-left">
      <div className="space-y-1">
        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase tracking-wider">
          Chapter Overview
        </span>
        <h3 className="text-sm font-bold text-foreground pt-1">{quest.title}</h3>
        <p className="text-muted-foreground leading-relaxed text-[11px] font-medium">{quest.description}</p>
      </div>

      {/* Interactive Quest Planner */}
      <div className="border border-border bg-muted/30 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-foreground">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>Sprint Commitment Planner</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 rounded-lg bg-background border border-border/60">
            <span className="text-muted-foreground font-medium block text-[10px]">App Workspace</span>
            <span className="font-bold text-foreground">{quest.estimated_in_app_minutes || 0} Minutes</span>
          </div>
          <div className="p-2 rounded-lg bg-background border border-border/60">
            <span className="text-muted-foreground font-medium block text-[10px]">Real World Action</span>
            <span className="font-bold text-foreground">{quest.estimated_off_app_minutes || 0} Minutes</span>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-full h-7 font-bold text-[10px] gap-1.5 shadow-sm bg-background"
          onClick={handleLockSlots}
        >
          📅 Lock Slots into My Calendar
        </Button>
      </div>

      {/* Progress Tracker */}
      <div className="border border-border bg-card rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="text-muted-foreground uppercase text-[10px] tracking-wide">Milestone Track</span>
          <span className="text-primary">{completedCount} / {totalTasks} Checked</span>
        </div>
        <KipProgressBar value={progressRatio} />

        {isQuestFullyCompleted && (
          <div className="mt-2 p-3 border border-emerald-500/20 bg-emerald-500/5 rounded-xl text-center space-y-2 animate-in zoom-in-95">
            <div className="flex items-center justify-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>Chapter Milestones Met!</span>
            </div>
            <p className="text-muted-foreground text-[11px] font-medium leading-relaxed">
              You cleared all active workspace challenges here. Your profile balance has been updated with extra points.
            </p>
            {quest.ai_config?.on_success?.badge_key && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-bold uppercase tracking-wider mx-auto">
                🏆 Unlocked: {quest.ai_config.on_success.badge_key}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
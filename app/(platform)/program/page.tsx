// app/(platform)/program/page.tsx
'use client';

import React, { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { $playbookStore } from '@/lib/stores/playbookStore';
import { setCompanionFocus } from '@/lib/stores/companionStore';
import { $progressStore } from '@/lib/stores/progressStore';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

export default function ProgramDashboardPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const playbook = useStore($playbookStore);
  const progress = useStore($progressStore);

  // 1. Trigger the Global Companion state for the Dashboard on mount
  useEffect(() => {
    setCompanionFocus({ pageType: 'dashboard' });
  }, []);

  // 2. Transform the playbook into an ordered array of missions
  const missions = Object.values(playbook || {}).sort((a, b) => a.sequence - b.sequence);

  // 3. Find the active mission the user is currently working on
  const activeMission = missions.find((mission) => {
    return mission.quests?.some((quest) =>
      quest.tasks?.some((task) => progress[task.id]?.status !== 'completed')
    );
  }) || missions[0];

  // 4. Calculate total completed tasks
  const totalCompletedTasks = Object.values(progress || {}).filter(p => p.status === 'completed').length;

  if (missions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-32 animate-in fade-in duration-200">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-xs font-sans font-medium text-muted-foreground tracking-wide">
          Syncing workspace track...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-300 text-left">

      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1">
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary">
            Start
          </span>
          <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight text-foreground">
            Your Missions
          </h1>
          <p className="text-xs text-muted-foreground font-medium max-w-md leading-relaxed">
            No spreadsheets, no hype. Focus entirely on the immediate task in front of you.
          </p>
        </div>

        <div className="bg-muted/50 border border-border px-3.5 py-2 rounded-xl shrink-0 text-left md:text-right">
          <span className="text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-wider block">Tasks Mastered</span>
          <span className="text-base font-heading font-black text-foreground">{totalCompletedTasks}</span>
        </div>
      </div>

      {/* Active Target Mission Banner */}
      {activeMission && (
        <div className="p-8 border border-primary/20 bg-card rounded-2xl shadow-sm space-y-6 relative overflow-hidden transition hover:border-primary/30">
          <div className="absolute right-4 top-4 text-primary/5 select-none pointer-events-none">
            <ShieldAlert className="w-28 h-28 stroke-[1]" />
          </div>

          <div className="space-y-1.5 relative z-10">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md">
              Current Target — Mission 0{activeMission.sequence}
            </span>
            <h2 className="text-xl font-bold text-foreground tracking-tight pt-2">
              {activeMission.title}
            </h2>
            {activeMission.big_question && (
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xl font-medium pt-1 italic">
                "{activeMission.big_question}"
              </p>
            )}
          </div>

          <div className="pt-2 relative z-10">
            <Button
              onClick={() => {
                startTransition(() => {
                  router.push(`/program/mission/${activeMission.id}`);
                });
              }}
              disabled={isPending}
              className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-sans text-xs font-bold tracking-wider uppercase transition shadow-md shadow-primary/10 flex items-center cursor-pointer"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />}
              Continue Quests
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Missions Sequence Stack */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground pb-2 border-b border-border/60">
          The Roadmap
        </h3>

        <div className="grid grid-cols-1 gap-2.5">
          {missions.map((m) => {
            const isCurrent = activeMission?.id === m.id;

            const totalTasks = m.quests?.reduce((acc, q) => acc + (q.tasks?.length || 0), 0) || 0;
            const completedTasks = m.quests?.reduce((acc, q) => {
              return acc + (q.tasks?.filter((t) => progress[t.id]?.status === 'completed').length || 0);
            }, 0) || 0;
            const isFinished = totalTasks > 0 && completedTasks === totalTasks;

            return (
              <div
                key={m.id}
                onClick={() => router.push(`/program/mission/${m.id}`)}
                className={`p-4 border rounded-xl flex items-center justify-between transition group cursor-pointer ${
                  isCurrent
                    ? 'border-primary/30 bg-primary/5 font-semibold shadow-sm'
                    : 'border-border bg-card/40 opacity-80 hover:opacity-100 hover:border-border/80'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className={`text-xs font-sans font-bold shrink-0 ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                    Mission-0{m.sequence}
                  </span>
                  <p className="text-xs text-foreground font-bold truncate tracking-tight">
                    {m.title}
                  </p>
                </div>

                <div className="shrink-0 pl-4">
                  {isFinished ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
                  ) : isCurrent ? (
                    <span className="text-[9px] font-sans font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">
                      Active
                    </span>
                  ) : (
                    <span className="text-[9px] font-sans font-bold text-muted-foreground group-hover:text-foreground transition uppercase tracking-wider">
                      View Quests
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
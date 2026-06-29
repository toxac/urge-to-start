// app/(platform)/program/page.tsx
'use client';

import React, { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { $playbookStore, setCompanionFocus } from '@/lib/stores/companionStore';
import { $progressStore } from '@/lib/stores/progressStore';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

export default function ProgramDashboardPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const playbook = useStore($playbookStore);
  const progress = useStore($progressStore);

  // 1. Trigger the Global Kip Concierge state for the Dashboard on mount
  useEffect(() => {
    setCompanionFocus({ pageType: 'dashboard' });
  }, []);

  // 2. Transform the raw playbook mapping into a clean ordered tracking stack
  const missions = Object.entries(playbook || {})
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => a.sequence - b.sequence);

  // 3. Find the exact mission the user is currently working on
  const activeMission = missions.find((mission) => {
    const quests = Object.values(mission.quests || {});
    return quests.some((quest: any) => 
      quest.tasks?.some((task: any) => progress[task.id]?.status !== 'completed')
    );
  }) || missions[0];

  // 4. Calculate overarching program metrics to show progress
  const totalCompletedTasks = Object.values(progress || {}).filter(p => p.status === 'completed').length;

  // ⚡ PROTECTION LAYER: If state stores are empty, show a loading block instead of a broken page
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
    <div className="w-full space-y-10 animate-in fade-in duration-300">
      
      {/* Streamlined Workspace Title Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1">
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary">
            Urge Start Playbook
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-foreground">
            Your Building Track
          </h1>
          <p className="text-xs text-muted-foreground font-medium max-w-md leading-relaxed">
            No spreadsheets, no hype. Focus entirely on the immediate task in front of you.
          </p>
        </div>
        
        {/* Simple Progress Telemetry Component */}
        <div className="bg-muted/50 border border-border px-3 py-1.5 rounded-xl shrink-0 text-left md:text-right">
          <span className="text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-wider block">Tasks Mastered</span>
          <span className="text-sm font-serif font-black text-foreground">{totalCompletedTasks}</span>
        </div>
      </div>

      {/* ─── ENHANCED FOCUS AREA: Active Target Card ─── */}
      {activeMission && (
        <div className="p-8 border border-primary/20 bg-card rounded-2xl shadow-sm space-y-6 relative overflow-hidden transition hover:border-primary/30">
          <div className="absolute right-4 top-4 text-primary/5 select-none pointer-events-none">
            <ShieldAlert className="w-28 h-28 stroke-[1]" />
          </div>

          <div className="space-y-1.5 relative z-10">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              Current Target — Sequence 0{activeMission.sequence}
            </span>
            <h2 className="text-xl font-bold text-foreground tracking-tight pt-2">
              {activeMission.title}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl font-medium pt-1">
              {activeMission.briefing_text}
            </p>
          </div>

          <div className="pt-2 relative z-10">
            <Button
              onClick={() => {
                startTransition(() => {
                  router.push(`/program/mission/${activeMission.id}`);
                });
              }}
              disabled={isPending}
              className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-sans text-xs font-bold tracking-wider uppercase transition shadow-md shadow-primary/10 flex items-center"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
              ) : null}
              Resume Building Flow
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* ─── THE ROADMAP SEQUENCE STACK ─── */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground tracking-wider pb-2 border-b border-border/60">
          The Complete Track Roadmap
        </h3>
        
        <div className="grid grid-cols-1 gap-2.5">
          {missions.map((m) => {
            const isCurrent = activeMission?.id === m.id;
            
            // Calculate completions safely across inner collections
            const totalTasks = Object.values(m.quests || {}).reduce((acc: number, q: any) => acc + (q.tasks?.length || 0), 0);
            const completedTasks = Object.values(m.quests || {}).reduce((acc: number, q: any) => {
              return acc + (q.tasks?.filter((t: any) => progress[t.id]?.status === 'completed').length || 0);
            }, 0);
            const isFinished = totalTasks > 0 && completedTasks === totalTasks;

            return (
              <div
                key={m.id}
                onClick={() => router.push(`/program/mission/${m.id}`)}
                className={`p-4 border rounded-xl flex items-center justify-between transition group cursor-pointer ${
                  isCurrent 
                    ? 'border-primary/30 bg-primary/5 font-semibold shadow-sm' 
                    : 'border-border bg-card/40 opacity-75 hover:opacity-100 hover:border-border-hover'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className={`text-xs font-sans font-bold shrink-0 ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                    0{m.sequence}
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
                      View Track
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
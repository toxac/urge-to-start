// app/(platform)/program/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { $playbookStore, setCompanionFocus } from '@/lib/stores/companionStore';
import { $progressStore } from '@/lib/stores/progressStore';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowRight, CheckCircle } from 'lucide-react';

export default function ProgramDashboardPage() {
  const router = useRouter();
  const playbook = useStore($playbookStore);
  const progress = useStore($progressStore);

  // 1. Trigger the Global Kip Concierge state for the Dashboard on mount
  useEffect(() => {
    setCompanionFocus({ pageType: 'dashboard' });
  }, []);

  // 2. Transmute the raw playbook mapping into a clean ordered tracking stack
  const missions = Object.entries(playbook)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => a.sequence - b.sequence);

  // 3. Find the exact mission the user is currently working on
  const activeMission = missions.find((mission) => {
    const quests = Object.values(mission.quests || {});
    // Check if any quest tasks are incomplete
    return quests.some((quest: any) => 
      quest.tasks?.some((task: any) => progress[task.id]?.status !== 'completed')
    );
  }) || missions[0];

  // 4. Calculate overarching program metrics to show subtle progress
  const totalCompletedTasks = Object.values(progress).filter(p => p.status === 'completed').length;

  return (
    <div className="min-h-screen w-full bg-[#F9F7F4] text-[#1A1A1A] font-sans antialiased flex flex-col selection:bg-[#E86A33]/20">
      
      {/* ─── PROPORTION PRINCIPLE: Low-Contrast System Header ─── */}
      <header className="w-full h-12 px-6 border-b border-[#8C8580]/10 flex items-center justify-between shrink-0 bg-[#F9F7F4]">
        <span className="text-xs font-bold text-[#1A1A1A] tracking-tight uppercase">
          The Urge Workspace
        </span>
        <div className="flex items-center gap-4 text-[11px] font-bold text-[#8C8580]">
          <span>Tasks Mastered: {totalCompletedTasks}</span>
        </div>
      </header>

      {/* ─── ASYMMETRICAL BUILDER GRID ─── */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-12 overflow-hidden">
        
        {/* LEFT COLUMN: The Focus Panel (Takes up 70% of the visual space) */}
        <div className="lg:col-span-2 space-y-12 overflow-y-auto h-full pr-2">
          
          {/* Dashboard Welcome Header */}
          <div className="space-y-2 text-left">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#8C8580]">
              Operational Hub
            </h2>
            <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-[#1A1A1A]">
              Your Building Track
            </h1>
            <p className="text-xs text-[#8C8580] font-medium max-w-md leading-relaxed">
              No spreadsheets, no hype. Focus entirely on the immediate goal in front of you.
            </p>
          </div>

          {/* ─── EMPHASIS PRINCIPLE: The Single Active Action Card ─── */}
          {activeMission && (
            <div className="p-8 border border-[#E86A33]/30 bg-[#F9F7F4] rounded-2xl shadow-[0_8px_32px_rgba(232,106,51,0.04)] space-y-6 relative overflow-hidden">
              <div className="absolute right-4 top-4 text-[#E86A33]/10">
                <ShieldAlert className="w-24 h-24 stroke-[1]" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E86A33]">
                  Current Target Mission — Sequence {activeMission.sequence}
                </span>
                <h2 className="text-xl font-bold text-[#1A1A1A] tracking-tight">
                  {activeMission.title}
                </h2>
                <p className="text-xs text-[#8C8580] leading-relaxed max-w-xl font-medium pt-1">
                  {activeMission.briefing_text}
                </p>
              </div>

              {/* THE MOAT: Clean spacing around the primary action button */}
              <div className="pt-4">
                <Button
                  onClick={() => router.push(`/program/mission/${activeMission.id}`)}
                  className="h-11 px-6 rounded-xl bg-[#E86A33] hover:bg-[#D35925] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#E86A33]/10"
                >
                  Resume Building Flow
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* ─── REPETITION PRINCIPLE: Secondary Roadmap Index ─── */}
          <div className="space-y-4 pt-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8C8580] pb-2 border-b border-[#8C8580]/10">
              The Complete Playbook Sequence
            </h3>
            
            <div className="space-y-3">
              {missions.map((m) => {
                const isCurrent = activeMission?.id === m.id;
                
                // Determine if all tasks in this mission are complete
                const totalTasks = Object.values(m.quests || {}).reduce((acc: number, q: any) => acc + (q.tasks?.length || 0), 0);
                const completedTasks = Object.values(m.quests || {}).reduce((acc: number, q: any) => {
                  return acc + (q.tasks?.filter((t: any) => progress[t.id]?.status === 'completed').length || 0);
                }, 0);
                const isFinished = totalTasks > 0 && completedTasks === totalTasks;

                return (
                  <div
                    key={m.id}
                    onClick={() => router.push(`/program/mission/${m.id}`)}
                    className={`p-4 border rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                      isCurrent 
                        ? 'border-[#E86A33]/20 bg-[#E86A33]/5 font-semibold' 
                        : 'border-[#8C8580]/15 bg-background/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-bold text-[#8C8580] shrink-0">0{m.sequence}</span>
                      <p className="text-xs text-[#1A1A1A] font-bold truncate tracking-tight">{m.title}</p>
                    </div>

                    <div className="shrink-0 pl-4">
                      {isFinished ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <span className="text-[10px] font-bold text-[#E86A33] uppercase tracking-wider">Active</span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#8C8580] uppercase tracking-wider">View</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Manifesto Inspiration Sidebar */}
        <div className="hidden lg:block lg:col-span-1 border-l border-[#8C8580]/10 pl-8 space-y-6">
          <div className="p-5 bg-[#8C8580]/5 rounded-2xl border border-[#8C8580]/10 space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] border-b border-[#8C8580]/10 pb-2">
              The Urge Creed
            </h4>
            <p className="text-xs text-[#8C8580] italic leading-relaxed font-medium">
              "We believe a business is a simple, beautiful equation: Solve a real problem, for a real person, and get paid for it. Analysis paralysis is the silent killer of dreams. We trade endless spreadsheets for a single, focused experiment."
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { $playbookStore, setCompanionFocus } from '@/lib/stores/companionStore';
import { $progressStore } from '@/lib/stores/progressStore';
import { Button } from '@/components/ui/button';
import { ChevronLeft, PlayCircle, CheckCircle2 } from 'lucide-react';

export default function MissionRoadmapPage() {
  const params = useParams();
  const router = useRouter();
  
  const playbook = useStore($playbookStore);
  const progress = useStore($progressStore);

  const missionId = params.id as string;
  const currentMission = playbook[missionId];

  // 1. Immediately sync the Companion to "Strategic Concierge" mode
  useEffect(() => {
    if (currentMission) {
      setCompanionFocus({
        pageType: 'mission',
        activeMissionId: missionId,
      });
    }
  }, [currentMission, missionId]);

  if (!currentMission) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#F9F7F4] text-xs font-medium text-[#8C8580]">
        Decrypting mission parameters...
      </div>
    );
  }

  // 2. Convert quests into a strictly ordered execution array
  const quests = Object.entries(currentMission.quests || {})
    .map(([key, data]) => ({ key, ...data }))
    .sort((a, b) => a.sequence - b.sequence);

  return (
    <div className="min-h-screen w-full bg-[#F9F7F4] text-[#1A1A1A] font-sans antialiased flex flex-col selection:bg-[#E86A33]/20">
      
      {/* ─── PROPORTION PRINCIPLE: The "Tiny Top Bar" ─── */}
      <header className="w-full h-12 px-6 border-b border-[#8C8580]/10 flex items-center justify-between shrink-0 bg-[#F9F7F4]">
        <button 
          onClick={() => router.push('/program')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#8C8580] hover:text-[#1A1A1A] opacity-70 transition-opacity"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Program Overview
        </button>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C8580] opacity-60">
          Strategic Briefing
        </span>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-16 md:py-24 space-y-20">
        
        {/* ─── BALANCE PRINCIPLE: Symmetrical, Poetic Formal Briefing ─── */}
        <div className="flex flex-col items-center text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E86A33]">
            Mission Sequence {currentMission.sequence}
          </span>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-[#1A1A1A]">
            {currentMission.title}
          </h1>
          
          <p className="text-base md:text-lg text-[#8C8580] leading-relaxed max-w-2xl mx-auto font-medium">
            {currentMission.briefing_text}
          </p>

          {currentMission.video_url && (
            <div className="pt-4">
              <Button 
                variant="outline" 
                className="rounded-full border-[#8C8580]/20 text-[#1A1A1A] hover:bg-[#8C8580]/5 h-10 px-6 text-xs font-bold tracking-wider uppercase transition-all"
              >
                <PlayCircle className="w-4 h-4 mr-2 opacity-70" />
                Watch Founder Briefing
              </Button>
            </div>
          )}
        </div>

        {/* ─── REPETITION PRINCIPLE: The Atomic <UrgeCard> Array ─── */}
        <div className="space-y-6 w-full">
          <div className="text-center pb-4 border-b border-[#8C8580]/10">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8C8580]">
              Tactical Quest Objectives
            </h3>
          </div>

          {quests.map((quest) => {
            // Check baseline completion metrics to style the entry card
            const totalTasks = quest.tasks?.length || 0;
            const completedTasks = quest.tasks?.filter(t => progress[t.id]?.status === 'completed').length || 0;
            const isCompleted = totalTasks > 0 && completedTasks === totalTasks;
            const isStarted = completedTasks > 0 && completedTasks < totalTasks;

            return (
              <div 
                key={quest.key}
                onClick={() => router.push(`/program/quest/${quest.slug}`)}
                className="group bg-[#F9F7F4] border-t border-[#8C8580]/15 border-x border-b border-[#8C8580]/5 rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_rgba(140,133,128,0.02)] hover:shadow-[0_8px_32px_rgba(140,133,128,0.06)] transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
              >
                {/* Visual affordance: Left edge movement accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E86A33] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8580]">
                      Quest {quest.sequence}
                    </span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Locked Done
                      </span>
                    )}
                    {isStarted && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#E86A33] bg-[#E86A33]/10 px-2 py-0.5 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-[#1A1A1A] tracking-tight group-hover:text-[#E86A33] transition-colors">
                    {quest.title}
                  </h3>
                  <p className="text-xs text-[#8C8580] leading-relaxed max-w-md">
                    {quest.subtitle}
                  </p>
                </div>

                <div className="shrink-0 flex justify-start md:justify-end">
                  <span className="text-[#E86A33] group-hover:text-[#D35925] text-xs font-bold uppercase tracking-wider transition-colors">
                    {isCompleted ? 'Review Logs →' : 'Enter Quest →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
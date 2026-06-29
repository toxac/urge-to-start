'use client';

import React, { useEffect, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { $playbookStore, setCompanionFocus } from '@/lib/stores/companionStore';
import { $progressStore } from '@/lib/stores/progressStore';
import { Button } from '@/components/ui/button';
import { ChevronLeft, PlayCircle, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

export default function MissionRoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const playbook = useStore($playbookStore);
  const progress = useStore($progressStore);

  const missionId = params.id as string;
  const currentMission = playbook[missionId];

  // 1. Immediately sync the Companion to "Strategic Advisor" mode
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
      <div className="flex flex-col items-center justify-center space-y-3 py-32 animate-in fade-in duration-200">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span className="text-xs font-sans font-medium text-muted-foreground tracking-wide">
          Decrypting mission parameters...
        </span>
      </div>
    );
  }

  // 2. Convert quests into a strictly ordered execution array
  const quests = Object.entries(currentMission.quests || {})
    .map(([key, data]) => ({ key, ...data }))
    .sort((a, b) => a.sequence - b.sequence);

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-300">
      
      {/* Back Header Nav link */}
      <div className="flex items-center justify-between border-b border-border/60 pb-5">
        <button 
          onClick={() => {
            startTransition(() => {
              router.push('/platform/program');
            });
          }}
          disabled={isPending}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition flex-row"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Roadmap
        </button>
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground/60">
          Strategic Briefing
        </span>
      </div>

      {/* Symmetrical Header Briefing area */}
      <div className="flex flex-col items-center text-center space-y-4 pt-4">
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
          Mission Track 0{currentMission.sequence}
        </span>
        
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-foreground max-w-xl leading-tight">
          {currentMission.title}
        </h1>
        
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto font-medium">
          {currentMission.briefing_text}
        </p>

        {currentMission.video_url && (
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="rounded-xl border-border bg-card text-foreground hover:bg-muted font-sans text-xs font-bold px-5 h-9 transition shadow-sm"
            >
              <PlayCircle className="w-4 h-4 mr-2 text-primary" />
              Watch Founder Video
            </Button>
          </div>
        )}
      </div>

      {/* Repetitive Quest Cards list container */}
      <div className="space-y-4 pt-4">
        <div className="pb-2 border-b border-border/60">
          <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground tracking-wider">
            Target Quest Objectives
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {quests.map((quest) => {
            const totalTasks = quest.tasks?.length || 0;
            const completedTasks = quest.tasks?.filter(t => progress[t.id]?.status === 'completed').length || 0;
            const isCompleted = totalTasks > 0 && completedTasks === totalTasks;
            const isStarted = completedTasks > 0 && completedTasks < totalTasks;

            return (
              <div 
                key={quest.key}
                onClick={() => router.push(`/program/quest/${quest.slug}`)}
                className="group bg-card/40 border border-border rounded-2xl p-6 shadow-sm hover:border-primary/30 transition duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden"
              >
                <div className="space-y-1.5 flex-1 text-left">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-muted-foreground">
                      Quest 0{quest.sequence}
                    </span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[9px] font-sans font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3 fill-emerald-500/10" /> Completed
                      </span>
                    )}
                    {isStarted && (
                      <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        In Progress
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-base font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {quest.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-md font-medium">
                    {quest.subtitle}
                  </p>
                </div>

                <div className="shrink-0 flex items-center justify-start sm:justify-end text-xs font-bold text-primary group-hover:translate-x-0.5 transition pr-1">
                  <span>{isCompleted ? 'Review Logs' : 'Start Quest'}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
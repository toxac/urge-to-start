// components/program/MissionCompletionCard.tsx
'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MissionSchema, PlaybookConfig } from '@/types/playbook';
import { Trophy, Award, Sparkles, ArrowUpRight, Loader2 } from 'lucide-react';

interface MissionCompletionCardProps {
  activeMission: MissionSchema;
  playbook?: PlaybookConfig | null;
}

export function MissionCompletionCard({ activeMission, playbook }: MissionCompletionCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // 1. Calculate ordered list of missions from PlaybookConfig
  const missionsList: MissionSchema[] = playbook ? Object.values(playbook) : [];
  
  // 2. Locate current active mission index
  const currentIndex = missionsList.findIndex((m) => m.id === activeMission.id);
  
  // 3. Resolve next mission dynamically from sequence list
  const nextMission: MissionSchema | null = 
    currentIndex >= 0 && missionsList[currentIndex + 1] 
      ? missionsList[currentIndex + 1] 
      : null;

  // Fallback numbers if sequence array is single item or unmapped
  const currentMissionNum = activeMission.sequence || parseInt(activeMission.id?.replace(/\D/g, '') || '1', 10);
  const nextMissionNum = nextMission?.sequence || currentMissionNum + 1;
  const nextMissionId = nextMission?.id || `mission-${nextMissionNum}`;

  const nextMissionRoute = `/program/mission/${nextMissionId}`;

  return (
    <div className="w-full border rounded-2xl p-6 shadow-md space-y-5 animate-in slide-in-from-top-4 duration-300 bg-gradient-to-r from-amber-500/10 via-primary/10 to-emerald-500/10 border-amber-500/40 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl border bg-amber-500/20 border-amber-500/40 text-amber-500 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                🎉 Mission {currentMissionNum} Mastered!
              </span>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[9px] font-mono">
                100% Complete
              </Badge>
            </div>
            <h3 className="text-base font-bold text-foreground">
              Completed {activeMission.title}
            </h3>
          </div>
        </div>

        {/* Dynamic Graduation CTA to Next Mission */}
        <div className="shrink-0">
          <Button
            onClick={() => {
              startTransition(() => {
                router.push(nextMissionRoute);
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
                <span>Graduate & Unlock {nextMission?.title ? `${nextMission.title}` : `Mission ${nextMissionNum}`}</span>
                <ArrowUpRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Mission Success Message */}
      {activeMission.success_message && (
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

      {/* Badge & XP Summary */}
      <div className="p-4 rounded-xl bg-card border border-border/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <span className="font-bold text-foreground block">
              {activeMission.badge_config?.title || `Mission ${currentMissionNum} Founder Badge Unlocked`}
            </span>
            <p className="text-muted-foreground text-[11px]">
              {activeMission.badge_config?.description || `You have completed all quests in ${activeMission.title} and locked in your next phase.`}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs font-mono font-bold text-amber-500 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          +200 Bonus XP
        </Badge>
      </div>
    </div>
  );
}
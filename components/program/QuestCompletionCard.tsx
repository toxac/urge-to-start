// components/program/QuestCompletionCard.tsx
'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuestSchema } from '@/types/playbook';
import { Trophy, Award, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

interface QuestCompletionCardProps {
  currentQuest: QuestSchema;
  nextQuest: QuestSchema;
}

export function QuestCompletionCard({ currentQuest, nextQuest }: QuestCompletionCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="w-full border rounded-2xl p-6 shadow-md space-y-5 animate-in slide-in-from-top-4 duration-300 bg-gradient-to-r from-emerald-500/10 via-primary/5 to-amber-500/10 border-emerald-500/30 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl border bg-emerald-500/20 border-emerald-500/30 text-emerald-500 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                Quest Accomplished!
              </span>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[9px] font-mono">
                100% Complete
              </Badge>
            </div>
            <h3 className="text-base font-bold text-foreground">
              {currentQuest.title}
            </h3>
          </div>
        </div>

        {/* Transition button to next quest */}
        <div className="shrink-0">
          <Button
            onClick={() => {
              startTransition(() => {
                router.push(`/program/quest/${nextQuest.id}`);
              });
            }}
            disabled={isPending}
            className="h-10 px-5 text-xs font-bold tracking-wider uppercase cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Start Quest {nextQuest.sequence}: {nextQuest.title}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Quest Badge & Rewards */}
      <div className="p-4 rounded-xl bg-card border border-border/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <span className="font-bold text-foreground block">
              {currentQuest.badge_config?.title || 'Quest Badge Unlocked'}
            </span>
            <p className="text-muted-foreground text-[11px]">
              {currentQuest.badge_config?.description || 'All quest challenges successfully validated.'}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs font-mono font-bold text-amber-500 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          +100 Bonus XP
        </Badge>
      </div>
    </div>
  );
}
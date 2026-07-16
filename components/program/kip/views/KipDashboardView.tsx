// components/program/kip/views/KipDashboardView.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useKipProgress } from '@/hooks/useKipProgress';
import type { ProfileRow } from '@/types/profiles';

interface Props {
  profile: ProfileRow | null;
}

export function KipDashboardView({ profile }: Props) {
  const router = useRouter();
  const { totalCompleted, isDrifting, nextTask } = useKipProgress();

  const handleNavigateToNextTask = () => {
    if (!nextTask) return;
    // Construct the quest slug from the questId (you might need to map)
    // For simplicity, we assume we have a function to get quest slug.
    // We'll use a placeholder: /program/quest/{quest-slug}
    router.push(`/program/quest/${nextTask.questId}`); // adjust as needed
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200 text-xs">
      {/* Friendly Welcome Context Block */}
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-foreground">
          Hey {profile?.full_name || 'Founder'}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          Welcome back to your builder hub. You have successfully locked down{' '}
          <strong className="text-foreground">{totalCompleted}</strong> program goals so far.
        </p>
      </div>

      {/* Proactive Drift Notification Banner */}
      {isDrifting && (
        <div className="p-3 border border-amber-500/20 bg-amber-500/5 rounded-xl space-y-2 animate-in slide-in-from-bottom-2">
          <p className="font-bold text-amber-600 dark:text-amber-400">
            ⏳ Re-engagement Anchor Activated
          </p>
          <p className="text-muted-foreground leading-relaxed">
            It looks like life got in the way and you've been away from your playbook loop for a week. Don't worry—getting distracted is part of the founder sprint.
          </p>
          <Button size="sm" variant="outline" className="h-7 text-[11px] w-full mt-1" onClick={handleNavigateToNextTask}>
            🎯 Review My High-Level Project Targets
          </Button>
        </div>
      )}

      {/* Next Best Action */}
      {nextTask && (
        <div className="p-3 border rounded-xl bg-muted/20 space-y-1">
          <p className="font-semibold text-foreground">Next Milestone Action:</p>
          <p className="text-muted-foreground leading-relaxed">
            Your next step is <strong>"{nextTask.title}"</strong> in the quest <strong>"{nextTask.questTitle}"</strong>.
          </p>
          <Button size="sm" variant="outline" className="h-7 text-[11px] w-full mt-1" onClick={handleNavigateToNextTask}>
            🎯 Start Task
          </Button>
        </div>
      )}

      {/* Static Help */}
      <div className="p-3 border rounded-xl bg-muted/20 space-y-1">
        <p className="font-semibold text-foreground">Need direction?</p>
        <p className="text-muted-foreground leading-relaxed">
          Head into your active Mission overview page to select an uncompleted tactical Quest block and keep building momentum.
        </p>
      </div>
    </div>
  );
}
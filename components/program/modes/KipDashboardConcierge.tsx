'use client';

import React from 'react';
import { useStore } from '@nanostores/react';
import { $profileStore } from '@/lib/stores/profileStore'; // Assumed workspace profile store
import { ProgressRow } from '@/lib/stores/progressStore';
import { Button } from '@/components/ui/button';

interface KipDashboardConciergeProps {
  progress: Record<string, ProgressRow>;
}

export function KipDashboardConcierge({ progress }: KipDashboardConciergeProps) {
  const profile = useStore($profileStore);

  // 1. Calculate general metric totals to check context
  const totalTasksCompleted = Object.values(progress).filter(
    (p) => p.status === 'completed'
  ).length;

  // 2. Proactive Drift Check: Has the user been inactive for over 7 days?
  const isUserDrifting = () => {
    if (!profile?.updated_at) return false;
    const lastActiveDate = new Date(profile.updated_at);
    const today = new Date();
    const differenceInDays = Math.floor(
      (today.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return differenceInDays >= 7;
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
          <strong className="text-foreground">{totalTasksCompleted}</strong> program goals so far.
        </p>
      </div>

      {/* Proactive Drift Notification Banner */}
      {isUserDrifting() && (
        <div className="p-3 border border-amber-500/20 bg-amber-500/5 rounded-xl space-y-2 animate-in slide-in-from-bottom-2">
          <p className="font-bold text-amber-600 dark:text-amber-400">
            ⏳ Re-engagement Anchor Activated
          </p>
          <p className="text-muted-foreground leading-relaxed">
            It looks like life got in the way and you've been away from your playbook loop for a week. Don't worry—getting distracted is part of the founder sprint. 
          </p>
          <Button size="sm" variant="outline" className="h-7 text-[11px] w-full mt-1">
            🎯 Review My High-Level Project Targets
          </Button>
        </div>
      )}

      {/* General Static Navigation Help Context */}
      <div className="p-3 border rounded-xl bg-muted/20 space-y-1">
        <p className="font-semibold text-foreground">Next Milestone Action:</p>
        <p className="text-muted-foreground leading-relaxed">
          Head into your active Mission overview page to select an uncompleted tactical Quest block and keep building momentum.
        </p>
      </div>
    </div>
  );
}
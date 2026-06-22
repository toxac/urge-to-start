'use client';

import React from 'react';
import { useStore } from '@nanostores/react';
import { $companionFocus } from '@/lib/stores/companionStore';
import { $progressStore} from '@/lib/stores/progressStore';
import { urgePlaybook } from '@/lib/playbook';

// Mode sub-panels
import { KipDashboardConcierge } from './modes/KipDashboardConcierge';
import { KipMissionInspector } from './modes/KipMissionInspector';
import { KipQuestCoach } from './modes/KipQuestCoach';

export function KipSidebarCompanion() {
  const focus = useStore($companionFocus);
  const progress = useStore($progressStore);

  return (
    <aside className="w-80 h-full border-l bg-card flex flex-col overflow-hidden shrink-0 shadow-sm">
      {/* Dynamic Context Header */}
      <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Kip Companion — {focus.pageType}
        </span>
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      {/* Main Panel Content Router */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {focus.pageType === 'dashboard' && (
          <KipDashboardConcierge progress={progress} />
        )}

        {focus.pageType === 'mission' && focus.activeMissionId && (
          <KipMissionInspector 
            mission={urgePlaybook[focus.activeMissionId]} 
            missionId={focus.activeMissionId}
          />
        )}

        {focus.pageType === 'quest' && focus.activeMissionId && focus.activeQuestId && (
          <KipQuestCoach 
            missionId={focus.activeMissionId}
            questId={focus.activeQuestId}
            activeTaskId={focus.activeTaskId}
            progress={progress}
          />
        )}
      </div>
    </aside>
  );
}
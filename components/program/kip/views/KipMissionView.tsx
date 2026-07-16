// components/program/kip/views/KipMissionView.tsx
'use client';

import React from 'react';
import { KipPrerequisiteItem } from '../modules/KipPrerequisiteItem';
import type { Mission } from '@/types/playbook';

interface Props {
  mission: Mission;
  missionId: string;
}

export function KipMissionView({ mission, missionId }: Props) {
  if (!mission) {
    return <p className="text-xs text-muted-foreground">No active mission focus.</p>;
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div>
        <h3 className="text-sm font-bold text-foreground">{mission.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{mission.briefing_text}</p>
      </div>

      {mission.prerequisites && mission.prerequisites.length > 0 && (
        <div className="pt-2 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prerequisites</h4>
          {mission.prerequisites.map((pre, index) => (
            <KipPrerequisiteItem
              key={index}
              item={pre.item}
              promptRawText={pre.promptRawText}
              missionId={missionId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
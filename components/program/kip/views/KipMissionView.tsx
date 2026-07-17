// components/program/kip/views/KipMissionView.tsx
'use client';

import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import type { Mission } from '@/types/playbook';

interface Props {
  mission: Mission;
  missionId: string;
}

export function KipMissionView({ mission, missionId }: Props) {
  if (!mission) {
    return <p className="text-xs text-muted-foreground">No active mission focus.</p>;
  }

  const prerequisites = mission.prerequisites || [];

  return (
    <div className="space-y-4 animate-in fade-in duration-200 text-xs overflow-y-auto max-h-full">
      {/* Mission title & briefing */}
      <div>
        <h3 className="text-sm font-bold text-foreground">{mission.title}</h3>
        <p className="text-muted-foreground mt-1 leading-relaxed">{mission.briefing_text}</p>
      </div>

      {/* Prerequisites as a simple checklist */}
      {prerequisites.length > 0 && (
        <div className="pt-2 space-y-2">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Before you begin
          </h4>
          <ul className="space-y-1.5">
            {prerequisites.map((pre, index) => (
              <li key={index} className="flex items-start gap-2 text-foreground">
                <Circle className="w-3 h-3 mt-0.5 text-muted-foreground shrink-0" />
                <span className="leading-relaxed">{pre.item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
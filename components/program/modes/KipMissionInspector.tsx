'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { executeSidebarConductorAction } from '@/actions/ai';

interface KipMissionInspectorProps {
  mission: any;
  missionId: string;
}

export function KipMissionInspector({ mission, missionId }: KipMissionInspectorProps) {
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [expandedContent, setExpandedContent] = useState<Record<string, string>>({});

  if (!mission) return <p className="text-xs text-muted-foreground">No active mission focus.</p>;

  const handleExplorePrerequisite = async (itemText: string, promptKey: string) => {
    setLoadingKey(promptKey);
    
    // Calls Server Action -> Checks ai_logs cache -> Hits DeepSeek if missing -> Saves to ai_logs
    const result = await executeSidebarConductorAction({
      missionId,
      contextType: 'prerequisite_expansion',
      promptKey,
      userInputText: itemText
    });

    if (result.success && result.data) {
      setExpandedContent(prev => ({
        ...prev,
        [promptKey]: result.data.expandedExplanation || result.data // Structural parsed output
      }));
    }
    setLoadingKey(null);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div>
        <h3 className="text-sm font-bold text-foreground">{mission.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{mission.briefing_text}</p>
      </div>

      <div className="pt-2 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prerequisites</h4>
        
        {mission.prerequisites?.map((pre: any, index: number) => (
          <div key={index} className="p-3 rounded-xl border bg-muted/30 space-y-2 flex flex-col text-xs">
            <p className="font-medium text-foreground leading-relaxed">{pre.item}</p>
            
            {pre.promptKey && !expandedContent[pre.promptKey] && (
              <Button
                size="sm"
                variant="secondary"
                className="h-7 w-max text-[11px]"
                disabled={loadingKey === pre.promptKey}
                onClick={() => handleExplorePrerequisite(pre.item, pre.promptKey)}
              >
                {loadingKey === pre.promptKey ? 'Thinking...' : '💡 How do I manage this?'}
              </Button>
            )}

            {expandedContent[pre.promptKey] && (
              <div className="mt-2 p-2 rounded border bg-background text-muted-foreground leading-relaxed animate-in slide-in-from-top-1 text-[11px]">
                {expandedContent[pre.promptKey]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
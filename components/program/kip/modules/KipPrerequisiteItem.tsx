// components/program/kip/modules/KipPrerequisiteItem.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useKipActions } from '@/hooks/useKipActions';

interface Props {
  item: string;
  promptRawText?: string | null;
  missionId: string;
}

export function KipPrerequisiteItem({ item, promptRawText, missionId }: Props) {
  const { execute, isLoading, error } = useKipActions();
  const [explanation, setExplanation] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const handleExplain = async () => {
    if (expanded) return; // already expanded
    const res = await execute({
      missionId,
      contextType: 'prerequisite_expansion',
      userInputText: item,
      additionalContext: { promptRawText },
    });
    if (res.success && 'data' in res && res.data) {
      // The data could be an object with 'expandedExplanation' or just a string
      const text = res.data.expandedExplanation || res.data;
      setExplanation(text);
      setExpanded(true);
    }
  };

  const toggleExpand = () => {
    if (!explanation) {
      handleExplain();
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <div className="p-3 rounded-xl border bg-muted/30 space-y-2 flex flex-col text-xs">
      <p className="font-medium text-foreground leading-relaxed">{item}</p>
      <Button
        size="sm"
        variant="secondary"
        className="h-7 w-max text-[11px]"
        disabled={isLoading}
        onClick={toggleExpand}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Thinking...
          </>
        ) : expanded ? (
          'Hide explanation'
        ) : (
          '💡 How do I manage this?'
        )}
      </Button>

      {expanded && explanation && (
        <div className="mt-2 p-2 rounded border bg-background text-muted-foreground leading-relaxed animate-in slide-in-from-top-1 text-[11px]">
          {explanation}
        </div>
      )}

      {error && (
        <div className="p-2 text-[10px] text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
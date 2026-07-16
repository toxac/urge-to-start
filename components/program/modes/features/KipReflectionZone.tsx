'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { executeSidebarConductorAction } from '@/actions/ai';

interface Props {
  taskId: string;
  questId: string;
  missionId: string;
  reflectionPrompt?: string;
  onSuccess?: (data: any) => void;
  initialText?: string;
}

export function KipReflectionZone({ taskId, questId, missionId, reflectionPrompt, onSuccess, initialText = '' }: Props) {
  const [text, setText] = useState(initialText);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    const res = await executeSidebarConductorAction({
      taskId,
      questId,
      missionId,
      contextType: 'retrospective_synthesis',
      userInputText: text,
    });
    if (res.success && 'data' in res && res.data) {
      const aiValidation = res.data.validationText || res.data;
      setFeedback(aiValidation);
      onSuccess?.(res.data);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-3.5 border border-emerald-500/20 bg-emerald-500/5 rounded-xl space-y-3">
      {!feedback ? (
        <>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
            <span>📝</span>
            <span>Reflect on your experience</span>
          </div>
          <p className="font-semibold text-foreground leading-relaxed text-[11px]">
            {reflectionPrompt || 'What did you notice through this step?'}
          </p>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
            placeholder="Type your honest notes here..."
            className="text-xs bg-background resize-none h-20 rounded-lg border-border/80 focus-visible:ring-1"
          />
          <Button
            size="sm"
            className="w-full h-8 font-bold text-xs rounded-lg"
            disabled={isLoading || !text.trim()}
            onClick={handleSubmit}
          >
            {isLoading ? 'Saving thoughts...' : 'Submit Notes'}
          </Button>
        </>
      ) : (
        <div className="space-y-2">
          <div className="rounded-xl bg-muted/20 p-3.5 leading-relaxed font-medium text-[11px] border border-border/70">
            <span className="font-bold text-foreground block text-[10px] uppercase tracking-wide text-muted-foreground">
              Kip's Note:
            </span>
            <p className="text-foreground/90 italic">"{feedback}"</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-8 font-bold text-[11px] rounded-lg flex-1 bg-background">
              💾 Save to Diary Archive
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
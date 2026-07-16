// components/program/kip/modules/KipReflectionZone.tsx
'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useKipActions } from '@/hooks/useKipActions';

interface Props {
  taskId: string;
  questId: string;
  missionId: string;
  reflectionPrompt?: string;
  initialText?: string; // if reflection already saved, we show the AI feedback
  initialFeedback?: string; // AI feedback from previous submission
  onSuccess?: (data: any) => void; // called after successful submit with AI feedback
  onBack?: () => void; // to close the reflection zone if needed
}

export function KipReflectionZone({
  taskId,
  questId,
  missionId,
  reflectionPrompt,
  initialText,
  initialFeedback,
  onSuccess,
  onBack,
}: Props) {
  const { execute, isLoading, error } = useKipActions();
  const [text, setText] = useState(initialText || '');
  const [feedback, setFeedback] = useState<string | null>(initialFeedback || null);
  const [submitted, setSubmitted] = useState(!!initialFeedback);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    const res = await execute({
      taskId,
      questId,
      missionId,
      contextType: 'retrospective_synthesis',
      userInputText: text,
    });
    if (res.success && 'data' in res && res.data) {
      const aiValidation = res.data.validationText || res.data;
      setFeedback(aiValidation);
      setSubmitted(true);
      onSuccess?.(res.data);
    }
  };

  if (submitted && feedback) {
    return (
      <div className="space-y-3 animate-in fade-in">
        <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1.5 leading-relaxed font-medium text-[11px] border-border/70">
          <span className="font-bold text-foreground block text-[10px] uppercase tracking-wide text-muted-foreground">
            Kip's Note:
          </span>
          <p className="text-foreground/90 italic">"{feedback}"</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-8 font-bold text-[11px] rounded-lg flex-1 bg-background">
            💾 Save to Diary Archive
          </Button>
          {onBack && (
            <Button size="sm" variant="ghost" className="h-8 font-bold text-[11px] rounded-lg text-primary hover:bg-primary/5" onClick={onBack}>
              Back
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-3.5 border border-emerald-500/20 bg-emerald-500/5 rounded-xl space-y-3">
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
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Saving...
          </>
        ) : (
          'Submit Notes'
        )}
      </Button>
      {error && (
        <div className="p-2 text-[10px] text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
// components/program/kip/modules/KipObservationZone.tsx
'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { useKipActions } from '@/hooks/useKipActions';
import type { ObservationAnalysis } from '@/types/ai-schema';

interface Props {
  taskId: string;
  questId: string;
  missionId: string;
  observationPrompt?: string;
  guideQuestions?: string[];
  analysisPrompt?: string;
  initialAnalysis?: ObservationAnalysis | string | null; // can be string (plain text) or structured
  onAnalysisReceived?: (analysis: ObservationAnalysis | string) => void;
}

export function KipObservationZone({
  taskId,
  questId,
  missionId,
  observationPrompt,
  guideQuestions,
  analysisPrompt,
  initialAnalysis,
  onAnalysisReceived,
}: Props) {
  const { execute, isLoading, error } = useKipActions();
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState<ObservationAnalysis | string | null>(initialAnalysis || null);
  const [submitted, setSubmitted] = useState(!!initialAnalysis);

  const handleSubmit = async () => {
    if (!inputText.trim()) return;
    const res = await execute({
      taskId,
      questId,
      missionId,
      contextType: 'observation_analysis',
      userInputText: inputText,
      additionalContext: {
        analysisPrompt,
        guideQuestions,
      },
    });
    if (res.success && 'data' in res && res.data) {
      const data = res.data;
      setAnalysis(data);
      setSubmitted(true);
      onAnalysisReceived?.(data);
    }
  };

  // Helper to render structured analysis
  const renderAnalysis = (analysis: ObservationAnalysis | string) => {
    if (typeof analysis === 'string') {
      return <div className="whitespace-pre-wrap text-xs leading-relaxed">{analysis}</div>;
    }

    return (
      <div className="space-y-2 text-xs text-foreground/90">
        {analysis.pattern_recognition && (
          <div>
            <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Patterns Noticed</p>
            <p className="mt-0.5">{analysis.pattern_recognition}</p>
          </div>
        )}
        {analysis.deeper_questions && analysis.deeper_questions.length > 0 && (
          <div>
            <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider mt-2">Deeper Questions</p>
            <ul className="mt-0.5 space-y-0.5 list-disc pl-4">
              {analysis.deeper_questions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        )}
        {analysis.potential_opportunities && analysis.potential_opportunities.length > 0 && (
          <div>
            <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider mt-2">Potential Opportunities</p>
            <ul className="mt-0.5 space-y-0.5 list-disc pl-4">
              {analysis.potential_opportunities.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </div>
        )}
        {analysis.encouragement && (
          <div className="mt-2 p-2 bg-emerald-500/10 rounded-lg italic text-emerald-700 dark:text-emerald-300">
            "{analysis.encouragement}"
          </div>
        )}
        {analysis.next_steps && (
          <div className="mt-2 p-2 bg-primary/5 rounded-lg border border-primary/10">
            <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Next Steps</p>
            <p className="mt-0.5">{analysis.next_steps}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {observationPrompt && (
        <div className="p-3.5 border border-primary/20 bg-primary/5 rounded-xl">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Share with Kip for guidance</span>
          </div>
          <p className="text-xs text-foreground mt-1.5 leading-relaxed">{observationPrompt}</p>
        </div>
      )}

      {!submitted ? (
        <div className="space-y-2">
          <Textarea
            placeholder="Share your observations with Kip for analysis..."
            className="text-xs bg-background resize-none h-20 rounded-lg border-border/80 focus-visible:ring-1"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
          />
          <Button
            size="sm"
            className="w-full h-8 font-bold text-xs rounded-lg"
            disabled={isLoading || !inputText.trim()}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Analyzing...
              </>
            ) : (
              '💡 Get Insights'
            )}
          </Button>
        </div>
      ) : (
        <div className="p-3.5 border border-emerald-500/20 bg-emerald-500/5 rounded-xl space-y-3 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Kip's Analysis</span>
          </div>
          {analysis && renderAnalysis(analysis)}
          <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg text-[10px] text-blue-700 dark:text-blue-300">
            ✅ Observation analyzed. Now complete the task using the form on the main page to officially log your progress.
          </div>
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
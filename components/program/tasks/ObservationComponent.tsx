// components/program/tasks/ObservationComponent.tsx

'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Download, FileText, CheckCircle2 } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';

interface ObservationComponentProps {
  taskId: string;
  userId: string;
  existingProgress?: {
    id: string;
    status: 'not_started' | 'in_progress' | 'completed' | string;
    saved_payload?: any;
  };
  onSuccess?: () => void;
  observationConfig?: {
    pdf_url?: string;
    guide_questions?: string[];
    min_observations?: number;
    observation_period_days?: number;
    description?: string;
  };
}

export function ObservationComponent({
  taskId,
  userId,
  existingProgress,
  onSuccess,
  observationConfig
}: ObservationComponentProps) {
  const [observationText, setObservationText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isInitiallyCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  // Handle saving observations
  const handleSaveObservations = useCallback(async () => {
    if (!observationText.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const progressSync = await completeTaskExecution({
        taskId,
        savedPayload: {
          observationText: observationText.trim(),
          guideQuestions: observationConfig?.guide_questions,
          minObservations: observationConfig?.min_observations,
          observationPeriodDays: observationConfig?.observation_period_days,
          observationPrompt: observationConfig?.description
        }
      });

      if (progressSync.success) {
        if (progressSync.data) {
          setProgressStoreRow(progressSync.data as any);
        }
        if (onSuccess) onSuccess();
      } else {
        // TypeScript now knows this is the error variant
        setErrorMessage(progressSync.error || 'Failed to save your observations');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong saving your observations');
    } finally {
      setIsSubmitting(false);
    }
  }, [observationText, taskId, observationConfig, onSuccess]);

  // Handle PDF download
  const handleDownloadPDF = useCallback(() => {
    if (observationConfig?.pdf_url) {
      window.open(observationConfig.pdf_url, '_blank');
    }
  }, [observationConfig?.pdf_url]);

  // If already completed, show read-only view
  if (isInitiallyCompleted) {
    return (
      <div className="w-full space-y-4 border rounded-xl p-5 bg-emerald-50/20 border-emerald-500/10">
        <div className="w-full flex items-center justify-between pb-2 border-b border-dashed border-emerald-500/20">
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            Observation Complete
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            ✓ Logged
          </span>
        </div>

        {preSavedPayload.observationText && (
          <div className="p-3 rounded-lg bg-muted/10 border border-border/50">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              Your Observations
            </p>
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {preSavedPayload.observationText}
            </p>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onSuccess}
        >
          Back to Quest
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {errorMessage && (
        <div className="w-full p-4 border rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Description */}
      {observationConfig?.description && (
        <div className="w-full p-4 border rounded-xl bg-muted/5">
          <p className="text-sm text-foreground leading-relaxed">
            {observationConfig.description}
          </p>
        </div>
      )}

      {/* PDF Download Section */}
      {observationConfig?.pdf_url && (
        <div className="w-full p-4 border rounded-xl bg-muted/10">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-sm text-foreground">Observation Worksheet</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Download this PDF to guide your observations
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2 h-9"
              onClick={handleDownloadPDF}
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </Button>
          </div>
        </div>
      )}

      {/* Guide Questions */}
      {observationConfig?.guide_questions && observationConfig.guide_questions.length > 0 && (
        <div className="w-full p-4 border rounded-xl bg-muted/5">
          <h4 className="font-semibold text-sm text-foreground mb-2">Questions to Consider</h4>
          <ul className="space-y-1.5">
            {observationConfig.guide_questions.map((question: string, idx: number) => (
              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{question}</span>
              </li>
            ))}
          </ul>
          {observationConfig.min_observations && (
            <p className="text-xs text-muted-foreground mt-2">
              Aim for at least {observationConfig.min_observations} observations
            </p>
          )}
          {observationConfig.observation_period_days && (
            <p className="text-xs text-muted-foreground">
              Take {observationConfig.observation_period_days} days for this
            </p>
          )}
        </div>
      )}

      {/* Input Area - Just the task input */}
      <div className="w-full space-y-3">
        <Label className="text-sm font-semibold text-foreground">
          Record Your Observations
        </Label>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Write down what you observed. You can also share this with Kip in the sidebar for guidance.
        </p>
        <Textarea
          placeholder="Type your observations here..."
          className="min-h-[150px] resize-none text-sm"
          value={observationText}
          onChange={(e) => setObservationText(e.target.value)}
          disabled={isSubmitting}
        />
        <Button
          className="w-full h-11 text-sm font-semibold"
          disabled={isSubmitting || !observationText.trim()}
          onClick={handleSaveObservations}
        >
          {isSubmitting ? (
            'Saving...'
          ) : (
            'Save Observations'
          )}
        </Button>
      </div>
    </div>
  );
}
// components/program/tasks/ObservationComponent.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Download, FileText, CheckCircle2, Plus, Eye } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { BaseTaskComponentProps } from './types';

export function ObservationComponent({ 
  task, 
  userId, 
  existingProgress, 
  onSuccess 
}: BaseTaskComponentProps) {
  const [observationText, setObservationText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAddingMore, setIsAddingMore] = useState(false);

  const observationConfig = task.observation_config;

  const isInitiallyCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};
  const hasSavedObservation = !!preSavedPayload.observationText;
  const showConfigView = !hasSavedObservation || isAddingMore;

  const handleSaveObservations = useCallback(async () => {
    if (!observationText.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const existingPayload = existingProgress?.saved_payload || {};
      
      const progressSync = await completeTaskExecution({
        taskId: task.id,
        savedPayload: {
          ...existingPayload,
          observationText: observationText.trim(),
          guideQuestions: observationConfig?.guide_questions,
          minObservations: observationConfig?.min_observations,
          observationPeriodDays: observationConfig?.observation_period_days,
          observationPrompt: observationConfig?.description,
          updatedAt: new Date().toISOString()
        }
      });

      if (progressSync.success) {
        if (progressSync.data) {
          setProgressStoreRow(progressSync.data as any);
        }
        setIsAddingMore(false);
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(progressSync.error || 'Failed to save your observations');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong saving your observations');
    } finally {
      setIsSubmitting(false);
    }
  }, [observationText, task.id, observationConfig, onSuccess, existingProgress]);

  const handleDownloadPDF = useCallback(() => {
    if (observationConfig?.pdf_url) {
      window.open(observationConfig.pdf_url, '_blank');
    }
  }, [observationConfig?.pdf_url]);

  if (hasSavedObservation && !showConfigView) {
    return (
      <div className="w-full space-y-4">
        {errorMessage && (
          <div className="w-full p-4 border rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
            ⚠️ {errorMessage}
          </div>
        )}

        <div className="w-full border rounded-xl p-5 bg-emerald-50/20 border-emerald-500/10">
          <div className="flex items-center justify-between pb-3 border-b border-dashed border-emerald-500/20">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-600">Observations Saved</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-muted-foreground">
                {preSavedPayload.minObservations || 0} observations
              </span>
              {preSavedPayload.observationPeriodDays && (
                <span className="text-[10px] font-medium text-muted-foreground">
                  · {preSavedPayload.observationPeriodDays} days
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-background border border-border/50">
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {preSavedPayload.observationText}
            </p>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-9 flex-1"
              onClick={() => {
                setObservationText(preSavedPayload.observationText || '');
                setIsAddingMore(true);
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              Add More Observations
            </Button>
            <Button size="sm" className="gap-2 h-9 flex-1" onClick={onSuccess}>
              <Eye className="w-3.5 h-3.5" />
              Back to Quest
            </Button>
          </div>
        </div>
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

      {isAddingMore && (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 h-7 text-xs"
          onClick={() => {
            setIsAddingMore(false);
            setObservationText('');
          }}
        >
          ← Back to Saved Observations
        </Button>
      )}

      {observationConfig?.description && (
        <div className="w-full p-4 border rounded-xl bg-muted/5">
          <p className="text-sm text-foreground leading-relaxed">
            {observationConfig.description}
          </p>
        </div>
      )}

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

      <div className="w-full space-y-3">
        <Label className="text-sm font-semibold text-foreground">
          {hasSavedObservation ? 'Add More Observations' : 'Record Your Observations'}
        </Label>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {hasSavedObservation 
            ? 'Add to your existing observations. You can also review what you previously wrote above.'
            : 'Write down what you observed. You can also share this with Kip in the sidebar for guidance.'
          }
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
          ) : hasSavedObservation ? (
            'Add to Observations'
          ) : (
            'Save Observations'
          )}
        </Button>
      </div>
    </div>
  );
}
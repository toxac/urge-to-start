// components/program/tasks/ObservationNotepad.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, X, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { BaseTaskComponentProps } from './types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function ObservationNotepad({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [observations, setObservations] = useState<string[]>(
    existingProgress?.saved_payload?.observations || []
  );
  const [currentObservation, setCurrentObservation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  // ⚡ Get config from task
  const config = task.observation_config;
  const briefingText = config?.briefing_text || task.description || '';
  const guideQuestions = config?.guide_questions || [];
  const minObservations = config?.min_observations || 1;
  const observationPeriodDays = config?.observation_period_days || 0;

  const handleAddObservation = () => {
    if (!currentObservation.trim()) return;
    setObservations([...observations, currentObservation.trim()]);
    setCurrentObservation('');
  };

  const handleRemoveObservation = (index: number) => {
    setObservations(observations.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (observations.length < minObservations) {
      toast.error(`Please add at least ${minObservations} observation${minObservations > 1 ? 's' : ''}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const progressSync = await completeTaskExecution({
        taskId: task.id,
        savedPayload: {
          observations,
          minObservations,
          days: observationPeriodDays,
          completedAt: new Date().toISOString()
        }
      });

      if (progressSync.success) {
        if (progressSync.data) {
          setProgressStoreRow(progressSync.data as any);
        }
        if (onSuccess) onSuccess();
        toast.success(`✅ Saved ${observations.length} observation${observations.length > 1 ? 's' : ''}!`);
      } else {
        toast.error(progressSync.error || 'Failed to save observations');
      }
    } catch (err) {
      toast.error('Something went wrong saving your observations');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── READ-ONLY VIEW ───
  if (isCompleted) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center gap-2 text-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Observations Complete</span>
          <span className="text-sm text-muted-foreground">
            ({observations.length} observation{observations.length > 1 ? 's' : ''})
          </span>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            View Your Observations
          </button>
          
          {!isCollapsed && (
            <div className="space-y-1.5 pl-6">
              {observations.map((obs, i) => (
                <div key={i} className="p-3 border rounded-lg bg-muted/10 text-sm">
                  {obs}
                </div>
              ))}
            </div>
          )}
        </div>

        <Button variant="outline" onClick={onSuccess} className="w-full">
          Back to Quest
        </Button>
      </div>
    );
  }

  // ─── EDIT VIEW ───
  return (
    <div className="w-full space-y-6">
      {/* Briefing */}
      {briefingText && (
        <div className="space-y-2">
          <p className="text-sm text-foreground/90 leading-relaxed">{briefingText}</p>
          {observationPeriodDays > 0 && (
            <p className="text-xs text-muted-foreground">
              Take {observationPeriodDays} days for this
            </p>
          )}
        </div>
      )}

      {/* Guide Questions */}
      {guideQuestions.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Questions to consider
          </p>
          <ul className="space-y-1">
            {guideQuestions.map((q, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Input Area */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Textarea
            value={currentObservation}
            onChange={(e) => setCurrentObservation(e.target.value)}
            placeholder="Write your observation here..."
            className="min-h-[80px] resize-none flex-1"
          />
        </div>
        <Button 
          onClick={handleAddObservation} 
          disabled={!currentObservation.trim()}
          size="sm"
        >
          Add Observation
        </Button>
      </div>

      {/* Observations List */}
      {observations.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Your Observations ({observations.length})
              {minObservations > 0 && (
                <span className="text-xs text-muted-foreground font-normal ml-2">
                  (minimum {minObservations})
                </span>
              )}
            </p>
            {observations.length >= minObservations && (
              <span className="text-xs text-emerald-600 font-medium">
                ✓ Ready to save
              </span>
            )}
          </div>
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {observations.map((obs, i) => (
              <div 
                key={i} 
                className="flex items-start gap-2 p-3 border rounded-lg bg-muted/5 hover:bg-muted/10 transition-colors group"
              >
                <span className="text-sm flex-1 leading-relaxed">{obs}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveObservation(i)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="pt-2 border-t">
        <Button
          onClick={handleSave}
          disabled={isSubmitting || observations.length < minObservations}
          className="w-full h-11 text-sm font-semibold"
        >
          {isSubmitting 
            ? 'Saving...' 
            : observations.length < minObservations
              ? `Add ${minObservations - observations.length} more observation${minObservations - observations.length > 1 ? 's' : ''} to save`
              : `Save & Earn ${task.grant_points} XP`
          }
        </Button>
        {observations.length > 0 && observations.length < minObservations && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            {minObservations - observations.length} more observation{minObservations - observations.length > 1 ? 's' : ''} needed
          </p>
        )}
      </div>
    </div>
  );
}
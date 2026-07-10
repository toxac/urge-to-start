// components/program/tasks/opportunity/ObservationNotepad.tsx

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, X, Plus, FileText, CheckCircle2 } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { BaseTaskComponentProps } from './types';
import { toast } from 'sonner';

export function ObservationNotepad({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [currentObservation, setCurrentObservation] = useState('');
  
  // Load saved observations from existing progress
  const preSavedPayload = existingProgress?.saved_payload || {};
  const [observations, setObservations] = useState<string[]>(preSavedPayload.observations || []);
  
  const isCompleted = existingProgress?.status === 'completed';
  
  // Get config from task
  const config = task.observation_config;
  const briefingText = config?.briefing_text || task.description || '';
  const guideQuestions = config?.guide_questions || [];
  const minObservations = config?.min_observations || 1;
  const days = config?.observation_period_days || 3;
  const sourceType = task.metadata_config?.source_type || 'personal_problems';

  const handleAddObservation = () => {
    if (!currentObservation.trim()) {
      toast.error('Please write something before adding.');
      return;
    }
    setObservations([...observations, currentObservation.trim()]);
    setCurrentObservation('');
  };

  const handleRemoveObservation = (index: number) => {
    setObservations(observations.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddObservation();
    }
  };

  const handleSave = async () => {
    if (observations.length === 0) {
      toast.error('Please add at least one observation before saving.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await completeTaskExecution({
        taskId: task.id,
        savedPayload: { 
          observations,
          minObservations,
          days,
          sourceType,
          completedAt: new Date().toISOString()
        }
      });

      if (result.success) {
        if (result.data) {
          setProgressStoreRow(result.data as any);
        }
        if (onSuccess) onSuccess();
        toast.success(`Saved ${observations.length} observation${observations.length > 1 ? 's' : ''}!`);
      } else {
        toast.error(result.error || 'Failed to save observations');
      }
    } catch (err) {
      toast.error('Something went wrong saving your observations');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already completed, show read-only view
  if (isCompleted) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-emerald-600 border-b pb-3">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Observation Complete</span>
          <span className="text-xs text-muted-foreground ml-auto">+{task.grant_points} XP earned</span>
        </div>
        
        {observations.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {observations.length} observation{observations.length > 1 ? 's' : ''} recorded
            </p>
            <div className="space-y-2">
              {observations.map((obs, i) => (
                <div key={i} className="p-3 border rounded-lg bg-muted/5 text-sm">
                  {obs}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <Button variant="outline" onClick={onSuccess} className="w-full">
          Back to Quest
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Briefing Section */}
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">{briefingText}</p>
          <p className="text-xs text-muted-foreground">
            Recommended: at least {minObservations} observations over {days} days
          </p>
        </div>

        {/* Guide Questions */}
        {guideQuestions.length > 0 && (
          <div className="p-3 border rounded-lg bg-muted/5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
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
      </div>

      {/* Observations List (Collapsible) */}
      {observations.length > 0 && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg">
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-between p-4 h-auto hover:bg-muted/5"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Your Observations ({observations.length})
                {observations.length < minObservations && (
                  <span className="text-xs text-amber-600 font-normal">
                    ({minObservations - observations.length} more recommended)
                  </span>
                )}
              </span>
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4 space-y-2">
            {observations.map((obs, i) => (
              <div key={i} className="flex items-start gap-2 p-2 border rounded-lg bg-background group">
                <span className="text-xs font-medium text-muted-foreground w-5 mt-0.5">
                  {i + 1}.
                </span>
                <span className="text-sm flex-1">{obs}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveObservation(i)}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Add Observation Form */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="observation" className="text-sm font-medium">
            Add Observation
          </Label>
          <Textarea
            id="observation"
            value={currentObservation}
            onChange={(e) => setCurrentObservation(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your observation here..."
            className="min-h-[80px] resize-none text-sm"
            disabled={isSubmitting}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{currentObservation.length} characters</span>
            <span>Press Enter to add, Shift+Enter for new line</span>
          </div>
        </div>

        <Button 
          onClick={handleAddObservation} 
          disabled={!currentObservation.trim() || isSubmitting}
          variant="outline"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Observation
        </Button>
      </div>

      {/* Save & Complete */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {observations.length > 0 
              ? `${observations.length} observation${observations.length > 1 ? 's' : ''} saved`
              : 'No observations yet'
            }
          </span>
          {observations.length > 0 && observations.length < minObservations && (
            <span className="text-xs text-amber-600">
              {minObservations - observations.length} more recommended
            </span>
          )}
        </div>

        <Button
          onClick={handleSave}
          disabled={isSubmitting || observations.length === 0}
          className="w-full h-11 text-sm font-semibold"
        >
          {isSubmitting ? (
            'Saving...'
          ) : (
            `Save Observations & Earn ${task.grant_points} XP`
          )}
        </Button>
        
        {observations.length === 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Add at least one observation to save and complete this task
          </p>
        )}
      </div>
    </div>
  );
}
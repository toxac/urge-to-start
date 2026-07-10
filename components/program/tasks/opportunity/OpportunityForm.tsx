// components/program/tasks/opportunity/OpportunityForm.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useStore } from '@nanostores/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle2, 
  X, 
  ChevronDown, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { $progressStore } from '@/lib/stores/progressStore';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';
import { createOpportunity } from '@/actions/opportunities';
import { cn } from '@/lib/utils';

interface OpportunityFormInputs {
  title: string;
  description: string;
  source_notes: string;
  skill_alignment?: string;
  personal_context?: string;
  person_observed?: string;
  relationship_context?: string;
  research_source?: string;
  research_url?: string;
}

export function OpportunityForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedObservation, setSelectedObservation] = useState<string | null>(null);
  const [createdOpportunityIds, setCreatedOpportunityIds] = useState<string[]>(
    existingProgress?.saved_payload?.opportunity_ids || []
  );
  const [showObservations, setShowObservations] = useState(true);
  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const sourceType = task.metadata_config?.source_type || 'personal_problems';
  const sourceContext = task.metadata_config?.source_context || '';
  const dependencies = task.metadata_config?.dependencies || [];

  const progressStore = useStore($progressStore);

  const dependencyObservations = useMemo(() => {
    const allObservations: { taskId: string; observations: string[] }[] = [];
    
    for (const depId of dependencies) {
      const progress = progressStore[depId];
      if (progress?.saved_payload?.observations?.length > 0) {
        allObservations.push({
          taskId: depId,
          observations: progress.saved_payload.observations
        });
      }
    }
    
    return allObservations;
  }, [dependencies, progressStore]);

  const allObservations = useMemo(() => {
    const flat: string[] = [];
    for (const dep of dependencyObservations) {
      flat.push(...dep.observations);
    }
    return flat;
  }, [dependencyObservations]);

  const hasObservations = allObservations.length > 0;

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<OpportunityFormInputs>({
    defaultValues: {
      title: preSavedPayload.title || '',
      description: preSavedPayload.description || '',
      source_notes: preSavedPayload.source_notes || '',
      skill_alignment: preSavedPayload.skill_alignment || '',
      personal_context: preSavedPayload.personal_context || '',
      person_observed: preSavedPayload.person_observed || '',
      relationship_context: preSavedPayload.relationship_context || '',
      research_source: preSavedPayload.research_source || '',
      research_url: preSavedPayload.research_url || '',
    }
  });

  const handleSelectObservation = (obs: string) => {
    setSelectedObservation(obs);
    const title = obs.length > 80 ? obs.substring(0, 80) + '...' : obs;
    setValue('title', title);
    setValue('description', obs);
    setValue('source_notes', `From observation: "${obs}"`);
  };

  const handleClearSelection = () => {
    setSelectedObservation(null);
    setValue('title', '');
    setValue('description', '');
    setValue('source_notes', '');
  };

  const renderSourceTypeFields = () => {
    switch (sourceType) {
      case 'personal_problems':
        return (
          <>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Skill Alignment
                <p className="text-xs font-normal text-muted-foreground">
                  How does this problem connect to your skills?
                </p>
              </Label>
              <Textarea
                {...register('skill_alignment')}
                placeholder="e.g., I'm good at organizing and this problem is about inefficiency..."
                className="min-h-[60px] resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Personal Context
                <p className="text-xs font-normal text-muted-foreground">
                  When and where does this problem affect you?
                </p>
              </Label>
              <Textarea
                {...register('personal_context')}
                placeholder="e.g., This happens every Sunday when I do paperwork..."
                className="min-h-[60px] resize-none"
              />
            </div>
          </>
        );

      case 'zone_of_influence':
        return (
          <>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Who Experienced This?
                <p className="text-xs font-normal text-muted-foreground">
                  Which person in your circle experienced this problem?
                </p>
              </Label>
              <Input
                {...register('person_observed')}
                placeholder="e.g., My friend Sarah, my colleague John..."
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Relationship Context
                <p className="text-xs font-normal text-muted-foreground">
                  How do you know this person? What's their background?
                </p>
              </Label>
              <Textarea
                {...register('relationship_context')}
                placeholder="e.g., Sarah runs a small bakery and struggles with..."
                className="min-h-[60px] resize-none"
              />
            </div>
          </>
        );

      case 'broader_search':
        return (
          <>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Research Source
                <p className="text-xs font-normal text-muted-foreground">
                  Where did you find this problem?
                </p>
              </Label>
              <select
                {...register('research_source')}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select a source...</option>
                <option value="google_trends">Google Trends</option>
                <option value="reddit">Reddit</option>
                <option value="facebook">Facebook Groups</option>
                <option value="linkedin">LinkedIn</option>
                <option value="amazon">Amazon Reviews</option>
                <option value="etsy">Etsy</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Source URL
                <p className="text-xs font-normal text-muted-foreground">
                  Link to the source (optional)
                </p>
              </Label>
              <Input
                {...register('research_url')}
                type="url"
                placeholder="https://..."
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  // ⚡ Fixed: Match the action's schema exactly
  const onSubmit = async (data: OpportunityFormInputs) => {
    setIsSubmitting(true);
    try {
      const captureMetadata: Record<string, any> = {
        source_notes: data.source_notes,
        source_observation: selectedObservation || null,
        created_from_task: task.id,
        created_from_quest: task.quest_id,
        source_type: sourceType,
      };

      switch (sourceType) {
        case 'personal_problems':
          captureMetadata.skill_alignment = data.skill_alignment;
          captureMetadata.personal_context = data.personal_context;
          break;
        case 'zone_of_influence':
          captureMetadata.person_observed = data.person_observed;
          captureMetadata.relationship_context = data.relationship_context;
          break;
        case 'broader_search':
          captureMetadata.research_source = data.research_source;
          captureMetadata.research_url = data.research_url;
          break;
      }

      // ⚡ Call createOpportunity with the exact schema it expects
      const result = await createOpportunity({
        title: data.title,
        description: data.description,
        source_type: sourceType as any,
        capture_metadata: captureMetadata,
        validation_interviews: {},
        scores: null,
      });

      if (!result.success) {
        toast.error(result.error || 'Failed to save opportunity');
        return;
      }

      const newIds = [...createdOpportunityIds, result.data.id];
      setCreatedOpportunityIds(newIds);

      const progressSync = await completeTaskExecution({
        taskId: task.id,
        savedPayload: {
          ...data,
          opportunity_ids: newIds,
          sourceType,
          selectedObservation,
          lastCreated: new Date().toISOString()
        }
      });

      if (!progressSync.success) {
        toast.error('Opportunity saved but progress update failed');
        return;
      }

      if (progressSync.data) {
        setProgressStoreRow(progressSync.data as any);
      }

      setValue('title', '');
      setValue('description', '');
      setValue('source_notes', '');
      
      toast.success(`✅ Opportunity "${data.title}" saved!`);
      
    } catch (err) {
      toast.error('Something went wrong saving your opportunity');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkComplete = async () => {
    if (createdOpportunityIds.length === 0) {
      toast.error('Please add at least one opportunity before completing');
      return;
    }

    setIsSubmitting(true);
    try {
      const progressSync = await completeTaskExecution({
        taskId: task.id,
        savedPayload: {
          ...preSavedPayload,
          opportunity_ids: createdOpportunityIds,
          completedAt: new Date().toISOString(),
          isComplete: true
        }
      });

      if (progressSync.success) {
        if (progressSync.data) {
          setProgressStoreRow(progressSync.data as any);
        }
        if (onSuccess) onSuccess();
        toast.success(`✅ Task complete! You created ${createdOpportunityIds.length} opportunities`);
      } else {
        toast.error(progressSync.error || 'Failed to complete task');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center gap-2 text-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Task Complete</span>
          <span className="text-sm text-muted-foreground">
            ({createdOpportunityIds.length} opportunity{createdOpportunityIds.length > 1 ? 's' : ''} created)
          </span>
        </div>
        
        <div className="p-4 border rounded-xl bg-muted/5">
          <p className="text-sm text-muted-foreground">
            You created {createdOpportunityIds.length} opportunity{createdOpportunityIds.length > 1 ? 's' : ''}.
            They're now in your opportunity list for review.
          </p>
        </div>

        <Button variant="outline" onClick={onSuccess} className="w-full">
          Back to Quest
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {sourceContext && (
        <div className="p-4 border rounded-xl bg-muted/10 text-sm leading-relaxed">
          {sourceContext}
        </div>
      )}

      {dependencies.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => setShowObservations(!showObservations)}
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            {showObservations ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            {hasObservations ? (
              <span>Your Observations ({allObservations.length})</span>
            ) : (
              <span className="text-muted-foreground">No observations found</span>
            )}
          </button>

          {showObservations && (
            <div className="space-y-2">
              {!hasObservations ? (
                <div className="p-4 border border-dashed rounded-xl text-center text-sm text-muted-foreground">
                  Complete the observation tasks first to see them here.
                  <p className="text-xs mt-1">
                    {dependencies.map((depId: string, i: number) => (
                      <span key={depId}>
                        {i > 0 && ', '}
                        <span className="font-mono">{depId}</span>
                      </span>
                    ))}
                  </p>
                </div>
              ) : (
                <>
                  {dependencyObservations.map((dep) => (
                    <div key={dep.taskId} className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground">
                        From {dep.taskId} ({dep.observations.length})
                      </p>
                      <div className="space-y-1.5 pl-2">
                        {dep.observations.map((obs, idx) => {
                          const isSelected = selectedObservation === obs;
                          return (
                            <button
                              key={idx}
                              onClick={() => handleSelectObservation(obs)}
                              className={cn(
                                "w-full text-left p-3 border rounded-lg text-sm transition-all",
                                isSelected
                                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                                  : "border-border hover:border-primary/50 hover:bg-muted/5"
                              )}
                            >
                              <div className="flex items-start gap-2">
                                <span className="flex-1 leading-relaxed">{obs}</span>
                                {isSelected && (
                                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {selectedObservation && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground flex-1">
                        Selected observation — form pre-filled below
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearSelection}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Opportunity Title *
          </Label>
          <Input
            {...register('title', { required: 'Title is required' })}
            placeholder="e.g., Small business owners struggle with bookkeeping"
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Description *
            <p className="text-xs font-normal text-muted-foreground">
              Describe the problem in detail. Who experiences it? When? How often?
            </p>
          </Label>
          <Textarea
            {...register('description', { required: 'Description is required', minLength: 10 })}
            placeholder="Describe the problem in detail..."
            className="min-h-[100px] resize-none"
          />
          {errors.description && (
            <p className="text-xs text-destructive">{errors.description.message}</p>
          )}
        </div>

        {renderSourceTypeFields()}

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Source Notes
            <p className="text-xs font-normal text-muted-foreground">
              Any additional context about how you discovered this opportunity.
            </p>
          </Label>
          <Textarea
            {...register('source_notes')}
            placeholder="Add any notes about how you discovered this..."
            className="min-h-[60px] resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 h-11"
          >
            {isSubmitting ? 'Saving...' : 'Add Opportunity'}
          </Button>
        </div>
      </form>

      {createdOpportunityIds.length > 0 && (
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {createdOpportunityIds.length} opportunity{createdOpportunityIds.length > 1 ? 's' : ''} created so far
            </p>
            <span className="text-xs text-emerald-600 font-medium">
              ✓ Saved to your list
            </span>
          </div>
          <Button
            onClick={handleMarkComplete}
            disabled={isSubmitting}
            variant="outline"
            className="w-full h-11"
          >
            {isSubmitting ? 'Saving...' : `I've added all my opportunities (+${task.grant_points} XP)`}
          </Button>
        </div>
      )}
    </div>
  );
}
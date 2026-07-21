// components/program/tasks/project/FinalViabilityForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Flag } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection, updateProject } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface FinalViabilityData {
  decision: string;
  decision_notes: string;
  what_would_make_it_viable: string;
  next_steps: string;
}

export function FinalViabilityForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FinalViabilityData>({
    defaultValues: {
      decision: preSavedPayload.decision || 'pending',
      decision_notes: preSavedPayload.decision_notes || '',
      what_would_make_it_viable: preSavedPayload.what_would_make_it_viable || '',
      next_steps: preSavedPayload.next_steps || '',
    }
  });

  const decision = watch('decision');

  useEffect(() => {
    async function loadProject() {
      setIsLoading(true);
      try {
        const result = await getCurrentProject();
        if (result.success && result.data) {
          setProjectId(result.data.id);
        }
      } catch (err) {
        toast.error('Failed to load project data');
      } finally {
        setIsLoading(false);
      }
    }
    loadProject();
  }, [userId]);

  const onSubmit = async (data: FinalViabilityData) => {
    setIsSubmitting(true);
    try {
      const viabilityData = {
        final: {
          decision: data.decision,
          decision_notes: data.decision_notes,
          what_would_make_it_viable: data.what_would_make_it_viable,
          next_steps: data.next_steps,
          decided_at: new Date().toISOString()
        }
      };

      if (projectId) {
        const currentProject = await getCurrentProject();
        let existingViability = {};
        if (currentProject.success && currentProject.data) {
          existingViability = (currentProject.data.viability_check as any) || {};
        }
        
        const projectResult = await updateProjectSection(projectId, 'viability_check', {
          ...existingViability,
          ...viabilityData
        });
        
        if (!projectResult.success) {
          toast.error(projectResult.error || 'Failed to save project data');
          return;
        }

        if (data.decision === 'viable') {
          const statusResult = await updateProject(projectId, {
            status: 'planning',
            current_mission: '4'
          });
          if (!statusResult.success) {
            toast.warning('Project saved but status update failed');
          }
        } else if (data.decision === 'not_viable') {
          const statusResult = await updateProject(projectId, {
            status: 'ideation',
            current_mission: '2'
          });
          if (!statusResult.success) {
            toast.warning('Project saved but status update failed');
          }
        }
      } else {
        toast.error('No active project found.');
        return;
      }

      const progressSync = await completeTaskExecution({
        taskId: task.id,
        savedPayload: data
      });

      if (progressSync.success) {
        if (progressSync.data) setProgressStoreRow(progressSync.data as any);
        if (onSuccess) onSuccess();
        
        if (data.decision === 'viable') {
          toast.success('✅ Project is viable! Moving to Mission 4!');
        } else if (data.decision === 'not_viable') {
          toast.info('🔄 Project needs rethinking. Go back to Mission 2.');
        } else {
          toast.success('✅ Decision saved!');
        }
      } else {
        toast.error(progressSync.error || 'Failed to save progress');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    const decisionLabel = preSavedPayload.decision === 'viable' 
      ? 'Viable ✅' 
      : preSavedPayload.decision === 'not_viable' 
        ? 'Not Viable ❌' 
        : 'Pending Review';
    
    return (
      <div className="w-full space-y-4">
        <div className={`flex items-center gap-2 ${
          preSavedPayload.decision === 'viable' 
            ? 'text-emerald-600' 
            : preSavedPayload.decision === 'not_viable' 
              ? 'text-destructive' 
              : 'text-amber-600'
        }`}>
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Final Decision: {decisionLabel}</span>
        </div>
        <div className="p-4 border rounded-xl bg-muted/5">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {preSavedPayload.decision_notes || 'No notes provided.'}
          </p>
        </div>
        <Button variant="outline" onClick={onSuccess} className="w-full">
          Back to Quest
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Flag className="w-5 h-5 text-primary" />
          <h4 className="font-medium">The Final Viability Check</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Look at everything: Customers, competition, permissions, solution, numbers, timeline. 
          Does this work? Are you excited? Is it worth doing?
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Your Final Decision *
          </Label>
          <div className="space-y-2">
            {[
              { value: 'viable', label: '✅ Viable - Let\'s move forward!', description: 'The project is viable and you\'re excited to proceed.' },
              { value: 'not_viable', label: '❌ Not Viable - Go back to Mission 2', description: 'The project isn\'t viable right now. Go back to Mission 2 and pick a different opportunity.' },
              { value: 'needs_more', label: '🤔 Needs More Validation', description: 'You need more data or validation before making a final decision.' },
            ].map((option) => (
              <label key={option.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/20 transition">
                <input
                  type="radio"
                  value={option.value}
                  {...register('decision', { required: 'Please make a decision' })}
                  className="mt-1 h-4 w-4 flex-shrink-0 text-primary"
                />
                <div>
                  <div className="text-sm font-medium text-foreground">{option.label}</div>
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.decision && <p className="text-xs text-destructive">{errors.decision.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Decision Notes *
            <p className="text-xs font-normal text-muted-foreground">
              Why did you make this decision? What factors influenced you most?
            </p>
          </Label>
          <Textarea
            {...register('decision_notes', { required: 'Decision notes are required', minLength: 10 })}
            placeholder="e.g., I believe this is viable because I have 5 paying customers waiting..."
            className="min-h-[100px] resize-none"
          />
          {errors.decision_notes && <p className="text-xs text-destructive">{errors.decision_notes.message}</p>}
        </div>

        {/* ⚡ FIXED: Conditional rendering using `decision` variable */}
        {decision === 'not_viable' && (
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              What Would Make It Viable?
              <p className="text-xs font-normal text-muted-foreground">
                What would need to change for this to become a viable project?
              </p>
            </Label>
            <Textarea
              {...register('what_would_make_it_viable')}
              placeholder="e.g., I'd need to find more customers, reduce costs, or partner with someone..."
              className="min-h-[80px] resize-none"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Next Steps
            <p className="text-xs font-normal text-muted-foreground">
              What's the very next thing you'll do?
            </p>
          </Label>
          <Textarea
            {...register('next_steps')}
            placeholder="e.g., Start building the MVP, talk to 5 more customers, refine the pricing..."
            className="min-h-[80px] resize-none"
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full h-11">
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {isSubmitting ? 'Saving...' : `Save & Earn ${task.grant_points} XP`}
      </Button>
    </form>
  );
}
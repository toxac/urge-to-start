// components/program/tasks/project/FirstMilestoneForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Flag } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface FirstMilestoneData {
  milestone_description: string;
  target_date: string;
  success_criteria: string;
  blockers: string;
}

export function FirstMilestoneForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<FirstMilestoneData>({
    defaultValues: {
      milestone_description: preSavedPayload.milestone_description || '',
      target_date: preSavedPayload.target_date || '',
      success_criteria: preSavedPayload.success_criteria || '',
      blockers: preSavedPayload.blockers || '',
    }
  });

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

  const onSubmit = async (data: FirstMilestoneData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        build_data: {
          first_milestone: {
            description: data.milestone_description,
            target_date: data.target_date,
            success_criteria: data.success_criteria,
            blockers: data.blockers,
            set_at: new Date().toISOString()
          }
        }
      };

      if (projectId) {
        const currentProject = await getCurrentProject();
        let existingBuild = {};
        if (currentProject.success && currentProject.data) {
          existingBuild = (currentProject.data.build_data as any) || {};
        }
        const projectResult = await updateProjectSection(projectId, 'build_data', {
          ...existingBuild,
          ...payload.build_data
        });
        if (!projectResult.success) {
          toast.error(projectResult.error || 'Failed to save project data');
          return;
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
        toast.success('✅ First milestone set!');
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
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center gap-2 text-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">First Milestone Set</span>
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
          <h4 className="font-medium">Set Your First Milestone</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          What's the FIRST thing you'll deliver? The smallest, shippable version? 
          What date? What's the definition of 'done'? Be specific. Your first milestone should be achievable in 1-2 weeks.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Milestone Description *
            <p className="text-xs font-normal text-muted-foreground">
              What will you deliver? Be specific.
            </p>
          </Label>
          <Textarea
            {...register('milestone_description', { required: 'Description is required', minLength: 10 })}
            placeholder="e.g., A working landing page with a waitlist signup form..."
            className="min-h-[80px] resize-none"
          />
          {errors.milestone_description && (
            <p className="text-xs text-destructive">{errors.milestone_description.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Target Date *
          </Label>
          <Input
            type="date"
            {...register('target_date', { required: 'Target date is required' })}
          />
          {errors.target_date && (
            <p className="text-xs text-destructive">{errors.target_date.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Success Criteria
            <p className="text-xs font-normal text-muted-foreground">
              How will you know you've achieved this milestone?
            </p>
          </Label>
          <Textarea
            {...register('success_criteria')}
            placeholder="e.g., The page loads, people can sign up, I get my first 10 signups..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Potential Blockers
            <p className="text-xs font-normal text-muted-foreground">
              What could get in the way? How will you handle it?
            </p>
          </Label>
          <Textarea
            {...register('blockers')}
            placeholder="e.g., I need to learn CSS, I might not have enough time..."
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
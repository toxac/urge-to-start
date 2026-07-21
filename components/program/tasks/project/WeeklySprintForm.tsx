// components/program/tasks/project/WeeklySprintForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Rocket } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface WeeklySprintData {
  sprint_week_number: number;
  sprint_goals: string;
  daily_breakdown: string;
  sprint_risks: string;
  success_criteria: string;
}

export function WeeklySprintForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<WeeklySprintData>({
    defaultValues: {
      sprint_week_number: preSavedPayload.sprint_week_number || 1,
      sprint_goals: preSavedPayload.sprint_goals || '',
      daily_breakdown: preSavedPayload.daily_breakdown || '',
      sprint_risks: preSavedPayload.sprint_risks || '',
      success_criteria: preSavedPayload.success_criteria || '',
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

  const onSubmit = async (data: WeeklySprintData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        build_data: {
          weekly_sprint: {
            week_number: data.sprint_week_number,
            goals: data.sprint_goals,
            daily_breakdown: data.daily_breakdown,
            risks: data.sprint_risks,
            success_criteria: data.success_criteria,
            planned_at: new Date().toISOString()
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
        toast.success('✅ Weekly sprint planned!');
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
          <span className="font-medium">Weekly Sprint Planned</span>
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
          <Rocket className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Plan Your First Weekly Sprint</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          What will you do THIS WEEK? Break it down. Day by day. This is your execution plan—not a dream, but a schedule.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Sprint Week Number *
          </Label>
          <Input
            type="number"
            min="1"
            {...register('sprint_week_number', { required: 'Week number is required', min: 1 })}
            placeholder="1"
          />
          {errors.sprint_week_number && (
            <p className="text-xs text-destructive">{errors.sprint_week_number.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Sprint Goals *
            <p className="text-xs font-normal text-muted-foreground">
              What do you want to accomplish this week?
            </p>
          </Label>
          <Textarea
            {...register('sprint_goals', { required: 'Sprint goals are required', minLength: 10 })}
            placeholder="e.g., Complete landing page design and set up the waitlist form..."
            className="min-h-[80px] resize-none"
          />
          {errors.sprint_goals && (
            <p className="text-xs text-destructive">{errors.sprint_goals.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Daily Breakdown
            <p className="text-xs font-normal text-muted-foreground">
              What will you do each day? Be realistic.
            </p>
          </Label>
          <Textarea
            {...register('daily_breakdown')}
            placeholder="Monday: Design mockups&#10;Tuesday: Set up project&#10;Wednesday: Build header and navigation..."
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Sprint Risks
            <p className="text-xs font-normal text-muted-foreground">
              What could get in the way? How will you handle it?
            </p>
          </Label>
          <Textarea
            {...register('sprint_risks')}
            placeholder="e.g., I might not have enough time due to work, I'll work early mornings..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Success Criteria
            <p className="text-xs font-normal text-muted-foreground">
              How will you know this week was a success?
            </p>
          </Label>
          <Textarea
            {...register('success_criteria')}
            placeholder="e.g., Landing page is live and I have 5 waitlist signups..."
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
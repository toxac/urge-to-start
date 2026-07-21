// components/program/tasks/project/BuildTimelineForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Calendar } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface BuildTimelineData {
  timeline_weeks: number;
  start_date: string;
  target_launch_date: string;
  weekly_breakdown: string;
  key_milestones: string;
  timeline_notes: string;
}

export function BuildTimelineForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<BuildTimelineData>({
    defaultValues: {
      timeline_weeks: preSavedPayload.timeline_weeks || 0,
      start_date: preSavedPayload.start_date || '',
      target_launch_date: preSavedPayload.target_launch_date || '',
      weekly_breakdown: preSavedPayload.weekly_breakdown || '',
      key_milestones: preSavedPayload.key_milestones || '',
      timeline_notes: preSavedPayload.timeline_notes || '',
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

  const onSubmit = async (data: BuildTimelineData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        build_data: {
          timeline: {
            weeks: data.timeline_weeks,
            start_date: data.start_date,
            target_launch_date: data.target_launch_date,
            weekly_breakdown: data.weekly_breakdown,
            key_milestones: data.key_milestones.split('\n').filter(m => m.trim()),
            notes: data.timeline_notes,
            created_at: new Date().toISOString()
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
        toast.success('✅ Build timeline created!');
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
          <span className="font-medium">Build Timeline Created</span>
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
          <Calendar className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Create Your Build Timeline</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Map out your build: Week 1, Week 2, Week 3, etc. What will you deliver each week? 
          Be realistic. Add 50% buffer to whatever you think it'll take.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Total Weeks *
            </Label>
            <Input
              type="number"
              min="1"
              {...register('timeline_weeks', { required: 'Weeks are required', min: 1 })}
              placeholder="e.g., 12"
            />
            {errors.timeline_weeks && (
              <p className="text-xs text-destructive">{errors.timeline_weeks.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Start Date *
            </Label>
            <Input
              type="date"
              {...register('start_date', { required: 'Start date is required' })}
            />
            {errors.start_date && (
              <p className="text-xs text-destructive">{errors.start_date.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Target Launch Date *
          </Label>
          <Input
            type="date"
            {...register('target_launch_date', { required: 'Launch date is required' })}
          />
          {errors.target_launch_date && (
            <p className="text-xs text-destructive">{errors.target_launch_date.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Weekly Breakdown
            <p className="text-xs font-normal text-muted-foreground">
              What will you deliver each week? Be specific.
            </p>
          </Label>
          <Textarea
            {...register('weekly_breakdown')}
            placeholder="Week 1: Set up project and design mockups&#10;Week 2: Build login and dashboard&#10;Week 3: Build core features..."
            className="min-h-[120px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Key Milestones (one per line)
            <p className="text-xs font-normal text-muted-foreground">
              What are the major milestones on your timeline?
            </p>
          </Label>
          <Textarea
            {...register('key_milestones')}
            placeholder="MVP ready for testing&#10;First paying customer&#10;Public launch"
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Additional Notes
          </Label>
          <Textarea
            {...register('timeline_notes')}
            placeholder="Any other thoughts on the timeline..."
            className="min-h-[60px] resize-none"
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
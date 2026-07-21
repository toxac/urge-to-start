// components/program/tasks/project/ViabilityTimelineForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Clock } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface ViabilityTimelineData {
  estimated_weeks: number;
  launch_date: string;
  personal_commitment: string;
  sustainability_notes: string;
  key_milestones: string;
}

export function ViabilityTimelineForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<ViabilityTimelineData>({
    defaultValues: {
      estimated_weeks: preSavedPayload.estimated_weeks || 0,
      launch_date: preSavedPayload.launch_date || '',
      personal_commitment: preSavedPayload.personal_commitment || '',
      sustainability_notes: preSavedPayload.sustainability_notes || '',
      key_milestones: preSavedPayload.key_milestones || '',
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

  const onSubmit = async (data: ViabilityTimelineData) => {
    setIsSubmitting(true);
    try {
      const viabilityData = {
        timeline: {
          estimated_weeks: data.estimated_weeks,
          launch_date: data.launch_date,
          personal_commitment: data.personal_commitment,
          sustainability_notes: data.sustainability_notes,
          key_milestones: data.key_milestones.split('\n').filter(m => m.trim()),
          assessed_at: new Date().toISOString()
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
        toast.success('✅ Timeline check complete!');
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
          <span className="font-medium">Timeline Check Complete</span>
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
          <Clock className="w-5 h-5 text-primary" />
          <h4 className="font-medium">The Timeline Check</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          How long will this take? What's the earliest date you could have something people can buy? 
          What's your personal timeline—can you sustain this? Add 50% to whatever you think it'll take.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Estimated Build Time (weeks) *
          </Label>
          <Input
            type="number"
            min="0"
            {...register('estimated_weeks', { required: 'Estimated time is required', min: 0 })}
            placeholder="e.g., 12"
          />
          {errors.estimated_weeks && <p className="text-xs text-destructive">{errors.estimated_weeks.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Target Launch Date
            <p className="text-xs font-normal text-muted-foreground">
              When do you want to launch? Be realistic.
            </p>
          </Label>
          <Input
            type="date"
            {...register('launch_date')}
          />
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label className="text-sm font-medium">
            Personal Commitment
            <p className="text-xs font-normal text-muted-foreground">
              How much time can you commit each week? What's your personal timeline?
            </p>
          </Label>
          <Textarea
            {...register('personal_commitment')}
            placeholder="e.g., I can commit 10 hours a week for the next 3 months. I'll work evenings and weekends."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label className="text-sm font-medium">
            Sustainability
            <p className="text-xs font-normal text-muted-foreground">
              Can you sustain this timeline? What would need to change?
            </p>
          </Label>
          <Textarea
            {...register('sustainability_notes')}
            placeholder="e.g., I might need to reduce my hours at my day job or get help from a co-founder."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label className="text-sm font-medium">
            Key Milestones (one per line)
            <p className="text-xs font-normal text-muted-foreground">
              What are the major milestones on your timeline?
            </p>
          </Label>
          <Textarea
            {...register('key_milestones')}
            placeholder="MVP ready for testing&#10;First paying customer&#10;Launch public"
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
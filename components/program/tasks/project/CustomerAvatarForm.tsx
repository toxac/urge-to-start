// components/program/tasks/project/CustomerAvatarForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface CustomerAvatarData {
  age_range: string;
  job_title: string;
  pain_points: string;
  coping_mechanisms: string;
  quote: string;
}

export function CustomerAvatarForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<CustomerAvatarData>({
    defaultValues: {
      age_range: preSavedPayload.age_range || '',
      job_title: preSavedPayload.job_title || '',
      pain_points: preSavedPayload.pain_points || '',
      coping_mechanisms: preSavedPayload.coping_mechanisms || '',
      quote: preSavedPayload.quote || '',
    }
  });

  // Load existing project data
  useEffect(() => {
    async function loadProject() {
      setIsLoading(true);
      try {
        const result = await getCurrentProject();
        if (result.success && result.data) {
          setProjectId(result.data.id);
          
          // Pre-fill from existing validation_data
          const validationData = result.data.validation_data as any || {};
          const avatar = validationData.customer_avatar || {};
          
          // Only pre-fill if no saved payload exists
          if (!existingProgress?.saved_payload) {
            // We'll handle this via react-hook-form default values
          }
        }
      } catch (err) {
        toast.error('Failed to load project data');
      } finally {
        setIsLoading(false);
      }
    }
    loadProject();
  }, [userId]);

  const onSubmit = async (data: CustomerAvatarData) => {
    setIsSubmitting(true);
    try {
      // 1. Save to projects table
      if (projectId) {
        const projectResult = await updateProjectSection(projectId, 'validation_data', {
          customer_avatar: data
        });
        if (!projectResult.success) {
          toast.error('Failed to save project data');
          return;
        }
      }

      // 2. Save to user_progress
      const progressSync = await completeTaskExecution({
        taskId: task.id,
        savedPayload: data
      });

      if (progressSync.success) {
        if (progressSync.data) {
          setProgressStoreRow(progressSync.data as any);
        }
        if (onSuccess) onSuccess();
        toast.success('✅ Customer avatar saved!');
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
          <span className="font-medium">Customer Avatar Complete</span>
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
        <h4 className="font-medium">Create Your Customer Avatar</h4>
        <p className="text-sm text-muted-foreground">
          Who exactly has this problem? Be specific. The more specific you are, the easier it'll be to find and talk to them.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Age Range</Label>
          <Input
            {...register('age_range')}
            placeholder="e.g., 25-35, 40-55"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Job Title / Role</Label>
          <Input
            {...register('job_title')}
            placeholder="e.g., Small business owner, Marketing manager"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Pain Points *
            <p className="text-xs font-normal text-muted-foreground">
              What frustrates them about this problem?
            </p>
          </Label>
          <Textarea
            {...register('pain_points', { required: 'Pain points are required' })}
            placeholder="List the specific pain points..."
            className="min-h-[80px] resize-none"
          />
          {errors.pain_points && (
            <p className="text-xs text-destructive">{errors.pain_points.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Current Coping Mechanisms
            <p className="text-xs font-normal text-muted-foreground">
              What do they currently do to deal with this problem?
            </p>
          </Label>
          <Textarea
            {...register('coping_mechanisms')}
            placeholder="How do they cope today?"
            className="min-h-[60px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Customer Quote
            <p className="text-xs font-normal text-muted-foreground">
              A quote that captures their frustration.
            </p>
          </Label>
          <Input
            {...register('quote')}
            placeholder="e.g., 'I spend 4 hours every Sunday doing bookkeeping and hate it'"
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
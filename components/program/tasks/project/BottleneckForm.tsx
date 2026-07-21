// components/program/tasks/project/BottleneckForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface BottleneckData {
  biggest_bottleneck: string;
  impact: string;
  mitigation_plan: string;
  fallback_plan: string;
}

export function BottleneckForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<BottleneckData>({
    defaultValues: {
      biggest_bottleneck: preSavedPayload.biggest_bottleneck || '',
      impact: preSavedPayload.impact || '',
      mitigation_plan: preSavedPayload.mitigation_plan || '',
      fallback_plan: preSavedPayload.fallback_plan || '',
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

  const onSubmit = async (data: BottleneckData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        build_data: {
          biggest_bottleneck: {
            description: data.biggest_bottleneck,
            impact: data.impact,
            mitigation_plan: data.mitigation_plan,
            fallback_plan: data.fallback_plan,
            identified_at: new Date().toISOString()
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
        toast.success('✅ Bottleneck identified!');
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
          <span className="font-medium">Bottleneck Identified</span>
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
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h4 className="font-medium">Identify Your Biggest Bottleneck</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          What's most likely to slow you down? Skills? Time? Money? Tools? Motivating yourself? 
          Identify it NOW so you can plan for it. A bottleneck you see coming is a bottleneck you can manage.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Biggest Bottleneck *
            <p className="text-xs font-normal text-muted-foreground">
              What is the single biggest thing that could slow you down?
            </p>
          </Label>
          <Textarea
            {...register('biggest_bottleneck', { required: 'Please describe the bottleneck', minLength: 10 })}
            placeholder="e.g., I don't know how to code, I don't have enough time, I don't have the budget for tools..."
            className="min-h-[80px] resize-none"
          />
          {errors.biggest_bottleneck && (
            <p className="text-xs text-destructive">{errors.biggest_bottleneck.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Impact
            <p className="text-xs font-normal text-muted-foreground">
              How will this bottleneck affect your project?
            </p>
          </Label>
          <Textarea
            {...register('impact')}
            placeholder="e.g., I might miss my launch deadline, I might have to cut features..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Mitigation Plan
            <p className="text-xs font-normal text-muted-foreground">
              How will you overcome this bottleneck?
            </p>
          </Label>
          <Textarea
            {...register('mitigation_plan')}
            placeholder="e.g., I'll learn enough code to build a prototype, I'll ask a friend to help..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Fallback Plan
            <p className="text-xs font-normal text-muted-foreground">
              What if your mitigation plan doesn't work? What's your backup?
            </p>
          </Label>
          <Textarea
            {...register('fallback_plan')}
            placeholder="e.g., I'll use no-code tools, I'll hire someone, I'll simplify the product..."
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
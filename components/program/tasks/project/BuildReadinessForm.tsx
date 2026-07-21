// components/program/tasks/project/BuildReadinessForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, ThumbsUp } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface BuildReadinessData {
  readiness_assessment: string;
  missing_items: string;
  action_plan: string;
  confidence_level: string;
}

export function BuildReadinessForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<BuildReadinessData>({
    defaultValues: {
      readiness_assessment: preSavedPayload.readiness_assessment || '',
      missing_items: preSavedPayload.missing_items || '',
      action_plan: preSavedPayload.action_plan || '',
      confidence_level: preSavedPayload.confidence_level || '3',
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

  const onSubmit = async (data: BuildReadinessData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        build_data: {
          build_readiness: {
            assessment: data.readiness_assessment,
            missing_items: data.missing_items,
            action_plan: data.action_plan,
            confidence_level: parseInt(data.confidence_level),
            assessed_at: new Date().toISOString()
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
        toast.success('✅ Build readiness complete!');
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
          <span className="font-medium">Build Ready</span>
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
          <ThumbsUp className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Check Your Build Readiness</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Check everything: Supplies, skills, tools, plan, timeline, budget. 
          Are you ready to start building? If not, what's missing?
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Readiness Assessment *
            <p className="text-xs font-normal text-muted-foreground">
              Are you ready to start building? Why or why not?
            </p>
          </Label>
          <Textarea
            {...register('readiness_assessment', { required: 'Readiness assessment is required', minLength: 10 })}
            placeholder="e.g., I'm ready to start building. I have everything I need and I'm excited to get started..."
            className="min-h-[100px] resize-none"
          />
          {errors.readiness_assessment && (
            <p className="text-xs text-destructive">{errors.readiness_assessment.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            What's Missing?
            <p className="text-xs font-normal text-muted-foreground">
              If you're not ready, what's the ONE thing you need to do before you start?
            </p>
          </Label>
          <Textarea
            {...register('missing_items')}
            placeholder="e.g., I need to buy a domain, I need to learn Figma..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Action Plan
            <p className="text-xs font-normal text-muted-foreground">
              What's your plan to get ready or to start building?
            </p>
          </Label>
          <Textarea
            {...register('action_plan')}
            placeholder="e.g., This week I'll set up my development environment and build the landing page..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Confidence Level (1-5)
            <p className="text-xs font-normal text-muted-foreground">
              How confident are you that you can build this?
            </p>
          </Label>
          <select
            {...register('confidence_level')}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="1">1 - Not confident</option>
            <option value="2">2 - Slightly confident</option>
            <option value="3">3 - Moderately confident</option>
            <option value="4">4 - Very confident</option>
            <option value="5">5 - Completely confident</option>
          </select>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full h-11">
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {isSubmitting ? 'Saving...' : `Save & Earn ${task.grant_points} XP`}
      </Button>
    </form>
  );
}
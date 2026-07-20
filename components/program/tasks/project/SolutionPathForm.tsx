// components/program/tasks/project/SolutionPathForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Compass } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface SolutionPathData {
  selected_format: string;
  path_rationale: string;
  confidence_level: string;
}

export function SolutionPathForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<SolutionPathData>({
    defaultValues: {
      selected_format: preSavedPayload.selected_format || '',
      path_rationale: preSavedPayload.path_rationale || '',
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

  const onSubmit = async (data: SolutionPathData) => {
    setIsSubmitting(true);
    try {
      const solutionData = {
        selected_solution_path: data.selected_format,
        path_rationale: data.path_rationale,
        path_confidence: parseInt(data.confidence_level),
        path_selected_at: new Date().toISOString()
      };

      if (projectId) {
        const currentProject = await getCurrentProject();
        let existingSolution = {};
        if (currentProject.success && currentProject.data) {
          existingSolution = (currentProject.data.solution_design as any) || {};
        }
        const projectResult = await updateProjectSection(projectId, 'solution_design', {
          ...existingSolution,
          ...solutionData
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
        toast.success('✅ Path selected!');
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
          <span className="font-medium">Path Selected</span>
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
          <Compass className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Pick Your Path</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Based on exploring all the formats, which one feels right for you? 
          There's no wrong answer—just the one that fits your skills, resources, and goals.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Your Chosen Path *
          </Label>
          <select
            {...register('selected_format', { required: 'Please select a format' })}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select your path...</option>
            <option value="service">Service / Agency</option>
            <option value="saas">Software / SaaS</option>
            <option value="marketplace">Marketplace / Platform</option>
            <option value="course">Information / Course</option>
            <option value="physical_product">Physical Product</option>
          </select>
          {errors.selected_format && (
            <p className="text-xs text-destructive">{errors.selected_format.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Why This Path?
            <p className="text-xs font-normal text-muted-foreground">
              Why did you choose this format? What makes it the right fit?
            </p>
          </Label>
          <Textarea
            {...register('path_rationale')}
            placeholder="e.g., I chose SaaS because I'm a developer and my customers want a tool they can use anytime..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Confidence Level (1-5)
            <p className="text-xs font-normal text-muted-foreground">
              How confident are you that this is the right path?
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
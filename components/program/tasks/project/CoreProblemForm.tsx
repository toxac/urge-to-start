// components/program/tasks/project/CoreProblemForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Target } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface CoreProblemData {
  core_problem: string;
  problem_context: string;
  problem_impact: string;
}

export function CoreProblemForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<CoreProblemData>({
    defaultValues: {
      core_problem: preSavedPayload.core_problem || '',
      problem_context: preSavedPayload.problem_context || '',
      problem_impact: preSavedPayload.problem_impact || '',
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

  const onSubmit = async (data: CoreProblemData) => {
    setIsSubmitting(true);
    try {
      const solutionData = {
        core_problem: data.core_problem,
        problem_context: data.problem_context,
        problem_impact: data.problem_impact,
        updated_at: new Date().toISOString()
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
        toast.success('✅ Core problem defined!');
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
          <span className="font-medium">Core Problem Defined</span>
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
          <Target className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Define the Core Problem</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          What is the <strong>ONE</strong> problem you're solving? Not 5 problems. Not 3. One. 
          What's the single biggest pain point for your customer?
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Core Problem *
            <p className="text-xs font-normal text-muted-foreground">
              Be specific. 'Small business owners struggle with bookkeeping' is okay. 
              'Sarah, who runs a bakery, spends 4 hours every Sunday doing bookkeeping and hates it' is better.
            </p>
          </Label>
          <Textarea
            {...register('core_problem', { required: 'Core problem is required', minLength: 10 })}
            placeholder="Describe the core problem in detail..."
            className="min-h-[100px] resize-none"
          />
          {errors.core_problem && (
            <p className="text-xs text-destructive">{errors.core_problem.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Context
            <p className="text-xs font-normal text-muted-foreground">
              When and where does this problem occur? What's the situation?
            </p>
          </Label>
          <Textarea
            {...register('problem_context')}
            placeholder="e.g., This happens every Sunday when she does weekly bookkeeping..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Impact
            <p className="text-xs font-normal text-muted-foreground">
              What's the cost of this problem? Time? Money? Stress?
            </p>
          </Label>
          <Textarea
            {...register('problem_impact')}
            placeholder="e.g., She loses 4 hours every Sunday, makes mistakes, and dreads bookkeeping..."
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
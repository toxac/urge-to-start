// components/program/tasks/project/RequirementsDocForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, FileText } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface RequirementsDocData {
  requirements: string;
  user_journey: string;
  edge_cases: string;
}

export function RequirementsDocForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<RequirementsDocData>({
    defaultValues: {
      requirements: preSavedPayload.requirements || '',
      user_journey: preSavedPayload.user_journey || '',
      edge_cases: preSavedPayload.edge_cases || '',
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

  const onSubmit = async (data: RequirementsDocData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        build_data: {
          requirements_document: data.requirements,
          user_journey: data.user_journey,
          edge_cases: data.edge_cases,
          requirements_doc_created_at: new Date().toISOString()
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
        toast.success('✅ Requirements document saved!');
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
          <span className="font-medium">Requirements Document Complete</span>
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
          <FileText className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Create Your Requirements Document</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Write it down. This is your blueprint. What does it need to do? Who's it for? 
          How will someone use it? This isn't for investors—it's for YOU so you don't lose focus.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Requirements *
            <p className="text-xs font-normal text-muted-foreground">
              What does it need to do? Be specific.
            </p>
          </Label>
          <Textarea
            {...register('requirements', { required: 'Requirements are required', minLength: 10 })}
            placeholder="e.g., Users must be able to track expenses, generate monthly reports..."
            className="min-h-[120px] resize-none"
          />
          {errors.requirements && (
            <p className="text-xs text-destructive">{errors.requirements.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            User Journey
            <p className="text-xs font-normal text-muted-foreground">
              How will someone use this? Walk through the experience step by step.
            </p>
          </Label>
          <Textarea
            {...register('user_journey')}
            placeholder="1. User logs in&#10;2. Adds an expense&#10;3. Sees the dashboard..."
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Edge Cases
            <p className="text-xs font-normal text-muted-foreground">
              What could go wrong? What are the edge cases?
            </p>
          </Label>
          <Textarea
            {...register('edge_cases')}
            placeholder="e.g., What if the user doesn't have any expenses? What if they enter negative amounts?"
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
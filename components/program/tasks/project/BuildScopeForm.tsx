// components/program/tasks/project/BuildScopeForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Target } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface BuildScopeData {
  scope_definition: string;
  features_included: string;
  features_excluded: string;
  scope_notes: string;
}

export function BuildScopeForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<BuildScopeData>({
    defaultValues: {
      scope_definition: preSavedPayload.scope_definition || '',
      features_included: preSavedPayload.features_included || '',
      features_excluded: preSavedPayload.features_excluded || '',
      scope_notes: preSavedPayload.scope_notes || '',
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

  const onSubmit = async (data: BuildScopeData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        build_data: {
          scope_definition: data.scope_definition,
          features_included: data.features_included.split('\n').filter(f => f.trim()),
          features_excluded: data.features_excluded.split('\n').filter(f => f.trim()),
          scope_notes: data.scope_notes,
          scope_defined_at: new Date().toISOString()
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
        toast.success('✅ Build scope defined!');
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
          <span className="font-medium">Build Scope Defined</span>
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
          <h4 className="font-medium">Define Your Build Scope</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Based on your MSP Canvas from Mission 3, what exactly are you building? 
          Be specific. This is your build specification—the guardrails that keep you focused.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Scope Definition *
            <p className="text-xs font-normal text-muted-foreground">
              What exactly are you building? What does it do?
            </p>
          </Label>
          <Textarea
            {...register('scope_definition', { required: 'Scope definition is required', minLength: 10 })}
            placeholder="e.g., A simple expense tracking tool for small business owners..."
            className="min-h-[100px] resize-none"
          />
          {errors.scope_definition && (
            <p className="text-xs text-destructive">{errors.scope_definition.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Features Included (one per line)
            <p className="text-xs font-normal text-muted-foreground">
              What features will you build? Be specific.
            </p>
          </Label>
          <Textarea
            {...register('features_included')}
            placeholder="Expense tracking&#10;Monthly reports&#10;Receipt scanning"
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Features Excluded (one per line)
            <p className="text-xs font-normal text-muted-foreground">
              What are you NOT building? This is important to prevent scope creep.
            </p>
          </Label>
          <Textarea
            {...register('features_excluded')}
            placeholder="Team collaboration&#10;API integrations&#10;Mobile app"
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Additional Notes
          </Label>
          <Textarea
            {...register('scope_notes')}
            placeholder="Any other thoughts on the scope..."
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
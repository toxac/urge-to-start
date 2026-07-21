// components/program/tasks/project/BuildManifestoForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, PenTool } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface BuildManifestoData {
  manifesto: string;
  why_im_building: string;
  what_im_building: string;
  who_its_for: string;
  when_ready: string;
}

export function BuildManifestoForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<BuildManifestoData>({
    defaultValues: {
      manifesto: preSavedPayload.manifesto || '',
      why_im_building: preSavedPayload.why_im_building || '',
      what_im_building: preSavedPayload.what_im_building || '',
      who_its_for: preSavedPayload.who_its_for || '',
      when_ready: preSavedPayload.when_ready || '',
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

  const onSubmit = async (data: BuildManifestoData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        build_data: {
          manifesto: {
            full_text: data.manifesto,
            why: data.why_im_building,
            what: data.what_im_building,
            who: data.who_its_for,
            when: data.when_ready,
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
        toast.success('✅ Build Manifesto written!');
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
          <span className="font-medium">Build Manifesto Complete</span>
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
          <PenTool className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Write Your Build Manifesto</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Put it all together: What are you building? Why? For who? When will it be ready? 
          This is your Build Manifesto—your commitment to yourself. Keep it somewhere you can see it every day.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Full Manifesto *
            <p className="text-xs font-normal text-muted-foreground">
              Write your complete Build Manifesto. This is your commitment to yourself.
            </p>
          </Label>
          <Textarea
            {...register('manifesto', { required: 'Manifesto is required', minLength: 20 })}
            placeholder="I am building this because... I will solve... For people who..."
            className="min-h-[150px] resize-none"
          />
          {errors.manifesto && (
            <p className="text-xs text-destructive">{errors.manifesto.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Why Am I Building This? *
              <p className="text-xs font-normal text-muted-foreground">
                What's driving you?
              </p>
            </Label>
            <Textarea
              {...register('why_im_building', { required: 'Why is required', minLength: 10 })}
              placeholder="I'm building this because..."
              className="min-h-[80px] resize-none"
            />
            {errors.why_im_building && (
              <p className="text-xs text-destructive">{errors.why_im_building.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              What Am I Building? *
              <p className="text-xs font-normal text-muted-foreground">
                What's your product or service?
              </p>
            </Label>
            <Textarea
              {...register('what_im_building', { required: 'What is required', minLength: 10 })}
              placeholder="I'm building a..."
              className="min-h-[80px] resize-none"
            />
            {errors.what_im_building && (
              <p className="text-xs text-destructive">{errors.what_im_building.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Who Is It For? *
              <p className="text-xs font-normal text-muted-foreground">
                Who's your customer?
              </p>
            </Label>
            <Textarea
              {...register('who_its_for', { required: 'Who is required', minLength: 10 })}
              placeholder="For people who..."
              className="min-h-[80px] resize-none"
            />
            {errors.who_its_for && (
              <p className="text-xs text-destructive">{errors.who_its_for.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              When Will It Be Ready? *
              <p className="text-xs font-normal text-muted-foreground">
                What's your target? Be specific.
              </p>
            </Label>
            <Textarea
              {...register('when_ready', { required: 'When is required', minLength: 10 })}
              placeholder="It will be ready by..."
              className="min-h-[80px] resize-none"
            />
            {errors.when_ready && (
              <p className="text-xs text-destructive">{errors.when_ready.message}</p>
            )}
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full h-11">
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {isSubmitting ? 'Saving...' : `Save & Earn ${task.grant_points} XP`}
      </Button>
    </form>
  );
}
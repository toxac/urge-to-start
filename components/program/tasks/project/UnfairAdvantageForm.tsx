// components/program/tasks/project/UnfairAdvantageForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface UnfairAdvantageData {
  advantage_description: string;
  advantage_source: string;
  how_to_build: string;
  competitor_differentiator: string;
}

export function UnfairAdvantageForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<UnfairAdvantageData>({
    defaultValues: {
      advantage_description: preSavedPayload.advantage_description || '',
      advantage_source: preSavedPayload.advantage_source || '',
      how_to_build: preSavedPayload.how_to_build || '',
      competitor_differentiator: preSavedPayload.competitor_differentiator || '',
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

  const onSubmit = async (data: UnfairAdvantageData) => {
    setIsSubmitting(true);
    try {
      const competitiveData = {
        unfair_advantage: data.advantage_description,
        advantage_source: data.advantage_source,
        advantage_build_plan: data.how_to_build,
        competitor_differentiator: data.competitor_differentiator,
        updated_at: new Date().toISOString()
      };

      if (projectId) {
        const currentProject = await getCurrentProject();
        let existingCompetitive = {};
        
        if (currentProject.success && currentProject.data) {
          existingCompetitive = (currentProject.data.competitive_landscape as any) || {};
        }
        
        const projectResult = await updateProjectSection(projectId, 'competitive_landscape', {
          ...existingCompetitive,
          ...competitiveData
        });
        
        if (!projectResult.success) {
          toast.error(projectResult.error || 'Failed to save project data');
          return;
        }
      } else {
        toast.error('No active project found. Please create a project first.');
        return;
      }

      const progressSync = await completeTaskExecution({
        taskId: task.id,
        savedPayload: data
      });

      if (progressSync.success) {
        if (progressSync.data) {
          setProgressStoreRow(progressSync.data as any);
        }
        if (onSuccess) onSuccess();
        toast.success('✅ Unfair advantage saved!');
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
          <span className="font-medium">Unfair Advantage Complete</span>
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
          <Sparkles className="w-5 h-5 text-primary" />
          <h4 className="font-medium">What's Your Unfair Advantage?</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Why you? What do you bring that others don't? Be honest. If you don't have one yet, that's okay—what could you build or learn to get one?
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Your Unfair Advantage *
            <p className="text-xs font-normal text-muted-foreground">
              What makes you uniquely suited to solve this problem?
            </p>
          </Label>
          <Textarea
            {...register('advantage_description', { required: 'Unfair advantage is required' })}
            placeholder="e.g., I have 10 years of experience in this industry and a network of 500+ potential customers..."
            className="min-h-[100px] resize-none"
          />
          {errors.advantage_description && (
            <p className="text-xs text-destructive">{errors.advantage_description.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Where Does Your Advantage Come From?
            <p className="text-xs font-normal text-muted-foreground">
              Skills? Experience? Network? Access? Knowledge?
            </p>
          </Label>
          <Input
            {...register('advantage_source')}
            placeholder="e.g., Industry experience, technical skills, network, unique access"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            How Could You Build or Strengthen This Advantage?
            <p className="text-xs font-normal text-muted-foreground">
              If you don't have an advantage yet, what could you learn, build, or acquire?
            </p>
          </Label>
          <Textarea
            {...register('how_to_build')}
            placeholder="e.g., I could take a course on sales, hire a developer, or partner with someone who has the skills I lack..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            What Makes You Different From Competitors?
            <p className="text-xs font-normal text-muted-foreground">
              What would make people choose you over the competition?
            </p>
          </Label>
          <Textarea
            {...register('competitor_differentiator')}
            placeholder="e.g., I offer a more personalized service, my product is easier to use, I have better customer support..."
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
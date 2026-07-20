// components/program/tasks/project/SolutionSpaceForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Layers } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface SolutionSpaceData {
  solution_format: string;
  format_rationale: string;
  other_formats: string;
}

const SOLUTION_FORMATS = [
  { value: 'service', label: 'Service / Agency', description: 'You sell your time and expertise (consulting, coaching, design, development).' },
  { value: 'saas', label: 'Software / SaaS', description: 'You sell software as a service (subscription-based, web or mobile app).' },
  { value: 'marketplace', label: 'Marketplace / Platform', description: 'You connect buyers and sellers (Etsy, Uber, Airbnb style).' },
  { value: 'course', label: 'Information / Course', description: 'You sell knowledge (courses, ebooks, workshops, membership).' },
  { value: 'physical_product', label: 'Physical Product', description: 'You make and sell physical goods (products, merchandise, food).' },
];

export function SolutionSpaceForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<SolutionSpaceData>({
    defaultValues: {
      solution_format: preSavedPayload.solution_format || '',
      format_rationale: preSavedPayload.format_rationale || '',
      other_formats: preSavedPayload.other_formats || '',
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

  const onSubmit = async (data: SolutionSpaceData) => {
    setIsSubmitting(true);
    try {
      const solutionData = {
        solution_format: data.solution_format,
        format_rationale: data.format_rationale,
        other_formats_considered: data.other_formats,
        solution_space_explored_at: new Date().toISOString()
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
        toast.success('✅ Solution space explored!');
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
          <span className="font-medium">Solution Space Explored</span>
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
          <Layers className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Explore the Solution Space</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          There are multiple ways to solve the same problem. Explore all the options.
          Which format fits you best?
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Solution Format *
            <p className="text-xs font-normal text-muted-foreground">
              Which format feels most natural for you and your customer?
            </p>
          </Label>
          <div className="space-y-2">
            {SOLUTION_FORMATS.map((format) => (
              <label key={format.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/20 transition">
                <input
                  type="radio"
                  value={format.value}
                  {...register('solution_format', { required: 'Please select a format' })}
                  className="mt-1 h-4 w-4 flex-shrink-0 text-primary"
                />
                <div>
                  <div className="text-sm font-medium text-foreground">{format.label}</div>
                  <div className="text-xs text-muted-foreground">{format.description}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.solution_format && (
            <p className="text-xs text-destructive">{errors.solution_format.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Why This Format?
            <p className="text-xs font-normal text-muted-foreground">
              Why does this format feel right for you? Consider your skills, resources, and customer.
            </p>
          </Label>
          <Textarea
            {...register('format_rationale')}
            placeholder="e.g., I'm a developer, so building a SaaS feels natural. My customers want a tool they can use anytime."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Other Formats Considered
            <p className="text-xs font-normal text-muted-foreground">
              What other formats did you consider? Why did you rule them out?
            </p>
          </Label>
          <Textarea
            {...register('other_formats')}
            placeholder="e.g., I considered a service model, but I want something more scalable..."
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
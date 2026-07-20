// components/program/tasks/project/InterviewSynthesisForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface InterviewSynthesisData {
  key_insights: string;
  surprises: string;
  problem_validated: string;
  would_pay: string;
}

export function InterviewSynthesisForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<InterviewSynthesisData>({
    defaultValues: {
      key_insights: preSavedPayload.key_insights || '',
      surprises: preSavedPayload.surprises || '',
      problem_validated: preSavedPayload.problem_validated || 'unsure',
      would_pay: preSavedPayload.would_pay || 'unsure',
    }
  });

  useEffect(() => {
    async function loadProject() {
      setIsLoading(true);
      try {
        const result = await getCurrentProject();
        // ⚡ FIXED: Check success before accessing data
        if (result.success && result.data) {
          setProjectId(result.data.id);
        } else {
          // If no project found, we need to handle this gracefully
          console.log('No active project found. Please ensure a project exists.');
        }
      } catch (err) {
        toast.error('Failed to load project data');
      } finally {
        setIsLoading(false);
      }
    }
    loadProject();
  }, [userId]);

  const onSubmit = async (data: InterviewSynthesisData) => {
    setIsSubmitting(true);
    try {
      const validationData = {
        interview_insights: data.key_insights,
        interview_surprises: data.surprises,
        problem_validated: data.problem_validated === 'yes',
        would_pay: data.would_pay === 'yes',
        synthesized_at: new Date().toISOString()
      };

      if (projectId) {
        // ⚡ FIXED: Get current project data safely
        const currentProject = await getCurrentProject();
        let existingValidation = {};
        
        if (currentProject.success && currentProject.data) {
          existingValidation = (currentProject.data.validation_data as any) || {};
        }
        
        const projectResult = await updateProjectSection(projectId, 'validation_data', {
          ...existingValidation,
          ...validationData
        });
        
        if (!projectResult.success) {
          toast.error(projectResult.error || 'Failed to save project data');
          return;
        }
      } else {
        // If no project exists yet, we need to handle this
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
        toast.success('✅ Interview insights saved!');
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
          <span className="font-medium">Synthesis Complete</span>
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
        <h4 className="font-medium">What Did You Learn?</h4>
        <p className="text-sm text-muted-foreground">
          Review your interview notes. What patterns emerged? What surprised you?
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Key Insights *
            <p className="text-xs font-normal text-muted-foreground">
              What patterns emerged from your interviews?
            </p>
          </Label>
          <Textarea
            {...register('key_insights', { required: 'Key insights are required' })}
            placeholder="e.g., All 5 people said they struggle with..."
            className="min-h-[100px] resize-none"
          />
          {errors.key_insights && (
            <p className="text-xs text-destructive">{errors.key_insights.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            What Surprised You?
            <p className="text-xs font-normal text-muted-foreground">
              What did you learn that you didn't expect?
            </p>
          </Label>
          <Textarea
            {...register('surprises')}
            placeholder="I was surprised to learn that..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Is the problem validated? *
            </Label>
            <select
              {...register('problem_validated', { required: 'Please select an option' })}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="yes">✅ Yes, people confirmed it's real</option>
              <option value="no">❌ No, people said it's not an issue</option>
              <option value="unsure">🤔 Not sure yet</option>
            </select>
            {errors.problem_validated && (
              <p className="text-xs text-destructive">{errors.problem_validated.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Would they pay for a solution? *
            </Label>
            <select
              {...register('would_pay', { required: 'Please select an option' })}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="yes">✅ Yes, they said they'd pay</option>
              <option value="no">❌ No, they said they wouldn't</option>
              <option value="unsure">🤔 Not sure</option>
            </select>
            {errors.would_pay && (
              <p className="text-xs text-destructive">{errors.would_pay.message}</p>
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
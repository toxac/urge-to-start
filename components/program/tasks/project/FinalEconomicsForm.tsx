// components/program/tasks/project/FinalEconomicsForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Wallet } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection, updateProject } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface FinalEconomicsData {
  decision: string;
  decision_notes: string;
  revenue_goal: string;
  next_steps: string;
}

export function FinalEconomicsForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<FinalEconomicsData>({
    defaultValues: {
      decision: preSavedPayload.decision || 'needs_more',
      decision_notes: preSavedPayload.decision_notes || '',
      revenue_goal: preSavedPayload.revenue_goal || '',
      next_steps: preSavedPayload.next_steps || '',
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

  const onSubmit = async (data: FinalEconomicsData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        economics_decision: {
          decision: data.decision,
          decision_notes: data.decision_notes,
          revenue_goal: data.revenue_goal,
          next_steps: data.next_steps,
          decided_at: new Date().toISOString()
        }
      };

      if (projectId) {
        const currentProject = await getCurrentProject();
        let existingFinancial = {};
        if (currentProject.success && currentProject.data) {
          existingFinancial = (currentProject.data.financial_blueprint as any) || {};
        }
        const projectResult = await updateProjectSection(projectId, 'financial_blueprint', {
          ...existingFinancial,
          ...payload
        });
        if (!projectResult.success) {
          toast.error(projectResult.error || 'Failed to save project data');
          return;
        }

        // Update project status based on decision
        if (data.decision === 'viable') {
          await updateProject(projectId, {
            status: 'planning',
            current_mission: '5'
          });
        } else if (data.decision === 'not_viable') {
          await updateProject(projectId, {
            status: 'ideation',
            current_mission: '2'
          });
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
        
        if (data.decision === 'viable') {
          toast.success('🎉 Economics work! Moving to Mission 5!');
        } else if (data.decision === 'not_viable') {
          toast.info('🔄 Economics don\'t work. Go back to Mission 2.');
        } else {
          toast.success('✅ Decision saved!');
        }
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
    const decisionLabel = preSavedPayload.decision === 'viable' 
      ? 'Viable ✅' 
      : preSavedPayload.decision === 'not_viable' 
        ? 'Not Viable ❌' 
        : 'Needs More Review';
    
    return (
      <div className="w-full space-y-4">
        <div className={`flex items-center gap-2 ${
          preSavedPayload.decision === 'viable' 
            ? 'text-emerald-600' 
            : preSavedPayload.decision === 'not_viable' 
              ? 'text-destructive' 
              : 'text-amber-600'
        }`}>
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Final Decision: {decisionLabel}</span>
        </div>
        <div className="p-4 border rounded-xl bg-muted/5">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {preSavedPayload.decision_notes || 'No notes provided.'}
          </p>
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
          <Wallet className="w-5 h-5 text-primary" />
          <h4 className="font-medium">The Final Economics Decision</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Look at everything: Pricing, channels, partnerships, costs, break-even, scenarios.
          Does the math work? Are you excited? Is this worth your time?
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Your Final Decision *
          </Label>
          <div className="space-y-2">
            {[
              { value: 'viable', label: '✅ Viable - This is a real business!', description: 'The numbers work. You\'re excited. Let\'s build!' },
              { value: 'not_viable', label: '❌ Not Viable - Go back to Mission 2', description: 'The numbers don\'t work. It\'s better to know now than later.' },
              { value: 'needs_more', label: '🤔 Needs More Work', description: 'You need more data or validation before making a final decision.' },
            ].map((option) => (
              <label key={option.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/20 transition">
                <input
                  type="radio"
                  value={option.value}
                  {...register('decision', { required: 'Please make a decision' })}
                  className="mt-1 h-4 w-4 flex-shrink-0 text-primary"
                />
                <div>
                  <div className="text-sm font-medium text-foreground">{option.label}</div>
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.decision && <p className="text-xs text-destructive">{errors.decision.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Decision Notes *
            <p className="text-xs font-normal text-muted-foreground">
              Why did you make this decision? What factors influenced you most?
            </p>
          </Label>
          <Textarea
            {...register('decision_notes', { required: 'Decision notes are required', minLength: 10 })}
            placeholder="e.g., The numbers work, I have a clear path to profitability, and I'm excited..."
            className="min-h-[100px] resize-none"
          />
          {errors.decision_notes && <p className="text-xs text-destructive">{errors.decision_notes.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Revenue Goal
            <p className="text-xs font-normal text-muted-foreground">
              What's your revenue target for the first year? (Optional)
            </p>
          </Label>
          <Textarea
            {...register('revenue_goal')}
            placeholder="e.g., $50,000 in year 1, $200,000 in year 2..."
            className="min-h-[60px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Next Steps
            <p className="text-xs font-normal text-muted-foreground">
              What's the very next thing you'll do?
            </p>
          </Label>
          <Textarea
            {...register('next_steps')}
            placeholder="e.g., Start building the MVP, set up marketing channels..."
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
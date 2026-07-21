// components/program/tasks/project/AcquisitionCostForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, TrendingUp } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface AcquisitionCostData {
  cac_estimate: number;
  cac_confidence: string;
  cac_notes: string;
}

export function AcquisitionCostForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<AcquisitionCostData>({
    defaultValues: {
      cac_estimate: preSavedPayload.cac_estimate || 0,
      cac_confidence: preSavedPayload.cac_confidence || '3',
      cac_notes: preSavedPayload.cac_notes || '',
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

  const onSubmit = async (data: AcquisitionCostData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        channels: {
          cac_estimate: data.cac_estimate,
          cac_confidence: parseInt(data.cac_confidence),
          cac_notes: data.cac_notes,
          estimated_at: new Date().toISOString()
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
        toast.success('✅ CAC estimated!');
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
          <span className="font-medium">CAC Estimated</span>
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
          <TrendingUp className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Estimate Your Acquisition Cost</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Based on your channel experiments (or best guess), what will it cost to acquire a customer?
          Time, money, and effort. Compare this to what they'll pay.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Customer Acquisition Cost ($) *
            <p className="text-xs font-normal text-muted-foreground">
              How much does it cost to acquire one customer?
            </p>
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            {...register('cac_estimate', { required: 'CAC is required', min: 0 })}
            placeholder="e.g., 50"
          />
          {errors.cac_estimate && <p className="text-xs text-destructive">{errors.cac_estimate.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Confidence Level (1-5)
            <p className="text-xs font-normal text-muted-foreground">
              How confident are you in this estimate?
            </p>
          </Label>
          <select
            {...register('cac_confidence')}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="1">1 - Very uncertain</option>
            <option value="2">2 - Slightly uncertain</option>
            <option value="3">3 - Moderately confident</option>
            <option value="4">4 - Very confident</option>
            <option value="5">5 - Extremely confident</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Notes & Assumptions
            <p className="text-xs font-normal text-muted-foreground">
              What assumptions are you making? What would change this number?
            </p>
          </Label>
          <Textarea
            {...register('cac_notes')}
            placeholder="e.g., This assumes we spend $500 on ads to get 10 customers..."
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
// components/program/tasks/project/ViabilityNumbersForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Calculator } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface ViabilityNumbersData {
  min_price: number;
  customers_needed: number;
  cac: number;
  unit_margin: number;
  revenue_target: number;
  notes: string;
}

export function ViabilityNumbersForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<ViabilityNumbersData>({
    defaultValues: {
      min_price: preSavedPayload.min_price || 0,
      customers_needed: preSavedPayload.customers_needed || 0,
      cac: preSavedPayload.cac || 0,
      unit_margin: preSavedPayload.unit_margin || 0,
      revenue_target: preSavedPayload.revenue_target || 0,
      notes: preSavedPayload.notes || '',
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

  const onSubmit = async (data: ViabilityNumbersData) => {
    setIsSubmitting(true);
    try {
      const viabilityData = {
        numbers: {
          min_price: data.min_price,
          customers_needed: data.customers_needed,
          cac: data.cac,
          unit_margin: data.unit_margin,
          revenue_target: data.revenue_target,
          notes: data.notes,
          calculated_at: new Date().toISOString()
        }
      };

      if (projectId) {
        const currentProject = await getCurrentProject();
        let existingViability = {};
        if (currentProject.success && currentProject.data) {
          existingViability = (currentProject.data.viability_check as any) || {};
        }
        const projectResult = await updateProjectSection(projectId, 'viability_check', {
          ...existingViability,
          ...viabilityData
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
        toast.success('✅ Numbers check complete!');
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
          <span className="font-medium">Numbers Check Complete</span>
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
          <Calculator className="w-5 h-5 text-primary" />
          <h4 className="font-medium">The Numbers Check</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Let's get real about money. What's the minimum price someone would pay? 
          How many customers do you need to make this worth your time? 
          Can you acquire them for less than they pay you?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Minimum Price ($) *
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            {...register('min_price', { required: 'Price is required', min: 0 })}
            placeholder="e.g., 99.99"
          />
          {errors.min_price && <p className="text-xs text-destructive">{errors.min_price.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Customers Needed *
          </Label>
          <Input
            type="number"
            min="0"
            {...register('customers_needed', { required: 'Customers needed is required', min: 0 })}
            placeholder="How many customers do you need?"
          />
          {errors.customers_needed && <p className="text-xs text-destructive">{errors.customers_needed.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Customer Acquisition Cost ($)
            <p className="text-xs font-normal text-muted-foreground">
              How much does it cost to acquire one customer?
            </p>
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            {...register('cac', { min: 0 })}
            placeholder="e.g., 50"
          />
          {errors.cac && <p className="text-xs text-destructive">{errors.cac.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Unit Margin ($)
            <p className="text-xs font-normal text-muted-foreground">
              Price minus cost per unit
            </p>
          </Label>
          <Input
            type="number"
            step="0.01"
            {...register('unit_margin')}
            placeholder="e.g., 49.99"
          />
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label className="text-sm font-medium">
            Revenue Target ($)
            <p className="text-xs font-normal text-muted-foreground">
              How much revenue do you want to generate in the first year?
            </p>
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            {...register('revenue_target')}
            placeholder="e.g., 100000"
          />
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label className="text-sm font-medium">
            Notes & Observations
          </Label>
          <Textarea
            {...register('notes')}
            placeholder="What concerns do you have about the numbers? What assumptions are you making?"
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
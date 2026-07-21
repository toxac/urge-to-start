// components/program/tasks/project/UnitEconomicsForm.tsx
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

interface UnitEconomicsData {
  price_per_unit: number;
  cost_per_unit: number;
  margin_per_unit: number;
  margin_percentage: number;
  annual_revenue_projection: number;
  notes: string;
}

export function UnitEconomicsForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<UnitEconomicsData>({
    defaultValues: {
      price_per_unit: preSavedPayload.price_per_unit || 0,
      cost_per_unit: preSavedPayload.cost_per_unit || 0,
      margin_per_unit: preSavedPayload.margin_per_unit || 0,
      margin_percentage: preSavedPayload.margin_percentage || 0,
      annual_revenue_projection: preSavedPayload.annual_revenue_projection || 0,
      notes: preSavedPayload.notes || '',
    }
  });

  const price = watch('price_per_unit');
  const cost = watch('cost_per_unit');

  // Auto-calculate margin
  useEffect(() => {
    const margin = price - cost;
    setValue('margin_per_unit', margin);
    if (price > 0) {
      setValue('margin_percentage', (margin / price) * 100);
    } else {
      setValue('margin_percentage', 0);
    }
  }, [price, cost, setValue]);

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

  const onSubmit = async (data: UnitEconomicsData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        unit_economics: {
          price_per_unit: data.price_per_unit,
          cost_per_unit: data.cost_per_unit,
          margin_per_unit: data.margin_per_unit,
          margin_percentage: data.margin_percentage,
          annual_revenue_projection: data.annual_revenue_projection,
          notes: data.notes,
          calculated_at: new Date().toISOString()
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
        toast.success('✅ Unit economics calculated!');
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
          <span className="font-medium">Unit Economics Calculated</span>
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

  const margin = watch('margin_per_unit') || 0;
  const marginPct = watch('margin_percentage') || 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Calculate Your Unit Economics</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          For each unit you sell, what's the revenue? What's the cost? What's the margin? 
          This is the most important number in your business.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Price Per Unit ($) *
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            {...register('price_per_unit', { required: 'Price is required', min: 0 })}
            placeholder="99.99"
          />
          {errors.price_per_unit && <p className="text-xs text-destructive">{errors.price_per_unit.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Cost Per Unit ($) *
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            {...register('cost_per_unit', { required: 'Cost is required', min: 0 })}
            placeholder="50.00"
          />
          {errors.cost_per_unit && <p className="text-xs text-destructive">{errors.cost_per_unit.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Margin Per Unit ($)
          </Label>
          <Input
            type="number"
            step="0.01"
            value={margin}
            disabled
            className="bg-muted/30"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Margin Percentage (%)
          </Label>
          <Input
            type="number"
            step="0.01"
            value={marginPct}
            disabled
            className="bg-muted/30"
          />
        </div>
      </div>

      <div className="p-4 border rounded-lg bg-muted/10">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Margin</span>
          <span className={`text-lg font-bold ${margin > 0 ? 'text-emerald-600' : 'text-destructive'}`}>
            {marginPct.toFixed(1)}%
          </span>
        </div>
        {margin <= 0 && (
          <p className="text-xs text-destructive mt-1">
            ⚠️ Your margin is not positive. Consider increasing price or reducing costs.
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">
          Annual Revenue Projection ($)
          <p className="text-xs font-normal text-muted-foreground">
            Based on your price and expected unit sales per year
          </p>
        </Label>
        <Input
          type="number"
          min="0"
          step="0.01"
          {...register('annual_revenue_projection')}
          placeholder="100000"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">
          Notes & Observations
        </Label>
        <Textarea
          {...register('notes')}
          placeholder="What does this tell you about your business viability?"
          className="min-h-[80px] resize-none"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full h-11">
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {isSubmitting ? 'Saving...' : `Save & Earn ${task.grant_points} XP`}
      </Button>
    </form>
  );
}
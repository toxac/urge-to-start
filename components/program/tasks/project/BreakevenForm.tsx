// components/program/tasks/project/BreakevenForm.tsx
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

interface BreakevenData {
  price: number;
  variable_cost_per_unit: number;
  fixed_costs_monthly: number;
  break_even_customers: number;
  break_even_time_months: number;
  notes: string;
}

export function BreakevenForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, watch, formState: { errors } } = useForm<BreakevenData>({
    defaultValues: {
      price: preSavedPayload.price || 0,
      variable_cost_per_unit: preSavedPayload.variable_cost_per_unit || 0,
      fixed_costs_monthly: preSavedPayload.fixed_costs_monthly || 0,
      break_even_customers: preSavedPayload.break_even_customers || 0,
      break_even_time_months: preSavedPayload.break_even_time_months || 0,
      notes: preSavedPayload.notes || '',
    }
  });

  // Watch values for auto-calculation
  const price = watch('price');
  const variableCost = watch('variable_cost_per_unit');
  const fixedCosts = watch('fixed_costs_monthly');
  
  // Calculate break-even customers
  const margin = price - variableCost;
  const calculatedBreakEven = margin > 0 ? Math.ceil(fixedCosts / margin) : 0;

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

  const onSubmit = async (data: BreakevenData) => {
    setIsSubmitting(true);
    try {
      const margin = data.price - data.variable_cost_per_unit;
      const breakEvenCustomers = margin > 0 ? Math.ceil(data.fixed_costs_monthly / margin) : 0;
      
      const payload = {
        break_even: {
          price: data.price,
          variable_cost_per_unit: data.variable_cost_per_unit,
          fixed_costs_monthly: data.fixed_costs_monthly,
          margin_per_unit: margin,
          break_even_customers: breakEvenCustomers,
          break_even_time_months: data.break_even_time_months,
          calculated_at: new Date().toISOString()
        },
        break_even_notes: data.notes
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
        toast.success(`✅ Break-even: ${breakEvenCustomers} customers needed!`);
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
          <span className="font-medium">Break-even Analysis Complete</span>
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
          <h4 className="font-medium">Calculate Your Break-Even Point</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          How many customers do you need to cover your costs? At what price?
          This is the most important number for your business.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Price per Unit ($) *
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            {...register('price', { required: 'Price is required', min: 0 })}
            placeholder="e.g., 99.99"
          />
          {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Variable Cost per Unit ($) *
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            {...register('variable_cost_per_unit', { required: 'Variable cost is required', min: 0 })}
            placeholder="e.g., 20.00"
          />
          {errors.variable_cost_per_unit && <p className="text-xs text-destructive">{errors.variable_cost_per_unit.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Monthly Fixed Costs ($) *
            <p className="text-xs font-normal text-muted-foreground">
              Rent, salaries, software subscriptions, etc.
            </p>
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            {...register('fixed_costs_monthly', { required: 'Fixed costs are required', min: 0 })}
            placeholder="e.g., 5000"
          />
          {errors.fixed_costs_monthly && <p className="text-xs text-destructive">{errors.fixed_costs_monthly.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Break-Even Time (months)
            <p className="text-xs font-normal text-muted-foreground">
              How long to reach break-even?
            </p>
          </Label>
          <Input
            type="number"
            min="0"
            step="0.5"
            {...register('break_even_time_months')}
            placeholder="e.g., 6"
          />
        </div>
      </div>

      {/* Break-even summary */}
      {price > 0 && variableCost >= 0 && fixedCosts > 0 && (
        <div className="p-4 border rounded-lg bg-primary/5">
          <div className="text-sm font-medium text-foreground">
            Break-Even Summary
          </div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Margin per unit:</span>
              <span className="ml-2 font-semibold text-primary">
                ${(price - variableCost).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Break-even customers:</span>
              <span className="ml-2 font-semibold text-primary">
                {calculatedBreakEven > 0 ? calculatedBreakEven : '∞ (loss per unit)'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Monthly revenue at break-even:</span>
              <span className="ml-2 font-semibold text-primary">
                ${(calculatedBreakEven * price).toFixed(2)}
              </span>
            </div>
          </div>
          {margin <= 0 && (
            <p className="text-xs text-destructive mt-2">
              ⚠️ You're losing money on each unit! Increase price or reduce variable costs.
            </p>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">
          Notes & Observations
        </Label>
        <Textarea
          {...register('notes')}
          placeholder="What does this tell you? Is this achievable?"
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
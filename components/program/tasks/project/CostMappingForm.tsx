// components/program/tasks/project/CostMappingForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, DollarSign, X, Plus } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface CostItem {
  name: string;
  amount: number;
}

interface CostMappingData {
  fixed_costs: CostItem[];
  variable_costs: CostItem[];
  one_time_setup_costs: number;
  total_fixed_monthly: number;
  total_variable_monthly: number;
  notes: string;
}

export function CostMappingForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<CostMappingData>({
    defaultValues: {
      fixed_costs: preSavedPayload.fixed_costs || [{ name: '', amount: 0 }],
      variable_costs: preSavedPayload.variable_costs || [{ name: '', amount: 0 }],
      one_time_setup_costs: preSavedPayload.one_time_setup_costs || 0,
      total_fixed_monthly: preSavedPayload.total_fixed_monthly || 0,
      total_variable_monthly: preSavedPayload.total_variable_monthly || 0,
      notes: preSavedPayload.notes || '',
    }
  });

  const { fields: fixedFields, append: appendFixed, remove: removeFixed } = useFieldArray({
    control,
    name: 'fixed_costs'
  });

  const { fields: variableFields, append: appendVariable, remove: removeVariable } = useFieldArray({
    control,
    name: 'variable_costs'
  });

  const fixedCosts = watch('fixed_costs');
  const variableCosts = watch('variable_costs');
  const oneTimeSetup = watch('one_time_setup_costs');

  // Calculate totals automatically
  useEffect(() => {
    const fixedTotal = fixedCosts?.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) || 0;
    const variableTotal = variableCosts?.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) || 0;
    setValue('total_fixed_monthly', fixedTotal);
    setValue('total_variable_monthly', variableTotal);
  }, [fixedCosts, variableCosts, setValue]);

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

  const addFixedCost = () => {
    appendFixed({ name: '', amount: 0 });
  };

  const removeFixedCost = (index: number) => {
    if (fixedFields.length <= 1) {
      toast.error('You need at least one fixed cost entry');
      return;
    }
    removeFixed(index);
  };

  const addVariableCost = () => {
    appendVariable({ name: '', amount: 0 });
  };

  const removeVariableCost = (index: number) => {
    if (variableFields.length <= 1) {
      toast.error('You need at least one variable cost entry');
      return;
    }
    removeVariable(index);
  };

  const onSubmit = async (data: CostMappingData) => {
    setIsSubmitting(true);
    try {
      const filteredFixed = data.fixed_costs.filter(c => c.name.trim() !== '');
      const filteredVariable = data.variable_costs.filter(c => c.name.trim() !== '');
      
      const payload = {
        costs: {
          fixed_costs: filteredFixed,
          variable_costs: filteredVariable,
          one_time_setup_costs: data.one_time_setup_costs,
          total_fixed_monthly: data.total_fixed_monthly,
          total_variable_monthly: data.total_variable_monthly,
          total_monthly_costs: data.total_fixed_monthly + data.total_variable_monthly,
          notes: data.notes,
          mapped_at: new Date().toISOString()
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
        toast.success('✅ Costs mapped!');
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
          <span className="font-medium">Costs Mapped</span>
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

  const totalMonthly = (watch('total_fixed_monthly') || 0) + (watch('total_variable_monthly') || 0);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Map Your Costs</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          What does it cost to deliver your solution? Fixed costs (rent, software, salaries), 
          variable costs (materials, payment processing, delivery), one-time setup costs. 
          Be honest. Include everything. Don't forget your time.
        </p>
      </div>

      <div className="space-y-6">
        {/* Fixed Costs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-medium">Fixed Costs (Monthly)</h5>
            <Button type="button" variant="outline" size="sm" onClick={addFixedCost} className="gap-1">
              <Plus className="w-3.5 h-3.5" /> Add
            </Button>
          </div>
          {fixedFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="flex-1">
                <Input
                  {...register(`fixed_costs.${index}.name`)}
                  placeholder="e.g., Rent, Software subscriptions"
                  className="text-sm"
                />
              </div>
              <div className="w-32">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  {...register(`fixed_costs.${index}.amount`)}
                  placeholder="0.00"
                  className="text-sm"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFixedCost(index)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                disabled={fixedFields.length <= 1}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div className="text-sm text-right">
            Total Fixed: <span className="font-medium">${watch('total_fixed_monthly') || 0}</span>
          </div>
        </div>

        {/* Variable Costs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-medium">Variable Costs (Per Unit / Monthly)</h5>
            <Button type="button" variant="outline" size="sm" onClick={addVariableCost} className="gap-1">
              <Plus className="w-3.5 h-3.5" /> Add
            </Button>
          </div>
          {variableFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="flex-1">
                <Input
                  {...register(`variable_costs.${index}.name`)}
                  placeholder="e.g., Materials, Payment processing"
                  className="text-sm"
                />
              </div>
              <div className="w-32">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  {...register(`variable_costs.${index}.amount`)}
                  placeholder="0.00"
                  className="text-sm"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeVariableCost(index)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                disabled={variableFields.length <= 1}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div className="text-sm text-right">
            Total Variable: <span className="font-medium">${watch('total_variable_monthly') || 0}</span>
          </div>
        </div>

        {/* One-time Setup Costs */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            One-Time Setup Costs ($)
            <p className="text-xs font-normal text-muted-foreground">
              Initial costs to get started (e.g., equipment, legal fees, branding)
            </p>
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            {...register('one_time_setup_costs')}
            placeholder="0.00"
          />
        </div>

        {/* Total Monthly */}
        <div className="p-4 border rounded-lg bg-muted/10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Monthly Costs</span>
            <span className="text-lg font-bold text-primary">${totalMonthly.toFixed(2)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Fixed: ${watch('total_fixed_monthly') || 0} + Variable: ${watch('total_variable_monthly') || 0}
          </p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Notes</Label>
          <Textarea
            {...register('notes')}
            placeholder="Any additional cost considerations..."
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
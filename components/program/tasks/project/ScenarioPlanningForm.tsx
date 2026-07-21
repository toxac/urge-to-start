// components/program/tasks/project/ScenarioPlanningForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface ScenarioPlanningData {
  best_case_customers: number;
  best_case_revenue: number;
  worst_case_customers: number;
  worst_case_revenue: number;
  expected_case_customers: number;
  expected_case_revenue: number;
  scenario_notes: string;
}

export function ScenarioPlanningForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<ScenarioPlanningData>({
    defaultValues: {
      best_case_customers: preSavedPayload.best_case_customers || 0,
      best_case_revenue: preSavedPayload.best_case_revenue || 0,
      worst_case_customers: preSavedPayload.worst_case_customers || 0,
      worst_case_revenue: preSavedPayload.worst_case_revenue || 0,
      expected_case_customers: preSavedPayload.expected_case_customers || 0,
      expected_case_revenue: preSavedPayload.expected_case_revenue || 0,
      scenario_notes: preSavedPayload.scenario_notes || '',
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

  const onSubmit = async (data: ScenarioPlanningData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        scenario_analysis: {
          best_case: {
            customers: data.best_case_customers,
            revenue: data.best_case_revenue
          },
          worst_case: {
            customers: data.worst_case_customers,
            revenue: data.worst_case_revenue
          },
          expected_case: {
            customers: data.expected_case_customers,
            revenue: data.expected_case_revenue
          },
          notes: data.scenario_notes,
          analyzed_at: new Date().toISOString()
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
        toast.success('✅ Scenario planning complete!');
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
          <span className="font-medium">Scenario Planning Complete</span>
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
          <h4 className="font-medium">Scenario Planning</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Run three scenarios: Best case (everything goes right), Worst case (everything goes wrong), 
          and Expected case (probably somewhere in between). If the worst case is survivable and the expected case is good, you have a business.
        </p>
      </div>

      <div className="space-y-6">
        {/* Best Case */}
        <div className="p-4 border rounded-lg bg-emerald-50/20 border-emerald-200/30">
          <div className="flex items-center gap-2 text-emerald-700 mb-3">
            <TrendingUp className="w-4 h-4" />
            <h5 className="font-semibold text-sm">Best Case</h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Best Case Customers *
              </Label>
              <Input
                type="number"
                min="0"
                {...register('best_case_customers', { required: 'Required', min: 0 })}
                placeholder="e.g., 500"
              />
              {errors.best_case_customers && (
                <p className="text-xs text-destructive">{errors.best_case_customers.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Best Case Revenue ($) *
              </Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                {...register('best_case_revenue', { required: 'Required', min: 0 })}
                placeholder="e.g., 50000"
              />
              {errors.best_case_revenue && (
                <p className="text-xs text-destructive">{errors.best_case_revenue.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Worst Case */}
        <div className="p-4 border rounded-lg bg-destructive/5 border-destructive/20">
          <div className="flex items-center gap-2 text-destructive mb-3">
            <TrendingDown className="w-4 h-4" />
            <h5 className="font-semibold text-sm">Worst Case</h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Worst Case Customers *
              </Label>
              <Input
                type="number"
                min="0"
                {...register('worst_case_customers', { required: 'Required', min: 0 })}
                placeholder="e.g., 50"
              />
              {errors.worst_case_customers && (
                <p className="text-xs text-destructive">{errors.worst_case_customers.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Worst Case Revenue ($) *
              </Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                {...register('worst_case_revenue', { required: 'Required', min: 0 })}
                placeholder="e.g., 5000"
              />
              {errors.worst_case_revenue && (
                <p className="text-xs text-destructive">{errors.worst_case_revenue.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Expected Case */}
        <div className="p-4 border rounded-lg bg-muted/20 border-border">
          <div className="flex items-center gap-2 text-foreground mb-3">
            <Minus className="w-4 h-4" />
            <h5 className="font-semibold text-sm">Expected Case</h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Expected Case Customers *
              </Label>
              <Input
                type="number"
                min="0"
                {...register('expected_case_customers', { required: 'Required', min: 0 })}
                placeholder="e.g., 200"
              />
              {errors.expected_case_customers && (
                <p className="text-xs text-destructive">{errors.expected_case_customers.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Expected Case Revenue ($) *
              </Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                {...register('expected_case_revenue', { required: 'Required', min: 0 })}
                placeholder="e.g., 20000"
              />
              {errors.expected_case_revenue && (
                <p className="text-xs text-destructive">{errors.expected_case_revenue.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Scenario Notes
            <p className="text-xs font-normal text-muted-foreground">
              What assumptions are you making? What would cause each scenario?
            </p>
          </Label>
          <Textarea
            {...register('scenario_notes')}
            placeholder="e.g., Best case assumes rapid market adoption, worst case assumes slow growth..."
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
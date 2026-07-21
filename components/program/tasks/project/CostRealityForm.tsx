// components/program/tasks/project/CostRealityForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Eye } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface CostRealityData {
  non_essential_costs: string;
  cost_reduction_ideas: string;
  minimum_viable_cost: string;
  delayed_costs: string;
  notes: string;
}

export function CostRealityForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<CostRealityData>({
    defaultValues: {
      non_essential_costs: preSavedPayload.non_essential_costs || '',
      cost_reduction_ideas: preSavedPayload.cost_reduction_ideas || '',
      minimum_viable_cost: preSavedPayload.minimum_viable_cost || '',
      delayed_costs: preSavedPayload.delayed_costs || '',
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

  const onSubmit = async (data: CostRealityData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        costs: {
          non_essential_costs: data.non_essential_costs,
          cost_reduction_ideas: data.cost_reduction_ideas,
          minimum_viable_cost: data.minimum_viable_cost,
          delayed_costs: data.delayed_costs,
          notes: data.notes,
          reality_checked_at: new Date().toISOString()
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
        toast.success('✅ Cost reality check complete!');
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
          <span className="font-medium">Cost Reality Check Complete</span>
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
          <Eye className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Cost Reality Check</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Look at all your costs. What's absolutely necessary? What could be reduced or eliminated? 
          What could be delayed until later? This is your 'minimum viable cost' exercise.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Non-Essential Costs
            <p className="text-xs font-normal text-muted-foreground">
              What costs can you eliminate without hurting your product?
            </p>
          </Label>
          <Textarea
            {...register('non_essential_costs')}
            placeholder="e.g., Office space, expensive software, fancy branding..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Cost Reduction Ideas
            <p className="text-xs font-normal text-muted-foreground">
              What can you reduce or optimize?
            </p>
          </Label>
          <Textarea
            {...register('cost_reduction_ideas')}
            placeholder="e.g., Use open-source software, negotiate with suppliers, automate..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Minimum Viable Cost
            <p className="text-xs font-normal text-muted-foreground">
              What's the absolute minimum you need to spend to deliver value?
            </p>
          </Label>
          <Textarea
            {...register('minimum_viable_cost')}
            placeholder="e.g., I need $50/month for hosting and $20/month for email..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Costs You Can Delay
            <p className="text-xs font-normal text-muted-foreground">
              What can you postpone until you have revenue?
            </p>
          </Label>
          <Textarea
            {...register('delayed_costs')}
            placeholder="e.g., Legal fees, hiring, paid advertising..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Additional Notes
          </Label>
          <Textarea
            {...register('notes')}
            placeholder="Any other thoughts on costs..."
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
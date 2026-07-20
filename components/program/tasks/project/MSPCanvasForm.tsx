// components/program/tasks/project/MSPCanvasForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, LayoutGrid } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface MSPCanvasData {
  problem: string;
  customer: string;
  solution_format: string;
  minimal_solution: string;
  sellable_feature: string;
  first_customer: string;
  price: string;
}

export function MSPCanvasForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<MSPCanvasData>({
    defaultValues: {
      problem: preSavedPayload.problem || '',
      customer: preSavedPayload.customer || '',
      solution_format: preSavedPayload.solution_format || '',
      minimal_solution: preSavedPayload.minimal_solution || '',
      sellable_feature: preSavedPayload.sellable_feature || '',
      first_customer: preSavedPayload.first_customer || '',
      price: preSavedPayload.price || '',
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

  const onSubmit = async (data: MSPCanvasData) => {
    setIsSubmitting(true);
    try {
      const solutionData = {
        msp_canvas: {
          problem: data.problem,
          customer: data.customer,
          solution_format: data.solution_format,
          minimal_solution: data.minimal_solution,
          sellable_feature: data.sellable_feature,
          first_customer: data.first_customer,
          price: data.price,
        },
        msp_canvas_completed_at: new Date().toISOString()
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
        toast.success('✅ MSP Canvas complete!');
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
          <span className="font-medium">MSP Canvas Complete</span>
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
          <LayoutGrid className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Build Your MSP Canvas</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Put it all together. This is your blueprint for what you're building first.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Problem *</Label>
          <Input
            {...register('problem', { required: 'Problem is required' })}
            placeholder="The core problem you're solving"
          />
          {errors.problem && <p className="text-xs text-destructive">{errors.problem.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Customer *</Label>
          <Input
            {...register('customer', { required: 'Customer is required' })}
            placeholder="Who has this problem?"
          />
          {errors.customer && <p className="text-xs text-destructive">{errors.customer.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Solution Format *</Label>
          <select
            {...register('solution_format', { required: 'Please select a format' })}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select format...</option>
            <option value="service">Service / Agency</option>
            <option value="saas">Software / SaaS</option>
            <option value="marketplace">Marketplace / Platform</option>
            <option value="course">Information / Course</option>
            <option value="physical_product">Physical Product</option>
          </select>
          {errors.solution_format && <p className="text-xs text-destructive">{errors.solution_format.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Price *</Label>
          <Input
            {...register('price', { required: 'Price is required' })}
            placeholder="What will you charge?"
          />
          {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label className="text-sm font-medium">Minimal Solution *</Label>
          <Textarea
            {...register('minimal_solution', { required: 'Minimal solution is required' })}
            placeholder="What's the smallest thing you'll build?"
            className="min-h-[60px] resize-none"
          />
          {errors.minimal_solution && <p className="text-xs text-destructive">{errors.minimal_solution.message}</p>}
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label className="text-sm font-medium">Sellable Feature *</Label>
          <Input
            {...register('sellable_feature', { required: 'Sellable feature is required' })}
            placeholder="What ONE feature will make people pay?"
          />
          {errors.sellable_feature && <p className="text-xs text-destructive">{errors.sellable_feature.message}</p>}
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label className="text-sm font-medium">First Customer</Label>
          <Input
            {...register('first_customer')}
            placeholder="Who will be your first paying customer?"
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
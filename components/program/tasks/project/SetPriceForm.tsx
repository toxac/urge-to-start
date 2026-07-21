// components/program/tasks/project/SetPriceForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Tag } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface SetPriceData {
  price: number;
  price_rationale: string;
  customer_willingness: number | null;
}

export function SetPriceForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<SetPriceData>({
    defaultValues: {
      price: preSavedPayload.price || 0,
      price_rationale: preSavedPayload.price_rationale || '',
      customer_willingness: preSavedPayload.customer_willingness || null,
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

  const onSubmit = async (data: SetPriceData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        price_points: {
          current_price: data.price,
          customer_willingness: data.customer_willingness,
          set_at: new Date().toISOString()
        },
        price_rationale: data.price_rationale
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
        toast.success('✅ Price set!');
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
          <span className="font-medium">Price Set</span>
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
          <Tag className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Set Your Price</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Based on your research, set your price. Compare to competitors. Consider what customers said.
          Trust your gut. Remember: you can always change it later.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Your Price ($) *
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
            Why This Price?
            <p className="text-xs font-normal text-muted-foreground">
              How did you arrive at this number? Consider value, competition, and customer feedback.
            </p>
          </Label>
          <Textarea
            {...register('price_rationale')}
            placeholder="e.g., Customers said they'd pay up to $100, competitors charge $120, and we deliver more value..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            What Customers Said They'd Pay ($)
            <p className="text-xs font-normal text-muted-foreground">
              Optional: What did customers tell you they'd pay?
            </p>
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            {...register('customer_willingness')}
            placeholder="e.g., 75"
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
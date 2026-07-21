// components/program/tasks/project/PricingModelsForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, DollarSign } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface PricingModelsData {
  pricing_model: string;
  pricing_rationale: string;
  competitor_price: number | null;
  notes: string;
}

const PRICING_MODELS = [
  { value: 'one-time', label: 'One-Time Payment', description: 'Customer pays once for lifetime access.' },
  { value: 'subscription', label: 'Subscription (Recurring)', description: 'Customer pays monthly or annually.' },
  { value: 'usage-based', label: 'Usage-Based', description: 'Customer pays based on usage (e.g., per user, per API call).' },
  { value: 'freemium', label: 'Freemium', description: 'Free version with paid upgrades for advanced features.' },
  { value: 'tiered', label: 'Tiered Pricing', description: 'Multiple plans with different features and price points.' },
];

export function PricingModelsForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<PricingModelsData>({
    defaultValues: {
      pricing_model: preSavedPayload.pricing_model || '',
      pricing_rationale: preSavedPayload.pricing_rationale || '',
      competitor_price: preSavedPayload.competitor_price || null,
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

  const onSubmit = async (data: PricingModelsData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        pricing_model: data.pricing_model,
        pricing_rationale: data.pricing_rationale,
        competitor_price: data.competitor_price,
        notes: data.notes,
        explored_at: new Date().toISOString()
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
        toast.success('✅ Pricing models explored!');
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
          <span className="font-medium">Pricing Models Explored</span>
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
          <DollarSign className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Explore Pricing Models</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          How will you charge? One-time? Subscription? Usage-based? Freemium? Tiered?
          Each model has different implications for your business. Explore what fits your product and your customers.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Pricing Model *
          </Label>
          <div className="space-y-2">
            {PRICING_MODELS.map((model) => (
              <label key={model.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/20 transition">
                <input
                  type="radio"
                  value={model.value}
                  {...register('pricing_model', { required: 'Please select a pricing model' })}
                  className="mt-1 h-4 w-4 flex-shrink-0 text-primary"
                />
                <div>
                  <div className="text-sm font-medium text-foreground">{model.label}</div>
                  <div className="text-xs text-muted-foreground">{model.description}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.pricing_model && <p className="text-xs text-destructive">{errors.pricing_model.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Why This Model?
            <p className="text-xs font-normal text-muted-foreground">
              Why does this model fit your product and your customers?
            </p>
          </Label>
          <Textarea
            {...register('pricing_rationale')}
            placeholder="e.g., Our customers prefer predictable monthly costs, and we have ongoing value to deliver..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Competitor Price ($)
            <p className="text-xs font-normal text-muted-foreground">
              What do competitors charge? (Optional)
            </p>
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            {...register('competitor_price')}
            placeholder="e.g., 99.99"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Additional Notes
          </Label>
          <Textarea
            {...register('notes')}
            placeholder="Any other thoughts on pricing..."
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
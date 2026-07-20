// components/program/tasks/project/MSPDefinitionForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Package } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface MSPDefinitionData {
  msp_description: string;
  key_features: string;
  sellable_feature: string;
  first_customer: string;
}

export function MSPDefinitionForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<MSPDefinitionData>({
    defaultValues: {
      msp_description: preSavedPayload.msp_description || '',
      key_features: preSavedPayload.key_features || '',
      sellable_feature: preSavedPayload.sellable_feature || '',
      first_customer: preSavedPayload.first_customer || '',
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

  const onSubmit = async (data: MSPDefinitionData) => {
    setIsSubmitting(true);
    try {
      const solutionData = {
        msp: {
          description: data.msp_description,
          key_features: data.key_features.split('\n').filter(f => f.trim()),
          sellable_feature: data.sellable_feature,
          first_customer: data.first_customer,
        },
        msp_defined_at: new Date().toISOString()
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
        toast.success('✅ Minimum Sellable Product defined!');
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
          <span className="font-medium">MSP Defined</span>
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
          <Package className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Define Your Minimum Sellable Product</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          What's the smallest thing you could build that someone would actually pay for? 
          Not the dream. The thing that gets them from A to B. What's the ONE thing they need right now?
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            MSP Description *
            <p className="text-xs font-normal text-muted-foreground">
              What's the smallest version that delivers value?
            </p>
          </Label>
          <Textarea
            {...register('msp_description', { required: 'MSP description is required', minLength: 10 })}
            placeholder="e.g., A simple tool that helps small business owners track their expenses..."
            className="min-h-[100px] resize-none"
          />
          {errors.msp_description && (
            <p className="text-xs text-destructive">{errors.msp_description.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Key Features (one per line)
            <p className="text-xs font-normal text-muted-foreground">
              List the 3-5 essential features only. What's the minimum needed to deliver value?
            </p>
          </Label>
          <Textarea
            {...register('key_features')}
            placeholder="Expense tracking&#10;Monthly reports&#10;Receipt scanning"
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            The Sellable Feature *
            <p className="text-xs font-normal text-muted-foreground">
              What ONE feature would someone hand over money for TODAY?
            </p>
          </Label>
          <Input
            {...register('sellable_feature', { required: 'Sellable feature is required' })}
            placeholder="e.g., Automated monthly expense reports"
          />
          {errors.sellable_feature && (
            <p className="text-xs text-destructive">{errors.sellable_feature.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            First Customer
            <p className="text-xs font-normal text-muted-foreground">
              Who would buy this tomorrow? Be specific.
            </p>
          </Label>
          <Input
            {...register('first_customer')}
            placeholder="e.g., Sarah, the bakery owner who hates bookkeeping"
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
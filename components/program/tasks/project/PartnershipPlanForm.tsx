// components/program/tasks/project/PartnershipPlanForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Handshake } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface PartnershipPlanData {
  partnership_strategy: string;
  target_partner_types: string;
  partnership_approach: string;
  timeline: string;
  notes: string;
}

export function PartnershipPlanForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<PartnershipPlanData>({
    defaultValues: {
      partnership_strategy: preSavedPayload.partnership_strategy || '',
      target_partner_types: preSavedPayload.target_partner_types || '',
      partnership_approach: preSavedPayload.partnership_approach || '',
      timeline: preSavedPayload.timeline || '',
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

  const onSubmit = async (data: PartnershipPlanData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        partnerships: {
          strategy: data.partnership_strategy,
          target_partner_types: data.target_partner_types,
          approach: data.partnership_approach,
          timeline: data.timeline,
          notes: data.notes,
          planned_at: new Date().toISOString()
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
        toast.success('✅ Partnership plan saved!');
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
          <span className="font-medium">Partnership Plan Complete</span>
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
          <Handshake className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Plan Your Partnership Strategy</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Based on your research and conversations, what's your partnership strategy? 
          Which partners are most promising? What would a win-win partnership look like?
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Partnership Strategy *
            <p className="text-xs font-normal text-muted-foreground">
              What's your overall approach to partnerships?
            </p>
          </Label>
          <Textarea
            {...register('partnership_strategy', { required: 'Strategy is required' })}
            placeholder="e.g., We'll partner with complementary businesses to offer bundled services..."
            className="min-h-[100px] resize-none"
          />
          {errors.partnership_strategy && (
            <p className="text-xs text-destructive">{errors.partnership_strategy.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Target Partner Types
            <p className="text-xs font-normal text-muted-foreground">
              What types of partners are you targeting?
            </p>
          </Label>
          <Textarea
            {...register('target_partner_types')}
            placeholder="e.g., Industry associations, complementary service providers, influencers..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Partnership Approach
            <p className="text-xs font-normal text-muted-foreground">
              How will you approach and engage potential partners?
            </p>
          </Label>
          <Textarea
            {...register('partnership_approach')}
            placeholder="e.g., Start with warm introductions, offer co-marketing opportunities..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Timeline
            <p className="text-xs font-normal text-muted-foreground">
              What's your timeline for building partnerships?
            </p>
          </Label>
          <Textarea
            {...register('timeline')}
            placeholder="e.g., Reach out to 5 partners this month, aim for 2 partnerships in Q2..."
            className="min-h-[60px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Additional Notes
          </Label>
          <Textarea
            {...register('notes')}
            placeholder="Any other thoughts on partnerships..."
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
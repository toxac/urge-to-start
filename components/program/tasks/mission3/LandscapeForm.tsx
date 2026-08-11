// components/program/tasks/mission3/LandscapeForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/types/supabase';
import { 
  getActiveProjectAction, 
  updateProjectLandscapeAction
} from '@/actions/projects';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { CompetitiveLandscapePayload } from '@/types/projects';
import { 
  Loader2, 
  AlertCircle, 
  Compass, 
  TrendingUp, 
  Users2, 
  ShieldAlert, 
  ArrowRight 
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

interface LandscapeInputs {
  macro_trend: string;
  competitors_and_diy: string;
  what_is_working: string;
  what_is_failing_or_hard: string;
  customer_gather_spots: string;
}

export function LandscapeForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isCompleted = existingProgress?.status === 'completed';

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<LandscapeInputs>();

  useEffect(() => {
    async function loadData() {
      const res = await getActiveProjectAction();
      if (res.success) {
        setActiveProject(res.data);
        const landscape = (res.data.competitive_landscape as any) || {};

        if (landscape.macro_trend) setValue('macro_trend', landscape.macro_trend);
        if (landscape.competitors_and_diy) setValue('competitors_and_diy', landscape.competitors_and_diy);
        if (landscape.what_is_working) setValue('what_is_working', landscape.what_is_working);
        if (landscape.what_is_failing_or_hard) setValue('what_is_failing_or_hard', landscape.what_is_failing_or_hard);
        if (landscape.customer_gather_spots) setValue('customer_gather_spots', landscape.customer_gather_spots);
      } else {
        setErrorMessage(res.error || 'Failed to load active project');
      }
    }
    loadData();
  }, [reset, setValue]);

  const onSubmitLandscape = async (data: LandscapeInputs) => {
    if (!activeProject) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const landscapePayload: CompetitiveLandscapePayload = {
      ...data
    };

    const updateRes = await updateProjectLandscapeAction(activeProject.id, landscapePayload);

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to save landscape analysis');
      setIsSubmitting(false);
      return;
    }

    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        landscape: landscapePayload
      }
    });

    if (taskRes.success && onSuccess) {
      onSuccess();
    } else {
      setErrorMessage(taskRes.error || 'Failed to complete step');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6 text-left">
      {errorMessage && (
        <div className="p-4 border rounded-xl bg-destructive/10 border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ACTIVE PROJECT BANNER */}
      {activeProject && (
        <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary shrink-0" />
            <span className="font-bold text-foreground">
              Mapping Environment for: <span className="text-primary">{activeProject.biz_name || 'Active Venture'}</span>
            </span>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary bg-primary/10">
            Market Intelligence
          </Badge>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmitLandscape)} className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
            Map the Ecosystem & Competitive Landscape
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {task.briefing_text}
          </p>
        </div>

        {/* Macro Trend */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            What macro trend or shift makes this problem more urgent now? *
          </Label>
          <Textarea
            className="text-xs bg-background min-h-[65px]"
            placeholder="e.g. Rise of short-form video algorithms forcing small business owners to post daily or lose reach."
            {...register('macro_trend', { required: true, minLength: 10 })}
          />
          {errors.macro_trend && (
            <p className="text-[11px] text-destructive font-semibold">Please describe a macro trend or timing factor.</p>
          )}
        </div>

        {/* Competitors & DIY Workarounds */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            Who else solves this? (Include full-service agencies + hacky DIY workarounds) *
          </Label>
          <Textarea
            className="text-xs bg-background min-h-[70px]"
            placeholder="e.g. Canva templates (DIY), local social media freelancers ($500/mo), and generic AI post generators."
            {...register('competitors_and_diy', { required: true })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* What's Working */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              What is clearly working in this space? *
            </Label>
            <Textarea
              className="text-xs bg-background min-h-[70px]"
              placeholder="e.g. Simple monthly template packs and short 15-minute weekly strategy calls."
              {...register('what_is_working', { required: true })}
            />
          </div>

          {/* What's Hard or Failing */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              What is hard or where are incumbents failing? *
            </Label>
            <Textarea
              className="text-xs bg-background min-h-[70px]"
              placeholder="e.g. Traditional agencies are too expensive ($2k/mo) and generic templates feel completely unauthentic to local café customers."
              {...register('what_is_failing_or_hard', { required: true })}
            />
          </div>
        </div>

        {/* Watering Holes */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            Where do your exact target customers gather online or offline? *
          </Label>
          <Textarea
            className="text-xs bg-background min-h-[65px]"
            placeholder="e.g. Local Specialty Coffee Association Facebook groups, Instagram DMs, regional roaster trade shows."
            {...register('customer_gather_spots', { required: true })}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Save Landscape Mapping & Complete Quest 3 Task 1 (+{task.grant_points} XP)</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
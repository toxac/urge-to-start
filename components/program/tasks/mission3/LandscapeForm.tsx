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
import { analyzeMarketLandscapeAction } from '@/actions/assessments';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { CompetitiveLandscapePayload } from '@/types/projects';
import { TaskResourcesList } from '../TaskResourcesList';
import { 
  Loader2, 
  AlertCircle, 
  Compass, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Edit2
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

interface LandscapeInputs {
  macro_trend: string;
  competitors_and_diy: string;
  what_is_working: string;
  what_is_failing_or_hard: string;
}

export function LandscapeForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [savedLandscape, setSavedLandscape] = useState<CompetitiveLandscapePayload | null>(null);

  const isCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isCompleted);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<LandscapeInputs>();

  useEffect(() => {
    async function loadData() {
      const res = await getActiveProjectAction();
      if (res.success && res.data) {
        setActiveProject(res.data);
        const landscape = (res.data.competitive_landscape as any) || {};

        if (landscape.macro_trend || landscape.competitors_and_diy) {
          setSavedLandscape(landscape);
        }

        if (landscape.macro_trend) setValue('macro_trend', landscape.macro_trend);
        if (landscape.competitors_and_diy) setValue('competitors_and_diy', landscape.competitors_and_diy);
        if (landscape.what_is_working) setValue('what_is_working', landscape.what_is_working);
        if (landscape.what_is_failing_or_hard) setValue('what_is_failing_or_hard', landscape.what_is_failing_or_hard);
      } else {
        setErrorMessage(!res.success ? res.error : 'Failed to load active project');
      }
    }
    loadData();
  }, [reset, setValue]);

  const handleAiAnalysis = async () => {
    if (!activeProject) return;

    setIsAiLoading(true);
    setErrorMessage(null);

    const res = await analyzeMarketLandscapeAction(activeProject);

    if (res.success && res.data) {
      if (res.data.macro_trend) setValue('macro_trend', res.data.macro_trend);
      if (res.data.competitors_and_diy) setValue('competitors_and_diy', res.data.competitors_and_diy);
      if (res.data.what_is_working) setValue('what_is_working', res.data.what_is_working);
      if (res.data.what_is_failing_or_hard) setValue('what_is_failing_or_hard', res.data.what_is_failing_or_hard);
    } else {
      setErrorMessage(res.error || 'Failed to analyze market landscape with AI.');
    }

    setIsAiLoading(false);
  };

  const onSubmitLandscape = async (data: LandscapeInputs) => {
    if (!activeProject) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const landscapePayload: CompetitiveLandscapePayload = {
      ...data,
      customer_gather_spots: (activeProject.discovery_metrics as any)?.customer_personas?.[0]?.watering_holes || ''
    };

    const updateRes = await updateProjectLandscapeAction(activeProject.id, landscapePayload);

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to save market details');
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

    if (taskRes.success) {
      setSavedLandscape(landscapePayload);
      setIsEditing(false);
      if (onSuccess) onSuccess();
    } else {
      setErrorMessage(taskRes.error || 'Failed to complete step');
    }
    setIsSubmitting(false);
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
              Market Context: <span className="text-primary">{activeProject.biz_name || 'Active Project'}</span>
            </span>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary bg-primary/10">
            Market Mapping
          </Badge>
        </div>
      )}

      {/* RECOMMENDED RESOURCES / PLAYBOOK GUIDES */}
      <TaskResourcesList resources={task.resources} />

      {/* READ-ONLY COMPLETED VIEW */}
      {savedLandscape && !isEditing ? (
        <div className="w-full space-y-5 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Market Landscape Analysis Saved
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Market Analysis
            </Button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Why Now / Market Timing</span>
              <p className="text-xs font-medium text-foreground">{savedLandscape.macro_trend}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Competitors & DIY Alternatives</span>
              <p className="text-xs font-medium text-foreground">{savedLandscape.competitors_and_diy}</p>
            </div>
          </div>
        </div>
      ) : (
        /* FORM VIEW */
        <form onSubmit={handleSubmit(onSubmitLandscape)} className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/40">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                Understand Your Market & Competitors
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Examine the options your target audience has today and identify where existing solutions leave a gap.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAiAnalysis}
              disabled={isAiLoading || !activeProject}
              className="h-8 px-3 text-xs font-bold gap-1.5 text-primary border-primary/30 hover:bg-primary/10 shrink-0 cursor-pointer"
            >
              {isAiLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span>{isAiLoading ? 'Analyzing...' : 'Draft with AI'}</span>
            </Button>
          </div>

          {/* 1. Why Now? */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              1. Why is this problem important right now? What changed recently? *
            </Label>
            <Textarea
              className="text-xs leading-relaxed bg-background min-h-[65px]"
              placeholder="e.g. Everyone is using short video apps now, so small businesses are forced to post daily just to get seen."
              {...register('macro_trend', { required: true, minLength: 10 })}
            />
            {errors.macro_trend && (
              <p className="text-[11px] text-destructive font-semibold">Please explain why this matters right now.</p>
            )}
          </div>

          {/* 2. Competitors & DIY Fixes */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              2. Who else offers a solution? (Include other apps, freelancers, or DIY fixes people use) *
            </Label>
            <Textarea
              className="text-xs leading-relaxed bg-background min-h-[70px]"
              placeholder="e.g. Canva templates (DIY), hiring local agency freelancers ($500/month), or manually copy-pasting posts."
              {...register('competitors_and_diy', { required: true })}
            />
          </div>

          {/* 3. What works? */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              3. What do existing solutions do well? *
            </Label>
            <Textarea
              className="text-xs leading-relaxed bg-background min-h-[70px]"
              placeholder="e.g. They provide lots of pretty graphic templates and easy drag-and-drop editors."
              {...register('what_is_working', { required: true })}
            />
          </div>

          {/* 4. What fails or is hard? */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              4. Where do existing options fall short? What do people dislike? *
            </Label>
            <Textarea
              className="text-xs leading-relaxed bg-background min-h-[70px]"
              placeholder="e.g. Agencies are too expensive and DIY templates take too long to customize every week."
              {...register('what_is_failing_or_hard', { required: true })}
            />
          </div>

          <div className="flex gap-2 pt-2">
            {isCompleted && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditing(false)}
                className="h-10 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-10 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Save Market Analysis & Complete Task</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
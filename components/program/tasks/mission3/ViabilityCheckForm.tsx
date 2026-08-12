// components/program/tasks/mission3/ViabilityCheckForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Database } from '@/types/supabase';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  getActiveProjectAction, 
  updateProjectViabilityAction
} from '@/actions/projects';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { TaskResourcesList } from '../TaskResourcesList';
import { Loader2, AlertCircle, HeartHandshake, ArrowRight, CheckCircle2, Edit2 } from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

interface ViabilityInputs {
  months_commitment: 'all_in' | 'mostly_ready' | 'unsure' | 'not_ready';
  excitement_level: 'super_excited' | 'still_curious' | 'feeling_meh' | 'lost_interest';
  biggest_obstacle: string;
  when_to_pause: string;
}

export function ViabilityCheckForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [savedViability, setSavedViability] = useState<ViabilityInputs | null>(null);

  const isCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isCompleted);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ViabilityInputs>({
    defaultValues: {
      months_commitment: 'mostly_ready',
      excitement_level: 'still_curious'
    }
  });

  useEffect(() => {
    async function loadData() {
      const res = await getActiveProjectAction();
      if (res.success && res.data) {
        setActiveProject(res.data);
        const viability = (res.data.viability_check as any) || {};

        if (viability.months_commitment || viability.excitement_level) {
          const current: ViabilityInputs = {
            months_commitment: viability.months_commitment || 'mostly_ready',
            excitement_level: viability.excitement_level || 'still_curious',
            biggest_obstacle: viability.biggest_obstacle || viability.biggest_risk || '',
            when_to_pause: viability.when_to_pause || viability.kill_criteria || ''
          };
          setSavedViability(current);
        }

        if (viability.months_commitment) setValue('months_commitment', viability.months_commitment);
        if (viability.excitement_level) setValue('excitement_level', viability.excitement_level);
        if (viability.biggest_obstacle) setValue('biggest_obstacle', viability.biggest_obstacle);
        if (viability.when_to_pause) setValue('when_to_pause', viability.when_to_pause);
        
        if (!viability.biggest_obstacle && viability.biggest_risk) setValue('biggest_obstacle', viability.biggest_risk);
        if (!viability.when_to_pause && viability.kill_criteria) setValue('when_to_pause', viability.kill_criteria);
      } else {
        setErrorMessage(!res.success ? res.error : 'Failed to load active project');
      }
    }
    loadData();
  }, [reset, setValue]);

  const onSubmitViability = async (data: ViabilityInputs) => {
    if (!activeProject) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const updateRes = await updateProjectViabilityAction(activeProject.id, data);

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to save reality check');
      setIsSubmitting(false);
      return;
    }

    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        viability: data
      }
    });

    if (taskRes.success) {
      setSavedViability(data);
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

      {/* RECOMMENDED RESOURCES / PLAYBOOK GUIDES */}
      <TaskResourcesList resources={task.resources} />

      {/* READ-ONLY COMPLETED VIEW */}
      {savedViability && !isEditing ? (
        <div className="w-full space-y-5 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Reality & Energy Check Saved
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Energy Check
            </Button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-card border border-border/60">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">3–6 Month Commitment</span>
                <p className="text-xs font-bold text-foreground capitalize">{savedViability.months_commitment.replace(/_/g, ' ')}</p>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border/60">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Excitement Level</span>
                <p className="text-xs font-bold text-foreground capitalize">{savedViability.excitement_level.replace(/_/g, ' ')}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Main Potential Obstacle</span>
              <p className="text-xs font-medium text-foreground">{savedViability.biggest_obstacle}</p>
            </div>
          </div>
        </div>
      ) : (
        /* FORM VIEW */
        <form onSubmit={handleSubmit(onSubmitViability)} className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-500" />
              Reality & Energy Check
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Now that you've looked closely at your potential customers and competitors, let's check in on how you're feeling about building this project.
            </p>
          </div>

          {/* 1. Time Commitment */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              1. Can you see yourself giving consistent effort to this project over the next 3 to 6 months? *
            </Label>
            <Select
              value={watch('months_commitment') || 'mostly_ready'}
              onValueChange={(val) => setValue('months_commitment', (val ?? 'mostly_ready') as any)}
            >
              <SelectTrigger className="w-full text-xs h-9 bg-background">
                <SelectValue placeholder="Select commitment level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_in">🚀 All in — I'm ready to focus on this every week</SelectItem>
                <SelectItem value="mostly_ready">👍 Mostly ready — I can fit this into my routine</SelectItem>
                <SelectItem value="unsure">🤔 Unsure — I might have competing priorities</SelectItem>
                <SelectItem value="not_ready">⏸️ Not ready — I don't have enough bandwidth right now</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 2. Genuine Passion / Excitement */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              2. How do you feel about this idea after doing all your research? *
            </Label>
            <Select
              value={watch('excitement_level') || 'still_curious'}
              onValueChange={(val) => setValue('excitement_level', (val ?? 'still_curious') as any)}
            >
              <SelectTrigger className="w-full text-xs h-9 bg-background">
                <SelectValue placeholder="Select excitement level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="super_excited">🔥 Super excited — I really want to see this exist</SelectItem>
                <SelectItem value="still_curious">💡 Still curious — I want to build a simple version and test it</SelectItem>
                <SelectItem value="feeling_meh">😐 Feeling okay — But I'm losing some interest</SelectItem>
                <SelectItem value="lost_interest">🛑 Lost interest — I don't feel passionate about this anymore</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 3. Main Obstacle */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              3. What is the biggest thing that might get in your way as you start building? *
            </Label>
            <Textarea
              className="text-xs leading-relaxed bg-background min-h-[65px]"
              placeholder="e.g. Finding enough free time with my school schedule, or staying motivated if people don't reply immediately."
              {...register('biggest_obstacle', { required: true, minLength: 5 })}
            />
            {errors.biggest_obstacle && (
              <p className="text-[11px] text-destructive font-semibold">Please mention what might get in your way.</p>
            )}
          </div>

          {/* 4. When to Pause / Pivot */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              4. How will you know if it's time to pause or try a different idea? *
            </Label>
            <Textarea
              className="text-xs leading-relaxed bg-background min-h-[65px]"
              placeholder="e.g. If I talk to 10 more people and nobody is interested in trying my first version."
              {...register('when_to_pause', { required: true, minLength: 5 })}
            />
            {errors.when_to_pause && (
              <p className="text-[11px] text-destructive font-semibold">Please tell us when you would decide to pause.</p>
            )}
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
                  <span>Save Energy Check & Continue</span>
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
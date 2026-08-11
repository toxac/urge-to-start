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
import { ViabilityCheckPayload } from '@/types/projects';
import { Loader2, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

interface ViabilityInputs {
  first_sale_14_days: 'yes' | 'maybe' | 'no';
  resources_available: 'yes' | 'mostly' | 'no';
  stamina_6_months: 'absolutely' | 'probably' | 'uncertain' | 'probably_not';
  biggest_risk: string;
  kill_criteria: string;
}

export function ViabilityCheckForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ViabilityInputs>({
    defaultValues: {
      first_sale_14_days: 'maybe',
      resources_available: 'yes',
      stamina_6_months: 'probably'
    }
  });

  useEffect(() => {
    async function loadData() {
      const res = await getActiveProjectAction();
      if (res.success) {
        setActiveProject(res.data);
        const viability = (res.data.viability_check as any) || {};

        if (viability.first_sale_14_days) setValue('first_sale_14_days', viability.first_sale_14_days);
        if (viability.resources_available) setValue('resources_available', viability.resources_available);
        if (viability.stamina_6_months) setValue('stamina_6_months', viability.stamina_6_months);
        if (viability.biggest_risk) setValue('biggest_risk', viability.biggest_risk);
        if (viability.kill_criteria) setValue('kill_criteria', viability.kill_criteria);
      } else {
        setErrorMessage(res.error || 'Failed to load active project');
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
      setErrorMessage(updateRes.error || 'Failed to save viability assessment');
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

      <form onSubmit={handleSubmit(onSubmitViability)} className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Check Project Viability
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {task.briefing_text}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* First Sale Timeline */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              First sale within 14 days? *
            </Label>
            <Select
              value={watch('first_sale_14_days') || 'maybe'}
              onValueChange={(val) => setValue('first_sale_14_days', (val ?? 'maybe') as any)}
            >
              <SelectTrigger className="text-xs h-9 bg-background">
                <SelectValue placeholder="Select feasibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">✅ Yes</SelectItem>
                <SelectItem value="maybe">🤔 Maybe, with effort</SelectItem>
                <SelectItem value="no">❌ No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Current Resources */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Current time/cash sufficient? *
            </Label>
            <Select
              value={watch('resources_available') || 'yes'}
              onValueChange={(val) => setValue('resources_available', (val ?? 'yes') as any)}
            >
              <SelectTrigger className="text-xs h-9 bg-background">
                <SelectValue placeholder="Select feasibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">✅ Yes</SelectItem>
                <SelectItem value="mostly">🤔 Mostly, with some gaps</SelectItem>
                <SelectItem value="no">❌ No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Founder Stamina */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              6-Month Founder Stamina? *
            </Label>
            <Select
              value={watch('stamina_6_months') || 'probably'}
              onValueChange={(val) => setValue('stamina_6_months', (val ?? 'probably') as any)}
            >
              <SelectTrigger className="text-xs h-9 bg-background">
                <SelectValue placeholder="Select stamina" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="absolutely">✅ Absolutely committed</SelectItem>
                <SelectItem value="probably">🤔 Probably</SelectItem>
                <SelectItem value="uncertain">❓ Uncertain</SelectItem>
                <SelectItem value="probably_not">❌ Probably not</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Biggest Threat */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            What is the single biggest threat or execution risk to this project? *
          </Label>
          <Textarea
            className="text-xs bg-background min-h-[65px]"
            placeholder="e.g., If café owners rely entirely on word-of-mouth and refuse to pay for online outreach."
            {...register('biggest_risk', { required: true, minLength: 10 })}
          />
          {errors.biggest_risk && (
            <p className="text-[11px] text-destructive font-semibold">Please name your biggest risk.</p>
          )}
        </div>

        {/* Kill Criteria */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            What is your Kill Criteria? ("I will stop or pivot if...") *
          </Label>
          <Textarea
            className="text-xs bg-background min-h-[65px]"
            placeholder="e.g., I will stop or pivot if I talk to 15 prospects and make zero sales after 21 days."
            {...register('kill_criteria', { required: true, minLength: 10 })}
          />
          {errors.kill_criteria && (
            <p className="text-[11px] text-destructive font-semibold">Please state your kill criteria.</p>
          )}
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
              <span>Save Viability Check & Continue (+{task.grant_points} XP)</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
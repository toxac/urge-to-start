// components/program/tasks/mission3/MSPBuildForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  updateProjectSolutionDesignAction
} from '@/actions/projects';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { MSPPayload } from '@/types/projects';
import { 
  Loader2, 
  AlertCircle, 
  Wrench, 
  DollarSign, 
  Clock, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

interface MSPBuildInputs {
  perceived_value_price: string;
  delivery_channel: string;
  resources_needed: string;
  time_to_first_sale: 'hours' | 'days' | 'weeks' | 'months';
  differentiation_vs_diy: string;
}

export function MSPBuildForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [mspSummary, setMspSummary] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isCompleted = existingProgress?.status === 'completed';

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<MSPBuildInputs>({
    defaultValues: {
      delivery_channel: 'video_call',
      time_to_first_sale: 'days'
    }
  });

  useEffect(() => {
    async function loadData() {
      const res = await getActiveProjectAction();
      if (res.success) {
        setActiveProject(res.data);
        const design = (res.data.solution_design as any) || {};
        const msp: Partial<MSPPayload> = design.msp || {};

        if (msp.one_sentence_description) setMspSummary(msp.one_sentence_description);
        if (msp.perceived_value_price) setValue('perceived_value_price', msp.perceived_value_price);
        if (msp.delivery_channel) setValue('delivery_channel', msp.delivery_channel);
        if (msp.resources_needed) setValue('resources_needed', msp.resources_needed);
        if (msp.time_to_first_sale) setValue('time_to_first_sale', msp.time_to_first_sale);
        if (msp.differentiation_vs_diy) setValue('differentiation_vs_diy', msp.differentiation_vs_diy);
      } else {
        setErrorMessage(res.error || 'Failed to load active project');
      }
    }
    loadData();
  }, [reset, setValue]);

  const onSubmitMSPBuild = async (data: MSPBuildInputs) => {
    if (!activeProject) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const mspPartial: Partial<MSPPayload> = {
      ...data
    };

    const updateRes = await updateProjectSolutionDesignAction(activeProject.id, mspPartial);

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to save MSP build details');
      setIsSubmitting(false);
      return;
    }

    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        msp_build: data
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

      {/* MSP DEFINITION SUMMARY BANNER */}
      {mspSummary && (
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Your Minimum Sellable Product:
          </span>
          <p className="text-xs font-semibold text-foreground leading-relaxed">
            "{mspSummary}"
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmitMSPBuild)} className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5" />
            Build Specifications & Willingness-to-Pay
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {task.briefing_text}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Price / Willingness to Pay */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Initial Price Point (Based on customer feedback) *
            </Label>
            <Input
              type="text"
              placeholder="e.g., $97/month or $250 one-time"
              className="text-xs h-9 bg-background"
              {...register('perceived_value_price', { required: true })}
            />
          </div>

          {/* Delivery Channel */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Primary Delivery Channel *
            </Label>
            <Select
              value={watch('delivery_channel') || 'video_call'}
              onValueChange={(val) => setValue('delivery_channel', val ?? 'video_call')}
            >
              <SelectTrigger className="text-xs h-9 bg-background">
                <SelectValue placeholder="Select delivery channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video_call">Video Call (Zoom / Google Meet)</SelectItem>
                <SelectItem value="email">Email / Direct Delivery</SelectItem>

                <SelectItem value="simple_website">Simple Web Page / Landing Page</SelectItem>
                <SelectItem value="instagram_dm">Instagram / Social DM</SelectItem>
                <SelectItem value="pdf_download">PDF Download / Digital Asset</SelectItem>
                <SelectItem value="in_person">In-Person Service</SelectItem>
                <SelectItem value="other">Other Channel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Time to First Sale */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Estimated Time to First Sale *
            </Label>
            <Select
              value={watch('time_to_first_sale') || 'days'}
              onValueChange={(val) => setValue('time_to_first_sale', (val ?? 'days') as any)}
            >
              <SelectTrigger className="text-xs h-9 bg-background">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">⚡ Hours (Can sell today)</SelectItem>
                <SelectItem value="days">🚀 Days (Can sell within 1 week)</SelectItem>
                <SelectItem value="weeks">📅 Weeks (Needs light prep)</SelectItem>
                <SelectItem value="months">⏳ Months (Higher complexity)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resources Needed */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Resources Needed for First Sale *
            </Label>
            <Input
              type="text"
              placeholder="e.g., Simple payment link + 30 mins of prep time"
              className="text-xs h-9 bg-background"
              {...register('resources_needed', { required: true })}
            />
          </div>
        </div>

        {/* Differentiation vs DIY Workaround */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            Why will customers choose this over their current hacky workaround? *
          </Label>
          <Textarea
            className="text-xs bg-background min-h-[75px]"
            placeholder="e.g., Because doing it themselves takes 3 hours every Sunday; our MSP gives them their weekends back for under $100."
            {...register('differentiation_vs_diy', { required: true, minLength: 10 })}
          />
          {errors.differentiation_vs_diy && (
            <p className="text-[11px] text-destructive font-semibold">Please explain your differentiation against workarounds.</p>
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
              <span>Save Specifications & Complete Quest 2 (+{task.grant_points} XP)</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
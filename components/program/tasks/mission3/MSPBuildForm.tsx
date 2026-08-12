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
import { TaskResourcesList } from '../TaskResourcesList';
import { 
  Loader2, 
  AlertCircle, 
  Send, 
  ArrowRight,
  CheckCircle2,
  Edit2
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

interface MSPBuildInputs {
  perceived_value_price: string;
  delivery_channel: string;
  development_time: string;
  resources_readiness: string;
  differentiation_vs_diy: string;
}

export function MSPBuildForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [mspSummary, setMspSummary] = useState<string | null>(null);
  const [savedBuild, setSavedBuild] = useState<MSPBuildInputs | null>(null);

  const isCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isCompleted);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<MSPBuildInputs>({
    defaultValues: {
      delivery_channel: 'web_app',
      development_time: '1_to_2_weeks',
      resources_readiness: 'yes_all_available'
    }
  });

  useEffect(() => {
    async function loadData() {
      const res = await getActiveProjectAction();
      if (res.success && res.data) {
        setActiveProject(res.data);
        const design = (res.data.solution_design as any) || {};
        const msp: Partial<MSPPayload> = design.msp || {};

        if (msp.one_sentence_description) setMspSummary(msp.one_sentence_description);
        
        const currentInputs: MSPBuildInputs = {
          perceived_value_price: msp.perceived_value_price || '',
          delivery_channel: msp.delivery_channel || 'web_app',
          development_time: (msp as any).development_time || '1_to_2_weeks',
          resources_readiness: (msp as any).resources_readiness || 'yes_all_available',
          differentiation_vs_diy: msp.differentiation_vs_diy || ''
        };

        if (msp.perceived_value_price || msp.delivery_channel) {
          setSavedBuild(currentInputs);
        }

        if (msp.perceived_value_price) setValue('perceived_value_price', msp.perceived_value_price);
        if (msp.delivery_channel) setValue('delivery_channel', msp.delivery_channel);
        if (msp.differentiation_vs_diy) setValue('differentiation_vs_diy', msp.differentiation_vs_diy);
        if ((msp as any).development_time) setValue('development_time', (msp as any).development_time);
        if ((msp as any).resources_readiness) setValue('resources_readiness', (msp as any).resources_readiness);
      } else {
        setErrorMessage(!res.success ? res.error : 'Failed to load active project');
      }
    }
    loadData();
  }, [reset, setValue]);

  const onSubmitMSPBuild = async (data: MSPBuildInputs) => {
    if (!activeProject) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const mspPartial = {
      perceived_value_price: data.perceived_value_price,
      delivery_channel: data.delivery_channel,
      development_time: data.development_time,
      resources_readiness: data.resources_readiness,
      differentiation_vs_diy: data.differentiation_vs_diy,
      resources_needed: data.resources_readiness
    };

    const updateRes = await updateProjectSolutionDesignAction(activeProject.id, mspPartial);

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to save solution delivery details');
      setIsSubmitting(false);
      return;
    }

    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        msp_delivery: data
      }
    });

    if (taskRes.success) {
      setSavedBuild(data);
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

      {/* MSP DEFINITION SUMMARY BANNER */}
      {mspSummary && (
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Your Defined Minimum Sellable Product:
          </span>
          <p className="text-xs font-semibold text-foreground leading-relaxed">
            "{mspSummary}"
          </p>
        </div>
      )}

      {/* RECOMMENDED RESOURCES / PLAYBOOK GUIDES */}
      <TaskResourcesList resources={task.resources} />

      {/* READ-ONLY COMPLETED VIEW */}
      {savedBuild && !isEditing ? (
        <div className="w-full space-y-5 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Delivery Specifications Saved
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Specifications
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-card border border-border/60">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Price Point</span>
              <p className="text-xs font-bold text-foreground">{savedBuild.perceived_value_price}</p>
            </div>
            <div className="p-3 rounded-xl bg-card border border-border/60">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Delivery Method</span>
              <p className="text-xs font-bold text-foreground capitalize">{savedBuild.delivery_channel.replace(/_/g, ' ')}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1 text-xs">
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">Differentiation vs Workarounds</span>
            <p className="text-xs font-medium text-foreground">{savedBuild.differentiation_vs_diy}</p>
          </div>
        </div>
      ) : (
        /* FORM VIEW */
        <form onSubmit={handleSubmit(onSubmitMSPBuild)} className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-amber-500" />
              Delivering Your Solution to Customers
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Round off your product vision by clarifying how much customers will pay, how they will receive the solution, and what resources you need to deliver your first sale.
            </p>
          </div>

          {/* 1. Pricing / Willingness to Pay */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              1. How much will customers pay for this solution? *
            </Label>
            <Input
              type="text"
              placeholder="e.g., $49/month, $199 one-time, or $15 per order"
              className="text-xs h-9 bg-background"
              {...register('perceived_value_price', { required: true })}
            />
            {errors.perceived_value_price && (
              <p className="text-[11px] text-destructive font-semibold">Please state the price or payment structure.</p>
            )}
          </div>

          {/* 2. Delivery Method */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              2. How will the solution be delivered to the customer? *
            </Label>
            <Select
              value={watch('delivery_channel') || 'web_app'}
              onValueChange={(val) => setValue('delivery_channel', val ?? 'web_app')}
            >
              <SelectTrigger className="w-full text-xs h-9 bg-background">
                <SelectValue placeholder="Select delivery format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web_app">🌐 Web Application (SaaS / Browser-based tool)</SelectItem>
                <SelectItem value="mobile_app">📱 Mobile Application (iOS / Android App)</SelectItem>
                <SelectItem value="digital_direct">📩 Digital Direct (Video Call, Email, PDF, eBook, Template)</SelectItem>
                <SelectItem value="content_channel">📢 Content & Channels (Instagram, Blog, Newsletter, Community)</SelectItem>
                <SelectItem value="physical_dtc">📦 Physical Product (Direct-To-Consumer / E-Commerce)</SelectItem>
                <SelectItem value="physical_retail">🏪 Physical Product (Retail Store / Offline Distribution)</SelectItem>
                <SelectItem value="in_person_service">🤝 In-Person Service or Consultation</SelectItem>
                <SelectItem value="other">⚙️ Other Custom Format</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 3. Development Time */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              3. How much time do you need to develop the first version? *
            </Label>
            <Select
              value={watch('development_time') || '1_to_2_weeks'}
              onValueChange={(val) => setValue('development_time', val ?? '1_to_2_weeks')}
            >
              <SelectTrigger className="w-full text-xs h-9 bg-background">
                <SelectValue placeholder="Select estimated time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24_hours">⚡ 24 to 48 Hours (Ready immediately / No-code)</SelectItem>
                <SelectItem value="1_to_2_weeks">🚀 1 to 2 Weeks (Lean MSP build)</SelectItem>
                <SelectItem value="1_month">📅 1 Month (Requires light setup or custom assembly)</SelectItem>
                <SelectItem value="2_to_3_months">⏳ 2 to 3 Months (Complex software or hardware production)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 4. Resource Readiness */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              4. Do you have all the resources required to build and deliver this solution? *
            </Label>
            <Select
              value={watch('resources_readiness') || 'yes_all_available'}
              onValueChange={(val) => setValue('resources_readiness', val ?? 'yes_all_available')}
            >
              <SelectTrigger className="w-full text-xs h-9 bg-background">
                <SelectValue placeholder="Select resource status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes_all_available">✅ Yes, I have all skills, tools, and budget needed right now</SelectItem>
                <SelectItem value="mostly_need_nocode">🛠️ Mostly, but need no-code tools or AI assistance</SelectItem>
                <SelectItem value="need_freelancer">💼 Missing specific skills (need to hire a freelancer/contractor)</SelectItem>
                <SelectItem value="need_cofounder">🤝 Missing technical execution (need a technical co-founder)</SelectItem>
                <SelectItem value="need_capital">💰 Missing capital/inventory funds to produce</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 5. Differentiation vs Workarounds */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              5. Why will customers pick this solution over their current workarounds/alternatives? *
            </Label>
            <Textarea
              className="text-xs leading-relaxed bg-background min-h-[75px]"
              placeholder="e.g., Doing it manually takes 3 hours every week; our web tool automates the process in 5 minutes for less than $50."
              {...register('differentiation_vs_diy', { required: true, minLength: 10 })}
            />
            {errors.differentiation_vs_diy && (
              <p className="text-[11px] text-destructive font-semibold">Please explain why customers will switch to your solution.</p>
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
                  <span>Save Delivery Specifications & Complete Quest 2</span>
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
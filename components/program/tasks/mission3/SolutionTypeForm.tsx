// components/program/tasks/mission3/SolutionTypeForm.tsx
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
  Layers, 
  Package, 
  Laptop, 
  Users, 
  BookOpen, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

interface SolutionInputs {
  solution_type: 'product_service' | 'tools_saas' | 'marketplace' | 'content';
  industry_sector: string;
  rationale: string;
  access_type: string;
}

const SOLUTION_OPTIONS = [
  {
    id: 'product_service',
    title: '📦 Product / Service',
    description: 'You solve the problem directly for the customer (e.g. Done-for-you service, physical goods).',
    icon: Package
  },
  {
    id: 'tools_saas',
    title: '💻 Tools / Software',
    description: 'You provide a tool or app that enables the customer to solve it themselves.',
    icon: Laptop
  },
  {
    id: 'marketplace',
    title: '🤝 Marketplace / Platform',
    description: 'You connect the customer with third-party providers who solve it.',
    icon: Users
  },
  {
    id: 'content',
    title: '📚 Content & Training',
    description: 'You teach or guide the customer on how to solve it.',
    icon: BookOpen
  }
];

export function SolutionTypeForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [selectedType, setSelectedType] = useState<'product_service' | 'tools_saas' | 'marketplace' | 'content'>('product_service');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isCompleted = existingProgress?.status === 'completed';

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<SolutionInputs>({
    defaultValues: {
      solution_type: 'product_service',
      access_type: 'saas_subscription'
    }
  });

  useEffect(() => {
    async function loadData() {
      const res = await getActiveProjectAction();
      if (res.success) {
        setActiveProject(res.data);
        const design = (res.data.solution_design as any) || {};
        const msp: Partial<MSPPayload> = design.msp || {};

        if (msp.solution_type) {
          setSelectedType(msp.solution_type);
          setValue('solution_type', msp.solution_type);
        }
        if (msp.industry_sector) setValue('industry_sector', msp.industry_sector);
        if (msp.rationale) setValue('rationale', msp.rationale);
        if (msp.access_type) setValue('access_type', msp.access_type);
      } else {
        setErrorMessage(res.error || 'Failed to load active project');
      }
    }
    loadData();
  }, [reset, setValue]);

  const onSubmitSolution = async (data: SolutionInputs) => {
    if (!activeProject) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const mspPartial: Partial<MSPPayload> = {
      solution_type: selectedType,
      industry_sector: data.industry_sector,
      rationale: data.rationale,
      access_type: data.access_type
    };

    const updateRes = await updateProjectSolutionDesignAction(activeProject.id, mspPartial);

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to save solution type');
      setIsSubmitting(false);
      return;
    }

    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        solution_type: selectedType,
        industry_sector: data.industry_sector
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

      <form onSubmit={handleSubmit(onSubmitSolution)} className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Choose Your Solution Approach
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {task.briefing_text}
          </p>
        </div>

        {/* SOLUTION CATEGORY CARDS */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-foreground">
            How will you deliver value to the customer? *
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SOLUTION_OPTIONS.map((opt) => {
              const isSelected = selectedType === opt.id;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSelectedType(opt.id as any);
                    setValue('solution_type', opt.id as any);
                  }}
                  className={`p-4 rounded-xl border text-left transition cursor-pointer flex items-start gap-3 ${
                    isSelected 
                      ? 'border-primary bg-primary/10 text-foreground font-semibold shadow-xs' 
                      : 'border-border bg-card hover:border-primary/40 text-muted-foreground'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-foreground block">{opt.title}</span>
                    <p className="text-[11px] leading-relaxed">{opt.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Industry Sector */}
        <div className="space-y-1.5 pt-2">
          <Label className="text-xs font-semibold text-foreground">
            Industry or Business Sector *
          </Label>
          <Input
            type="text"
            placeholder="e.g., Food & Beverage, E-commerce, Local Services, Healthcare"
            className="text-xs h-9 bg-background"
            {...register('industry_sector', { required: true })}
          />
          {errors.industry_sector && (
            <p className="text-[11px] text-destructive font-semibold">Please specify an industry sector.</p>
          )}
        </div>

        {/* Access & Monetization Model */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            How will customers pay / access this? *
          </Label>
          <Select
            value={watch('access_type') || 'saas_subscription'}
            onValueChange={(val) => setValue('access_type', val ?? 'saas_subscription')}
          >
            <SelectTrigger className="text-xs h-9 bg-background">
              <SelectValue placeholder="Select access type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one_time_purchase">One-time purchase (Buy once, keep forever)</SelectItem>
              <SelectItem value="saas_subscription">SaaS Subscription (Monthly/Yearly recurring)</SelectItem>
              <SelectItem value="service_retainer">Service Retainer (Ongoing monthly service)</SelectItem>
              <SelectItem value="service_project">Service (Per session / per project)</SelectItem>
              <SelectItem value="digital_download">Digital Download / Template</SelectItem>
              <SelectItem value="membership">Community / Membership Access</SelectItem>
              <SelectItem value="freemium">Freemium (Free tier + paid upgrades)</SelectItem>
              <SelectItem value="marketplace_commission">Marketplace Transaction Fee</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rationale */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            Why is this approach the best fit for your target customer? *
          </Label>
          <Textarea
            className="text-xs bg-background min-h-[75px]"
            placeholder="e.g., Coffee shop owners are too busy to learn complex new software; they want an easy monthly service that handles posts for them."
            {...register('rationale', { required: true, minLength: 10 })}
          />
          {errors.rationale && (
            <p className="text-[11px] text-destructive font-semibold">Please share a brief rationale.</p>
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
              <span>Save Solution Type & Continue (+{task.grant_points} XP)</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
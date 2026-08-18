// components/program/tasks/ValuePropositionForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getActiveProjectAction, updateProjectPromiseAction } from '@/actions/projects';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { TaskResourcesList } from '../TaskResourcesList';
import { PromisePayload } from '@/types/projects';
import { Database } from '@/types/supabase';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Sparkles, 
  Target, 
  HelpCircle, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Edit2
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

export function ValuePropositionForm({
  task,
  existingProgress,
  onSuccess
}: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [savedPromise, setSavedPromise] = useState<PromisePayload | null>(null);

  const isCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isCompleted);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<PromisePayload>();

  const targetCustomer = watch('target_customer');
  const coreStruggle = watch('core_struggle');
  const promisedOutcome = watch('promised_outcome');
  const mechanismSecretSauce = watch('mechanism_secret_sauce');
  const finalValueProp = watch('final_value_prop');

  // Load project & existing promise data
  useEffect(() => {
    async function loadData() {
      const res = await getActiveProjectAction();
      if (res.success && res.data) {
        setActiveProject(res.data);
        const solutionDesign = (res.data.solution_design as any) || {};

        if (solutionDesign.promise) {
          const p = solutionDesign.promise as PromisePayload;
          setSavedPromise(p);
          setValue('target_customer', p.target_customer || '');
          setValue('core_struggle', p.core_struggle || '');
          setValue('promised_outcome', p.promised_outcome || '');
          setValue('mechanism_secret_sauce', p.mechanism_secret_sauce || '');
          setValue('final_value_prop', p.final_value_prop || '');
        }
      } else {
        setErrorMessage(!res.success ? res.error : 'Failed to load active project');
      }
    }
    loadData();
  }, [reset, setValue]);

  // Auto-generate synthesized single-sentence promise
  useEffect(() => {
    if (targetCustomer || coreStruggle || promisedOutcome) {
      const generated = `We help ${targetCustomer || '[Target Customer]'} who struggle with ${coreStruggle || '[Core Problem]'} achieve ${promisedOutcome || '[Dream Outcome]'} through ${mechanismSecretSauce || '[Your Approach]'}.`;
      
      if (!finalValueProp || finalValueProp.startsWith('We help ')) {
        setValue('final_value_prop', generated);
      }
    }
  }, [targetCustomer, coreStruggle, promisedOutcome, mechanismSecretSauce, setValue]);

  const onSubmitPromise = async (data: PromisePayload) => {
    if (!activeProject) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    // 1. Save Promise payload to Project
    const updateRes = await updateProjectPromiseAction(activeProject.id, data);

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to save promise');
      setIsSubmitting(false);
      return;
    }

    // 2. Process Task Completion (Progress, XP, Store sync)
    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        promise: data
      }
    });

    if (taskRes.success) {
      setSavedPromise(data);
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
      {savedPromise && !isEditing ? (
        <div className="w-full space-y-5 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Core Promise Locked In
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Promise
            </Button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl bg-card border border-amber-500/30 bg-amber-500/5 space-y-1">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Synthesized Value Proposition
              </span>
              <p className="text-sm font-bold text-foreground leading-relaxed">{savedPromise.final_value_prop}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-card border border-border/60 space-y-0.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Target Customer</span>
                <p className="text-xs font-medium text-foreground">{savedPromise.target_customer}</p>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border/60 space-y-0.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Core Struggle</span>
                <p className="text-xs font-medium text-foreground">{savedPromise.core_struggle}</p>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border/60 space-y-0.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Dream Outcome</span>
                <p className="text-xs font-medium text-foreground">{savedPromise.promised_outcome}</p>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border/60 space-y-0.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Unique Approach</span>
                <p className="text-xs font-medium text-foreground">{savedPromise.mechanism_secret_sauce || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* FORM VIEW */
        <form onSubmit={handleSubmit(onSubmitPromise)} className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Input 1: Target Customer */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-500" />
                1. Who is this specifically for? *
              </Label>
              <Input
                placeholder="e.g. Busy freelance designers, Home bakers in Tier 2 cities"
                className="text-xs h-9 bg-background"
                {...register('target_customer', { required: true })}
              />
              {errors.target_customer && (
                <p className="text-[11px] text-destructive font-semibold">Please specify your target audience.</p>
              )}
            </div>

            {/* Input 2: Core Struggle */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                2. What are they struggling with? *
              </Label>
              <Input
                placeholder="e.g. Spending 10 hours a week sending manual invoices"
                className="text-xs h-9 bg-background"
                {...register('core_struggle', { required: true })}
              />
              {errors.core_struggle && (
                <p className="text-[11px] text-destructive font-semibold">Please enter the main frustration.</p>
              )}
            </div>

            {/* Input 3: Promised Outcome */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                3. What dream outcome do you deliver? *
              </Label>
              <Input
                placeholder="e.g. Get paid in under 24 hours without chasing clients"
                className="text-xs h-9 bg-background"
                {...register('promised_outcome', { required: true })}
              />
              {errors.promised_outcome && (
                <p className="text-[11px] text-destructive font-semibold">Please state the promised result.</p>
              )}
            </div>

            {/* Input 4: Secret Sauce / Approach */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                4. How do you deliver it? (Your approach)
              </Label>
              <Input
                placeholder="e.g. 1-click WhatsApp payment reminders"
                className="text-xs h-9 bg-background"
                {...register('mechanism_secret_sauce')}
              />
            </div>

          </div>

          {/* LIVE PROMISE CARD PREVIEW */}
          <Card className="border border-amber-500/30 bg-amber-500/5 shadow-sm rounded-2xl">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Your Core Product Promise
                </span>
                <span className="text-[10px] text-muted-foreground italic">Live Preview</span>
              </div>

              <Textarea
                rows={3}
                className="text-xs bg-background font-medium leading-relaxed border-amber-500/20 focus-visible:ring-amber-500"
                placeholder="Your final promise statement will assemble here..."
                {...register('final_value_prop', { required: true })}
              />
              {errors.final_value_prop && (
                <p className="text-[11px] text-destructive font-semibold">Please provide the final promise statement.</p>
              )}
            </CardContent>
          </Card>

          {/* ACTION BUTTONS */}
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
                  <span>Lock In Promise & Continue</span>
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
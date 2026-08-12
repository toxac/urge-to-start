// components/program/tasks/mission3/WorstCaseForm.tsx
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
import { Loader2, AlertCircle, ShieldAlert, ArrowRight } from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

interface WorstCaseInputs {
  worst_case_scenario: string;
  regret_test: 'starting' | 'not_starting';
}

export function WorstCaseForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<WorstCaseInputs>({
    defaultValues: {
      regret_test: 'not_starting'
    }
  });

  useEffect(() => {
    async function loadData() {
      const res = await getActiveProjectAction();
      if (res.success) {
        setActiveProject(res.data);
        const viability = (res.data.viability_check as any) || {};

        if (viability.worst_case_scenario) setValue('worst_case_scenario', viability.worst_case_scenario);
        if (viability.regret_test) setValue('regret_test', viability.regret_test);
      } else {
        setErrorMessage(res.error || 'Failed to load active project');
      }
    }
    loadData();
  }, [reset, setValue]);

  const onSubmitWorstCase = async (data: WorstCaseInputs) => {
    if (!activeProject) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const updateRes = await updateProjectViabilityAction(activeProject.id, data as any);

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to save reflection');
      setIsSubmitting(false);
      return;
    }

    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        worst_case: data
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

      {/* RECOMMENDED RESOURCES / PLAYBOOK GUIDES */}
      <TaskResourcesList resources={task.resources} />

      <form onSubmit={handleSubmit(onSubmitWorstCase)} className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            What If Things Don't Go To Plan?
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Every project comes with uncertainty. Taking a quick moment to think about the outcome helps you build confidence before making your final decision.
          </p>
        </div>

        {/* 1. Realistic Worst Outcome */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            1. What's the realistic worst thing that happens if this project doesn't work out? *
          </Label>
          <Textarea
            className="text-xs leading-relaxed bg-background min-h-[75px]"
            placeholder="e.g. I spend 2 weeks trying to get café owners to sign up, nobody buys, but I learn how to build a landing page and do outreach."
            {...register('worst_case_scenario', { required: true, minLength: 10 })}
          />
          {errors.worst_case_scenario && (
            <p className="text-[11px] text-destructive font-semibold">Please write a short reflection on the worst outcome.</p>
          )}
        </div>

        {/* 2. Regret Comparison (Full-Width Select) */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            2. Looking back a few months from now, what would bother you more? *
          </Label>
          <Select
            value={watch('regret_test') || 'not_starting'}
            onValueChange={(val) => setValue('regret_test', (val ?? 'not_starting') as any)}
          >
            <SelectTrigger className="w-full text-xs h-9 bg-background">
              <SelectValue placeholder="Select your perspective" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not_starting">🚀 Never trying at all and always wondering "what if"</SelectItem>
              <SelectItem value="starting">⚠️ Trying, failing, and losing the time or effort spent</SelectItem>
            </SelectContent>
          </Select>
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
              <span>Save Reflection & Go To Decision </span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
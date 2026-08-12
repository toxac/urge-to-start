// components/program/tasks/mission3/MSPDefinitionForm.tsx
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
  updateProjectSolutionDesignAction
} from '@/actions/projects';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { MSPPayload } from '@/types/projects';
import { 
  Loader2, 
  AlertCircle, 
  Lightbulb, 
  Sparkles, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

interface MSPDefinitionInputs {
  one_sentence_description: string;
}

export function MSPDefinitionForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [solutionType, setSolutionType] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isCompleted = existingProgress?.status === 'completed';

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<MSPDefinitionInputs>();

  useEffect(() => {
    async function loadData() {
      const res = await getActiveProjectAction();
      if (res.success) {
        setActiveProject(res.data);
        const design = (res.data.solution_design as any) || {};
        const msp: Partial<MSPPayload> = design.msp || {};

        if (msp.solution_type) setSolutionType(msp.solution_type);
        if (msp.one_sentence_description) {
          setValue('one_sentence_description', msp.one_sentence_description);
        }
      } else {
        setErrorMessage(res.error || 'Failed to load active project');
      }
    }
    loadData();
  }, [reset, setValue]);

  const onSubmitMSPDef = async (data: MSPDefinitionInputs) => {
    if (!activeProject) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const mspPartial: Partial<MSPPayload> = {
      one_sentence_description: data.one_sentence_description
    };

    const updateRes = await updateProjectSolutionDesignAction(activeProject.id, mspPartial);

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to save MSP definition');
      setIsSubmitting(false);
      return;
    }

    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        msp_description: data.one_sentence_description
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

      {/* SOLUTION CONTEXT BANNER */}
      {solutionType && (
        <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-bold text-foreground">
              Solution Approach: <span className="text-primary font-mono capitalize">{solutionType.replace(/_/g, ' ')}</span>
            </span>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary bg-primary/10">
            Selected in Task 2.1
          </Badge>
        </div>
      )}

      {/* SCOPE CREEP WARNING */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1.5">
        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5" />
          The Anti-Scope-Creep Rule
        </span>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your Minimum Sellable Product is <strong>not</strong> an MVP filled with features. It is the smallest possible transaction that delivers real value. If it takes more than 7 days to deliver your first sale, it is too big.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmitMSPDef)} className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Define Your Minimum Sellable Product
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {task.briefing_text}
          </p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            Describe in one sentence what solution will customers pay for*
          </Label>
          <Textarea
            className="text-xs leading-relaxed bg-background min-h-[85px]"
            placeholder="e.g., A 30-minute monthly audit call + a custom 5-post weekly social media template pack for café owners."
            {...register('one_sentence_description', { required: true, minLength: 10 })}
          />
          {errors.one_sentence_description && (
            <p className="text-[11px] text-destructive font-semibold">
              Please write a clear one-sentence description (at least 10 characters).
            </p>
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
              <span>Save MSP Definition & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
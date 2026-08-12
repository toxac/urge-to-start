// components/program/tasks/mission3/DecisionGateForm.tsx
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
  updateProjectViabilityAction, 
  syncComplianceToUserActionsAction
} from '@/actions/projects';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { ViabilityCheckPayload } from '@/types/projects';
import { TaskResourcesList } from '../TaskResourcesList';
import { Loader2, AlertCircle, Rocket, ArrowRight, Sparkles, CheckCircle2, Edit2 } from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

interface DecisionInputs {
  final_decision: 'go' | 'pivot' | 'no_go';
  decision_rationale: string;
}

const DECISION_OPTIONS = [
  {
    id: 'go',
    title: '🚀 GO — Build & Launch MSP',
    description: 'The problem is validated, customers expressed willingness-to-pay, and I have a lean MSP ready to sell.',
    color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500'
  },
  {
    id: 'pivot',
    title: '🔄 PIVOT — Adjust Angle / Target Audience',
    description: 'The core problem exists, but I need to change my target audience, solution mechanism, or pricing model.',
    color: 'border-amber-500/40 bg-amber-500/10 text-amber-500'
  },
  {
    id: 'no_go',
    title: '⏸️ NO-GO — Pause Venture',
    description: 'The problem isn’t urgent enough, customers rely on free alternatives, or execution timing is off.',
    color: 'border-muted bg-muted/20 text-muted-foreground'
  }
];

export function ViabilityDecisionGateForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<'go' | 'pivot' | 'no_go'>('go');
  const [savedDecision, setSavedDecision] = useState<DecisionInputs | null>(null);

  const isCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isCompleted);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<DecisionInputs>({
    defaultValues: {
      final_decision: 'go'
    }
  });

  useEffect(() => {
    async function loadData() {
      const res = await getActiveProjectAction();
      if (res.success && res.data) {
        setActiveProject(res.data);
        const viability = (res.data.viability_check as any) || {};

        if (viability.final_decision) {
          setSelectedDecision(viability.final_decision);
          setValue('final_decision', viability.final_decision);
          setSavedDecision({
            final_decision: viability.final_decision,
            decision_rationale: viability.decision_rationale || ''
          });
        }
        if (viability.decision_rationale) {
          setValue('decision_rationale', viability.decision_rationale);
        }
      } else {
        setErrorMessage(!res.success ? res.error : 'Failed to load active project');
      }
    }
    loadData();
  }, [reset, setValue]);

  const onSubmitDecision = async (data: DecisionInputs) => {
    if (!activeProject) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const viabilityPayload: Partial<ViabilityCheckPayload> = {
      final_decision: selectedDecision,
      decision_rationale: data.decision_rationale
    };

    // 1. Update project viability & status
    const updateRes = await updateProjectViabilityAction(activeProject.id, viabilityPayload);

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to save final decision');
      setIsSubmitting(false);
      return;
    }

    // 2. ⚡ IF "GO" IS SELECTED: Convert remaining compliance items into user_actions!
    if (selectedDecision === 'go') {
      const syncRes = await syncComplianceToUserActionsAction(activeProject.id);
      if (!syncRes.success) {
        console.warn('Compliance action sync warning:', syncRes.error);
      }
    }

    // 3. Mark task as complete and trigger graduation
    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        decision: selectedDecision,
        rationale: data.decision_rationale
      }
    });

    if (taskRes.success) {
      setSavedDecision({ final_decision: selectedDecision, decision_rationale: data.decision_rationale });
      setIsEditing(false);
      if (onSuccess) onSuccess();
    } else {
      setErrorMessage(taskRes.error || 'Failed to complete decision gate');
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
      {savedDecision && !isEditing ? (
        <div className="w-full space-y-5 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Mission 3 Decision Locked In
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Decision
            </Button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-card border border-border/60">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Decision Call</span>
              <p className="text-xs font-bold text-foreground uppercase tracking-wider">{savedDecision.final_decision}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Rationale</span>
              <p className="text-xs font-medium text-foreground leading-relaxed">{savedDecision.decision_rationale}</p>
            </div>
          </div>
        </div>
      ) : (
        /* FORM VIEW */
        <form onSubmit={handleSubmit(onSubmitDecision)} className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5 text-amber-500" />
              Mission 3 Decision Gate: Make the Call
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {task.briefing_text}
            </p>
          </div>

          {/* DECISION SELECTION CARDS */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground">
              Select Your Intentional Direction *
            </Label>
            <div className="grid grid-cols-1 gap-2.5">
              {DECISION_OPTIONS.map((opt) => {
                const isSelected = selectedDecision === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedDecision(opt.id as any);
                      setValue('final_decision', opt.id as any);
                    }}
                    className={`p-4 rounded-xl border text-left transition cursor-pointer flex items-start justify-between ${
                      isSelected 
                        ? 'border-primary bg-primary/10 text-foreground font-semibold shadow-xs' 
                        : 'border-border bg-card hover:border-primary/30 text-muted-foreground'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-foreground block">{opt.title}</span>
                      <p className="text-[11px] leading-relaxed">{opt.description}</p>
                    </div>
                    {isSelected && (
                      <Badge variant="outline" className="text-[9px] font-mono border-primary text-primary shrink-0">
                        Selected
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RATIONALE */}
          <div className="space-y-1.5 pt-2">
            <Label className="text-xs font-semibold text-foreground">
              What is your 1-paragraph reasoning behind this decision? *
            </Label>
            <Textarea
              className="text-xs bg-background min-h-[85px]"
              placeholder="e.g. I am going because 4 out of 5 café owners confirmed intense Sunday friction and 2 offered to pay for a weekly template pack. The compliance roadmap is manageable and my MSP takes 5 days to launch."
              {...register('decision_rationale', { required: true, minLength: 10 })}
            />
            {errors.decision_rationale && (
              <p className="text-[11px] text-destructive font-semibold">Please provide your decision rationale.</p>
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
              className="flex-1 h-11 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-gradient-to-r from-amber-500 to-primary text-white shadow-lg"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Lock In Decision & Complete Mission 3 (+{task.grant_points} XP)</span>
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
// components/program/tasks/common/OffAppActionForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ActionItemCard } from '@/components/program/ActionItemCard';
import { logTaskReflectionAction, setTaskStatusInProgressAction } from '@/actions/progress';
import { recordAccomplishment } from '@/actions/accomplishments';
import { createUserAction } from '@/actions/userActions';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { setAccomplishmentStoreRow } from '@/lib/stores/accomplishmentStore';
import { setActionStoreRow } from '@/lib/stores/actionStore';
import { BaseTaskComponentProps } from '../types';
import { ReferenceSchema } from '@/types/playbook';
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  ExternalLink, 
  Plus, 
  MessageSquareQuote, 
  Target, 
  Globe, 
  Lightbulb, 
  Check, 
  CalendarCheck, 
  ArrowRight 
} from 'lucide-react';

interface ReflectionFormInputs {
  reflection_text: string;
}

export function OffAppActionForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSchedulingAction, setIsSchedulingAction] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const targetCount = task.target_count && task.target_count > 0 ? task.target_count : 1;
  
  const existingReflections: Array<{ id: string; count_index: number; reflection_text: string; logged_at: string }> = 
    ((existingProgress as any)?.reflections as any) || [];

  const completedLogsCount = existingReflections.length;
  
  // ⚡ Explicit status flags derived directly from DB progress state
  const isCompleted = existingProgress?.status === 'completed' || completedLogsCount >= targetCount;
  const isInProgress = existingProgress?.status === 'in_progress';

  const [isAddingNew, setIsAddingNew] = useState(!isCompleted);
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number | null>(null);
  
  // ⚡ Show reflection input directly if task is in_progress or user toggled it
  const [showReflectionInput, setShowReflectionInput] = useState(false);

  // Extract REQUIRED resources
  const requiredResources: ReferenceSchema[] = (task.resources || []).filter((r: ReferenceSchema) => r.isRequired);

  // Extract Scenarios from task.metadata
  const scenarios: string[] = task.metadata?.scenarios || [
    "Ask a coffee shop barista for a 10% discount just to practice handling rejection.",
    "Ask a store manager if they offer a student, founder, or local business discount.",
    "Ask a colleague or friend for a quick 10-minute favor or advice on a challenge.",
    "Ask a vendor or service provider to waive a minor fee or extend a trial period."
  ];

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReflectionFormInputs>();

  // 1. Commit Scenario: Creates user_action AND marks task status = 'in_progress'
  const handleScheduleScenarioAction = async () => {
    if (selectedScenarioIndex === null) return;
    setIsSchedulingAction(true);
    setErrorMessage(null);

    const chosenScenarioText = scenarios[selectedScenarioIndex];

    try {
      // Step A: Create user_action reminder
      const actionRes = await createUserAction({
        title: `Real-World Goal: "${task.title}"`,
        description: `Chosen scenario: ${chosenScenarioText}`,
        checkbackDelayDays: 2,
        taskId: task.id,
        metadata: {
          scenario: chosenScenarioText,
          source: 'off_app_action_form'
        }
      });

      if (!actionRes.success || !actionRes.data) {
        setErrorMessage(actionRes.error || 'Failed to schedule action');
        setIsSchedulingAction(false);
        return;
      }

      // Hydrate $actionStore
      setActionStoreRow({
        id: actionRes.data.actionId,
        user_id: '',
        project_id: null,
        task_id: task.id,
        title: `Real-World Goal: "${task.title}"`,
        description: `Chosen scenario: ${chosenScenarioText}`,
        action_type: 'program',
        status: 'pending',
        checkback_delay_days: 2,
        due_at: new Date(Date.now() + 2 * 86400000).toISOString(),
        completed_at: null,
        metadata: { scenario: chosenScenarioText },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      // Step B: Set user_progress.status = 'in_progress'
      const statusRes = await setTaskStatusInProgressAction(task.id);
      if (statusRes.success && statusRes.data) {
        setProgressStoreRow(statusRes.data as any);
      }

    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while scheduling action');
    } finally {
      setIsSchedulingAction(false);
    }
  };

  // 2. Submit Reflection
  const onSubmit = async (formData: ReflectionFormInputs) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await logTaskReflectionAction({
        taskId: task.id,
        reflectionText: formData.reflection_text,
        targetCount
      });

      if (!res.success || !res.data) {
        setErrorMessage(res.error || 'Failed to log reflection');
        setIsSubmitting(false);
        return;
      }

      setProgressStoreRow(res.data.progressRow as any);
      reset();
      setShowReflectionInput(false);

      if (res.data.isCompleted) {
        const accomplishmentRes = await recordAccomplishment({
          awardedFor: 'task',
          relatedTable: 'tasks',
          relatedReferenceId: task.id,
          title: `Completed ${task.title}`,
          pointsGranted: task.grant_points || 25,
        });

        if (accomplishmentRes.success && accomplishmentRes.accomplishmentRow) {
          setAccomplishmentStoreRow(accomplishmentRes.accomplishmentRow);
        }

        setIsAddingNew(false);
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6 text-left">
      {errorMessage && (
        <div className="w-full p-4 border rounded-xl bg-destructive/10 border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 🌐 REAL-WORLD ACTION BANNER */}
      <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 shrink-0" />
            Real-World Action Required
          </span>
          <Badge variant="outline" className="text-[10px] uppercase border-amber-500/40 text-amber-500 font-mono">
            {isInProgress ? 'In Progress' : 'Off-App Challenge'}
          </Badge>
        </div>
        <p className="text-xs text-foreground font-medium leading-relaxed">
          This task takes place out in the real world! Select a scenario to schedule your action goal, execute it, and log your reflection.
        </p>
      </div>

      {/* ⚡ ACTIVE USER ACTION CARD (Renders automatically if an action exists) */}
      <ActionItemCard taskId={task.id} />

      {/* REQUIRED RESOURCES BANNER */}
      {requiredResources.length > 0 && (
        <div className="p-4 rounded-xl border bg-primary/5 border-primary/20 space-y-2">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Required Action Guides (Read First)
          </span>
          <div className="space-y-1.5">
            {requiredResources.map((res, idx) => (
              <a
                key={idx}
                href={res.url_link}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg border bg-card hover:bg-muted/30 transition flex items-center justify-between text-xs font-semibold text-foreground group"
              >
                <span>{res.title}</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 💡 STEP 1: SCENARIOS SELECTION (Only shown if NOT in_progress AND NOT completed) */}
      {!isInProgress && !isCompleted && !showReflectionInput && (
        <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Choose Your Action Approach
            </span>
            <p className="text-xs text-muted-foreground">
              Select a scenario to set as a goal:
            </p>
          </div>

          <div className="space-y-2">
            {scenarios.map((scenarioText, idx) => {
              const isSelected = selectedScenarioIndex === idx;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedScenarioIndex(idx)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer text-xs font-medium flex items-start gap-3 ${
                    isSelected 
                      ? 'border-primary bg-primary/5 text-foreground font-bold shadow-sm' 
                      : 'border-border bg-card hover:bg-muted/30 text-muted-foreground'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
                  }`}>
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </div>
                  <span className="leading-relaxed">{scenarioText}</span>
                </div>
              );
            })}
          </div>

          {selectedScenarioIndex !== null && (
            <Button
              type="button"
              onClick={handleScheduleScenarioAction}
              disabled={isSchedulingAction}
              className="w-full h-10 text-xs font-bold tracking-wider uppercase cursor-pointer gap-2"
            >
              {isSchedulingAction ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Scheduling Goal...
                </>
              ) : (
                <>
                  <CalendarCheck className="w-4 h-4" />
                  Commit to Scenario & Set Goal
                </>
              )}
            </Button>
          )}

          <div className="pt-2 border-t border-border/40 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowReflectionInput(true)}
              className="text-xs font-semibold gap-1.5 cursor-pointer"
            >
              <span>Ready to Log Reflection Directly</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* ⚡ STEP 2: IN-PROGRESS PROMPT (Shown when status == 'in_progress') */}
      {isInProgress && !showReflectionInput && (
        <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-foreground block">
              Task In Progress
            </span>
            <p className="text-[11px] text-muted-foreground">
              Have you executed your real-world challenge? Log your reflection below to complete the step.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setShowReflectionInput(true)}
            className="h-9 text-xs font-bold uppercase cursor-pointer gap-1.5 shrink-0"
          >
            <span>Log Reflection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* STEP 3: REFLECTION INPUT FORM */}
      {(!isCompleted || isAddingNew) && showReflectionInput && (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 p-5 rounded-2xl border border-primary/30 bg-card/60 shadow-sm animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground block flex items-center gap-1.5">
              <MessageSquareQuote className="w-3.5 h-3.5 text-primary" />
              {targetCount > 1 
                ? `Rep #${completedLogsCount + 1} Reflection: How did the ask go and what did you notice? *`
                : 'Reflection: What happened, how did you feel, and what did you learn? *'}
            </Label>

            <Textarea
              className="w-full min-h-[100px] text-xs leading-relaxed resize-none"
              placeholder="e.g. I asked the barista for a 10% discount. They looked surprised but laughed and gave me 5% off! It felt scary for 3 seconds, but the outcome was completely harmless."
              {...register('reflection_text', { required: true, minLength: 5 })}
            />
            {errors.reflection_text && (
              <p className="text-[11px] font-semibold text-destructive">
                Please enter a brief reflection (at least 5 characters).
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowReflectionInput(false)}
              className="text-xs font-semibold cursor-pointer"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 h-10 text-xs font-bold tracking-wider uppercase cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Logging Rep...
                </span>
              ) : (
                `Submit Reflection & Complete Task (+${task.grant_points} XP)`
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
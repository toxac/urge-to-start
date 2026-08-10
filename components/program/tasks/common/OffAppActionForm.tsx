// components/program/tasks/common/OffAppActionForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { logTaskReflectionAction } from '@/actions/progress';
import { recordAccomplishment } from '@/actions/accomplishments';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { setAccomplishmentStoreRow } from '@/lib/stores/accomplishmentStore';
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
  Check
} from 'lucide-react';

interface ReflectionFormInputs {
  reflection_text: string;
}

export function OffAppActionForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const targetCount = task.target_count && task.target_count > 0 ? task.target_count : 1;
  
  const existingReflections: Array<{ id: string; count_index: number; reflection_text: string; logged_at: string }> = 
    ((existingProgress as any)?.reflections as any) || [];

  const completedLogsCount = existingReflections.length;
  const isCompleted = existingProgress?.status === 'completed' || completedLogsCount >= targetCount;
  
  const [isAddingNew, setIsAddingNew] = useState(!isCompleted);
  const [showReflectionInput, setShowReflectionInput] = useState(false);

  // Extract REQUIRED resources to display at top
  const requiredResources: ReferenceSchema[] = (task.resources || []).filter((r: ReferenceSchema) => r.isRequired);

  // Extract Scenarios / Approaches from task payload or fallback defaults
  const scenarios: string[] = (task as any).action_scenarios || (task as any).metadata?.scenarios || [
    "Ask a coffee shop barista for a 10% discount just to practice handled rejection.",
    "Ask a store manager if they offer a student, founder, or local business discount.",
    "Ask a colleague or friend for a quick 10-minute favor or advice on a challenge.",
    "Ask a vendor or service provider to waive a minor fee or extend a trial period."
  ];

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReflectionFormInputs>();

  const onSubmit = async (formData: ReflectionFormInputs) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Log reflection entry into user_progress
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

      // 2. Award Task XP when rep target count is reached
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
            Off-App Challenge
          </Badge>
        </div>
        <p className="text-xs text-foreground font-medium leading-relaxed">
          This task requires step-away execution! Head out into the real world or reach out directly to people online. Do not complete this sitting at your browser without taking the real action first.
        </p>
      </div>

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

      {/* 💡 SCENARIOS & APPROACHES GUIDANCE */}
      {(!isCompleted || isAddingNew) && (
        <div className="p-4 rounded-xl border border-border bg-card space-y-3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Suggested Approaches & Scenarios
          </span>
          <ul className="space-y-2">
            {scenarios.map((scenario, idx) => (
              <li key={idx} className="text-xs text-foreground font-medium flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                <span>{scenario}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Counter Progress Tracker (Shown if target_count > 1) */}
      {targetCount > 1 && (
        <div className="p-4 rounded-xl border border-border bg-card/60 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-primary" />
              Action Progress Tracker
            </span>
            <p className="text-sm font-bold text-foreground">
              {completedLogsCount} of {targetCount} Reps Completed
            </p>
          </div>

          <Badge 
            variant={isCompleted ? 'default' : 'outline'}
            className={isCompleted ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : ''}
          >
            {isCompleted ? '✓ Target Met' : `${targetCount - completedLogsCount} Remaining`}
          </Badge>
        </div>
      )}

      {/* Completed Banner if single-step and finished */}
      {targetCount <= 1 && isCompleted && !isAddingNew && (
        <div className="w-full space-y-3 border rounded-2xl p-5 bg-emerald-500/5 border-emerald-500/20 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Action Completed & Logged
            </span>
          </div>
        </div>
      )}

      {/* Logged Reflections History */}
      {existingReflections.length > 0 && (
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Logged Reflections ({existingReflections.length}):
          </span>

          <div className="space-y-2">
            {existingReflections.map((entry, idx) => (
              <div key={entry.id || idx} className="p-3.5 rounded-xl border border-border/80 bg-card space-y-1">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                  <span className="font-bold text-primary uppercase">
                    Rep #{entry.count_index || idx + 1}
                  </span>
                  <span>{new Date(entry.logged_at).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-foreground font-medium italic leading-relaxed">
                  "{entry.reflection_text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1: Action Completion Button */}
      {(!isCompleted || isAddingNew) && !showReflectionInput && (
        <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 space-y-3 text-center">
          <p className="text-xs font-semibold text-foreground">
            Have you completed Rep #{completedLogsCount + 1} in the real world?
          </p>
          <Button
            type="button"
            onClick={() => setShowReflectionInput(true)}
            className="w-full h-11 text-xs font-bold tracking-wider uppercase cursor-pointer gap-2"
          >
            <Check className="w-4 h-4" />
            I Completed This Action — Log My Reflection
          </Button>
        </div>
      )}

      {/* STEP 2: Reflection Textarea Form (Revealed after clicking completion button) */}
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
              Cancel
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
                `Submit Reflection & Lock Progress (+${task.grant_points} XP)`
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Allow adding extra log entries even if target is met */}
      {isCompleted && !isAddingNew && (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsAddingNew(true);
            setShowReflectionInput(false);
          }}
          className="w-full h-9 text-xs font-semibold gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Log Additional Reflection Rep
        </Button>
      )}
    </div>
  );
}
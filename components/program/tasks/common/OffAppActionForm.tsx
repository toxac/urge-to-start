// components/program/tasks/common/OffAppActionForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { logTaskReflectionAction } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
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
  Target
} from 'lucide-react';

interface ReflectionFormInputs {
  reflection_text: string;
}

export function OffAppActionForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const targetCount = task.target_count && task.target_count > 0 ? task.target_count : 1;
  
  // FIXED: Cast existingProgress to any before accessing .reflections
  const existingReflections: Array<{ id: string; count_index: number; reflection_text: string; logged_at: string }> = 
    ((existingProgress as any)?.reflections as any) || [];

  const completedLogsCount = existingReflections.length;
  const isCompleted = existingProgress?.status === 'completed' || completedLogsCount >= targetCount;
  
  const [isAddingNew, setIsAddingNew] = useState(!isCompleted);

  // Extract REQUIRED resources to display at top
  const requiredResources: ReferenceSchema[] = (task.resources || []).filter((r: ReferenceSchema) => r.isRequired);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReflectionFormInputs>();

  const onSubmit = async (formData: ReflectionFormInputs) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await logTaskReflectionAction({
        taskId: task.id,
        reflectionText: formData.reflection_text,
        targetCount
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to log reflection');
        setIsSubmitting(false);
        return;
      }

      if (res.data?.progressRow) {
        setProgressStoreRow(res.data.progressRow as any);
      }

      reset();
      
      if (res.data?.isCompleted) {
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

      {/* New Reflection Entry Form */}
      {(!isCompleted || isAddingNew) && (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 p-4 rounded-xl border border-border bg-card/40">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground block flex items-center gap-1.5">
              <MessageSquareQuote className="w-3.5 h-3.5 text-primary" />
              {targetCount > 1 
                ? `Log Action #${completedLogsCount + 1}: What was your key takeaway / reflection? *`
                : 'Share a quick reflection to mark this off-app action complete *'}
            </Label>

            <Textarea
              className="w-full min-h-[90px] text-xs leading-relaxed resize-none"
              placeholder="What happened? What did you learn or notice during this action?"
              {...register('reflection_text', { required: true, minLength: 5 })}
            />
            {errors.reflection_text && (
              <p className="text-[11px] font-semibold text-destructive">
                Please enter a brief reflection (at least 5 characters).
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-10 text-xs font-bold tracking-wider uppercase cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Logging Action...
              </span>
            ) : (
              `Log Rep & Earn Progress (+${task.grant_points} XP)`
            )}
          </Button>
        </form>
      )}

      {/* Allow adding extra log entries even if target is met */}
      {isCompleted && !isAddingNew && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsAddingNew(true)}
          className="w-full h-9 text-xs font-semibold gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Log Additional Reflection
        </Button>
      )}
    </div>
  );
}
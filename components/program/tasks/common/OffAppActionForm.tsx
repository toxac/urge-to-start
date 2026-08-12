// components/program/tasks/common/OffAppActionForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useStore } from '@nanostores/react';
import { $actionStore, setActionStoreRow } from '@/lib/stores/actionStore';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ActionItemCard } from '@/components/program/ActionItemCard';
import { logTaskReflectionAction, setTaskStatusInProgressAction } from '@/actions/progress';
import { recordAccomplishment } from '@/actions/accomplishments';
import { createUserAction } from '@/actions/userActions';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { setAccomplishmentStoreRow } from '@/lib/stores/accomplishmentStore';
import { BaseTaskComponentProps } from '../types';
import { TaskResourcesList } from '../TaskResourcesList';
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  MessageSquareQuote, 
  Target, 
  Globe, 
  Lightbulb, 
  Check, 
  CalendarCheck, 
  ArrowRight,
  PenTool
} from 'lucide-react';

interface ReflectionFormInputs {
  reflection_text: string;
}

export function OffAppActionForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const actionsMap = useStore($actionStore);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSchedulingAction, setIsSchedulingAction] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const targetCount = task.target_count && task.target_count > 0 ? task.target_count : 1;
  
  const existingReflections: Array<{ id: string; count_index: number; reflection_text: string; logged_at: string }> = 
    ((existingProgress as any)?.reflections as any) || [];

  const completedLogsCount = existingReflections.length;
  
  const existingTaskAction = Object.values(actionsMap).find(
    (a) => a.task_id === task.id && a.status !== 'dismissed'
  );

  const isCompleted = existingProgress?.status === 'completed' || completedLogsCount >= targetCount;
  const isInProgress = existingProgress?.status === 'in_progress' || !!existingTaskAction;

  const [isAddingNew, setIsAddingNew] = useState(!isCompleted);
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number | 'custom' | null>(null);
  const [customScenarioText, setCustomScenarioText] = useState('');
  const [showReflectionInput, setShowReflectionInput] = useState(false);

  const scenarios: string[] = task.metadata?.scenarios || [
    "Ask a coffee shop barista for a 10% discount just to practice handling rejection.",
    "Ask a store manager if they offer a student, founder, or local business discount.",
    "Ask a colleague or friend for a quick 10-minute favor or advice on a challenge.",
    "Ask a vendor or service provider to waive a minor fee or extend a trial period."
  ];

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReflectionFormInputs>();

  const getChosenScenario = (): string => {
    if (selectedScenarioIndex === 'custom') {
      return customScenarioText.trim();
    }
    if (typeof selectedScenarioIndex === 'number' && scenarios[selectedScenarioIndex]) {
      return scenarios[selectedScenarioIndex];
    }
    return '';
  };

  const handleScheduleScenarioAction = async () => {
    const chosenScenarioText = getChosenScenario();
    if (!chosenScenarioText) return;

    setIsSchedulingAction(true);
    setErrorMessage(null);

    try {
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

      const statusRes = await setTaskStatusInProgressAction({
        taskId: task.id,
        questId: (task as any).quest_id,
        missionId: (task as any).mission_id,
      });

      if (statusRes.success && statusRes.data) {
        setProgressStoreRow(statusRes.data as any);
      } else if (statusRes.error) {
        setErrorMessage(statusRes.error);
      }

    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while scheduling action');
    } finally {
      setIsSchedulingAction(false);
    }
  };

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

  const isScheduleDisabled = isSchedulingAction || 
    (selectedScenarioIndex === null) || 
    (selectedScenarioIndex === 'custom' && customScenarioText.trim().length < 5);

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
          This task takes place out in the real world! Select a scenario (or write your own) to schedule your goal, execute it, and log your reflection.
        </p>
      </div>

      {/* ⚡ ACTIVE USER ACTION CARD */}
      <ActionItemCard taskId={task.id} />

      {/* RECOMMENDED RESOURCES / PLAYBOOK GUIDES */}
      <TaskResourcesList resources={task.resources} />

      {/* Counter Progress Tracker (if target_count > 1) */}
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

      {/* Completed Banner */}
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

      {/* 💡 STEP 1: SCENARIOS SELECTION & CUSTOM INPUT */}
      {!isInProgress && !isCompleted && !showReflectionInput && (
        <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Choose Your Action Approach
            </span>
            <p className="text-xs text-muted-foreground">
              Select a suggested scenario or write your own custom challenge:
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

            {/* Custom Scenario Option */}
            <div
              onClick={() => setSelectedScenarioIndex('custom')}
              className={`p-3.5 rounded-xl border transition cursor-pointer text-xs font-medium flex items-start gap-3 ${
                selectedScenarioIndex === 'custom'
                  ? 'border-primary bg-primary/5 text-foreground font-bold shadow-sm' 
                  : 'border-border bg-card hover:bg-muted/30 text-muted-foreground'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                selectedScenarioIndex === 'custom' ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40'
              }`}>
                {selectedScenarioIndex === 'custom' && <Check className="w-2.5 h-2.5" />}
              </div>
              <div className="space-y-2 w-full">
                <span className="flex items-center gap-1.5 font-bold text-primary">
                  <PenTool className="w-3.5 h-3.5" />
                  Create My Own Custom Scenario
                </span>
                
                {selectedScenarioIndex === 'custom' && (
                  <Input
                    type="text"
                    className="w-full h-9 text-xs bg-background"
                    placeholder="e.g. Ask a gym receptionist if I can bring my cat in for a 5-minute workout."
                    value={customScenarioText}
                    onChange={(e) => setCustomScenarioText(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleScheduleScenarioAction}
            disabled={isScheduleDisabled}
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

      {/* ⚡ STEP 2: IN-PROGRESS PROMPT */}
      {isInProgress && !isCompleted && !showReflectionInput && (
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
              className="w-full min-h-[100px] text-xs leading-relaxed resize-none bg-background"
              placeholder="e.g. I asked the barista if I could steam my own milk. They laughed, said 'Health code says no, but I appreciate the bold ask!' It felt hilarious and completely harmless."
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

      {/* Allow adding extra log entries if finished */}
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
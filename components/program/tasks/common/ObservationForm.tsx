// components/program/tasks/common/ObservationForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { createObservationAction, getUserObservationsAction } from '@/actions/observations';
import { setTaskStatusInProgressAction } from '@/actions/progress';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { Database } from '@/types/supabase';
import { BaseTaskComponentProps } from '../types';
import { ReferenceSchema } from '@/types/playbook';
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  ExternalLink, 
  Plus, 
  Eye, 
  MapPin, 
  User, 
  Clock,
  ArrowRight
} from 'lucide-react';

type UserObservationRow = Database['public']['Tables']['user_observations']['Row'];

interface ObservationInputs {
  who: string;
  where_location: string;
  when_context: string;
  what: string;
  notes: string;
}

export function ObservationForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [observations, setObservations] = useState<UserObservationRow[]>([]);

  const isCompleted = existingProgress?.status === 'completed';
  const isInProgress = existingProgress?.status === 'in_progress' || observations.length > 0;

  const [showForm, setShowForm] = useState(!isCompleted);

  const requiredResources: ReferenceSchema[] = (task.resources || []).filter((r: ReferenceSchema) => r.isRequired);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ObservationInputs>({
    defaultValues: {
      who: 'Myself',
      where_location: 'At Home',
      when_context: 'Morning Routine',
      what: '',
      notes: ''
    }
  });

  // Fetch logged observations for this task
  useEffect(() => {
    async function loadObservations() {
      const res = await getUserObservationsAction(task.id);
      if (res.success && res.data) {
        setObservations(res.data);
      }
    }
    loadObservations();
  }, [task.id]);

  // 1. Add Observation (Sets task status to 'in_progress' on first entry)
  const onSubmitObservation = async (formData: ObservationInputs) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const obsRes = await createObservationAction({
        taskId: task.id,
        who: formData.who,
        whereLocation: formData.where_location,
        whenContext: formData.when_context,
        what: formData.what,
        notes: formData.notes,
        metadata: {
          category: task.observation_context?.category || 'personal_problems',
          source: 'ObservationForm'
        }
      });

      if (!obsRes.success) {
        setErrorMessage(obsRes.error || 'Failed to save observation');
        setIsSubmitting(false);
        return;
      }

      const newObservation = obsRes.data;
      setObservations(prev => [newObservation, ...prev]);

      // Switch status to 'in_progress' if not already set
      if (!isCompleted && existingProgress?.status !== 'in_progress') {
        const progressRes = await setTaskStatusInProgressAction({
          taskId: task.id,
          questId: (task as any).quest_id,
          missionId: (task as any).mission_id,
        });

        if (progressRes.success && progressRes.data) {
          setProgressStoreRow(progressRes.data as any);
        }
      }

      // Reset form fields for the next entry while retaining helpful defaults
      reset({
        who: formData.who,
        where_location: formData.where_location,
        when_context: formData.when_context,
        what: '',
        notes: ''
      });

    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Complete Task Action (Explicit user finish)
  const handleCompleteTask = async () => {
    if (observations.length === 0) {
      setErrorMessage('Please log at least one observation before completing this step.');
      return;
    }

    setIsCompleting(true);
    setErrorMessage(null);

    try {
      const taskResult = await processTaskCompletion({
        task,
        savedPayload: {
          total_observations: observations.length,
          last_updated_at: new Date().toISOString()
        }
      });

      if (!taskResult.success) {
        setErrorMessage(taskResult.error || 'Failed to record task completion');
        setIsCompleting(false);
        return;
      }

      setShowForm(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setIsCompleting(false);
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

      {/* COMPLETED BANNER */}
      {isCompleted && !showForm && (
        <div className="w-full space-y-3 border rounded-2xl p-5 bg-emerald-500/5 border-emerald-500/20 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Observations Logged & Step Completed
            </span>
            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-bold">
              {observations.length} Observations Captured
            </Badge>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
            className="text-xs font-semibold gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Additional Observation
          </Button>
        </div>
      )}

      {/* LOGGED OBSERVATIONS LIST */}
      {observations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Captured Observations ({observations.length}):
            </span>
            {isInProgress && !isCompleted && (
              <Badge variant="outline" className="text-[9px] font-mono border-amber-500/40 text-amber-500 bg-amber-500/10">
                In Progress
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {observations.map((obs) => (
              <div key={obs.id} className="p-4 rounded-xl border border-border bg-card space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-primary" />
                    {obs.who}
                  </span>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-muted-foreground/70" />
                      {obs.where_location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground/70" />
                      {obs.when_context}
                    </span>
                  </div>
                </div>
                <p className="text-xs font-medium text-foreground leading-relaxed">
                  "{obs.what}"
                </p>
                {obs.notes && (
                  <p className="text-[11px] text-muted-foreground italic border-t pt-2">
                    Note: {obs.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OBSERVATION INPUT FORM */}
      {(showForm || !isCompleted) && (
        <form onSubmit={handleSubmit(onSubmitObservation)} className="p-5 rounded-2xl border border-border bg-card/60 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              {observations.length > 0 ? 'Log Another Observation' : 'Log a Real Observation'}
            </span>
            <p className="text-xs text-muted-foreground">
              {task.briefing_text}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Who? *</Label>
              <Input
                type="text"
                placeholder="e.g. Myself, Colleague"
                className="text-xs h-9"
                {...register('who', { required: true })}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Where? *</Label>
              <Input
                type="text"
                placeholder="e.g. At Home, Office, Gym"
                className="text-xs h-9"
                {...register('where_location', { required: true })}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">When / Context? *</Label>
              <Input
                type="text"
                placeholder="e.g. Morning Routine, Commute"
                className="text-xs h-9"
                {...register('when_context', { required: true })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">What is the exact observation / pain point? *</Label>
            <Textarea
              className="text-xs leading-relaxed resize-none min-h-[80px]"
              placeholder="e.g. It takes 20 minutes every morning to manually re-enter receipts into spreadsheet software."
              {...register('what', { required: true, minLength: 5 })}
            />
            {errors.what && (
              <p className="text-[11px] text-destructive font-semibold">
                Please describe the observation (at least 5 characters).
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Additional Notes (Optional)</Label>
            <Input
              type="text"
              placeholder="e.g. They complained about it 3 times this week."
              className="text-xs h-9"
              {...register('notes')}
            />
          </div>

          <Button
            type="submit"
            variant="outline"
            className="w-full h-9 text-xs font-bold uppercase tracking-wider cursor-pointer gap-1.5"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving Entry...
              </span>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Save Observation Entry
              </>
            )}
          </Button>
        </form>
      )}

      {/* COMPLETE TASK CTA (Active once at least 1 observation is logged) */}
      {!isCompleted && observations.length > 0 && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-foreground block">
              Ready to wrap up this task?
            </span>
            <p className="text-[11px] text-muted-foreground">
              You have logged {observations.length} observation{observations.length > 1 ? 's' : ''}. Complete the step to earn your XP.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleCompleteTask}
            disabled={isCompleting}
            className="h-10 px-5 text-xs font-bold tracking-wider uppercase cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
          >
            {isCompleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Complete Task (+{task.grant_points} XP)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
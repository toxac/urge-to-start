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
import { TaskResourcesList } from '../TaskResourcesList';
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Eye, 
  MapPin, 
  User, 
  Clock,
  ArrowRight,
  Award,
  Search
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

  const category = task.observation_context?.category || 'personal_problems';

  // Dynamic configuration based on category framing
  const formConfig = category === 'skills'
    ? {
        headerTitle: 'Audit a Personal Skill or Asset',
        headerIcon: <Award className="w-3.5 h-3.5 text-amber-500" />,
        whoLabel: 'Who asks for help? *',
        whoPlaceholder: 'e.g. Myself, Friends, Classmates, Clients',
        whoDefault: 'Myself & Peers',
        whereLabel: 'Skill Category / Domain *',
        wherePlaceholder: 'e.g. Technical, Design, Writing, Sales',
        whereDefault: 'Technical & Web Dev',
        whenLabel: 'Frequency / Context *',
        whenPlaceholder: 'e.g. Frequent requests, Past projects',
        whenDefault: 'Weekly Requests',
        whatLabel: 'Core Skill or Natural Strength *',
        whatPlaceholder: 'e.g. Rapidly prototyping clean UI layouts or writing Python automation scripts.',
        notesLabel: 'Evidence / What people specifically ask you for (Optional)',
        notesPlaceholder: 'e.g. Friends regularly ask me to help them debug Next.js app errors before project deadlines.',
        submitButtonText: 'Save Skill Asset Entry',
        loggedHeader: 'Audited Skill Assets',
        completedTitle: 'Skill Assets Audited & Step Completed'
      }
    : category === 'zone_of_influence'
    ? {
        headerTitle: 'Observe People Around You',
        headerIcon: <Search className="w-3.5 h-3.5 text-primary" />,
        whoLabel: 'Who did you observe? *',
        whoPlaceholder: 'e.g. Coworker, Friend, Neighbor, Local Shop Owner',
        whoDefault: 'Colleague',
        whereLabel: 'Where did you notice this? *',
        wherePlaceholder: 'e.g. Office Coffee Machine, Gym, Local Cafe',
        whereDefault: 'Office',
        whenLabel: 'When / Situation? *',
        whenPlaceholder: 'e.g. Weekly team sync, Lunch break',
        whenDefault: 'Lunch Break',
        whatLabel: 'What exact complaint or struggle did they express? *',
        whatPlaceholder: 'e.g. They complained that scheduling shifts for 10 part-time staff takes them 3 hours every Sunday.',
        notesLabel: 'Observation Notes / Emotional Intensity (Optional)',
        notesPlaceholder: 'e.g. They seemed extremely frustrated and mentioned they would gladly pay for an auto-scheduler.',
        submitButtonText: 'Save Observation Entry',
        loggedHeader: 'Observed People Pains',
        completedTitle: 'People Observations Recorded & Step Completed'
      }
    : {
        headerTitle: 'Log a Personal Frustration',
        headerIcon: <Eye className="w-3.5 h-3.5 text-primary" />,
        whoLabel: 'Who experiences this? *',
        whoPlaceholder: 'e.g. Myself, My Family',
        whoDefault: 'Myself',
        whereLabel: 'Where does it happen? *',
        wherePlaceholder: 'e.g. At Home, Grocery Store, Office',
        whereDefault: 'At Home',
        whenLabel: 'When / Context? *',
        whenPlaceholder: 'e.g. Morning Routine, Commute',
        whenDefault: 'Morning Routine',
        whatLabel: 'What is the exact frustration / pain point? *',
        whatPlaceholder: 'e.g. It takes 20 minutes every morning to manually re-enter receipts into spreadsheet software.',
        notesLabel: 'Additional Notes (Optional)',
        notesPlaceholder: 'e.g. I complained about this 3 times this week.',
        submitButtonText: 'Save Frustration Entry',
        loggedHeader: 'Captured Frustrations',
        completedTitle: 'Frustrations Logged & Step Completed'
      };

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ObservationInputs>({
    defaultValues: {
      who: formConfig.whoDefault,
      where_location: formConfig.whereDefault,
      when_context: formConfig.whenDefault,
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
          category,
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

  const handleCompleteTask = async () => {
    if (observations.length === 0) {
      setErrorMessage('Please add at least one entry before completing this step.');
      return;
    }

    setIsCompleting(true);
    setErrorMessage(null);

    try {
      const taskResult = await processTaskCompletion({
        task,
        savedPayload: {
          total_observations: observations.length,
          category,
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

      {/* RECOMMENDED RESOURCES / PLAYBOOK GUIDES */}
      <TaskResourcesList resources={task.resources} />

      {/* COMPLETED BANNER */}
      {isCompleted && !showForm && (
        <div className="w-full space-y-3 border rounded-2xl p-5 bg-emerald-500/5 border-emerald-500/20 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              {formConfig.completedTitle}
            </span>
            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-bold">
              {observations.length} Entries
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
            Add Additional Entry
          </Button>
        </div>
      )}

      {/* LOGGED OBSERVATIONS LIST */}
      {observations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              {formConfig.loggedHeader} ({observations.length}):
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
                    Evidence / Notes: {obs.notes}
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
              {formConfig.headerIcon}
              {observations.length > 0 ? `Log Another Entry` : formConfig.headerTitle}
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {task.briefing_text}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground block">{formConfig.whoLabel}</Label>
              <Input
                type="text"
                placeholder={formConfig.whoPlaceholder}
                className="text-xs h-9 bg-background"
                {...register('who', { required: true })}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground block">{formConfig.whereLabel}</Label>
              <Input
                type="text"
                placeholder={formConfig.wherePlaceholder}
                className="text-xs h-9 bg-background"
                {...register('where_location', { required: true })}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground block">{formConfig.whenLabel}</Label>
              <Input
                type="text"
                placeholder={formConfig.whenPlaceholder}
                className="text-xs h-9 bg-background"
                {...register('when_context', { required: true })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground block">
              {formConfig.whatLabel}
            </Label>
            <Textarea
              className="text-xs leading-relaxed bg-background resize-none min-h-[80px]"
              placeholder={formConfig.whatPlaceholder}
              {...register('what', { required: true, minLength: 5 })}
            />
            {errors.what && (
              <p className="text-[11px] text-destructive font-semibold">
                Please fill in this required field (at least 5 characters).
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground block">
              {formConfig.notesLabel}
            </Label>
            <Input
              type="text"
              placeholder={formConfig.notesPlaceholder}
              className="text-xs h-9 bg-background"
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
                {formConfig.submitButtonText}
              </>
            )}
          </Button>
        </form>
      )}

      {/* COMPLETE TASK CTA */}
      {!isCompleted && observations.length > 0 && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-foreground block">
              Ready to wrap up this task?
            </span>
            <p className="text-[11px] text-muted-foreground">
              You have recorded {observations.length} entry{observations.length > 1 ? 'ies' : ''}. Complete the step to earn your XP.
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
// components/program/tasks/mission1/MotivationForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateMyProfile } from '@/actions/profiles';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { updateProfileStoreFields, $profileStore } from '@/lib/stores/profileStore';
import { useStore } from '@nanostores/react';
import { BaseTaskComponentProps } from '../types';
import { ProfileMotivationSchema } from '@/types/profiles';
import { ReferenceSchema } from '@/types/playbook';
import { Loader2, Edit2, CheckCircle2, AlertCircle, BookOpen, ExternalLink } from 'lucide-react';

export function MotivationForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const profile = useStore($profileStore);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isInitiallyCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isInitiallyCompleted);

  const requiredResources: ReferenceSchema[] = (task.resources || []).filter((r: ReferenceSchema) => r.isRequired);

  const preSavedMotivation: ProfileMotivationSchema =
    existingProgress?.saved_payload?.formData || profile?.motivations || {
      push: '',
      push_other: '',
      pull: '',
      pull_other: '',
      urgency: '',
      urgency_other: '',
      why_statement: '',
    };

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<ProfileMotivationSchema>({
    defaultValues: {
      push: preSavedMotivation.push || '',
      push_other: preSavedMotivation.push_other || '',
      pull: preSavedMotivation.pull || '',
      pull_other: preSavedMotivation.pull_other || '',
      urgency: preSavedMotivation.urgency || '',
      urgency_other: preSavedMotivation.urgency_other || '',
      why_statement: preSavedMotivation.why_statement || '',
    }
  });

  const selectedPush = useWatch({ control, name: 'push' });
  const selectedPull = useWatch({ control, name: 'pull' });
  const selectedUrgency = useWatch({ control, name: 'urgency' });

  const onSubmit = async (formData: ProfileMotivationSchema) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Sync Profile Data
      const profileSync = await updateMyProfile({
        motivations: formData as any
      });

      if (!profileSync.success) {
        setErrorMessage(profileSync.error || 'Failed to update profile');
        setIsSubmitting(false);
        return;
      }

      if (profileSync.data) {
        updateProfileStoreFields(profileSync.data as any);
      }

      // 2. Process Task Completion & Points
      const taskResult = await processTaskCompletion({
        task,
        savedPayload: { formData }
      });

      if (taskResult.success) {
        setIsEditing(false);
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(taskResult.error || 'Failed to record task completion');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="w-full space-y-5 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            Motivations Saved
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Motivation
          </Button>
        </div>

        <div className="space-y-4 text-xs leading-relaxed">
          <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Your North Star Anchor
            </span>
            <p className="text-sm font-bold text-foreground italic">
              "{preSavedMotivation.why_statement}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-card border border-border/60">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Running From 
              </span>
              <p className="text-xs font-medium text-foreground capitalize mt-0.5">
                {preSavedMotivation.push === 'other' ? preSavedMotivation.push_other : preSavedMotivation.push}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/60">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Running Toward 
              </span>
              <p className="text-xs font-medium text-foreground capitalize mt-0.5">
                {preSavedMotivation.pull === 'other' ? preSavedMotivation.pull_other : preSavedMotivation.pull}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border/60">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Urgency 
              </span>
              <p className="text-xs font-medium text-foreground capitalize mt-0.5">
                {preSavedMotivation.urgency === 'other' ? preSavedMotivation.urgency_other : preSavedMotivation.urgency}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-left">
      {errorMessage && (
        <div className="w-full p-4 border rounded-xl bg-destructive/10 border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

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

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">

        {/* Question 1: Push Driver */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground block">
            1. What are you running from? *
          </Label>
          <Select
            value={selectedPush ?? ''}
            onValueChange={(val) => setValue('push', val ?? '', { shouldValidate: true })}
          >
            <SelectTrigger className="w-full text-xs h-10">
              <SelectValue placeholder="Select what is pushing you to start..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="boss">Tired of answering to a boss</SelectItem>
              <SelectItem value="toxic">Sick of a toxic work environment</SelectItem>
              <SelectItem value="paycheck">Living paycheck to paycheck</SelectItem>
              <SelectItem value="dead_end">Stuck in a dead-end career</SelectItem>
              <SelectItem value="potential">Terrified of wasting my potential</SelectItem>
              <SelectItem value="autonomy">Desperate for freedom and autonomy</SelectItem>
              <SelectItem value="other">Other (specify below)</SelectItem>
            </SelectContent>
          </Select>

          {selectedPush === 'other' && (
            <Input
              className="text-xs h-9 mt-2"
              placeholder="Specify what you are running from..."
              {...register('push_other', { required: selectedPush === 'other' })}
            />
          )}
        </div>

        {/* Question 2: Pull Driver */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground block">
            2. What are you running toward?*
          </Label>
          <Select
            value={selectedPull ?? ''}
            onValueChange={(val) => setValue('pull', val ?? '', { shouldValidate: true })}
          >
            <SelectTrigger className="w-full text-xs h-10">
              <SelectValue placeholder="Select what is pulling you forward..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wealth">Build generational wealth</SelectItem>
              <SelectItem value="meaning">Create something deeply meaningful</SelectItem>
              <SelectItem value="time">Complete control over my time</SelectItem>
              <SelectItem value="prove">Prove to myself I can do it</SelectItem>
              <SelectItem value="legacy">Leave a legacy for my family</SelectItem>
              <SelectItem value="community">Build a team and serve a community</SelectItem>
              <SelectItem value="other">Other (specify below)</SelectItem>
            </SelectContent>
          </Select>

          {selectedPull === 'other' && (
            <Input
              className="text-xs h-9 mt-2"
              placeholder="Specify what you are running toward..."
              {...register('pull_other', { required: selectedPull === 'other' })}
            />
          )}
        </div>

        {/* Question 3: Urgency */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground block">
            3. Why do you want to start now?*
          </Label>
          <Select
            value={selectedUrgency ?? ''}
            onValueChange={(val) => setValue('urgency', val ?? '', { shouldValidate: true })}
          >
            <SelectTrigger className="w-full text-xs h-10">
              <SelectValue placeholder="Select your urgency catalyst..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="financial_cliff">Approaching a financial cliff</SelectItem>
              <SelectItem value="life_change">Major life change (marriage, kids, aging parents)</SelectItem>
              <SelectItem value="deadline">I set a strict personal deadline</SelectItem>
              <SelectItem value="market">The market opportunity is closing</SelectItem>
              <SelectItem value="patience">Simply out of patience — can't wait anymore</SelectItem>
              <SelectItem value="age">I'm young enough to take the risk now</SelectItem>
              <SelectItem value="other">Other (specify below)</SelectItem>
            </SelectContent>
          </Select>

          {selectedUrgency === 'other' && (
            <Input
              className="text-xs h-9 mt-2"
              placeholder="Specify why now..."
              {...register('urgency_other', { required: selectedUrgency === 'other' })}
            />
          )}
        </div>

        {/* Question 4: Why Statement */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground block">
            4. In one sentence write why do you want to start*
          </Label>

          <Textarea
            className="w-full min-h-[80px] resize-none text-xs"
            placeholder="e.g. I am starting because I refuse to waste another year in a corporate box, and I want complete freedom over my time for my family."
            {...register('why_statement', { required: true, minLength: 10 })}
          />
          {errors.why_statement && (
            <p className="text-[11px] font-semibold text-destructive">
              Please enter your 1-sentence why statement (at least 10 characters).
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          {isInitiallyCompleted && (
            <Button
              type="button"
              variant="ghost"
              className="h-10 text-xs font-semibold cursor-pointer"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            className="flex-1 h-10 text-xs font-bold tracking-wider uppercase cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </span>
            ) : isInitiallyCompleted ? (
              'Update Motivation'
            ) : (
              `Save Motivation & Complete Task`
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}
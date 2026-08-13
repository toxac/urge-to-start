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
import { TaskResourcesList } from '../TaskResourcesList';
import { Loader2, Edit2, CheckCircle2, AlertCircle, Flame, Target, Clock, Quote, ChevronRight, Lock } from 'lucide-react';

export function MotivationForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const profile = useStore($profileStore);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isInitiallyCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isInitiallyCompleted);

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
      <div className="w-full space-y-6">
        {/* Hero Dossier Header */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Target className="w-24 h-24 text-primary" />
          </div>
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mission Anchored
              </div>
              <h3 className="text-lg font-bold text-foreground">Your Founder Motivation Dossier</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                You have locked in your reasons. This is your anchor. When things get hard, come back here.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-9 gap-2 rounded-full border-primary/30 text-xs font-semibold hover:bg-primary/10 hover:text-primary cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Dossier
            </Button>
          </div>
        </div>

        {/* North Star Card */}
        <div className="relative rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="absolute -top-3 left-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background border border-border/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground shadow-sm">
              <Quote className="w-3 h-3" />
              Your North Star
            </span>
          </div>
          <p className="mt-2 text-base font-medium text-foreground leading-relaxed italic">
            "{preSavedMotivation.why_statement}"
          </p>
        </div>

        {/* Three Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-destructive/30 hover:shadow-md">
            <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <Flame className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
              Running From
            </span>
            <p className="text-sm font-semibold text-foreground">
              {preSavedMotivation.push === 'other' ? preSavedMotivation.push_other : preSavedMotivation.push?.replace(/_/g, ' ')}
            </p>
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-destructive/40 transition-all group-hover:w-full" />
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md">
            <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
              Running Toward
            </span>
            <p className="text-sm font-semibold text-foreground">
              {preSavedMotivation.pull === 'other' ? preSavedMotivation.pull_other : preSavedMotivation.pull?.replace(/_/g, ' ')}
            </p>
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary/40 transition-all group-hover:w-full" />
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-chart-2/30 hover:shadow-md">
            <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
              Why Now
            </span>
            <p className="text-sm font-semibold text-foreground">
              {preSavedMotivation.urgency === 'other' ? preSavedMotivation.urgency_other : preSavedMotivation.urgency?.replace(/_/g, ' ')}
            </p>
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-chart-2/40 transition-all group-hover:w-full" />
          </div>
        </div>

        {/* Locked Footer */}
        <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/40 py-3 text-[11px] text-muted-foreground">
          <Lock className="w-3.5 h-3.5" />
          This motivation is saved to your profile and contributes to your mission progress.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 text-left">
      {/* Mission Briefing Header */}
      <div className="space-y-2 pb-4 border-b border-border/40">
        <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary">
          <Target className="w-4 h-4" />
          Mission Briefing — Step 1 of 1
        </div>
        <h2 className="text-xl font-bold text-foreground">Anchor Your Motivation</h2>
        <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
          Before you build, you need to know <span className="text-foreground font-semibold">why</span> you are building. 
          These four questions form the foundation of your founder journey. Be honest. Be specific.
        </p>
      </div>

      {errorMessage && (
        <div className="w-full p-4 border rounded-xl bg-destructive/10 border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <TaskResourcesList resources={task.resources} />

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">

        {/* Question 1: Push Driver */}
        <div className="relative rounded-2xl border border-border/60 bg-card/50 p-5 space-y-3 transition-all focus-within:border-destructive/30 focus-within:bg-card focus-within:shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-[11px] font-bold text-destructive">
              1
            </div>
            <Label className="text-sm font-bold text-foreground">
              What are you running from? <span className="text-destructive">*</span>
            </Label>
          </div>
          <p className="text-[11px] text-muted-foreground pl-10">
            The pain that is unbearable enough to make you leap. Be brutally honest.
          </p>
          <div className="pl-10">
            <Select
              value={selectedPush ?? ''}
              onValueChange={(val) => setValue('push', val ?? '', { shouldValidate: true })}
            >
              <SelectTrigger className="w-full text-xs h-11 bg-background border-border/60 focus:border-destructive/40 focus:ring-destructive/20">
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
                className="text-xs h-10 mt-3 bg-background border-border/60 focus:border-destructive/40"
                placeholder="Specify what you are running from..."
                {...register('push_other', { required: selectedPush === 'other' })}
              />
            )}
          </div>
        </div>

        {/* Question 2: Pull Driver */}
        <div className="relative rounded-2xl border border-border/60 bg-card/50 p-5 space-y-3 transition-all focus-within:border-primary/30 focus-within:bg-card focus-within:shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
              2
            </div>
            <Label className="text-sm font-bold text-foreground">
              What are you running toward? <span className="text-destructive">*</span>
            </Label>
          </div>
          <p className="text-[11px] text-muted-foreground pl-10">
            The vision that pulls you forward. This is the future you are building.
          </p>
          <div className="pl-10">
            <Select
              value={selectedPull ?? ''}
              onValueChange={(val) => setValue('pull', val ?? '', { shouldValidate: true })}
            >
              <SelectTrigger className="w-full text-xs h-11 bg-background border-border/60 focus:border-primary/40 focus:ring-primary/20">
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
                className="text-xs h-10 mt-3 bg-background border-border/60 focus:border-primary/40"
                placeholder="Specify what you are running toward..."
                {...register('pull_other', { required: selectedPull === 'other' })}
              />
            )}
          </div>
        </div>

        {/* Question 3: Urgency */}
        <div className="relative rounded-2xl border border-border/60 bg-card/50 p-5 space-y-3 transition-all focus-within:border-chart-2/30 focus-within:bg-card focus-within:shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-chart-2/10 text-[11px] font-bold text-chart-2">
              3
            </div>
            <Label className="text-sm font-bold text-foreground">
              Why do you want to start now? <span className="text-destructive">*</span>
            </Label>
          </div>
          <p className="text-[11px] text-muted-foreground pl-10">
            Timing matters. What makes today different from every other day you almost started?
          </p>
          <div className="pl-10">
            <Select
              value={selectedUrgency ?? ''}
              onValueChange={(val) => setValue('urgency', val ?? '', { shouldValidate: true })}
            >
              <SelectTrigger className="w-full text-xs h-11 bg-background border-border/60 focus:border-chart-2/40 focus:ring-chart-2/20">
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
                className="text-xs h-10 mt-3 bg-background border-border/60 focus:border-chart-2/40"
                placeholder="Specify why now..."
                {...register('urgency_other', { required: selectedUrgency === 'other' })}
              />
            )}
          </div>
        </div>

        {/* Question 4: Why Statement */}
        <div className="relative rounded-2xl border border-border/60 bg-card/50 p-5 space-y-3 transition-all focus-within:border-primary/30 focus-within:bg-card focus-within:shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
              4
            </div>
            <Label className="text-sm font-bold text-foreground">
              Your one-sentence founder manifesto <span className="text-destructive">*</span>
            </Label>
          </div>
          <p className="text-[11px] text-muted-foreground pl-10">
            If you had to tattoo one sentence on your mind, what would it be? This is your anchor.
          </p>
          <div className="pl-10">
            <Textarea
              className="w-full min-h-[100px] resize-none text-sm bg-background border-border/60 focus:border-primary/40 leading-relaxed"
              placeholder="I am starting because I refuse to waste another year in a corporate box, and I want complete freedom over my time for my family."
              {...register('why_statement', { required: true, minLength: 10 })}
            />
            {errors.why_statement && (
              <p className="mt-2 text-[11px] font-semibold text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Please enter your 1-sentence why statement (at least 10 characters).
              </p>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-3 pt-4">
          {isInitiallyCompleted && (
            <Button
              type="button"
              variant="ghost"
              className="h-11 px-5 text-xs font-semibold cursor-pointer rounded-full"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            className="flex-1 h-11 text-xs font-bold tracking-wider uppercase cursor-pointer rounded-full gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Anchoring your motivation...
              </span>
            ) : isInitiallyCompleted ? (
              <>
                Update Dossier
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Lock In My Motivation
                <Lock className="w-3.5 h-3.5" />
              </>
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}
// components/program/tasks/MotivationForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { updateMyProfile } from '@/actions/profiles';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { updateProfileStoreFields } from '@/lib/stores/profileStore';
import { BaseTaskComponentProps } from './types';

interface MotivationFormInputs {
  core_focus: string;
  freedom_metric: string;
  anti_goal: string;
}

export function MotivationForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isInitiallyCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isInitiallyCompleted);

  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<MotivationFormInputs>({
    defaultValues: {
      core_focus: preSavedPayload.core_focus || '',
      freedom_metric: preSavedPayload.freedom_metric || '',
      anti_goal: preSavedPayload.anti_goal || '',
    }
  });

  const onSubmit = async (formData: MotivationFormInputs) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const profileSync = await updateMyProfile({
        core_driver: formData as any
      });

      if (!profileSync.success) {
        setErrorMessage(profileSync.error);
        setIsSubmitting(false);
        return;
      }

      if (profileSync.data) {
        updateProfileStoreFields(profileSync.data as any);
      }

      const progressSync = await completeTaskExecution({
        taskId: task.id, // ✅ Using task.id
        savedPayload: formData as Record<string, any>
      });

      if (progressSync.success) {
        if (progressSync.data) {
          setProgressStoreRow(progressSync.data as any);
        }
        setIsEditing(false);
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(progressSync.error);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred saving your motivations');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="w-full space-y-4 border rounded-xl p-5 bg-emerald-50/20 border-emerald-500/10">
        <div className="w-full flex items-center justify-between pb-2 border-b border-dashed">
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            ✨ Inside Your Engine
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-7 text-xs bg-background"
          >
            Edit Answers
          </Button>
        </div>
        <div className="space-y-4 text-sm leading-relaxed">
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-0.5">What you focus on if money wasn't an issue:</p>
            <p className="text-foreground font-medium italic">"{preSavedPayload.core_focus}"</p>
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-0.5">Your definition of personal freedom:</p>
            <p className="text-foreground font-medium italic">"{preSavedPayload.freedom_metric}"</p>
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-0.5">What you are escaping in your current routine:</p>
            <p className="text-foreground font-medium italic">"{preSavedPayload.anti_goal}"</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      {errorMessage && (
        <div className="w-full p-4 border rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="w-full space-y-2">
          <Label className="text-sm font-semibold block text-foreground leading-snug">
            1. Imagine money was completely taken care of forever. Your bills are paid, your family is secure, and you never have to worry about cash again. What kind of projects or problems would you still actively want to wake up and work on? *
          </Label>
          <Textarea
            className="w-full min-h-[90px] resize-none text-sm"
            placeholder="What type of work genuinely interests you when you remove the pressure of making a quick living?"
            {...register('core_focus', { required: true, minLength: 10 })}
          />
          {errors.core_focus && <p className="text-xs font-semibold text-destructive">Tell us what excites you.</p>}
        </div>

        <div className="w-full space-y-2">
          <Label className="text-sm font-semibold block text-foreground leading-snug">
            2. What does personal freedom actually mean to you? *
          </Label>
          <Textarea
            className="w-full min-h-[90px] resize-none text-sm"
            placeholder="Be honest. Is it being able to work from anywhere, choosing your schedule, or building an asset you completely own?"
            {...register('freedom_metric', { required: true, minLength: 10 })}
          />
          {errors.freedom_metric && <p className="text-xs font-semibold text-destructive">Tell us what freedom looks like for you.</p>}
        </div>

        <div className="w-full space-y-2">
          <Label className="text-sm font-semibold block text-foreground leading-snug">
            3. What is the single biggest thing you dislike about your current work routine that you are trying to change? *
          </Label>
          <Textarea
            className="w-full min-h-[90px] resize-none text-sm"
            placeholder="Is it a painful daily commute, endless pointless meetings, or just feeling like your time isn't actually your own?"
            {...register('anti_goal', { required: true, minLength: 10 })}
          />
          {errors.anti_goal && <p className="text-xs font-semibold text-destructive">Knowing exactly what you are escaping is powerful fuel.</p>}
        </div>

        <div className="w-full flex gap-3 mt-4">
          {isInitiallyCompleted && (
            <Button
              type="button"
              variant="ghost"
              className="h-11 text-sm font-semibold"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            className="flex-1 h-11 text-sm font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving Drivers...' : isInitiallyCompleted ? 'Update Core Drivers' : 'Lock in Your Drivers & Earn 20 XP'}
          </Button>
        </div>
      </form>
    </div>
  );
}
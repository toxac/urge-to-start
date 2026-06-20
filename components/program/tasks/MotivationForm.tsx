'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { updateMyProfile } from '@/actions/profiles';
import { completeTaskExecution } from '@/actions/progress';

interface MotivationFormInputs {
  core_focus: string;
  freedom_metric: string;
  anti_goal: string;
}

interface MotivationFormProps {
  taskId: string;
  existingProgress?: {
    status: 'pending' | 'completed';
    saved_payload?: any;
  };
  onSuccess?: () => void;
}

export function MotivationForm({ taskId, existingProgress, onSuccess }: MotivationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isCompleted = existingProgress?.status === 'completed';
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
      // 1. Send the clean object directly to your updated jsonb column—no stringify needed anymore!
      const profileSync = await updateMyProfile({
        core_driver: formData as any
      });

      if (!profileSync.success) {
        setErrorMessage(profileSync.error);
        setIsSubmitting(false);
        return;
      }

      // 2. Clear progress tracking logs and credit user experience points
      const progressSync = await completeTaskExecution({
        taskId,
        savedPayload: formData as Record<string, any>
      });

      if (progressSync.success) {
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

  return (
    <div className="w-full space-y-5">
      {errorMessage && (
        <div className="w-full p-4 border rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        
        {/* QUESTION 1: THE CORE FOCUS */}
        <div className="w-full space-y-2">
          <Label className="text-sm font-semibold block text-foreground leading-snug">
            1. Imagine money was completely taken care of forever. Your bills are paid, your family is secure, and you never have to worry about cash again. What kind of projects or problems would you still actively want to wake up and work on? *
          </Label>
          <Textarea
            className="w-full min-h-[90px] resize-none text-sm"
            placeholder="What type of work or field genuinely interests you when you remove the pressure of making a quick living?"
            disabled={isCompleted}
            {...register('core_focus', { required: true, minLength: 10 })}
          />
          {errors.core_focus && <p className="text-xs font-semibold text-destructive">Give us at least a short sentence here—tell us what excites you.</p>}
        </div>

        {/* QUESTION 2: THE FREEDOM METRIC */}
        <div className="w-full space-y-2">
          <Label className="text-sm font-semibold block text-foreground leading-snug">
            2. What does personal freedom actually mean to you? *
          </Label>
          <Textarea
            className="w-full min-h-[90px] resize-none text-sm"
            placeholder="Be honest. Is it being able to work from anywhere, choosing your own daily schedule, or simply building something you completely own?"
            disabled={isCompleted}
            {...register('freedom_metric', { required: true, minLength: 10 })}
          />
          {errors.freedom_metric && <p className="text-xs font-semibold text-destructive">Tell us what freedom looks like for you.</p>}
        </div>

        {/* QUESTION 3: THE ANTI-GOAL */}
        <div className="w-full space-y-2">
          <Label className="text-sm font-semibold block text-foreground leading-snug">
            3. What is the single biggest thing you dislike about your current work routine that you are trying to change? *
          </Label>
          <Textarea
            className="w-full min-h-[90px] resize-none text-sm"
            placeholder="Is it a painful daily commute, endless pointless meetings, or just feeling like your time isn't actually your own?"
            disabled={isCompleted}
            {...register('anti_goal', { required: true, minLength: 10 })}
          />
          {errors.anti_goal && <p className="text-xs font-semibold text-destructive">Knowing exactly what you are escaping is powerful fuel. Don't leave this blank.</p>}
        </div>

        {/* ACTION TRIGGER */}
        {!isCompleted && (
          <Button 
            type="submit" 
            className="w-full h-11 text-sm font-semibold mt-4" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving Drivers...' : 'Lock in Your Drivers & Earn 20 XP'}
          </Button>
        )}
      </form>
    </div>
  );
}
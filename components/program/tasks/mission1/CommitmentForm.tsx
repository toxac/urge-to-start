// components/program/tasks/mission1/CommitmentForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateMyProfile } from '@/actions/profiles';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { updateProfileStoreFields, $profileStore } from '@/lib/stores/profileStore';
import { useStore } from '@nanostores/react';
import { BaseTaskComponentProps } from '../types';
import { ProfileCommitmentSchema } from '@/types/profiles';
import { TaskResourcesList } from '../TaskResourcesList';
import { Loader2, Edit2, CheckCircle2, AlertCircle, Clock, DollarSign, Calendar } from 'lucide-react';

export function CommitmentForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const profile = useStore($profileStore);
  const currency = profile?.currency || 'INR'; // Dynamic currency from profile store with INR default

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isInitiallyCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isInitiallyCompleted);

  // Pre-fill hierarchy: Task Execution Payload -> Profile Store Column -> Default Values
  const preSavedCommitment: ProfileCommitmentSchema = 
    existingProgress?.saved_payload?.formData || profile?.commitment || {
      weekly_hours: 10,
      capital: 0,
      time_to_launch: 3,
    };

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<ProfileCommitmentSchema>({
    defaultValues: {
      weekly_hours: preSavedCommitment.weekly_hours || 10,
      capital: preSavedCommitment.capital ?? 0,
      time_to_launch: preSavedCommitment.time_to_launch || 3,
    }
  });

  const selectedTimeToLaunch = useWatch({ control, name: 'time_to_launch' });

  // Currency formatter helper
  const formatCurrency = (val: number) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
      }).format(val);
    } catch {
      return `${currency} ${val}`;
    }
  };

  const onSubmit = async (formData: ProfileCommitmentSchema) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const parsedData: ProfileCommitmentSchema = {
      weekly_hours: Number(formData.weekly_hours),
      capital: Number(formData.capital),
      time_to_launch: Number(formData.time_to_launch),
    };

    try {
      // 1. Sync to profiles table
      const profileSync = await updateMyProfile({
        commitment: parsedData as any
      });

      if (!profileSync.success) {
        setErrorMessage(profileSync.error || 'Failed to update profile commitment');
        setIsSubmitting(false);
        return;
      }

      if (profileSync.data) {
        updateProfileStoreFields(profileSync.data as any);
      }

      // 2. Process Task Completion & XP Award
      const taskResult = await processTaskCompletion({
        task,
        savedPayload: { formData: parsedData }
      });

      if (taskResult.success) {
        setIsEditing(false);
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(taskResult.error || 'Failed to mark commitment task complete');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── READ-ONLY COMPLETED VIEW ───
  if (!isEditing) {
    return (
      <div className="w-full space-y-5 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            Commitment & Constraints Saved
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Commitment
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-primary" />
              Weekly Dedicated Hours
            </span>
            <p className="text-base font-bold text-foreground">
              {preSavedCommitment.weekly_hours} hrs / week
            </p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-500" />
              Starting Capital
            </span>
            <p className="text-base font-bold text-foreground">
              {formatCurrency(preSavedCommitment.capital || 0)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-500" />
              Target Launch Window
            </span>
            <p className="text-base font-bold text-foreground">
              Within {preSavedCommitment.time_to_launch} month(s)
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── EDITABLE FORM VIEW ───
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

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        
        {/* Question 1: Weekly Hours */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground block">
            1. How many hours per week can you consistently commit? *
          </Label>
          <Input
            type="number"
            min={1}
            max={80}
            className="text-xs h-10 w-full bg-background"
            placeholder="e.g. 10"
            {...register('weekly_hours', { required: true, min: 1, max: 80 })}
          />
          <p className="text-[11px] text-muted-foreground">
            Be realistic. 5-10 hours/week is plenty for steady progress. Own your actual schedule.
          </p>
          {errors.weekly_hours && (
            <p className="text-[11px] font-semibold text-destructive">
              Please enter a realistic number of weekly hours (1 - 80).
            </p>
          )}
        </div>

        {/* Question 2: Capital Available */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground block">
            2. How much cash capital do you have available to start? ({currency}) *
          </Label>
          <Input
            type="number"
            min={0}
            className="text-xs h-10 w-full bg-background"
            placeholder="e.g. 5000"
            {...register('capital', { required: true, min: 0 })}
          />
          <p className="text-[11px] text-muted-foreground">
            Include savings or small funds allocated specifically for early setup, hosting, or tools in {currency}. 0 is completely fine!
          </p>
          {errors.capital && (
            <p className="text-[11px] font-semibold text-destructive">
              Please enter an amount (0 or more).
            </p>
          )}
        </div>

        {/* Question 3: Time to Launch (MSP Target) */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground block">
            3. How soon do you want to launch?*
          </Label>

          <Select
            value={selectedTimeToLaunch ? String(selectedTimeToLaunch) : '3'}
            onValueChange={(val) => setValue('time_to_launch', Number(val), { shouldValidate: true })}
          >
            <SelectTrigger className="w-full text-xs h-10 bg-background">
              <SelectValue placeholder="Select target launch timeline..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Within 1 month (Rapid Sprint)</SelectItem>
              <SelectItem value="3">Within 3 months (Recommended)</SelectItem>
              <SelectItem value="6">Within 6 months (Steady Pace)</SelectItem>
              <SelectItem value="12">Within 12 months (Long-term Build)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[11px] text-muted-foreground">
            Remember: We build to sell, not just to validate or study.
          </p>
        </div>

        {/* Form Footer Controls */}
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
                Locking in Constraints...
              </span>
            ) : isInitiallyCompleted ? (
              'Update Commitment'
            ) : (
              `Save Commitment & Mark Task Complete`
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}
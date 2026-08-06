// components/program/tasks/mission1/CommitmentForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateMyProfile } from '@/actions/profiles';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { updateProfileStoreFields, $profileStore } from '@/lib/stores/profileStore';
import { useStore } from '@nanostores/react';
import { BaseTaskComponentProps } from '../types';
import { ProfileCommitmentSchema } from '@/types/profiles';
import { ReferenceSchema } from '@/types/playbook';
import { Loader2, Edit2, CheckCircle2, AlertCircle, Clock, DollarSign, Calendar, BookOpen, ExternalLink } from 'lucide-react';

export function CommitmentForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const profile = useStore($profileStore);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isInitiallyCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isInitiallyCompleted);

  // Extract REQUIRED resources to display at the top of the form
  const requiredResources: ReferenceSchema[] = (task.resources || []).filter((r: ReferenceSchema) => r.isRequired);

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

      // 2. Complete Task Execution
      const progressSync = await completeTaskExecution({
        taskId: task.id,
        savedPayload: { formData: parsedData }
      });

      if (progressSync.success) {
        if (progressSync.data) {
          setProgressStoreRow(progressSync.data as any);
        }
        setIsEditing(false);
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(progressSync.error || 'Failed to mark commitment task complete');
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
              ${preSavedCommitment.capital || 0}
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
            className="text-xs h-10 w-full"
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
            2. How much cash capital do you have available to start? ($ USD) *
          </Label>
          <Input
            type="number"
            min={0}
            className="text-xs h-10 w-full"
            placeholder="e.g. 500"
            {...register('capital', { required: true, min: 0 })}
          />
          <p className="text-[11px] text-muted-foreground">
            Include savings or small funds allocated specifically for early setup, hosting, or tools. $0 is completely fine!
          </p>
          {errors.capital && (
            <p className="text-[11px] font-semibold text-destructive">
              Please enter an amount ($0 or more).
            </p>
          )}
        </div>

        {/* Question 3: Time to Launch (MSP Target) */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground block">
            3. What is your target timeline to launch a Minimum Sellable Product (MSP)? *
          </Label>

          <Select
            value={selectedTimeToLaunch ? String(selectedTimeToLaunch) : '3'}
            onValueChange={(val) => setValue('time_to_launch', Number(val), { shouldValidate: true })}
          >
            <SelectTrigger className="w-full text-xs h-10">
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
              `Lock in Commitment & Earn +${task.grant_points} XP`
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}
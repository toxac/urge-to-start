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
import { Loader2, Edit2, CheckCircle2, AlertCircle, Clock, DollarSign, Calendar, Shield, ChevronRight, Lock, Zap } from 'lucide-react';

export function CommitmentForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const profile = useStore($profileStore);
  const currency = profile?.currency || 'INR';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isInitiallyCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isInitiallyCompleted);

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

  if (!isEditing) {
    return (
      <div className="w-full space-y-6">
        {/* Dossier Header */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-6">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Shield className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-500">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Constraints Locked
              </div>
              <h3 className="text-lg font-bold text-foreground">Your Resource Allocation Dossier</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                You have declared your boundaries. These three numbers determine the speed and scale of your build.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-9 gap-2 rounded-full border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/10 hover:text-emerald-500 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Constraints
            </Button>
          </div>
        </div>

        {/* Three Resource Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-amber-500/30 hover:shadow-md">
            <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
              Weekly Fuel
            </span>
            <p className="text-2xl font-bold text-foreground">
              {preSavedCommitment.weekly_hours}
              <span className="text-sm font-medium text-muted-foreground ml-1">hrs</span>
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">per week dedicated</p>
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-amber-500/40 transition-all group-hover:w-full" />
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-emerald-500/30 hover:shadow-md">
            <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
              War Chest
            </span>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(preSavedCommitment.capital || 0)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">starting capital</p>
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-500/40 transition-all group-hover:w-full" />
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md">
            <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
              Launch Window
            </span>
            <p className="text-2xl font-bold text-foreground">
              {preSavedCommitment.time_to_launch}
              <span className="text-sm font-medium text-muted-foreground ml-1">mo</span>
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">target to launch</p>
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary/40 transition-all group-hover:w-full" />
          </div>
        </div>

        {/* Context Footer */}
        <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/40 py-3 text-[11px] text-muted-foreground">
          <Lock className="w-3.5 h-3.5" />
          These constraints shape your mission roadmap. Edit them anytime if your situation changes.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 text-left">
      {/* Mission Briefing Header */}
      <div className="space-y-2 pb-4 border-b border-border/40">
        <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-emerald-500">
          <Shield className="w-4 h-4" />
          Resource Briefing — Define Your Boundaries
        </div>
        <h2 className="text-xl font-bold text-foreground">Know Your Constraints</h2>
        <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
          Every founder operates within limits. The ones who win are the ones who 
          <span className="text-foreground font-semibold"> name their constraints upfront</span> and build around them.
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

        {/* Question 1: Weekly Hours */}
        <div className="relative rounded-2xl border border-border/60 bg-card/50 p-5 space-y-3 transition-all focus-within:border-amber-500/30 focus-within:bg-card focus-within:shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-[11px] font-bold text-amber-500">
              1
            </div>
            <Label className="text-sm font-bold text-foreground">
              Weekly dedicated hours <span className="text-destructive">*</span>
            </Label>
          </div>
          <p className="text-[11px] text-muted-foreground pl-10">
            Be ruthlessly realistic. This is the fuel you will pour into the engine every single week.
          </p>
          <div className="pl-10 space-y-2">
            <Input
              type="number"
              min={1}
              max={80}
              className="text-sm h-11 w-full bg-background border-border/60 focus:border-amber-500/40 focus:ring-amber-500/20"
              placeholder="e.g. 10"
              {...register('weekly_hours', { required: true, min: 1, max: 80 })}
            />
            {errors.weekly_hours && (
              <p className="text-[11px] font-semibold text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Please enter a realistic number of weekly hours (1 - 80).
              </p>
            )}
          </div>
        </div>

        {/* Question 2: Capital */}
        <div className="relative rounded-2xl border border-border/60 bg-card/50 p-5 space-y-3 transition-all focus-within:border-emerald-500/30 focus-within:bg-card focus-within:shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[11px] font-bold text-emerald-500">
              2
            </div>
            <Label className="text-sm font-bold text-foreground">
              Starting capital available <span className="text-muted-foreground font-normal">({currency})</span> <span className="text-destructive">*</span>
            </Label>
          </div>
          <p className="text-[11px] text-muted-foreground pl-10">
            Include savings earmarked for tools, hosting, and early experiments. Zero is a valid answer — many great businesses start with nothing.
          </p>
          <div className="pl-10 space-y-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold">
                {currency}
              </span>
              <Input
                type="number"
                min={0}
                className="text-sm h-11 w-full bg-background border-border/60 pl-12 focus:border-emerald-500/40 focus:ring-emerald-500/20"
                placeholder="0"
                {...register('capital', { required: true, min: 0 })}
              />
            </div>
            {errors.capital && (
              <p className="text-[11px] font-semibold text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Please enter an amount (0 or more).
              </p>
            )}
          </div>
        </div>

        {/* Question 3: Time to Launch */}
        <div className="relative rounded-2xl border border-border/60 bg-card/50 p-5 space-y-3 transition-all focus-within:border-primary/30 focus-within:bg-card focus-within:shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
              3
            </div>
            <Label className="text-sm font-bold text-foreground">
              Target launch window <span className="text-destructive">*</span>
            </Label>
          </div>
          <p className="text-[11px] text-muted-foreground pl-10">
            Set a hard deadline. We build to sell, not to tinker. When does this ship?
          </p>
          <div className="pl-10 space-y-2">
            <Select
              value={selectedTimeToLaunch ? String(selectedTimeToLaunch) : '3'}
              onValueChange={(val) => setValue('time_to_launch', Number(val), { shouldValidate: true })}
            >
              <SelectTrigger className="w-full text-sm h-11 bg-background border-border/60 focus:border-primary/40 focus:ring-primary/20">
                <SelectValue placeholder="Select target launch timeline..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Within 1 month (Rapid Sprint)</SelectItem>
                <SelectItem value="3">Within 3 months (Recommended)</SelectItem>
                <SelectItem value="6">Within 6 months (Steady Pace)</SelectItem>
                <SelectItem value="12">Within 12 months (Long-term Build)</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Zap className="w-3 h-3 text-primary" />
              Remember: We build to sell, not just to validate or study.
            </div>
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
                Locking in Constraints...
              </span>
            ) : isInitiallyCompleted ? (
              <>
                Update Constraints
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Lock In My Constraints
                <Lock className="w-3.5 h-3.5" />
              </>
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}
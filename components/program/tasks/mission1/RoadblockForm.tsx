// components/program/tasks/mission1/RoadblockForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { updateMyProfile } from '@/actions/profiles';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { updateProfileStoreFields, $profileStore } from '@/lib/stores/profileStore';
import { useStore } from '@nanostores/react';
import { BaseTaskComponentProps } from '../types';
import { ProfileRoadblockSchema } from '@/types/profiles';
import { Loader2, Edit2, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

const ROADBLOCK_OPTIONS = [
  { id: 'no_buyers', label: "Afraid no one will buy what I'm selling" },
  { id: 'no_time', label: "I don't have enough time" },
  { id: 'no_knowledge', label: "I don't know the first step" },
  { id: 'public_failure', label: "Worried about failing publicly" },
  { id: 'no_money', label: "I don't have the money to do this" },
  { id: 'wrong_skills', label: "I don't have the right skills" },
  { id: 'burnout', label: "I fear I'll burn out" },
];

export function RoadblockForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const profile = useStore($profileStore);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isInitiallyCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isInitiallyCompleted);

  // Pre-fill hierarchy: Task Execution Payload -> Profile Store Column -> Default Values
  const preSavedRoadblock: ProfileRoadblockSchema = 
    existingProgress?.saved_payload?.formData || profile?.roadblocks || {
      roadblocks: [],
      roadblocks_other: '',
    };

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<ProfileRoadblockSchema>({
    defaultValues: {
      roadblocks: preSavedRoadblock.roadblocks || [],
      roadblocks_other: preSavedRoadblock.roadblocks_other || '',
    }
  });

  const selectedRoadblocks = watch('roadblocks') || [];

  const onSubmit = async (formData: ProfileRoadblockSchema) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Sync to profiles table
      const profileSync = await updateMyProfile({
        roadblocks: formData as any
      });

      if (!profileSync.success) {
        setErrorMessage(profileSync.error || 'Failed to update profile roadblocks');
        setIsSubmitting(false);
        return;
      }

      if (profileSync.data) {
        updateProfileStoreFields(profileSync.data as any);
      }

      // 2. Complete Task Execution
      const progressSync = await completeTaskExecution({
        taskId: task.id,
        savedPayload: { formData }
      });

      if (progressSync.success) {
        if (progressSync.data) {
          setProgressStoreRow(progressSync.data as any);
        }
        setIsEditing(false);
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(progressSync.error || 'Failed to mark task complete');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── READ-ONLY COMPLETED VIEW ───
  if (!isEditing) {
    const savedList = preSavedRoadblock.roadblocks || [];

    return (
      <div className="w-full space-y-5 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            Roadblocks & Concerns Acknowledged
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Roadblocks
          </Button>
        </div>

        <div className="space-y-3 text-xs">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Fears Surfaced for Coaching:
          </span>

          <div className="flex flex-wrap gap-2">
            {savedList.map((item) => {
              const option = ROADBLOCK_OPTIONS.find((opt) => opt.id === item);
              return (
                <Badge key={item} variant="secondary" className="text-xs py-1 px-3">
                  {option ? option.label : item}
                </Badge>
              );
            })}
          </div>

          {preSavedRoadblock.roadblocks_other && (
            <div className="p-3 rounded-xl bg-card border border-border/60 mt-2 space-y-0.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Additional Concern:
              </span>
              <p className="text-xs font-medium text-foreground italic">
                "{preSavedRoadblock.roadblocks_other}"
              </p>
            </div>
          )}
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

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        
        {/* Question: Multi-Select Roadblocks */}
        <div className="space-y-3">
          <Label className="text-xs font-bold text-foreground block">
            What are your biggest concerns or fears right now? (Select all that apply) *
          </Label>

          <Controller
            name="roadblocks"
            control={control}
            rules={{ validate: (value) => (value && value.length > 0) || 'Select at least one roadblock' }}
            render={({ field }) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ROADBLOCK_OPTIONS.map((option) => {
                  const isChecked = field.value?.includes(option.id);
                  return (
                    <div
                      key={option.id}
                      onClick={() => {
                        const current = field.value || [];
                        const updated = isChecked
                          ? current.filter((val) => val !== option.id)
                          : [...current, option.id];
                        field.onChange(updated);
                      }}
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                        isChecked
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border bg-card hover:border-border/80 text-muted-foreground'
                      }`}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => {}} // handled by parent div click
                        className="pointer-events-none"
                      />
                      <span className="text-xs font-medium leading-snug">
                        {option.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          />

          {errors.roadblocks && (
            <p className="text-[11px] font-semibold text-destructive">
              Please select at least one roadblock holding you back.
            </p>
          )}
        </div>

        {/* Question: Other Concerns */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground block">
            Any other specific concerns on your mind? (Optional)
          </Label>
          <Input
            className="text-xs h-10 w-full"
            placeholder="e.g. Balancing this with caring for my aging parents..."
            {...register('roadblocks_other')}
          />
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
            disabled={isSubmitting || selectedRoadblocks.length === 0}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Acknowledging Roadblocks...
              </span>
            ) : isInitiallyCompleted ? (
              'Update Roadblocks'
            ) : (
              `Surface Fears & Earn +${task.grant_points} XP`
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}
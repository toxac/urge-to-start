'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { updateMyProfile } from '@/actions/profiles';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { updateProfileStoreFields } from '@/lib/stores/profileStore';

interface ProfileFormInputs {
  full_name: string;
  age_group: 'under_18' | '18_24' | '25_34' | '35_44' | '45_54' | '55_plus';
  highest_education: 'high_school' | 'undergraduate_degree' | 'postgraduate_degree' | 'self_taught';
  country: string;
  city: string;
  address?: string;
  description: string;
  avatar_url: string;
}

interface ProfileSetupFormProps {
  taskId: string;
  userId: string;
  existingProgress?: {
    status: 'pending' | 'completed';
    saved_payload?: any;
  };
  onSuccess?: () => void;
}

export function ProfileSetupForm({ taskId, userId, existingProgress, onSuccess }: ProfileSetupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isInitiallyCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isInitiallyCompleted);

  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProfileFormInputs>({
    defaultValues: {
      full_name: preSavedPayload.full_name || '',
      age_group: preSavedPayload.age_group || '',
      highest_education: preSavedPayload.highest_education || '',
      country: preSavedPayload.country || '',
      city: preSavedPayload.city || '',
      address: preSavedPayload.address || '',
      description: preSavedPayload.description || '',
      avatar_url: preSavedPayload.avatar_url || '',
    }
  });

  const trackedAvatarUrl = watch('avatar_url');

  const executeAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setErrorMessage(null);
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const targetStoragePath = `${userId}/avatar_${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(targetStoragePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(targetStoragePath);
      setValue('avatar_url', publicUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'Storage transmission rejected by infrastructure limits');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const processFormSubmission = async (formData: ProfileFormInputs) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const profileSync = await updateMyProfile(formData);
      if (!profileSync.success) {
        setErrorMessage(profileSync.error);
        setIsSubmitting(false);
        return;
      }

      // 1. Instantly update global profile state with the updated data row returned from action
      if (profileSync.data) {
        updateProfileStoreFields(profileSync.data as any);
      }

      const progressSync = await completeTaskExecution({
        taskId,
        savedPayload: formData as Record<string, any>
      });

      if (progressSync.success) {
        // 2. Mirror row data cleanly to the progress cache store map
        if (progressSync.data) {
          setProgressStoreRow(progressSync.data as any);
        }
        setIsEditing(false);
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(progressSync.error);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Fatal execution anomaly captured inside processing pipelines');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="w-full space-y-4 border rounded-xl p-5 bg-emerald-50/20 border-emerald-500/10">
        <div className="w-full flex items-center justify-between pb-2 border-b border-dashed">
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            ✨ Your Crew Introduction Card
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-7 text-xs bg-background"
          >
            Edit Canvas
          </Button>
        </div>
        <div className="w-full flex flex-col sm:flex-row gap-4 items-start sm:items-center text-sm">
          {preSavedPayload.avatar_url && (
            <img
              src={preSavedPayload.avatar_url}
              alt="Avatar"
              className="h-14 w-14 rounded-full object-cover border"
            />
          )}
          <div className="space-y-1">
            <p className="text-base font-bold text-foreground">{preSavedPayload.full_name}</p>
            <p className="text-xs text-muted-foreground font-medium">
              📍 Based in {preSavedPayload.city}, {preSavedPayload.country}
            </p>
          </div>
        </div>
        <div className="text-sm bg-background/50 p-3 rounded-lg border leading-relaxed text-foreground/90 italic">
          "{preSavedPayload.description}"
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {errorMessage && (
        <div className="w-full p-4 border rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(processFormSubmission)} className="w-full space-y-5">
        <div className="w-full space-y-2">
          <Label className="text-sm font-semibold block text-foreground">Workspace Portrait *</Label>
          <div className="w-full flex items-center gap-4 p-3 border rounded-xl bg-muted/10">
            {trackedAvatarUrl ? (
              <img
                src={trackedAvatarUrl}
                alt="Profile Workspace Canvas Avatar"
                className="h-16 w-16 rounded-full object-cover border-2 border-primary shrink-0"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium shrink-0">
                Empty
              </div>
            )}
            <div className="w-full space-y-1">
              <Input
                type="file"
                accept="image/*"
                disabled={uploadingAvatar}
                onChange={executeAvatarUpload}
                className="w-full cursor-pointer file:font-bold"
              />
              <input type="hidden" {...register('avatar_url', { required: true })} />
            </div>
          </div>
          {errors.avatar_url && <p className="text-xs font-semibold text-destructive">An image avatar node is mandatory.</p>}
        </div>

        <div className="w-full space-y-2">
          <Label className="text-sm font-semibold block text-foreground">Full Name *</Label>
          <Input
            className="w-full"
            placeholder="e.g. Jane Dev"
            {...register('full_name', { required: true })}
          />
          {errors.full_name && <p className="text-xs font-semibold text-destructive">This field must be filled.</p>}
        </div>

        <div className="w-full space-y-2">
          <Label className="text-sm font-semibold block text-foreground">Age Bracket *</Label>
          <select
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...register('age_group', { required: true })}
          >
            <option value="">Select current bracket...</option>
            <option value="under_18">Under 18</option>
            <option value="18_24">18 - 24</option>
            <option value="25_34">25 - 34</option>
            <option value="35_44">35 - 44</option>
            <option value="45_54">45 - 54</option>
            <option value="55_plus">55 Plus</option>
          </select>
          {errors.age_group && <p className="text-xs font-semibold text-destructive">Selection mandatory.</p>}
        </div>

        <div className="w-full space-y-2">
          <Label className="text-sm font-semibold block text-foreground">Background Tier *</Label>
          <select
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...register('highest_education', { required: true })}
          >
            <option value="">Select education map...</option>
            <option value="high_school">High School</option>
            <option value="undergraduate_degree">Undergraduate Degree</option>
            <option value="postgraduate_degree">Postgraduate Degree</option>
            <option value="self_taught">Self Taught Operator</option>
          </select>
          {errors.highest_education && <p className="text-xs font-semibold text-destructive">This choice is mandatory.</p>}
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full space-y-2">
            <Label className="text-sm font-semibold block text-foreground">Country *</Label>
            <Input className="w-full" placeholder="e.g. India" {...register('country', { required: true })} />
            {errors.country && <p className="text-xs font-semibold text-destructive">Required.</p>}
          </div>
          <div className="w-full space-y-2">
            <Label className="text-sm font-semibold block text-foreground">City *</Label>
            <Input className="w-full" placeholder="e.g. Mysuru" {...register('city', { required: true })} />
            {errors.city && <p className="text-xs font-semibold text-destructive">Required.</p>}
          </div>
        </div>

        <div className="w-full space-y-2">
          <Label className="text-sm font-semibold block text-foreground">Mailing Address (Optional)</Label>
          <Input className="w-full" placeholder="Billing or corporate logistics coordinates" {...register('address')} />
        </div>

        <div className="w-full space-y-2">
          <Label className="text-sm font-semibold block text-foreground">Your Story *</Label>
          <Textarea
            className="w-full min-h-[110px] resize-none"
            placeholder="Tell us about your background, goals, and what you are building in a short paragraph..."
            {...register('description', { required: true, minLength: 20 })}
          />
          {errors.description && <p className="text-xs font-semibold text-destructive">Provide a comprehensive intro statement (min 20 characters).</p>}
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
            disabled={isSubmitting || uploadingAvatar}
          >
            {isSubmitting ? 'Syncing Profile Records...' : isInitiallyCompleted ? 'Update Profile Details' : 'Save Introduction & Earn 10 XP'}
          </Button>
        </div>
      </form>
    </div>
  );
}
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
  userId: string; // Fed down from global parent session hooks to lock bucket tenancy paths
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

  const isCompleted = existingProgress?.status === 'completed';
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

  // Multi-Tenant Binary Asset Transfer Loop
  const executeAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setErrorMessage(null);
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      // Lock everything cleanly into user-isolated tracking folders
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
      // 1. Transactionally map and write properties directly onto profiles columns
      const profileSync = await updateMyProfile(formData);
      if (!profileSync.success) {
        setErrorMessage(profileSync.error);
        setIsSubmitting(false);
        return;
      }

      // 2. Clear progress checkpoints ledger and increment profile XP logs
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
      setErrorMessage(err.message || 'Fatal execution anomaly captured inside processing pipelines');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {errorMessage && (
        <div className="w-full p-4 border rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(processFormSubmission)} className="w-full space-y-5">
        
        {/* AVATAR BINARY UPLOAD COMPONENT TRACK */}
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
                disabled={isCompleted || uploadingAvatar}
                onChange={executeAvatarUpload}
                className="w-full cursor-pointer file:font-bold"
              />
              <input type="hidden" {...register('avatar_url', { required: true })} />
            </div>
          </div>
          {errors.avatar_url && <p className="text-xs font-semibold text-destructive">An image avatar node is mandatory.</p>}
        </div>

        {/* FULL NAME */}
        <div className="w-full space-y-2">
          <Label className="text-sm font-semibold block text-foreground">Full Name *</Label>
          <Input 
            className="w-full"
            placeholder="e.g. Jane Dev"
            disabled={isCompleted}
            {...register('full_name', { required: true })}
          />
          {errors.full_name && <p className="text-xs font-semibold text-destructive">This criteria parameter must be filled.</p>}
        </div>

        {/* AGE GROUP SELECT */}
        <div className="w-full space-y-2">
          <Label className="text-sm font-semibold block text-foreground">Age Bracket *</Label>
          <select
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isCompleted}
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

        {/* EDUCATION TIER SELECT */}
        <div className="w-full space-y-2">
          <Label className="text-sm font-semibold block text-foreground">Background Tier *</Label>
          <select
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isCompleted}
            {...register('highest_education', { required: true })}
          >
            <option value="">Select education map...</option>
            <option value="high_school">High School</option>
            <option value="undergraduate_degree">Undergraduate Degree</option>
            <option value="postgraduate_degree">Postgraduate Degree</option>
            <option value="self_taught">Self Taught Operator</option>
          </select>
          {errors.highest_education && <p className="text-xs font-semibold text-destructive">Background layer validation parameter is mandatory.</p>}
        </div>

        {/* REGIONAL GEO MATRIX: COUNTRY & CITY */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full space-y-2">
            <Label className="text-sm font-semibold block text-foreground">Country *</Label>
            <Input 
              className="w-full" 
              placeholder="e.g. India"
              disabled={isCompleted}
              {...register('country', { required: true })}
            />
            {errors.country && <p className="text-xs font-semibold text-destructive">Required.</p>}
          </div>
          <div className="w-full space-y-2">
            <Label className="text-sm font-semibold block text-foreground">City *</Label>
            <Input 
              className="w-full" 
              placeholder="e.g. Mysuru"
              disabled={isCompleted}
              {...register('city', { required: true })}
            />
            {errors.city && <p className="text-xs font-semibold text-destructive">Required.</p>}
          </div>
        </div>

        {/* ADDRESS CHANNELS (OPTIONAL) */}
        <div className="w-full space-y-2">
          <Label className="text-sm font-semibold block text-foreground">Mailing Address (Optional)</Label>
          <Input 
            className="w-full"
            placeholder="Billing or corporate logistics coordinates"
            disabled={isCompleted}
            {...register('address')}
          />
        </div>

        {/* CORE BIO PROFESSIONAL DESCRIPTION */}
        <div className="w-full space-y-2">
          <Label className="text-sm font-semibold block text-foreground">Your Professional Blueprint *</Label>
          <Textarea 
            className="w-full min-h-[110px] resize-none"
            placeholder="Describe your operational focus, expertise domains, and targets in a strong paragraph..."
            disabled={isCompleted}
            {...register('description', { required: true, minLength: 20 })}
          />
          {errors.description && <p className="text-xs font-semibold text-destructive">Provide a comprehensive bio node (min 20 characters).</p>}
        </div>

        {/* EMPOWERMENT ACTION SUBMIT TRIGGER */}
        {!isCompleted && (
          <Button 
            type="submit" 
            className="w-full h-11 text-sm font-semibold mt-6"
            disabled={isSubmitting || uploadingAvatar}
          >
            {isSubmitting ? 'Syncing Profile Records Across Clusters...' : 'Save Canvas Parameters & Earn 10 XP'}
          </Button>
        )}
      </form>
    </div>
  );
}
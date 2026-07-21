// components/program/tasks/project/EarlyFollowersForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Users, X, Plus } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface Follower {
  name: string;
  platform: string;
  handle: string;
  notes: string;
}

interface EarlyFollowersData {
  followers: Follower[];
  total_count: number;
  growth_notes: string;
}

const PLATFORM_OPTIONS = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'email', label: 'Email' },
  { value: 'other', label: 'Other' },
];

export function EarlyFollowersForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, control, handleSubmit, formState: { errors } } = useForm<EarlyFollowersData>({
    defaultValues: {
      followers: preSavedPayload.followers || [{ name: '', platform: '', handle: '', notes: '' }],
      total_count: preSavedPayload.total_count || 0,
      growth_notes: preSavedPayload.growth_notes || '',
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'followers'
  });

  useEffect(() => {
    async function loadProject() {
      setIsLoading(true);
      try {
        const result = await getCurrentProject();
        if (result.success && result.data) {
          setProjectId(result.data.id);
        }
      } catch (err) {
        toast.error('Failed to load project data');
      } finally {
        setIsLoading(false);
      }
    }
    loadProject();
  }, [userId]);

  const addFollower = () => {
    append({ name: '', platform: '', handle: '', notes: '' });
  };

  const removeFollower = (index: number) => {
    if (fields.length <= 1) {
      toast.error('You need at least one follower entry');
      return;
    }
    remove(index);
  };

  const onSubmit = async (data: EarlyFollowersData) => {
    setIsSubmitting(true);
    try {
      const validFollowers = data.followers.filter(f => f.name.trim() !== '');

      const payload = {
        build_data: {
          early_followers: {
            followers: validFollowers,
            total_count: data.total_count || validFollowers.length,
            growth_notes: data.growth_notes,
            tracked_at: new Date().toISOString()
          }
        }
      };

      if (projectId) {
        const currentProject = await getCurrentProject();
        let existingBuild = {};
        if (currentProject.success && currentProject.data) {
          existingBuild = (currentProject.data.build_data as any) || {};
        }
        const projectResult = await updateProjectSection(projectId, 'build_data', {
          ...existingBuild,
          ...payload.build_data
        });
        if (!projectResult.success) {
          toast.error(projectResult.error || 'Failed to save project data');
          return;
        }
      } else {
        toast.error('No active project found.');
        return;
      }

      const progressSync = await completeTaskExecution({
        taskId: task.id,
        savedPayload: data
      });

      if (progressSync.success) {
        if (progressSync.data) setProgressStoreRow(progressSync.data as any);
        if (onSuccess) onSuccess();
        toast.success(`✅ Tracked ${validFollowers.length} early followers!`);
      } else {
        toast.error(progressSync.error || 'Failed to save progress');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center gap-2 text-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Early Followers Tracked</span>
        </div>
        <Button variant="outline" onClick={onSuccess} className="w-full">
          Back to Quest
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Track Your Early Followers</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Get 10 people to follow your journey. These will be your early testers, 
          cheerleaders, and first customers. Track who they are.
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-lg space-y-3 relative">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-medium text-muted-foreground">Follower #{index + 1}</h5>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFollower(index)}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                disabled={fields.length <= 1}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Name *
              </Label>
              <Input
                {...register(`followers.${index}.name`, { 
                  required: 'Name is required' 
                })}
                placeholder="e.g., Sarah Johnson"
              />
              {errors.followers?.[index]?.name && (
                <p className="text-xs text-destructive">{errors.followers[index]?.name?.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Platform
                </Label>
                <select
                  {...register(`followers.${index}.platform`)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select platform...</option>
                  {PLATFORM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Handle / Username
                </Label>
                <Input
                  {...register(`followers.${index}.handle`)}
                  placeholder="@sarahj"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Notes
              </Label>
              <Input
                {...register(`followers.${index}.notes`)}
                placeholder="e.g., Met at networking event, works in tech..."
              />
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addFollower}
          className="w-full gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Another Follower
        </Button>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Total Followers Count
            <p className="text-xs font-normal text-muted-foreground">
              How many total followers do you have across all platforms?
            </p>
          </Label>
          <Input
            type="number"
            min="0"
            {...register('total_count', { min: 0 })}
            placeholder="10"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Growth Notes
            <p className="text-xs font-normal text-muted-foreground">
              How are you growing your followers? What's working?
            </p>
          </Label>
          <Textarea
            {...register('growth_notes')}
            placeholder="e.g., I'm posting daily on LinkedIn and getting 5-10 new followers per week..."
            className="min-h-[60px] resize-none"
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full h-11">
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {isSubmitting ? 'Saving...' : `Save & Earn ${task.grant_points} XP`}
      </Button>
    </form>
  );
}
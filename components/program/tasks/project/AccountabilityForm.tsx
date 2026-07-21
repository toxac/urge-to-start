// components/program/tasks/project/AccountabilityForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, UsersRound } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface AccountabilityData {
  accountability_partner: string;
  partner_role: string;
  check_in_frequency: string;
  check_in_method: string;
  commitment_statement: string;
  backup_support: string;
}

export function AccountabilityForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<AccountabilityData>({
    defaultValues: {
      accountability_partner: preSavedPayload.accountability_partner || '',
      partner_role: preSavedPayload.partner_role || '',
      check_in_frequency: preSavedPayload.check_in_frequency || '',
      check_in_method: preSavedPayload.check_in_method || '',
      commitment_statement: preSavedPayload.commitment_statement || '',
      backup_support: preSavedPayload.backup_support || '',
    }
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

  const onSubmit = async (data: AccountabilityData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        build_data: {
          accountability: {
            partner: data.accountability_partner,
            partner_role: data.partner_role,
            check_in_frequency: data.check_in_frequency,
            check_in_method: data.check_in_method,
            commitment_statement: data.commitment_statement,
            backup_support: data.backup_support,
            set_up_at: new Date().toISOString()
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
        toast.success('✅ Accountability set up!');
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
          <span className="font-medium">Accountability Set Up</span>
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
          <UsersRound className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Set Up Your Accountability</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Who's going to keep you accountable? You're more likely to finish if someone's watching. 
          Pick at least one person who'll check in on you.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Accountability Partner *
            <p className="text-xs font-normal text-muted-foreground">
              Who will hold you accountable? A friend? A co-founder? A mentor?
            </p>
          </Label>
          <Input
            {...register('accountability_partner', { required: 'Accountability partner is required' })}
            placeholder="e.g., Sarah Johnson"
          />
          {errors.accountability_partner && (
            <p className="text-xs text-destructive">{errors.accountability_partner.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Their Role
            <p className="text-xs font-normal text-muted-foreground">
              What's their relationship to you? How can they help?
            </p>
          </Label>
          <Input
            {...register('partner_role')}
            placeholder="e.g., My mentor, My co-founder, My friend"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Check-in Frequency *
            </Label>
            <select
              {...register('check_in_frequency', { required: 'Frequency is required' })}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select frequency...</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            {errors.check_in_frequency && (
              <p className="text-xs text-destructive">{errors.check_in_frequency.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Check-in Method *
            </Label>
            <select
              {...register('check_in_method', { required: 'Method is required' })}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select method...</option>
              <option value="video_call">Video Call</option>
              <option value="phone">Phone Call</option>
              <option value="message">Message / Text</option>
              <option value="email">Email</option>
              <option value="in_person">In Person</option>
            </select>
            {errors.check_in_method && (
              <p className="text-xs text-destructive">{errors.check_in_method.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Commitment Statement
            <p className="text-xs font-normal text-muted-foreground">
              What are you committing to? Write it down.
            </p>
          </Label>
          <Textarea
            {...register('commitment_statement')}
            placeholder="e.g., I commit to working on this project for at least 10 hours every week..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Backup Support
            <p className="text-xs font-normal text-muted-foreground">
              Who else can support you if your main accountability partner isn't available?
            </p>
          </Label>
          <Input
            {...register('backup_support')}
            placeholder="e.g., My friend John, The Urge community"
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
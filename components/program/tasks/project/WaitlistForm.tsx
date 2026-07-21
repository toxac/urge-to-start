// components/program/tasks/project/WaitlistForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Users, ExternalLink } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface WaitlistData {
  waitlist_url: string;
  tool_used: string;
  signup_count: number;
  notes: string;
}

export function WaitlistForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, watch, formState: { errors } } = useForm<WaitlistData>({
    defaultValues: {
      waitlist_url: preSavedPayload.waitlist_url || '',
      tool_used: preSavedPayload.tool_used || '',
      signup_count: preSavedPayload.signup_count || 0,
      notes: preSavedPayload.notes || '',
    }
  });

  const waitlistUrl = watch('waitlist_url');

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

  const onSubmit = async (data: WaitlistData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        build_data: {
          waitlist: {
            url: data.waitlist_url,
            tool_used: data.tool_used,
            signup_count: data.signup_count,
            notes: data.notes,
            setup_at: new Date().toISOString()
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
        toast.success('✅ Waitlist set up!');
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
          <span className="font-medium">Waitlist Set Up</span>
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
          <h4 className="font-medium">Set Up Your Waitlist</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Set up a simple waitlist form. Ask for name and email. That's it. 
          The goal is to capture interest from people who want to know when you're ready.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Waitlist URL *
          </Label>
          <Input
            type="url"
            {...register('waitlist_url', { required: 'URL is required' })}
            placeholder="https://yourproduct.com/waitlist"
          />
          {errors.waitlist_url && (
            <p className="text-xs text-destructive">{errors.waitlist_url.message}</p>
          )}
          {waitlistUrl && (
            <a
              href={waitlistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Open your waitlist <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Tool Used
            <p className="text-xs font-normal text-muted-foreground">
              What tool are you using for your waitlist? (Carrd, Typeform, Mailchimp, etc.)
            </p>
          </Label>
          <Input
            {...register('tool_used')}
            placeholder="e.g., Carrd, Typeform, Mailchimp"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Current Signups
            <p className="text-xs font-normal text-muted-foreground">
              How many people have signed up so far?
            </p>
          </Label>
          <Input
            type="number"
            min="0"
            {...register('signup_count', { min: 0 })}
            placeholder="0"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Notes
            <p className="text-xs font-normal text-muted-foreground">
              Any thoughts on growing your waitlist?
            </p>
          </Label>
          <Textarea
            {...register('notes')}
            placeholder="e.g., I'm planning to share this on LinkedIn and Twitter..."
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
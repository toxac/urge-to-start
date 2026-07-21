// components/program/tasks/project/LandingPageCheckForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Globe, ExternalLink } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface LandingPageCheckData {
  landing_page_url: string;
  headline: string;
  problem_solved: string;
  cta_text: string;
  is_live: string;
  feedback_notes: string;
}

export function LandingPageCheckForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  // ✅ FIXED: Added 'watch' to the destructuring
  const { register, handleSubmit, watch, formState: { errors } } = useForm<LandingPageCheckData>({
    defaultValues: {
      landing_page_url: preSavedPayload.landing_page_url || '',
      headline: preSavedPayload.headline || '',
      problem_solved: preSavedPayload.problem_solved || '',
      cta_text: preSavedPayload.cta_text || '',
      is_live: preSavedPayload.is_live || 'yes',
      feedback_notes: preSavedPayload.feedback_notes || '',
    }
  });

  // Get the current value of landing_page_url
  const landingPageUrl = watch('landing_page_url');

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

  const onSubmit = async (data: LandingPageCheckData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        build_data: {
          landing_page: {
            url: data.landing_page_url,
            headline: data.headline,
            problem_solved: data.problem_solved,
            cta_text: data.cta_text,
            is_live: data.is_live === 'yes',
            feedback_notes: data.feedback_notes,
            checked_at: new Date().toISOString()
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
        toast.success('✅ Landing page reviewed!');
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
          <span className="font-medium">Landing Page Reviewed</span>
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
          <Globe className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Review Your Landing Page</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Check your landing page against sales first principles. Does it clearly state who it's for? 
          What problem it solves? What they should do next?
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Landing Page URL *
          </Label>
          <Input
            type="url"
            {...register('landing_page_url', { required: 'URL is required' })}
            placeholder="https://yourproduct.com"
          />
          {errors.landing_page_url && (
            <p className="text-xs text-destructive">{errors.landing_page_url.message}</p>
          )}
          {/* ✅ FIXED: Use the landingPageUrl variable instead of watch() */}
          {landingPageUrl && (
            <a
              href={landingPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Open your landing page <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Headline
            <p className="text-xs font-normal text-muted-foreground">
              What's the main headline on your landing page?
            </p>
          </Label>
          <Input
            {...register('headline')}
            placeholder="e.g., The easiest way to track your expenses"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Problem Solved
            <p className="text-xs font-normal text-muted-foreground">
              Does your landing page clearly state the problem you're solving?
            </p>
          </Label>
          <Textarea
            {...register('problem_solved')}
            placeholder="e.g., We help small business owners track their expenses without the headache..."
            className="min-h-[60px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Call to Action (CTA) Text
            <p className="text-xs font-normal text-muted-foreground">
              What's the primary action you want visitors to take?
            </p>
          </Label>
          <Input
            {...register('cta_text')}
            placeholder="e.g., Join the waitlist, Start your free trial"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Is the page live?
          </Label>
          <select
            {...register('is_live')}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="yes">✅ Yes, it's live</option>
            <option value="no">❌ No, still working on it</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Feedback / Notes
            <p className="text-xs font-normal text-muted-foreground">
              What's working? What needs improvement?
            </p>
          </Label>
          <Textarea
            {...register('feedback_notes')}
            placeholder="e.g., The headline is strong, but I need to add a clearer CTA..."
            className="min-h-[80px] resize-none"
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
// components/program/tasks/mission1/CommunityIntroForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createCommunityPostAction } from '@/actions/posts';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { useStore } from '@nanostores/react';
import { $profileStore } from '@/lib/stores/profileStore';
import { BaseTaskComponentProps } from '../types';
import { ReferenceSchema } from '@/types/playbook';
import { 
  Loader2, 
  Edit2, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface FormValues {
  headline: string;
  intro_content: string;
}

export function CommunityIntroForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const profile = useStore($profileStore);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isInitiallyCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isInitiallyCompleted);

  // Filter required resources to display at top of form
  const requiredResources: ReferenceSchema[] = (task.resources || []).filter((r: ReferenceSchema) => r.isRequired);

  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      headline: preSavedPayload.headline || `Hey Urge Community, I'm ${profile?.fullname || profile?.username || 'a founder'}!`,
      intro_content: preSavedPayload.intro_content || '',
    }
  });

  const onSubmit = async (formData: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Publish post with category = 'introduction'
      const postSync = await createCommunityPostAction({
        title: formData.headline,
        content: formData.intro_content,
        category: 'introduction',
      });

      if (!postSync.success) {
        setErrorMessage(postSync.error || 'Failed to publish community introduction');
        setIsSubmitting(false);
        return;
      }

      // 2. Complete Task Execution
      const progressSync = await completeTaskExecution({
        taskId: task.id,
        savedPayload: {
          headline: formData.headline,
          intro_content: formData.intro_content,
          post_id: postSync.data?.id,
          published_at: new Date().toISOString()
        }
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
    return (
      <div className="w-full space-y-5 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            Community Introduction Published
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Update Intro Post
          </Button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-card border border-border/60 space-y-2">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary shrink-0" />
              {preSavedPayload.headline}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {preSavedPayload.intro_content}
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
        
        {/* Post Title / Headline */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground block">
            1. Introduction Post Headline *
          </Label>
          <Input
            className="text-xs h-10 w-full"
            placeholder="e.g. Hello Urge Community! Building an AI workspace tool."
            {...register('headline', { required: true, minLength: 3 })}
          />
          {errors.headline && (
            <p className="text-[11px] font-semibold text-destructive">
              Please enter a headline for your community post.
            </p>
          )}
        </div>

        {/* Post Body Content */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground block">
            2. Introduce Yourself & Your Mission *
          </Label>
          <Textarea
            className="w-full min-h-[120px] text-xs leading-relaxed"
            placeholder="Share who you are, what problem you care about solving, and what you hope to build during this program..."
            {...register('intro_content', { required: true, minLength: 10 })}
          />
          <p className="text-[11px] text-muted-foreground">
            This post will be published to the Urge Community feed under the Introduction category.
          </p>
          {errors.intro_content && (
            <p className="text-[11px] font-semibold text-destructive">
              Please enter your introduction message (at least 10 characters).
            </p>
          )}
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
                Publishing to Community...
              </span>
            ) : isInitiallyCompleted ? (
              'Update Community Intro'
            ) : (
              `Publish Intro Post & Earn +${task.grant_points} XP`
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}
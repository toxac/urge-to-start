// components/program/tasks/project/ChannelExplorationForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Radio } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface ChannelExplorationData {
  primary_channel: string;
  secondary_channels: string;
  channel_rationale: string;
  notes: string;
}

const CHANNEL_OPTIONS = [
  { value: 'direct_sales', label: 'Direct Sales', description: 'One-on-one outreach, cold calling, networking.' },
  { value: 'content_marketing', label: 'Content Marketing', description: 'Blog posts, videos, podcasts to attract customers.' },
  { value: 'paid_ads', label: 'Paid Ads', description: 'Google Ads, Facebook Ads, LinkedIn Ads.' },
  { value: 'seo', label: 'SEO', description: 'Organic search engine optimization.' },
  { value: 'social_media', label: 'Social Media', description: 'Organic posts on LinkedIn, Twitter, Instagram, etc.' },
  { value: 'partnerships', label: 'Partnerships', description: 'Partner with complementary businesses to reach customers.' },
  { value: 'marketplaces', label: 'Marketplaces', description: 'Sell on platforms like Amazon, Etsy, Shopify App Store.' },
  { value: 'referrals', label: 'Referrals', description: 'Word-of-mouth and customer referral programs.' },
  { value: 'email', label: 'Email Marketing', description: 'Newsletters, email sequences, drip campaigns.' },
  { value: 'events', label: 'Events', description: 'Webinars, conferences, trade shows.' },
];

export function ChannelExplorationForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ChannelExplorationData>({
    defaultValues: {
      primary_channel: preSavedPayload.primary_channel || '',
      secondary_channels: preSavedPayload.secondary_channels || '',
      channel_rationale: preSavedPayload.channel_rationale || '',
      notes: preSavedPayload.notes || '',
    }
  });

  // ✅ Watch primary_channel value
  const selectedChannel = watch('primary_channel');

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

  const onSubmit = async (data: ChannelExplorationData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        channels: {
          primary_channel: data.primary_channel,
          secondary_channels: data.secondary_channels.split('\n').filter(c => c.trim()),
          rationale: data.channel_rationale,
          notes: data.notes,
          explored_at: new Date().toISOString()
        }
      };

      if (projectId) {
        const currentProject = await getCurrentProject();
        let existingFinancial = {};
        if (currentProject.success && currentProject.data) {
          existingFinancial = (currentProject.data.financial_blueprint as any) || {};
        }
        const projectResult = await updateProjectSection(projectId, 'financial_blueprint', {
          ...existingFinancial,
          ...payload
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
        toast.success('✅ Channels explored!');
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
          <span className="font-medium">Channels Explored</span>
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
          <Radio className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Explore Your Channels</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          How will you reach your customers? Direct sales, content marketing, paid ads, partnerships, 
          marketplaces, referrals, social media, SEO, email, events? Which ones fit your customer, 
          product, and skills?
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Primary Channel *
          </Label>
          <div className="space-y-2">
            {CHANNEL_OPTIONS.map((channel) => (
              <label key={channel.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/20 transition">
                <input
                  type="radio"
                  value={channel.value}
                  {...register('primary_channel', { required: 'Please select a primary channel' })}
                  className="mt-1 h-4 w-4 flex-shrink-0 text-primary"
                />
                <div>
                  <div className="text-sm font-medium text-foreground">{channel.label}</div>
                  <div className="text-xs text-muted-foreground">{channel.description}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.primary_channel && <p className="text-xs text-destructive">{errors.primary_channel.message}</p>}
        </div>

        {/* ✅ Show description of selected channel */}
        {selectedChannel && (
          <div className="p-3 border rounded-lg bg-primary/5 border-primary/20">
            <p className="text-xs text-muted-foreground">
              Selected: <span className="font-medium text-foreground">
                {CHANNEL_OPTIONS.find(c => c.value === selectedChannel)?.label}
              </span>
            </p>
            <p className="text-sm text-foreground/80 mt-1">
              {CHANNEL_OPTIONS.find(c => c.value === selectedChannel)?.description}
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Secondary Channels
            <p className="text-xs font-normal text-muted-foreground">
              List other channels you'll use (one per line).
            </p>
          </Label>
          <Textarea
            {...register('secondary_channels')}
            placeholder="Content marketing&#10;Referrals&#10;Email"
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Why This Channel?
            <p className="text-xs font-normal text-muted-foreground">
              Why did you choose this as your primary channel? What makes it a good fit?
            </p>
          </Label>
          <Textarea
            {...register('channel_rationale')}
            placeholder="e.g., Our customers are active on LinkedIn, and we can share content to build trust..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Additional Notes
          </Label>
          <Textarea
            {...register('notes')}
            placeholder="Any other thoughts on channels..."
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
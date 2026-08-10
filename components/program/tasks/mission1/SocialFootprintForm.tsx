// components/program/tasks/mission1/SocialFootprintAForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { updateMyProfile } from '@/actions/profiles';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { updateProfileStoreFields, $profileStore } from '@/lib/stores/profileStore';
import { useStore } from '@nanostores/react';
import { BaseTaskComponentProps } from '../types';
import { ProfileSocialFootprintSchema } from '@/types/profiles';
import { ReferenceSchema } from '@/types/playbook';
import { 
  Loader2, 
  Edit2, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Users, 
  BookOpen,
  Share2,
  Sparkles,
  TrendingUp,
  Target
} from 'lucide-react';

interface FormValues {
  items: ProfileSocialFootprintSchema[];
}

const COMMON_CHANNEL_PRESETS = [
  { name: 'LinkedIn', type: 'platform' },
  { name: 'X / Twitter', type: 'platform' },
  { name: 'Discord Community', type: 'clubs' },
  { name: 'Founders Slack', type: 'clubs' },
  { name: 'Alumni Network', type: 'network' },
];

export function SocialFootprintForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const profile = useStore($profileStore);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isInitiallyCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isInitiallyCompleted);

  const requiredResources: ReferenceSchema[] = (task.resources || []).filter((r: ReferenceSchema) => r.isRequired);

  const savedList: ProfileSocialFootprintSchema[] = 
    existingProgress?.saved_payload?.formData?.items || profile?.social_footprint || [
      {
        type: 'platform',
        name: 'LinkedIn',
        profile_link_url: '',
        total_connections: null,
      }
    ];

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      items: savedList.length > 0 ? savedList : [
        { type: 'platform', name: '', profile_link_url: '', total_connections: null }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const watchedItems = watch('items');

  // Helper to quick-add common channels
  const handleAddPreset = (preset: { name: string; type: string }) => {
    const exists = watchedItems?.some((i) => i.name.toLowerCase() === preset.name.toLowerCase());
    if (!exists) {
      append({
        type: preset.type as any,
        name: preset.name,
        profile_link_url: '',
        total_connections: null,
      });
    }
  };

  const onSubmit = async (formData: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const formattedItems: ProfileSocialFootprintSchema[] = formData.items
      .filter((item) => item.name.trim().length > 0)
      .map((item) => ({
        ...item,
        total_connections: item.total_connections ? Number(item.total_connections) : null
      }));

    if (formattedItems.length === 0) {
      setErrorMessage('Please add at least one social or community channel.');
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Sync to profiles table
      const profileSync = await updateMyProfile({
        social_footprint: formattedItems as any
      });

      if (!profileSync.success) {
        setErrorMessage(profileSync.error || 'Failed to update social footprint');
        setIsSubmitting(false);
        return;
      }

      if (profileSync.data) {
        updateProfileStoreFields(profileSync.data as any);
      }

      // 2. Compute rapid distribution assessment metrics
      const totalReach = formattedItems.reduce((acc, curr) => acc + (curr.total_connections || 0), 0);
      const hasDirectChannel = formattedItems.some(i => i.type === 'clubs' || i.type === 'professional');

      const assessmentSummary = {
        totalChannels: formattedItems.length,
        totalReach,
        hasDirectCommunity: hasDirectChannel,
        topChannel: formattedItems[0]?.name || 'Social Network',
      };

      // 3. Process Task Completion & Award XP
      const taskResult = await processTaskCompletion({
        task,
        savedPayload: { 
          formData: { items: formattedItems },
          assessmentSummary
        }
      });

      if (taskResult.success) {
        setIsEditing(false);
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(taskResult.error || 'Failed to mark task complete');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── READ-ONLY COMPLETED VIEW (With Network Assessment) ───
  if (!isEditing) {
    const list = savedList;
    const assessmentSummary = existingProgress?.saved_payload?.assessmentSummary;
    const totalReach = list.reduce((acc, curr) => acc + (curr.total_connections || 0), 0);

    return (
      <div className="w-full space-y-6 text-left">
        <div className="w-full space-y-5 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Social Footprint & Network Assessment Complete
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Network Map
            </Button>
          </div>

          {/* Network Assessment Header Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-primary" />
                Total Distribution Reach
              </span>
              <p className="text-lg font-extrabold text-foreground font-mono">
                {totalReach.toLocaleString()} <span className="text-xs font-sans text-muted-foreground">connections</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                Active Distribution Channels
              </span>
              <p className="text-lg font-extrabold text-foreground font-mono">
                {list.length} <span className="text-xs font-sans text-muted-foreground">networks mapped</span>
              </p>
            </div>
          </div>

          {/* Mapped Channels List */}
          <div className="space-y-3 text-xs pt-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Your Network Inventory:
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {list.map((item, index) => (
                <div key={index} className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground capitalize text-xs flex items-center gap-1.5">
                      <Share2 className="w-3 h-3 text-primary" />
                      {item.name}
                    </span>
                    <Badge variant="outline" className="text-[9px] uppercase font-bold text-muted-foreground">
                      {item.type}
                    </Badge>
                  </div>

                  {item.profile_link_url && (
                    <a
                      href={item.profile_link_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-primary hover:underline flex items-center gap-1 truncate"
                    >
                      {item.profile_link_url}
                      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                    </a>
                  )}

                  {item.total_connections !== null && (
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1 font-mono">
                      <Users className="w-3 h-3" />
                      {item.total_connections} contacts
                    </p>
                  )}
                </div>
              ))}
            </div>
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

      {/* Quick Presets Toolbar */}
      <div className="p-4 rounded-xl border bg-muted/20 border-border space-y-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Quick-Add Primary Networks
        </span>
        <div className="flex flex-wrap gap-2">
          {COMMON_CHANNEL_PRESETS.map((preset, idx) => {
            const isAdded = watchedItems?.some((i) => i.name.toLowerCase() === preset.name.toLowerCase());

            return (
              <Button
                key={idx}
                type="button"
                variant={isAdded ? 'secondary' : 'outline'}
                size="sm"
                disabled={isAdded}
                onClick={() => handleAddPreset(preset)}
                className="h-7 text-[11px] font-medium cursor-pointer"
              >
                {isAdded ? '✓ ' : '+ '}{preset.name}
              </Button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-foreground block">
              Map Your Social Channels & Professional Communities *
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ type: 'platform', name: '', profile_link_url: '', total_connections: null })}
              className="h-7 text-[10px] font-bold text-primary border-primary/20 hover:bg-primary/10 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              Add Another Channel
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Add as many channels as you have access to (LinkedIn, Twitter/X, Discord communities, Slack groups, Alumni networks, newsletter lists, etc.).
          </p>

          <div className="space-y-4">
            {fields.map((field, index) => {
              const currentType = watchedItems?.[index]?.type || 'platform';

              return (
                <div key={field.id} className="p-4 rounded-xl border border-border bg-card/60 space-y-3 relative">
                  <div className="flex items-center justify-between gap-2 border-b pb-2">
                    <span className="text-[10px] font-bold uppercase text-primary tracking-wider">
                      Channel #{index + 1}
                    </span>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Channel Type */}
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-foreground">Channel Type</Label>
                      <Select
                        value={currentType}
                        onValueChange={(val) => setValue(`items.${index}.type` as const, val as any)}
                      >
                        <SelectTrigger className="w-full text-xs h-9">
                          <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="platform">Social Platform (LinkedIn, X, IG)</SelectItem>
                          <SelectItem value="clubs">Community / Club (Discord, Slack, Meetup)</SelectItem>
                          <SelectItem value="professional">Professional Network (Colleagues)</SelectItem>
                          <SelectItem value="network">Alumni / School Group</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Channel Name */}
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-foreground">Channel Name *</Label>
                      <Input
                        className="text-xs h-9"
                        placeholder="e.g. LinkedIn, NYC Founders Slack"
                        {...register(`items.${index}.name` as const, { required: true })}
                      />
                    </div>

                    {/* Profile Link */}
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-foreground">Profile / Group Link</Label>
                      <Input
                        className="text-xs h-9"
                        placeholder="e.g. https://linkedin.com/in/yourname"
                        {...register(`items.${index}.profile_link_url` as const)}
                      />
                    </div>

                    {/* Connection Count */}
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-foreground">Connections / Members Count</Label>
                      <Input
                        type="number"
                        min={0}
                        className="text-xs h-9"
                        placeholder="e.g. 500"
                        {...register(`items.${index}.total_connections` as const)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
                Analyzing Network & Saving...
              </span>
            ) : isInitiallyCompleted ? (
              'Update Network Map'
            ) : (
              `Lock in Network Map & Earn +${task.grant_points} XP`
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}
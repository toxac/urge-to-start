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
import { runSocialAssessmentAction } from '@/actions/assessments';
import { createUserAction } from '@/actions/userActions';
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
  Target,
  PlusCircle,
  Check
} from 'lucide-react';

interface FormValues {
  items: ProfileSocialFootprintSchema[];
}

const COMMON_CHANNEL_PRESETS = [
  { name: 'LinkedIn', type: 'platform' },
  { name: 'X / Twitter', type: 'platform' },
  { name: 'Discord Community', type: 'clubs' },
  { name: 'Founders Slack', type: 'clubs' },
  { name: 'Alumni Group', type: 'network' },
];

export function SocialFootprintForm({ task, existingProgress }: BaseTaskComponentProps) {
  const profile = useStore($profileStore);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [assessmentResult, setAssessmentResult] = useState<{
    summary: string;
    strengths: string[];
    growthAreas: string[];
    suggestedActions: Array<{
      id: string;
      title: string;
      description: string;
      checkbackDelayDays: number;
      channelName?: string;
    }>;
  } | null>(existingProgress?.saved_payload?.assessmentResult || null);

  const [acceptedActionIds, setAcceptedActionIds] = useState<string[]>([]);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const isInitiallyCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isInitiallyCompleted);

  const requiredResources: ReferenceSchema[] = (task.resources || []).filter((r: ReferenceSchema) => r.isRequired);

  const savedList: ProfileSocialFootprintSchema[] = 
    existingProgress?.saved_payload?.formData?.items || profile?.social_footprint || [
      { type: 'platform', name: 'LinkedIn', profile_link_url: '', total_connections: null }
    ];

  const { register, handleSubmit, control, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      items: savedList.length > 0 ? savedList : [
        { type: 'platform', name: '', profile_link_url: '', total_connections: null }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const watchedItems = watch('items');

  const handleAddPreset = (preset: { name: string; type: string }) => {
    const exists = watchedItems?.some((i) => i.name.toLowerCase() === preset.name.toLowerCase());
    if (!exists) append({ type: preset.type as any, name: preset.name, profile_link_url: '', total_connections: null });
  };

  const handlePickAction = async (actionItem: {
    id: string;
    title: string;
    description: string;
    checkbackDelayDays: number;
    channelName?: string;
  }) => {
    setAcceptingId(actionItem.id);
    try {
      const res = await createUserAction({
        title: actionItem.title,
        description: actionItem.description,
        checkbackDelayDays: actionItem.checkbackDelayDays,
        taskId: task.id,
        metadata: { channel: actionItem.channelName, source: 'social_assessment' }
      });

      if (res.success) {
        setAcceptedActionIds((prev) => [...prev, actionItem.id]);
      } else {
        setErrorMessage(res.error || 'Failed to save action goal');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving action goal');
    } finally {
      setAcceptingId(null);
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
      setErrorMessage('Please add at least one channel or network space.');
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Sync Profile Store
      const profileSync = await updateMyProfile({ social_footprint: formattedItems as any });
      if (!profileSync.success) throw new Error(profileSync.error || 'Failed to update profile');
      if (profileSync.data) updateProfileStoreFields(profileSync.data as any);

      // 2. Trigger AI Network Assessment
      setIsAnalyzing(true);
      const updatedProfileState = { ...profile, social_footprint: formattedItems };
      const aiRes = await runSocialAssessmentAction(updatedProfileState);
      const aiData = aiRes.success ? aiRes.data : null;

      if (aiData) {
        setAssessmentResult(aiData);
      }
      setIsAnalyzing(false);

      // 3. Save Task Progress & Award Points
      const taskResult = await processTaskCompletion({
        task,
        savedPayload: { formData: { items: formattedItems }, assessmentResult: aiData }
      });

      if (taskResult.success) {
        // Keep component open in view mode so user can immediately choose action goals
        setIsEditing(false);
      } else {
        setErrorMessage(taskResult.error || 'Failed to mark task complete');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
      setIsAnalyzing(false);
    }
  };

  // ─── READ-ONLY VIEW WITH ASSESSMENT & ACTION CHOICES ───
  if (!isEditing) {
    const list = savedList;
    const totalReach = list.reduce((acc, curr) => acc + (curr.total_connections || 0), 0);

    return (
      <div className="w-full space-y-6 text-left">
        <div className="w-full space-y-5 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Network Footprint Saved
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Channels
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-primary" />
                Network Reach
              </span>
              <p className="text-base font-bold text-foreground font-mono">
                {totalReach.toLocaleString()} people
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                Active Spaces
              </span>
              <p className="text-base font-bold text-foreground font-mono">
                {list.length} channel(s)
              </p>
            </div>
          </div>

          {/* Assessment Summary Header: "Feedback" */}
          {assessmentResult?.summary && (
            <div className="p-4 rounded-xl bg-card border border-border/60 space-y-2">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Feedback
              </span>
              <p className="text-xs text-foreground font-medium leading-relaxed">
                {assessmentResult.summary}
              </p>
            </div>
          )}

          {/* Action Choices */}
          {assessmentResult?.suggestedActions && assessmentResult.suggestedActions.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-primary" />
                  Pick Next Steps You Want to Take On:
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {assessmentResult.suggestedActions.map((actionItem) => {
                  const isChosen = acceptedActionIds.includes(actionItem.id);
                  const isSaving = acceptingId === actionItem.id;

                  return (
                    <div key={actionItem.id} className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">{actionItem.title}</span>
                          {actionItem.channelName && (
                            <Badge variant="secondary" className="text-[9px] font-mono">{actionItem.channelName}</Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{actionItem.description}</p>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        disabled={isChosen || isSaving}
                        onClick={() => handlePickAction(actionItem)}
                        variant={isChosen ? 'secondary' : 'default'}
                        className="h-8 text-xs font-bold shrink-0 gap-1.5 cursor-pointer"
                      >
                        {isSaving ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : isChosen ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            Added to Goals
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-3.5 h-3.5" />
                            I'll Do This
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
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

      {/* Quick Add Presets */}
      <div className="p-4 rounded-xl border bg-muted/20 border-border space-y-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Quick-Add Common Spaces
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
              Where do you naturally spend time online or in person? *
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ type: 'platform', name: '', profile_link_url: '', total_connections: null })}
              className="h-7 text-[10px] font-bold text-primary border-primary/20 hover:bg-primary/10 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              Add Another Space
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => {
              const currentType = watchedItems?.[index]?.type || 'platform';
              return (
                <div key={field.id} className="p-4 rounded-xl border border-border bg-card/60 space-y-3 relative">
                  <div className="flex items-center justify-between gap-2 border-b pb-2">
                    <span className="text-[10px] font-bold uppercase text-primary tracking-wider">
                      Space #{index + 1}
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
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-foreground">Type</Label>
                      <Select
                        value={currentType}
                        onValueChange={(val) => setValue(`items.${index}.type` as const, val as any)}
                      >
                        <SelectTrigger className="w-full text-xs h-9">
                          <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="platform">Social Media (LinkedIn, X, Instagram)</SelectItem>
                          <SelectItem value="clubs">Community / Chat (Discord, Slack, Meetups)</SelectItem>
                          <SelectItem value="professional">Work Network (Former Coworkers)</SelectItem>
                          <SelectItem value="network">Alumni / School Group</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-foreground">Name *</Label>
                      <Input
                        className="text-xs h-9"
                        placeholder="e.g. LinkedIn, Local Meetup"
                        {...register(`items.${index}.name` as const, { required: true })}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-foreground">Link (Optional)</Label>
                      <Input
                        className="text-xs h-9"
                        placeholder="e.g. https://linkedin.com/in/yourname"
                        {...register(`items.${index}.profile_link_url` as const)}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-foreground">Estimated Reach / Connections</Label>
                      <Input
                        type="number"
                        min={0}
                        className="text-xs h-9"
                        placeholder="e.g. 250"
                        {...register(`items.${index}.total_connections` as const)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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
            disabled={isSubmitting || isAnalyzing}
          >
            {isSubmitting || isAnalyzing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {isAnalyzing ? 'Analyzing spaces & compiling suggestions...' : 'Saving spaces...'}
              </span>
            ) : isInitiallyCompleted ? (
              'Update Network Map'
            ) : (
              `Save Spaces & Get Feedback`
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
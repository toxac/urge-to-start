// components/program/tasks/mission1/SkillsForm.tsx
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
import { ProfileSkills } from '@/types/profiles';
import { TaskResourcesList } from '../TaskResourcesList';
import { 
  Loader2, 
  Edit2, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Wrench,
  Sparkles
} from 'lucide-react';

interface FormValues {
  skills: ProfileSkills[];
}

const COMMON_SKILL_PRESETS = [
  { title: 'Sales & Outreach', category: 'business', level: 'intermediate' },
  { title: 'Copywriting & Content', category: 'creative', level: 'intermediate' },
  { title: 'Graphic / UX Design', category: 'creative', level: 'beginner' },
  { title: 'No-Code / Software Build', category: 'technical', level: 'intermediate' },
  { title: 'Project Management', category: 'interpersonal', level: 'advanced' },
  { title: 'Financial Modeling', category: 'business', level: 'beginner' },
];

export function SkillsForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const profile = useStore($profileStore);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isInitiallyCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isInitiallyCompleted);

  // Pre-fill hierarchy: Task Execution Payload -> Profile Store Column -> Default 1 item
  const savedSkills: ProfileSkills[] = 
    existingProgress?.saved_payload?.formData?.skills || profile?.skills || [
      { category: 'business', title: '', level: 'intermediate' }
    ];

  const { register, handleSubmit, control, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      skills: savedSkills.length > 0 ? savedSkills : [
        { category: 'business', title: '', level: 'intermediate' }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills'
  });

  const watchedSkills = watch('skills');

  const handleAddPreset = (preset: { title: string; category: string; level: string }) => {
    const exists = watchedSkills?.some((s) => s.title.toLowerCase() === preset.title.toLowerCase());
    if (!exists) {
      append(preset);
    }
  };

  const onSubmit = async (formData: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const formattedSkills: ProfileSkills[] = formData.skills
      .filter((s) => s.title.trim().length > 0)
      .map((s) => ({
        category: s.category || 'business',
        title: s.title.trim(),
        level: s.level || 'intermediate'
      }));

    if (formattedSkills.length === 0) {
      setErrorMessage('Please add at least one skill to your inventory.');
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Sync to profiles table
      const profileSync = await updateMyProfile({
        skills: formattedSkills as any
      });

      if (!profileSync.success) {
        setErrorMessage(profileSync.error || 'Failed to update profile skills');
        setIsSubmitting(false);
        return;
      }

      if (profileSync.data) {
        updateProfileStoreFields(profileSync.data as any);
      }

      // 2. Process Program Task Completion & XP Award
      const taskResult = await processTaskCompletion({
        task,
        savedPayload: { formData: { skills: formattedSkills } }
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

  // ─── READ-ONLY COMPLETED VIEW ───
  if (!isEditing) {
    const list = savedSkills;

    return (
      <div className="w-full space-y-5 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            Skill Inventory Saved
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Inventory
          </Button>
        </div>

        <div className="space-y-3 text-xs">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Your Assets ({list.length}):
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {list.map((item, index) => (
              <div key={index} className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                    <Wrench className="w-3 h-3 text-primary" />
                    {item.title}
                  </span>
                  <Badge variant="outline" className="text-[9px] uppercase font-bold capitalize">
                    {item.level}
                  </Badge>
                </div>
                <span className="text-[10px] text-muted-foreground capitalize block font-mono">
                  Category: {item.category}
                </span>
              </div>
            ))}
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

      {/* RECOMMENDED RESOURCES / PLAYBOOK GUIDES */}
      <TaskResourcesList resources={task.resources} />

      {/* Quick Presets Section */}
      <div className="p-4 rounded-xl border bg-muted/20 border-border space-y-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Quick-Add Common Founder Assets
        </span>
        <div className="flex flex-wrap gap-2">
          {COMMON_SKILL_PRESETS.map((preset, idx) => {
            const isAdded = watchedSkills?.some((s) => s.title.toLowerCase() === preset.title.toLowerCase());

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
                {isAdded ? '✓ ' : '+ '}{preset.title}
              </Button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-foreground block">
              Skill & Expertise Inventory *
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ category: 'business', title: '', level: 'intermediate' })}
              className="h-7 text-[10px] font-bold text-primary border-primary/20 hover:bg-primary/10 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              Add Custom Skill
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground">
            List skills you bring to the table. If you've solved a problem using it even once, list it!
          </p>

          <div className="space-y-3">
            {fields.map((field, index) => {
              const currentCategory = watchedSkills?.[index]?.category || 'business';
              const currentLevel = watchedSkills?.[index]?.level || 'intermediate';

              return (
                <div key={field.id} className="p-4 rounded-xl border border-border bg-card/60 space-y-3 relative">
                  <div className="flex items-center justify-between gap-2 border-b pb-2">
                    <span className="text-[10px] font-bold uppercase text-primary tracking-wider">
                      Skill #{index + 1}
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Category */}
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-foreground">Category</Label>
                      <Select
                        value={currentCategory || undefined}
                        onValueChange={(val) => setValue(`skills.${index}.category` as const, (val as string) || '')}
                      >
                        <SelectTrigger className="w-full text-xs h-9 bg-background">
                          <SelectValue placeholder="Category..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="creative">Creative (Design, Writing)</SelectItem>
                          <SelectItem value="technical">Technical (Coding, Systems)</SelectItem>
                          <SelectItem value="business">Business (Sales, Finance, Mktg)</SelectItem>
                          <SelectItem value="interpersonal">Interpersonal (Leadership)</SelectItem>
                          <SelectItem value="craft">Craft (Trade, Production)</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Skill Title */}
                    <div className="space-y-1 md:col-span-1">
                      <Label className="text-[11px] font-semibold text-foreground">Skill Name *</Label>
                      <Input
                        className="text-xs h-9 bg-background"
                        placeholder="e.g. Cold Emailing, Figma, Python"
                        {...register(`skills.${index}.title` as const, { required: true })}
                      />
                    </div>

                    {/* Level */}
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-foreground">Proficiency Level</Label>
                      <Select
                        value={currentLevel || undefined}
                        onValueChange={(val) => setValue(`skills.${index}.level` as const, (val as string) || '')}
                      >
                        <SelectTrigger className="w-full text-xs h-9 bg-background">
                          <SelectValue placeholder="Proficiency..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner (Basic understanding)</SelectItem>
                          <SelectItem value="intermediate">Intermediate (Can deliver results)</SelectItem>
                          <SelectItem value="advanced">Advanced (Deep experience)</SelectItem>
                          <SelectItem value="expert">Expert (Mastery / Professional)</SelectItem>
                        </SelectContent>
                      </Select>
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
                Saving Skills...
              </span>
            ) : isInitiallyCompleted ? (
              'Update Skills'
            ) : (
              `Save Skills & Complete Task`
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}
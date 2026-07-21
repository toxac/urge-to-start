// components/program/tasks/project/SkillsAuditForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Brain, X, Plus } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface Skill {
  skill: string;
  have: boolean;
  level: string;
  notes: string;
}

interface SkillsAuditData {
  skills: Skill[];
  skills_notes: string;
}

const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

export function SkillsAuditForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, control, handleSubmit, formState: { errors } } = useForm<SkillsAuditData>({
    defaultValues: {
      skills: preSavedPayload.skills || [{ skill: '', have: true, level: 'intermediate', notes: '' }],
      skills_notes: preSavedPayload.skills_notes || '',
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills'
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

  const addSkill = () => {
    append({ skill: '', have: true, level: 'intermediate', notes: '' });
  };

  const removeSkill = (index: number) => {
    if (fields.length <= 1) {
      toast.error('You need at least one skill entry');
      return;
    }
    remove(index);
  };

  const onSubmit = async (data: SkillsAuditData) => {
    setIsSubmitting(true);
    try {
      const filteredSkills = data.skills.filter(s => s.skill.trim() !== '');
      const payload = {
        build_data: {
          skill_audit: filteredSkills,
          skills_notes: data.skills_notes,
          inventoried_at: new Date().toISOString()
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
        toast.success(`✅ ${filteredSkills.length} skills audited!`);
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
          <span className="font-medium">Skills Audited</span>
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
          <Brain className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Audit Your Skills</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          What skills do you have? What skills do you need? Be honest. There's no shame in not knowing something—the shame is in pretending.
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-lg space-y-3 relative">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-medium text-muted-foreground">Skill #{index + 1}</h5>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSkill(index)}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                disabled={fields.length <= 1}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Skill Name *
                </Label>
                <Input
                  {...register(`skills.${index}.skill`, { 
                    required: 'Skill name is required' 
                  })}
                  placeholder="e.g., JavaScript, Design, Marketing"
                />
                {errors.skills?.[index]?.skill && (
                  <p className="text-xs text-destructive">{errors.skills[index]?.skill?.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Do you have this skill?
                </Label>
                <select
                  {...register(`skills.${index}.have`)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="true">✅ Yes</option>
                  <option value="false">❌ No</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Level (if you have it)
                </Label>
                <select
                  {...register(`skills.${index}.level`)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {SKILL_LEVELS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Notes
              </Label>
              <Input
                {...register(`skills.${index}.notes`)}
                placeholder="e.g., Need to learn, Can get help from a friend..."
              />
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSkill}
          className="w-full gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Another Skill
        </Button>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Additional Notes
          </Label>
          <Textarea
            {...register('skills_notes')}
            placeholder="Any other thoughts on skills..."
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
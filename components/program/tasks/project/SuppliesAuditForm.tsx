// components/program/tasks/project/SuppliesAuditForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Package, X, Plus } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface Supply {
  name: string;
  type: 'software' | 'hardware' | 'material' | 'tool' | 'other';
  needed: boolean;
  notes: string;
}

interface SuppliesAuditData {
  supplies: Supply[];
  supplies_notes: string;
}

const SUPPLY_TYPES = [
  { value: 'software', label: 'Software' },
  { value: 'hardware', label: 'Hardware' },
  { value: 'material', label: 'Materials' },
  { value: 'tool', label: 'Tools' },
  { value: 'other', label: 'Other' },
];

export function SuppliesAuditForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, control, handleSubmit, formState: { errors } } = useForm<SuppliesAuditData>({
    defaultValues: {
      supplies: preSavedPayload.supplies || [{ name: '', type: 'software', needed: true, notes: '' }],
      supplies_notes: preSavedPayload.supplies_notes || '',
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'supplies'
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

  const addSupply = () => {
    append({ name: '', type: 'software', needed: true, notes: '' });
  };

  const removeSupply = (index: number) => {
    if (fields.length <= 1) {
      toast.error('You need at least one supply entry');
      return;
    }
    remove(index);
  };

  const onSubmit = async (data: SuppliesAuditData) => {
    setIsSubmitting(true);
    try {
      const filteredSupplies = data.supplies.filter(s => s.name.trim() !== '');
      const payload = {
        build_data: {
          supplies_needed: filteredSupplies,
          supplies_notes: data.supplies_notes,
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
        toast.success(`✅ ${filteredSupplies.length} supplies audited!`);
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
          <span className="font-medium">Supplies Audited</span>
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
          <Package className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Audit Your Supplies and Tools</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          What do you need to build this? Software? Hardware? Materials? Tools? 
          What do you already have? What do you need to get?
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-lg space-y-3 relative">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-medium text-muted-foreground">Item #{index + 1}</h5>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSupply(index)}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                disabled={fields.length <= 1}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Item Name *
                </Label>
                <Input
                  {...register(`supplies.${index}.name`, { 
                    required: 'Item name is required' 
                  })}
                  placeholder="e.g., Design software, Laptop, Wood, etc."
                />
                {errors.supplies?.[index]?.name && (
                  <p className="text-xs text-destructive">{errors.supplies[index]?.name?.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Type
                </Label>
                <select
                  {...register(`supplies.${index}.type`)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {SUPPLY_TYPES.map((opt) => (
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
                {...register(`supplies.${index}.notes`)}
                placeholder="e.g., Already have a subscription, Need to purchase..."
              />
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSupply}
          className="w-full gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Another Item
        </Button>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Additional Notes
          </Label>
          <Textarea
            {...register('supplies_notes')}
            placeholder="Any other thoughts on supplies and tools..."
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
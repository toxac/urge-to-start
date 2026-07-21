// components/program/tasks/project/PartnerMappingForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Users, X, Plus } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Partner {
  name: string;
  description: string;
  relationship: string;
  status: string;
}

interface PartnerMappingData {
  partners: Partner[];
  notes: string;
}

const PARTNER_STATUS_OPTIONS = [
  { value: 'identified', label: 'Identified - Not contacted yet' },
  { value: 'contacted', label: 'Contacted - Waiting for response' },
  { value: 'conversation', label: 'In Conversation' },
  { value: 'interested', label: 'Interested - Exploring partnership' },
  { value: 'partnered', label: 'Partnered - Formal agreement' },
  { value: 'not_interested', label: 'Not Interested' },
];

export function PartnerMappingForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, control, handleSubmit, formState: { errors } } = useForm<PartnerMappingData>({
    defaultValues: {
      partners: preSavedPayload.partners || [{ name: '', description: '', relationship: '', status: 'identified' }],
      notes: preSavedPayload.notes || '',
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'partners'
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

  const addPartner = () => {
    append({ name: '', description: '', relationship: '', status: 'identified' });
  };

  const removePartner = (index: number) => {
    if (fields.length <= 1) {
      toast.error('You need at least one partner entry');
      return;
    }
    remove(index);
  };

  const onSubmit = async (data: PartnerMappingData) => {
    setIsSubmitting(true);
    try {
      const filteredPartners = data.partners.filter(p => p.name.trim() !== '');
      const payload = {
        partnerships: {
          identified_partners: filteredPartners,
          partner_count: filteredPartners.length,
          notes: data.notes,
          mapped_at: new Date().toISOString()
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
        toast.success(`✅ ${filteredPartners.length} partners mapped!`);
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
          <span className="font-medium">Partners Mapped</span>
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
          <h4 className="font-medium">Map Potential Partners</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Who already has access to your customers? Complementary businesses? Influencers? 
          Community leaders? Other service providers? Think creatively.
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded-lg space-y-3 relative">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-medium text-muted-foreground">Partner #{index + 1}</h5>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removePartner(index)}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                disabled={fields.length <= 1}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Partner Name *
              </Label>
              <Input
                {...register(`partners.${index}.name`, { 
                  required: 'Partner name is required' 
                })}
                placeholder="e.g., Local business association, Industry influencer"
              />
              {errors.partners?.[index]?.name && (
                <p className="text-xs text-destructive">{errors.partners[index]?.name?.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Description
                <p className="text-xs font-normal text-muted-foreground">
                  Who are they? What do they do? Who do they reach?
                </p>
              </Label>
              <Textarea
                {...register(`partners.${index}.description`)}
                placeholder="e.g., Local business association with 500+ members..."
                className="min-h-[60px] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Relationship
                  <p className="text-xs font-normal text-muted-foreground">
                    How do you know them or connect to them?
                  </p>
                </Label>
                <Input
                  {...register(`partners.${index}.relationship`)}
                  placeholder="e.g., Personal connection, LinkedIn, Mutual contact"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Status
                </Label>
                <select
                  {...register(`partners.${index}.status`)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {PARTNER_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPartner}
          className="w-full gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Another Partner
        </Button>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Additional Notes
          </Label>
          <Textarea
            {...register('notes')}
            placeholder="Any other thoughts on potential partners..."
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
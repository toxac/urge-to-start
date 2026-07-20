// components/program/tasks/project/GoNoGoDecisionForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface GoNoGoData {
  decision: string;
  decision_notes: string;
  concerns: string;
  confidence_level: string;
}

export function GoNoGoDecisionForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, formState: { errors } } = useForm<GoNoGoData>({
    defaultValues: {
      decision: preSavedPayload.decision || 'pending',
      decision_notes: preSavedPayload.decision_notes || '',
      concerns: preSavedPayload.concerns || '',
      confidence_level: preSavedPayload.confidence_level || '3',
    }
  });

  useEffect(() => {
    async function loadProject() {
      setIsLoading(true);
      try {
        const result = await getCurrentProject();
        if (result.success && result.data) {
          setProjectId(result.data.id);
          
          // Load existing compliance data
          const complianceData = (result.data.compliance_checklist as any) || {};
          if (complianceData.go_nogo) {
            // Could pre-fill here if needed
          }
        }
      } catch (err) {
        toast.error('Failed to load project data');
      } finally {
        setIsLoading(false);
      }
    }
    loadProject();
  }, [userId]);

  const onSubmit = async (data: GoNoGoData) => {
    setIsSubmitting(true);
    try {
      const complianceData = {
        go_nogo: {
          decision: data.decision,
          decision_notes: data.decision_notes,
          concerns: data.concerns,
          confidence_level: parseInt(data.confidence_level),
          decided_at: new Date().toISOString()
        }
      };

      if (projectId) {
        const currentProject = await getCurrentProject();
        let existingCompliance = {};
        
        if (currentProject.success && currentProject.data) {
          existingCompliance = (currentProject.data.compliance_checklist as any) || {};
        }
        
        const projectResult = await updateProjectSection(projectId, 'compliance_checklist', {
          ...existingCompliance,
          ...complianceData
        });
        
        if (!projectResult.success) {
          toast.error(projectResult.error || 'Failed to save project data');
          return;
        }
      } else {
        toast.error('No active project found. Please create a project first.');
        return;
      }

      const progressSync = await completeTaskExecution({
        taskId: task.id,
        savedPayload: data
      });

      if (progressSync.success) {
        if (progressSync.data) {
          setProgressStoreRow(progressSync.data as any);
        }
        if (onSuccess) onSuccess();
        toast.success('✅ Decision saved!');
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
          <span className="font-medium">Decision Complete</span>
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
          <AlertTriangle className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Make Your Go/No-Go Decision</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Now that you've gone through the compliance checklist, look at everything. Does this seem doable?
          Is it too complicated for where you are right now?
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Your Decision *
          </Label>
          <select
            {...register('decision', { required: 'Please make a decision' })}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="pending">I need more time</option>
            <option value="go">✅ Go - I can handle this</option>
            <option value="no-go">❌ No-Go - Too complicated</option>
          </select>
          {errors.decision && (
            <p className="text-xs text-destructive">{errors.decision.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Decision Notes
            <p className="text-xs font-normal text-muted-foreground">
              Why did you make this decision?
            </p>
          </Label>
          <Textarea
            {...register('decision_notes')}
            placeholder="e.g., I can handle the required registrations, but I need to hire an accountant..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Biggest Concerns
            <p className="text-xs font-normal text-muted-foreground">
              What worries you most about the compliance requirements?
            </p>
          </Label>
          <Textarea
            {...register('concerns')}
            placeholder="e.g., GST filing seems complex, I'm worried about getting the FSSAI license..."
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Confidence Level (1-5)
            <p className="text-xs font-normal text-muted-foreground">
              How confident are you that you can handle everything?
            </p>
          </Label>
          <select
            {...register('confidence_level')}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="1">1 - Not confident at all</option>
            <option value="2">2 - Slightly confident</option>
            <option value="3">3 - Moderately confident</option>
            <option value="4">4 - Very confident</option>
            <option value="5">5 - Completely confident</option>
          </select>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full h-11">
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {isSubmitting ? 'Saving...' : `Save & Earn ${task.grant_points} XP`}
      </Button>
    </form>
  );
}
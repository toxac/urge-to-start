// components/program/tasks/project/PositioningStatementForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, Target } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { getCurrentProject, updateProjectSection } from '@/actions/projects';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface PositioningStatementData {
  positioning_statement: string;
  customer_segment: string;
  problem_solved: string;
  unique_approach: string;
  competitors: string;
  competitor_difference: string;
}

export function PositioningStatementForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, watch, formState: { errors } } = useForm<PositioningStatementData>({
    defaultValues: {
      positioning_statement: preSavedPayload.positioning_statement || '',
      customer_segment: preSavedPayload.customer_segment || '',
      problem_solved: preSavedPayload.problem_solved || '',
      unique_approach: preSavedPayload.unique_approach || '',
      competitors: preSavedPayload.competitors || '',
      competitor_difference: preSavedPayload.competitor_difference || '',
    }
  });

  // Watch fields to auto-generate positioning statement
  const customerSegment = watch('customer_segment');
  const problemSolved = watch('problem_solved');
  const uniqueApproach = watch('unique_approach');
  const competitors = watch('competitors');
  const competitorDifference = watch('competitor_difference');

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

  // Auto-generate positioning statement when fields change
  useEffect(() => {
    if (customerSegment && problemSolved && uniqueApproach) {
      const generated = `We help ${customerSegment} ${problemSolved} by ${uniqueApproach}`;
      // Only update if user hasn't manually typed one
      const currentStatement = watch('positioning_statement');
      if (!currentStatement || currentStatement === '') {
        // We'll handle this by setting the value when the user submits
      }
    }
  }, [customerSegment, problemSolved, uniqueApproach, watch]);

  const onSubmit = async (data: PositioningStatementData) => {
    setIsSubmitting(true);
    try {
      // If no positioning statement was manually entered, generate one
      let finalStatement = data.positioning_statement;
      if (!finalStatement && data.customer_segment && data.problem_solved && data.unique_approach) {
        finalStatement = `We help ${data.customer_segment} ${data.problem_solved} by ${data.unique_approach}`;
        
        // Add competitor comparison if available
        if (data.competitors && data.competitor_difference) {
          finalStatement += `, unlike ${data.competitors} who ${data.competitor_difference}.`;
        }
      }

      const positioningData = {
        positioning_statement: finalStatement,
        customer_segment: data.customer_segment,
        problem_solved: data.problem_solved,
        unique_approach: data.unique_approach,
        competitors_mentioned: data.competitors,
        competitor_difference: data.competitor_difference,
        updated_at: new Date().toISOString()
      };

      if (projectId) {
        const currentProject = await getCurrentProject();
        let existingCompetitive = {};
        
        if (currentProject.success && currentProject.data) {
          existingCompetitive = (currentProject.data.competitive_landscape as any) || {};
        }
        
        const projectResult = await updateProjectSection(projectId, 'competitive_landscape', {
          ...existingCompetitive,
          ...positioningData
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
        savedPayload: {
          ...data,
          generated_statement: finalStatement
        }
      });

      if (progressSync.success) {
        if (progressSync.data) {
          setProgressStoreRow(progressSync.data as any);
        }
        if (onSuccess) onSuccess();
        toast.success('✅ Positioning statement saved!');
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
          <span className="font-medium">Positioning Statement Complete</span>
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
          <Target className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Craft Your Positioning Statement</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          A positioning statement defines how you want to be perceived in the market. It follows this format:
          <br />
          <strong className="text-primary">We help [customer] [solve problem] by [unique approach]</strong>
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Customer Segment *
              <p className="text-xs font-normal text-muted-foreground">
                Who are you helping? Be specific.
              </p>
            </Label>
            <Input
              {...register('customer_segment', { required: 'Customer segment is required' })}
              placeholder="e.g., Small business owners, Freelance designers"
            />
            {errors.customer_segment && (
              <p className="text-xs text-destructive">{errors.customer_segment.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Problem Solved *
              <p className="text-xs font-normal text-muted-foreground">
                What problem are you solving for them?
              </p>
            </Label>
            <Input
              {...register('problem_solved', { required: 'Problem is required' })}
              placeholder="e.g., Manage their bookkeeping, Get more clients"
            />
            {errors.problem_solved && (
              <p className="text-xs text-destructive">{errors.problem_solved.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Unique Approach *
            <p className="text-xs font-normal text-muted-foreground">
              How do you solve this problem differently?
            </p>
          </Label>
          <Input
            {...register('unique_approach', { required: 'Unique approach is required' })}
            placeholder="e.g., Automated bookkeeping software, A curated network of clients"
          />
          {errors.unique_approach && (
            <p className="text-xs text-destructive">{errors.unique_approach.message}</p>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Competitors (Optional)
                <p className="text-xs font-normal text-muted-foreground">
                  Who else is solving this problem?
                </p>
              </Label>
              <Input
                {...register('competitors')}
                placeholder="e.g., QuickBooks, FreshBooks, Wave"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                What Do They Do Differently? (Optional)
                <p className="text-xs font-normal text-muted-foreground">
                  How are you different from them?
                </p>
              </Label>
              <Input
                {...register('competitor_difference')}
                placeholder="e.g., Charge monthly fees, Focus on enterprise clients"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">
            Your Positioning Statement
            <p className="text-xs font-normal text-muted-foreground">
              Write your complete positioning statement. It will be generated based on your answers above.
            </p>
          </Label>
          <Textarea
            {...register('positioning_statement')}
            placeholder="We help [customer] [solve problem] by [unique approach]"
            className="min-h-[80px] resize-none"
            onFocus={() => {
              // If empty and we have the parts, auto-generate
              const currentValue = watch('positioning_statement');
              if (!currentValue && customerSegment && problemSolved && uniqueApproach) {
                let generated = `We help ${customerSegment} ${problemSolved} by ${uniqueApproach}`;
                if (competitors && competitorDifference) {
                  generated += `, unlike ${competitors} who ${competitorDifference}.`;
                }
                // We need to set this via the form
                const setValue = (name: string, value: string) => {
                  // This will be handled by the submit
                };
              }
            }}
          />
        </div>

        {/* Preview */}
        {customerSegment && problemSolved && uniqueApproach && (
          <div className="p-4 border rounded-lg bg-primary/5 border-primary/20">
            <p className="text-xs font-semibold text-primary mb-1">Preview</p>
            <p className="text-sm font-medium">
              We help <span className="text-primary">{customerSegment}</span>{' '}
              <span className="text-primary">{problemSolved}</span> by{' '}
              <span className="text-primary">{uniqueApproach}</span>
              {competitors && competitorDifference && (
                <span>, unlike <span className="text-primary">{competitors}</span> who <span className="text-primary">{competitorDifference}</span>.</span>
              )}
            </p>
          </div>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full h-11">
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {isSubmitting ? 'Saving...' : `Save & Earn ${task.grant_points} XP`}
      </Button>
    </form>
  );
}
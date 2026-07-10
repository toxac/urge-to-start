// components/program/tasks/project/ProjectCreationForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Loader2, Rocket, ArrowRight } from 'lucide-react';
import { getOpportunities, commitToOpportunity } from '@/actions/opportunities';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';

interface ProjectFormData {
  biz_name: string;
  five_word_hook: string;
  tagline: string;
}

export function ProjectCreationForm({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: {
      biz_name: preSavedPayload.biz_name || '',
      five_word_hook: preSavedPayload.five_word_hook || '',
      tagline: preSavedPayload.tagline || '',
    }
  });

  // Load scored opportunities
  useEffect(() => {
    async function loadOpportunities() {
      setIsLoading(true);
      try {
        const result = await getOpportunities({
          status: ['scored', 'validated']
        });

        if (result.success) {
          setOpportunities(result.data);
          
          // If there's a previously selected opportunity, pre-select it
          if (preSavedPayload.selectedId) {
            setSelectedId(preSavedPayload.selectedId);
            const opp = result.data.find(o => o.id === preSavedPayload.selectedId);
            if (opp) {
              setValue('biz_name', opp.title);
            }
          }
        } else {
          toast.error('Failed to load opportunities');
        }
      } catch (err) {
        toast.error('Something went wrong');
      } finally {
        setIsLoading(false);
      }
    }

    loadOpportunities();
  }, [userId]);

  const handleSelectOpportunity = (id: string) => {
    setSelectedId(id);
    const opp = opportunities.find(o => o.id === id);
    if (opp) {
      setValue('biz_name', opp.title);
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (!selectedId) {
      toast.error('Please select an opportunity first');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await commitToOpportunity(selectedId, {
        biz_name: data.biz_name,
        five_word_hook: data.five_word_hook,
        tagline: data.tagline
      });

      if (result.success) {
        const progressSync = await completeTaskExecution({
          taskId: task.id,
          savedPayload: {
            ...data,
            selectedId,
            projectId: result.data.project.id,
            opportunityId: result.data.opportunity.id,
            completedAt: new Date().toISOString()
          }
        });

        if (progressSync.success) {
          if (progressSync.data) {
            setProgressStoreRow(progressSync.data as any);
          }
          setIsComplete(true);
          if (onSuccess) onSuccess();
          toast.success('🎉 Project created successfully!');
        } else {
          toast.error(progressSync.error || 'Failed to save progress');
        }
      } else {
        toast.error(result.error || 'Failed to create project');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted || isComplete) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center gap-2 text-emerald-600">
          <Rocket className="w-5 h-5" />
          <span className="font-medium">Project Created!</span>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{preSavedPayload.biz_name || 'Your Project'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {preSavedPayload.five_word_hook && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">5-Word Hook:</span> {preSavedPayload.five_word_hook}
              </p>
            )}
            {preSavedPayload.tagline && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Tagline:</span> {preSavedPayload.tagline}
              </p>
            )}
          </CardContent>
        </Card>
        <Button variant="outline" onClick={onSuccess} className="w-full">
          Continue to Mission 3 <ArrowRight className="w-4 h-4 ml-2" />
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

  const scoredOpportunities = opportunities.filter(o => o.status === 'scored');
  const validatedOpportunities = opportunities.filter(o => o.status === 'validated');

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Create Your Project</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Select your top opportunity and create your project. This is where your journey begins.
        </p>
      </div>

      {/* Select Opportunity */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Select Your Opportunity *</Label>
        
        {scoredOpportunities.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Scored Opportunities</p>
            {scoredOpportunities.map((opp) => (
              <button
                key={opp.id}
                onClick={() => handleSelectOpportunity(opp.id)}
                className={cn(
                  "w-full text-left p-4 border rounded-lg transition-all",
                  selectedId === opp.id
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50 hover:bg-muted/5"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{opp.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {opp.description}
                    </p>
                  </div>
                  {selectedId === opp.id && (
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {validatedOpportunities.length > 0 && scoredOpportunities.length === 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Validated Opportunities (Score them first)</p>
            {validatedOpportunities.map((opp) => (
              <div key={opp.id} className="p-4 border rounded-lg bg-muted/10">
                <p className="font-medium">{opp.title}</p>
                <p className="text-sm text-muted-foreground">
                  ⚠️ Score this opportunity in the previous task first
                </p>
              </div>
            ))}
          </div>
        )}

        {opportunities.length === 0 && (
          <div className="p-4 border rounded-lg bg-muted/10 text-center text-sm text-muted-foreground">
            No opportunities found. Complete the previous tasks first.
          </div>
        )}
      </div>

      {/* Project Details Form */}
      {selectedId && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border-t pt-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Project Name *
              <p className="text-xs font-normal text-muted-foreground">
                This can be changed later. Start with your opportunity title.
              </p>
            </Label>
            <Input
              {...register('biz_name', { required: 'Project name is required' })}
              placeholder="e.g., Bookkeeping Simplified"
            />
            {errors.biz_name && (
              <p className="text-xs text-destructive">{errors.biz_name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              5-Word Hook
              <p className="text-xs font-normal text-muted-foreground">
                Summarize your project in exactly 5 words.
              </p>
            </Label>
            <Input
              {...register('five_word_hook')}
              placeholder="e.g., Bookkeeping for small business owners"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Tagline
              <p className="text-xs font-normal text-muted-foreground">
                One sentence that captures what you do.
              </p>
            </Label>
            <Textarea
              {...register('tagline')}
              placeholder="e.g., We help small business owners manage their books without the headache."
              className="min-h-[60px] resize-none"
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full h-11">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isSubmitting ? 'Creating...' : `Create Project & Earn ${task.grant_points} XP`}
          </Button>
        </form>
      )}
    </div>
  );
}
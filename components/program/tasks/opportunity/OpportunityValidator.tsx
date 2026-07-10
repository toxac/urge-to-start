// components/program/tasks/opportunity/OpportunityValidator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Loader2, ChevronDown, ChevronRight, Users } from 'lucide-react';
import { getOpportunities, validateOpportunity, OpportunityStatusType } from '@/actions/opportunities';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ValidationFormData {
  people_spoken_to: number;
  confirmed_problem: 'yes' | 'no' | 'maybe';
  would_pay: 'yes' | 'no' | 'maybe';
  willingness_to_pay: number | null;
  quotes: string;
  insights: string;
}

export function OpportunityValidator({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [validatedIds, setValidatedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ValidationFormData>({
    defaultValues: {
      people_spoken_to: 0,
      confirmed_problem: 'maybe',
      would_pay: 'maybe',
      willingness_to_pay: null,
      quotes: '',
      insights: ''
    }
  });

  // Load opportunities
  useEffect(() => {
    async function loadOpportunities() {
      setIsLoading(true);
      try {
        const result = await getOpportunities({
          status: ['raw_seed', 'validated']
        });

        if (result.success) {
          setOpportunities(result.data);
          if (preSavedPayload.validatedIds) {
            setValidatedIds(new Set(preSavedPayload.validatedIds));
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

  const onValidate = async (data: ValidationFormData, opportunityId: string) => {
    setIsSubmitting(true);
    try {
      const result = await validateOpportunity({
        opportunityId,
        people_spoken_to: data.people_spoken_to,
        confirmed_problem: data.confirmed_problem === 'yes',
        would_pay: data.would_pay === 'yes',
        willingness_to_pay: data.willingness_to_pay,
        quotes: data.quotes.split('\n').filter(q => q.trim()),
        insights: data.insights
      });

      if (result.success) {
        setValidatedIds(prev => new Set(prev).add(opportunityId));
        toast.success('✅ Opportunity validated!');
      } else {
        toast.error(result.error || 'Failed to validate');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkComplete = async () => {
    if (validatedIds.size === 0) {
      toast.error('Please validate at least one opportunity');
      return;
    }

    setIsSubmitting(true);
    try {
      const progressSync = await completeTaskExecution({
        taskId: task.id,
        savedPayload: {
          validatedIds: Array.from(validatedIds),
          completedAt: new Date().toISOString()
        }
      });

      if (progressSync.success) {
        if (progressSync.data) {
          setProgressStoreRow(progressSync.data as any);
        }
        setIsComplete(true);
        if (onSuccess) onSuccess();
        toast.success(`✅ Validated ${validatedIds.size} opportunities!`);
      } else {
        toast.error(progressSync.error || 'Failed to complete');
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
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Validation Complete</span>
          <span className="text-sm text-muted-foreground">
            ({validatedIds.size} opportunity{validatedIds.size !== 1 ? 's' : ''} validated)
          </span>
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

  const unvalidated = opportunities.filter(o => !validatedIds.has(o.id));

  if (opportunities.length === 0) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-muted-foreground">No opportunities to validate.</p>
        <p className="text-sm text-muted-foreground">
          Complete the earlier tasks to create and review opportunities first.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h4 className="font-medium">Validate Your Opportunities</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Talk to potential customers about each opportunity. Log what you learn.
        </p>
        <div className="flex gap-4 text-sm">
          <span className="text-emerald-600">✓ Validated: {validatedIds.size}</span>
          <span className="text-muted-foreground">Pending: {unvalidated.length}</span>
        </div>
      </div>

      <div className="space-y-4">
        {opportunities.map((opp) => {
          const isValidated = validatedIds.has(opp.id);
          const isExpanded = expandedId === opp.id;

          return (
            <Card key={opp.id} className={cn(
              "border",
              isValidated && "border-emerald-200 bg-emerald-50/20"
            )}>
              <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : opp.id)}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {opp.title}
                      {isValidated && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {opp.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant="outline" className="text-xs">
                      {opp.source_type}
                    </Badge>
                    {isValidated ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        Validated
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-amber-600 border-amber-200">
                        Pending
                      </Badge>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {isExpanded && !isValidated && (
                <CardContent>
                  <form onSubmit={handleSubmit((data) => onValidate(data, opp.id))} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">
                          People Spoken To *
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          {...register('people_spoken_to', { 
                            required: 'Required', 
                            min: { value: 0, message: 'Must be 0 or more' }
                          })}
                          placeholder="Number of people"
                        />
                        {errors.people_spoken_to && (
                          <p className="text-xs text-destructive">{errors.people_spoken_to.message}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">
                          Willingness to Pay ($)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          {...register('willingness_to_pay', { min: { value: 0, message: 'Must be 0 or more' } })}
                          placeholder="What would they pay?"
                        />
                        {errors.willingness_to_pay && (
                          <p className="text-xs text-destructive">{errors.willingness_to_pay.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">
                          Did they confirm this is a real problem? *
                        </Label>
                        <select
                          {...register('confirmed_problem', { required: 'Required' })}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="maybe">Not sure yet</option>
                          <option value="yes">Yes, it's real</option>
                          <option value="no">No, it's not</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">
                          Would they pay for a solution? *
                        </Label>
                        <select
                          {...register('would_pay', { required: 'Required' })}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="maybe">Not sure</option>
                          <option value="yes">Yes, they would pay</option>
                          <option value="no">No, they wouldn't</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">
                        Key Quotes
                        <p className="text-xs font-normal text-muted-foreground">
                          One quote per line. What did people say?
                        </p>
                      </Label>
                      <Textarea
                        {...register('quotes')}
                        placeholder="I hate dealing with this every week..."
                        className="min-h-[60px] resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">
                        Key Insights
                        <p className="text-xs font-normal text-muted-foreground">
                          What did you learn from these conversations?
                        </p>
                      </Label>
                      <Textarea
                        {...register('insights')}
                        placeholder="People are frustrated because..."
                        className="min-h-[80px] resize-none"
                      />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Mark as Validated
                    </Button>
                  </form>
                </CardContent>
              )}

              {isExpanded && isValidated && (
                <CardContent>
                  <div className="p-4 border rounded-lg bg-muted/5 text-sm text-muted-foreground">
                    ✅ This opportunity has been validated.
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Complete Button */}
      {validatedIds.size > 0 && (
        <div className="border-t pt-4">
          <Button
            onClick={handleMarkComplete}
            disabled={isSubmitting}
            className="w-full h-11"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isSubmitting 
              ? 'Saving...' 
              : `Continue with ${validatedIds.size} validated opportunity${validatedIds.size !== 1 ? 's' : ''} (+${task.grant_points} XP)`}
          </Button>
        </div>
      )}
    </div>
  );
}
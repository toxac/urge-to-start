// components/program/tasks/mission1/AuditForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useStore } from '@nanostores/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { updateProfileStoreFields, $profileStore } from '@/lib/stores/profileStore';
import { recordAccomplishment } from '@/actions/accomplishments';
import { setAccomplishmentStoreRow } from '@/lib/stores/accomplishmentStore';
import { BaseTaskComponentProps } from '../types';
import { TaskResourcesList } from '../TaskResourcesList';
import { SelfAssessmentData, SelfAssessmentMetric } from '@/types/profiles';
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageSquareQuote,
  TrendingUp,
  Brain,
  Pencil
} from 'lucide-react';

interface FormInputs {
  key_takeaway: string;
}

const DEFAULT_METRICS = [
  {
    id: 'asking_confidence',
    label: 'Comfort with making bold asks & reaching out',
    min_label: 'Terrified / Hesitant',
    max_label: 'Fully Confident'
  },
  {
    id: 'rejection_resilience',
    label: 'Resilience when hearing a "No"',
    min_label: 'Takes it Personally',
    max_label: 'Harmless Data Point'
  },
  {
    id: 'public_visibility',
    label: 'Willingness to put yourself & your work out there',
    min_label: 'Hide in Background',
    max_label: 'Boldly Visible'
  },
  {
    id: 'action_speed',
    label: 'Speed of moving from idea to real-world execution',
    min_label: 'Overthink & Freeze',
    max_label: 'Execute Immediately'
  }
];

export function AuditForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const profile = useStore($profileStore);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const savedPayloadAssessment: SelfAssessmentData | null =
    (existingProgress as any)?.saved_payload?.assessment?.self_assessment || null;

  const [assessmentData, setAssessmentData] = useState<SelfAssessmentData | null>(savedPayloadAssessment);
  const [isEditing, setIsEditing] = useState<boolean>(!savedPayloadAssessment);

  // Range Slider Values: [Before, After] (Values between 1 and 10)
  const initialMetricValues = (): Record<string, [number, number]> => {
    if (savedPayloadAssessment?.scores) {
      const mapped: Record<string, [number, number]> = {};
      savedPayloadAssessment.scores.forEach(s => {
        mapped[s.id] = [s.before, s.after];
      });
      return mapped;
    }
    return {
      asking_confidence: [3, 7],
      rejection_resilience: [3, 8],
      public_visibility: [4, 7],
      action_speed: [3, 8],
    };
  };

  const [metricValues, setMetricValues] = useState<Record<string, [number, number]>>(initialMetricValues);

  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({
    defaultValues: {
      key_takeaway: savedPayloadAssessment?.key_takeaway || ''
    }
  });

  const handleSliderChange = (metricId: string, val: number | readonly number[]) => {
    const arr = Array.isArray(val) ? [...val] : [val, val];
    if (arr.length >= 2) {
      setMetricValues((prev) => ({
        ...prev,
        [metricId]: [arr[0], arr[1]] as [number, number],
      }));
    }
  };

  const onSubmit = async (formData: FormInputs) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const formattedMetrics: SelfAssessmentMetric[] = DEFAULT_METRICS.map(m => {
      const [beforeVal, afterVal] = metricValues[m.id] || [3, 7];
      return {
        id: m.id,
        label: m.label,
        before: beforeVal,
        after: afterVal
      };
    });

    const finalAssessmentData: SelfAssessmentData = {
      scores: formattedMetrics,
      key_takeaway: formData.key_takeaway,
      completed_at: new Date().toISOString()
    };

    try {
      const taskResult = await processTaskCompletion({
        task,
        savedPayload: {
          assessment: {
            assessment_type: 'self_assessment',
            self_assessment: finalAssessmentData
          }
        },
      });

      if (!taskResult.success) {
        setErrorMessage(taskResult.error || 'Failed to record task completion');
        setIsSubmitting(false);
        return;
      }

      setAssessmentData(finalAssessmentData);
      setIsEditing(false);

      const currentAssessments = (profile as any)?.assessment || [];
      updateProfileStoreFields({
        assessment: [
          ...currentAssessments,
          {
            assessment_type: 'self_assessment',
            self_assessment: finalAssessmentData
          }
        ]
      } as any);

      const missionRes = await recordAccomplishment({
        awardedFor: 'mission',
        relatedTable: 'missions',
        relatedReferenceId: 'mission-1',
        title: 'Completed Mission 1: Foundations & Mindset',
        pointsGranted: 150,
      });

      if (missionRes.success && missionRes.accomplishmentRow) {
        setAccomplishmentStoreRow(missionRes.accomplishmentRow);
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* COMPLETED ASSESSMENT VIEW (WITH EDIT TOGGLE) */}
      {assessmentData && !isEditing ? (
        <div className="w-full space-y-6 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Mindset Growth Audit Complete
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-bold">
                Saved to Profile
              </Badge>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-7 px-2.5 text-[11px] font-bold gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                Edit Audit
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {assessmentData.scores.map((item) => {
              const diff = item.after - item.before;
              return (
                <div key={item.id} className="p-4 rounded-xl bg-card border border-border/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-foreground">
                    <span>{item.label}</span>
                    <Badge variant="secondary" className="text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +{diff} Points
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pt-1">
                    <span>Before: <strong className="text-foreground">{item.before}/10</strong></span>
                    <span>Now: <strong className="text-emerald-500">{item.after}/10</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1.5">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              Your Key Takeaway
            </span>
            <p className="text-xs text-foreground font-medium italic leading-relaxed">
              "{assessmentData.key_takeaway}"
            </p>
          </div>
        </div>
      ) : (
        /* INITIAL ASSESSMENT FORM USING SLIDERS */
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 rounded-2xl border border-border bg-card/60 space-y-6 text-left">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-amber-500" />
                Mission 1 Mindset Audit
              </span>
              <h3 className="text-sm font-bold text-foreground">
                Rate Your Before vs. After Mindset Shift
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Drag the dual slider thumbs to set where you started vs. where you stand today (1 to 10 scale).
              </p>
            </div>
            {assessmentData && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="text-xs font-semibold cursor-pointer text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
            )}
          </div>

          <div className="space-y-4 border-t pt-4">
            {DEFAULT_METRICS.map((m) => {
              const [beforeVal, afterVal] = metricValues[m.id] || [3, 7];
              const growthDiff = afterVal - beforeVal;

              return (
                <div key={m.id} className="p-4 rounded-xl border border-border/80 bg-card space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <Label className="text-xs font-bold text-foreground block">
                      {m.label}
                    </Label>

                    {/* Dynamic Growth Badge */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-muted-foreground">
                        Before: <strong className="text-foreground">{beforeVal}</strong>/10
                      </span>
                      <span className="text-[11px] font-mono text-emerald-500">
                        Now: <strong className="text-emerald-500">{afterVal}</strong>/10
                      </span>
                      {growthDiff !== 0 && (
                        <Badge variant="outline" className={`text-[10px] font-mono font-bold ${growthDiff > 0
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                          }`}>
                          {growthDiff > 0 ? `+${growthDiff}` : growthDiff} Shift
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Dual-Thumb Range Slider */}
                  <div className="px-1 py-2 space-y-2">
                    <Slider
                      value={[beforeVal, afterVal]}
                      onValueChange={(val) => handleSliderChange(m.id, val)}
                      min={1}
                      max={10}
                      step={1}
                      className="cursor-pointer"
                    />

                    <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                      <span>1 ({m.min_label})</span>
                      <span>10 ({m.max_label})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 pt-2">
            <Label className="text-xs font-bold text-foreground block">
              What is your biggest personal takeaway about rejection and taking action? *
            </Label>
            <Textarea
              className="w-full min-h-[90px] text-xs leading-relaxed resize-none bg-background"
              placeholder="e.g. I realized that asking for something bold feels scary for 5 seconds, but even if they say no, nothing bad happens and life keeps moving forward."
              {...register('key_takeaway', { required: true, minLength: 10 })}
            />
            {errors.key_takeaway && (
              <p className="text-[11px] font-semibold text-destructive">
                Please enter a brief reflection takeaway (at least 10 characters).
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-xs font-bold tracking-wider uppercase cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Assessment...
              </span>
            ) : (
              `Save and Complete Mission 1`
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
// components/program/tasks/mission1/AIAuditForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useStore } from '@nanostores/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { updateProfileStoreFields, $profileStore } from '@/lib/stores/profileStore';
import { recordAccomplishment } from '@/actions/accomplishments';
import { setAccomplishmentStoreRow } from '@/lib/stores/accomplishmentStore';
import { BaseTaskComponentProps } from '../types';
import { ReferenceSchema } from '@/types/playbook';
import { SelfAssessmentData, SelfAssessmentMetric } from '@/types/profiles';
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  ExternalLink, 
  MessageSquareQuote, 
  TrendingUp, 
  Brain 
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

  // Read existing self assessment if already completed
  const savedPayloadAssessment: SelfAssessmentData | null = 
    (existingProgress as any)?.saved_payload?.assessment?.self_assessment || null;

  const [assessmentData, setAssessmentData] = useState<SelfAssessmentData | null>(savedPayloadAssessment);

  // Form states for scores (Before vs After)
  const [scores, setScores] = useState<Record<string, { before: number; after: number }>>({
    asking_confidence: { before: 3, after: 7 },
    rejection_resilience: { before: 3, after: 8 },
    public_visibility: { before: 4, after: 7 },
    action_speed: { before: 3, after: 8 },
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

  const requiredResources: ReferenceSchema[] = (task.resources || []).filter((r: ReferenceSchema) => r.isRequired);

  const handleScoreChange = (metricId: string, type: 'before' | 'after', value: number) => {
    setScores(prev => ({
      ...prev,
      [metricId]: {
        ...prev[metricId],
        [type]: value
      }
    }));
  };

  const onSubmit = async (formData: FormInputs) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const formattedMetrics: SelfAssessmentMetric[] = DEFAULT_METRICS.map(m => ({
      id: m.id,
      label: m.label,
      before: scores[m.id]?.before || 5,
      after: scores[m.id]?.after || 5
    }));

    const finalAssessmentData: SelfAssessmentData = {
      scores: formattedMetrics,
      key_takeaway: formData.key_takeaway,
      completed_at: new Date().toISOString()
    };

    try {
      // 1. Process Task Completion & Progress
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

      // 2. Hydrate $profileStore
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

      // 3. Record Mission Accomplishment for Mission 1 Graduation
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

      {/* REQUIRED RESOURCES BANNER */}
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

      {/* COMPLETED ASSESSMENT VIEW */}
      {assessmentData ? (
        <div className="w-full space-y-6 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Mindset Growth Audit Complete
            </span>
            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-bold">
              Saved to Profile
            </Badge>
          </div>

          {/* Growth Summary Metrics */}
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

          {/* Key Takeaway */}
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
        /* INITIAL ASSESSMENT FORM */
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 rounded-2xl border border-border bg-card/60 space-y-6 text-left">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-amber-500" />
              Mission 1 Mindset Audit
            </span>
            <h3 className="text-sm font-bold text-foreground">
              Rate Your Before vs. After Mindset Shift
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Reflect on how your perspective has changed after taking real-world risks and handling rejection during this mission.
            </p>
          </div>

          {/* Metrics Sliders / Selectors */}
          <div className="space-y-5 border-t pt-4">
            {DEFAULT_METRICS.map((m) => (
              <div key={m.id} className="p-4 rounded-xl border bg-card space-y-3">
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold text-foreground block">
                    {m.label}
                  </Label>
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>1 = {m.min_label}</span>
                    <span>10 = {m.max_label}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Before Rating */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-muted-foreground block">
                      Before Mission 1: <strong className="text-foreground">{scores[m.id]?.before || 3}</strong>/10
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleScoreChange(m.id, 'before', num)}
                          className={`flex-1 h-7 text-[10px] font-bold rounded-md border transition cursor-pointer ${
                            scores[m.id]?.before === num 
                              ? 'bg-muted-foreground text-background font-bold border-muted-foreground' 
                              : 'bg-background hover:bg-muted text-muted-foreground'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* After Rating */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-emerald-500 block">
                      Right Now: <strong className="text-emerald-500">{scores[m.id]?.after || 8}</strong>/10
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleScoreChange(m.id, 'after', num)}
                          className={`flex-1 h-7 text-[10px] font-bold rounded-md border transition cursor-pointer ${
                            scores[m.id]?.after === num 
                              ? 'bg-emerald-500 text-white font-bold border-emerald-500' 
                              : 'bg-background hover:bg-emerald-500/10 text-muted-foreground'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Key Takeaway Input */}
          <div className="space-y-2 pt-2">
            <Label className="text-xs font-bold text-foreground block">
              What is your biggest personal takeaway about rejection and taking action? *
            </Label>
            <Textarea
              className="w-full min-h-[90px] text-xs leading-relaxed resize-none"
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
              `Complete Mission 1 Self-Assessment & Earn +${task.grant_points} XP`
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
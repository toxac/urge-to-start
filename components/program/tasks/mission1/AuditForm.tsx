// components/program/tasks/mission1/AIAuditForm.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { runAIAssessmentAction } from '@/actions/profile-assessment';
import { updateProfileStoreFields, $profileStore } from '@/lib/stores/profileStore';
import { useStore } from '@nanostores/react';
import { BaseTaskComponentProps } from '../types';
import { ReferenceSchema } from '@/types/playbook';
import { AIAssessmentResult } from '@/types/userActions';
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  ExternalLink,
  Sparkles,
  Target,
  Trophy,
  ArrowRight,
  TrendingUp,
  Share2
} from 'lucide-react';

export function AuditForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const profile = useStore($profileStore);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const existingAssessment: AIAssessmentResult | null = (profile as any)?.assessment || null;
  const [assessment, setAssessment] = useState<AIAssessmentResult | null>(existingAssessment);

  // Filter required resources
  const requiredResources: ReferenceSchema[] = (task.resources || []).filter((r: ReferenceSchema) => r.isRequired);

  const handleRunAudit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await runAIAssessmentAction(task.id);

      // Check success state properly to allow TypeScript union narrowing
      if (!res.success) {
        setErrorMessage(res.error);
        setIsSubmitting(false);
        return;
      }

      setAssessment(res.data.assessment);
      updateProfileStoreFields({ assessment: res.data.assessment } as any);

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

      {/* COMPLETED ASSESSMENT & GOALS VIEW */}
      {assessment ? (
        <div className="w-full space-y-6 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Mission 1 Audit & Target Goals Locked
            </span>
            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-bold">
              Saved to Dashboard
            </Badge>
          </div>

          {/* Synthesis Summary */}
          <div className="p-4 rounded-xl bg-card border border-border/60 space-y-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Executive Audit Summary
            </span>
            <p className="text-xs text-foreground font-medium leading-relaxed">
              {assessment.summary}
            </p>
          </div>

          {/* Strengths & Gaps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-card border border-border/60 space-y-2">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                Identified Core Strengths
              </span>
              <ul className="space-y-1.5 text-[11px] text-muted-foreground list-disc pl-4">
                {assessment.strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border/60 space-y-2">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Key Focus & Growth Areas
              </span>
              <ul className="space-y-1.5 text-[11px] text-muted-foreground list-disc pl-4">
                {assessment.gaps.map((g, idx) => (
                  <li key={idx}>{g}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Generated Growth Target Goals */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-primary" />
                Your Established Milestones & Goals:
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                Tracked in Dashboard Queue
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {assessment.suggested_actions.map((goal, idx) => {
                const meta = (goal as any).metadata || {};
                return (
                  <div key={idx} className="p-4 rounded-xl border border-border bg-card space-y-2 relative overflow-hidden">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          {goal.title}
                        </span>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {goal.description}
                        </p>
                      </div>

                      {meta.platform && (
                        <Badge variant="secondary" className="text-[9px] font-mono shrink-0 flex items-center gap-1">
                          <Share2 className="w-2.5 h-2.5" />
                          {meta.platform}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[10px]">
                      <span className="font-mono font-bold text-primary flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" />
                        Target: {meta.target_metric || '30-Day Milestone'}
                      </span>
                      <span className="text-muted-foreground font-mono">
                        Timeframe: {goal.checkback_delay_days || 30} Days
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* INITIAL AUDIT & GOAL SETTING TRIGGER */
        <div className="p-6 rounded-2xl border border-border bg-card/60 space-y-5 text-left">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Mission 1 Growth Audit & Goal Setting
            </span>
            <h3 className="text-sm font-bold text-foreground">
              Turn Mission 1 Learnings into Trackable Milestones
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We will evaluate your committed hours, skill inventory, roadblocks, social footprint, and task reflections to establish tailored growth targets (e.g. audience expansion, pitch volume, discovery calls) and queue them in your Dashboard.
            </p>
          </div>

          <Button
            type="button"
            onClick={handleRunAudit}
            className="w-full h-11 text-xs font-bold tracking-wider uppercase cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Synthesizing Audit & Setting Targets...
              </span>
            ) : (
              `Establish Growth Targets & Earn +${task.grant_points} XP`
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
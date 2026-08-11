// components/program/tasks/mission2/OpportunityScoringForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { getUserOpportunitiesAction, scoreOpportunityAction } from '@/actions/opportunities';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { Database } from '@/types/supabase';
import { Loader2, CheckCircle2, AlertCircle, Star, ArrowRight } from 'lucide-react';

type UserOpportunityRow = Database['public']['Tables']['user_opportunities']['Row'];

const CRITERIA = [
  { id: 'passion', label: 'Passion', hint: 'How excited are you about this problem?' },
  { id: 'urgency', label: 'Urgency', hint: 'How badly do people need this solved?' },
  { id: 'workaround_spend', label: 'Workaround Spend', hint: 'Are people already paying or spending time to fix this?' },
  { id: 'unfair_advantage', label: 'Unfair Advantage', hint: 'Do you have unique skills, access, or insights?' },
  { id: 'msp_feasibility', label: 'MSP Feasibility', hint: 'Can you build a Minimum Sellable Product quickly?' },
];

export function OpportunityScoringForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [opportunities, setOpportunities] = useState<UserOpportunityRow[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<UserOpportunityRow | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({
    passion: 3,
    urgency: 3,
    workaround_spend: 3,
    unfair_advantage: 3,
    msp_feasibility: 3,
  });
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isCompleted = existingProgress?.status === 'completed';

  useEffect(() => {
    async function loadData() {
      const res = await getUserOpportunitiesAction();
      if (res.success && res.data) {
        setOpportunities(res.data);
      }
    }
    loadData();
  }, []);

  const handleScoreSubmit = async () => {
    if (!selectedOpp) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await scoreOpportunityAction({
      opportunityId: selectedOpp.id,
      scores: scores as any,
      notes
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to save score');
      setIsSubmitting(false);
      return;
    }

    setOpportunities(prev => prev.map(o => o.id === selectedOpp.id ? res.data! : o));
    setSelectedOpp(null);
    setIsSubmitting(false);
  };

  const handleCompleteTask = async () => {
    const scoredCount = opportunities.filter(o => o.status === 'scored' || o.status === 'committed').length;
    if (scoredCount === 0) {
      setErrorMessage('Please score at least one opportunity before completing this task.');
      return;
    }

    setIsCompleting(true);
    const res = await processTaskCompletion({
      task,
      savedPayload: { total_scored: scoredCount }
    });

    if (res.success && onSuccess) {
      onSuccess();
    } else {
      setErrorMessage(res.error || 'Failed to complete task');
      setIsCompleting(false);
    }
  };

  return (
    <div className="w-full space-y-6 text-left">
      {errorMessage && (
        <div className="p-4 border rounded-xl bg-destructive/10 border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* OPPORTUNITY CARDS TO SCORE */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
          Your Opportunities to Score ({opportunities.length}):
        </span>

        <div className="grid grid-cols-1 gap-3">
          {opportunities.map((opp) => {
            const oppScores = (opp.scores as any)?.criteria;
            const total = (opp.scores as any)?.total_score;

            return (
              <div key={opp.id} className="p-4 rounded-xl border border-border bg-card space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span>{opp.title}</span>
                  {total ? (
                    <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/40 text-emerald-500 bg-emerald-500/10">
                      Score: {total} / 25
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] font-mono border-amber-500/40 text-amber-500 bg-amber-500/10">
                      Unscored
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{opp.description}</p>

                <Button
                  type="button"
                  variant={selectedOpp?.id === opp.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSelectedOpp(opp);
                    if (oppScores) setScores(oppScores);
                  }}
                  className="text-xs font-bold gap-1 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5" />
                  {total ? 'Edit Scores' : 'Score Opportunity'}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SCORING SLIDERS FOR SELECTED OPPORTUNITY */}
      {selectedOpp && (
        <div className="p-5 rounded-2xl border border-primary/30 bg-primary/5 space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
              Scoring: {selectedOpp.title}
            </span>
            <p className="text-xs text-muted-foreground">Rate each criterion on a scale from 1 to 5.</p>
          </div>

          <div className="space-y-4">
            {CRITERIA.map((c) => (
              <div key={c.id} className="space-y-2 p-3 rounded-xl border bg-card">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{c.label}</span>
                  <span className="text-primary font-mono">{scores[c.id] || 3} / 5</span>
                </div>
                <p className="text-[11px] text-muted-foreground">{c.hint}</p>
                <Slider
                  value={[scores[c.id] || 3]}
                  onValueChange={(val) => setScores(prev => ({ ...prev, [c.id]: Array.isArray(val) ? val[0] : val }))}
                  min={1}
                  max={5}
                  step={1}
                />
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Notes on Scoring (Optional)</Label>
            <Textarea
              className="text-xs bg-background min-h-[60px]"
              placeholder="Why did you give these scores?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button
            type="button"
            onClick={handleScoreSubmit}
            disabled={isSubmitting}
            className="w-full h-10 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Scores for Opportunity'}
          </Button>
        </div>
      )}

      {/* COMPLETE TASK CTA */}
      {!isCompleted && opportunities.some(o => o.status === 'scored' || o.status === 'committed') && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between gap-3">
          <span className="text-xs font-bold">Finished scoring opportunities?</span>
          <Button
            type="button"
            onClick={handleCompleteTask}
            disabled={isCompleting}
            className="h-10 px-5 text-xs font-bold uppercase cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
          >
            {isCompleting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                <span>Complete Task (+{task.grant_points} XP)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
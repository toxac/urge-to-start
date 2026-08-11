// components/program/tasks/mission2/OpportunityScoringDialog.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $profileStore } from '@/lib/stores/profileStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { scoreOpportunityAction } from '@/actions/opportunities';
import { runOpportunityScoreReviewAction } from '@/actions/assessments';
import { Database } from '@/types/supabase';
import { Loader2, Star, Sparkles, Brain, AlertCircle } from 'lucide-react';

type UserOpportunityRow = Database['public']['Tables']['user_opportunities']['Row'];

interface OpportunityScoringDialogProps {
  opportunity: UserOpportunityRow | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onScoreSaved: (updatedOpp: UserOpportunityRow) => void;
  taskId?: string;
}

interface OpportunityReviewOutput {
  feedback: string;
  suggestion: string;
  blindSpot: string;
}

const CRITERIA = [
  { id: 'passion', label: 'Passion', hint: 'How excited are you about this problem?' },
  { id: 'urgency', label: 'Urgency', hint: 'How badly do people need this solved?' },
  { id: 'workaround_spend', label: 'Workaround Spend', hint: 'Are people already paying or spending time to fix this?' },
  { id: 'unfair_advantage', label: 'Unfair Advantage', hint: 'Do you have unique skills, access, or insights?' },
  { id: 'msp_feasibility', label: 'MSP Feasibility', hint: 'Can you build a Minimum Sellable Product quickly?' },
];

export function OpportunityScoringDialog({
  opportunity,
  isOpen,
  onOpenChange,
  onScoreSaved,
  taskId
}: OpportunityScoringDialogProps) {
  const profile = useStore($profileStore);

  const [scores, setScores] = useState<Record<string, number>>({
    passion: 3,
    urgency: 3,
    workaround_spend: 3,
    unfair_advantage: 3,
    msp_feasibility: 3,
  });
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<OpportunityReviewOutput | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (opportunity) {
      const existingScores = (opportunity.scores as any)?.criteria;
      const existingNotes = (opportunity.scores as any)?.notes;
      if (existingScores) setScores(existingScores);
      else setScores({ passion: 3, urgency: 3, workaround_spend: 3, unfair_advantage: 3, msp_feasibility: 3 });
      setNotes(existingNotes || '');
      setAiFeedback(null);
      setErrorMsg(null);
    }
  }, [opportunity]);

  const handleRequestAiReview = async () => {
    if (!opportunity) return;
    setIsAiLoading(true);
    setErrorMsg(null);

    const meta = (opportunity.capture_metadata as any) || {};

    const res = await runOpportunityScoreReviewAction({
      opportunityTitle: opportunity.title,
      opportunityDescription: opportunity.description,
      coreProblem: meta.core_problem,
      targetAudience: meta.target_audience,
      currentScores: scores as any,
      founderProfile: {
        fullname: profile?.fullname,
        country: profile?.country,
        age_group: profile?.age_group,
        bio: profile?.bio,
        skills: profile?.skills,
        motivations: profile?.motivations,
        roadblocks: profile?.roadblocks,
      }
    }, taskId);

    if (res.success && res.data) {
      setAiFeedback(res.data);
    } else {
      setErrorMsg(res.error || 'Failed to fetch AI feedback');
    }
    setIsAiLoading(false);
  };

  const handleSaveScore = async () => {
    if (!opportunity) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await scoreOpportunityAction({
      opportunityId: opportunity.id,
      scores: scores as any,
      notes,
    });

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to save score');
      setIsSubmitting(false);
      return;
    }

    onScoreSaved(res.data!);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="text-sm font-bold flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            Score Opportunity
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-medium">
            {opportunity?.title}
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="p-3 border rounded-xl bg-destructive/10 border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="space-y-4 py-2 text-left">
          {/* CRITERIA SLIDERS */}
          {CRITERIA.map((c) => (
            <div key={c.id} className="space-y-2 p-3 rounded-xl border border-border/80 bg-card/60">
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

          {/* SCORING NOTES */}
          <div className="space-y-1.5 pt-1">
            <Label className="text-xs font-semibold">Notes on Scoring (Optional)</Label>
            <Textarea
              className="text-xs bg-background min-h-[60px]"
              placeholder="Why did you give these scores?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* AI MENTOR FEEDBACK */}
          <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-amber-500" />
                AI Mentor Feedback
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRequestAiReview}
                disabled={isAiLoading}
                className="text-[11px] font-bold h-7 gap-1 text-primary hover:bg-primary/10 cursor-pointer"
              >
                {isAiLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    Get AI Feedback
                  </>
                )}
              </Button>
            </div>

            {aiFeedback && (
              <div className="space-y-2 pt-1 border-t border-primary/10 text-xs">
                <p className="text-foreground leading-relaxed font-medium">
                  "{aiFeedback.feedback}"
                </p>
                {aiFeedback.blindSpot && (
                  <p className="text-amber-500 text-[11px] font-semibold">
                    ⚠️ Blindspot: {aiFeedback.blindSpot}
                  </p>
                )}
                {aiFeedback.suggestion && (
                  <p className="text-muted-foreground text-[11px] italic">
                    💡 <strong>Tip:</strong> {aiFeedback.suggestion}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs h-9 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSaveScore}
            disabled={isSubmitting}
            className="text-xs h-9 font-bold uppercase tracking-wider gap-1.5 cursor-pointer"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save Scores'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
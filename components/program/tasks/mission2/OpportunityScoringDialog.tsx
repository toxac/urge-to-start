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
import { runOpportunityAssessmentAction } from '@/actions/assessments';
import { Database } from '@/types/supabase';
import { 
  Loader2, 
  Star, 
  Sparkles, 
  Brain, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

type UserOpportunityRow = Database['public']['Tables']['user_opportunities']['Row'];

interface OpportunityScoringDialogProps {
  opportunity: UserOpportunityRow | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onScoreSaved: (updatedOpp: UserOpportunityRow) => void;
  taskId?: string;
}

interface OpportunityAssessmentOutput {
  founderAlignment: string;
  opportunityStrength: string;
  keyRiskOrBlindSpot: string;
}

const CRITERIA = [
  { id: 'passion', label: 'Personal Interest', hint: 'How excited are you to work on this problem?' },
  { id: 'urgency', label: 'Problem Pain', hint: 'How badly do people want this fixed right now?' },
  { id: 'workaround_spend', label: 'Willingness to Spend', hint: 'Are people already paying money or spending time to deal with this?' },
  { id: 'unfair_advantage', label: 'Your Unique Advantage', hint: 'Do you have special skills, insider knowledge, or easy access to these customers?' },
  { id: 'msp_feasibility', label: 'Speed to Build', hint: 'Can you create a simple first version in 1 to 2 weeks?' },
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // AI Assessment State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<OpportunityAssessmentOutput | null>(null);
  const [isAiMinimized, setIsAiMinimized] = useState(false);

  useEffect(() => {
    if (opportunity) {
      const existingScores = (opportunity.scores as any)?.criteria;
      const existingNotes = (opportunity.scores as any)?.notes;
      if (existingScores) setScores(existingScores);
      else setScores({ passion: 3, urgency: 3, workaround_spend: 3, unfair_advantage: 3, msp_feasibility: 3 });
      setNotes(existingNotes || '');
      setAiInsight(null);
      setIsAiMinimized(false);
      setErrorMsg(null);
    }
  }, [opportunity]);

  const handleRequestAiInsight = async () => {
    if (!opportunity) return;
    setIsAiLoading(true);
    setErrorMsg(null);

    const meta = (opportunity.capture_metadata as any) || {};

    const res = await runOpportunityAssessmentAction({
      opportunityTitle: opportunity.title,
      opportunityDescription: opportunity.description,
      coreProblem: meta.core_problem,
      targetAudience: meta.target_audience,
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
      setAiInsight(res.data);
      setIsAiMinimized(false);
    } else {
      setErrorMsg(res.error || 'Failed to fetch AI assessment');
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
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
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

        <div className="space-y-4 py-1 text-left">
          {/* TOP SECTION: AI OPPORTUNITY INSIGHT (COLLAPSIBLE) */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden transition-all">
            <div className="p-3 flex items-center justify-between border-b border-primary/10 bg-primary/10">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-amber-500" />
                AI Opportunity Feedback
              </span>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRequestAiInsight}
                  disabled={isAiLoading}
                  className="text-[10px] font-bold h-6 px-2 gap-1 text-primary hover:bg-primary/20 cursor-pointer"
                >
                  {isAiLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      {aiInsight ? 'Re-Analyze' : 'Get AI Advice'}
                    </>
                  )}
                </Button>

                {aiInsight && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsAiMinimized(!isAiMinimized)}
                    className="h-6 w-6 text-primary hover:bg-primary/20 cursor-pointer"
                  >
                    {isAiMinimized ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                  </Button>
                )}
              </div>
            </div>

            {/* EXPANDABLE AI CONTENT */}
            {aiInsight && !isAiMinimized && (
              <div className="p-3.5 space-y-2 text-xs border-t border-primary/10">
                <div>
                  <strong className="text-foreground block text-[11px]">How Well It Fits You:</strong>
                  <p className="text-muted-foreground leading-relaxed">{aiInsight.founderAlignment}</p>
                </div>

                <div>
                  <strong className="text-foreground block text-[11px]">Key Strength:</strong>
                  <p className="text-muted-foreground leading-relaxed">{aiInsight.opportunityStrength}</p>
                </div>

                <div>
                  <strong className="text-amber-500 block text-[11px]">Main Risk to Watch For:</strong>
                  <p className="text-muted-foreground leading-relaxed">{aiInsight.keyRiskOrBlindSpot}</p>
                </div>
              </div>
            )}
          </div>

          {/* CRITERIA SLIDERS */}
          <div className="space-y-3 pt-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Rate from 1 (Low) to 5 (High)
            </span>

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
                  className="cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* SCORING NOTES */}
          <div className="space-y-1.5 pt-1">
            <Label className="text-xs font-semibold">Notes / Reflection (Optional)</Label>
            <Textarea
              className="text-xs bg-background min-h-[60px]"
              placeholder="What made you give these scores?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
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
            className="text-xs h-9 font-bold uppercase tracking-wider gap-1.5 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save Scores'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
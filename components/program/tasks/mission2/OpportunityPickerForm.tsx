// components/program/tasks/mission2/OpportunityPickerForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { getUserOpportunitiesAction, selectOpportunityAction } from '@/actions/opportunities';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { Database } from '@/types/supabase';
import { Loader2, CheckCircle2, AlertCircle, Trophy, Check, ArrowRight } from 'lucide-react';

type UserOpportunityRow = Database['public']['Tables']['user_opportunities']['Row'];

export function OpportunityPickerForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [opportunities, setOpportunities] = useState<UserOpportunityRow[]>([]);
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);
  const [justification, setJustification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isCompleted = existingProgress?.status === 'completed';

  useEffect(() => {
    async function loadData() {
      const res = await getUserOpportunitiesAction();
      if (res.success && res.data) {
        // Sort by highest score first
        const sorted = [...res.data].sort((a, b) => {
          const scoreA = (a.scores as any)?.total_score || 0;
          const scoreB = (b.scores as any)?.total_score || 0;
          return scoreB - scoreA;
        });
        setOpportunities(sorted);

        const committed = sorted.find(o => o.status === 'committed');
        if (committed) {
          setSelectedOppId(committed.id);
          setJustification((committed.capture_metadata as any)?.justification || '');
        }
      }
    }
    loadData();
  }, []);

  const handleSubmitSelection = async () => {
    if (!selectedOppId || !justification.trim()) {
      setErrorMessage('Please select an opportunity and write a brief justification.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const selectRes = await selectOpportunityAction(selectedOppId, justification);
      if (!selectRes.success) {
        setErrorMessage(selectRes.error || 'Failed to commit opportunity');
        setIsSubmitting(false);
        return;
      }

      const taskResult = await processTaskCompletion({
        task,
        savedPayload: { selected_opportunity_id: selectedOppId, justification }
      });

      if (taskResult.success && onSuccess) {
        onSuccess();
      } else {
        setErrorMessage(taskResult.error || 'Failed to complete task');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
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

      {isCompleted ? (
        <div className="p-5 border rounded-2xl bg-emerald-500/5 border-emerald-500/20 space-y-2">
          <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase">
            <CheckCircle2 className="w-4 h-4" /> Opportunity Selected
          </span>
          <p className="text-xs text-foreground font-semibold">
            "{opportunities.find(o => o.id === selectedOppId)?.title}"
          </p>
        </div>
      ) : (
        <div className="p-5 rounded-2xl border bg-card/60 space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              Rank & Pick Your Target Opportunity
            </span>
            <p className="text-xs text-muted-foreground">{task.briefing_text}</p>
          </div>

          <div className="space-y-2">
            {opportunities.map((opp) => {
              const total = (opp.scores as any)?.total_score || 0;
              const isSelected = selectedOppId === opp.id;

              return (
                <button
                  key={opp.id}
                  type="button"
                  onClick={() => setSelectedOppId(opp.id)}
                  className={`w-full p-4 rounded-xl border text-left transition cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected 
                      ? 'border-primary bg-primary/10 text-foreground' 
                      : 'border-border bg-card hover:border-primary/50 text-muted-foreground'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-foreground block">{opp.title}</span>
                    <p className="text-[11px] line-clamp-1">{opp.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/40 text-emerald-500">
                      Score: {total}/25
                    </Badge>
                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Why did you pick this one? *</Label>
            <Textarea
              className="text-xs bg-background min-h-[80px]"
              placeholder="What made this opportunity stand out? Why is it the right one for you?"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
            />
          </div>

          <Button
            type="button"
            onClick={handleSubmitSelection}
            disabled={isSubmitting}
            className="w-full h-10 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                <span>Commit to Opportunity & Complete Task</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
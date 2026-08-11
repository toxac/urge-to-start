// components/program/tasks/mission2/OpportunityScoringForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getUserOpportunitiesAction } from '@/actions/opportunities';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { OpportunityScoringDialog } from './OpportunityScoringDialog';
import { BaseTaskComponentProps } from '../types';
import { Database } from '@/types/supabase';
import { Loader2, AlertCircle, Star, ArrowRight } from 'lucide-react';

type UserOpportunityRow = Database['public']['Tables']['user_opportunities']['Row'];

export function OpportunityScoringForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [opportunities, setOpportunities] = useState<UserOpportunityRow[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<UserOpportunityRow | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const handleOpenScoring = (opp: UserOpportunityRow) => {
    setSelectedOpp(opp);
    setIsDialogOpen(true);
  };

  const handleScoreSaved = (updatedOpp: UserOpportunityRow) => {
    setOpportunities(prev => prev.map(o => o.id === updatedOpp.id ? updatedOpp : o));
  };

  const handleCompleteTask = async () => {
    const scoredCount = opportunities.filter(o => o.status === 'scored' || o.status === 'committed' || Boolean((o.scores as any)?.total_score)).length;
    if (scoredCount === 0) {
      setErrorMessage('Please score at least one opportunity before completing this task.');
      return;
    }

    setIsCompleting(true);
    const res = await processTaskCompletion({
      task,
      savedPayload: { total_scored: scoredCount },
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

      {/* CARDS LIST */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
          Your Opportunities to Score ({opportunities.length}):
        </span>

        <div className="grid grid-cols-1 gap-3">
          {opportunities.map((opp) => {
            const total = (opp.scores as any)?.total_score;
            const isScored = opp.status === 'scored' || opp.status === 'committed' || Boolean(total);

            return (
              <div key={opp.id} className="p-4 rounded-xl border border-border bg-card space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-foreground truncate">{opp.title}</span>
                  {isScored ? (
                    <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/40 text-emerald-500 bg-emerald-500/10 shrink-0">
                      Score: {total}/25
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] font-mono border-amber-500/40 text-amber-500 bg-amber-500/10 shrink-0">
                      Unscored
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {opp.description}
                </p>

                <Button
                  type="button"
                  variant={isScored ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => handleOpenScoring(opp)}
                  className="text-xs font-bold gap-1.5 cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5" />
                  {isScored ? 'Edit Scores' : 'Score Opportunity'}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODULAR SCORING DIALOG */}
      <OpportunityScoringDialog
        opportunity={selectedOpp}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onScoreSaved={handleScoreSaved}
        taskId={task.id}
      />

      {/* COMPLETE TASK CTA */}
      {!isCompleted && opportunities.some(o => o.status === 'scored' || o.status === 'committed' || Boolean((o.scores as any)?.total_score)) && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-foreground block">
              Finished scoring opportunities?
            </span>
            <p className="text-[11px] text-muted-foreground">
              Complete this step to advance to picking your target opportunity.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleCompleteTask}
            disabled={isCompleting}
            className="h-10 px-5 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
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
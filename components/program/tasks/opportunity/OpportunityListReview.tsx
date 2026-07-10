// components/program/tasks/opportunity/OpportunityListReview.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Archive, X, Loader2, Eye } from 'lucide-react';
import { getOpportunities, archiveOpportunity, OpportunityStatusType } from '@/actions/opportunities';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  source_type: 'personal_problems' | 'skills' | 'zone_of_influence' | 'broader_search';
  status: OpportunityStatusType;
  created_at: string;
}

const SOURCE_LABELS: Record<string, string> = {
  personal_problems: 'Personal Problems',
  skills: 'Skills',
  zone_of_influence: 'People in Your Circle',
  broader_search: 'Market Research'
};

const SOURCE_COLORS: Record<string, string> = {
  personal_problems: 'bg-blue-100 text-blue-800 border-blue-200',
  skills: 'bg-purple-100 text-purple-800 border-purple-200',
  zone_of_influence: 'bg-green-100 text-green-800 border-green-200',
  broader_search: 'bg-amber-100 text-amber-800 border-amber-200'
};

export function OpportunityListReview({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const isCompleted = existingProgress?.status === 'completed';
  const preSavedPayload = existingProgress?.saved_payload || {};

  // Load opportunities
  useEffect(() => {
    async function loadOpportunities() {
      setIsLoading(true);
      try {
        const result = await getOpportunities({
          status: ['raw_seed', 'validated', 'scored']
        });

        if (result.success) {
          setOpportunities(result.data);
          // Restore archived state from saved payload
          if (preSavedPayload.archivedIds) {
            setArchivedIds(new Set(preSavedPayload.archivedIds));
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

  const handleArchive = async (id: string) => {
    // Optimistically update UI
    setArchivedIds(prev => new Set(prev).add(id));

    try {
      const result = await archiveOpportunity(id);
      if (!result.success) {
        // Revert on error
        setArchivedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        toast.error(result.error || 'Failed to archive opportunity');
      } else {
        toast.success('Opportunity archived');
      }
    } catch (err) {
      // Revert on error
      setArchivedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      toast.error('Something went wrong');
    }
  };

  const handleUnarchive = (id: string) => {
    setArchivedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    toast.info('Opportunity unarchived');
  };

  const handleMarkComplete = async () => {
    if (opportunities.filter(o => !archivedIds.has(o.id)).length === 0) {
      toast.error('You need to keep at least one opportunity');
      return;
    }

    setIsSubmitting(true);
    try {
      const progressSync = await completeTaskExecution({
        taskId: task.id,
        savedPayload: {
          archivedIds: Array.from(archivedIds),
          keptCount: opportunities.filter(o => !archivedIds.has(o.id)).length,
          completedAt: new Date().toISOString()
        }
      });

      if (progressSync.success) {
        if (progressSync.data) {
          setProgressStoreRow(progressSync.data as any);
        }
        setIsComplete(true);
        if (onSuccess) onSuccess();
        toast.success('✅ Review complete!');
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
          <span className="font-medium">Review Complete</span>
          <span className="text-sm text-muted-foreground">
            ({opportunities.filter(o => !archivedIds.has(o.id)).length} opportunities kept)
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

  const keptOpportunities = opportunities.filter(o => !archivedIds.has(o.id));
  const archivedOpportunities = opportunities.filter(o => archivedIds.has(o.id));

  if (opportunities.length === 0) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-muted-foreground">No opportunities found.</p>
        <p className="text-sm text-muted-foreground">
          Complete the earlier tasks to create opportunities first.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h4 className="font-medium">Review Your Opportunities</h4>
        <p className="text-sm text-muted-foreground">
          Review each opportunity. Archive the ones you don't want to pursue.
          You need to keep at least one to continue.
        </p>
      </div>

      {/* Kept Opportunities */}
      {keptOpportunities.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-medium text-emerald-600">
              Kept ({keptOpportunities.length})
            </h5>
          </div>
          <div className="space-y-3">
            {keptOpportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onArchive={() => handleArchive(opp.id)}
                showArchive={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Archived Opportunities */}
      {archivedOpportunities.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-medium text-muted-foreground">
              Archived ({archivedOpportunities.length})
            </h5>
          </div>
          <div className="space-y-3">
            {archivedOpportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onArchive={() => handleUnarchive(opp.id)}
                showArchive={false}
                isArchived={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Complete Button */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {keptOpportunities.length} opportunity{keptOpportunities.length !== 1 ? 's' : ''} kept
          </span>
          {keptOpportunities.length > 0 && (
            <span className="text-emerald-600 font-medium">✓ Ready to continue</span>
          )}
        </div>
        <Button
          onClick={handleMarkComplete}
          disabled={isSubmitting || keptOpportunities.length === 0}
          className="w-full h-11"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          {isSubmitting
            ? 'Saving...'
            : keptOpportunities.length === 0
              ? 'Keep at least one opportunity'
              : `Continue with ${keptOpportunities.length} opportunity${keptOpportunities.length !== 1 ? 's' : ''} (+${task.grant_points} XP)`}
        </Button>
      </div>
    </div>
  );
}

interface OpportunityCardProps {
  opportunity: Opportunity;
  onArchive: () => void;
  showArchive: boolean;
  isArchived?: boolean;
}

function OpportunityCard({ opportunity, onArchive, showArchive, isArchived }: OpportunityCardProps) {
  const sourceLabel = SOURCE_LABELS[opportunity.source_type] || opportunity.source_type;
  const sourceColor = SOURCE_COLORS[opportunity.source_type] || 'bg-gray-100 text-gray-800';

  return (
    <Card className={cn(
      "border",
      isArchived && "opacity-50 bg-muted/30"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-base">{opportunity.title}</CardTitle>
            <CardDescription className="text-sm line-clamp-2">
              {opportunity.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className={cn("text-xs", sourceColor)}>
              {sourceLabel}
            </Badge>
            {isArchived && (
              <Badge variant="outline" className="text-xs text-muted-foreground border-muted-foreground/20">
                Archived
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-end">
          {showArchive ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onArchive}
              className="text-muted-foreground hover:text-destructive"
            >
              <Archive className="w-4 h-4 mr-1" />
              Archive
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={onArchive}
              className="text-muted-foreground hover:text-emerald-600"
            >
              <X className="w-4 h-4 mr-1" />
              Unarchive
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
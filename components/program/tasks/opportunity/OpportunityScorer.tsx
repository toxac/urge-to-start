// components/program/tasks/opportunity/OpportunityScorer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Loader2, Trophy, ArrowUp, ArrowDown } from 'lucide-react';
import { getOpportunities, scoreOpportunity, OpportunityStatusType } from '@/actions/opportunities';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { BaseTaskComponentProps } from '../types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// ⚡ FIXED: Slider component needs to be imported
import { Slider } from '@/components/ui/slider';

interface Score {
    cares_about_problem: number;
    knows_people_with_problem: number;
    can_talk_to_them: number;
    unfair_advantage: number;
    clear_payment_path: number;
}

const CRITERIA = [
    { id: 'cares_about_problem', label: 'Do I care about this problem?', emoji: '❤️' },
    { id: 'knows_people_with_problem', label: 'Do I know people with this problem?', emoji: '👥' },
    { id: 'can_talk_to_them', label: 'Can I talk to them easily?', emoji: '💬' },
    { id: 'unfair_advantage', label: 'Do I have an unfair advantage?', emoji: '⚡' },
    { id: 'clear_payment_path', label: 'Is there a clear way to get paid?', emoji: '💰' },
];

export function OpportunityScorer({ task, userId, existingProgress, onSuccess }: BaseTaskComponentProps) {
    const [opportunities, setOpportunities] = useState<any[]>([]);
    const [scores, setScores] = useState<Record<string, Score>>({});
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [sortBy, setSortBy] = useState<'score' | 'title'>('score');

    const isCompleted = existingProgress?.status === 'completed';
    const preSavedPayload = existingProgress?.saved_payload || {};

    // Load validated opportunities
    useEffect(() => {
        async function loadOpportunities() {
            setIsLoading(true);
            try {
                const result = await getOpportunities({
                    status: ['validated', 'scored']
                });

                if (result.success) {
                    setOpportunities(result.data);

                    // Restore saved scores
                    if (preSavedPayload.scores) {
                        setScores(preSavedPayload.scores);
                    }

                    if (preSavedPayload.selectedId) {
                        setSelectedId(preSavedPayload.selectedId);
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

    const handleScoreChange = (opportunityId: string, criterionId: string, value: number) => {
        setScores(prev => ({
            ...prev,
            [opportunityId]: {
                ...(prev[opportunityId] || {}),
                [criterionId]: value
            }
        }));
    };

    const getTotalScore = (opportunityId: string): number => {
        const score = scores[opportunityId];
        if (!score) return 0;
        return Object.values(score).reduce((sum, val) => sum + val, 0);
    };

    const isFullyScored = (opportunityId: string): boolean => {
        const score = scores[opportunityId];
        if (!score) return false;
        return CRITERIA.every(c => score[c.id as keyof Score] !== undefined && score[c.id as keyof Score] > 0);
    };

    const handleSubmitScore = async (opportunityId: string) => {
        const score = scores[opportunityId];
        if (!score || !isFullyScored(opportunityId)) {
            toast.error('Please score all criteria (1-10 each)');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await scoreOpportunity({
                opportunityId,
                cares_about_problem: score.cares_about_problem,
                knows_people_with_problem: score.knows_people_with_problem,
                can_talk_to_them: score.can_talk_to_them,
                unfair_advantage: score.unfair_advantage,
                clear_payment_path: score.clear_payment_path
            });

            if (result.success) {
                toast.success('✅ Opportunity scored!');
                // Refresh to show updated status
                const refreshResult = await getOpportunities({ status: ['validated', 'scored'] });
                if (refreshResult.success) {
                    setOpportunities(refreshResult.data);
                }
            } else {
                toast.error(result.error || 'Failed to score');
            }
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSelect = (opportunityId: string) => {
        setSelectedId(opportunityId);
    };

    const handleMarkComplete = async () => {
        if (!selectedId) {
            toast.error('Please select your top opportunity');
            return;
        }

        setIsSubmitting(true);
        try {
            const progressSync = await completeTaskExecution({
                taskId: task.id,
                savedPayload: {
                    scores,
                    selectedId,
                    completedAt: new Date().toISOString()
                }
            });

            if (progressSync.success) {
                if (progressSync.data) {
                    setProgressStoreRow(progressSync.data as any);
                }
                setIsComplete(true);
                if (onSuccess) onSuccess();
                toast.success('✅ Scored and selected your top opportunity!');
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
        const selected = opportunities.find(o => o.id === selectedId);
        return (
            <div className="w-full space-y-4">
                <div className="flex items-center gap-2 text-emerald-600">
                    <Trophy className="w-5 h-5" />
                    <span className="font-medium">Top Opportunity Selected!</span>
                </div>
                {selected && (
                    <Card className="border-emerald-200 bg-emerald-50/20">
                        <CardHeader>
                            <CardTitle className="text-base">{selected.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{selected.description}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                    Score: {getTotalScore(selected.id)}/50
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                    {selected.source_type}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                )}
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

    const sortedOpportunities = [...opportunities].sort((a, b) => {
        if (sortBy === 'score') {
            return getTotalScore(b.id) - getTotalScore(a.id);
        }
        return a.title.localeCompare(b.title);
    });

    const hasScored = opportunities.some(o => o.status === 'scored');

    return (
        <div className="w-full space-y-6">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <h4 className="font-medium">Score & Select Your Top Opportunity</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                    Score each opportunity on 5 criteria (1-10). Then select your top choice.
                </p>
                {hasScored && (
                    <p className="text-xs text-emerald-600">
                        ✅ Some opportunities have been scored. You can continue scoring others or select your top choice.
                    </p>
                )}
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Button
                    variant={sortBy === 'score' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('score')}
                    className="h-8"
                >
                    Score
                </Button>
                <Button
                    variant={sortBy === 'title' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('title')}
                    className="h-8"
                >
                    Title
                </Button>
            </div>

            <div className="space-y-4">
                {sortedOpportunities.map((opp) => {
                    const totalScore = getTotalScore(opp.id);
                    const isScored = opp.status === 'scored';
                    const isFullyScoredNow = isFullyScored(opp.id);
                    const isSelected = selectedId === opp.id;

                    return (
                        <Card key={opp.id} className={cn(
                            "border",
                            isSelected && "border-primary ring-2 ring-primary/20",
                            isScored && "border-emerald-200 bg-emerald-50/10"
                        )}>
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1 flex-1">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            {opp.title}
                                            {isScored && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {opp.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <Badge variant="outline" className="text-xs">
                                            {opp.source_type}
                                        </Badge>
                                        {isScored && (
                                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                                                Score: {totalScore}/50
                                            </Badge>
                                        )}
                                        {isSelected && (
                                            <Badge className="bg-primary/10 text-primary border-primary/20">
                                                Selected ✓
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Score Sliders */}
                                <div className="space-y-3">
                                    {CRITERIA.map((criterion) => {
                                        const currentValue = scores[opp.id]?.[criterion.id as keyof Score] || 0;
                                        return (
                                            <div key={criterion.id} className="space-y-1">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        {criterion.emoji} {criterion.label}
                                                    </span>
                                                    <span className="font-medium">
                                                        {currentValue}/10
                                                    </span>
                                                </div>
                                                {/* ⚡ FIXED: Properly pass number[] to value prop */}
                                                <Slider
                                                    value={[currentValue]}
                                                    onValueChange={(value) => {
                                                        const val = Array.isArray(value) ? value[0] : value;
                                                        handleScoreChange(opp.id, criterion.id, val);
                                                    }}
                                                    max={10}
                                                    step={1}
                                                    disabled={isScored || isSubmitting}
                                                    className="w-full"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3 pt-2 border-t">
                                    {!isScored && (
                                        <Button
                                            onClick={() => handleSubmitScore(opp.id)}
                                            disabled={isSubmitting || !isFullyScoredNow}
                                            size="sm"
                                        >
                                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                            {isSubmitting ? 'Saving...' : 'Save Score'}
                                        </Button>
                                    )}

                                    {isScored && (
                                        <Button
                                            onClick={() => handleSelect(opp.id)}
                                            disabled={isSelected || isSubmitting}
                                            variant={isSelected ? 'default' : 'outline'}
                                            size="sm"
                                        >
                                            {isSelected ? '✓ Selected' : 'Select This Opportunity'}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Complete Button */}
            {selectedId && (
                <div className="border-t pt-4">
                    <Button
                        onClick={handleMarkComplete}
                        disabled={isSubmitting}
                        className="w-full h-11"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {isSubmitting
                            ? 'Saving...'
                            : `Select "${opportunities.find(o => o.id === selectedId)?.title}" (+${task.grant_points} XP)`}
                    </Button>
                </div>
            )}
        </div>
    );
}
// components/program/tasks/mission2/DecisionGateForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getUserOpportunitiesAction } from '@/actions/opportunities';
import { createProjectFromOpportunityAction } from '@/actions/projects';
import { recordAccomplishment } from '@/actions/accomplishments';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { setAccomplishmentStoreRow } from '@/lib/stores/accomplishmentStore';
import { BaseTaskComponentProps } from '../types';
import { TaskResourcesList } from '../TaskResourcesList';
import { Database } from '@/types/supabase';
import { Loader2, CheckCircle2, AlertCircle, Rocket, Sparkles } from 'lucide-react';

type UserOpportunityRow = Database['public']['Tables']['user_opportunities']['Row'];

export function DecisionGateForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [committedOpp, setCommittedOpp] = useState<UserOpportunityRow | null>(null);
  const [decision, setDecision] = useState<'finalize' | 'discover_more'>('finalize');
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isCompleted = existingProgress?.status === 'completed';

  useEffect(() => {
    async function loadCommitted() {
      const res = await getUserOpportunitiesAction();
      if (res.success && res.data) {
        const committed = res.data.find(o => o.status === 'committed') || res.data[0];
        if (committed) {
          setCommittedOpp(committed);
          setProjectName(committed.title.replace(/^Solving:\s*/i, ''));
          setProjectDesc(committed.description);
        }
      }
    }
    loadCommitted();
  }, []);

  const handleSubmitGate = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (decision === 'finalize') {
        if (!committedOpp) {
          setErrorMessage('No committed opportunity found. Please pick an opportunity first.');
          setIsSubmitting(false);
          return;
        }

        // 1. Create active project in user_projects
        const projRes = await createProjectFromOpportunityAction({
          opportunityId: committedOpp.id,
          bizName: projectName,
          description: projectDesc,
        });

        if (!projRes.success) {
          setErrorMessage(projRes.error || 'Failed to create project');
          setIsSubmitting(false);
          return;
        }

        // 2. Complete Mission 2 Task & Grant XP
        const taskResult = await processTaskCompletion({
          task,
          savedPayload: {
            decision: 'finalize',
            project_id: projRes.data?.id,
            completed_at: new Date().toISOString(),
          },
        });

        if (!taskResult.success) {
          setErrorMessage(taskResult.error || 'Failed to complete decision gate');
          setIsSubmitting(false);
          return;
        }

        // 3. Award Mission 2 Completion Accomplishment
        const missionRes = await recordAccomplishment({
          awardedFor: 'mission',
          relatedTable: 'missions',
          relatedReferenceId: 'mission-2',
          title: 'Completed Mission 2: Discovery',
          pointsGranted: 200,
        });

        if (missionRes.success && missionRes.accomplishmentRow) {
          setAccomplishmentStoreRow(missionRes.accomplishmentRow);
        }

        if (onSuccess) onSuccess();
      } else {
        // Option 2: Go back to discover more
        const taskResult = await processTaskCompletion({
          task,
          savedPayload: { decision: 'discover_more', completed_at: new Date().toISOString() },
        });

        if (taskResult.success && onSuccess) onSuccess();
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

      {/* RECOMMENDED RESOURCES / PLAYBOOK GUIDES */}
      <TaskResourcesList resources={task.resources} />

      {isCompleted ? (
        <div className="p-6 border rounded-2xl bg-emerald-500/5 border-emerald-500/20 space-y-3">
          <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            Mission 2 Complete: Project Created
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            You locked in your opportunity and launched your project workspace. Mission 3 (Customer Validation & MSP) is now unlocked!
          </p>
        </div>
      ) : (
        <div className="p-6 rounded-2xl border bg-card/60 space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Rocket className="w-4 h-4 text-amber-500" />
              Mission 2 Decision Gate: Make It Official
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">{task.briefing_text}</p>
          </div>

          <RadioGroup
            value={decision}
            onValueChange={(val) => setDecision(val as any)}
            className="space-y-3"
          >
            <div className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
              decision === 'finalize' ? 'border-primary bg-primary/10' : 'border-border bg-card'
            }`}>
              <RadioGroupItem value="finalize" id="opt-finalize" className="mt-0.5" />
              <div className="space-y-1">
                <label htmlFor="opt-finalize" className="text-xs font-bold text-foreground cursor-pointer block">
                  🚀 Lock in this opportunity & start Mission 3
                </label>
                <p className="text-[11px] text-muted-foreground">
                  Generate your active project workspace and start validating your solution with real customers.
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
              decision === 'discover_more' ? 'border-primary bg-primary/10' : 'border-border bg-card'
            }`}>
              <RadioGroupItem value="discover_more" id="opt-discover" className="mt-0.5" />
              <div className="space-y-1">
                <label htmlFor="opt-discover" className="text-xs font-bold text-foreground cursor-pointer block">
                  🔄 Explore more ideas first
                </label>
                <p className="text-[11px] text-muted-foreground">
                  Gather more observations and seed additional opportunities before locking in a direction.
                </p>
              </div>
            </div>
          </RadioGroup>

          {decision === 'finalize' && (
            <div className="space-y-4 pt-2 border-t">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Project Name *</Label>
                <Input
                  type="text"
                  placeholder="e.g. Acme Meal Planner"
                  className="text-xs h-9 bg-background w-full"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Project Description *</Label>
                <Textarea
                  className="text-xs bg-background min-h-[80px] w-full"
                  placeholder="What will you build? Who will it serve?"
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                />
              </div>
            </div>
          )}

          <Button
            type="button"
            onClick={handleSubmitGate}
            disabled={isSubmitting}
            className="w-full h-11 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Lock In Project & Complete Mission 2 (+{task.grant_points} XP)</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
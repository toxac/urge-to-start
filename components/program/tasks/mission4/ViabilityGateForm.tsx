// components/program/tasks/mission4/ViabilityGateForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getActiveProjectAction, updateProjectViabilityAction } from '@/actions/projects';
import { getCostSummaryAction } from '@/actions/budget';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { TaskResourcesList } from '../TaskResourcesList';
import { Database } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  AlertCircle, 
  Edit2,
  Flag,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  RefreshCcw,
  Rocket,
  Coins,
  Tag,
  Truck
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

export function ViabilityGateForm({
  task,
  existingProgress,
  onSuccess
}: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [projectData, setProjectData] = useState<any>(null);
  const [costSummary, setCostSummary] = useState<any>(null);

  const isCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isCompleted);

  const [decision, setDecision] = useState<'go' | 'pivot'>('go');
  const [founderRationale, setFounderRationale] = useState<string>('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const projRes = await getActiveProjectAction();
      if (projRes.success && projRes.data) {
        setActiveProject(projRes.data);
        setProjectData(projRes.data);

        const costRes = await getCostSummaryAction(projRes.data.id);
        if (costRes.success) setCostSummary(costRes.data);

        const viabilityCheck = (projRes.data.viability_check as any) || {};
        if (viabilityCheck.final_decision) {
          setDecision(viabilityCheck.final_decision);
          setFounderRationale(viabilityCheck.decision_rationale || '');
        }
      } else {
        setErrorMessage(!projRes.success ? projRes.error : 'Failed to load active project');
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleSubmitDecision = async () => {
    if (!activeProject) return;
    if (!founderRationale.trim()) {
      setErrorMessage('Please provide a brief rationale for your final decision.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const viabilityPayload = {
      final_decision: decision,
      decision_rationale: founderRationale.trim(),
      decided_at: new Date().toISOString()
    };

    // 1. Update project viability check
    const updateRes = await updateProjectViabilityAction(activeProject.id, {
      viability_check: viabilityPayload,
      status: decision === 'go' ? 'validated_for_launch' : 'needs_pivot'
    } as any);

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to save final decision');
      setIsSubmitting(false);
      return;
    }

    // 2. Complete Task & Quest
    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        viability_decision: viabilityPayload
      }
    });

    if (taskRes.success) {
      setIsEditing(false);
      if (onSuccess) onSuccess();
    } else {
      setErrorMessage(taskRes.error || 'Failed to complete mission');
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        <p className="text-xs text-muted-foreground font-medium">Synthesizing your Business Plan Scorecard...</p>
      </div>
    );
  }

  const solutionDesign = (projectData?.solution_design as any) || {};
  const pricing = solutionDesign.pricing || {};
  const operations = solutionDesign.operations || {};

  return (
    <div className="w-full space-y-6 text-left">
      {errorMessage && (
        <div className="p-4 border rounded-xl bg-destructive/10 border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* RECOMMENDED RESOURCES */}
      <TaskResourcesList resources={task.resources} />

      {/* SYNTHESIZED BUSINESS PLAN SCORECARD */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            Synthesized Business Plan Scorecard
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold">Mission 4 Complete</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          
          {/* Pricing & Margins */}
          <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Pricing & Unit Target
            </span>
            <div className="space-y-1 text-foreground">
              <p><strong>Launch Price:</strong> ₹{pricing.target_price || 0}</p>
              <p><strong>Gross Margin:</strong> {pricing.expected_gross_margin_percent || 0}%</p>
              <p><strong>Monthly Break-Even:</strong> {pricing.monthly_breakeven_units || 0} orders</p>
            </div>
          </div>

          {/* Costs & Capital */}
          <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" /> Costs & Overhead
            </span>
            <div className="space-y-1 text-foreground">
              <p><strong>Unit Cost (COGS):</strong> ₹{costSummary?.unitCost || 0} / order</p>
              <p><strong>Startup Capital:</strong> ₹{costSummary?.totalStartupCost || 0}</p>
              <p><strong>Monthly Bills & Ads:</strong> ₹{(costSummary?.monthlyOverhead || 0) + (costSummary?.monthlyAcquisitionBudget || 0)} / mo</p>
            </div>
          </div>

          {/* Operations & Channels */}
          <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2 sm:col-span-2">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" /> Operations & Distribution
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-foreground">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase block">Sales Channels</span>
                <p className="font-semibold">{Array.isArray(operations.sales_channels) ? operations.sales_channels.join(', ').replace(/_/g, ' ') : 'Not set'}</p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase block">Key Partners</span>
                <p className="font-semibold">{Array.isArray(operations.key_partners) ? operations.key_partners.length : 0} partner(s) logged</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* READ-ONLY COMPLETED VIEW */}
      {!isEditing ? (
        <div className="w-full space-y-4 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Final Decision Locked: {decision === 'go' ? '🚀 GO FOR LAUNCH' : '🔄 PIVOT & REFINE'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Change Decision
            </Button>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1 text-xs">
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">Founder Rationale</span>
            <p className="text-xs font-medium text-foreground">{founderRationale}</p>
          </div>
        </div>
      ) : (
        /* EDITABLE DECISION FORM VIEW */
        <div className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5" />
              The Viability Gate: Make Your Call
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Based on your unit economics, profit margins, and operational plan, are you ready to build and launch, or do you need to pivot?
            </p>
          </div>

          {/* GO / PIVOT SELECTOR CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <div
              onClick={() => setDecision('go')}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                decision === 'go'
                  ? 'bg-emerald-500/10 border-emerald-500/50 shadow-sm'
                  : 'bg-background border-border opacity-70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Rocket className="w-3.5 h-3.5 text-emerald-500" /> GO FOR LAUNCH
                </span>
                <input
                  type="radio"
                  checked={decision === 'go'}
                  onChange={() => setDecision('go')}
                  className="accent-emerald-500"
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Unit economics and break-even targets look healthy. Proceed to Mission 5 (Build & Launch MVP).
              </p>
            </div>

            <div
              onClick={() => setDecision('pivot')}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                decision === 'pivot'
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-sm'
                  : 'bg-background border-border opacity-70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <RefreshCcw className="w-3.5 h-3.5 text-amber-500" /> PIVOT & REFINE
                </span>
                <input
                  type="radio"
                  checked={decision === 'pivot'}
                  onChange={() => setDecision('pivot')}
                  className="accent-amber-500"
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Margins or acquisition costs are too tight. Refine pricing or channels before spending capital.
              </p>
            </div>

          </div>

          {/* RATIONALE TEXTAREA */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-foreground">Why are you making this decision? *</Label>
            <Textarea
              rows={3}
              value={founderRationale}
              onChange={(e) => setFounderRationale(e.target.value)}
              placeholder="e.g. Our break-even target of 12 orders per month is entirely realistic based on our target customer persona."
              className="text-xs bg-background"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-2 pt-2 border-t border-border/50">
            {isCompleted && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditing(false)}
                className="h-10 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </Button>
            )}
            <Button
              type="button"
              onClick={handleSubmitDecision}
              disabled={isSubmitting || !founderRationale.trim()}
              className="flex-1 h-10 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Lock In Final Decision & Complete Mission 4</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
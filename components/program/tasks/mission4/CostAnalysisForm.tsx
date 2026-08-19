// components/program/tasks/mission4/CostAnalysisForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getActiveProjectAction, updateProjectViabilityAction } from '@/actions/projects';
import { getCostSummaryAction, getUserMaterialsAction, getUserBudgetItemsAction } from '@/actions/budget';
import { runCostCompletenessCheckAction, runCostAnalysisAction } from '@/actions/assessments';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { TaskResourcesList } from '../TaskResourcesList';
import { Database } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import {CostCompletenessCheckOutput, CostAnalysisOutput} from "@/types/ai-schema"
import { 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  AlertCircle, 
  Edit2,
  TrendingUp,
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
  Coins,
  Building2,
  Megaphone
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

export function CostAnalysisForm({
  task,
  existingProgress,
  onSuccess
}: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [costSummary, setCostSummary] = useState<any>(null);

  const [completenessData, setCompletenessData] = useState<CostCompletenessCheckOutput | null>(null);
  const [analysisData, setAnalysisData] = useState<CostAnalysisOutput | null>(null);
  const [selectedRiskIds, setSelectedRiskIds] = useState<string[]>([]);

  const isCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isCompleted);

  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadDataAndAnalyze() {
      setIsLoading(true);
      const projRes = await getActiveProjectAction();

      if (projRes.success && projRes.data) {
        setActiveProject(projRes.data);

        // Fetch cost numbers
        const summaryRes = await getCostSummaryAction(projRes.data.id);
        if (summaryRes.success) setCostSummary(summaryRes.data);

        const [matsRes, budgetRes] = await Promise.all([
          getUserMaterialsAction(projRes.data.id),
          getUserBudgetItemsAction(projRes.data.id)
        ]);

        const fullProjectContext = {
          solution_design: projRes.data.solution_design,
          materials: matsRes.data || [],
          budget_items: budgetRes.data || []
        };

        setIsAnalyzing(true);
        // Run AI Completeness & Analysis in parallel
        const [compRes, anaRes] = await Promise.all([
          runCostCompletenessCheckAction(fullProjectContext),
          runCostAnalysisAction(fullProjectContext)
        ]);

        if (compRes.success) setCompletenessData(compRes.data);
        if (anaRes.success) {
          setAnalysisData(anaRes.data);
          // Default select all generated risks
          setSelectedRiskIds((anaRes.data?.potentialRisks || []).map((r) => r.id));
        }
        setIsAnalyzing(false);
      } else {
        setErrorMessage(!projRes.success ? projRes.error : 'Failed to load active project');
      }
      setIsLoading(false);
    }

    loadDataAndAnalyze();
  }, []);

  const handleToggleRisk = (id: string) => {
    setSelectedRiskIds((prev) =>
      prev.includes(id) ? prev.filter((rId) => rId !== id) : [...prev, id]
    );
  };

  const handleSubmitAnalysis = async () => {
    if (!activeProject) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const acknowledgedRisks = (analysisData?.potentialRisks || []).filter((r) =>
      selectedRiskIds.includes(r.id)
    );

    const financialDesignPayload = {
      cost_summary: costSummary,
      completeness_check: completenessData,
      analysis: analysisData,
      acknowledged_risks: acknowledgedRisks,
      economies_of_scale_upside: analysisData?.economiesOfScaleUpside,
      updated_at: new Date().toISOString()
    };

    // 1. Save to project viability / solution design
    const updateRes = await updateProjectViabilityAction(activeProject.id, {
      cost_analysis: financialDesignPayload
    } as any);

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to save cost analysis');
      setIsSubmitting(false);
      return;
    }

    // 2. Complete Task & Quest
    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        financial_design: financialDesignPayload
      }
    });

    if (taskRes.success) {
      setIsEditing(false);
      if (onSuccess) onSuccess();
    } else {
      setErrorMessage(taskRes.error || 'Failed to complete step');
    }

    setIsSubmitting(false);
  };

  if (isLoading || isAnalyzing) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-xs text-muted-foreground font-semibold">
          {isLoading ? 'Loading cost data...' : 'AI is reviewing your entries & analyzing financial risks...'}
        </p>
      </div>
    );
  }

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

      {/* STEP 1: AI COMPLETENESS CHECK BANNER */}
      {completenessData && (
        <Card className={`border rounded-2xl ${completenessData.hasGaps ? 'border-amber-500/40 bg-amber-500/5' : 'border-emerald-500/40 bg-emerald-500/5'}`}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${completenessData.hasGaps ? 'text-amber-500' : 'text-emerald-500'}`}>
                {completenessData.hasGaps ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                AI Completeness Check
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">Step 1 of 3</span>
            </div>

            <p className="text-xs font-medium text-foreground">{completenessData.overallHealth}</p>

            {completenessData.hasGaps && completenessData.missingItems.length > 0 && (
              <div className="space-y-2 pt-1 border-t border-amber-500/20">
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block">Suggested Missing Entries:</span>
                <div className="space-y-1.5">
                  {completenessData.missingItems.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-background border border-amber-500/20 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-foreground block">{item.missingItemName}</span>
                        <span className="text-[10px] text-muted-foreground">{item.reason}</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                        Open {item.taskTitle} <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* STEP 2: COST SUMMARY & BENCHMARK ANALYSIS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            Financial Breakdown & Benchmark Insights
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold">Step 2 of 3</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase block flex items-center gap-1">
              <Coins className="w-3 h-3" /> Unit Cost (COGS)
            </span>
            <p className="text-base font-extrabold text-foreground">₹{costSummary?.unitCost?.toLocaleString('en-IN') || 0} <span className="text-[10px] font-normal text-muted-foreground">/ order</span></p>
            <p className="text-[11px] text-muted-foreground leading-snug">{analysisData?.unitCostAnalysis}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase block flex items-center gap-1">
              <Building2 className="w-3 h-3" /> Monthly Overhead
            </span>
            <p className="text-base font-extrabold text-foreground">₹{costSummary?.monthlyOverhead?.toLocaleString('en-IN') || 0} <span className="text-[10px] font-normal text-muted-foreground">/ month</span></p>
            <p className="text-[11px] text-muted-foreground leading-snug">{analysisData?.overheadAnalysis}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase block flex items-center gap-1">
              <Megaphone className="w-3 h-3" /> Acquisition Budget
            </span>
            <p className="text-base font-extrabold text-foreground">₹{costSummary?.monthlyAcquisitionBudget?.toLocaleString('en-IN') || 0} <span className="text-[10px] font-normal text-muted-foreground">/ month</span></p>
            <p className="text-[11px] text-muted-foreground leading-snug">{analysisData?.acquisitionAnalysis}</p>
          </div>
        </div>

        {/* ECONOMIES OF SCALE UPSIDE */}
        {analysisData?.economiesOfScaleUpside && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-foreground space-y-1">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Growth & Scale Opportunity
            </span>
            <p className="text-xs text-muted-foreground font-medium">{analysisData.economiesOfScaleUpside}</p>
          </div>
        )}
      </div>

      {/* STEP 3: FINANCIAL RISK ACKNOWLEDGEMENT */}
      <div className="p-5 rounded-2xl border border-border bg-card/60 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            Step 3 of 3: Select Risks That Apply To Your Business
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          Check off the financial risks you want to keep an eye on as you move into pricing and launch.
        </p>

        <div className="space-y-2">
          {(analysisData?.potentialRisks || []).map((risk) => {
            const isChecked = selectedRiskIds.includes(risk.id);
            return (
              <div
                key={risk.id}
                onClick={() => handleToggleRisk(risk.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 text-xs ${
                  isChecked ? 'bg-amber-500/10 border-amber-500/40' : 'bg-background border-border opacity-70'
                }`}
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => handleToggleRisk(risk.id)}
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{risk.title}</span>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                      risk.severity === 'high' ? 'bg-destructive/20 text-destructive' : 'bg-muted text-muted-foreground'
                    }`}>
                      {risk.severity} risk
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{risk.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 pt-3 border-t border-border/50">
          <Button
            type="button"
            onClick={handleSubmitAnalysis}
            disabled={isSubmitting}
            className="flex-1 h-10 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Lock In Financial Analysis & Complete Quest 2</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
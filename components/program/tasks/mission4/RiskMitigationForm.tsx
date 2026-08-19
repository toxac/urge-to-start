// components/program/tasks/mission4/RiskMitigationForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getActiveProjectAction, updateProjectOperationsAction } from '@/actions/projects';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { TaskResourcesList } from '../TaskResourcesList';
import { Database } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  AlertCircle, 
  Edit2,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

interface OperationalRiskItem {
  id: string;
  title: string;
  description: string;
  mitigation: string;
}

const COMMON_OPERATIONAL_RISKS: OperationalRiskItem[] = [
  {
    id: 'single_supplier_dependency',
    title: 'Single-Supplier Reliance',
    description: 'Your primary vendor runs out of stock or delays production.',
    mitigation: 'Identify and maintain contact with at least one secondary backup supplier.'
  },
  {
    id: 'permit_license_delays',
    title: 'Permit & License Bottlenecks',
    description: 'Government approvals (FSSAI, GST, Trade License) take longer than expected.',
    mitigation: 'Submit filings early and launch non-regulated pre-orders or waitlists while pending.'
  },
  {
    id: 'shipping_courier_mishaps',
    title: 'Packaging & Courier Delays',
    description: 'Orders get damaged in transit or courier partners miss delivery SLAs.',
    mitigation: 'Use reinforced outer packaging and partner with aggregators (e.g. Shiprocket) for multi-courier options.'
  },
  {
    id: 'platform_algorithm_ban',
    title: 'Channel / Social Platform Dependence',
    description: 'An ad account suspension or algorithm shift kills organic reach.',
    mitigation: 'Collect direct customer email addresses and WhatsApp contacts on Day 1.'
  }
];

export function RiskMitigationForm({
  task,
  existingProgress,
  onSuccess
}: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);

  const isCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isCompleted);

  const [selectedRiskIds, setSelectedRiskIds] = useState<string[]>(['single_supplier_dependency', 'shipping_courier_mishaps']);
  const [customMitigations, setCustomMitigations] = useState<Record<string, string>>({});

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const res = await getActiveProjectAction();
      if (res.success && res.data) {
        setActiveProject(res.data);
        const solutionDesign = (res.data.solution_design as any) || {};
        const operations = solutionDesign.operations || {};

        if (Array.isArray(operations.operational_risks) && operations.operational_risks.length > 0) {
          const ids: string[] = [];
          const mitigations: Record<string, string> = {};

          operations.operational_risks.forEach((r: any) => {
            if (r.id) {
              ids.push(r.id);
              if (r.mitigation_plan) mitigations[r.id] = r.mitigation_plan;
            }
          });

          setSelectedRiskIds(ids);
          setCustomMitigations(mitigations);
        } else {
          // Default prefill
          const initialMitigations: Record<string, string> = {};
          COMMON_OPERATIONAL_RISKS.forEach((r) => {
            initialMitigations[r.id] = r.mitigation;
          });
          setCustomMitigations(initialMitigations);
        }
      } else {
        setErrorMessage(!res.success ? res.error : 'Failed to load active project');
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleToggleRisk = (id: string) => {
    setSelectedRiskIds((prev) =>
      prev.includes(id) ? prev.filter((rId) => rId !== id) : [...prev, id]
    );
  };

  const handleMitigationChange = (id: string, text: string) => {
    setCustomMitigations((prev) => ({ ...prev, [id]: text }));
  };

  const handleSubmitRisks = async () => {
    if (!activeProject) return;
    if (selectedRiskIds.length === 0) {
      setErrorMessage('Please acknowledge at least one operational risk and its backup plan.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const mappedRisks = COMMON_OPERATIONAL_RISKS
      .filter((r) => selectedRiskIds.includes(r.id))
      .map((r) => ({
        id: r.id,
        risk_title: r.title,
        description: r.description,
        mitigation_plan: customMitigations[r.id] || r.mitigation
      }));

    const solutionDesign = (activeProject.solution_design as any) || {};
    const existingOps = solutionDesign.operations || {};

    const operationsPayload = {
      ...existingOps,
      operational_risks: mappedRisks
    };

    // 1. Save to project
    const updateRes = await updateProjectOperationsAction(activeProject.id, operationsPayload);

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to save operational risks');
      setIsSubmitting(false);
      return;
    }

    // 2. Complete Task
    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        operational_risks: mappedRisks
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

  if (isLoading) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        <p className="text-xs text-muted-foreground font-medium">Loading operational risks...</p>
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

      {/* READ-ONLY COMPLETED VIEW */}
      {!isEditing ? (
        <div className="w-full space-y-4 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Operational Risks & Backups Locked ({selectedRiskIds.length})
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Risks
            </Button>
          </div>

          <div className="space-y-2">
            {COMMON_OPERATIONAL_RISKS.filter((r) => selectedRiskIds.includes(r.id)).map((r) => (
              <div key={r.id} className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1 text-xs">
                <span className="font-bold text-foreground block">{r.title}</span>
                <p className="text-[11px] text-muted-foreground">{r.description}</p>
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">
                  <strong>Backup Plan:</strong> {customMitigations[r.id] || r.mitigation}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* EDITABLE FORM VIEW */
        <div className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Spot Execution Single Points of Failure
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Select the operational bottlenecks that could delay your launch and define your backup plan.
            </p>
          </div>

          <div className="space-y-3">
            {COMMON_OPERATIONAL_RISKS.map((risk) => {
              const isChecked = selectedRiskIds.includes(risk.id);
              return (
                <div
                  key={risk.id}
                  className={`p-4 rounded-xl border transition-all space-y-2 text-xs ${
                    isChecked
                      ? 'bg-amber-500/10 border-amber-500/40'
                      : 'bg-background border-border opacity-75'
                  }`}
                >
                  <div className="flex items-start gap-3 cursor-pointer" onClick={() => handleToggleRisk(risk.id)}>
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleToggleRisk(risk.id)}
                      className="mt-0.5"
                    />
                    <div className="space-y-0.5">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        {risk.title}
                      </span>
                      <p className="text-[11px] text-muted-foreground">{risk.description}</p>
                    </div>
                  </div>

                  {isChecked && (
                    <div className="pt-2 space-y-1 border-t border-amber-500/20">
                      <Label className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">
                        Backup Mitigation Plan
                      </Label>
                      <Input
                        value={customMitigations[risk.id] ?? risk.mitigation}
                        onChange={(e) => handleMitigationChange(risk.id, e.target.value)}
                        className="text-xs h-8 bg-background"
                        placeholder="Define your backup plan..."
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* HELPFUL NUDGE */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-600 dark:text-amber-400 flex items-start gap-2">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Smart Pre-Mortem:</strong> The best founders don't assume nothing will break—they simply prepare backups so a supplier delay or platform glitch doesn't stop their launch.
            </span>
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
              onClick={handleSubmitRisks}
              disabled={isSubmitting || selectedRiskIds.length === 0}
              className="flex-1 h-10 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Complete Quest 4 & Open Viability Gate</span>
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
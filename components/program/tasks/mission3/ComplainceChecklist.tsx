// components/program/tasks/mission3/ComplianceForm.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Download,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Building2,
  Globe,
  FileText,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Database } from "@/types/supabase";
import { BaseTaskComponentProps } from '../types';
import { getActiveProjectAction, updateProjectSectionAction } from '@/actions/projects';
import { processTaskCompletion } from '@/lib/utils/taskExecution';

import {
  REVENUE_BUCKETS,
  EMPLOYEE_BUCKETS,
  REQUIREMENTS,
  URGENCY,
  GROUP_META,
  STATUS_OPTIONS,
  type ComplianceRequirement,
  type UserAnswers,
  type ItemStatus,
  type UrgencyType,
  type StatusType,
} from "@/lib/data/compliance";

type GroupedItems = Record<UrgencyType, (ComplianceRequirement & { urgency: UrgencyType; status: StatusType })[]>;
type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

function bucketIndexOf<T extends string>(list: readonly T[], value: string): number {
  const i = list.indexOf(value as T);
  return i === -1 ? 0 : i;
}

function computeUrgency(item: ComplianceRequirement, answers: UserAnswers): UrgencyType {
  const t = item.threshold;
  if (t.type === "always" || t.type === "time" || t.type === "free-instant" || t.type === "build-now") {
    return "do-now";
  }
  if (t.type === "optional") return "optional";
  if (t.type === "revenue") {
    const userIdx = bucketIndexOf(REVENUE_BUCKETS, answers.revenue);
    if (t.forceOnline && (answers.mode === "online" || answers.mode === "both")) return "do-now";
    if (userIdx >= (t.bucketIndex ?? 0)) return "do-now";
    if (userIdx === (t.bucketIndex ?? 0) - 1) return "watch";
    return "later";
  }
  if (t.type === "employees") {
    const userIdx = bucketIndexOf(EMPLOYEE_BUCKETS, answers.employees);
    if (userIdx >= (t.bucketIndex ?? 0)) return "do-now";
    if (userIdx === (t.bucketIndex ?? 0) - 1) return "watch";
    return "later";
  }
  return "later";
}

function isApplicable(item: ComplianceRequirement, answers: UserAnswers): boolean {
  if (item.modes && !item.modes.includes(answers.mode)) return false;
  if (item.structures && answers.structure !== "not-decided" && !item.structures.includes(answers.structure))
    return false;
  if (item.sectors && !item.sectors.includes(answers.sector)) return false;
  return true;
}

export function ComplianceForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [stage, setStage] = useState<"intake" | "dossier">("intake");
  
  const [answers, setAnswers] = useState<UserAnswers>({
    mode: "both",
    structure: "not-decided",
    sector: "general",
    state: "",
    employees: "0",
    revenue: "pre-revenue",
  });
  
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>({});
  
  const [expandedGroups, setExpandedGroups] = useState<Record<UrgencyType, boolean>>({
    "do-now": true,
    watch: false,
    later: false,
    optional: false,
  });
  
  const [activeId, setActiveId] = useState<string | null>(null);

  const isCompleted = existingProgress?.status === 'completed';

  // 1. Fetch active project and prefill saved compliance state
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const res = await getActiveProjectAction();
      if (res.success) {
        setActiveProject(res.data);
        const complianceData = (res.data.compliance_checklist as any) || {};
        
        if (complianceData.statuses) setStatuses(complianceData.statuses);
        if (complianceData.answers) setAnswers((prev) => ({ ...prev, ...complianceData.answers }));
        if (complianceData.stage) setStage(complianceData.stage);
        if (complianceData.activeId) setActiveId(complianceData.activeId);
      } else {
        setErrorMessage(res.error || 'Failed to load active project');
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  // 2. Save compliance state to user_projects
  const saveStateToProject = useCallback(async (data: { 
    answers: UserAnswers; 
    statuses: Record<string, ItemStatus>; 
    stage: "intake" | "dossier";
    activeId?: string | null;
  }) => {
    if (!activeProject) return;

    setIsSaving(true);
    await updateProjectSectionAction(activeProject.id, 'compliance_checklist', {
      answers: data.answers,
      statuses: data.statuses,
      stage: data.stage,
      activeId: data.activeId || null,
      updated_at: new Date().toISOString()
    });
    setIsSaving(false);
  }, [activeProject]);

  // Debounced auto-save when founder changes options/statuses
  useEffect(() => {
    if (!activeProject || isLoading) return;
    const timeout = setTimeout(() => {
      saveStateToProject({ answers, statuses, stage, activeId });
    }, 1500);
    return () => clearTimeout(timeout);
  }, [answers, statuses, stage, activeId, activeProject, isLoading, saveStateToProject]);

  // 3. Complete Task via standard taskExecution pipeline
  const handleMarkComplete = async () => {
    if (!activeProject) return;

    setIsCompleting(true);
    setErrorMessage(null);

    // Persist final project state
    await saveStateToProject({ answers, statuses, stage, activeId });

    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        answers,
        statuses,
        completed_at: new Date().toISOString()
      }
    });

    if (taskRes.success && onSuccess) {
      onSuccess();
    } else {
      setErrorMessage(taskRes.error || 'Failed to complete compliance task');
      setIsCompleting(false);
    }
  };

  const applicableItems = useMemo(
    () => REQUIREMENTS.filter((item) => isApplicable(item, answers)),
    [answers]
  );

  const withUrgency = useMemo(
    () =>
      applicableItems.map((item) => ({
        ...item,
        urgency: computeUrgency(item, answers),
        status: statuses[item.id]?.status || "not-started",
      })),
    [applicableItems, answers, statuses]
  );

  const grouped = useMemo(() => {
    const g: GroupedItems = { "do-now": [], watch: [], later: [], optional: [] };
    withUrgency.forEach((item) => g[item.urgency].push(item));
    return g;
  }, [withUrgency]);

  const doneCount = withUrgency.filter((i) => i.status === "done").length;
  const totalCount = withUrgency.length;
  const progressPct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  const setAnswer = <K extends keyof UserAnswers>(key: K, value: UserAnswers[K]) => {
    setAnswers((a) => ({ ...a, [key]: value }));
  };

  const setItemStatus = useCallback((id: string, status: StatusType) => {
    setStatuses((s) => ({ ...s, [id]: { ...(s[id] || {}), status } }));
  }, []);

  const setItemNotes = useCallback((id: string, notes: string) => {
    setStatuses((s) => ({ ...s, [id]: { ...(s[id] || {}), notes } }));
  }, []);

  const toggleGroup = (key: UrgencyType) => setExpandedGroups((g) => ({ ...g, [key]: !g[key] }));

  const activeItemData = withUrgency.find((i) => i.id === activeId) || null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin h-6 w-6 text-primary mr-2" />
        <span className="text-xs text-muted-foreground">Loading compliance dossier...</span>
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

      <header className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border border-primary/30 bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            🇮🇳
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-foreground">The Founder's Compliance Dossier</h2>
            <p className="text-xs text-muted-foreground">Registrations & filings tailored for {activeProject?.biz_name || 'your project'}</p>
          </div>
        </div>
        {stage === "dossier" && (
          <span className="text-[10px] font-mono text-muted-foreground">
            {isSaving ? "Saving..." : "Auto-saved"}
          </span>
        )}
      </header>

      {stage === "intake" ? (
        <IntakeForm answers={answers} setAnswer={setAnswer} onDone={() => setStage("dossier")} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          <aside className="border border-border rounded-xl p-4 bg-card/60 h-fit space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Dossier Progress</span>
                <span className="text-foreground">{doneCount}/{totalCount}</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              {Object.entries(grouped).map(([key, items]) => {
                if (items.length === 0) return null;
                const urgencyKey = key as UrgencyType;
                const meta = URGENCY[urgencyKey];
                return (
                  <div key={key} className="border-b border-border/50 pb-1 last:border-0">
                    <button
                      type="button"
                      className="flex items-center gap-2 w-full text-left py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
                      onClick={() => toggleGroup(urgencyKey)}
                    >
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: meta.color }} />
                      <span>{meta.label}</span>
                      <span className="ml-auto text-[10px] font-mono text-muted-foreground">{items.length}</span>
                      {expandedGroups[urgencyKey] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    {expandedGroups[urgencyKey] && (
                      <div className="space-y-0.5 mt-1 pl-3">
                        {items.map((item) => {
                          const isActive = activeId === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition flex items-center gap-2 cursor-pointer ${
                                isActive 
                                  ? 'bg-primary/10 text-primary font-bold' 
                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                              }`}
                              onClick={() => setActiveId(item.id)}
                            >
                              <span className="flex-shrink-0">
                                {item.status === "done" ? (
                                  <CheckCircle2 size={13} className="text-emerald-500" />
                                ) : (
                                  <Circle size={13} className="text-muted-foreground/40" />
                                )}
                              </span>
                              <span className="truncate flex-1">{item.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!isCompleted && (
              <div className="border-t pt-3">
                <Button
                  type="button"
                  onClick={handleMarkComplete}
                  disabled={isCompleting}
                  className="w-full h-9 text-xs font-bold uppercase tracking-wider cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isCompleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    `Complete Task (+${task.grant_points} XP)`
                  )}
                </Button>
              </div>
            )}
          </aside>

          <main>
            {!activeItemData ? (
              <EmptyState grouped={grouped} onPick={setActiveId} />
            ) : (
              <ItemDetail
                item={activeItemData}
                status={statuses[activeItemData.id]?.status || "not-started"}
                notes={statuses[activeItemData.id]?.notes || ""}
                onStatus={(s) => setItemStatus(activeItemData.id, s)}
                onNotes={(n) => setItemNotes(activeItemData.id, n)}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
}

/* ---------------- Sub-components ---------------- */

interface IntakeFormProps {
  answers: UserAnswers;
  setAnswer: <K extends keyof UserAnswers>(key: K, value: UserAnswers[K]) => void;
  onDone: () => void;
}

function IntakeForm({ answers, setAnswer, onDone }: IntakeFormProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      key: "mode" as const,
      question: "Where does your business operate?",
      helper: "This determines which local and digital regulations apply to your venture.",
      options: [
        { v: "online" as const, l: "Online only", icon: Globe, hint: "You operate through web, app, or digital platforms." },
        { v: "physical" as const, l: "Physical premises only", icon: Building2, hint: "You run a physical shop, office, or local space." },
        { v: "both" as const, l: "Both", icon: ArrowRight, hint: "A hybrid model combining local and online channels." },
      ],
    },
    {
      key: "structure" as const,
      question: "What legal structure are you using (or leaning toward)?",
      helper: "Pick 'Not decided yet' if you want to explore all options.",
      options: [
        { v: "proprietorship" as const, l: "Sole Proprietorship", hint: "Fastest to launch; personal liability." },
        { v: "partnership" as const, l: "Partnership", hint: "Two or more co-founders." },
        { v: "llp" as const, l: "LLP", hint: "Limited liability with flexible compliance." },
        { v: "pvt-ltd" as const, l: "Private Limited", hint: "Standard for equity funding and formal scale." },
        { v: "opc" as const, l: "One Person Company", hint: "Corporate structure built for solo founders." },
        { v: "not-decided" as const, l: "Not decided yet", hint: "General path showing all requirements." },
      ],
    },
    {
      key: "sector" as const,
      question: "Is there a sector-specific element to what you offer?",
      options: [
        { v: "general" as const, l: "General goods / services", hint: "SaaS, agency, consulting, digital products." },
        { v: "food" as const, l: "Food & beverage", hint: "Triggers food safety / FSSAI clearances." },
        { v: "import_export" as const, l: "Import / export", hint: "Cross-border payments and IEC requirements." },
        { v: "manufacturing" as const, l: "Manufacturing / production", hint: "Triggers premises & environmental clearances." },
      ],
    },
    {
      key: "employees" as const,
      question: "How many team members or employees do you have?",
      options: [
        { v: "0" as const, l: "Just me / co-founders", hint: "No payroll compliance needed yet." },
        { v: "1-9" as const, l: "1–9 employees", hint: "State labor registrations apply." },
        { v: "10-19" as const, l: "10–19 employees", hint: "Health insurance / ESIC thresholds." },
        { v: "20-plus" as const, l: "20+ employees", hint: "EPFO provident fund thresholds." },
      ],
    },
    {
      key: "revenue" as const,
      question: "What is your current or expected annual revenue bracket?",
      options: [
        { v: "pre-revenue" as const, l: "Pre-revenue", hint: "Focus on essential licenses." },
        { v: "under-20l" as const, l: "Under ₹20 lakh", hint: "Below standard service tax thresholds." },
        { v: "20-40l" as const, l: "₹20–40 lakh", hint: "Services GST threshold." },
        { v: "40l-1cr" as const, l: "₹40 lakh – ₹1 crore", hint: "Standard goods/services GST threshold." },
        { v: "1cr-plus" as const, l: "₹1 crore+", hint: "Full commercial tax compliance." },
      ],
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="max-w-xl mx-auto py-4 space-y-4">
      <div className="flex gap-2 justify-center mb-2">
        {steps.map((s, i) => (
          <div key={s.key} className={`h-1 w-10 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>
      
      <div className="border border-border rounded-xl p-5 bg-card space-y-4">
        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
          Step {step + 1} of {steps.length}
        </div>
        <h3 className="text-sm font-bold text-foreground">{current.question}</h3>
        {current.helper && <p className="text-xs text-muted-foreground">{current.helper}</p>}
        
        <div className="space-y-2">
          {current.options.map((opt) => (
            <button
              key={opt.v}
              type="button"
              className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                answers[current.key] === opt.v 
                  ? 'border-primary bg-primary/5 font-semibold text-foreground' 
                  : 'border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setAnswer(current.key, opt.v)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center ${
                  answers[current.key] === opt.v ? 'border-primary bg-primary text-white' : 'border-muted-foreground/30'
                }`}>
                  {answers[current.key] === opt.v && <span className="text-[8px]">✓</span>}
                </div>
                <div>
                  <div className="text-xs font-bold">{opt.l}</div>
                  {opt.hint && <div className="text-[11px] text-muted-foreground">{opt.hint}</div>}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-between pt-3 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="text-xs"
          >
            <ArrowLeft size={14} className="mr-1" /> Back
          </Button>
          {!isLast ? (
            <Button type="button" size="sm" onClick={() => setStep((s) => s + 1)} className="text-xs">
              Next <ArrowRight size={14} className="ml-1" />
            </Button>
          ) : (
            <Button type="button" size="sm" onClick={onDone} className="text-xs font-bold bg-primary text-primary-foreground">
              Generate My Dossier <ArrowRight size={14} className="ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ grouped, onPick }: { grouped: GroupedItems; onPick: (id: string) => void }) {
  const firstDoNow = grouped["do-now"][0];
  return (
    <div className="border border-border rounded-xl p-8 text-center bg-card/60 space-y-3">
      <h3 className="text-sm font-bold text-foreground">Select a Compliance Requirement</h3>
      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
        Your customized compliance checklist is ready. Select an item from the sidebar to review instructions or record filing notes.
      </p>
      {firstDoNow && (
        <Button 
          type="button"
          size="sm"
          className="text-xs font-bold"
          onClick={() => onPick(firstDoNow.id)}
        >
          Start with "{firstDoNow.title}" <ArrowRight size={14} className="ml-1.5" />
        </Button>
      )}
    </div>
  );
}

function ItemDetail({ item, status, notes, onStatus, onNotes }: {
  item: ComplianceRequirement & { urgency: UrgencyType; status: StatusType };
  status: StatusType;
  notes: string;
  onStatus: (status: StatusType) => void;
  onNotes: (notes: string) => void;
}) {
  const urgencyMeta = URGENCY[item.urgency];

  return (
    <div className="border border-border rounded-xl p-5 bg-card space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-muted-foreground block uppercase">{item.tagline}</span>
          <h3 className="text-base font-bold text-foreground">{item.title}</h3>
        </div>
        <div 
          className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 flex-shrink-0"
          style={{ color: urgencyMeta.color, background: urgencyMeta.bg }}
        >
          {item.urgency === "do-now" && <AlertTriangle size={12} />}
          {item.urgency === "watch" && <Clock size={12} />}
          {urgencyMeta.label}
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <strong className="text-foreground block text-[11px]">What it is:</strong>
          <p className="text-muted-foreground leading-relaxed">{item.what}</p>
        </div>

        <div>
          <strong className="text-foreground block text-[11px]">Why it matters:</strong>
          <p className="text-muted-foreground leading-relaxed">{item.why}</p>
        </div>

        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-0.5">
          <strong className="text-primary block text-[11px]">When to handle this:</strong>
          <p className="text-foreground font-medium">{item.threshold.label}</p>
        </div>

        <div>
          <strong className="text-foreground block text-[11px] mb-1">Official Portal:</strong>
          <a 
            className="inline-flex items-center gap-1 text-primary hover:underline font-mono text-[11px]"
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {item.linkLabel} <ExternalLink size={12} />
          </a>
        </div>

        <div className="space-y-1.5 pt-1">
          <strong className="text-foreground block text-[11px]">Filing Status:</strong>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
                  status === opt.id 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => onStatus(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1 pt-1">
          <strong className="text-foreground block text-[11px]">Filing Notes / Reference Numbers:</strong>
          <textarea
            className="w-full min-h-[55px] rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            placeholder="Record application ID, deadlines, or contact details..."
            value={notes}
            onChange={(e) => onNotes(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
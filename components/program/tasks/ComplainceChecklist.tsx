// components/program/tasks/ComplianceChecklist.tsx

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
  MapPin,
  FileText,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  REVENUE_BUCKETS,
  EMPLOYEE_BUCKETS,
  REQUIREMENTS,
  URGENCY,
  GROUP_META,
  STATUS_OPTIONS,
  STORAGE_KEY,
  type ComplianceRequirement,
  type UserAnswers,
  type ItemStatus,
  type UrgencyType,
  type StatusType,
  type GroupType,
  type ModeType,
  type StructureType,
  type SectorType,
  type RevenueBucket,
  type EmployeeBucket,
  type ExportPayload,
} from "@/lib/data/comliance";

type GroupedItems = Record<UrgencyType, (ComplianceRequirement & { urgency: UrgencyType; status: StatusType })[]>;

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

interface ComplianceChecklistProps {
  onSave?: (state: { answers: UserAnswers; statuses: Record<string, ItemStatus> }) => void;
  initialAnswers?: Partial<UserAnswers>;
}

export default function ComplianceChecklist({ onSave, initialAnswers }: ComplianceChecklistProps) {
  const [loaded, setLoaded] = useState(false);
  const [stage, setStage] = useState<"intake" | "dossier">("intake");
  const [answers, setAnswers] = useState<UserAnswers>({
    mode: "both",
    structure: "not-decided",
    sector: "general",
    state: "",
    employees: "0",
    revenue: "pre-revenue",
    ...initialAnswers,
  });
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>({});
  const [expandedGroups, setExpandedGroups] = useState<Record<UrgencyType, boolean>>({
    "do-now": true,
    watch: false,
    later: false,
    optional: false,
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saveFlash, setSaveFlash] = useState(false);

  // load persisted state
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    (async () => {
      try {
        const res = await window.localStorage.getItem(STORAGE_KEY);
        if (res) {
          const parsed = JSON.parse(res);
          if (parsed.answers) setAnswers(parsed.answers);
          if (parsed.statuses) setStatuses(parsed.statuses);
          if (parsed.stage) setStage(parsed.stage);
        }
      } catch (e) {
        // no saved state yet — fine
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // persist on change
  useEffect(() => {
    if (!loaded || typeof window === "undefined") return;
    const payload = JSON.stringify({ answers, statuses, stage });
    window.localStorage.setItem(STORAGE_KEY, payload);
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 900);
    
    if (onSave) {
      onSave({ answers, statuses });
    }
  }, [answers, statuses, stage, loaded, onSave]);

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

  const exportJSON = () => {
    const payload: ExportPayload = {
      exportedAt: new Date().toISOString(),
      answers,
      checklist: withUrgency.map((i) => ({
        id: i.id,
        title: i.title,
        group: i.group,
        urgency: i.urgency,
        status: statuses[i.id]?.status || "not-started",
        notes: statuses[i.id]?.notes || "",
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "business-dossier-export.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    setStage("intake");
    setStatuses({});
    setAnswers({
      mode: "both",
      structure: "not-decided",
      sector: "general",
      state: "",
      employees: "0",
      revenue: "pre-revenue",
    });
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const activeItem = withUrgency.find((i) => i.id === activeId) || null;

  return (
    <div className="w-full space-y-6">
      <header className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
            भा
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">The Founder's Dossier</h2>
            <p className="text-xs text-muted-foreground">Registrations & filings for starting up in India</p>
          </div>
        </div>
        {stage === "dossier" && (
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono text-muted-foreground transition-colors ${saveFlash ? 'text-primary' : ''}`}>
              {saveFlash ? "Saved" : "Autosaved"}
            </span>
            <Button variant="outline" size="sm" onClick={exportJSON} className="h-8 text-xs gap-1.5">
              <Download size={14} /> Export
            </Button>
            <Button variant="ghost" size="sm" onClick={resetAll} className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground">
              <RotateCcw size={14} /> Reset
            </Button>
          </div>
        )}
      </header>

      {stage === "intake" ? (
        <IntakeForm answers={answers} setAnswer={setAnswer} onDone={() => setStage("dossier")} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
          <aside className="border rounded-xl p-4 bg-muted/10 h-fit">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-muted-foreground">Progress</span>
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
                        className="flex items-center gap-2 w-full text-left py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
                        onClick={() => toggleGroup(urgencyKey)}
                      >
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: meta.color }} />
                        <span>{meta.label}</span>
                        <span className="ml-auto text-[10px] font-mono text-muted-foreground/60">{items.length}</span>
                        {expandedGroups[urgencyKey] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                      {expandedGroups[urgencyKey] && (
                        <div className="space-y-0.5 mt-1 pl-4">
                          {items.map((item) => {
                            const gm = GROUP_META[item.group];
                            const isActive = activeId === item.id;
                            return (
                              <button
                                key={item.id}
                                className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition flex items-center gap-2 ${
                                  isActive 
                                    ? 'bg-primary/10 text-primary font-medium' 
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
                                <span className="text-[9px] font-mono text-muted-foreground/40 flex-shrink-0">
                                  {gm.label[0]}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          <main>
            {!activeItem ? (
              <div className="border rounded-xl p-8 text-center">
                <div className="inline-block px-3 py-1 border-2 border-destructive/30 text-destructive text-xs font-bold uppercase tracking-wider rounded-md mb-4">
                  FILED
                </div>
                <h3 className="text-lg font-bold text-foreground">Pick up where you left off</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  Your dossier is sorted by what actually needs attention now versus what can wait. Start with what's urgent.
                </p>
                {grouped["do-now"][0] && (
                  <Button 
                    className="mt-4"
                    onClick={() => setActiveId(grouped["do-now"][0].id)}
                  >
                    Start with "{grouped["do-now"][0].title}" <ArrowRight size={15} className="ml-2" />
                  </Button>
                )}
              </div>
            ) : (
              <ItemDetail
                item={activeItem}
                status={statuses[activeItem.id]?.status || "not-started"}
                notes={statuses[activeItem.id]?.notes || ""}
                onStatus={(s) => setItemStatus(activeItem.id, s)}
                onNotes={(n) => setItemNotes(activeItem.id, n)}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
}

/* ---------------- Intake ---------------- */

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
      question: "Where does your business actually happen?",
      helper: "This decides which licenses even apply — an online seller and a shopkeeper face very different rules.",
      options: [
        { v: "online" as const, l: "Online only", icon: Globe, hint: "You sell or operate through a website, app, or marketplace — no physical premises." },
        { v: "physical" as const, l: "Physical premises only", icon: Building2, hint: "You run a shop, office, restaurant, or warehouse that people visit." },
        { v: "both" as const, l: "Both", icon: ArrowRight, hint: "A mix — e.g. a shop that also sells online." },
      ],
    },
    {
      key: "structure" as const,
      question: "What legal structure are you using — or leaning toward?",
      helper: "Don't overthink this — pick 'Not decided yet' and we'll show everything.",
      options: [
        { v: "proprietorship" as const, l: "Sole Proprietorship", hint: "Fastest to start, but you're personally liable for business debt." },
        { v: "partnership" as const, l: "Partnership", hint: "Two or more people, but partners are personally liable." },
        { v: "llp" as const, l: "LLP", hint: "Limited liability with lighter compliance. Common for professional services." },
        { v: "pvt-ltd" as const, l: "Private Limited", hint: "Best for raising investment. Most compliance-heavy." },
        { v: "opc" as const, l: "One Person Company", hint: "Like a Private Limited, but built for a single founder." },
        { v: "not-decided" as const, l: "Not decided yet", hint: "We'll show you the general path and flag dependencies." },
      ],
    },
    {
      key: "sector" as const,
      question: "Anything sector-specific about what you sell?",
      helper: "A handful of registrations only exist because of what you're selling.",
      options: [
        { v: "general" as const, l: "General goods / services", hint: "Retail, software, consulting, most D2C brands." },
        { v: "food" as const, l: "Food & beverage", hint: "Triggers mandatory FSSAI registration at any scale." },
        { v: "import_export" as const, l: "Import / export", hint: "Triggers IEC requirement before your first cross-border transaction." },
        { v: "manufacturing" as const, l: "Manufacturing / production", hint: "Triggers pollution-control and premises clearances." },
      ],
    },
    {
      key: "employees" as const,
      question: "How many people are on payroll right now?",
      helper: "A few labour-law registrations switch on at specific headcounts.",
      options: [
        { v: "0" as const, l: "Just me (or founders)", hint: "No employee-related registrations apply yet." },
        { v: "1-9" as const, l: "1–9", hint: "Professional Tax registration may apply from your first employee." },
        { v: "10-19" as const, l: "10–19", hint: "ESIC (employee health insurance) becomes mandatory in most states." },
        { v: "20-plus" as const, l: "20+", hint: "EPFO (Provident Fund) becomes mandatory at this scale." },
      ],
    },
    {
      key: "revenue" as const,
      question: "Roughly where's your annual revenue?",
      helper: "This mostly decides when GST registration becomes mandatory.",
      options: [
        { v: "pre-revenue" as const, l: "Pre-revenue", hint: "No tax-related registrations urgent yet — except GST if selling online." },
        { v: "under-20l" as const, l: "Under ₹20 lakh", hint: "Below GST threshold for services in most states." },
        { v: "20-40l" as const, l: "₹20–40 lakh", hint: "Above services GST threshold — 'start paying attention' zone." },
        { v: "40l-1cr" as const, l: "₹40 lakh – ₹1 crore", hint: "Above GST threshold for both goods and services." },
        { v: "1cr-plus" as const, l: "₹1 crore+", hint: "Well past GST thresholds — look at e-invoicing rules." },
      ],
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex gap-2 justify-center mb-6">
        {steps.map((s, i) => (
          <div key={s.key} className={`h-1 w-12 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>
      
      <div className="border rounded-xl p-6 bg-card">
        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
          Question {step + 1} of {steps.length}
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{current.question}</h3>
        {current.helper && <p className="text-sm text-muted-foreground mb-4">{current.helper}</p>}
        
        <div className="space-y-2">
          {current.options.map((opt) => (
            <button
              key={opt.v}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                answers[current.key] === opt.v 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-border-hover bg-card'
              }`}
              onClick={() => setAnswer(current.key, opt.v)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                  answers[current.key] === opt.v 
                    ? 'border-primary bg-primary' 
                    : 'border-muted-foreground/30'
                }`}>
                  {answers[current.key] === opt.v && (
                    <div className="w-full h-full flex items-center justify-center text-[8px] text-white">✓</div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{opt.l}</div>
                  {opt.hint && <div className="text-xs text-muted-foreground">{opt.hint}</div>}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-6 pt-4 border-t border-border">
          <Button
            variant="ghost"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="text-sm"
          >
            <ArrowLeft size={15} className="mr-2" /> Back
          </Button>
          {!isLast ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              Next <ArrowRight size={15} className="ml-2" />
            </Button>
          ) : (
            <Button onClick={onDone}>
              Build my dossier <ArrowRight size={15} className="ml-2" />
            </Button>
          )}
        </div>
      </div>
      
      <p className="text-center text-xs text-muted-foreground mt-4">
        Answer with your best guess — you can change any of this later, the checklist updates instantly.
      </p>
    </div>
  );
}

/* ---------------- Item detail ---------------- */

interface ItemDetailProps {
  item: ComplianceRequirement & { urgency: UrgencyType; status: StatusType };
  status: StatusType;
  notes: string;
  onStatus: (status: StatusType) => void;
  onNotes: (notes: string) => void;
}

function ItemDetail({ item, status, notes, onStatus, onNotes }: ItemDetailProps) {
  const urgencyMeta = URGENCY[item.urgency];
  const groupMeta = GROUP_META[item.group];
  const GroupIcon = groupMeta.icon;

  return (
    <div className="border rounded-xl p-6 bg-card relative">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <GroupIcon size={14} />
            <span>{groupMeta.label}</span>
            <span className="text-muted-foreground/30">·</span>
            <span>{item.tagline}</span>
          </div>
          <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
        </div>
        <div 
          className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 flex-shrink-0"
          style={{ color: urgencyMeta.color, background: urgencyMeta.bg }}
        >
          {item.urgency === "do-now" && <AlertTriangle size={13} />}
          {item.urgency === "watch" && <Clock size={13} />}
          {urgencyMeta.label}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">What it is</h4>
          <p className="text-sm text-foreground/90 leading-relaxed">{item.what}</p>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Why it matters</h4>
          <p className="text-sm text-foreground/90 leading-relaxed">{item.why}</p>
        </div>

        <div className="p-4 rounded-lg border-l-3 bg-muted/10 border-l-destructive/60">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">When to worry about this</h4>
          <div className="text-sm font-medium text-foreground">{item.threshold.label}</div>
          {item.note && <p className="text-xs text-muted-foreground mt-1">{item.note}</p>}
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Where to file</h4>
          <a 
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {item.linkLabel} <ExternalLink size={14} />
          </a>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Your status</h4>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  status === opt.id 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'border-border hover:border-border-hover text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => onStatus(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Notes to self</h4>
          <textarea
            className="w-full min-h-[60px] rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Deadline, contact, filing reference number..."
            value={notes}
            onChange={(e) => onNotes(e.target.value)}
          />
        </div>
      </div>

      {status === "done" && (
        <div className="absolute top-6 right-6 font-mono font-bold text-2xl text-destructive/40 border-2 border-destructive/40 px-4 py-1 rounded rotate-[-6deg] pointer-events-none select-none">
          FILED
        </div>
      )}
    </div>
  );
}
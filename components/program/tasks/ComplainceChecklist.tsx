// components/program/tasks/ComplainceChecklist.tsx ( just a feature test not integrated with project yet)

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

/* ============================================================
   DATA — this whole block is the "JSON file". Every field a
   step needs (copy, links, thresholds, applicability rules)
   lives here so the UI below never hardcodes business logic.
   Lift this const straight into a .json file if you move the
   rules to a backend later.
   ============================================================ */

const REVENUE_BUCKETS = ["pre-revenue", "under-20l", "20-40l", "40l-1cr", "1cr-plus"];
const EMPLOYEE_BUCKETS = ["0", "1-9", "10-19", "20-plus"];

const REQUIREMENTS = [
  {
    id: "incorporation",
    group: "national",
    title: "Register your legal entity",
    tagline: "Companies Act, 2013 / LLP Act, 2008",
    what: "Formally register as a Private Limited Company, OPC, LLP, or Partnership with the Ministry of Corporate Affairs, filed through the single SPICe+ form.",
    why: "Creates a legal identity separate from you personally, gives limited liability, and is usually a prerequisite for a business bank account, GST registration, and raising investment.",
    threshold: { type: "always", label: "Before you operate as anything other than a sole proprietor" },
    note: "If you're staying a sole proprietor for now, you can skip this — but revisit it the moment you take on a co-founder or investor.",
    link: "https://www.mca.gov.in",
    linkLabel: "MCA / SPICe+ portal",
    modes: ["online", "physical", "both"],
    structures: ["pvt-ltd", "opc", "llp", "partnership"],
    sectors: null,
  },
  {
    id: "pan-tan",
    group: "national",
    title: "PAN & TAN",
    tagline: "Income Tax Department",
    what: "Your Permanent Account Number and Tax Deduction Account Number — the two IDs every invoice, bank account, and tax filing runs through.",
    why: "Nothing financial moves without this. No PAN, no bank account, no GST, no salary payments.",
    threshold: { type: "always", label: "Day one — usually auto-issued alongside incorporation" },
    link: "https://www.incometax.gov.in",
    linkLabel: "Income Tax e-filing portal",
    modes: ["online", "physical", "both"],
    structures: ["pvt-ltd", "opc", "llp", "partnership", "proprietorship"],
    sectors: null,
  },
  {
    id: "udyam",
    group: "national",
    title: "MSME (Udyam) Registration",
    tagline: "Ministry of MSME",
    what: "A free, instant, self-declared registration classifying your business as a micro, small, or medium enterprise.",
    why: "Unlocks collateral-free loans, priority lending, and a legal 45-day payment-protection rule against buyers who pay late. Costs nothing, takes minutes.",
    threshold: { type: "free-instant", label: "Do this in week one — there's no reason to wait" },
    link: "https://udyamregistration.gov.in",
    linkLabel: "Udyam Registration portal",
    modes: ["online", "physical", "both"],
    structures: ["pvt-ltd", "opc", "llp", "partnership", "proprietorship"],
    sectors: null,
  },
  {
    id: "gst",
    group: "national",
    title: "GST Registration",
    tagline: "CGST Act, 2017",
    what: "Registration under the Goods and Services Tax regime, giving you a GSTIN to invoice, collect, and remit tax.",
    why: "Mandatory once you cross the turnover threshold. If you sell through any online marketplace (Amazon, Flipkart, Meesho) or your own storefront, it's mandatory from your very first sale, regardless of revenue.",
    threshold: {
      type: "revenue",
      bucketIndex: 2,
      label: "₹40 lakh turnover for goods / ₹20 lakh for services — but Day 1 if you sell online",
      forceOnline: true,
    },
    link: "https://www.gst.gov.in",
    linkLabel: "GST portal",
    modes: ["online", "physical", "both"],
    structures: ["pvt-ltd", "opc", "llp", "partnership", "proprietorship"],
    sectors: null,
  },
  {
    id: "shop-establishment",
    group: "state",
    title: "Shops & Establishment Act Registration",
    tagline: "State Labour Department (name varies by state)",
    what: "Registers your place of work — including a home-based online business — under your state's labour law. Called the Gumasta License in Maharashtra, Trade License in some states.",
    why: "Covers working hours, leave, and basic employee protections. It's also frequently asked for when opening a current account or applying for other licenses.",
    threshold: { type: "time", label: "Within 30 days of starting operations" },
    note: "Applies even if you work alone from home and sell only online — 'establishment' is defined broadly.",
    link: "https://labour.gov.in",
    linkLabel: "Search '[your state] Shops and Establishment Act portal'",
    modes: ["online", "physical", "both"],
    structures: ["pvt-ltd", "opc", "llp", "partnership", "proprietorship"],
    sectors: null,
  },
  {
    id: "trade-license",
    group: "municipal",
    title: "Municipal Trade License",
    tagline: "Your city's Municipal Corporation",
    what: "Local permission to run a specific trade at a specific physical address, separate from the Shop & Establishment registration.",
    why: "Required for physical premises — shops, restaurants, offices, warehouses. Municipal inspectors check for this before anything else.",
    threshold: { type: "time", label: "Within 30 days of opening physical premises" },
    link: "https://www.google.com/search?q=municipal+corporation+trade+license",
    linkLabel: "Search your city's Municipal Corporation site",
    modes: ["physical", "both"],
    structures: ["pvt-ltd", "opc", "llp", "partnership", "proprietorship"],
    sectors: null,
  },
  {
    id: "fssai",
    group: "national",
    title: "FSSAI Registration / License",
    tagline: "Food Safety and Standards Authority of India",
    what: "Registration or license for anyone manufacturing, packaging, selling, or even home-cooking food for sale — online or offline.",
    why: "Non-negotiable if food is involved at any scale, from a home baker on Instagram to a full kitchen.",
    threshold: { type: "always", label: "Before your first sale, at any scale", sectorGate: true },
    link: "https://www.fssai.gov.in",
    linkLabel: "FSSAI portal",
    modes: ["online", "physical", "both"],
    structures: ["pvt-ltd", "opc", "llp", "partnership", "proprietorship"],
    sectors: ["food"],
  },
  {
    id: "iec",
    group: "national",
    title: "Import Export Code (IEC)",
    tagline: "Directorate General of Foreign Trade",
    what: "A code required to import or export goods or services across Indian borders.",
    why: "Without it, customs won't clear your shipments and banks won't process your foreign trade payments.",
    threshold: { type: "always", label: "Before your first cross-border shipment or payment", sectorGate: true },
    link: "https://www.dgft.gov.in",
    linkLabel: "DGFT portal",
    modes: ["online", "physical", "both"],
    structures: ["pvt-ltd", "opc", "llp", "partnership", "proprietorship"],
    sectors: ["import_export"],
  },
  {
    id: "trademark",
    group: "national",
    title: "Trademark Registration",
    tagline: "Controller General of Patents, Designs & Trademarks",
    what: "Legal protection for your business name, logo, or tagline.",
    why: "Not legally required to operate, but the risk compounds with every day you wait — someone else can register your name first.",
    threshold: { type: "optional", label: "No hard deadline — but earlier is strictly better than later" },
    link: "https://ipindia.gov.in",
    linkLabel: "IP India portal",
    modes: ["online", "physical", "both"],
    structures: ["pvt-ltd", "opc", "llp", "partnership", "proprietorship"],
    sectors: null,
  },
  {
    id: "startup-india",
    group: "national",
    title: "Startup India / DPIIT Recognition",
    tagline: "Dept. for Promotion of Industry and Internal Trade",
    what: "Government recognition for genuinely innovative, scalable businesses — separate from and additional to MSME registration.",
    why: "Unlocks a 3-year tax holiday for a qualifying subset, patent fee rebates, and easier public procurement. Not available to sole proprietors.",
    threshold: { type: "optional", label: "Whenever you're ready to claim the benefits — no urgency" },
    link: "https://www.startupindia.gov.in",
    linkLabel: "Startup India portal",
    modes: ["online", "physical", "both"],
    structures: ["pvt-ltd", "opc", "llp", "partnership"],
    sectors: null,
  },
  {
    id: "professional-tax",
    group: "state",
    title: "Professional Tax Registration",
    tagline: "State-level, varies by state",
    what: "A small state tax on employers and salaried employees, mandatory in several states including Maharashtra, Karnataka, and West Bengal.",
    why: "Skipping this once you have staff in an applicable state means penalties that stack up silently in the background.",
    threshold: { type: "employees", bucketIndex: 1, label: "From your first employee, in states where it applies" },
    link: "https://www.google.com/search?q=professional+tax+registration+state+labour+department",
    linkLabel: "Search '[your state] Professional Tax registration'",
    modes: ["online", "physical", "both"],
    structures: ["pvt-ltd", "opc", "llp", "partnership", "proprietorship"],
    sectors: null,
  },
  {
    id: "epfo",
    group: "national",
    title: "EPFO (Provident Fund)",
    tagline: "Employees' Provident Fund Organisation",
    what: "Mandatory retirement-savings contributions withheld and matched for employees.",
    why: "Kicks in once headcount crosses the threshold — worth planning for before you're scrambling mid-payroll-run.",
    threshold: { type: "employees", bucketIndex: 3, label: "Once you cross ~20 employees" },
    link: "https://www.epfindia.gov.in",
    linkLabel: "EPFO portal",
    modes: ["online", "physical", "both"],
    structures: ["pvt-ltd", "opc", "llp", "partnership", "proprietorship"],
    sectors: null,
  },
  {
    id: "esic",
    group: "national",
    title: "ESIC (Employee State Insurance)",
    tagline: "Employee State Insurance Corporation",
    what: "Health and disability insurance scheme funded jointly by employer and employee contributions.",
    why: "Mandatory in most states at a lower headcount than EPFO — easy to miss if you're only tracking the PF threshold.",
    threshold: { type: "employees", bucketIndex: 2, label: "Once you cross ~10 employees, in most states" },
    link: "https://www.esic.gov.in",
    linkLabel: "ESIC portal",
    modes: ["online", "physical", "both"],
    structures: ["pvt-ltd", "opc", "llp", "partnership", "proprietorship"],
    sectors: null,
  },
  {
    id: "dpdp",
    group: "national",
    title: "DPDP Act — Data Protection Compliance",
    tagline: "Digital Personal Data Protection Act, 2023",
    what: "India's personal data law — governs consent, storage, and breach reporting for any digital personal data you collect.",
    why: "Applies the moment you collect names, phone numbers, or emails online. Full enforcement phases in through 2026–2027, but the habits (clear consent, no pre-ticked boxes, a real privacy policy) are worth building now, before it's a fire drill.",
    threshold: { type: "build-now", label: "Start building good habits immediately; formal enforcement lands ~2027" },
    link: "https://www.meity.gov.in",
    linkLabel: "MeitY — DPDP Act resources",
    modes: ["online", "both"],
    structures: ["pvt-ltd", "opc", "llp", "partnership", "proprietorship"],
    sectors: null,
  },
  {
    id: "consumer-protection-ecommerce",
    group: "national",
    title: "Consumer Protection (E-Commerce) Rules",
    tagline: "Consumer Protection Act, 2019 — E-Commerce Rules 2020",
    what: "Disclosure and grievance-redressal rules for anyone selling to consumers online: seller details, return policy, and a named grievance officer.",
    why: "Required the moment you take your first online order, not just at scale.",
    threshold: { type: "always", label: "Before your first online sale to a consumer" },
    link: "https://consumeraffairs.nic.in",
    linkLabel: "Dept. of Consumer Affairs",
    modes: ["online", "both"],
    structures: ["pvt-ltd", "opc", "llp", "partnership", "proprietorship"],
    sectors: null,
  },
  {
    id: "pollution-control",
    group: "state",
    title: "Pollution Control Board Consent",
    tagline: "State Pollution Control Board",
    what: "'Consent to Establish' and 'Consent to Operate' clearances for premises with effluents or emissions — common in manufacturing and food production.",
    why: "Required before you can legally run machinery or production lines, not after you've already started.",
    threshold: { type: "always", label: "Before commissioning any manufacturing or production line", sectorGate: true },
    link: "https://www.google.com/search?q=state+pollution+control+board+consent",
    linkLabel: "Search '[your state] Pollution Control Board'",
    modes: ["physical", "both"],
    structures: ["pvt-ltd", "opc", "llp", "partnership", "proprietorship"],
    sectors: ["manufacturing"],
  },
  {
    id: "fire-noc",
    group: "municipal",
    title: "Fire Safety NOC",
    tagline: "Local Fire Department",
    what: "A no-objection certificate confirming your premises meet fire-safety codes.",
    why: "Threshold depends on occupancy and floor area set by your local fire code — worth a quick check even for modest spaces.",
    threshold: { type: "always", label: "Check your local occupancy/area limit before opening physical premises" },
    link: "https://www.google.com/search?q=fire+department+noc+commercial+premises",
    linkLabel: "Search your local Fire Department NOC process",
    modes: ["physical", "both"],
    structures: ["pvt-ltd", "opc", "llp", "partnership", "proprietorship"],
    sectors: null,
  },
  {
    id: "annual-filings",
    group: "national",
    title: "Annual ROC & Tax Filings",
    tagline: "Companies Act, 2013 / Income Tax Act",
    what: "Yearly obligations once incorporated: AOC-4, MGT-7 with the Registrar of Companies, an Annual General Meeting, and your income tax return.",
    why: "Missing these isn't a warning-letter problem — penalties accrue and directors can be disqualified.",
    threshold: { type: "always", label: "Every year, from your first financial year onward" },
    link: "https://www.mca.gov.in",
    linkLabel: "MCA — annual filing forms",
    modes: ["online", "physical", "both"],
    structures: ["pvt-ltd", "opc", "llp"],
    sectors: null,
  },
];

const URGENCY = {
  "do-now": { label: "Handle now", color: "#A63B2E", bg: "#F6E6E1" },
  watch: { label: "Coming up soon", color: "#B4791F", bg: "#F5EAD3" },
  later: { label: "Not yet", color: "#5F7259", bg: "#E7EBDF" },
  optional: { label: "Whenever you're ready", color: "#3B5A78", bg: "#E2EAF0" },
};

function bucketIndexOf(list, value) {
  const i = list.indexOf(value);
  return i === -1 ? 0 : i;
}

function computeUrgency(item, answers) {
  const t = item.threshold;
  if (t.type === "always" || t.type === "time" || t.type === "free-instant" || t.type === "build-now") {
    return "do-now";
  }
  if (t.type === "optional") return "optional";
  if (t.type === "revenue") {
    const userIdx = bucketIndexOf(REVENUE_BUCKETS, answers.revenue);
    if (t.forceOnline && (answers.mode === "online" || answers.mode === "both")) return "do-now";
    if (userIdx >= t.bucketIndex) return "do-now";
    if (userIdx === t.bucketIndex - 1) return "watch";
    return "later";
  }
  if (t.type === "employees") {
    const userIdx = bucketIndexOf(EMPLOYEE_BUCKETS, answers.employees);
    if (userIdx >= t.bucketIndex) return "do-now";
    if (userIdx === t.bucketIndex - 1) return "watch";
    return "later";
  }
  return "later";
}

function isApplicable(item, answers) {
  if (item.modes && !item.modes.includes(answers.mode)) return false;
  if (item.structures && answers.structure !== "not-decided" && !item.structures.includes(answers.structure))
    return false;
  if (item.sectors && !item.sectors.includes(answers.sector)) return false;
  return true;
}

const GROUP_META = {
  national: { label: "National", icon: FileText, color: "#2F4A3B" },
  state: { label: "State", icon: MapPin, color: "#3B5A78" },
  municipal: { label: "Municipal", icon: Building2, color: "#7A4A2E" },
};

const STORAGE_KEY = "india-dossier-v1";

const STATUS_OPTIONS = [
  { id: "not-started", label: "Not started" },
  { id: "in-progress", label: "In progress" },
  { id: "done", label: "Filed" },
  { id: "not-applicable", label: "Doesn't apply" },
];

/* ============================================================ */

export default function IndiaBusinessDossier() {
  const [loaded, setLoaded] = useState(false);
  const [stage, setStage] = useState("intake"); // intake | dossier
  const [answers, setAnswers] = useState({
    mode: "both",
    structure: "not-decided",
    sector: "general",
    state: "",
    employees: "0",
    revenue: "pre-revenue",
  });
  const [statuses, setStatuses] = useState({}); // id -> {status, notes}
  const [expandedGroups, setExpandedGroups] = useState({ "do-now": true, watch: false, later: false, optional: false });
  const [activeId, setActiveId] = useState(null);
  const [saveFlash, setSaveFlash] = useState(false);

  // load font
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // load persisted state
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY, false);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
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
    if (!loaded) return;
    const payload = JSON.stringify({ answers, statuses, stage });
    window.storage
      .set(STORAGE_KEY, payload, false)
      .then(() => {
        setSaveFlash(true);
        setTimeout(() => setSaveFlash(false), 900);
      })
      .catch(() => {});
  }, [answers, statuses, stage, loaded]);

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
    const g = { "do-now": [], watch: [], later: [], optional: [] };
    withUrgency.forEach((item) => g[item.urgency].push(item));
    return g;
  }, [withUrgency]);

  const doneCount = withUrgency.filter((i) => i.status === "done").length;
  const totalCount = withUrgency.length;
  const progressPct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  const setAnswer = (key, value) => setAnswers((a) => ({ ...a, [key]: value }));

  const setItemStatus = useCallback((id, status) => {
    setStatuses((s) => ({ ...s, [id]: { ...(s[id] || {}), status } }));
  }, []);

  const setItemNotes = useCallback((id, notes) => {
    setStatuses((s) => ({ ...s, [id]: { ...(s[id] || {}), notes } }));
  }, []);

  const toggleGroup = (key) => setExpandedGroups((g) => ({ ...g, [key]: !g[key] }));

  const exportJSON = () => {
    const payload = {
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

  const resetAll = async () => {
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
    try {
      await window.storage.delete(STORAGE_KEY, false);
    } catch (e) {}
  };

  const activeItem = withUrgency.find((i) => i.id === activeId) || null;

  return (
    <div className="dossier-root">
      <style>{CSS}</style>

      <header className="masthead">
        <div className="masthead-left">
          <div className="seal">भा</div>
          <div>
            <div className="masthead-title">The Founder's Dossier</div>
            <div className="masthead-sub">Registrations &amp; filings for starting up in India</div>
          </div>
        </div>
        {stage === "dossier" && (
          <div className="masthead-right">
            <div className={`save-indicator ${saveFlash ? "flash" : ""}`}>
              {saveFlash ? "Saved" : "Autosaved"}
            </div>
            <button className="ghost-btn" onClick={exportJSON}>
              <Download size={15} /> Export JSON
            </button>
            <button className="ghost-btn" onClick={resetAll}>
              <RotateCcw size={15} /> Start over
            </button>
          </div>
        )}
      </header>

      {stage === "intake" ? (
        <IntakeForm answers={answers} setAnswer={setAnswer} onDone={() => setStage("dossier")} />
      ) : (
        <div className="dossier-body">
          <aside className="tab-rail">
            <div className="progress-block">
              <div className="progress-label">
                <span>{doneCount}</span> of <span>{totalCount}</span> filed
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            {Object.entries(grouped).map(([key, items]) => {
              if (items.length === 0) return null;
              const meta = URGENCY[key];
              return (
                <div className="tab-group" key={key}>
                  <button className="tab-group-header" onClick={() => toggleGroup(key)}>
                    {expandedGroups[key] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <span className="tab-dot" style={{ background: meta.color }} />
                    <span>{meta.label}</span>
                    <span className="tab-count">{items.length}</span>
                  </button>
                  {expandedGroups[key] && (
                    <div className="tab-list">
                      {items.map((item) => {
                        const gm = GROUP_META[item.group];
                        return (
                          <button
                            key={item.id}
                            className={`tab-item ${activeId === item.id ? "active" : ""}`}
                            onClick={() => setActiveId(item.id)}
                          >
                            <span className="tab-item-status">
                              {item.status === "done" ? (
                                <CheckCircle2 size={14} color="#A63B2E" />
                              ) : (
                                <Circle size={14} color="#B9AF97" />
                              )}
                            </span>
                            <span className="tab-item-title">{item.title}</span>
                            <span className="tab-item-badge" style={{ color: gm.color }}>
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
          </aside>

          <main className="detail-pane">
            {!activeItem ? (
              <EmptyState grouped={grouped} onPick={setActiveId} />
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

function IntakeForm({ answers, setAnswer, onDone }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      key: "mode",
      question: "Where does your business actually happen?",
      helper: "This decides which licenses even apply — an online seller and a shopkeeper face very different rules.",
      options: [
        {
          v: "online",
          l: "Online only",
          icon: Globe,
          hint: "You sell or operate through a website, app, or marketplace — no shop, office, or warehouse that customers walk into.",
        },
        {
          v: "physical",
          l: "Physical premises only",
          icon: Building2,
          hint: "You run a shop, office, restaurant, or warehouse that people visit — little to no online selling.",
        },
        {
          v: "both",
          l: "Both",
          icon: ArrowRight,
          hint: "A mix — e.g. a shop that also sells online, or an online brand with a warehouse or studio.",
        },
      ],
    },
    {
      key: "structure",
      question: "What legal structure are you using — or leaning toward?",
      helper: "Don't overthink this if you're not sure — pick 'Not decided yet' and we'll show everything.",
      options: [
        {
          v: "proprietorship",
          l: "Sole Proprietorship",
          hint: "Just you, trading under your own PAN. Fastest and cheapest to start, but you're personally liable for any business debt — there's no legal separation between you and the business.",
        },
        {
          v: "partnership",
          l: "Partnership",
          hint: "Two or more people running the business together under a partnership deed. Simple to set up, but like a proprietorship, partners are personally liable — no limited liability protection.",
        },
        {
          v: "llp",
          l: "LLP",
          hint: "Limited Liability Partnership. Partners get limited liability (personal assets are protected) with lighter compliance than a company. Common for consulting firms, agencies, and professional services.",
        },
        {
          v: "pvt-ltd",
          l: "Private Limited",
          hint: "The standard choice if you plan to raise investment or hire a team. Full limited liability, but the most compliance-heavy option — annual filings, audits, board meetings.",
        },
        {
          v: "opc",
          l: "One Person Company",
          hint: "Like a Private Limited, but built for a single founder — no co-founder required. Gives you limited liability while you're still solo.",
        },
        {
          v: "not-decided",
          l: "Not decided yet",
          hint: "Totally fine — we'll show you the general path and flag anything that depends on this choice, so you can decide later without missing anything urgent.",
        },
      ],
    },
    {
      key: "sector",
      question: "Anything sector-specific about what you sell?",
      helper: "A handful of registrations only exist because of what you're selling, not how big you are.",
      options: [
        {
          v: "general",
          l: "General goods / services",
          hint: "Retail, software, consulting, agencies, most D2C brands — anything without food, cross-border trade, or a factory floor involved.",
        },
        {
          v: "food",
          l: "Food & beverage",
          hint: "Any food or drink business — even a home baker posting on Instagram. This triggers a mandatory FSSAI registration at any scale, no revenue threshold.",
        },
        {
          v: "import_export",
          l: "Import / export",
          hint: "You buy from or sell to people outside India, physical goods or services. This triggers a customs code (IEC) requirement before your first cross-border transaction.",
        },
        {
          v: "manufacturing",
          l: "Manufacturing / production",
          hint: "You physically produce or process goods — a workshop, factory, or production kitchen. This triggers pollution-control and premises-related clearances.",
        },
      ],
    },
    {
      key: "employees",
      question: "How many people are on payroll right now?",
      helper: "A few labour-law registrations switch on at specific headcounts — good to know before you're mid hiring spree.",
      options: [
        {
          v: "0",
          l: "Just me (or founders)",
          hint: "No one on payroll yet. Most employee-related registrations (PF, ESI, professional tax) don't apply to you yet.",
        },
        {
          v: "1-9",
          l: "1–9",
          hint: "Small team. In several states, Professional Tax registration already applies from your very first employee.",
        },
        {
          v: "10-19",
          l: "10–19",
          hint: "This is roughly where ESIC (employee health insurance) becomes mandatory in most states — worth checking now rather than after you cross it.",
        },
        {
          v: "20-plus",
          l: "20+",
          hint: "This is roughly where EPFO (Provident Fund contributions) becomes mandatory — a bigger payroll change, so plan for it ahead of time.",
        },
      ],
    },
    {
      key: "revenue",
      question: "Roughly where's your annual revenue?",
      helper: "This mostly decides when GST registration becomes mandatory — unless you sell online, where it's often day one regardless.",
      options: [
        {
          v: "pre-revenue",
          l: "Pre-revenue",
          hint: "Haven't made a sale yet, or still testing the idea. Almost nothing tax-related is urgent yet — except GST if you're already listing on an online marketplace.",
        },
        {
          v: "under-20l",
          l: "Under ₹20 lakh",
          hint: "Below the GST threshold for services in most states. If you only sell services offline, you likely don't need GST yet.",
        },
        {
          v: "20-40l",
          l: "₹20–40 lakh",
          hint: "You're now above the services GST threshold in most states, and getting close to the goods threshold — this is the 'start paying attention' zone.",
        },
        {
          v: "40l-1cr",
          l: "₹40 lakh – ₹1 crore",
          hint: "You're above the GST threshold for both goods and services — registration is mandatory now if you haven't already done it.",
        },
        {
          v: "1cr-plus",
          l: "₹1 crore+",
          hint: "Well past GST thresholds. At this scale you'll also want to look at e-invoicing rules and more frequent compliance deadlines.",
        },
      ],
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="intake">
      <div className="intake-progress">
        {steps.map((s, i) => (
          <div key={s.key} className={`intake-dot ${i <= step ? "filled" : ""}`} />
        ))}
      </div>
      <div className="intake-card">
        <div className="intake-eyebrow">Question {step + 1} of {steps.length}</div>
        <h2 className="intake-question">{current.question}</h2>
        {current.helper && <p className="intake-helper">{current.helper}</p>}
        <div className="intake-options">
          {current.options.map((opt) => (
            <button
              key={opt.v}
              className={`intake-option ${answers[current.key] === opt.v ? "selected" : ""}`}
              onClick={() => setAnswer(current.key, opt.v)}
            >
              <span className="intake-option-label">{opt.l}</span>
              {opt.hint && <span className="intake-option-hint">{opt.hint}</span>}
            </button>
          ))}
        </div>
        <div className="intake-nav">
          <button
            className="ghost-btn"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            <ArrowLeft size={15} /> Back
          </button>
          {!isLast ? (
            <button className="primary-btn" onClick={() => setStep((s) => s + 1)}>
              Next <ArrowRight size={15} />
            </button>
          ) : (
            <button className="primary-btn" onClick={onDone}>
              Build my dossier <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
      <p className="intake-footnote">
        Answer with your best guess — you can change any of this later, the checklist updates instantly.
      </p>
    </div>
  );
}

/* ---------------- Empty state ---------------- */

function EmptyState({ grouped, onPick }) {
  const firstDoNow = grouped["do-now"][0];
  return (
    <div className="empty-state">
      <div className="stamp-mark">FILED</div>
      <h2>Pick up where you left off</h2>
      <p>
        Your dossier is sorted by what actually needs attention now versus what can wait. Start with what's
        urgent — everything else will keep.
      </p>
      {firstDoNow && (
        <button className="primary-btn" onClick={() => onPick(firstDoNow.id)}>
          Start with "{firstDoNow.title}" <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}

/* ---------------- Item detail ---------------- */

function ItemDetail({ item, status, notes, onStatus, onNotes }) {
  const urgencyMeta = URGENCY[item.urgency];
  const groupMeta = GROUP_META[item.group];
  const GroupIcon = groupMeta.icon;

  return (
    <div className="item-detail" key={item.id}>
      <div className="item-header">
        <div className="item-eyebrow">
          <GroupIcon size={13} />
          <span>{groupMeta.label}</span>
          <span className="dot-sep">·</span>
          <span>{item.tagline}</span>
        </div>
        <h1 className="item-title">{item.title}</h1>
        <div className="urgency-chip" style={{ color: urgencyMeta.color, background: urgencyMeta.bg }}>
          {item.urgency === "do-now" && <AlertTriangle size={13} />}
          {item.urgency === "watch" && <Clock size={13} />}
          {urgencyMeta.label}
        </div>
      </div>

      <section className="item-section">
        <div className="section-label">What it is</div>
        <p>{item.what}</p>
      </section>

      <section className="item-section">
        <div className="section-label">Why it matters</div>
        <p>{item.why}</p>
      </section>

      <section className="item-section threshold-box">
        <div className="section-label">When to actually worry about this</div>
        <div className="threshold-value">{item.threshold.label}</div>
        {item.note && <p className="threshold-note">{item.note}</p>}
      </section>

      <section className="item-section">
        <div className="section-label">Where to file</div>
        <a className="link-btn" href={item.link} target="_blank" rel="noopener noreferrer">
          {item.linkLabel} <ExternalLink size={13} />
        </a>
      </section>

      <section className="item-section">
        <div className="section-label">Your status</div>
        <div className="status-row">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              className={`status-btn ${status === opt.id ? "active" : ""}`}
              onClick={() => onStatus(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      <section className="item-section">
        <div className="section-label">Notes to self</div>
        <textarea
          className="notes-field"
          placeholder="Deadline, contact, filing reference number..."
          value={notes}
          onChange={(e) => onNotes(e.target.value)}
        />
      </section>

      {status === "done" && <div className="stamp-overlay">FILED</div>}
    </div>
  );
}

/* ============================================================
   STYLES
   ============================================================ */

const CSS = `
.dossier-root {
  --paper: #F7F2E7;
  --card: #FFFDF7;
  --ink: #241F16;
  --ink-soft: #5B5442;
  --hairline: #DCD2B4;
  --ledger-green: #2F4A3B;
  --stamp-red: #A63B2E;
  font-family: 'IBM Plex Sans', sans-serif;
  background: var(--paper);
  color: var(--ink);
  min-height: 100%;
  background-image:
    repeating-linear-gradient(0deg, rgba(0,0,0,0.015) 0px, rgba(0,0,0,0.015) 1px, transparent 1px, transparent 28px);
}

.masthead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
  border-bottom: 2px solid var(--ink);
  background: var(--paper);
}
.masthead-left { display: flex; align-items: center; gap: 14px; }
.seal {
  width: 42px; height: 42px;
  border: 2px solid var(--ledger-green);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--ledger-green);
  font-size: 17px;
  font-weight: 600;
  transform: rotate(-6deg);
  flex-shrink: 0;
}
.masthead-title {
  font-family: 'Source Serif 4', serif;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.masthead-sub { font-size: 12.5px; color: var(--ink-soft); margin-top: 2px; }
.masthead-right { display: flex; align-items: center; gap: 10px; }
.save-indicator {
  font-size: 11px; color: var(--ink-soft); font-family: 'IBM Plex Mono', monospace;
  letter-spacing: 0.03em; text-transform: uppercase; transition: color 0.3s;
}
.save-indicator.flash { color: var(--ledger-green); }

.ghost-btn, .primary-btn {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 13px; font-weight: 500;
  padding: 8px 14px;
  border-radius: 3px;
  cursor: pointer;
  transition: transform 0.12s ease, background 0.15s ease;
}
.ghost-btn {
  background: transparent;
  border: 1px solid var(--hairline);
  color: var(--ink-soft);
}
.ghost-btn:hover { border-color: var(--ledger-green); color: var(--ledger-green); }
.ghost-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.primary-btn {
  background: var(--ledger-green);
  border: 1px solid var(--ledger-green);
  color: #FBF8F0;
}
.primary-btn:hover { transform: translateY(-1px); }

/* ---------- Intake ---------- */
.intake { max-width: 640px; margin: 0 auto; padding: 60px 24px 40px; }
.intake-progress { display: flex; gap: 6px; justify-content: center; margin-bottom: 32px; }
.intake-dot { width: 26px; height: 3px; background: var(--hairline); border-radius: 2px; }
.intake-dot.filled { background: var(--ledger-green); }
.intake-card {
  background: var(--card);
  border: 1px solid var(--hairline);
  border-radius: 4px;
  padding: 36px 32px;
  box-shadow: 0 1px 0 var(--hairline), 0 12px 24px -18px rgba(36,31,22,0.4);
}
.intake-eyebrow {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--ink-soft); margin-bottom: 10px;
}
.intake-question {
  font-family: 'Source Serif 4', serif;
  font-size: 26px; font-weight: 600; line-height: 1.3;
  margin: 0 0 10px;
}
.intake-helper {
  font-size: 13.5px;
  color: var(--ink-soft);
  line-height: 1.5;
  margin: 0 0 22px;
  padding-left: 12px;
  border-left: 2px solid var(--hairline);
}
.intake-options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
.intake-option {
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: left;
  padding: 14px 16px;
  border: 1px solid var(--hairline);
  border-radius: 3px;
  background: var(--paper);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.intake-option:hover { border-color: var(--ledger-green); }
.intake-option.selected {
  border-color: var(--ledger-green);
  background: #E9EFE9;
}
.intake-option-label {
  font-size: 14.5px;
  font-weight: 600;
  color: var(--ink);
}
.intake-option.selected .intake-option-label { color: var(--ledger-green); }
.intake-option-hint {
  font-size: 13px;
  color: var(--ink-soft);
  line-height: 1.5;
  font-weight: 400;
}
.intake-nav { display: flex; justify-content: space-between; }
.intake-footnote { text-align: center; font-size: 12.5px; color: var(--ink-soft); margin-top: 18px; }

/* ---------- Dossier body ---------- */
.dossier-body { display: grid; grid-template-columns: 320px 1fr; min-height: calc(100vh - 90px); }

.tab-rail {
  border-right: 2px solid var(--ink);
  padding: 20px 14px;
  background: var(--paper);
}
.progress-block { padding: 4px 8px 18px; border-bottom: 1px dashed var(--hairline); margin-bottom: 14px; }
.progress-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px; color: var(--ink-soft); margin-bottom: 8px;
}
.progress-label span { color: var(--ink); font-weight: 600; }
.progress-bar-track { height: 6px; background: var(--hairline); border-radius: 3px; overflow: hidden; }
.progress-bar-fill { height: 100%; background: var(--ledger-green); transition: width 0.4s ease; }

.tab-group { margin-bottom: 4px; }
.tab-group-header {
  display: flex; align-items: center; gap: 8px;
  width: 100%; text-align: left;
  background: transparent; border: none;
  padding: 9px 8px;
  font-size: 12.5px; font-weight: 600;
  color: var(--ink);
  cursor: pointer;
  border-radius: 3px;
}
.tab-group-header:hover { background: rgba(0,0,0,0.03); }
.tab-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.tab-count {
  margin-left: auto;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px; color: var(--ink-soft);
}
.tab-list { display: flex; flex-direction: column; gap: 2px; padding-left: 6px; margin-bottom: 10px; }
.tab-item {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 10px;
  background: transparent; border: none; border-radius: 3px;
  text-align: left; cursor: pointer;
  font-size: 13px; color: var(--ink);
}
.tab-item:hover { background: rgba(0,0,0,0.04); }
.tab-item.active { background: var(--card); border: 1px solid var(--hairline); }
.tab-item-status { flex-shrink: 0; display: flex; }
.tab-item-title { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tab-item-badge {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10.5px; font-weight: 700;
  border: 1px solid currentColor; border-radius: 50%;
  width: 16px; height: 16px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}

.detail-pane { padding: 40px 48px; max-width: 760px; }

.empty-state { padding-top: 60px; max-width: 420px; }
.empty-state h2 { font-family: 'Source Serif 4', serif; font-size: 24px; margin: 4px 0 10px; }
.empty-state p { color: var(--ink-soft); font-size: 14.5px; line-height: 1.6; margin-bottom: 22px; }
.stamp-mark {
  display: inline-block;
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 700; font-size: 11px; letter-spacing: 0.12em;
  color: var(--stamp-red);
  border: 2px solid var(--stamp-red);
  padding: 3px 10px;
  border-radius: 3px;
  transform: rotate(-4deg);
  margin-bottom: 14px;
  opacity: 0.55;
}

.item-detail { position: relative; }
.item-header { margin-bottom: 28px; }
.item-eyebrow {
  display: flex; align-items: center; gap: 6px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--ink-soft); margin-bottom: 10px;
}
.dot-sep { opacity: 0.5; }
.item-title {
  font-family: 'Source Serif 4', serif;
  font-size: 32px; font-weight: 700; line-height: 1.15;
  margin: 0 0 14px;
}
.urgency-chip {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12.5px; font-weight: 600;
  padding: 5px 12px; border-radius: 20px;
}

.item-section { margin-bottom: 26px; }
.section-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--ledger-green); font-weight: 600;
  margin-bottom: 8px;
}
.item-section p { font-size: 15px; line-height: 1.65; color: var(--ink); margin: 0; }

.threshold-box {
  background: var(--card);
  border: 1px solid var(--hairline);
  border-left: 3px solid var(--stamp-red);
  padding: 16px 18px;
  border-radius: 3px;
}
.threshold-value {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 15px; font-weight: 600; color: var(--ink);
}
.threshold-note { font-size: 13px; color: var(--ink-soft); margin-top: 8px; line-height: 1.55; }

.link-btn {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 14px; color: var(--ledger-green); font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid var(--ledger-green);
  padding-bottom: 1px;
}
.link-btn:hover { opacity: 0.75; }

.status-row { display: flex; flex-wrap: wrap; gap: 8px; }
.status-btn {
  font-size: 13px; padding: 7px 14px;
  border: 1px solid var(--hairline); border-radius: 20px;
  background: var(--card); color: var(--ink-soft);
  cursor: pointer;
}
.status-btn:hover { border-color: var(--ledger-green); }
.status-btn.active {
  background: var(--ledger-green); border-color: var(--ledger-green); color: #FBF8F0;
}

.notes-field {
  width: 100%; min-height: 70px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 14px; color: var(--ink);
  background: var(--card);
  border: 1px solid var(--hairline); border-radius: 3px;
  padding: 10px 12px; resize: vertical;
}
.notes-field:focus { outline: none; border-color: var(--ledger-green); }

.stamp-overlay {
  position: absolute;
  top: 12px; right: 0;
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 700; font-size: 26px; letter-spacing: 0.1em;
  color: var(--stamp-red);
  border: 3px solid var(--stamp-red);
  padding: 6px 18px;
  border-radius: 4px;
  transform: rotate(-9deg);
  opacity: 0.75;
  mix-blend-mode: multiply;
  pointer-events: none;
}

@media (max-width: 860px) {
  .dossier-body { grid-template-columns: 1fr; }
  .tab-rail { border-right: none; border-bottom: 2px solid var(--ink); }
  .detail-pane { padding: 28px 20px; }
  .intake-options { grid-template-columns: 1fr; }
}
`;
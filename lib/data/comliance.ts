// lib/compliance_data.ts

// Import icons for GROUP_META
import { FileText, MapPin, Building2 } from "lucide-react";
import type { ComponentType } from "react";

export const REVENUE_BUCKETS = ["pre-revenue", "under-20l", "20-40l", "40l-1cr", "1cr-plus"] as const;
export const EMPLOYEE_BUCKETS = ["0", "1-9", "10-19", "20-plus"] as const;

export type RevenueBucket = typeof REVENUE_BUCKETS[number];
export type EmployeeBucket = typeof EMPLOYEE_BUCKETS[number];
export type ModeType = "online" | "physical" | "both";
export type StructureType = "pvt-ltd" | "opc" | "llp" | "partnership" | "proprietorship" | "not-decided";
export type SectorType = "general" | "food" | "import_export" | "manufacturing" | null;
export type UrgencyType = "do-now" | "watch" | "later" | "optional";
export type StatusType = "not-started" | "in-progress" | "done" | "not-applicable";
export type GroupType = "national" | "state" | "municipal";

export interface ThresholdConfig {
  type: "always" | "time" | "free-instant" | "build-now" | "optional" | "revenue" | "employees";
  label: string;
  bucketIndex?: number;
  forceOnline?: boolean;
  sectorGate?: boolean;
}

export interface ComplianceRequirement {
  id: string;
  group: GroupType;
  title: string;
  tagline: string;
  what: string;
  why: string;
  threshold: ThresholdConfig;
  note?: string;
  link: string;
  linkLabel: string;
  modes: ModeType[];
  structures: StructureType[];
  sectors: SectorType[] | null;
}

export interface UserAnswers {
  mode: ModeType;
  structure: StructureType;
  sector: SectorType;
  state: string;
  employees: EmployeeBucket;
  revenue: RevenueBucket;
}

export interface ItemStatus {
  status: StatusType;
  notes?: string;
}

export interface DossierState {
  answers: UserAnswers;
  statuses: Record<string, ItemStatus>;
  stage: "intake" | "dossier";
}

export interface ExportPayload {
  exportedAt: string;
  answers: UserAnswers;
  checklist: {
    id: string;
    title: string;
    group: GroupType;
    urgency: UrgencyType;
    status: StatusType;
    notes: string;
  }[];
}

export const REQUIREMENTS: ComplianceRequirement[] = [
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

export const URGENCY: Record<UrgencyType, { label: string; color: string; bg: string }> = {
  "do-now": { label: "Handle now", color: "#A63B2E", bg: "#F6E6E1" },
  watch: { label: "Coming up soon", color: "#B4791F", bg: "#F5EAD3" },
  later: { label: "Not yet", color: "#5F7259", bg: "#E7EBDF" },
  optional: { label: "Whenever you're ready", color: "#3B5A78", bg: "#E2EAF0" },
};

export const GROUP_META: Record<GroupType, { label: string; icon: ComponentType<{ size?: number }>; color: string }> = {
  national: { label: "National", icon: FileText, color: "#2F4A3B" },
  state: { label: "State", icon: MapPin, color: "#3B5A78" },
  municipal: { label: "Municipal", icon: Building2, color: "#7A4A2E" },
};

export const STATUS_OPTIONS: { id: StatusType; label: string }[] = [
  { id: "not-started", label: "Not started" },
  { id: "in-progress", label: "In progress" },
  { id: "done", label: "Filed" },
  { id: "not-applicable", label: "Doesn't apply" },
];

export const STORAGE_KEY = "india-dossier-v1";
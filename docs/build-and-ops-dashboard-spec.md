# Urge — Mission 6 Build Dashboard & Mission 7 Operations Dashboard
## Feature, Data Model, Business Logic & Integration Spec

---

## Design principles carried through both dashboards

1. **One universal loop, business-model-aware copy.** Every module reads a `business_model` field on the Project (`software | physical_product | service | brick_and_mortar | hobby | other`) and swaps examples/labels — never forks into separate features per business type.
2. **Evidence over forms.** Users log what happened (a photo, a link, a number, a sentence) — the system infers structure (tags, milestones, themes) rather than making them fill out taxonomies.
3. **No lock-in.** Urge is a *starter back-office*, not the permanent system of record. Every data module supports export (CSV/JSON) from day one, and where a mature external tool exists (Stripe, Square, Shopify, QuickBooks), Urge prefers to *read* from it rather than replace it.
4. **AI companion as connective tissue.** The same companion persona logic threads through every module — it doesn't just wait for a task to be opened, it proactively references what happened in other modules (e.g., cites a blocker log entry while checking in on a milestone).

---

# MISSION 6 — BUILD DASHBOARD
*(Scope: Quest 1 "Build Your MSP" → Quest 2 "Get It in Front of People" → Quest 4 "Validate & Prepare for Launch". Traction/Revenue tracking has moved to Mission 7.)*

## 1. Build Log

**Features**
- Single-input daily/weekly entry point: "What did you move forward today?"
- Optional evidence attachment: photo, file, link, short voice note (auto-transcribed).
- Auto-classification into entry types: `built | blocked | learned | tested | shipped`.
- Streak counter based on *days logged*, not volume.
- One-tap "share to community" toggle per entry (feeds the Build-in-Public feed).
- Weekly rollup view: auto-generated summary of the week's entries (AI-written digest) shown before the `MilestoneCheck` task.

**Data model**
```ts
BuildLogEntry {
  id: string
  project_id: string
  user_id: string
  created_at: datetime
  entry_type: "built" | "blocked" | "learned" | "tested" | "shipped"
  text: string
  evidence: { type: "image"|"file"|"link"|"audio", url: string }[]
  milestone_id?: string          // link to BuildMilestone if applicable
  blocker_id?: string            // link to Blocker if entry_type == "blocked"
  shared_to_community: boolean
  ai_tags: string[]              // AI-inferred topical tags, e.g. ["pricing","onboarding"]
}
```

**Business logic**
- On entry save, run lightweight classification (rules first: keyword match for "stuck/blocked/can't" → suggest `blocked`; user can override).
- If `entry_type == "blocked"`, prompt to either link to an existing open Blocker or create a new one — never let a blocker exist only inside a log entry, since the Blocker Board is the actionable surface.
- Streak resets are *soft* — missing a day doesn't zero the counter, it just pauses it (avoid punishing real-life interruptions, consistent with the manifesto's anti-hustle-porn tone).
- Weekly digest generation triggers automatically every 7 days from Mission 6 start, feeding directly into `m6_q1_t2_milestone_check`.

**Integrations (nice-to-have)**
- GitHub/GitLab webhook → auto-create a `built` entry from commits/PRs merged (software founders only, opt-in).
- Google Photos / phone camera roll quick-attach for physical-product founders.
- Zapier/Make webhook so power users can pipe in updates from wherever they already work.

---

## 2. Roadmap / Milestone View

**Features**
- Visualizes the Build Timeline + Weekly Sprint Plan committed in Mission 5 — doesn't ask the user to re-plan.
- Milestones shown as a simple horizontal timeline with status: `upcoming | in_progress | done | slipped`.
- Marking a milestone "slipped" triggers a 2-question micro-form (What changed? What's the new date?) instead of a full re-plan.
- "Days until next milestone" countdown shown persistently on dashboard home.

**Data model**
```ts
BuildMilestone {
  id: string
  project_id: string
  title: string
  target_date: date
  status: "upcoming" | "in_progress" | "done" | "slipped"
  original_target_date: date      // preserved even after slip, for retro in Mission 8
  slip_reason?: string
  linked_log_entries: string[]    // BuildLogEntry ids
}
```

**Business logic**
- Seeded automatically from Mission 5 `BuildTimeline` and `FirstMilestoneDefinition` task outputs — no duplicate data entry.
- A milestone auto-flips to `slipped` if `target_date` passes without a `done` log entry linked to it, triggering the AI companion to check in rather than silently failing.
- All slip history is retained (not overwritten) — this becomes raw material for Mission 8's "Journey Timeline" and "Lessons Learned."

**Integrations**
- Optional two-way sync with Google Calendar / Apple Calendar for milestone dates.
- Optional export to Notion/Trello for users who prefer to plan there (read the plan from Urge, work in their own tool, log outcomes back in Urge).

---

## 3. Blocker Board

**Features**
- Kanban-style board: `Open → In Progress → Resolved`.
- Each blocker typed: `skill_gap | time | money | motivation | technical | waiting_on_someone`.
- Auto-escalation: blockers open longer than N days (configurable, default 5) get surfaced by the AI companion with a nudge to post in community or seek marketplace help.
- "Ask for help" one-tap action that pre-drafts a community post or DM using the Mission 1 "Art of Asking" framing (nice narrative callback).

**Data model**
```ts
Blocker {
  id: string
  project_id: string
  type: "skill_gap" | "time" | "money" | "motivation" | "technical" | "waiting_on_someone"
  description: string
  status: "open" | "in_progress" | "resolved"
  created_at: datetime
  resolved_at?: datetime
  resolution_note?: string
  escalated: boolean
  escalated_at?: datetime
}
```

**Business logic**
- `type == skill_gap` or `money` triggers a marketplace surface: "Here are vetted providers who help with this" — non-pushy, contextual, ties directly into the Marketplace vision without ads.
- Time-to-resolution is tracked and surfaced anonymized/aggregated in later cohort analytics (e.g., "founders in your cohort resolve technical blockers in 3 days on average") — useful both as social proof and as product analytics.
- Resolved blockers auto-generate a suggested Build Log entry ("You resolved: X — want to log how?").

**Integrations**
- Marketplace listing search API (internal) triggered by blocker type + business_model.
- Optional Slack/Discord webhook so users who run their own founder group chat get blocker escalations there instead of only in-app.

---

## 4. Tester / Early-Believer CRM

**Features**
- Auto-seeded from Mission 5's waitlist signups, "10 early followers," and personal network outreach list — zero re-entry.
- Status pipeline per tester: `invited → tried → gave_feedback → converted`.
- Feedback capture is theme-tagged, not free text only — AI pre-clusters recurring themes (e.g., "3 mentioned price, 2 mentioned confusing onboarding") before the user opens `FeedbackSynthesis`.
- Simple "who hasn't responded yet" filter for follow-up nudges.

**Data model**
```ts
Tester {
  id: string
  project_id: string
  name: string
  contact_method: string          // email/phone/handle — user's choice, not enforced
  source: "waitlist" | "personal_network" | "community" | "social" | "other"
  status: "invited" | "tried" | "gave_feedback" | "converted" | "declined"
  invited_at?: datetime
  tried_at?: datetime
}

FeedbackEntry {
  id: string
  tester_id: string
  project_id: string
  text: string
  theme_tags: string[]            // AI-suggested, user-editable
  sentiment: "positive" | "neutral" | "negative"
  created_at: datetime
}
```

**Business logic**
- On import from Mission 5 data, dedupe by contact method.
- `FeedbackSynthesis` task (`m6_q2_t2`) reads all `FeedbackEntry` rows for the project and pre-populates the synthesis form with the AI-clustered themes and sentiment breakdown, rather than presenting a blank page.
- `converted` status on a Tester should be settable manually here, but is also auto-set when a matching `SaleEntry` (Mission 7's ledger, see below) references the same contact — cross-module consistency without double entry.

**Integrations**
- CSV import for testers already tracked in the user's own spreadsheet/CRM.
- Typeform/Google Forms webhook for founders collecting structured feedback outside the app.
- Optional Calendly/scheduling link embed for booking tester sessions (service-based founders).

---

## 5. Launch Readiness Checklist

**Features**
- Persistent sidebar widget throughout Mission 6 (not a surprise gate at the end) — surfaces compliance items carried forward from Mission 3.
- Each item: `required now | can wait | done`.
- Progress ring showing % of "required now" items completed.

**Data model**
```ts
ComplianceItem {
  id: string
  project_id: string
  label: string
  category: string                // e.g. "registration","tax","permits","platform-tos"
  urgency: "required_now" | "can_wait"
  status: "pending" | "done"
  source_mission: "mission3" | "mission6"
}
```

**Business logic**
- Seeded from Mission 3's `ComplianceChecklist` output; Mission 6's `PreLaunchComplianceCheck` task re-surfaces only unresolved items rather than the full list again.
- Items untouched by the time `LaunchDecision` is reached trigger an explicit warning (not a block) — consistent with "encourage them to launch even if everything isn't perfect."

**Integrations**
- Jurisdiction-aware content pulls (if you build out a compliance content database later) — out of scope for v1, but the `category`/geography fields should be structured now to make that possible later.

---

## 6. Build-in-Public Feed

**Features**
- Any Build Log entry marked "share to community" posts automatically to the Urge community board.
- Optional cross-post to the user's chosen external social channel (from Mission 5's `SocialPresenceSetup`).
- Aggregated "founders building right now" feed view for the wider community — populates community content with real activity instead of empty space.

**Data model**
- No new entity — reuses `BuildLogEntry.shared_to_community` and posts a reference into the existing Community/Post model (assumed to exist elsewhere in the app).

**Business logic**
- Sharing is opt-in per entry, default off for `blocked` entries (people shouldn't be forced to publicly air every stuck moment) but default on for `built`/`shipped`/`tested`.
- Rate-limited to avoid spamming the community feed (e.g., max 1 auto-post per day per project, batches extra entries into a digest).

**Integrations**
- Buffer/native APIs for LinkedIn, X/Twitter, Instagram — post the same update externally with one toggle.
- Zapier/Make outbound webhook for founders who want to pipe updates into their own newsletter tool (e.g., ConvertKit, Substack).

---

## 7. Adaptive AI Companion Config (cross-cutting)

**Features**
- Companion persona prompt receives `business_model` and recent module state (open blockers, days since last log, upcoming milestone) as context — not a static prompt.
- Three constant jobs regardless of business type: unblock, celebrate, guard against scope creep.

**Data model**
```ts
CompanionContext (runtime-assembled, not persisted) {
  business_model: string
  days_since_last_log: number
  open_blockers: Blocker[]
  next_milestone: BuildMilestone
  recent_feedback_themes: string[]
}
```

**Business logic**
- Context assembly happens server-side right before each AI call — this is the piece that makes "The Builder" say "commit and deploy" to a SaaS founder and "batch and photograph" to a home baker without maintaining four persona prompts.

**Integrations**
- None external — this is purely an internal prompt-assembly layer, but worth building as a shared service since Mission 7's companion needs the same pattern.

---

# MISSION 7 — OPERATIONS DASHBOARD
*(Scope: running the business day-to-day post-launch. Explicit goal: this is a "starter back office," not a permanent home — every module should make it easy to graduate to dedicated tools.)*

## 0. Interoperability / "No Lock-In" Layer (foundational — build this first)

**Features**
- A visible **"Your data, your tools"** panel: one-click export (CSV/JSON) of every operations data set — sales ledger, customer list, content calendar, feedback log.
- **Bring-your-own-tool mode**: instead of Urge owning the system of record, users can connect existing tools (Stripe, Square, Shopify, QuickBooks, Notion, Google Sheets) and Urge reads via API to populate the dashboard views/metrics — so a founder who's already running Shopify isn't asked to double-enter sales.
- **Graduation prompt**: once revenue/customer count crosses a threshold (configurable), the dashboard proactively suggests "you've outgrown the starter tracker — here's how to move to [dedicated tool]" with a guided export.
- Read-only API keys stored per integration; revocable anytime from a single settings screen.

**Data model**
```ts
IntegrationConnection {
  id: string
  project_id: string
  provider: "stripe" | "square" | "shopify" | "quickbooks" | "google_sheets" | "notion" | "csv_manual"
  status: "connected" | "disconnected" | "error"
  scopes: string[]
  last_synced_at: datetime
  sync_direction: "read_only" | "read_write"
}

ExportJob {
  id: string
  project_id: string
  requested_at: datetime
  data_scope: string[]        // e.g. ["sales","customers","content"]
  format: "csv" | "json"
  download_url: string
  expires_at: datetime
}
```

**Business logic**
- Every downstream module (ledger, CRM, content) checks for an active `IntegrationConnection` first; if present, it displays synced data with a "source: Stripe" badge and disables manual entry for that data type to avoid conflicting records.
- Sync jobs run on a schedule (e.g., every 6 hours) plus on-demand refresh.
- Graduation threshold triggers are non-blocking nudges, never a paywall dressed as a limit — consistent with "we will not take commissions/lock people in."

**Integrations (this whole module *is* the integration layer)**
- Stripe / Razorpay / Square (payments)
- Shopify / WooCommerce (physical product sales)
- QuickBooks / Wave / Zoho Books (accounting)
- Google Sheets (universal fallback for anyone, especially hobby/service founders)
- Zapier / Make (catch-all for anything not natively supported)

---

## 1. Traction & Revenue Tracker (moved from Mission 6, expanded)

**Features**
- Universal manual-entry ledger: amount, payer, date, channel, method — works for cash, Venmo, invoice, or synced Stripe/Square data.
- "Proof of demand" summary card: total revenue, # customers, conversion rate from tester → customer (pulls `Tester.status` history from Mission 6 for continuity).
- Weekly revenue trend chart; simple, not a full BI tool.
- Repeat-customer flag, since repeat purchase is a stronger signal than one-off sales.

**Data model**
```ts
SaleEntry {
  id: string
  project_id: string
  amount: number
  currency: string
  payer_name: string
  payer_contact?: string          // links to Tester/Customer if matched
  channel: "network" | "community" | "social" | "walk_in" | "referral" | "other"
  method: string                  // free text: "stripe","cash","venmo","invoice"...
  date: date
  note?: string
  source: "manual" | "stripe" | "square" | "shopify"
  is_repeat_customer: boolean
}
```

**Business logic**
- On save, attempt to match `payer_contact` against existing `Tester`/`Customer` records; if matched, flip `Tester.status` to `converted` automatically (closes the loop from Mission 6 without double entry).
- If an `IntegrationConnection` is active for payments, `SaleEntry` rows are created automatically from webhook/sync events, tagged `source: stripe` etc., and manual entry is hidden for that channel (but still available for cash/offline sales alongside it).
- Weekly rollup feeds directly into `m7_q2_t5_revenue_tracking` and the Quarterly Review.

**Integrations**
- Stripe/Square/Shopify webhooks (real-time), as above.
- Manual CSV upload for founders who track sales in their own spreadsheet.

---

## 2. Lightweight Customer / Lead CRM

**Features**
- Pipeline view: `lead → contacted → qualified → customer → repeat`.
- Extends (doesn't replace) the Mission 6 Tester CRM — same underlying person record, richer status now that the business is live.
- Simple notes/timeline per customer (support interactions, sales, feedback all in one place).
- Segments/filters: by channel, by status, by revenue contributed.

**Data model**
```ts
Customer {
  id: string
  project_id: string
  name: string
  contact: string
  pipeline_status: "lead" | "contacted" | "qualified" | "customer" | "repeat" | "churned"
  source_channel: string
  lifetime_value: number          // computed from linked SaleEntry rows
  first_contact_at: datetime
  last_activity_at: datetime
  tags: string[]
  linked_tester_id?: string       // continuity from Mission 6
}
```

**Business logic**
- `lifetime_value` is a computed/denormalized field, recalculated whenever a `SaleEntry` links to this customer.
- `churned` status can be auto-suggested if no activity/purchase in a configurable window, but requires user confirmation (avoid false negatives for low-frequency businesses like a bakery with monthly custom-cake orders).

**Integrations**
- Two-way sync option with a real CRM (HubSpot free tier, Notion database) for founders who want to graduate early — read/write, unlike the payment integrations which stay read-only.
- Email/contact import (Gmail/Outlook contacts, CSV) to seed the pipeline from an existing network.

---

## 3. Marketing Channel & Content Tracker

**Features**
- Tracks the channels set up in `m7_q1_t2_marketing_channels` and content pieces from `m7_q1_t3_content_engine` in one calendar/list view.
- Per-channel simple performance log: reach/views/clicks (manual entry, or synced where an integration exists).
- Content idea backlog (from the AI companion or the "Content Idea Generator" resource) so the content engine doesn't stall for lack of ideas.

**Data model**
```ts
ContentPiece {
  id: string
  project_id: string
  channel: string
  title: string
  published_at: datetime
  format: "blog"|"video"|"post"|"podcast"|"thread"|"other"
  performance: { views?: number, clicks?: number, engagement?: number }
  status: "idea" | "drafted" | "published"
}

MarketingChannel {
  id: string
  project_id: string
  name: string
  type: "email"|"social"|"content_platform"|"paid"|"other"
  connected_integration_id?: string
}
```

**Business logic**
- `LaunchMetrics` task (`m7_q1_t5`) defines which metrics matter for this founder; the dashboard highlights those specific numbers prominently rather than showing every possible metric.
- Content backlog auto-suggests topics based on Blocker Board resolutions and Feedback themes from Mission 6 — "you solved a confusing-onboarding complaint, that's a good post."

**Integrations**
- Native analytics pulls where available: YouTube Analytics, Instagram/Meta Insights, Mailchimp/ConvertKit open rates.
- Manual entry always available as fallback (no integration should be mandatory).

---

## 4. Outbound & Referral Tracker

**Features**
- Weekly outbound log (`m7_q2_t1`): who was contacted, response status, next follow-up date.
- Referral system config (`m7_q2_t2`): incentive structure, referral link/code generation, referral attribution.
- Simple "who owes a follow-up this week" view.

**Data model**
```ts
OutboundContact {
  id: string
  project_id: string
  customer_id?: string
  contacted_at: datetime
  channel: string
  response_status: "no_response" | "responded" | "converted" | "declined"
  follow_up_date?: date
}

ReferralCode {
  id: string
  project_id: string
  code: string
  incentive_description: string
  referrer_customer_id?: string
  uses: number
  conversions: number
}
```

**Business logic**
- `OutboundContact.recurring: true, interval: "weekly"` task nudges reuse the same underlying entity rather than creating a fresh disconnected log every week — continuity of relationship history matters for a solo founder.
- Referral conversions auto-link to `SaleEntry` and `Customer.source_channel = "referral"` when a code is used at checkout (only possible via integration; manual fallback lets the user self-report).

**Integrations**
- Simple referral-link generation can piggyback on the existing landing page tool from Mission 5 (query param tracking) rather than building a full attribution system.

---

## 5. Customer Support Log

**Features**
- Lightweight inbox/log for support interactions (`m7_q2_t3`), not a full helpdesk.
- Response-time tracking against the "respond within 24 hours" commitment.
- Common-question tagging that feeds directly into the Feedback Loop and Content backlog (a support question is often a content idea or a product fix).

**Data model**
```ts
SupportTicket {
  id: string
  project_id: string
  customer_id?: string
  channel: string                 // email, DM, WhatsApp, in-person
  question: string
  status: "open" | "resolved"
  received_at: datetime
  resolved_at?: datetime
  tags: string[]
}
```

**Business logic**
- Response-time SLA (24h) tracked and surfaced as a simple streak/badge ("responded within 24h for 2 weeks straight") rather than a punitive metric.

**Integrations**
- Email forwarding address (support@founder-subdomain) that auto-creates tickets — low lift, works for every business type.
- WhatsApp Business API / Instagram DM webhook for founders whose support happens there (common for brick-and-mortar/hobby businesses).

---

## 6. Feedback Loop

**Features**
- Continuous version of Mission 6's Feedback Synthesis — same theming/sentiment engine, now fed by `SupportTicket`, post-purchase surveys, and ongoing `Customer` notes rather than a one-time alpha test.
- Simple recurring "how's it going?" prompt to send to recent customers (templated, one click).

**Data model**
- Reuses `FeedbackEntry` from Mission 6, extending `source` field to include `support_ticket | survey | direct_note`.

**Business logic**
- Feeds the Quarterly Review's "what did you learn about your customers" section automatically with pre-aggregated themes, rather than the founder re-reading three months of notes cold.

**Integrations**
- Typeform/Google Forms for structured post-purchase surveys.

---

## 7. Metrics & Quarterly Review Dashboard

**Features**
- Home view combining: revenue trend, customer pipeline snapshot, top content performance, open support tickets, referral conversions — the "cockpit" view.
- Auto-drafted Quarterly Review (`m7_q2_t6`) pre-populated from all the above data, so the founder edits/reflects rather than starting from a blank form.

**Data model**
- Purely a read/aggregation layer over the above entities; no new persisted model beyond a cached `QuarterlySnapshot` for performance and historical comparison.

```ts
QuarterlySnapshot {
  id: string
  project_id: string
  period_start: date
  period_end: date
  revenue_total: number
  new_customers: number
  repeat_rate: number
  top_channel: string
  narrative_summary: string        // AI-generated draft, user-editable
}
```

**Business logic**
- Snapshots are generated automatically at quarter-end and archived — this becomes the primary raw material for Mission 8's "Review Your Business" quest, so that mission doesn't require the founder to reconstruct three months of history manually.

**Integrations**
- None beyond what feeds it — this is intentionally an internal rollup, not another external sync point.

---

## Summary: how the two dashboards hand off

| | Mission 6 (Build) | Mission 7 (Operate) |
|---|---|---|
| Primary question | "Does this work?" | "Can this run without falling apart?" |
| Core entity | `BuildLogEntry`, `Tester` | `SaleEntry`, `Customer` |
| Data lifespan | Sprint/weeks | Ongoing, quarter cycles |
| Lock-in posture | N/A (nothing to migrate yet) | Explicit graduation path via Integration Layer |
| Feeds forward into | Mission 7 CRM + Ledger seeded from Testers/first sales | Mission 8 retrospective seeded from Quarterly Snapshots |

The Integration/No-Lock-In layer (Mission 7, Module 0) is worth building first among the operations modules — every other Mission 7 feature is designed to either write to it or read from it, so sequencing it last would mean retrofitting sync logic into five already-built modules instead of designing them against it from day one.

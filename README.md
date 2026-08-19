## Mission 4

Quest 1: Shape you Offer
- task 1: Your promise
- task 2: What features your products would need to deliver on the promise ( a list of all features)
- Customer Journey Mapping - User walks through entire customer journey
- feature prioritisation and final feature List

Quest 2: The cost ( will be saved in budget table rather than user_projects)
- I want the costs to reflect the user journey which is easier for user to visualize rather than breaking it down in financial terms. task would walk them through the steps and ask then to add the associated costs
  - Making the product
  - Getting the customer and sales
  - Delivery the product
  - Post sales
- Once they have added these then we can analyse it financially ( fixed costs, variables costs, cogs, etc)

Quest 3: the Right price 
- We will help user price their offering and walk them through different approaches
- Understand revenue
- making money analysing profitability

Quest 4: Finding Your Customer 
puttin together a simple practical go-to-market, customer acquisition plan

Quest 5: Decision go-no-go


## New tables for finance and budget Related 

```sql
-- Planning: one-time startup costs, recurring costs, revenue projections
create type budget_item_kind as enum ('startup_cost', 'recurring_cost', 'revenue_projection');
create type budget_frequency as enum ('one_time', 'weekly', 'monthly', 'yearly');

create table user_budget_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  project_id uuid references user_projects(id),
  kind budget_item_kind not null,
  category text not null,              -- ingredients, tools, software, license, rent, marketing...
  title text not null,
  estimated_amount numeric not null default 0,
  currency text not null default 'INR',
  frequency budget_frequency not null default 'one_time',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Actuals: the income/expense ledger
create type ledger_entry_type as enum ('income', 'expense');
create type ledger_source as enum ('manual', 'auto_from_order');

create table user_ledger_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  project_id uuid references user_projects(id),
  entry_type ledger_entry_type not null,
  amount numeric not null,
  currency text not null default 'INR',
  category text,
  description text,
  contact_id uuid references user_contacts(id),   -- who paid / who was paid
  order_id uuid,                                    -- fk added after user_orders exists (2.D)
  receipt_url text,
  source ledger_source not null default 'manual',
  occurred_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```



## for mission 5 build dashboard

```sql
create type build_task_status as enum ('todo', 'in_progress', 'testing', 'done');

create table user_build_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  project_id uuid references user_projects(id),
  title text not null,
  description text,
  status build_task_status not null default 'todo',
  category text,                        -- sourcing, production, tech, legal, design...
  is_requirement boolean not null default false,  -- "must-have to be sellable" checklist flag
  due_date date,
  sequence integer not null default 0,
  source text not null default 'manual',           -- manual | ai_suggested | mission_linked
  linked_mission_task_id uuid references tasks(id), -- if a Quest/Task spawned this
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type resource_type as enum ('physical', 'service');
create type resource_cost_structure as enum ('per_unit', 'recurring', 'one_time');

create table user_materials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  project_id uuid references user_projects(id),
  name text not null,
  category text,                         -- ingredients, packaging, tools, software, contractor, legal...
  resource_type resource_type not null default 'physical',
  cost_structure resource_cost_structure not null default 'per_unit',
  frequency budget_frequency,             -- reuse enum from user_budget_items; only set when cost_structure='recurring'
  unit text not null default 'unit',      -- kg, litre, pc, hour, month, license, call...
  quantity_needed numeric not null default 1,
  unit_cost numeric not null default 0,
  supplier_contact_id uuid references user_contacts(id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- total_cost = quantity_needed * unit_cost — compute in app, or make it a generated column

-- Example rows across both business types:
-- Flour            | physical | per_unit  | null    | 0.2kg x ₹60/kg
-- WhatsApp API      | service  | recurring | monthly | 1 x ₹500/month
-- FSSAI license     | service  | one_time  | null    | 1 x ₹1,200
-- Freelance logo    | service  | one_time  | null    | 5hr x ₹300/hr

**Cost-per-unit calculation now handles both:**

```

# Implementing Mission 4
## Quest 2: The Cost

### Feedback on your suggestion:
- I dont want to start with fixed costs becaue user so far has thought of customer and solution so i think to orient them it will be better to have following order

- Task 1: Build the product/service
  - each thing they add we can ask them to categorize if its raw material for product or not
  - if its not then we can asked how frequently do they need it, it is equipment one time or subscription etc
  - we should check with Ai if they have covered everything they would need and show them list of things they missed out on when the try saving the list
- Task 2: how much they need to acquire customer: we will have to hand hold them a lot or maybe merge finding customers and customer acquisition cost in one, we can bring up the persona they added in previous mission
- Task 3: Everything they would need to spend on delivery logitics, wastages, returns etc
- Task 4: Other costs legal, permissions, comissions etc


Task 1: One-Time Setup Costs (The Starting Line)
Before a customer ever enters the journey, what one-time assets or approvals are required to open doors?

Guided Prompts:

Physical assets or tools (e.g., machinery, initial sample inventory, laptop, domain name).

Legal, regulatory, or branding costs (e.g., FSSAI license, GST registration, trademark, logo design).

User Input Experience:

Quick-add item list where users name the expense, input the cost, and choose a category (e.g., Legal/Compliance, Setup Assets, Brand/Design).

Data Classification (Under the Hood):

Auto-classified as kind: 'startup_cost' and frequency: 'one_time'.

Task 2: Journey-Based Operating Costs (Walking the Customer Map)
This is where the magic happens. The user sees their 4 Customer Journey Stages side-by-side or step-by-step:

Stage 1: Discovery & Marketing

Question: "What will it cost to get noticed?"

Examples: Ad spend, domain hosting, print flyers, social media tools.

Stage 2: Buying & Sales

Question: "What does it cost when someone pays you?"

Examples: Payment gateway fees (% or flat rate per transaction), domain SSL, invoicing software.

Stage 3: Making & Delivery

Question: "What does it cost to produce and deliver ONE item/service?"

Examples: Raw materials, packaging boxes, courier/shipping fees, cloud server usage per user.

Stage 4: Post-Sales & Operations

Question: "What ongoing tools or support keep the business running monthly?"

Examples: Customer support software, workspace rent, monthly software subscriptions (SaaS).

Task 3: Cost Analysis & Unit Economics Preview (Making Sense of the Numbers)
Once the user enters their expenses, the app processes the raw inputs and presents a clear summary without technical jargon:

Startup Budget Total: Total amount needed before launch.

Monthly Overhead (Fixed Costs): What it costs to keep the lights on every month, regardless of sales volume.

Cost Per Sale (Variable Cost / COGS): Exactly how much money leaves the pocket to fulfill a single order.

# Quest 3: The Right Price

Uses the total cost structure derived from Quest 2 to calculate profit margins, explore pricing strategies, and evaluate unit economics.

# Quest 4: Finding Your Customer

Practical Go-To-Market and acquisition channels.

# Quest 5: Decision Gate (Go / No-Go)

Evaluates overall viability before transitioning into Mission 5 (Build).


## Task
- Go through the detail and tell me what u think about my suggestion
- We will need to update mission4.ts -> quest 1
- Examine the database and options, If we need a new table or are we going to use user_projects table
- once we have tackled playbook, database, server actions, then we will implemente task forms one by one.

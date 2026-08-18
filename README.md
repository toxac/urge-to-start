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
## Quest 1: Shape Your Offer

### Task 1: Your Promise (Value Proposition)
- we will need to add value_prop or promise column to user_projects. Also i am thinking if we should have a different table to capture product details rather than have it all stores inside of user_projects table, what do you think?
- I want to design the form ValuePropForm to let user explore what their offer is rather than ask them to just write a sentence. This is not an academic exercise. I want the promise to be the anchor of the product, communication, marketing, sales and operations. lets brainstorm how we are going to have users arrive at this.   

### Task 2: What features your product needs (Feature Brainstorm)
- I want this to tie back to the promise and we should have promise on top and ask users the question which features would deliver on the promise. We have to make sure users think through these features/requirements from all angles as it will have implication on the costs. 
- we don't currently have a column to capture this data. If we are creating new table then it should be under requirements json array

### Task 3: Feature Prioritization (Must-haves / Final List)
- We will let users pick on the requirements and have qualify each in the list whether it is critical, nice to have, or not important for msp ( you can suggest categories) We can update requirement json field to reflect the status

### Task 4: Customer Journey Mapping (Step-by-step experience from payment to delivery)
- We want to take user through process diagram from discovering the product/offer -> Buying it -> Getting delivered the product -> Leaving feedback/post-sales
- we can save this in customer map and order the stages as sequential number. Each stages capturing what.how and why.

```ts
// current user_projects schema

user_projects: {
        Row: {
          biz_name: string | null
          build_data: Json | null
          competitive_landscape: Json | null
          compliance_checklist: Json | null
          created_at: string | null
          current_mission: string | null
          discovery_metrics: Json | null
          financial_blueprint: Json | null
          five_word_hook: string | null
          id: string
          infrastructure_nodes: Json | null
          is_active: boolean | null
          launch_data: Json | null
          operations_data: Json | null
          opportunity_id: string | null
          review_data: Json | null
          solution_design: Json | null
          status: string | null
          tagline: string | null
          updated_at: string | null
          user_id: string
          validation_data: Json | null
          viability_check: Json | null
        }

```


## Task
- Go through the detail and tell me what u think about my suggestion
- We will need to update mission4.ts -> quest 1
- Examine the database and options, If we need a new table or are we going to use user_projects table
- once we have tackled playbook, database, server actions, then we will implemente task forms one by one.

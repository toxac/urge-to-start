/**
 * Types for program which define both supabase table schema as well as 
 * schema for json fields in the tables
 */

// CORE PROGRAM DATA - MISSIONS, QUESTS and TASKS

type MissionSchema  = {
    id: string;
    title: string;
    content: string | null; 
    content_path: string;
    sequence: number;
    video_url : string | null;
    big_question : string | null;
    estimated_time_in_days : number;
    quests : QuestSchema [];
    context: string[]; // for personalisation
    success_message: string ;
}

type NoteSchema = {
    title: string;
    type: "requirement" | "warning" | "guide" | "nudge" ;
    content: string;
    related_url: string | null;
}

type QuestSchema = { // no ai config in quest and mission, it will be only at task level
    id: string;
    title: string;
    content_path: string;
    video_url : string | null;
    sequence: number;
    estimated_in_app_minutes: number;
    estimated_off_app_minutes: number;
    content: string |null; // only to populate markdown in database config file will have no content
    context: string[] | null;
    on_success: {
        grant_points: number;
        badge_key: string;
    }
    notes : NoteSchema[] | null;
    challenges: ChallengeSchema[] | null;
    tasks: TaskSchema[];
    success_message: string ;
}



type ChallengeSchema = {
    title: string;
    description: string;
    link: string;
}

// program_tasks table
type TaskSchema = {
    id: string;
    title: string;
    sequence: number;
    execution_type: ExecutionType;
    estimated_minutes: number;
    briefing_text: string;
    mission_id: string;
    quest_id: string;
    execution_environment:string | null;
    checkback_delay_days: number | null;
    recurring: boolean | null;
    interval: number | null;
    references: ReferenceSchema[];
    component_key: string;
    reflection_prompt: string | null;
    observation_context: ObservationContext | null;
    on_success: {
        grant_points: number;
        badge_key: string;
    };
    ai_config: AIConfigSchema | null;
    dependencies: string[]| null; // task ids
}

type AIConfigSchema = {
    role: string;
    persona_name: string;
    persona_prompt: string;
    required_context: string[] | null;
}

type ObservationContext = {
    category: string;
    reference: string;
}

type ExecutionType = "standard-form" | "simulator" | "off-task-action" | "observation-form" | "log_counter" ; // updated task_execution_type

type ReferenceSchema = {
    type: "insights" | "guide" | "tools" | "youtube" | "podacst" | "book" | "other";
    isInternal: boolean;
    isRequired: boolean;
    url_link: string;
    title: string;
}


/// CORE TABLES for user generated data

// maps to user_observations table 
type UserObservations = {
    id : string; //uuid auto
    user_id: string; //fk 
    title: string;
    reference: ObservationReference | null ; // reference + category will help us refine custom fields
    content: string;
    program_item_type: ProgramItemType  | null;
    program_item_id: string | null;
    project_id: string | null;
    opportunity_id: string | null;
    context: JSON | null ;
    tags: string[] | null;
    additional_data: JSON | null;
    comments: UserComment[] | null;
    created_at: string;  // date now()
    updated_at: string; // date now()
}

type UserComment = { // universal comment type
    title: string;
    content: string;
    user_id: string;
    username: string;
    created_at: string;  // date now()
    updated_at: string;
}


type ProgramItemType = "mission" | "quest" | "task" ; //existing database enum -> program_item_type

type ObservationReference = { // refer to constant 
    referenceTable : string;
    category: string;
}

const ObservationReferenceValues = [
    {table_reference:"user_opportunities", categories: ["personal_problems" , "skills" , "zone_of_influence" , "broader_search"] },
    {table_reference:"user_projects", categories: [] },
]

// user_contacts table new
type UserContact = {
  id: string // uuid auto
  user_id: string // fk auth
  project_id: string // fk projects table
  // Basic Info
  email: string
  first_name: string
  last_name: string
  phone: string
  company: string
  job_title: string
  // Social
  linkedin_url: string
  instagram_username: string
  twitter_handle: string
  // Classification (for the founder's business)
  categories: UserContactCategory[]
  status: UserContactStatus // NOT NULL DEFAULT 'active'
  source: UserContactSource
  stage: UserContactStage
  // Internal notes (array for timestamped entries)
  notes: string[]
  // Communication tracking
  last_contacted_at: string
  next_follow_up_at: string
  // Flag for email lists
  opted_in_newsletter: boolean
  // Extra metadata (e.g., meeting summaries, custom fields)
  metadata: Record<string, any>
  // Timestamps
  created_at: string // date now()
  updated_at: string // date now()
}

type UserContactStatus = 'active' | 'inactive' | 'lost'

type UserContactSource =
  | 'personal_network'
  | 'social_media'
  | 'website_form'
  | 'referral'
  | 'outbound'
  | 'customer_interview'
  | 'partnership_outreach'
  | 'urge_community'
  | 'other'

type UserContactStage =
  | 'lead' // Raw contact—just met or just captured
  | 'engaged' // Follows your journey, replies to updates, warm
  | 'pre_sale' // Committed to buy (pre-sale, deposit, signed up)
  | 'customer' // Paid and actively using your product/service
  | 'advocate' // Loves it—gives referrals, testimonials, champions you
  | 'cold' // Went quiet, not responding to outreach
  | 'nurturing' // Keep in touch for later (not ready yet, but warm)

type UserContactCategory =
  | 'squad' // Cheer squad (Mission 1)
  | 'partner' // Business partner
  | 'tester' // Alpha/beta tester
  | 'presales' // Pre-sale customers
  | 'customer' // Paying customer


// user_opportunities table 
type UserOpportunities = {
    id: string;
    title: string
    description: string;
    pain_score_grade: number | null;
    project_id: string | null;
    source_type: OpportunitySource;
    user_id: string
    capture_metadata: JSON | null;
    assessment: OpportunityAssessment | null; // new field
    status: OpportunityStatus;
    created_at: string ; 
    updated_at: string
    validated_at: string | null
    validation_interviews: JSON
}

type OpportunitySource = "personal_problems" | "skills" | "zone_of_influence" | "broader_search"; // existing database enum -> opportunity_source_type

type OpportunityStatus =    "raw_seed" | "archived" | "shortlisted" | "selected";

type OpportunityAssessment = {
  version: string;
  evaluatedAt: string;
  criteria: {
    passion: number | null;
    urgency: number | null;
    workaround_spend:  number | null;
    unfair_advantage: number | null;
    msp_feasibility: number | null;
  },
  totalScore: number | null;
  category: string | null;
  notes: string | null;
}


// User profiles -> profiles table

type Profile = {
    id: string;
    user_id: string;
    username: string;
    // personal details
    fullname?: string;
    bio ?: string | null; // populated from CommunityIntroForm
    country?: string | null;
    city?: string | null;
    gender?: string | null;
    currecncy?: string;
    age_group? : UserAgeGroup | null;
    address?: string; // needs with purchase
    avatar_url?: string;
    highest_education_level : EducationLevel | null;
    // platform data
    roles: UserRoles[] | [];
    motivations : ProfileMotivationSchema | null;
    commitment : ProfileCommtimentSchema | null;
    roadblocks : ProfileRoadblockSchema | null;
    social_footprint : ProfileSocialFootprintSchema[] | null;
    assessment : ProfileAssessmentSchema[] | null;
    skills: ProfileSkills[] | null;
    provider_metadata?: JSON; // havent finalized the schema, to be done in future
    mentor_profile?: JSON; // havent finalized the schema , to be done in future
    onboarding_step?: string;
}

type EducationLevel = "high_school" | "undergraduate_degree" | "postgraduate_degree" | "self_taught" ;

type UserRoles = "base" | "enrolled" | "member" | "provider" | "mentor" | "superadmin" | "admin_marketing" | "admin_accounts" ; // maps to database enum user_platform_role

type UserAgeGroup = "under_18"| "18_24"| "25_34"| "35_44"| "45_54"| "55_plus" ; // maps to database enum user_age_group

type ProfileSkills = { // M1/Q2/T2 - skills and expertise
    category: string;
    title: string;
    level: string;
}

type ProfileMotivationSchema = { //M1/Q1/T1 - Why Start
    push: string;
    push_other: string | null;
    pull: string;
    pull_other: string | null ;
    urgency: string;
    urgency_other: string | null
    why_statement: string;
}

type ProfileCommtimentSchema = { //M1/Q1/T2 - Your Commitment
    time_to_launch: number; // in months
    weekly_hours: number;
    capital: number | null;
}

type ProfileRoadblockSchema = { //  M1/Q1/T3 - Roadblocks
    roadblocks: string[] | null;
    roadblocks_other: string | null;
}

type ProfileSocialFootprintSchema = {  //M1/Q2/T1 - Social resource
    type: "platform" | "clubs" | "professional" | "network" | "other";
    name: string; 
    profile_link_url: string;
    total_connections: number | null;
}

type ProfileAssessmentSchema = {
    assessment_type: string;
    observation: string;
    recommendation: string[];
    score: number;
}


// PROJECT 
export type UserProject = {
    id: string;
    user_id: string;
    opportunity_id: string;
    biz_name: string | null;
    tagline: string | null;
    five_word_hook: string | null;
    status: "draft" | "active" | "paused" | "completed" | "pivot" | "archived";
    is_active: boolean;
    created_at: string;
    updated_at: string;

    // Copy from user_opportunities
    opportunity_data: OpportunityData | null;

    // Mission 3 - Getting Real
    problem_hypothesis: ProblemHypothesis | null;
    validation_data: ValidationData | null;
    customer_personas: CustomerPersonas | null;
    msp: MSP | null;
    landscape: Landscape | null;
    compliance_checklist: ComplianceChecklist | null;
    viability_check: ViabilityCheck | null;

    value_prop: ValueProposition | null;
    features: Features | null;
    customer_experience: CustomerExperience | null;
    pricing: Pricing | null;
    customer_acquisition: CustomerAcquisition | null;
    financial_blueprint: FinancialBlueprint | null;

    // Future Missions
    infrastructure_nodes: JSON | null;
    discovery_metrics: JSON | null;
    launch_data: JSON | null;
    review_data: JSON | null;
};

export type ProblemHypothesis = {
    problem_statement: string;
    when: string;
    where: string;
    who: string;
    frequency: "daily" | "weekly" | "monthly" | "occasionally" | "seasonal";
    workaround: string;
};

export type CustomerInterview = {
    who_did_you_talk_to: string;
    problem_confirmed: "yes" | "sort_of" | "no";
    current_workaround: string;
    buying_signal: "offer_to_pay" | "asked_to_buy" | "introduced" | "none";
    what_surprised_you: string | null;
    problem_statement_change: string | null;
    interview_date: string;
};

export type ValidationData = {
    interviews: CustomerInterview[];
};

export type CustomerPersona = {
    persona_name: string;
    age_range: "18_24" | "25_34" | "35_44" | "45_54" | "55_plus";
    gender: "male" | "female" | "non_binary" | "not_relevant" | null;
    job_title: string;
    tasks: string;
    pain_points: string;
    gains_desired: string;
    current_spending: string | null;
    where_to_find: string;
    problem_statement_customer: string;
};

export type CustomerPersonas = CustomerPersona[];

export type SolutionType = "product_service" | "tools_saas" | "marketplace" | "content";

export type AccessType = 
    | "one_time_purchase"
    | "saas_subscription"
    | "service_retainer"
    | "service_project"
    | "digital_download"
    | "membership"
    | "freemium"
    | "marketplace_commission";

export type ExecutionResponsibility = "user" | "provider" | "marketplace" | "hybrid";

export type DeliveryMethod = 
    | "in_person"
    | "email"
    | "phone"
    | "video_call"
    | "simple_website"
    | "instagram_dm"
    | "pdf_download"
    | "other";

export type TimeToFirstSale = "hours" | "days" | "weeks" | "months";

export type MSP = {
    // From Task 2.1
    solution_type: SolutionType;
    industry_sector: string;
    rationale: string;
    access_type: AccessType;
    execution_responsibility: ExecutionResponsibility;
    // From Task 2.2
    msp_description: string;
    // From Task 2.3
    price: string;
    delivery_method: DeliveryMethod;
    resources_needed: string;
    time_to_first_sale: TimeToFirstSale;
    differentiation: string;
};

export type Landscape = {
    trend_or_shift: string;
    competitors: string;
    whats_working: string;
    whats_hard: string;
    where_customers_gather: string;
};

export type ComplianceItem = {
    item: string;
    status: "not_started" | "in_progress" | "completed" | "not_applicable";
    urgency: "critical" | "important" | "low";
    notes: string | null;
};

export type ComplianceChecklist = ComplianceItem[];

export type ViabilityCheck = {
    // Task 4.1
    first_sale_14_days: "yes" | "maybe" | "no";
    resources_available: "yes" | "mostly" | "no";
    stamina_6_months: "absolutely" | "probably" | "uncertain" | "probably_not";
    biggest_risk: string;
    kill_criteria: string;
    // Task 4.2
    worst_case_scenario: string;
    what_would_you_learn: string;
    what_would_you_do_next: string;
    regret_test: "starting" | "not_starting";
    // Task 4.3
    decision: "go" | "pivot" | "no_go";
    decision_rationale: string;
};

export type OpportunityData = {
    id: string;
    title: string;
    description: string;
    source_type: "personal_problems" | "skills" | "zone_of_influence" | "broader_search";
    assessment: {
        version: string;
        evaluatedAt: string;
        criteria: {
            passion: number | null;
            urgency: number | null;
            workaround_spend: number | null;
            unfair_advantage: number | null;
            msp_feasibility: number | null;
        };
        totalScore: number | null;
        category: string | null;
        notes: string | null;
    } | null;
};



export type ValueProposition = {
    value_proposition: string;
    unique_value: string;
    customer_promise: string;
};

export type Feature = {
    id: string;
    title: string;
    description: string;
    priority: "must_have" | "nice_to_have" | "excluded" | null;
};

export type Features = Feature[];

export type CustomerExperience = {
    delivery_time: "minutes" | "hours" | "days" | "weeks";
    customer_journey: string;
    friction_points: string;
};

// -------- Quest 2: Pricing --------
export type Pricing = {
    problem_cost_money: string | null;
    problem_cost_time: string | null;
    problem_cost_stress: string | null;
    alternatives_cost: string;
    proposed_price: string;
    payment_frequency: "one_time" | "weekly" | "monthly" | "yearly" | "per_unit" | "commission";
    double_price_test: "yes" | "maybe" | "no";
    price_fairness: string;
    price_trust: string;
    confidence_score: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
};

// -------- Quest 3: Acquisition --------
export type CustomerAcquisition = {
    customer_source: string;
    primary_channel: string;
    channel_rationale: string;
    offer_message: string;
    call_to_action: string;
    reach_to_sale: string;
    hours_per_week: string;
    assets_needed: string;
};

// -------- Quest 4: Financials --------
export type Costs = {
    // Section A: Materials & Production
    raw_materials_per_unit: number;
    manufacturing_cost_per_unit: number;
    packaging_cost_per_unit: number;
    delivery_cost_per_unit: number;
    // Section B: Fixed Costs
    equipment_costs: number;
    subscription_costs: number;
    rent_costs: number;
    other_fixed_costs: number;
    // Section C: People & Time
    people_cost: number;
    your_time_hours: number;
    your_hourly_rate_goal: number;
    // Section D: Acquisition
    acquisition_cost_per_customer: number;
    // Auto-calculated
    total_variable_cost_per_unit: number;
    total_monthly_fixed_costs: number;
    your_time_cost_per_unit: number;
};

export type CostAnalysis = {
    economies_of_scale: string;
    biggest_cost_driver: string;
    cost_reduction_plan: string;
};

export type Profitability = {
    // Auto-calculated
    price_per_sale: string;
    total_cost_per_sale: number;
    profit_per_sale: number;
    sales_to_cover_fixed_costs: number;
    sales_to_pay_yourself: number;
    effective_hourly_rate: number;
    setup_costs: number;
    sales_to_break_even_on_setup: number;
    // User input
    realistic_90_day_sales: number;
    monthly_fixed_costs_covered: "yes" | "maybe" | "no";
    hourly_rate_acceptable: "yes" | "maybe" | "no";
};

// -------- Quest 5: Decision --------
export type FinalCheck = {
    profit_positive: "yes" | "no";
    break_even_90_days: "yes" | "maybe" | "no";
    hourly_rate_acceptable: "yes" | "maybe" | "no";
    cut_costs_50_percent: "yes" | "maybe" | "no";
    raise_price_50_percent: "yes" | "maybe" | "no";
    biggest_failure_risk: string;
};

export type Decision = {
    final_check: FinalCheck;
    decision: "go" | "iterate" | "no_go";
    iteration_changes: string | null;
    iteration_count: number | null;
    ai_recommendation: string | null;
};

export type FinancialBlueprint = {
    costs: Costs | null;
    cost_analysis: CostAnalysis | null;
    profitability: Profitability | null;
    decision: Decision | null;
};


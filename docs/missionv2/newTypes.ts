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


// complete project type definition
type Project = {
    biz_name: string | null;
    competitive_landscape: JSON
    compliance_checklist: JSON;
    created_at: string;
    discovery_metrics: JSON;
    financial_blueprint: JSON;
    five_word_hook: string | null;
    id: string;
    infrastructure_nodes: JSON;
    is_active: boolean;
    launch_data: JSON;
    review_data: JSON;
    solution_design: JSON;
    status: string;
    tagline: string | null;
    updated_at: string;
    user_id: string;
    validation_data: JSON; // customer avatar comes here should be separate field
    viability_check: JSON;
}

type ProjectCreationFormSchema = {
    biz_name: string;
    five_word_hook: string;
    tagline: string;
}


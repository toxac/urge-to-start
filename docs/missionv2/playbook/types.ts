// types/mission.ts

/**
 * Core Program Types - Mission, Quests, Tasks
 * Used for program configuration and content structure
 */

// ============================================
// MISSION
// ============================================

export type MissionSchema = {
    id: string;
    title: string;
    content: string | null;
    content_path: string;
    sequence: number;
    video_url: string | null;
    big_question: string | null;
    estimated_time_in_days: number;
    quests: QuestSchema[];
    context: string[];
    success_message: string;
};

// ============================================
// QUEST
// ============================================

export type QuestSchema = {
    id: string;
    title: string;
    content_path: string;
    video_url: string | null;
    sequence: number;
    estimated_in_app_minutes: number;
    estimated_off_app_minutes: number;
    content: string | null;
    context: string[] | null;
    on_success: {
        grant_points: number;
        badge_key: string;
    };
    notes: NoteSchema[] | null;
    challenges: ChallengeSchema[] | null;
    tasks: TaskSchema[];
    success_message: string;
};

// ============================================
// NOTES
// ============================================

export type NoteSchema = {
    title: string;
    type: "requirement" | "warning" | "guide" | "nudge";
    content: string;
    related_url: string | null;
};

// ============================================
// CHALLENGES
// ============================================

export type ChallengeSchema = {
    title: string;
    description: string;
    link: string;
};

// ============================================
// TASKS
// ============================================

export type TaskSchema = {
    id: string;
    title: string;
    sequence: number;
    execution_type: ExecutionType;
    estimated_minutes: number;
    briefing_text: string;
    mission_id: string;
    quest_id: string;
    execution_environment: string | null;
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
    dependencies: string[] | null;
    target_count?: number | null;
};

// ============================================
// TASK TYPES - ENUMS
// ============================================

export type ExecutionType = 
    | "standard-form" 
    | "simulator" 
    | "off-task-action" 
    | "observation-form" 
    | "dashboard-view"
    | "log_counter";


// ============================================
// REFERENCES
// ============================================

export type ReferenceSchema = {
    type: "insights" | "guide" | "tools" | "youtube" | "podcast" | "book" | "other";
    isInternal: boolean;
    isRequired: boolean;
    url_link: string;
    title: string;
};

// ============================================
// AI CONFIG
// ============================================

export type AIConfigSchema = {
    role: string;
    persona_name: string;
    persona_prompt: string;
    required_context: string[] | null;
};

// ============================================
// OBSERVATION CONTEXT
// ============================================

export type ObservationContext = {
    category: string;
    reference: string;
};

// ============================================
// USER DATA TYPES (for form storage)
// These map to JSON fields in profiles table
// ============================================

// Motivation Form -> profiles.motivations
export type ProfileMotivationSchema = {
    push: string;
    push_other: string | null;
    pull: string;
    pull_other: string | null;
    urgency: string;
    urgency_other: string | null;
    why_statement: string;
};

// Commitment Form -> profiles.commitment
export type ProfileCommitmentSchema = {
    time_to_launch: number; // in months
    weekly_hours: number;
    capital: number | null;
};

// Roadblock Form -> profiles.roadblocks
export type ProfileRoadblockSchema = {
    roadblocks: string[] | null;
    roadblocks_other: string | null;
};

// Social Footprint Form -> profiles.social_footprint (array)
export type ProfileSocialFootprintSchema = {
    type: "platform" | "clubs" | "professional" | "network" | "other";
    name: string;
    profile_link_url: string;
    total_connections: number | null;
};

// Skills Form -> profiles.skills (array)
export type ProfileSkills = {
    category: string;
    title: string;
    level: string;
};

// ============================================
// USER CONTACT TYPES (for Cheer Squad)
// Maps to user_contacts table
// ============================================

export type UserContactSchema = {
    id: string; // uuid auto
    user_id: string; // fk auth
    project_id: string; // fk projects table

    // Basic Info
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    company: string;
    job_title: string;

    // Social
    linkedin_url: string;
    instagram_username: string;
    twitter_handle: string;

    // Classification
    categories: UserContactCategory[];
    status: UserContactStatus;
    source: UserContactSource;
    stage: UserContactStage;

    // Internal notes
    notes: string[];

    // Communication tracking
    last_contacted_at: string;
    next_follow_up_at: string;

    // Flag for email lists
    opted_in_newsletter: boolean;

    // Extra metadata
    metadata: Record<string, any>;

    // Timestamps
    created_at: string;
    updated_at: string;
};

export type UserContactStatus = 'active' | 'inactive' | 'lost';

export type UserContactSource =
    | 'personal_network'
    | 'social_media'
    | 'website_form'
    | 'referral'
    | 'outbound'
    | 'customer_interview'
    | 'partnership_outreach'
    | 'urge_community'
    | 'other';

export type UserContactStage =
    | 'lead'
    | 'engaged'
    | 'pre_sale'
    | 'customer'
    | 'advocate'
    | 'cold'
    | 'nurturing';

export type UserContactCategory =
    | 'squad'
    | 'partner'
    | 'tester'
    | 'presales'
    | 'customer';

// ============================================
// PROFILE TYPES (for user profile)
// ============================================

export type UserAgeGroup = 
    | "under_18"
    | "18_24"
    | "25_34"
    | "35_44"
    | "45_54"
    | "55_plus";

export type EducationLevel = 
    | "high_school"
    | "undergraduate_degree"
    | "postgraduate_degree"
    | "self_taught";

export type UserRoles = 
    | "base"
    | "enrolled"
    | "member"
    | "provider"
    | "mentor"
    | "superadmin"
    | "admin_marketing"
    | "admin_accounts";

export type ProfileAssessmentSchema = {
    assessment_type: string;
    observation: string;
    recommendation: string[];
    score: number;
};

// ============================================
// OPPORTUNITY TYPES
// ============================================

export type OpportunitySource = 
    | "personal_problems"
    | "skills"
    | "zone_of_influence"
    | "broader_search";

export type OpportunityStatus = 
    | "raw_seed"
    | "archived"
    | "shortlisted"
    | "selected";

export type OpportunityAssessment = {
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
};

// ============================================
// USER OBSERVATION TYPES
// ============================================

export type UserObservationSchema = {
    id: string;
    user_id: string;
    title: string;
    reference: ObservationReference | null;
    content: string;
    program_item_type: ProgramItemType | null;
    program_item_id: string | null;
    project_id: string | null;
    opportunity_id: string | null;
    context: JSON | null;
    tags: string[] | null;
    additional_data: JSON | null;
    comments: UserComment[] | null;
    created_at: string;
    updated_at: string;
};

export type ProgramItemType = "mission" | "quest" | "task";

export type ObservationReference = {
    referenceTable: string;
    category: string;
};

export type UserComment = {
    title: string;
    content: string;
    user_id: string;
    username: string;
    created_at: string;
    updated_at: string;
};

// ============================================
// TASK EXECUTION SPECIFIC TYPES
// These are used by the form components
// ============================================

// Form field types for dynamic form rendering
export type FormFieldType = 
    | "input"
    | "textarea"
    | "select"
    | "multi-select"
    | "number"
    | "checkbox"
    | "radio"
    | "date"
    | "time";

export type FormFieldOption = {
    value: string | number;
    label: string;
};

export type FormField = {
    type: FormFieldType;
    label: string;
    hint?: string;
    placeholder?: string;
    options?: FormFieldOption[];
    conditional?: string; // e.g., "push == 'other'"
    optional?: boolean;
    min?: number;
    max?: number;
};

// Component form configuration - used by component_key to render the right form
export type ComponentFormConfig = {
    componentKey: string;
    fields: Record<string, FormField>;
    saveTo: "profile" | "user_contacts" | "user_observations" | "none";
    profileField?: string; // e.g., "motivations", "commitment", "roadblocks", "social_footprint", "skills"
};

// ============================================
// PROGRAM PLAYBOOK CONFIG
// ============================================

export type PlaybookConfig = {
    missions: {
        sequence: string[]; // mission ids in order
        content: {
            [missionId: string]: {
                path: string;
                quests: {
                    [questId: string]: {
                        path: string;
                        tasks: {
                            [taskId: string]: {
                                componentKey: string;
                                formConfig?: ComponentFormConfig;
                            };
                        };
                    };
                };
            };
        };
    };
    ai_config: {
        [taskId: string]: AIConfigSchema;
    };
};
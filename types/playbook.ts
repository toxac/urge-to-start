// types/playbook.ts
import { Database } from './supabase';

// 1. EXTRACT ENUMS DIRECTLY FROM SUPABASE TYPES
export type ExecutionType = Database['public']['Enums']['execution_type'];
export type ReferenceType = Database['public']['Enums']['reference_type'];
export type NoteType = Database['public']['Enums']['note_type'];

// 2. EXTRACT TABLE ROWS DIRECTLY FROM SUPABASE TYPES
export type MissionRow = Database['public']['Tables']['missions']['Row'];
export type QuestRow = Database['public']['Tables']['quests']['Row'];
export type TaskRow = Database['public']['Tables']['tasks']['Row'];

// 3. DEFINE LOCAL TYPES EXCLUSIVELY FOR JSONB & BLUEPRINT CONFIGS

export type BadgeConfig = {
    key: string;
    title: string;
    description: string;
    unlocked_identity: string;
    icon_key: string;
};

export type NoteSchema = {
    title: string;
    type: NoteType;
    content: string;
    related_url: string | null;
};

export type ChallengeSchema = {
    title: string;
    description: string;
    link: string;
};

export type ReferenceSchema = {
    type: ReferenceType;
    isInternal: boolean;
    isRequired: boolean;
    url_link: string;
    title: string;
};

export type AIConfigSchema = {
    role: string;
    persona_name: string;
    persona_prompt: string;
    required_context: string[] | null;
};

export type ObservationContextSchema = {
    category: string;
    reference: string;
};

// 4. COMBINED TYPED SCHEMAS FOR APPLICATION RENDERING & PLAYBOOK CACHE
export type TaskMetadata = {
    scenarios?: string[];
    [key: string]: any;
};

export type TaskSchema = Omit<
    TaskRow,
    'resources' | 'observation_context' | 'on_success' | 'challenges' | 'ai_config' | 'metadata'
> & {
    resources: ReferenceSchema[];
    observation_context: ObservationContextSchema | null;
    grant_points: number; // ⚡ Direct point reward per task
    challenges: ChallengeSchema[] | null;
    ai_config: AIConfigSchema | null;
    metadata?: TaskMetadata;
};

export type QuestSchema = Omit<
    QuestRow,
    'context' | 'on_success' | 'notes'
> & {
    context: string[] | null;
    badge_config: BadgeConfig | null; // ⚡ Chapter completion trophy
    notes: NoteSchema[] | null;
    tasks: TaskSchema[];
};

export type MissionSchema = Omit<
    MissionRow,
    'context'
> & {
    context: string[];
    badge_config: BadgeConfig | null; // ⚡ Major milestone trophy
    quests: QuestSchema[];
};

export type PlaybookConfig = Record<string, MissionSchema>;
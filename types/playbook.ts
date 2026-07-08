// types/playbook.ts
import { Database, Tables, TablesInsert, Enums } from '@/types/supabase';

// ⚡ Directly use database table row types
type MissionRow = Tables<'missions'>;
type QuestRow = Tables<'quests'>;
type TaskRow = Tables<'tasks'>;

// ⚡ Reuse database enums
export type TaskType = Enums<'task_execution_type'>; 
// 'form' | 'simulator' | 'log_counter' | 'action' | 'community' | 'observation'

export type RecommendationType = Enums<'recommendation_type'>;
// 'blog' | 'internal_link' | 'youtube' | 'podcast' | 'book' | 'challenge' | 'download'

export type RecurrenceInterval = Enums<'recurrence_interval'>;
// 'daily' | 'weekly' | 'monthly' | 'quarterly'

// ⚡ Custom types that will be stored as JSON in the database
export interface TaskRecommendation {
  title: string;
  type: RecommendationType;
  path_or_url: string;
  subtitle?: string;
}

// ⚡ Custom types that will be stored as JSON in the database
export interface TaskAiConfig {
  recommendations?: TaskRecommendation[];
  reflection_prompt?: string;
  observation_prompt?: string;
  observation_analysis_prompt?: string;
}

// ⚡ Custom types that will be stored as JSON in the database
export interface ObservationConfig {
  pdf_url?: string;
  guide_questions?: string[];
  min_observations?: number;
  observation_period_days?: number;
  description?: string;
}

export interface AiConfig {
  role: 'SYSTEM_CONDUCTOR';
  persona_name: string;
  persona_prompt: string;
  required_context: Array<'user_profiles' | 'opportunities' | 'projects'>;
  evaluation_rules?: string;
  on_success: {
    grant_points: number;
    badge_key?: string;
    badge_db_id?: string; 
    unlock_next_quest?: string;
  };
}

export interface MissionPrerequisite {
  item: string;
  promptRawText?: string | null; 
}

export interface Task extends Omit<TaskRow, 'ai_config' | 'observation_config' | 'metadata_config' | 'recommendations' | 'created_at' | 'updated_at'> {
  // Override JSON fields with typed versions
  ai_config: TaskAiConfig | null;
  observation_config: ObservationConfig | null;
  metadata_config: Record<string, any>;
  // ⚡ interval already uses the enum type from the database
  // No need to override it - it's already RecurrenceInterval | null
}

export interface Quest extends Omit<QuestRow, 'created_at' | 'updated_at'> {
  // ⚡ Playbook-only fields (not in database)
  content_path: string;
  tasks: Task[];
}



// ⚡ MISSION: Extends database row
export interface Mission extends Omit<MissionRow, 'prerequisites' | 'created_at' | 'updated_at'> {
  // Override JSON field with typed version that's compatible with Json
  prerequisites: MissionPrerequisite[] | null;
  
  // ⚡ Playbook-only fields (not in database)
  content_path: string;
  quests: Record<string, Quest>;
}

// ⚡ MASTER TYPE: Maps your overarching mission keys (e.g., 'mission1') smoothly
export type PlaybookConfig = Record<string, Mission>;
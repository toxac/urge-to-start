export type TaskType = 'form' | 'simulator' | 'log_counter' | 'action' | 'community';

export interface TaskResourceConfig {
  title: string;
  content_path: string; // ⚡ FIXED: Paths point directly to local markdown documents
}

export interface TaskAiConfig {
  resources?: TaskResourceConfig[];
  alternative_approach?: string; // ⚡ OPTIONAL
  challenge?: string;            // ⚡ OPTIONAL: Gives users extra push objectives
  reflection_prompt?: string;    // ⚡ OPTIONAL
}

export interface Task {
  db_id?: string; 
  id: string; 
  title: string;
  type: TaskType;
  component_key: string;
  sequence: number;
  grant_points: number;
  description?: string;
  execution_environment?: 'on_app' | 'off_app'; // ⚡ NEW: Tracking environments
  checkback_delay_days?: number;                // ⚡ NEW: Real-world delay thresholds
  metadata_config?: Record<string, any>;
  ai_config?: TaskAiConfig; 
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

export interface Quest {
  db_id?: string; 
  slug: string;
  title: string;
  subtitle: string;
  description: string; // ⚡ NEW: Elaborate friendly overview context
  sequence: number;
  content_path: string; 
  content_markdown?: string; 
  is_optional?: boolean;
  ai_config: AiConfig;
  tasks: Task[];
}

export interface MissionPrerequisite {
  item: string;
  promptKey: string | null;
  promptRawText?: string; // ⚡ NEW: Keeps prompt copy self-contained inside config rows
}

export interface Mission {
  db_id?: string; 
  title: string;
  sequence: number;
  video_url: string;
  briefing_text: string;
  briefing_markdown?: string; 
  prerequisites: MissionPrerequisite[]; 
  quests: Record<string, Quest>;
}

export type PlaybookConfig = Record<string, Mission>;
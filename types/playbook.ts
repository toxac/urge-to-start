export type TaskType = 'form' | 'simulator' | 'log_counter' | 'action' | 'community';

export interface Task {
  id: string; // Global identification code (e.g., 'm1_q1_t1_profile')
  title: string;
  type: TaskType;
  component_key: string; // Ties directly to your frontend React registration list
  sequence: number;
  metadata_config?: Record<string, any>;
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
    unlock_next_quest?: string;
  };
}

export interface Quest {
  slug: string;
  title: string;
  subtitle: string;
  sequence: number;
  content_path: string; // Local storage path to the clean .md briefing text
  is_optional?: boolean;
  ai_config: AiConfig;
  tasks: Task[];
}

export interface Mission {
  title: string;
  sequence: number;
  video_url: string;
  briefing_text: string;
  quests: Record<string, Quest>; // Nested key dictionary for lightning-fast lookups
}

// The master dictionary layout type engine definition
export type PlaybookConfig = Record<string, Mission>;
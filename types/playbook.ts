export type TaskType = 'form' | 'simulator' | 'log_counter' | 'action' | 'community';

export interface Task {
  id: string; // Global identification string (e.g., 'm1_q1_t1_profile')
  title: string;
  type: TaskType;
  component_key: string; // Maps straight to your dynamic React UI registration dictionary
  sequence: number;
  metadata_config?: Record<string, any>; // Flexible parameters bucket for validation math or limits
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
  content_path: string; // Pure file storage locator pointing to its explicit '.md' text briefing
  is_optional?: boolean;
  ai_config: AiConfig;
  tasks: Task[];
}

export interface Mission {
  slug: string;
  title: string;
  sequence: number;
  video_url: string;
  briefing_text: string;
  quests: Quest[];
}

export type Playbook = Mission[];
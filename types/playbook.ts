export type TaskType = 'form' | 'simulator' | 'log_counter' | 'action' | 'community';
export type AccomplishmentType = 'program_milestone' | 'contribution' | 'engagement' | 'launch_tier';

export interface Task {
  db_id?: string; // Appended dynamically by sync script
  id: string; // Global static ID (e.g., 'm1_q1_t1_profile')
  title: string;
  type: TaskType;
  component_key: string;
  sequence: number;
  grant_points: number;
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
    badge_db_id?: string; // Appended dynamically by sync script
    unlock_next_quest?: string;
  };
}

export interface Quest {
  db_id?: string; // Appended dynamically by sync script
  slug: string;
  title: string;
  subtitle: string;
  sequence: number;
  content_path: string; // File path location e.g., "content/mission1/quests/your-goals.md"
  content_markdown?: string; // Loaded dynamically from physical disk by sync script
  is_optional?: boolean;
  ai_config: AiConfig;
  tasks: Task[];
}

export interface Mission {
  db_id?: string; // Appended dynamically by sync script
  title: string;
  sequence: number;
  video_url: string;
  briefing_text: string;
  briefing_markdown?: string; // Loaded dynamically from mission.md by sync script
  quests: Record<string, Quest>;
}

export type PlaybookConfig = Record<string, Mission>;
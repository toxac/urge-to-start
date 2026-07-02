export type TaskType = 'form' | 'simulator' | 'log_counter' | 'action' | 'community';
export type RecommendationType = 'blog' | 'internal_link' | 'video' | 'podcast' | 'book';

export interface TaskRecommendation {
  title: string;
  type: RecommendationType;
  path_or_url: string; 
  subtitle?: string;   
}

export interface TaskAiConfig {
  recommendations?: TaskRecommendation[]; 
  challenge?: string;                    
  reflection_prompt?: string;            
}

export interface Task {
  db_id?: string; 
  id: string; 
  title: string;
  type: TaskType;
  component_key: string;
  sequence: number;
  estimated_minutes: number;
  grant_points: number;
  description?: string;
  execution_environment?: 'on_app' | 'off_app'; 
  checkback_delay_days?: number;                
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
  description: string; 
  sequence: number;
  content_path: string; 
  estimated_in_app_minutes: number;  
  estimated_off_app_minutes: number; 
  content_markdown?: string; 
  is_optional?: boolean;
  ai_config: AiConfig;
  tasks: Task[];
}

export interface MissionPrerequisite {
  item: string;
  promptRawText?: string; 
}

export interface Mission {
  db_id?: string; 
  title: string;
  sequence: number;
  video_url: string;
  content_path: string; 
  briefing_text: string;
  briefing_markdown?: string; 
  prerequisites: MissionPrerequisite[]; 
  // ⚡ FIXED: Explicitly typed as a flexible Record string mapping to match mission1 template keys
  quests: Record<string, Quest>; 
}

// ⚡ MASTER TYPE: Maps your overarching mission keys (e.g., 'mission1') smoothly
export type PlaybookConfig = Record<string, Mission>;
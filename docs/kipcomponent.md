# Summary of KIP feature and Mechanisms

## Contexts
Kip will be integrated in two contexts and will have following functions

### Dashboard

**Features**
- Any event annoucements and notifications
- user posts suggestions (to be implemented later after we built out/activate network)
- interesting members from network to connect
- tracking engagement and if users have been away for too long give them a quick summary and checklist to bring them upto speed

### Mission Page

**Features**
- What would they need for the quests in the mission, prerequesits 

### Quest Page

**Features**
- Retrospectives - after a task is complete
- Resources Bridge and Summarization - when a task begins
- Alternative approaches -> when task is active or completed
- award points and badges -> after task is complete


## Mechanism

### Dashboard
- when user visits dashboard, kip should call database and show button
    - if they have been away for more than 7 days then give them summary of last quests they completed
    - after showing the summary show them
        - x new notification
        - x events that you would be interested in
        - user post you might like
        - users you would like to connect

### Mission Page
**prerequesits** 
- show them prequestises for quests in the missions from the config/playbook
- each item in the list can have button "find out more" use the ai api to get more details given this context

### Quest Page

**As the task starts, trigger :progress_status "in_progress"**
    - show the related resources with link from the playbook with buttion for summarizing
    - if user presses the button then summarize the resource
    - after summarization kip can ask if user wants an alternative approach (button)
    - if user selects yes then generate alternate approaches
    - have a button to go back to all resources
    - note we should keep all the generated things in database in kip_logs, so when user revisits the page they can see it again
    - we dont have to generate things if its already in database


**As the task completes, trigger :  progress_status "complete"**
    1. award points and badges
    2. ask user about their experience with the task, what did they learn, how they felt etc. the question will come from the playbook/config. Show them input box component with reply button
    3. based on the response kip will generate text from ai validating, encouraging or celebrating users accomplishment
    4. after the text ask them if they want to save their thoughts to their journal thorugh

## State and context for kip

- page type (dashboard/mission/quest)
- user context
- current quest/task context
- resources

## Important code and db References

### Related tables

```ts
user_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          item_type: Database["public"]["Enums"]["program_item_type"]
          mission_id: string | null
          project_id: string | null
          quest_id: string | null
          saved_payload: Json
          status: Database["public"]["Enums"]["progress_status"]
          task_id: string | null
          updated_at: string
          user_id: string
        }},
tasks: {
        Row: {
          component_key: string
          created_at: string
          description: string
          grant_points: number
          id: string
          metadata_config: Json
          mission_id: string
          quest_id: string
          sequence: number
          title: string
          type: Database["public"]["Enums"]["task_execution_type"]
          updated_at: string
        }},
quests: {
        Row: {
          badge_key_reward: string | null
          content: string
          created_at: string
          grant_points_bonus: number
          id: string
          is_optional: boolean
          mission_id: string
          persona_name: string
          persona_prompt: string
          required_context: string[]
          sequence: number
          slug: string
          subtitle: string
          title: string
          updated_at: string
        }},
profiles: {
        Row: {
          accumulated_xp: number
          address: string | null
          age_group: Database["public"]["Enums"]["user_age_group"] | null
          avatar_url: string | null
          capital_available_local: number
          city: string | null
          constraints: Json
          core_driver: Json | null
          country: string
          currency: string
          description: string | null
          full_name: string | null
          highest_education:
            | Database["public"]["Enums"]["education_tier"]
            | null
          id: string
          mentor_metadata: Json
          onboarding_step: number
          provider_metadata: Json
          role: Database["public"]["Enums"]["user_platform_role"]
          social_profiles: Json
          updated_at: string
          username: string
        }},
missions: {
        Row: {
          content: string
          created_at: string
          id: string
          sequence: number
          title: string
          updated_at: string
          video_url: string
        }},
user_accomplishments: {
        Row: {
          awarded_at: string
          badge_key: string
          id: string
          project_id: string | null
          user_id: string
        }}
```

**enum**
progress_status: "not_started" | "in_progress" | "completed"

**progressStore**
```ts
import { atom } from 'nanostores';
import { Database } from '@/types/supabase';

export interface TaskProgressPayload {
  userDraft?: string;
  selectedScenario?: string;
  aiFeedback?: {
    score: number;
    summary: string;
    strengths: string[];
    improvements: string[];
    suggestedRewrite: string;
    realWorldExecutionAdvice: string[];
  };
  hasSharedWithCircle?: boolean;
  hasClaimedVoice?: boolean;
}

// Intersect the raw database Row with our explicit payload definition
export type ProgressRow = Database['public']['Tables']['user_progress']['Row'] & {
  saved_payload: TaskProgressPayload;
};

// The progress map store dictionary [task_id]: ProgressRow
export const $progressStore = atom<Record<string, ProgressRow>>({});

/**
 * 1. Hydrates the progress map store from a raw list array
 */
export function hydrateProgressStore(rows: ProgressRow[]) {
  const initialMap = rows.reduce((acc, row) => {
    // Check if task_id exists and cast it to a string to satisfy object key constraints
    if (row.task_id) {
      acc[row.task_id as string] = row;
    }
    return acc;
  }, {} as Record<string, ProgressRow>);
  
  $progressStore.set(initialMap);
}

/**
 * 2. Simple, generic upsert helper that handles both updates and inserts automatically
 */
export function setProgressStoreRow(row: ProgressRow) {
  if (!row.task_id) {
    console.warn("⚠️ Cannot update progress store: row is missing a valid task_id.");
    return;
  }

  const current = $progressStore.get();
  $progressStore.set({
    ...current,
    [row.task_id as string]: row
  });
}

/**
 * 3. Simple generic deletion helper
 */
export function removeProgressStoreRow(taskId: string) {
  const current = $progressStore.get();
  const updated = { ...current };
  delete updated[taskId];
  $progressStore.set(updated);
}
```
types/playbook.ts

```ts
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
  description?: string;
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

```

snippet from lib/ai/conductor.ts
```ts
interface KipExecutionParams {
  skills: string[];
  userContext?: Record<string, any>;
  prompt: string;
  responseSchema?: z.ZodSchema<any>;
  // Dynamic Model Configuration Options
  model?: 'deepseek-chat' | 'deepseek-v4-pro'; 
  reasoningEffort?: 'low' | 'medium' | 'high';
}
```







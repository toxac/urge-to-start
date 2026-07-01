I have turned our tasks for the day into mini sprints we complete them one by one

## Sprint 1: Database changes (completed)
1. added schedule_config and persona columns to profile
2. created squad table
3. added execution_environment and checkback_delay_days column to tasks table.
4. synced local supabase types 
5. give me RLS policies for squad table (not added)

## Sprint 2: playbook configuration (TO DO NOW)
first lets improve the structure of how we have each entry for missions, quests and task.
### few general things
- we should move each mission entry to separate file and then import all of them to playbook.ts. it makes it easier to manage.
- we will have to update types for playbook
- we ned to check for language everywhere. It should be as a friend speak to another, clear, direct and no jargon.
Check and streamline Ai conductor
- i think we should bring the relevant prompt inside the mission playbook entry, keep its easy
- tell me if i am missing something 


### Quests
    - add elaborate description to quests giving better context
### Tasks
    - alternative_approach: this should be optional
    - challenge: (optional) to mindset and similar tasks we can give user additional challenge they can do on their own, something that makes them go further
    - reflection_prompt: should be optional
    - resources need to fetch markdown file in content folder rather than url

### Attached files
- lib/ai/prompts.ts
- lib/ai/conductor.ts
- lib/playbook.ts
- types/playbook.ts
- ask me if you need to refer to anything 

### types
```ts
export type TaskType = 'form' | 'simulator' | 'log_counter' | 'action' | 'community';
export type AccomplishmentType = 'program_milestone' | 'contribution' | 'engagement' | 'launch_tier';

// ⚡ Dynamic Resource Schema for Task AI config links
export interface TaskResourceConfig {
  title: string;
  url: string;
}

// ⚡ Lighter Task-Level configuration mapping
export interface TaskAiConfig {
  resources?: TaskResourceConfig[];
  alternative_approach?: string;
  reflection_prompt?: string;
}

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
  ai_config?: TaskAiConfig; // ⚡ Attached directly to Task tier
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

// ⚡ Macro Prerequisite structure mapping
export interface MissionPrerequisite {
  item: string;
  promptKey: string | null;
}

export interface Mission {
  db_id?: string; // Appended dynamically by sync script
  title: string;
  sequence: number;
  video_url: string;
  briefing_text: string;
  briefing_markdown?: string; // Loaded dynamically from mission.md by sync script
  prerequisites: MissionPrerequisite[]; // ⚡ Added structural prerequisite array block
  quests: Record<string, Quest>;
}

export type PlaybookConfig = Record<string, Mission>;

```

## Sprint 3: WORKSPACE INTERFACE DEVELOPMENTS (Later)
Build out these components to make the forms and calendar highly interactive:

[ ] Interactive Constraint Micro-Grid: Update the ConstraintForm UI so selecting a time slot (like "Evenings") expands into a clickable day/time grid that saves directly to profiles.schedule_config.

[ ] Ambient .ics Calendar Feed Generator: Create an API route at app/api/calendar/sync/[userId]/route.ts that reads the user's schedule config and outputs a standard iCalendar feed URL.

[ ] Shareable Cheer Squad Link: Add a feature inside the KnownReachoutWidget that generates a unique referral link (/join-squad/[userId]) for users to send to friends, which captures incoming email submissions.

[ ] Kip's Local Post-Execution Pipeline: Rebuild Kip's panel state routing so that upon task completion, the form's data payload is cleanly piped to Kip out of local store memory.

## Sprint 4 : KIP SIDEBAR & TYPOGRAPHY CLEANUP (Later)
Refine the voice and layout hierarchy of the companion:

[ ] Remove Repeating Headers: Ensure Kip never copies text fields or headers from the main screen. Kip should strictly present its specific tactical advice point-of-view.

[ ] Markdown Component Renderer: Build a dedicated formatting block inside KipQuestCoach to style local file summaries cleanly with clear typography, bullet points, and bolds.

[ ] Chat History Collapse Badges: Write the accordion layout logic that gracefully groups past conversations into clean, clickable summary badges at the top of the sidebar feed whenever a user switches tasks.
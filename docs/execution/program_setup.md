
# Implementing Task Forms and Program Pages
Lets first fix the types, program tables, layout and page before we get into creating forms for missions. 
## Sprint1
1. create tables ( edelete existing ones in supabase)
  - missions (from the types below)
  - quests (from the types below)
  - tasks (from the types below)
2. Generate a mission type integrating types from supabase tables and custom app types for json fields
  - mission types types/playbook.ts
  - new mission files in lib/playbook ( we will have to move challenges to tasks)
3. Fix current program pages to use new mission playbooks
4. Update the sidebar to handle rendering complimentary information
  - For mission context: 
    - show updates from platform 
    - if there are any system notifications 
    - current badges earned and points
  - For Quest context:
    - notes 
    - if there are any system notifications
  - For Task context:
    - references (only those have isRequired == false)
    - challenges ( i am moving challenge from quest to tasks )
    - if there are any system notifications

### Important Note
1. Ask me if you need any clarifications or want to see any other file. Don't assume anything
2. Before implementing lets make sure we understand everything and have an implementation plan
3. Once we are ok to implement then lets implement one file at a time
4. I have also added theme details in attachment globals.css


### References
#### Playbook types
Each of this will need new table in supabase and a type file in the app.
```ts

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
    challenges: ChallengeSchema[] | null;
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
    | "log_counter"
    | "decision_gate";


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

```

#### Program Pages and Components
1. app/(platform)/layout.tsx
This should actually be app/(platform)/program/layout.tsx because we dont need the right sidebar for rest fo the platform pages. So we might need to separate authentication to app/(platform)/layout.tsx and right sidebar to app/(platform)/program/layout.tsx

```tsx
// app/(platform)/layout.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { StoreHydrator } from '@/components/providers/StoreHydrator';
import { SidebarComponent } from '@/components/layout/Sidebar'; 
import { KipSidebarCompanion } from '@/components/program/kip/KipSidebarCompanion';

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth');
  }

  const [profileResponse, progressResponse] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('user_progress').select('*').eq('user_id', user.id)
  ]);

  return (
    <div className="w-full h-screen flex bg-background text-foreground antialiased overflow-hidden relative">
      <StoreHydrator 
        initialProgress={(progressResponse.data as any) || []} 
        initialProfile={profileResponse.data as any} 
      />

      <SidebarComponent />

      {/* CENTER AREA: Takes 100% of the screen space on mobile/tablets, then centers out nicely on desktop */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col min-w-0 pt-14 md:pt-0">
        <main className="flex-1 p-5 md:p-10 max-w-4xl w-full mx-auto pb-24">
          {children}
        </main>
      </div>

      {/* RIGHT AREA: Handles desktop columns, floating tabs, and bottom sheet triggers automatically */}
      <KipSidebarCompanion />
    </div>
  );
}

```
2. components/program/kip/KipSidebarCompanion.tsx
this wont be called KipSidebarCompanion as we are moving kip(ai) to be inside the tasl components where ever needed and right sideber is used only to display complimentary information

```tsx
// components/program/kip/KipSidebarCompanion.tsx
'use client';

import React from 'react';
import { useStore } from '@nanostores/react';
import { $companionFocus, setCompanionFocus } from '@/lib/stores/companionStore';
import { $progressStore } from '@/lib/stores/progressStore';
import { $profileStore } from '@/lib/stores/profileStore';
import { urgePlaybook } from '@/lib/playbook';
import { Orbit } from 'lucide-react';

import { KipDashboardView } from './views/KipDashboardView';
import { KipMissionView } from './views/KipMissionView';
import { KipQuestView } from './views/KipQuestView';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

export function KipSidebarCompanion() {
  const focus = useStore($companionFocus);
  const progress = useStore($progressStore);
  const profile = useStore($profileStore); // comes as ProfileRow | null

  const missionId = focus.activeMissionId;
  const questId = focus.activeQuestId;
  const activeTaskId = focus.activeTaskId || null;

  const mission = missionId ? urgePlaybook[missionId] : null;
  const quest = (mission && questId) ? mission.quests[questId] : null;

  const handleStartTask = (taskId: string) => {
    setCompanionFocus({
      pageType: 'quest',
      activeMissionId: missionId,
      activeQuestId: questId,
      activeTaskId: taskId,
    });
  };

  const handleCloseTask = () => {
    setCompanionFocus({
      pageType: 'quest',
      activeMissionId: missionId,
      activeQuestId: questId,
      activeTaskId: null,
    });
  };

  const renderRouterContextContent = () => {
    switch (focus.pageType) {
      case 'dashboard':
        return <KipDashboardView profile={profile} />;
      case 'mission':
        if (!mission) return <p className="text-muted-foreground text-xs">Mission not found.</p>;
        return <KipMissionView mission={mission} missionId={missionId!} />;
      case 'quest':
        if (!mission || !quest) return <p className="text-muted-foreground text-xs">Quest not found.</p>;
        return (
          <KipQuestView
            missionId={missionId!}
            questId={questId!}
            activeTaskId={activeTaskId}
            mission={mission}
            quest={quest}
            progress={progress}
            onStartTask={handleStartTask}
            onCloseTask={handleCloseTask}
          />
        );
      default:
        return <p className="text-muted-foreground text-xs">No context.</p>;
    }
  };

  const triggerStyles =
    'inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-xl border border-primary/20 hover:scale-105 transition active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

  return (
    <>
      {/* DESKTOP PANEL */}
      <aside className="hidden xl:flex w-80 h-full border-l border-border bg-card flex-col overflow-hidden shrink-0 shadow-sm relative z-20">
        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Orbit className="w-4 h-4 text-primary animate-[spin_12s_linear_infinite]" />
            Kip Co-Pilot — {activeTaskId ? 'Task View' : (focus.pageType === 'quest' ? 'Quest View' : 'Overview')}
          </span>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ONLINE
          </div>
        </div>
        <div className="flex-1 overflow-hidden p-4">{renderRouterContextContent()}</div>
      </aside>

      {/* TABLET OVERLAY */}
      <div className="hidden md:flex xl:hidden fixed right-5 bottom-5 z-40">
        <Sheet>
          <SheetTrigger className={triggerStyles}>
            <Orbit className="w-5 h-5 animate-[spin_20s_linear_infinite]" />
          </SheetTrigger>
          <SheetContent side="right" className="w-85 p-0 bg-card border-l border-border flex flex-col">
            <SheetHeader className="p-4 border-b border-border bg-muted/20 shrink-0">
              <SheetTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <Orbit className="w-4 h-4 text-primary" /> Kip Advisor Panel
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-hidden p-4">{renderRouterContextContent()}</div>
          </SheetContent>
        </Sheet>
      </div>

      {/* MOBILE BOTTOM DRAWER */}
      <div className="md:hidden fixed bottom-5 right-5 z-40">
        <Drawer>
          <DrawerTrigger className={triggerStyles}>
            <Orbit className="w-5 h-5 animate-[spin_20s_linear_infinite]" />
          </DrawerTrigger>
          <DrawerContent className="bg-card border-t border-border max-h-[82vh] flex flex-col">
            <DrawerHeader className="p-4 border-b border-border bg-muted/20 shrink-0">
              <DrawerTitle className="text-xs font-bold uppercase text-muted-foreground text-center flex items-center justify-center gap-2">
                <Orbit className="w-4 h-4 text-primary" /> Kip Advisor Hub
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 overflow-hidden p-4 pb-6">{renderRouterContextContent()}</div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}

```
***Kip context views**
a. components/program/kip/views/KipDashboardView.tsx (not really required anymore)
```tsx
// components/program/kip/views/KipDashboardView.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useKipProgress } from '@/hooks/useKipProgress';
import type { ProfileRow } from '@/types/profiles';

interface Props {
  profile: ProfileRow | null;
}

export function KipDashboardView({ profile }: Props) {
  const router = useRouter();
  const { totalCompleted, isDrifting, nextTask } = useKipProgress();

  const handleNavigateToNextTask = () => {
    if (!nextTask) return;
    // Construct the quest slug from the questId (you might need to map)
    // For simplicity, we assume we have a function to get quest slug.
    // We'll use a placeholder: /program/quest/{quest-slug}
    router.push(`/program/quest/${nextTask.questId}`); // adjust as needed
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200 text-xs">
      {/* Friendly Welcome Context Block */}
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-foreground">
          Hey {profile?.full_name || 'Founder'}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          Welcome back to your builder hub. You have successfully locked down{' '}
          <strong className="text-foreground">{totalCompleted}</strong> program goals so far.
        </p>
      </div>

      {/* Proactive Drift Notification Banner */}
      {isDrifting && (
        <div className="p-3 border border-amber-500/20 bg-amber-500/5 rounded-xl space-y-2 animate-in slide-in-from-bottom-2">
          <p className="font-bold text-amber-600 dark:text-amber-400">
            ⏳ Re-engagement Anchor Activated
          </p>
          <p className="text-muted-foreground leading-relaxed">
            It looks like life got in the way and you've been away from your playbook loop for a week. Don't worry—getting distracted is part of the founder sprint.
          </p>
          <Button size="sm" variant="outline" className="h-7 text-[11px] w-full mt-1" onClick={handleNavigateToNextTask}>
            🎯 Review My High-Level Project Targets
          </Button>
        </div>
      )}

      {/* Next Best Action */}
      {nextTask && (
        <div className="p-3 border rounded-xl bg-muted/20 space-y-1">
          <p className="font-semibold text-foreground">Next Milestone Action:</p>
          <p className="text-muted-foreground leading-relaxed">
            Your next step is <strong>"{nextTask.title}"</strong> in the quest <strong>"{nextTask.questTitle}"</strong>.
          </p>
          <Button size="sm" variant="outline" className="h-7 text-[11px] w-full mt-1" onClick={handleNavigateToNextTask}>
            🎯 Start Task
          </Button>
        </div>
      )}

      {/* Static Help */}
      <div className="p-3 border rounded-xl bg-muted/20 space-y-1">
        <p className="font-semibold text-foreground">Need direction?</p>
        <p className="text-muted-foreground leading-relaxed">
          Head into your active Mission overview page to select an uncompleted tactical Quest block and keep building momentum.
        </p>
      </div>
    </div>
  );
}

```

**b. components/program/kip/views/KipMissionView.tsx**
```tsx
// components/program/kip/views/KipMissionView.tsx
'use client';

import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import type { Mission } from '@/types/playbook';

interface Props {
  mission: Mission;
  missionId: string;
}

export function KipMissionView({ mission, missionId }: Props) {
  if (!mission) {
    return <p className="text-xs text-muted-foreground">No active mission focus.</p>;
  }

  const prerequisites = mission.prerequisites || [];

  return (
    <div className="space-y-4 animate-in fade-in duration-200 text-xs overflow-y-auto max-h-full">
      {/* Mission title & briefing */}
      <div>
        <h3 className="text-sm font-bold text-foreground">{mission.title}</h3>
        <p className="text-muted-foreground mt-1 leading-relaxed">{mission.briefing_text}</p>
      </div>

      {/* Prerequisites as a simple checklist */}
      {prerequisites.length > 0 && (
        <div className="pt-2 space-y-2">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Before you begin
          </h4>
          <ul className="space-y-1.5">
            {prerequisites.map((pre, index) => (
              <li key={index} className="flex items-start gap-2 text-foreground">
                <Circle className="w-3 h-3 mt-0.5 text-muted-foreground shrink-0" />
                <span className="leading-relaxed">{pre.item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

```

**c. components/program/kip/views/KipQuestView.tsx**
```tsx
// components/program/kip/views/KipQuestView.tsx
'use client';

import React from 'react';
import { KipBlueprintModule } from '../modules/KipBlueprintModule';
import { KipTaskModule } from '../modules/KipTaskModule';
import type { Mission, Quest} from '@/types/playbook';
import type { ProgressRow } from '@/lib/stores/progressStore';

interface Props {
  missionId: string;
  questId: string;
  activeTaskId: string | null;
  mission: Mission | null;
  quest: Quest | null;
  progress: Record<string, ProgressRow>;
  onStartTask: (taskId: string) => void;
  onCloseTask: () => void;
  onProgressUpdate?: (taskId: string, payload: any) => void;
}

export function KipQuestView({
  missionId,
  questId,
  activeTaskId,
  mission,
  quest,
  progress,
  onStartTask,
  onCloseTask,
  onProgressUpdate,
}: Props) {
  if (!quest) {
    return <p className="text-muted-foreground italic text-center py-4">Quest not found.</p>;
  }

  // If we have an active task, render the task module
  if (activeTaskId) {
    const task = quest.tasks.find((t) => t.id === activeTaskId);
    if (!task) {
      return <p className="text-muted-foreground italic text-center py-4">Task not found.</p>;
    }
    return (
      <KipTaskModule
        task={task}
        questId={questId}
        missionId={missionId}
        progress={progress}
        onCloseTask={onCloseTask}
        onProgressUpdate={onProgressUpdate}
      />
    );
  }

  // Otherwise render the blueprint (overview)
  return (
    <KipBlueprintModule
      quest={quest}
      missionId={missionId}
      progress={progress}
      onStartTask={onStartTask}
    />
  );
}

```


3. app/(platform)/program/mission/[id]/page.tsx
main mission page
```tsx
'use client';
// app/(platform)/program/mission/[id]/page.tsx
import React, { useEffect, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { $playbookStore, setCompanionFocus } from '@/lib/stores/companionStore';
import { $progressStore } from '@/lib/stores/progressStore';
import { Button } from '@/components/ui/button';
import {MissionHeader} from '@/components/layout/MissionHeader';
import { ChevronLeft, PlayCircle, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';


export default function MissionRoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const playbook = useStore($playbookStore);
  const progress = useStore($progressStore);

  const missionId = params.id as string;
  const currentMission = playbook[missionId];

  // State for markdown content
  const [markdownHtml, setMarkdownHtml] = useState<string | null>(null);
  const [loadingMarkdown, setLoadingMarkdown] = useState(false);

  // 1. Sync Companion
  useEffect(() => {
    if (currentMission) {
      setCompanionFocus({
        pageType: 'mission',
        activeMissionId: missionId,
      });
    }
  }, [currentMission, missionId]);

  // 2. Fetch markdown content when mission loads
  useEffect(() => {
    if (currentMission?.content_path) {
      setLoadingMarkdown(true);
      fetch(`/api/markdown?path=${encodeURIComponent(currentMission.content_path)}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to load markdown');
          return res.text();
        })
        .then(html => {
          setMarkdownHtml(html);
        })
        .catch(err => {
          console.error('Error loading markdown:', err);
          setMarkdownHtml(null);
        })
        .finally(() => setLoadingMarkdown(false));
    }
  }, [currentMission]);

  if (!currentMission) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-32 animate-in fade-in duration-200">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span className="text-xs font-sans font-medium text-muted-foreground tracking-wide">
          Fetching mission details ...
        </span>
      </div>
    );
  }

  // 3. Convert quests
  const quests = Object.entries(currentMission.quests || {})
    .map(([key, data]) => ({ key, ...data }))
    .sort((a, b) => a.sequence - b.sequence);

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-300">

      {/* Back Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-5">
        <button
          onClick={() => {
            startTransition(() => {
              router.push('/platform/program');
            });
          }}
          disabled={isPending}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition flex-row"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Roadmap
        </button>
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground/60">
          Mission Brief
        </span>
      </div>

      {/* Header & Video */}
      <div className="pt-4">
        <MissionHeader
          sequence={currentMission.sequence}
          title={currentMission.title}
        />
      </div>

      {/* Video Player */}
      {currentMission.video_url && (
        <div className="aspect-video rounded-xl overflow-hidden border border-border bg-black/5">
          <video
            src={currentMission.video_url}
            controls
            className="w-full h-full object-contain"
            preload="metadata"
            playsInline
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Markdown Content */}
      {loadingMarkdown && (
        <div className="py-8 text-center text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
          Loading mission content...
        </div>
      )}
      {markdownHtml && !loadingMarkdown && (
        <div
          className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground prose-ul:text-muted-foreground prose-li:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: markdownHtml }}
        />
      )}
      {!markdownHtml && !loadingMarkdown && (
        <div className="py-8 text-center text-muted-foreground text-sm">
          No additional content available for this mission.
        </div>
      )}

      {/* Quests List */}
      <div className="space-y-4 pt-4">
        <div className="pb-2 border-b border-border/60">
          <h3 className="text-lg font-sans font-bold uppercase tracking-widest text-muted-foreground tracking-wider">
            Quests 
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {quests.map((quest) => {
            const totalTasks = quest.tasks?.length || 0;
            const completedTasks = quest.tasks?.filter(t => progress[t.id]?.status === 'completed').length || 0;
            const isCompleted = totalTasks > 0 && completedTasks === totalTasks;
            const isStarted = completedTasks > 0 && completedTasks < totalTasks;

            return (
              <div
                key={quest.key}
                onClick={() => router.push(`/program/quest/${quest.slug}`)}
                className="group bg-card/40 border border-primary/30 rounded-2xl p-6 shadow-sm hover:border-primary/80 transition duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden"
              >
                <div className="space-y-1.5 flex-1 text-left">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-muted-foreground">
                      Quest 0{quest.sequence}
                    </span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[9px] font-sans font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3 fill-emerald-500/10" /> Completed
                      </span>
                    )}
                    {isStarted && (
                      <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        In Progress
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {quest.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-md font-medium">
                    {quest.subtitle}
                  </p>
                </div>

                <div className="shrink-0 flex items-center justify-start sm:justify-end text-xs font-bold text-primary group-hover:translate-x-0.5 transition pr-1">
                  <span>{isCompleted ? 'Review Logs' : 'Start Quest'}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

```

4. app/(platform)/program/quest/[slug]/page.tsx
Quest page that renders all the tasks

```tsx
'use client';
// app/(platform)/program/quest/[slug]/page.tsx
import React, { useEffect, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { $playbookStore, setCompanionFocus } from '@/lib/stores/companionStore';
import { $progressStore } from '@/lib/stores/progressStore';
import { $profileStore } from '@/lib/stores/profileStore'; 
import { TaskFormRegistry } from '@/components/program/TaskFormRegistry'; 
import { ChevronLeft, CheckCircle2, Lock, Eye, Play, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QuestActionCenterPage() {
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const playbook = useStore($playbookStore);
  const progress = useStore($progressStore);
  const profile = useStore($profileStore);

  // ⚡ FIXED: Starts explicitly as null so the page loads in Quest View context first!
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  let activeMissionId = '';
  let activeQuestKey = '';
  let currentQuest: any = null;

  Object.entries(playbook || {}).forEach(([mId, mission]) => {
    Object.entries(mission.quests || {}).forEach(([qKey, quest]) => {
      if (quest.slug === params.slug) {
        activeMissionId = mId;
        activeQuestKey = qKey;
        currentQuest = quest;
      }
    });
  });

  const tasks = currentQuest?.tasks || [];
  const currentUserId = profile?.id || '';

  // Calculate high-level stats
  const completedCount = tasks.filter((t: any) => progress[t.id]?.status === 'completed').length;
  const progressRatioPercentage = Math.min(100, Math.floor((completedCount / tasks.length) * 100));
  const nextIncompleteTask = tasks.find((t: any) => progress[t.id]?.status !== 'completed');

  // Sync companion context whenever selection changes
  useEffect(() => {
    setCompanionFocus({
      pageType: 'quest',
      activeMissionId,
      activeQuestId: activeQuestKey,
      activeTaskId: activeTaskId, // Pass string ID or null cleanly to Kip store helper
    });
  }, [activeTaskId, activeMissionId, activeQuestKey]);

  if (!currentQuest) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-32 animate-in fade-in duration-200">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span className="text-xs font-sans font-medium text-muted-foreground tracking-wide">
          Opening workspace parameters...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">

      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-5">
        <button
          onClick={() => {
            startTransition(() => {
              router.push(`/platform/program/mission/${activeMissionId}`);
            });
          }}
          disabled={isPending}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Roadmap
        </button>
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground/60">
          Quest Work Center
        </span>
      </div>

      {/* Quest Meta Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-muted/30 border border-border p-6 rounded-2xl">
        <div className="space-y-1 text-left">
          <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            Active Chapter Focus
          </span>
          <h1 className="text-xl font-bold tracking-tight text-foreground pt-1.5">
            {currentQuest.title}
          </h1>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-xl">
            {currentQuest.subtitle}
          </p>
        </div>

        <div className="space-y-1 shrink-0 text-left md:text-right">
          <span className="text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-wider block">Chapter Progress</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted border border-border rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressRatioPercentage}%` }} />
            </div>
            <span className="text-xs font-bold text-foreground">{progressRatioPercentage}%</span>
          </div>
        </div>
      </div>

      {/* ─── WORKSPACE LAYOUT SWITCHER ─── */}
      {activeTaskId ? (
        /* TASK EXECUTION BUBBLE VIEW */
        (() => {
          const activeTask = tasks.find((t: any) => t.id === activeTaskId);
          const activeTaskProgress = progress[activeTaskId];
          
          return (
            <div className="border border-primary rounded-2xl bg-card shadow-md p-6 space-y-6 animate-in zoom-in-95 duration-200 text-left">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
                    Executing Step Challenge
                  </span>
                  <h2 className="text-base font-bold text-foreground">{activeTask?.title}</h2>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-[11px] font-semibold"
                  onClick={() => setActiveTaskId(null)} // Returns cleanly to Quest Overview board view!
                >
                  Close Step
                </Button>
              </div>

              <TaskFormRegistry
                task={activeTask}
                userId={currentUserId}
                existingProgress={activeTaskProgress}
                onSuccess={() => {
                  // Simply clear active focus so Kip and layout return safely to Quest context
                  setActiveTaskId(null);
                }}
              />
            </div>
          );
        })()
      ) : (
        /* CHAPTER PROGRESS TIMELINE BOARD VIEW */
        <div className="space-y-4">
          <div className="text-left pb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Chapter Tasks Checklist
            </h3>
          </div>

          {tasks.map((task: any, index: number) => {
            const taskProgress = progress[task.id];
            const isTaskCompleted = taskProgress?.status === 'completed';

            // Locked logic: Task is locked if it's not completed and the prior step isn't cleared yet
            const isLocked = index > 0 && progress[tasks[index - 1].id]?.status !== 'completed';

            return (
              <div
                key={task.id}
                className={`transition-all duration-200 rounded-2xl border p-5 flex items-center justify-between gap-4 text-left ${
                  isLocked
                    ? 'border-border/40 bg-muted/20 opacity-40 pointer-events-none'
                    : 'border-border bg-card/50 hover:border-border-hover cursor-pointer opacity-95 hover:opacity-100 shadow-sm'
                }`}
                onClick={() => {
                  if (!isLocked) setActiveTaskId(task.id);
                }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="shrink-0">
                    {isTaskCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4 text-muted-foreground/60 m-0.5" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-primary/40 flex items-center justify-center text-[10px] font-bold text-primary font-sans">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5 truncate">
                    <h4 className="text-sm font-bold text-foreground truncate tracking-tight">
                      {task.title}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate max-w-xl font-medium">
                      {task.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  {!isLocked && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-xl font-sans text-xs font-bold text-primary hover:text-primary hover:bg-primary/5 px-3 flex items-center gap-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTaskId(task.id);
                      }}
                    >
                      {isTaskCompleted ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review Work</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-primary/10" />
                          <span>Start Task</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Quick Guidance Callout for Next Step */}
          {nextIncompleteTask && (
            <div className="p-4 border rounded-xl bg-muted/20 border-dashed text-left flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>Ready to advance? Select step <strong>"{nextIncompleteTask.title}"</strong> to continue.</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground animate-pulse" />
            </div>
          )}
        </div>
      )}

    </div>
  );
}
```

5. app/(platform)/program/page.tsx
program main page 

```tsx

// app/(platform)/program/page.tsx
'use client';

import React, { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { $playbookStore, setCompanionFocus } from '@/lib/stores/companionStore';
import { $progressStore } from '@/lib/stores/progressStore';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

export default function ProgramDashboardPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const playbook = useStore($playbookStore);
  const progress = useStore($progressStore);

  // 1. Trigger the Global Kip Concierge state for the Dashboard on mount
  useEffect(() => {
    setCompanionFocus({ pageType: 'dashboard' });
  }, []);

  // 2. Transform the raw playbook mapping into a clean ordered tracking stack
  const missions = Object.entries(playbook || {})
    .map(([id, data]) => {
      const { id: _, ...rest } = data; // omit any existing 'id'
      return { id, ...rest };
    })
    .sort((a, b) => a.sequence - b.sequence);

  // 3. Find the exact mission the user is currently working on
  const activeMission = missions.find((mission) => {
    const quests = Object.values(mission.quests || {});
    return quests.some((quest: any) =>
      quest.tasks?.some((task: any) => progress[task.id]?.status !== 'completed')
    );
  }) || missions[0];

  // 4. Calculate overarching program metrics to show progress
  const totalCompletedTasks = Object.values(progress || {}).filter(p => p.status === 'completed').length;

  // ⚡ PROTECTION LAYER: If state stores are empty, show a loading block instead of a broken page
  if (missions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-32 animate-in fade-in duration-200">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-xs font-sans font-medium text-muted-foreground tracking-wide">
          Syncing workspace track...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-300">

      {/* Streamlined Workspace Title Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1">
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary">
            Start
          </span>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">
            Your Missions
          </h1>
          <p className="text-xs text-muted-foreground font-medium max-w-md leading-relaxed">
            No spreadsheets, no hype. Focus entirely on the immediate task in front of you.
          </p>
        </div>

        {/* Simple Progress Telemetry Component */}
        <div className="bg-muted/50 border border-border px-3 py-1.5 rounded-xl shrink-0 text-left md:text-right">
          <span className="text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-wider block">Tasks Mastered</span>
          <span className="text-sm font-serif font-black text-foreground">{totalCompletedTasks}</span>
        </div>
      </div>

      {/* ─── ENHANCED FOCUS AREA: Active Target Card ─── */}
      {activeMission && (
        <div className="p-8 border border-primary/20 bg-card rounded-2xl shadow-sm space-y-6 relative overflow-hidden transition hover:border-primary/30">
          <div className="absolute right-4 top-4 text-primary/5 select-none pointer-events-none">
            <ShieldAlert className="w-28 h-28 stroke-[1]" />
          </div>

          <div className="space-y-1.5 relative z-10">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              Current Target — Mission 0{activeMission.sequence}
            </span>
            <h2 className="text-xl font-bold text-foreground tracking-tight pt-2">
              {activeMission.title}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl font-medium pt-1">
              {activeMission.briefing_text}
            </p>
          </div>

          <div className="pt-2 relative z-10">
            <Button
              onClick={() => {
                startTransition(() => {
                  router.push(`/program/mission/${activeMission.id}`);
                });
              }}
              disabled={isPending}
              className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-sans text-xs font-bold tracking-wider uppercase transition shadow-md shadow-primary/10 flex items-center"
            >
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
              ) : null}
              Continue Quests
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* ─── THE ROADMAP SEQUENCE STACK ─── */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground tracking-wider pb-2 border-b border-border/60">
          The Roadmap
        </h3>

        <div className="grid grid-cols-1 gap-2.5">
          {missions.map((m) => {
            const isCurrent = activeMission?.id === m.id;

            // Calculate completions safely across inner collections
            const totalTasks = Object.values(m.quests || {}).reduce((acc: number, q: any) => acc + (q.tasks?.length || 0), 0);
            const completedTasks = Object.values(m.quests || {}).reduce((acc: number, q: any) => {
              return acc + (q.tasks?.filter((t: any) => progress[t.id]?.status === 'completed').length || 0);
            }, 0);
            const isFinished = totalTasks > 0 && completedTasks === totalTasks;

            return (
              <div
                key={m.id}
                onClick={() => router.push(`/program/mission/${m.id}`)}
                className={`p-4 border rounded-xl flex items-center justify-between transition group cursor-pointer ${isCurrent
                    ? 'border-primary/30 bg-primary/5 font-semibold shadow-sm'
                    : 'border-border bg-card/40 opacity-75 hover:opacity-100 hover:border-border-hover'
                  }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className={`text-xs font-sans font-bold shrink-0 ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                    Mission-0{m.sequence}
                  </span>
                  <p className="text-xs text-foreground font-bold truncate tracking-tight">
                    {m.title}
                  </p>
                </div>

                <div className="shrink-0 pl-4">
                  {isFinished ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
                  ) : isCurrent ? (
                    <span className="text-[9px] font-sans font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">
                      Active
                    </span>
                  ) : (
                    <span className="text-[9px] font-sans font-bold text-muted-foreground group-hover:text-foreground transition uppercase tracking-wider">
                      View Quests
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

```




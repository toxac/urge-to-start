# Fixing layout for program pages
## Tasks
- fix layout based on instruction below
- ask me for any other details you require
- keep styles and code as it is apart from the layout classes

## Changes to make 
- Main content area
    - fix the page layout for main content area which should be max of max-w-5xl for screen size of size lg or more
    - on smaller screens make the padding px-5
- Left menu sidebar
    - this works perfectly now kepp it as it is
- right resource sidebar
    - Should be on right side of the display only to be visible on screens lg and above
    - on screen lower size than lg this should go to the bottom and hidden ( this is not working now)


## Context Details
### Stack
- "next": "16.2.6",
- "tailwindcss": "^4",
- shadcn (baseui)
### Page routes
1. app/(platform)/layout.tsx: layout that manages all the protected platfomr pages
```tsx
// app/(platform)/layout.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { StoreHydrator } from '@/components/providers/StoreHydrator';
import { SidebarComponent } from '@/components/layout/Sidebar'; 
import { urgePlaybook } from '@/lib/playbook';

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

  // Fetch only dynamic user profile & progress records from Supabase
  const [profileRes, progressRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('user_progress').select('*').eq('user_id', user.id),
  ]);

  const profile = profileRes.data;
  if (!profile) redirect('/auth');

  if (profile.onboarding_step !== 'completed') {
    redirect('/setup');
  }

  const userRoles = (profile.roles as string[]) || [];
  const hasAccess = userRoles.some((role) =>
    ['trial', 'member', 'mentor', 'superadmin'].includes(role)
  );

  if (!hasAccess) redirect('/payment');

  return (
    <div className="w-full h-screen flex bg-background text-foreground antialiased overflow-hidden relative">
      {/* Hydrates progress, profile, and static playbook instantly into client memory */}
      <StoreHydrator 
        initialProgress={(progressRes.data as any) || []} 
        initialProfile={profile as any}
        initialPlaybook={urgePlaybook}
      />

      {/* Main Navigation Sidebar */}
      <SidebarComponent />

      {/* Center & Right Viewport Area */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col min-w-0">
        <main className="flex-1 w-full h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
```

2. app/(platform)/program/layout.tsx : layout for program pages
```tsx
// app/(platform)/program/layout.tsx
import React from 'react';
import { ComplementarySidebar } from '@/components/program/ComplementarySidebar';

export default function ProgramSubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full flex min-w-0 relative">
      {/* Program Main Work Area */}
      <div className="flex-1 h-full min-w-0 px-10 lg:max-w-5xl mx-auto">
        {children}
      </div>

      {/* Program Complementary Context Panel (Right Sidebar) */}
      <ComplementarySidebar />
    </div>
  );
}
```

3. app/(platform)/program/page.tsx: program dashboard page
```tsx
// app/(platform)/program/page.tsx
'use client';

import React, { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { $playbookStore } from '@/lib/stores/playbookStore';
import { setCompanionFocus } from '@/lib/stores/companionStore';
import { $progressStore } from '@/lib/stores/progressStore';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

export default function ProgramDashboardPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const playbook = useStore($playbookStore);
  const progress = useStore($progressStore);

  // 1. Trigger the Global Companion state for the Dashboard on mount
  useEffect(() => {
    setCompanionFocus({ pageType: 'dashboard' });
  }, []);

  // 2. Transform the playbook into an ordered array of missions
  const missions = Object.values(playbook || {}).sort((a, b) => a.sequence - b.sequence);

  // 3. Find the active mission the user is currently working on
  const activeMission = missions.find((mission) => {
    return mission.quests?.some((quest) =>
      quest.tasks?.some((task) => progress[task.id]?.status !== 'completed')
    );
  }) || missions[0];

  // 4. Calculate total completed tasks
  const totalCompletedTasks = Object.values(progress || {}).filter(p => p.status === 'completed').length;

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
    <div className="w-full space-y-10 animate-in fade-in duration-300 text-left">

      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1">
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary">
            Start
          </span>
          <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight text-foreground">
            Your Missions
          </h1>
          <p className="text-xs text-muted-foreground font-medium max-w-md leading-relaxed">
            No spreadsheets, no hype. Focus entirely on the immediate task in front of you.
          </p>
        </div>

        <div className="bg-muted/50 border border-border px-3.5 py-2 rounded-xl shrink-0 text-left md:text-right">
          <span className="text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-wider block">Tasks Mastered</span>
          <span className="text-base font-heading font-black text-foreground">{totalCompletedTasks}</span>
        </div>
      </div>

      {/* Active Target Mission Banner */}
      {activeMission && (
        <div className="p-8 border border-primary/20 bg-card rounded-2xl shadow-sm space-y-6 relative overflow-hidden transition hover:border-primary/30">
          <div className="absolute right-4 top-4 text-primary/5 select-none pointer-events-none">
            <ShieldAlert className="w-28 h-28 stroke-[1]" />
          </div>

          <div className="space-y-1.5 relative z-10">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md">
              Current Target — Mission 0{activeMission.sequence}
            </span>
            <h2 className="text-xl font-bold text-foreground tracking-tight pt-2">
              {activeMission.title}
            </h2>
            {activeMission.big_question && (
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xl font-medium pt-1 italic">
                "{activeMission.big_question}"
              </p>
            )}
          </div>

          <div className="pt-2 relative z-10">
            <Button
              onClick={() => {
                startTransition(() => {
                  router.push(`/program/mission/${activeMission.id}`);
                });
              }}
              disabled={isPending}
              className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-sans text-xs font-bold tracking-wider uppercase transition shadow-md shadow-primary/10 flex items-center cursor-pointer"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />}
              Continue Quests
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Missions Sequence Stack */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground pb-2 border-b border-border/60">
          The Roadmap
        </h3>

        <div className="grid grid-cols-1 gap-2.5">
          {missions.map((m) => {
            const isCurrent = activeMission?.id === m.id;

            const totalTasks = m.quests?.reduce((acc, q) => acc + (q.tasks?.length || 0), 0) || 0;
            const completedTasks = m.quests?.reduce((acc, q) => {
              return acc + (q.tasks?.filter((t) => progress[t.id]?.status === 'completed').length || 0);
            }, 0) || 0;
            const isFinished = totalTasks > 0 && completedTasks === totalTasks;

            return (
              <div
                key={m.id}
                onClick={() => router.push(`/program/mission/${m.id}`)}
                className={`p-4 border rounded-xl flex items-center justify-between transition group cursor-pointer ${
                  isCurrent
                    ? 'border-primary/30 bg-primary/5 font-semibold shadow-sm'
                    : 'border-border bg-card/40 opacity-80 hover:opacity-100 hover:border-border/80'
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
4. app/(platform)/program/mission/[id]/page.tsx - mission details page
```tsx
// app/(platform)/program/mission/[id]/page.tsx
'use client';

import React, { use, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { $playbookStore, getMissionFromStore } from '@/lib/stores/playbookStore';
import { $progressStore } from '@/lib/stores/progressStore';
import { setCompanionFocus } from '@/lib/stores/companionStore';
import { MissionHeader } from '@/components/layout/MissionHeader';
import { ChevronLeft, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { QuestSchema, TaskSchema } from '@/types/playbook';

export default function MissionRoadmapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const missionIdParam = resolvedParams.id;

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Subscribe to Nanostores
  useStore($playbookStore);
  const progress = useStore($progressStore);

  // Retrieve mission directly from memory
  const currentMission = getMissionFromStore(missionIdParam);

  // Markdown Content State
  const [markdownHtml, setMarkdownHtml] = useState<string | null>(null);
  const [loadingMarkdown, setLoadingMarkdown] = useState(false);

  // Sync Companion Focus for AI Assistant
  useEffect(() => {
    if (currentMission) {
      setCompanionFocus({
        pageType: 'mission',
        activeMissionId: currentMission.id,
      });
    }
  }, [currentMission]);

  // Fetch Markdown Briefing Content when Mission is resolved
  useEffect(() => {
    if (currentMission?.content_path) {
      setLoadingMarkdown(true);
      fetch(`/api/markdown?path=${encodeURIComponent(currentMission.content_path)}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to load markdown');
          return res.text();
        })
        .then(html => setMarkdownHtml(html))
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
          Loading mission workspace...
        </span>
      </div>
    );
  }

  const quests: QuestSchema[] = currentMission.quests || [];

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-300 text-left">

      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-5">
        <button
          onClick={() => {
            startTransition(() => {
              router.push('/program');
            });
          }}
          disabled={isPending}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Roadmap
        </button>
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground/60">
          Mission Brief
        </span>
      </div>

      {/* Mission Title Header */}
      <div className="pt-2">
        <MissionHeader
          sequence={currentMission.sequence}
          title={currentMission.title}
        />
        {currentMission.big_question && (
          <p className="text-sm font-medium text-muted-foreground italic pt-2">
            &ldquo;{currentMission.big_question}&rdquo;
          </p>
        )}
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
        <div className="py-8 text-center text-muted-foreground text-xs">
          <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
          Loading mission content...
        </div>
      )}
      {markdownHtml && !loadingMarkdown && (
        <div
          className="prose prose-sm md:prose-base max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground"
          dangerouslySetInnerHTML={{ __html: markdownHtml }}
        />
      )}

      {/* Quests List */}
      <div className="space-y-4 pt-4">
        <div className="pb-2 border-b border-border/60">
          <h3 className="text-sm font-sans font-bold uppercase tracking-widest text-muted-foreground">
            Quests Included
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {quests.map((quest: QuestSchema) => {
            const questTasks: TaskSchema[] = quest.tasks || [];
            const totalTasks = questTasks.length;
            const completedTasks = questTasks.filter((t: TaskSchema) => progress[t.id]?.status === 'completed').length;
            const isCompleted = totalTasks > 0 && completedTasks === totalTasks;
            const isStarted = completedTasks > 0 && completedTasks < totalTasks;

            return (
              <div
                key={quest.id}
                onClick={() => router.push(`/program/quest/${quest.id}`)}
                className="group bg-card/40 border border-border hover:border-primary/60 rounded-2xl p-6 shadow-sm transition duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden"
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
                </div>

                <div className="shrink-0 flex items-center justify-start sm:justify-end text-xs font-bold text-primary group-hover:translate-x-0.5 transition pr-1">
                  <span>{isCompleted ? 'Review Work' : 'Start Quest'}</span>
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
5. app/(platform)/program/quest/[id]/page.tsx - quest details page which renders all the tasks

```tsx
// app/(platform)/program/quest/[id]/page.tsx
'use client';

import React, { use, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { $playbookStore } from '@/lib/stores/playbookStore';
import { $progressStore } from '@/lib/stores/progressStore';
import { $profileStore } from '@/lib/stores/profileStore'; 
import { setCompanionFocus } from '@/lib/stores/companionStore';
import { TaskFormRegistry } from '@/components/program/TaskFormRegistry'; 
import { ChevronLeft, CheckCircle2, Lock, Eye, Play, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MissionSchema, QuestSchema, TaskSchema } from '@/types/playbook';

export default function QuestActionCenterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const questParamId = resolvedParams.id;

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const playbook = useStore($playbookStore);
  const progress = useStore($progressStore);
  const profile = useStore($profileStore);

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Strongly typed matching for active mission and quest
  let activeMissionId = '';
  let currentQuest: QuestSchema | null = null;

  for (const [mId, mission] of Object.entries(playbook || {}) as [string, MissionSchema][]) {
    const foundQuest = mission.quests?.find((q: QuestSchema) => q.id === questParamId);
    if (foundQuest) {
      activeMissionId = mission.id || mId;
      currentQuest = foundQuest;
      break;
    }
  }

  const tasks: TaskSchema[] = currentQuest?.tasks || [];
  const currentUserId = profile?.id || '';

  const completedCount = tasks.filter((t: TaskSchema) => progress[t.id]?.status === 'completed').length;
  const progressRatioPercentage = tasks.length > 0 ? Math.min(100, Math.floor((completedCount / tasks.length) * 100)) : 0;
  const nextIncompleteTask = tasks.find((t: TaskSchema) => progress[t.id]?.status !== 'completed');

  // Sync Companion Focus
  useEffect(() => {
    if (currentQuest) {
      setCompanionFocus({
        pageType: 'quest',
        activeMissionId,
        activeQuestId: currentQuest.id,
        activeTaskId,
      });
    }
  }, [activeTaskId, activeMissionId, currentQuest]);

  if (!currentQuest) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-32 animate-in fade-in duration-200">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span className="text-xs font-sans font-medium text-muted-foreground tracking-wide">
          Opening quest workspace...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300 text-left">

      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-5">
        <button
          onClick={() => {
            startTransition(() => {
              router.push(`/program/mission/${activeMissionId}`);
            });
          }}
          disabled={isPending}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Mission
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
        </div>

        <div className="space-y-1 shrink-0 text-left md:text-right">
          <span className="text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-wider block">Progress</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted border border-border rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressRatioPercentage}%` }} />
            </div>
            <span className="text-xs font-bold text-foreground">{progressRatioPercentage}%</span>
          </div>
        </div>
      </div>

      {/* WORKSPACE LAYOUT SWITCHER */}
      {activeTaskId ? (
        /* TASK EXECUTION BUBBLE VIEW */
        (() => {
          const activeTask = tasks.find((t: TaskSchema) => t.id === activeTaskId);
          const activeTaskProgress = progress[activeTaskId];
          
          if (!activeTask) return null;

          return (
            <div className="border border-primary rounded-2xl bg-card shadow-md p-6 space-y-6 animate-in zoom-in-95 duration-200 text-left">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
                    Executing Step Challenge
                  </span>
                  <h2 className="text-base font-bold text-foreground">{activeTask.title}</h2>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-[11px] font-semibold cursor-pointer"
                  onClick={() => setActiveTaskId(null)}
                >
                  Close Step
                </Button>
              </div>

              <TaskFormRegistry
                task={activeTask}
                userId={currentUserId}
                existingProgress={activeTaskProgress}
                onSuccess={() => {
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
              Tasks Checklist
            </h3>
          </div>

          {tasks.map((task: TaskSchema, index: number) => {
            const taskProgress = progress[task.id];
            const isTaskCompleted = taskProgress?.status === 'completed';

            // Sequential lock rule: previous task must be completed
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
                      {task.briefing_text}
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

          {/* Quick Callout */}
          {nextIncompleteTask && (
            <div className="p-4 border rounded-xl bg-muted/20 border-dashed text-left flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>Next step: <strong>&ldquo;{nextIncompleteTask.title}&rdquo;</strong>.</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground animate-pulse" />
            </div>
          )}
        </div>
      )}

    </div>
  );
}

```


### components
1. components/layout/Sidebar.tsx ( left menu sidebar)
```tsx
// components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { $profileStore } from '@/lib/stores/profileStore';
import { logout } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Compass,
  Layers,
  Users,
  Calendar,
  ShoppingBag,
  LogOut,
  UserSquare2,
  Sun,
  Moon,
  Menu
} from 'lucide-react';

/* ─── DYNAMIC NAV LINKS MODULE ─── */
function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const profile = useStore($profileStore);
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex flex-col justify-between h-full w-full bg-card p-5 text-foreground">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="space-y-0.5 py-1 px-1">
          <span className="text-[10px] font-sans font-bold text-primary uppercase tracking-widest block">Workspace</span>
          <p className="text-sm font-serif font-black tracking-tight">Urge Start</p>
        </div>

        <Separator className="opacity-60" />

        {/* Link Tree Items */}
        <nav className="space-y-1 font-sans text-xs font-semibold tracking-normal">
          <Link
            href="/platform/dashboard"
            onClick={onNavigate}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition group border ${isActive('/platform/dashboard') ? 'bg-primary/5 text-primary border-primary/20 shadow-sm' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
          >
            <span className="flex items-center gap-3"><Layers className="h-4 w-4 shrink-0" /> Dashboard</span>
            <span className="text-[11px] opacity-0 group-hover:opacity-100 text-primary pr-1">→</span>
          </Link>

          {profile?.roles?.includes('member') && (
            <Link
              href="/platform/program"
              onClick={onNavigate}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition group border ${isActive('/platform/program') ? 'bg-primary/5 text-primary border-primary/20 shadow-sm' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
            >
              <span className="flex items-center gap-3"><Compass className="h-4 w-4 shrink-0" /> Program Track</span>
              <span className="bg-primary/10 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded-md">Active</span>
            </Link>
          )}

          <Link
            href="/platform/network"
            onClick={onNavigate}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition group border ${isActive('/platform/network') ? 'bg-primary/5 text-primary border-primary/20 shadow-sm' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
          >
            <span className="flex items-center gap-3"><Users className="h-4 w-4 shrink-0" /> Peer Network</span>
          </Link>

          <Link
            href="/platform/events"
            onClick={onNavigate}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition group border ${isActive('/platform/events') ? 'bg-primary/5 text-primary border-primary/20 shadow-sm' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
          >
            <span className="flex items-center gap-3"><Calendar className="h-4 w-4 shrink-0" /> Live Sprints</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0 mr-1"></span>
          </Link>

          <Link
            href="/platform/mentors"
            onClick={onNavigate}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition group border ${isActive('/platform/mentors') ? 'bg-primary/5 text-primary border-primary/20 shadow-sm' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
          >
            {/* ⚡ FIXED: Stripped out the rogue m-0 property completely */}
            <span className="flex items-center gap-3"><UserSquare2 className="h-4 w-4 shrink-0" /> Industry Advisors</span>
          </Link>

          <Link
            href="/platform/marketplace"
            onClick={onNavigate}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition group border ${isActive('/platform/marketplace') ? 'bg-primary/5 text-primary border-primary/20 shadow-sm' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
          >
            <span className="flex items-center gap-3"><ShoppingBag className="h-4 w-4 shrink-0" /> Perks & Solutions</span>
          </Link>
        </nav>
      </div>

      {/* Profile/Footer Area */}
      <div className="space-y-3 pt-4 border-t border-border">
        {mounted && (
          <div className="flex items-center justify-between bg-muted/40 p-2 rounded-xl border border-border/40 text-xs text-muted-foreground font-medium px-3">
            <span>Interface Mode</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {resolvedTheme === 'dark' ? <Sun className="h-3.5 w-3.5 text-primary" /> : <Moon className="h-3.5 w-3.5" />}
            </Button>
          </div>
        )}

        {profile && (
          <Link
            href={`/platform/profile/${profile.id}`}
            onClick={onNavigate}
            className="block p-3 bg-muted/20 hover:bg-muted/50 rounded-xl space-y-1.5 border border-border/40 group transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold truncate tracking-tight text-foreground group-hover:text-primary transition-colors">
                {profile.fullname || 'Anonymous Builder'}
              </span>
              <span className="text-[10px] text-muted-foreground font-serif">⚙</span>
            </div>
          </Link>
        )}

        <form action={logout} className="w-full">
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive font-sans text-xs font-semibold h-10 hover:bg-destructive/5 rounded-xl transition-all"
          >
            <LogOut className="h-4 w-4" /> Disconnect Account
          </Button>
        </form>
      </div>
    </div>
  );
}

/* ─── MAIN MASTER WRAPPER VIEW ─── */
export function SidebarComponent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* DESKTOP SIDEBAR: Sticky, standard view for screens md and wider */}
      <aside className="hidden md:flex w-64 h-full border-r border-border flex-col select-none shrink-0 overflow-hidden">
        <SidebarContent />
      </aside>

      {/* MOBILE TRIGGER HEADER: Displays on viewports under md, adding a sleek navigation bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-40 flex items-center justify-between px-4 select-none">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          {/* Base UI standard layout trigger configuration */}
          <SheetTrigger className="inline-flex items-center justify-center p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer focus-visible:outline-none">
            <Menu className="w-5 h-5" />
          </SheetTrigger>

          <SheetContent side="left" className="w-64 p-0 bg-card border-r border-border h-full flex flex-col">
            <SidebarContent onNavigate={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        <span className="text-xs font-serif font-black tracking-wider uppercase text-foreground">
          Urge Start
        </span>

        <div className="w-9 h-9" /> {/* Visual Balance Spacing Weight */}
      </div>
    </>
  );
}
```
2. components/program/ComplementarySidebar.tsx
```tsx
// components/program/sidebar/ComplementarySidebar.tsx
'use client';

import React from 'react';
import { useStore } from '@nanostores/react';
import { $companionFocus } from '@/lib/stores/companionStore';
import { $progressStore } from '@/lib/stores/progressStore';
import { $profileStore } from '@/lib/stores/profileStore';
import { urgePlaybook } from '@/lib/playbook';
import { 
  BookOpen, 
  Trophy, 
  ExternalLink, 
  Zap, 
  AlertTriangle, 
  Info, 
  HelpCircle, 
  Bell,
  Sparkles,
  Flame
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

export function ComplementarySidebar() {
  const focus = useStore($companionFocus);
  const progress = useStore($progressStore);
  const profile = useStore($profileStore);

  const missionId = focus.activeMissionId;
  const questId = focus.activeQuestId;
  const activeTaskId = focus.activeTaskId || null;

  const mission = missionId ? urgePlaybook[missionId] : null;
  const quest = (mission && questId) 
    ? mission.quests.find((q) => q.id === questId) 
    : null;
  const task = (quest && activeTaskId) 
    ? quest.tasks.find((t) => t.id === activeTaskId) 
    : null;

  // Helper to render Note type icons
  const renderNoteIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />;
      case 'guide':
        return <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />;
      case 'nudge':
        return <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />;
    }
  };

  const renderContent = () => {
    // ─── 1. TASK CONTEXT ───
    if (activeTaskId && task) {
      const optionalResources = (task.resources || []).filter((r) => !r.isRequired);
      const taskChallenges = task.challenges || [];

      return (
        <div className="space-y-6 text-xs text-left animate-in fade-in duration-200">
          {/* Active Task Name */}
          <div className="border-b pb-3 space-y-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
              Step Context
            </span>
            <h3 className="text-sm font-bold text-foreground">{task.title}</h3>
          </div>

          {/* Task Challenges */}
          {taskChallenges.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                Task Challenges
              </span>
              <div className="space-y-2">
                {taskChallenges.map((challenge, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 rounded-xl border bg-orange-500/5 border-orange-500/20 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{challenge.title}</span>
                      {challenge.link && (
                        <a 
                          href={challenge.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-primary hover:underline flex items-center gap-0.5 text-[10px]"
                        >
                          View <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References & Links (Only non-required ones) */}
          {optionalResources.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                Helpful References
              </span>
              <div className="space-y-1.5">
                {optionalResources.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url_link}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl border bg-muted/20 hover:bg-muted/40 transition flex items-center justify-between gap-2 group"
                  >
                    <span className="font-medium text-foreground truncate group-hover:text-primary">
                      {res.title}
                    </span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Reflection Prompt Reminder */}
          {task.reflection_prompt && (
            <div className="p-3 border rounded-xl bg-primary/5 border-primary/20 space-y-1">
              <span className="text-[10px] font-bold uppercase text-primary tracking-wider block">
                Reflection Check
              </span>
              <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                "{task.reflection_prompt}"
              </p>
            </div>
          )}
        </div>
      );
    }

    // ─── 2. QUEST CONTEXT ───
    if (focus.pageType === 'quest' && quest) {
      const notes = quest.notes || [];

      return (
        <div className="space-y-6 text-xs text-left animate-in fade-in duration-200">
          <div className="border-b pb-3 space-y-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
              Quest Briefing
            </span>
            <h3 className="text-sm font-bold text-foreground">{quest.title}</h3>
          </div>

          {/* Quest Notes */}
          {notes.length > 0 ? (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Chapter Notes & Guidance
              </span>
              <div className="space-y-2">
                {notes.map((note, idx) => (
                  <div key={idx} className="p-3 rounded-xl border bg-muted/20 space-y-1">
                    <div className="flex items-start gap-2">
                      {renderNoteIcon(note.type)}
                      <span className="font-bold text-foreground">{note.title}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed pl-5">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground italic text-xs">No extra notes for this quest.</p>
          )}
        </div>
      );
    }

    // ─── 3. MISSION CONTEXT ───
    if (mission) {
      return (
        <div className="space-y-6 text-xs text-left animate-in fade-in duration-200">
          <div className="border-b pb-3 space-y-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
              Mission Overview
            </span>
            <h3 className="text-sm font-bold text-foreground">{mission.title}</h3>
            {mission.big_question && (
              <p className="text-[11px] text-muted-foreground italic font-medium pt-1">
                "{mission.big_question}"
              </p>
            )}
          </div>

          {/* User Progress Stats & Rewards */}
          <div className="p-4 rounded-2xl border bg-card/60 shadow-sm space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Your Stats
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                <span className="font-bold text-foreground text-sm">
                  {profile?.accumulated_xp || 0} XP
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] uppercase font-bold">
                Level {Math.floor((profile?.accumulated_xp || 0) / 100) + 1}
              </Badge>
            </div>
          </div>
        </div>
      );
    }

    // ─── DEFAULT FALLBACK ───
    return (
      <div className="space-y-4 text-xs text-left animate-in fade-in duration-200">
        <div className="p-4 rounded-2xl border bg-card space-y-2">
          <span className="text-[10px] font-bold uppercase text-primary tracking-wider flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" />
            Platform Updates
          </span>
          <p className="text-muted-foreground leading-relaxed text-[11px]">
            Welcome to Urge. Select a mission from your roadmap to begin working on your business tasks.
          </p>
        </div>
      </div>
    );
  };

  const triggerStyles =
    'inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-xl border border-primary/20 hover:scale-105 transition active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

  return (
    <>
      {/* DESKTOP PANEL */}
      <aside className="hidden xl:flex w-80 h-full border-l border-border bg-card flex-col overflow-hidden shrink-0 shadow-sm relative z-20">
        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            {activeTaskId ? 'Task Resources' : (focus.pageType === 'quest' ? 'Quest Context' : 'Mission Info')}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{renderContent()}</div>
      </aside>

      {/* TABLET OVERLAY */}
      <div className="hidden md:flex xl:hidden fixed right-5 bottom-5 z-40">
        <Sheet>
          <SheetTrigger className={triggerStyles}>
            <BookOpen className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-85 p-0 bg-card border-l border-border flex flex-col">
            <SheetHeader className="p-4 border-b border-border bg-muted/20 shrink-0">
              <SheetTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" /> Program Companion
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4">{renderContent()}</div>
          </SheetContent>
        </Sheet>
      </div>

      {/* MOBILE BOTTOM DRAWER */}
      <div className="md:hidden fixed bottom-5 right-5 z-40">
        <Drawer>
          <DrawerTrigger className={triggerStyles}>
            <BookOpen className="w-5 h-5" />
          </DrawerTrigger>
          <DrawerContent className="bg-card border-t border-border max-h-[82vh] flex flex-col">
            <DrawerHeader className="p-4 border-b border-border bg-muted/20 shrink-0">
              <DrawerTitle className="text-xs font-bold uppercase text-muted-foreground text-center flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" /> Program Companion
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto p-4 pb-6">{renderContent()}</div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}

```




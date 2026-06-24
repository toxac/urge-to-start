'use client';

import React, { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { $playbookStore } from '@/lib/stores/companionStore';
import { setCompanionFocus } from '@/lib/stores/companionStore';
import { $progressStore, setProgressStoreRow, ProgressRow, ProgressPayload } from '@/lib/stores/progressStore';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function QuestActionCenterPage() {
  const params = useParams();
  const router = useRouter();
  const playbook = useStore($playbookStore);
  const progress = useStore($progressStore);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Resolve the active Quest object out of memory using its unique slug parameter
  let activeMissionId = '';
  let activeQuestKey = '';
  let currentQuest: any = null;

  Object.entries(playbook).forEach(([mId, mission]) => {
    Object.entries(mission.quests || {}).forEach(([qKey, quest]) => {
      if (quest.slug === params.slug) {
        activeMissionId = mId;
        activeQuestKey = qKey;
        currentQuest = quest;
      }
    });
  });

  // 2. Fallback safely if user refreshes or slug is invalid
  if (!currentQuest) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#F9F7F4] text-xs font-medium text-[#8C8580]">
        Loading your tactical action panel configuration...
      </div>
    );
  }

  const tasks = currentQuest.tasks || [];
  
  // Find the first task that doesn't have a 'completed' record status row in progress store
  const activeTask = tasks.find((t: any) => progress[t.id]?.status !== 'completed') || tasks[tasks.length - 1];

  // 3. Keep Kip's Focus synchronized to the active task layout dynamically
  useEffect(() => {
    if (activeTask) {
      setCompanionFocus({
        pageType: 'quest',
        activeMissionId,
        activeQuestId: activeQuestKey,
        activeTaskId: activeTask.id,
      });
    }
  }, [activeTask?.id, activeMissionId, activeQuestKey]);

  // --- HANDLER: FAST RECORD SIMULATED PROGRESSION FOR SYSTEM FLOW ---
  const handleCompleteActiveTask = (taskId: string, grantPoints: number) => {
    const existingRow = progress[taskId];
    const existingPayload: ProgressPayload = (existingRow?.saved_payload as ProgressPayload) || {};

    const updatedRow: ProgressRow = {
      ...(existingRow || {
        id: crypto.randomUUID(),
        user_id: '',
        project_id: null,
        item_type: 'task',
        mission_id: activeMissionId,
        quest_id: activeQuestKey,
        task_id: taskId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      }),
      status: 'completed',
      saved_payload: {
        ...existingPayload,
        formData: { executedAt: new Date().toISOString() },
      },
    };

    setProgressStoreRow(updatedRow);
  };

  // Calculate completed ratio percentage to map the active movement line fill
  const completedCount = tasks.filter((t: any) => progress[t.id]?.status === 'completed').length;
  const progressRatioPercentage = Math.min(100, Math.floor((completedCount / tasks.length) * 100));

  return (
    <div className="min-h-screen w-full bg-[#F9F7F4] text-[#1A1A1A] font-sans antialiased flex flex-col selection:bg-[#E86A33]/20">
      
      {/* ─── HIbadge TOP STRIP (Thin, low-contrast, pushed to extreme edges) ─── */}
      <header className="w-full h-12 px-6 border-b border-[#8C8580]/10 flex items-center justify-between shrink-0 bg-[#F9F7F4]">
        <button 
          onClick={() => router.push(`/program/mission/${activeMissionId}`)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#8C8580] hover:text-[#1A1A1A] opacity-70 transition-opacity"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to Roadmap
        </button>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C8580] opacity-60">
          Quest Stack: {currentQuest.title}
        </span>
      </header>

      {/* ─── MAIN APP CONTENT CANVAS ─── */}
      <main className="flex-1 w-full flex relative px-8 py-12 gap-12 max-w-5xl mx-auto overflow-hidden">
        
        {/* MOVEMENT INDICATOR: The Downward Gradient line wrapper container */}
        <div className="w-0.5 absolute top-12 bottom-12 left-12 bg-[#8C8580]/10 rounded-full overflow-hidden hidden md:block">
          <div 
            className="w-full bg-[#E86A33] transition-all duration-500 ease-out"
            style={{ height: `${progressRatioPercentage}%` }}
          />
        </div>

        {/* WORKSPACE LAYOUT CONTAINER */}
        <div ref={containerRef} className="flex-1 space-y-16 pl-0 md:pl-10 overflow-y-auto h-full pr-2">
          
          {/* Quest Metadata Frame Header */}
          <div className="space-y-1.5 text-left max-w-xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#8C8580]">
              Active Exploration Module
            </h2>
            <h1 className="text-xl font-bold tracking-tight text-[#1A1A1A]">
              {currentQuest.title}
            </h1>
            <p className="text-xs text-[#8C8580] font-medium leading-relaxed">
              {currentQuest.subtitle}
            </p>
          </div>

          {/* DYNAMIC SCROLL LOOP CARDS */}
          <div className="space-y-24 pb-32">
            {tasks.map((task: any) => {
              const taskProgress = progress[task.id];
              const isTaskCompleted = taskProgress?.status === 'completed';
              const isTaskActive = activeTask?.id === task.id;

              // If task is neither completed nor active, reduce weight to zero to isolate user eyes
              if (!isTaskCompleted && !isTaskActive) return null;

              return (
                <div 
                  key={task.id}
                  className={`transition-all duration-300 transform ${
                    isTaskActive 
                      ? 'min-h-[60vh] opacity-100 scale-100 flex flex-col justify-center' 
                      : 'opacity-40 scale-[0.98] blur-[0.5px]'
                  }`}
                >
                  <div className="bg-[#F9F7F4] border border-[#8C8580]/10 rounded-2xl p-8 shadow-[0_4px_24px_rgba(140,133,128,0.03)] space-y-6">
                    
                    {/* Card Inner Heading */}
                    <div className="space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8580]">
                          Milestone Focus Action {task.sequence} / {tasks.length}
                        </span>
                        {isTaskCompleted && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            Locked Done
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-[#1A1A1A] tracking-tight">
                        {task.title}
                      </h3>
                      <p className="text-xs text-[#8C8580] leading-relaxed max-w-xl">
                        {task.description}
                      </p>
                    </div>

                    {/* INTERACTION AREA: 70% Viewport Focus Affordance Enforcer */}
                    {isTaskActive && (
                      <div className="pt-4 animate-in fade-in duration-300 space-y-8">
                        {/* Placeholder container simulating where Form Component Registry injects your live input widgets */}
                        <div className="w-full h-40 rounded-xl bg-[#8C8580]/5 border border-dashed border-[#8C8580]/20 flex items-center justify-center p-4">
                          <span className="text-xs font-semibold text-[#8C8580] uppercase tracking-wider italic">
                            [ Embedded Interface Block: {task.component_key} ]
                          </span>
                        </div>

                        {/* SINGULARITY PRINCIPLE: The Moat Around the Single Urge Orange CTA */}
                        <div className="pt-6 flex justify-start">
                          <div className="relative group">
                            <Button
                              onClick={() => handleCompleteActiveTask(task.id, task.grant_points)}
                              className="px-8 h-12 rounded-xl bg-[#E86A33] hover:bg-[#D35925] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#E86A33]/10 transition-all duration-200 transform active:scale-95"
                            >
                              Confirm Task Completion
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
}
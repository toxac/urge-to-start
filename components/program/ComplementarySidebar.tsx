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
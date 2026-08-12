// components/program/sidebar/ComplementarySidebar.tsx
'use client';

import React from 'react';
import { useStore } from '@nanostores/react';
import { $companionFocus } from '@/lib/stores/companionStore';
import { $progressStore } from '@/lib/stores/progressStore';
import { $profileStore } from '@/lib/stores/profileStore';
import { $accomplishmentStore } from '@/lib/stores/accomplishmentStore';
import { urgePlaybook } from '@/lib/playbook';
import {
  BookOpen,
  Trophy,
  ExternalLink,
  Zap,
  AlertTriangle,
  Info,
  Sparkles,
  Flame,
  Clock,
  Target
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

export function ComplementarySidebar() {
  const focus = useStore($companionFocus);
  const progress = useStore($progressStore);
  const profile = useStore($profileStore);
  const accomplishments = useStore($accomplishmentStore);

  const missionId = focus.activeMissionId;
  const questId = focus.activeQuestId;
  const activeTaskId = focus.activeTaskId || null;

  const mission = missionId ? urgePlaybook[missionId] : null;
  const quest = mission && questId ? mission.quests.find((q) => q.id === questId) : null;
  const task = quest && activeTaskId ? quest.tasks.find((t) => t.id === activeTaskId) : null;

  // Total XP Points Tally
  const totalPoints = profile?.accumulated_xp ?? 0;

  // Badges earned in active quest and mission
  const questBadges = Object.values(accomplishments).filter(
    (a) => a.related_table === 'quests' && a.related_reference_id === questId
  );

  const missionBadges = Object.values(accomplishments).filter(
    (a) => a.related_table === 'missions' && a.related_reference_id === missionId
  );

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
    return (
      <div className="space-y-6 text-xs text-left animate-in fade-in duration-200">
        {/* GLOBAL POINTS TALLY */}
        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-500 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-500" /> Total Points Tally
            </span>
            <p className="text-base font-black font-mono text-foreground">{totalPoints.toLocaleString()} XP</p>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono border-amber-500/40 text-amber-500 bg-amber-500/10 font-bold">
            Level {Math.floor(totalPoints / 100) + 1}
          </Badge>
        </div>

        {/* ─── 1. TASK CONTEXT ─── */}
        {activeTaskId && task ? (
          <div className="space-y-4 pt-1 border-t border-border/60">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-amber-500" /> Task Context
              </span>
              <h3 className="text-sm font-bold text-foreground">{task.title}</h3>
            </div>

            {/* Non-Required Helpful Resources */}
            {task.resources && task.resources.filter((r) => !r.isRequired).length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  Helpful References
                </span>
                <div className="space-y-1.5">
                  {task.resources.filter((r) => !r.isRequired).map((res, idx) => (
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

            {/* Task Challenges */}
            {task.challenges && task.challenges.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  Task Challenges
                </span>
                <div className="space-y-2">
                  {task.challenges.map((challenge, idx) => (
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
          </div>
        ) : null}

        {/* ─── 2. QUEST CONTEXT ─── */}
        {quest && (
          <div className="space-y-4 pt-1 border-t border-border/60">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-500" /> Quest Context
              </span>
              <h3 className="text-sm font-bold text-foreground">{quest.title}</h3>
            </div>

            {/* Quest Notes */}
            {quest.notes && quest.notes.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Chapter Notes & Guidance
                </span>
                <div className="space-y-2">
                  {quest.notes.map((note, idx) => (
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
            )}

            {/* Badges Earned in Quest */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Quest Badges Earned ({questBadges.length})
              </span>
              {questBadges.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {questBadges.map((badge) => (
                    <Badge key={badge.id} variant="secondary" className="text-[10px] py-1 px-2 font-bold flex items-center gap-1">
                      🏆 {badge.title}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground italic">Complete quest steps to earn chapter badges.</p>
              )}
            </div>
          </div>
        )}

        {/* ─── 3. MISSION CONTEXT ─── */}
        {mission && (
          <div className="space-y-4 pt-1 border-t border-border/60">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" /> Mission Context
              </span>
              <h3 className="text-sm font-bold text-foreground">{mission.title}</h3>
            </div>

            {/* Badges Earned in Mission */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Mission Badges Earned ({missionBadges.length})
              </span>
              {missionBadges.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {missionBadges.map((badge) => (
                    <Badge key={badge.id} variant="secondary" className="text-[10px] py-1 px-2 font-bold flex items-center gap-1">
                      🥇 {badge.title}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground italic">Complete mission tasks to unlock major milestone badges.</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const triggerStyles =
    'inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-xl border border-primary/20 hover:scale-105 transition active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

  return (
    <>
      {/* DESKTOP PANEL – visible from lg upward */}
      <aside className="hidden lg:block fixed right-0 top-0 h-screen w-80 border-l border-border bg-card overflow-hidden shadow-sm z-20">
        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            {activeTaskId
              ? 'Task Resources'
              : focus.pageType === 'quest'
                ? 'Quest Context'
                : 'Mission Info'}
          </span>
        </div>
        <div className="h-[calc(100%-56px)] overflow-y-auto p-4">{renderContent()}</div>
      </aside>

      {/* TABLET OVERLAY – visible only on md, hidden on lg+ and below sm */}
      <div className="hidden md:flex lg:hidden fixed right-5 bottom-5 z-40">
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

      {/* MOBILE BOTTOM DRAWER – visible only below md */}
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
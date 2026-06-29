'use client';

import React from 'react';
import { useStore } from '@nanostores/react';
import { $companionFocus } from '@/lib/stores/companionStore';
import { $progressStore } from '@/lib/stores/progressStore';
import { urgePlaybook } from '@/lib/playbook';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Mode sub-panels
import { KipDashboardConcierge } from './modes/KipDashboardConcierge';
import { KipMissionInspector } from './modes/KipMissionInspector';
import { KipQuestCoach } from './modes/KipQuestCoach';

// Base UI structural layout drawers
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

export function KipSidebarCompanion() {
  const focus = useStore($companionFocus);
  const progress = useStore($progressStore);

  const renderRouterContextContent = () => (
    <div className="h-full flex flex-col overflow-hidden text-foreground">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {focus.pageType === 'dashboard' && (
          <KipDashboardConcierge progress={progress} />
        )}

        {focus.pageType === 'mission' && focus.activeMissionId && (
          <KipMissionInspector 
            mission={urgePlaybook[focus.activeMissionId]} 
            missionId={focus.activeMissionId}
          />
        )}

        {focus.pageType === 'quest' && focus.activeMissionId && focus.activeQuestId && (
          <KipQuestCoach 
            missionId={focus.activeMissionId}
            questId={focus.activeQuestId}
            activeTaskId={focus.activeTaskId}
            progress={progress}
          />
        )}
      </div>
    </div>
  );

  // Common styles for the floating action triggers
  const triggerStyles = "inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-xl border border-primary/20 hover:scale-105 transition active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <>
      {/* DESKTOP PANEL LAYER */}
      <aside className="hidden xl:flex w-80 h-full border-l border-border bg-card flex-col overflow-hidden shrink-0 shadow-sm">
        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Kip Companion — {focus.pageType}
          </span>
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="flex-1 overflow-hidden">
          {renderRouterContextContent()}
        </div>
      </aside>

      {/* TABLET OVERLAY LAYER */}
      <div className="hidden md:flex xl:hidden fixed right-5 bottom-5 z-40">
        <Sheet>
          {/* ⚡ FIXED: Classes applied directly to SheetTrigger. Renders a single legal button tag. */}
          <SheetTrigger className={triggerStyles}>
            <Sparkles className="w-5 h-5 animate-pulse" />
          </SheetTrigger>
          
          <SheetContent side="right" className="w-85 p-0 bg-card border-l border-border flex flex-col">
            <SheetHeader className="p-4 border-b border-border bg-muted/20 shrink-0">
              <SheetTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Kip Advisor Panel
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
              {renderRouterContextContent()}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* MOBILE PHONE BOTTOM DRAWER LAYER */}
      <div className="md:hidden fixed bottom-5 right-5 z-40">
        <Drawer>
          {/* ⚡ FIXED: Classes applied directly to DrawerTrigger. Eliminates TypeScript type issues. */}
          <DrawerTrigger className={triggerStyles}>
            <Sparkles className="w-5 h-5 animate-pulse" />
          </DrawerTrigger>
          
          <DrawerContent className="bg-card border-t border-border max-h-[82vh] flex flex-col">
            <DrawerHeader className="p-4 border-b border-border bg-muted/20 shrink-0">
              <DrawerTitle className="text-xs font-bold uppercase text-muted-foreground text-center flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Kip Advisor Hub
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 overflow-hidden pb-6">
              {renderRouterContextContent()}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
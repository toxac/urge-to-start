// app/(platform)/program/mission/[id]/page.tsx
'use client';

import React, { use, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { $playbookStore, getMissionFromStore } from '@/lib/stores/playbookStore';
import { $progressStore } from '@/lib/stores/progressStore';
import { setCompanionFocus } from '@/lib/stores/companionStore';
import { ProgramHeader } from '@/components/program/ProgramHeader'; // 👈 new import
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

  const progress = useStore($progressStore);
  const currentMission = getMissionFromStore(missionIdParam);

  const [markdownHtml, setMarkdownHtml] = useState<string | null>(null);
  const [loadingMarkdown, setLoadingMarkdown] = useState(false);

  useEffect(() => {
    if (currentMission) {
      setCompanionFocus({
        pageType: 'mission',
        activeMissionId: currentMission.id,
      });
    }
  }, [currentMission]);

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

  // Format estimated time
  const estimatedDays = currentMission.estimated_time_in_days || 0;
  const estimatedTime = `~${estimatedDays} day${estimatedDays > 1 ? 's' : ''}`;

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-300 text-left">
      {/* Header */}
      <ProgramHeader
        type="mission"
        title={currentMission.title}
        sequence={currentMission.sequence}
        subtitle={currentMission.big_question}
        estimatedTime={estimatedTime}
        videoUrl={currentMission.video_url}
      />

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

      {/* Quests List - unchanged */}
      <div className="bg-card border border-border rounded-2xl pb-10 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/60 bg-muted/20">
          <h3 className="text-sm font-sans font-bold uppercase tracking-widest text-muted-foreground">
            Quests in the mission
          </h3>
        </div>
        <div className="divide-y divide-border/40">
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
                className="group px-6 py-5 hover:bg-muted/20 transition duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
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
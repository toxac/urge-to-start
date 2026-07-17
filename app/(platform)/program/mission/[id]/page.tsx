'use client';

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
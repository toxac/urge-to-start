// components/program/kip/modules/KipRecommendationItem.tsx
'use client';

import { useState } from 'react';
import { BookOpen, Video, Headphones, Sparkles, Link as LinkIcon, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useKipActions } from '@/hooks/useKipActions';
import type { TaskRecommendation } from '@/types/playbook';

interface Props {
  recommendation: TaskRecommendation;
  taskId: string;
  questId: string;
  missionId: string;
  onSummaryLoaded?: (path: string, summary: string) => void;
}

export function KipRecommendationItem({ recommendation, taskId, questId, missionId, onSummaryLoaded }: Props) {
  const { execute, isLoading, error } = useKipActions();
  const [summary, setSummary] = useState<string | null>(null);

  const iconMap: Record<string, any> = {
    blog: BookOpen,
    video: Video,
    podcast: Headphones,
    internal_link: Sparkles,
    download: Download,
  };
  const Icon = iconMap[recommendation.type] || LinkIcon;

  const handleSummary = async () => {
    if (summary) return;
    const res = await execute({
      taskId,
      questId,
      missionId,
      contextType: 'resource_summary',
      userInputText: recommendation.path_or_url,
    });
    if (res.success && 'data' in res && res.data) {
      const text = res.data.summary || res.data;
      setSummary(text);
      onSummaryLoaded?.(recommendation.path_or_url, text);
    }
  };

  const isSummarizing = isLoading && !summary;

  return (
    <div className="p-3.5 border border-border bg-card rounded-xl space-y-2.5 shadow-sm">
      <div className="space-y-0.5 text-left">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="truncate max-w-[160px]">{recommendation.title}</span>
        </div>
        {recommendation.subtitle && (
          <p className="text-[10px] text-muted-foreground font-medium pl-5.5">{recommendation.subtitle}</p>
        )}
      </div>

      {recommendation.type === 'blog' ? (
        <Button
          size="sm"
          variant="secondary"
          className="h-6.5 text-[10px] font-bold w-full rounded-lg"
          disabled={isSummarizing}
          onClick={handleSummary}
        >
          {isSummarizing ? (
            <>
              <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Summarizing...
            </>
          ) : (
            '⚡ Read Kip Quick Summary'
          )}
        </Button>
      ) : recommendation.type === 'download' ? (
        <a href={recommendation.path_or_url} target="_blank" rel="noreferrer" className="block w-full">
          <Button size="sm" variant="outline" className="h-6.5 text-[10px] font-bold w-full rounded-lg bg-background">
            📄 Download Resource
          </Button>
        </a>
      ) : (
        <a href={recommendation.path_or_url} target={recommendation.type === 'internal_link' ? '_self' : '_blank'} rel="noreferrer" className="block w-full">
          <Button size="sm" variant="outline" className="h-6.5 text-[10px] font-bold w-full rounded-lg bg-background">
            ➜ {recommendation.type === 'internal_link' ? 'Open Feature' : 'Open Link'}
          </Button>
        </a>
      )}

      {error && (
        <div className="p-2 text-[10px] text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {summary && (
        <div className="p-3 border rounded-xl bg-muted/40 text-muted-foreground font-medium text-[11px] mt-1 leading-relaxed border-border/50 animate-in slide-in-from-top-1">
          {summary}
        </div>
      )}
    </div>
  );
}
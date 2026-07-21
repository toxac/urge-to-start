// components/program/tasks/CommunityWidget.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, ExternalLink, CheckCircle2, Loader2, FileText } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { BaseTaskComponentProps } from './types';
import { toast } from 'sonner';

export function CommunityWidget({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isCompleted = existingProgress?.status === 'completed';

  const handleMarkComplete = async () => {
    setIsSubmitting(true);
    try {
      const sync = await completeTaskExecution({
        taskId: task.id,
        savedPayload: { 
          visitedAt: new Date().toISOString(),
          communityTask: true 
        }
      });

      if (sync.success) {
        if (sync.data) {
          setProgressStoreRow(sync.data as any);
        }
        if (onSuccess) onSuccess();
        toast.success('✅ Community task completed!');
      } else {
        toast.error(sync.error || "Something went wrong.");
      }
    } catch (err) {
      toast.error("Failed to complete the task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {task.description && (
        <div className="p-4 border rounded-xl bg-muted/10 text-sm text-foreground/80 leading-relaxed">
          {task.description}
        </div>
      )}

      {task.ai_config?.recommendations && task.ai_config.recommendations.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resources</p>
          <div className="space-y-1.5">
            {task.ai_config.recommendations.map((rec, idx) => (
              <a
                key={idx}
                href={rec.path_or_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileText className="w-3.5 h-3.5" />
                {rec.title}
                {rec.subtitle && <span className="text-xs text-muted-foreground">({rec.subtitle})</span>}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="p-6 border rounded-xl bg-primary/5 border-primary/20 text-center space-y-3">
        <Users className="w-10 h-10 text-primary mx-auto" />
        <p className="text-sm font-medium text-foreground">
          Connect with the community
        </p>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Visit the community board to see what others are building, share your progress, and connect with fellow founders.
        </p>
        <Button variant="outline" className="gap-2">
          <a href="/platform/program/community" target="_blank" rel="noopener noreferrer">
            Go to Community <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </Button>
      </div>

      {!isCompleted ? (
        <Button
          onClick={handleMarkComplete}
          disabled={isSubmitting}
          className="w-full h-11 text-sm font-semibold"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {isSubmitting ? 'Saving...' : `I've engaged with the community (+${task.grant_points} XP)`}
        </Button>
      ) : (
        <div className="w-full p-3.5 border rounded-xl bg-emerald-500/5 text-emerald-600 border-emerald-500/20 text-center text-xs font-bold flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          Completed! +{task.grant_points} XP earned
        </div>
      )}
    </div>
  );
}
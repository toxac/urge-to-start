// components/program/tasks/SimpleActionWidget.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, ExternalLink } from 'lucide-react';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { BaseTaskComponentProps } from './types';
import { toast } from 'sonner';
import { FileText } from 'lucide-react';

export function SimpleActionWidget({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isCompleted = existingProgress?.status === 'completed';

  const handleMarkComplete = async () => {
    setIsSubmitting(true);
    try {
      const sync = await completeTaskExecution({
        taskId: task.id,
        savedPayload: { 
          completedAt: new Date().toISOString(),
          action: 'completed'
        }
      });

      if (sync.success) {
        if (sync.data) {
          setProgressStoreRow(sync.data as any);
        }
        if (onSuccess) onSuccess();
        toast.success(`✅ Task completed!`);
      } else {
        toast.error(sync.error || "Something went wrong.");
      }
    } catch (err) {
      toast.error("Failed to complete the task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasResources = task.ai_config?.recommendations && task.ai_config.recommendations.length > 0;

  return (
    <div className="w-full space-y-4">
      {/* Task Description */}
      {task.description && (
        <div className="p-4 border rounded-xl bg-muted/10 text-sm text-foreground/80 leading-relaxed">
          {task.description}
        </div>
      )}

      {/* Resources/Recommendations */}
      {hasResources && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resources</p>
          <div className="space-y-1.5">
            {task.ai_config!.recommendations!.map((rec, idx) => (
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

      {/* Action Button */}
      {!isCompleted ? (
        <Button
          onClick={handleMarkComplete}
          disabled={isSubmitting}
          className="w-full h-11 text-sm font-semibold"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {isSubmitting ? 'Saving...' : `Mark Complete (+${task.grant_points} XP)`}
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
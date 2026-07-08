// components/program/TaskFormRegistry.tsx
'use client';

import React from 'react';
import { Task } from '@/types/playbook';
import { TaskComponentMap } from './tasks';
import { BaseTaskComponentProps } from './tasks/types';

interface TaskFormRegistryProps {
  task: Task;
  userId: string;
  existingProgress?: {
    id: string;
    status: 'not_started' | 'in_progress' | 'completed' | string;
    saved_payload?: any;
  };
  onSuccess?: () => void;
}

export function TaskFormRegistry({ task, userId, existingProgress, onSuccess }: TaskFormRegistryProps) {
  const Component = TaskComponentMap[task.component_key];

  if (!Component) {
    return (
      <div className="w-full p-6 border border-dashed rounded-xl bg-destructive/5 text-center space-y-2">
        <p className="text-sm font-semibold text-destructive">⚠️ Task Component Not Registered</p>
        <p className="text-xs text-muted-foreground">
          Component <code className="px-1.5 py-0.5 rounded bg-muted font-mono font-bold text-foreground">{task.component_key}</code> is not registered.
        </p>
        <p className="text-xs text-muted-foreground">
          Task ID: <code className="px-1.5 py-0.5 rounded bg-muted font-mono">{task.id}</code>
        </p>
      </div>
    );
  }

  const isCompleted = existingProgress?.status === 'completed';

  return (
    <div className="w-full border rounded-2xl bg-card shadow-sm overflow-hidden border-border/60">
      {/* Task Header */}
      <div className="w-full p-5 border-b bg-muted/20 border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary">
              Step {task.sequence || 1}
            </span>
            <h3 className="text-base font-bold tracking-tight text-foreground">{task.title}</h3>
          </div>
          {task.description && (
            <p className="text-xs font-medium leading-relaxed text-muted-foreground max-w-2xl">
              {task.description}
            </p>
          )}
        </div>

        {/* XP Badge */}
        <div className="shrink-0 flex items-center">
          {isCompleted ? (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
              <span>✓</span> Completed (+{task.grant_points} XP)
            </span>
          ) : (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
              +{task.grant_points} XP Available
            </span>
          )}
        </div>
      </div>

      {/* Task Content */}
      <div className="w-full p-5 sm:p-6 bg-card">
        <Component
          task={task}
          userId={userId}
          existingProgress={existingProgress}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
}
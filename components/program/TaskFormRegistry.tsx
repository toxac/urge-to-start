'use client';
// components/program/TaskFormRegistry.tsx
import React from 'react';
import { Database } from '@/types/supabase';
import { TaskComponentMap } from './tasks';

type TaskRow = Database['public']['Tables']['tasks']['Row'];

interface TaskFormRegistryProps {
  task: TaskRow;
  userId: string; // Passed down to lock file bucket directory paths securely
  existingProgress?: {
    id: string;
    status: 'not_started' | 'in_progress' | 'completed' | string;
    saved_payload?: any;
  };
  onSuccess?: () => void;
}

export function TaskFormRegistry({ task, userId, existingProgress, onSuccess }: TaskFormRegistryProps) {
  // 1. Look up the native form component using its playbook key string
  const TargetedForm = TaskComponentMap[task.component_key];

  // 2. Safety fallback if a file hasn't been imported or registered yet
  if (!TargetedForm) {
    return (
      <div className="w-full p-6 border border-dashed rounded-xl bg-destructive/5 text-center space-y-2">
        <p className="text-sm font-semibold text-destructive">⚠️ Task Setup Missing</p>
        <p className="text-xs text-muted-foreground">
          The form key <code className="px-1.5 py-0.5 rounded bg-muted font-mono font-bold text-foreground">{task.component_key}</code> has not been linked inside the registry index yet.
        </p>
      </div>
    );
  }

  const isCompleted = existingProgress?.status === 'completed';

  return (
    <div className="w-full border rounded-2xl bg-card shadow-sm overflow-hidden border-border/60">
      
      {/* Dynamic Task Frame Header */}
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

        {/* Gamified Score/Status Pill */}
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

      {/* Full-Width Task Form Content Container */}
      <div className="w-full p-5 sm:p-6 bg-card">
        <TargetedForm 
          taskId={task.id}
          userId={userId}
          existingProgress={existingProgress}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
}
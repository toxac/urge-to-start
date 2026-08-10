// components/program/ActionItemCard.tsx
'use client';

import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { $actionStore, updateActionStoreStatus, UserActionRow } from '@/lib/stores/actionStore';
import { updateUserActionStatusAction } from '@/actions/userActions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Loader2, Calendar } from 'lucide-react';

interface ActionItemCardProps {
  taskId: string;
  onStatusChange?: (updatedAction: UserActionRow) => void;
}

export function ActionItemCard({ taskId, onStatusChange }: ActionItemCardProps) {
  const actionsMap = useStore($actionStore);
  const [isUpdating, setIsUpdating] = useState(false);

  // Find linked action by task_id
  const linkedAction = Object.values(actionsMap).find(
    (a) => a.task_id === taskId && a.status !== 'dismissed'
  );

  if (!linkedAction) return null;

  const isCompleted = linkedAction.status === 'completed';

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    const newStatus = isCompleted ? 'pending' : 'completed';

    try {
      const res = await updateUserActionStatusAction(linkedAction.id, newStatus);
      if (res.success && res.data) {
        updateActionStoreStatus(linkedAction.id, res.data.status, res.data.completed_at);
        if (onStatusChange) onStatusChange(res.data);
      }
    } catch (err) {
      console.error('Failed to toggle action status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={`p-4 rounded-xl border transition-all ${
      isCompleted 
        ? 'bg-emerald-500/5 border-emerald-500/20' 
        : 'bg-card border-border shadow-sm'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">{linkedAction.title}</span>
            <Badge 
              variant={isCompleted ? 'default' : 'outline'}
              className={`text-[9px] font-mono ${
                isCompleted 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' 
                  : 'text-amber-500 border-amber-500/30'
              }`}
            >
              {isCompleted ? 'Completed Goal' : 'Action Pending'}
            </Badge>
          </div>

          {linkedAction.description && (
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {linkedAction.description}
            </p>
          )}

          {linkedAction.due_at && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground pt-0.5">
              <Calendar className="w-3 h-3 text-primary" />
              <span>Due: {new Date(linkedAction.due_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <Button
          type="button"
          size="sm"
          variant={isCompleted ? 'outline' : 'default'}
          disabled={isUpdating}
          onClick={handleToggleStatus}
          className="h-8 text-xs font-bold shrink-0 gap-1.5 cursor-pointer"
        >
          {isUpdating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : isCompleted ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Mark Pending
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark Action Done
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
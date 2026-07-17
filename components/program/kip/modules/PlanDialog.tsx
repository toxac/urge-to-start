// components/program/kip/modules/PlanDialog.tsx
'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { generateQuestSchedule } from '@/actions/plans';
import { toast } from 'sonner';
import type { UserPlan } from '@/types/plans';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missionId: string;
  questId: string;
  onSuccess: (plans: UserPlan[]) => void;
  // optional: if passed, we can show a rescheduling hint or delete existing plans before generating new ones
  existingPlans?: UserPlan[];
}

export function PlanDialog({ open, onOpenChange, missionId, questId, onSuccess, existingPlans }: Props) {
  const [sessions, setSessions] = useState(3);
  const [duration, setDuration] = useState(60);
  const [isGenerating, setIsGenerating] = useState(false);

  const isRescheduling = existingPlans && existingPlans.length > 0;

  const handleConfirm = async () => {
    setIsGenerating(true);
    try {
      const result = await generateQuestSchedule({
        missionId,
        questId,
        numberOfSessions: sessions,
        durationMinutes: duration,
      });
      if (result.success) {
        onSuccess(result.data);
        toast.success(isRescheduling ? 'Schedule updated!' : `Planned ${result.data.length} sessions!`);
        onOpenChange(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate schedule');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isRescheduling ? 'Reschedule your quest' : 'Plan your quest'}</DialogTitle>
          <DialogDescription>
            {isRescheduling
              ? 'Adjust the number of sessions and duration to create a new schedule. Existing sessions will be replaced.'
              : 'Choose how many sessions and how long each should be. We\'ll suggest time slots based on your availability.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-3">
          <div className="space-y-2">
            <Label htmlFor="sessions">Number of sessions</Label>
            <Input
              id="sessions"
              type="number"
              min={1}
              max={10}
              value={sessions}
              onChange={(e) => setSessions(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min={15}
              max={180}
              step={15}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isGenerating ? 'Generating...' : isRescheduling ? 'Reschedule' : 'Confirm Schedule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
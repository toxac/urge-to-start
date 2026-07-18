// components/program/kip/modules/PlanDialog.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { generateAndSetPlans } from '@/lib/stores/planStore';
import { toast } from 'sonner';
import type { UserPlan } from '@/types/plans';
import { useStore } from '@nanostores/react';
import { $profileStore } from '@/lib/stores/profileStore';
import type { ScheduleConfig } from '@/types/plans';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missionId: string;
  questId: string;
  existingPlans?: UserPlan[];
}

// Helper to parse profile config (safe)
function getDefaultConfig(profile: any): { days: string[]; start: string; end: string } {
  const config = (profile?.schedule_config || {}) as ScheduleConfig;
  return {
    days: config.preferred_days || ['monday', 'wednesday', 'friday'],
    start: config.preferred_hours?.start || '19:00',
    end: config.preferred_hours?.end || '22:00',
  };
}

export function PlanDialog({ open, onOpenChange, missionId, questId, existingPlans }: Props) {
  const profile = useStore($profileStore);
  const defaults = getDefaultConfig(profile);

  const [sessions, setSessions] = useState(3);
  const [duration, setDuration] = useState(60);
  const [selectedDays, setSelectedDays] = useState<string[]>(defaults.days);
  const [startTime, setStartTime] = useState(defaults.start);
  const [endTime, setEndTime] = useState(defaults.end);
  const [isGenerating, setIsGenerating] = useState(false);

  // Reset to profile defaults when dialog opens (or when profile changes)
  useEffect(() => {
    if (open) {
      const d = getDefaultConfig(profile);
      setSelectedDays(d.days);
      setStartTime(d.start);
      setEndTime(d.end);
    }
  }, [open, profile]);

  const isRescheduling = existingPlans && existingPlans.length > 0;

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleConfirm = async () => {
    if (selectedDays.length === 0) {
      toast.error('Please select at least one day');
      return;
    }
    setIsGenerating(true);
    try {
      const override = {
        preferred_days: selectedDays,
        preferred_hours: { start: startTime, end: endTime },
      };
      const newPlans = await generateAndSetPlans({
        missionId,
        questId,
        numberOfSessions: sessions,
        durationMinutes: duration,
        override,
      });
      toast.success(isRescheduling ? 'Schedule updated!' : `Planned ${newPlans.length} sessions!`);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate schedule');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isRescheduling ? 'Reschedule your quest' : 'Plan your quest'}</DialogTitle>
          <DialogDescription>
            {isRescheduling
              ? 'Adjust the schedule and replace existing sessions.'
              : 'Choose how many sessions and when you want to work.'}
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

          <div>
            <Label className="text-xs font-medium">Preferred days</Label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {DAYS.map(day => (
                <Button
                  key={day}
                  type="button"
                  variant={selectedDays.includes(day) ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 px-2 text-[10px] capitalize"
                  onClick={() => toggleDay(day)}
                >
                  {day.slice(0, 3)}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="start-time" className="text-xs">Start time</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="end-time" className="text-xs">End time</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
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
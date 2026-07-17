// components/program/kip/modules/PlanDialog.tsx
'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch'; // need to import or use checkbox
import { Checkbox } from '@/components/ui/checkbox'; // or custom
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
  existingPlans?: UserPlan[];
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function PlanDialog({ open, onOpenChange, missionId, questId, onSuccess, existingPlans }: Props) {
  const [sessions, setSessions] = useState(3);
  const [duration, setDuration] = useState(60);
  const [useDefault, setUseDefault] = useState(true);
  const [selectedDays, setSelectedDays] = useState<string[]>(['monday', 'wednesday', 'friday']);
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('22:00');
  const [isGenerating, setIsGenerating] = useState(false);

  const isRescheduling = existingPlans && existingPlans.length > 0;

  const toggleDay = (day: string) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleConfirm = async () => {
    setIsGenerating(true);
    try {
      const override = useDefault ? undefined : {
        preferred_days: selectedDays,
        preferred_hours: { start: startTime, end: endTime },
      };
      const result = await generateQuestSchedule({
        missionId,
        questId,
        numberOfSessions: sessions,
        durationMinutes: duration,
        override,
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
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

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="use-default"
              checked={useDefault}
              onCheckedChange={setUseDefault}
            />
            <Label htmlFor="use-default">Use my default schedule</Label>
          </div>

          {!useDefault && (
            <div className="space-y-3 border rounded-lg p-3 bg-muted/20">
              <div>
                <Label className="text-xs font-medium">Preferred days</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {DAYS.map(day => (
                    <div key={day} className="flex items-center space-x-1">
                      <Checkbox
                        id={`day-${day}`}
                        checked={selectedDays.includes(day)}
                        onCheckedChange={() => toggleDay(day)}
                      />
                      <Label htmlFor={`day-${day}`} className="text-xs capitalize">{day.slice(0,3)}</Label>
                    </div>
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
          )}
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
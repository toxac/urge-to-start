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
import type { UserPlan, ScheduleConfig } from '@/types/plans';
import { useStore } from '@nanostores/react';
import { $profileStore } from '@/lib/stores/profileStore';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

interface TaskOption {
  id: string;
  title: string;
  sequence: number;
  completed: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missionId: string;
  questId: string;
  tasks: TaskOption[];
  existingPlans?: UserPlan[];
}

function getDefaultConfig(profile: any): { days: string[]; start: string; end: string } {
  const config = (profile?.schedule_config || {}) as ScheduleConfig;
  return {
    days: config.preferred_days || ['monday', 'wednesday', 'friday'],
    start: config.preferred_hours?.start || '19:00',
    end: config.preferred_hours?.end || '22:00',
  };
}

export function PlanDialog({ open, onOpenChange, missionId, questId, tasks, existingPlans }: Props) {
  const profile = useStore($profileStore);
  const defaults = getDefaultConfig(profile);

  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [duration, setDuration] = useState(60);
  const [selectedDays, setSelectedDays] = useState<string[]>(defaults.days);
  const [startTime, setStartTime] = useState(defaults.start);
  const [endTime, setEndTime] = useState(defaults.end);
  const [isGenerating, setIsGenerating] = useState(false);

  // Reset to profile defaults and select all incomplete tasks when dialog opens
  useEffect(() => {
    if (open) {
      const d = getDefaultConfig(profile);
      setSelectedDays(d.days);
      setStartTime(d.start);
      setEndTime(d.end);
      // Default: select all tasks that are not completed
      const defaultSelected = tasks.filter(t => !t.completed).map(t => t.id);
      setSelectedTaskIds(defaultSelected);
    }
  }, [open, profile, tasks]);

  const isRescheduling = existingPlans && existingPlans.length > 0;

  const toggleTask = (taskId: string) => {
    setSelectedTaskIds(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const toggleAllTasks = () => {
    if (selectedTaskIds.length === tasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(tasks.map(t => t.id));
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleConfirm = async () => {
    if (selectedTaskIds.length === 0) {
      toast.error('Please select at least one task to plan');
      return;
    }
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
        taskIds: selectedTaskIds,
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

  const allSelected = selectedTaskIds.length === tasks.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isRescheduling ? 'Reschedule your quest' : 'Plan your quest'}</DialogTitle>
          <DialogDescription>
            {isRescheduling
              ? 'Adjust the schedule and replace existing sessions.'
              : 'Select which tasks you want to plan and when.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-3">
          {/* Task selection */}
          <div>
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Tasks to plan</Label>
              <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={toggleAllTasks}>
                {allSelected ? 'Deselect all' : 'Select all'}
              </Button>
            </div>
            <div className="space-y-1 mt-1 max-h-32 overflow-y-auto">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    id={`task-${task.id}`}
                    checked={selectedTaskIds.includes(task.id)}
                    onChange={() => toggleTask(task.id)}
                    disabled={task.completed}
                    className="h-4 w-4 rounded border-gray-300 disabled:opacity-50"
                  />
                  <Label htmlFor={`task-${task.id}`} className={task.completed ? 'line-through text-muted-foreground' : ''}>
                    {task.sequence}. {task.title}
                    {task.completed && ' ✅'}
                  </Label>
                </div>
              ))}
            </div>
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
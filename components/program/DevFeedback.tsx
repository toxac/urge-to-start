// components/program/sidebar/DevFeedback.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  getDevFeedbacksAction,
  createDevFeedbackAction
} from '@/actions/devFeedback';
import {
  Bug,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  MessageSquareText
} from 'lucide-react';
import { Database } from '@/types/supabase';

type DevFeedbackRow = Database['public']['Tables']['dev_feedbacks']['Row'] ;

interface DevFeedbackProps {
  taskId: string;
}

export function DevFeedback({ taskId }: DevFeedbackProps) {
  const [feedbacks, setFeedbacks] = useState<DevFeedbackRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dialog States
  const [selectedFeedback, setSelectedFeedback] = useState<DevFeedbackRow | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Inputs
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  // Fetch feedback for current task
  const loadFeedbacks = async () => {
    setIsLoading(true);
    const res = await getDevFeedbacksAction(taskId);
    if (res.success && res.data) {
      setFeedbacks(res.data);
    } else if (res.error) {
      setErrorMessage(res.error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadFeedbacks();
  }, [taskId]);

  const handleCreateFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await createDevFeedbackAction({ taskId, title, text });

    if (res.success && res.data) {
      setFeedbacks((prev) => [res.data!, ...prev]);
      setTitle('');
      setText('');
      setIsAddOpen(false);
    } else {
      setErrorMessage(res.error || 'Failed to submit feedback');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-3 pt-2 border-t border-border/60 text-left">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
          <Bug className="w-3.5 h-3.5" />
          Dev Feedback ({feedbacks.length})
        </span>
      </div>

      {errorMessage && (
        <div className="p-2.5 rounded-lg border bg-destructive/10 border-destructive/20 text-destructive text-[11px] font-semibold flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* FEEDBACK LIST */}
      {isLoading ? (
        <div className="flex items-center justify-center p-4 text-muted-foreground text-xs gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Loading feedback...</span>
        </div>
      ) : feedbacks.length === 0 ? (
        <p className="text-[11px] text-muted-foreground italic p-2 bg-muted/20 rounded-lg text-center">
          No feedback logged for this task yet.
        </p>
      ) : (
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {feedbacks.map((fb) => (
            <button
              key={fb.id}
              type="button"
              onClick={() => setSelectedFeedback(fb)}
              className="w-full p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition text-left cursor-pointer flex items-center justify-between gap-2 group"
            >
              <div className="min-w-0 flex-1 space-y-0.5">
                <span className="text-xs font-bold text-foreground block truncate group-hover:text-primary transition-colors">
                  {fb.title}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                  <User className="w-2.5 h-2.5" /> @{fb.username}
                </span>
              </div>

              <Badge
                variant="outline"
                className={`text-[9px] font-mono shrink-0 uppercase ${
                  fb.status === 'resolved'
                    ? 'border-emerald-500/40 text-emerald-500 bg-emerald-500/10'
                    : 'border-amber-500/40 text-amber-500 bg-amber-500/10'
                }`}
              >
                {fb.status}
              </Badge>
            </button>
          ))}
        </div>
      )}

      {/* ADD FEEDBACK BUTTON */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsAddOpen(true)}
        className="w-full h-8 text-[11px] font-bold uppercase tracking-wider cursor-pointer gap-1.5 border-dashed border-amber-500/40 text-amber-500 hover:bg-amber-500/10"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Dev Feedback
      </Button>

      {/* DIALOG 1: DETAIL VIEW */}
      <Dialog
        open={Boolean(selectedFeedback)}
        onOpenChange={(open) => !open && setSelectedFeedback(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1">
                <User className="w-3 h-3" /> @{selectedFeedback?.username}
              </span>
              <Badge
                variant="outline"
                className={`text-[9px] font-mono uppercase ${
                  selectedFeedback?.status === 'resolved'
                    ? 'border-emerald-500/40 text-emerald-500 bg-emerald-500/10'
                    : 'border-amber-500/40 text-amber-500 bg-amber-500/10'
                }`}
              >
                {selectedFeedback?.status}
              </Badge>
            </div>
            <DialogTitle className="text-sm font-bold text-foreground">
              {selectedFeedback?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs text-left">
            <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                Feedback Details
              </span>
              <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                {selectedFeedback?.text}
              </p>
            </div>

            <div className="text-[10px] font-mono text-muted-foreground text-right">
              Logged at: {selectedFeedback ? new Date(selectedFeedback.created_at).toLocaleString() : ''}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedFeedback(null)}
              className="text-xs cursor-pointer"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: ADD FEEDBACK FORM */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <MessageSquareText className="w-4 h-4 text-amber-500" />
              Add Tester / Dev Feedback
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateFeedback} className="space-y-4 py-2 text-left">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Feedback Title *
              </Label>
              <Input
                type="text"
                placeholder="e.g. Button alignment broken on mobile / Select fails validation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="text-xs h-9 bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Feedback Description / Reproduction Steps *
              </Label>
              <Textarea
                placeholder="Describe what you observed, what was expected, or edge case details..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                className="text-xs bg-background min-h-[100px] leading-relaxed"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddOpen(false)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || !title.trim() || !text.trim()}
                className="text-xs font-bold uppercase tracking-wider cursor-pointer bg-amber-600 hover:bg-amber-700 text-white gap-1.5"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Bug className="w-3.5 h-3.5" />
                    Save Feedback
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
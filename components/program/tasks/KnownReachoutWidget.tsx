'use client';

import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { m1q2ProgressAtom, updateTaskPayloadLocal } from '@/lib/stores/progressStore';
import { Button } from '@/components/ui/button';
import { completeTaskExecution } from '@/actions/progress';
import { Copy, Check, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface KnownReachoutWidgetProps {
  taskId: string;
  existingProgress?: {
    status: 'pending' | 'completed';
  };
  onSuccess?: () => void;
}

export function KnownReachoutWidget({ taskId, existingProgress, onSuccess }: KnownReachoutWidgetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Connect reactively to the global Nano Store
  const progressCache = useStore(m1q2ProgressAtom);
  const isCompleted = existingProgress?.status === 'completed';

  // Extract the text draft originally generated during Task 1 simulation
  const task1Data = progressCache['m1_q2_t1_ask_sim'] || {};
  const pulledDraftText = task1Data.userDraft || '';

  const handleCopyToClipboard = () => {
    if (!pulledDraftText) {
      toast.error("No draft text found. Try filling out step 1 first!");
      return;
    }
    navigator.clipboard.writeText(pulledDraftText);
    setCopied(true);
    toast.success("Polished draft copied to your clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkAsComplete = async () => {
    setIsSubmitting(true);
    try {
      const sync = await completeTaskExecution({
        taskId,
        savedPayload: { hasSharedWithCircle: true }
      });

      if (sync.success) {
        // Sync state back to our atomic cache layer
        updateTaskPayloadLocal(taskId, { hasSharedWithCircle: true });
        if (onSuccess) onSuccess();
      } else {
        toast.error(sync.error || "Something went wrong marking this milestone.");
      }
    } catch (err) {
      toast.error("Failed to connect to the backend server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-5 animate-in fade-in">
      <div className="space-y-2">
        <label className="text-sm font-semibold block text-foreground">
          Your Polished Message Template
        </label>
        
        {pulledDraftText ? (
          <div className="relative w-full border rounded-xl bg-muted/20 p-4 font-medium text-sm leading-relaxed text-foreground/90 italic">
            "{pulledDraftText}"
            <div className="w-full flex justify-end mt-3 pt-2 border-t border-dashed border-border/60">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopyToClipboard}
                className="h-8 text-xs gap-1.5 bg-background"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Message Text'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full border border-dashed rounded-xl p-6 text-center space-y-2 bg-amber-500/5 border-amber-500/20">
            <p className="text-xs font-semibold text-amber-600">⚠️ No Message Draft Generated Yet</p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Head back up to <strong className="text-foreground font-semibold">Step 1: Test Drive Your Message</strong> first to build and polish your outreach strategy with Kip.
            </p>
          </div>
        )}
      </div>

      {/* Action Block Context Card */}
      <div className="p-4 rounded-xl border bg-primary/5 border-primary/10 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs leading-normal">
          <p className="font-bold text-primary">How to execute this step:</p>
          <p className="text-muted-foreground font-medium">
            Copy the text above, open up whichever app you normally use to talk to your family (WhatsApp, Telegram, or Email), and paste it straight in. If you feel nervous or want to check how to handle whatever they reply back, open up Kip's conversation box right on your sidebar menu for guidance!
          </p>
        </div>
      </div>

      {/* Persistent Submit Action Hook Toggle */}
      {!isCompleted ? (
        <Button
          onClick={handleMarkAsComplete}
          disabled={isSubmitting || !pulledDraftText}
          className="w-full h-11 text-sm font-semibold"
        >
          {isSubmitting ? 'Syncing checkpoint...' : 'I have sent the message to my inner circle (+20 XP)'}
        </Button>
      ) : (
        <div className="w-full p-3.5 border rounded-xl bg-emerald-500/5 text-emerald-600 border-emerald-500/20 text-center text-xs font-bold flex items-center justify-center gap-1.5">
          <span>✓</span> Successfully shared with your inner circle! Check your sidebar companion for tracking loops.
        </div>
      )}
    </div>
  );
}
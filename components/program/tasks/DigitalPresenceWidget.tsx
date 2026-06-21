'use client';

import React, { useState } from 'react';
import { updateTaskPayloadLocal } from '@/lib/stores/progressStore';
import { Button } from '@/components/ui/button';
import { completeTaskExecution } from '@/actions/progress';
import { Send, Globe, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DigitalPresenceWidgetProps {
  taskId: string;
  existingProgress?: {
    status: 'pending' | 'completed';
  };
  onSuccess?: () => void;
}

export function DigitalPresenceWidget({ taskId, existingProgress, onSuccess }: DigitalPresenceWidgetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isCompleted = existingProgress?.status === 'completed';

  const handleMarkAsComplete = async () => {
    setIsSubmitting(true);
    try {
      const sync = await completeTaskExecution({
        taskId,
        savedPayload: { hasClaimedVoice: true }
      });

      if (sync.success) {
        updateTaskPayloadLocal(taskId, { hasClaimedVoice: true });
        if (onSuccess) onSuccess();
      } else {
        toast.error(sync.error || "Something went wrong recording your progress status.");
      }
    } catch (err) {
      toast.error("Failed to connect securely with the backend cluster.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-5 animate-in fade-in">
      
      {/* Informative Guidance Hook Frame */}
      <div className="w-full border border-border/80 rounded-xl overflow-hidden shadow-sm bg-card">
        <div className="p-4 bg-muted/30 border-b border-border/50 flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-bold text-foreground">The Build In Public Concept</span>
        </div>
        <div className="p-4 text-xs font-medium leading-relaxed text-muted-foreground space-y-2">
          <p>
            You don't need to position yourself as an overnight executive or write robotic, stiff articles on LinkedIn or X. Real digital voice is just documentation. 
          </p>
          <p>
            Tell people what you are trying to learn, what friction you encountered today, or what surprised you while mapping out your constraints this week. Authentic building draws in potential long-term operators and customers naturally.
          </p>
        </div>
      </div>

      {/* Ambient Assistant Dynamic Callback Promotion Card */}
      <div className="p-4 border border-dashed rounded-xl bg-amber-500/5 border-amber-500/20 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
          <MessageCircle className="w-4 h-4 shrink-0 text-amber-500" />
          Need a personalized post template?
        </div>
        <p className="text-xs font-medium leading-normal text-muted-foreground">
          If you are staring at a blank profile box and don't know what to type, open the <strong className="text-foreground">Kip Sidebar Companion</strong> on the screen layout right now. Kip will ask you what you learned this week and instantly output an authentic, zero-jargon text template ready for you to share!
        </p>
      </div>

      {/* Interactive Trigger Button Row */}
      {!isCompleted ? (
        <Button
          onClick={handleMarkAsComplete}
          disabled={isSubmitting}
          className="w-full h-11 text-sm font-semibold mt-2"
        >
          {isSubmitting ? 'Syncing checkpoint...' : 'My profile is live / I shared my first update (+25 XP)'}
        </Button>
      ) : (
        <div className="w-full p-3.5 border rounded-xl bg-emerald-500/5 text-emerald-600 border-emerald-500/20 text-center text-xs font-bold flex items-center justify-center gap-1.5">
          <span>✓</span> Digital voice milestone logged securely! Your platform trajectory is rolling.
        </div>
      )}
    </div>
  );
}
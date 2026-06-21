'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { analyzeUserMessageDraft } from "@/actions/ai"; 
import { completeTaskExecution } from "@/actions/progress";
import { Loader2, Sparkles, RefreshCw, CheckCircle2, AlertTriangle, ArrowLeft, Copy } from "lucide-react";
import { toast } from "sonner";

const SCENARIOS = [
  { id: "friends_family", label: "✨ [Required] Asking friends and family for early support", context: "Talking to the people closest to you about your new journey. The goal is to get genuine encouragement, early sounding boards, or simple word-of-mouth help without making Sunday dinner awkward." },
  { id: "warm_intro", label: "Asking a warm contact for an introduction (Optional)", context: "Reaching out to a mutual connection to get put in touch with someone who operates in the space you are looking at." },
  { id: "feedback_pitch", label: "Asking a customer for raw feedback (Optional)", context: "Approaching someone who deals with the exact friction you want to solve to look over a rough solution idea." },
  { id: "custom", label: "Write your own unique scenario... (Optional)", context: "Describe any custom interaction or message intent you want to test out below..." }
];

interface AskSimulatorProps {
  taskId: string;
  existingProgress?: {
    status: 'pending' | 'completed';
    saved_payload?: any;
  };
  onSuccess?: () => void;
}

export function AskSimulator({ taskId, existingProgress, onSuccess }: AskSimulatorProps) {
  const [scenarioId, setScenarioId] = useState("friends_family");
  const [draft, setDraft] = useState(existingProgress?.saved_payload?.userDraft || "");
  const [isPending, setIsPending] = useState(false);
  const [feedback, setFeedback] = useState<any>(existingProgress?.saved_payload?.aiFeedback || null);
  
  const isInitiallyCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isInitiallyCompleted);

  const currentScenario = SCENARIOS.find((s) => s.id === scenarioId);

  const handleRunCritique = async () => {
    if (!draft.trim()) return;
    setIsPending(true);

    try {
      const result = await analyzeUserMessageDraft(currentScenario?.context || "General Interaction", draft, {});

      if (!result.success) {
        toast.error(result.error || "The coach hit a block. Let's try once more.");
      } else {
        setFeedback(result.data);
      }
    } catch (err) {
      toast.error("Network hiccup. Give it another shot!");
    } finally {
      setIsPending(false);
    }
  };

  const handleApplyRewrite = () => {
    if (feedback?.suggestedRewrite) {
      setDraft(feedback.suggestedRewrite);
      setFeedback(null);
      toast.success("Applied Kip's rewrite to your message draft!");
    }
  };

  const handleLockMilestone = async () => {
    setIsPending(true);
    try {
      const sync = await completeTaskExecution({
        taskId,
        savedPayload: { userDraft: draft, aiFeedback: feedback, selectedScenario: scenarioId }
      });

      if (sync.success) {
        setIsEditing(false);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      toast.error("Couldn't sync milestone progress.");
    } finally {
      setIsPending(false);
    }
  };

  // TRACK 1: READ-ONLY DISPLAY
  if (!isEditing && isInitiallyCompleted) {
    return (
      <div className="w-full space-y-4 border rounded-xl p-5 bg-emerald-50/20 border-emerald-500/10 animate-in fade-in">
        <div className="w-full flex items-center justify-between pb-2 border-b border-dashed">
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            ✨ Your Polished Support Draft
          </span>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="h-7 text-xs bg-background">
            Edit Message
          </Button>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-xs font-bold text-muted-foreground">Your Saved Version:</p>
            <p className="font-medium text-foreground italic mt-1.5 bg-background p-4 rounded-xl border leading-relaxed">
              "{draft}"
            </p>
          </div>
        </div>
      </div>
    );
  }

  // TRACK 2: AI REVIEWS PANEL
  if (feedback && isEditing) {
    return (
      <div className="w-full space-y-5 animate-in fade-in duration-200">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setFeedback(null)} className="gap-1 text-xs pl-0 hover:bg-transparent">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to editor
          </Button>
          <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground">Communication Insights</span>
        </div>

        {/* Score & Hook Banner */}
        <div className="w-full p-4 rounded-xl border bg-muted/30 flex flex-col sm:flex-row items-center gap-4">
          <div className={`w-14 h-14 rounded-full border-2 bg-background flex items-center justify-center text-xl font-black shrink-0 ${
            feedback.score >= 8 ? 'text-emerald-500 border-emerald-500' : 'text-amber-500 border-amber-500'
          }`}>
            {feedback.score}/10
          </div>
          <p className="text-sm font-medium text-foreground/80 leading-relaxed text-center sm:text-left">{feedback.summary}</p>
        </div>

        {/* Positives & Improvements */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="w-full space-y-2">
            <h5 className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Why this works well</h5>
            <div className="space-y-1.5">
              {feedback.strengths?.map((s: string, idx: number) => (
                <p key={idx} className="text-xs font-medium p-2.5 border rounded-lg bg-emerald-500/5 text-foreground/90 leading-relaxed">{s}</p>
              ))}
            </div>
          </div>
          <div className="w-full space-y-2">
            <h5 className="text-xs font-bold text-amber-600 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Conversational habits to drop</h5>
            <div className="space-y-1.5">
              {feedback.improvements?.map((s: string, idx: number) => (
                <p key={idx} className="text-xs font-medium p-2.5 border rounded-lg bg-amber-500/5 text-foreground/90 leading-relaxed">{s}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Suggested Rewrite */}
        <div className="w-full border-2 border-primary/20 bg-primary/5 p-4 rounded-xl space-y-3">
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-bold text-primary flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> A friendlier phrasing</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-7 text-xs bg-background" onClick={() => {
                navigator.clipboard.writeText(feedback.suggestedRewrite);
                toast.success("Copied to clipboard!");
              }}>Copy</Button>
              <Button size="sm" className="h-7 text-xs" onClick={handleApplyRewrite}>Use this option</Button>
            </div>
          </div>
          <p className="text-sm font-medium italic text-foreground bg-background p-3.5 rounded-lg border leading-relaxed">"{feedback.suggestedRewrite}"</p>
        </div>

        {/* Behavioral Strategy Block */}
        <div className="w-full border rounded-xl p-5 bg-amber-50/20 border-amber-500/10 space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
            🚀 Real-world conversation advice
          </h5>
          <div className="space-y-2.5">
            {feedback.realWorldExecutionAdvice?.map((advice: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/90">
                <span className="text-amber-500 shrink-0 font-bold mt-0.5">•</span>
                <p className="font-medium">{advice}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full pt-2 flex gap-3">
          <Button variant="ghost" onClick={() => setFeedback(null)} className="text-sm font-semibold">Tweak draft</Button>
          <Button onClick={handleLockMilestone} disabled={isPending} className="flex-1 h-11 font-semibold text-sm">
            {isPending ? 'Saving progress...' : 'Lock in draft & claim XP'}
          </Button>
        </div>
      </div>
    );
  }

  // TRACK 3: COMPOSITION FORM
  return (
    <div className="w-full space-y-5 animate-in fade-in">
      <div className="w-full space-y-2">
        <Label className="text-sm font-semibold block">Choose a communication scenario *</Label>
        <select 
          value={scenarioId} 
          onChange={(e) => setScenarioId(e.target.value)}
          className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {SCENARIOS.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground p-3 bg-muted/40 rounded-lg border border-dashed leading-relaxed">
          <strong>Context:</strong> {currentScenario?.context}
        </p>
      </div>

      <div className="w-full space-y-2">
        <Label className="text-sm font-semibold block">Your raw draft message *</Label>
        <Textarea 
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Hey! I wanted to let you know that I'm finally working on a project to solve..."
          className="w-full min-h-[180px] resize-none p-4 text-sm font-medium leading-relaxed"
        />
        <div className="w-full flex items-center justify-between text-xs text-muted-foreground px-0.5">
          <span>Don't overthink it. Put it down like you're texting a close friend.</span>
          <span>{draft.length} characters</span>
        </div>
      </div>

      <div className="w-full pt-2 flex gap-3">
        {isInitiallyCompleted && (
          <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-sm font-semibold">Cancel</Button>
        )}
        <Button 
          onClick={handleRunCritique} 
          disabled={isPending || draft.length < 10} 
          className="flex-1 h-11 text-sm font-semibold"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
          {isPending ? "Sharing with coach..." : "Run it past the coach"}
        </Button>
      </div>
    </div>
  );
}
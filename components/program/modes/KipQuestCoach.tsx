'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $playbookStore, deactivateTaskFocus } from '@/lib/stores/companionStore';
import { $progressStore, setProgressStoreRow, ProgressPayload, ProgressRow } from '@/lib/stores/progressStore';
import { executeSidebarConductorAction } from '@/actions/ai';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, BookOpen, AlertCircle, Sparkles, CheckCircle2, ChevronRight, Link as LinkIcon, Video, Headphones } from 'lucide-react';

interface KipQuestCoachProps {
  missionId: string;
  questId: string;
  activeTaskId?: string | null; 
  progress: Record<string, ProgressRow>;
}

export function KipQuestCoach({ missionId, questId, activeTaskId, progress }: KipQuestCoachProps) {
  const playbook = useStore($playbookStore);
  
  const currentMission = playbook[missionId];
  const currentQuest = currentMission?.quests?.[questId];
  const currentTask = currentQuest?.tasks?.find((t) => t.id === activeTaskId);

  if (activeTaskId && !currentTask) {
    return (
      <div className="text-center py-8 text-xs text-muted-foreground animate-pulse">
        Opening workspace context...
      </div>
    );
  }

  return (
    <div className="w-full h-full text-xs">
      {currentTask ? (
        <KipTaskExecutionSuite 
          missionId={missionId}
          questId={questId}
          task={currentTask}
          progress={progress}
        />
      ) : (
        <KipQuestBlueprintSuite 
          missionId={missionId}
          quest={currentQuest}
          progress={progress}
        />
      )}
    </div>
  );
}

// ====================================================================
// SUB-SUITE A: MACRO QUEST CONTEXT (Planning, Goals, Rewards)
// ====================================================================
function KipQuestBlueprintSuite({ missionId, quest, progress }: { missionId: string; quest: any; progress: Record<string, ProgressRow> }) {
  if (!quest) return <p className="text-muted-foreground italic text-center py-4">Quest not found.</p>;

  const questTasks = quest.tasks || [];
  const completedCount = questTasks.filter((t: any) => progress[t.id]?.status === 'completed').length;
  const isQuestFullyCompleted = questTasks.length > 0 && completedCount === questTasks.length;

  return (
    <div className="space-y-5 animate-in fade-in duration-200 text-left">
      <div className="space-y-1">
        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase tracking-wider">
          Chapter Overview
        </span>
        <h3 className="text-sm font-bold text-foreground pt-1">{quest.title}</h3>
        <p className="text-muted-foreground leading-relaxed text-[11px] font-medium">{quest.description}</p>
      </div>

      {/* INTERACTIVE QUEST PLANNER */}
      <div className="border border-border bg-muted/30 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-foreground">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>Sprint Commitment Planner</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 rounded-lg bg-background border border-border/60">
            <span className="text-muted-foreground font-medium block text-[10px]">App Workspace</span>
            <span className="font-bold text-foreground">{quest.estimated_in_app_minutes || 0} Minutes</span>
          </div>
          <div className="p-2 rounded-lg bg-background border border-border/60">
            <span className="text-muted-foreground font-medium block text-[10px]">Real World Action</span>
            <span className="font-bold text-foreground">{quest.estimated_off_app_minutes || 0} Minutes</span>
          </div>
        </div>
        <Button size="sm" variant="outline" className="w-full h-7 font-bold text-[10px] gap-1.5 shadow-sm bg-background">
          📅 Lock Slots into My Calendar
        </Button>
      </div>

      {/* PROGRESS TRACKER */}
      <div className="border border-border bg-card rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="text-muted-foreground uppercase text-[10px] tracking-wide">Milestone Track</span>
          <span className="text-primary">{completedCount} / {questTasks.length} Checked</span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: `${(completedCount / (questTasks.length || 1)) * 100}%` }}
          />
        </div>

        {isQuestFullyCompleted && (
          <div className="mt-2 p-3 border border-emerald-500/20 bg-emerald-500/5 rounded-xl text-center space-y-2 animate-in zoom-in-95">
            <div className="flex items-center justify-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>Chapter Milestones Met!</span>
            </div>
            <p className="text-muted-foreground text-[11px] font-medium leading-relaxed">
              You cleared all active workspace challenges here. Your profile balance has been updated with extra points.
            </p>
            {quest.ai_config?.on_success?.badge_key && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-bold uppercase tracking-wider mx-auto">
                🏆 Unlocked: {quest.ai_config.on_success.badge_key}
              </div>
            )}
          </div>
        )}
      </div>

      {/* DYNAMIC FAQ ASSIST */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">
          Common Questions for this Chapter
        </span>
        <div className="space-y-1.5">
          <button className="w-full p-2.5 rounded-xl border border-border/80 bg-background text-left hover:border-primary/40 transition flex items-center justify-between text-muted-foreground font-medium group text-[11px] cursor-pointer">
            <span>How do I protect these blocks with a busy family schedule?</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition" />
          </button>
          <button className="w-full p-2.5 rounded-xl border border-border/80 bg-background text-left hover:border-primary/40 transition flex items-center justify-between text-muted-foreground font-medium group text-[11px] cursor-pointer">
            <span>What happens if I encounter an unexpected delay?</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ====================================================================
// SUB-SUITE B: INDIVIDUAL MICRO-TASK CONTEXT (Execution & Recommendations)
// ====================================================================
function KipTaskExecutionSuite({ missionId, questId, task, progress }: { missionId: string; questId: string; task: any; progress: Record<string, ProgressRow> }) {
  const [reflectionText, setReflectionText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeSummaryUrl, setActiveSummaryUrl] = useState<string | null>(null);
  const [cachedSummaries, setCachedSummaries] = useState<Record<string, string>>({});

  useEffect(() => {
    setReflectionText('');
    setActiveSummaryUrl(null);
  }, [task.id]);

  const taskProgress = progress[task.id];
  const isCompleted = taskProgress?.status === 'completed';
  const taskAiConfig = task.ai_config || {};
  const retroSaved = taskProgress?.saved_payload?.retrospective;

  const handleTriggerSummary = async (path: string) => {
    setActiveSummaryUrl(path);
    if (cachedSummaries[path]) return;
    
    setIsAiLoading(true);
    const response = await executeSidebarConductorAction({
      taskId: task.id,
      questId,
      missionId,
      contextType: 'resource_summary',
      userInputText: path
    });

    if (response.success && 'data' in response && response.data) {
      setCachedSummaries((prev) => ({
        ...prev,
        [path]: response.data.summary || response.data
      }));
    }
    setIsAiLoading(false);
  };

  const handleSendReflection = async () => {
    if (!reflectionText.trim()) return;
    setIsAiLoading(true);

    const response = await executeSidebarConductorAction({
      taskId: task.id,
      questId,
      missionId,
      contextType: 'retrospective_synthesis',
      userInputText: reflectionText
    });

    if (response.success && 'data' in response && response.data) {
      const existingPayload: ProgressPayload = (taskProgress?.saved_payload as ProgressPayload) || {};

      const updatedRow: ProgressRow = {
        ...(taskProgress || {
          id: crypto.randomUUID(),
          user_id: '',
          project_id: null,
          item_type: 'task',
          mission_id: missionId,
          quest_id: questId,
          task_id: task.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        }),
        status: 'completed',
        saved_payload: {
          ...existingPayload,
          retrospective: {
            questionPrompt: taskAiConfig.reflection_prompt || 'How did this step feel?',
            userResponseText: reflectionText,
            aiValidationText: response.data.validationText || response.data,
            isLoggedToJournal: false
          }
        }
      };

      setProgressStoreRow(updatedRow);
    }
    setIsAiLoading(false);
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'blog': return <BookOpen className="w-3.5 h-3.5 text-blue-500" />;
      case 'video': return <Video className="w-3.5 h-3.5 text-red-500" />;
      case 'podcast': return <Headphones className="w-3.5 h-3.5 text-orange-500" />;
      case 'internal_link': return <Sparkles className="w-3.5 h-3.5 text-purple-500" />;
      default: return <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-4 text-left animate-in fade-in duration-200">
      {/* Active Task Frame */}
      <div className="p-3.5 border rounded-xl bg-muted/20 border-border/70">
        <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
          Active Task {task.sequence}
        </span>
        <h4 className="text-xs font-bold text-foreground pt-1.5">{task.title}</h4>
      </div>

      {/* DYNAMIC RECOMMENDATIONS SUITE */}
      {!isCompleted && taskAiConfig.recommendations && taskAiConfig.recommendations.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">
            Suggested Material For This Step
          </span>
          
          {taskAiConfig.recommendations.map((rec: any, idx: number) => (
            <div key={idx} className="p-3.5 border border-border bg-card rounded-xl space-y-2.5 shadow-sm">
              <div className="space-y-0.5 text-left">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  {getRecommendationIcon(rec.type)}
                  <span className="truncate max-w-[160px]">{rec.title}</span>
                </div>
                {rec.subtitle && <p className="text-[10px] text-muted-foreground font-medium pl-5.5">{rec.subtitle}</p>}
              </div>

              {rec.type === 'blog' ? (
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="h-6.5 text-[10px] font-bold w-full rounded-lg cursor-pointer"
                  disabled={isAiLoading && activeSummaryUrl === rec.path_or_url}
                  onClick={() => handleTriggerSummary(rec.path_or_url)}
                >
                  {isAiLoading && activeSummaryUrl === rec.path_or_url ? 'Summarizing...' : '⚡ Read Kip Quick Summary'}
                </Button>
              ) : (
                <a href={rec.path_or_url} target={rec.type === 'internal_link' ? '_self' : '_blank'} rel="noreferrer" className="block w-full">
                  <Button size="sm" variant="outline" className="h-6.5 text-[10px] font-bold w-full rounded-lg bg-background cursor-pointer">
                    {rec.type === 'internal_link' ? '➜ Open Feature' : '➜ Open Link'}
                  </Button>
                </a>
              )}

              {rec.type === 'blog' && activeSummaryUrl === rec.path_or_url && cachedSummaries[rec.path_or_url] && (
                <div className="p-3 border rounded-xl bg-muted/40 text-muted-foreground font-medium text-[11px] mt-1 leading-relaxed border-border/50 animate-in slide-in-from-top-1 text-left">
                  {cachedSummaries[rec.path_or_url]}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* EXTRA STRETCH CHALLENGE BOX */}
      {!isCompleted && taskAiConfig.challenge && (
        <div className="p-3.5 border rounded-xl border-dashed bg-amber-500/5 border-amber-500/20 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Optional Stretch Challenge</span>
          </div>
          <p className="text-muted-foreground leading-relaxed font-medium text-[11px]">
            {taskAiConfig.challenge}
          </p>
        </div>
      )}

      {/* REFLECTION INPUT ZONE */}
      {isCompleted && !retroSaved?.userResponseText && (
        <div className="p-3.5 border border-emerald-500/20 bg-emerald-500/5 rounded-xl space-y-3 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>+{task.grant_points} XP Earned!</span>
          </div>
          
          <p className="font-semibold text-foreground leading-relaxed text-[11px]">
            {taskAiConfig.reflection_prompt || 'Task recorded. What did you notice through this step?'}
          </p>

          <Textarea 
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            disabled={isAiLoading}
            placeholder="Type your honest notes here..."
            className="text-xs bg-background resize-none h-20 rounded-lg border-border/80 focus-visible:ring-1"
          />

          <Button 
            size="sm" 
            className="w-full h-8 font-bold text-xs rounded-lg cursor-pointer"
            disabled={isAiLoading || !reflectionText.trim()}
            onClick={handleSendReflection}
          >
            {isAiLoading ? 'Saving thoughts...' : 'Submit Notes'}
          </Button>
        </div>
      )}

      {/* COMPLETED REFLECTION FEEDBACK FRAME */}
      {isCompleted && retroSaved?.aiValidationText && (
        <div className="space-y-3 animate-in fade-in">
          <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1.5 leading-relaxed font-medium text-[11px] border-border/70">
            <span className="font-bold text-foreground block text-[10px] uppercase tracking-wide text-muted-foreground">Kip's Note:</span>
            <p className="text-foreground/90 italic">"{retroSaved.aiValidationText}"</p>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-8 font-bold text-[11px] rounded-lg flex-1 cursor-pointer bg-background">
              💾 Save to Diary Archive
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 font-bold text-[11px] rounded-lg text-primary hover:bg-primary/5 cursor-pointer"
              onClick={() => deactivateTaskFocus()} 
            >
              Back to Overview
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
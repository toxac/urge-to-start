'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $playbookStore } from '@/lib/stores/companionStore';
import { $progressStore, setProgressStoreRow, ProgressPayload, ProgressRow } from '@/lib/stores/progressStore';
import { executeSidebarConductorAction } from '@/actions/ai';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface KipQuestCoachProps {
  missionId: string;
  questId: string;
  activeTaskId?: string;
  progress: Record<string, ProgressRow>;
}

export function KipQuestCoach({ missionId, questId, activeTaskId, progress }: KipQuestCoachProps) {
  const playbook = useStore($playbookStore);
  
  const [reflectionText, setReflectionText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeSummaryUrl, setActiveSummaryUrl] = useState<string | null>(null);
  const [cachedSummaries, setCachedSummaries] = useState<Record<string, string>>({});

  const currentMission = playbook[missionId];
  const currentQuest = currentMission?.quests?.[questId];
  
  // 1. Explicitly type currentTask using your rich frontend playbook types rather than database rows
  const currentTask = currentQuest?.tasks?.find((t) => t.id === activeTaskId) as any;

  useEffect(() => {
    setReflectionText('');
    setActiveSummaryUrl(null);
  }, [activeTaskId]);

  if (!currentTask) {
    return (
      <div className="text-center py-6 text-xs text-muted-foreground animate-pulse">
        Select or focus on any task canvas step to invoke Kip's helper node.
      </div>
    );
  }

  const taskProgress = progress[currentTask.id];
  const isCompleted = taskProgress?.status === 'completed';
  
  // SOLVES ERROR 1: Reads safely from our cast object layer mapping
  const taskAiConfig = currentTask.ai_config || {};
  const retroSaved = taskProgress?.saved_payload?.retrospective;

  const handleTriggerSummary = async (url: string) => {
    setActiveSummaryUrl(url);
    if (cachedSummaries[url]) return;
    
    setIsAiLoading(true);
    const response = await executeSidebarConductorAction({
      taskId: currentTask.id,
      questId,
      missionId,
      contextType: 'resource_summary',
      userInputText: url
    });

    if (response.success && response.data) {
      setCachedSummaries((prev) => ({
        ...prev,
        [url]: response.data.summary || response.data
      }));
    }
    setIsAiLoading(false);
  };

  const handleSendReflection = async () => {
    if (!reflectionText.trim()) return;
    setIsAiLoading(true);

    const response = await executeSidebarConductorAction({
      taskId: currentTask.id,
      questId,
      missionId,
      contextType: 'retrospective_synthesis',
      userInputText: reflectionText
    });

    if (response.success && response.data) {
      // SOLVES ERROR 2: Explicitly construct/cast the payload so TypeScript safely spreads it
      const existingPayload: ProgressPayload = (taskProgress?.saved_payload as ProgressPayload) || {};

      const updatedRow: ProgressRow = {
        ...(taskProgress || {
          id: crypto.randomUUID(),
          user_id: '',
          project_id: null,
          item_type: 'task',
          mission_id: missionId,
          quest_id: questId,
          task_id: currentTask.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        }),
        status: 'completed',
        saved_payload: {
          ...existingPayload, // Safe object type spread operation complete!
          retrospective: {
            questionPrompt: taskAiConfig.reflection_prompt || 'How did this feel?',
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

  return (
    <div className="space-y-4 text-xs animate-in fade-in duration-200">
      <div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
          Task Milestone {currentTask.sequence}
        </span>
        <h4 className="text-sm font-bold text-foreground mt-1.5">{currentTask.title}</h4>
        <p className="text-muted-foreground leading-relaxed mt-1">{currentTask.description}</p>
      </div>

      <hr className="border-muted/40" />

      {!isCompleted && (
        <div className="space-y-3 animate-in fade-in">
          {taskAiConfig.resources && taskAiConfig.resources.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                Tactical Resource Links
              </span>
              {taskAiConfig.resources.map((res: any, idx: number) => (
                <div key={idx} className="p-3 border rounded-xl bg-background flex flex-col gap-2">
                  <a href={res.url} target="_blank" rel="noreferrer" className="font-bold text-primary hover:underline">
                    {res.title}
                  </a>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="h-6 text-[11px]"
                    disabled={isAiLoading && activeSummaryUrl === res.url}
                    onClick={() => handleTriggerSummary(res.url)}
                  >
                    {isAiLoading && activeSummaryUrl === res.url ? 'Summarizing...' : '⚡ Summarize Link'}
                  </Button>

                  {activeSummaryUrl === res.url && cachedSummaries[res.url] && (
                    <div className="p-2 border rounded bg-muted/20 text-muted-foreground font-medium text-[11px] mt-1 leading-relaxed animate-in slide-in-from-top-1">
                      {cachedSummaries[res.url]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {taskAiConfig.alternative_approach && (
            <div className="p-3 rounded-xl border border-dashed bg-muted/10 space-y-1.5">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                Stuck? Try a Plan B Approach
              </span>
              <p className="text-muted-foreground leading-relaxed font-medium text-[11px]">
                {taskAiConfig.alternative_approach}
              </p>
            </div>
          )}
        </div>
      )}

      {isCompleted && !retroSaved?.userResponseText && (
        <div className="p-3 border border-emerald-500/20 bg-emerald-500/5 rounded-xl space-y-3 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2">
            <span className="text-base">🎉</span>
            <span className="font-bold text-foreground">+{currentTask.grant_points} XP Earned!</span>
          </div>
          
          <p className="font-medium text-foreground leading-relaxed">
            {taskAiConfig.reflection_prompt || 'Task complete. What did you learn through this step?'}
          </p>

          <Textarea 
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            disabled={isAiLoading}
            placeholder="Type your honest internal feedback or mood here..."
            className="text-xs bg-background resize-none h-20"
          />

          <Button 
            size="sm" 
            className="w-full h-8 font-semibold"
            disabled={isAiLoading || !reflectionText.trim()}
            onClick={handleSendReflection}
          >
            {isAiLoading ? 'Synthesizing thought...' : 'Submit Reflection'}
          </Button>
        </div>
      )}

      {isCompleted && retroSaved?.aiValidationText && (
        <div className="space-y-3 animate-in fade-in">
          <div className="p-3 rounded-xl border bg-muted/30 space-y-1.5 leading-relaxed font-medium text-[11px]">
            <span className="font-bold text-foreground block">Kip's Validation Note:</span>
            <p className="text-muted-foreground italic">"{retroSaved.aiValidationText}"</p>
          </div>

          <Button size="sm" variant="outline" className="w-full h-8 font-semibold">
            💾 Log to My Founder Journal Archive
          </Button>
        </div>
      )}
    </div>
  );
}
'use server';

import { createClient } from '@/lib/supabase/server';
import { executeKipConductor } from '@/lib/ai/conductor';
import { urgePlaybook } from '@/lib/playbook'; // ⚡ Unified playbook entry point
import { z } from 'zod';

const CritiqueOutputContract = z.object({
  score: z.number(),
  summary: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  suggestedRewrite: z.string(),
  realWorldExecutionAdvice: z.array(z.string()),
});

interface ActionParams {
  taskId?: string;
  questId?: string;
  missionId?: string;
  contextType: 'prerequisite_expansion' | 'resource_summary' | 'retrospective_synthesis';
  userInputText?: string; // Replaces promptKey for cache tracking
}

export async function analyzeUserMessageDraft(scenario: string, userDraft: string, userProfile: any) {
  return await executeKipConductor({
    model: 'deepseek-v4-pro',
    reasoningEffort: 'high',
    skills: ["Master Communicator", "Persuasion Strategist", "Human Behavior Expert"],
    userContext: {
      user_name: userProfile?.full_name,
      schedule_config: userProfile?.schedule_config // Aligned with upgraded schema
    },
    prompt: `
      The user is testing out a message draft for this specific scenario: "${scenario}".
      Here is their draft: "${userDraft}"

      Break down the emotional dynamics of this text. Give them a direct rewrite, and a 2-step blueprint on how to handle the follow-up loop.
    `,
    responseSchema: CritiqueOutputContract
  });
}

export async function executeSidebarConductorAction(params: ActionParams) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized access' };

  if (!params.missionId) return { success: false, error: 'Mission context required.' };
  const currentMission = urgePlaybook[params.missionId];
  if (!currentMission) return { success: false, error: 'Target mission not found in playbook.' };

  // 1. CACHE LAYER CHECK (Queries using context type and unique input strings)
  if (params.userInputText) {
    const { data: cache } = await supabase
      .from('ai_logs')
      .select('generated_output')
      .eq('user_id', user.id)
      .eq('context_type', params.contextType)
      .eq('user_input', params.userInputText)
      .maybeSingle();

    if (cache?.generated_output) {
      return { success: true, data: cache.generated_output };
    }
  }

  let dynamicPrompt = '';
  let activeSkills: string[] = ['Strategic Advisory'];

  // 2. ORCHESTRATE CONTEXT-AWARE SYSTEM DIRECTIONS
  switch (params.contextType) {
    
    case 'prerequisite_expansion': {
      const targetPrereq = currentMission.prerequisites?.find(p => p.item === params.userInputText);
      
      // Pull embedded raw text prompt with fallback
      dynamicPrompt = targetPrereq?.promptRawText || 
        `Provide a helpful, casual explanation of why a builder needs: "${params.userInputText}".`;
      
      activeSkills = ['MINDSET_COACHING', 'STRATEGIC_ALIGNMENT'];
      break;
    }

    case 'resource_summary': {
      if (!params.questId || !params.taskId || !params.userInputText) {
        return { success: false, error: 'Incomplete recommendation parameters.' };
      }
      
      const currentQuest = currentMission.quests?.[params.questId];
      const currentTask = currentQuest?.tasks?.find(t => t.id === params.taskId);
      const rec = currentTask?.ai_config?.recommendations?.find(r => r.path_or_url === params.userInputText);

      dynamicPrompt = `
        The user is executing the task: "${currentTask?.title}".
        Provide a friendly, clean, direct summary of this recommended ${rec?.type || 'material'}: "${rec?.title || params.userInputText}".
        Keep it under 3 brief paragraphs. Highlight actionable points using clean bullets and bolds.
      `;
      
      activeSkills = ['CONTENT_SYNTHESIS', 'TECHNICAL_TRANSLATION'];
      break;
    }

    case 'retrospective_synthesis': {
      if (!params.questId || !params.taskId || !params.userInputText) {
        return { success: false, error: 'Incomplete milestone details.' };
      }

      const currentQuest = currentMission.quests?.[params.questId];
      const currentTask = currentQuest?.tasks?.find(t => t.id === params.taskId);

      dynamicPrompt = `
        ACT AS PERSONA: "${currentQuest?.ai_config?.persona_name || 'The Mirror'}".
        PERSONA DIRECTIVE: "${currentQuest?.ai_config?.persona_prompt}".
        
        The user just completed the step: "${currentTask?.title}".
        They provided this reflection: "${params.userInputText}".
        
        Review their response as an encouraging friend. If their reflection is vague, challenge them gently to be more concrete.
      `;

      activeSkills = ['SYSTEM_CONDUCTOR', 'FOUNDER_REFLECTIONS'];
      break;
    }

    default:
      return { success: false, error: 'Unsupported operation context.' };
  }

  // 3. INVOKE DEEPSEEK CORE INTERFACE
  const aiResponse = await executeKipConductor({
    model: 'deepseek-chat',
    skills: activeSkills,
    prompt: dynamicPrompt
  });

  // 4. PERSIST TO LOG TABLE IF SUCCESSFUL
  if (aiResponse.success && aiResponse.data && params.userInputText) {
    await supabase.from('ai_logs').insert({
      user_id: user.id,
      mission_id: params.missionId,
      context_type: params.contextType,
      user_input: params.userInputText,
      generated_output: aiResponse.data // Pure string response mapped safely
    });
  }

  return aiResponse;
}
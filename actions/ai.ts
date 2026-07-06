// actions/ai.ts

'use server';

import { createClient } from '@/lib/supabase/server';
import { executeKipConductor } from '@/lib/ai/conductor';
import { urgePlaybook } from '@/lib/playbook';
import { z } from 'zod';

const CritiqueOutputContract = z.object({
  score: z.number(),
  summary: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  suggestedRewrite: z.string(),
  realWorldExecutionAdvice: z.array(z.string()),
});

// Schema for observation analysis output
export const ObservationAnalysisContract = z.object({
  pattern_recognition: z.string(),
  deeper_questions: z.array(z.string()),
  potential_opportunities: z.array(z.string()),
  encouragement: z.string(),
  next_steps: z.string(),
});

export type ObservationAnalysis = z.infer<typeof ObservationAnalysisContract>;

interface ActionParams {
  taskId?: string;
  questId?: string;
  missionId?: string;
  contextType: 'prerequisite_expansion' | 'resource_summary' | 'retrospective_synthesis' | 'observation_analysis';
  userInputText?: string;
  additionalContext?: Record<string, any>;
}

export async function analyzeUserMessageDraft(scenario: string, userDraft: string, userProfile: any) {
  return await executeKipConductor({
    model: 'deepseek-v4-pro',
    reasoningEffort: 'high',
    skills: ["Master Communicator", "Persuasion Strategist", "Human Behavior Expert"],
    userContext: {
      user_name: userProfile?.full_name,
      schedule_config: userProfile?.schedule_config
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
  let responseSchema: z.ZodSchema<any> | undefined = undefined;

  // 2. ORCHESTRATE CONTEXT-AWARE SYSTEM DIRECTIONS
  switch (params.contextType) {
    
    case 'prerequisite_expansion': {
      const targetPrereq = currentMission.prerequisites?.find(p => p.item === params.userInputText);
      
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

    case 'observation_analysis': {
      if (!params.questId || !params.taskId || !params.userInputText) {
        return { success: false, error: 'Incomplete observation details.' };
      }

      const currentQuest = currentMission.quests?.[params.questId];
      const currentTask = currentQuest?.tasks?.find(t => t.id === params.taskId);
      
      // Get analysis prompt from task config or use default
      const analysisPrompt = params.additionalContext?.analysisPrompt || currentTask?.ai_config?.observation_analysis_prompt;
      const guideQuestions = params.additionalContext?.guideQuestions || currentTask?.observation_config?.guide_questions || [];

      dynamicPrompt = `
        ACT AS PERSONA: "${currentQuest?.ai_config?.persona_name || 'The Observer'}".
        
        ${analysisPrompt || `
          You are Kip, a grounded mentor helping an entrepreneur reflect on their real-world observations.
          
          The user has just completed an observation period for the task: "${currentTask?.title}".
          
          Your job:
          1. Listen carefully to what they observed
          2. Identify patterns across their observations
          3. Help them see connections between different observations
          4. Ask deeper questions that help them notice more
          5. Help them distinguish between minor annoyances and real business opportunities
          6. Don't judge their observations—all observations are valuable data
          7. Keep it conversational and supportive—like a friend helping you think through something
          8. Don't give them the answers—ask questions that help them discover insights themselves
        `}
        
        The user shared these observations:
        "${params.userInputText}"
        
        ${guideQuestions.length > 0 ? `Reference these guiding questions: ${guideQuestions.join(', ')}` : ''}
        
        Please respond with a structured analysis that includes:
        1. Pattern recognition: What themes or patterns do you see?
        2. Deeper questions: What would help them understand this better?
        3. Potential opportunities: Where could this lead?
        4. Encouragement: Acknowledge their effort
        5. Next steps: What should they do with this insight?
      `;

      activeSkills = ['OBSERVATION_ANALYSIS', 'PATTERN_RECOGNITION', 'COACHING'];
      responseSchema = ObservationAnalysisContract;
      break;
    }

    default:
      return { success: false, error: 'Unsupported operation context.' };
  }

  // 3. INVOKE DEEPSEEK CORE INTERFACE
  const aiResponse = await executeKipConductor({
    model: 'deepseek-chat',
    skills: activeSkills,
    prompt: dynamicPrompt,
    responseSchema: responseSchema
  });

  // 4. PERSIST TO LOG TABLE IF SUCCESSFUL
  if (aiResponse.success && aiResponse.data && params.userInputText) {
    await supabase.from('ai_logs').insert({
      user_id: user.id,
      mission_id: params.missionId,
      quest_id: params.questId || null,
      task_id: params.taskId || null,
      context_type: params.contextType,
      user_input: params.userInputText,
      generated_output: aiResponse.data
    });
  }

  return aiResponse;
}
import { deepseek } from './deepseekClient';
import { z } from 'zod';

interface KipExecutionParams {
  skills: string[];
  userContext?: Record<string, any>;
  prompt: string;
  responseSchema?: z.ZodSchema<any>;
  model?: 'deepseek-chat' | 'deepseek-v4-pro'; 
  reasoningEffort?: 'low' | 'medium' | 'high';
}

export async function executeKipConductor({
  skills,
  userContext = {},
  prompt,
  responseSchema,
  model = 'deepseek-chat', 
  reasoningEffort = 'medium'
}: KipExecutionParams) {
  
  // ⚡ Rewritten to be completely friendly and clear
  const baseSystemDirective = `
    You are Kip, a grounded mentor, collaborative friend, and advisor assisting an entrepreneur who is building a new business through the Urge program.
    
    YOUR CURRENT ACTIVE EXPERTISE TIERS: ${skills.join(', ')}

    COMMUNICATION GUIDELINES:
    - Talk to the user as a peer and close collaborator.
    - Be clear, direct, and practical. 
    - NEVER use corporate lingo, optimization buzzwords, or aggressive hustle talk.
    - Focus on helpful truths and real-world execution steps.
  `;

  const formattedContext = `
    BACKGROUND USER PARAMETERS:
    ${JSON.stringify(userContext, null, 2)}
  `;

  try {
    const runInJsonMode = !!responseSchema;

    const requestPayload: Record<string, any> = {
      model: model,
      messages: [
        { role: 'system', content: baseSystemDirective },
        { role: 'user', content: `CONTEXT LOGS:\n${formattedContext}\n\nCORE PROMPT ACTION:\n${prompt}` }
      ],
      response_format: runInJsonMode ? { type: 'json_object' } : undefined,
      temperature: model === 'deepseek-v4-pro' ? undefined : 0.5, 
    };

    if (model === 'deepseek-v4-pro') {
      requestPayload.thinking = { type: 'enabled' };
      requestPayload.reasoning_effort = reasoningEffort;
    }

    const response = await deepseek.chat.completions.create(requestPayload as any);
    const outputContent = response.choices[0]?.message?.content;
    
    if (!outputContent) throw new Error("Empty response token returned from AI engine.");

    if (responseSchema) {
      const parsedJson = JSON.parse(outputContent);
      const validated = responseSchema.safeParse(parsedJson);
      
      if (!validated.success) {
        console.error("Kip Structural Output Mismatch:", validated.error);
        return { success: false, error: "Kip returned data in an unexpected configuration. Let's try once more!" };
      }
      return { success: true, data: validated.data };
    }

    return { success: true, data: outputContent };

  } catch (error: any) {
    console.error("🚨 Conductor execution block error:", error);
    return { 
      success: false, 
      error: "Kip is deep in thought right now. Try hitting submit again in a brief second!" 
    };
  }
}
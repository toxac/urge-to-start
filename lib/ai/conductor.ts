import { deepseek } from './deepseekClient';
import { z } from 'zod';

interface KipExecutionParams {
  skills: string[];
  userContext?: Record<string, any>;
  prompt: string;
  responseSchema?: z.ZodSchema<any>;
  // Dynamic Model Configuration Options
  model?: 'deepseek-chat' | 'deepseek-v4-pro'; 
  reasoningEffort?: 'low' | 'medium' | 'high';
}

/**
 * Core AI Orchestrator Wrapper with Dynamic Cost-Optimized Routing.
 */
export async function executeKipConductor({
  skills,
  userContext = {},
  prompt,
  responseSchema,
  model = 'deepseek-chat', // Default to the ultra-cheap, fast standard chat engine
  reasoningEffort = 'medium'
}: KipExecutionParams) {
  
  const baseSystemDirective = `
    You are Kip, a grounded mentor, collaborative friend, and advisor assisting an entrepreneur who is building a new business through the Urge program.
    
    YOUR CURRENT ACTIVE EXPERTISE TIERS: ${skills.join(', ')}

    CRITICAL LANGUAGE RULES:
    - Address the user as a trusted friend and peer. 
    - Speak directly, warmly, and authentically.
    - ABSOLUTELY PROHIBITED: No corporate jargon, no Silicon Valley optimization speak, and no defensive/hustle fluff.
    - Be real. Give practical, honest advice that works in the real world.
  `;

  const formattedContext = `
    BACKGROUND USER PARAMETERS:
    ${JSON.stringify(userContext, null, 2)}
  `;

  try {
    const runInJsonMode = !!responseSchema;

    // Build out the dynamic request body properties based on model type
    const requestPayload: Record<string, any> = {
      model: model,
      messages: [
        { role: 'system', content: baseSystemDirective },
        { role: 'user', content: `CONTEXT LOGS:\n${formattedContext}\n\nCORE PROMPT ACTION:\n${prompt}` }
      ],
      response_format: runInJsonMode ? { type: 'json_object' } : undefined,
      temperature: model === 'deepseek-v4-pro' ? undefined : 0.6, // DeepSeek deep reasoning usually prefers default or strict temp maps
    };

    // Inject deep thinking chain-of-thought rules only if routing to the pro model
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
        return { success: false, error: "Kip returned data in an invalid format. Let's try again!" };
      }
      return { success: true, data: validated.data };
    }

    return { success: true, data: outputContent };

  } catch (error: any) {
    console.error("🚨 Conductor execution block error:", error);
    return { 
      success: false, 
      error: "Kip is deep in thought right now and timed out for a second. Try hitting submit once more!" 
    };
  }
}
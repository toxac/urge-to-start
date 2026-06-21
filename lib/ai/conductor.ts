import { deepseek } from './deepseekClient';
import { z } from 'zod';

interface KipExecutionParams {
  skills: string[];              // e.g., ["Human Behavior Expert", "Persuasion Strategist"]
  userContext?: Record<string, any>; // Pass down profiles data, constraints, or current mission info
  prompt: string;                // The specific core task instructions or user input draft
  responseSchema?: z.ZodSchema<any>; // Optional Zod structure if we need strict JSON outputs
}

/**
 * Core AI Orchestrator Wrapper. 
 * Assembles system rules, structures background context, and enforces Kip's tone.
 */
export async function executeKipConductor({
  skills,
  userContext = {},
  prompt,
  responseSchema
}: KipExecutionParams) {
  
  // 1. Core Language & Persona Blueprint Guideline
  const baseSystemDirective = `
    You are Kip, a grounded mentor, collaborative friend, and advisor assisting an entrepreneur who is building a new business through the Urge program.
    
    YOUR CURRENT ACTIVE EXPERTISE TIERS: ${skills.join(', ')}

    CRITICAL LANGUAGE RULES:
    - Address the user as a trusted friend and peer. 
    - Speak directly, warmly, and authentically.
    - ABSOLUTELY PROHIBITED: No corporate jargon, no Silicon Valley optimization speak, and no defensive/hustle fluff ("synergy", "pivoting", "fail fast", "unpacking"). 
    - Be real. Give practical, honest advice that works in the real world.
  `;

  // 2. Structuring context safely so DeepSeek parses background facts clearly
  const formattedContext = `
    BACKGROUND USER PARAMETERS:
    ${JSON.stringify(userContext, null, 2)}
  `;

  try {
    // If a Zod validation schema is provided, we tell DeepSeek to lock into strict JSON mode
    const runInJsonMode = !!responseSchema;

    const response = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: baseSystemDirective },
        { role: 'user', content: `CONTEXT LOGS:\n${formattedContext}\n\nCORE PROMPT ACTION:\n${prompt}` }
      ],
      response_format: runInJsonMode ? { type: 'json_object' } : undefined,
      temperature: 0.6,
    });

    const outputContent = response.choices[0]?.message?.content;
    if (!outputContent) throw new Error("Empty response token returned from AI engine.");

    // 3. Optional Schema Validation Shield Layer
    if (responseSchema) {
      const parsedJson = JSON.parse(outputContent);
      const validated = responseSchema.safeParse(parsedJson);
      
      if (!validated.success) {
        console.error("Kip Structural Output Mismatch:", validated.error);
        return { success: false, error: "Kip returned data in a format the app couldn't read. Give it another shot!" };
      }
      return { success: true, data: validated.data };
    }

    // Default return for raw text streaming or simple prompt evaluations
    return { success: true, data: outputContent };

  } catch (error: any) {
    console.error("🚨 Conductor execution block encountered an error:", error);
    return { 
      success: false, 
      error: "Kip is currently chewing on some ideas and went offline for a second. Try hitting submit once more." 
    };
  }
}



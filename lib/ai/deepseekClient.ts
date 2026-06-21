import OpenAI from 'openai';

// Safety check to ensure your environment keys are properly wired up
if (!process.env.DEEPSEEK_API_KEY) {
  console.warn("⚠️ Warning: DEEPSEEK_API_KEY environment variable is missing.");
}

export const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com/v1', // Routes calls through DeepSeek's optimized endpoints
});
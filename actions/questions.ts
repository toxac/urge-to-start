// actions/questions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { executeSidebarConductorAction } from '@/actions/ai';
import { AskQuestionSchema, UserQuestionInsert } from '@/types/questions';
import { z } from 'zod';

export async function askQuestion(params: z.infer<typeof AskQuestionSchema>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Check existing question
  const { data: existing } = await supabase
    .from('user_questions')
    .select('id, ai_answer, status, question, flagged_for_admin, admin_answer')
    .eq('user_id', user.id)
    .eq('item_type', params.itemType)
    .eq('item_id', params.itemId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (existing && existing.ai_answer && existing.status !== 'flagged_for_admin') {
    return { success: true, data: existing, isNew: false };
  }

  // Call AI
  const aiResult = await executeSidebarConductorAction({
    contextType: 'program_question',
    userInputText: params.question,
    additionalContext: {
      itemType: params.itemType,
      itemId: params.itemId,
    },
  });

  if (!aiResult.success) {
    throw new Error(aiResult.error || 'Failed to get AI answer');
  }

  // ✅ Now we know success is true, so we can safely access data
  // We'll cast aiResult as { success: true; data: any }
  const result = aiResult as { success: true; data: any };
  const aiData = result.data;
  const aiAnswer = typeof aiData === 'string' ? aiData : aiData?.answer || '';

  const insert: UserQuestionInsert = {
    user_id: user.id,
    item_type: params.itemType,
    item_id: params.itemId,
    question: params.question,
    ai_answer: aiAnswer,
    status: 'answered_by_ai',
    flagged_for_admin: false,
  };

  const { data, error } = await supabase
    .from('user_questions')
    .insert(insert)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return { success: true, data, isNew: true };
}

export async function flagQuestionForAdmin(questionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('user_questions')
    .update({ flagged_for_admin: true, status: 'flagged_for_admin' })
    .eq('id', questionId)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function getQuestionForItem(itemType: string, itemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('user_questions')
    .select('*')
    .eq('user_id', user.id)
    .eq('item_type', itemType)
    .eq('item_id', itemId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return data || null;
}
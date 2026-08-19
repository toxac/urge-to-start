// actions/budget.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * 1. Fetch all materials/unit items for a project (Task 1)
 */
export async function getUserMaterialsAction(projectId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const { data, error } = await supabase
      .from('user_materials')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to fetch materials' };
  }
}

/**
 * 2. Save or update a material item (Task 1: Unit Costs)
 */
export async function saveUserMaterialAction(payload: {
  id?: string;
  projectId: string;
  name: string;
  category?: string;
  resourceType?: 'physical' | 'service';
  costStructure?: 'per_unit' | 'recurring' | 'one_time';
  frequency?: 'one_time' | 'weekly' | 'monthly' | 'yearly';
  unit?: string;
  quantityNeeded?: number;
  unitCost?: number;
  notes?: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const itemData = {
      user_id: user.id,
      project_id: payload.projectId,
      name: payload.name.trim(),
      category: payload.category || 'general',
      resource_type: payload.resourceType || 'physical',
      cost_structure: payload.costStructure || 'per_unit',
      frequency: payload.frequency || null,
      unit: payload.unit || 'unit',
      quantity_needed: payload.quantityNeeded ?? 1,
      unit_cost: payload.unitCost ?? 0,
      notes: payload.notes || null,
      updated_at: new Date().toISOString(),
    };

    let resultData;

    if (payload.id) {
      const { data, error } = await supabase
        .from('user_materials')
        .update(itemData)
        .eq('id', payload.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      resultData = data;
    } else {
      const { data, error } = await supabase
        .from('user_materials')
        .insert(itemData)
        .select()
        .single();

      if (error) throw error;
      resultData = data;
    }

    revalidatePath('/program');
    return { success: true, data: resultData };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save material item' };
  }
}

/**
 * 3. Delete a material item (Task 1)
 */
export async function deleteUserMaterialAction(materialId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const { error } = await supabase
      .from('user_materials')
      .delete()
      .eq('id', materialId)
      .eq('user_id', user.id);

    if (error) throw error;

    revalidatePath('/program');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete material item' };
  }
}

/**
 * 4. Fetch all budget items for a project (Tasks 2 & 3)
 */
export async function getUserBudgetItemsAction(projectId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const { data, error } = await supabase
      .from('user_budget_items')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to fetch budget items' };
  }
}

/**
 * 5. Save or update a budget item (Tasks 2 & 3: Overhead & Acquisition)
 */
export async function saveUserBudgetItemAction(payload: {
  id?: string;
  projectId: string;
  kind: 'startup_cost' | 'recurring_cost' | 'revenue_projection';
  category: string;
  title: string;
  estimatedAmount: number;
  currency?: string;
  frequency?: 'one_time' | 'weekly' | 'monthly' | 'yearly';
  notes?: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const itemData = {
      user_id: user.id,
      project_id: payload.projectId,
      kind: payload.kind,
      category: payload.category,
      title: payload.title.trim(),
      estimated_amount: payload.estimatedAmount ?? 0,
      currency: payload.currency || 'INR',
      frequency: payload.frequency || 'one_time',
      notes: payload.notes || null,
      updated_at: new Date().toISOString(),
    };

    let resultData;

    if (payload.id) {
      const { data, error } = await supabase
        .from('user_budget_items')
        .update(itemData)
        .eq('id', payload.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      resultData = data;
    } else {
      const { data, error } = await supabase
        .from('user_budget_items')
        .insert(itemData)
        .select()
        .single();

      if (error) throw error;
      resultData = data;
    }

    revalidatePath('/program');
    return { success: true, data: resultData };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save budget item' };
  }
}

/**
 * 6. Delete a budget item (Tasks 2 & 3)
 */
export async function deleteUserBudgetItemAction(budgetItemId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required' };
    }

    const { error } = await supabase
      .from('user_budget_items')
      .delete()
      .eq('id', budgetItemId)
      .eq('user_id', user.id);

    if (error) throw error;

    revalidatePath('/program');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete budget item' };
  }
}

/**
 * 7. Aggregate financial summary for Task 4 (Analysis & Review)
 */
export async function getCostSummaryAction(projectId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
      return { success: false, error: 'Authentication required' };
    }

    // Fetch materials (variable cost per unit)
    const { data: materials } = await supabase
      .from('user_materials')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', user.id);

    // Fetch budget items (startup costs, overhead, acquisition)
    const { data: budgetItems } = await supabase
      .from('user_budget_items')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', user.id);

    const mList = materials || [];
    const bList = budgetItems || [];

    // Calculations
    const unitCost = mList
      .filter((m) => m.cost_structure === 'per_unit')
      .reduce((sum, item) => sum + Number(item.quantity_needed || 1) * Number(item.unit_cost || 0), 0);

    const totalStartupCost = bList
      .filter((b) => b.kind === 'startup_cost')
      .reduce((sum, item) => sum + Number(item.estimated_amount || 0), 0);

    const monthlyOverhead = bList
      .filter((b) => b.kind === 'recurring_cost' && b.frequency === 'monthly' && b.category !== 'customer_acquisition')
      .reduce((sum, item) => sum + Number(item.estimated_amount || 0), 0);

    const monthlyAcquisitionBudget = bList
      .filter((b) => b.category === 'customer_acquisition')
      .reduce((sum, item) => sum + Number(item.estimated_amount || 0), 0);

    return {
      success: true,
      data: {
        unitCost,
        totalStartupCost,
        monthlyOverhead,
        monthlyAcquisitionBudget,
        materialsCount: mList.length,
        budgetItemsCount: bList.length,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to calculate cost summary' };
  }
}
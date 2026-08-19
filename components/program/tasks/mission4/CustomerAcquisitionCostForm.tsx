// components/program/tasks/mission4/CustomerAcquisitionCostForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getActiveProjectAction } from '@/actions/projects';
import { 
  getUserBudgetItemsAction, 
  saveUserBudgetItemAction, 
  deleteUserBudgetItemAction 
} from '@/actions/budget';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { TaskResourcesList } from '../TaskResourcesList';
import { Database } from '@/types/supabase';
import { CustomerPersona } from '@/types/projects';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Megaphone, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  AlertCircle, 
  Edit2,
  Users,
  Target,
  Sparkles,
  Coins
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];
type UserBudgetItemRow = Database['public']['Tables']['user_budget_items']['Row'];

export function CustomerAcquisitionCostForm({
  task,
  existingProgress,
  onSuccess
}: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [persona, setPersona] = useState<CustomerPersona | null>(null);
  const [acquisitionItems, setAcquisitionItems] = useState<UserBudgetItemRow[]>([]);

  const isCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isCompleted);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Field State
  const [title, setTitle] = useState('');
  const [channelType, setChannelType] = useState('social_ads');
  const [frequency, setFrequency] = useState<'one_time' | 'monthly'>('monthly');
  const [estimatedAmount, setEstimatedAmount] = useState<number>(0);

  // Load project, persona, and acquisition budget items
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const projRes = await getActiveProjectAction();
      if (projRes.success && projRes.data) {
        setActiveProject(projRes.data);

        // Fetch Persona from discovery_metrics if present
        const discoveryMetrics = (projRes.data.discovery_metrics as any) || {};
        if (Array.isArray(discoveryMetrics.customer_personas) && discoveryMetrics.customer_personas.length > 0) {
          setPersona(discoveryMetrics.customer_personas[0]);
        }

        const budgetRes = await getUserBudgetItemsAction(projRes.data.id);
        if (budgetRes.success && budgetRes.data) {
          // Filter ONLY customer acquisition items
          setAcquisitionItems(budgetRes.data.filter((b) => b.category === 'customer_acquisition'));
        } else if (!budgetRes.success) {
          setErrorMessage(budgetRes.error || 'Failed to load marketing budget');
        }
      } else {
        setErrorMessage(!projRes.success ? projRes.error : 'Failed to load active project');
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Compute total marketing budget
  const totalMonthlyMarketing = acquisitionItems
    .filter((b) => b.frequency === 'monthly')
    .reduce((sum, item) => sum + Number(item.estimated_amount || 0), 0);

  const totalOneTimeMarketing = acquisitionItems
    .filter((b) => b.frequency === 'one_time')
    .reduce((sum, item) => sum + Number(item.estimated_amount || 0), 0);

  const handleAddAcquisitionItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !title.trim()) return;

    setIsAdding(true);
    setErrorMessage(null);

    const kind = frequency === 'one_time' ? 'startup_cost' : 'recurring_cost';

    const saveRes = await saveUserBudgetItemAction({
      projectId: activeProject.id,
      kind,
      category: 'customer_acquisition',
      title: `${title.trim()} (${channelType.replace('_', ' ')})`,
      estimatedAmount: Number(estimatedAmount) || 0,
      frequency,
    });

    if (saveRes.success && saveRes.data) {
      setAcquisitionItems((prev) => [...prev, saveRes.data as UserBudgetItemRow]);
      // Reset inputs
      setTitle('');
      setEstimatedAmount(0);
    } else {
      setErrorMessage(saveRes.error || 'Failed to add marketing cost');
    }

    setIsAdding(false);
  };

  const handleDeleteItem = async (id: string) => {
    setErrorMessage(null);
    const delRes = await deleteUserBudgetItemAction(id);
    if (delRes.success) {
      setAcquisitionItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setErrorMessage(delRes.error || 'Failed to remove marketing cost');
    }
  };

  const handleSubmitAcquisition = async () => {
    if (!activeProject) return;
    if (acquisitionItems.length === 0) {
      setErrorMessage('Please add at least one marketing or acquisition expense.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        monthly_marketing_budget: totalMonthlyMarketing,
        one_time_marketing_budget: totalOneTimeMarketing,
        items_count: acquisitionItems.length,
        items: acquisitionItems.map((b) => ({
          title: b.title,
          frequency: b.frequency,
          amount: b.estimated_amount
        }))
      }
    });

    if (taskRes.success) {
      setIsEditing(false);
      if (onSuccess) onSuccess();
    } else {
      setErrorMessage(taskRes.error || 'Failed to complete step');
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        <p className="text-xs text-muted-foreground font-medium">Loading customer acquisition details...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-left">
      {errorMessage && (
        <div className="p-4 border rounded-xl bg-destructive/10 border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* RECOMMENDED RESOURCES */}
      <TaskResourcesList resources={task.resources} />

      {/* ANCHOR: PERSONA CARD FROM MISSION 2 */}
      {persona && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Target Persona Anchor
            </span>
            <span className="text-xs font-bold text-foreground">{persona.persona_name || persona.job_title_or_role}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-background/80 border border-border/50">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Watering Holes / Where They Hang Out</span>
              <p className="font-medium text-foreground">{persona.watering_holes || 'Not specified'}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-background/80 border border-border/50">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Main Pain Point</span>
              <p className="font-medium text-foreground truncate">
                {persona.ranked_pain_points?.[0] || 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MARKETING BUDGET SUMMARY BANNER */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-card flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block flex items-center gap-1">
            <Megaphone className="w-3.5 h-3.5" /> Monthly Acquisition Budget
          </span>
          <p className="text-xs text-muted-foreground">Total money planned per month to reach and acquire buyers.</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-extrabold text-foreground">₹{totalMonthlyMarketing.toLocaleString('en-IN')}</span>
          <span className="text-[10px] font-bold text-muted-foreground block uppercase">/ month</span>
        </div>
      </div>

      {/* READ-ONLY COMPLETED VIEW */}
      {acquisitionItems.length > 0 && !isEditing ? (
        <div className="w-full space-y-4 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Acquisition Plan Saved ({acquisitionItems.length} Channels/Items)
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Plan
            </Button>
          </div>

          <div className="space-y-2">
            {acquisitionItems.map((item) => (
              <div key={item.id} className="p-3 rounded-xl bg-card border border-border/60 flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{item.title}</span>
                <div className="text-right">
                  <span className="font-bold text-foreground">₹{Number(item.estimated_amount).toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-muted-foreground block uppercase">{item.frequency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* EDITABLE FORM VIEW */
        <div className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              Plan Your Acquisition Channels & Budget
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              How will you get your customer's attention? Add ad spend, printed flyers, stall fees, giveaways, or social media tools.
            </p>
          </div>

          {/* ADD ACQUISITION ITEM FORM */}
          <form onSubmit={handleAddAcquisitionItem} className="p-4 rounded-xl border border-border/80 bg-background space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Channel / Campaign Title */}
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-[11px] font-bold text-foreground">Marketing Activity / Tool *</Label>
                <Input
                  placeholder="e.g. Meta Instagram Ads, Local Cafe Flyers, Free Sample Batch, Klaviyo Email Tool"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xs h-9"
                  required
                />
              </div>

              {/* Channel Type */}
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-foreground">Channel Type</Label>
                <Select 
                  value={channelType} 
                  onValueChange={(val) => setChannelType(val ?? 'social_ads')}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social_ads">Paid Social Ads (Meta/Google)</SelectItem>
                    <SelectItem value="print_local">Printed Flyers & Banners</SelectItem>
                    <SelectItem value="samples_events">Free Samples & Event Popups</SelectItem>
                    <SelectItem value="influencer">Influencer Commissions & Gifts</SelectItem>
                    <SelectItem value="software_tools">Email & Marketing Software</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Frequency */}
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-foreground">Cost Type</Label>
                <Select 
                  value={frequency} 
                  onValueChange={(val) => setFrequency((val ?? 'monthly') as any)}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly Recurring</SelectItem>
                    <SelectItem value="one_time">One-Time Test / Promo Batch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Estimated Budget */}
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-[11px] font-bold text-foreground">Estimated Amount (₹) *</Label>
                <Input
                  type="number"
                  min="0"
                  value={estimatedAmount}
                  onChange={(e) => setEstimatedAmount(parseFloat(e.target.value) || 0)}
                  className="text-xs h-9"
                  required
                />
              </div>

            </div>

            <Button
              type="submit"
              disabled={isAdding || !title.trim()}
              className="w-full text-xs font-bold uppercase tracking-wider cursor-pointer gap-1.5 h-9 bg-primary text-primary-foreground mt-2"
            >
              {isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>Add Marketing Budget Item</span>
            </Button>
          </form>

          {/* ADDED ITEMS LIST */}
          <div className="space-y-2 pt-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Planned Acquisition Expenses ({acquisitionItems.length})
            </Label>

            {acquisitionItems.length === 0 ? (
              <p className="text-xs text-muted-foreground italic p-4 rounded-xl border border-dashed text-center">
                No marketing costs added yet. Add your planned channels or tools above.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {acquisitionItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-background border border-border flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <span className="font-bold text-foreground truncate block">{item.title}</span>
                      <span className="text-[10px] text-muted-foreground block uppercase">
                        {item.frequency === 'monthly' ? 'Monthly Ad / Channel Budget' : 'One-Time Marketing Test'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-extrabold text-foreground">
                        ₹{Number(item.estimated_amount).toLocaleString('en-IN')}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* HELPFUL NUDGE */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-600 dark:text-amber-400 flex items-start gap-2">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Golden Rule:</strong> In the beginning, it's better to pick 1 or 2 focused channels where your persona hangs out than spreading a small budget across 5 different platforms.
            </span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-2 pt-2 border-t border-border/50">
            {acquisitionItems.length > 0 && isCompleted && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditing(false)}
                className="h-10 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </Button>
            )}
            <Button
              type="button"
              onClick={handleSubmitAcquisition}
              disabled={isSubmitting || acquisitionItems.length === 0}
              className="flex-1 h-10 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Save Plan & Review Cost Summary</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
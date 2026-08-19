// components/program/tasks/mission4/OtherCostsForm.tsx
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
  Building2, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  AlertCircle, 
  Edit2,
  Receipt,
  Sparkles,
  Wrench,
  RefreshCw
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];
type UserBudgetItemRow = Database['public']['Tables']['user_budget_items']['Row'];

export function OtherCostsForm({
  task,
  existingProgress,
  onSuccess
}: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [budgetItems, setBudgetItems] = useState<UserBudgetItemRow[]>([]);

  const isCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isCompleted);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Field State
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<'startup_cost' | 'recurring_cost'>('startup_cost');
  const [category, setCategory] = useState('legal_setup');
  const [frequency, setFrequency] = useState<'one_time' | 'monthly' | 'yearly'>('one_time');
  const [estimatedAmount, setEstimatedAmount] = useState<number>(0);

  // Fetch active project & budget items
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const projRes = await getActiveProjectAction();
      if (projRes.success && projRes.data) {
        setActiveProject(projRes.data);

        const budgetRes = await getUserBudgetItemsAction(projRes.data.id);
        if (budgetRes.success && budgetRes.data) {
          // Filter out marketing items (handled separately in Task 3)
          setBudgetItems(budgetRes.data.filter((b) => b.category !== 'customer_acquisition'));
        } else if (!budgetRes.success) {
          setErrorMessage(budgetRes.error || 'Failed to load overhead costs');
        }
      } else {
        setErrorMessage(!projRes.success ? projRes.error : 'Failed to load active project');
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Compute category totals dynamically
  const totalStartup = budgetItems
    .filter((b) => b.kind === 'startup_cost')
    .reduce((sum, item) => sum + Number(item.estimated_amount || 0), 0);

  const totalMonthlyOverhead = budgetItems
    .filter((b) => b.kind === 'recurring_cost' && b.frequency === 'monthly')
    .reduce((sum, item) => sum + Number(item.estimated_amount || 0), 0);

  const handleAddBudgetItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !title.trim()) return;

    setIsAdding(true);
    setErrorMessage(null);

    const saveRes = await saveUserBudgetItemAction({
      projectId: activeProject.id,
      kind,
      category,
      title: title.trim(),
      estimatedAmount: Number(estimatedAmount) || 0,
      frequency: kind === 'startup_cost' ? 'one_time' : frequency,
    });

    if (saveRes.success && saveRes.data) {
      setBudgetItems((prev) => [...prev, saveRes.data as UserBudgetItemRow]);
      // Reset inputs
      setTitle('');
      setEstimatedAmount(0);
    } else {
      setErrorMessage(saveRes.error || 'Failed to add cost item');
    }

    setIsAdding(false);
  };

  const handleDeleteItem = async (id: string) => {
    setErrorMessage(null);
    const delRes = await deleteUserBudgetItemAction(id);
    if (delRes.success) {
      setBudgetItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setErrorMessage(delRes.error || 'Failed to remove cost item');
    }
  };

  const handleSubmitOverhead = async () => {
    if (!activeProject) return;
    if (budgetItems.length === 0) {
      setErrorMessage('Please add at least one setup expense or monthly bill.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        total_startup_capital: totalStartup,
        total_monthly_overhead: totalMonthlyOverhead,
        items_count: budgetItems.length,
        items: budgetItems.map((b) => ({
          title: b.title,
          kind: b.kind,
          category: b.category,
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
        <p className="text-xs text-muted-foreground font-medium">Loading overhead & setup costs...</p>
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

      {/* SUMMARY BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5" /> One-Time Setup Costs
            </span>
            <span className="text-[11px] text-muted-foreground">Permits, equipment, design</span>
          </div>
          <span className="text-lg font-extrabold text-foreground">₹{totalStartup.toLocaleString('en-IN')}</span>
        </div>

        <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" /> Monthly Operating Bills
            </span>
            <span className="text-[11px] text-muted-foreground">Fixed software, rent, retainers</span>
          </div>
          <span className="text-lg font-extrabold text-foreground">₹{totalMonthlyOverhead.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-muted-foreground">/mo</span></span>
        </div>
      </div>

      {/* READ-ONLY COMPLETED VIEW */}
      {budgetItems.length > 0 && !isEditing ? (
        <div className="w-full space-y-4 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Setup & Overhead Costs Saved ({budgetItems.length} Items)
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Costs
            </Button>
          </div>

          <div className="space-y-2">
            {budgetItems.map((item) => (
              <div key={item.id} className="p-3 rounded-xl bg-card border border-border/60 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground">{item.title}</span>
                  <span className="text-[10px] text-muted-foreground block uppercase">
                    {item.kind === 'startup_cost' ? 'One-time setup' : `Monthly bill (${item.category.replace('_', ' ')})`}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-foreground">₹{Number(item.estimated_amount).toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-muted-foreground block uppercase">
                    {item.frequency}
                  </span>
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
              <Building2 className="w-3.5 h-3.5" />
              Log Your Business Expenses
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Log one-time setup costs (equipment, licenses, design) and fixed monthly subscriptions or overhead.
            </p>
          </div>

          {/* ADD ITEM FORM */}
          <form onSubmit={handleAddBudgetItem} className="p-4 rounded-xl border border-border/80 bg-background space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Expense Title */}
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-[11px] font-bold text-foreground">Expense Title *</Label>
                <Input
                  placeholder="e.g. FSSAI Permit, Shopify Plan, Sewing Machine, Domain Name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xs h-9"
                  required
                />
              </div>

              {/* Expense Type (Kind) */}
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-foreground">Expense Type</Label>
                <Select 
                  value={kind} 
                  onValueChange={(val) => {
                    const selected = (val ?? 'startup_cost') as 'startup_cost' | 'recurring_cost';
                    setKind(selected);
                    if (selected === 'startup_cost') setFrequency('one_time');
                    else setFrequency('monthly');
                  }}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup_cost">One-time Setup Cost</SelectItem>
                    <SelectItem value="recurring_cost">Monthly / Regular Bill</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-foreground">Category</Label>
                <Select 
                  value={category} 
                  onValueChange={(val) => setCategory(val ?? 'legal_setup')}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="legal_setup">Permits, Legal & GST</SelectItem>
                    <SelectItem value="equipment">Equipment & Tools</SelectItem>
                    <SelectItem value="software">Software & Apps</SelectItem>
                    <SelectItem value="rent">Workspace / Kitchen Rent</SelectItem>
                    <SelectItem value="operations">Other Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Frequency (Only shown for recurring costs) */}
              {kind === 'recurring_cost' && (
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-foreground">Billing Frequency</Label>
                  <Select 
                    value={frequency} 
                    onValueChange={(val) => setFrequency((val ?? 'monthly') as any)}
                  >
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Estimated Amount */}
              <div className="space-y-1">
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
              <span>Add Expense Item</span>
            </Button>
          </form>

          {/* ADDED ITEMS LIST */}
          <div className="space-y-2 pt-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Expenses Added ({budgetItems.length})
            </Label>

            {budgetItems.length === 0 ? (
              <p className="text-xs text-muted-foreground italic p-4 rounded-xl border border-dashed text-center">
                No setup or overhead costs added yet. Add items above to build your baseline budget.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {budgetItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-background border border-border flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <span className="font-bold text-foreground truncate block">{item.title}</span>
                      <span className="text-[10px] text-muted-foreground block uppercase">
                        {item.kind === 'startup_cost' ? 'One-Time Setup' : `Recurring ${item.frequency}`} • {item.category.replace('_', ' ')}
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

          {/* ACTION BUTTONS */}
          <div className="flex gap-2 pt-2 border-t border-border/50">
            {budgetItems.length > 0 && isCompleted && (
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
              onClick={handleSubmitOverhead}
              disabled={isSubmitting || budgetItems.length === 0}
              className="flex-1 h-10 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Save Overhead & Plan Acquisition</span>
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
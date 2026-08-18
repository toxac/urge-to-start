// components/program/tasks/mission4/FeatureBrainstormForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getActiveProjectAction, updateProjectRequirementsAction } from '@/actions/projects';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { TaskResourcesList } from '../TaskResourcesList';
import { FeatureRequirement, PromisePayload } from '@/types/projects';
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
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  AlertCircle, 
  Edit2,
  ListTodo,
  Layers
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

export function FeatureBrainstormForm({
  task,
  existingProgress,
  onSuccess
}: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [promise, setPromise] = useState<PromisePayload | null>(null);
  const [requirements, setRequirements] = useState<FeatureRequirement[]>([]);

  const isCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isCompleted);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New item inputs
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<FeatureRequirement['category']>('core_product');

  useEffect(() => {
    async function loadData() {
      const res = await getActiveProjectAction();
      if (res.success && res.data) {
        setActiveProject(res.data);
        const solutionDesign = (res.data.solution_design as any) || {};

        if (solutionDesign.promise) {
          setPromise(solutionDesign.promise);
        }

        if (Array.isArray(solutionDesign.requirements)) {
          setRequirements(solutionDesign.requirements);
        }
      } else {
        setErrorMessage(!res.success ? res.error : 'Failed to load active project');
      }
    }
    loadData();
  }, []);

  const handleAddRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: FeatureRequirement = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      category: newCategory,
      priority: 'must_have', // Default to must-have until Task 3 classification
      created_at: new Date().toISOString(),
    };

    setRequirements((prev) => [...prev, newItem]);
    setNewTitle('');
  };

  const handleRemoveRequirement = (id: string) => {
    setRequirements((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmitBrainstorm = async () => {
    if (!activeProject) return;
    if (requirements.length === 0) {
      setErrorMessage('Please add at least one requirement or feature to your list.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    // 1. Save requirements list to user_projects.solution_design
    const updateRes = await updateProjectRequirementsAction(activeProject.id, requirements);

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to save requirements list');
      setIsSubmitting(false);
      return;
    }

    // 2. Process Task Completion
    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        requirements_count: requirements.length,
        requirements
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

      {/* ANCHOR: CORE PROMISE DISPLAY */}
      {promise?.final_value_prop && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Your Core Product Promise
          </span>
          <p className="text-xs font-semibold text-foreground leading-relaxed">{promise.final_value_prop}</p>
        </div>
      )}

      {/* READ-ONLY COMPLETED VIEW */}
      {requirements.length > 0 && !isEditing ? (
        <div className="w-full space-y-4 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Requirements Brainstorm Saved ({requirements.length} Items)
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit List
            </Button>
          </div>

          <div className="space-y-2">
            {requirements.map((item) => (
              <div key={item.id} className="p-3 rounded-xl bg-card border border-border/60 flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{item.title}</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  {item.category.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* FORM VIEW */
        <div className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
              <ListTodo className="w-3.5 h-3.5" />
              Brainstorm Product Requirements
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              List what needs to be built or set up to deliver on your promise. Add software features, manual operations, or delivery tools.
            </p>
          </div>

          {/* ADD ITEM INPUT ROW */}
          <form onSubmit={handleAddRequirement} className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Input
                placeholder="e.g. Automated PDF receipt email, WhatsApp order notification"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="text-xs h-9 bg-background"
              />
            </div>
            <div className="w-full sm:w-44">
              <Select
                value={newCategory}
                onValueChange={(val) => setNewCategory(val as FeatureRequirement['category'])}
              >
                <SelectTrigger className="text-xs h-9 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="core_product">Core Product</SelectItem>
                  <SelectItem value="customer_ops">Customer Support</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="marketing_sales">Sales/Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={!newTitle.trim()}
              className="h-9 text-xs font-bold cursor-pointer gap-1 px-4 bg-primary text-primary-foreground"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </Button>
          </form>

          {/* ADDED ITEMS LIST */}
          <div className="space-y-2 pt-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Brainstormed List ({requirements.length})
            </Label>
            {requirements.length === 0 ? (
              <p className="text-xs text-muted-foreground italic p-4 rounded-xl border border-dashed text-center">
                No items added yet. Type a feature or requirement above and click Add.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {requirements.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-background border border-border flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Layers className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="font-semibold text-foreground truncate">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {item.category.replace('_', ' ')}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRequirement(item.id)}
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
            {requirements.length > 0 && isCompleted && (
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
              onClick={handleSubmitBrainstorm}
              disabled={isSubmitting || requirements.length === 0}
              className="flex-1 h-10 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Save Brainstorm & Prioritize</span>
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
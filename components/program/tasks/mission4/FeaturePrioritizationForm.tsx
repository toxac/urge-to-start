// components/program/tasks/mission4/FeaturePrioritizationForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getActiveProjectAction, updateProjectRequirementsAction } from '@/actions/projects';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { TaskResourcesList } from '../TaskResourcesList';
import { FeatureRequirement } from '@/types/projects';
import { Database } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  AlertCircle, 
  Edit2,
  Filter,
  Check,
  Clock,
  Ban
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

export function FeaturePrioritizationForm({
  task,
  existingProgress,
  onSuccess
}: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [requirements, setRequirements] = useState<FeatureRequirement[]>([]);

  const isCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isCompleted);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const res = await getActiveProjectAction();
      if (res.success && res.data) {
        setActiveProject(res.data);
        const solutionDesign = (res.data.solution_design as any) || {};

        if (Array.isArray(solutionDesign.requirements)) {
          setRequirements(solutionDesign.requirements);
        }
      } else {
        setErrorMessage(!res.success ? res.error : 'Failed to load active project');
      }
    }
    loadData();
  }, []);

  const handlePriorityChange = (id: string, newPriority: FeatureRequirement['priority']) => {
    setRequirements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, priority: newPriority } : item))
    );
  };

  const handleSubmitPrioritization = async () => {
    if (!activeProject) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const updateRes = await updateProjectRequirementsAction(activeProject.id, requirements);

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to save feature priorities');
      setIsSubmitting(false);
      return;
    }

    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        must_haves_count: requirements.filter((r) => r.priority === 'must_have').length,
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

  const mustHaves = requirements.filter((r) => r.priority === 'must_have');
  const shouldHaves = requirements.filter((r) => r.priority === 'should_have');
  const excluded = requirements.filter((r) => r.priority === 'excluded');

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

      {/* READ-ONLY COMPLETED VIEW */}
      {requirements.length > 0 && !isEditing ? (
        <div className="w-full space-y-5 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Feature Focus Locked ({mustHaves.length} Must-Haves)
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Adjust Focus
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Must Haves Column */}
            <div className="p-3.5 rounded-xl bg-card border border-emerald-500/30 space-y-2">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">
                🔴 Must-Have for Day 1 ({mustHaves.length})
              </span>
              <div className="space-y-1">
                {mustHaves.map((item) => (
                  <div key={item.id} className="p-2 rounded bg-muted/30 text-xs font-semibold text-foreground">
                    {item.title}
                  </div>
                ))}
              </div>
            </div>

            {/* Should Haves Column */}
            <div className="p-3.5 rounded-xl bg-card border border-amber-500/30 space-y-2">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">
                🟡 Nice-to-Have Later ({shouldHaves.length})
              </span>
              <div className="space-y-1">
                {shouldHaves.map((item) => (
                  <div key={item.id} className="p-2 rounded bg-muted/30 text-xs font-semibold text-foreground">
                    {item.title}
                  </div>
                ))}
              </div>
            </div>

            {/* Excluded Column */}
            <div className="p-3.5 rounded-xl bg-card border border-border space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                ⚪ Excluded for Launch ({excluded.length})
              </span>
              <div className="space-y-1">
                {excluded.map((item) => (
                  <div key={item.id} className="p-2 rounded bg-muted/30 text-xs font-semibold text-muted-foreground line-through">
                    {item.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* FORM VIEW */
        <div className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              Classify Your Day 1 Requirements
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Decide what is mandatory for Day 1 launch versus what can wait. Keep Day 1 lean!
            </p>
          </div>

          {requirements.length === 0 ? (
            <p className="text-xs text-muted-foreground italic p-4 rounded-xl border border-dashed text-center">
              No requirements found. Please complete Task 2 (Feature Brainstorm) first.
            </p>
          ) : (
            <div className="space-y-3">
              {requirements.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground">{item.title}</span>
                    <span className="text-[10px] text-muted-foreground block uppercase">
                      Category: {item.category.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      type="button"
                      size="sm"
                      variant={item.priority === 'must_have' ? 'default' : 'outline'}
                      onClick={() => handlePriorityChange(item.id, 'must_have')}
                      className={`h-7 text-[11px] font-bold cursor-pointer gap-1 ${
                        item.priority === 'must_have'
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <Check className="w-3 h-3" /> Must-Have
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant={item.priority === 'should_have' ? 'default' : 'outline'}
                      onClick={() => handlePriorityChange(item.id, 'should_have')}
                      className={`h-7 text-[11px] font-bold cursor-pointer gap-1 ${
                        item.priority === 'should_have'
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <Clock className="w-3 h-3" /> Later
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant={item.priority === 'excluded' ? 'default' : 'outline'}
                      onClick={() => handlePriorityChange(item.id, 'excluded')}
                      className={`h-7 text-[11px] font-bold cursor-pointer gap-1 ${
                        item.priority === 'excluded'
                          ? 'bg-muted-foreground text-white'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <Ban className="w-3 h-3" /> Exclude
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex gap-2 pt-2 border-t border-border/50">
            {isCompleted && (
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
              onClick={handleSubmitPrioritization}
              disabled={isSubmitting || requirements.length === 0}
              className="flex-1 h-10 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Save Focus & Map Journey</span>
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
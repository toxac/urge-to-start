// components/program/tasks/mission4/CustomerJourneyForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getActiveProjectAction, updateCustomerJourneyAction } from '@/actions/projects';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { TaskResourcesList } from '../TaskResourcesList';
import { CustomerJourneyStep } from '@/types/projects';
import { Database } from '@/types/supabase';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  AlertCircle, 
  Edit2,
  MapPin,
  ShoppingBag,
  Package,
  HeartHandshake
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

const DEFAULT_STAGES: CustomerJourneyStep[] = [
  {
    step_number: 1,
    stage: 'discovery',
    title: 'How do they find you?',
    what_happens: '',
    how_it_happens: '',
    why_it_matters: ''
  },
  {
    step_number: 2,
    stage: 'buying',
    title: 'How do they pay or sign up?',
    what_happens: '',
    how_it_happens: '',
    why_it_matters: ''
  },
  {
    step_number: 3,
    stage: 'delivery',
    title: 'How do they get what they bought?',
    what_happens: '',
    how_it_happens: '',
    why_it_matters: ''
  },
  {
    step_number: 4,
    stage: 'post_sales',
    title: 'How do you keep in touch & support them?',
    what_happens: '',
    how_it_happens: '',
    why_it_matters: ''
  }
];

export function CustomerJourneyForm({
  task,
  existingProgress,
  onSuccess
}: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [journeySteps, setJourneySteps] = useState<CustomerJourneyStep[]>(DEFAULT_STAGES);

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

        if (Array.isArray(solutionDesign.customer_journey) && solutionDesign.customer_journey.length > 0) {
          setJourneySteps(solutionDesign.customer_journey);
        }
      } else {
        setErrorMessage(!res.success ? res.error : 'Failed to load active project');
      }
    }
    loadData();
  }, []);

  const handleFieldChange = (
    index: number,
    field: keyof CustomerJourneyStep,
    value: string
  ) => {
    setJourneySteps((prev) =>
      prev.map((step, idx) => (idx === index ? { ...step, [field]: value } : step))
    );
  };

  const handleSubmitJourney = async () => {
    if (!activeProject) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const updateRes = await updateCustomerJourneyAction(activeProject.id, journeySteps);

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to save customer journey');
      setIsSubmitting(false);
      return;
    }

    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        journey_steps: journeySteps
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

  const renderStageIcon = (stage: string) => {
    switch (stage) {
      case 'discovery':
        return <MapPin className="w-4 h-4 text-amber-500" />;
      case 'buying':
        return <ShoppingBag className="w-4 h-4 text-emerald-500" />;
      case 'delivery':
        return <Package className="w-4 h-4 text-blue-500" />;
      default:
        return <HeartHandshake className="w-4 h-4 text-primary" />;
    }
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

      {/* READ-ONLY COMPLETED VIEW */}
      {!isEditing ? (
        <div className="w-full space-y-5 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Customer Journey Map Saved
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Journey
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {journeySteps.map((step) => (
              <div key={step.step_number} className="p-3.5 rounded-xl bg-card border border-border/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  {renderStageIcon(step.stage)}
                  <span>Step {step.step_number}: {step.title}</span>
                </div>
                <div className="space-y-1 text-muted-foreground text-[11px]">
                  <p><strong>What:</strong> {step.what_happens || 'N/A'}</p>
                  <p><strong>How:</strong> {step.how_it_happens || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* FORM VIEW */
        <div className="p-5 rounded-2xl border border-border bg-card/60 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Step-by-Step Customer Journey
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Walk through each phase of what your customer experiences from start to finish.
            </p>
          </div>

          <div className="space-y-6">
            {journeySteps.map((step, idx) => (
              <div key={step.step_number} className="p-4 rounded-xl bg-background border border-border space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                  {renderStageIcon(step.stage)}
                  <span>Stage {step.step_number}: {step.title}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold text-foreground">What happens here? *</Label>
                    <Input
                      placeholder="e.g. Sees Instagram ad or word-of-mouth referral"
                      value={step.what_happens}
                      onChange={(e) => handleFieldChange(idx, 'what_happens', e.target.value)}
                      className="text-xs h-9 bg-card"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold text-foreground">How do you deliver it? (Tools/Action)</Label>
                    <Input
                      placeholder="e.g. Stripe checkout page or manual UPI link"
                      value={step.how_it_happens}
                      onChange={(e) => handleFieldChange(idx, 'how_it_happens', e.target.value)}
                      className="text-xs h-9 bg-card"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

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
              onClick={handleSubmitJourney}
              disabled={isSubmitting}
              className="flex-1 h-10 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Complete Journey & Finish Quest</span>
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
// components/program/tasks/common/OpportunityForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { createOpportunityAction, getUserOpportunitiesAction } from '@/actions/opportunities';
import { getUserObservationsAction } from '@/actions/observations';
import { setTaskStatusInProgressAction } from '@/actions/progress';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { Database } from '@/types/supabase';
import { BaseTaskComponentProps } from '../types';
import { ReferenceSchema } from '@/types/playbook';
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  ExternalLink, 
  Plus, 
  Lightbulb, 
  Sparkles, 
  ArrowRight,
  Eye,
  Check
} from 'lucide-react';

type UserOpportunityRow = Database['public']['Tables']['user_opportunities']['Row'];
type UserObservationRow = Database['public']['Tables']['user_observations']['Row'];
type OpportunitySourceType = Database['public']['Enums']['opportunity_source_type'];

interface OpportunityInputs {
  title: string;
  description: string;
  linked_observation_id?: string;
  target_audience?: string;
  potential_solution?: string;
}

export function OpportunityForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [opportunities, setOpportunities] = useState<UserOpportunityRow[]>([]);
  const [filteredObservations, setFilteredObservations] = useState<UserObservationRow[]>([]);
  const [selectedObsId, setSelectedObsId] = useState<string | null>(null);

  const sourceType: OpportunitySourceType = 
    (task.metadata?.opportunity_source_type as OpportunitySourceType) || 
    (task.observation_context?.category as OpportunitySourceType) || 
    'personal_problems';

  const isCompleted = existingProgress?.status === 'completed';
  const isInProgress = existingProgress?.status === 'in_progress' || opportunities.length > 0;

  const [showForm, setShowForm] = useState(!isCompleted);

  const requiredResources: ReferenceSchema[] = (task.resources || []).filter((r: ReferenceSchema) => r.isRequired);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<OpportunityInputs>();

  // Fetch logged opportunities and matching observations
  useEffect(() => {
    async function loadData() {
      const [oppRes, obsRes] = await Promise.all([
        getUserOpportunitiesAction(sourceType),
        getUserObservationsAction()
      ]);

      if (oppRes.success && oppRes.data) {
        setOpportunities(oppRes.data);
      }
      if (obsRes.success && obsRes.data) {
        // ⚡ Filter observations to ONLY show those matching the current sourceType / category
        const filtered = obsRes.data.filter((obs) => {
          const cat = (obs.metadata as any)?.category || 'personal_problems';
          return cat === sourceType;
        });
        setFilteredObservations(filtered);
      }
    }
    loadData();
  }, [task.id, sourceType]);

  const handleSelectObservation = (obs: UserObservationRow) => {
    setSelectedObsId(obs.id);
    setValue('linked_observation_id', obs.id);
    setValue('title', `Solving: ${obs.what.slice(0, 60)}${obs.what.length > 60 ? '...' : ''}`);
    setValue('target_audience', obs.who);
  };

  const onSubmitOpportunity = async (formData: OpportunityInputs) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const oppRes = await createOpportunityAction({
        taskId: task.id,
        title: formData.title,
        description: formData.description,
        sourceType,
        status: 'raw_seed',
        captureMetadata: {
          linked_observation_id: formData.linked_observation_id || null,
          target_audience: formData.target_audience || null,
          potential_solution: formData.potential_solution || null,
          source_task_id: task.id
        }
      });

      if (!oppRes.success) {
        setErrorMessage(oppRes.error || 'Failed to save opportunity');
        setIsSubmitting(false);
        return;
      }

      const newOpportunity = oppRes.data;
      setOpportunities(prev => [newOpportunity, ...prev]);

      // Switch task progress to 'in_progress' if not set
      if (!isCompleted && existingProgress?.status !== 'in_progress') {
        const progressRes = await setTaskStatusInProgressAction({
          taskId: task.id,
          questId: (task as any).quest_id,
          missionId: (task as any).mission_id,
        });

        if (progressRes.success && progressRes.data) {
          setProgressStoreRow(progressRes.data as any);
        }
      }

      setSelectedObsId(null);
      reset({
        title: '',
        description: '',
        linked_observation_id: '',
        target_audience: '',
        potential_solution: ''
      });

    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteTask = async () => {
    if (opportunities.length === 0) {
      setErrorMessage('Please capture at least one opportunity before completing this step.');
      return;
    }

    setIsCompleting(true);
    setErrorMessage(null);

    try {
      const taskResult = await processTaskCompletion({
        task,
        savedPayload: {
          total_opportunities: opportunities.length,
          source_type: sourceType,
          completed_at: new Date().toISOString()
        }
      });

      if (!taskResult.success) {
        setErrorMessage(taskResult.error || 'Failed to record task completion');
        setIsCompleting(false);
        return;
      }

      setShowForm(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="w-full space-y-6 text-left">
      {errorMessage && (
        <div className="w-full p-4 border rounded-xl bg-destructive/10 border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* REQUIRED RESOURCES BANNER */}
      {requiredResources.length > 0 && (
        <div className="p-4 rounded-xl border bg-primary/5 border-primary/20 space-y-2">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Required Action Guides (Read First)
          </span>
          <div className="space-y-1.5">
            {requiredResources.map((res, idx) => (
              <a
                key={idx}
                href={res.url_link}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg border bg-card hover:bg-muted/30 transition flex items-center justify-between text-xs font-semibold text-foreground group"
              >
                <span>{res.title}</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* COMPLETED BANNER */}
      {isCompleted && !showForm && (
        <div className="w-full space-y-3 border rounded-2xl p-5 bg-emerald-500/5 border-emerald-500/20 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Opportunities Seeded & Step Completed
            </span>
            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-bold">
              {opportunities.length} Raw Seeds Captured
            </Badge>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
            className="text-xs font-semibold gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Additional Opportunity
          </Button>
        </div>
      )}

      {/* LOGGED OPPORTUNITIES SEED LIST */}
      {opportunities.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Seeded Opportunities ({opportunities.length}):
            </span>
            {isInProgress && !isCompleted && (
              <Badge variant="outline" className="text-[9px] font-mono border-amber-500/40 text-amber-500 bg-amber-500/10">
                In Progress
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {opportunities.map((opp) => (
              <div key={opp.id} className="p-4 rounded-xl border border-border bg-card space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span className="flex items-center gap-1.5 text-primary">
                    <Lightbulb className="w-3.5 h-3.5" />
                    {opp.title}
                  </span>
                  <Badge variant="secondary" className="text-[9px] font-mono uppercase">
                    {opp.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {opp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FORM INPUT */}
      {(showForm || !isCompleted) && (
        <form onSubmit={handleSubmit(onSubmitOpportunity)} className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Turn Frustration or Skill into Opportunity
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {task.briefing_text}
            </p>
          </div>

          {/* LINKED OBSERVATION QUICK-PICKER (FILTERED BY CURRENT SOURCE TYPE ONLY) */}
          {filteredObservations.length > 0 && (
            <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Select from Your Relevant Logged Observations:
              </span>
              <div className="flex flex-col gap-2">
                {filteredObservations.map((obs) => {
                  const isSelected = selectedObsId === obs.id;
                  return (
                    <button
                      key={obs.id}
                      type="button"
                      onClick={() => handleSelectObservation(obs)}
                      className={`text-xs font-medium px-3 py-2 rounded-xl border transition text-left cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected 
                          ? 'border-primary bg-primary/10 text-foreground font-bold shadow-xs' 
                          : 'border-border bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span className="leading-snug">"{obs.what}"</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Opportunity Title */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground block">
              Opportunity Title *
            </Label>
            <Input
              type="text"
              placeholder="e.g. Solving: Difficulty planning meals around existing groceries"
              className="text-xs h-9 bg-background"
              {...register('title', { required: true, minLength: 3 })}
            />
            {errors.title && (
              <p className="text-[11px] text-destructive font-semibold">
                Please give your opportunity a clear title.
              </p>
            )}
          </div>

          {/* Target Audience */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground block">
              Target Audience / Who Has This Problem?
            </Label>
            <Input
              type="text"
              placeholder="e.g. Busy students, working professionals, myself"
              className="text-xs h-9 bg-background"
              {...register('target_audience')}
            />
          </div>

          {/* Potential Concept / Solution Idea (Textarea) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground block">
              Potential Concept / Solution Idea
            </Label>
            <Textarea
              className="text-xs leading-relaxed bg-background resize-none min-h-[75px]"
              placeholder="e.g. A web app where you input ingredients in your fridge, and it generates 3 quick recipes under 20 minutes with zero extra shopping required."
              {...register('potential_solution')}
            />
          </div>

          {/* Opportunity Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground block">
              Opportunity Description / Why is this valuable? *
            </Label>
            <Textarea
              className="text-xs leading-relaxed bg-background resize-none min-h-[85px]"
              placeholder="e.g. Grocery waste is high and people end up ordering takeout because planning meals takes mental energy. Solving this saves $100+/month and reduces daily decision fatigue."
              {...register('description', { required: true, minLength: 10 })}
            />
            {errors.description && (
              <p className="text-[11px] text-destructive font-semibold">
                Please write a short description (at least 10 characters).
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="outline"
            className="w-full h-10 text-xs font-bold uppercase tracking-wider cursor-pointer gap-1.5"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Seeding Opportunity...
              </span>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Save Opportunity Seed
              </>
            )}
          </Button>
        </form>
      )}

      {/* COMPLETE TASK CTA */}
      {!isCompleted && opportunities.length > 0 && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-foreground block">
              Ready to wrap up this task?
            </span>
            <p className="text-[11px] text-muted-foreground">
              You have seeded {opportunities.length} opportunity seed{opportunities.length > 1 ? 's' : ''}. Complete the step to earn your XP.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleCompleteTask}
            disabled={isCompleting}
            className="h-10 px-5 text-xs font-bold tracking-wider uppercase cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
          >
            {isCompleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Complete Task (+{task.grant_points} XP)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
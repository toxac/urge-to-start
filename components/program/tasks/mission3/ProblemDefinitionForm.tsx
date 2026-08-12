// components/program/tasks/mission3/ProblemDefinitionForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/types/supabase';
import { synthesizeProblemFromInterviewsAction } from '@/actions/assessments';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  getActiveProjectAction, 
  updateProjectDiscoveryMetricsAction
} from '@/actions/projects';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { ProblemHypothesis, InterviewRecord } from '@/types/projects';
import { TaskResourcesList } from '../TaskResourcesList';
import { 
  Loader2, 
  AlertCircle, 
  Target, 
  Quote, 
  ArrowRight,
  Link2,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

interface ProblemInputs {
  problem_statement: string;
  when_context: string;
  where_location: string;
  affected_audience: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'occasionally' | 'seasonal';
  current_workaround: string;
}

export function ProblemDefinitionForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [loggedInterviews, setLoggedInterviews] = useState<InterviewRecord[]>([]);
  const [showInterviews, setShowInterviews] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ProblemInputs>({
    defaultValues: {
      frequency: 'daily'
    }
  });

  useEffect(() => {
    async function loadProject() {
      const res = await getActiveProjectAction();
      if (res.success) {
        setActiveProject(res.data);
        const discovery = (res.data.discovery_metrics as any) || {};
        const validation = (res.data.validation_data as any) || {};

        setLoggedInterviews(validation.interviews || []);

        if (discovery.problem_hypothesis) {
          const hyp: ProblemHypothesis = discovery.problem_hypothesis;
          reset({
            problem_statement: hyp.problem_statement || '',
            when_context: hyp.when_context || '',
            where_location: hyp.where_location || '',
            affected_audience: hyp.affected_audience || '',
            frequency: hyp.frequency || 'daily',
            current_workaround: hyp.current_workaround || '',
          });
        }
      } else {
        setErrorMessage(res.error || 'Failed to load active project');
      }
    }
    loadProject();
  }, [reset]);

  // AI Synthesis Handler
  const handleAiSynthesize = async () => {
  if (loggedInterviews.length === 0) {
    setErrorMessage('Please log at least one customer interview before synthesizing with AI.');
    return;
  }

  setIsAiLoading(true);
  setErrorMessage(null);

  const res = await synthesizeProblemFromInterviewsAction({
    opportunityTitle: activeProject?.biz_name || undefined,
    interviews: loggedInterviews
  });

  if (res.success && res.data) {
    if (res.data.problem_statement) setValue('problem_statement', res.data.problem_statement);
    if (res.data.affected_audience) setValue('affected_audience', res.data.affected_audience);
    if (res.data.when_context) setValue('when_context', res.data.when_context);
    if (res.data.where_location) setValue('where_location', res.data.where_location);
    if (res.data.current_workaround) setValue('current_workaround', res.data.current_workaround);
    if (res.data.frequency) setValue('frequency', res.data.frequency as any);
  } else {
    setErrorMessage(res.error || 'Failed to generate AI problem synthesis.');
  }

  setIsAiLoading(false);
};

  const onSubmitProblem = async (data: ProblemInputs) => {
    if (!activeProject) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const problemPayload: ProblemHypothesis = {
      ...data,
      defined_at: new Date().toISOString()
    };

    const updateRes = await updateProjectDiscoveryMetricsAction(activeProject.id, {
      problem_hypothesis: problemPayload
    });

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to save problem definition');
      setIsSubmitting(false);
      return;
    }

    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        opportunity_id: activeProject.opportunity_id,
        problem_hypothesis: problemPayload
      }
    });

    if (taskRes.success && onSuccess) {
      onSuccess();
    } else {
      setErrorMessage(taskRes.error || 'Failed to complete step');
      setIsSubmitting(false);
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

      {/* LINKED OPPORTUNITY & PROJECT BANNER */}
      {activeProject && (
        <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-primary shrink-0" />
            <span className="font-bold text-foreground">
              Active Project: <span className="text-primary">{activeProject.biz_name || 'Untitled Venture'}</span>
            </span>
          </div>
          {activeProject.opportunity_id && (
            <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-500 bg-emerald-500/10">
              Opportunity Linked
            </Badge>
          )}
        </div>
      )}

      {/* RECOMMENDED RESOURCES / PLAYBOOK GUIDES */}
      <TaskResourcesList resources={task.resources} />

      {/* COLLAPSIBLE GROUNDING BANNER: SHOW ALL LOGGED INTERVIEW QUOTES */}
      {loggedInterviews.length > 0 && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden transition-all">
          <div 
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-primary/10 transition"
            onClick={() => setShowInterviews(!showInterviews)}
          >
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5 text-amber-500" />
              Customer Evidence ({loggedInterviews.length} Conversations Logged)
            </span>
            <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 text-primary">
              {showInterviews ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {showInterviews && (
            <div className="p-3.5 pt-0 grid grid-cols-1 gap-2">
              {loggedInterviews.map((item) => (
                <div key={item.id} className="p-2.5 rounded-lg border border-border/80 bg-card text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-foreground">{item.interviewee_name} ({item.role_or_context}):</strong>
                    <Badge variant="outline" className="text-[9px] font-mono uppercase border-muted text-muted-foreground">
                      Signal: {item.buying_signal.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground"><strong>Workaround:</strong> "{item.current_workaround}"</p>
                  {item.key_quote_or_surprise && (
                    <p className="text-[11px] text-foreground/90 italic bg-muted/30 p-2 rounded-md">
                      "{item.key_quote_or_surprise}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FORM CONTENT */}
      <form onSubmit={handleSubmit(onSubmitProblem)} className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-border/40">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-500" />
              Rethink & Synthesize the Core Problem
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Refine your core problem based on evidence gathered from your interviews.
            </p>
          </div>

          {/* AI SYNTHESIZE BUTTON NEXT TO TITLE */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAiSynthesize}
            disabled={isAiLoading || loggedInterviews.length === 0}
            className="h-8 px-3 text-xs font-bold gap-1.5 text-primary border-primary/30 hover:bg-primary/10 shrink-0 cursor-pointer"
          >
            {isAiLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span>{isAiLoading ? 'Synthesizing...' : 'Draft with AI'}</span>
          </Button>
        </div>

        {/* Problem Statement */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            How do you see the core problem now? (In one sharp sentence) *
          </Label>
          <Textarea
            className="text-xs leading-relaxed bg-background min-h-[75px]"
            placeholder="e.g. Independent coffee shop owners spend 3 hours every Sunday manually copying schedule posts across 4 platforms because existing tools are built for big marketing teams."
            {...register('problem_statement', { required: true, minLength: 10 })}
          />
          {errors.problem_statement && (
            <p className="text-[11px] text-destructive font-semibold">
              Please state the problem clearly (at least 10 characters).
            </p>
          )}
        </div>

        {/* Affected Audience */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            Who specifically confirmed this problem in your interviews? *
          </Label>
          <Input
            type="text"
            placeholder="e.g. Solo café owners with less than 5 employees who manage their own marketing"
            className="text-xs h-9 bg-background"
            {...register('affected_audience', { required: true })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* When Context */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              When does this problem trigger friction? *
            </Label>
            <Input
              type="text"
              placeholder="e.g. Every Sunday evening during week planning"
              className="text-xs h-9 bg-background"
              {...register('when_context', { required: true })}
            />
          </div>

          {/* Where Location */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Where does it happen? *
            </Label>
            <Input
              type="text"
              placeholder="e.g. At home on laptop or back office desktop"
              className="text-xs h-9 bg-background"
              {...register('where_location', { required: true })}
            />
          </div>
        </div>

        {/* Frequency */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            How often does this problem occur? *
          </Label>
          <Select
            value={watch('frequency')}
            onValueChange={(val) => setValue('frequency', (val ?? 'daily') as any)}
          >
            <SelectTrigger className="text-xs h-9 bg-background">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily (High intensity)</SelectItem>
              <SelectItem value="weekly">Weekly (Regular friction)</SelectItem>
              <SelectItem value="monthly">Monthly (Periodic headache)</SelectItem>
              <SelectItem value="occasionally">Occasionally</SelectItem>
              <SelectItem value="seasonal">Seasonal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Current Workaround */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            What is their actual workaround based on interviews? *
          </Label>
          <Textarea
            className="text-xs leading-relaxed bg-background min-h-[70px]"
            placeholder="e.g. They use free Canva templates and post inconsistently, or pay $500/month for an agency that delivers generic content."
            {...register('current_workaround', { required: true })}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Save Problem Definition & Complete Task</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
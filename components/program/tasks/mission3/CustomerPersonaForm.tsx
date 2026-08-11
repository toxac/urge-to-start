// components/program/tasks/mission3/CustomerPersonaForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/types/supabase';
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
import { CustomerPersona, ProblemHypothesis } from '@/types/projects';
import {
    Loader2,
    CheckCircle2,
    AlertCircle,
    UserCheck,
    Target,
    MapPin,
    ArrowRight,
    Quote
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

interface PersonaInputs {
    persona_name: string;
    job_title_or_role: string;
    age_range: string;
    ranked_pain_points: string;
    desired_gains: string;
    current_spend: string;
    watering_holes: string;
    verbatim_problem_quote: string;
}

export function CustomerPersonaForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
    const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
    const [groundedProblem, setGroundedProblem] = useState<ProblemHypothesis | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const isCompleted = existingProgress?.status === 'completed';

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<PersonaInputs>({
        defaultValues: {
            age_range: '25_34'
        }
    });

    useEffect(() => {
        async function loadData() {
            const res = await getActiveProjectAction();
            if (res.success) {
                setActiveProject(res.data);
                const discovery = (res.data.discovery_metrics as any) || {};

                if (discovery.problem_hypothesis) {
                    setGroundedProblem(discovery.problem_hypothesis);
                }

                // Pre-fill existing persona if present
                if (discovery.customer_personas && discovery.customer_personas.length > 0) {
                    const persona: CustomerPersona = discovery.customer_personas[0];
                    reset({
                        persona_name: persona.persona_name || '',
                        job_title_or_role: persona.job_title_or_role || '',
                        age_range: persona.age_range || '25_34',
                        ranked_pain_points: Array.isArray(persona.ranked_pain_points)
                            ? persona.ranked_pain_points.join('\n')
                            : persona.ranked_pain_points || '',
                        desired_gains: persona.desired_gains || '',
                        current_spend: persona.current_spend || '',
                        watering_holes: persona.watering_holes || '',
                        verbatim_problem_quote: persona.verbatim_problem_quote || '',
                    });
                }
            } else {
                setErrorMessage(res.error || 'Failed to load active project');
            }
        }
        loadData();
    }, [reset]);

    const onSubmitPersona = async (data: PersonaInputs) => {
        if (!activeProject) return;
        setIsSubmitting(true);
        setErrorMessage(null);

        const painPointsArray = data.ranked_pain_points
            .split('\n')
            .map(p => p.trim())
            .filter(Boolean);

        const personaPayload: CustomerPersona = {
            persona_name: data.persona_name,
            job_title_or_role: data.job_title_or_role,
            age_range: data.age_range,
            ranked_pain_points: painPointsArray,
            desired_gains: data.desired_gains,
            current_spend: data.current_spend,
            watering_holes: data.watering_holes,
            verbatim_problem_quote: data.verbatim_problem_quote,
        };

        const updateRes = await updateProjectDiscoveryMetricsAction(activeProject.id, {
            persona: personaPayload
        });

        if (!updateRes.success) {
            setErrorMessage(updateRes.error || 'Failed to save customer persona');
            setIsSubmitting(false);
            return;
        }

        const taskRes = await processTaskCompletion({
            task,
            savedPayload: {
                project_id: activeProject.id,
                persona: personaPayload
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

            {/* GROUNDED PROBLEM BANNER */}
            {groundedProblem && (
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-1.5">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" />
                        Targeting Problem: {activeProject?.biz_name || 'Active Venture'}
                    </span>
                    <p className="text-xs font-semibold text-foreground">
                        "{groundedProblem.problem_statement}"
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                        Audience Context: {groundedProblem.affected_audience}
                    </p>
                </div>
            )}

            {/* PERSONA FORM */}
            <form onSubmit={handleSubmit(onSubmitPersona)} className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
                <div className="space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5" />
                        Define Your Target Customer Persona
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {task.briefing_text}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Persona Name */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">
                            Persona Archetype / Name *
                        </Label>
                        <Input
                            type="text"
                            placeholder="e.g. Sarah the Busy Café Owner"
                            className="text-xs h-9 bg-background"
                            {...register('persona_name', { required: true })}
                        />
                    </div>

                    {/* Job Title / Role */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">
                            Role / Context *
                        </Label>
                        <Input
                            type="text"
                            placeholder="e.g. Independent Coffee Shop Owner & Manager"
                            className="text-xs h-9 bg-background"
                            {...register('job_title_or_role', { required: true })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Age Range */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">
                            Age Range *
                        </Label>
                        <Select
                            value={watch('age_range') || ''}
                            onValueChange={(val) => setValue('age_range', val ?? '')}
                        >
                            <SelectTrigger className="text-xs h-9 bg-background">
                                <SelectValue placeholder="Select age group" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="18_24">18–24</SelectItem>
                                <SelectItem value="25_34">25–34</SelectItem>
                                <SelectItem value="35_44">35–44</SelectItem>
                                <SelectItem value="45_54">45–54</SelectItem>
                                <SelectItem value="55_plus">55+</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Current Spend */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">
                            Current Spend / Time Invested in Workarounds *
                        </Label>
                        <Input
                            type="text"
                            placeholder="e.g. $200-$500/month on freelancer apps or 4 hours/week"
                            className="text-xs h-9 bg-background"
                            {...register('current_spend', { required: true })}
                        />
                    </div>
                </div>

                {/* Verbatim Quote */}
                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                        How do they describe this problem in their OWN exact words? *
                    </Label>
                    <Textarea
                        className="text-xs bg-background min-h-[65px]"
                        placeholder='e.g. "I spend 3 hours every Sunday on social media and I hate every minute of it. It feels disconnected from my actual coffee shop."'
                        {...register('verbatim_problem_quote', { required: true })}
                    />
                </div>

                {/* Ranked Pain Points */}
                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                        Ranked Pain Points (Enter 1 per line) *
                    </Label>
                    <Textarea
                        className="text-xs bg-background min-h-[75px]"
                        placeholder="1. Takes too much time away from running the shop&#10;2. Doesn't know what content actually drives foot traffic&#10;3. High cost of hiring full marketing agencies"
                        {...register('ranked_pain_points', { required: true })}
                    />
                </div>

                {/* Desired Gains */}
                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                        What would make this pain go away? (Desired Gains) *
                    </Label>
                    <Textarea
                        className="text-xs bg-background min-h-[65px]"
                        placeholder="e.g. A simple 20-minute weekly workflow that generates authentic posts and builds local community engagement."
                        {...register('desired_gains', { required: true })}
                    />
                </div>

                {/* Watering Holes / Channels */}
                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        Where to find them? (Watering Holes - Online & Offline) *
                    </Label>
                    <Textarea
                        className="text-xs bg-background min-h-[65px]"
                        placeholder="e.g. Local Specialty Coffee Association Facebook groups, Instagram DMs, regional roaster meetups."
                        {...register('watering_holes', { required: true })}
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
                            <span>Save Customer Persona & Complete Quest 1 (+{task.grant_points} XP)</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}
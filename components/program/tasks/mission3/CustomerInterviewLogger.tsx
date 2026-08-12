// components/program/tasks/mission3/CustomerInterviewLogger.tsx
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
    logCustomerInterviewAction
} from '@/actions/projects';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { InterviewRecord } from '@/types/projects';
import { TaskResourcesList } from '../TaskResourcesList';
import {
    Loader2,
    AlertCircle,
    Plus,
    Users,
    Copy,
    Check,
    MessageSquare,
    ArrowRight,
    Link2,
    Edit2
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

interface InterviewInputs {
    interviewee_name: string;
    role_or_context: string;
    problem_confirmed: 'yes' | 'sort_of' | 'no';
    current_workaround: string;
    existing_spend_or_time: string;
    buying_signal: 'offer_to_pay' | 'asked_to_buy' | 'introduced' | 'none';
    key_quote_or_surprise?: string;
}

const SAMPLE_INTERVIEW_SCRIPT = `1. What is the hardest part about [problem area] for you?
2. When was the last time you ran into this problem? What happened?
3. What are you currently doing or paying to solve this?
4. What don't you love about your current workaround?
5. If someone solved this today, would you be open to testing or paying for it?`;

export function CustomerInterviewLogger({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
    const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
    const [interviews, setInterviews] = useState<InterviewRecord[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [copiedScript, setCopiedScript] = useState(false);

    const targetCount = task.target_count || 3;
    const isCompleted = existingProgress?.status === 'completed';
    const [isEditing, setIsEditing] = useState(!isCompleted);

    const { register, handleSubmit, reset, setValue, watch } = useForm<InterviewInputs>({
        defaultValues: {
            problem_confirmed: 'yes',
            buying_signal: 'none'
        }
    });

    const currentProblemConfirmed = watch('problem_confirmed');

    useEffect(() => {
        async function loadProjectData() {
            const res = await getActiveProjectAction();
            if (res.success) {
                setActiveProject(res.data);
                const validation = (res.data.validation_data as any) || {};
                setInterviews(validation.interviews || []);
            } else {
                setErrorMessage(res.error || 'Failed to load active project');
            }
        }
        loadProjectData();
    }, []);

    const handleCopyScript = () => {
        navigator.clipboard.writeText(SAMPLE_INTERVIEW_SCRIPT);
        setCopiedScript(true);
        setTimeout(() => setCopiedScript(false), 2000);
    };

    const onSubmitInterview = async (data: InterviewInputs) => {
        if (!activeProject) return;
        setIsSubmitting(true);
        setErrorMessage(null);

        const res = await logCustomerInterviewAction(activeProject.id, data);

        if (!res.success) {
            setErrorMessage(res.error || 'Failed to log interview');
            setIsSubmitting(false);
            return;
        }

        const updatedValidation = (res.data.validation_data as any) || {};
        setInterviews(updatedValidation.interviews || []);
        setActiveProject(res.data);

        reset({
            interviewee_name: '',
            role_or_context: '',
            problem_confirmed: 'yes',
            current_workaround: '',
            existing_spend_or_time: '',
            buying_signal: 'none',
            key_quote_or_surprise: ''
        });
        setIsSubmitting(false);
    };

    const handleCompleteTask = async () => {
        if (interviews.length < targetCount) {
            setErrorMessage(`Please log at least ${targetCount} customer conversations before proceeding.`);
            return;
        }

        setIsCompleting(true);
        const res = await processTaskCompletion({
            task,
            savedPayload: {
                total_interviews_logged: interviews.length,
                project_id: activeProject?.id
            }
        });

        if (res.success) {
            setIsEditing(false);
            if (onSuccess) onSuccess();
        } else {
            setErrorMessage(res.error || 'Failed to complete step');
        }
        setIsCompleting(false);
    };

    return (
        <div className="w-full space-y-6 text-left">
            {errorMessage && (
                <div className="p-4 border rounded-xl bg-destructive/10 border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* LINKED ACTIVE PROJECT BANNER */}
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

            {/* INTERVIEW GUIDE & SCRIPT ACCORDION/BANNER */}
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Quick Interview Script & Template
                    </span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyScript}
                        className="text-[11px] font-bold h-7 gap-1 text-primary hover:bg-primary/10 cursor-pointer"
                    >
                        {copiedScript ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copiedScript ? 'Copied Script!' : 'Copy Script Questions'}
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Focus on asking about past behavior and existing workarounds. Never ask *"Would you buy this?"*—instead ask *"What are you doing or paying right now to deal with this?"*
                </p>
            </div>

            {/* LOGGED CONVERSATIONS LIST */}
            {interviews.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            Logged Customer Conversations ({interviews.length} / {targetCount} required)
                        </span>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-[10px] font-mono ${interviews.length >= targetCount
                                ? 'border-emerald-500/40 text-emerald-500 bg-emerald-500/10'
                                : 'border-amber-500/40 text-amber-500 bg-amber-500/10'
                                }`}>
                                {interviews.length >= targetCount ? 'Target Met' : `${targetCount - interviews.length} More Needed`}
                            </Badge>
                            {isCompleted && !isEditing && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                    className="h-7 text-[11px] font-semibold cursor-pointer gap-1"
                                >
                                    <Edit2 className="w-3 h-3" />
                                    Manage Logs
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {interviews.map((item) => (
                            <div key={item.id} className="p-4 rounded-xl border border-border bg-card space-y-2">
                                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                                    <span className="flex items-center gap-1.5 text-primary">
                                        <Users className="w-3.5 h-3.5" />
                                        {item.interviewee_name} ({item.role_or_context})
                                    </span>
                                    <Badge variant="outline" className={`text-[9px] font-mono uppercase ${item.buying_signal === 'offer_to_pay' || item.buying_signal === 'asked_to_buy'
                                        ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10'
                                        : item.buying_signal === 'introduced'
                                            ? 'border-blue-500 text-blue-500 bg-blue-500/10'
                                            : 'border-muted text-muted-foreground'
                                        }`}>
                                        Signal: {item.buying_signal.replace(/_/g, ' ')}
                                    </Badge>
                                </div>

                                <div className="text-xs text-muted-foreground space-y-1">
                                    <p><strong>Workaround:</strong> {item.current_workaround}</p>
                                    <p><strong>Current Spend/Time:</strong> {item.existing_spend_or_time}</p>
                                    {item.key_quote_or_surprise && (
                                        <p className="italic text-foreground/90 bg-muted/30 p-2 rounded-lg text-[11px] border border-border/40">
                                            "{item.key_quote_or_surprise}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* NEW INTERVIEW LOG FORM */}
            {(isEditing || interviews.length < targetCount) && (
                <form onSubmit={handleSubmit(onSubmitInterview)} className="p-5 rounded-2xl border border-border bg-card/60 space-y-4">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                            <Plus className="w-3.5 h-3.5" />
                            Log Customer Conversation
                        </span>
                        <p className="text-xs text-muted-foreground">
                            Record insights from a conversation, message exchange, or survey response.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs font-semibold">Who did you talk to? *</Label>
                            <Input
                                type="text"
                                placeholder="e.g. Sarah M., Coffee shop owner"
                                className="text-xs h-9 bg-background"
                                {...register('interviewee_name', { required: true })}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs font-semibold">Role / Context *</Label>
                            <Input
                                type="text"
                                placeholder="e.g. Runs local café for 3 years"
                                className="text-xs h-9 bg-background"
                                {...register('role_or_context', { required: true })}
                            />
                        </div>
                    </div>

                    {/* TOGGLE BUTTON GROUP: DID THEY CONFIRM THE PROBLEM EXISTS? */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Did they confirm the problem exists? *</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'yes', label: '✅ Yes (Intense Pain)' },
                                { id: 'sort_of', label: '🤔 Sort of (Mild)' },
                                { id: 'no', label: '❌ No (Not a problem)' }
                            ].map((opt) => {
                                const isSelected = currentProblemConfirmed === opt.id;
                                return (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => setValue('problem_confirmed', opt.id as any)}
                                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                                            isSelected
                                                ? 'border-primary bg-primary/10 text-primary shadow-xs'
                                                : 'border-border bg-background hover:bg-muted/40 text-muted-foreground'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* SEPARATE ROW: BUYING / DEMAND SIGNAL */}
                    <div className="space-y-1">
                        <Label className="text-xs font-semibold">Buying / Demand Signal *</Label>
                        <Select
                            value={watch('buying_signal')}
                            onValueChange={(val) => setValue('buying_signal', (val ?? 'none') as any)}
                        >
                            <SelectTrigger className="text-xs h-9 bg-background w-full">
                                <SelectValue placeholder="Select signal" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="offer_to_pay">💰 Offered to pay immediately</SelectItem>
                                <SelectItem value="asked_to_buy">🛍️ Asked when it will be ready to buy</SelectItem>
                                <SelectItem value="introduced">🤝 Introduced me to another prospect</SelectItem>
                                <SelectItem value="none">😶 No explicit buying signal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-xs font-semibold">What is their current workaround? *</Label>
                        <Textarea
                            className="text-xs bg-background min-h-[60px]"
                            placeholder="e.g. Uses a free spreadsheet template and spends 2 hours every Sunday manually copying data."
                            {...register('current_workaround', { required: true })}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label className="text-xs font-semibold">
                            Current Spend or Time Spent (Willingness-to-pay proxy) *
                        </Label>
                        <Input
                            type="text"
                            placeholder="e.g. $150/month on freelancers + 5 hours/week of personal labor"
                            className="text-xs h-9 bg-background"
                            {...register('existing_spend_or_time', { required: true })}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label className="text-xs font-semibold">Key Quote or Surprising Insight (Optional)</Label>
                        <Textarea
                            className="text-xs bg-background min-h-[60px]"
                            placeholder='e.g. "I don&apos;t care about fancy charts, I just want something that stops me from missing invoices."'
                            {...register('key_quote_or_surprise')}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="outline"
                        disabled={isSubmitting}
                        className="w-full h-10 text-xs font-bold uppercase tracking-wider cursor-pointer gap-1.5"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <>
                                <Plus className="w-3.5 h-3.5" />
                                Save Interview Log
                            </>
                        )}
                    </Button>
                </form>
            )}

            {/* COMPLETE STEP CTA */}
            {(!isCompleted || isEditing) && interviews.length >= targetCount && (
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                        <span className="text-xs font-bold text-foreground block">
                            Target Interviews Reached ({interviews.length}/{targetCount})
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                            Ready to synthesize your findings into a grounded problem statement.
                        </p>
                    </div>
                    <Button
                        type="button"
                        onClick={handleCompleteTask}
                        disabled={isCompleting}
                        className="h-10 px-5 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                    >
                        {isCompleting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
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
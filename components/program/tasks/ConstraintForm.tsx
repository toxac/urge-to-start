'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { updateMyProfile } from '@/actions/profiles';
import { completeTaskExecution } from '@/actions/progress';

interface ConstraintFormInputs {
    weekly_hours: '2_5_hours' | '5_10_hours' | '10_20_hours' | '20_plus';
    time_slot: 'evenings' | 'weekends' | 'scraps';
    money_budget: number;
}

interface ConstraintFormProps {
    taskId: string;
    existingProgress?: {
        status: 'pending' | 'completed';
        saved_payload?: any;
    };
    onSuccess?: () => void;
}

const hoursLabels = {
    '2_5_hours': '2 to 5 hours a week',
    '5_10_hours': '5 to 10 hours a week',
    '10_20_hours': '10 to 20 hours a week',
    '20_plus': 'More than 20 hours a week',
};

const slotLabels = {
    evenings: 'In the evenings after my normal routine is done',
    weekends: 'Saving it for heavy, quiet blocks on my days off',
    scraps: 'Scrapping for bits of time whenever a gap opens up',
};

export function ConstraintForm({ taskId, existingProgress, onSuccess }: ConstraintFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    // Light switch state to handle dynamic edit overrides seamlessly
    const isInitiallyCompleted = existingProgress?.status === 'completed';
    const [isEditing, setIsEditing] = useState(!isInitiallyCompleted);

    const preSavedPayload = existingProgress?.saved_payload || {};

    const { register, handleSubmit, formState: { errors } } = useForm<ConstraintFormInputs>({
        defaultValues: {
            weekly_hours: preSavedPayload.weekly_hours || '',
            time_slot: preSavedPayload.time_slot || '',
            money_budget: preSavedPayload.money_budget || 0,
        }
    });

    const onSubmit = async (formData: ConstraintFormInputs) => {
        setIsSubmitting(true);
        setErrorMessage(null);
        try {
            const profileSync = await updateMyProfile({
                constraints: formData as any
            } as any);

            if (!profileSync.success) {
                setErrorMessage(profileSync.error);
                setIsSubmitting(false);
                return;
            }

            const progressSync = await completeTaskExecution({
                taskId,
                savedPayload: formData as Record<string, any>
            });

            if (progressSync.success) {
                setIsEditing(false); // Flip back to the read-only dashboard layout view on success
                if (onSuccess) onSuccess();
            } else {
                setErrorMessage(progressSync.error);
            }
        } catch (err: any) {
            setErrorMessage(err.message || "Something went wrong saving your schedule limits.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // VIEW NODE: READ-ONLY CANVAS DISPLAY IF SUBMITTED AND NOT EDITING
    if (!isEditing) {
        return (
            <div className="w-full space-y-4 border rounded-xl p-5 bg-emerald-50/20 border-emerald-500/10">
                <div className="w-full flex items-center justify-between pb-2 border-b border-dashed">
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        ✨ Your locked schedule strategies
                    </span>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsEditing(true)}
                        className="h-7 text-xs bg-background"
                    >
                        Edit Answers
                    </Button>
                </div>
                <div className="space-y-3 text-sm">
                    <div>
                        <p className="text-xs font-bold text-muted-foreground">Weekly Target Time:</p>
                        <p className="font-medium text-foreground">{hoursLabels[preSavedPayload.weekly_hours as keyof typeof hoursLabels] || preSavedPayload.weekly_hours}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted-foreground">Planned Execution Slot:</p>
                        <p className="font-medium text-foreground">{slotLabels[preSavedPayload.time_slot as keyof typeof slotLabels] || preSavedPayload.time_slot}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted-foreground">Scrap Money Runway Allocated:</p>
                        <p className="font-medium text-foreground">{preSavedPayload.money_budget} (Your local currency)</p>
                    </div>
                </div>
            </div>
        );
    }

    // FORM INPUT NODE
    return (
        <div className="w-full space-y-5">
            {errorMessage && (
                <div className="w-full p-4 border rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
                    ⚠️ {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
                <div className="w-full space-y-2">
                    <Label className="text-sm font-semibold block text-foreground leading-snug">
                        1. How many hours can you honestly carve out for this project every week? *
                    </Label>
                    <div className="w-full grid grid-cols-1 gap-2 bg-muted/10 p-3 border rounded-xl">
                        {[
                            { value: '2_5_hours', title: '2 to 5 hours a week', subtitle: 'Perfect for dynamic side-hustlers with heavy day jobs.' },
                            { value: '5_10_hours', title: '5 to 10 hours a week', subtitle: 'A solid pace. Enough time to hit real milestones every single week.' },
                            { value: '10_20_hours', title: '10 to 20 hours a week', subtitle: 'A serious time commitment. You are moving fast.' },
                            { value: '20_plus', title: 'More than 20 hours a week', subtitle: 'You have plenty of open space and are ready to run hard.' }
                        ].map((opt) => (
                            <label key={opt.value} className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer text-sm">
                                <input
                                    type="radio"
                                    value={opt.value}
                                    className="h-4 w-4 mt-0.5 text-primary border-input focus:ring-primary"
                                    {...register('weekly_hours', { required: true })}
                                />
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-foreground font-semibold">{opt.title}</span>
                                    <span className="text-xs text-muted-foreground">{opt.subtitle}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                    {errors.weekly_hours && <p className="text-xs font-semibold text-destructive">Pick an option that fits your current life balance.</p>}
                </div>

                <div className="w-full space-y-2">
                    <Label className="text-sm font-semibold block text-foreground leading-snug">
                        2. When are you actually planning to do this work? *
                    </Label>
                    <select
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register('time_slot', { required: true })}
                    >
                        <option value="">Choose how you work best...</option>
                        <option value="evenings">In the evenings after my normal routine is done</option>
                        <option value="weekends">Saving it for heavy, quiet blocks on my days off</option>
                        <option value="scraps">Scrapping for bits of time whenever a gap opens up</option>
                    </select>
                    {errors.time_slot && <p className="text-xs font-semibold text-destructive">Tell us how you want to slice up your time.</p>}
                </div>

                <div className="w-full space-y-2">
                    <Label className="text-sm font-semibold block text-foreground leading-snug">
                        3. What is your total budget for this project right now? *
                    </Label>
                    <p className="text-xs text-muted-foreground leading-normal mb-1">
                        Think about extra cash you are genuinely comfortable spending over the next 6 months on early experiments. It is totally fine if your answer is 0.
                    </p>
                    <div className="relative w-full flex items-center">
                        <Input
                            type="number"
                            min="0"
                            className="w-full pl-3 pr-24"
                            placeholder="0"
                            {...register('money_budget', { required: true, min: 0 })}
                        />
                        <div className="absolute right-3 text-xs font-bold bg-muted px-2 py-1 rounded border pointer-events-none text-muted-foreground">
                            Your Currency
                        </div>
                    </div>
                    {errors.money_budget && <p className="text-xs font-semibold text-destructive">Please enter a valid amount (even if it's 0).</p>}
                </div>

                <div className="w-full flex gap-3 mt-4">
                    {isInitiallyCompleted && (
                        <Button 
                            type="button" 
                            variant="ghost" 
                            className="h-11 text-sm font-semibold"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        type="submit"
                        className="flex-1 h-11 text-sm font-semibold"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving changes...' : isInitiallyCompleted ? 'Update My Choices' : 'Lock in limits & earn 20 XP'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
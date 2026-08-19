// components/program/tasks/mission4/PricingStrategyForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getActiveProjectAction, updateProjectPricingAction } from '@/actions/projects';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { TaskResourcesList } from '../TaskResourcesList';
import { Database } from '@/types/supabase';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Tag, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  AlertCircle, 
  Edit2,
  BookOpen,
  DollarSign,
  TrendingUp,
  Scale
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

interface PricingStrategyInputs {
  pricing_strategy: 'value_based' | 'cost_plus' | 'competitor_anchored';
  target_price: number;
  minimum_price: number;
  premium_price: number;
  pricing_rationale: string;
}

export function PricingStrategyForm({
  task,
  existingProgress,
  onSuccess
}: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [perceivedValueAnchor, setPerceivedValueAnchor] = useState<string | null>(null);
  const [solutionDescription, setSolutionDescription] = useState<string | null>(null);
  const [savedPricing, setSavedPricing] = useState<PricingStrategyInputs | null>(null);

  const isCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isCompleted);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PricingStrategyInputs>({
    defaultValues: {
      pricing_strategy: 'value_based',
      target_price: 0,
      minimum_price: 0,
      premium_price: 0,
      pricing_rationale: ''
    }
  });

  const selectedStrategy = watch('pricing_strategy');

  useEffect(() => {
  async function loadData() {
    const res = await getActiveProjectAction();
    if (res.success && res.data) {
      setActiveProject(res.data);

      // Fetch Solution Design payload (MSP & Promise data)
      const solutionDesign = (res.data.solution_design as any) || {};
      const promise = solutionDesign.promise || {};

      // Fallback check for MSP / Perceived Value data
      const perceivedVal = solutionDesign.perceived_value_price || promise.perceived_value_price || null;
      const description = solutionDesign.one_sentence_description || promise.final_value_prop || null;

      if (perceivedVal) setPerceivedValueAnchor(perceivedVal);
      if (description) setSolutionDescription(description);

      // Prefill existing pricing data if available
      if (solutionDesign.pricing) {
        const p = solutionDesign.pricing;
        setSavedPricing(p);
        setValue('pricing_strategy', p.pricing_strategy || 'value_based');
        setValue('target_price', p.target_price || 0);
        setValue('minimum_price', p.minimum_price || 0);
        setValue('premium_price', p.premium_price || 0);
        setValue('pricing_rationale', p.pricing_rationale || '');
      } else if (perceivedVal) {
        // Default initial target price from perceived value anchor if numeric digits exist
        const numericMatch = perceivedVal.match(/\d+/);
        if (numericMatch) {
          const val = parseInt(numericMatch[0], 10);
          setValue('target_price', val);
          setValue('minimum_price', Math.round(val * 0.8));
          setValue('premium_price', Math.round(val * 1.5));
        }
      }
    } else {
      setErrorMessage(!res.success ? res.error : 'Failed to load active project');
    }
  }
  loadData();
}, [setValue]);

  const onSubmitStrategy = async (data: PricingStrategyInputs) => {
    if (!activeProject) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      pricing_strategy: data.pricing_strategy,
      perceived_value_anchor: perceivedValueAnchor || undefined,
      target_price: Number(data.target_price) || 0,
      minimum_price: Number(data.minimum_price) || 0,
      premium_price: Number(data.premium_price) || 0,
      expected_gross_margin_percent: 0, // Calculated in Task 2
      monthly_breakeven_units: 0,       // Calculated in Task 2
      monthly_sales_target_units: 0,   // Calculated in Task 3
      pricing_rationale: data.pricing_rationale.trim()
    };

    // 1. Save pricing strategy payload to user_projects
    const updateRes = await updateProjectPricingAction(activeProject.id, payload);

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to save pricing strategy');
      setIsSubmitting(false);
      return;
    }

    // 2. Complete Task
    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        pricing_strategy: payload
      }
    });

    if (taskRes.success) {
      setSavedPricing(data);
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

      {/* REQUIRED RESOURCE GUIDE */}
      <TaskResourcesList resources={task.resources} />

      {/* MISSION 1 PERCEIVED VALUE RECALL CARD */}
      {(perceivedValueAnchor || solutionDescription) && (
        <Card className="border-amber-500/30 bg-amber-500/5 rounded-2xl">
          <CardContent className="p-4 space-y-2">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Early Value Anchor (From Mission 1)
            </span>
            {solutionDescription && (
              <p className="text-xs text-muted-foreground font-medium">
                <strong>Solution:</strong> {solutionDescription}
              </p>
            )}
            {perceivedValueAnchor && (
              <p className="text-xs text-foreground font-bold">
                <strong>Initial Perceived Value Estimate:</strong> {perceivedValueAnchor}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* READ-ONLY COMPLETED VIEW */}
      {savedPricing && !isEditing ? (
        <div className="w-full space-y-4 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Pricing Strategy Selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Change Strategy
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Strategy Model</span>
              <p className="text-xs font-bold text-foreground capitalize">{savedPricing.pricing_strategy.replace('_', ' ')}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Target Price</span>
              <p className="text-base font-extrabold text-foreground">₹{Number(savedPricing.target_price).toLocaleString('en-IN')}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Price Range</span>
              <p className="text-xs font-semibold text-foreground">₹{savedPricing.minimum_price} – ₹{savedPricing.premium_price}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1 text-xs">
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">Rationale</span>
            <p className="text-xs font-medium text-foreground">{savedPricing.pricing_rationale}</p>
          </div>
        </div>
      ) : (
        /* EDITABLE FORM VIEW */
        <form onSubmit={handleSubmit(onSubmitStrategy)} className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Select Your Core Pricing Strategy
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              How will you anchor your product's price in the customer's mind? Choose one primary strategy.
            </p>
          </div>

          {/* STRATEGY CHOOSER CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Value-Based */}
            <div
              onClick={() => setValue('pricing_strategy', 'value_based')}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                selectedStrategy === 'value_based'
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-sm'
                  : 'bg-background border-border hover:border-amber-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-500" /> Value-Based
                </span>
                <input
                  type="radio"
                  checked={selectedStrategy === 'value_based'}
                  onChange={() => setValue('pricing_strategy', 'value_based')}
                  className="accent-amber-500"
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Priced based on how much time, stress, or money your solution saves the customer.
              </p>
            </div>

            {/* Cost-Plus */}
            <div
              onClick={() => setValue('pricing_strategy', 'cost_plus')}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                selectedStrategy === 'cost_plus'
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-sm'
                  : 'bg-background border-border hover:border-amber-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Cost-Plus Margin
                </span>
                <input
                  type="radio"
                  checked={selectedStrategy === 'cost_plus'}
                  onChange={() => setValue('pricing_strategy', 'cost_plus')}
                  className="accent-amber-500"
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Take your exact per-unit cost and add a healthy profit margin (e.g. 50% - 70% markup).
              </p>
            </div>

            {/* Competitor Anchored */}
            <div
              onClick={() => setValue('pricing_strategy', 'competitor_anchored')}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                selectedStrategy === 'competitor_anchored'
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-sm'
                  : 'bg-background border-border hover:border-amber-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-blue-500" /> Competitor Anchor
                </span>
                <input
                  type="radio"
                  checked={selectedStrategy === 'competitor_anchored'}
                  onChange={() => setValue('pricing_strategy', 'competitor_anchored')}
                  className="accent-amber-500"
                />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Price relative to existing market alternatives (e.g., 20% cheaper or premium quality).
              </p>
            </div>

          </div>

          {/* TARGET PRICE & RANGE INPUTS */}
          <div className="p-4 rounded-xl bg-background border border-border space-y-3">
            <span className="text-xs font-bold text-foreground block">Set Your Test Price Range</span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-foreground">Minimum Discount Price (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Lowest price"
                  className="text-xs h-9 bg-card"
                  {...register('minimum_price', { required: true, valueAsNumber: true })}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-amber-500">Target Launch Price (₹) *</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="Ideal selling price"
                  className="text-xs h-9 bg-card border-amber-500/40 font-bold"
                  {...register('target_price', { required: true, valueAsNumber: true })}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-foreground">Premium / High-Tier Price (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Max premium price"
                  className="text-xs h-9 bg-card"
                  {...register('premium_price', { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          {/* RATIONALE TEXTAREA */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-foreground">Why does this price make sense for your launch customers? *</Label>
            <Textarea
              rows={3}
              placeholder="e.g. At ₹999, it is half the cost of hiring a freelancer, while giving us a healthy margin to cover customer acquisition."
              className="text-xs bg-background"
              {...register('pricing_rationale', { required: true, minLength: 10 })}
            />
            {errors.pricing_rationale && (
              <p className="text-[11px] text-destructive font-semibold">Please provide a short explanation for your price point.</p>
            )}
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
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-10 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Save Strategy & Open Price Simulator</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
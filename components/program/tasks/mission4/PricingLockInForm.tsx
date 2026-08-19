// components/program/tasks/mission4/PricingLockInForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getActiveProjectAction, updateProjectPricingAction } from '@/actions/projects';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { Database } from '@/types/supabase';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Tag, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  AlertCircle, 
  Edit2,
  Sparkles,
  Trophy
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

export function PricingLockInForm({
  task,
  existingProgress,
  onSuccess
}: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [pricingData, setPricingData] = useState<any>(null);

  const isCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isCompleted);

  const [finalPrice, setFinalPrice] = useState<number>(500);
  const [monthlyTarget, setMonthlyTarget] = useState<number>(10);
  const [finalRationale, setFinalRationale] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const res = await getActiveProjectAction();
      if (res.success && res.data) {
        setActiveProject(res.data);
        const solutionDesign = (res.data.solution_design as any) || {};

        if (solutionDesign.pricing) {
          const p = solutionDesign.pricing;
          setPricingData(p);
          if (p.target_price) setFinalPrice(p.target_price);
          if (p.monthly_sales_target_units) setMonthlyTarget(p.monthly_sales_target_units);
          if (p.pricing_rationale) setFinalRationale(p.pricing_rationale);
        }
      } else {
        setErrorMessage(!res.success ? res.error : 'Failed to load active project');
      }
    }
    loadData();
  }, []);

  const handleLockIn = async () => {
    if (!activeProject) return;
    if (finalPrice <= 0 || !finalRationale.trim()) {
      setErrorMessage('Please specify your final selling price and a brief explanation.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const updatedPayload = {
      ...pricingData,
      target_price: finalPrice,
      monthly_sales_target_units: monthlyTarget,
      pricing_rationale: finalRationale.trim()
    };

    const updateRes = await updateProjectPricingAction(activeProject.id, updatedPayload);

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to lock in launch price');
      setIsSubmitting(false);
      return;
    }

    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        final_pricing: updatedPayload
      }
    });

    if (taskRes.success) {
      setPricingData(updatedPayload);
      setIsEditing(false);
      if (onSuccess) onSuccess();
    } else {
      setErrorMessage(taskRes.error || 'Failed to complete quest');
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

      {/* READ-ONLY COMPLETED VIEW */}
      {!isEditing && pricingData ? (
        <div className="w-full space-y-5 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <Trophy className="w-4 h-4" />
              Day 1 Launch Price Locked
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Adjust Launch Price
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-card border border-amber-500/30 bg-amber-500/5 space-y-1">
              <span className="text-[10px] font-bold text-amber-500 uppercase block">Day 1 Launch Price</span>
              <p className="text-xl font-extrabold text-foreground">₹{pricingData.target_price?.toLocaleString('en-IN')}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Monthly Sales Goal</span>
              <p className="text-xl font-extrabold text-foreground">{pricingData.monthly_sales_target_units} orders / mo</p>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Break-Even Sales Need</span>
              <p className="text-xl font-extrabold text-emerald-500">{pricingData.monthly_breakeven_units || 0} orders / mo</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1 text-xs">
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">Pricing Commitment</span>
            <p className="text-xs font-medium text-foreground">{pricingData.pricing_rationale}</p>
          </div>
        </div>
      ) : (
        /* EDITABLE FORM VIEW */
        <div className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Lock In Your Day 1 Launch Price
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Finalize your official price and monthly unit target before you move into building your launch collateral.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-foreground">Official Day 1 Launch Price (₹) *</Label>
              <Input
                type="number"
                min="1"
                value={finalPrice}
                onChange={(e) => setFinalPrice(parseFloat(e.target.value) || 0)}
                className="text-xs h-9 font-bold bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-foreground">Target Sales Goal (Orders / Month) *</Label>
              <Input
                type="number"
                min="1"
                value={monthlyTarget}
                onChange={(e) => setMonthlyTarget(parseInt(e.target.value, 10) || 1)}
                className="text-xs h-9 bg-background"
              />
            </div>

          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-foreground">1-Sentence Pricing Rationale *</Label>
            <Textarea
              rows={3}
              value={finalRationale}
              onChange={(e) => setFinalRationale(e.target.value)}
              placeholder="e.g. ₹999 provides a high perceived value for busy professionals while giving us a 65% gross margin to invest in customer acquisition."
              className="text-xs bg-background"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-2 pt-2">
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
              onClick={handleLockIn}
              disabled={isSubmitting || !finalRationale.trim()}
              className="flex-1 h-10 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Lock In Pricing & Finish Quest 3</span>
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
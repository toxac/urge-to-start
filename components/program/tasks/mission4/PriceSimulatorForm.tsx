// components/program/tasks/mission4/PriceSimulatorForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getActiveProjectAction, updateProjectPricingAction } from '@/actions/projects';
import { getCostSummaryAction } from '@/actions/budget';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { TaskResourcesList } from '../TaskResourcesList';
import { Database } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calculator, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  AlertCircle, 
  Edit2,
  TrendingUp,
  Coins,
  Target,
  Percent,
  TrendingDown
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

export function PriceSimulatorForm({
  task,
  existingProgress,
  onSuccess
}: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  
  // Cost Baseline State (from Quest 2)
  const [unitCost, setUnitCost] = useState<number>(0);
  const [monthlyOverhead, setMonthlyOverhead] = useState<number>(0);
  const [pricingStrategy, setPricingStrategy] = useState<any>('value_based');

  // Interactive Slider State
  const [simulatedPrice, setSimulatedPrice] = useState<number>(500);
  const [simulatedVolume, setSimulatedVolume] = useState<number>(20);

  const isCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isCompleted);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const projRes = await getActiveProjectAction();

      if (projRes.success && projRes.data) {
        setActiveProject(projRes.data);

        // 1. Fetch Quest 2 financial baselines
        const costRes = await getCostSummaryAction(projRes.data.id);
        if (costRes.success && costRes.data) {
          setUnitCost(costRes.data.unitCost || 0);
          const totalFixed = (costRes.data.monthlyOverhead || 0) + (costRes.data.monthlyAcquisitionBudget || 0);
          setMonthlyOverhead(totalFixed);
        }

        // 2. Fetch Quest 3 Task 1 pricing strategy
        const solutionDesign = (projRes.data.solution_design as any) || {};
        if (solutionDesign.pricing) {
          const p = solutionDesign.pricing;
          setPricingStrategy(p.pricing_strategy || 'value_based');
          if (p.target_price) setSimulatedPrice(p.target_price);
          if (p.monthly_sales_target_units) setSimulatedVolume(p.monthly_sales_target_units);
        }
      } else {
        setErrorMessage(!projRes.success ? projRes.error : 'Failed to load active project');
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Live Calculated Metrics
  const unitProfit = simulatedPrice - unitCost;
  const grossMarginPercent = simulatedPrice > 0 ? Math.round((unitProfit / simulatedPrice) * 100) : 0;
  
  const breakevenUnits = unitProfit > 0 
    ? Math.ceil(monthlyOverhead / unitProfit) 
    : 0;

  const totalMonthlyRevenue = simulatedPrice * simulatedVolume;
  const totalVariableCosts = unitCost * simulatedVolume;
  const netMonthlyProfit = (unitProfit * simulatedVolume) - monthlyOverhead;

  const handleSubmitSimulation = async () => {
    if (!activeProject) return;
    if (unitProfit <= 0) {
      setErrorMessage('Your price must be higher than your unit cost to make a profit!');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const solutionDesign = (activeProject.solution_design as any) || {};
    const existingPricing = solutionDesign.pricing || {};

    const updatedPricingPayload = {
      ...existingPricing,
      target_price: simulatedPrice,
      expected_gross_margin_percent: grossMarginPercent,
      monthly_breakeven_units: breakevenUnits,
      monthly_sales_target_units: simulatedVolume,
      monthly_projected_profit: netMonthlyProfit
    };

    // 1. Update project pricing payload
    const updateRes = await updateProjectPricingAction(activeProject.id, updatedPricingPayload);

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to save price simulation');
      setIsSubmitting(false);
      return;
    }

    // 2. Complete Task
    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        pricing_simulation: updatedPricingPayload
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

  if (isLoading) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        <p className="text-xs text-muted-foreground font-medium">Loading cost baselines for simulation...</p>
      </div>
    );
  }

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

      {/* COST BASELINE ANCHOR BANNER */}
      <div className="p-4 rounded-xl border border-border bg-card/80 grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase block">Unit Cost (COGS)</span>
          <span className="text-sm font-extrabold text-foreground">₹{unitCost.toLocaleString('en-IN')} / order</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase block">Monthly Fixed Bills + Marketing</span>
          <span className="text-sm font-extrabold text-foreground">₹{monthlyOverhead.toLocaleString('en-IN')} / month</span>
        </div>
      </div>

      {/* READ-ONLY COMPLETED VIEW */}
      {!isEditing ? (
        <div className="w-full space-y-4 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Price Simulation Locked
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Re-simulate
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Simulated Price</span>
              <p className="text-lg font-extrabold text-foreground">₹{simulatedPrice.toLocaleString('en-IN')}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Gross Margin</span>
              <p className="text-lg font-extrabold text-emerald-500">{grossMarginPercent}% (₹{unitProfit}/unit)</p>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Break-Even Sales</span>
              <p className="text-lg font-extrabold text-amber-500">{breakevenUnits} sales / month</p>
            </div>
          </div>
        </div>
      ) : (
        /* EDITABLE SIMULATOR FORM VIEW */
        <div className="p-5 rounded-2xl border border-border bg-card/60 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5" />
              Interactive Price & Unit Target Simulator
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Drag the sliders below to see how price changes affect your gross margin, break-even target, and net monthly profit.
            </p>
          </div>

          {/* SLIDER 1: PRICE SLIDER */}
          <div className="p-4 rounded-xl bg-background border border-border space-y-3">
            <div className="flex items-center justify-between text-xs">
              <Label className="font-bold text-foreground">Selling Price per Unit (₹)</Label>
              <span className="text-base font-extrabold text-amber-500">₹{simulatedPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={Math.max(10, Math.round(unitCost * 1.1))}
              max={Math.max(5000, Math.round(unitCost * 10))}
              step={10}
              value={simulatedPrice}
              onChange={(e) => setSimulatedPrice(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Min: ₹{Math.round(unitCost * 1.1)}</span>
              <span>Unit Cost: ₹{unitCost}</span>
              <span>Max Test: ₹{Math.max(5000, unitCost * 10)}</span>
            </div>
          </div>

          {/* SLIDER 2: VOLUME TARGET SLIDER */}
          <div className="p-4 rounded-xl bg-background border border-border space-y-3">
            <div className="flex items-center justify-between text-xs">
              <Label className="font-bold text-foreground">Target Sales Volume per Month</Label>
              <span className="text-base font-extrabold text-blue-500">{simulatedVolume} units / month</span>
            </div>
            <input
              type="range"
              min={1}
              max={200}
              step={1}
              value={simulatedVolume}
              onChange={(e) => setSimulatedVolume(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>1 unit/mo</span>
              <span>Break-Even Need: {breakevenUnits} units</span>
              <span>200 units/mo</span>
            </div>
          </div>

          {/* LIVE SIMULATED PERFORMANCE METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            
            {/* Unit Profit */}
            <div className="p-3 rounded-xl bg-card border border-border/80 space-y-0.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block flex items-center gap-1">
                <Coins className="w-3 h-3 text-emerald-500" /> Unit Profit
              </span>
              <p className={`text-base font-extrabold ${unitProfit > 0 ? 'text-emerald-500' : 'text-destructive'}`}>
                ₹{unitProfit.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Gross Margin % */}
            <div className="p-3 rounded-xl bg-card border border-border/80 space-y-0.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block flex items-center gap-1">
                <Percent className="w-3 h-3 text-blue-500" /> Gross Margin
              </span>
              <p className="text-base font-extrabold text-foreground">{grossMarginPercent}%</p>
            </div>

            {/* Break-Even Target */}
            <div className="p-3 rounded-xl bg-card border border-border/80 space-y-0.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block flex items-center gap-1">
                <Target className="w-3 h-3 text-amber-500" /> Break-Even Needed
              </span>
              <p className="text-base font-extrabold text-amber-500">{breakevenUnits} sales</p>
            </div>

            {/* Net Monthly Profit/Loss */}
            <div className="p-3 rounded-xl bg-card border border-border/80 space-y-0.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block flex items-center gap-1">
                {netMonthlyProfit >= 0 ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-destructive" />}
                Projected Net Profit
              </span>
              <p className={`text-base font-extrabold ${netMonthlyProfit >= 0 ? 'text-emerald-500' : 'text-destructive'}`}>
                ₹{netMonthlyProfit.toLocaleString('en-IN')}
              </p>
            </div>

          </div>

          {/* DYNAMIC AHA INSIGHT NUDGE */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-600 dark:text-amber-400 flex items-start gap-2">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Simulator Insight:</strong> At <strong>₹{simulatedPrice}</strong> per order, you need <strong>{breakevenUnits} sales/month</strong> just to pay off your monthly bills. Every sale past #{breakevenUnits} puts <strong>₹{unitProfit} net profit</strong> directly in your pocket!
            </span>
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
              onClick={handleSubmitSimulation}
              disabled={isSubmitting || unitProfit <= 0}
              className="flex-1 h-10 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Lock In Simulation & Finalize Price</span>
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
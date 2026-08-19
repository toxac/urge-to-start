// components/program/tasks/mission4/UnitCostForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getActiveProjectAction } from '@/actions/projects';
import {
    getUserMaterialsAction,
    saveUserMaterialAction,
    deleteUserMaterialAction
} from '@/actions/budget';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { TaskResourcesList } from '../TaskResourcesList';
import { Database } from '@/types/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Calculator,
    Plus,
    Trash2,
    CheckCircle2,
    Loader2,
    ArrowRight,
    AlertCircle,
    Edit2,
    Package,
    Sparkles,
    Tag,
    Coins
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];
type UserMaterialRow = Database['public']['Tables']['user_materials']['Row'];

export function UnitCostForm({
    task,
    existingProgress,
    onSuccess
}: BaseTaskComponentProps) {
    const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
    const [materials, setMaterials] = useState<UserMaterialRow[]>([]);

    const isCompleted = existingProgress?.status === 'completed';
    const [isEditing, setIsEditing] = useState(!isCompleted);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // New Material Entry State
    const [name, setName] = useState('');
    const [category, setCategory] = useState<string>('raw_material');
    const [unit, setUnit] = useState('unit');
    const [quantityNeeded, setQuantityNeeded] = useState<number>(1);
    const [unitCost, setUnitCost] = useState<number>(0);

    // Load active project & materials list
    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            const projRes = await getActiveProjectAction();
            if (projRes.success && projRes.data) {
                setActiveProject(projRes.data);

                const matRes = await getUserMaterialsAction(projRes.data.id);
                if (matRes.success && matRes.data) {
                    setMaterials(matRes.data);
                } else if (!matRes.success) {
                    setErrorMessage(matRes.error || 'Failed to load unit costs');
                }
            } else {
                setErrorMessage(!projRes.success ? projRes.error : 'Failed to load active project');
            }
            setIsLoading(false);
        }
        loadData();
    }, []);

    // Calculate total unit cost dynamically
    const totalUnitCost = materials.reduce(
        (sum, item) => sum + Number(item.quantity_needed || 1) * Number(item.unit_cost || 0),
        0
    );

    const handleAddMaterial = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeProject || !name.trim()) return;

        setIsAdding(true);
        setErrorMessage(null);

        const saveRes = await saveUserMaterialAction({
            projectId: activeProject.id,
            name: name.trim(),
            category,
            costStructure: 'per_unit',
            resourceType: 'physical',
            unit: unit.trim() || 'unit',
            quantityNeeded: Number(quantityNeeded) || 1,
            unitCost: Number(unitCost) || 0
        });

        if (saveRes.success && saveRes.data) {
            setMaterials((prev) => [...prev, saveRes.data as UserMaterialRow]);
            // Reset input fields
            setName('');
            setUnit('unit');
            setQuantityNeeded(1);
            setUnitCost(0);
        } else {
            setErrorMessage(saveRes.error || 'Failed to add item');
        }

        setIsAdding(false);
    };

    const handleDeleteMaterial = async (id: string) => {
        setErrorMessage(null);
        const delRes = await deleteUserMaterialAction(id);
        if (delRes.success) {
            setMaterials((prev) => prev.filter((item) => item.id !== id));
        } else {
            setErrorMessage(delRes.error || 'Failed to remove item');
        }
    };

    const handleSubmitUnitCosts = async () => {
        if (!activeProject) return;
        if (materials.length === 0) {
            setErrorMessage('Please add at least one item required to make or deliver your product/service.');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);

        // Complete task using taskExecution helper
        const taskRes = await processTaskCompletion({
            task,
            savedPayload: {
                project_id: activeProject.id,
                total_unit_cost: totalUnitCost,
                items_count: materials.length,
                materials: materials.map((m) => ({
                    name: m.name,
                    category: m.category,
                    quantity: m.quantity_needed,
                    unit_cost: m.unit_cost,
                    item_total: Number(m.quantity_needed) * Number(m.unit_cost)
                }))
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
                <p className="text-xs text-muted-foreground font-medium">Loading your unit cost data...</p>
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

            {/* TOTAL UNIT COST BANNER */}
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-center justify-between">
                <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" /> Total Out-of-Pocket Cost Per Order
                    </span>
                    <p className="text-xs text-muted-foreground">Sum of raw ingredients, packaging, shipping, and gateway fees.</p>
                </div>
                <div className="text-right">
                    <span className="text-xl font-extrabold text-foreground">₹{totalUnitCost.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] font-bold text-muted-foreground block uppercase">/ unit</span>
                </div>
            </div>

            {/* READ-ONLY COMPLETED VIEW */}
            {materials.length > 0 && !isEditing ? (
                <div className="w-full space-y-4 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
                    <div className="flex items-center justify-between pb-3 border-b border-border/50">
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
                            <CheckCircle2 className="w-4 h-4" />
                            Unit Cost Breakdown Locked ({materials.length} Items)
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit Costs
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {materials.map((item) => {
                            const itemTotal = Number(item.quantity_needed || 1) * Number(item.unit_cost || 0);
                            return (
                                <div key={item.id} className="p-3 rounded-xl bg-card border border-border/60 flex items-center justify-between text-xs">
                                    <div className="space-y-0.5">
                                        <span className="font-semibold text-foreground">{item.name}</span>
                                        <span className="text-[10px] text-muted-foreground block">
                                            {item.quantity_needed} {item.unit} @ ₹{item.unit_cost}/{item.unit}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-foreground">₹{itemTotal.toLocaleString('en-IN')}</span>
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                                            {item.category?.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                /* EDITABLE FORM VIEW */
                <div className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Calculator className="w-3.5 h-3.5" />
                            List Everything Needed for One Order
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Add raw materials, jars/boxes, tape, thank-you cards, courier delivery flat rates, or payment processing fees.
                        </p>
                    </div>

                    {/* ADD MATERIAL INPUT FORM */}
                    <form onSubmit={handleAddMaterial} className="p-4 rounded-xl border border-border/80 bg-background space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                            {/* Item Name */}
                            <div className="space-y-1 sm:col-span-2">
                                <Label className="text-[11px] font-bold text-foreground">Item / Cost Name *</Label>
                                <Input
                                    placeholder="e.g. Cotton Fabric, Glass Jar, Shipping Box, Gateway Fee (~2%)"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="text-xs h-9"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-foreground">Category</Label>
                                <Select
                                    value={category}
                                    onValueChange={(val) => setCategory(val ?? 'raw_material')}
                                >
                                    <SelectTrigger className="text-xs h-9">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="raw_material">Raw Material / Ingredient</SelectItem>
                                        <SelectItem value="packaging">Packaging & Labels</SelectItem>
                                        <SelectItem value="delivery">Courier / Delivery Fee</SelectItem>
                                        <SelectItem value="payment_fee">Payment Gateway Fee</SelectItem>
                                        <SelectItem value="direct_labor">Direct Labor per Unit</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Unit Description */}
                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-foreground">Measurement Unit</Label>
                                <Input
                                    placeholder="e.g. kg, pcs, box, order"
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    className="text-xs h-9"
                                />
                            </div>

                            {/* Quantity per Order */}
                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-foreground">Quantity Needed per Order</Label>
                                <Input
                                    type="number"
                                    step="any"
                                    min="0.001"
                                    value={quantityNeeded}
                                    onChange={(e) => setQuantityNeeded(parseFloat(e.target.value) || 0)}
                                    className="text-xs h-9"
                                    required
                                />
                            </div>

                            {/* Cost per Unit */}
                            <div className="space-y-1">
                                <Label className="text-[11px] font-bold text-foreground">Cost per Unit (₹)</Label>
                                <Input
                                    type="number"
                                    step="any"
                                    min="0"
                                    value={unitCost}
                                    onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                                    className="text-xs h-9"
                                    required
                                />
                            </div>

                        </div>

                        <Button
                            type="submit"
                            disabled={isAdding || !name.trim()}
                            className="w-full text-xs font-bold uppercase tracking-wider cursor-pointer gap-1.5 h-9 bg-primary text-primary-foreground mt-2"
                        >
                            {isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                            <span>Add Item to Unit Cost</span>
                        </Button>
                    </form>

                    {/* ADDED ITEMS LIST */}
                    <div className="space-y-2 pt-2">
                        <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                            Items Added ({materials.length})
                        </Label>

                        {materials.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic p-4 rounded-xl border border-dashed text-center">
                                No unit costs added yet. Use the form above to add your first raw material, box, or shipping fee.
                            </p>
                        ) : (
                            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                {materials.map((item) => {
                                    const itemTotal = Number(item.quantity_needed || 1) * Number(item.unit_cost || 0);
                                    return (
                                        <div
                                            key={item.id}
                                            className="p-3.5 rounded-xl bg-background border border-border flex items-center justify-between gap-3 text-xs"
                                        >
                                            <div className="space-y-0.5 min-w-0">
                                                <span className="font-bold text-foreground truncate block">{item.name}</span>
                                                <span className="text-[10px] text-muted-foreground block">
                                                    {item.quantity_needed} {item.unit} × ₹{item.unit_cost} = <strong className="text-foreground">₹{itemTotal}</strong>
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                                    {item.category?.replace('_', ' ')}
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteMaterial(item.id)}
                                                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* AI HELPFUL HINT / REMINDER */}
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-600 dark:text-amber-400 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>
                            <strong>Quick Checklist:</strong> Did you remember outer shipping boxes/courier envelopes, tape, thank-you notes, delivery flat rates, and payment gateway fees (~2%)?
                        </span>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-2 pt-2 border-t border-border/50">
                        {materials.length > 0 && isCompleted && (
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
                            onClick={handleSubmitUnitCosts}
                            disabled={isSubmitting || materials.length === 0}
                            className="flex-1 h-10 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <span>Save Unit Cost & Continue</span>
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
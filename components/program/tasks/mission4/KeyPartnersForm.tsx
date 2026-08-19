// components/program/tasks/mission4/KeyPartnersForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getActiveProjectAction, updateProjectOperationsAction } from '@/actions/projects';
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
  Users, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  AlertCircle, 
  Edit2,
  Handshake,
  Sparkles
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

interface PartnerItem {
  id: string;
  name: string;
  role: string;
  contact_info?: string;
}

export function KeyPartnersForm({
  task,
  existingProgress,
  onSuccess
}: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);
  const [partners, setPartners] = useState<PartnerItem[]>([]);

  const isCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isCompleted);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New Partner Entry State
  const [name, setName] = useState('');
  const [role, setRole] = useState('supplier');
  const [contactInfo, setContactInfo] = useState('');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const res = await getActiveProjectAction();
      if (res.success && res.data) {
        setActiveProject(res.data);
        const solutionDesign = (res.data.solution_design as any) || {};
        const operations = solutionDesign.operations || {};

        if (Array.isArray(operations.key_partners)) {
          setPartners(operations.key_partners);
        }
      } else {
        setErrorMessage(!res.success ? res.error : 'Failed to load active project');
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPartner: PartnerItem = {
      id: `partner_${Date.now()}`,
      name: name.trim(),
      role,
      contact_info: contactInfo.trim() || undefined
    };

    setPartners((prev) => [...prev, newPartner]);
    setName('');
    setContactInfo('');
  };

  const handleDeletePartner = (id: string) => {
    setPartners((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmitPartners = async () => {
    if (!activeProject) return;
    if (partners.length === 0) {
      setErrorMessage('Please add at least one key partner or vendor.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const solutionDesign = (activeProject.solution_design as any) || {};
    const existingOps = solutionDesign.operations || {};

    const operationsPayload = {
      ...existingOps,
      key_partners: partners
    };

    // 1. Save to project
    const updateRes = await updateProjectOperationsAction(activeProject.id, operationsPayload);

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to save partners');
      setIsSubmitting(false);
      return;
    }

    // 2. Complete Task
    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        key_partners: partners
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
        <p className="text-xs text-muted-foreground font-medium">Loading partner data...</p>
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

      {/* READ-ONLY COMPLETED VIEW */}
      {partners.length > 0 && !isEditing ? (
        <div className="w-full space-y-4 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Key Partners Saved ({partners.length})
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Partners
            </Button>
          </div>

          <div className="space-y-2">
            {partners.map((p) => (
              <div key={p.id} className="p-3 rounded-xl bg-card border border-border/60 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-foreground block">{p.name}</span>
                  {p.contact_info && (
                    <span className="text-[10px] text-muted-foreground block">{p.contact_info}</span>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {p.role.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* EDITABLE FORM VIEW */
        <div className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
              <Handshake className="w-3.5 h-3.5" />
              Identify Critical Partners & Allies
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Log raw material vendors, courier partners, white-label manufacturers, or community collaborators.
            </p>
          </div>

          {/* ADD PARTNER FORM */}
          <form onSubmit={handleAddPartner} className="p-4 rounded-xl border border-border/80 bg-background space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Partner / Vendor Name */}
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-[11px] font-bold text-foreground">Partner / Vendor Name *</Label>
                <Input
                  placeholder="e.g. Local Fabric Wholesaler, Shiprocket, Shopify, Printo Packaging"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs h-9"
                  required
                />
              </div>

              {/* Partner Role */}
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-foreground">Partner Role</Label>
                <Select value={role} onValueChange={(val) => setRole(val ?? 'supplier')}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supplier">Raw Material Supplier</SelectItem>
                    <SelectItem value="manufacturer">Contract Manufacturer / Printer</SelectItem>
                    <SelectItem value="logistics">Courier / Logistics Partner</SelectItem>
                    <SelectItem value="software_platform">Software / Tech Platform</SelectItem>
                    <SelectItem value="distribution_ally">Distribution / Affiliate Ally</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Contact / Location Notes */}
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-foreground">Contact / Website (Optional)</Label>
                <Input
                  placeholder="e.g. +91 9876543210 or website link"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

            </div>

            <Button
              type="submit"
              disabled={!name.trim()}
              className="w-full text-xs font-bold uppercase tracking-wider cursor-pointer gap-1.5 h-9 bg-primary text-primary-foreground mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Key Partner</span>
            </Button>
          </form>

          {/* PARTNERS LIST */}
          <div className="space-y-2 pt-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Key Partners Added ({partners.length})
            </Label>

            {partners.length === 0 ? (
              <p className="text-xs text-muted-foreground italic p-4 rounded-xl border border-dashed text-center">
                No key partners added yet. Add suppliers or courier partners above.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {partners.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl bg-background border border-border flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <span className="font-bold text-foreground truncate block">{p.name}</span>
                      {p.contact_info && (
                        <span className="text-[10px] text-muted-foreground block truncate">{p.contact_info}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {p.role.replace('_', ' ')}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePartner(p.id)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-2 pt-2 border-t border-border/50">
            {partners.length > 0 && isCompleted && (
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
              onClick={handleSubmitPartners}
              disabled={isSubmitting || partners.length === 0}
              className="flex-1 h-10 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Save Partners & Operational Risks</span>
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
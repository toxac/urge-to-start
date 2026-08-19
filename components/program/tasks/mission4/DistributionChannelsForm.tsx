// components/program/tasks/mission4/DistributionChannelsForm.tsx
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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Truck, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  AlertCircle, 
  Edit2,
  Store,
  Globe,
  MessageSquare,
  Package,
  ShoppingBag
} from 'lucide-react';

type UserProjectRow = Database['public']['Tables']['user_projects']['Row'];

const CHANNEL_OPTIONS = [
  { id: 'website_d2c', label: 'Own Website / Storefront (Shopify, Custom)', icon: Globe },
  { id: 'whatsapp_social', label: 'Direct Messaging (WhatsApp, Instagram DM)', icon: MessageSquare },
  { id: 'marketplaces', label: 'Online Marketplaces (Amazon, Zomato, Swiggy)', icon: ShoppingBag },
  { id: 'local_retail', label: 'Physical Retail / Local Stalls / Pop-ups', icon: Store },
];

export function DistributionChannelsForm({
  task,
  existingProgress,
  onSuccess
}: BaseTaskComponentProps) {
  const [activeProject, setActiveProject] = useState<UserProjectRow | null>(null);

  const isCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isCompleted);

  const [selectedChannels, setSelectedChannels] = useState<string[]>(['website_d2c']);
  const [fulfillmentType, setFulfillmentType] = useState<string>('courier_shipping');
  const [channelNotes, setChannelNotes] = useState<string>('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const res = await getActiveProjectAction();
      if (res.success && res.data) {
        setActiveProject(res.data);
        const solutionDesign = (res.data.solution_design as any) || {};
        const operations = solutionDesign.operations || {};

        if (operations.sales_channels) {
          setSelectedChannels(operations.sales_channels);
        }
        if (operations.fulfillment_type) {
          setFulfillmentType(operations.fulfillment_type);
        }
        if (operations.channel_notes) {
          setChannelNotes(operations.channel_notes);
        }
      } else {
        setErrorMessage(!res.success ? res.error : 'Failed to load active project');
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleToggleChannel = (channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleSubmitChannels = async () => {
    if (!activeProject) return;
    if (selectedChannels.length === 0) {
      setErrorMessage('Please select at least one sales channel.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const operationsPayload = {
      sales_channels: selectedChannels,
      fulfillment_type: fulfillmentType,
      channel_notes: channelNotes.trim()
    };

    // 1. Save to project
    const updateRes = await updateProjectOperationsAction(activeProject.id, operationsPayload);

    if (!updateRes.success) {
      setErrorMessage(updateRes.error || 'Failed to save channels');
      setIsSubmitting(false);
      return;
    }

    // 2. Complete Task
    const taskRes = await processTaskCompletion({
      task,
      savedPayload: {
        project_id: activeProject.id,
        distribution_channels: operationsPayload
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
        <p className="text-xs text-muted-foreground font-medium">Loading distribution details...</p>
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
      {!isEditing ? (
        <div className="w-full space-y-4 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Distribution Channels Saved
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Channels
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Selected Channels</span>
              <div className="flex flex-wrap gap-1 pt-1">
                {selectedChannels.map((c) => (
                  <span key={c} className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 uppercase">
                    {c.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Fulfillment Method</span>
              <p className="text-xs font-bold text-foreground capitalize">{fulfillmentType.replace('_', ' ')}</p>
            </div>
          </div>

          {channelNotes && (
            <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1 text-xs">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Channel Execution Details</span>
              <p className="text-xs font-medium text-foreground">{channelNotes}</p>
            </div>
          )}
        </div>
      ) : (
        /* EDITABLE FORM VIEW */
        <div className="p-5 rounded-2xl border border-border bg-card/60 space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              Select Primary Sales Channels
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Where will customers discover, browse, and place orders on Day 1?
            </p>
          </div>

          {/* CHANNEL SELECTION CHECKBOXES */}
          <div className="space-y-2">
            {CHANNEL_OPTIONS.map((channel) => {
              const Icon = channel.icon;
              const isChecked = selectedChannels.includes(channel.id);
              return (
                <div
                  key={channel.id}
                  onClick={() => handleToggleChannel(channel.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 text-xs ${
                    isChecked
                      ? 'bg-amber-500/10 border-amber-500/40 font-semibold'
                      : 'bg-background border-border hover:border-border/80'
                  }`}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => handleToggleChannel(channel.id)}
                  />
                  <Icon className={`w-4 h-4 shrink-0 ${isChecked ? 'text-amber-500' : 'text-muted-foreground'}`} />
                  <span className="text-foreground flex-1">{channel.label}</span>
                </div>
              );
            })}
          </div>

          {/* FULFILLMENT SELECTOR */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-foreground">Fulfillment & Delivery Method</Label>
            <Select 
              value={fulfillmentType} 
              onValueChange={(val) => setFulfillmentType(val ?? 'courier_shipping')}
            >
              <SelectTrigger className="text-xs h-9 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="courier_shipping">Standard Courier / Parcel Delivery (2-5 Days)</SelectItem>
                <SelectItem value="local_hyperlocal">Local Hyperlocal Delivery (Dunzo, Porter, Self-Pickup)</SelectItem>
                <SelectItem value="digital_instant">Instant Digital Download / Email Access</SelectItem>
                <SelectItem value="onsite_service">On-Site Service Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* NOTES / EXECUTION DETAILS */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-foreground">Channel Setup Details (Optional)</Label>
            <Input
              placeholder="e.g. Setting up Shopify store connected to Shiprocket courier partner"
              value={channelNotes}
              onChange={(e) => setChannelNotes(e.target.value)}
              className="text-xs h-9 bg-background"
            />
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
              onClick={handleSubmitChannels}
              disabled={isSubmitting || selectedChannels.length === 0}
              className="flex-1 h-10 text-xs font-bold uppercase tracking-wider cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Save Channels & Identify Key Partners</span>
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
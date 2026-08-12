// components/program/tasks/mission1/CheerSquadForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { addSquadContactsAction, getSquadContactsAction, deleteSquadContactAction } from '@/actions/contacts';
import { processTaskCompletion } from '@/lib/utils/taskExecution';
import { BaseTaskComponentProps } from '../types';
import { TaskResourcesList } from '../TaskResourcesList';
import { UserContactRow } from '@/types/contacts';
import { 
  Loader2, 
  Edit2, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Users,
  Heart
} from 'lucide-react';

interface ContactInput {
  email: string;
  first_name: string;
  note: string;
}

interface FormValues {
  contacts: ContactInput[];
}

export function CheerSquadForm({ task, existingProgress, onSuccess }: BaseTaskComponentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [squadList, setSquadList] = useState<UserContactRow[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isInitiallyCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isInitiallyCompleted);

  // 1. Fetch existing cheer squad contacts on mount
  useEffect(() => {
    let isMounted = true;
    async function loadSquad() {
      try {
        const res = await getSquadContactsAction();
        if (res.success && res.data && isMounted) {
          setSquadList(res.data);
        }
      } catch (err) {
        console.error('Failed to load squad contacts:', err);
      } finally {
        if (isMounted) setLoadingContacts(false);
      }
    }
    loadSquad();
    return () => { isMounted = false; };
  }, []);

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      contacts: [
        { email: '', first_name: '', note: '' }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts'
  });

  // Helper to generate personalized message script with confirmation link
  const getInviteMessage = (contact: UserContactRow) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const confirmUrl = `${origin}/api/squad/confirm?contact_id=${contact.id}`;
    const nameStr = contact.first_name ? ` ${contact.first_name}` : '';
    const customNote = contact.note ? `\n\nNote from me: "${contact.note}"` : '';

    return `Hey${nameStr}! I'm launching a new project and building my inner "Cheer Squad" of trusted people to keep me accountable and share behind-the-scenes milestones.${customNote}\n\nWould love to have you in my corner. Click here to confirm and join my squad:\n${confirmUrl}`;
  };

  const handleCopyInvite = (contact: UserContactRow) => {
    const message = getInviteMessage(contact);
    navigator.clipboard.writeText(message);
    setCopiedId(contact.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (contactId: string) => {
    try {
      const res = await deleteSquadContactAction(contactId);
      if (res.success) {
        setSquadList((prev) => prev.filter((c) => c.id !== contactId));
      }
    } catch (err) {
      console.error('Failed to delete contact:', err);
    }
  };

  const onSubmit = async (formData: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const validContacts = formData.contacts.filter((c) => c.email.trim().length > 0);

    if (validContacts.length === 0 && squadList.length === 0) {
      setErrorMessage('Please enter at least one email address for your Cheer Squad.');
      setIsSubmitting(false);
      return;
    }

    try {
      let newlySaved: UserContactRow[] = [];

      if (validContacts.length > 0) {
        // 1. Save contacts to user_contacts table
        const contactSync = await addSquadContactsAction({
          contacts: validContacts
        });

        if (!contactSync.success) {
          setErrorMessage(contactSync.error || 'Failed to save squad contacts');
          setIsSubmitting(false);
          return;
        }

        newlySaved = contactSync.data || [];
        setSquadList((prev) => [...newlySaved, ...prev]);
      }

      // 2. Process Program Task Completion
      const taskResult = await processTaskCompletion({
        task,
        savedPayload: { 
          squad_count: squadList.length + newlySaved.length,
          updated_at: new Date().toISOString()
        }
      });

      if (taskResult.success) {
        setIsEditing(false);
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(taskResult.error || 'Failed to mark squad task complete');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── READ-ONLY COMPLETED VIEW ───
  if (!isEditing) {
    return (
      <div className="w-full space-y-5 border rounded-2xl p-6 bg-emerald-500/5 border-emerald-500/20 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            Cheer Squad Established ({squadList.length} Members)
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 text-xs font-semibold cursor-pointer gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Manage Squad & Invites
          </Button>
        </div>

        <div className="space-y-3 text-xs">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Your Inner Circle:
          </span>

          <div className="grid grid-cols-1 gap-3">
            {squadList.map((member) => (
              <div key={member.id} className="p-4 rounded-xl bg-card border border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                      {member.first_name || member.email}
                    </span>
                    <span className="text-[10px] text-muted-foreground block font-mono">
                      {member.email}
                    </span>
                  </div>

                  <Badge 
                    variant={member.status === 'active' ? 'default' : 'outline'}
                    className={`text-[9px] uppercase font-bold ${
                      member.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : ''
                    }`}
                  >
                    {member.status === 'active' ? '✓ Confirmed Active' : 'Unconfirmed'}
                  </Badge>
                </div>

                {member.note && (
                  <p className="text-[11px] text-muted-foreground italic bg-muted/20 p-2 rounded-lg">
                    "{member.note}"
                  </p>
                )}

                <div className="pt-1 flex items-center justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyInvite(member)}
                    className="h-7 text-[10px] font-bold text-primary border-primary/20 hover:bg-primary/10 gap-1.5 cursor-pointer"
                  >
                    {copiedId === member.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        Copied Invite Message!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy Personal Invite Message
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── EDITABLE FORM VIEW ───
  return (
    <div className="w-full space-y-6 text-left">
      {errorMessage && (
        <div className="w-full p-4 border rounded-xl bg-destructive/10 border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* RECOMMENDED RESOURCES / PLAYBOOK GUIDES */}
      <TaskResourcesList resources={task.resources} />

      {/* Existing Squad Members Section (if any already saved) */}
      {squadList.length > 0 && (
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Existing Squad Members ({squadList.length}):
          </span>

          <div className="space-y-2">
            {squadList.map((member) => (
              <div key={member.id} className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground truncate">
                      {member.first_name || member.email}
                    </span>
                    <Badge 
                      variant={member.status === 'active' ? 'default' : 'outline'}
                      className={`text-[8px] uppercase font-bold ${
                        member.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : ''
                      }`}
                    >
                      {member.status === 'active' ? 'Confirmed' : 'Pending Invite'}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono block truncate">
                    {member.email}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyInvite(member)}
                    className="h-7 text-[10px] font-bold text-primary border-primary/20 hover:bg-primary/10 gap-1 cursor-pointer"
                  >
                    {copiedId === member.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    {copiedId === member.id ? 'Copied!' : 'Copy Script'}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(member.id)}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Squad Members Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-foreground block">
              Add Cheer Squad Members *
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ email: '', first_name: '', note: '' })}
              className="h-7 text-[10px] font-bold text-primary border-primary/20 hover:bg-primary/10 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              Add Another Person
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Choose 1-5 people who genuinely care about you (spouse, close friend, mentor). When you save them, we will generate a personalized invitation script and link for each person that you can copy and send directly!
          </p>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 rounded-xl border border-border bg-card/60 space-y-3 relative">
                <div className="flex items-center justify-between gap-2 border-b pb-2">
                  <span className="text-[10px] font-bold uppercase text-primary tracking-wider flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Squad Member #{index + 1}
                  </span>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* First Name */}
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold text-foreground">First Name</Label>
                    <Input
                      className="text-xs h-9 bg-background"
                      placeholder="e.g. Sarah"
                      {...register(`contacts.${index}.first_name` as const)}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold text-foreground">Email Address *</Label>
                    <Input
                      type="email"
                      className="text-xs h-9 bg-background"
                      placeholder="e.g. sarah@example.com"
                      {...register(`contacts.${index}.email` as const, { 
                        required: fields.length === 1 && squadList.length === 0 
                      })}
                    />
                  </div>
                </div>

                {/* Personal Note */}
                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold text-foreground">
                    Personal Note / Ask (Included in invite message)
                  </Label>
                  <Textarea
                    className="text-xs min-h-[60px] resize-none bg-background"
                    placeholder="e.g. Thanks for always keeping me grounded. Would love if you checked in on me once a month!"
                    {...register(`contacts.${index}.note` as const)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Footer Controls */}
        <div className="flex gap-3 pt-2">
          {isInitiallyCompleted && (
            <Button
              type="button"
              variant="ghost"
              className="h-10 text-xs font-semibold cursor-pointer"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            className="flex-1 h-10 text-xs font-bold tracking-wider uppercase cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Generating Invite Links...
              </span>
            ) : isInitiallyCompleted ? (
              'Update Squad'
            ) : (
              `Save squad & mark task complete`
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}
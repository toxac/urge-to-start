'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { updateMyProfile } from '@/actions/profiles';
import { completeTaskExecution } from '@/actions/progress';
import { setProgressStoreRow } from '@/lib/stores/progressStore';
import { updateProfileStoreFields } from '@/lib/stores/profileStore';

// Custom Akar Brand Icons
import { LinkedinBoxFillIcon } from '@/components/icons/akar-icons-linkedin-box-fill';
import { InstagramFillIcon } from '@/components/icons/akar-icons-instagram-fill';
import { YoutubeFillIcon } from '@/components/icons/akar-icons-youtube-fill';
import { RedditFillIcon } from '@/components/icons/akar-icons-reddit-fill';
import { FacebookFillIcon } from '@/components/icons/akar-icons-facebook-fill';
import { TiktokFillIcon } from '@/components/icons/akar-icons-tiktok-fill';
import { DribbbleFillIcon } from '@/components/icons/akar-icons-dribbble-fill';
import { XFillIcon } from '@/components/icons/akar-icons-x-fill';

// Base UI structural layout drawers
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Link2, Check, UserCircle2, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const AVAILABLE_PLATFORMS = [
  { key: 'linkedin', label: 'LinkedIn', icon: LinkedinBoxFillIcon, colorClass: 'text-[#0A66C2] border-[#0A66C2]/20 bg-[#0A66C2]/5' },
  { key: 'x', label: 'X (Twitter)', icon: XFillIcon, colorClass: 'text-foreground border-foreground/20 bg-foreground/5' },
  { key: 'instagram', label: 'Instagram', icon: InstagramFillIcon, colorClass: 'text-[#E1306C] border-[#E1306C]/20 bg-[#E1306C]/5' },
  { key: 'youtube', label: 'YouTube', icon: YoutubeFillIcon, colorClass: 'text-[#FF0000] border-[#FF0000]/20 bg-[#FF0000]/5' },
  { key: 'reddit', label: 'Reddit', icon: RedditFillIcon, colorClass: 'text-[#FF4500] border-[#FF4500]/20 bg-[#FF4500]/5' },
  { key: 'facebook', label: 'Facebook', icon: FacebookFillIcon, colorClass: 'text-[#1877F2] border-[#1877F2]/20 bg-[#1877F2]/5' },
  { key: 'tiktok', label: 'TikTok', icon: TiktokFillIcon, colorClass: 'text-foreground dark:text-white border-foreground/20 bg-foreground/5' },
  { key: 'dribbble', label: 'Dribbble', icon: DribbbleFillIcon, colorClass: 'text-[#EA4C89] border-[#EA4C89]/20 bg-[#EA4C89]/5' },
  { key: 'other', label: 'Other Platform', icon: Link2, colorClass: 'text-primary border-primary/20 bg-primary/5' },
];

interface SocialProfileNode {
  platform: string;
  custom_name?: string;
  url: string;
  total_followers?: number;
}

interface ProfileFormInputs {
  description: string;
  avatar_url: string;
  gender: string; // ⚡ ADDED TO INTERFACE
  socials: SocialProfileNode[];
}

interface ProfileSetupFormProps {
  taskId: string;
  userId: string;
  existingProgress?: {
    status: string;
    saved_payload?: any;
  };
  onSuccess?: () => void;
}

export function ProfileSetupForm({ taskId, userId, existingProgress, onSuccess }: ProfileSetupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isInitiallyCompleted = existingProgress?.status === 'completed';
  const [isEditing, setIsEditing] = useState(!isInitiallyCompleted);
  const [activeDialogPlatform, setActiveDialogPlatform] = useState<string | null>(null);

  const preSavedPayload = existingProgress?.saved_payload || {};

  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<ProfileFormInputs>({
    defaultValues: {
      description: preSavedPayload.description || '',
      avatar_url: preSavedPayload.avatar_url || '',
      gender: preSavedPayload.gender || '', // ⚡ DEFAULT VALUE
      socials: preSavedPayload.socials || [],
    }
  });

  const { append, remove, update } = useFieldArray({
    control,
    name: 'socials',
  });

  const trackedAvatarUrl = watch('avatar_url');
  const watchedSocials = watch('socials') || [];

  const getConnectedSocial = (platformKey: string) => {
    return watchedSocials.find((s) => s?.platform === platformKey);
  };

  const executeAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setErrorMessage(null);
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const targetStoragePath = `${userId}/avatar_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(targetStoragePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(targetStoragePath);
      setValue('avatar_url', publicUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'Storage transmission rejected by infrastructure limits');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const saveSocialLinkDetails = (platform: string, url: string, followers?: number, customName?: string) => {
    const existingIndex = watchedSocials.findIndex((s) => s.platform === platform);

    if (!url.trim()) {
      if (existingIndex > -1) remove(existingIndex);
      setActiveDialogPlatform(null);
      return;
    }

    const itemData: SocialProfileNode = {
      platform,
      url: url.trim(),
      total_followers: followers ? Number(followers) : 0,
      ...(platform === 'other' && customName ? { custom_name: customName.trim() } : {})
    };

    if (existingIndex > -1) {
      update(existingIndex, itemData);
    } else {
      append(itemData);
    }
    setActiveDialogPlatform(null);
  };

  const processFormSubmission = async (formData: ProfileFormInputs) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const profileSync = await updateMyProfile({
        avatar_url: formData.avatar_url,
        description: formData.description,
        gender: formData.gender, // ⚡ PASSED DOWN TO UPDATE ACTION HELPER
      } as any);

      if (!profileSync.success) {
        setErrorMessage(profileSync.error);
        setIsSubmitting(false);
        return;
      }

      if (profileSync.data) {
        updateProfileStoreFields(profileSync.data as any);
      }

      const progressSync = await completeTaskExecution({
        taskId,
        savedPayload: formData as Record<string, any>
      });

      if (progressSync.success) {
        if (progressSync.data) {
          setProgressStoreRow(progressSync.data as any);
        }
        setIsEditing(false);
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(progressSync.error);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Fatal execution anomaly captured inside processing pipelines');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── READ-ONLY DISPLAY VIEW CANVAS ───
  if (!isEditing) {
    return (
      <div className="w-full space-y-5 border border-border bg-muted/20 rounded-2xl p-6 text-left animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
            <Check className="w-4 h-4" /> Your Network Profile Identity Card
          </span>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="h-7 text-xs rounded-xl bg-card">
            <Edit3 className="w-3 h-3 mr-1.5" /> Edit Identity
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {preSavedPayload.avatar_url ? (
            <img src={preSavedPayload.avatar_url} alt="Avatar" className="h-14 w-14 rounded-full object-cover border border-border" />
          ) : (
            <UserCircle2 className="h-14 w-14 text-muted-foreground/40" />
          )}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-foreground">Identity Authenticated</h4>
              {preSavedPayload.gender && (
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider bg-muted border border-border px-1.5 py-0.5 rounded text-muted-foreground">
                  {preSavedPayload.gender}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground italic max-w-md font-medium leading-relaxed">
              "{preSavedPayload.description}"
            </p>
          </div>
        </div>

        {watchedSocials.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {watchedSocials.map((soc: any) => {
              const match = AVAILABLE_PLATFORMS.find(p => p.key === soc.platform);
              const PlatformIcon = match?.icon || Link2;
              const isOther = soc.platform === 'other';

              return (
                <a
                  key={soc.platform}
                  href={soc.url}
                  target="_blank"
                  rel="noreferrer"
                  className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition hover:opacity-80", match?.colorClass)}
                >
                  {isOther ? (
                    <PlatformIcon size={13} className="text-primary" />
                  ) : (
                    <PlatformIcon size={14} strokeWidth={0} className="fill-current" />
                  )}
                  <span className="capitalize">
                    {isOther ? (soc.custom_name || 'Website') : soc.platform === 'x' ? 'X' : soc.platform}
                  </span>
                </a>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-left animate-in fade-in duration-200">
      {errorMessage && (
        <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-xl text-destructive text-xs font-bold">
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(processFormSubmission)} className="space-y-6">

        {/* AVATAR PICTURE BLOCK */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">1. Network Profile Picture</Label>
          <div className="flex items-center gap-4 p-4 border border-border bg-muted/30 rounded-xl">
            {trackedAvatarUrl ? (
              <img src={trackedAvatarUrl} alt="Avatar Preview" className="h-16 w-16 rounded-full object-cover border border-border shrink-0" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-muted border border-border flex items-center justify-center text-xs text-muted-foreground font-semibold shrink-0">
                Headshot
              </div>
            )}
            <div className="space-y-1.5 flex-1">
              <Input type="file" accept="image/*" disabled={uploadingAvatar} onChange={executeAvatarUpload} className="text-xs h-9 cursor-pointer" />
              <input type="hidden" {...register('avatar_url', { required: true })} />
              <p className="text-[10px] text-muted-foreground">Upload a square headshot avatar image node.</p>
            </div>
          </div>
          {errors.avatar_url && <p className="text-[11px] text-destructive font-bold">A profile headshot avatar picture is mandatory.</p>}
        </div>

        {/* BIO DESCRIPTION BOX */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">2. Short Bio Introduction</Label>
          <Textarea
            placeholder="Tell the community what projects you are actively shipping, what your skills look like, and what kind of collaborators you want to meet..."
            className="min-h-[100px] text-xs resize-none rounded-xl"
            {...register('description', { required: true, minLength: 10 })}
          />
          {errors.description && <p className="text-[11px] text-destructive font-bold">Please provide a bio summary statement (min 10 characters).</p>}
        </div>

        {/* ─── UPGRADED INTERACTIVE FIELD: SHADCN GENDER SELECT ─── */}
        <div className="space-y-2">
          <Label htmlFor="genderSelect" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            3. Gender Identity
          </Label>

          <Controller
            control={control}
            name="gender"
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger id="genderSelect" className="w-full sm:w-72 h-9 rounded-xl border border-input bg-background px-3 text-xs shadow-sm text-foreground font-medium text-left">
                  <SelectValue placeholder="Select your gender..." />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border rounded-xl shadow-lg text-xs font-medium text-foreground">
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Non-binary">Non-binary</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {errors.gender && (
            <p className="text-[11px] text-destructive font-bold">
              Please select an identity option.
            </p>
          )}
        </div>

        {/* SOCIAL HANDLE GRID MATRIX */}
        <div className="space-y-3">
          <div className="space-y-0.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">4. Link Connected Handles</Label>
            <p className="text-[11px] text-muted-foreground">Click individual badges to spin up custom configuration input sheets.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {AVAILABLE_PLATFORMS.map((plat) => {
              const connectedInfo = getConnectedSocial(plat.key);
              const IconComp = plat.icon;
              const isOther = plat.key === 'other';

              return (
                <Dialog
                  key={plat.key}
                  open={activeDialogPlatform === plat.key}
                  onOpenChange={(open) => setActiveDialogPlatform(open ? plat.key : null)}
                >
                  <DialogTrigger className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition cursor-pointer select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                    connectedInfo
                      ? plat.colorClass
                      : "bg-card border-border text-muted-foreground/60 hover:text-foreground hover:border-border-hover"
                  )}>
                    <div className="flex items-center gap-2 truncate">
                      {isOther ? (
                        <IconComp size={15} className={cn("shrink-0", connectedInfo ? "text-primary" : "text-muted-foreground/40")} />
                      ) : (
                        <IconComp size={16} strokeWidth={0} className={cn("shrink-0 fill-current", !connectedInfo && "text-muted-foreground/40")} />
                      )}
                      <span className="truncate">
                        {isOther && connectedInfo?.custom_name ? connectedInfo.custom_name : plat.label}
                      </span>
                    </div>
                    {connectedInfo && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                  </DialogTrigger>

                  <DialogContent className="max-w-sm rounded-2xl bg-card border border-border p-5 text-left text-foreground">
                    <DialogHeader className="pb-2 border-b border-border/60">
                      <DialogTitle className="text-sm font-bold flex items-center gap-2">
                        {isOther ? (
                          <IconComp size={18} className="text-primary" />
                        ) : (
                          <IconComp size={18} strokeWidth={0} className="fill-primary" />
                        )}
                        Connect {isOther ? 'Custom Node' : `${plat.label} Access Node`}
                      </DialogTitle>
                    </DialogHeader>

                    <SocialInputSubForm
                      platform={plat.key}
                      initialData={connectedInfo}
                      onOpenChange={(url, followers, customName) => saveSocialLinkDetails(plat.key, url, followers, customName)}
                    />
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        </div>

        {/* BOTTOM ACTION CTA SUBMIT ROW */}
        <div className="flex gap-3 pt-4 border-t border-border/40">
          {isInitiallyCompleted && (
            <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl h-10 text-xs font-bold">
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || uploadingAvatar}
            className="flex-1 h-10 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            {isSubmitting ? 'Syncing Network Data...' : isInitiallyCompleted ? 'Update Profile Specs' : 'Save Introduction & Earn 10 XP'}
          </Button>
        </div>

      </form>
    </div>
  );
}

interface SubFormProps {
  platform: string;
  initialData?: SocialProfileNode;
  onOpenChange: (url: string, followers?: number, customName?: string) => void;
}

// Fixed parameter naming mismatch here cleanly
function SocialInputSubForm({ platform, initialData, onOpenChange }: SubFormProps) {
  const isOther = platform === 'other';
  const [urlVal, setUrlVal] = useState(initialData?.url || '');
  const [folVal, setFolVal] = useState(initialData?.total_followers?.toString() || '');
  const [customNameVal, setCustomNameVal] = useState(initialData?.custom_name || '');

  return (
    <div className="space-y-4 pt-3 text-xs">
      {isOther && (
        <div className="space-y-1.5">
          <Label htmlFor="customName" className="text-[11px] font-bold text-muted-foreground uppercase">Platform Name</Label>
          <Input
            id="customName"
            type="text"
            placeholder="e.g. Behance, Substack, GitHub"
            value={customNameVal}
            onChange={(e) => setCustomNameVal(e.target.value)}
            className="h-9 text-xs rounded-xl bg-background border-input"
          />
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="socialUrl" className="text-[11px] font-bold text-muted-foreground uppercase">Profile URL</Label>
        <Input
          id="socialUrl"
          type="url"
          placeholder={isOther ? "https://example.com/username" : `https://${platform}.com/yourhandle`}
          value={urlVal}
          onChange={(e) => setUrlVal(e.target.value)}
          className="h-9 text-xs rounded-xl bg-background border-input"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="followers" className="text-[11px] font-bold text-muted-foreground uppercase">Followers / Audience Count</Label>
        <Input
          id="followers"
          type="number"
          placeholder="0"
          value={folVal}
          onChange={(e) => setFolVal(e.target.value)}
          className="h-9 text-xs rounded-xl bg-background border-input"
        />
      </div>

      <div className="flex gap-2 pt-2 border-t border-border/40 justify-end">
        <Button
          type="button"
          onClick={() => onOpenChange(urlVal, folVal ? Number(folVal) : undefined, isOther ? customNameVal : undefined)}
          className="h-8 rounded-xl px-4 text-xs font-bold"
        >
          Save Details
        </Button>
      </div>
    </div>
  );
}
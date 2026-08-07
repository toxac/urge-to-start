// app/(onboarding)/setup/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { submitProfileSetup } from '@/actions/onboarding-setup';
import { uploadAvatar } from '@/actions/avatar';
import { COUNTRY_DETAILS } from '@/constants/countries';
import { USER_AGE_GROUP_OPTIONS, EDUCATION_TIER_OPTIONS } from '@/constants/enums';
import { Loader2, Upload, Check } from 'lucide-react';

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=Builder1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Builder2',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Builder3',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Builder4',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Builder5',
];

export default function ProfileSettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isFreeTrial, setIsFreeTrial] = useState(true);

  // Form & Avatar Upload States
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Location & Currency States
  const [selectedCountry, setSelectedCountry] = useState('in');
  const [currency, setCurrency] = useState('INR');

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth');
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
        if (data.avatar_url) setSelectedAvatar(data.avatar_url);
        if (data.country) {
          const code = data.country.toLowerCase();
          setSelectedCountry(code);
          setCurrency(COUNTRY_DETAILS[code]?.currency || 'USD');
        }
      }

      const match = document.cookie.match(/urge_signup_intent=([^;]+)/);
      if (match && match[1] === 'member') {
        setIsFreeTrial(false);
      }

      setLoading(false);
    }

    loadUser();
  }, [router]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value.toLowerCase();
    setSelectedCountry(code);
    const matchedCurrency = COUNTRY_DETAILS[code]?.currency || 'USD';
    setCurrency(matchedCurrency);
  };

  // Custom File Upload Handler
  const handleCustomFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('avatarFile', file);

    const result = await uploadAvatar(formData);

    if (result.success && result.url) {
      setSelectedAvatar(result.url);
    } else {
      setUploadError(result.error || 'Failed to upload custom avatar.');
    }

    setIsUploading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-2 animate-pulse min-h-[50vh]">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
          Initializing Setup Workspace...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200 py-6">
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Welcome! Let&rsquo;s set up your profile.
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Help us customize your workspace and program dashboard.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 shadow-xl space-y-6">
        <form action={submitProfileSetup} className="space-y-6 text-xs">
          <input type="hidden" name="avatarUrl" value={selectedAvatar} />
          <input type="hidden" name="currency" value={currency} />

          {/* AVATAR SELECTION SECTION */}
          <div className="space-y-3 border-b border-border/40 pb-6">
            <Label className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider block text-center sm:text-left">
              Choose Avatar or Upload Custom
            </Label>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Preview Box */}
              <div className="relative w-16 h-16 rounded-2xl border-2 border-primary/30 overflow-hidden bg-muted/30 shrink-0 flex items-center justify-center p-1 shadow-sm">
                <img src={selectedAvatar} alt="Avatar preview" className="w-full h-full object-cover rounded-xl" />
                {isUploading && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                )}
              </div>

              {/* Avatar Options + File Upload */}
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(url)}
                      className={`w-10 h-10 rounded-xl border p-1 transition-all ${
                        selectedAvatar === url
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/20 scale-105'
                          : 'border-border/60 hover:border-primary/50 bg-background'
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                    </button>
                  ))}

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={handleCustomFileUpload}
                  />

                  {/* Upload Trigger Button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="h-10 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 border-dashed border-border hover:border-primary"
                  >
                    {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>Upload</span>
                  </Button>
                </div>

                {uploadError && (
                  <p className="text-[11px] text-destructive font-medium animate-in fade-in">
                    ⚠️ {uploadError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* PERSONAL DETAILS SECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="fullName" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
                Full Name *
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="w-full h-10 bg-background border border-input rounded-xl px-3 text-xs"
                defaultValue={profile?.fullname || ''}
                placeholder="Jane Builder"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ageGroup" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
                Age Group *
              </Label>
              <select
                id="ageGroup"
                name="ageGroup"
                required
                defaultValue={profile?.age_group || ''}
                className="w-full flex h-10 rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <option value="" disabled>Select age...</option>
                {USER_AGE_GROUP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="highestEducation" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
                Education Level *
              </Label>
              <select
                id="highestEducation"
                name="highestEducation"
                required
                defaultValue={profile?.highest_education_level || ''}
                className="w-full flex h-10 rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <option value="" disabled>Select education...</option>
                {EDUCATION_TIER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* LOCATION & CURRENCY SECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 border-t border-border/40 pt-5">
            <div className="space-y-1.5">
              <Label htmlFor="country" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
                Country *
              </Label>
              <select
                id="country"
                name="country"
                required
                value={selectedCountry}
                onChange={handleCountryChange}
                className="w-full flex h-10 rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                {Object.entries(COUNTRY_DETAILS).map(([code, detail]) => (
                  <option key={code} value={code}>
                    {detail.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
                City *
              </Label>
              <Input
                id="city"
                name="city"
                type="text"
                required
                className="w-full h-10 bg-background border border-input rounded-xl px-3 text-xs"
                defaultValue={profile?.city || ''}
                placeholder="e.g. Bengaluru"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider opacity-60">
                Primary Currency
              </Label>
              <div className="h-10 bg-muted/40 border border-border/40 rounded-xl px-3 flex items-center font-mono font-bold text-xs text-muted-foreground">
                {currency}
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 border-t border-border/40">
            <Button
              type="submit"
              className="w-full py-5 bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs font-bold tracking-wider uppercase rounded-xl transition shadow-md shadow-primary/10"
            >
              {isFreeTrial 
                ? 'Finish Setup & Start Free Mission' 
                : 'Finish Setup & Continue to Payment'
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
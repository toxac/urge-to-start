// app/(onboarding)/setup/page.tsx
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { submitProfileSetup } from '@/actions/onboarding-setup';
import { COUNTRY_LABELS } from '@/constants/countries';
import { USER_AGE_GROUP_OPTIONS, EDUCATION_TIER_OPTIONS } from '@/constants/enums';

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function ProfileSettingsPage({ searchParams }: PageProps) {
  const sParams = await searchParams;
  const id = sParams.id;

  if (!id) notFound();

  const supabase = await createClient();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (!profile) notFound();

  // Read the user's entry track intent to adapt the messaging
  const cookieStore = await cookies();
  const savedIntent = cookieStore.get('urge_signup_intent')?.value;
  const isFreeTrial = savedIntent === 'free';

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Human-centered Form Title Headers */}
      <div className="text-center space-y-1">
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          Let&rsquo;s get you set up.
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed font-normal px-4">
          Tell us a little bit about yourself so we can tailor your program dashboard.
        </p>
      </div>

      {/* The Centralized Setup Card Form */}
      <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
        <form action={submitProfileSetup} className="space-y-4 text-xs">
          <input type="hidden" name="userId" value={profile.id} />

          {/* 1. Handle Username & Name Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider opacity-60">Username</Label>
              <Input type="text" className="w-full h-10 bg-muted/40 border border-border/40 rounded-xl px-3 opacity-70 text-xs font-medium" defaultValue={`@${profile.username || ''}`} disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">Your Full Name</Label>
              <Input id="fullName" name="fullName" type="text" required className="w-full h-10 bg-background border border-input rounded-xl px-3 text-xs" defaultValue={profile.full_name || ''} placeholder="Jane Dev" />
            </div>
          </div>

          {/* 2. Age and Education Background */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ageGroup" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">Age</Label>
              <select
                id="ageGroup"
                name="ageGroup"
                required
                defaultValue={profile.age_group || ''}
                className="w-full flex h-10 rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <option value="" disabled>Select age...</option>
                {USER_AGE_GROUP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="highestEducation" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">Education Background</Label>
              <select
                id="highestEducation"
                name="highestEducation"
                required
                defaultValue={profile.highest_education || ''}
                className="w-full flex h-10 rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <option value="" disabled>Select education...</option>
                {EDUCATION_TIER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Operational City and Country Region */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">City</Label>
              <Input id="city" name="city" type="text" required className="w-full h-10 bg-background border border-input rounded-xl px-3 text-xs" defaultValue={profile.city || ''} placeholder="e.g. Bengaluru" />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="country" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">Country</Label>
              <select
                id="country"
                name="country"
                required
                defaultValue={profile.country || 'IN'}
                className="w-full flex h-10 rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                {Object.entries(COUNTRY_LABELS).map(([code, name]) => (
                  <option key={code} value={code.toUpperCase()}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Intent Aware CTA Submission Row */}
          <div className="pt-4">
            <Button type="submit" className="w-full py-5 bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs font-bold tracking-wider uppercase rounded-xl transition shadow-md shadow-primary/10">
              {isFreeTrial 
                ? 'Finish Setup & Open Dashboard' 
                : 'Finish Setup & Continue to Payment'
              }
            </Button>
          </div>
        </form>
      </div>

    </div>
  );
}
// app/(onboarding)/setup/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { submitProfileSetup } from '@/actions/onboarding-setup';
import { COUNTRY_LABELS } from '@/constants/countries';
import { USER_AGE_GROUP_OPTIONS, EDUCATION_TIER_OPTIONS } from '@/constants/enums';

export default async function ProfileSettingsPage() {
  const supabase = await createClient();

  // Get user directly from authenticated server session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/auth');

  // Read intent token from cookie
  const cookieStore = await cookies();
  const savedIntent = cookieStore.get('urge_signup_intent')?.value;
  const isFreeTrial = savedIntent === 'free';

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="text-center space-y-1">
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          Let&rsquo;s get you set up.
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed font-normal px-4">
          Tell us a little bit about yourself so we can tailor your program dashboard.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
        <form action={submitProfileSetup} className="space-y-4 text-xs">
          {/* Username & Full Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider opacity-60">
                Username
              </Label>
              <Input
                type="text"
                className="w-full h-10 bg-muted/40 border border-border/40 rounded-xl px-3 opacity-70 text-xs font-medium"
                defaultValue={`@${profile.username || ''}`}
                disabled
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
                Full Name *
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="w-full h-10 bg-background border border-input rounded-xl px-3 text-xs"
                defaultValue={profile.fullname || ''}
                placeholder="Jane Builder"
              />
            </div>
          </div>

          {/* Age Group & Education Background */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ageGroup" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
                Age Group *
              </Label>
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
              <Label htmlFor="highestEducation" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
                Education *
              </Label>
              <select
                id="highestEducation"
                name="highestEducation"
                required
                defaultValue={profile.highest_education_level || ''}
                className="w-full flex h-10 rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <option value="" disabled>Select education...</option>
                {EDUCATION_TIER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* City & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                defaultValue={profile.city || ''}
                placeholder="e.g. Bengaluru"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="country" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
                Country *
              </Label>
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

          {/* Submit CTA */}
          <div className="pt-4">
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


# Onboarding process

## Monetization and Roles
### Platform and Program
- Role-"trial" 
    - I want to offer free access to mission 1 
    - this will need a entry in offer table
- Role-"enrolled"
    - this will be monthly subscription or pay for 6 months in one go (ideally they should have everything done in six months)
    - 
Note: there is no separate community membership offer, they pay for platform and everything comes included

### Other offerings
- Events
    - open: free to all ( free events)
    - community: free for paid users
    - paid: paid for all
- merch
    - paid

## Note on user roles 
- current roles 
    - enums - user_platform_role: base, trial, enrolled, member, provider, mentor, superadmin, admin_marketing, admin_accounts
    - this is way too complicated now that we have simplified the monetization
- new roles 
    - enums - user_platform_role: trial, member, mentor, superadmin, admin_marketing, admin_accounts, squad

## related tables and enums (see supabase types)
- profiles: what we updated earlier
- offerings: stores all the offerings
- transactions: manage all the payment records
- discounts: discounts for offerings

## onboarding flow

### Authentication
- register
    - user input:
        - username
        - email
        - password
- login
- onboarding pages ( this is same for trial and member or squad - pass intent through query params)
    - user input:
        - fullname
        - city
        - country (auto fill from ip)
        - age-group
        - currency (auto fill from ip)
    - on save :
        - if trial: 
            - create a entry in transactions for free trial offer
            - add role to profile (trial)
            - take them to dashboard
        - if member: 
            - take them to checkout with offer id in query params
    - checkout:
        - show discount code input, validate and apply discount
        - billing address (save to profiles.address)
        - on successful payment 
            - add to transactions
            - add role (member) to profile.roles
            - take to dashboard


## reference files 

### Pages
1. app/auth/layout.tsx
```tsx
// app/auth/layout.tsx
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { NavigationHeader } from '@/components/layout/NavBar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Suspense 
        fallback={
          <div className="flex flex-col items-center justify-center space-y-2 animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">Initializing Workspace Node...</span>
          </div>
        }
      >
      <NavigationHeader variant="auth" />
      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>
      </Suspense>
    </div>
  );
}
```

2. app/auth/page.tsx ( one page that handles login and register)
```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoginCard } from '@/components/auth/LoginCard';
import { SignupCard } from '@/components/auth/SignupCard';

export default function AuthenticatePage() {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // ⚡ Completely synchronous read — NO await required here!
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlIntent = searchParams.get('intent');
    if (urlIntent) {
      document.cookie = `urge_signup_intent=${urlIntent}; path=/; max-age=1800; SameSite=Strict`;
    }
    
    if (searchParams.get('view') === 'signup') {
      setIsSignUp(true);
    }
  }, [searchParams]);

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      {/* Header Message */}
      <div className="text-center space-y-1 max-w-sm mx-auto">
        {!isSignUp ? (
          <>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Welcome back, builder.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed font-normal px-4">
              Log in to continue your quests and track your progress.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Stop overthinking and just start.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed font-normal px-4">
              You’re joining a group of tinkerers and doers who are tired of waiting for permission. No pitch decks and endless analysis, you will find and solve problems and sell it to real customers.
            </p>
          </>
        )}
      </div>

      {/* Asymmetrical Tab Selector */}
      <div className="flex border-b border-border/40 text-xs font-bold tracking-wider max-w-xs mx-auto">
        <button
          onClick={() => setIsSignUp(false)}
          className={`w-1/2 pb-3 text-center transition-all ${
            !isSignUp ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground opacity-60'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsSignUp(true)}
          className={`w-1/2 pb-3 text-center transition-all ${
            isSignUp ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground opacity-60'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Dynamic Client Switching Engine */}
      <div className="transition-all duration-300 ease-in-out">
        {!isSignUp ? <LoginCard /> : <SignupCard />}
      </div>
    </div>
  );
}
```

3. app/(onboarding)/layout.tsx
```tsx
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { NavigationHeader } from '@/components/layout/NavBar';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Suspense 
        fallback={
          <div className="flex flex-col items-center justify-center h-screen space-y-2 animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
              Loading Settings Node...
            </span>
          </div>
        }
      >
        <NavigationHeader variant="auth" />
        <main className="flex-1 flex items-center justify-center p-6">
          {children}
        </main>
      </Suspense>
    </div>
  );
}

```

4. app/(onboarding)/setup/page.tsx ( we dont need separate setup and payment page, we can have one checkout page)
```tsx
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
```
5. app/(onboarding)/payment/page.tsx
```tsx
'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle2, Loader2, Ticket, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { initializeCheckoutTransaction, completeCheckout, verifyDiscountCode } from '@/actions/payments';

interface OfferingData {
  id: string;
  title: string;
  prices: any;
}

interface AppliedDiscount {
  code: string;
  id: string;
  deductionAmount: number;
  finalPrice: number;
}

export default function PaywallPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Data State
  const [programOffering, setProgramOffering] = useState<OfferingData | null>(null);
  const [loadingPage, setLoadingPage] = useState(true);

  // Discount UI States
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('offerings')
          .select('id, title, prices')
          .eq('slug', 'program-enrollment')
          .eq('is_active', true)
          .maybeSingle();

        if (error || !data) {
          console.error("Product setup missing.");
          return;
        }
        setProgramOffering(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPage(false);
      }
    }
    fetchProduct();
  }, []);

  // Handle Promo Code Verification Check
  const handleApplyPromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim() || !programOffering) return;

    setIsVerifyingCode(true);
    setPromoError(null);

    try {
      const response = await verifyDiscountCode({
        code: promoCodeInput.trim(),
        offeringId: programOffering.id,
        currency: 'INR'
      });

      if (response.success) {
        setAppliedDiscount({
          code: promoCodeInput.trim().toUpperCase(),
          id: response.data.discount.id,
          deductionAmount: response.data.deductionAmount,
          finalPrice: response.data.finalPrice
        });
        setPromoCodeInput('');
        setShowPromoInput(false);
      } else {
        setPromoError(response.error);
      }
    } catch (err) {
      setPromoError("Could not verify code. Please try again.");
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // Remove Applied Promo Code
  const handleRemovePromo = () => {
    setAppliedDiscount(null);
    setPromoError(null);
  };

  // Checkout Execution Handler
  const handlePaymentSubmit = () => {
    if (!programOffering) return;

    startTransition(async () => {
      try {
        // Pass the optional coupon code to your initialization transaction builder
        const initResult = await initializeCheckoutTransaction({
          offeringId: programOffering.id,
          currency: 'INR',
          provider: appliedDiscount?.finalPrice === 0 ? 'internal_free_tier' : 'mock_stripe_sandbox',
          couponCode: appliedDiscount ? appliedDiscount.code : null
        });

        if (!initResult.success) {
          alert(initResult.error);
          return;
        }

        const completeResult = await completeCheckout({
          transactionId: initResult.data.transaction.id
        });

        if (!completeResult.success) {
          alert(completeResult.error);
          return;
        }

        router.push('/program');
        router.refresh();

      } catch (err) {
        console.error("Payment routing pipeline failed: ", err);
      }
    });
  };

  if (loadingPage) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2 animate-pulse h-64">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">Opening Checkout Portal...</span>
      </div>
    );
  }

  if (!programOffering) {
    return (
      <div className="text-center p-6 text-sm text-muted-foreground font-medium">
        ⚠️ Offering catalog item not found. Please verify your database rows.
      </div>
    );
  }

  // Base pricing calculations
  const basePriceINR = 8000;
  const standardDisplayPrice = appliedDiscount ? appliedDiscount.finalPrice : basePriceINR;

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in duration-200">

      <div className="text-center space-y-1">
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          Ready to jump in?
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed font-normal px-4">
          Once you complete your payment, you&rsquo;ll get instant access to the Urge Start dashboard so you can start working on your first quest right away.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-6">

        {/* Dynamic Pricing Layout Frame */}
        <div className="p-5 border border-border bg-muted/40 rounded-xl flex items-center justify-between text-xs relative overflow-hidden">
          <div className="space-y-0.5 text-left">
            <span className="font-bold text-foreground block">Urge Start Enrollment</span>
            <p className="text-[11px] text-muted-foreground font-medium">Includes 1 year of community membership</p>
          </div>
          <div className="text-right shrink-0">
            {appliedDiscount ? (
              <div className="flex flex-col items-end">
                <span className="text-xs text-muted-foreground line-through font-medium">₹{basePriceINR}</span>
                <span className="text-2xl font-serif font-black text-primary">
                  {standardDisplayPrice === 0 ? 'Free' : `Extra text ₹${standardDisplayPrice}`}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-end">
                <span className="text-2xl font-serif font-black text-primary">₹{basePriceINR}</span>
                <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-wider">One-time</span>
              </div>
            )}
          </div>
        </div>

        {/* Promo Code Input  */}
        <div className="space-y-2 border-t border-b border-border/40 py-4 text-xs">
          {!appliedDiscount ? (
            <div className="space-y-1.5">
              <label htmlFor="promoCode" className="text-muted-foreground font-semibold text-[11px] ml-1">
                Have a promo or student code?
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
                  <Input
                    id="promoCode"
                    type="text"
                    placeholder="e.g., EARLYTESTER"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="h-9 text-xs uppercase font-medium bg-background border-input rounded-xl pl-9"
                    disabled={isVerifyingCode}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleApplyPromoCode}
                  disabled={isVerifyingCode || !promoCodeInput.trim()}
                  className="h-9 px-4 rounded-xl text-xs font-semibold shrink-0 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                >
                  {isVerifyingCode ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                </Button>
              </div>
            </div>
          ) : (
            /* Applied Coupon Status Badge */
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-xl animate-in fade-in duration-150">
              <div className="flex items-center gap-2 font-medium text-[11px]">
                <Ticket className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                <span>Code <strong>{appliedDiscount.code}</strong> applied</span>
                <span className="bg-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold">
                  -₹{appliedDiscount.deductionAmount} OFF
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemovePromo}
                className="p-1 hover:bg-emerald-500/10 rounded-lg transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Real-time Inline Error Validation Feedback */}
          {promoError && (
            <p className="text-[11px] text-destructive font-medium mt-1 ml-1 animate-in fade-in duration-150">
              ⚠️ {promoError}
            </p>
          )}
        </div>

        {/* Clear Bullet Points */}
        <div className="text-left space-y-3 pt-1">
          {[
            "Full access to all program sprints and milestones",
            "A dedicated place to share your work and get feedback from other builders",
            "1 year of our annual network membership included for free (usually ₹4,000/yr)",
            "No boring video lectures—just action-oriented tasks to help you ship"
          ].map((text, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground font-medium leading-normal">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* Unified Submit Row */}
        <div className="pt-2 border-t border-border/40">
          <Button
            type="button"
            onClick={handlePaymentSubmit}
            disabled={isPending}
            className="w-full py-5 bg-primary hover:bg-primary/90 text-primary-foreground font-sans text-xs font-bold tracking-wider uppercase rounded-xl transition shadow-md shadow-primary/10 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Initializing secure checkout...</span>
              </>
            ) : (
              <span>
                {standardDisplayPrice === 0 ? 'Claim Free Access & Start Journey' : 'Pay Now & Start Your Journey'}
              </span>
            )}
          </Button>

          <p className="text-[11px] text-muted-foreground text-center mt-3 font-normal leading-normal px-2">
            Payments are safe, encrypted, and processed instantly.
          </p>
        </div>

      </div>
    </div>
  );
}

```

### Components
1. components/auth/LoginCard.tsx
```tsx
'use client';
// components/auth/LoginCard.tsx
import React, { useState } from 'react';
import { login } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export function LoginCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await login(formData);
    } catch (err: any) {
      setError(err?.message || "Invalid credentials provided.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="p-3 text-[11px] font-medium rounded-xl bg-destructive/10 border border-destructive/25 text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="login-email" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
            Email Address
          </Label>
          <Input
            id="login-email"
            name="email"
            type="email"
            disabled={loading}
            className="w-full bg-background border-border rounded-xl px-3 h-10 text-foreground"
            placeholder="name@domain.com"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="login-password" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
            Access Password
          </Label>
          <Input
            id="login-password"
            name="password"
            type="password"
            disabled={loading}
            className="w-full bg-background border-border rounded-xl px-3 h-10 text-foreground"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition uppercase tracking-wider text-xs shadow-md shadow-primary/10 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {loading ? 'Verifying Identity...' : 'Enter Workspace'}
          </Button>
        </div>
      </form>
    </div>
  );
}

```
2. components/auth/SignupCard.tsx
```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { checkUsernameAvailability, signup } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle, MailCheck } from 'lucide-react';

export function SignupCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSentTo, setEmailSentTo] = useState<string | null>(null); // New confirmation state flag

  const [username, setUsername] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'available' | 'taken'>('idle');

  useEffect(() => {
    if (username.trim().length < 3) {
      setUsernameStatus('idle');
      return;
    }

    setUsernameLoading(true);
    const timer = setTimeout(async () => {
      try {
        const isAvailable = await checkUsernameAvailability(username);
        setUsernameStatus(isAvailable ? 'available' : 'taken');
      } catch {
        setUsernameStatus('idle');
      } finally {
        setUsernameLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (usernameStatus === 'taken') {
      setError("Please choose a unique handle to continue.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const formEmail = formData.get('email') as string;
    
    const result = await signup(formData);

    if (result && 'error' in result) {
      setError(result.error ?? "An unexpected registration error occurred.");
      setLoading(false);
      return;
    }

    // ⚡ SUCCESS: Freeze form view and render the validation guidance block
    setEmailSentTo(formEmail);
    setLoading(false);
  };

  // ✉️ Clean, Conversational On-screen Verification Box
  if (emailSentTo) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 shadow-lg text-center space-y-5 animate-in fade-in duration-300">
        <div className="mx-auto w-12 h-12 rounded-full bg-[#E86A33]/5 flex items-center justify-center text-[#E86A33]">
          <MailCheck className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-serif font-bold text-foreground">Check your inbox.</h3>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium px-2">
            We just sent a verification link to <strong className="text-foreground">{emailSentTo}</strong>. 
            Click that link to verify your account, and we&rsquo;ll drop you straight into your profile setup.
          </p>
          <p className="text-[11px] text-[#8C8580] leading-relaxed pt-2 border-t border-border/40 font-medium italic">
            Can&rsquo;t find it? Give it a minute and check your <strong className="text-foreground font-semibold">spam folder</strong> just in case it got misrouted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-6 animate-in fade-in duration-200">
      {/* ... Form input blocks remain unchanged ... */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="p-3 text-[11px] font-medium rounded-xl bg-destructive/10 text-destructive">{error}</div>
        )}

        <div className="space-y-1.5 relative">
          <Label htmlFor="signup-username" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">Choose a Unique Handle</Label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-muted-foreground font-semibold text-xs select-none">@</span>
            <Input id="signup-username" name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))} required className="w-full pl-7" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-email" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">Email Address</Label>
          <Input id="signup-email" name="email" type="email" required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-password" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">Access Password</Label>
          <Input id="signup-password" name="password" type="password" required />
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={loading || usernameStatus === 'taken' || usernameLoading} className="w-full bg-[#E86A33] hover:bg-[#D35925] text-white">
            {loading ? 'Creating Account...' : 'Start Your Journey'}
          </Button>
        </div>
      </form>
    </div>
  );
}
```


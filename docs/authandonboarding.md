before I test out the program i want to look at our auth and onboarding again. I dont like the setup as it is now. We can turn login and register as separate components and have them inside one authetication page. languages seem a bit off. Remember the manifesto and design principles. let go over onboarding so that it feel welcoming and user have complete information of whats happening. Right now it feels very mechanical which is not what we should be going for. Have a look at the code and then lets brainstorm and after we have thought through it we will get to design. 

## things to consider

- better language and flow
- add newletter opt in , if user checks that then we should save that option somewhere maybe have a field is_subscribed_to_newsletter in profiles table?
- implement payments with offerings and discounts and mock payment service provider that we can switch to real one later

# Reference 
app/(auth)/login/page.tsx
```tsx
import Link from 'next/link';
import { login } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col justify-between p-4 sm:p-6 antialiased selection:bg-primary/30">
      
      {/* Dynamic Top Logo Track */}
      <header className="w-full max-w-md mx-auto text-center pt-8">
        <div className="text-2xl font-black tracking-wider text-foreground inline-flex items-center gap-2 font-mono">
          <span className="w-4 h-4 bg-primary rounded-sm animate-pulse"></span>PRAGMATIC_OS
        </div>
      </header>

      {/* Main Authenticative Form Box */}
      <Card className="w-full max-w-sm bg-card p-6 rounded-xl border border-border space-y-6 mx-auto shadow-2xl">
        
        {/* Tab Header Mode Indicators */}
        <div className="flex border-b border-border text-xs font-bold font-mono tracking-wider select-none">
          <div className="w-1/2 pb-3 text-center text-foreground border-b-2 border-primary">
            LOG_IN
          </div>
          <Link href="/signup" className="w-1/2 pb-3 text-center text-muted-foreground hover:text-foreground transition-colors">
            REGISTER_NODE
          </Link>
        </div>

        {/* Form Fields linking to authentication login action */}
        <form action={login} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 text-[11px] font-mono rounded bg-destructive/10 text-destructive border border-destructive/20">
              SYSTEM_ERROR // {error.toUpperCase()}
            </div>
          )}
          
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-muted-foreground font-bold font-mono uppercase tracking-wider text-[10px]">
              Identity Email Address
            </Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              className="w-full bg-background border border-border rounded px-3 py-2.5 font-mono focus-visible:ring-primary" 
              placeholder="name@domain.com"
              required 
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-muted-foreground font-bold font-mono uppercase tracking-wider text-[10px]">
                Secure Password Access Log
              </Label>
              <Link href="/forgot-password" className="text-[10px] text-muted-foreground hover:text-primary font-mono transition-colors">
                Forgot Key?
              </Link>
            </div>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              className="w-full bg-background border border-border rounded px-3 py-2.5 font-mono focus-visible:ring-primary" 
              placeholder="••••••••"
              required 
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded transition uppercase tracking-wider font-mono text-xs shadow-md shadow-primary/10">
              Authenticate Account
            </Button>
          </div>
        </form>
      </Card>

      {/* Minimal Footer Signature */}
      <footer className="w-full max-w-md mx-auto text-center pb-8 text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
        CORE_SYS_V1.6 // ALL PLATFORM ENTRIES SECURE
      </footer>
    </div>
  );
}

```
app/(auth)/signup/page.tsx
```tsx
import Link from 'next/link';
import { signup } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col justify-between p-4 sm:p-6 antialiased selection:bg-primary/30">
      
      {/* Top Logo Track */}
      <header className="w-full max-w-md mx-auto text-center pt-8">
        <div className="text-2xl font-black tracking-wider text-foreground inline-flex items-center gap-2 font-mono">
          <span className="w-4 h-4 bg-primary rounded-sm animate-pulse"></span>PRAGMATIC_OS
        </div>
      </header>

      {/* Main Registration Box */}
      <Card className="w-full max-w-sm bg-card p-6 rounded-xl border border-border space-y-6 mx-auto shadow-2xl">
        
        {/* Navigation Tab Toggles */}
        <div className="flex border-b border-border text-xs font-bold font-mono tracking-wider select-none">
          <Link href="/login" className="w-1/2 pb-3 text-center text-muted-foreground hover:text-foreground transition-colors">
            LOG_IN
          </Link>
          <div className="w-1/2 pb-3 text-center text-foreground border-b-2 border-primary">
            REGISTER_NODE
          </div>
        </div>

        {/* Form Content mapped directly to the signup server action */}
        <form action={signup} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 text-[11px] font-mono rounded bg-destructive/10 text-destructive border border-destructive/20">
              REGISTRY_ERROR // {error.toUpperCase()}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-muted-foreground font-bold font-mono uppercase tracking-wider text-[10px]">
              Founder Identity / Full Name
            </Label>
            <Input 
              id="fullName" 
              name="fullName" 
              type="text" 
              className="w-full bg-background border border-border rounded px-3 py-2.5 font-mono focus-visible:ring-primary text-foreground" 
              placeholder="e.g. Alara K."
              required 
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-muted-foreground font-bold font-mono uppercase tracking-wider text-[10px]">
              System Communication Email
            </Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              className="w-full bg-background border border-border rounded px-3 py-2.5 font-mono focus-visible:ring-primary text-foreground" 
              placeholder="name@domain.com"
              required 
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-muted-foreground font-bold font-mono uppercase tracking-wider text-[10px]">
              Assign Secure Access Passkey
            </Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              className="w-full bg-background border border-border rounded px-3 py-2.5 font-mono focus-visible:ring-primary text-foreground" 
              placeholder="••••••••"
              required 
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded transition uppercase tracking-wider font-mono text-xs shadow-md shadow-primary/10">
              Initialize Core Registry
            </Button>
          </div>
        </form>
      </Card>

      {/* Minimal Footer Signature */}
      <footer className="w-full max-w-md mx-auto text-center pb-8 text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
        CORE_SYS_V1.6 // ALL REGISTRY SECTORS OPEN
      </footer>
    </div>
  );
}
```
app/(onboarding)/setup/page.tsx
```tsx

import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

export default async function ProfileSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (!profile) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-foreground selection:bg-primary/30">
        
      {/* LEFT FIELD: LEDGER ACCOUNT STATS CARD */}
      <div className="space-y-6">
        <Card className="bg-card p-6 rounded-xl border border-border text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-background border-2 border-primary rounded-full flex items-center justify-center text-xl font-black font-mono tracking-tighter shadow-inner">
            {profile.full_name?.substring(0, 2).toUpperCase() || 'FN'}
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">{profile.full_name}</h2>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mt-0.5">FOUNDER_NODE: #{profile.id.substring(0, 4).toUpperCase()}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border font-mono text-xs">
            <div className="bg-background p-2 rounded border border-border/50">
              <span className="text-muted-foreground block text-[9px] font-bold tracking-widest uppercase">Classification</span>
              <span className="text-primary font-bold text-[11px] capitalize">{profile.role.replace('_', ' ')}</span>
            </div>
            <div className="bg-background p-2 rounded border border-border/50">
              <span className="text-muted-foreground block text-[9px] font-bold tracking-widest uppercase">Onboarding</span>
              <span className="text-foreground font-bold text-[11px]">Step 0{profile.onboarding_step}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* RIGHT FIELD: SECURE DATABASE SYSTEM PREFERENCES */}
      <Card className="md:col-span-2 bg-card p-6 rounded-xl border border-border space-y-6 shadow-xl">
        <div className="border-b border-border pb-3 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono">Identity Configuration</h2>
          <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary bg-primary/5">CORE_REGISTRY</Badge>
        </div>
        
        <form className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground font-bold font-mono uppercase tracking-wider text-[10px]">Founder Alias</Label>
              <Input type="text" className="w-full bg-background border border-border font-mono text-foreground focus-visible:ring-primary" defaultValue={profile.full_name || ''} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground font-bold font-mono uppercase tracking-wider text-[10px]">Unique Network Handle</Label>
              <Input type="text" className="w-full bg-background border border-border font-mono text-foreground focus-visible:ring-primary" defaultValue={`@${profile.username || ''}`} disabled />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground font-bold font-mono uppercase tracking-wider text-[10px]">Operational City</Label>
              <Input type="text" className="w-full bg-background border border-border font-mono text-foreground focus-visible:ring-primary" defaultValue={profile.city || ''} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground font-bold font-mono uppercase tracking-wider text-[10px]">Country Region</Label>
              <Input type="text" className="w-full bg-background border border-border font-mono text-foreground focus-visible:ring-primary" defaultValue={profile.country || ''} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-muted-foreground font-bold font-mono uppercase tracking-wider text-[10px]">Ecosystem Biography Matrix</Label>
            <Textarea className="w-full bg-background border border-border font-mono text-foreground focus-visible:ring-primary min-h-[80px]" defaultValue={profile.description || ''} />
          </div>

          {/* TELEMETRY SETTINGS SECTIONS */}
          <div className="pt-4 border-t border-border space-y-3">
            <h3 className="text-[10px] font-bold font-mono uppercase tracking-widest text-muted-foreground">Ecosystem Diagnostics</h3>
            <div className="flex items-center justify-between bg-background p-3 rounded border border-border">
              <div className="space-y-0.5">
                <span className="text-foreground font-bold block text-xs">Active Accountability Subscriptions</span>
                <span className="text-muted-foreground text-[10px] font-mono">Allows background routing logic to track event deadlines.</span>
              </div>
              <input type="checkbox" defaultChecked className="accent-primary h-4 w-4 cursor-pointer" />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded transition font-mono text-xs uppercase tracking-wider shadow-md shadow-primary/10">
              Save Node Matrix
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
```

app/(onboarding)/payment/page.tsx
```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function PaywallPage() {
  async function handleSimulatedPayment() {
    'use server';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Simulate complete billing handshake -> Elevate PostgreSQL role directly to member_full
    await supabase
      .from('profiles')
      .update({ role: 'member_full' })
      .eq('id', user.id);

    redirect('/platform/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-muted/30">
      <Card className="w-full max-w-md shadow-xl border-primary/20 border-2">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary h-12 w-12 rounded-full flex items-center justify-center mb-2">
            <Zap className="h-6 w-6" />
          </div>
          <CardTitle className="text-3xl font-black tracking-tight">Unlock Your Path</CardTitle>
          <CardDescription>
            Gain instant access to real-time goals, community forums, action quests, and vetted mentors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between font-medium">
              <span>Full Program & Ecosystem Access</span>
              <span className="text-primary">$49 / mo</span>
            </div>
            <p className="text-xs text-muted-foreground">Cancel anytime. No validation presentations required. Just real action pipelines.</p>
          </div>
          <ul className="text-xs text-muted-foreground space-y-2">
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Comprehensive Goal-based Action Tracks</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Goal-linked Peer Forums</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> On-Demand Mentorship Networks</li>
          </ul>
        </CardContent>
        <CardFooter>
          <form action={handleSimulatedPayment} className="w-full">
            <Button type="submit" className="w-full size-lg text-base font-bold">
              Simulate Secure Stripe Checkout
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
```



## Database Schema
database types
```ts
Tables: {
      discounts: {
        Row: {
          applicable_currencies: string[]
          code: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          min_order_amount_inr: number
          starts_at: string
          type: Database["public"]["Enums"]["discount_type"]
          updated_at: string
          uses_count: number
          value: number
        }
        Insert: {
          applicable_currencies?: string[]
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_order_amount_inr?: number
          starts_at?: string
          type: Database["public"]["Enums"]["discount_type"]
          updated_at?: string
          uses_count?: number
          value: number
        }
        Update: {
          applicable_currencies?: string[]
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_order_amount_inr?: number
          starts_at?: string
          type?: Database["public"]["Enums"]["discount_type"]
          updated_at?: string
          uses_count?: number
          value?: number
        }
        Relationships: []
      }
      newsletters: {
        Row: {
          content: string
          created_at: string
          id: string
          scheduled_for: string | null
          sent_at: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      offerings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          metadata_config: Json
          prices: Json
          slug: string
          title: string
          type: Database["public"]["Enums"]["offering_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          metadata_config?: Json
          prices?: Json
          slug: string
          title: string
          type: Database["public"]["Enums"]["offering_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          metadata_config?: Json
          prices?: Json
          slug?: string
          title?: string
          type?: Database["public"]["Enums"]["offering_type"]
          updated_at?: string
        }
        Relationships: []
      }
      
      profiles: {
        Row: {
          accumulated_xp: number
          address: string | null
          age_group: Database["public"]["Enums"]["user_age_group"] | null
          avatar_url: string | null
          capital_available_local: number
          city: string | null
          constraints: Json
          core_driver: Json | null
          country: string
          currency: string
          description: string | null
          full_name: string | null
          highest_education:
            | Database["public"]["Enums"]["education_tier"]
            | null
          id: string
          mentor_metadata: Json
          onboarding_step: number
          provider_metadata: Json
          role: Database["public"]["Enums"]["user_platform_role"]
          social_profiles: Json
          updated_at: string
          username: string
        }
        Insert: {
          accumulated_xp?: number
          address?: string | null
          age_group?: Database["public"]["Enums"]["user_age_group"] | null
          avatar_url?: string | null
          capital_available_local?: number
          city?: string | null
          constraints?: Json
          core_driver?: Json | null
          country: string
          currency?: string
          description?: string | null
          full_name?: string | null
          highest_education?:
            | Database["public"]["Enums"]["education_tier"]
            | null
          id: string
          mentor_metadata?: Json
          onboarding_step?: number
          provider_metadata?: Json
          role?: Database["public"]["Enums"]["user_platform_role"]
          social_profiles?: Json
          updated_at?: string
          username: string
        }
        Update: {
          accumulated_xp?: number
          address?: string | null
          age_group?: Database["public"]["Enums"]["user_age_group"] | null
          avatar_url?: string | null
          capital_available_local?: number
          city?: string | null
          constraints?: Json
          core_driver?: Json | null
          country?: string
          currency?: string
          description?: string | null
          full_name?: string | null
          highest_education?:
            | Database["public"]["Enums"]["education_tier"]
            | null
          id?: string
          mentor_metadata?: Json
          onboarding_step?: number
          provider_metadata?: Json
          role?: Database["public"]["Enums"]["user_platform_role"]
          social_profiles?: Json
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      ,
      transactions: {
        Row: {
          amount_paid: number
          created_at: string
          currency: string
          discount_id: string | null
          id: string
          offering_id: string
          provider: string
          provider_order_id: string
          provider_payment_id: string | null
          raw_webhook_payload: Json
          status: Database["public"]["Enums"]["transaction_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_paid: number
          created_at?: string
          currency?: string
          discount_id?: string | null
          id?: string
          offering_id: string
          provider: string
          provider_order_id: string
          provider_payment_id?: string | null
          raw_webhook_payload?: Json
          status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_paid?: number
          created_at?: string
          currency?: string
          discount_id?: string | null
          id?: string
          offering_id?: string
          provider?: string
          provider_order_id?: string
          provider_payment_id?: string | null
          raw_webhook_payload?: Json
          status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_transactions_discount"
            columns: ["discount_id"]
            isOneToOne: false
            referencedRelation: "discounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_transactions_offering"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "offerings"
            referencedColumns: ["id"]
          },
        ]
      }
     
      
      
    }

```

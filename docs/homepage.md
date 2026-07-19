# Urge Homepage , navigation and footer Design and Content

## Tasks
- Brainstorm content and UI/UX for hoempage. Follow the vision and Communication approach below
- Fix sidebar and navigation with right links (use right links from Features and app routes section)
- use current style, global.css and patterns from sample code. 
- first give me ideas before implementing code
- Ask me any files you need to refer

## Urge Context
I am developing an web app for first time entrepreneur called "urge". App aim to demystify entrepreneurship and make it more pragmatic and approchable. First time entrepreneurs find it very difficult to succeed today because of the reasons below.

### Reasons People Fails to start a business
- Interia: Difficulty in even getting started
- Analysis Paralysis: Information overload and belief that they need to have all their plan perfect
- Mindset: Hesitation to ask people, and fear of rejection stops most from going out of their comfort zone
- Knowhow: There is lots of information, guides but knowing how and when to do what is quite subjective
- Unreal goals
- venture capital and investment trap: everyone seems to be trying to build what venture caps want to fund

### How Urge Aims to solve this
- First Principles of business: Urge on purpose tries to focus on things that matter and look at everything from first-principles. No matter what users are hoping to build be it a next social network or a local cake business.
- No jargon, gate-keeping: Simple language, simple structure.
- Mindset First: Emphasis on building mindset through real world challenges, which gives users first taste of stepping out the comfort zone by asking people and handling rejection.
- Built for action: Urge takes away all the parts which gets users in a analysis mess. keep them focossed through simple tasks in sequence without worrying too much about what will comes next.
- Structured Program: urge program is structured as mission (larger goals) and quests (single focus objectives), they are designed to be practical, approachable and action oriented. mission are sequential as one would approach a business and make users build their business as they go through the peogram (refer to playbook)  
- Commitment Device: Urge makes users find a cheer squad who follow their progress and hold them accountable
- Network: Network of future founders, mentors, industry experts that will help users solve problems, find collaborators and expertise they can leverage.
    - find collaborators
    - test their products internally before public launch
    - find help and support
    - find solutions and expertise tailored for startup for hire
- Marketplace: This two distinct purpose
    1. place for users to launch their product and services internally before launching to public. this give them chance to gain some early customers, validate and test.
    2. a place for providers to list products for founders (custom/tailored offering which works for people starting their business). 
- Events :
    1. Program related events related to missions
    2. Public events
    3. pop-up sales
    4. Frequently standups

### big questions we have worked hard to answer/solve
- How to make things simple and approachable?
- How to keep it real?
- how to make something that actually gets users to build something rather than know about it?
- How not to end up becoming an online course?
- How to design data and ui to minimize the unnecessary cognitive load
- How to make it apparoachable and fun?
- Will we ourselves use this framework/program for our next business?

### Monetisation
- Program enrollment fees (includes one year of network membership)
- Yearly network membership fees (same for users, mentors, providers)
- Urge will not take commissions from marketplace listings but will have a vetting process for listings. 

### The Urge Manifesto

**We reject the myth of the "overnight success."**

We reject the idea that a business is built for an exit, not for a customer. We are turning our backs on the venture capital circus, where the product is a pitch deck and the metric is hype. We believe that business, at its core, is profoundly human.

**We are returning to the fundamentals.**

We believe a business is a simple, beautiful equation: **Solve a real problem, for a real person, and get paid for it.**

We are the anti-thesis of the "solution in search of a problem." We don't fall in love with our ideas; we fall in love with the problems our customers have. We start not with a brilliant flash of inspiration, but with a quiet act of observation. We seek friction, frustration, and despair, because within them lie the seeds of the greatest opportunities.

**We are builders, not visionaries.**

We believe in the **Minimum Sellable Product (MSP)** over the Minimum Viable Product. We don't build to "validate" for investors. We build to sell. We don't test for "traction"; we test for trust. Our only true investors are our customers, and their currency is their time, their money, and their loyalty.

**We are doers, not analysts.**

Analysis paralysis is the silent killer of dreams. We trade endless spreadsheets for a single, focused experiment. We understand that the market is a living thing, not a theory to be proven. It speaks to those who are willing to listen—and the best way to listen is to act.

**We believe the journey starts from within.**

Before you can build a product, you must build a mindset. You need the right fuel. Money is not the fuel for a startup; it is the reward for a job well done. The true fuel is a deep, intrinsic urge: the urge to solve, to serve, and to build something of genuine value.

**Urge is not just an app. It is a compass.**

It’s for the pragmatist. The tinkerer. The person who is tired of waiting for permission and ready to just **start**. We don't offer a quick fix. We offer a clear path. We turn the overwhelming chaos of a startup into a series of simple, human-sized quests. We strip away the noise and bring you back to what matters: the customer, the problem, and the next action.

**This is a rebellion. Not against success, but against the hollow pursuit of it.**

We are here to make business approachable, enjoyable, pragmatic, and action-driven. We are here to help you build something that matters.


## Features and app routes
- app/(marketing): no auth needed open to all
    - app/(marketing)/page.tsx - Main homepage
    - app/(marketing)/blog - Open blog pages
    - app/(marketing)/feeds - public feeds from users (content/ launches, events etc)
    - app/(marketing)/open-events - Events open to public
    - app/(marketing)/code-of-conduct
    - app/(marketing)/privacy
- app/(platform): Authenticated user area
    - app/(platform)/checkout - payments
    - app/(platform)/dashboard - main dashboard for all registered users
    - app/(platform)/events - events
    - app/(platform)/marketplace - listing of products and services for users such as packages, legal, marketing, infrastructures etc
    - app/(platform)/mentors - official mentors
    - app/(platform)/network - network main page
    - app/(platform)/program - core program that will guide users through their journey to build businesses. Its designed as simple approachable missions and quests. Mission sets up the broad goal while quests through embedded tasks complete singural objectives towards the goal
        - app/(platform)/program/page.tsx - program dashboard
        - app/(platform)/program/mission/[id]/page.tsx - mission detail page
        - app/(platform)/program/quest/[slug]/page.tsx - quest details page with task components
- app/auth - authentication pages
    - app/auth/page.tsx -> main authentication page with login and signup components
    - app/auth/forgot-password


## Notes for Homepage

### Style
- use global.css as base theme
- keep design and content minimal, bold and persuasive
- Use patterns from  pages and componet code added below for reference

### Content
- Refrain from using big jargon and complicated language
- language should as one speak to a friend
- Dont use any silicon valley jargon, sass terms and language and bro-code 
- Persuasion and Effective Marketing: Framing and language that accentuates behaviour
    - Loss Aversion : Talk about how users should start now instead of waiting for right time, idea or opportunity. something that echoes "Are you more scared of failure, or not knowing how wildly successful your life could've been?"
    - Anchoring: Anchor the message in their lives which they trying to get out of Daily grind, unsure future, changing world and economy, feeling trapped etc 
    - The peak-end rule: Paint a picture of following - Having freedom and autonomy, fufillment of doing something tey care about, having money and choices
    - Visible effort: Illustrate how we have struggled to solve big problems mentioned about and what we belive and stand for. Its not a fad/trends. We are in it with the user for the long haul. And everyone to give this a go
    - Distinctiveness: Talk about whats distinctive about our approach. 
    - Social Proof: We should imply it rather than claim it ( this we dont need for this version but lets think of idea)


## Reference files
- playbook and mission: program content that will be rendered in program pages missions and quests
- global.css
- main layout file

### Main homepage to be updated

app/(marketing)/page.tsx -- use this also for some base style pattern but we have to change it radically 
```tsx
// app/(marketing)/page.tsx -- homepage
import Link from 'next/link';
import { NavigationHeader } from '@/components/layout/NavBar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Compass, Radio, Target, Zap } from 'lucide-react';

export default function PragmaticHomepage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/30 flex flex-col font-sans">
      
      {/* Re-mounted Original Navigation Header */}
      <NavigationHeader />

      {/* Hero Sector Layout */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-card px-3 py-1 rounded-full border border-border text-[10px] sm:text-xs font-mono text-primary font-bold tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-sm shadow-primary"></span>
          For people who keep thinking about starting something
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight max-w-3xl mx-auto leading-tight sm:leading-none font-heading">
          How many times have you <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
            almost started?
          </span>
        </h1>
        
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal">
          You've had the idea. You've made the notes app. You've watched the videos. Urge is the place that finally turns &ldquo;someday&rdquo; into a Tuesday.
        </p>
        
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button className="px-8 py-6 font-mono text-xs font-bold tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10 w-full sm:w-auto">
            <Link href="/signup">Start Building</Link>
          </Button>
          <Button variant="outline" className="px-6 py-6 font-mono text-xs font-bold tracking-wider uppercase border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground w-full sm:w-auto">
            <Link href="/signup">Try Quest 1 Free</Link>
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6">
        <Separator className="bg-border/60" />
      </div>

      {/* 2. THE HONEST PART */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-5 gap-8 items-start w-full">
        <div className="md:col-span-2 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono">
            Internal Monologue
          </h2>
          <h3 className="text-xl font-extrabold text-foreground tracking-tight">
            It's not that you don't have ideas.
          </h3>
        </div>
        <div className="md:col-span-3 space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <p>
            You've got plenty. What's actually stopping you isn't a lack of information — there's more startup advice online than any person could read in a lifetime. It's everything underneath that:
          </p>
          <ul className="space-y-2.5 font-mono text-[11px] text-foreground pl-1">
            <li className="flex items-start gap-2 text-destructive">
              <span>//</span> <span>You don't know where to actually start</span>
            </li>
            <li className="flex items-start gap-2 text-destructive">
              <span>//</span> <span>You think your plan needs to be perfect before you move</span>
            </li>
            <li className="flex items-start gap-2 text-destructive">
              <span>//</span> <span>Asking for help feels like admitting you don't know what you're doing</span>
            </li>
            <li className="flex items-start gap-2 text-destructive">
              <span>//</span> <span>Every &ldquo;guide&rdquo; tells you something different, and none of them tell you when</span>
            </li>
          </ul>
          <p className="pt-2">
            None of that gets fixed by another podcast episode. It gets fixed by doing one small, slightly uncomfortable thing, on purpose, with someone watching your back. That's what Urge is built around.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6">
        <Separator className="bg-border/60" />
      </div>

      {/* 3 & 4. CURRICULUM OVERVIEW AND PREVIEW CARDS */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-8 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono">
            Program Architecture
          </h2>
          <span className="text-[10px] text-muted-foreground font-mono">Not a course. A program you move through.</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Mission Block 1 */}
          <Card className="bg-card p-6 rounded-xl border border-border space-y-4 shadow-xl relative overflow-hidden group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-xs font-mono text-primary font-bold tracking-wider">MISSION_01</div>
              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                <Target className="h-4 w-4" /> Build Your Founder Mindset
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Before we look at business opportunities, we look at you. Deal with overthinking, get honest about your hours, and practice asking for support.
              </p>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono pt-4 border-t border-border/40 mt-4">
              Quest 1 Free • No Card Needed
            </div>
          </Card>

          {/* Mission Block 2 */}
          <Card className="bg-card p-6 rounded-xl border border-border space-y-4 shadow-xl relative overflow-hidden group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-xs font-mono text-primary font-bold tracking-wider">MISSION_02</div>
              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                <Radio className="h-4 w-4" /> Talk to Real Humans
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Skip the surveys. Get direct feedback, share your unpolished drafts out loud, and find out if someone actually wants what you're making.
              </p>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono pt-4 border-t border-border/40 mt-4">
              5 Quests • Real-world Validation
            </div>
          </Card>

          {/* Mission Block 3 */}
          <Card className="bg-card p-6 rounded-xl border border-border space-y-4 shadow-xl relative overflow-hidden group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-xs font-mono text-primary font-bold tracking-wider">MISSION_03</div>
              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                <Compass className="h-4 w-4" /> Test for Real Trust
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                No spreadsheets or 40-page plans. Build a simple landing layout with a payment button. Solve a real problem, for a real person, and get paid for it.
              </p>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono pt-4 border-t border-border/40 mt-4">
              4 Quests • Live Checkout Integration
            </div>
          </Card>

        </div>

        {/* 5. THE ASSISTANT AND ACCOUNTABILITY BLOCK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <Card className="bg-card border border-border rounded-xl p-6 space-y-3">
            <h4 className="text-xs font-bold font-mono text-primary uppercase tracking-wider">// PLATFORM_ASSISTANT</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A quiet assistant sits behind every task as you go. It pulls the right resource for what you're working on, sums up anything long into something you can read in ten seconds, and hands you an easier version of the task if you're stuck. It's there to clear the path, not to talk at you.
            </p>
          </Card>

          <Card className="bg-card border border-border rounded-xl p-6 space-y-3">
            <h4 className="text-xs font-bold font-mono text-primary uppercase tracking-wider">// ACCOUNTABILITY_CORE</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Nobody builds alone. Urge has you find your cheer squad: a small group of people who follow your progress and expect to hear from you. This isn't a forum you'll forget to check—it's a handful of people who know your mission and are quietly rooting for you to hit the next quest.
            </p>
          </Card>
        </div>
      </main>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6">
        <Separator className="bg-border/60" />
      </div>

      {/* 6. FINAL CLOSING CTA SECTOR */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-heading">
            You don't need a perfect plan. <br />You need a next action.
          </h2>
          <p className="text-xs text-muted-foreground font-mono max-w-sm mx-auto leading-relaxed">
            Quest 1 of Mission 1 is free. No pitch, no card, no 6-week onboarding. Just the first honest step.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <Button className="px-8 py-6 font-mono text-xs font-bold tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg w-full sm:w-auto shrink-0">
            <Link href="/signup">Initialize Quest 1</Link>
          </Button>
          <Button variant="outline" className="px-6 py-6 font-mono text-xs font-bold tracking-wider uppercase border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground w-full sm:w-auto">
            <Link href="/checkout/full-access-membership">Enroll In Program</Link>
          </Button>
        </div>

        <div className="pt-2 text-center">
          <Link href="/signup?optin=newsletter" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary font-mono transition-colors group">
            Not ready yet? Get one real idea a week, no fluff 
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Original Core Minimalist Footer */}
      <footer className="w-full max-w-5xl mx-auto border-t border-border/40 px-4 sm:px-6 py-8 mt-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
        <span>THE_URGE_SYS // DISRUPT_THE_THEATER</span>
        <span className="flex items-center gap-1.5">
          <Zap className="h-3 w-3 text-primary animate-pulse" /> CLUSTER_STATUS: ONLINE
        </span>
      </footer>

    </div>
  );
}
```

app/layout.tsx
```tsx

// app/layout.tsx

import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AuthStoreProvider } from "@/components/providers/auth-store-provider"
import { cn } from "@/lib/utils"
import { Geist, Geist_Mono, Roboto } from "next/font/google"

const robotoHeading = Roboto({ 
  subsets: ['latin'], 
  weight: ['400', '700', '900'],
  variable: '--font-heading' 
})

const geist = Geist({ 
  subsets: ['latin'], 
  variable: '--font-sans' 
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(fontMono.variable, geist.variable, robotoHeading.variable)}
    >
      <body className="font-sans antialiased bg-background text-foreground selection:bg-primary/30">
        <ThemeProvider>
          <AuthStoreProvider>
            {children}
          </AuthStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

```

### Platform Sidebase component

app/(platform)/layout.tsx
```tsx
// app/(platform)/layout.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { StoreHydrator } from '@/components/providers/StoreHydrator';
import { SidebarComponent } from '@/components/layout/Sidebar'; 
import { KipSidebarCompanion } from '@/components/program/kip/KipSidebarCompanion';

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const [profileResponse, progressResponse] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('user_progress').select('*').eq('user_id', user.id)
  ]);

  return (
    <div className="w-full h-screen flex bg-background text-foreground antialiased overflow-hidden relative">
      <StoreHydrator 
        initialProgress={(progressResponse.data as any) || []} 
        initialProfile={profileResponse.data as any} 
      />

      <SidebarComponent />

      {/* CENTER AREA: Takes 100% of the screen space on mobile/tablets, then centers out nicely on desktop */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col min-w-0 pt-14 md:pt-0">
        <main className="flex-1 p-5 md:p-10 max-w-4xl w-full mx-auto pb-24">
          {children}
        </main>
      </div>

      {/* RIGHT AREA: Handles desktop columns, floating tabs, and bottom sheet triggers automatically */}
      <KipSidebarCompanion />
    </div>
  );
}

```

components/layout/Sidebar.tsx
```tsx
// components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { $profileStore } from '@/lib/stores/profileStore';
import { logout } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Compass,
  Layers,
  Users,
  Calendar,
  ShoppingBag,
  LogOut,
  UserSquare2,
  Sun,
  Moon,
  Menu
} from 'lucide-react';

/* ─── DYNAMIC NAV LINKS MODULE ─── */
function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const profile = useStore($profileStore);
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex flex-col justify-between h-full w-full bg-card p-5 text-foreground">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="space-y-0.5 py-1 px-1">
          <span className="text-[10px] font-sans font-bold text-primary uppercase tracking-widest block">Workspace</span>
          <p className="text-sm font-serif font-black tracking-tight">Urge Start</p>
        </div>

        <Separator className="opacity-60" />

        {/* Link Tree Items */}
        <nav className="space-y-1 font-sans text-xs font-semibold tracking-normal">
          <Link
            href="/platform/dashboard"
            onClick={onNavigate}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition group border ${isActive('/platform/dashboard') ? 'bg-primary/5 text-primary border-primary/20 shadow-sm' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
          >
            <span className="flex items-center gap-3"><Layers className="h-4 w-4 shrink-0" /> Dashboard</span>
            <span className="text-[11px] opacity-0 group-hover:opacity-100 text-primary pr-1">→</span>
          </Link>

          {profile?.roles?.includes('member') && (
            <Link
              href="/platform/program"
              onClick={onNavigate}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition group border ${isActive('/platform/program') ? 'bg-primary/5 text-primary border-primary/20 shadow-sm' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
            >
              <span className="flex items-center gap-3"><Compass className="h-4 w-4 shrink-0" /> Program Track</span>
              <span className="bg-primary/10 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded-md">Active</span>
            </Link>
          )}

          <Link
            href="/platform/network"
            onClick={onNavigate}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition group border ${isActive('/platform/network') ? 'bg-primary/5 text-primary border-primary/20 shadow-sm' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
          >
            <span className="flex items-center gap-3"><Users className="h-4 w-4 shrink-0" /> Peer Network</span>
          </Link>

          <Link
            href="/platform/events"
            onClick={onNavigate}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition group border ${isActive('/platform/events') ? 'bg-primary/5 text-primary border-primary/20 shadow-sm' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
          >
            <span className="flex items-center gap-3"><Calendar className="h-4 w-4 shrink-0" /> Live Sprints</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0 mr-1"></span>
          </Link>

          <Link
            href="/platform/mentors"
            onClick={onNavigate}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition group border ${isActive('/platform/mentors') ? 'bg-primary/5 text-primary border-primary/20 shadow-sm' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
          >
            {/* ⚡ FIXED: Stripped out the rogue m-0 property completely */}
            <span className="flex items-center gap-3"><UserSquare2 className="h-4 w-4 shrink-0" /> Industry Advisors</span>
          </Link>

          <Link
            href="/platform/marketplace"
            onClick={onNavigate}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition group border ${isActive('/platform/marketplace') ? 'bg-primary/5 text-primary border-primary/20 shadow-sm' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
          >
            <span className="flex items-center gap-3"><ShoppingBag className="h-4 w-4 shrink-0" /> Perks & Solutions</span>
          </Link>
        </nav>
      </div>

      {/* Profile/Footer Area */}
      <div className="space-y-3 pt-4 border-t border-border">
        {mounted && (
          <div className="flex items-center justify-between bg-muted/40 p-2 rounded-xl border border-border/40 text-xs text-muted-foreground font-medium px-3">
            <span>Interface Mode</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {resolvedTheme === 'dark' ? <Sun className="h-3.5 w-3.5 text-primary" /> : <Moon className="h-3.5 w-3.5" />}
            </Button>
          </div>
        )}

        {profile && (
          <Link
            href={`/platform/profile/${profile.id}`}
            onClick={onNavigate}
            className="block p-3 bg-muted/20 hover:bg-muted/50 rounded-xl space-y-1.5 border border-border/40 group transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold truncate tracking-tight text-foreground group-hover:text-primary transition-colors">
                {profile.full_name || 'Anonymous Builder'}
              </span>
              <span className="text-[10px] text-muted-foreground font-serif">⚙</span>
            </div>
          </Link>
        )}

        <form action={logout} className="w-full">
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive font-sans text-xs font-semibold h-10 hover:bg-destructive/5 rounded-xl transition-all"
          >
            <LogOut className="h-4 w-4" /> Disconnect Account
          </Button>
        </form>
      </div>
    </div>
  );
}

/* ─── MAIN MASTER WRAPPER VIEW ─── */
export function SidebarComponent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* DESKTOP SIDEBAR: Sticky, standard view for screens md and wider */}
      <aside className="hidden md:flex w-64 h-full border-r border-border flex-col select-none shrink-0 overflow-hidden">
        <SidebarContent />
      </aside>

      {/* MOBILE TRIGGER HEADER: Displays on viewports under md, adding a sleek navigation bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-40 flex items-center justify-between px-4 select-none">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          {/* Base UI standard layout trigger configuration */}
          <SheetTrigger className="inline-flex items-center justify-center p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer focus-visible:outline-none">
            <Menu className="w-5 h-5" />
          </SheetTrigger>

          <SheetContent side="left" className="w-64 p-0 bg-card border-r border-border h-full flex flex-col">
            <SidebarContent onNavigate={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        <span className="text-xs font-serif font-black tracking-wider uppercase text-foreground">
          Urge Start
        </span>

        <div className="w-9 h-9" /> {/* Visual Balance Spacing Weight */}
      </div>
    </>
  );
}

```

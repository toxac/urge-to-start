import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Target, Users, Compass, Zap } from 'lucide-react';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/30 flex flex-col">
      {/* Hero */}
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
            <Link href="/auth">Start Building</Link>
          </Button>
          <Button variant="outline" className="px-6 py-6 font-mono text-xs font-bold tracking-wider uppercase border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground w-full sm:w-auto">
            <Link href="/auth">Try Quest 1 Free</Link>
          </Button>
        </div>
      </header>

      <Separator className="max-w-5xl mx-auto bg-border/60" />

      {/* The Honest Truth */}
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

      <Separator className="max-w-5xl mx-auto bg-border/60" />

      {/* How We're Different */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 w-full">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono mb-2">// MANIFESTO</h2>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            We reject the myth of the overnight success. We're returning to the fundamentals.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card p-6 border border-border rounded-xl space-y-3">
            <div className="text-destructive font-mono text-xs font-bold">✕ Unicorn hype</div>
            <div className="text-primary font-mono text-xs font-bold">✓ Solve a real problem</div>
            <p className="text-xs text-muted-foreground">Not every business needs to be a billion-dollar exit. Start with something people actually need.</p>
          </Card>
          <Card className="bg-card p-6 border border-border rounded-xl space-y-3">
            <div className="text-destructive font-mono text-xs font-bold">✕ Build to pitch</div>
            <div className="text-primary font-mono text-xs font-bold">✓ Build to sell</div>
            <p className="text-xs text-muted-foreground">Your only true investors are your customers. Their currency is their time, money, and trust.</p>
          </Card>
          <Card className="bg-card p-6 border border-border rounded-xl space-y-3">
            <div className="text-destructive font-mono text-xs font-bold">✕ Perfect plans</div>
            <div className="text-primary font-mono text-xs font-bold">✓ Real market validation</div>
            <p className="text-xs text-muted-foreground">Skip the spreadsheets. Talk to real people. Build something they'll pay for.</p>
          </Card>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto bg-border/60" />

      {/* Program Preview */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono">
            Program Architecture
          </h2>
          <span className="text-[10px] text-muted-foreground font-mono">Not a course. A program you move through.</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          <Card className="bg-card p-6 rounded-xl border border-border space-y-4 shadow-xl relative overflow-hidden group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-xs font-mono text-primary font-bold tracking-wider">MISSION_02</div>
              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                <Compass className="h-4 w-4" /> Find Problems Worth Solving
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Start with your own frustrations, then talk to real people. Build a list of real problems that are worth solving.
              </p>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono pt-4 border-t border-border/40 mt-4">
              4 Quests • Real-world Research
            </div>
          </Card>

          <Card className="bg-card p-6 rounded-xl border border-border space-y-4 shadow-xl relative overflow-hidden group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-xs font-mono text-primary font-bold tracking-wider">MISSION_03</div>
              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                <Users className="h-4 w-4" /> Project Viability
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Talk to customers, understand the competition, and define your Minimum Sellable Product. Make sure it actually makes sense.
              </p>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono pt-4 border-t border-border/40 mt-4">
              5 Quests • Customer Validation
            </div>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" className="font-mono text-xs">
            <Link href="/how-it-works/program">Explore the full program →</Link>
          </Button>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto bg-border/60" />

      {/* Support System */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card border border-border rounded-xl p-6 space-y-3">
            <h4 className="text-xs font-bold font-mono text-primary uppercase tracking-wider">// ACCOUNTABILITY_CORE</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Nobody builds alone. Urge has you find your cheer squad: a small group of people who follow your progress and expect to hear from you. This isn't a forum you'll forget to check—it's a handful of people who know your mission and are quietly rooting for you to hit the next quest.
            </p>
          </Card>
          <Card className="bg-card border border-border rounded-xl p-6 space-y-3">
            <h4 className="text-xs font-bold font-mono text-primary uppercase tracking-wider">// NETWORK_ACCESS</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Other founders going through the same thing. Industry folks who actually know things. A place to test your product before you launch. All inside a supportive, no‑ego community.
            </p>
          </Card>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto bg-border/60" />

      {/* Social Proof */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
        <p className="text-xs text-muted-foreground font-mono">
          Join <span className="text-foreground font-bold">200+</span> founders already building their first business.
        </p>
      </div>

      <Separator className="max-w-5xl mx-auto bg-border/60" />

      {/* Final CTA */}
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
            <Link href="/auth">Initialize Quest 1</Link>
          </Button>
          <Button variant="outline" className="px-6 py-6 font-mono text-xs font-bold tracking-wider uppercase border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground w-full sm:w-auto">
            <Link href="/checkout/full-access-membership">Enroll In Program</Link>
          </Button>
        </div>

        <div className="pt-2 text-center">
          <Link href="/auth?optin=newsletter" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary font-mono transition-colors group">
            Not ready yet? Get one real idea a week, no fluff
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
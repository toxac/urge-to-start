import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Target, Users, Compass, Zap, Shield, Sparkles } from 'lucide-react';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-background">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            For people who keep thinking about starting something
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-foreground leading-[1.1] max-w-4xl mx-auto">
            How many times have you{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400/90">
              almost started?
            </span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            You've had the idea. You've made the notes. You've watched the videos.
            <br className="hidden sm:block" />
            Urge is the place that finally turns "someday" into a Tuesday.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8 py-6 text-sm font-semibold rounded-xl shadow-lg shadow-primary/20">
              <Link href="/auth">Start Building</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-sm font-semibold rounded-xl">
              <Link href="/auth">Try Quest 1 Free</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            No card required. No commitment.
          </p>
        </div>
      </section>

      {/* THE REAL REASON */}
      <section className="border-t border-border/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                The real reason
              </h2>
              <p className="text-3xl font-bold tracking-tight text-foreground">
                It's not that you don't have ideas.
              </p>
            </div>
            <div className="md:col-span-3 space-y-6 text-base text-muted-foreground leading-relaxed">
              <p>
                You've got plenty. What's actually stopping you isn't a lack of information —
                there's more startup advice online than any person could read in a lifetime.
              </p>
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <span>You don't know where to actually start</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <span>You think your plan needs to be perfect before you move</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <span>Asking for help feels like admitting you don't know what you're doing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <span>Every guide tells you something different, and none tell you when</span>
                </li>
              </ul>
              <p className="pt-2">
                None of that gets fixed by another podcast. It gets fixed by doing{' '}
                <span className="text-foreground font-medium">one small, slightly uncomfortable thing</span>,
                on purpose, with someone watching your back.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE'RE DIFFERENT */}
      <section className="border-t border-border/40 bg-card/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Our manifesto
            </h2>
            <p className="text-2xl font-bold text-foreground max-w-2xl mx-auto">
              We reject the myth of the overnight success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-background border-border/60 p-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✕</span>
                <span className="text-sm font-semibold text-muted-foreground">Unicorn hype</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl text-primary">✓</span>
                <span className="text-base font-semibold text-foreground">Solve a real problem</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Not every business needs to be a billion-dollar exit. Start with something people actually need.
              </p>
            </Card>

            <Card className="bg-background border-border/60 p-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✕</span>
                <span className="text-sm font-semibold text-muted-foreground">Build to pitch</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl text-primary">✓</span>
                <span className="text-base font-semibold text-foreground">Build to sell</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your only true investors are your customers. Their currency is their time, money, and trust.
              </p>
            </Card>

            <Card className="bg-background border-border/60 p-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✕</span>
                <span className="text-sm font-semibold text-muted-foreground">Perfect plans</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl text-primary">✓</span>
                <span className="text-base font-semibold text-foreground">Real market validation</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Skip the spreadsheets. Talk to real people. Build something they'll pay for.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* THE PROGRAM */}
      <section className="border-t border-border/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                The program
              </h2>
              <p className="text-2xl font-bold text-foreground">Not a course. A program you move through.</p>
            </div>
            <Button variant="ghost" className="text-sm font-medium hidden sm:flex">
              <Link href="/how-it-works/program">
                See all missions →
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-background border-border/60 p-7 space-y-4 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 text-sm font-mono text-primary font-semibold">
                <Target className="h-4 w-4" />
                MISSION 01
              </div>
              <h3 className="text-xl font-bold text-foreground">Build Your Founder Mindset</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Before we look at business opportunities, we look at you. Deal with overthinking, get honest about your time, and practice asking for support.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/40">
                <Sparkles className="h-3 w-3 text-primary" />
                Quest 1 is free
              </div>
            </Card>

            <Card className="bg-background border-border/60 p-7 space-y-4 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 text-sm font-mono text-primary font-semibold">
                <Compass className="h-4 w-4" />
                MISSION 02
              </div>
              <h3 className="text-xl font-bold text-foreground">Find Problems Worth Solving</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Start with your own frustrations, then talk to real people. Build a list of real problems that are worth solving.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/40">
                4 quests · Real-world research
              </div>
            </Card>

            <Card className="bg-background border-border/60 p-7 space-y-4 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 text-sm font-mono text-primary font-semibold">
                <Users className="h-4 w-4" />
                MISSION 03
              </div>
              <h3 className="text-xl font-bold text-foreground">Project Viability</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Talk to customers, understand the competition, and define your Minimum Sellable Product. Make sure it actually makes sense.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/40">
                5 quests · Customer validation
              </div>
            </Card>
          </div>

          <div className="text-center mt-8 md:hidden">
            <Button variant="ghost" className="text-sm font-medium">
              <Link href="/how-it-works/program">
                See all missions →
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SUPPORT SYSTEM */}
      <section className="border-t border-border/40 bg-card/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              You're not alone
            </h2>
            <p className="text-2xl font-bold text-foreground">Nobody builds alone.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-background border-border/60 p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Your Cheer Squad</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A small group of people who follow your progress and expect to hear from you. Not a forum you'll forget—real people who know your mission and are quietly rooting for you.
              </p>
            </Card>

            <Card className="bg-background border-border/60 p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">The Network</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Other founders going through the same thing. Industry folks who actually know things. A safe place to test your product before you launch.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <div className="border-t border-border/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Join <span className="text-foreground font-semibold">200+</span> founders already building their first business.
          </p>
        </div>
      </div>

      {/* FINAL CTA */}
      <section className="border-t border-border/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
            You don't need a perfect plan.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400/90">
              You need a next action.
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto">
            Quest 1 of Mission 1 is free. No card. No onboarding. Just the first honest step.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8 py-6 text-sm font-semibold rounded-xl shadow-lg shadow-primary/20">
              <Link href="/auth">Start Quest 1</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-sm font-semibold rounded-xl">
              <Link href="/checkout/full-access-membership">Enroll in Program</Link>
            </Button>
          </div>

          <div className="mt-6">
            <Link
              href="/auth?optin=newsletter"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              Not ready yet? Get one real idea a week, no fluff
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
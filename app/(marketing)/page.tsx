import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Users, Target, Compass, Zap, Shield, ShoppingBag, TestTube, ChevronRight } from 'lucide-react';

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
            No card required. No commitment. Just the first step.
          </p>
        </div>
      </section>

      {/* THE PROBLEM – BOLDER FRAMING */}
      <section className="border-t border-border/40 bg-card/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                The real problem
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mt-2">
                You know what you want to build.
                <br />
                <span className="text-muted-foreground">You just don't know how to start.</span>
              </h2>
            </div>

            <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
              <p>
                It's not that you lack ideas. It's that every time you try to move forward, you hit the same wall.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                <div className="bg-background border border-border/60 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl text-destructive font-bold">✕</span>
                    <div>
                      <p className="font-semibold text-foreground">Information overload</p>
                      <p className="text-sm text-muted-foreground">More advice than you could ever read. None of it tells you what to do first.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-background border border-border/60 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl text-destructive font-bold">✕</span>
                    <div>
                      <p className="font-semibold text-foreground">Analysis paralysis</p>
                      <p className="text-sm text-muted-foreground">You think you need a perfect plan. So you never actually start.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-background border border-border/60 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl text-destructive font-bold">✕</span>
                    <div>
                      <p className="font-semibold text-foreground">Fear of asking</p>
                      <p className="text-sm text-muted-foreground">You don't want to look stupid. So you stay quiet and stay stuck.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-background border border-border/60 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl text-destructive font-bold">✕</span>
                    <div>
                      <p className="font-semibold text-foreground">The "right time" trap</p>
                      <p className="text-sm text-muted-foreground">There's always a reason to wait. A better idea. A safer moment. More time.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
                <p className="text-foreground font-medium">
                  None of that gets fixed by another podcast or a "how to start a business" article.
                </p>
                <p className="text-base text-muted-foreground mt-2">
                  It gets fixed by doing <span className="text-foreground font-semibold">one small thing</span> that moves you forward.
                  <br />
                  With someone watching your back.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE BELIEVE – EFFORT + MANIFESTO MERGED */}
      <section className="border-t border-border/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              What we believe
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-2 max-w-2xl mx-auto">
              We've spent years figuring out what actually works.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              So you don't have to.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🎯</span>
                  <h3 className="text-xl font-bold text-foreground">Start with the problem, not the solution</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Most people fall in love with their idea. We help you fall in love with the problem. Talk to real people. Understand what they actually need. Then build something they'll pay for.
                </p>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">⚡</span>
                  <h3 className="text-xl font-bold text-foreground">Build to sell, not to pitch</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your only investors are your customers. Their currency is their time, money, and trust. We show you how to earn it.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🧠</span>
                  <h3 className="text-xl font-bold text-foreground">Mindset first. Everything else second.</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Before you can build a business, you need the right mindset. The ability to ask. The resilience to hear no. The discipline to keep going. We build that first.
                </p>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">📋</span>
                  <h3 className="text-xl font-bold text-foreground">Action over analysis</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No 40-page business plans. No endless spreadsheets. Just clear, sequential actions that move you forward. One step at a time.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground font-medium">
              This isn't a trend. This isn't a fad. This is the hard work of building something real.
            </p>
          </div>
        </div>
      </section>

      {/* THE PROGRAM */}
      <section className="border-t border-border/40 bg-card/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                The program
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-1">
                8 missions. <span className="text-muted-foreground">Your entire journey from idea to launch.</span>
              </h2>
            </div>
            <Button variant="ghost" className="text-sm font-medium hidden sm:flex">
              <Link href="/how-it-works/program">
                See all →
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-background border-border/60 p-7 space-y-4 hover:border-primary/30 transition-colors group">
              <div className="flex items-center gap-2 text-sm font-mono text-primary font-semibold">
                <Target className="h-4 w-4" />
                MISSION 01
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">Build Your Founder Mindset</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Before we look at business, we look at you. Overthinking, time management, asking for support—the foundations.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/40">
                <span className="inline-flex items-center gap-1 text-primary font-medium">✨ Quest 1 free</span>
              </div>
            </Card>

            <Card className="bg-background border-border/60 p-7 space-y-4 hover:border-primary/30 transition-colors group">
              <div className="flex items-center gap-2 text-sm font-mono text-primary font-semibold">
                <Compass className="h-4 w-4" />
                MISSION 02
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">Find Problems Worth Solving</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Start with your frustrations, then talk to real people. Build a list of real problems people will pay to solve.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/40">
                4 quests · Real-world research
              </div>
            </Card>

            <Card className="bg-background border-border/60 p-7 space-y-4 hover:border-primary/30 transition-colors group">
              <div className="flex items-center gap-2 text-sm font-mono text-primary font-semibold">
                <Users className="h-4 w-4" />
                MISSION 03
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">Test if It Actually Works</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Talk to customers, understand the competition, define what you'll build. Make sure it makes sense before you invest time.
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

      {/* THE NETWORK – EXPANDED */}
      <section className="border-t border-border/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              The network
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-1">
              You don't build alone.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              When you join Urge, you get access to a community, a marketplace, and a testing ground. All designed to help you succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Community */}
            <Card className="bg-card border-border/60 p-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Community</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span><span className="text-foreground font-medium">Other founders</span> — People going through the same journey</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span><span className="text-foreground font-medium">Mentors & experts</span> — Real advice from people who've been there</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span><span className="text-foreground font-medium">Your cheer squad</span> — A small group that holds you accountable</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span><span className="text-foreground font-medium">Investors</span> — For when you're ready to scale</span>
                </li>
              </ul>
            </Card>

            {/* Marketplace */}
            <Card className="bg-card border-border/60 p-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Marketplace</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span><span className="text-foreground font-medium">Tools & services</span> — Legal, marketing, infrastructure, and more</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span><span className="text-foreground font-medium">Vetted providers</span> — Only the best, curated for founders</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span><span className="text-foreground font-medium">Special offers</span> — Tailored packages for early-stage startups</span>
                </li>
              </ul>
            </Card>

            {/* Testing Ground */}
            <Card className="bg-card border-border/60 p-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TestTube className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Testing Ground</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span><span className="text-foreground font-medium">Early validation</span> — Test your product with real users</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span><span className="text-foreground font-medium">Internal launch</span> — Get feedback before going public</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span><span className="text-foreground font-medium">Early customers</span> — Build momentum and confidence</span>
                </li>
              </ul>
            </Card>

          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <div className="border-t border-border/40 bg-card/10">
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

          <p className="mt-4 text-sm text-muted-foreground">
            Includes 1 year of network membership.
          </p>

          <div className="mt-8">
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
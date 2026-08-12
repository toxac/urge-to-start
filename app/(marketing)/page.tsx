"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Rocket, 
  Target, 
  Compass, 
  Users, 
  Brain, 
  Zap, 
  XCircle, 
  ArrowRight, 
  ChevronRight,
  LayoutDashboard,
  MessageCircle,
  Shield,
  Sparkles,
  TrendingUp,
  Star
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// --- Animated Background Components ---

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let stars: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      twinkle: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      stars = [];
      for (let i = 0; i < 150; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.5 + 0.2,
          twinkle: Math.random() * 0.02 + 0.01
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.y -= star.speed;
        star.opacity += Math.sin(Date.now() * star.twinkle) * 0.01;

        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 150, ${Math.max(0.1, Math.min(0.8, star.opacity))})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    createStars();
    animate();

    const handleResize = () => { resize(); createStars(); };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.6 }} />;
}

function LightStreak({ delay, top, duration = 8 }: { delay: number; top: string; duration?: number }) {
  return (
    <div 
      className="absolute h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent w-full"
      style={{ 
        top,
        animation: `streakMove ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
        opacity: 0.3
      }}
    />
  );
}

function GlowOrb({ className = "" }: { className?: string }) {
  return <div className={`absolute rounded-full blur-[100px] pointer-events-none ${className}`} />;
}

function ScrollReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
}

// --- Sections ---

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 overflow-hidden">
      <StarField />
      <GlowOrb className="top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/15" />
      <GlowOrb className="bottom-0 right-0 w-[600px] h-[600px] bg-orange-500/5" />

      <LightStreak delay={0} top="20%" duration={10} />
      <LightStreak delay={3} top="45%" duration={12} />
      <LightStreak delay={6} top="70%" duration={8} />
      <LightStreak delay={1} top="85%" duration={15} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-primary/20 backdrop-blur-sm mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          For people who keep thinking about starting something
        </div>

        <h1 className="mt-8 text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground leading-[0.95]">
          How many times have you{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-300 to-primary animate-gradient">
            almost started?
          </span>
        </h1>

        <p className="mt-8 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          You&apos;ve had the idea. You&apos;ve made the notes. You&apos;ve watched the videos.
          <br className="hidden md:block" />
          Urge is the place that finally turns &quot;someday&quot; into a Tuesday.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="px-8 py-6 text-sm font-semibold rounded-xl shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_50px_hsl(var(--primary)/0.5)] hover:brightness-110 transition-all relative overflow-hidden group">
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10 flex items-center gap-2">
              <Link href="/auth?view=signup&intent=free">Start Mission 1 Free</Link>
              <Rocket className="h-4 w-4" />
            </span>
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-6 text-sm font-semibold rounded-xl border-border/60 hover:border-primary/50 hover:bg-primary/5 backdrop-blur-sm transition-all">
            <Link href="/auth?view=signup&intent=member">Become an Urge Member</Link>
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          No credit card required for trial. Just the first step.
        </p>
        <p className="mt-2 text-sm font-semibold text-primary">
          Membership: ₹1,500/month or ₹10,000/year
        </p>

        <div className="mt-16 flex items-center justify-center gap-8 text-muted-foreground/60 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary/60" />
            <span>Built for action</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary/60" />
            <span>First principles approach</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary/60" />
            <span>Community driven</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  const pains = [
    { title: "Starting from scratch", desc: "You have no clue what the first step even looks like." },
    { title: "Too many options", desc: "Should you build first? Talk to people? Write a plan? You freeze." },
    { title: "Fear of wasting time", desc: "What if you build something nobody wants? What if you're wrong?" },
    { title: "Going it alone", desc: "No one to ask. No one to check in with. No one to hold you accountable." }
  ];

  return (
    <section className="py-24 relative border-t border-border/20">
      <GlowOrb className="top-1/2 left-0 w-[500px] h-[500px] bg-destructive/5" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              The real problem
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mt-4 leading-[1.1]">
              You know what you want to build.
              <br />
              <span className="text-muted-foreground">You just don&apos;t know how to start.</span>
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              It&apos;s not that you lack ideas. It&apos;s that every time you try to move forward, you hit the same wall.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {pains.map((pain, i) => (
            <ScrollReveal key={i}>
              <Card className="flex items-start gap-4 !p-6 border-l-2 border-l-destructive/50 bg-card/60 backdrop-blur-sm">
                <XCircle className="h-6 w-6 text-destructive/80 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">{pain.title}</p>
                  <p className="text-muted-foreground text-sm mt-1">{pain.desc}</p>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
            <p className="text-lg text-foreground font-medium relative z-10">
              None of that gets fixed by another podcast or a &quot;how to start a business&quot; article.
            </p>
            <p className="text-base text-muted-foreground mt-3 relative z-10">
              It gets fixed by doing <span className="text-foreground font-bold">one small thing</span> that moves you forward.
              <br />
              With a community and a clear path watching your back.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function Beliefs() {
  const values = [
    { icon: Brain, title: "Start with why, not what", desc: "Before you build anything, you need to know why you're doing this. Your personal motivation is what keeps you going when things get hard. We help you figure that out first." },
    { icon: Zap, title: "Action over analysis", desc: "No 40-page business plans. No endless spreadsheets. Just clear, sequential actions that move you forward. One step at a time." },
    { icon: MessageCircle, title: "Talk to people before you build", desc: "Most founders fall in love with their idea. We help you fall in love with the problem. Go talk to real people. Understand what they actually need. Then build something they'll pay for." },
    { icon: Shield, title: "You don't do it alone", desc: "When you join Urge, you get a community of people going through the same journey. Your squad. Your accountability. Your support system." }
  ];

  return (
    <section className="py-24 border-t border-border/20 relative overflow-hidden">
      <GlowOrb className="top-0 right-0 w-[600px] h-[600px] bg-primary/5" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              What we believe
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mt-4 leading-[1.1]">
              We&apos;ve spent years figuring out what actually works.
            </h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              So you don&apos;t have to.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {values.map((val, i) => (
            <ScrollReveal key={i}>
              <Card className="!p-8 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <val.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{val.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {val.desc}
                </p>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Program() {
  const missions = [
    { num: "01", title: "Finding Why", icon: Target, desc: "Figuring out your personal reasons for starting and what you want to achieve.", result: "Knowing your personal motivation, how much time you can give, and what success looks like for you.", free: true },
    { num: "02", title: "Discovering Opportunities", icon: Compass, desc: "Looking at the market and talking to people to spot real problems that need fixing.", result: "Identifying specific gaps, needs, or struggles that people are actively trying to solve." },
    { num: "03", title: "Validating", icon: MessageCircle, desc: "Testing your idea before building it to make sure people actually want it and will pay for it.", result: "Getting real feedback, sign-ups, or pre-orders from interested potential customers." },
    { num: "04", title: "Planning", icon: LayoutDashboard, desc: "Mapping out how you will build the product, what tools you need, and how much it will cost.", result: "A clear step-by-step roadmap for your product, timeline, and basic budget." },
    { num: "05", title: "Build", icon: Zap, desc: "Creating the simple, working first version of your product or service.", result: "A finished basic version that solves the main problem without extra unnecessary features." },
    { num: "06", title: "Launch & Operating", icon: Rocket, desc: "Releasing your product to the world, making your first sales, and running the business smoothly day-to-day.", result: "Getting your first paying customers, handling support and payments, tracking finances, and keeping the business growing." }
  ];

  return (
    <section className="py-24 border-t border-border/20 relative overflow-hidden">
      <GlowOrb className="bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/8" />
      <LightStreak delay={2} top="30%" duration={14} />
      <LightStreak delay={5} top="60%" duration={10} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                The program
              </span>
              <h2 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
                6 missions. <span className="text-muted-foreground">Your entire journey from idea to launch.</span>
              </h2>
            </div>
            <Button variant="ghost" className="text-sm font-medium hidden sm:flex hover:text-primary transition-colors">
              <Link href="/program">
                Explore Curriculum <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((m, i) => (
            <ScrollReveal key={i}>
              <Card className={`relative group overflow-hidden ${m.free ? 'border-primary/30 ring-1 ring-primary/20' : ''}`}>
                {m.free && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-20">
                    Free to Try
                  </div>
                )}
                <div className="flex items-center gap-3 text-primary mb-4">
                  <m.icon className="h-4 w-4" />
                  <span className="text-xs font-mono font-bold tracking-widest uppercase">Mission {m.num}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{m.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{m.desc}</p>
                <div className="pt-4 border-t border-border/40">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Main Result</p>
                  <p className="text-sm text-foreground">{m.result}</p>
                </div>
                {m.free && (
                  <div className="flex items-center gap-2 text-xs text-primary font-medium pt-3">
                    <Sparkles className="h-3 w-3" />
                    Mission 1 is free to try
                  </div>
                )}
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button variant="ghost" className="text-sm font-medium hover:text-primary transition-colors">
            <Link href="/program">
              Explore Curriculum <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Community() {
  const features = [
    {
      title: "Community",
      icon: Users,
      items: [
        { bold: "Other founders", text: "People going through the same journey at the same time" },
        { bold: "Your squad", text: "A dedicated group that holds you accountable and celebrates your wins" },
        { bold: "Ask anything", text: "No judgment. Just honest help from people who've been there" }
      ]
    },
    {
      title: "Dashboard Tools",
      icon: LayoutDashboard,
      items: [
        { bold: "Build Dashboard", text: "Track your product development from idea to launch" },
        { bold: "Finances", text: "Monitor revenue, expenses, and cash flow" },
        { bold: "Leads", text: "Manage customer conversations and follow-ups" },
        { bold: "Launch Control", text: "Plan and execute your public launch" },
        { bold: "Operations", text: "Oversee day-to-day business activity" }
      ]
    },
    {
      title: "Integrations",
      icon: Sparkles,
      items: [
        { bold: "GitHub", text: "Sync your code and development progress" },
        { bold: "Task Management", text: "Connect your project management tools" },
        { bold: "Email", text: "Manage customer communication" },
        { bold: "Payments", text: "Handle transactions and subscriptions" },
        { bold: "And more", text: "Third-party services to streamline your workflow" }
      ]
    }
  ];

  return (
    <section className="py-24 border-t border-border/20 relative overflow-hidden">
      <GlowOrb className="top-1/2 right-0 w-[500px] h-[500px] bg-primary/5" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              The community
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mt-4 leading-[1.1]">
              You don&apos;t build alone.
            </h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              When you join Urge, you get a community of people going through the same journey—plus tools to keep you organized.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feat, i) => (
            <ScrollReveal key={i}>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <feat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{feat.title}</h3>
                </div>
                <ul className="space-y-4">
                  {feat.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span><span className="text-foreground font-medium">{item.bold}</span> — {item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative py-32 overflow-hidden border-t border-border/20">
      <StarField />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <GlowOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10" />
      <LightStreak delay={0} top="40%" duration={10} />
      <LightStreak delay={4} top="60%" duration={12} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <ScrollReveal>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
            You don&apos;t need a perfect plan.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-300 to-primary animate-gradient">
              You need a next action.
            </span>
          </h2>
        </ScrollReveal>

        <ScrollReveal>
          <p className="mt-6 text-xl text-muted-foreground max-w-xl mx-auto">
            Mission 1 is completely free. No card required to get started. Just one small step.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8 py-6 text-sm font-semibold rounded-xl shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_50px_hsl(var(--primary)/0.5)] hover:brightness-110 transition-all relative overflow-hidden group">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative z-10 flex items-center gap-2">
                <Link href="/auth?view=signup&intent=free">Start Mission 1 Free</Link>
                <Rocket className="h-4 w-4" />
              </span>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-sm font-semibold rounded-xl border-border/60 hover:border-primary/50 hover:bg-primary/5 backdrop-blur-sm transition-all">
              <Link href="/auth?view=signup&intent=member">Become an Urge Member</Link>
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mt-10">
            <Link
              href="/auth?view=signup&intent=free"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group font-medium"
            >
              Ready to stop overthinking?
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// --- Main Page ---

export default function Homepage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden">
      <style jsx global>{`
        @keyframes streakMove {
          0% { transform: translateX(-100%); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateX(100vw); opacity: 0; }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s ease infinite;
        }
      `}</style>

      {/* Navigation */}
      

      <main>
        <Hero />
        <div id="problem"><Problem /></div>
        <div id="beliefs"><Beliefs /></div>
        <div id="program"><Program /></div>
        <div id="community"><Community /></div>
        <FinalCTA />
      </main>

    </div>
  );
}
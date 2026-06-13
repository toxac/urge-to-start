import Link from 'next/link';
import { NavigationHeader } from '@/components/layout/NavBar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Compass, Radio, Target, Zap } from 'lucide-react';

export default function PragmaticHomepage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/30 flex flex-col font-sans">
      
      {/* Mounted Custom Core Navigation Header */}
      <NavigationHeader />

      {/* Hero Sector Operational Specifications */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-card px-3 py-1 rounded-full border border-border text-[10px] sm:text-xs font-mono text-primary font-bold tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-sm shadow-primary"></span>
          SYSTEM_PROTOCOL // ANTI_INERTIA_ACTIVE
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight max-w-3xl mx-auto leading-tight sm:leading-none font-heading">
          Stop planning your startup. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
            Execute the quests.
          </span>
        </h1>
        
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal">
          A gamified sandbox that breaks business creation down into interactive, timed executions. We swap abstract pitch decks for immediate customer interactions.
        </p>
        
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button className="px-8 py-6 font-mono text-xs font-bold tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10">
            <Link href="/signup">INITIALIZE_FIRST_QUEST</Link>
          </Button>
          <Button variant="outline" className="px-6 py-6 font-mono text-xs font-bold tracking-wider uppercase border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground">
            <Link href="/login">ACCESS_NODE</Link>
          </Button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6">
        <Separator className="bg-border/60" />
      </div>

      {/* Program Mission Framework Progression Cards Matrix */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-8 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono">
            Operational Curriculum
          </h2>
          <span className="text-[10px] text-muted-foreground font-mono">3_MISSIONS // VERIFIED_EXECUTION</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Mission Block 1 */}
          <Card className="bg-card p-6 rounded-xl border border-border space-y-4 shadow-xl relative overflow-hidden group">
            <div className="text-xs font-mono text-primary font-bold tracking-wider">MISSION_01</div>
            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
              <Target className="h-4 w-4" /> Friction Matrix Allocation
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Isolate high-yield commercial problems. Strip away fluid emotional ideas and catalog concrete, structural marketplace deficits.
            </p>
            <div className="text-[10px] text-muted-foreground font-mono pt-2 border-t border-border/40">
              3 Quests • 450 XP Available
            </div>
          </Card>

          {/* Mission Block 2 */}
          <Card className="bg-card p-6 rounded-xl border border-border space-y-4 shadow-xl relative overflow-hidden group">
            <div className="text-xs font-mono text-primary font-bold tracking-wider">MISSION_02</div>
            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
              <Radio className="h-4 w-4" /> Target Demand Validation
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mine niche core groups. Run structured client outreach configurations and capture real interest signatures directly from active consumers.
            </p>
            <div className="text-[10px] text-muted-foreground font-mono pt-2 border-t border-border/40">
              5 Quests • 1,200 XP Available
            </div>
          </Card>

          {/* Mission Block 3 */}
          <Card className="bg-card p-6 rounded-xl border border-border space-y-4 shadow-xl relative overflow-hidden group">
            <div className="text-xs font-mono text-primary font-bold tracking-wider">MISSION_03</div>
            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
              <Compass className="h-4 w-4" /> The Minimum Sellable Product
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Deploy a high-signal landing mechanism. Integrate functional transaction layers and exchange genuine utility for real capital validation.
            </p>
            <div className="text-[10px] text-muted-foreground font-mono pt-2 border-t border-border/40">
              4 Quests • 900 XP Available
            </div>
          </Card>

        </div>
      </main>

      {/* Structural Minimalist Footer */}
      <footer className="w-full max-w-5xl mx-auto border-t border-border/40 px-4 sm:px-6 py-8 mt-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
        <span>PRAGMATIC_OS_V1.6 // DISRUPT_THE_THEATER</span>
        <span className="flex items-center gap-1.5">
          <Zap className="h-3 w-3 text-primary" /> CLUSTER_STATUS: ONLINE
        </span>
      </footer>

    </div>
  );
}
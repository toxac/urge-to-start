import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Target, Compass, Users, DollarSign, Rocket, Zap } from 'lucide-react';

const missions = [
  {
    id: 'mission1',
    title: 'Build Your Founder Mindset',
    icon: Target,
    description: 'Before we look at business opportunities, we look at you. Deal with overthinking, get honest about your hours, and practice asking for support.',
    quests: 3,
    free: true,
  },
  {
    id: 'mission2',
    title: 'Find Problems Worth Solving',
    icon: Compass,
    description: 'Start with your own frustrations, then talk to real people. Build a list of real problems that are worth solving.',
    quests: 4,
    free: false,
  },
  {
    id: 'mission3',
    title: 'Project Viability',
    icon: Users,
    description: 'Talk to customers, understand the competition, and define your Minimum Sellable Product. Make sure it actually makes sense.',
    quests: 5,
    free: false,
  },
  {
    id: 'mission4',
    title: 'How Will You Make Money?',
    icon: DollarSign,
    description: 'Explore pricing, go-to-market channels, partnerships, costs, and break-even. Make sure the math works.',
    quests: 5,
    free: false,
  },
  {
    id: 'mission5',
    title: 'From Plan to Build',
    icon: Rocket,
    description: 'Define exactly what you’re building, set up your presence, gather early followers, and create your build plan.',
    quests: 5,
    free: false,
  },
  {
    id: 'mission6',
    title: 'Building & Traction',
    icon: Zap,
    description: 'Build your Minimum Sellable Product, test it with real users, get pre-sales, and prepare for public launch.',
    quests: 4,
    free: false,
  },
  // missions 7 and 8 are also available but we'll keep the list concise
];

export default function ProgramHowItWorks() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight font-heading">
          The Program
        </h1>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          Eight missions, each broken into quests. Each quest is a single, focused action that moves you forward.
        </p>
      </header>

      <Separator />

      <div className="space-y-6">
        {missions.map((mission) => (
          <Card key={mission.id} className="bg-card p-6 border border-border rounded-xl flex flex-col md:flex-row gap-6 items-start">
            <div className="p-3 bg-primary/10 rounded-lg shrink-0">
              <mission.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-lg font-bold">{mission.title}</h3>
                {mission.free && (
                  <span className="text-[10px] font-mono bg-primary/20 text-primary px-2 py-0.5 rounded-full">Quest 1 Free</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{mission.description}</p>
              <p className="text-xs text-muted-foreground font-mono">{mission.quests} quests</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 text-center space-y-4">
        <p className="text-sm font-medium">The first quest is completely free.</p>
        <Button className="font-mono text-xs">
          <Link href="/auth">Start Quest 1</Link>
        </Button>
      </div>
    </div>
  );
}
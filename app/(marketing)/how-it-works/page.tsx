import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight font-heading">
          How Urge Works
        </h1>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          Urge is a structured program that guides you from <span className="text-foreground font-medium">idea</span> to <span className="text-foreground font-medium">first customer</span>.
          No fluff. No jargon. Just action.
        </p>
      </header>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-card p-6 border border-border rounded-xl space-y-4">
          <h2 className="text-lg font-bold">The Program</h2>
          <p className="text-sm text-muted-foreground">
            Missions and quests that walk you through the entire process of building a business—from mindset to launch.
          </p>
          <Button variant="outline" size="sm" className="font-mono text-xs">
            <Link href="/how-it-works/program">Explore the Program →</Link>
          </Button>
        </Card>

        <Card className="bg-card p-6 border border-border rounded-xl space-y-4">
          <h2 className="text-lg font-bold">The Network</h2>
          <p className="text-sm text-muted-foreground">
            A community of founders, mentors, and experts. Accountability, feedback, and a safe place to test your product.
          </p>
          <Button variant="outline" size="sm" className="font-mono text-xs">
            <Link href="/how-it-works/network">Explore the Network →</Link>
          </Button>
        </Card>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-2 text-center">
        <p className="text-sm font-medium">Ready to start?</p>
        <Button className="font-mono text-xs">
          <Link href="/auth">Start Building</Link>
        </Button>
      </div>
    </div>
  );
}
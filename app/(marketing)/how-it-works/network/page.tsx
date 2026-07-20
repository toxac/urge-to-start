import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Users, UserCheck, Handshake, ShoppingBag, Calendar } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Peer Network',
    description: 'Connect with other founders going through the same journey. Share wins, ask questions, and find collaborators.',
  },
  {
    icon: UserCheck,
    title: 'Cheer Squad',
    description: 'A small group of people who follow your progress and hold you accountable. You\'re not building alone.',
  },
  {
    icon: Handshake,
    title: 'Mentors & Advisors',
    description: 'Industry experts who have been there before. Get real, practical advice when you need it.',
  },
  {
    icon: ShoppingBag,
    title: 'Internal Marketplace',
    description: 'Launch your product to the community before going public. Get early customers and real feedback.',
  },
  {
    icon: Calendar,
    title: 'Events & Standups',
    description: 'Regular live events, pop-up sales, and weekly standups to keep you connected and motivated.',
  },
];

export default function NetworkHowItWorks() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight font-heading">
          The Network
        </h1>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          A community that actually helps you build. Not a forum you\'ll forget—a real support system.
        </p>
      </header>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Card key={feature.title} className="bg-card p-6 border border-border rounded-xl space-y-3">
            <feature.icon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 text-center space-y-4">
        <p className="text-sm font-medium">
          Get access to the network when you enroll in the program.
        </p>
        <Button className="font-mono text-xs">
          <Link href="/checkout/full-access-membership">Enroll Now</Link>
        </Button>
      </div>
    </div>
  );
}
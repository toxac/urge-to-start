// app/squad/confirmed/page.tsx
import React from 'react';
import { CheckCircle2, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

export default function SquadConfirmedPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-2xl border border-border bg-card shadow-lg space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
          <HeartHandshake className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-emerald-500 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Squad Confirmed
          </span>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            You're Official!
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            Thank you for stepping up to support your founder's journey. You'll receive occasional behind-the-scenes updates and progress milestones.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-10 px-6 rounded-xl bg-primary text-primary-foreground font-sans text-xs font-bold uppercase tracking-wider hover:opacity-90 transition"
          >
            Learn More About Urge
          </Link>
        </div>
      </div>
    </div>
  );
}
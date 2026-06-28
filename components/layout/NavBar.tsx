'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NavigationHeaderProps {
  variant?: 'default' | 'auth';
}

export function NavigationHeader({ variant = 'default' }: NavigationHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuth = variant === 'auth';

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 shadow-sm antialiased selection:bg-primary/30 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Main Logo Block */}
          <div className="text-xl font-black tracking-wider text-foreground flex items-center gap-2 font-mono">
            <span className="w-3.5 h-3.5 bg-primary rounded-sm shadow-sm shadow-primary/50"></span>PRAGMATIC
          </div>
          
          {/* Quick Route Targets - hidden for auth */}
          {!isAuth && (
            <div className="hidden sm:flex items-center gap-5 text-xs font-bold font-mono tracking-wide text-muted-foreground">
              <Link href="/platform/dashboard" className="text-foreground border-b border-primary pb-0.5">DASHBOARD</Link>
              <Link href="/platform/network" className="hover:text-foreground transition-colors">NETWORK_FEED</Link>
              <Link href="/platform/events" className="hover:text-foreground transition-colors">LIVE_EVENTS</Link>
            </div>
          )}
        </div>

        {/* Control Interactions Frame */}
        <div className="flex items-center gap-4">
          
          {/* Explicit Theme Mode Toggle Trigger Button */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted font-mono"
              title="Press D or click to toggle system mode"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="h-4 w-4 text-primary" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Live Telemetry Pulse Node - hidden for auth */}
          {!isAuth && (
            <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground font-bold tracking-widest">
              <span className="hidden md:inline">COHORT_SYNC: SECURE</span>
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-sm shadow-primary"></div>
            </div>
          )}
          
        </div>
      </div>
    </nav>
  );
}
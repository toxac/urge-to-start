// components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { $profileStore } from '@/lib/stores/profileStore';
import { logout } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Compass,
  Layers,
  Users,
  Calendar,
  ShoppingBag,
  LogOut,
  UserSquare2,
  Sun,
  Moon,
  Menu
} from 'lucide-react';

/* ─── DYNAMIC NAV LINKS MODULE ─── */
function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const profile = useStore($profileStore);
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex flex-col justify-between h-full w-full bg-card p-5 text-foreground">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="space-y-0.5 py-1 px-1">
          <span className="text-[10px] font-sans font-bold text-primary uppercase tracking-widest block">Workspace</span>
          <p className="text-sm font-serif font-black tracking-tight">Urge Start</p>
        </div>

        <Separator className="opacity-60" />

        {/* Link Tree Items */}
        <nav className="space-y-1 font-sans text-xs font-semibold tracking-normal">
          <Link
            href="/platform/dashboard"
            onClick={onNavigate}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition group border ${isActive('/platform/dashboard') ? 'bg-primary/5 text-primary border-primary/20 shadow-sm' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
          >
            <span className="flex items-center gap-3"><Layers className="h-4 w-4 shrink-0" /> Dashboard</span>
            <span className="text-[11px] opacity-0 group-hover:opacity-100 text-primary pr-1">→</span>
          </Link>

          {profile?.roles?.includes('member') && (
            <Link
              href="/platform/program"
              onClick={onNavigate}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition group border ${isActive('/platform/program') ? 'bg-primary/5 text-primary border-primary/20 shadow-sm' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
            >
              <span className="flex items-center gap-3"><Compass className="h-4 w-4 shrink-0" /> Program Track</span>
              <span className="bg-primary/10 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded-md">Active</span>
            </Link>
          )}

          <Link
            href="/platform/network"
            onClick={onNavigate}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition group border ${isActive('/platform/network') ? 'bg-primary/5 text-primary border-primary/20 shadow-sm' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
          >
            <span className="flex items-center gap-3"><Users className="h-4 w-4 shrink-0" /> Peer Network</span>
          </Link>

          <Link
            href="/platform/events"
            onClick={onNavigate}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition group border ${isActive('/platform/events') ? 'bg-primary/5 text-primary border-primary/20 shadow-sm' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
          >
            <span className="flex items-center gap-3"><Calendar className="h-4 w-4 shrink-0" /> Live Sprints</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0 mr-1"></span>
          </Link>

          <Link
            href="/platform/mentors"
            onClick={onNavigate}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition group border ${isActive('/platform/mentors') ? 'bg-primary/5 text-primary border-primary/20 shadow-sm' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
          >
            {/* ⚡ FIXED: Stripped out the rogue m-0 property completely */}
            <span className="flex items-center gap-3"><UserSquare2 className="h-4 w-4 shrink-0" /> Industry Advisors</span>
          </Link>

          <Link
            href="/platform/marketplace"
            onClick={onNavigate}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition group border ${isActive('/platform/marketplace') ? 'bg-primary/5 text-primary border-primary/20 shadow-sm' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
          >
            <span className="flex items-center gap-3"><ShoppingBag className="h-4 w-4 shrink-0" /> Perks & Solutions</span>
          </Link>
        </nav>
      </div>

      {/* Profile/Footer Area */}
      <div className="space-y-3 pt-4 border-t border-border">
        {mounted && (
          <div className="flex items-center justify-between bg-muted/40 p-2 rounded-xl border border-border/40 text-xs text-muted-foreground font-medium px-3">
            <span>Interface Mode</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {resolvedTheme === 'dark' ? <Sun className="h-3.5 w-3.5 text-primary" /> : <Moon className="h-3.5 w-3.5" />}
            </Button>
          </div>
        )}

        {profile && (
          <Link
            href={`/platform/profile/${profile.id}`}
            onClick={onNavigate}
            className="block p-3 bg-muted/20 hover:bg-muted/50 rounded-xl space-y-1.5 border border-border/40 group transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold truncate tracking-tight text-foreground group-hover:text-primary transition-colors">
                {profile.full_name || 'Anonymous Builder'}
              </span>
              <span className="text-[10px] text-muted-foreground font-serif">⚙</span>
            </div>
          </Link>
        )}

        <form action={logout} className="w-full">
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive font-sans text-xs font-semibold h-10 hover:bg-destructive/5 rounded-xl transition-all"
          >
            <LogOut className="h-4 w-4" /> Disconnect Account
          </Button>
        </form>
      </div>
    </div>
  );
}

/* ─── MAIN MASTER WRAPPER VIEW ─── */
export function SidebarComponent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* DESKTOP SIDEBAR: Sticky, standard view for screens md and wider */}
      <aside className="hidden md:flex w-64 h-full border-r border-border flex-col select-none shrink-0 overflow-hidden">
        <SidebarContent />
      </aside>

      {/* MOBILE TRIGGER HEADER: Displays on viewports under md, adding a sleek navigation bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-40 flex items-center justify-between px-4 select-none">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          {/* Base UI standard layout trigger configuration */}
          <SheetTrigger className="inline-flex items-center justify-center p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer focus-visible:outline-none">
            <Menu className="w-5 h-5" />
          </SheetTrigger>

          <SheetContent side="left" className="w-64 p-0 bg-card border-r border-border h-full flex flex-col">
            <SidebarContent onNavigate={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        <span className="text-xs font-serif font-black tracking-wider uppercase text-foreground">
          Urge Start
        </span>

        <div className="w-9 h-9" /> {/* Visual Balance Spacing Weight */}
      </div>
    </>
  );
}
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { $userProfile } from '@/lib/stores/profile-store';
import { logout } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Compass, 
  Layers, 
  Users, 
  Calendar, 
  ShoppingBag, 
  LogOut, 
  UserSquare2 
} from 'lucide-react';

export function SidebarComponent() {
  const profile = useStore($userProfile);
  const pathname = usePathname();

  // Helper utility to calculate high-signal active connection highlights
  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-card p-4 hidden md:flex flex-col justify-between min-h-[calc(screen-16)] h-full select-none">
      <div className="space-y-6">
        
        {/* Sector Group Metadata Tracker */}
        <div className="space-y-1 py-2">
          <span className="text-[10px] font-mono text-muted-foreground font-bold tracking-widest block uppercase">
            Ecosystem Directory
          </span>
          <p className="text-[11px] font-mono font-medium text-foreground/80">
            LOC_NODE // CLUSTER_ALPHA
          </p>
        </div>

        <Separator className="bg-border/60" />

        {/* Dynamic Navigation Matrix */}
        <nav className="space-y-1.5 font-mono text-xs font-bold tracking-wide">
          
          <Link 
            href="/platform/dashboard" 
            className={`flex items-center justify-between px-3 py-2.5 rounded transition-all group border ${
              isActive('/platform/dashboard') 
                ? 'bg-primary/5 text-primary border-primary/30 shadow-sm shadow-primary/5' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <span className="flex items-center gap-3">
              <Layers className="h-4 w-4 shrink-0" /> HUB_DASHBOARD
            </span>
            <span className="text-[9px] opacity-0 group-hover:opacity-100 text-primary transition-opacity font-serif">→</span>
          </Link>
          
          {/* Constrain Quests access vectors conditional on active full tier roles */}
          {profile?.role === 'member_full' && (
            <Link 
              href="/platform/program" 
              className={`flex items-center justify-between px-3 py-2.5 rounded transition-all group border ${
                isActive('/platform/program') 
                  ? 'bg-primary/5 text-primary border-primary/30 shadow-sm shadow-primary/5' 
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <span className="flex items-center gap-3">
                <Compass className="h-4 w-4 shrink-0" /> MISSION_QUESTS
              </span>
              <span className="text-[9px] text-primary bg-primary/10 px-1 rounded text-[8px] font-mono font-bold tracking-normal">MSP</span>
            </Link>
          )}

          <Link 
            href="/platform/network" 
            className={`flex items-center justify-between px-3 py-2.5 rounded transition-all group border ${
              isActive('/platform/network') 
                ? 'bg-primary/5 text-primary border-primary/30 shadow-sm shadow-primary/5' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <span className="flex items-center gap-3">
              <Users className="h-4 w-4 shrink-0" /> PEER_NETWORK
            </span>
          </Link>

          <Link 
            href="/platform/events" 
            className={`flex items-center justify-between px-3 py-2.5 rounded transition-all group border ${
              isActive('/platform/events') 
                ? 'bg-primary/5 text-primary border-primary/30 shadow-sm shadow-primary/5' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <span className="flex items-center gap-3">
              <Calendar className="h-4 w-4 shrink-0" /> SPRINT_EVENTS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0"></span>
          </Link>

          <Link 
            href="/platform/mentors" 
            className={`flex items-center justify-between px-3 py-2.5 rounded transition-all group border ${
              isActive('/platform/mentors') 
                ? 'bg-primary/5 text-primary border-primary/30 shadow-sm shadow-primary/5' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <span className="flex items-center gap-3">
              <UserSquare2 className="h-4 w-4 shrink-0" /> INDUSTRY_EXPERTS
            </span>
          </Link>

          <Link 
            href="/platform/marketplace" 
            className={`flex items-center justify-between px-3 py-2.5 rounded transition-all group border ${
              isActive('/platform/marketplace') 
                ? 'bg-primary/5 text-primary border-primary/30 shadow-sm shadow-primary/5' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <span className="flex items-center gap-3">
              <ShoppingBag className="h-4 w-4 shrink-0" /> SOLUTIONS_MARKET
            </span>
          </Link>

        </nav>
      </div>

      {/* Footer Profile Diagnostic Matrix Pin */}
      <div className="space-y-3 pt-4 border-t border-border/60">
        {profile && (
          <Link 
            href={`/platform/profile/${profile.id}`}
            className="block p-3 bg-muted/40 hover:bg-muted/70 rounded-lg space-y-2 border border-border/30 group transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold truncate tracking-tight text-foreground group-hover:text-primary transition-colors">
                {profile.fullName.toUpperCase()}
              </span>
              <span className="text-[9px] font-mono text-muted-foreground font-serif">⚙</span>
            </div>
            
            <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground">
              <span>ROLE_AUTH</span>
              <span className="text-foreground font-bold capitalize bg-background px-1.5 py-0.5 rounded border border-border/40 text-[8px]">
                {profile.role.replace('_', ' ')}
              </span>
            </div>
          </Link>
        )}
        
        <form action={logout}>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive font-mono text-xs font-bold tracking-wide h-10 hover:bg-destructive/5 rounded"
          >
            <LogOut className="h-4 w-4" /> DISCONNECT_NODE
          </Button>
        </form>
      </div>
    </aside>
  );
}
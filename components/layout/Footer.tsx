import Link from 'next/link';
import { Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-card/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div className="space-y-3">
          <span className="text-xl font-black tracking-wider text-foreground font-mono">URGE</span>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed max-w-xs">
            Built for people who build things. <br />
            No hype. Just action.
          </p>
        </div>

        {/* Pages */}
        <div>
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground mb-3">Navigate</h4>
          <ul className="space-y-2 text-xs font-mono text-muted-foreground">
            <li><Link href="/how-it-works/program" className="hover:text-foreground transition-colors">Program</Link></li>
            <li><Link href="/how-it-works/network" className="hover:text-foreground transition-colors">Network</Link></li>
            <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
            <li><Link href="/open-events" className="hover:text-foreground transition-colors">Events</Link></li>
            <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
            <li><Link href="/code-of-conduct" className="hover:text-foreground transition-colors">Code of Conduct</Link></li>
          </ul>
        </div>

        {/* System status */}
        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground tracking-widest">
            <Zap className="h-3 w-3 text-primary animate-pulse" />
            <span>THE_URGE_SYS // ONLINE</span>
          </div>
          <div className="flex gap-3 text-muted-foreground text-xs">
            <a href="#" className="hover:text-foreground transition-colors">X</a>
            <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-foreground transition-colors">YouTube</a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/40 py-4 text-center text-[10px] text-muted-foreground font-mono">
        © {new Date().getFullYear()} Urge. Built for people who build things.
      </div>
    </footer>
  );
}
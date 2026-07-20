import Link from 'next/link';
import { Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1 space-y-4">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            URGE
          </span>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            For people who build things.
            <br />
            No hype. Just action.
          </p>
          <div className="flex gap-3 pt-2">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              X
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              LinkedIn
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              YouTube
            </a>
          </div>
        </div>

        {/* Pages */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Navigate
          </h4>
          <ul className="space-y-2.5">
            <li>
              <Link href="/how-it-works/program" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Program
              </Link>
            </li>
            <li>
              <Link href="/how-it-works/network" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Network
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/open-events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Events
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Support
          </h4>
          <ul className="space-y-2.5">
            <li>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/code-of-conduct" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Code of Conduct
              </Link>
            </li>
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Status */}
        <div className="flex flex-col items-start md:items-end justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-primary animate-pulse" />
            <span className="font-medium">System Online</span>
          </div>
          <p className="text-xs text-muted-foreground/60 mt-2">
            v1.0 · {new Date().getFullYear()}
          </p>
        </div>
      </div>

      <div className="border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Urge. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/40">
            For people who build things.
          </p>
        </div>
      </div>
    </footer>
  );
}
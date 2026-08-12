// components/navigation/NavigationHeader.tsx
'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Menu, LayoutDashboard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { createClient } from '@/lib/supabase/client';

export function NavigationHeader() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();

    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    }
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navItems = [
    { label: 'Program', href: '/how-it-works/program' },
    { label: 'Blog', href: '/blog' },
    { label: 'Network', href: '/how-it-works/network' },
    { label: 'Events', href: '/open-events' },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <span className="w-2.5 h-2.5 bg-primary rounded-sm group-hover:scale-110 transition-transform" />
          <span className="text-xl font-black tracking-wider text-foreground font-mono">URGE</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full cursor-pointer"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Dynamic Auth Button: Shows Dashboard if logged in, otherwise Sign In */}
          {isAuthenticated ? (
            <Button variant="default" size="sm" className="font-bold hidden sm:flex items-center gap-1.5">
              <Link href="/platform/dashboard">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            </Button>
          ) : (
            <Button variant="default" size="sm" className="font-medium hidden sm:flex">
              <Link href="/auth">Sign In</Link>
            </Button>
          )}

          {/* Mobile Sheet Navigation */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="md:hidden h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-6">
              <div className="flex flex-col gap-6 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-border">
                  {isAuthenticated ? (
                    <Button className="w-full font-bold gap-2">
                      <Link href="/platform/dashboard" onClick={() => setMobileOpen(false)}>
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Go to Dashboard</span>
                      </Link>
                    </Button>
                  ) : (
                    <Button className="w-full font-medium">
                      <Link href="/auth" onClick={() => setMobileOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
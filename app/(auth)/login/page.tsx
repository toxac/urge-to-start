import Link from 'next/link';
import { login } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col justify-between p-4 sm:p-6 antialiased selection:bg-primary/30">
      
      {/* Dynamic Top Logo Track */}
      <header className="w-full max-w-md mx-auto text-center pt-8">
        <div className="text-2xl font-black tracking-wider text-foreground inline-flex items-center gap-2 font-mono">
          <span className="w-4 h-4 bg-primary rounded-sm animate-pulse"></span>PRAGMATIC_OS
        </div>
      </header>

      {/* Main Authenticative Form Box */}
      <Card className="w-full max-w-sm bg-card p-6 rounded-xl border border-border space-y-6 mx-auto shadow-2xl">
        
        {/* Tab Header Mode Indicators */}
        <div className="flex border-b border-border text-xs font-bold font-mono tracking-wider select-none">
          <div className="w-1/2 pb-3 text-center text-foreground border-b-2 border-primary">
            LOG_IN
          </div>
          <Link href="/signup" className="w-1/2 pb-3 text-center text-muted-foreground hover:text-foreground transition-colors">
            REGISTER_NODE
          </Link>
        </div>

        {/* Form Fields linking to authentication login action */}
        <form action={login} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 text-[11px] font-mono rounded bg-destructive/10 text-destructive border border-destructive/20">
              SYSTEM_ERROR // {error.toUpperCase()}
            </div>
          )}
          
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-muted-foreground font-bold font-mono uppercase tracking-wider text-[10px]">
              Identity Email Address
            </Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              className="w-full bg-background border border-border rounded px-3 py-2.5 font-mono focus-visible:ring-primary" 
              placeholder="name@domain.com"
              required 
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-muted-foreground font-bold font-mono uppercase tracking-wider text-[10px]">
                Secure Password Access Log
              </Label>
              <Link href="/forgot-password" className="text-[10px] text-muted-foreground hover:text-primary font-mono transition-colors">
                Forgot Key?
              </Link>
            </div>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              className="w-full bg-background border border-border rounded px-3 py-2.5 font-mono focus-visible:ring-primary" 
              placeholder="••••••••"
              required 
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded transition uppercase tracking-wider font-mono text-xs shadow-md shadow-primary/10">
              Authenticate Account
            </Button>
          </div>
        </form>
      </Card>

      {/* Minimal Footer Signature */}
      <footer className="w-full max-w-md mx-auto text-center pb-8 text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
        CORE_SYS_V1.6 // ALL PLATFORM ENTRIES SECURE
      </footer>
    </div>
  );
}
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Zap } from 'lucide-react';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function PaywallPage() {
  async function handleSimulatedPayment() {
    'use server';
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Simulate complete billing handshake -> Elevate PostgreSQL role directly to member_full
    await supabase
      .from('profiles')
      .update({ role: 'member_full' })
      .eq('id', user.id);

    redirect('/platform/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-muted/30">
      <Card className="w-full max-w-md shadow-xl border-primary/20 border-2">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary h-12 w-12 rounded-full flex items-center justify-center mb-2">
            <Zap className="h-6 w-6" />
          </div>
          <CardTitle className="text-3xl font-black tracking-tight">Unlock Your Path</CardTitle>
          <CardDescription>
            Gain instant access to real-time goals, community forums, action quests, and vetted mentors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between font-medium">
              <span>Full Program & Ecosystem Access</span>
              <span className="text-primary">$49 / mo</span>
            </div>
            <p className="text-xs text-muted-foreground">Cancel anytime. No validation presentations required. Just real action pipelines.</p>
          </div>
          <ul className="text-xs text-muted-foreground space-y-2">
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Comprehensive Goal-based Action Tracks</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Goal-linked Peer Forums</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> On-Demand Mentorship Networks</li>
          </ul>
        </CardContent>
        <CardFooter>
          <form action={handleSimulatedPayment} className="w-full">
            <Button type="submit" className="w-full size-lg text-base font-bold">
              Simulate Secure Stripe Checkout
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
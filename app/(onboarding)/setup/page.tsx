import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

export default async function ProfileSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (!profile) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-foreground selection:bg-primary/30">
        
      {/* LEFT FIELD: LEDGER ACCOUNT STATS CARD */}
      <div className="space-y-6">
        <Card className="bg-card p-6 rounded-xl border border-border text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-background border-2 border-primary rounded-full flex items-center justify-center text-xl font-black font-mono tracking-tighter shadow-inner">
            {profile.full_name?.substring(0, 2).toUpperCase() || 'FN'}
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">{profile.full_name}</h2>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mt-0.5">FOUNDER_NODE: #{profile.id.substring(0, 4).toUpperCase()}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border font-mono text-xs">
            <div className="bg-background p-2 rounded border border-border/50">
              <span className="text-muted-foreground block text-[9px] font-bold tracking-widest uppercase">Classification</span>
              <span className="text-primary font-bold text-[11px] capitalize">{profile.role.replace('_', ' ')}</span>
            </div>
            <div className="bg-background p-2 rounded border border-border/50">
              <span className="text-muted-foreground block text-[9px] font-bold tracking-widest uppercase">Onboarding</span>
              <span className="text-foreground font-bold text-[11px]">Step 0{profile.onboarding_step}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* RIGHT FIELD: SECURE DATABASE SYSTEM PREFERENCES */}
      <Card className="md:col-span-2 bg-card p-6 rounded-xl border border-border space-y-6 shadow-xl">
        <div className="border-b border-border pb-3 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono">Identity Configuration</h2>
          <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary bg-primary/5">CORE_REGISTRY</Badge>
        </div>
        
        <form className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground font-bold font-mono uppercase tracking-wider text-[10px]">Founder Alias</Label>
              <Input type="text" className="w-full bg-background border border-border font-mono text-foreground focus-visible:ring-primary" defaultValue={profile.full_name || ''} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground font-bold font-mono uppercase tracking-wider text-[10px]">Unique Network Handle</Label>
              <Input type="text" className="w-full bg-background border border-border font-mono text-foreground focus-visible:ring-primary" defaultValue={`@${profile.username || ''}`} disabled />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground font-bold font-mono uppercase tracking-wider text-[10px]">Operational City</Label>
              <Input type="text" className="w-full bg-background border border-border font-mono text-foreground focus-visible:ring-primary" defaultValue={profile.city || ''} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground font-bold font-mono uppercase tracking-wider text-[10px]">Country Region</Label>
              <Input type="text" className="w-full bg-background border border-border font-mono text-foreground focus-visible:ring-primary" defaultValue={profile.country || ''} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-muted-foreground font-bold font-mono uppercase tracking-wider text-[10px]">Ecosystem Biography Matrix</Label>
            <Textarea className="w-full bg-background border border-border font-mono text-foreground focus-visible:ring-primary min-h-[80px]" defaultValue={profile.description || ''} />
          </div>

          {/* TELEMETRY SETTINGS SECTIONS */}
          <div className="pt-4 border-t border-border space-y-3">
            <h3 className="text-[10px] font-bold font-mono uppercase tracking-widest text-muted-foreground">Ecosystem Diagnostics</h3>
            <div className="flex items-center justify-between bg-background p-3 rounded border border-border">
              <div className="space-y-0.5">
                <span className="text-foreground font-bold block text-xs">Active Accountability Subscriptions</span>
                <span className="text-muted-foreground text-[10px] font-mono">Allows background routing logic to track event deadlines.</span>
              </div>
              <input type="checkbox" defaultChecked className="accent-primary h-4 w-4 cursor-pointer" />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded transition font-mono text-xs uppercase tracking-wider shadow-md shadow-primary/10">
              Save Node Matrix
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
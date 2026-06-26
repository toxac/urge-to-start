import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function ProfileSettingsPage({ searchParams }: PageProps) {
  const sParams = await searchParams;
  const id = sParams.id;

  if (!id) notFound();

  const supabase = await createClient();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (!profile) notFound();

  return (
    <div className="min-h-screen w-full bg-[#F9F7F4] text-[#1A1A1A] font-sans antialiased selection:bg-[#E86A33]/20">
      <main className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">

        {/* LEFT & CENTER INTERACTION CANVAS (70% Screen visual weighting target) */}
        <div className="lg:col-span-2 space-y-8 text-left">
          <div className="space-y-1.5 text-left max-w-xl">
            <h1 className="text-xl font-serif font-bold tracking-tight text-[#1A1A1A]">
              Let's get you set up.
            </h1>
            <p className="text-xs text-[#8C8580] leading-relaxed max-w-md font-medium">
              We’ve kept this simple—just one small step at a time, so you never feel lost. As you move through each one, you’ll get real feedback from our community, share your progress out loud, and hear from people who’ve actually built things before.
            </p>
          </div>

          <form className="space-y-6 text-xs max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[#8C8580] font-bold text-[10px] uppercase tracking-wider">Your Full Name</Label>
                <Input type="text" className="w-full h-10 bg-background border border-[#8C8580]/20 rounded-xl px-3" defaultValue={profile.full_name || ''} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[#8C8580] font-bold text-[10px] uppercase tracking-wider opacity-50">Username Handle</Label>
                <Input type="text" className="w-full h-10 bg-muted/40 border border-[#8C8580]/10 rounded-xl px-3 opacity-60" defaultValue={`@${profile.username || ''}`} disabled />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[#8C8580] font-bold text-[10px] uppercase tracking-wider">Operational City</Label>
                <Input type="text" className="w-full h-10 bg-background border border-[#8C8580]/20 rounded-xl px-3" defaultValue={profile.city || ''} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[#8C8580] font-bold text-[10px] uppercase tracking-wider">Country Region</Label>
                <Input type="text" className="w-full h-10 bg-background border border-[#8C8580]/20 rounded-xl px-3" defaultValue={profile.country || ''} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[#8C8580] font-bold text-[10px] uppercase tracking-wider">What types of software or local services do you interact with most?</Label>
              <Textarea className="w-full bg-background border border-[#8C8580]/20 rounded-xl p-3 min-h-[100px] resize-none leading-relaxed" placeholder="This helps us seed your observation logs with the right industry categories..." defaultValue={profile.description || ''} />
            </div>

            {/* THE MOAT: Perfect space buffer separating operational actions */}
            <div className="pt-6 flex justify-start">
              <Button type="submit" className="px-8 h-11 bg-[#E86A33] hover:bg-[#D35925] text-white font-bold rounded-xl transition uppercase tracking-wider text-xs shadow-md shadow-[#E86A33]/10">
                Lock Alignment & Advance
              </Button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Manifesto Quote Frame (Repetition Principle Container) */}
        <div className="hidden lg:block border-l border-[#8C8580]/10 pl-10 space-y-6">
          <div className="p-6 bg-[#8C8580]/5 rounded-2xl border border-[#8C8580]/10 space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]">
              The Urge Standard
            </h4>
            <p className="text-xs text-[#8C8580] leading-relaxed italic font-medium">
              "We don't fall in love with our ideas; we fall in love with the problems our customers have. We seek friction, frustration, and despair, because within them lie the seeds of the greatest opportunities."
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
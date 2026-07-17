// app/(platform)/layout.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { StoreHydrator } from '@/components/providers/StoreHydrator';
import { SidebarComponent } from '@/components/layout/Sidebar'; 
import { KipSidebarCompanion } from '@/components/program/kip/KipSidebarCompanion';

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const [profileResponse, progressResponse] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('user_progress').select('*').eq('user_id', user.id)
  ]);

  return (
    <div className="w-full h-screen flex bg-background text-foreground antialiased overflow-hidden relative">
      <StoreHydrator 
        initialProgress={(progressResponse.data as any) || []} 
        initialProfile={profileResponse.data as any} 
      />

      <SidebarComponent />

      {/* CENTER AREA: Takes 100% of the screen space on mobile/tablets, then centers out nicely on desktop */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col min-w-0 pt-14 md:pt-0">
        <main className="flex-1 p-5 md:p-10 max-w-4xl w-full mx-auto pb-24">
          {children}
        </main>
      </div>

      {/* RIGHT AREA: Handles desktop columns, floating tabs, and bottom sheet triggers automatically */}
      <KipSidebarCompanion />
    </div>
  );
}
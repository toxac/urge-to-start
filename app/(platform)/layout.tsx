// app/(platform)/layout.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { StoreHydrator } from '@/components/providers/StoreHydrator';
import { SidebarComponent } from '@/components/layout/Sidebar'; 

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth');
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

      {/* Main Left Navigation */}
      <SidebarComponent />

      {/* CENTER VIEWPORT AREA */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col min-w-0 pt-14 md:pt-0">
        <main className="flex-1 p-5 md:p-10 max-w-5xl w-full mx-auto pb-24">
          {children}
        </main>
      </div>
    </div>
  );
}
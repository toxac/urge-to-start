import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server'; // Assumes you have standard server-side utility helpers
import { StoreHydrator } from '@/components/providers/StoreHydrator';
import { SidebarNavigation } from '@/components/program/SidebarNavigation'; // Placeholder for dashboard frame menus
import { KipSidebarCompanion } from '@/components/program/KipSidebarCompanion'; // Track 1 companion UI location hook

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Verify credentials instantly on the edge
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // 2. Fetch both critical datasets in parallel on the server
  const [profileResponse, progressResponse] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('user_progress').select('*').eq('user_id', user.id)
  ]);

  return (
    <div className="w-full h-screen flex overflow-hidden bg-background">
      {/* Client Bridge Injector: Hydrates atoms instantly with server data */}
      <StoreHydrator 
        initialProgress={(progressResponse.data as any) || []} 
        initialProfile={profileResponse.data as any} 
      />

      {/* Global Application Nav Sidebar Frame */}
      <SidebarNavigation />

      {/* Primary Workspace Scroll Module */}
      <div className="flex-1 h-full overflow-y-auto p-6 md:p-8">
        <div className="max-w-5xl mx-auto w-full pb-20">
          {children}
        </div>
      </div>

      {/* Track 1 Ambient Advisor Side Panel Frame */}
      <KipSidebarCompanion />
    </div>
  );
}
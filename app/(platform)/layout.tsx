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

  const profile = profileResponse.data;

  if (!profile) {
    redirect('/auth');
  }

  if (profile.onboarding_step !== 'completed') {
    redirect(`/setup`);
  }

  const userRoles = (profile.roles as string[]) || [];
  const hasAccess = userRoles.some((role) =>
    ['trial', 'member', 'mentor', 'superadmin'].includes(role)
  );

  if (!hasAccess) {
    redirect('/payment');
  }

  return (
    <div className="w-full h-screen flex bg-background text-foreground antialiased overflow-hidden relative">
      <StoreHydrator 
        initialProgress={(progressResponse.data as any) || []} 
        initialProfile={profile as any} 
      />

      {/* Main Left Navigation */}
      <SidebarComponent />

      {/* CENTER & RIGHT VIEWPORT AREA - Full Width */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col min-w-0">
        <main className="flex-1 w-full h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
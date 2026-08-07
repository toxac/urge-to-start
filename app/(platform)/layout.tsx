// app/(platform)/layout.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { StoreHydrator } from '@/components/providers/StoreHydrator';
import { SidebarComponent } from '@/components/layout/Sidebar'; 
import { urgePlaybook } from '@/lib/playbook';

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

  // Fetch only dynamic user profile & progress records from Supabase
  const [profileRes, progressRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('user_progress').select('*').eq('user_id', user.id),
  ]);

  const profile = profileRes.data;
  if (!profile) redirect('/auth');

  if (profile.onboarding_step !== 'completed') {
    redirect('/setup');
  }

  const userRoles = (profile.roles as string[]) || [];
  const hasAccess = userRoles.some((role) =>
    ['trial', 'member', 'mentor', 'superadmin'].includes(role)
  );

  if (!hasAccess) redirect('/payment');

  return (
    <div className="w-full h-screen flex bg-background text-foreground antialiased overflow-hidden relative">
      {/* Hydrates progress, profile, and static playbook instantly into client memory */}
      <StoreHydrator 
        initialProgress={(progressRes.data as any) || []} 
        initialProfile={profile as any}
        initialPlaybook={urgePlaybook}
      />

      {/* Main Navigation Sidebar */}
      <SidebarComponent />

      {/* Center & Right Viewport Area */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col min-w-0">
        <main className="flex-1 w-full h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
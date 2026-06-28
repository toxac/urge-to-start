// app/auth/layout.tsx
import { NavigationHeader } from '@/components/layout/NavBar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NavigationHeader variant="auth" />
      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>
    </div>
  );
}
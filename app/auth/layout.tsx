// app/auth/layout.tsx
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { NavigationHeader } from '@/components/layout/NavBar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Suspense 
        fallback={
          <div className="flex flex-col items-center justify-center space-y-2 animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">Initializing Workspace Node...</span>
          </div>
        }
      >
      <NavigationHeader />
      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>
      </Suspense>
    </div>
  );
}
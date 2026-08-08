// app/(platform)/program/layout.tsx
import React from 'react';
import { ComplementarySidebar } from '@/components/program/ComplementarySidebar';

export default function ProgramSubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full flex min-w-0 relative">
      {/* Program Main Work Area */}
      <div className="flex-1 h-full min-w-0 px-5 lg:max-w-5xl lg:mx-auto">
        {children}
      </div>

      {/* Program Complementary Context Panel (Right Sidebar) */}
      <ComplementarySidebar />
    </div>
  );
}
// app/(platform)/dashboard/page.tsx
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard! Here you can manage your settings and view your activity.</p>
      <Link
              href="/program"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group font-medium"
            >
              Go to Program
              
            </Link>
    </div>
  );
}
'use client';
// components/auth/LoginCard.tsx
import React, { useState } from 'react';
import { login } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export function LoginCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await login(formData);
    } catch (err: any) {
      setError(err?.message || "Invalid credentials provided.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="p-3 text-[11px] font-medium rounded-xl bg-destructive/10 border border-destructive/25 text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="login-email" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
            Email Address
          </Label>
          <Input
            id="login-email"
            name="email"
            type="email"
            disabled={loading}
            className="w-full bg-background border-border rounded-xl px-3 h-10 text-foreground"
            placeholder="name@domain.com"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="login-password" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
            Access Password
          </Label>
          <Input
            id="login-password"
            name="password"
            type="password"
            disabled={loading}
            className="w-full bg-background border-border rounded-xl px-3 h-10 text-foreground"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition uppercase tracking-wider text-xs shadow-md shadow-primary/10 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {loading ? 'Verifying Identity...' : 'Enter Workspace'}
          </Button>
        </div>
      </form>
    </div>
  );
}
'use client';

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
    <div className="bg-[#F9F7F4] border border-[#8C8580]/15 rounded-2xl p-8 shadow-[0_4px_24px_rgba(140,133,128,0.03)] animate-in fade-in duration-200 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="p-3 text-[11px] font-medium rounded-xl bg-red-500/5 border border-red-500/25 text-red-600 animate-in shake">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="login-email" className="text-[#8C8580] font-bold text-[10px] uppercase tracking-wider">
            Email Address
          </Label>
          <Input 
            id="login-email" 
            name="email" 
            type="email" 
            disabled={loading}
            className="w-full bg-background border border-[#8C8580]/20 rounded-xl px-3 h-10 text-[#1A1A1A]" 
            placeholder="name@domain.com"
            required 
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="login-password" className="text-[#8C8580] font-bold text-[10px] uppercase tracking-wider">
            Access Password
          </Label>
          <Input 
            id="login-password" 
            name="password" 
            type="password" 
            disabled={loading}
            className="w-full bg-background border border-[#8C8580]/20 rounded-xl px-3 h-10 text-[#1A1A1A]" 
            placeholder="••••••••"
            required 
          />
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-11 bg-[#E86A33] hover:bg-[#D35925] text-white font-bold rounded-xl transition uppercase tracking-wider text-xs shadow-md shadow-[#E86A33]/10 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {loading ? 'Verifying Identity...' : 'Enter Workspace'}
          </Button>
        </div>
      </form>
    </div>
  );
}
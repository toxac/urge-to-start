// components/auth/SignupCard.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { checkUsernameAvailability, signup } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface SignupCardProps {
  switchToLogin: () => void;
}

export function SignupCard({ switchToLogin }: SignupCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Real-time username state management
  const [username, setUsername] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'available' | 'taken'>('idle');

  // Debounce username lookup
  useEffect(() => {
    if (username.trim().length < 3) {
      setUsernameStatus('idle');
      return;
    }

    setUsernameLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const isAvailable = await checkUsernameAvailability(username);
        setUsernameStatus(isAvailable ? 'available' : 'taken');
      } catch {
        setUsernameStatus('idle');
      } finally {
        setUsernameLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (usernameStatus === 'taken') {
      setError("Please resolve your unique handle before entering the sequence.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await signup(formData);
    } catch (err: any) {
      setError(err?.message || "Registration trace failed to compile.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F9F7F4] border border-[#8C8580]/15 rounded-2xl p-8 shadow-[0_4px_24px_rgba(140,133,128,0.03)] animate-in fade-in duration-200 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="p-3 text-[11px] font-medium rounded-xl bg-red-500/5 border border-red-500/25 text-red-600">
            {error}
          </div>
        )}

        {/* ⚡ REAL-TIME USERNAME TRACKING INTERFACE */}
        <div className="space-y-1.5 relative">
          <Label htmlFor="signup-username" className="text-[#8C8580] font-bold text-[10px] uppercase tracking-wider">
            Choose a Unique Handle
          </Label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-[#8C8580] font-semibold text-xs select-none">@</span>
            <Input
              id="signup-username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))} // fixed typo: 0-9
              disabled={loading}
              className="w-full bg-background border border-[#8C8580]/20 rounded-xl pl-7 pr-10 h-10 text-[#1A1A1A]"
              placeholder="username"
              required
            />

            <div className="absolute right-3 flex items-center">
              {usernameLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8C8580]" />}
              {!usernameLoading && usernameStatus === 'available' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
              {!usernameLoading && usernameStatus === 'taken' && <XCircle className="w-3.5 h-3.5 text-red-500" />}
            </div>
          </div>
          {usernameStatus === 'taken' && (
            <p className="text-[10px] text-red-500 font-medium">This handle is currently claimed by another builder.</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-email" className="text-[#8C8580] font-bold text-[10px] uppercase tracking-wider">
            Email Address
          </Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            disabled={loading}
            className="w-full bg-background border border-[#8C8580]/20 rounded-xl px-3 h-10 text-[#1A1A1A]"
            placeholder="name@domain.com"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-password" className="text-[#8C8580] font-bold text-[10px] uppercase tracking-wider">
            Access Password
          </Label>
          <Input
            id="signup-password"
            name="password"
            type="password"
            disabled={loading}
            className="w-full bg-background border border-[#8C8580]/20 rounded-xl px-3 h-10 text-[#1A1A1A]"
            placeholder="Minimum 8 characters"
            required
          />
        </div>

        {/* Newsletter Opt-in */}
        <div className="pt-2 flex items-start gap-2.5">
          <input
            type="checkbox"
            id="signup-newsletter"
            name="newsletter"
            defaultChecked
            disabled={loading}
            className="accent-[#E86A33] h-4 w-4 rounded border-[#8C8580]/30 mt-0.5 cursor-pointer"
          />
          <label htmlFor="signup-newsletter" className="text-[#8C8580] leading-normal font-medium select-none cursor-pointer">
            Receive practical case studies and strategic problem logs. No spam.
          </label>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={loading || usernameStatus === 'taken' || usernameLoading}
            className="w-full h-11 bg-[#E86A33] hover:bg-[#D35925] text-white font-bold rounded-xl transition uppercase tracking-wider text-xs shadow-md shadow-[#E86A33]/10 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {loading ? 'Initializing Flow...' : 'Begin the Quests'}
          </Button>
        </div>
      </form>
    </div>
  );
}
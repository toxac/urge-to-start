// components/auth/SignupCard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { checkUsernameAvailability, signup } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, XCircle, MailCheck } from 'lucide-react';

export function SignupCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSentTo, setEmailSentTo] = useState<string | null>(null);

  const [username, setUsername] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'available' | 'taken'>('idle');

  useEffect(() => {
    if (username.trim().length < 3) {
      setUsernameStatus('idle');
      return;
    }

    setUsernameLoading(true);
    const timer = setTimeout(async () => {
      try {
        const isAvailable = await checkUsernameAvailability(username);
        setUsernameStatus(isAvailable ? 'available' : 'taken');
      } catch {
        setUsernameStatus('idle');
      } finally {
        setUsernameLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (usernameStatus === 'taken') {
      setError('Please choose a unique handle to continue.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const formEmail = formData.get('email') as string;

    const result = await signup(formData);

    if (result && 'error' in result) {
      setError(result.error ?? 'An unexpected registration error occurred.');
      setLoading(false);
      return;
    }

    setEmailSentTo(formEmail);
    setLoading(false);
  };

  if (emailSentTo) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 shadow-lg text-center space-y-5 animate-in fade-in duration-300">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <MailCheck className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-serif font-bold text-foreground">Check your inbox.</h3>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium px-2">
            We sent a verification link to <strong className="text-foreground">{emailSentTo}</strong>. Click that link to complete your setup.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-6 animate-in fade-in duration-200 text-left">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="p-3 text-[11px] font-medium rounded-xl bg-destructive/10 border border-destructive/25 text-destructive">
            {error}
          </div>
        )}

        {/* Username Input with Live Status Badge */}
        <div className="space-y-1.5 relative">
          <div className="flex items-center justify-between">
            <Label htmlFor="signup-username" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
              Choose Unique Handle
            </Label>
            
            {/* Live Indicator */}
            {usernameLoading && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Checking...
              </span>
            )}
            {!usernameLoading && usernameStatus === 'available' && (
              <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Handle available
              </span>
            )}
            {!usernameLoading && usernameStatus === 'taken' && (
              <span className="text-[10px] font-bold text-destructive flex items-center gap-1">
                <XCircle className="w-3 h-3" /> Handle taken
              </span>
            )}
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-3 text-muted-foreground font-semibold text-xs select-none">@</span>
            <Input
              id="signup-username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
              required
              className={`w-full pl-7 ${
                usernameStatus === 'available' ? 'border-emerald-500 focus-visible:ring-emerald-500' : ''
              } ${usernameStatus === 'taken' ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              placeholder="username"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-email" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
            Email Address
          </Label>
          <Input id="signup-email" name="email" type="email" required placeholder="name@domain.com" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-password" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
            Access Password
          </Label>
          <Input id="signup-password" name="password" type="password" required placeholder="••••••••" />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={loading || usernameStatus === 'taken' || usernameLoading}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition uppercase tracking-wider text-xs shadow-md shadow-primary/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            {loading ? 'Creating Account...' : 'Start Your Journey'}
          </Button>
        </div>
      </form>
    </div>
  );
}
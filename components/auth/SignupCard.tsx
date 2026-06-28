'use client';

import React, { useState, useEffect } from 'react';
import { checkUsernameAvailability, signup } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle, MailCheck } from 'lucide-react';

export function SignupCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSentTo, setEmailSentTo] = useState<string | null>(null); // New confirmation state flag

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
      setError("Please choose a unique handle to continue.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const formEmail = formData.get('email') as string;
    
    const result = await signup(formData);

    if (result && 'error' in result) {
      setError(result.error ?? "An unexpected registration error occurred.");
      setLoading(false);
      return;
    }

    // ⚡ SUCCESS: Freeze form view and render the validation guidance block
    setEmailSentTo(formEmail);
    setLoading(false);
  };

  // ✉️ Clean, Conversational On-screen Verification Box
  if (emailSentTo) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 shadow-lg text-center space-y-5 animate-in fade-in duration-300">
        <div className="mx-auto w-12 h-12 rounded-full bg-[#E86A33]/5 flex items-center justify-center text-[#E86A33]">
          <MailCheck className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-serif font-bold text-foreground">Check your inbox.</h3>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium px-2">
            We just sent a verification link to <strong className="text-foreground">{emailSentTo}</strong>. 
            Click that link to verify your account, and we&rsquo;ll drop you straight into your profile setup.
          </p>
          <p className="text-[11px] text-[#8C8580] leading-relaxed pt-2 border-t border-border/40 font-medium italic">
            Can&rsquo;t find it? Give it a minute and check your <strong className="text-foreground font-semibold">spam folder</strong> just in case it got misrouted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-6 animate-in fade-in duration-200">
      {/* ... Form input blocks remain unchanged ... */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="p-3 text-[11px] font-medium rounded-xl bg-destructive/10 text-destructive">{error}</div>
        )}

        <div className="space-y-1.5 relative">
          <Label htmlFor="signup-username" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">Choose a Unique Handle</Label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-muted-foreground font-semibold text-xs select-none">@</span>
            <Input id="signup-username" name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))} required className="w-full pl-7" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-email" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">Email Address</Label>
          <Input id="signup-email" name="email" type="email" required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-password" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">Access Password</Label>
          <Input id="signup-password" name="password" type="password" required />
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={loading || usernameStatus === 'taken' || usernameLoading} className="w-full bg-[#E86A33] hover:bg-[#D35925] text-white">
            {loading ? 'Creating Account...' : 'Start Your Journey'}
          </Button>
        </div>
      </form>
    </div>
  );
}
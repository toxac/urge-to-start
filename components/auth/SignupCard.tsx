// components/auth/SignupCard.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { checkUsernameAvailability, signup, completeProfile } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SignupCardProps {
  switchToLogin: () => void;
}

export function SignupCard({ switchToLogin }: SignupCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Normal signup fields
  const [username, setUsername] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'available' | 'taken'>('idle');

  // Step 2: Profile completion (triggered when signup succeeds but profile creation fails)
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [completionUsername, setCompletionUsername] = useState('');
  const [completionLoading, setCompletionLoading] = useState(false);

  // Debounce for username availability (step 1)
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

  // Step 1: Handle initial signup
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (usernameStatus === 'taken') {
      setError("Please choose a different username.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);

    if ('error' in result && typeof result.error === 'string') {
  setError(result.error);
  setLoading(false);
  return;
}

    // result: { userId, profileCreated }
    if (result.profileCreated) {
      // Success – redirect to setup
      router.push(`/setup?id=${result.userId}`);
    } else {
      // Profile not created – show completion step
      setUserId(result.userId);
      setProfileIncomplete(true);
      setLoading(false);
      // Pre-fill the username field with the one they already chose
      setCompletionUsername(username);
    }
  };

  // Step 2: Handle profile completion
  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (completionUsername.trim().length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    setCompletionLoading(true);
    setError(null);

    try {
      const result = await completeProfile(userId, completionUsername);
      if (result.success) {
        router.push(`/setup?id=${userId}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to complete profile.');
      setCompletionLoading(false);
    }
  };

  // If profile is incomplete, show the completion form
  if (profileIncomplete) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-sm font-bold text-foreground">Almost there!</h3>
          <p className="text-xs text-muted-foreground">
            We couldn’t create your profile automatically. Please choose a unique username to finish.
          </p>
        </div>
        <form onSubmit={handleCompleteProfile} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 text-[11px] font-medium rounded-xl bg-destructive/10 border border-destructive/25 text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-1.5 relative">
            <Label htmlFor="complete-username" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
              Choose a Unique Handle
            </Label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-muted-foreground font-semibold text-xs select-none">@</span>
              <Input
                id="complete-username"
                type="text"
                value={completionUsername}
                onChange={(e) => setCompletionUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                disabled={completionLoading}
                className="w-full bg-background border-border rounded-xl pl-7 pr-10 h-10 text-foreground"
                placeholder="username"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={completionLoading || completionUsername.trim().length < 3}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition uppercase tracking-wider text-xs shadow-md shadow-primary/10 flex items-center justify-center gap-2"
          >
            {completionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {completionLoading ? 'Saving...' : 'Complete Profile'}
          </Button>
          <button
            type="button"
            onClick={() => {
              setProfileIncomplete(false);
              setUserId(null);
              setError(null);
            }}
            className="text-xs text-muted-foreground underline mt-2 block text-center"
          >
            Go back
          </button>
        </form>
      </div>
    );
  }

  // Normal signup form (step 1)
  return (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="p-3 text-[11px] font-medium rounded-xl bg-destructive/10 border border-destructive/25 text-destructive">
            {error}
          </div>
        )}

        {/* Username with live validation */}
        <div className="space-y-1.5 relative">
          <Label htmlFor="signup-username" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
            Choose a Unique Handle
          </Label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-muted-foreground font-semibold text-xs select-none">@</span>
            <Input
              id="signup-username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
              disabled={loading}
              className="w-full bg-background border-border rounded-xl pl-7 pr-10 h-10 text-foreground"
              placeholder="username"
              required
            />
            <div className="absolute right-3 flex items-center">
              {usernameLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
              {!usernameLoading && usernameStatus === 'available' && <CheckCircle className="w-3.5 h-3.5 text-green-600" />}
              {!usernameLoading && usernameStatus === 'taken' && <XCircle className="w-3.5 h-3.5 text-destructive" />}
            </div>
          </div>
          {usernameStatus === 'taken' && (
            <p className="text-[10px] text-destructive font-medium">This handle is currently claimed by another builder.</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-email" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
            Email Address
          </Label>
          <Input
            id="signup-email"
            name="email"
            type="email"
            disabled={loading}
            className="w-full bg-background border-border rounded-xl px-3 h-10 text-foreground"
            placeholder="name@domain.com"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-password" className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
            Access Password
          </Label>
          <Input
            id="signup-password"
            name="password"
            type="password"
            disabled={loading}
            className="w-full bg-background border-border rounded-xl px-3 h-10 text-foreground"
            placeholder="Minimum 8 characters"
            required
          />
        </div>

        {/* Newsletter Opt‑in */}
        <div className="pt-2 flex items-start gap-2.5">
          <input
            type="checkbox"
            id="signup-newsletter"
            name="newsletter"
            defaultChecked
            disabled={loading}
            className="accent-primary h-4 w-4 rounded border-border/30 mt-0.5 cursor-pointer"
          />
          <label htmlFor="signup-newsletter" className="text-muted-foreground leading-normal font-medium select-none cursor-pointer">
            Receive practical case studies and strategic problem logs. No spam.
          </label>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={loading || usernameStatus === 'taken' || usernameLoading}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition uppercase tracking-wider text-xs shadow-md shadow-primary/10 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {loading ? 'Creating Account...' : 'Start Your Journey'}
          </Button>
        </div>
      </form>
    </div>
  );
}
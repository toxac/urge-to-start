// app/auth/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoginCard } from '@/components/auth/LoginCard';
import { SignupCard } from '@/components/auth/SignupCard';

export default function AuthenticatePage() {
  const searchParams = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    // 1. Store intent cookie if passed in URL (?intent=free or ?intent=member)
    const urlIntent = searchParams.get('intent');
    if (urlIntent) {
      document.cookie = `urge_signup_intent=${urlIntent}; path=/; max-age=1800; SameSite=Strict`;
    }
    
    // 2. Automatically default to signup if view=signup or intent is present
    const viewParam = searchParams.get('view');
    if (viewParam === 'signup' || urlIntent) {
      setIsSignUp(true);
    } else if (viewParam === 'login') {
      setIsSignUp(false);
    }
  }, [searchParams]);

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      {/* Dynamic Header Message */}
      <div className="text-center space-y-1 max-w-sm mx-auto">
        {!isSignUp ? (
          <>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Welcome back, builder.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed font-normal px-4">
              Log in to continue your quests and track your progress.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Stop overthinking and just start.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed font-normal px-4">
              Join a group of doers who are tired of waiting for permission. Find real problems and sell to real customers.
            </p>
          </>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-border/40 text-xs font-bold tracking-wider max-w-xs mx-auto">
        <button
          type="button"
          onClick={() => setIsSignUp(false)}
          className={`w-1/2 pb-3 text-center transition-all cursor-pointer ${
            !isSignUp ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground opacity-60'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setIsSignUp(true)}
          className={`w-1/2 pb-3 text-center transition-all cursor-pointer ${
            isSignUp ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground opacity-60'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Auth Card View */}
      <div className="transition-all duration-300 ease-in-out">
        {!isSignUp ? <LoginCard /> : <SignupCard />}
      </div>
    </div>
  );
}
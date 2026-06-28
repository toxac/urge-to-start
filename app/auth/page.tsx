'use client';
// app/auth/page.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoginCard } from '@/components/auth/LoginCard';
import { SignupCard } from '@/components/auth/SignupCard';

export default function AuthenticatePage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // ⚡ Catch their intent context parameter (?intent=free or ?intent=paid)
    const urlIntent = searchParams.get('intent');
    if (urlIntent) {
      document.cookie = `urge_signup_intent=${urlIntent}; path=/; max-age=1800; SameSite=Strict`;
    }
    
    // Auto-toggle view if they hit a signup path trigger
    if (searchParams.get('view') === 'signup') {
      setIsSignUp(true);
    }
  }, [searchParams]);

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      {/* Header Message – now above the tab selector */}
      <div className="text-center space-y-1 max-w-sm mx-auto">
        {!isSignUp ? (
          <>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Welcome back, builder.
            </h2>
            <p className="text-md text-muted-foreground leading-relaxed font-regular px-4">
              Log in to continue your quests and track your progress.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Stop overthinking and just start.
            </h2>
            <p className="text-md text-muted-foreground leading-relaxed font-regular px-4">
              You’re joining a group of tinkerers and doers who are tired of waiting for permission. No pitch decks and endless analysis, you will find and solve problems and sell it to real customers.
            </p>
          </>
        )}
      </div>

      {/* Asymmetrical Tab Selector */}
      <div className="flex border-b border-border/40 text-xs font-bold tracking-wider max-w-xs mx-auto">
        <button
          onClick={() => setIsSignUp(false)}
          className={`w-1/2 pb-3 text-center transition-all ${
            !isSignUp
              ? 'text-foreground border-b-2 border-primary'
              : 'text-muted-foreground opacity-60'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsSignUp(true)}
          className={`w-1/2 pb-3 text-center transition-all ${
            isSignUp
              ? 'text-foreground border-b-2 border-primary'
              : 'text-muted-foreground opacity-60'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Dynamic Client Switching Engine */}
      <div className="transition-all duration-300 ease-in-out">
        {!isSignUp ? (
          <LoginCard />
        ) : (
          <SignupCard />
        )}
      </div>
    </div>
  );
}
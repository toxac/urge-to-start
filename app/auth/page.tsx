// app/auth/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoginCard } from '@/components/auth/LoginCard';
import { SignupCard } from '@/components/auth/SignupCard';
import { Loader2 } from 'lucide-react';

function AuthenticateContent() {
  const searchParams = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    // 1. Read query parameters synchronously via hook
    const urlIntent = searchParams.get('intent');
    if (urlIntent) {
      document.cookie = `urge_signup_intent=${urlIntent}; path=/; max-age=1800; SameSite=Strict`;
    }

    const viewParam = searchParams.get('view');
    if (viewParam === 'signup' || urlIntent) {
      setIsSignUp(true);
    } else if (viewParam === 'login') {
      setIsSignUp(false);
    }
  }, [searchParams]);

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      {/* Dynamic Header */}
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

export default function AuthenticatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center p-12 space-y-2 animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
            Initializing Auth Portal...
          </span>
        </div>
      }
    >
      <AuthenticateContent />
    </Suspense>
  );
}
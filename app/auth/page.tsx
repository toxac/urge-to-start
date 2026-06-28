'use client';
// app/auth/page.tsx
import React, { useState } from 'react';
import { LoginCard } from '@/components/auth/LoginCard';
import { SignupCard } from '@/components/auth/SignupCard';

export default function AuthenticatePage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      {/* Asymmetrical Tab Selector */}
      <div className="flex border-b border-[#8C8580]/10 text-xs font-bold tracking-wider max-w-xs mx-auto">
        <button 
          onClick={() => setIsSignUp(false)}
          className={`w-1/2 pb-3 text-center transition-all ${!isSignUp ? 'text-[#1A1A1A] border-b-2 border-[#E86A33]' : 'text-[#8C8580] opacity-60'}`}
        >
          Sign In
        </button>
        <button 
          onClick={() => setIsSignUp(true)}
          className={`w-1/2 pb-3 text-center transition-all ${isSignUp ? 'text-[#1A1A1A] border-b-2 border-[#E86A33]' : 'text-[#8C8580] opacity-60'}`}
        >
          Create Account
        </button>
      </div>

      {/* Header Message – now controlled by isSignUp */}
      <div className="text-center space-y-1 max-w-sm mx-auto">
        {!isSignUp ? (
          <>
            <h2 className="text-sm font-bold tracking-tight text-[#1A1A1A]">
              Welcome back, builder.
            </h2>
            <p className="text-xs text-[#8C8580] leading-relaxed font-medium px-4">
              Log in to continue your quests and track your progress.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-sm font-bold tracking-tight text-[#1A1A1A]">
              Stop overthinking and just start.
            </h2>
            <p className="text-xs text-[#8C8580] leading-relaxed font-medium px-4">
              You’re joining a group of tinkerers and doers who are tired of waiting for permission. No pitch decks and endless analysis, you will find and solve problems and sell it to real customers.
            </p>
          </>
        )}
      </div>

      {/* Dynamic Client Switching Engine */}
      <div className="transition-all duration-300 ease-in-out">
        {!isSignUp ? (
          <LoginCard />
        ) : (
          <SignupCard switchToLogin={() => setIsSignUp(false)} />
        )}
      </div>
    </div>
  );
}
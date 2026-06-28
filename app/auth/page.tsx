'use client';

import React, { useState } from 'react';
import { LoginCard } from '@/components/auth/LoginCard';
import { SignupCard } from '@/components/auth/SignupCard';

export default function AuthenticatePage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#F9F7F4] text-[#1A1A1A] font-sans antialiased flex flex-col justify-between p-6 selection:bg-[#E86A33]/20">
      
      {/* Centered Poetic Wordmark */}
      <header className="w-full text-center pt-8 shrink-0">
        <div className="text-2xl font-serif font-black tracking-tight text-[#1A1A1A]">
          The Urge
        </div>
        <p className="text-[10px] uppercase font-bold tracking-widest text-[#8C8580] mt-1">
          A Compass for Practical Builders
        </p>
      </header>

      {/* Main Animation/State Wrapper Box */}
      <div className="w-full max-w-sm mx-auto my-auto space-y-6">
        
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

        {/* Dynamic Client Switching Engine */}
        <div className="transition-all duration-300 ease-in-out">
          {!isSignUp ? (
            <LoginCard />
          ) : (
            <SignupCard switchToLogin={() => setIsSignUp(false)} />
          )}
        </div>
      </div>

      {/* Footer Manifesto Anchor Line */}
      <footer className="w-full text-center pb-8 text-[10px] text-[#8C8580] tracking-widest uppercase font-medium shrink-0">
        Listen to the Urge. Let's Build.
      </footer>
    </div>
  );
}
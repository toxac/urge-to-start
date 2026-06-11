'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function UsernameInput({ defaultValue = '' }: { defaultValue?: string }) {
  const supabase = createClient();
  const [username, setUsername] = useState(defaultValue);
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'too-short'>('idle');

  useEffect(() => {
    if (!username) {
      setStatus('idle');
      return;
    }

    if (username.length < 3) {
      setStatus('too-short');
      return;
    }

    setStatus('checking');

    // Debounce the database query by 400ms to save API calls
    const delayDebounceFn = setTimeout(async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase().trim())
        .maybeSingle();

      if (!error) {
        setStatus(data ? 'taken' : 'available');
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [username, supabase]);

  return (
    <div className="space-y-2">
      <Label htmlFor="username">Create Your Unique Founder Handle</Label>
      <div className="relative">
        <Input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))} // Clean URL friendly strings
          placeholder="e.g., jane_builds"
          className="pr-10 font-mono text-sm"
          required
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {status === 'checking' && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {status === 'available' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
          {status === 'taken' && <XCircle className="h-4 w-4 text-destructive" />}
        </div>
      </div>
      
      {/* Dynamic helper text states */}
      {status === 'taken' && <p className="text-xs text-destructive font-medium">This handle is already claimed by another founder.</p>}
      {status === 'available' && <p className="text-xs text-green-500 font-medium">Handle is available!</p>}
      {status === 'too-short' && <p className="text-xs text-muted-foreground">Usernames must be at least 3 characters long.</p>}
    </div>
  );
}
'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function PaymentSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full py-5 bg-primary hover:bg-primary/90 text-primary-foreground font-sans text-xs font-bold tracking-wider uppercase rounded-xl transition shadow-md shadow-primary/10 flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Initializing secure payment...</span>
        </>
      ) : (
        <span>Pay Now & Start Your Journey</span>
      )}
    </Button>
  );
}
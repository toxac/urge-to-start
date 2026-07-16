// hooks/useKipActions.ts
import { useState } from 'react';
import { executeSidebarConductorAction} from '@/actions/ai';
import type { ActionParams } from '@/types/ai-schema';

export function useKipActions() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (params: ActionParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await executeSidebarConductorAction(params);
      if (result.success) {
        return result;
      } else {
        setError(result.error || 'An unknown error occurred.');
        return result;
      }
    } catch (err: any) {
      setError(err.message || 'Network error.');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading, error };
}
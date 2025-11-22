import { useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { checkFarcasterProStatus } from '@/lib/neynar-client';

export function useProStatus() {
  const account = useActiveAccount();
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!account?.address) {
      setIsPro(null);
      return;
    }

    const checkStatus = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const proStatus = await checkFarcasterProStatus(account.address);
        setIsPro(proStatus);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check Pro status');
        setIsPro(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [account?.address]);

  return { isPro, isLoading, error };
}

import { useQuery } from '@tanstack/react-query';

export function useContractStats() {
  const { data: stats } = useQuery({
    queryKey: ['contract-stats'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/contract/stats');
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        return {
          minted: data?.minted || 0,
          total: data?.total || 10000,
          price: data?.price || 0,
        };
      } catch (error) {
        return { minted: 0, total: 10000, price: 0 };
      }
    },
    refetchInterval: 15000,
    retry: false,
  });

  return {
    minted: stats?.minted || 0,
    total: stats?.total || 10000,
    price: stats?.price || 0,
  };
}

import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { StockTransaction } from '@/types';

export const useTransactions = (outletId: string | null, maxResults = 50) => {
  return useQuery({
    queryKey: ['transactions', outletId, maxResults],
    queryFn: async () => {
      if (!outletId) return [];
      const q = query(
        collection(db, 'stock_transactions'),
        where('outletId', '==', outletId),
        orderBy('timestamp', 'desc'),
        limit(maxResults)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StockTransaction[];
    },
    enabled: !!outletId
  });
};

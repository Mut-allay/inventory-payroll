import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/AuthContext';
import { stockService } from '@/lib/firebase/services/stockService';
import { OutletStock, StockTransaction } from '@/types';

export const useOutletStock = () => {
  const { userData } = useAuth();

  return useQuery({
    queryKey: ['outletStock', userData?.outletId],
    queryFn: async () => {
      if (!userData?.outletId) return [];
      const q = query(
        collection(db, 'outlet_stock'),
        where('outletId', '==', userData.outletId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as OutletStock));
    },
    enabled: !!userData?.outletId,
  });
};

export const useStockTransactions = () => {
  const { userData } = useAuth();

  return useQuery({
    queryKey: ['transactions', userData?.outletId],
    queryFn: async () => {
      if (!userData?.outletId) return [];
      const q = query(
        collection(db, 'stock_transactions'),
        where('outletId', '==', userData.outletId),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as StockTransaction));
    },
    enabled: !!userData?.outletId,
  });
};

export const useRecordTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: stockService.recordTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outletStock'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

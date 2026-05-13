import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stockService, StockTransactionInput } from '@/lib/firebase/services/stockService';

export const useRecordStockTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StockTransactionInput) => stockService.recordTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outletStock'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

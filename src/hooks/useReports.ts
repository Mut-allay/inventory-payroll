import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/lib/firebase/services/reportService';
import { useAuth } from '@/contexts/AuthContext';

export const useStockMovementReport = (startDate: Date, endDate: Date) => {
  const { userData } = useAuth();
  
  return useQuery({
    queryKey: ['report', 'stock-movement', userData?.outletId, startDate, endDate],
    queryFn: () => {
      if (!userData?.outletId) return [];
      return reportService.getStockMovementReport(userData.outletId, startDate, endDate);
    },
    enabled: !!userData?.outletId && !!startDate && !!endDate,
  });
};

export const useClosingStockReport = () => {
  const { userData } = useAuth();

  return useQuery({
    queryKey: ['report', 'closing-stock', userData?.outletId],
    queryFn: () => {
      if (!userData?.outletId) return [];
      return reportService.getClosingStockReport(userData.outletId);
    },
    enabled: !!userData?.outletId,
  });
};

export const usePayrollSummaryReport = (month: string) => {
  const { userData } = useAuth();

  return useQuery({
    queryKey: ['report', 'payroll-summary', userData?.outletId, month],
    queryFn: () => {
      if (!userData?.outletId) return null;
      return reportService.getPayrollSummaryReport(userData.outletId, month);
    },
    enabled: !!userData?.outletId && !!month,
  });
};

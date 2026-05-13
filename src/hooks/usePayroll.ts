import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { payrollService } from '@/lib/firebase/services/payrollService';
import { useAuth } from '@/contexts/AuthContext';

export const usePayrollByOutlet = (month?: string) => {
  const { userData } = useAuth();

  return useQuery({
    queryKey: ['payroll', userData?.outletId, month],
    queryFn: () => payrollService.getPayrollByOutlet(userData!.outletId!, month),
    enabled: !!userData?.outletId,
  });
};

export const useGenerateMonthlyPayroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ outletId, month }: { outletId: string; month: string }) =>
      payrollService.generateMonthlyPayroll(outletId, month),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
    },
  });
};

export const useProcessPayroll = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (recordId: string) => {
      if (!user) throw new Error('Not authenticated');
      return payrollService.markAsPaid(recordId, user.uid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
    },
  });
};

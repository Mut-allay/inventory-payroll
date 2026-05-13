import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/lib/firebase/services/employeeService';
import { useAuth } from '@/contexts/AuthContext';

export const useEmployeesByOutlet = () => {
  const { userData } = useAuth();

  return useQuery({
    queryKey: ['employees', userData?.outletId],
    queryFn: () => employeeService.getEmployeesByOutlet(userData!.outletId!),
    enabled: !!userData?.outletId,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeService.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

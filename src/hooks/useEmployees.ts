import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService, Employee } from '@/lib/firebase/services/employeeService';
import { useAuth } from '@/contexts/AuthContext';

export const useEmployeesByOutlet = () => {
  const { userData } = useAuth();

  return useQuery({
    queryKey: ['employees', userData?.outletId],
    queryFn: () => employeeService.getEmployeesByOutlet(userData!.outletId!),
    enabled: !!userData?.outletId,
  });
};

export const useAllEmployees = () => {
  return useQuery({
    queryKey: ['employees', 'all'],
    queryFn: employeeService.getAllEmployees,
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

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Employee> }) => 
      employeeService.updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeeService.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

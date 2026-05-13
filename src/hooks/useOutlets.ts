import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { outletService } from '@/lib/firebase/services/outletService';
import { useAuth } from '@/contexts/AuthContext';

export const useOutlets = () => {
  const { userData } = useAuth();

  return useQuery({
    queryKey: ['outlets'],
    queryFn: outletService.getAllOutlets,
    enabled: userData?.role === 'admin', // Only admins see all outlets
  });
};

export const useCreateOutlet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: outletService.createOutlet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outlets'] });
    },
  });
};

export const useDeleteOutlet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => outletService.deleteOutlet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outlets'] });
    },
  });
};

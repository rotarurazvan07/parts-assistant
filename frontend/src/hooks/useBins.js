import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BinsService from '../services/binsService';

// Hook for fetching bins
export const useBins = () => {
  return useQuery({
    queryKey: ['bins'],
    queryFn: () => BinsService.getBins()
  });
};

// Hook for fetching a single bin
export const useBin = (id) => {
  return useQuery({
    queryKey: ['bin', id],
    queryFn: () => BinsService.getBin(id),
    enabled: !!id
  });
};

// Hook for creating a new bin
export const useCreateBin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: BinsService.createBin,
    onSuccess: () => {
      queryClient.invalidateQueries('bins');
    }
  });
};

// Hook for updating a bin
export const useUpdateBin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => BinsService.updateBin(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries('bins');
    }
  });
};

// Hook for deleting a bin
export const useDeleteBin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: BinsService.deleteBin,
    onSuccess: () => {
      queryClient.invalidateQueries('bins');
    }
  });
};
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PartsService from '../services/partsService';

// Hook for fetching parts with pagination
export const useParts = (params) => {
  return useQuery({
    queryKey: ['parts', params],
    queryFn: () => PartsService.getParts(params),
    keepPreviousData: true
  });
};

// Hook for fetching a single part
export const usePart = (id) => {
  return useQuery({
    queryKey: ['part', id],
    queryFn: () => PartsService.getPart(id),
    enabled: !!id
  });
};

// Hook for creating a new part
export const useCreatePart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: PartsService.createPart,
    onSuccess: () => {
      queryClient.invalidateQueries('parts');
    }
  });
};

// Hook for updating a part
export const useUpdatePart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => PartsService.updatePart(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries('parts');
      queryClient.invalidateQueries(['part', variables.id]);
    }
  });
};

// Hook for deleting a part
export const useDeletePart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: PartsService.deletePart,
    onSuccess: () => {
      queryClient.invalidateQueries('parts');
    }
  });
};
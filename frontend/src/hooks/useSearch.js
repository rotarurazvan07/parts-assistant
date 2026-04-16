import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SearchService from '../services/searchService';

// Hook for searching parts
export const useSearch = (params) => {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => SearchService.searchParts(params),
    enabled: !!params?.query
  });
};
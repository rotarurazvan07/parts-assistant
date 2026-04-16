import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CategoriesService from '../services/categoriesService';

// Hook for fetching categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoriesService.getCategories()
  });
};

// Hook for fetching a single category
export const useCategory = (id) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => CategoriesService.getCategory(id),
    enabled: !!id
  });
};

// Hook for creating a new category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: CategoriesService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries('categories');
    }
  });
};

// Hook for updating a category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => CategoriesService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries('categories');
    }
  });
};

// Hook for deleting a category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: CategoriesService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries('categories');
    }
  });
};
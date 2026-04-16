import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AIService from '../services/aiService';

// Hook for sending AI chat messages
export const useAIChat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: AIService.sendAIRequest,
    onSuccess: (data, variables) => {
      // Invalidate and refetch AI chat history if needed
      queryClient.invalidateQueries('aiChat');
    }
  });
};

// Hook for fetching AI chat history
export const useAIChatHistory = () => {
  return useQuery({
    queryKey: ['aiChatHistory'],
    queryFn: () => Promise.resolve([]), // Placeholder for AI chat history
    enabled: false // Disable automatic fetching
  });
};
import React, { createContext, useContext, useState } from 'react';

const AIContext = createContext();

export function AIContextProvider({ children }) {
  const [contextParts, setContextParts] = useState([]);

  const addContextPart = (part) => {
    setContextParts(prev => [...prev, part]);
  };

  const removeContextPart = (partId) => {
    setContextParts(prev => prev.filter(part => part.id !== partId));
  };

  const clearContextParts = () => {
    setContextParts([]);
  };

  const sendMessage = async (message, contextParts) => {
    // In a real implementation, this would call the AI service
    // For now, we'll return a mock response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now(),
          role: 'assistant',
          content: `I understand you're asking about "${message}". Based on your inventory, I can help you with that. What specific information do you need?`,
          timestamp: new Date()
        });
      }, 1000);
    });
  };

  return (
    <AIContext.Provider value={{
      contextParts,
      addContextPart,
      removeContextPart,
      clearContextParts,
      sendMessage
    }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAIContext() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAIContext must be used within an AIContextProvider');
  }
  return context;
}
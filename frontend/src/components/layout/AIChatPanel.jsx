import React from 'react';
import { useAppContext } from '@context/AppContext';

const AIChatPanel = ({ children }) => {
  const { sidebarCollapsed } = useAppContext();
  
  return (
    <div className={`flex ${sidebarCollapsed ? 'w-16' : 'w-96'} bg-panel border-l border-border h-full flex-col`">
      <div className="p-4 flex-1">
        {sidebarCollapsed ? (
          <div className="w-16 flex flex-col items-center">
            <div className="text-ai-accent">AI</div>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-heading font-bold mb-4 text-ai-accent">AI Assistant</h2>
            <div className="h-full flex flex-col">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChatPanel;
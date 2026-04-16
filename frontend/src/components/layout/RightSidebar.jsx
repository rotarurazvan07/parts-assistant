import React from 'react';
import { useAppContext } from '@context/AppContext';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import AIChatInterface from './AIChatInterface';

const RightSidebar = () => {
  const { rightSidebarCollapsed, setRightSidebarCollapsed } = useAppContext();

  return (
    <div className={`hidden lg:flex flex-col border-l border-border transition-all duration-300 ${rightSidebarCollapsed ? 'w-12' : 'w-96'}`}>
      {/* Toggle Button */}
      <div className="p-2 border-b border-border flex justify-end">
        <Button
          onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
          size="sm"
          variant="ghost"
          className="p-1"
        >
          <Icon 
            name={rightSidebarCollapsed ? "chevron-left" : "chevron-right"} 
            size="sm" 
          />
        </Button>
      </div>

      {/* Content - Hide when collapsed */}
      {!rightSidebarCollapsed && (
        <div className="flex-1 overflow-hidden">
          <AIChatInterface />
        </div>
      )}
    </div>
  );
};

export default RightSidebar;

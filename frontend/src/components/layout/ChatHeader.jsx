import React from 'react';
import Icon from '../ui/Icon';

const ChatHeader = () => {
  return (
    <div className="flex items-center justify-between mb-4 p-2 border-b border-border">
      <h2 className="text-lg font-heading font-bold text-ai-accent">The Brain</h2>
      <div className="flex items-center">
        <Icon name="ai" size="md" className="mr-2" />
        <div className="w-2 h-2 bg-ai-accent rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default ChatHeader;
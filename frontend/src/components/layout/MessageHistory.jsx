import React from 'react';

const MessageHistory = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto mb-4" role="log" aria-live="polite">
      {messages && messages.map((message, index) => (
        <div 
          key={index} 
          className={`p-2 mb-2 rounded ${message.role === 'user' ? 'bg-panel border-l-4 border-primary pl-4' : 'bg-panel border-l-4 border-ai-accent pl-4'}`}
          role="listitem"
        >
          <div className="font-bold mb-1" aria-label={`${message.role === 'user' ? 'You' : 'AI Assistant'} said`}>
            {message.role === 'user' ? 'You' : 'AI Assistant'}
          </div>
          <div className="text-sm whitespace-pre-wrap">
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageHistory;
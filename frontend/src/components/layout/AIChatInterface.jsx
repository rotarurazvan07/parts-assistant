import React, { useState, useEffect } from 'react';
import { useAIContext } from '@context/AIContext';

const AIChatInterface = () => {
  const [inputValue, setInputValue] = useState('');
  const [contextParts, setContextParts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  
  // Get AI context from context
  const { contextParts: aiContextParts, sendMessage } = useAIContext();
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Add user message to chat
      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: inputValue,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Set typing indicator
      setIsTyping(true);
      
      // Simulate AI response (in a real implementation, this would call the AI service)
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: `I understand you're asking about "${inputValue}". Based on your inventory, I can help you with that. What specific information do you need?`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1500);
      
      setInputValue('');
    }
  };
  
  // Handle quick question click
  const handleQuickQuestion = (question) => {
    setInputValue(question);
  };
  
  // Handle remove context part
  const handleRemoveContextPart = (partId) => {
    setContextParts(prev => prev.filter(part => part.id !== partId));
  };
  
  // Handle clear all context
  const handleClearContext = () => {
    setContextParts([]);
  };
  
  return (
    <div className="flex h-full flex-col bg-panel border-l border-border">
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-bold text-ai-accent">The Brain</h2>
          {isTyping && (
            <div className="flex items-center">
              <div className="animate-pulse text-ai-accent mr-2">●</div>
              <span className="text-sm">Thinking...</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Context Display */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading font-bold">Context Parts:</h3>
          {contextParts.length > 0 && (
            <button 
              onClick={handleClearContext}
              className="text-sm text-destructive hover:text-destructive"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {contextParts.length > 0 ? (
            contextParts.map(part => (
              <div 
                key={part.id} 
                className="bg-background border border-border rounded px-2 py-1 text-sm flex items-center"
              >
                <span>{part.name}</span>
                <button 
                  onClick={() => handleRemoveContextPart(part.id)}
                  className="ml-1 text-text-muted hover:text-text-primary"
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <span className="text-text-muted text-sm">No parts selected for context</span>
          )}
        </div>
      </div>
      
      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`p-3 rounded border ${
                  message.role === 'user' 
                    ? 'bg-background border-border ml-4' 
                    : 'bg-panel border-border'
                }`}
              >
                <div className="font-bold mb-1">
                  {message.role === 'user' ? 'You' : 'AI Assistant'}
                  {message.timestamp && (
                    <span className="text-text-muted text-xs ml-2">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <div className="text-sm whitespace-pre-wrap">
                  {message.content}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-text-muted py-8">
              <p>Ask a question to get started with the AI assistant</p>
            </div>
          )}
          
          {isTyping && (
            <div className="p-3 rounded border bg-panel border-border">
              <div className="font-bold mb-1">AI Assistant</div>
              <div className="flex items-center">
                <div className="animate-pulse flex space-x-1">
                  <div className="w-2 h-2 bg-ai-accent rounded-full"></div>
                  <div className="w-2 h-2 bg-ai-accent rounded-full"></div>
                  <div className="w-2 h-2 bg-ai-accent rounded-full"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex mb-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="input-field flex-1 mr-2"
            placeholder="Ask a question about your inventory..."
          />
          <button 
            type="submit" 
            className="btn-primary px-4 py-2"
            disabled={!inputValue.trim() || isTyping}
          >
            Send
          </button>
        </div>
        
        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-2">
          <button 
            type="button" 
            className="text-xs bg-panel border border-border rounded px-2 py-1 hover:bg-hover"
            onClick={() => handleQuickQuestion("What can I build with my current inventory?")}
          >
            What can I build with my current inventory?
          </button>
          <button 
            type="button" 
            className="text-xs bg-panel border border-border rounded px-2 py-1 hover:bg-hover"
            onClick={() => handleQuickQuestion("Do I have the parts for an Arduino weather station?")}
          >
            Do I have the parts for an Arduino weather station?
          </button>
          <button 
            type="button" 
            className="text-xs bg-panel border border-border rounded px-2 py-1 hover:bg-hover"
            onClick={() => handleQuickQuestion("Suggest projects using resistors and capacitors")}
          >
            Suggest projects using resistors and capacitors
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChatInterface;
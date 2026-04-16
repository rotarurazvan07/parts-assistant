import React, { useState } from 'react';
import Button from '../ui/Button';
import Icon from '../ui/Icon';

const ChatInput = ({ onSendMessage, onSuggestionClick }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const suggestions = [
    "What can I build with my current inventory?",
    "Do I have the parts for an Arduino weather station?",
    "Where did I put the NRF24 modules?",
    "What speed are the I2C lines on the ESP32C6?"
  ];

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a question about your inventory..."
          className="input-field flex-1 mr-2"
        />
        <Button type="submit">
          <Icon name="send" size="sm" />
        </Button>
      </form>
      
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="text-xs bg-panel border border-border rounded px-2 py-1 hover:bg-hover"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatInput;
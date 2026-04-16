import React from 'react';
import Button from '../ui/Button';

const ContextDisplay = ({ contextParts, onRemoveContext, onClearAll }) => {
  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2" role="list">
        {contextParts && contextParts.map(part => (
          <div 
            key={part.id} 
            className="bg-panel border border-border rounded px-3 py-1 text-sm flex items-center"
          >
            <span className="mr-2">{part.name}</span>
            <button 
              className="text-destructive hover:text-destructive"
              onClick={() => onRemoveContext(part.id)}
              aria-label={`Remove ${part.name} from context`}
            >
              &times;
            </button>
          </div>
        ))}
        {contextParts && contextParts.length > 0 && (
          <Button onClick={onClearAll} variant="secondary" size="sm" aria-label="Clear all context">
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContextDisplay;
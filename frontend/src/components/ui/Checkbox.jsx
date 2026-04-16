import React from 'react';

const Checkbox = ({ 
  label, 
  id, 
  checked, 
  onChange, 
  className = '',
  ...props 
}) => {
  // Generate a unique ID if not provided
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="flex items-center mb-4">
      <input
        id={checkboxId}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={`h-4 w-4 rounded ${className}`}
        {...props}
      />
      {label && (
        <label htmlFor={checkboxId} className="ml-2 text-sm text-text-primary">
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
import React from 'react';

const TextArea = ({ 
  label, 
  id, 
  value, 
  onChange, 
  placeholder,
  required = false,
  error = null,
  className = '',
  rows = 4,
  ...props 
}) => {
  // Generate a unique ID if not provided
  const fieldId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={fieldId} className="block text-sm font-medium text-text-primary mb-1">
          {label}
        </label>
      )}
      <textarea
        id={fieldId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={`input-field w-full ${className} ${error ? 'border-destructive' : ''}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default TextArea;
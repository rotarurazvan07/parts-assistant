import React from 'react';

const InputField = ({ 
  label, 
  id, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  error = null,
  className = '',
  ...props 
}) => {
  // Generate a unique ID if not provided
  const fieldId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={fieldId} className="block text-sm font-medium text-text-primary mb-1">
          {label}
        </label>
      )}
      <input
        id={fieldId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
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

export default InputField;
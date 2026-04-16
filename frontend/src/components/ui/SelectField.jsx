import React from 'react';

const SelectField = ({ 
  label, 
  id, 
  value, 
  onChange, 
  options = [],
  placeholder,
  required = false,
  error = null,
  className = '',
  ...props 
}) => {
  // Generate a unique ID if not provided
  const fieldId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={fieldId} className="block text-sm font-medium text-text-primary mb-1">
          {label}
        </label>
      )}
      <select
        id={fieldId}
        value={value}
        onChange={onChange}
        className={`input-field w-full ${className} ${error ? 'border-destructive' : ''}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default SelectField;
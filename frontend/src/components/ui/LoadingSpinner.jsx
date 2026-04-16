import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  const spinnerClasses = `${sizeClasses[size]} animate-spin rounded-full border-2 border-solid border-primary border-t-transparent ${className}`;
  
  return (
    <div className="flex items-center justify-center">
      <div className={spinnerClasses}></div>
    </div>
  );
};

export default LoadingSpinner;
import React from 'react';

const Icon = ({ name, size = 'md', className = '', ...props }) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  // Simple icon implementation using Unicode symbols
  const icons = {
    add: '➕',
    edit: '✏️',
    delete: '🗑️',
    search: '🔍',
    settings: '⚙️',
    import: '📥',
    export: '📤',
    close: '❌',
    check: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️',
    ai: '🤖',
    parts: '🔧',
    categories: '📂',
    bins: '📦',
    'chevron-left': '◀',
    'chevron-right': '▶',
    'chevron-down': '▼'
  };

  const iconClasses = `inline-block ${sizeClasses[size]} ${className}`;

  return (
    <span className={iconClasses} {...props}>
      {icons[name] || '❓'}
    </span>
  );
};

export default Icon;
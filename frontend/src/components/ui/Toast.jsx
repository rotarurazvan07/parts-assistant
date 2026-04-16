import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  const typeClasses = {
    info: 'bg-panel border border-border text-text-primary',
    success: 'bg-panel border border-border text-text-primary',
    error: 'bg-destructive text-background',
    warning: 'bg-primary text-background'
  };

  const toastClasses = `fixed top-4 right-4 z-50 p-4 rounded-sm ${typeClasses[type]}`;

  return (
    <div className={toastClasses}>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default Toast;
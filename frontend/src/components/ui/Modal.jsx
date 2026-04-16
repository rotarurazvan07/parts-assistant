import React from 'react';

const Modal = ({ 
  children, 
  title, 
  isOpen, 
  onClose, 
  size = 'md',
  ...props 
}) => {
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl'
  };
  
  const modalClasses = `relative bg-panel border border-border rounded-sm p-6 ${sizeClasses[size]}`;
  
  // Handle escape key press
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  
  // Add focus trap for accessibility
  React.useEffect(() => {
    const handleDocumentKeyDown = (e) => handleKeyDown(e);
    document.addEventListener('keydown', handleDocumentKeyDown);
    return () => document.removeEventListener('keydown', handleDocumentKeyDown);
  }, []);
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" 
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={modalClasses} {...props}>
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 id="modal-title" className="text-lg font-heading font-bold">{title}</h2>
            <button 
              onClick={onClose}
              className="text-text-muted hover:text-text-primary"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
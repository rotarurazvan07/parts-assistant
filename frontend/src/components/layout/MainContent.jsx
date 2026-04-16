import React from 'react';

const MainContent = ({ children }) => {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 p-4">
        <div className="bg-panel border border-border rounded p-4 h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
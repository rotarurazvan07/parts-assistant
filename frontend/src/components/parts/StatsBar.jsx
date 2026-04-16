import React from 'react';

const StatsBar = ({ totalParts, inContextParts }) => {
  return (
    <div className="flex items-center justify-between mb-4 p-2 bg-panel border border-border rounded">
      <div className="text-sm">
        Total Parts: <span className="font-bold">{totalParts}</span>
      </div>
      <div className="text-sm">
        In Context: <span className="font-bold">{inContextParts}</span>
      </div>
    </div>
  );
};

export default StatsBar;